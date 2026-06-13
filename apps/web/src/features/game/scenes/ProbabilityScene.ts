// @ts-nocheck
import { Scene, GameObjects } from 'phaser';
import { EventBus } from '../engine/EventBus';
import { getLevelSpec } from '@/data/levelSpecs';
import type { LevelSpecification } from '@/data/levelSpecs';

// ── Futuristic Lab Palette ────────────────────────────────────────────────────
const BG       = 0x0f1923;
const PANEL    = 0x1a2535;
const BORDER   = 0x6366f1;
const GLOW     = 0x818cf8;
const FAVORABLE= 0x22c55e;
const NEUTRAL  = 0x334155;
const ANSWER   = 0xf97316;
const FONT     = 'Inter, system-ui, -apple-system, sans-serif';

// Suit symbol → color
const SUITS: { sym: string; col: number; name: string }[] = [
  { sym: '♠', col: 0x94a3b8, name: 'Spades'   },
  { sym: '♥', col: 0xef4444, name: 'Hearts'   },
  { sym: '♦', col: 0xf97316, name: 'Diamonds' },
  { sym: '♣', col: 0x94a3b8, name: 'Clubs'    },
];

export class ProbabilityScene extends Scene {

    private bg!: GameObjects.Graphics;
    private g!:  GameObjects.Graphics;
    private labels: Record<string, GameObjects.Text> = {};

    private levelSpec: LevelSpecification | null = null;
    private isLevelActive = false;
    private currentInput  = 0;
    private lastInput     = -9999;

    constructor() { super('ProbabilityScene'); }

