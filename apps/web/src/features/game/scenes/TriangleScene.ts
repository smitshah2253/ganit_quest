import Phaser, { Scene, GameObjects } from 'phaser';
import { EventBus } from '../engine/EventBus';
import { getLevelSpec } from '@/data/levelSpecs';
import type { LevelSpecification } from '@/data/levelSpecs';
import { soundManager } from '../engine/SoundManager';

const FONT = 'Inter, system-ui, -apple-system, sans-serif';

// ─── Light theme palette ────────────────────────────────────────────
const BG       = 0xecf2f7;
const DOT      = 0xcbd5e1;
const C_BLUE   = { fill: 0xdbeafe, stroke: 0x3b82f6, text: '#1e40af' };
const C_VIOLET = { fill: 0xede9fe, stroke: 0x8b5cf6, text: '#5b21b6' };
const C_AMBER  = { fill: 0xfef3c7, stroke: 0xf59e0b, text: '#92400e' };
const C_GREEN  = { fill: 0xd1fae5, stroke: 0x10b981, text: '#065f46' };
const C_RED    = { fill: 0xfee2e2, stroke: 0xef4444, text: '#991b1b' };
const WHITE    = 0xffffff;

export class TriangleScene extends Scene {
    private levelSpec: LevelSpecification | null = null;
    private isLevelActive = false;

    private bgGfx!: GameObjects.Graphics;
    private main!: GameObjects.Graphics;
    private glow!: GameObjects.Graphics;
    private overlay!: GameObjects.Graphics;

    private dragHandle!: GameObjects.Arc;
    private dragHitZone!: GameObjects.Arc;

    private apexOffsetY = 0;
    private bptRatio    = 0.5;
    private currentVal  = 0;
    private lastSnap    = -1;

    private labels: Record<string, GameObjects.Text> = {};

    constructor() { super('TriangleScene'); }

    // ─────────────────────────────────────────────────────────────────
    create() {
        this.cameras.main.setBackgroundColor('#ecf2f7');

        this.bgGfx   = this.add.graphics();
        this.main    = this.add.graphics();
        this.glow    = this.add.graphics();
        this.overlay = this.add.graphics().setAlpha(0);

        // Drag handle
        this.dragHandle = this.add.circle(0, 0, 11, 0x06b6d4, 1)
            .setStrokeStyle(3, 0xffffff).setInteractive({ useHandCursor: true })
            .setVisible(false).setDepth(12);

        this.dragHitZone = this.add.circle(0, 0, 40, 0, 0)
            .setInteractive().setDepth(13).setVisible(false);
        this.input.setDraggable(this.dragHitZone);

        this.dragHitZone.on('pointerover', () => {
            if (this.dragHandle.visible) {
                (this.dragHandle as any).setScale(1.4);
                (this.dragHandle as any).setStrokeStyle(4, 0xffeb3b);
            }
        });
        this.dragHitZone.on('pointerout', () => {
            if (this.dragHandle.visible) {
                (this.dragHandle as any).setScale(1);
                (this.dragHandle as any).setStrokeStyle(3, 0xffffff);
            }
        });
        this.dragHitZone.on('dragstart', () => {
            if ('vibrate' in navigator) try { navigator.vibrate(10); } catch { /* noop */ }
        });
        this.input.on('drag', (_p: any, _g: any, dx: number, dy: number) => this.onDrag(dx, dy));

        // Events
        const onLoad = (data: any) => {
            if (!this.scene?.systems) return;
            if (!data.id.startsWith('lvl-tri-')) {
                this.isLevelActive = false;
                this.scene.start('LevelScene');
                return;
            }
            this.levelSpec = getLevelSpec(data.id, data);
            this.isLevelActive = true;
            this.apexOffsetY = 0;
            this.bptRatio = 0.5;
            this.currentVal = 0;
            this.lastSnap = -1;
            this.resetLabels();
            this.updateDragVisibility();
            this.redraw();
            this.cameras.main.zoomTo(1.08, 400, 'Power2');
            this.time.delayedCall(400, () => this.cameras.main.zoomTo(1, 320, 'Power2'));
        };

        const onUserInput = (d: { value: string; levelId: string }) => {
            if (!this.isLevelActive || !this.levelSpec) return;
            if (d.levelId !== this.levelSpec.id) return;
            const v = parseFloat(d.value);
            if (!isNaN(v)) { this.currentVal = v; this.syncToVisual(v); }
        };

        const onBoardInput = (d: { inputs: string[]; levelId: string }) => {
            if (!this.isLevelActive || !this.levelSpec) return;
            if (d.levelId !== this.levelSpec.id) return;
            if (d.inputs[0] !== undefined) onUserInput({ value: d.inputs[0], levelId: d.levelId });
        };

        const onCorrect = () => { this.flashOverlay(0x10b981); this.celebrate(); };
        const onWrong   = () => this.flashOverlay(0xef4444);

        EventBus.on('load-level', onLoad);
        EventBus.on('user-input-changed', onUserInput);
        EventBus.on('board-exam-input-changed', onBoardInput);
        EventBus.on('answer-correct', onCorrect);
        EventBus.on('answer-wrong', onWrong);

        const cleanup = () => {
            EventBus.off('load-level', onLoad);
            EventBus.off('user-input-changed', onUserInput);
            EventBus.off('board-exam-input-changed', onBoardInput);
            EventBus.off('answer-correct', onCorrect);
            EventBus.off('answer-wrong', onWrong);
            this.scale.off('resize', onResize);
        };
        this.events.once('shutdown', cleanup);
        this.events.once('destroy', cleanup);

        const onResize = (gs: Phaser.Structs.Size) => {
            if (!this.cameras?.main) return;
            this.cameras.main.setSize(gs.width, gs.height);
            if (this.isLevelActive) this.redraw();
        };
        this.scale.on('resize', onResize);
        EventBus.emit('game-ready');
    }

    update() { if (this.isLevelActive) this.redraw(); }

