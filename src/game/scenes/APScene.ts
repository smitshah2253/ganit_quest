import { Scene, GameObjects } from 'phaser';
import { EventBus } from '../EventBus';
import { getLevelSpec } from '../../data/levelSpecs';
import type { LevelSpecification } from '../../data/levelSpecs';

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

        EventBus.on('load-level', onLoadLevel);
        EventBus.on('user-input-changed', onUserInput);
        EventBus.on('board-exam-input-changed', onBoardInput);

        const cleanup = () => {
            EventBus.off('load-level', onLoadLevel);
            EventBus.off('user-input-changed', onUserInput);
            EventBus.off('board-exam-input-changed', onBoardInput);
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

        if (spec.apMode === 'sum') {
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
                this.drawArrow(cx + BLOCK_W / 2 + 2, beltY, ARROW_W, arrowColor, dLabel, dColor, `arr_${i}`);
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
            this.mainGraphics.fillStyle(col, 1);
            this.mainGraphics.fillRoundedRect(bx, by, BAR_W, bh, { tl: 6, tr: 6, bl: 0, br: 0 });
            this.mainGraphics.fillStyle(0xffffff, 0.15);
            this.mainGraphics.fillRoundedRect(bx + 3, by + 3, BAR_W - 6, 8, 3);
            this.makeLabel(`bv_${i}`, String(val), bx + BAR_W / 2, by - 4, '#1e293b', '10px', 0.5, 1);
            this.makeLabel(`bp_${i}`, `a${this.sub(i + 1)}`, bx + BAR_W / 2, baseY + 6, '#475569', '10px', 0.5, 0);
        });

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

    private drawArrow(fromX: number, cy: number, arrowW: number, col: number, label: string, labelColor: string, key: string) {
        const ae = fromX + arrowW - 10;
        this.mainGraphics.lineStyle(1.5, col, 0.8);
        this.mainGraphics.lineBetween(fromX, cy, ae, cy);
        this.mainGraphics.lineBetween(ae, cy, ae - 5, cy - 4);
        this.mainGraphics.lineBetween(ae, cy, ae - 5, cy + 4);
        this.makeLabel(key, label, fromX + (arrowW - 10) / 2, cy - 12, labelColor, '10px', 0.5, 0.5);
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
}
