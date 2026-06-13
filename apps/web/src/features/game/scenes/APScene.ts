import Phaser, { Scene, GameObjects } from 'phaser';
import { EventBus } from '../engine/EventBus';
import { getLevelSpec } from '@/data/levelSpecs';
import type { LevelSpecification } from '@/data/levelSpecs';
import { soundManager } from '../engine/SoundManager';

const FONT = 'Inter, system-ui, -apple-system, sans-serif';
const BAR_COLORS = [0x3b82f6, 0x6366f1, 0x8b5cf6, 0xa855f7, 0xec4899, 0xf97316, 0xf59e0b];

// Block color palette
const C_KNOWN   = { fill: 0x3b82f6, stroke: 0x2563eb, text: '#ffffff' }; // blue  – known term
const C_ANSWER  = { fill: 0xf97316, stroke: 0xea580c, text: '#ffffff' }; // orange – answer block
const C_TARGET  = { fill: 0x0891b2, stroke: 0x0e7490, text: '#ffffff' }; // teal   – target/locked
const C_EMPTY   = { fill: 0xdde6ef, stroke: 0xb8ccd9, text: '#94a3b8' }; // grey   – null placeholder

export class APScene extends Scene {

    private backgroundGraphics!: GameObjects.Graphics;
    private mainGraphics!: GameObjects.Graphics;
    private labels: Record<string, GameObjects.Text> = {};

    private levelSpec: LevelSpecification | null = null;
    private isLevelActive = false;
    private currentInput = 0;
    private lastInput = -9999;
    private answerLabelKey = '';

    constructor() { super('APScene'); }

    // ─────────────────────────────────────────────────────────────────
    create() {
        this.cameras.main.setBackgroundColor('#ecf2f7');
        this.backgroundGraphics = this.add.graphics();
        this.mainGraphics = this.add.graphics();

        const onLoadLevel = (levelData: any) => {
            if (!this.scene?.systems) return;
            if (!levelData.id.startsWith('lvl-ap-')) {
                this.isLevelActive = false;
                this.scene.start('LevelScene');
                return;
            }
            this.levelSpec = getLevelSpec(levelData.id, levelData);
            this.isLevelActive = true;
            this.currentInput = 0;
            this.lastInput = -9999;
            this.drawLevel();
            this.cameras.main.zoomTo(1.07, 380, 'Power2');
            this.time.delayedCall(380, () => this.cameras.main.zoomTo(1, 320, 'Power2'));
        };

        const onUserInput = (data: { value: string }) => {
            if (!this.isLevelActive) return;
            const v = parseFloat(data.value);
            this.currentInput = isNaN(v) ? 0 : v;
        };

        const onBoardInput = (data: { inputs: string[] }) => {
            if (!this.isLevelActive) return;
            const last = [...(data.inputs ?? [])].reverse().find((s: string) => s !== '') ?? '';
            const v = parseFloat(last);
            this.currentInput = isNaN(v) ? 0 : v;
        };

        const onCorrect = () => {
            this.flashOverlay(0x10b981);
            this.celebrateSuccess();
        };
        const onWrong   = () => this.flashOverlay(0xef4444);

        EventBus.on('load-level', onLoadLevel);
        EventBus.on('user-input-changed', onUserInput);
        EventBus.on('board-exam-input-changed', onBoardInput);
        EventBus.on('answer-correct', onCorrect);
        EventBus.on('answer-wrong', onWrong);

        const cleanup = () => {
            EventBus.off('load-level', onLoadLevel);
            EventBus.off('user-input-changed', onUserInput);
            EventBus.off('board-exam-input-changed', onBoardInput);
            EventBus.off('answer-correct', onCorrect);
            EventBus.off('answer-wrong', onWrong);
            this.scale.off('resize', onResize);
        };
        this.events.once('shutdown', cleanup);
        this.events.once('destroy', cleanup);

        const onResize = (gs: Phaser.Structs.Size) => {
            if (!this.cameras || !this.cameras.main) return;
            this.cameras.main.setSize(gs.width, gs.height);
            if (this.isLevelActive) this.drawLevel();
        };
        this.scale.on('resize', onResize);

        EventBus.emit('game-ready');
    }