    // ─────────────────────────────────────────────────────────────────
    create() {
        this.cameras.main.setBackgroundColor('#0f1923');
        this.bg = this.add.graphics();
        this.g  = this.add.graphics();

        const onLoadLevel = (levelData: any) => {
            if (!this.scene?.systems) return;
            if (!levelData.id.startsWith('lvl-prob-')) {
                this.isLevelActive = false;
                this.scene.start('LevelScene');
                return;
            }
            this.levelSpec = getLevelSpec(levelData.id, levelData);
            this.isLevelActive = true;
            this.currentInput  = 0;
            this.lastInput     = -9999;
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
        this.events.once('destroy',  cleanup);

        const onResize = (gs: Phaser.Structs.Size) => {
            if (!this.cameras || !this.cameras.main) return;
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
            this.refreshAnswer();
        }
    }

    // ═════════════════════════════════════════════════════════════════
    // MAIN DRAW
    // ═════════════════════════════════════════════════════════════════
    private drawLevel() {
        if (!this.levelSpec) return;
        const W = this.cameras.main.width;
        const H = this.cameras.main.height;

        this.bg.clear();
        this.g.clear();
        this.clearLabels();

        // Dark starfield background
        this.bg.fillStyle(BG, 1);
        this.bg.fillRect(0, 0, W, H);
        this.drawGrid(W, H);

        const spec = this.levelSpec;
        this.txt('title', 'Probability Simulation Lab', 20, 16, '#c7d2fe', '14px', 0, 0);
        this.txt('mode', `▶ ${this.getModeName(spec.probMode)}`, 20, 34, '#818cf8', '10px', 0, 0);

        // Formula bar at bottom
        this.g.fillStyle(PANEL, 1);
        this.g.fillRect(0, H - 28, W, 28);
        this.g.lineStyle(1, BORDER, 0.4);
        this.g.lineBetween(0, H - 28, W, H - 28);
        this.txt('formula', `  ${spec.formulaDisplay}  `, W / 2, H - 14, '#c7d2fe', '11px', 0.5, 0.5);

        // Info panel top-right
        this.drawInfoPanel(spec, W);

        switch (spec.probMode) {
            case 'coin':      this.drawCoin(spec, W, H); break;
            case 'two_coin':  this.drawTwoCoin(spec, W, H); break;
            case 'dice':      this.drawDice(spec, W, H); break;
            case 'two_dice':  this.drawTwoDice(spec, W, H); break;
            case 'card':      this.drawCards(spec, W, H); break;
            case 'bag':       this.drawBag(spec, W, H); break;
            case 'formula':   this.drawFormula(spec, W, H); break;
            case 'boss':      this.drawBoss(spec, W, H); break;
            default:          this.drawFormula(spec, W, H);
        }
    }

    // ═════════════════════════════════════════════════════════════════
    // COIN MODE
    // ═════════════════════════════════════════════════════════════════
    private drawCoin(spec: LevelSpecification, W: number, H: number) {
        const favorable = spec.probFavorable ?? [];
        const cy = H * 0.46;
        const r  = Math.min(56, H * 0.12);
        const gap = r * 2.8;
        const cx0 = W / 2 - gap / 2;
        const cx1 = W / 2 + gap / 2;
        const sides = [{ label: 'H', cx: cx0 }, { label: 'T', cx: cx1 }];

        sides.forEach(({ label, cx }) => {
            const isFav = favorable.includes(label);
            const col   = isFav ? FAVORABLE : NEUTRAL;
            const gCol  = isFav ? 0x4ade80 : PANEL;

            // Outer glow
            if (isFav) {
                this.g.fillStyle(FAVORABLE, 0.12);
                this.g.fillCircle(cx, cy, r + 14);
            }
            // Coin body
            this.g.fillStyle(col, 1);
            this.g.fillCircle(cx, cy, r);
            this.g.lineStyle(2.5, isFav ? gCol : BORDER, 1);
            this.g.strokeCircle(cx, cy, r);
            // Inner ring
            this.g.lineStyle(1, 0xffffff, 0.15);
            this.g.strokeCircle(cx, cy, r - 6);

            this.txt(`coin_${label}`, label, cx, cy - 4, '#ffffff', '22px', 0.5, 0.5);
            this.txt(`coin_sub_${label}`, label === 'H' ? 'Heads' : 'Tails', cx, cy + r + 12, isFav ? '#22c55e' : '#64748b', '11px', 0.5, 0);
        });

        this.drawAnswerZone(spec, W, H * 0.72, '?');
        this.txt('hint', 'Count the glowing coin faces', W / 2, H * 0.62, '#475569', '10px', 0.5, 0);
    }

    // ═════════════════════════════════════════════════════════════════
    // TWO COIN MODE
    // ═════════════════════════════════════════════════════════════════
    private drawTwoCoin(spec: LevelSpecification, W: number, H: number) {
        const favorable = spec.probFavorable ?? [];
        const outcomes  = spec.probSampleSpace ?? ['HH', 'HT', 'TH', 'TT'];
        const r   = Math.min(40, H * 0.085);
        const gap = r * 2.8;
        const gx  = W / 2 - gap / 2;
        const gy  = H * 0.40;

        outcomes.forEach((outcome, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const cx = gx + col * gap;
            const cy = gy + row * gap;
            const isFav = favorable.includes(outcome);
            const fillCol = isFav ? FAVORABLE : NEUTRAL;

            if (isFav) {
                this.g.fillStyle(FAVORABLE, 0.1);
                this.g.fillCircle(cx, cy, r + 10);
            }
            this.g.fillStyle(fillCol, 1);
            this.g.fillCircle(cx, cy, r);
            this.g.lineStyle(2, isFav ? 0x4ade80 : BORDER, 1);
            this.g.strokeCircle(cx, cy, r);

            this.txt(`twoc_${i}`, outcome, cx, cy, '#ffffff', '13px', 0.5, 0.5);
        });

        this.drawAnswerZone(spec, W, H * 0.74, '?');
        this.txt('hint', 'Glowing circles = favorable outcomes', W / 2, H * 0.65, '#475569', '10px', 0.5, 0);
    }

    // ═════════════════════════════════════════════════════════════════
    // DICE MODE
    // ═════════════════════════════════════════════════════════════════
    private drawDice(spec: LevelSpecification, W: number, H: number) {
        const favorable = spec.probFavorable ?? [];
        const faces = ['1', '2', '3', '4', '5', '6'];
        const BLK   = Math.min(54, Math.floor((W - 60) / 7));
        const GAP   = BLK + 10;
        const totalW = 6 * GAP - 10;
        const startX = (W - totalW) / 2;
        const cy = H * 0.44;

        faces.forEach((face, i) => {
            const cx = startX + i * GAP + BLK / 2;
            const isFav = favorable.includes(face);
            const fillCol = isFav ? FAVORABLE : NEUTRAL;

            // Glow halo
            if (isFav) {
                this.g.fillStyle(FAVORABLE, 0.12);
                this.g.fillRoundedRect(cx - BLK / 2 - 6, cy - BLK / 2 - 6, BLK + 12, BLK + 12, 12);
            }
            // Die face
            this.g.fillStyle(fillCol, 1);
            this.g.fillRoundedRect(cx - BLK / 2, cy - BLK / 2, BLK, BLK, 10);
            this.g.lineStyle(2, isFav ? 0x4ade80 : BORDER, 1);
            this.g.strokeRoundedRect(cx - BLK / 2, cy - BLK / 2, BLK, BLK, 10);
            // Highlight
            this.g.fillStyle(0xffffff, 0.08);
            this.g.fillRoundedRect(cx - BLK / 2 + 3, cy - BLK / 2 + 3, BLK - 6, 8, 4);

            this.txt(`die_${i}`, face, cx, cy - 3, '#ffffff', '17px', 0.5, 0.5);
            const pip = isFav ? '●' : '○';
            this.txt(`diepip_${i}`, pip, cx, cy + BLK / 2 + 6, isFav ? '#22c55e' : '#334155', '9px', 0.5, 0);
        });

        this.drawAnswerZone(spec, W, H * 0.72, '?');
        this.txt('hint', 'Count the glowing die faces', W / 2, H * 0.62, '#475569', '10px', 0.5, 0);
    }

    // ═════════════════════════════════════════════════════════════════
    // TWO DICE MODE
    // ═════════════════════════════════════════════════════════════════
    private drawTwoDice(spec: LevelSpecification, W: number, H: number) {
        const favorable = spec.probFavorable ?? [];
        const total = spec.probTotalOutcomes ?? 36;

        // Grid backdrop
        const CELL = Math.min(28, Math.floor((W - 80) / 8));
        const gx = (W - 6 * (CELL + 3)) / 2;
        const gy = H * 0.22;

        // Headers
        for (let i = 0; i < 6; i++) {
            const cx = gx + i * (CELL + 3) + CELL / 2;
            this.txt(`gh_${i}`, String(i + 1), cx, gy - 16, '#818cf8', '9px', 0.5, 0.5);
            this.txt(`gv_${i}`, String(i + 1), gx - 14, gy + i * (CELL + 3) + CELL / 2, '#818cf8', '9px', 0.5, 0.5);
        }

        // Grid cells
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                const cx = gx + c * (CELL + 3);
                const cy = gy + r * (CELL + 3);
                const pairStr = `(${r + 1},${c + 1})`;
                const isFav = favorable.includes(pairStr);
                const sum = r + c + 2;

                const fillCol = isFav ? FAVORABLE : PANEL;
                this.g.fillStyle(fillCol, isFav ? 1 : 0.8);
                this.g.fillRoundedRect(cx, cy, CELL, CELL, 4);
                this.g.lineStyle(0.5, isFav ? 0x4ade80 : BORDER, 0.4);
                this.g.strokeRoundedRect(cx, cy, CELL, CELL, 4);

                if (isFav) {
                    this.txt(`cell_${r}_${c}`, String(sum), cx + CELL / 2, cy + CELL / 2, '#ffffff', '8px', 0.5, 0.5);
                }
            }
        }

