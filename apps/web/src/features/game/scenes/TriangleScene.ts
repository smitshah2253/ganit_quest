import Phaser, { Scene, GameObjects } from 'phaser';
import { EventBus } from '../engine/EventBus';
import { getLevelSpec } from '@/data/levelSpecs';
import type { LevelSpecification } from '@/data/levelSpecs';
import { soundManager } from '../engine/SoundManager';

/**
 * TriangleScene — interactive visual models for Chapter 6: Triangles (std 10)
 *
 * World 1 (lvl-tri-01..06)  — Triangle Foundations: draggable right-triangle with live side labels
 * World 2 (lvl-tri-07..12)  — Similar Triangles: two triangles side-by-side with scale slider
 * World 3 (lvl-tri-13..18)  — BPT (Thales): triangle with DE || BC parallel-line visual
 * World 4 (lvl-tri-19..24)  — Areas & Scaling: two triangles with shaded area comparison
 * World 5 (lvl-tri-25..30)  — Pythagoras & Mastery: right triangle with Pythagoras square proof
 */
export class TriangleScene extends Scene {
    private levelSpec: LevelSpecification | null = null;
    private isLevelActive: boolean = false;

    // Graphics layers
    private bg!: GameObjects.Graphics;      // static background grid
    private main!: GameObjects.Graphics;    // main triangle drawing
    private glow!: GameObjects.Graphics;    // neon glow overlays
    private overlay!: GameObjects.Graphics; // answer-feedback flash

    // Draggable handle (used for World 1 apex drag)
    private dragHandle!: GameObjects.Arc;
    private dragHitZone!: GameObjects.Arc; // Mobile-optimized 40px hit zone

    // Live state
    private apexOffsetY: number = 0;       // World 1: how far apex is dragged (px)
    private bptRatio: number = 0.5;        // World 3: position of DE line (0..1 of AB)
    private currentInputVal: number = 0;   // typed answer value
    private lastSnap: number = -1;          // last snapped perimeter value (World 1)

    // Text labels pool
    private labels: Record<string, GameObjects.Text> = {};

    // Status / title bar
    private titleText!: GameObjects.Text;
    private statusText!: GameObjects.Text;
    private formulaText!: GameObjects.Text;

    constructor() {
        super('TriangleScene');
    }