    // ─────────────────────────────────────────────────────────────────
    // DRAG
    // ─────────────────────────────────────────────────────────────────
    private onDrag(_dragX: number, dragY: number) {
        if (!this.isLevelActive || !this.levelSpec) return;
        const world = this.worldNum();

        if (world === 1) {
            const { cy, triH, triW } = this.layout();
            const newApexY = Phaser.Math.Clamp(dragY, cy - triH * 1.8, cy - triH * 0.3);
            this.apexOffsetY = newApexY - (cy - triH);
            const h = Math.abs(newApexY - (cy + triH * 0.5));
            const perim = Math.round(triW + 2 * Math.sqrt((triW / 2) ** 2 + h ** 2));
            if (this.levelSpec.id === 'lvl-tri-01' && Math.abs(perim - 12) < 2 && this.lastSnap !== 12) {
                this.lastSnap = 12;
                soundManager.playSnap();
                this.tweens.add({ targets: this.dragHandle, scaleX: 1.5, scaleY: 1.5, duration: 80, yoyo: true });
            }
            EventBus.emit('user-input-changed', { value: String(perim), levelId: this.levelSpec.id });

        } else if (world === 3) {
            const { cy, triH } = this.layout();
            const topY = cy - triH * 0.9 + 20, botY = cy + triH * 0.5 - 20;
            const newY = Phaser.Math.Clamp(dragY, topY, botY);
            this.bptRatio = (newY - (cy - triH * 0.9)) / ((cy + triH * 0.5) - (cy - triH * 0.9));
            const id = this.levelSpec.id;
            let emitVal = 0;
            if (id === 'lvl-tri-13') emitVal = this.bptRatio * 10;
            else if (id === 'lvl-tri-14') emitVal = this.bptRatio * 20;
            else if (id === 'lvl-tri-15') emitVal = this.bptRatio * 25;
            else if (id === 'lvl-tri-16') emitVal = this.bptRatio * 12;
            else if (id === 'lvl-tri-17') emitVal = this.bptRatio * 1.0;
            else if (id === 'lvl-tri-18') emitVal = this.bptRatio * 28;
            else emitVal = this.bptRatio * Math.max(1, this.levelSpec.correctAnswer);
            if (id === 'lvl-tri-16' && Math.abs(this.bptRatio - 0.625) < 0.05) {
                if (this.lastSnap !== 1) { this.lastSnap = 1; soundManager.playSnap(); }
                this.bptRatio = 0.625; emitVal = 7.5;
            }
            EventBus.emit('user-input-changed', { value: emitVal.toFixed(1), levelId: this.levelSpec.id });

        } else if (world === 2 || world === 4) {
            const W = this.cameras.main.width;
            const pct = Phaser.Math.Clamp((_dragX - W * 0.3) / (W * 0.4), 0, 1);
            const k = 0.5 + pct * 3.5;
            EventBus.emit('user-input-changed', { value: String(k * 10), levelId: this.levelSpec!.id });
        }
    }