        // Stats panel
        const py = H * 0.75;
        this.g.fillStyle(PANEL, 1);
        this.g.fillRoundedRect(W / 2 - 130, py - 28, 260, 52, 12);
        this.g.lineStyle(1.5, BORDER, 0.6);
        this.g.strokeRoundedRect(W / 2 - 130, py - 28, 260, 52, 12);
        this.txt('total_lbl', `n(S) = ${total}  |  n(E) = ?`, W / 2, py - 10, '#94a3b8', '11px', 0.5, 0.5);
        this.txt('ans_val', '?', W / 2, py + 12, '#f97316', '20px', 0.5, 0.5);

        this.txt('hint', `${favorable.length > 0 ? favorable.length + ' favorable cells glow' : 'Count favorable outcomes'}`, W / 2, H * 0.87, '#475569', '10px', 0.5, 0);
    }

    // ═════════════════════════════════════════════════════════════════
    // CARD MODE
    // ═════════════════════════════════════════════════════════════════
    private drawCards(spec: LevelSpecification, W: number, H: number) {
        const favorable = spec.probFavorable ?? [];
        const cy = H * 0.44;
        const PW = Math.min(90, Math.floor((W - 60) / 4.8));
        const PH = PW * 1.3;
        const GAP = PW + 14;
        const totalW = 4 * GAP - 14;
        const startX = (W - totalW) / 2;

        // Determine what's favorable:
        // favorable can be ['♥'] (whole suit), ['A♠','A♥','A♦','A♣'] (across suits), ['J','Q','K'] (face cards)
        const isSuitFav = (sym: string) => favorable.includes(sym);
        const isAceFav  = favorable.some(f => f.startsWith('A'));
        const isFaceFav = favorable.some(f => ['J','Q','K'].includes(f));
        const isBlackFav= favorable.includes('♠') && favorable.includes('♣');

        SUITS.forEach((suit, i) => {
            const cx = startX + i * GAP;
            let isFav = isSuitFav(suit.sym)
                     || (isAceFav && favorable.includes(`A${suit.sym}`))
                     || isFaceFav
                     || isBlackFav && (suit.sym === '♠' || suit.sym === '♣');

            const borderCol = isFav ? 0x4ade80 : BORDER;
            const textCol   = isFav ? '#22c55e' : '#94a3b8';

            // Glow
            if (isFav) {
                this.g.fillStyle(FAVORABLE, 0.08);
                this.g.fillRoundedRect(cx - 6, cy - PH / 2 - 6, PW + 12, PH + 12, 14);
            }
            // Panel
            this.g.fillStyle(PANEL, 1);
            this.g.fillRoundedRect(cx, cy - PH / 2, PW, PH, 10);
            this.g.lineStyle(2, borderCol, 1);
            this.g.strokeRoundedRect(cx, cy - PH / 2, PW, PH, 10);

            // Suit symbol
            this.txt(`suit_sym_${i}`, suit.sym, cx + PW / 2, cy - 14, isFav ? '#22c55e' : `#${suit.col.toString(16).padStart(6,'0')}`, '26px', 0.5, 0.5);

            // Count
            const count = isSuitFav(suit.sym) ? 13
                        : isAceFav ? 1
                        : isFaceFav ? 3
                        : isBlackFav && (suit.sym === '♠' || suit.sym === '♣') ? 13 : 13;
            this.txt(`suit_cnt_${i}`, String(count), cx + PW / 2, cy + 10, textCol, '14px', 0.5, 0.5);
            this.txt(`suit_name_${i}`, suit.name, cx + PW / 2, cy + PH / 2 + 10, textCol, '9px', 0.5, 0);
        });

        this.txt('deck_total', '52 cards total', W / 2, H * 0.22, '#475569', '10px', 0.5, 0.5);
        this.drawAnswerZone(spec, W, H * 0.74, '?');
        this.txt('hint', 'Count cards in glowing suit panels', W / 2, H * 0.64, '#475569', '10px', 0.5, 0);
    }

    // ═════════════════════════════════════════════════════════════════
    // BAG MODE
    // ═════════════════════════════════════════════════════════════════
    private drawBag(spec: LevelSpecification, W: number, H: number) {
        const bagColors = spec.probBagColors ?? [];
        const favorable = spec.probFavorable ?? [];
        const favCount  = spec.probFavorableCount ?? 0;
        const total     = spec.probTotalOutcomes ?? 10;
        const ansType   = spec.probAnswerType ?? 'favorable_count';

        // Draw bag outline
        const bx = W / 2;
        const by = H * 0.44;
        const bw = Math.min(240, W * 0.55);
        const bh = Math.min(140, H * 0.28);

        this.g.fillStyle(PANEL, 1);
        this.g.fillEllipse(bx, by, bw, bh);
        this.g.lineStyle(2, BORDER, 0.8);
        this.g.strokeEllipse(bx, by, bw, bh);

        // Bag neck
        this.g.fillStyle(PANEL, 1);
        this.g.fillRoundedRect(bx - 20, by - bh / 2 - 20, 40, 24, 6);
        this.g.lineStyle(2, BORDER, 0.8);
        this.g.strokeRoundedRect(bx - 20, by - bh / 2 - 20, 40, 24, 6);

        // Draw balls inside bag
        const ballR = Math.min(14, (bw * 0.85) / (total * 2.5));
        let ballsPlaced: { x: number; y: number; col: number; isFav: boolean }[] = [];

        bagColors.forEach(({ color, count, hex }) => {
            // Determine if this color is favorable
            const isFavColor = ansType === 'total_count'
                ? true
                : (favorable.length > 0 ? favorable.includes(color) : (
                    // For probAnswerType 'favorable_count', highlight favCount balls
                    // Use the visual mapping heuristic
                    bagColors.indexOf(bagColors.find(b => b.color === color)!) < bagColors.length - 1 &&
                    ballsPlaced.length < favCount
                ));

            for (let j = 0; j < count; j++) {
                ballsPlaced.push({ x: 0, y: 0, col: hex, isFav: isFavColor });
            }
        });

        // Layout balls in rows within ellipse
        const rows = Math.ceil(ballsPlaced.length / 6);
        ballsPlaced.forEach((ball, idx) => {
            const row = Math.floor(idx / 6);
            const col = idx % 6;
            const rowCount = Math.min(6, ballsPlaced.length - row * 6);
            const rowW = rowCount * (ballR * 2 + 4) - 4;
            const bx2 = bx - rowW / 2 + col * (ballR * 2 + 4) + ballR;
            const by2 = by - (rows - 1) * (ballR + 3) / 2 + row * (ballR * 2 + 6);

            if (ball.isFav) {
                this.g.fillStyle(0x4ade80, 0.2);
                this.g.fillCircle(bx2, by2, ballR + 5);
            }
            this.g.fillStyle(ball.col, 1);
            this.g.fillCircle(bx2, by2, ballR);
            this.g.lineStyle(1.5, ball.isFav ? 0x4ade80 : 0x1e293b, 1);
            this.g.strokeCircle(bx2, by2, ballR);
            this.g.fillStyle(0xffffff, 0.25);
            this.g.fillCircle(bx2 - ballR * 0.3, by2 - ballR * 0.3, ballR * 0.3);
        });

        // Color legend
        const legY = by + bh / 2 + 18;
        let legX = W / 2 - bagColors.reduce((a, b) => a + b.count, 0) * 8;
        bagColors.forEach(({ color, count, hex }) => {
            this.g.fillStyle(hex, 1);
            this.g.fillCircle(legX, legY, 6);
            this.txt(`leg_${color}`, `${color[0].toUpperCase()} ×${count}`, legX + 10, legY, '#94a3b8', '9px', 0, 0.5);
            legX += 56;
        });

        this.drawAnswerZone(spec, W, H * 0.82, '?');
        this.txt('hint', `Total: ${total} balls  |  Glowing = favorable`, W / 2, H * 0.74, '#475569', '10px', 0.5, 0);
    }

    // ═════════════════════════════════════════════════════════════════
    // FORMULA MODE
    // ═════════════════════════════════════════════════════════════════
    private drawFormula(spec: LevelSpecification, W: number, H: number) {
        const total   = spec.probTotalOutcomes ?? 6;
        const favCnt  = spec.probFavorableCount ?? 1;
        const ansType = spec.probAnswerType ?? 'decimal';

        const cy = H * 0.40;

        // Big P(E) fraction display
        this.g.fillStyle(PANEL, 1);
        this.g.fillRoundedRect(W / 2 - 150, cy - 70, 300, 128, 18);
        this.g.lineStyle(2, BORDER, 0.8);
        this.g.strokeRoundedRect(W / 2 - 150, cy - 70, 300, 128, 18);

        this.txt('pe_label', 'P(E) =', W / 2 - 80, cy - 20, '#c7d2fe', '18px', 0.5, 0.5);
        this.txt('pe_fav',   String(favCnt), W / 2 + 40, cy - 26, '#22c55e', '24px', 0.5, 0.5);
        // Fraction line
        this.g.lineStyle(2, 0x475569, 1);
        this.g.lineBetween(W / 2 + 10, cy - 5, W / 2 + 70, cy - 5);
        this.txt('pe_tot',   String(total), W / 2 + 40, cy + 16, '#94a3b8', '20px', 0.5, 0.5);

        // Progress meter
        const meterX = W / 2 - 130;
        const meterY = cy + 70;
        const meterW = 260;
        const meterH = 14;
        const ratio  = Math.min(1, favCnt / total);
        this.g.fillStyle(NEUTRAL, 1);
        this.g.fillRoundedRect(meterX, meterY, meterW, meterH, 7);
        this.g.fillStyle(FAVORABLE, 1);
        this.g.fillRoundedRect(meterX, meterY, meterW * ratio, meterH, 7);
        this.g.lineStyle(1.5, BORDER, 0.5);
        this.g.strokeRoundedRect(meterX, meterY, meterW, meterH, 7);
        this.txt('meter_lbl', `${favCnt} out of ${total}`, W / 2, meterY + 20, '#64748b', '10px', 0.5, 0);

        this.drawAnswerZone(spec, W, H * 0.76, ansType === 'decimal' ? '0.?' : '?');
        this.txt('hint', ansType === 'decimal' ? 'Divide favorables by total' : 'Enter the count', W / 2, H * 0.66, '#475569', '10px', 0.5, 0);
    }

    // ═════════════════════════════════════════════════════════════════
    // BOSS MODE — Bag with 4+ color groups
    // ═════════════════════════════════════════════════════════════════
    private drawBoss(spec: LevelSpecification, W: number, H: number) {
        // Reuse bag drawing
        this.drawBag(spec, W, H);

        // Extra: show full probability formula overlay
        const py = H * 0.18;
        this.g.fillStyle(PANEL, 1);
        this.g.fillRoundedRect(W / 2 - 140, py - 20, 280, 38, 10);
        this.g.lineStyle(1.5, GLOW, 0.7);
        this.g.strokeRoundedRect(W / 2 - 140, py - 20, 280, 38, 10);
        this.txt('boss_formula', 'P(E) = n(E) / n(S)  →  ? / ' + (spec.probTotalOutcomes ?? 10), W / 2, py - 1, '#c7d2fe', '12px', 0.5, 0.5);
    }

    // ═════════════════════════════════════════════════════════════════
    // ANSWER ZONE (shared)
    // ═════════════════════════════════════════════════════════════════
    private drawAnswerZone(spec: LevelSpecification, W: number, cy: number, initial: string) {
        const px = W / 2;
        this.g.fillStyle(ANSWER, 0.08);
        this.g.fillRoundedRect(px - 130, cy - 28, 260, 52, 14);
        this.g.lineStyle(2, ANSWER, 0.5);
        this.g.strokeRoundedRect(px - 130, cy - 28, 260, 52, 14);
        this.txt('ans_lbl', spec.probAnswerType === 'total_count' ? 'n(S) = ?' : spec.probAnswerType === 'decimal' ? 'P(E) = ?' : 'n(E) = ?', px, cy - 13, '#94a3b8', '10px', 0.5, 0.5);
        this.txt('ans_val', initial, px, cy + 12, '#f97316', '22px', 0.5, 0.5);
    }

    // ═════════════════════════════════════════════════════════════════
    // LIVE ANSWER REFRESH
    // ═════════════════════════════════════════════════════════════════
    private refreshAnswer() {
        if (!this.levelSpec) return;
        const val     = this.currentInput;
        const correct = this.levelSpec.correctAnswer;
        const tol     = this.levelSpec.tolerance ?? 0;
        const isRight = val !== 0 && Math.abs(val - correct) <= tol;
        const color   = val !== 0 ? (isRight ? '#22c55e' : '#ef4444') : '#f97316';

        const ansType = this.levelSpec.probAnswerType ?? 'favorable_count';
        const display = val !== 0
            ? (ansType === 'decimal' ? val.toFixed(1) : String(val))
            : (ansType === 'decimal' ? '0.?' : '?');

        this.labels['ans_val']?.setText(display).setColor(color);
    }

    // ═════════════════════════════════════════════════════════════════
    // HELPERS
    // ═════════════════════════════════════════════════════════════════
    private drawGrid(W: number, H: number) {
        this.bg.lineStyle(0.5, 0x1e3a5f, 0.25);
        for (let x = 0; x < W; x += 40) { this.bg.lineBetween(x, 0, x, H); }
        for (let y = 0; y < H; y += 40) { this.bg.lineBetween(0, y, W, y); }
    }

    private drawInfoPanel(spec: LevelSpecification, W: number) {
        const parts: string[] = [];
        if (spec.probTotalOutcomes !== undefined) parts.push(`n(S) = ${spec.probTotalOutcomes}`);
        if (spec.probFavorableCount !== undefined) parts.push(`n(E) = ${spec.probFavorableCount}`);
        this.txt('info', parts.join('   |   '), W - 14, 18, '#475569', '10px', 1, 0, '#0f192380');
    }

    private getModeName(mode?: string): string {
        const m: Record<string, string> = {
            coin:     'Coin Flip Simulator',
            two_coin: 'Dual Coin Reactor',
            dice:     'Die Outcome Scanner',
            two_dice: 'Twin Dice Grid',
            card:     'Card Deck Analyzer',
            bag:      'Probability Bag Lab',
            formula:  'P(E) Formula Engine',
            boss:     'BOSS: Quantum Reactor',
        };
        return m[mode ?? ''] ?? 'Probability Lab';
    }

    private txt(
        key: string, text: string, x: number, y: number,
        color: string, fontSize = '11px',
        originX = 0, originY = 0, bgColor?: string
    ): GameObjects.Text {
        if (this.labels[key]) { this.labels[key].destroy(); delete this.labels[key]; }
        this.labels[key] = this.add.text(x, y, text, {
            fontFamily: FONT, fontSize, color,
            fontStyle: 'bold',
            ...(bgColor ? { backgroundColor: bgColor, padding: { x: 6, y: 3 } } : {}),
        }).setOrigin(originX, originY);
        return this.labels[key];
    }

    private clearLabels() {
        Object.values(this.labels).forEach(t => { try { t.destroy(); } catch { /* noop */ } });
        this.labels = {};
    }
}
