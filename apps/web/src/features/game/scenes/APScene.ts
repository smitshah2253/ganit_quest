import Phaser, { Scene, GameObjects } from 'phaser';
import { EventBus } from '../engine/EventBus';
import { getLevelSpec } from '@/data/levelSpecs';
import type { LevelSpecification } from '@/data/levelSpecs';
import { soundManager } from '../engine/SoundManager';

const FONT = 'Inter, system-ui, -apple-system, sans-serif';

// ─── Colors (light theme) ─────────────────────────────────────────
const BG      = 0xecf2f7;
const GRID    = 0xcbd5e1;
const KNOWN   = { fill: 0xdbeafe, stroke: 0x3b82f6, text: '#1e40af' }; // blue
const ANSWER  = { fill: 0xfef3c7, stroke: 0xf59e0b, text: '#92400e' }; // amber
const CORRECT = { fill: 0xd1fae5, stroke: 0x10b981, text: '#065f46' }; // green
const WRONG   = { fill: 0xfee2e2, stroke: 0xef4444, text: '#991b1b' }; // red
const BAR_PALETTE = [0x3b82f6, 0x6366f1, 0x8b5cf6, 0xa855f7, 0xec4899, 0xf97316, 0xf59e0b];

export class APScene extends Scene {

    private bgGfx!: GameObjects.Graphics;
    private mainGfx!: GameObjects.Graphics;
    private labels: Record<string, GameObjects.Text> = {};

    private levelSpec: LevelSpecification | null = null;
    private isLevelActive = false;
    private currentInput = 0;
    private lastInput = -9999;
    private answerBlockKey = '';

    constructor() { super('APScene'); }

    // ─────────────────────────────────────────────────────────────────
    create() {
        this.cameras.main.setBackgroundColor('#ecf2f7');
        this.bgGfx   = this.add.graphics();
        this.mainGfx = this.add.graphics();

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
            this.answerBlockKey = '';
            this.drawLevel();
            this.cameras.main.zoomTo(1.06, 350, 'Power2');
            this.time.delayedCall(350, () => this.cameras.main.zoomTo(1, 300, 'Power2'));
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

        const onCorrect = () => { this.flashScreen(0x10b981); this.celebrateSuccess(); };
        const onWrong   = () => this.flashScreen(0xef4444);

        EventBus.on('load-level',              onLoadLevel);
        EventBus.on('user-input-changed',       onUserInput);
        EventBus.on('board-exam-input-changed', onBoardInput);
        EventBus.on('answer-correct',           onCorrect);
        EventBus.on('answer-wrong',             onWrong);

        const cleanup = () => {
            EventBus.off('load-level',              onLoadLevel);
            EventBus.off('user-input-changed',       onUserInput);
            EventBus.off('board-exam-input-changed', onBoardInput);
            EventBus.off('answer-correct',           onCorrect);
            EventBus.off('answer-wrong',             onWrong);
            this.scale.off('resize', onResize);
        };
        this.events.once('shutdown', cleanup);
        this.events.once('destroy',  cleanup);

        const onResize = (gs: Phaser.Structs.Size) => {
            if (!this.cameras?.main) return;
            this.cameras.main.setSize(gs.width, gs.height);
            if (this.isLevelActive) this.drawLevel();
        };
        this.scale.on('resize', onResize);
        EventBus.emit('game-ready');
    }