    private syncToVisual(v: number) {
        if (!this.levelSpec) return;
        const w = this.worldNum(), id = this.levelSpec.id;
        if (w === 3) {
            if (id === 'lvl-tri-13') this.bptRatio = Phaser.Math.Clamp(v / 10, 0.15, 0.85);
            else if (id === 'lvl-tri-14') this.bptRatio = Phaser.Math.Clamp(v / 20, 0.15, 0.85);
            else if (id === 'lvl-tri-15') this.bptRatio = Phaser.Math.Clamp(v / 25, 0.15, 0.85);
            else if (id === 'lvl-tri-16') this.bptRatio = Phaser.Math.Clamp(v / 12, 0.15, 0.85);
            else if (id === 'lvl-tri-17') this.bptRatio = Phaser.Math.Clamp(v * 1.0, 0.15, 0.85);
            else if (id === 'lvl-tri-18') this.bptRatio = Phaser.Math.Clamp(v / 28, 0.15, 0.85);
            else this.bptRatio = Phaser.Math.Clamp(v / Math.max(1, this.levelSpec.correctAnswer), 0.15, 0.85);
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // MAIN DRAW
    // ─────────────────────────────────────────────────────────────────
    private redraw() {
        this.bgGfx.clear(); this.main.clear(); this.glow.clear();
        if (!this.levelSpec) return;

        const W = this.cameras.main.width, H = this.cameras.main.height;

        // Dot-grid background
        this.bgGfx.fillStyle(BG, 1);
        this.bgGfx.fillRect(0, 0, W, H);
        this.bgGfx.fillStyle(DOT, 0.45);
        for (let x = 20; x < W; x += 26) for (let y = 20; y < H; y += 26)
            this.bgGfx.fillCircle(x, y, 1.1);

        // Header bar
        this.bgGfx.fillStyle(WHITE, 0.9);
        this.bgGfx.fillRect(0, 0, W, 34);
        this.bgGfx.lineStyle(1, DOT, 1);
        this.bgGfx.lineBetween(0, 34, W, 34);

        // Footer formula bar
        this.bgGfx.fillStyle(WHITE, 0.85);
        this.bgGfx.fillRect(0, H - 32, W, 32);
        this.bgGfx.lineStyle(1, DOT, 1);
        this.bgGfx.lineBetween(0, H - 32, W, H - 32);

        const lNum = parseInt(this.levelSpec.id.replace('lvl-tri-', ''), 10);
        const wNum = this.worldNum();
        const wNames = ['','Triangle Foundations','Similar Triangles','BPT (Thales)','Areas & Scale','Pythagoras'];
        this.lbl('hdr_l', `Ch 6 · W${wNum}: ${wNames[wNum]}`, 12, 17, '#3b82f6', '10px', 0, 0.5);
        this.lbl('hdr_r', `Level ${lNum}`, W - 12, 17, '#6b7280', '10px', 1, 0.5);
        this.lbl('footer', `📐  ${this.levelSpec.formulaDisplay ?? ''}`, W / 2, H - 16, '#374151', '10px', 0.5, 0.5);

        const world = this.worldNum();
        switch (world) {
            case 1: this.drawW1(); break;
            case 2: this.drawW2(); break;
            case 3: this.drawW3(); break;
            case 4: this.drawW4(); break;
            case 5: this.drawW5(); break;
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // WORLD 1 — Triangle Foundations
    // ─────────────────────────────────────────────────────────────────
    private drawW1() {
        const id = this.levelSpec!.id;
        const { cx, cy, triW, triH, W, H } = this.layout();

        let a = 3, b = 4, c = 5, isRight = true;
        if (id === 'lvl-tri-02') { a = 3; b = 4; c = 5; }
        if (id === 'lvl-tri-03') { a = 5; b = 12; c = 13; }
        if (id === 'lvl-tri-04') { a = 6; b = 8; c = 0; }
        if (id === 'lvl-tri-05') { a = 6; b = 8; c = 10; isRight = false; }
        if (id === 'lvl-tri-06') { a = 6; b = 8; c = 10; }

        const scale = triW / (a + b + 2);
        const Bx = cx - a * scale, By = cy + b * scale * 0.5;
        const Cx = cx + a * scale, Cy = By;
        const Ax = Cx, Ay = Cy - b * scale;

        // ── Two-triangle frame (lvl-tri-05) ──────────────────────
        if (id === 'lvl-tri-05') {
            this.drawTri(Bx, By, Cx, Cy, Ax, Ay, C_BLUE);
            this.drawTri(Bx, By, Cx, Cy, Bx, Ay, C_VIOLET);
            this.lbl('B', Bx - 22, By + 12, C_BLUE.text, '13px');
            this.lbl('C', Cx + 10, Cy + 12, C_BLUE.text, '13px');
            this.lbl('A', Ax + 10, Ay - 6, C_BLUE.text, '13px');
            this.lbl("A'", Bx - 28, Ay - 6, C_VIOLET.text, '13px');
            this.lbl('6', (Bx + Cx) / 2, Cy + 18, '#374151', '12px');
            this.lbl('8r', Cx + 14, (Cy + Ay) / 2, '#374151', '12px');
            this.lbl('8l', Bx - 28, (By + Ay) / 2, '#374151', '12px');
            // Working panel
            this.drawPanel(cx, H * 0.83, Math.min(300, W - 24), 38,
                `P₁ = 6+8+10 = 24   |   P₂ = 6+8+10 = 24`, '#374151', '10px',
                `Total = 24 + 24 = ${this.currentVal > 0 ? this.currentVal : '?'}`, this.currentVal > 0 ? '#059669' : '#92400e', '12px');
            return;
        }

        // ── Dynamic triangle for lvl-tri-04 ──────────────────────
        if (id === 'lvl-tri-04' && this.currentVal > 0) {
            c = this.currentVal;
            const valid = a + b > c && a + c > b && b + c > a;
            if (!valid) {
                this.main.lineStyle(3, 0xef4444, 1);
                this.main.lineBetween(cx - 100, cy, cx + 100, cy);
                this.lbl('collapse', '⚠️ Triangle collapses! (inequality failed)', cx, cy - 18, C_RED.text, '12px', 0.5, 0.5);
                return;
            }
            const aA = Math.acos((b * b + c * c - a * a) / (2 * b * c));
            const nAy = cy - Math.sin(aA) * b * scale;
            const nAx = cx - c * scale * 0.5 + Math.cos(aA) * b * scale;
            const nBx = cx - c * scale * 0.5, nBy = cy;
            const nCx = cx + c * scale * 0.5, nCy = cy;
            this.drawTri(nBx, nBy, nCx, nCy, nAx, nAy, C_BLUE);
            this.lbl('la4', `a = ${a}`, (nBx + nCx) / 2, nBy + 18, C_BLUE.text, '12px');
            this.lbl('lb4', `b = ${b}`, nCx + 12, (nCy + nAy) / 2, C_BLUE.text, '12px');
            this.lbl('lc4', `c = ${c}`, (nAx + nBx) / 2 - 22, (nAy + nBy) / 2, C_AMBER.text, '12px');
            this.lbl('valid', '✅ Valid triangle', cx, nBy + 40, '#059669', '11px', 0.5, 0.5);
            return;
        }

        // ── Standard triangle ─────────────────────────────────────
        this.drawTri(Bx, By, Cx, Cy, Ax, Ay, C_BLUE);
        if (isRight) this.drawRightMark(Cx, Cy, -1, -1, 13);

        this.lbl('A', Ax + 10, Ay - 8, C_BLUE.text, '14px');
        this.lbl('B', Bx - 26, By + 10, C_BLUE.text, '14px');
        this.lbl('C', Cx + 10, Cy + 10, C_BLUE.text, '14px');

        // Side labels with colored backgrounds
        const cStr = c === 0 ? '?' : String(c);
        this.lblBox('sc', `c = ${cStr}`, (Ax + Bx) / 2 - 30, (Ay + By) / 2, c === 0 ? C_AMBER : C_BLUE);
        this.lblBox('sa', `a = ${a}`, (Bx + Cx) / 2, By + 20, C_BLUE);
        this.lblBox('sb', `b = ${b}`, Cx + 14, (Cy + Ay) / 2, C_BLUE);

        // For lvl-tri-02: overlay the k=2 scaled triangle
        if (id === 'lvl-tri-02') {
            const k = 2, sa = a * k * scale, sb2 = b * k * scale;
            const B2x = cx - sa, B2y = cy + sb2 * 0.5;
            const C2x = cx + sa, C2y = B2y;
            const A2x = C2x, A2y = C2y - sb2;
            this.glow.lineStyle(3, 0x8b5cf6, 0.5);
            this.glow.strokeTriangle(B2x, B2y, C2x, C2y, A2x, A2y);
            this.main.lineStyle(2, 0x8b5cf6, 1);
            this.main.strokeTriangle(B2x, B2y, C2x, C2y, A2x, A2y);
            this.lbl('k2lbl', `k = 2`, cx, A2y - 20, C_VIOLET.text, '12px', 0.5, 0.5);
            this.lblBox('s6', `6`, (B2x + C2x) / 2, C2y + 22, C_VIOLET);
            this.lblBox('s8', `8`, C2x + 16, (C2y + A2y) / 2, C_VIOLET);
            this.lblBox('s10', `10`, (B2x + A2x) / 2 - 36, (B2y + A2y) / 2, C_VIOLET);
        }

        // Draggable apex for lvl-tri-01
        if (id === 'lvl-tri-01') {
            const apexX = Ax + this.apexOffsetY * 0.1;
            const apexY = Ay + this.apexOffsetY;
            this.dragHandle.setPosition(apexX, apexY).setVisible(true);
            this.dragHitZone.setPosition(apexX, apexY).setVisible(true);
            this.lbl('drag_h', '⬆ Drag apex', apexX, apexY - 26, '#0891b2', '10px', 0.5, 0.5);
        } else {
            this.dragHandle.setVisible(false);
            this.dragHitZone.setVisible(false);
        }

        // Working panel
        const perimVal = c === 0 ? '?' : String(a + b + c);
        const ans = this.currentVal > 0 ? String(this.currentVal) : (c === 0 ? '?' : perimVal);
        const ansColor = (this.currentVal > 0 && Math.abs(this.currentVal - this.levelSpec!.correctAnswer) <= (this.levelSpec!.tolerance ?? 0.5)) ? '#059669' : (this.currentVal > 0 ? '#dc2626' : '#92400e');
        this.drawPanel(cx, H * 0.82, Math.min(300, W - 24), 40,
            `Perimeter = a + b + c = ${a} + ${b} + ${cStr}`, '#374151', '10px',
            `Answer = ${ans}`, ansColor, '13px');
    }

    // ─────────────────────────────────────────────────────────────────
    // WORLD 2 — Similar Triangles (side-by-side)
    // ─────────────────────────────────────────────────────────────────
    private drawW2() {
        const id = this.levelSpec!.id;
        const W = this.cameras.main.width, H = this.cameras.main.height;
        const midY = H / 2 + 8;

        let a1 = 3, b1 = 4, c1 = 5, k = 2.0;
        if (id === 'lvl-tri-07') { a1 = 3; b1 = 4; c1 = 5; k = 2; }
        if (id === 'lvl-tri-08') { a1 = 6; b1 = 8; c1 = 10; k = 2; }
        if (id === 'lvl-tri-09') { a1 = 4; b1 = 6; c1 = 8; k = 3; }
        if (id === 'lvl-tri-10') { a1 = 3; b1 = 4; c1 = 5; k = 2; }
        if (id === 'lvl-tri-11') { a1 = 4; b1 = 6; c1 = 8; k = 1.5; }
        if (id === 'lvl-tri-12') { a1 = 3; b1 = 4; c1 = 5; k = 2; }

        const liveK = this.currentVal > 0
            ? Phaser.Math.Clamp(this.currentVal / (this.levelSpec!.correctAnswer / k), 0.4, 4.0) : k;

        const px = 44;
        const maxW = (W / 2 - 24) * 0.88;
        const unit = Math.min(px, maxW / Math.max(a1, c1));

        // Left — reference triangle
        const rW = a1 * unit, rH = b1 * unit;
        const rBx = W * 0.25 - rW / 2, rCx = rBx + rW;
        const rBy = midY + rH / 2, rAy = midY - rH / 2;
        this.drawTri(rBx, rBy, rCx, rBy, rCx, rAy, C_BLUE);
        this.drawRightMark(rCx, rBy, -1, -1, 11);
        this.lbl('rA', rCx + 8, rAy - 6, C_BLUE.text, '12px');
        this.lbl('rB', rBx - 22, rBy + 8, C_BLUE.text, '12px');
        this.lbl('rC', rCx + 8, rBy + 8, C_BLUE.text, '12px');
        this.lblBox(`ra`, String(a1), (rBx + rCx) / 2, rBy + 16, C_BLUE);
        this.lblBox(`rb`, String(b1), rCx + 10, (rBy + rAy) / 2, C_BLUE);
        this.lblBox(`rc`, String(c1), (rBx + rCx) / 2 - 28, (rBy + rAy) / 2 - 8, C_BLUE);
        this.lbl('r_lbl', '△ ABC (given)', W * 0.25, rAy - 24, C_BLUE.text, '10px', 0.5, 0.5);

        // Divider
        this.bgGfx.lineStyle(1.5, DOT, 0.9);
        this.bgGfx.lineBetween(W / 2, 34, W / 2, H - 32);

        // Right — scaled triangle
        const sW = Math.min(a1 * unit * liveK, (W / 2 - 24) * 0.88);
        const sH = Math.min(b1 * unit * liveK, H * 0.52);
        const sBx = W * 0.75 - sW / 2, sCx = sBx + sW;
        const sBy = midY + sH / 2, sAy = midY - sH / 2;
        this.drawTri(sBx, sBy, sCx, sBy, sCx, sAy, C_VIOLET);
        this.drawRightMark(sCx, sBy, -1, -1, 11);
        this.lbl('sD', sCx + 8, sAy - 6, C_VIOLET.text, '12px');
        this.lbl('sE', sBx - 22, sBy + 8, C_VIOLET.text, '12px');
        this.lbl('sF', sCx + 8, sBy + 8, C_VIOLET.text, '12px');
        this.lblBox('sa2', (a1 * liveK).toFixed(1), (sBx + sCx) / 2, sBy + 16, C_VIOLET);
        this.lblBox('sb2', (b1 * liveK).toFixed(1), sCx + 10, (sBy + sAy) / 2, C_VIOLET);
        this.lblBox('sc2', (c1 * liveK).toFixed(1), (sBx + sCx) / 2 - 28, (sBy + sAy) / 2 - 8, C_VIOLET);
        this.lbl('s_lbl', `△ DEF  (k = ${liveK.toFixed(2)}×)`, W * 0.75, sAy - 24, C_VIOLET.text, '10px', 0.5, 0.5);

        // Scale info panel (top center)
        const isRight = this.currentVal > 0 && Math.abs(this.currentVal - this.levelSpec!.correctAnswer) <= (this.levelSpec!.tolerance ?? 0.2);
        const panY = 40;
        this.main.fillStyle(WHITE, 1);
        this.main.fillRoundedRect(W / 2 - 110, panY, 220, 54, 10);
        this.main.lineStyle(2, 0x8b5cf6, 1);
        this.main.strokeRoundedRect(W / 2 - 110, panY, 220, 54, 10);
        this.lbl('k_v', `k = ${liveK.toFixed(2)}`, W / 2, panY + 16, C_VIOLET.text, '13px', 0.5, 0.5);
        this.lbl('kr_v', `Area ratio = k² = ${(liveK ** 2).toFixed(2)}`, W / 2, panY + 36, '#374151', '10px', 0.5, 0.5);

        // Slider
        const slY = panY + 66, minX = W * 0.3, maxX = W * 0.7;
        this.main.fillStyle(DOT, 0.5);
        this.main.fillRoundedRect(minX - 6, slY - 8, maxX - minX + 12, 16, 8);
        this.main.fillStyle(0x8b5cf6, 0.8);
        this.main.fillRoundedRect(minX - 6, slY - 8, maxX - minX + 12, 16, 8);
        this.main.lineStyle(3, 0xffffff, 1);
        this.main.lineBetween(minX, slY, maxX, slY);
        const handleX = minX + ((liveK - 0.5) / 3.5) * (maxX - minX);
        this.main.fillStyle(WHITE, 1);
        this.main.fillCircle(handleX, slY, 9);
        this.main.lineStyle(2, 0x8b5cf6, 1);
        this.main.strokeCircle(handleX, slY, 9);
        this.dragHandle.setPosition(handleX, slY).setVisible(true).setDepth(10);
        this.dragHitZone.setPosition(handleX, slY).setVisible(true).setDepth(10);
        this.lbl('sl_hint', '◀ Drag to scale ▶', handleX, slY - 22, '#6b7280', '9px', 0.5, 0.5);

        // Answer hint
        this.lbl('ans_h', isRight ? '✅ Correct!' : (this.currentVal > 0 ? '❌ Not quite' : 'Type your answer'), W / 2, slY + 24,
            isRight ? '#059669' : (this.currentVal > 0 ? '#dc2626' : '#6b7280'), '11px', 0.5, 0.5);
    }

    // ─────────────────────────────────────────────────────────────────
    // WORLD 3 — BPT (Thales)
    // ─────────────────────────────────────────────────────────────────
    private drawW3() {
        const id = this.levelSpec!.id;
        const { cx, cy, triW, triH, W, H } = this.layout();

        const Ax = cx, Ay = cy - triH * 0.9;
        const Bx = cx - triW * 0.55, By = cy + triH * 0.5;
        const Cx = cx + triW * 0.55, Cy = By;

        this.drawTri(Bx, By, Cx, Cy, Ax, Ay, C_BLUE);

        let adVal = 2, dbVal = 3, aeVal = 4, ecVal = 6;
        if (id === 'lvl-tri-14') { adVal = 3; dbVal = 9; aeVal = 4; ecVal = 12; }
        if (id === 'lvl-tri-15') { adVal = 4; dbVal = 6; aeVal = 10; ecVal = 15; }
        if (id === 'lvl-tri-16') { adVal = 5; dbVal = 3; aeVal = 10; ecVal = 6; }
        if (id === 'lvl-tri-17') { adVal = 2; dbVal = 3; aeVal = 2; ecVal = 3; }
        if (id === 'lvl-tri-18') { adVal = 3; dbVal = 4; aeVal = 12; ecVal = 16; }

        const t  = Phaser.Math.Clamp(this.bptRatio, 0.1, 0.9);
        const Dx = Ax + (Bx - Ax) * t, Dy = Ay + (By - Ay) * t;
        const Ex = Ax + (Cx - Ax) * t, Ey = Ay + (Cy - Ay) * t;

        // ADE shaded region
        this.main.fillStyle(0xfef3c7, 0.4);
        this.main.fillTriangle(Ax, Ay, Dx, Dy, Ex, Ey);

        // DE line (parallel to BC)
        this.glow.lineStyle(6, 0xf59e0b, 0.3);
        this.glow.lineBetween(Dx, Dy, Ex, Ey);
        this.main.lineStyle(3, 0xf59e0b, 1);
        this.main.lineBetween(Dx, Dy, Ex, Ey);

        // Tick marks
        this.parallelTicks(Dx, Dy, Ex, Ey, 0xf59e0b);
        this.parallelTicks(Bx, By, Cx, Cy, 0x3b82f6);

        // Vertex labels
        this.lbl('A3', Ax - 6, Ay - 22, C_BLUE.text, '14px');
        this.lbl('B3', Bx - 26, By + 8, C_BLUE.text, '14px');
        this.lbl('C3', Cx + 12, Cy + 8, C_BLUE.text, '14px');
        this.lbl('D3', Dx - 28, Dy - 4, C_AMBER.text, '13px');
        this.lbl('E3', Ex + 12, Ey - 4, C_AMBER.text, '13px');

        // Segment value labels (using colored boxes)
        this.lblBox('AD', `AD = ${adVal}`, (Ax + Dx) / 2 - 28, (Ay + Dy) / 2, C_BLUE);
        this.lblBox('DB', `DB = ${dbVal}`, (Dx + Bx) / 2 - 28, (Dy + By) / 2, C_BLUE);
        this.lblBox('AE', `AE = ${aeVal}`, (Ax + Ex) / 2 + 10, (Ay + Ey) / 2, C_VIOLET);
        this.lblBox('EC', `EC = ?`, (Ex + Cx) / 2 + 10, (Ey + Cy) / 2, C_AMBER);

        // BPT proportion panel at bottom
        const isRight = this.currentVal > 0 && Math.abs(this.currentVal - this.levelSpec!.correctAnswer) <= (this.levelSpec!.tolerance ?? 0);
        const panW = Math.min(310, W - 20);
        const panX = (W - panW) / 2, panY = By + 16;
        this.main.fillStyle(WHITE, 1);
        this.main.fillRoundedRect(panX, panY, panW, 70, 10);
        this.main.lineStyle(2, 0x10b981, 1);
        this.main.strokeRoundedRect(panX, panY, panW, 70, 10);

        this.lbl('bpt_ttl', 'Basic Proportionality Theorem (Thales)', cx, panY + 12, '#059669', '9px', 0.5, 0.5);
        this.lbl('bpt_f', 'If DE ∥ BC, then  AD/DB = AE/EC', cx, panY + 26, '#374151', '10px', 0.5, 0.5);
        this.lbl('bpt_sub', `${adVal}/${dbVal} = ${aeVal}/EC   →   EC = ${aeVal} × ${dbVal} / ${adVal}`, cx, panY + 42, '#1d4ed8', '10px', 0.5, 0.5);
        const ecAns = this.currentVal > 0 ? String(this.currentVal) : '?';
        this.lbl('bpt_ans', `EC = ${ecAns}`, cx, panY + 58,
            isRight ? '#059669' : (this.currentVal > 0 ? '#dc2626' : '#92400e'), '12px', 0.5, 0.5);

        // "DE ∥ BC" label near the DE midpoint
        this.lbl('parallel', 'DE ∥ BC', (Dx + Ex) / 2, (Dy + Ey) / 2 - 16, C_AMBER.text, '10px', 0.5, 0.5);

        // Drag handle at D
        this.dragHandle.setPosition(Dx, Dy).setVisible(true).setDepth(10);
        this.dragHitZone.setPosition(Dx, Dy).setVisible(true).setDepth(10);
        this.lbl('dh', '↕ Drag', Dx - 38, Dy - 20, '#0891b2', '9px', 0, 0.5);
        void H;
    }

    // ─────────────────────────────────────────────────────────────────
    // WORLD 4 — Areas & Scaling
    // ─────────────────────────────────────────────────────────────────
    private drawW4() {
        const id = this.levelSpec!.id;
        const W = this.cameras.main.width, H = this.cameras.main.height;
        const midY = H / 2;

        let k = 2.0;
        if (id === 'lvl-tri-19') k = 2;
        if (id === 'lvl-tri-20') k = 0.5;
        if (id === 'lvl-tri-21') k = 1.5;
        if (id === 'lvl-tri-22') k = 2;
        if (id === 'lvl-tri-23') k = 5 / 3;
        if (id === 'lvl-tri-24') k = 3;

        const liveK = this.currentVal > 0
            ? Phaser.Math.Clamp(Math.sqrt(this.currentVal / Math.max(1, 9)), 0.3, 3) : k;

        const bu = 60, bW = bu * 2, bH = bu * 1.6;
        const lCx = W * 0.27;
        const lB = { x: lCx - bW / 2, y: midY + bH / 2 };
        const lC = { x: lCx + bW / 2, y: midY + bH / 2 };
        const lA = { x: lCx, y: midY - bH / 2 };

        this.drawTri(lB.x, lB.y, lC.x, lC.y, lA.x, lA.y, C_BLUE);
        this.lbl('A4', lA.x - 6, lA.y - 18, C_BLUE.text, '13px');
        this.lbl('B4', lB.x - 22, lB.y + 8, C_BLUE.text, '13px');
        this.lbl('C4', lC.x + 8, lC.y + 8, C_BLUE.text, '13px');
        this.lbl('AreaS', 'Area = S', lCx, lA.y - 36, C_BLUE.text, '10px', 0.5, 0.5);

        const rCx = W * 0.73;
        const r2W = Math.min(bW * liveK, W * 0.42);
        const r2H = Math.min(bH * liveK, H * 0.48);
        const rB = { x: rCx - r2W / 2, y: midY + r2H / 2 };
        const rC = { x: rCx + r2W / 2, y: midY + r2H / 2 };
        const rA = { x: rCx, y: midY - r2H / 2 };

        this.drawTri(rB.x, rB.y, rC.x, rC.y, rA.x, rA.y, C_VIOLET);
        this.lbl('D4', rA.x - 6, rA.y - 18, C_VIOLET.text, '13px');
        this.lbl('E4', rB.x - 22, rB.y + 8, C_VIOLET.text, '13px');
        this.lbl('F4', rC.x + 8, rC.y + 8, C_VIOLET.text, '13px');
        this.lbl('AreaK', `Area = k²·S`, rCx, rA.y - 36, C_VIOLET.text, '10px', 0.5, 0.5);

        // Divider
        this.bgGfx.lineStyle(1.5, DOT, 0.9);
        this.bgGfx.lineBetween(W / 2, 34, W / 2, H - 32);

        // Info panel
        const panY = 40, isRight = this.currentVal > 0 && Math.abs(this.currentVal - this.levelSpec!.correctAnswer) <= (this.levelSpec!.tolerance ?? 1);
        this.main.fillStyle(WHITE, 1);
        this.main.fillRoundedRect(W / 2 - 110, panY, 220, 54, 10);
        this.main.lineStyle(2, 0xec4899, 1);
        this.main.strokeRoundedRect(W / 2 - 110, panY, 220, 54, 10);
        this.lbl('k4v', `k = ${liveK.toFixed(2)}`, W / 2, panY + 16, C_VIOLET.text, '13px', 0.5, 0.5);
        this.lbl('k4sq', `Area ratio = k² = ${(liveK ** 2).toFixed(2)}`, W / 2, panY + 36, '#374151', '10px', 0.5, 0.5);

        // Slider
        const slY = panY + 66, minX = W * 0.3, maxX = W * 0.7;
        this.main.fillStyle(0x8b5cf6, 0.8);
        this.main.fillRoundedRect(minX - 6, slY - 8, maxX - minX + 12, 16, 8);
        this.main.lineStyle(3, 0xffffff, 1);
        this.main.lineBetween(minX, slY, maxX, slY);
        const handleX = minX + ((liveK - 0.5) / 3.5) * (maxX - minX);
        this.main.fillStyle(WHITE, 1);
        this.main.fillCircle(handleX, slY, 9);
        this.main.lineStyle(2, 0x8b5cf6, 1);
        this.main.strokeCircle(handleX, slY, 9);
        this.dragHandle.setPosition(handleX, slY).setVisible(true).setDepth(10);
        this.dragHitZone.setPosition(handleX, slY).setVisible(true).setDepth(10);
        this.lbl('sl4', '◀ Drag to scale ▶', handleX, slY - 22, '#6b7280', '9px', 0.5, 0.5);
        this.lbl('ans4', isRight ? '✅ Correct!' : (this.currentVal > 0 ? '❌ Try again' : 'Type your answer'), W / 2, slY + 24,
            isRight ? '#059669' : (this.currentVal > 0 ? '#dc2626' : '#6b7280'), '11px', 0.5, 0.5);
    }

    // ─────────────────────────────────────────────────────────────────
    // WORLD 5 — Pythagoras Proof Lab
    // ─────────────────────────────────────────────────────────────────
    private drawW5() {
        const id = this.levelSpec!.id;
        const { cx, cy, triW, triH, W, H } = this.layout();
        if (id === 'lvl-tri-30') { this.drawBoss(cx, cy, triW, triH); return; }

        let leg1 = 3, leg2 = 4, hyp = 5;
        if (id === 'lvl-tri-25') { leg1 = 9;  leg2 = 12; hyp = 15; }
        if (id === 'lvl-tri-26') { leg1 = 8;  leg2 = 15; hyp = 17; }
        if (id === 'lvl-tri-27') { leg1 = 15; leg2 = 20; hyp = 25; }
        if (id === 'lvl-tri-28') { leg1 = 5;  leg2 = 12; hyp = 13; }
        if (id === 'lvl-tri-29') { leg1 = 6;  leg2 = 8;  hyp = 10; }

        const maxLeg = Math.max(leg1, leg2);
        const pu = Math.min((triW * 0.42) / maxLeg, (triH * 0.42) / maxLeg);
        const Cx = cx + leg1 * pu, Cy = cy + leg2 * pu * 0.5;
        const Bx = cx - leg1 * pu * 0.05, By = Cy;
        const Ax = Cx, Ay = Cy - leg2 * pu;

        // Pythagoras squares
        this.pySquare(Bx, By, Cx, Cy, leg1, C_BLUE);
        this.pySquare(Cx, Cy, Ax, Ay, leg2, C_VIOLET);
        this.pySquareOnHyp(Bx, By, Ax, Ay, hyp, C_AMBER);

        // Triangle on top
        this.drawTri(Bx, By, Cx, Cy, Ax, Ay, C_BLUE);
        this.drawRightMark(Cx, Cy, -1, -1, 14);

        this.lbl('A5', Ax + 10, Ay - 10, C_BLUE.text, '14px');
        this.lbl('B5', Bx - 26, By + 8, C_BLUE.text, '14px');
        this.lbl('C5', Cx + 10, Cy + 10, C_BLUE.text, '14px');

        const liveHyp = this.currentVal > 0 ? this.currentVal : hyp;
        const correct = Math.abs(liveHyp - hyp) < 0.5;
        this.lblBox('a5', `a = ${leg1}`, (Bx + Cx) / 2, By + 20, C_BLUE);
        this.lblBox('b5', `b = ${leg2}`, Cx + 14, (Cy + Ay) / 2, C_VIOLET);
        this.lblBox('c5', `c = ${liveHyp.toFixed(1)}`, (Ax + Bx) / 2 - 18, (Ay + By) / 2 - 10,
            correct ? C_GREEN : (this.currentVal > 0 ? C_RED : C_AMBER));

        // Working panel
        const fY = Math.min(Cy + 28, H - 104);
        this.drawPanel(cx, fY, Math.min(310, W - 20), 44,
            `c² = a² + b²   →   ${leg1}² + ${leg2}² = ${leg1 ** 2} + ${leg2 ** 2} = ${leg1 ** 2 + leg2 ** 2}`, '#374151', '10px',
            this.currentVal > 0
                ? (correct ? `✅ c = ${liveHyp} (correct!)` : `❌ ${liveHyp} ≠ √${leg1 ** 2 + leg2 ** 2} = ${hyp}`)
                : `c = √${leg1 ** 2 + leg2 ** 2}  =  ?`,
            correct ? '#059669' : (this.currentVal > 0 ? '#dc2626' : '#92400e'), '12px');

        this.dragHandle.setVisible(false);
        this.dragHitZone.setVisible(false);
    }

    // ─────────────────────────────────────────────────────────────────
    // BOSS — Level 30
    // ─────────────────────────────────────────────────────────────────
    private drawBoss(cx: number, cy: number, _tw: number, _th: number) {
        const W = this.cameras.main.width, H = this.cameras.main.height;
        const val = this.currentVal, correct = this.levelSpec?.correctAnswer ?? 13;
        const tol = this.levelSpec?.tolerance ?? 0.5;
        const isRight = val !== 0 && Math.abs(val - correct) <= tol;
        const sCol = isRight ? 0x10b981 : (val !== 0 ? 0xef4444 : 0x6b7280);

        // Banner
        this.main.fillStyle(0x1e1b4b, 1);
        this.main.fillRect(0, 34, W, 44);
        this.lbl('boss', '⚔️  BOSS: THE ARCHITECT  ⚔️', W / 2, 56, '#a5b4fc', '14px', 0.5, 0.5);

        // Bridge truss
        const bW = Math.min(300, W - 40);
        const sX = cx - bW / 2, sY = cy + 40;
        this.main.fillStyle(0xbfdbfe, 0.4);
        this.main.fillRect(0, sY + 14, W, H - (sY + 14));
        this.lbl('water', '〰️〰️〰️〰️〰️〰️〰️〰️〰️', cx, sY + 30, '#93c5fd', '12px', 0.5, 0.5);

        const pts = [
            { x: sX,           y: sY },
            { x: sX + bW*.33,  y: sY - bW*.33 },
            { x: sX + bW*.33,  y: sY },
            { x: sX + bW*.66,  y: sY - bW*.33 },
            { x: sX + bW*.66,  y: sY },
            { x: sX + bW,      y: sY },
        ];
        const fillC = isRight ? 0xd1fae5 : 0xf1f5f9;
        [[0,1,2],[2,1,3],[2,3,4],[4,3,5]].forEach(([ai,bi,ci]) => {
            this.main.fillStyle(fillC, 0.9);
            this.main.fillTriangle(pts[ai].x,pts[ai].y,pts[bi].x,pts[bi].y,pts[ci].x,pts[ci].y);
            this.main.lineStyle(2.5, sCol, 1);
            this.main.strokeTriangle(pts[ai].x,pts[ai].y,pts[bi].x,pts[bi].y,pts[ci].x,pts[ci].y);
        });

        if (val !== 0 && !isRight) {
            // Crack
            this.main.lineStyle(2, 0xef4444, 0.9);
            this.main.beginPath();
            this.main.moveTo(pts[2].x, pts[2].y);
            this.main.lineTo(pts[2].x - 18, pts[2].y - 36);
            this.main.lineTo(pts[2].x + 10, pts[2].y - 56);
            this.main.strokePath();
            this.lbl('crack', '⚠️ CRACKING!', cx, sY - bW * 0.1, '#dc2626', '12px', 0.5, 0.5);
        }

        // Labels
        this.lblBox('l5', '5m', pts[0].x + 50, pts[0].y + 14, C_BLUE);
        this.lblBox('l12', '12m', pts[2].x - 10, pts[2].y - 50, C_BLUE);
        const hypCol = val === 0 ? C_AMBER : (isRight ? C_GREEN : C_RED);
        this.lblBox('hyp', val !== 0 ? `${val}m` : '? m', pts[0].x + 28, pts[0].y - 52, hypCol);

        // Working panel
        this.drawPanel(cx, sY + 60, Math.min(290, W - 20), 48,
            `Hypotenuse² = 5² + 12²  =  25 + 144  =  169`, '#374151', '10px',
            isRight ? '✅ Bridge secure! c = 13m' : (val > 0 ? `❌ ${val}m is wrong — bridge collapses!` : 'c = √169 = ?'),
            isRight ? '#059669' : (val > 0 ? '#dc2626' : '#92400e'), '12px');
    }

    // ─────────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────────

    /** Draw filled+stroked triangle with vertex dots */
    private drawTri(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
                    pal: typeof C_BLUE) {
        this.main.fillStyle(pal.fill, 1);
        this.main.fillTriangle(x1, y1, x2, y2, x3, y3);
        this.main.lineStyle(2.5, pal.stroke, 1);
        this.main.strokeTriangle(x1, y1, x2, y2, x3, y3);
        [[x1,y1],[x2,y2],[x3,y3]].forEach(([vx,vy]) => {
            this.main.fillStyle(pal.stroke, 1);
            this.main.fillCircle(vx, vy, 5);
            this.main.fillStyle(WHITE, 1);
            this.main.fillCircle(vx, vy, 2);
        });
    }

    private drawRightMark(x: number, y: number, dx: number, dy: number, size: number) {
        this.main.lineStyle(1.8, 0x374151, 0.9);
        this.main.lineBetween(x + dx * size, y, x + dx * size, y + dy * size);
        this.main.lineBetween(x + dx * size, y + dy * size, x, y + dy * size);
    }

    private parallelTicks(x1: number, y1: number, x2: number, y2: number, color: number) {
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        const dx = x2 - x1, dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 1) return;
        const nx = -dy / len * 7, ny = dx / len * 7;
        this.main.lineStyle(2, color, 1);
        this.main.lineBetween(mx + nx, my + ny, mx - nx, my - ny);
        this.main.lineBetween(mx + nx + dx / len * 7, my + ny + dy / len * 7,
                               mx - nx + dx / len * 7, my - ny + dy / len * 7);
    }

    private pySquare(x1: number, y1: number, x2: number, y2: number, side: number, pal: typeof C_BLUE) {
        const dx = x2 - x1, dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 1) return;
        const nx = -dy / len, ny = dx / len;
        const s = Math.min(len, side * 6);
        const sq: [number,number][] = [[x1,y1],[x2,y2],[x2+nx*s,y2+ny*s],[x1+nx*s,y1+ny*s]];
        this.main.fillStyle(pal.fill, 1);
        this.main.beginPath(); this.main.moveTo(sq[0][0],sq[0][1]);
        sq.forEach(([px,py]) => this.main.lineTo(px,py));
        this.main.closePath(); this.main.fillPath();
        this.main.lineStyle(1.5, pal.stroke, 0.7);
        this.main.beginPath(); this.main.moveTo(sq[0][0],sq[0][1]);
        sq.forEach(([px,py]) => this.main.lineTo(px,py));
        this.main.closePath(); this.main.strokePath();
        const lx = (sq[0][0]+sq[1][0]+sq[2][0]+sq[3][0])/4;
        const ly = (sq[0][1]+sq[1][1]+sq[2][1]+sq[3][1])/4;
        this.lbl(`sq${pal.stroke}`, `${side}²=${side**2}`, lx, ly, pal.text, '9px', 0.5, 0.5);
    }

    private pySquareOnHyp(Bx: number, By: number, Ax: number, Ay: number, hyp: number, pal: typeof C_AMBER) {
        const dx = Ax-Bx, dy = Ay-By, len = Math.sqrt(dx*dx+dy*dy);
        if (len < 1) return;
        const nx = -dy/len, ny = dx/len, s = Math.min(len, hyp*4);
        const sq: [number,number][] = [[Bx,By],[Ax,Ay],[Ax+nx*s,Ay+ny*s],[Bx+nx*s,By+ny*s]];
        this.main.fillStyle(pal.fill, 1);
        this.main.beginPath(); this.main.moveTo(sq[0][0],sq[0][1]);
        sq.forEach(([px,py]) => this.main.lineTo(px,py));
        this.main.closePath(); this.main.fillPath();
        this.main.lineStyle(1.5, pal.stroke, 0.7);
        this.main.beginPath(); this.main.moveTo(sq[0][0],sq[0][1]);
        sq.forEach(([px,py]) => this.main.lineTo(px,py));
        this.main.closePath(); this.main.strokePath();
        const lx = (sq[0][0]+sq[1][0]+sq[2][0]+sq[3][0])/4;
        const ly = (sq[0][1]+sq[1][1]+sq[2][1]+sq[3][1])/4;
        this.lbl('sqH', `${hyp}²=${hyp**2}`, lx, ly, pal.text, '9px', 0.5, 0.5);
    }

    /** Colored box label (like a key/legend badge) */
    private lblBox(key: string, text: string, x: number, y: number, pal: typeof C_BLUE) {
        const metrics = { w: Math.max(40, text.length * 7), h: 22 };
        this.main.fillStyle(pal.fill, 1);
        this.main.fillRoundedRect(x - metrics.w/2, y - metrics.h/2, metrics.w, metrics.h, 5);
        this.main.lineStyle(1.5, pal.stroke, 1);
        this.main.strokeRoundedRect(x - metrics.w/2, y - metrics.h/2, metrics.w, metrics.h, 5);
        this.lbl(key, text, x, y, pal.text, '11px', 0.5, 0.5);
    }

    /** Working panel — 2 lines explanation */
    private drawPanel(cx: number, y: number, w: number, h: number,
                      line1: string, col1: string, fs1: string,
                      line2: string, col2: string, fs2: string) {
        const x = cx - w / 2;
        this.main.fillStyle(WHITE, 1);
        this.main.fillRoundedRect(x, y, w, h, 10);
        this.main.lineStyle(1.5, DOT, 1);
        this.main.strokeRoundedRect(x, y, w, h, 10);
        this.lbl('wp1', line1, cx, y + h * 0.32, col1, fs1, 0.5, 0.5);
        this.lbl('wp2', line2, cx, y + h * 0.72, col2, fs2, 0.5, 0.5);
    }

    private lbl(key: string, text: string, x: number, y: number, color: string, fontSize = '12px', ox = 0, oy = 0) {
        if (this.labels[key]) {
            this.labels[key].setText(text).setPosition(x, y).setStyle({ color }).setVisible(true);
        } else {
            this.labels[key] = this.add.text(x, y, text, {
                fontFamily: FONT, fontSize, color, fontStyle: 'bold',
            }).setOrigin(ox, oy);
        }
    }

    private resetLabels() {
        Object.values(this.labels).forEach(t => t.destroy());
        this.labels = {};
    }

    private flashOverlay(color: number) {
        this.overlay.clear().fillStyle(color, 0.22).fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.overlay.setAlpha(1);
        this.tweens.add({ targets: this.overlay, alpha: 0, duration: 600, ease: 'Cubic.easeOut' });
    }

    private layout() {
        const W = this.cameras.main.width, H = this.cameras.main.height;
        return {
            cx: W / 2, cy: H / 2 + 12, W, H,
            triW: Math.min(W * 0.55, 260),
            triH: Math.min(H * 0.44, 200)
        };
    }

    private worldNum(): number {
        const n = parseInt(this.levelSpec?.id.replace('lvl-tri-', '') ?? '1', 10);
        if (n <= 6) return 1; if (n <= 12) return 2; if (n <= 18) return 3;
        if (n <= 24) return 4; return 5;
    }

    private updateDragVisibility() {
        const w = this.worldNum();
        this.dragHandle.setVisible(w === 1 && this.levelSpec?.id === 'lvl-tri-01');
    }

    private celebrate() {
        if (!this.scene?.systems) return;
        const W = this.cameras.main.width, H = this.cameras.main.height;
        soundManager.playSuccess();
        try {
            const p = this.add.particles(W/2, H/2, 'particle_star', {
                speed: {min:100,max:280}, angle:{min:0,max:360}, scale:{start:1,end:0},
                lifespan:1400, blendMode:'ADD', tint:[0xffeb3b,0x4ade80,0x06b6d4], quantity:28, duration:200
            });
            const t = this.add.text(W/2, H/2-55, '✅ Excellent!', {
                fontFamily:FONT, fontSize:'28px', color:'#059669', fontStyle:'bold',
                stroke:'#ffffff', strokeThickness:5
            }).setOrigin(0.5).setAlpha(0).setScale(0.4).setDepth(200);
            this.tweens.add({ targets:t, scale:1.1, alpha:1, duration:360, ease:'Back.easeOut',
                yoyo:true, hold:850, onComplete:()=>{ t.destroy(); p.destroy(); } });
        } catch { /* noop */ }
    }
}