    // Live refresh when input changes
    update() {
        if (!this.isLevelActive || !this.levelSpec) return;
        if (this.currentInput !== this.lastInput) {
            this.lastInput = this.currentInput;
            this.refreshAnswer();
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // MAIN DRAW ENTRY
    // ─────────────────────────────────────────────────────────────────
    private drawLevel() {
        if (!this.levelSpec) return;
        const W = this.cameras.main.width;
        const H = this.cameras.main.height;

        this.backgroundGraphics.clear();
        this.mainGraphics.clear();
        this.clearLabels();

        this.backgroundGraphics.fillStyle(0xecf2f7, 1);
        this.backgroundGraphics.fillRect(0, 0, W, H);

        const spec = this.levelSpec;
        this.makeLabel('title', 'AP Sequence Engine', 20, 18, '#475569', '14px', 0, 0);
        this.makeLabel('mode',  `▶ ${this.getModeName(spec.apMode)}`, 20, 38, '#3b82f6', '11px', 0, 0);
        this.makeLabel('formula', `  ${spec.formulaDisplay}  `, 20, H - 12, '#1e293b', '13px', 0, 1, '#ffffffd9');

        if (spec.apMode === 'boss') {
            this.drawBossMode(spec, W, H);
        } else if (spec.apMode === 'realworld') {
            this.drawRealWorldMode(spec, W, H);
        } else if (spec.apMode === 'sum') {
            this.drawSumMode(spec, W, H);
        } else {
            this.drawSequenceMode(spec, W, H);
        }
        this.drawInfoPanel(spec, W);
    }

    // ─────────────────────────────────────────────────────────────────
    // SEQUENCE MODE  — handles term / difference / position answer types
    // ─────────────────────────────────────────────────────────────────
    private drawSequenceMode(spec: LevelSpecification, W: number, H: number) {
        const raw       = spec.apSequence ?? [];
        const n         = spec.apN ?? 1;
        const d         = spec.apCommonDiff ?? 0;
        const a         = spec.apFirstTerm ?? 0;
        const aType     = spec.apAnswerType ?? 'term';

        // ── Build the display item list ──────────────────────────────
        // Each item: { value: number | null, kind: 'known'|'answer'|'target'|'empty'|'ellipsis', label: string }
        type Item = { val: number | null; kind: 'known' | 'answer' | 'target' | 'empty' | 'ellipsis'; posLabel: string };
        const items: Item[] = [];

        if (aType === 'position') {
            // Show first 3 known terms + "..." + target locked block (value we're finding position of)
            const targetVal = a + (n - 1) * d;  // the term whose position is unknown
            const show = raw.slice(0, 3).map(Number);
            show.forEach((v, i) => items.push({ val: v, kind: 'known', posLabel: `a${this.sub(i + 1)}` }));
            items.push({ val: null, kind: 'ellipsis', posLabel: '' });
            items.push({ val: targetVal, kind: 'target', posLabel: `a${this.sub(n)}` });
        } else if (aType === 'difference') {
            // Show known terms; null slots are empty placeholders; the d arrow is the answer
            raw.forEach((v, i) => {
                if (v === null) {
                    items.push({ val: null, kind: 'empty', posLabel: `a${this.sub(i + 1)}` });
                } else {
                    items.push({ val: v as number, kind: 'known', posLabel: `a${this.sub(i + 1)}` });
                }
            });
        } else {
            // apAnswerType === 'term'
            const isHighN = n > 6 && raw.findIndex(v => v === null) === raw.length - 1;
            if (isHighN) {
                // Show first 3 known + "..." + null (nth block)
                [0, 1, 2].forEach(i => {
                    const v = raw[i] !== undefined ? (raw[i] as number) : (a + i * d);
                    items.push({ val: v, kind: 'known', posLabel: `a${this.sub(i + 1)}` });
                });
                items.push({ val: null, kind: 'ellipsis', posLabel: '' });
                items.push({ val: null, kind: 'answer', posLabel: `a${this.sub(n)}` });
            } else {
                raw.forEach((v, i) => {
                    items.push({
                        val: v === null ? null : (v as number),
                        kind: v === null ? 'answer' : 'known',
                        posLabel: `a${this.sub(i + 1)}`
                    });
                });
            }
        }

        // ── Layout ───────────────────────────────────────────────────
        const BLOCK_W = Math.min(68, Math.floor((W - 60) / (items.length * 1.6)));
        const BLOCK_H = 46;
        const ARROW_W = Math.min(44, Math.floor(W / (items.length * 2.5)));
        const STEP_W  = BLOCK_W + ARROW_W;
        const totalW  = items.length * STEP_W - ARROW_W;
        const startX  = Math.max(20, (W - totalW) / 2);
        const beltY   = H * 0.44;

        // Belt track
        this.mainGraphics.fillStyle(0xdde6ef, 1);
        this.mainGraphics.fillRoundedRect(startX - 16, beltY - BLOCK_H / 2 - 10, totalW + 32, BLOCK_H + 20, 12);
        this.mainGraphics.lineStyle(1.5, 0xb8ccd9, 1);
        this.mainGraphics.strokeRoundedRect(startX - 16, beltY - BLOCK_H / 2 - 10, totalW + 32, BLOCK_H + 20, 12);

        // Draw blocks
        items.forEach((item, i) => {
            const cx = startX + i * STEP_W + BLOCK_W / 2;

            if (item.kind === 'ellipsis') {
                this.makeLabel(`blk_${i}`, '· · ·', cx, beltY, '#94a3b8', '16px', 0.5, 0.5);
                return;
            }

            const pal = item.kind === 'answer' ? C_ANSWER
                      : item.kind === 'target'  ? C_TARGET
                      : item.kind === 'empty'   ? C_EMPTY
                      : C_KNOWN;

            // Block body
            this.mainGraphics.fillStyle(pal.fill, 1);
            this.mainGraphics.fillRoundedRect(cx - BLOCK_W / 2, beltY - BLOCK_H / 2, BLOCK_W, BLOCK_H, 10);
            this.mainGraphics.lineStyle(2, pal.stroke, 1);
            this.mainGraphics.strokeRoundedRect(cx - BLOCK_W / 2, beltY - BLOCK_H / 2, BLOCK_W, BLOCK_H, 10);
            // Highlight strip
            if (item.kind !== 'empty') {
                this.mainGraphics.fillStyle(0xffffff, 0.15);
                this.mainGraphics.fillRoundedRect(cx - BLOCK_W / 2 + 4, beltY - BLOCK_H / 2 + 4, BLOCK_W - 8, 8, 4);
            }

            // Number text
            const numStr = item.kind === 'answer' ? '?'
                         : item.kind === 'empty'  ? ''
                         : String(item.val);
            const sz = numStr.length > 4 ? '10px' : numStr.length > 3 ? '12px' : '14px';
            this.makeLabel(`num_${i}`, numStr, cx, beltY - 4, pal.text, sz, 0.5, 0.5);
            if (item.kind === 'answer') this.answerLabelKey = `num_${i}`;

            // Position sub-label
            if (item.posLabel) {
                this.makeLabel(`pos_${i}`, item.posLabel, cx, beltY + BLOCK_H / 2 + 7, pal.text === '#ffffff' ? (item.kind === 'answer' ? '#f97316' : item.kind === 'target' ? '#0891b2' : '#3b82f6') : '#94a3b8', '10px', 0.5, 0);
            }

            // Arrow to next (skip before ellipsis or if last)
            const next = items[i + 1];
            if (next && next.kind !== 'ellipsis' && next.kind !== 'target') {
                const arrowColor = aType === 'difference' ? 0x94a3b8 : (d < 0 ? 0xef4444 : 0x64748b);
                const dLabel = aType === 'difference' ? '?' : (d >= 0 ? `+${d}` : `${d}`);
                const dColor = aType === 'difference' ? '#94a3b8' : (d < 0 ? '#ef4444' : '#64748b');
                this.drawJumpArc(cx, beltY - BLOCK_H / 2, STEP_W, arrowColor, dLabel, dColor, `arr_${i}`);
            } else if (next && next.kind === 'ellipsis') {
                // Small dots gap, no arrow
            } else if (next && next.kind === 'target') {
                // Draw dashed line to target
                this.drawDashedArrow(cx + BLOCK_W / 2 + 2, beltY, ARROW_W, `arr_${i}`);
            }
        });

        // ── Answer badge ─────────────────────────────────────────────
        const badgeY = beltY - BLOCK_H / 2 - 44;
        if (aType === 'difference') {
            this.drawAnswerBadge('d = ?', 'd', W / 2, badgeY, W);
        } else if (aType === 'position') {
            this.drawAnswerBadge('n = ?', 'n', W / 2, badgeY, W);
        }

        // ── Hint text ────────────────────────────────────────────────
        const hint = aType === 'difference' ? 'Find the common difference d between each pair'
                   : aType === 'position'   ? `Find the position n of the highlighted term`
                   : 'Find the missing term on the belt';
        this.makeLabel('hint', hint, W / 2, beltY + BLOCK_H / 2 + 26, '#94a3b8', '10px', 0.5, 0);

        this.refreshAnswer();
    }

    // ─────────────────────────────────────────────────────────────────
    // SUM MODE
    // ─────────────────────────────────────────────────────────────────
    private drawSumMode(spec: LevelSpecification, W: number, H: number) {
        const terms   = (spec.apSequence ?? []).map(Number);
        const n       = spec.apN ?? 5;
        const visible = Math.min(terms.length, 7);
        const slice   = terms.slice(0, visible);
        const maxVal  = Math.max(...slice, 1);

        const BAR_W   = Math.min(44, Math.floor((W - 80) / visible) - 6);
        const MAX_H   = H * 0.30;
        const areaX   = (W - (BAR_W + 6) * visible) / 2;
        const baseY   = H * 0.72;

        // Floor line
        this.mainGraphics.lineStyle(2, 0xb8ccd9, 1);
        this.mainGraphics.lineBetween(areaX - 10, baseY, areaX + (BAR_W + 6) * visible + 10, baseY);

        slice.forEach((val, i) => {
            const bh  = Math.max(8, (val / maxVal) * MAX_H);
            const bx  = areaX + i * (BAR_W + 6);
            const by  = baseY - bh;
            const col = BAR_COLORS[i % BAR_COLORS.length];

            // Base term (normal)
            this.mainGraphics.fillStyle(col, 1);
            this.mainGraphics.fillRoundedRect(bx, by, BAR_W, bh, { tl: 6, tr: 6, bl: 0, br: 0 });
            this.mainGraphics.fillStyle(0xffffff, 0.15);
            this.mainGraphics.fillRoundedRect(bx + 3, by + 3, BAR_W - 6, 8, 3);
            this.makeLabel(`bv_${i}`, String(val), bx + BAR_W / 2, by - 4, '#1e293b', '10px', 0.5, 1);
            this.makeLabel(`bp_${i}`, `a${this.sub(i + 1)}`, bx + BAR_W / 2, baseY + 6, '#475569', '10px', 0.5, 0);

            // Inverted term (Gauss's trick)
            if (visible === n) {
                const invVal = slice[visible - 1 - i];
                const invH = Math.max(8, (invVal / maxVal) * MAX_H);
                const invBy = by - invH; // stacked on top
                this.mainGraphics.fillStyle(BAR_COLORS[(visible - 1 - i) % BAR_COLORS.length], 0.3); // ghost
                this.mainGraphics.fillRoundedRect(bx, invBy, BAR_W, invH, { tl: 0, tr: 0, bl: 6, br: 6 });
                // Label for inverted part
                this.makeLabel(`inv_bv_${i}`, String(invVal), bx + BAR_W / 2, invBy + invH / 2, '#475569', '10px', 0.5, 0.5);
            }
        });

        if (visible === n) {
            this.makeLabel('gauss_hint', '💡 Gauss’s Trick: Duplicate & flip the staircase to form a rectangle!', W/2, baseY - MAX_H - 30, '#0ea5e9', '13px', 0.5, 0.5);
        }

        if (n > visible) {
            this.makeLabel('ellipsis', '+ · · ·', areaX + visible * (BAR_W + 6) + 8, baseY - 20, '#94a3b8', '14px', 0, 0.5);
        }

        // Sum answer panel
        const px = W / 2;
        const py = H * 0.22;
        this.mainGraphics.fillStyle(0xf97316, 0.1);
        this.mainGraphics.fillRoundedRect(px - 120, py - 30, 240, 56, 14);
        this.mainGraphics.lineStyle(2, 0xea580c, 0.5);
        this.mainGraphics.strokeRoundedRect(px - 120, py - 30, 240, 56, 14);
        this.makeLabel('sum_lbl', `S${this.sub(n)} = ?`, px, py - 14, '#475569', '12px', 0.5, 0.5);
        this.makeLabel('sum_val', '___', px, py + 12, '#f97316', '22px', 0.5, 0.5);

        this.makeLabel('hint', `Add all ${n} terms of the AP`, W / 2, H * 0.79, '#94a3b8', '10px', 0.5, 0);

        this.refreshAnswer();
    }

    // ─────────────────────────────────────────────────────────────────
    // REAL WORLD MODE
    // ─────────────────────────────────────────────────────────────────
    private drawRealWorldMode(spec: LevelSpecification, W: number, H: number) {
        const id = spec.id;
        const val = this.currentInput;
        const cx = W / 2;
        const cy = H / 2;

        if (id === 'lvl-ap-25') {
            // Village Skyline (Procedural graphics)
            this.backgroundGraphics.fillStyle(0x0f172a, 1); // Night sky
            this.backgroundGraphics.fillRect(0, 0, W, H);
            
            // Draw stylized village buildings
            this.mainGraphics.fillStyle(0x1e293b, 1);
            this.mainGraphics.fillRect(cx - 150, cy, 60, 100);
            this.mainGraphics.fillStyle(0x334155, 1);
            this.mainGraphics.fillTriangle(cx - 150, cy, cx - 120, cy - 40, cx - 90, cy);
            
            this.mainGraphics.fillStyle(0x0f172a, 1);
            this.mainGraphics.fillRect(cx - 80, cy + 20, 100, 80);
            this.mainGraphics.fillStyle(0x475569, 1);
            this.mainGraphics.fillRect(cx + 40, cy - 30, 80, 130);

            // Windows
            this.mainGraphics.fillStyle(0xfef08a, 0.8);
            for (let i = 0; i < 3; i++) {
                this.mainGraphics.fillRect(cx - 140, cy + 20 + i*25, 12, 12);
                this.mainGraphics.fillRect(cx + 55, cy - 10 + i*30, 20, 15);
            }

            this.makeLabel('title2', 'Population Growth', cx, H*0.15, '#e2e8f0', '20px', 0.5, 0.5);
            
            // Draw Answer
            this.makeLabel('badge_val', val !== 0 ? String(val) : '___', cx, cy - 80, val !== 0 ? '#10b981' : '#f97316', '32px', 0.5, 0.5);
            this.makeLabel('lbl_yr', 'Target Population (Year 7)', cx, cy - 40, '#94a3b8', '14px', 0.5, 0.5);
        } else if (id === 'lvl-ap-26') {
            // Salary Payslip
            this.backgroundGraphics.fillStyle(0x334155, 1);
            this.backgroundGraphics.fillRect(0, 0, W, H);
            
            // Draw Payslip Card
            const pw = 280, ph = 180;
            const px = cx - pw/2, py = cy - ph/2;
            this.mainGraphics.fillStyle(0xffffff, 1);
            this.mainGraphics.fillRoundedRect(px, py, pw, ph, 8);
            this.mainGraphics.lineStyle(2, 0xcbd5e1, 1);
            this.mainGraphics.strokeRoundedRect(px + 10, py + 10, pw - 20, ph - 20, 4);

            this.mainGraphics.fillStyle(0x3b82f6, 1);
            this.mainGraphics.fillCircle(px + 30, py + 30, 12); // Logo

            this.makeLabel('p_title', 'PAYSLIP - MONTH 8', px + 50, py + 22, '#334155', '14px');
            this.makeLabel('p_base', `Base Salary: $${spec.apFirstTerm}`, px + 20, py + 60, '#64748b', '12px');
            this.makeLabel('p_raise', `Monthly Raise: +$${spec.apCommonDiff}`, px + 20, py + 80, '#22c55e', '12px');
            
            this.mainGraphics.lineStyle(1, 0xcbd5e1, 1);
            this.mainGraphics.lineBetween(px + 20, py + 110, px + pw - 20, py + 110);
            
            this.makeLabel('p_tot', 'NET PAY', px + 20, py + 130, '#1e293b', '16px');
            this.makeLabel('badge_val', val !== 0 ? `$${val}` : '$___', px + pw - 20, py + 130, val !== 0 ? '#10b981' : '#f97316', '18px', 1, 0);

        } else if (id === 'lvl-ap-27') {
            // Bricks Stacking
            this.backgroundGraphics.fillStyle(0x87ceeb, 1); // Sky blue
            this.backgroundGraphics.fillRect(0, 0, W, H);
            
            const bw = 40, bh = 20;
            const startY = H - 60;
            // Draw bottom 3 rows procedurally
            for (let row = 0; row < 3; row++) {
                const numBricks = 3 + row * 2;
                const rw = numBricks * bw;
                const rx = cx - rw/2;
                for (let b = 0; b < numBricks; b++) {
                    this.mainGraphics.fillStyle(0xc2410c, 1);
                    this.mainGraphics.fillRect(rx + b*bw + 1, startY - row*bh + 1, bw - 2, bh - 2);
                }
            }

            this.makeLabel('b_title', 'Row 10 Brick Count', cx, H*0.2, '#1e293b', '18px', 0.5, 0.5);
            this.makeLabel('badge_val', val !== 0 ? String(val) : '___', cx, H*0.3, val !== 0 ? '#10b981' : '#f97316', '28px', 0.5, 0.5);

        } else if (id === 'lvl-ap-28') {
            // Arcade Leaderboard
            this.backgroundGraphics.fillStyle(0x09090b, 1);
            this.backgroundGraphics.fillRect(0, 0, W, H);

            // Arcade Frame
            this.mainGraphics.lineStyle(4, 0xef4444, 1);
            this.mainGraphics.strokeRoundedRect(cx - 120, cy - 100, 240, 200, 10);
            this.mainGraphics.lineStyle(2, 0xfca5a5, 1);
            this.mainGraphics.strokeRoundedRect(cx - 116, cy - 96, 232, 192, 6);

            this.makeLabel('l_title', 'HIGH SCORES', cx, cy - 80, '#ef4444', '16px', 0.5, 0.5);
            this.makeLabel('l_1', `1. PlayerA   ${spec.apFirstTerm}`, cx, cy - 40, '#fbbf24', '14px', 0.5, 0.5);
            this.makeLabel('l_2', `2. PlayerB   ${(spec.apFirstTerm ?? 0) + (spec.apCommonDiff ?? 0)}`, cx, cy - 15, '#d1d5db', '14px', 0.5, 0.5);
            this.makeLabel('l_3', `3. PlayerC   ${(spec.apFirstTerm ?? 0) + 2*(spec.apCommonDiff ?? 0)}`, cx, cy + 10, '#b45309', '14px', 0.5, 0.5);
            
            this.makeLabel('badge_val', val !== 0 ? String(val) : '___', cx, cy + 60, val !== 0 ? '#22c55e' : '#f97316', '18px', 0.5, 0.5);

        } else if (id === 'lvl-ap-29') {
            // Running Track
            this.backgroundGraphics.fillStyle(0x4ade80, 1); // Grass
            this.backgroundGraphics.fillRect(0, 0, W, H);
            
            this.mainGraphics.fillStyle(0xb91c1c, 1); // Track red
            this.mainGraphics.fillRect(0, cy - 40, W, 80);
            this.mainGraphics.lineStyle(2, 0xffffff, 1);
            this.mainGraphics.lineBetween(0, cy - 20, W, cy - 20);
            this.mainGraphics.lineBetween(0, cy + 20, W, cy + 20);

            // Stylized runner
            this.mainGraphics.fillStyle(0x1e3a8a, 1);
            this.mainGraphics.fillCircle(cx - 40, cy - 10, 8); // head
            this.mainGraphics.fillRect(cx - 44, cy, 8, 15); // body
            
            this.makeLabel('r_title', 'Runner Distance Tracker', cx, H*0.2, '#064e3b', '18px', 0.5, 0.5);
            this.makeLabel('badge_val', val !== 0 ? `${val} km` : '___ km', cx, H*0.8, val !== 0 ? '#10b981' : '#1e3a8a', '24px', 0.5, 0.5);
        }

        this.refreshAnswer();
    }

    // ─────────────────────────────────────────────────────────────────
    // BOSS MODE
    // ─────────────────────────────────────────────────────────────────
    private drawBossMode(_spec: LevelSpecification, W: number, H: number) {
        const val = this.currentInput;
        const cx = W / 2;
        const cy = H / 2;

        this.backgroundGraphics.fillStyle(0x450a0a, 1); // Dark blood red
        this.backgroundGraphics.fillRect(0, 0, W, H);

        // Boss Banner
        this.mainGraphics.fillStyle(0x7f1d1d, 1);
        this.mainGraphics.fillRect(0, 0, W, 60);
        this.makeLabel('boss_title', '⚠️ BOSS: SEQUENCE MASTER', cx, 30, '#fca5a5', '18px', 0.5, 0.5);

        // Vault Door
        this.mainGraphics.fillStyle(0x94a3b8, 1); // Steel base
        this.mainGraphics.fillCircle(cx, cy + 20, 100);
        this.mainGraphics.fillStyle(0x475569, 1); // Darker inner
        this.mainGraphics.fillCircle(cx, cy + 20, 80);
        
        // Vault handles
        this.mainGraphics.lineStyle(8, 0xcbd5e1, 1);
        this.mainGraphics.beginPath();
        this.mainGraphics.moveTo(cx - 50, cy + 20);
        this.mainGraphics.lineTo(cx + 50, cy + 20);
        this.mainGraphics.moveTo(cx, cy - 30);
        this.mainGraphics.lineTo(cx, cy + 70);
        this.mainGraphics.strokePath();

        this.mainGraphics.fillStyle(0xf87171, 1);
        this.mainGraphics.fillCircle(cx, cy + 20, 20); // Center hub

        this.makeLabel('vault_lbl', 'COMBINATION: d = ?', cx, H - 60, '#fca5a5', '14px', 0.5, 0.5);
        this.makeLabel('badge_val', val !== 0 ? String(val) : '___', cx, H - 30, val !== 0 ? '#22c55e' : '#f97316', '24px', 0.5, 0.5);

        this.refreshAnswer();
    }

    // ─────────────────────────────────────────────────────────────────
    // LIVE ANSWER REFRESH
    // ─────────────────────────────────────────────────────────────────
    private refreshAnswer() {
        if (!this.levelSpec) return;
        const spec    = this.levelSpec;
        const val     = this.currentInput;
        const correct = spec.correctAnswer;
        const tol     = spec.tolerance ?? 0;
        const isRight = val !== 0 && Math.abs(val - correct) <= tol;
        const color   = val !== 0 ? (isRight ? '#22c55e' : '#ef4444') : '#f97316';

        if (spec.apMode === 'sum') {
            this.labels['sum_val']?.setText(val !== 0 ? String(val) : '___').setColor(color);
        } else if (spec.apMode === 'realworld' || spec.apMode === 'boss') {
            const badge = this.labels['badge_val'];
            if (badge) {
                const strVal = val !== 0 ? String(val) : '___';
                let formatted = strVal;
                if (spec.id === 'lvl-ap-26') formatted = val !== 0 ? `$${val}` : '$___';
                if (spec.id === 'lvl-ap-29') formatted = val !== 0 ? `${val} km` : '___ km';
                badge.setText(formatted).setColor(color);
            }
        } else {
            const aType = spec.apAnswerType ?? 'term';
            if (aType === 'term') {
                const lbl = this.labels[this.answerLabelKey];
                if (lbl) lbl.setText(val !== 0 ? String(val) : '?').setColor(isRight ? '#22c55e' : '#ffffff');
            } else if (aType === 'difference') {
                const badge = this.labels['badge_val'];
                if (badge) badge.setText(val !== 0 ? `d = ${val}` : 'd = ?').setColor(color);
            } else if (aType === 'position') {
                const badge = this.labels['badge_val'];
                if (badge) badge.setText(val !== 0 ? `n = ${val}` : 'n = ?').setColor(color);
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────────
    private drawAnswerBadge(initial: string, _prefix: string, cx: number, cy: number, W: number) {
        const bx = Math.max(20, cx - 110);
        const bw = Math.min(220, W - 40);
        this.mainGraphics.fillStyle(0xf97316, 0.08);
        this.mainGraphics.fillRoundedRect(bx, cy - 18, bw, 36, 10);
        this.mainGraphics.lineStyle(1.5, 0xf97316, 0.4);
        this.mainGraphics.strokeRoundedRect(bx, cy - 18, bw, 36, 10);
        this.makeLabel('badge_lbl', '▶  Answer:', bx + 12, cy, '#64748b', '11px', 0, 0.5);
        this.makeLabel('badge_val', initial, cx + 30, cy, '#f97316', '16px', 0.5, 0.5);
    }

    private drawJumpArc(cx: number, topY: number, stepW: number, col: number, label: string, labelColor: string, key: string) {
        // Draw an arc from top-center of one block to the next
        const startX = cx;
        const endX = cx + stepW;
        const midX = (startX + endX) / 2;
        const controlY = topY - 30;

        this.mainGraphics.lineStyle(2, col, 1);
        
        const curve = new Phaser.Curves.QuadraticBezier(
            new Phaser.Math.Vector2(startX, topY),
            new Phaser.Math.Vector2(midX, controlY),
            new Phaser.Math.Vector2(endX, topY)
        );
        curve.draw(this.mainGraphics, 32);

        // Arrow head at endX, topY
        this.mainGraphics.beginPath();
        this.mainGraphics.moveTo(endX, topY);
        this.mainGraphics.lineTo(endX - 6, topY - 8);
        this.mainGraphics.lineTo(endX + 2, topY - 8); // slightly right to make it point down-right
        this.mainGraphics.lineTo(endX, topY);
        this.mainGraphics.fillStyle(col, 1);
        this.mainGraphics.fillPath();

        // Label above the arc
        this.makeLabel(key, label, midX, controlY - 14, labelColor, '11px', 0.5, 0.5);
    }

    private drawDashedArrow(fromX: number, cy: number, arrowW: number, key: string) {
        const ae = fromX + arrowW - 6;
        const seg = 5;
        for (let x = fromX; x < ae - seg; x += seg * 2) {
            this.mainGraphics.lineStyle(1.5, 0x94a3b8, 0.6);
            this.mainGraphics.lineBetween(x, cy, Math.min(x + seg, ae), cy);
        }
        this.mainGraphics.lineStyle(1.5, 0x94a3b8, 0.6);
        this.mainGraphics.lineBetween(ae, cy, ae - 5, cy - 4);
        this.mainGraphics.lineBetween(ae, cy, ae - 5, cy + 4);
        this.makeLabel(key, '…', fromX + (arrowW - 6) / 2, cy - 12, '#94a3b8', '11px', 0.5, 0.5);
    }

    private drawInfoPanel(spec: LevelSpecification, W: number) {
        const parts: string[] = [];
        if (spec.apFirstTerm !== undefined) parts.push(`a = ${spec.apFirstTerm}`);
        if (spec.apCommonDiff !== undefined) parts.push(`d = ${spec.apCommonDiff}`);
        if (spec.apN !== undefined) parts.push(`n = ${spec.apN}`);
        this.makeLabel('info', parts.join('   |   '), W - 16, 20, '#475569', '11px', 1, 0, '#ffffffb0');
    }

    private makeLabel(
        key: string, text: string, x: number, y: number,
        color: string, fontSize = '11px',
        originX = 0, originY = 0,
        bgColor?: string
    ): GameObjects.Text {
        if (this.labels[key]) { this.labels[key].destroy(); delete this.labels[key]; }
        this.labels[key] = this.add.text(x, y, text, {
            fontFamily: FONT,
            fontSize,
            color,
            fontStyle: 'bold',
            ...(bgColor ? { backgroundColor: bgColor, padding: { x: 8, y: 4 } } : {}),
        }).setOrigin(originX, originY);
        return this.labels[key];
    }

    private clearLabels() {
        Object.values(this.labels).forEach(t => { try { t.destroy(); } catch { /* noop */ } });
        this.labels = {};
    }

    private sub(n: number): string {
        const map: Record<string, string> = {
            '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'
        };
        return String(n).split('').map(c => map[c] ?? c).join('');
    }

    private getModeName(mode?: string): string {
        const m: Record<string, string> = {
            pattern:   'Pattern Discovery',
            difference:'Common Difference',
            nth_term:  'Nth Term Engine',
            sum:       'Sum of AP Factory',
            realworld: 'Real World Simulation',
            boss:      'BOSS: Sequence Master',
        };
        return m[mode ?? ''] ?? 'Arithmetic Progression';
    }

    private flashOverlay(color: number) {
        const W = this.cameras.main.width;
        const H = this.cameras.main.height;
        const flash = this.add.graphics();
        flash.fillStyle(color, 0.4);
        flash.fillRect(0, 0, W, H);
        flash.setDepth(100);
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => flash.destroy()
        });
    }

    private celebrateSuccess() {
        if (!this.scene || !this.scene.systems) return;

        const W = this.cameras.main.width;
        const H = this.cameras.main.height;
        const cx = W / 2;
        const cy = H / 2;

        soundManager.playSuccess();

        // Particle burst
        const particles = this.add.particles(cx, cy, 'particle_star', {
            speed: { min: 100, max: 300 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            lifespan: 1500,
            blendMode: 'ADD',
            tint: [0xffeb3b, 0x4ade80, 0x06b6d4],
            quantity: 30,
            duration: 200
        });

        // "Excellent!" text
        const successText = this.add.text(cx, cy - 60, 'Excellent! ✅', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '32px',
            color: '#10b981',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 6
        }).setOrigin(0.5).setAlpha(0).setScale(0.5);

        this.tweens.add({
            targets: successText,
            scale: 1.2,
            alpha: 1,
            duration: 400,
            ease: 'Back.easeOut',
            yoyo: true,
            hold: 800,
            onComplete: () => {
                successText.destroy();
                particles.destroy();
            }
        });
    }
}