    update() {
        if (!this.isLevelActive || !this.levelSpec) return;
        if (this.currentInput !== this.lastInput) {
            this.lastInput = this.currentInput;
            this.refreshLive();
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // DRAW LEVEL — routes to the right mode
    // ─────────────────────────────────────────────────────────────────
    private drawLevel() {
        if (!this.levelSpec) return;
        const W = this.cameras.main.width;
        const H = this.cameras.main.height;
        const spec = this.levelSpec;

        this.bgGfx.clear();
        this.mainGfx.clear();
        this.clearLabels();

        // Dot-grid background
        this.bgGfx.fillStyle(BG, 1);
        this.bgGfx.fillRect(0, 0, W, H);
        this.bgGfx.fillStyle(GRID, 0.5);
        for (let x = 20; x < W; x += 26) for (let y = 20; y < H; y += 26)
            this.bgGfx.fillCircle(x, y, 1.1);

        // Mode label (top left)
        const levelNum = parseInt(spec.id.replace('lvl-ap-', ''), 10);
        const worldNum = levelNum <= 6 ? 1 : levelNum <= 12 ? 2 : levelNum <= 18 ? 3 : levelNum <= 24 ? 4 : 5;
        const worldNames = ['', 'Pattern Discovery', 'Common Difference', 'Nth Term Engine', 'Sum Factory', 'Real World'];
        this.txt('w_lbl', `W${worldNum}: ${worldNames[worldNum]}  ·  Level ${levelNum}`, 16, 14, '#3b82f6', '10px', 0, 0);

        // Formula bar at bottom
        this.bgGfx.fillStyle(0xffffff, 0.85);
        this.bgGfx.fillRect(0, H - 34, W, 34);
        this.bgGfx.lineStyle(1, GRID, 1);
        this.bgGfx.lineBetween(0, H - 34, W, H - 34);
        this.txt('formula', `📐  ${spec.formulaDisplay}`, W / 2, H - 17, '#374151', '11px', 0.5, 0.5);

        if (spec.apMode === 'boss')      this.drawBossMode(spec, W, H);
        else if (spec.apMode === 'realworld') this.drawRealWorld(spec, W, H);
        else if (spec.apMode === 'sum')  this.drawSumMode(spec, W, H);
        else                             this.drawSequenceMode(spec, W, H);
    }

    // ─────────────────────────────────────────────────────────────────
    // SEQUENCE MODE  (pattern / difference / nth_term)
    // ─────────────────────────────────────────────────────────────────
    private drawSequenceMode(spec: LevelSpecification, W: number, H: number) {
        const raw   = spec.apSequence ?? [];
        const n     = spec.apN ?? 1;
        const d     = spec.apCommonDiff ?? 0;
        const a     = spec.apFirstTerm ?? 0;
        const aType = spec.apAnswerType ?? 'term';

        // ── Build item list ─────────────────────────────────────────
        type Kind = 'known' | 'answer' | 'target' | 'ellipsis';
        type Item = { val: number | null; kind: Kind; pos: string };
        const items: Item[] = [];

        const sub = (i: number) => ['₁','₂','₃','₄','₅','₆','₇','₈','₉','₁₀'][i - 1] ?? String(i);

        if (aType === 'position') {
            const targetVal = a + (n - 1) * d;
            raw.slice(0, 3).forEach((v, i) => items.push({ val: Number(v), kind: 'known', pos: `a${sub(i + 1)}` }));
            items.push({ val: null, kind: 'ellipsis', pos: '' });
            items.push({ val: targetVal, kind: 'target', pos: `a${sub(n)}` });
        } else if (aType === 'difference') {
            raw.forEach((v, i) => items.push({ val: v === null ? null : Number(v), kind: v === null ? 'known' : 'known', pos: `a${sub(i + 1)}` }));
        } else {
            const highN = n > 6 && raw.indexOf(null) === raw.length - 1;
            if (highN) {
                [0, 1, 2].forEach(i => {
                    const v = raw[i] !== undefined ? Number(raw[i]) : a + i * d;
                    items.push({ val: v, kind: 'known', pos: `a${sub(i + 1)}` });
                });
                items.push({ val: null, kind: 'ellipsis', pos: '' });
                items.push({ val: null, kind: 'answer', pos: `a${sub(n)}` });
            } else {
                raw.forEach((v, i) => items.push({
                    val: v === null ? null : Number(v),
                    kind: v === null ? 'answer' : 'known',
                    pos: `a${sub(i + 1)}`
                }));
            }
        }

        // ── Layout ─────────────────────────────────────────────────
        const isMobile = W < 430;
        const BLOCK_W  = Math.min(isMobile ? 58 : 72, Math.floor((W - 32) / items.length) - (isMobile ? 8 : 10));
        const BLOCK_H  = isMobile ? 56 : 66;
        const ARROW    = isMobile ? 22 : 30;
        const STEP     = BLOCK_W + ARROW;
        const totalW   = items.length * STEP - ARROW;
        const startX   = Math.max(12, (W - totalW) / 2);

        // Belt center Y — put it in upper half so working panel fits below
        const beltY = H * 0.40;

        // ── Belt track ─────────────────────────────────────────────
        const trackPad = 14;
        this.mainGfx.fillStyle(0xffffff, 1);
        this.mainGfx.fillRoundedRect(startX - trackPad, beltY - BLOCK_H / 2 - trackPad, totalW + trackPad * 2, BLOCK_H + trackPad * 2, 14);
        this.mainGfx.lineStyle(2, GRID, 1);
        this.mainGfx.strokeRoundedRect(startX - trackPad, beltY - BLOCK_H / 2 - trackPad, totalW + trackPad * 2, BLOCK_H + trackPad * 2, 14);
        // Belt teeth
        this.mainGfx.fillStyle(GRID, 0.5);
        for (let x = startX; x < startX + totalW; x += 14)
            this.mainGfx.fillRect(x, beltY + BLOCK_H / 2 + 5, 9, 4);

        // ── Blocks ─────────────────────────────────────────────────
        items.forEach((item, i) => {
            const cx = startX + i * STEP + BLOCK_W / 2;

            if (item.kind === 'ellipsis') {
                this.txt(`ell_${i}`, '· · ·', cx, beltY, '#94a3b8', isMobile ? '16px' : '20px', 0.5, 0.5);
                return;
            }

            const pal = item.kind === 'answer' || item.kind === 'target' ? ANSWER : KNOWN;
            const bx = cx - BLOCK_W / 2;
            const by = beltY - BLOCK_H / 2;

            // Glow ring for answer block
            if (item.kind === 'answer' || item.kind === 'target') {
                this.mainGfx.lineStyle(3, pal.stroke, 0.4);
                this.mainGfx.strokeRoundedRect(bx - 4, by - 4, BLOCK_W + 8, BLOCK_H + 8, 14);
            }

            // Block body
            this.mainGfx.fillStyle(pal.fill, 1);
            this.mainGfx.fillRoundedRect(bx, by, BLOCK_W, BLOCK_H, 10);
            this.mainGfx.lineStyle(2, pal.stroke, 1);
            this.mainGfx.strokeRoundedRect(bx, by, BLOCK_W, BLOCK_H, 10);

            // Value text
            const numStr = item.kind === 'answer' ? '?' : (item.val !== null ? String(item.val) : '');
            const fSize  = String(numStr).length > 3 ? '11px' : '16px';
            this.txt(`num_${i}`, numStr, cx, beltY - 6, pal.text, fSize, 0.5, 0.5);
            if (item.kind === 'answer') this.answerBlockKey = `num_${i}`;

            // Position subscript label below block
            if (item.pos) {
                const posColor = item.kind === 'answer' ? '#92400e' : item.kind === 'target' ? '#0369a1' : '#6b7280';
                this.txt(`pos_${i}`, item.pos, cx, beltY + BLOCK_H / 2 + 8, posColor, '9px', 0.5, 0);
            }

            // Jump arc to next block (show +d)
            const next = items[i + 1];
            if (next && next.kind !== 'ellipsis') {
                const arcLabel = aType === 'difference' ? '+d' : (d >= 0 ? `+${d}` : `${d}`);
                const arcColor = d < 0 ? 0xef4444 : 0x3b82f6;
                this.drawArc(cx, beltY - BLOCK_H / 2, STEP, arcColor, arcLabel, `arc_${i}`);
            }
        });

        // ── Answer display badge (for difference / position types) ──
        if (aType === 'difference' || aType === 'position') {
            const prefix = aType === 'difference' ? 'd' : 'n';
            const badgeY = beltY - BLOCK_H / 2 - 44;
            this.mainGfx.fillStyle(0xfff7ed, 1);
            this.mainGfx.fillRoundedRect(W / 2 - 90, badgeY - 16, 180, 32, 10);
            this.mainGfx.lineStyle(2, 0xf59e0b, 1);
            this.mainGfx.strokeRoundedRect(W / 2 - 90, badgeY - 16, 180, 32, 10);
            this.txt('badge_lbl', `▶  Answer (${prefix}) =`, W / 2 - 30, badgeY, '#92400e', '10px', 0.5, 0.5);
            this.txt('badge_val', '?', W / 2 + 60, badgeY, '#f59e0b', '16px', 0.5, 0.5);
        }

        // ── Working panel ───────────────────────────────────────────
        this.drawWorkingPanel(spec, W, H, beltY + BLOCK_H / 2 + 28);

        this.refreshLive();
    }

    // ─────────────────────────────────────────────────────────────────
    // WORKING PANEL — shows live formula substitution
    // ─────────────────────────────────────────────────────────────────
    private drawWorkingPanel(spec: LevelSpecification, W: number, H: number, topY: number) {
        const a    = spec.apFirstTerm ?? 0;
        const d    = spec.apCommonDiff ?? 0;
        const n    = spec.apN ?? 1;
        const panH = Math.min(90, H - 34 - topY - 8);
        if (panH < 30) return;

        const panW  = Math.min(340, W - 24);
        const panX  = (W - panW) / 2;

        this.mainGfx.fillStyle(0xffffff, 0.92);
        this.mainGfx.fillRoundedRect(panX, topY, panW, panH, 10);
        this.mainGfx.lineStyle(1.5, GRID, 1);
        this.mainGfx.strokeRoundedRect(panX, topY, panW, panH, 10);

        const cx = W / 2;
        const aType = spec.apAnswerType ?? 'term';
        const mode  = spec.apMode;

        // Line 1: formula with values substituted
        let line1 = '', line2 = '';
        if (mode === 'sum') {
            line1 = `Sₙ = n/2 × [2a + (n−1)d]`;
            line2 = `S${n} = ${n}/2 × [2×${a} + (${n}−1)×${d}] = ?`;
        } else if (aType === 'difference') {
            line1 = `d = (aₙ − a) ÷ (n − 1)`;
            line2 = `d = (a${n} − ${a}) ÷ (${n}−1) = ?`;
        } else if (aType === 'position') {
            line1 = `aₙ = a + (n−1)d`;
            line2 = `${a + (n - 1) * d} = ${a} + (n−1) × ${d}  →  solve for n`;
        } else {
            line1 = `aₙ = a + (n−1)d`;
            line2 = `a${n} = ${a} + (${n}−1) × ${d} = ${a} + ${(n - 1) * d} = ?`;
        }

        this.txt('wp_l1', line1, cx, topY + 18, '#374151', '10px', 0.5, 0);
        this.txt('wp_l2', line2, cx, topY + 36, '#1d4ed8', '11px', 0.5, 0);
        this.txt('wp_ans', 'Type your answer above ↑', cx, topY + 58, '#9ca3af', '9px', 0.5, 0);
    }

    // ─────────────────────────────────────────────────────────────────
    // SUM MODE
    // ─────────────────────────────────────────────────────────────────
    private drawSumMode(spec: LevelSpecification, W: number, H: number) {
        const terms   = (spec.apSequence ?? []).filter(v => v !== null).map(Number);
        const n       = spec.apN ?? 5;
        const visible = Math.min(terms.length, 7);
        const slice   = terms.slice(0, visible);
        const maxVal  = Math.max(...slice.filter(v => v > 0), 1);

        const headerH = 36;
        const footerH = 34;
        const usableH = H - headerH - footerH - 20;

        // ── Sn answer panel ────────────────────────────────────────
        const panW = Math.min(310, W - 24);
        const panX = (W - panW) / 2;
        const panY = headerH + 6;
        const panH = 58;

        this.mainGfx.fillStyle(0xfff7ed, 1);
        this.mainGfx.fillRoundedRect(panX, panY, panW, panH, 12);
        this.mainGfx.lineStyle(2, 0xf59e0b, 1);
        this.mainGfx.strokeRoundedRect(panX, panY, panW, panH, 12);

        const a = spec.apFirstTerm ?? 0, d = spec.apCommonDiff ?? 0;
        this.txt('sn_lbl', `S${n} = n/2 × [2a + (n−1)d] = ${n}/2 × [2×${a} + (${n}−1)×${d}]`, W / 2, panY + 16, '#92400e', '10px', 0.5, 0.5);
        this.txt('sn_eq',  `= ${n}/2 × ${2 * a + (n - 1) * d}  =`, W / 2 - 20, panY + 38, '#374151', '11px', 0.5, 0.5);
        this.txt('sum_val', '?', W / 2 + 50, panY + 38, '#f59e0b', '18px', 0.5, 0.5);

        // ── Bar chart ──────────────────────────────────────────────
        const isMobile = W < 430;
        const barGap = isMobile ? 4 : 6;
        const BAR_W  = Math.min(isMobile ? 32 : 42, Math.floor((W - 48) / visible) - barGap);
        const MAX_H  = usableH * 0.46;
        const totalBarW = visible * (BAR_W + barGap) - barGap;
        const areaX  = (W - totalBarW) / 2;
        const baseY  = panY + panH + 10 + MAX_H;

        // Ground line
        this.mainGfx.lineStyle(2, 0x94a3b8, 1);
        this.mainGfx.lineBetween(areaX - 10, baseY, areaX + totalBarW + 10, baseY);

        slice.forEach((val, i) => {
            const bh  = Math.max(10, (val / maxVal) * MAX_H);
            const bx  = areaX + i * (BAR_W + barGap);
            const by  = baseY - bh;
            const col = BAR_PALETTE[i % BAR_PALETTE.length];

            // Bar body
            this.mainGfx.fillStyle(col, 0.85);
            this.mainGfx.fillRoundedRect(bx, by, BAR_W, bh, { tl: 5, tr: 5, bl: 0, br: 0 });
            // Shine
            this.mainGfx.fillStyle(0xffffff, 0.2);
            this.mainGfx.fillRoundedRect(bx + 3, by + 4, BAR_W - 6, 7, 3);

            // Gauss ghost bar (paired)
            if (n <= visible) {
                const inv = slice[visible - 1 - i];
                const invH = Math.max(8, (inv / maxVal) * MAX_H);
                this.mainGfx.fillStyle(BAR_PALETTE[(visible - 1 - i) % BAR_PALETTE.length], 0.18);
                this.mainGfx.fillRoundedRect(bx, by - invH, BAR_W, invH, { tl: 0, tr: 0, bl: 4, br: 4 });
            }

            this.txt(`bv_${i}`, String(val), bx + BAR_W / 2, by - 5, '#374151', '9px', 0.5, 1);
            this.txt(`bp_${i}`, `a${['₁','₂','₃','₄','₅','₆','₇'][i] ?? ''}`, bx + BAR_W / 2, baseY + 5, '#6b7280', '9px', 0.5, 0);
        });

        if (n > visible) this.txt('ell_bar', '+ · · ·', areaX + totalBarW + 8, baseY - 16, '#94a3b8', '13px', 0, 0.5);

        // Gauss hint
        if (n <= visible) {
            const hintY = baseY + 20;
            this.mainGfx.fillStyle(0xeff6ff, 1);
            this.mainGfx.fillRoundedRect(areaX - 4, hintY, totalBarW + 8, 22, 6);
            this.txt('gauss', `💡 Gauss: pair first + last = ${slice[0] + slice[visible - 1]}, × ${Math.floor(n / 2)} pairs`, W / 2, hintY + 11, '#1d4ed8', '9px', 0.5, 0.5);
        }

        this.refreshLive();
    }

    // ─────────────────────────────────────────────────────────────────
    // REAL-WORLD MODE (Levels 25–29)
    // ─────────────────────────────────────────────────────────────────
    private drawRealWorld(spec: LevelSpecification, W: number, H: number) {
        const id  = spec.id;
        const cx  = W / 2;
        const cy  = H / 2;
        const val = this.currentInput;
        const tol = spec.tolerance ?? 0;
        const isRight = val !== 0 && Math.abs(val - spec.correctAnswer) <= tol;
        const ansColor = val !== 0 ? (isRight ? '#059669' : '#dc2626') : '#92400e';

        // ── Context card (shared) ──────────────────────────────────
        const cardW = Math.min(300, W - 24);
        const cardX = (W - cardW) / 2;
        const cardY = 32;
        const cardH = 72;

        this.mainGfx.fillStyle(0xffffff, 1);
        this.mainGfx.fillRoundedRect(cardX, cardY, cardW, cardH, 10);
        this.mainGfx.lineStyle(2, 0x3b82f6, 1);
        this.mainGfx.strokeRoundedRect(cardX, cardY, cardW, cardH, 10);

        if (id === 'lvl-ap-25') {
            // Village population
            this.txt('ctx_title', '🏘️  Village Population Growth', cx, cardY + 14, '#1e40af', '12px', 0.5, 0);
            this.txt('ctx_a', `Year 1 population (a) = ${spec.apFirstTerm}`, cx, cardY + 32, '#374151', '10px', 0.5, 0);
            this.txt('ctx_d', `Grows by (d) = ${spec.apCommonDiff} each year`, cx, cardY + 48, '#059669', '10px', 0.5, 0);
            this.txt('ctx_q', `Find: Population in Year ${spec.apN}`, cx, cardY + 62, '#92400e', '10px', 0.5, 0);

            // Simple row of houses
            const houseY = cy + 10;
            const houses = [cx - 100, cx - 50, cx, cx + 50, cx + 100];
            houses.forEach((hx, i) => {
                const hh = 30 + i * 5;
                this.mainGfx.fillStyle(0xfde68a, 1);
                this.mainGfx.fillRect(hx - 14, houseY - hh, 28, hh);
                this.mainGfx.lineStyle(1.5, 0xd97706, 1);
                this.mainGfx.strokeRect(hx - 14, houseY - hh, 28, hh);
                this.mainGfx.fillStyle(0xef4444, 1);
                this.mainGfx.fillTriangle(hx - 18, houseY - hh, hx + 18, houseY - hh, hx, houseY - hh - 18);
                // door
                this.mainGfx.fillStyle(0xb45309, 1);
                this.mainGfx.fillRect(hx - 5, houseY - 14, 10, 14);
                // growing label
                this.txt(`yr_${i}`, `Yr ${i + 1}`, hx, houseY + 8, '#6b7280', '8px', 0.5, 0);
            });
            // Ground
            this.mainGfx.lineStyle(2, 0x6b7280, 0.5);
            this.mainGfx.lineBetween(cx - 140, houseY, cx + 140, houseY);

        } else if (id === 'lvl-ap-26') {
            // Payslip
            this.txt('ctx_title', '💼  Employee Salary — Month 8', cx, cardY + 14, '#1e40af', '12px', 0.5, 0);
            this.txt('ctx_a', `Starting salary (a) = ₹${spec.apFirstTerm}`, cx, cardY + 32, '#374151', '10px', 0.5, 0);
            this.txt('ctx_d', `Monthly increment (d) = ₹${spec.apCommonDiff}`, cx, cardY + 48, '#059669', '10px', 0.5, 0);
            this.txt('ctx_q', `Find: Salary in Month 8`, cx, cardY + 62, '#92400e', '10px', 0.5, 0);

            // Payslip visual
            const pw = Math.min(260, W - 40);
            const px = (W - pw) / 2, py = cy - 50;
            this.mainGfx.fillStyle(0xffffff, 1);
            this.mainGfx.fillRoundedRect(px, py, pw, 120, 8);
            this.mainGfx.lineStyle(1, 0xcbd5e1, 1);
            this.mainGfx.strokeRoundedRect(px, py, pw, 120, 8);
            this.mainGfx.fillStyle(0x1d4ed8, 1);
            this.mainGfx.fillRoundedRect(px, py, pw, 32, 8);
            this.mainGfx.fillRect(px, py + 18, pw, 14);
            this.txt('p_hdr', '📄 PAYSLIP', cx, py + 16, '#ffffff', '11px', 0.5, 0.5);
            this.txt('p_m1', `Month 1 Base Salary:`, px + 12, py + 44, '#6b7280', '10px', 0, 0);
            this.txt('p_m1v', `₹${spec.apFirstTerm}`, px + pw - 12, py + 44, '#374151', '10px', 1, 0);
            this.txt('p_inc', `Per Month Increment:`, px + 12, py + 62, '#6b7280', '10px', 0, 0);
            this.txt('p_incv', `+₹${spec.apCommonDiff}`, px + pw - 12, py + 62, '#059669', '10px', 1, 0);
            this.mainGfx.lineStyle(1, 0xe5e7eb, 1);
            this.mainGfx.lineBetween(px + 10, py + 80, px + pw - 10, py + 80);
            this.txt('p_net', `Month 8 Net Pay:`, px + 12, py + 94, '#374151', '11px', 0, 0);
            this.txt('p_ans_lbl', val !== 0 ? `₹${val}` : '₹ ?', px + pw - 12, py + 94, ansColor, '14px', 1, 0);

        } else if (id === 'lvl-ap-27') {
            // Bricks
            this.txt('ctx_title', '🧱  Brick Staircase Pattern', cx, cardY + 14, '#1e40af', '12px', 0.5, 0);
            this.txt('ctx_a', `Row 1 bricks (a) = ${spec.apFirstTerm}`, cx, cardY + 32, '#374151', '10px', 0.5, 0);
            this.txt('ctx_d', `Extra bricks per row (d) = ${spec.apCommonDiff}`, cx, cardY + 48, '#059669', '10px', 0.5, 0);
            this.txt('ctx_q', `Find: Bricks in Row ${spec.apN}`, cx, cardY + 62, '#92400e', '10px', 0.5, 0);

            // Brick staircase
            const bw = Math.min(20, (W - 60) / 14);
            const bh = Math.min(12, bw * 0.6);
            const baseRowY = cy + 60;
            const aVal = spec.apFirstTerm ?? 3, dVal = spec.apCommonDiff ?? 2;
            for (let row = 0; row < 5; row++) {
                const numB = aVal + row * dVal;
                const rw   = numB * (bw + 1);
                const rx   = cx - rw / 2;
                const ry   = baseRowY - (row + 1) * (bh + 1);
                for (let b = 0; b < numB; b++) {
                    this.mainGfx.fillStyle(row % 2 === 0 ? 0xc2410c : 0xb45309, 1);
                    this.mainGfx.fillRect(rx + b * (bw + 1), ry, bw, bh);
                    this.mainGfx.lineStyle(0.5, 0x7c2d12, 0.7);
                    this.mainGfx.strokeRect(rx + b * (bw + 1), ry, bw, bh);
                }
                this.txt(`row_${row}`, `Row ${row + 1}: ${numB}`, cx + rw / 2 + 8, ry + bh / 2, '#374151', '9px', 0, 0.5);
            }
            this.txt('row_q', `Row ${spec.apN}: ?`, cx + 10, baseRowY - 7 * (bh + 1) + bh / 2, '#92400e', '9px', 0, 0.5);

        } else if (id === 'lvl-ap-28') {
            // Arcade score
            this.txt('ctx_title', '🎮  Arcade Score Tracker', cx, cardY + 14, '#1e40af', '12px', 0.5, 0);
            this.txt('ctx_a', `Round 1 score (a) = ${spec.apFirstTerm}`, cx, cardY + 32, '#374151', '10px', 0.5, 0);
            this.txt('ctx_d', `Bonus per round (d) = ${spec.apCommonDiff}`, cx, cardY + 48, '#059669', '10px', 0.5, 0);
            this.txt('ctx_q', `Find: Score in Round ${spec.apN}`, cx, cardY + 62, '#92400e', '10px', 0.5, 0);

            const scores = [
                { name: '🥇 Round 1', score: spec.apFirstTerm ?? 10 },
                { name: '🥈 Round 2', score: (spec.apFirstTerm ?? 10) + (spec.apCommonDiff ?? 5) },
                { name: '🥉 Round 3', score: (spec.apFirstTerm ?? 10) + 2 * (spec.apCommonDiff ?? 5) },
            ];
            const sW = Math.min(220, W - 40);
            const sX = (W - sW) / 2;
            scores.forEach((s, i) => {
                const sy = cy - 30 + i * 34;
                this.mainGfx.fillStyle(0xf8fafc, 1);
                this.mainGfx.fillRoundedRect(sX, sy, sW, 28, 6);
                this.mainGfx.lineStyle(1, GRID, 1);
                this.mainGfx.strokeRoundedRect(sX, sy, sW, 28, 6);
                this.txt(`sc_n${i}`, s.name, sX + 12, sy + 14, '#374151', '10px', 0, 0.5);
                this.txt(`sc_v${i}`, String(s.score), sX + sW - 12, sy + 14, '#1d4ed8', '11px', 1, 0.5);
            });
            this.txt('sc_q', `Round ${spec.apN} → ?`, cx, cy + 80, '#92400e', '12px', 0.5, 0.5);

        } else if (id === 'lvl-ap-29') {
            // Runner
            this.txt('ctx_title', '🏃  Daily Running Distance', cx, cardY + 14, '#1e40af', '12px', 0.5, 0);
            this.txt('ctx_a', `Day 1 distance (a) = ${spec.apFirstTerm} km`, cx, cardY + 32, '#374151', '10px', 0.5, 0);
            this.txt('ctx_d', `Extra per day (d) = ${spec.apCommonDiff} km`, cx, cardY + 48, '#059669', '10px', 0.5, 0);
            this.txt('ctx_q', `Find: Total in ${spec.apN} days (Sₙ)`, cx, cardY + 62, '#92400e', '10px', 0.5, 0);

            // Progress bars for first 5 days
            const a = spec.apFirstTerm ?? 2, d = spec.apCommonDiff ?? 1;
            const maxD = a + 4 * d;
            const barW = Math.min(160, W - 80);
            for (let day = 0; day < 5; day++) {
                const dist = a + day * d;
                const barFill = (dist / maxD) * barW;
                const bY = cy - 20 + day * 24;
                this.mainGfx.fillStyle(0xe5e7eb, 1);
                this.mainGfx.fillRoundedRect(cx - barW / 2, bY, barW, 14, 7);
                this.mainGfx.fillStyle(0x3b82f6, 1);
                this.mainGfx.fillRoundedRect(cx - barW / 2, bY, barFill, 14, 7);
                this.txt(`d_lbl_${day}`, `Day ${day + 1}:`, cx - barW / 2 - 48, bY + 7, '#374151', '9px', 0, 0.5);
                this.txt(`d_val_${day}`, `${dist} km`, cx + barW / 2 + 6, bY + 7, '#374151', '9px', 0, 0.5);
            }
        }

        // ── Working panel (formula substitution) ───────────────────
        const a   = spec.apFirstTerm ?? 0;
        const d   = spec.apCommonDiff ?? 0;
        const n   = spec.apN ?? 1;
        const mode = spec.apMode;
        const workY = cy + 80;
        const wW = Math.min(300, W - 24);
        const wX = (W - wW) / 2;

        this.mainGfx.fillStyle(0xffffff, 0.95);
        this.mainGfx.fillRoundedRect(wX, workY, wW, 60, 10);
        this.mainGfx.lineStyle(1.5, GRID, 1);
        this.mainGfx.strokeRoundedRect(wX, workY, wW, 60, 10);

        let wLine1 = '', wLine2 = '';
        if (mode === 'realworld' && id === 'lvl-ap-29') {
            wLine1 = `Sₙ = n/2 × [2a + (n−1)d]`;
            wLine2 = `S${n} = ${n}/2 × [${2 * a} + (${n}-1)×${d}] = ?`;
        } else {
            wLine1 = `aₙ = a + (n−1)d`;
            wLine2 = `a${n} = ${a} + (${n}−1) × ${d} = ${a + (n - 1) * d}`;
        }
        this.txt('wl1', wLine1, cx, workY + 18, '#374151', '10px', 0.5, 0.5);
        this.txt('wl2', wLine2, cx, workY + 38, '#1d4ed8', '11px', 0.5, 0.5);

        // Answer badge
        const ansW = 160;
        const ansX = (W - ansW) / 2;
        const ansY = workY + 70;
        this.mainGfx.fillStyle(0xfff7ed, 1);
        this.mainGfx.fillRoundedRect(ansX, ansY, ansW, 32, 8);
        this.mainGfx.lineStyle(2, 0xf59e0b, 1);
        this.mainGfx.strokeRoundedRect(ansX, ansY, ansW, 32, 8);
        this.txt('badge_val', val !== 0 ? String(val) : '?', cx, ansY + 16, ansColor, '16px', 0.5, 0.5);

        this.refreshLive();
    }

    // ─────────────────────────────────────────────────────────────────
    // BOSS MODE (Level 30)
    // ─────────────────────────────────────────────────────────────────
    private drawBossMode(spec: LevelSpecification, W: number, H: number) {
        const cx  = W / 2;
        const val = this.currentInput;
        const tol = spec.tolerance ?? 0;
        const isRight = val !== 0 && Math.abs(val - spec.correctAnswer) <= tol;

        // Banner
        this.mainGfx.fillStyle(0x1e1b4b, 1);
        this.mainGfx.fillRect(0, 30, W, 44);
        this.txt('boss_ttl', '⚔️  BOSS: SEQUENCE MASTER  ⚔️', cx, 52, '#a5b4fc', '14px', 0.5, 0.5);

        // Vault visual
        const vaultR = Math.min(70, W * 0.18);
        const vaultY = H * 0.48;

        this.mainGfx.fillStyle(0x78716c, 1);
        this.mainGfx.fillCircle(cx, vaultY, vaultR);
        this.mainGfx.fillStyle(0x57534e, 1);
        this.mainGfx.fillCircle(cx, vaultY, vaultR - 8);
        this.mainGfx.lineStyle(8, isRight ? 0x22c55e : 0x9ca3af, 1);
        this.mainGfx.lineBetween(cx - vaultR * 0.55, vaultY, cx + vaultR * 0.55, vaultY);
        this.mainGfx.lineBetween(cx, vaultY - vaultR * 0.55, cx, vaultY + vaultR * 0.55);
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
            this.mainGfx.fillStyle(0x44403c, 1);
            this.mainGfx.fillCircle(cx + Math.cos(angle) * (vaultR - 10), vaultY + Math.sin(angle) * (vaultR - 10), 5);
        }
        this.mainGfx.fillStyle(isRight ? 0x22c55e : 0xdc2626, 1);
        this.mainGfx.fillCircle(cx, vaultY, 14);

        // Info panel below vault
        const a = spec.apFirstTerm ?? 5, n = spec.apN ?? 10, sn = spec.correctAnswer;
        const pW = Math.min(280, W - 24), pX = (W - pW) / 2, pY = vaultY + vaultR + 16;
        this.mainGfx.fillStyle(0xffffff, 1);
        this.mainGfx.fillRoundedRect(pX, pY, pW, 74, 10);
        this.mainGfx.lineStyle(1.5, 0x6366f1, 1);
        this.mainGfx.strokeRoundedRect(pX, pY, pW, 74, 10);
        this.txt('bvs_given', `Given: a = ${a}  |  n = ${n}  |  Sₙ = ${sn}`, cx, pY + 14, '#374151', '10px', 0.5, 0.5);
        this.txt('bvs_form', `Sₙ = n/2 × [2a + (n−1)d]  →  solve for d`, cx, pY + 32, '#1e40af', '10px', 0.5, 0.5);
        this.txt('bvs_ans', `d = `, cx - 20, pY + 54, '#374151', '12px', 0.5, 0.5);
        this.txt('badge_val', val !== 0 ? String(val) : '?', cx + 30, pY + 54, isRight ? '#059669' : (val !== 0 ? '#dc2626' : '#92400e'), '18px', 0.5, 0.5);

        this.txt('boss_hint', '🔐 Enter correct d to unlock the vault!', cx, pY + 82, '#6366f1', '10px', 0.5, 0.5);

        this.refreshLive();
    }

    // ─────────────────────────────────────────────────────────────────
    // LIVE REFRESH
    // ─────────────────────────────────────────────────────────────────
    private refreshLive() {
        if (!this.levelSpec) return;
        const spec = this.levelSpec;
        const val  = this.currentInput;
        const tol  = spec.tolerance ?? 0;
        const isRight = val !== 0 && Math.abs(val - spec.correctAnswer) <= tol;
        const col  = val !== 0 ? (isRight ? '#059669' : '#dc2626') : '#92400e';

        const mode  = spec.apMode;
        const aType = spec.apAnswerType ?? 'term';

        if (mode === 'sum') {
            this.labels['sum_val']?.setText(val !== 0 ? String(val) : '?').setColor(col);
        } else if (mode === 'realworld' || mode === 'boss') {
            const badge = this.labels['badge_val'];
            if (badge) {
                let txt = val !== 0 ? String(val) : '?';
                if (spec.id === 'lvl-ap-26') txt = val !== 0 ? `₹${val}` : '₹ ?';
                if (spec.id === 'lvl-ap-29') txt = val !== 0 ? `${val} km` : '? km';
                if (spec.id === 'lvl-ap-27') txt = val !== 0 ? `${val} bricks` : '?';
                badge.setText(txt).setColor(col);
                this.labels['p_ans_lbl']?.setText(spec.id === 'lvl-ap-26' ? (val !== 0 ? `₹${val}` : '₹ ?') : '').setColor(col);
            }
        } else {
            if (aType === 'term') {
                const lbl = this.labels[this.answerBlockKey];
                if (lbl) {
                    const bg = isRight ? CORRECT : (val !== 0 ? WRONG : ANSWER);
                    lbl.setText(val !== 0 ? String(val) : '?').setColor(bg.text);
                }
            } else {
                const badge = this.labels['badge_val'];
                const prefix = aType === 'difference' ? 'd' : 'n';
                badge?.setText(val !== 0 ? `${prefix} = ${val}` : `${prefix} = ?`).setColor(col);
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────────
    private drawArc(cx: number, topY: number, stepW: number, color: number, label: string, key: string) {
        const startX = cx, endX = cx + stepW, midX = (startX + endX) / 2;
        const controlY = topY - 22;
        this.mainGfx.lineStyle(2, color, 0.9);
        const curve = new Phaser.Curves.QuadraticBezier(
            new Phaser.Math.Vector2(startX, topY),
            new Phaser.Math.Vector2(midX, controlY),
            new Phaser.Math.Vector2(endX, topY)
        );
        curve.draw(this.mainGfx, 24);
        this.mainGfx.beginPath();
        this.mainGfx.moveTo(endX, topY);
        this.mainGfx.lineTo(endX - 6, topY - 8);
        this.mainGfx.lineTo(endX + 2, topY - 7);
        this.mainGfx.fillStyle(color, 1);
        this.mainGfx.fillPath();
        this.txt(key, label, midX, controlY - 12, color === 0xef4444 ? '#dc2626' : '#1d4ed8', '10px', 0.5, 0.5);
    }

    private txt(key: string, text: string, x: number, y: number, color: string, fontSize = '11px', ox = 0, oy = 0): GameObjects.Text {
        if (this.labels[key]) { this.labels[key].destroy(); delete this.labels[key]; }
        this.labels[key] = this.add.text(x, y, text, {
            fontFamily: FONT, fontSize, color, fontStyle: 'bold',
        }).setOrigin(ox, oy);
        return this.labels[key];
    }

    private clearLabels() {
        Object.values(this.labels).forEach(t => { try { t.destroy(); } catch { /* noop */ } });
        this.labels = {};
    }

    private flashScreen(color: number) {
        const W = this.cameras.main.width, H = this.cameras.main.height;
        const flash = this.add.graphics();
        flash.fillStyle(color, 0.28).fillRect(0, 0, W, H).setDepth(100);
        this.tweens.add({ targets: flash, alpha: 0, duration: 500, ease: 'Power2', onComplete: () => flash.destroy() });
    }

    private celebrateSuccess() {
        if (!this.scene?.systems) return;
        const W = this.cameras.main.width, H = this.cameras.main.height;
        soundManager.playSuccess();
        try {
            const p = this.add.particles(W / 2, H / 2, 'particle_star', {
                speed: { min: 80, max: 260 }, angle: { min: 0, max: 360 },
                scale: { start: 1, end: 0 }, lifespan: 1300, blendMode: 'ADD',
                tint: [0xffeb3b, 0x4ade80, 0x06b6d4, 0xf97316], quantity: 25, duration: 200
            });
            const t = this.add.text(W / 2, H / 2 - 50, '✅ Excellent!', {
                fontFamily: FONT, fontSize: '28px', color: '#059669', fontStyle: 'bold',
                stroke: '#ffffff', strokeThickness: 5
            }).setOrigin(0.5).setAlpha(0).setScale(0.4).setDepth(200);
            this.tweens.add({ targets: t, scale: 1.1, alpha: 1, duration: 350, ease: 'Back.easeOut',
                yoyo: true, hold: 850, onComplete: () => { t.destroy(); p.destroy(); } });
        } catch { /* noop */ }
    }
}