    // ─────────────────────────────────────────────────────────────────
    create() {
        this.cameras.main.setBackgroundColor('#ecf2f7');

        this.bg   = this.add.graphics();
        this.main = this.add.graphics();
        this.glow = this.add.graphics();
        this.overlay = this.add.graphics().setAlpha(0);

        // Title bar
        this.titleText = this.add.text(22, 18, 'Triangle Lab', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px', color: '#475569', fontStyle: 'bold'
        });
        this.statusText = this.add.text(22, 38, 'Load a level...', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px', color: '#3b82f6', fontStyle: 'bold'
        });

        // Formula footer
        this.formulaText = this.add.text(22, this.cameras.main.height - 28, '', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px', color: '#0f172a', fontStyle: 'bold',
            backgroundColor: '#ffffffd9',
            padding: { x: 8, y: 4 }
        }).setOrigin(0, 1);

        // Drag handle (used in World 1 for apex dragging)
        this.dragHandle = this.add.circle(0, 0, 11, 0x06b6d4, 1.0)
            .setStrokeStyle(3, 0xffffff)
            .setInteractive({ useHandCursor: true })
            .setVisible(false);

        // Create larger invisible hit zone for mobile (40px radius)
        this.dragHitZone = this.add.circle(0, 0, 40, 0x000000, 0).setDepth(4).setVisible(false);
        this.input.setDraggable(this.dragHitZone);

        // Visual feedback for drag handle on hover
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

        // Haptic feedback on drag
        this.dragHitZone.on('dragstart', () => {
            if ('vibrate' in navigator) {
                try {
                    navigator.vibrate(10);
                } catch (e) {
                    // Silently fail
                }
            }
        });

        this.input.on('drag', (_ptr: any, _go: any, _dragX: number, dragY: number) => {
            this.onDrag(_dragX, dragY);
        });

        // ── Event listeners ──────────────────────────────────────────
        const onLoadLevel = (data: any) => {
            if (!this.scene?.systems) return;
            if (!data.id.startsWith('lvl-tri-')) {
                this.isLevelActive = false;
                this.scene.start('LevelScene');
                return;
            }
            this.levelSpec  = getLevelSpec(data.id, data);
            this.isLevelActive = true;
            this.apexOffsetY = 0;
            this.bptRatio    = 0.5;
            this.currentInputVal = 0;
            this.lastSnap = -1;

            this.titleText.setText(`Ch 6 – Triangles: ${data.title ?? data.id}`);
            this.statusText.setText(data.concept ?? '');
            if (this.levelSpec) this.formulaText.setText(this.levelSpec.formulaDisplay ?? '');
            this.formulaText.setPosition(22, this.cameras.main.height - 28);

            this.resetLabels();
            this.updateDragHandle();
            this.redraw();

            this.cameras.main.zoomTo(1.1, 450, 'Power2');
            this.time.delayedCall(450, () => this.cameras.main.zoomTo(1, 350, 'Power2'));
        };

        const onUserInput = (d: { value: string; levelId: string }) => {
            if (!this.isLevelActive || !this.levelSpec) return;
            if (d.levelId !== this.levelSpec.id) return;
            const v = parseFloat(d.value);
            if (!isNaN(v)) {
                this.currentInputVal = v;
                this.syncInputToVisual(v);
            }
        };

        const onBoardInput = (d: { inputs: string[]; levelId: string }) => {
            if (!this.isLevelActive || !this.levelSpec) return;
            if (d.levelId !== this.levelSpec.id) return;
            if (d.inputs[0] !== undefined) onUserInput({ value: d.inputs[0], levelId: d.levelId });
        };

        const onCorrect = () => this.flashOverlay(0x10b981);
        const onWrong   = () => this.flashOverlay(0xef4444);

        EventBus.on('load-level',               onLoadLevel);
        EventBus.on('user-input-changed',        onUserInput);
        EventBus.on('board-exam-input-changed',  onBoardInput);
        EventBus.on('answer-correct',            onCorrect);
        EventBus.on('answer-wrong',              onWrong);

        const cleanup = () => {
            EventBus.off('load-level',               onLoadLevel);
            EventBus.off('user-input-changed',        onUserInput);
            EventBus.off('board-exam-input-changed',  onBoardInput);
            EventBus.off('answer-correct',            onCorrect);
            EventBus.off('answer-wrong',              onWrong);
            this.scale.off('resize', onResize);
        };
        this.events.once('shutdown', cleanup);
        this.events.once('destroy',  cleanup);

        const onResize = (gs: Phaser.Structs.Size) => {
            if (!this.cameras || !this.cameras.main) return;
            this.cameras.main.setSize(gs.width, gs.height);
            this.formulaText.setPosition(22, gs.height - 28);
            if (this.isLevelActive) this.redraw();
        };
        this.scale.on('resize', onResize);

        EventBus.emit('game-ready');
    }

    // ─────────────────────────────────────────────────────────────────
    update() {
        if (this.isLevelActive) this.redraw();
    }

    // ─────────────────────────────────────────────────────────────────
    // DRAG HANDLER  (World 1 only — move apex up/down)
    // ─────────────────────────────────────────────────────────────────
    private onDrag(_dragX: number, dragY: number) {
        if (!this.isLevelActive || !this.levelSpec) return;
        const world = this.worldNumber();
        if (world !== 1) return;

        const { cy, triH } = this.baseLayout();
        const minApexY = cy - triH * 1.8;
        const maxApexY = cy - triH * 0.3;
        const newApexY = Phaser.Math.Clamp(dragY, minApexY, maxApexY);
        this.apexOffsetY = newApexY - (cy - triH);

        // Emit dragged "height" as user value for World-1 perimeter levels
        const { triW } = this.baseLayout();
        const h = Math.abs(newApexY - (cy + triH * 0.5));
        const perimeter = Math.round(triW + 2 * Math.sqrt((triW / 2) ** 2 + h ** 2));

        // Magnetic snap to exact perimeter = 12 (3+4+5) for lvl-tri-01
        if (this.levelSpec.id === 'lvl-tri-01') {
            if (Math.abs(perimeter - 12) < 2 && this.lastSnap !== 12) {
                this.lastSnap = 12;
                soundManager.playSnap();
                this.tweens.add({ targets: this.dragHandle, scaleX: 1.5, scaleY: 1.5, duration: 80, yoyo: true });
            }
        }

        EventBus.emit('user-input-changed', { value: String(perimeter), levelId: this.levelSpec.id });
    }

    // ─────────────────────────────────────────────────────────────────
    // Sync typed value → visual state (scale / BPT ratio)
    // ─────────────────────────────────────────────────────────────────
    private syncInputToVisual(v: number) {
        if (!this.levelSpec) return;
        const world = this.worldNumber();

        if (world === 2 || world === 4) {
            // no extra state needed — currentInputVal drives liveK in draw functions
        } else if (world === 3) {
            // BPT ratio: map the answer value to a fraction of the triangle height
            const id = this.levelSpec.id;
            // level-specific ratio mapping
            if (id === 'lvl-tri-13') this.bptRatio = Phaser.Math.Clamp(v / 10, 0.15, 0.85);
            else if (id === 'lvl-tri-14') this.bptRatio = Phaser.Math.Clamp(v / 20, 0.15, 0.85);
            else if (id === 'lvl-tri-15') this.bptRatio = Phaser.Math.Clamp(v / 25, 0.15, 0.85);
            else if (id === 'lvl-tri-16') this.bptRatio = Phaser.Math.Clamp(v / 12, 0.15, 0.85);
            else if (id === 'lvl-tri-17') this.bptRatio = Phaser.Math.Clamp(v * 1.0, 0.15, 0.85);
            else if (id === 'lvl-tri-18') this.bptRatio = Phaser.Math.Clamp(v / 28, 0.15, 0.85);
            else this.bptRatio = Phaser.Math.Clamp(v / Math.max(1, this.levelSpec.correctAnswer), 0.15, 0.85);
        } else if (world === 5) {
            // currentInputVal drives live hint in draw function
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // MAIN DRAW ROUTER
    // ─────────────────────────────────────────────────────────────────
    private redraw() {
        this.bg.clear();
        this.main.clear();
        this.glow.clear();

        if (!this.levelSpec) return;

        this.drawGridBackground();
        const world = this.worldNumber();
        switch (world) {
            case 1: this.drawWorld1_Foundations(); break;
            case 2: this.drawWorld2_Similar();     break;
            case 3: this.drawWorld3_BPT();         break;
            case 4: this.drawWorld4_Areas();        break;
            case 5: this.drawWorld5_Pythagoras();   break;
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // BACKGROUND: subtle dot-grid
    // ─────────────────────────────────────────────────────────────────
    private drawGridBackground() {
        const W = this.cameras.main.width;
        const H = this.cameras.main.height;
        this.bg.fillStyle(0xcbd5e1, 0.35);
        for (let x = 20; x < W; x += 28) {
            for (let y = 20; y < H; y += 28) {
                this.bg.fillCircle(x, y, 1.2);
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // WORLD 1 — Triangle Foundations
    // Shows: a labelled triangle whose dimensions match the question values.
    // For lvl-tri-01 the apex is draggable; others show fixed shape with side labels.
    // ─────────────────────────────────────────────────────────────────
    private drawWorld1_Foundations() {
        const id = this.levelSpec!.id;
        const { cx, cy, triW, triH } = this.baseLayout();

        // Pick side values based on level
        let a = 3, b = 4, c = 5;
        let isRight = true;
        if (id === 'lvl-tri-02') { a = 3; b = 4; c = 5; }      // reference (show both)
        if (id === 'lvl-tri-03') { a = 5; b = 12; c = 13; }
        if (id === 'lvl-tri-04') { a = 6; b = 8; c = 0; }      // c unknown
        if (id === 'lvl-tri-05') { a = 6; b = 8; c = 10; isRight = false; } // two triangles
        if (id === 'lvl-tri-06') { a = 6; b = 8; c = 10; }

        // Scale so they look nice — base = a+b as denominator
        const scale = triW / (a + b + 2);

        // Right-angle triangle: B at bottom-left, C at bottom-right, A at apex
        const Bx = cx - a * scale;
        const By = cy + b * scale * 0.5;
        const Cx = cx + a * scale;
        const Cy = By;
        const Ax = Cx;                                // right angle at C
        const Ay = Cy - b * scale;

        if (id === 'lvl-tri-05') {
            // Two triangles sharing base — like a diamond
            this.drawTriangle(Bx, By, Cx, Cy, Ax, Ay, 0x3b82f6, 0x1d4ed8, 0.12);
            const Ax2 = Bx;
            const Ay2 = Ay;
            this.drawTriangle(Bx, By, Cx, Cy, Ax2, Ay2, 0x8b5cf6, 0x6d28d9, 0.12);
            this.lbl('B', Bx - 22, By + 12, '#1d4ed8');
            this.lbl('C', Cx + 12, Cy + 12, '#1d4ed8');
            this.lbl('A', Ax + 12, Ay - 6, '#1d4ed8');
            this.lbl("A'", Ax2 - 30, Ay2 - 6, '#6d28d9');
            this.lbl(`6`, (Bx + Cx) / 2, Cy + 18, '#374151', '13px');
            this.lbl(`8`, (Bx + Ax2) / 2 - 22, (By + Ay2) / 2, '#374151', '13px');
            this.lbl(`8`, (Cx + Ax) / 2 + 18, (Cy + Ay) / 2, '#374151', '13px');
            this.lbl(`10`, (Bx + Ax) / 2 - 14, (By + Ay) / 2 - 6, '#6d28d9', '12px');
            this.lbl(`10`, (Cx + Ax2) / 2 + 8, (Cy + Ay2) / 2 - 6, '#6d28d9', '12px');
            this.setLbl('hint', 'Two triangles share base BC = 6', cx, cy - triH * 0.8, '#7c3aed', '11px');
                return;
        }

        this.drawTriangle(Bx, By, Cx, Cy, Ax, Ay, 0x3b82f6, 0x1d4ed8, 0.12);

        // Right-angle marker at C
        if (isRight) this.drawRightAngleMarker(Cx, Cy, -1, -1, 14);

        // Vertex labels
        this.lbl('A', Ax + 10, Ay - 8, '#1d4ed8');
        this.lbl('B', Bx - 28, By + 10, '#1d4ed8');
        this.lbl('C', Cx + 10, Cy + 10, '#1d4ed8');

        // Side labels
        const midABx = (Ax + Bx) / 2; const midABy = (Ay + By) / 2;
        const midBCx = (Bx + Cx) / 2; const midBCy = (By + Cy) / 2;
        const midCAx = (Cx + Ax) / 2; const midCAy = (Cy + Ay) / 2;

        this.lbl(`c = ${c === 0 ? '?' : c}`, midABx - 36, midABy, '#0369a1', '13px');
        this.lbl(`a = ${a}`, midBCx, midBCy + 16, '#0369a1', '13px');
        this.lbl(`b = ${b}`, midCAx + 10, midCAy, '#0369a1', '13px');

        // Live perimeter hint
        this.setLbl('hint2', `Perimeter = ${a} + ${b} + ${c === 0 ? '?' : c} = ${c === 0 ? '?' : a + b + c}`,
            cx, cy + triH * 0.7, '#374151', '12px');

        // For lvl-tri-02: overlay the larger similar triangle
        if (id === 'lvl-tri-02') {
            const k = 2;
            const sa = a * k * scale, sb = b * k * scale;
            const B2x = cx - sa; const B2y = cy + sb * 0.5;
            const C2x = cx + sa; const C2y = B2y;
            const A2x = C2x;    const A2y = C2y - sb;
            this.main.lineStyle(2, 0x8b5cf6, 0.8);
            this.main.strokeTriangle(B2x, B2y, C2x, C2y, A2x, A2y);
            this.lbl(`k = 2`, cx, A2y - 18, '#7c3aed', '13px');
            this.lbl(`6`, (B2x + C2x) / 2, C2y + 20, '#7c3aed', '13px');
            this.lbl(`8`, (C2x + A2x) / 2 + 12, (C2y + A2y) / 2, '#7c3aed', '13px');
            this.lbl(`10`, (B2x + A2x) / 2 - 40, (B2y + A2y) / 2, '#7c3aed', '12px');
        }

        // Draggable apex for lvl-tri-01
        if (id === 'lvl-tri-01') {
            const apexX = Ax + this.apexOffsetY * 0.1;
            const apexY = Ay + this.apexOffsetY;
            this.dragHandle.setPosition(apexX, apexY).setVisible(true);
            this.dragHitZone.setPosition(apexX, apexY).setVisible(true);
            this.setLbl('drag_hint', '⬆ Drag apex to explore!', cx, Ay - 40, '#0891b2', '11px');
        } else {
            this.dragHandle.setVisible(false);
            this.dragHitZone.setVisible(false);
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // WORLD 2 — Similar Triangles
    // Shows: reference triangle (small, blue) + scaled triangle (right, violet)
    // ─────────────────────────────────────────────────────────────────
    private drawWorld2_Similar() {
        const id = this.levelSpec!.id;
        const W  = this.cameras.main.width;
        const H  = this.cameras.main.height;
        const centerY = H / 2 + 10;

        // Reference triangle fixed at 3-4-5 scaled to ~80px base
        const px = 50;           // unit pixel size
        let a1 = 3, b1 = 4, c1 = 5;  // reference sides (unit multiples)
        let k = 2.0;
        if (id === 'lvl-tri-07') { a1 = 3; b1 = 4; c1 = 5; k = 2; }
        if (id === 'lvl-tri-08') { a1 = 6; b1 = 8; c1 = 10; k = 2; }
        if (id === 'lvl-tri-09') { a1 = 4; b1 = 6; c1 = 8; k = 3; }
        if (id === 'lvl-tri-10') { a1 = 3; b1 = 4; c1 = 5; k = 2; }
        if (id === 'lvl-tri-11') { a1 = 4; b1 = 6; c1 = 8; k = 1.5; }
        if (id === 'lvl-tri-12') { a1 = 3; b1 = 4; c1 = 5; k = 2; }

        // Input-driven live scale (clamped visual only)
        const liveK = this.currentInputVal > 0
            ? Phaser.Math.Clamp(this.currentInputVal / (this.levelSpec!.correctAnswer / k), 0.4, 4.0)
            : k;

        // Left: reference
        const gap = W * 0.03;
        const maxW = (W / 2 - gap - 20) * 0.9;
        const unit = Math.min(px, maxW / Math.max(a1, c1));
        const refW  = a1 * unit;
        const refH  = b1 * unit;
        const refBx = W * 0.25 - refW / 2;
        const refCx = refBx + refW;
        const refBy = centerY + refH / 2;
        const refAy = centerY - refH / 2;

        this.drawTriangle(refBx, refBy, refCx, refBy, refCx, refAy, 0x3b82f6, 0x1d4ed8, 0.15);
        this.drawRightAngleMarker(refCx, refBy, -1, -1, 12);
        this.lbl('A', refCx + 8, refAy - 6, '#1d4ed8');
        this.lbl('B', refBx - 22, refBy + 8, '#1d4ed8');
        this.lbl('C', refCx + 8, refBy + 8, '#1d4ed8');
        this.lbl(`${a1}`, (refBx + refCx) / 2, refBy + 16, '#1e40af', '12px');
        this.lbl(`${b1}`, refCx + 10, (refBy + refAy) / 2, '#1e40af', '12px');
        this.lbl(`${c1}`, (refBx + refCx) / 2 - 30, (refBy + refAy) / 2 - 6, '#1e40af', '12px');
        this.setLbl('ref_lbl', '△ ABC (reference)', W * 0.25, refAy - 22, '#1d4ed8', '11px');

        // Right: scaled live triangle
        const scaledW = a1 * unit * liveK;
        const scaledH = b1 * unit * liveK;
        const maxScaledW = (W / 2 - gap - 20) * 0.9;
        const clampScale = scaledW > maxScaledW ? maxScaledW / scaledW : 1;
        const sW = scaledW * clampScale;
        const sH = scaledH * clampScale;
        const sBx = W * 0.75 - sW / 2;
        const sCx = sBx + sW;
        const sBy = centerY + sH / 2;
        const sAy = centerY - sH / 2;

        this.drawTriangle(sBx, sBy, sCx, sBy, sCx, sAy, 0x8b5cf6, 0x6d28d9, 0.15);
        this.drawRightAngleMarker(sCx, sBy, -1, -1, 12);
        this.lbl('D', sCx + 8, sAy - 6, '#6d28d9');
        this.lbl('E', sBx - 22, sBy + 8, '#6d28d9');
        this.lbl('F', sCx + 8, sBy + 8, '#6d28d9');
        this.lbl(`${(a1 * liveK).toFixed(1)}`, (sBx + sCx) / 2, sBy + 16, '#5b21b6', '12px');
        this.lbl(`${(b1 * liveK).toFixed(1)}`, sCx + 10, (sBy + sAy) / 2, '#5b21b6', '12px');
        this.lbl(`${(c1 * liveK).toFixed(1)}`, (sBx + sCx) / 2 - 30, (sBy + sAy) / 2 - 6, '#5b21b6', '12px');
        this.setLbl('sc_lbl', `△ DEF  (k = ${liveK.toFixed(2)}×)`, W * 0.75, sAy - 22, '#6d28d9', '11px');

        // Divider
        this.bg.lineStyle(1.5, 0xcbd5e1, 0.8);
        this.bg.lineBetween(W / 2, 60, W / 2, H - 40);

        // Scale ratio badge
        this.setLbl('ratio_badge', `Scale Factor  k = ${liveK.toFixed(2)}`, W / 2, H * 0.12, '#4f46e5', '13px');
        this.setLbl('area_badge',  `Area ratio = k² = ${(liveK * liveK).toFixed(2)}`, W / 2, H * 0.12 + 20, '#7c3aed', '11px');
    }

    // ─────────────────────────────────────────────────────────────────
    // WORLD 3 — Basic Proportionality Theorem (Thales)
    // Shows: Triangle ABC with parallel line DE dividing AB and AC
    // ─────────────────────────────────────────────────────────────────
    private drawWorld3_BPT() {
        const id = this.levelSpec!.id;
        const { cx, cy, triW, triH } = this.baseLayout();

        // Triangle vertices: A at top, B bottom-left, C bottom-right
        const Ax = cx;
        const Ay = cy - triH * 0.9;
        const Bx = cx - triW * 0.55;
        const By = cy + triH * 0.5;
        const Cx = cx + triW * 0.55;
        const Cy = By;

        // Draw main triangle
        this.drawTriangle(Bx, By, Cx, Cy, Ax, Ay, 0x3b82f6, 0x1d4ed8, 0.10);

        // Level-specific BPT data
        let adVal = 2, dbVal = 3, aeVal = 4, ecVal = 6; // ecVal displayed in label only
        if (id === 'lvl-tri-13') { adVal = 2; dbVal = 3; aeVal = 4; ecVal = 6; }
        if (id === 'lvl-tri-14') { adVal = 3; dbVal = 9; aeVal = 4; ecVal = 12; }
        if (id === 'lvl-tri-15') { adVal = 4; dbVal = 6; aeVal = 10; ecVal = 15; }
        if (id === 'lvl-tri-16') { adVal = 5; dbVal = 3; aeVal = 10; ecVal = 6; }
        if (id === 'lvl-tri-17') { adVal = 2; dbVal = 3; aeVal = 2; ecVal = 3; }
        if (id === 'lvl-tri-18') { adVal = 3; dbVal = 4; aeVal = 12; ecVal = 16; }

        // t = AD / AB ratio to place D and E on the triangle sides
        const _abTotal = adVal + dbVal; void _abTotal;
        const t = Phaser.Math.Clamp(this.bptRatio, 0.1, 0.9);

        // D on AB: t fraction from A down to B
        const Dx = Ax + (Bx - Ax) * t;
        const Dy = Ay + (By - Ay) * t;
        // E on AC: same t fraction from A down to C
        const Ex = Ax + (Cx - Ax) * t;
        const Ey = Ay + (Cy - Ay) * t;

        // Draw DE parallel line (highlighted amber)
        this.glow.lineStyle(8, 0xf59e0b, 0.20);
        this.glow.lineBetween(Dx, Dy, Ex, Ey);
        this.main.lineStyle(2.5, 0xf59e0b, 1.0);
        this.main.lineBetween(Dx, Dy, Ex, Ey);

        // Tick marks on DE to show it's parallel to BC
        this.drawParallelTicks(Dx, Dy, Ex, Ey, 0xf59e0b);
        this.drawParallelTicks(Bx, By, Cx, Cy, 0x1d4ed8);

        // Vertex labels
        this.lbl('A', Ax - 6, Ay - 20, '#1d4ed8', '14px');
        this.lbl('B', Bx - 24, By + 8, '#1d4ed8', '14px');
        this.lbl('C', Cx + 10, Cy + 8, '#1d4ed8', '14px');
        this.lbl('D', Dx - 26, Dy - 4, '#d97706', '13px');
        this.lbl('E', Ex + 10, Ey - 4, '#d97706', '13px');

        // Side segment labels — AD / DB on left side
        const midADx = (Ax + Dx) / 2 - 24; const midADy = (Ay + Dy) / 2;
        const midDBx = (Dx + Bx) / 2 - 24; const midDBy = (Dy + By) / 2;
        this.lbl(`AD=${adVal}`, midADx, midADy, '#0369a1', '12px');
        this.lbl(`DB=${dbVal}`, midDBx, midDBy, '#0369a1', '12px');

        // AE / EC on right side
        const midAEx = (Ax + Ex) / 2 + 10; const midAEy = (Ay + Ey) / 2;
        const midECx = (Ex + Cx) / 2 + 10; const midECy = (Ey + Cy) / 2;
        this.lbl(`AE=${aeVal}`, midAEx, midAEy, '#7c3aed', '12px');
        this.lbl(`EC=?`, midECx, midECy, '#dc2626', '12px');

        // Proportion badge
        const ratioStr = `${adVal}/${dbVal} = ${aeVal}/${ecVal} → BPT ✓`;
        this.setLbl('bpt_prop', ratioStr, cx, By + 28, '#374151', '12px');

        // DE || BC label
        this.setLbl('parallel_lbl', 'DE ∥ BC  (Thales Theorem)', cx, (Dy + Ey) / 2 - 14, '#d97706', '11px');
    }

    // ─────────────────────────────────────────────────────────────────
    // WORLD 4 — Areas & Scaling
    // Shows: two triangles side-by-side with shaded area comparison
    // ─────────────────────────────────────────────────────────────────
    private drawWorld4_Areas() {
        const id = this.levelSpec!.id;
        const W  = this.cameras.main.width;
        const H  = this.cameras.main.height;
        const centerY = H / 2;

        let k = 2.0;
        if (id === 'lvl-tri-19') k = 2;
        if (id === 'lvl-tri-20') k = 0.5;
        if (id === 'lvl-tri-21') k = 1.5;
        if (id === 'lvl-tri-22') k = 2;
        if (id === 'lvl-tri-23') k = 5 / 3;
        if (id === 'lvl-tri-24') k = 3;

        const liveK = this.currentInputVal > 0
            ? Phaser.Math.Clamp(Math.sqrt(this.currentInputVal / Math.max(1, 9)), 0.3, 3)
            : k;

        // Base triangle (unit)
        const baseUnit = 70;
        const b1W = baseUnit * 2;
        const b1H = baseUnit * 1.6;

        // Left triangle (reference)
        const lCx = W * 0.28;
        const l_B = { x: lCx - b1W / 2, y: centerY + b1H / 2 };
        const l_C = { x: lCx + b1W / 2, y: centerY + b1H / 2 };
        const l_A = { x: lCx, y: centerY - b1H / 2 };

        this.main.fillStyle(0x3b82f6, 0.18);
        this.main.fillTriangle(l_B.x, l_B.y, l_C.x, l_C.y, l_A.x, l_A.y);
        this.main.lineStyle(2.5, 0x1d4ed8, 1);
        this.main.strokeTriangle(l_B.x, l_B.y, l_C.x, l_C.y, l_A.x, l_A.y);
        this.lbl('A', l_A.x - 6, l_A.y - 18, '#1d4ed8', '13px');
        this.lbl('B', l_B.x - 22, l_B.y + 8, '#1d4ed8', '13px');
        this.lbl('C', l_C.x + 8, l_C.y + 8, '#1d4ed8', '13px');
        this.lbl(`Area = S`, lCx, l_A.y - 32, '#1e40af', '11px');

        // Right triangle (scaled by k)
        const rCx  = W * 0.72;
        const r2W  = Math.min(b1W * liveK, W * 0.45);
        const r2H  = Math.min(b1H * liveK, H * 0.55);
        const r_B = { x: rCx - r2W / 2, y: centerY + r2H / 2 };
        const r_C = { x: rCx + r2W / 2, y: centerY + r2H / 2 };
        const r_A = { x: rCx, y: centerY - r2H / 2 };

        this.main.fillStyle(0x8b5cf6, 0.18);
        this.main.fillTriangle(r_B.x, r_B.y, r_C.x, r_C.y, r_A.x, r_A.y);
        this.main.lineStyle(2.5, 0x6d28d9, 1);
        this.main.strokeTriangle(r_B.x, r_B.y, r_C.x, r_C.y, r_A.x, r_A.y);
        this.lbl('D', r_A.x - 6, r_A.y - 18, '#6d28d9', '13px');
        this.lbl('E', r_B.x - 22, r_B.y + 8, '#6d28d9', '13px');
        this.lbl('F', r_C.x + 8, r_C.y + 8, '#6d28d9', '13px');
        this.lbl(`Area = k²·S`, rCx, r_A.y - 32, '#5b21b6', '11px');

        // Divider
        this.bg.lineStyle(1.5, 0xcbd5e1, 0.8);
        this.bg.lineBetween(W / 2, 60, W / 2, H - 40);

        // Badge
        this.setLbl('k_badge',    `k = ${liveK.toFixed(2)}`, W / 2, H * 0.13, '#4f46e5', '13px');
        this.setLbl('area_badge2', `Area ratio = k² = ${(liveK ** 2).toFixed(2)}`, W / 2, H * 0.13 + 20, '#7c3aed', '11px');
    }

    // ─────────────────────────────────────────────────────────────────
    // WORLD 5 — Pythagoras & Mastery
    // Shows: right triangle with labelled legs and hypotenuse,
    //        plus classic Pythagorean squares on each side
    // ─────────────────────────────────────────────────────────────────
    private drawWorld5_Pythagoras() {
        const id = this.levelSpec!.id;
        const { cx, cy, triW, triH } = this.baseLayout();

        // Pick leg values per level
        let leg1 = 3, leg2 = 4, hyp = 5;
        if (id === 'lvl-tri-25') { leg1 = 9;  leg2 = 12; hyp = 15; }
        if (id === 'lvl-tri-26') { leg1 = 8;  leg2 = 15; hyp = 17; }
        if (id === 'lvl-tri-27') { leg1 = 15; leg2 = 20; hyp = 25; }
        if (id === 'lvl-tri-28') { leg1 = 5;  leg2 = 12; hyp = 13; }
        if (id === 'lvl-tri-29') { leg1 = 6;  leg2 = 8;  hyp = 10; }
        if (id === 'lvl-tri-30') { leg1 = 5;  leg2 = 12; hyp = 13; }

        // Scale to canvas
        const maxLeg = Math.max(leg1, leg2);
        const pxPerUnit = Math.min((triW * 0.45) / maxLeg, (triH * 0.45) / maxLeg);

        // Right angle at C (bottom-right)
        const Cx = cx + leg1 * pxPerUnit;
        const Cy = cy + leg2 * pxPerUnit * 0.5;
        const Bx = cx - leg1 * pxPerUnit * 0.05;
        const By = Cy;
        const Ax = Cx;
        const Ay = Cy - leg2 * pxPerUnit;

        this.drawTriangle(Bx, By, Cx, Cy, Ax, Ay, 0x3b82f6, 0x1d4ed8, 0.14);
        this.drawRightAngleMarker(Cx, Cy, -1, -1, 14);

        // Vertex labels
        this.lbl('A', Ax + 10, Ay - 8, '#1d4ed8', '14px');
        this.lbl('B', Bx - 26, By + 8, '#1d4ed8', '14px');
        this.lbl('C', Cx + 10, Cy + 10, '#1d4ed8', '14px');

        // Side labels with neon glow
        const liveHyp = this.currentInputVal > 0 ? this.currentInputVal : hyp;

        // BC (horizontal leg)
        const midBCx = (Bx + Cx) / 2; const midBCy = By + 18;
        this.lbl(`a = ${leg1}`, midBCx, midBCy, '#0369a1', '13px');

        // CA (vertical leg)
        const midCAx = Cx + 14; const midCAy = (Cy + Ay) / 2;
        this.lbl(`b = ${leg2}`, midCAx, midCAy, '#0369a1', '13px');

        // AB (hypotenuse) — shown in amber, dynamically updated
        const midABx = (Ax + Bx) / 2 - 14; const midABy = (Ay + By) / 2 - 8;
        this.lbl(`c = ${liveHyp.toFixed(1)}`, midABx - 14, midABy, '#d97706', '13px');

        // Neon glow on hypotenuse
        this.drawNeonLine(Bx, By, Ax, Ay, 0xf59e0b);

        // Pythagoras squares visual
        this.drawPythagorasSquare(Bx, By, Cx, Cy, leg1, 0x3b82f6);  // on leg a
        this.drawPythagorasSquare(Cx, Cy, Ax, Ay, leg2, 0x8b5cf6);  // on leg b
        this.drawPythagorasSquareOnHyp(Bx, By, Ax, Ay, hyp, 0xf59e0b); // on hyp c

        // Formula footer reminder
        this.setLbl('pyth_formula', `c² = a² + b²  →  ${leg1}² + ${leg2}² = ${leg1 ** 2 + leg2 ** 2} = ${hyp}²`,
            cx, Cy + 38, '#374151', '12px');

        // Live accuracy hint
        if (this.currentInputVal > 0) {
            const diff = Math.abs(this.currentInputVal - hyp);
            const hint = diff < 0.5 ? '✓ Correct!' : diff < 3 ? 'Getting close...' : `Hint: try ${hyp}`;
            this.setLbl('live_hint', hint, cx, Cy + 56, diff < 0.5 ? '#10b981' : '#f97316', '12px');
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────────

    private drawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
                          fillColor: number, strokeColor: number, fillAlpha = 0.12) {
        this.main.fillStyle(fillColor, fillAlpha);
        this.main.fillTriangle(x1, y1, x2, y2, x3, y3);
        this.main.lineStyle(2.5, strokeColor, 1.0);
        this.main.strokeTriangle(x1, y1, x2, y2, x3, y3);
        // Vertex dot
        [{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }].forEach(v => {
            this.main.fillStyle(strokeColor, 1);
            this.main.fillCircle(v.x, v.y, 5);
            this.main.fillStyle(0xffffff, 1);
            this.main.fillCircle(v.x, v.y, 2);
        });
    }

    private drawRightAngleMarker(x: number, y: number, dirX: number, dirY: number, size = 12) {
        this.main.lineStyle(1.8, 0x64748b, 0.9);
        this.main.lineBetween(x + dirX * size, y, x + dirX * size, y + dirY * size);
        this.main.lineBetween(x + dirX * size, y + dirY * size, x, y + dirY * size);
    }

    private drawParallelTicks(x1: number, y1: number, x2: number, y2: number, color: number) {
        const mx = (x1 + x2) / 2; const my = (y1 + y2) / 2;
        const dx = x2 - x1; const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 1) return;
        const nx = -dy / len * 6; const ny = dx / len * 6;
        this.main.lineStyle(2, color, 0.9);
        this.main.lineBetween(mx + nx, my + ny, mx - nx, my - ny);
        this.main.lineBetween(mx + nx + dx / len * 5, my + ny + dy / len * 5,
                               mx - nx + dx / len * 5, my - ny + dy / len * 5);
    }

    private drawPythagorasSquare(x1: number, y1: number, x2: number, y2: number,
                                  side: number, color: number) {
        const dx = x2 - x1; const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 1) return;
        const nx = -dy / len; const ny = dx / len;
        const s = Math.min(len, side * 6); // visual-only size
        const sq: [number, number][] = [
            [x1, y1], [x2, y2],
            [x2 + nx * s, y2 + ny * s],
            [x1 + nx * s, y1 + ny * s]
        ];
        this.main.fillStyle(color, 0.07);
        this.main.beginPath();
        this.main.moveTo(sq[0][0], sq[0][1]);
        sq.forEach(([px, py]) => this.main.lineTo(px, py));
        this.main.closePath();
        this.main.fillPath();
        this.main.lineStyle(1.5, color, 0.5);
        this.main.beginPath();
        this.main.moveTo(sq[0][0], sq[0][1]);
        sq.forEach(([px, py]) => this.main.lineTo(px, py));
        this.main.closePath();
        this.main.strokePath();
        // Side label
        const lblX = (sq[0][0] + sq[1][0] + sq[2][0] + sq[3][0]) / 4;
        const lblY = (sq[0][1] + sq[1][1] + sq[2][1] + sq[3][1]) / 4;
        this.setLbl(`sq_${color}`, `${side}²=${side ** 2}`, lblX, lblY, '#64748b', '10px');
    }

    private drawPythagorasSquareOnHyp(Bx: number, By: number, Ax: number, Ay: number,
                                       hyp: number, color: number) {
        const dx = Ax - Bx; const dy = Ay - By;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 1) return;
        const nx = -dy / len; const ny = dx / len;
        const s = Math.min(len, hyp * 4);
        const sq: [number, number][] = [
            [Bx, By], [Ax, Ay],
            [Ax + nx * s, Ay + ny * s],
            [Bx + nx * s, By + ny * s]
        ];
        this.main.fillStyle(color, 0.07);
        this.main.beginPath();
        this.main.moveTo(sq[0][0], sq[0][1]);
        sq.forEach(([px, py]) => this.main.lineTo(px, py));
        this.main.closePath(); this.main.fillPath();
        this.main.lineStyle(1.5, color, 0.5);
        this.main.beginPath();
        this.main.moveTo(sq[0][0], sq[0][1]);
        sq.forEach(([px, py]) => this.main.lineTo(px, py));
        this.main.closePath(); this.main.strokePath();
        const lblX = (sq[0][0] + sq[1][0] + sq[2][0] + sq[3][0]) / 4;
        const lblY = (sq[0][1] + sq[1][1] + sq[2][1] + sq[3][1]) / 4;
        this.setLbl(`sq_hyp`, `${hyp}²=${hyp ** 2}`, lblX, lblY, '#d97706', '10px');
    }

    private drawNeonLine(x1: number, y1: number, x2: number, y2: number, color: number) {
        this.glow.lineStyle(10, color, 0.12);
        this.glow.lineBetween(x1, y1, x2, y2);
        this.glow.lineStyle(4, color, 0.5);
        this.glow.lineBetween(x1, y1, x2, y2);
        this.main.lineStyle(2, 0xffffff, 1);
        this.main.lineBetween(x1, y1, x2, y2);
    }

    private flashOverlay(color: number) {
        this.overlay.clear().fillStyle(color, 0.18).fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.overlay.setAlpha(1);
        this.tweens.add({ targets: this.overlay, alpha: 0, duration: 600, ease: 'Cubic.easeOut' });
    }

    // ── Label helpers ────────────────────────────────────────────────
    /** One-shot text label that moves with redraw cycle */
    private lbl(text: string, x: number, y: number, color = '#1e293b', fontSize = '12px') {
        // These are drawn fresh each frame via setLbl with auto-generated keys
        const key = `${text}_${Math.round(x)}_${Math.round(y)}`;
        this.setLbl(key, text, x, y, color, fontSize);
    }

    private setLbl(key: string, text: string, x: number, y: number, color: string, fontSize = '12px') {
        if (this.labels[key]) {
            this.labels[key].setText(text).setPosition(x, y).setStyle({ color }).setVisible(true);
        } else {
            this.labels[key] = this.add.text(x, y, text, {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize, color, fontStyle: 'bold',
                backgroundColor: '#ffffffcc',
                padding: { x: 5, y: 3 }
            }).setOrigin(0.5, 0.5);
        }
    }

    private resetLabels() {
        Object.values(this.labels).forEach(t => t.destroy());
        this.labels = {};
    }

    // ── Layout helpers ───────────────────────────────────────────────
    private baseLayout() {
        const W = this.cameras.main.width;
        const H = this.cameras.main.height;
        const cx = W / 2;
        const cy = H / 2 + 10;
        const triW = Math.min(W * 0.55, 260);
        const triH = Math.min(H * 0.45, 200);
        return { cx, cy, W, H, triW, triH };
    }

    private worldNumber(): number {
        const id = this.levelSpec?.id ?? '';
        const num = parseInt(id.replace('lvl-tri-', ''), 10);
        if (num >= 1  && num <= 6)  return 1;
        if (num >= 7  && num <= 12) return 2;
        if (num >= 13 && num <= 18) return 3;
        if (num >= 19 && num <= 24) return 4;
        if (num >= 25 && num <= 30) return 5;
        return 1;
    }

    private updateDragHandle() {
        const world = this.worldNumber();
        this.dragHandle.setVisible(world === 1 && this.levelSpec?.id === 'lvl-tri-01');
    }
}
