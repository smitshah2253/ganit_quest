import Phaser, { Scene, GameObjects } from 'phaser';
import { EventBus } from '../engine/EventBus';
import { getLevelSpec } from '@/data/levelSpecs';
import type { LevelSpecification } from '@/data/levelSpecs';
import { soundManager } from '../engine/SoundManager';

const FONT = 'Inter, system-ui, -apple-system, sans-serif';

// ─── Colors ───────────────────────────────────────────────────────
const GOLD          = 0xFFD700;
const GOLD_DARK     = 0xB8860B;
const ROYAL_BLUE    = 0x1E3A8A;
const BLUE_LIGHT    = 0x3B82F6;
const PURPLE        = 0x7C3AED;
const PURPLE_LIGHT  = 0xA78BFA;
const EMERALD       = 0x059669;
const EMERALD_LIGHT = 0x34D399;
const BG            = 0xecf2f7;
const GRID          = 0xcbd5e1;
const STONE         = 0x78716C;
const STONE_LIGHT   = 0xD6D3D1;

const TEXT_GOLD    = '#B8860B';
const TEXT_BLUE    = '#1E3A8A';
const TEXT_PURPLE  = '#5B21B6';
const TEXT_EMERALD = '#065F46';
const TEXT_DARK    = '#1E293B';
const TEXT_LIGHT   = '#64748B';

export class RealNumbersScene extends Scene {

    private bgGfx!: GameObjects.Graphics;
    private mainGfx!: GameObjects.Graphics;
    private labels: Record<string, GameObjects.Text> = {};

    private levelSpec: LevelSpecification | null = null;
    private isLevelActive = false;
    private currentInput = 0;
    private lastInput = -9999;

    constructor() { super('RealNumbersScene'); }

    // ─────────────────────────────────────────────────────────────────
    create() {
        this.cameras.main.setBackgroundColor('#ecf2f7');
        this.bgGfx   = this.add.graphics();
        this.mainGfx = this.add.graphics();

        const onLoadLevel = (levelData: any) => {
            if (!this.scene?.systems) return;
            if (!levelData.id.startsWith('lvl-rn-')) {
                this.isLevelActive = false;
                this.scene.start('LevelScene');
                return;
            }
            this.levelSpec = getLevelSpec(levelData.id, levelData);
            this.isLevelActive = true;
            this.currentInput = 0;
            this.lastInput = -9999;
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

        // World / level label
        const levelNum = parseInt(spec.id.replace('lvl-rn-', ''), 10);
        const worldNum = levelNum <= 6 ? 1 : levelNum <= 12 ? 2 : levelNum <= 18 ? 3 : levelNum <= 24 ? 4 : 5;
        const worldNames = ['', 'Factor Forest', "Euclid's Temple", 'Prime Factorization Caverns', 'HCF & LCM Factory', 'Decimal Dimension'];
        this.txt('w_lbl', `W${worldNum}: ${worldNames[worldNum]}  ·  Level ${levelNum}`, 16, 14, '#3b82f6', '10px', 0, 0);

        // Formula bar at bottom
        this.bgGfx.fillStyle(0xffffff, 0.85);
        this.bgGfx.fillRect(0, H - 34, W, 34);
        this.bgGfx.lineStyle(1, GRID, 1);
        this.bgGfx.lineBetween(0, H - 34, W, H - 34);
        this.txt('formula', `📐  ${spec.formulaDisplay}`, W / 2, H - 17, '#374151', '11px', 0.5, 0.5);

        // Route to mode-specific draw method
        const mode = (spec as any).rnMode ?? '';
        switch (mode) {
            case 'factor_break':       this.drawFactorBreak(spec, W, H); break;
            case 'factor_gate':        this.drawFactorGate(spec, W, H); break;
            case 'prime_identify':     this.drawPrimeIdentify(spec, W, H); break;
            case 'factor_machine':     this.drawFactorMachine(spec, W, H); break;
            case 'multiply_path':      this.drawMultiplyPath(spec, W, H); break;
            case 'prime_hunt':         this.drawPrimeHunt(spec, W, H); break;
            case 'division_machine':   this.drawDivisionMachine(spec, W, H); break;
            case 'remainder_doors':    this.drawRemainderDoors(spec, W, H); break;
            case 'euclid_maze':        this.drawEuclidMaze(spec, W, H); break;
            case 'algorithm_engine':   this.drawAlgorithmEngine(spec, W, H); break;
            case 'hcf_machine':        this.drawHCFMachine(spec, W, H); break;
            case 'euclid_timed':       this.drawEuclidTimed(spec, W, H); break;
            case 'prime_fragments':    this.drawPrimeFragments(spec, W, H); break;
            case 'factor_tree':        this.drawFactorTree(spec, W, H); break;
            case 'factor_vault':       this.drawFactorVault(spec, W, H); break;
            case 'unique_factor':      this.drawUniqueFactor(spec, W, H); break;
            case 'prime_reactor':      this.drawPrimeReactor(spec, W, H); break;
            case 'pf_boss':            this.drawPFBoss(spec, W, H); break;
            case 'lcm_sync':           this.drawLCMSync(spec, W, H); break;
            case 'hcf_optimize':       this.drawHCFOptimize(spec, W, H); break;
            case 'production_repair':  this.drawProductionRepair(spec, W, H); break;
            case 'gear_balance':       this.drawGearBalance(spec, W, H); break;
            case 'sync_advanced':      this.drawSyncAdvanced(spec, W, H); break;
            case 'hcf_lcm_timed':      this.drawHCFLCMTimed(spec, W, H); break;
            case 'terminating_portal': this.drawTerminatingPortal(spec, W, H); break;
            case 'repeating_stream':   this.drawRepeatingStream(spec, W, H); break;
            case 'rational_irrational': this.drawRationalIrrational(spec, W, H); break;
            case 'dimension_gateway':  this.drawDimensionGateway(spec, W, H); break;
            case 'decimal_classify':   this.drawDecimalClassify(spec, W, H); break;
            case 'final_boss':         this.drawFinalBoss(spec, W, H); break;
            default:                   this.drawFactorBreak(spec, W, H); break;
        }

        this.refreshLive();
    }

    // ═════════════════════════════════════════════════════════════════
    // WORLD 1 — Factor Forest
    // ═════════════════════════════════════════════════════════════════

    // ── Level 1: Factor Break — Hexagonal crystal of 36 ──────────
    private drawFactorBreak(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.38;
        const nums = (spec as any).rnNumbers ?? [36];
        const n = nums[0] ?? 36;

        // Dark forest background
        this.bgGfx.fillStyle(0x0f2419, 0.08);
        this.bgGfx.fillRect(0, 30, W, H - 64);
        // Glowing forest particles
        for (let i = 0; i < 40; i++) {
            const px = Math.random() * W;
            const py = 40 + Math.random() * (H - 100);
            const alpha = 0.15 + Math.random() * 0.25;
            this.bgGfx.fillStyle(EMERALD_LIGHT, alpha);
            this.bgGfx.fillCircle(px, py, 1.5 + Math.random() * 2);
        }

        // Large hexagonal crystal (center)
        const hexR = Math.min(55, W * 0.12);
        this.drawHexagon(this.mainGfx, cx, cy, hexR, GOLD, GOLD_DARK, 3);
        // Inner glow
        this.drawHexagon(this.mainGfx, cx, cy, hexR - 8, 0xFFF8DC, GOLD, 1.5);
        this.txt('crystal_num', String(n), cx, cy, TEXT_GOLD, '24px', 0.5, 0.5);

        // Factor pairs
        const factors: [number, number][] = [];
        for (let i = 1; i <= Math.sqrt(n); i++) {
            if (n % i === 0) factors.push([i, n / i]);
        }

        // Arrange crystal shards in a circle
        const shardR = Math.min(18, W * 0.04);
        const orbitR = hexR + Math.min(70, W * 0.15);
        factors.forEach((pair, idx) => {
            const angle1 = (idx / factors.length) * Math.PI * 2 - Math.PI / 2;
            const angle2 = angle1 + 0.3;
            const x1 = cx + Math.cos(angle1) * orbitR;
            const y1 = cy + Math.sin(angle1) * orbitR;
            const x2 = cx + Math.cos(angle2) * orbitR;
            const y2 = cy + Math.sin(angle2) * orbitR;

            // Connection line from center
            this.mainGfx.lineStyle(1, GOLD, 0.3);
            this.mainGfx.lineBetween(cx, cy, x1, y1);
            this.mainGfx.lineBetween(x1, y1, x2, y2);

            // Crystal shards
            this.drawHexagon(this.mainGfx, x1, y1, shardR, 0xFEF3C7, GOLD, 1.5);
            this.drawHexagon(this.mainGfx, x2, y2, shardR, 0xFEF3C7, GOLD, 1.5);

            this.txt(`f1_${idx}`, String(pair[0]), x1, y1, TEXT_GOLD, '11px', 0.5, 0.5);
            this.txt(`f2_${idx}`, String(pair[1]), x2, y2, TEXT_GOLD, '11px', 0.5, 0.5);
        });

        // Pair labels
        const pairY = cy + orbitR + shardR + 20;
        this.txt('pair_label', `Factor pairs of ${n}: ${factors.map(p => `(${p[0]},${p[1]})`).join('  ')}`, cx, pairY, TEXT_DARK, '10px', 0.5, 0);
        this.txt('count_label', `Total factors: ?`, cx, pairY + 18, TEXT_GOLD, '12px', 0.5, 0);
    }

    // ── Level 2: Factor Gate — Number 48 ─────────────────────────
    private drawFactorGate(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.35;
        const nums = (spec as any).rnNumbers ?? [48];
        const n = nums[0] ?? 48;

        // Temple stone background
        this.bgGfx.fillStyle(STONE_LIGHT, 0.15);
        for (let r = 0; r < 8; r++) {
            this.bgGfx.fillRect(0, 30 + r * 22, W, 20);
            this.bgGfx.lineStyle(0.5, STONE, 0.1);
            this.bgGfx.lineBetween(0, 30 + r * 22, W, 30 + r * 22);
        }

        // Gate — two tall pillars
        const gateW = Math.min(220, W * 0.55);
        const gateH = Math.min(180, H * 0.42);
        const gateX = cx - gateW / 2;
        const gateY = 50;

        // Left pillar
        this.mainGfx.fillStyle(STONE, 1);
        this.mainGfx.fillRect(gateX, gateY, 28, gateH);
        this.mainGfx.lineStyle(1.5, 0x57534e, 1);
        this.mainGfx.strokeRect(gateX, gateY, 28, gateH);
        // Pillar top cap
        this.mainGfx.fillStyle(GOLD_DARK, 1);
        this.mainGfx.fillRect(gateX - 4, gateY - 8, 36, 10);

        // Right pillar
        this.mainGfx.fillStyle(STONE, 1);
        this.mainGfx.fillRect(gateX + gateW - 28, gateY, 28, gateH);
        this.mainGfx.lineStyle(1.5, 0x57534e, 1);
        this.mainGfx.strokeRect(gateX + gateW - 28, gateY, 28, gateH);
        this.mainGfx.fillStyle(GOLD_DARK, 1);
        this.mainGfx.fillRect(gateX + gateW - 32, gateY - 8, 36, 10);

        // Arch top (thick horizontal bar with decorative lines)
        this.mainGfx.fillStyle(STONE, 1);
        this.mainGfx.fillRect(gateX, gateY - 8, gateW, 14);
        this.mainGfx.lineStyle(2, GOLD_DARK, 1);
        this.mainGfx.lineBetween(gateX, gateY - 10, gateX + gateW, gateY - 10);
        this.mainGfx.lineBetween(gateX, gateY + 6, gateX + gateW, gateY + 6);

        // Number inscribed on arch
        this.txt('gate_num', String(n), cx, gateY - 1, '#FFD700', '18px', 0.5, 0.5);

        // Lock mechanism (center of gate)
        const lockY = gateY + gateH * 0.35;
        this.mainGfx.fillStyle(0x44403c, 1);
        this.mainGfx.fillCircle(cx, lockY, 18);
        this.mainGfx.lineStyle(2, GOLD, 1);
        this.mainGfx.strokeCircle(cx, lockY, 18);
        this.mainGfx.fillStyle(GOLD, 1);
        this.mainGfx.fillCircle(cx, lockY, 5);

        // Factor stones grid below gate
        const factorsOf: number[] = [];
        for (let i = 1; i <= n; i++) { if (n % i === 0) factorsOf.push(i); }
        const candidates = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 24, 48];
        const gridCols = Math.min(6, candidates.length);
        const gridRows = Math.ceil(candidates.length / gridCols);
        const tileW = Math.min(44, (W - 40) / gridCols - 4);
        const tileH = 28;
        const gridX = cx - (gridCols * (tileW + 4) - 4) / 2;
        const gridY = gateY + gateH + 16;

        candidates.forEach((num, idx) => {
            const col = idx % gridCols;
            const row = Math.floor(idx / gridCols);
            const tx = gridX + col * (tileW + 4);
            const ty = gridY + row * (tileH + 4);
            const isFactor = factorsOf.includes(num);
            this.mainGfx.fillStyle(isFactor ? 0xd1fae5 : 0xf1f5f9, 1);
            this.mainGfx.fillRoundedRect(tx, ty, tileW, tileH, 6);
            this.mainGfx.lineStyle(1.5, isFactor ? EMERALD : GRID, 1);
            this.mainGfx.strokeRoundedRect(tx, ty, tileW, tileH, 6);
            if (isFactor) {
                this.mainGfx.fillStyle(EMERALD, 0.15);
                this.mainGfx.fillRoundedRect(tx + 2, ty + 2, tileW - 4, 6, 2);
            }
            this.txt(`ft_${idx}`, String(num), tx + tileW / 2, ty + tileH / 2, isFactor ? TEXT_EMERALD : TEXT_LIGHT, '11px', 0.5, 0.5);
        });

        this.txt('gate_q', `How many factors does ${n} have?`, cx, gridY + gridRows * (tileH + 4) + 10, TEXT_DARK, '11px', 0.5, 0);
        this.txt('gate_ans', 'Answer: ?', cx, gridY + gridRows * (tileH + 4) + 28, TEXT_GOLD, '14px', 0.5, 0);
    }

    // ── Level 3: Prime Identify — Prime River ────────────────────
    private drawPrimeIdentify(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;
        const nums = (spec as any).rnNumbers ?? [2, 4, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25];
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];

        // River (wavy blue path)
        const riverW = Math.min(100, W * 0.22);
        this.mainGfx.fillStyle(0x3B82F6, 0.12);
        for (let y = 40; y < H - 40; y += 3) {
            const wobble = Math.sin(y * 0.04) * 20;
            this.mainGfx.fillRect(cx - riverW / 2 + wobble, y, riverW, 4);
        }
        // River center line
        this.mainGfx.lineStyle(1, BLUE_LIGHT, 0.3);
        for (let y = 40; y < H - 40; y += 5) {
            const wobble = Math.sin(y * 0.04) * 20;
            this.mainGfx.lineBetween(cx + wobble - 2, y, cx + wobble + 2, y + 4);
        }

        // Banks — green rectangles on each side
        this.mainGfx.fillStyle(0x22c55e, 0.1);
        this.mainGfx.fillRect(0, 40, cx - riverW / 2 - 20, H - 80);
        this.mainGfx.fillRect(cx + riverW / 2 + 20, 40, W - cx - riverW / 2 - 20, H - 80);

        // Bank labels
        this.txt('bank_prime', '✨ PRIME', cx - riverW / 2 - 50, 48, TEXT_EMERALD, '10px', 0.5, 0);
        this.txt('bank_comp', 'COMPOSITE', cx + riverW / 2 + 50, 48, '#991b1b', '10px', 0.5, 0);

        // Number bubbles on the river
        const isPrime = (n: number): boolean => {
            if (n < 2) return false;
            for (let i = 2; i <= Math.sqrt(n); i++) { if (n % i === 0) return false; }
            return true;
        };

        let primeCount = 0;
        const spacing = Math.min(40, (H - 120) / nums.length);
        nums.forEach((n: number, idx: number) => {
            const wobble = Math.sin((60 + idx * spacing) * 0.04) * 20;
            const bx = cx + wobble;
            const by = 65 + idx * spacing;
            const isP = isPrime(n);
            if (isP) primeCount++;

            const fillColor = isP ? 0xFEF3C7 : 0xFEE2E2;
            const strokeColor = isP ? GOLD : 0xef4444;
            this.mainGfx.fillStyle(fillColor, 0.9);
            this.mainGfx.fillRoundedRect(bx - 20, by - 12, 40, 24, 12);
            this.mainGfx.lineStyle(1.5, strokeColor, 1);
            this.mainGfx.strokeRoundedRect(bx - 20, by - 12, 40, 24, 12);
            if (isP) {
                // Golden glow
                this.mainGfx.lineStyle(2, GOLD, 0.25);
                this.mainGfx.strokeRoundedRect(bx - 23, by - 15, 46, 30, 14);
            }
            this.txt(`rn_${idx}`, String(n), bx, by, isP ? TEXT_GOLD : '#991b1b', '12px', 0.5, 0.5);
        });

        this.txt('prime_count', `Primes found: ? / ${primeCount}`, cx, H - 52, TEXT_EMERALD, '12px', 0.5, 0.5);
    }

    // ── Level 4: Factor Machine — Number 60 ──────────────────────
    private drawFactorMachine(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.45;
        const nums = (spec as any).rnNumbers ?? [60];
        const n = nums[0] ?? 60;
        const gearTeeth = (spec as any).rnGearTeeth ?? [12, 10, 6];

        // Machine frame
        const mW = Math.min(260, W * 0.65);
        const mH = Math.min(260, H * 0.52);
        const mX = cx - mW / 2;
        const mY = cy - mH / 2;

        // Outer frame
        this.mainGfx.fillStyle(0x44403c, 1);
        this.mainGfx.fillRoundedRect(mX - 6, mY - 6, mW + 12, mH + 12, 12);
        this.mainGfx.fillStyle(0x78716c, 1);
        this.mainGfx.fillRoundedRect(mX, mY, mW, mH, 10);
        this.mainGfx.lineStyle(2, 0x57534e, 1);
        this.mainGfx.strokeRoundedRect(mX, mY, mW, mH, 10);

        // Input hopper (top)
        this.mainGfx.fillStyle(0x57534e, 1);
        this.mainGfx.fillTriangle(cx - 30, mY + 8, cx + 30, mY + 8, cx - 15, mY + 35);
        this.mainGfx.fillTriangle(cx - 30, mY + 8, cx + 30, mY + 8, cx + 15, mY + 35);
        this.mainGfx.fillRect(cx - 15, mY + 25, 30, 12);
        this.txt('hopper', String(n), cx, mY + 18, '#FFD700', '14px', 0.5, 0.5);

        // Processing gears (middle)
        const gearY = cy - 10;
        const gearR = Math.min(24, mW * 0.08);
        [-1, 0, 1].forEach((offset, i) => {
            const gx = cx + offset * (gearR * 2.2);
            const teeth = gearTeeth[i] ?? 8;
            this.drawGear(gx, gearY, gearR, teeth, GOLD, GOLD_DARK);
        });

        // Steam particles (small rising circles)
        for (let i = 0; i < 12; i++) {
            const sx = mX + 10 + Math.random() * (mW - 20);
            const sy = mY + 5 + Math.random() * 30;
            this.mainGfx.fillStyle(0xffffff, 0.15 + Math.random() * 0.2);
            this.mainGfx.fillCircle(sx, sy, 2 + Math.random() * 3);
        }

        // Output gauge (bottom)
        this.mainGfx.fillStyle(0x1e293b, 1);
        this.mainGfx.fillRoundedRect(cx - 40, cy + 35, 80, 30, 6);
        this.mainGfx.lineStyle(1.5, GOLD, 1);
        this.mainGfx.strokeRoundedRect(cx - 40, cy + 35, 80, 30, 6);
        this.txt('gauge', String(n), cx, cy + 50, '#FFD700', '16px', 0.5, 0.5);

        // Factor pairs as gear labels
        const factors: [number, number][] = [];
        for (let i = 1; i <= Math.sqrt(n); i++) {
            if (n % i === 0) factors.push([i, n / i]);
        }
        const pairY = cy + mH / 2 + 10;
        factors.forEach((pair, idx) => {
            const px = cx - (factors.length * 40) / 2 + idx * 42;
            this.mainGfx.fillStyle(0xffffff, 0.9);
            this.mainGfx.fillRoundedRect(px, pairY, 38, 22, 4);
            this.mainGfx.lineStyle(1, GOLD_DARK, 0.7);
            this.mainGfx.strokeRoundedRect(px, pairY, 38, 22, 4);
            this.txt(`fp_${idx}`, `${pair[0]}×${pair[1]}`, px + 19, pairY + 11, TEXT_DARK, '8px', 0.5, 0.5);
        });

        this.txt('machine_q', `How many factors does ${n} have?`, cx, pairY + 30, TEXT_DARK, '11px', 0.5, 0);
        this.txt('machine_ans', 'Answer: ?', cx, pairY + 48, TEXT_GOLD, '14px', 0.5, 0);
    }

    // ── Level 5: Multiply Path — Multiples of 6 ─────────────────
    private drawMultiplyPath(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;
        const nums = (spec as any).rnNumbers ?? [6];
        const multiple = nums[0] ?? 6;

        // Grid: 5 columns × 4 rows = 20 nodes
        const cols = 5, rows = 4;
        const nodeR = Math.min(18, (W - 60) / (cols * 3));
        const gapX = Math.min(70, (W - 40) / cols);
        const gapY = Math.min(55, (H - 140) / rows);
        const gridX = cx - ((cols - 1) * gapX) / 2;
        const gridY = 70;

        this.txt('path_title', `Find the PATH through multiples of ${multiple}`, cx, 42, TEXT_BLUE, '12px', 0.5, 0.5);

        // START and END labels
        this.txt('path_start', 'START ▶', gridX - nodeR - 30, gridY + gapY * 1.5, TEXT_EMERALD, '10px', 0.5, 0.5);
        this.txt('path_end', '◀ END', gridX + (cols - 1) * gapX + nodeR + 30, gridY + gapY * 1.5, TEXT_EMERALD, '10px', 0.5, 0.5);

        let num = 1;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const val = num++;
                const nx = gridX + c * gapX;
                const ny = gridY + r * gapY;
                const isMultiple = val % multiple === 0;

                // Connection lines to neighbors
                if (c < cols - 1) {
                    this.mainGfx.lineStyle(1, isMultiple && ((val + 1) % multiple === 0 || val % multiple === 0) ? BLUE_LIGHT : GRID, 0.4);
                    this.mainGfx.lineBetween(nx + nodeR, ny, nx + gapX - nodeR, ny);
                }
                if (r < rows - 1) {
                    this.mainGfx.lineStyle(1, GRID, 0.3);
                    this.mainGfx.lineBetween(nx, ny + nodeR, nx, ny + gapY - nodeR);
                }

                // Node circle
                if (isMultiple) {
                    // Golden glow
                    this.mainGfx.fillStyle(GOLD, 0.15);
                    this.mainGfx.fillCircle(nx, ny, nodeR + 4);
                    this.mainGfx.fillStyle(0xFEF3C7, 1);
                    this.mainGfx.fillCircle(nx, ny, nodeR);
                    this.mainGfx.lineStyle(2, GOLD, 1);
                    this.mainGfx.strokeCircle(nx, ny, nodeR);
                } else {
                    this.mainGfx.fillStyle(0xf1f5f9, 0.7);
                    this.mainGfx.fillCircle(nx, ny, nodeR);
                    this.mainGfx.lineStyle(1, GRID, 0.7);
                    this.mainGfx.strokeCircle(nx, ny, nodeR);
                }
                this.txt(`n_${r}_${c}`, String(val), nx, ny, isMultiple ? TEXT_GOLD : TEXT_LIGHT, isMultiple ? '12px' : '10px', 0.5, 0.5);
            }
        }

        const totalMultiples = Math.floor(cols * rows / multiple);
        this.txt('mult_q', `How many multiples of ${multiple} from 1 to ${cols * rows}?`, cx, gridY + rows * gapY + 16, TEXT_DARK, '11px', 0.5, 0);
        this.txt('mult_ans', 'Answer: ?', cx, gridY + rows * gapY + 34, TEXT_GOLD, '14px', 0.5, 0);
    }

    // ── Level 6: Prime Hunt — Primes 1-50 ────────────────────────
    private drawPrimeHunt(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;
        const cols = 10, rows = 5;

        const isPrime = (n: number): boolean => {
            if (n < 2) return false;
            for (let i = 2; i <= Math.sqrt(n); i++) { if (n % i === 0) return false; }
            return true;
        };

        this.txt('hunt_title', '🗺️ Treasure Map — Find all primes 1-50', cx, 42, TEXT_BLUE, '12px', 0.5, 0.5);

        const tileW = Math.min(32, (W - 30) / cols - 2);
        const tileH = Math.min(28, (H - 140) / rows - 2);
        const gridW = cols * (tileW + 2) - 2;
        const gridX = cx - gridW / 2;
        const gridY = 65;

        // Sieve color legend
        const sieveColors: Record<number, number> = { 2: 0xef4444, 3: 0x3b82f6, 5: 0x22c55e, 7: 0x7c3aed };

        let primeCount = 0;
        for (let i = 1; i <= 50; i++) {
            const col = (i - 1) % cols;
            const row = Math.floor((i - 1) / cols);
            const tx = gridX + col * (tileW + 2);
            const ty = gridY + row * (tileH + 2);
            const isP = isPrime(i);
            if (isP) primeCount++;

            // Tile
            this.mainGfx.fillStyle(isP ? 0xFEF3C7 : 0xf8fafc, 1);
            this.mainGfx.fillRoundedRect(tx, ty, tileW, tileH, 3);
            this.mainGfx.lineStyle(1, isP ? GOLD : GRID, 1);
            this.mainGfx.strokeRoundedRect(tx, ty, tileW, tileH, 3);

            // Treasure chest on primes
            if (isP) {
                this.mainGfx.fillStyle(GOLD, 0.3);
                this.mainGfx.fillRect(tx + 2, ty + 2, tileW - 4, 4);
            }

            // Sieve cross-outs for composites
            if (!isP && i > 1) {
                let sieveColor = GRID;
                for (const p of [2, 3, 5, 7]) {
                    if (i % p === 0 && i !== p) { sieveColor = sieveColors[p]; break; }
                }
                this.mainGfx.lineStyle(1, sieveColor, 0.4);
                this.mainGfx.lineBetween(tx + 2, ty + 2, tx + tileW - 2, ty + tileH - 2);
                this.mainGfx.lineBetween(tx + tileW - 2, ty + 2, tx + 2, ty + tileH - 2);
            }

            this.txt(`ph_${i}`, String(i), tx + tileW / 2, ty + tileH / 2, isP ? TEXT_GOLD : TEXT_LIGHT, '9px', 0.5, 0.5);
        }

        // Legend
        const legY = gridY + rows * (tileH + 2) + 10;
        this.txt('leg_title', 'Sieve of Eratosthenes:', cx, legY, TEXT_DARK, '9px', 0.5, 0);
        const legLabels = [
            { p: 2, color: '#ef4444', label: '÷2' },
            { p: 3, color: '#3b82f6', label: '÷3' },
            { p: 5, color: '#22c55e', label: '÷5' },
            { p: 7, color: '#7c3aed', label: '÷7' },
        ];
        legLabels.forEach((l, i) => {
            this.txt(`leg_${i}`, l.label, cx - 60 + i * 40, legY + 16, l.color, '9px', 0.5, 0);
        });

        this.txt('prime_total', `Primes found: ? / ${primeCount}`, cx, legY + 35, TEXT_EMERALD, '12px', 0.5, 0);
    }

    // ═════════════════════════════════════════════════════════════════
    // WORLD 2 — Euclid's Temple
    // ═════════════════════════════════════════════════════════════════

    // ── Level 7: Division Machine — 135 ÷ 4 ─────────────────────
    private drawDivisionMachine(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;
        const dividend = (spec as any).rnDividend ?? 135;
        const divisor = (spec as any).rnDivisor ?? 4;
        const quotient = Math.floor(dividend / divisor);
        const remainder = dividend % divisor;

        // Machine frame
        const mW = Math.min(280, W * 0.7);
        const mH = Math.min(300, H * 0.58);
        const mX = cx - mW / 2;
        const mY = 42;

        this.mainGfx.fillStyle(0x44403c, 1);
        this.mainGfx.fillRoundedRect(mX - 4, mY - 4, mW + 8, mH + 8, 14);
        this.mainGfx.fillStyle(0x78716c, 1);
        this.mainGfx.fillRoundedRect(mX, mY, mW, mH, 12);

        // Input slot (top)
        this.mainGfx.fillStyle(0x1e293b, 1);
        this.mainGfx.fillRoundedRect(cx - 50, mY + 10, 100, 36, 8);
        this.mainGfx.lineStyle(2, GOLD, 1);
        this.mainGfx.strokeRoundedRect(cx - 50, mY + 10, 100, 36, 8);
        this.txt('div_in', String(dividend), cx, mY + 28, '#FFD700', '20px', 0.5, 0.5);

        // Divisor slot
        this.mainGfx.fillStyle(0x1e3a8a, 1);
        this.mainGfx.fillRoundedRect(cx - 30, mY + 55, 60, 26, 6);
        this.txt('div_by', `÷ ${divisor}`, cx, mY + 68, '#93c5fd', '14px', 0.5, 0.5);

        // Separator pipe
        this.mainGfx.lineStyle(2, 0x57534e, 1);
        this.mainGfx.lineBetween(cx, mY + 82, cx, mY + 100);

        // Groups of balls
        const ballR = Math.min(5, (mW - 40) / (Math.min(quotient, 11) * 3));
        const ballAreaY = mY + 105;
        const ballCols = Math.min(11, quotient);
        const ballRows = Math.ceil(Math.min(quotient, 33) / ballCols);
        const ballGapX = ballR * 2.5;
        const ballGapY = ballR * 2.5;
        const ballStartX = cx - (ballCols * ballGapX) / 2;

        for (let g = 0; g < Math.min(quotient, 33); g++) {
            const col = g % ballCols;
            const row = Math.floor(g / ballCols);
            const bx = ballStartX + col * ballGapX;
            const by = ballAreaY + row * ballGapY;
            this.mainGfx.fillStyle(BLUE_LIGHT, 0.8);
            this.mainGfx.fillCircle(bx, by, ballR);
        }

        // Remainder balls in gold
        const remY = ballAreaY + ballRows * ballGapY + 12;
        for (let r = 0; r < remainder; r++) {
            const rx = cx - ((remainder - 1) * ballGapX) / 2 + r * ballGapX;
            this.mainGfx.fillStyle(GOLD, 1);
            this.mainGfx.fillCircle(rx, remY, ballR + 1);
            this.mainGfx.lineStyle(1, GOLD_DARK, 1);
            this.mainGfx.strokeCircle(rx, remY, ballR + 1);
        }
        this.txt('rem_label', `Remainder: ${remainder}`, cx, remY + ballR + 10, TEXT_GOLD, '10px', 0.5, 0);

        // Equation display
        const eqY = mY + mH - 30;
        this.mainGfx.fillStyle(0x1e293b, 1);
        this.mainGfx.fillRoundedRect(cx - mW / 2 + 10, eqY, mW - 20, 24, 6);
        this.txt('div_eq', `${dividend} = ${divisor} × ${quotient} + ${remainder}`, cx, eqY + 12, '#93c5fd', '11px', 0.5, 0.5);

        // Gears decoration
        this.drawGear(mX + 20, mY + mH / 2, 12, 8, STONE, 0x57534e);
        this.drawGear(mX + mW - 20, mY + mH / 2, 12, 8, STONE, 0x57534e);

        this.txt('div_q', `What is the remainder when ${dividend} ÷ ${divisor}?`, cx, mY + mH + 14, TEXT_DARK, '11px', 0.5, 0);
        this.txt('div_ans', 'Answer: ?', cx, mY + mH + 32, TEXT_GOLD, '14px', 0.5, 0);
    }

    // ── Level 8: Remainder Doors — Temple Doors ──────────────────
    private drawRemainderDoors(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;

        // Three division problems
        const problems = [
            { dividend: 97, divisor: 7 },
            { dividend: 156, divisor: 11 },
            { dividend: 243, divisor: 16 },
        ];

        // Temple pillars on sides
        this.mainGfx.fillStyle(STONE, 0.5);
        this.mainGfx.fillRect(0, 40, 16, H - 80);
        this.mainGfx.fillRect(W - 16, 40, 16, H - 80);

        // Torch effects
        for (const tx of [8, W - 8]) {
            for (let i = 0; i < 3; i++) {
                this.mainGfx.fillStyle(0xf97316, 0.3 - i * 0.08);
                this.mainGfx.fillCircle(tx, 80 + i * 120, 8 + i * 2);
            }
            this.mainGfx.fillStyle(0xfbbf24, 0.5);
            this.mainGfx.fillCircle(tx, 80, 4);
        }

        this.txt('doors_title', '🏛️ Temple of Remainders', cx, 42, TEXT_PURPLE, '13px', 0.5, 0);

        const doorW = Math.min(80, (W - 50) / 3 - 10);
        const doorH = Math.min(140, H * 0.32);
        const doorGap = Math.min(16, (W - 3 * doorW - 30) / 2);
        const doorsX = cx - (3 * doorW + 2 * doorGap) / 2;
        const doorY = 70;

        problems.forEach((prob, idx) => {
            const dx = doorsX + idx * (doorW + doorGap);
            const rem = prob.dividend % prob.divisor;

            // Door body
            this.mainGfx.fillStyle(0x78716c, 1);
            this.mainGfx.fillRect(dx, doorY, doorW, doorH);
            this.mainGfx.lineStyle(1.5, STONE, 1);
            this.mainGfx.strokeRect(dx, doorY, doorW, doorH);

            // Arch top (semicircle)
            this.mainGfx.fillStyle(0x78716c, 1);
            this.mainGfx.fillCircle(dx + doorW / 2, doorY, doorW / 2);
            this.mainGfx.lineStyle(1.5, STONE, 1);
            this.mainGfx.strokeCircle(dx + doorW / 2, doorY, doorW / 2);

            // Door decorative lines
            for (let l = 1; l <= 3; l++) {
                this.mainGfx.lineStyle(0.5, GOLD, 0.3);
                this.mainGfx.lineBetween(dx + 6, doorY + l * (doorH / 4), dx + doorW - 6, doorY + l * (doorH / 4));
            }

            // Problem inscription
            this.txt(`door_prob_${idx}`, `${prob.dividend} ÷ ${prob.divisor}`, dx + doorW / 2, doorY + 20, '#FFD700', '10px', 0.5, 0.5);

            // Door handle
            this.mainGfx.fillStyle(GOLD, 1);
            this.mainGfx.fillCircle(dx + doorW - 12, doorY + doorH * 0.55, 4);

            // Remainder options as stone buttons
            const optionY = doorY + doorH + 10;
            const options = [rem, rem + 2, rem - 1 < 0 ? rem + 3 : rem - 1];
            options.sort(() => Math.random() - 0.5);
            options.forEach((opt, oi) => {
                const oy = optionY + oi * 22;
                this.mainGfx.fillStyle(0xf8fafc, 1);
                this.mainGfx.fillRoundedRect(dx + 4, oy, doorW - 8, 18, 4);
                this.mainGfx.lineStyle(1, opt === rem ? EMERALD : GRID, 1);
                this.mainGfx.strokeRoundedRect(dx + 4, oy, doorW - 8, 18, 4);
                this.txt(`opt_${idx}_${oi}`, String(opt), dx + doorW / 2, oy + 9, opt === rem ? TEXT_EMERALD : TEXT_LIGHT, '10px', 0.5, 0.5);
            });
        });

        this.txt('doors_q', 'What is the remainder of the first door (97÷7)?', cx, doorY + doorH + 80, TEXT_DARK, '10px', 0.5, 0);
        this.txt('doors_ans', 'Answer: ?', cx, doorY + doorH + 98, TEXT_GOLD, '14px', 0.5, 0);
    }

    // ── Level 9: Euclid Maze — HCF(196, 38846) ──────────────────
    private drawEuclidMaze(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;
        const a = (spec as any).rnNumbers?.[0] ?? 38846;
        const b = (spec as any).rnNumbers?.[1] ?? 196;

        // Compute Euclid's algorithm steps
        const steps: { a: number; b: number; q: number; r: number }[] = [];
        let aa = Math.max(a, b), bb = Math.min(a, b);
        while (bb > 0) {
            const q = Math.floor(aa / bb);
            const r = aa % bb;
            steps.push({ a: aa, b: bb, q, r });
            aa = bb;
            bb = r;
        }
        const hcf = steps[steps.length - 1]?.b ?? 1;

        this.txt('maze_title', `🧩 Euclid's Maze — HCF(${a}, ${b})`, cx, 42, TEXT_PURPLE, '12px', 0.5, 0.5);

        // Draw junction nodes in a vertical chain
        const nodeR = Math.min(22, W * 0.05);
        const startY = 70;
        const stepH = Math.min(50, (H - 140) / (steps.length + 1));

        steps.forEach((step, idx) => {
            const ny = startY + idx * stepH;
            const nx = cx + (idx % 2 === 0 ? -20 : 20);

            // Purple rune effects
            this.mainGfx.fillStyle(PURPLE, 0.08);
            this.mainGfx.fillCircle(nx, ny, nodeR + 8);

            // Junction node
            this.mainGfx.fillStyle(idx === steps.length - 1 ? 0xd1fae5 : 0xede9fe, 1);
            this.mainGfx.fillCircle(nx, ny, nodeR);
            this.mainGfx.lineStyle(2, idx === steps.length - 1 ? EMERALD : PURPLE, 1);
            this.mainGfx.strokeCircle(nx, ny, nodeR);

            // Values at node
            this.txt(`mz_val_${idx}`, `${step.a},${step.b}`, nx, ny - 3, TEXT_PURPLE, '8px', 0.5, 0.5);
            this.txt(`mz_r_${idx}`, `r=${step.r}`, nx, ny + 8, idx === steps.length - 1 ? TEXT_EMERALD : TEXT_LIGHT, '7px', 0.5, 0.5);

            // Path/arrow to next node
            if (idx < steps.length - 1) {
                const nextX = cx + ((idx + 1) % 2 === 0 ? -20 : 20);
                const nextY = startY + (idx + 1) * stepH;
                this.mainGfx.lineStyle(1.5, PURPLE_LIGHT, 0.6);
                this.mainGfx.lineBetween(nx, ny + nodeR, nextX, nextY - nodeR);
            }

            // Step label on right
            this.txt(`mz_step_${idx}`, `${step.a} = ${step.b}×${step.q} + ${step.r}`, cx + 80, ny, TEXT_DARK, '8px', 0, 0.5);
        });

        // Final HCF
        const finalY = startY + steps.length * stepH;
        this.mainGfx.fillStyle(GOLD, 0.15);
        this.mainGfx.fillRoundedRect(cx - 60, finalY, 120, 28, 8);
        this.mainGfx.lineStyle(2, GOLD, 1);
        this.mainGfx.strokeRoundedRect(cx - 60, finalY, 120, 28, 8);
        this.txt('maze_hcf', `HCF = ?`, cx, finalY + 14, TEXT_GOLD, '14px', 0.5, 0.5);
    }

    // ── Level 10: Algorithm Engine — HCF(420, 130) ───────────────
    private drawAlgorithmEngine(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;
        const a = (spec as any).rnNumbers?.[0] ?? 420;
        const b = (spec as any).rnNumbers?.[1] ?? 130;

        const steps: { a: number; b: number; q: number; r: number }[] = [];
        let aa = Math.max(a, b), bb = Math.min(a, b);
        while (bb > 0) {
            const q = Math.floor(aa / bb);
            const r = aa % bb;
            steps.push({ a: aa, b: bb, q, r });
            aa = bb;
            bb = r;
        }

        this.txt('eng_title', `⚙️ Algorithm Engine — HCF(${a}, ${b})`, cx, 42, TEXT_BLUE, '12px', 0.5, 0.5);

        // Engine frame
        const engW = Math.min(300, W * 0.78);
        const engH = Math.min(220, H * 0.48);
        const engX = cx - engW / 2;
        const engY = 65;

        this.mainGfx.fillStyle(0xffffff, 1);
        this.mainGfx.fillRoundedRect(engX, engY, engW, engH, 10);
        this.mainGfx.lineStyle(2, ROYAL_BLUE, 1);
        this.mainGfx.strokeRoundedRect(engX, engY, engW, engH, 10);

        // Pipes on sides
        this.mainGfx.fillStyle(0x94a3b8, 1);
        this.mainGfx.fillRect(engX - 6, engY + 20, 6, 30);
        this.mainGfx.fillRect(engX + engW, engY + 20, 6, 30);

        // Row headers
        this.txt('eng_hdr', 'dividend = divisor × quotient + remainder', cx, engY + 14, TEXT_BLUE, '9px', 0.5, 0);

        const rowH = Math.min(38, (engH - 50) / (steps.length + 1));
        steps.forEach((step, idx) => {
            const ry = engY + 32 + idx * rowH;
            const rowBg = idx % 2 === 0 ? 0xf8fafc : 0xeff6ff;

            this.mainGfx.fillStyle(rowBg, 1);
            this.mainGfx.fillRect(engX + 8, ry, engW - 16, rowH - 4);
            this.mainGfx.lineStyle(0.5, GRID, 0.5);
            this.mainGfx.strokeRect(engX + 8, ry, engW - 16, rowH - 4);

            // Some values shown as blanks (golden slots)
            const showQ = idx === 0; // First row: fill in quotient
            this.txt(`er_${idx}`,
                `${step.a} = ${step.b} × ${showQ ? '?' : step.q} + ${step.r}`,
                cx, ry + (rowH - 4) / 2, TEXT_DARK, '10px', 0.5, 0.5);

            // Arrow down
            if (idx < steps.length - 1) {
                this.mainGfx.lineStyle(1.5, BLUE_LIGHT, 0.6);
                this.mainGfx.lineBetween(cx, ry + rowH - 4, cx, ry + rowH);
                this.mainGfx.fillStyle(BLUE_LIGHT, 0.6);
                this.mainGfx.fillTriangle(cx - 4, ry + rowH, cx + 4, ry + rowH, cx, ry + rowH + 4);
            }
        });

        // Final answer slot
        const ansY = engY + engH - 26;
        this.mainGfx.fillStyle(0xFEF3C7, 1);
        this.mainGfx.fillRoundedRect(cx - 60, ansY, 120, 22, 6);
        this.mainGfx.lineStyle(1.5, GOLD, 1);
        this.mainGfx.strokeRoundedRect(cx - 60, ansY, 120, 22, 6);
        this.txt('eng_hcf', 'HCF = ?', cx, ansY + 11, TEXT_GOLD, '12px', 0.5, 0.5);
    }

    // ── Level 11: HCF Machine — HCF(867, 255) ───────────────────
    private drawHCFMachine(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;
        const a = (spec as any).rnNumbers?.[0] ?? 867;
        const b = (spec as any).rnNumbers?.[1] ?? 255;

        const steps: { a: number; b: number; q: number; r: number }[] = [];
        let aa = Math.max(a, b), bb = Math.min(a, b);
        while (bb > 0) {
            const q = Math.floor(aa / bb);
            const r = aa % bb;
            steps.push({ a: aa, b: bb, q, r });
            aa = bb;
            bb = r;
        }
        const hcf = steps[steps.length - 1]?.b ?? 1;

        this.txt('hcf_title', `🔧 HCF Machine — HCF(${a}, ${b})`, cx, 42, TEXT_BLUE, '12px', 0.5, 0.5);

        // Vertical flow of panels
        const panW = Math.min(280, W * 0.72);
        const panX = cx - panW / 2;
        const panH = Math.min(36, (H - 140) / (steps.length + 1));
        const startY = 68;

        steps.forEach((step, idx) => {
            const py = startY + idx * (panH + 12);

            // Panel card
            const isLast = idx === steps.length - 1;
            this.mainGfx.fillStyle(isLast ? 0xd1fae5 : 0xffffff, 1);
            this.mainGfx.fillRoundedRect(panX, py, panW, panH, 8);
            this.mainGfx.lineStyle(1.5, isLast ? EMERALD : BLUE_LIGHT, 1);
            this.mainGfx.strokeRoundedRect(panX, py, panW, panH, 8);

            // Step number badge
            this.mainGfx.fillStyle(isLast ? EMERALD : BLUE_LIGHT, 1);
            this.mainGfx.fillCircle(panX + 16, py + panH / 2, 10);
            this.txt(`hs_n_${idx}`, String(idx + 1), panX + 16, py + panH / 2, '#ffffff', '9px', 0.5, 0.5);

            // Equation
            this.txt(`hs_eq_${idx}`,
                `${step.a} = ${step.b} × ${step.q} + ${step.r}`,
                panX + 36, py + panH / 2, isLast ? TEXT_EMERALD : TEXT_DARK, '10px', 0, 0.5);

            if (isLast) {
                this.txt(`hs_final_${idx}`, '✓ DONE', panX + panW - 30, py + panH / 2, TEXT_EMERALD, '9px', 0.5, 0.5);
            }

            // Arrow down
            if (idx < steps.length - 1) {
                this.mainGfx.lineStyle(1.5, BLUE_LIGHT, 0.5);
                const arrowY = py + panH + 2;
                this.mainGfx.lineBetween(cx, arrowY, cx, arrowY + 8);
                this.mainGfx.fillStyle(BLUE_LIGHT, 0.5);
                this.mainGfx.fillTriangle(cx - 3, arrowY + 8, cx + 3, arrowY + 8, cx, arrowY + 11);
            }
        });

        // HCF result
        const resY = startY + steps.length * (panH + 12) + 4;
        this.mainGfx.fillStyle(0xFEF3C7, 1);
        this.mainGfx.fillRoundedRect(cx - 70, resY, 140, 30, 10);
        this.mainGfx.lineStyle(2, GOLD, 1);
        this.mainGfx.strokeRoundedRect(cx - 70, resY, 140, 30, 10);
        this.txt('hcf_result', `HCF = ?`, cx, resY + 15, TEXT_GOLD, '16px', 0.5, 0.5);

        // Machine frame
        this.mainGfx.lineStyle(2, 0x57534e, 0.4);
        this.mainGfx.strokeRoundedRect(panX - 10, startY - 10, panW + 20, resY - startY + 50, 14);
    }

    // ── Level 12: Euclid Timed — HCF(4052, 12576) ───────────────
    private drawEuclidTimed(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;
        const a = (spec as any).rnNumbers?.[0] ?? 12576;
        const b = (spec as any).rnNumbers?.[1] ?? 4052;

        const steps: { a: number; b: number; q: number; r: number }[] = [];
        let aa = Math.max(a, b), bb = Math.min(a, b);
        while (bb > 0) {
            const q = Math.floor(aa / bb);
            const r = aa % bb;
            steps.push({ a: aa, b: bb, q, r });
            aa = bb;
            bb = r;
        }
        const hcf = steps[steps.length - 1]?.b ?? 1;

        // TIMER BAR (top)
        const timerW = W - 20;
        const timerH = 10;
        const timerX = 10;
        const timerY = 36;
        this.mainGfx.fillStyle(0xfee2e2, 1);
        this.mainGfx.fillRoundedRect(timerX, timerY, timerW, timerH, 5);
        this.mainGfx.fillStyle(0xef4444, 1);
        this.mainGfx.fillRoundedRect(timerX, timerY, timerW * 0.7, timerH, 5);
        this.txt('timer_label', '⏱ TIMED CHALLENGE', cx, timerY - 6, '#ef4444', '10px', 0.5, 1);

        // Urgency pulsing border
        this.mainGfx.lineStyle(2, 0xef4444, 0.3);
        this.mainGfx.strokeRect(4, 30, W - 8, H - 68);

        this.txt('timed_title', `⚡ HCF(${a}, ${b})`, cx, timerY + timerH + 10, TEXT_PURPLE, '12px', 0.5, 0);

        // Rapid panels (smaller to fit more steps)
        const panW = Math.min(260, W * 0.68);
        const panX = cx - panW / 2;
        const panH = Math.min(24, (H - 160) / (steps.length + 1));
        const startY = timerY + timerH + 30;

        steps.forEach((step, idx) => {
            const py = startY + idx * (panH + 6);
            const isLast = idx === steps.length - 1;

            this.mainGfx.fillStyle(isLast ? 0xd1fae5 : 0xf8fafc, 1);
            this.mainGfx.fillRoundedRect(panX, py, panW, panH, 4);
            this.mainGfx.lineStyle(1, isLast ? EMERALD : GRID, 1);
            this.mainGfx.strokeRoundedRect(panX, py, panW, panH, 4);

            this.txt(`ts_${idx}`, `${step.a} = ${step.b} × ${step.q} + ${step.r}`,
                cx, py + panH / 2, isLast ? TEXT_EMERALD : TEXT_DARK, '9px', 0.5, 0.5);
        });

        // Score multiplier
        this.txt('multiplier', '🔥 2× Score Multiplier', cx, startY - 10, '#f97316', '9px', 0.5, 1);

        const resY = startY + steps.length * (panH + 6) + 8;
        this.mainGfx.fillStyle(0xFEF3C7, 1);
        this.mainGfx.fillRoundedRect(cx - 60, resY, 120, 26, 8);
        this.mainGfx.lineStyle(2, GOLD, 1);
        this.mainGfx.strokeRoundedRect(cx - 60, resY, 120, 26, 8);
        this.txt('timed_hcf', 'HCF = ?', cx, resY + 13, TEXT_GOLD, '14px', 0.5, 0.5);
    }

    // ═════════════════════════════════════════════════════════════════
    // WORLD 3 — Prime Factorization Caverns
    // ═════════════════════════════════════════════════════════════════

    // ── Level 13: Prime Fragments — Break 360 ────────────────────
    private drawPrimeFragments(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;
        const n = (spec as any).rnNumbers?.[0] ?? 360;

        // Cavern background with stalactites
        this.bgGfx.fillStyle(0x1e1b4b, 0.06);
        this.bgGfx.fillRect(0, 30, W, H - 64);
        for (let i = 0; i < 12; i++) {
            const tx = 15 + (i / 12) * (W - 30);
            const th = 10 + Math.random() * 25;
            this.bgGfx.fillStyle(0x78716c, 0.15);
            this.bgGfx.fillTriangle(tx - 5, 30, tx + 5, 30, tx, 30 + th);
        }

        this.txt('pf_title', `💎 Prime Fragments — Break ${n}`, cx, 42, TEXT_PURPLE, '12px', 0.5, 0.5);

        // Factor tree: 360 → 2 × 180 → 2 × 90 → 2 × 45 → 3 × 15 → 3 × 5
        // Build tree with breadth splits
        interface TreeNode { val: number; isPrime: boolean; left?: TreeNode; right?: TreeNode; }
        const isPrime = (v: number): boolean => {
            if (v < 2) return false;
            for (let i = 2; i <= Math.sqrt(v); i++) { if (v % i === 0) return false; }
            return true;
        };
        const buildTree = (v: number): TreeNode => {
            if (isPrime(v) || v <= 1) return { val: v, isPrime: true };
            for (let f = 2; f <= Math.sqrt(v); f++) {
                if (v % f === 0) return { val: v, isPrime: false, left: buildTree(f), right: buildTree(v / f) };
            }
            return { val: v, isPrime: true };
        };
        const tree = buildTree(n);

        // Draw tree recursively
        const drawNode = (node: TreeNode, x: number, y: number, spread: number, depth: number) => {
            const nodeR = Math.min(18, W * 0.04);
            const fillCol = node.isPrime ? 0xFEF3C7 : 0xede9fe;
            const strokeCol = node.isPrime ? GOLD : PURPLE;

            // Glow for primes
            if (node.isPrime) {
                this.mainGfx.fillStyle(GOLD, 0.15);
                this.mainGfx.fillCircle(x, y, nodeR + 5);
            }

            this.mainGfx.fillStyle(fillCol, 1);
            this.mainGfx.fillCircle(x, y, nodeR);
            this.mainGfx.lineStyle(1.5, strokeCol, 1);
            this.mainGfx.strokeCircle(x, y, nodeR);

            this.txt(`tn_${depth}_${x}`, String(node.val), x, y, node.isPrime ? TEXT_GOLD : TEXT_PURPLE, node.val > 99 ? '8px' : '10px', 0.5, 0.5);

            const childSpread = spread * 0.55;
            const childY = y + Math.min(48, (H - 120) / 6);
            if (node.left) {
                this.mainGfx.lineStyle(1, PURPLE_LIGHT, 0.5);
                this.mainGfx.lineBetween(x, y + nodeR, x - childSpread, childY - nodeR);
                drawNode(node.left, x - childSpread, childY, childSpread, depth + 1);
            }
            if (node.right) {
                this.mainGfx.lineStyle(1, PURPLE_LIGHT, 0.5);
                this.mainGfx.lineBetween(x, y + nodeR, x + childSpread, childY - nodeR);
                drawNode(node.right, x + childSpread, childY, childSpread, depth + 1);
            }
        };

        drawNode(tree, cx, 80, Math.min(130, W * 0.28), 0);

        // Result at bottom
        const primeFactors = (spec as any).rnPrimeFactors ?? { 2: 3, 3: 2, 5: 1 };
        const resultStr = Object.entries(primeFactors).map(([p, e]) => e === 1 ? p : `${p}${this.superscript(e as number)}`).join(' × ');
        this.txt('pf_result', `${n} = ${resultStr}`, cx, H - 55, TEXT_GOLD, '12px', 0.5, 0.5);
        this.txt('pf_q', 'How many distinct prime factors?', cx, H - 72, TEXT_DARK, '10px', 0.5, 0.5);
    }

    // ── Level 14: Factor Tree — Build tree for 1080 ──────────────
    private drawFactorTree(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;
        const n = (spec as any).rnNumbers?.[0] ?? 1080;

        // Underground crystal background
        this.bgGfx.fillStyle(0x1e1b4b, 0.05);
        this.bgGfx.fillRect(0, 30, W, H - 64);
        for (let i = 0; i < 8; i++) {
            const gx = Math.random() * W;
            const gy = 60 + Math.random() * (H - 140);
            this.bgGfx.fillStyle(PURPLE_LIGHT, 0.08);
            this.bgGfx.fillCircle(gx, gy, 3 + Math.random() * 6);
        }

        this.txt('ft_title', `🌳 Factor Tree — ${n}`, cx, 42, TEXT_PURPLE, '12px', 0.5, 0.5);

        // Build and render factor tree
        const isPrime = (v: number): boolean => {
            if (v < 2) return false;
            for (let i = 2; i <= Math.sqrt(v); i++) { if (v % i === 0) return false; }
            return true;
        };

        // Manually show a nice tree
        // 1080 = 2 × 540 = 2 × 2 × 270 = 2 × 2 × 2 × 135 = 2 × 2 × 2 × 3 × 45 = 2 × 2 × 2 × 3 × 3 × 15 = 2³ × 3³ × 5
        interface FTNode { val: number; isPrime: boolean; children?: [FTNode, FTNode]; }
        const buildFT = (v: number): FTNode => {
            if (isPrime(v) || v <= 1) return { val: v, isPrime: true };
            for (let f = 2; f <= Math.sqrt(v); f++) {
                if (v % f === 0) return { val: v, isPrime: false, children: [buildFT(f), buildFT(v / f)] };
            }
            return { val: v, isPrime: true };
        };
        const ftree = buildFT(n);

        // Draw tree
        const drawFT = (node: FTNode, x: number, y: number, spread: number, d: number) => {
            const r = Math.min(16, W * 0.035);
            const leafCol = node.isPrime ? 0xFEF3C7 : 0xede9fe;
            const border = node.isPrime ? GOLD : PURPLE;

            // Pentagon shape for prime leaves
            if (node.isPrime) {
                this.mainGfx.fillStyle(GOLD, 0.12);
                this.drawPentagon(this.mainGfx, x, y, r + 4);
            }

            this.mainGfx.fillStyle(leafCol, 1);
            this.mainGfx.fillCircle(x, y, r);
            this.mainGfx.lineStyle(1.5, border, 1);
            this.mainGfx.strokeCircle(x, y, r);

            this.txt(`ftv_${d}_${Math.round(x)}`, String(node.val), x, y, node.isPrime ? TEXT_GOLD : TEXT_PURPLE, node.val > 99 ? '7px' : '10px', 0.5, 0.5);

            if (node.children) {
                const cSpread = spread * 0.52;
                const cY = y + Math.min(42, (H - 120) / 7);
                // Organic curve (bezier)
                this.mainGfx.lineStyle(1, PURPLE_LIGHT, 0.4);
                this.mainGfx.lineBetween(x, y + r, x - cSpread, cY - r);
                this.mainGfx.lineBetween(x, y + r, x + cSpread, cY - r);

                // × symbol
                this.txt(`ftx_${d}_${Math.round(x)}`, '×', x, y + r + 6, TEXT_LIGHT, '8px', 0.5, 0);

                drawFT(node.children[0], x - cSpread, cY, cSpread, d + 1);
                drawFT(node.children[1], x + cSpread, cY, cSpread, d + 1);
            }
        };

        drawFT(ftree, cx, 78, Math.min(120, W * 0.25), 0);

        const primeFactors = (spec as any).rnPrimeFactors ?? { 2: 3, 3: 3, 5: 1 };
        const resultStr = Object.entries(primeFactors).map(([p, e]) => e === 1 ? p : `${p}${this.superscript(e as number)}`).join(' × ');
        this.txt('ft_result', `${n} = ${resultStr}`, cx, H - 55, TEXT_GOLD, '12px', 0.5, 0.5);
        this.txt('ft_q', 'Enter the product (verify): ?', cx, H - 72, TEXT_DARK, '10px', 0.5, 0.5);
    }

    // ── Level 15: Factor Vault — 3780 ────────────────────────────
    private drawFactorVault(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.42;
        const n = (spec as any).rnNumbers?.[0] ?? 3780;
        const primeFactors = (spec as any).rnPrimeFactors ?? { 2: 2, 3: 3, 5: 1, 7: 1 };

        this.txt('vault_title', `🔐 Factor Vault — ${n}`, cx, 42, TEXT_PURPLE, '12px', 0.5, 0.5);

        // Vault door (circular)
        const vaultR = Math.min(65, W * 0.15);

        // Concentric circles
        for (let i = 3; i >= 0; i--) {
            this.mainGfx.fillStyle(0x57534e, 0.2 + i * 0.15);
            this.mainGfx.fillCircle(cx, cy, vaultR + i * 8);
        }
        this.mainGfx.fillStyle(0x78716c, 1);
        this.mainGfx.fillCircle(cx, cy, vaultR);
        this.mainGfx.lineStyle(3, 0x57534e, 1);
        this.mainGfx.strokeCircle(cx, cy, vaultR);

        // Bolts around edge
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
            this.mainGfx.fillStyle(0x44403c, 1);
            this.mainGfx.fillCircle(cx + Math.cos(angle) * (vaultR - 6), cy + Math.sin(angle) * (vaultR - 6), 3);
        }

        // Center keyhole
        this.mainGfx.fillStyle(0x1e293b, 1);
        this.mainGfx.fillCircle(cx, cy, 8);
        this.mainGfx.fillRect(cx - 2, cy, 4, 12);

        // Lock positions (4 locks around vault)
        const entries = Object.entries(primeFactors);
        entries.forEach(([prime, exp], idx) => {
            const angle = (idx / entries.length) * Math.PI * 2 - Math.PI / 2;
            const lx = cx + Math.cos(angle) * (vaultR + 40);
            const ly = cy + Math.sin(angle) * (vaultR + 40);

            // Lock dial
            this.mainGfx.fillStyle(0xffffff, 1);
            this.mainGfx.fillCircle(lx, ly, 22);
            this.mainGfx.lineStyle(2, GOLD, 1);
            this.mainGfx.strokeCircle(lx, ly, 22);

            // Connection to vault
            this.mainGfx.lineStyle(1, GOLD, 0.4);
            this.mainGfx.lineBetween(cx + Math.cos(angle) * vaultR, cy + Math.sin(angle) * vaultR, lx - Math.cos(angle) * 22, ly - Math.sin(angle) * 22);

            // Prime base and exponent
            this.txt(`vl_base_${idx}`, String(prime), lx, ly - 4, TEXT_DARK, '14px', 0.5, 0.5);
            this.txt(`vl_exp_${idx}`, this.superscript(exp as number), lx + 10, ly - 10, TEXT_GOLD, '9px', 0, 0.5);
            this.txt(`vl_label_${idx}`, `Lock ${idx + 1}`, lx, ly + 18, TEXT_LIGHT, '7px', 0.5, 0);
        });

        // Result when correct
        const resultStr = entries.map(([p, e]) => e === 1 ? p : `${p}${this.superscript(e as number)}`).join(' × ');
        this.txt('vault_result', `${n} = ${resultStr}`, cx, cy + vaultR + 70, TEXT_GOLD, '12px', 0.5, 0.5);
        this.txt('vault_q', 'Sum of all prime factors (with repetition)?', cx, cy + vaultR + 88, TEXT_DARK, '10px', 0.5, 0);
        this.txt('vault_ans', 'Answer: ?', cx, cy + vaultR + 106, TEXT_GOLD, '14px', 0.5, 0);
    }

    // ── Level 16: Unique Factor — Uniqueness of 1155 ─────────────
    private drawUniqueFactor(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;
        const n = (spec as any).rnNumbers?.[0] ?? 1155;

        this.txt('uf_title', `🎯 Uniqueness of Prime Factorization — ${n}`, cx, 42, TEXT_PURPLE, '11px', 0.5, 0.5);

        // Two side-by-side trees
        // Tree A: 1155 → 3 × 385 → 3 × 5 × 77 → 3 × 5 × 7 × 11
        // Tree B: 1155 → 5 × 231 → 5 × 3 × 77 → 5 × 3 × 7 × 11
        const treeW = Math.min(140, (W - 30) / 2 - 10);
        const treeAx = cx - treeW / 2 - 15;
        const treeBx = cx + treeW / 2 + 15;

        this.txt('tree_a_lbl', 'Tree A', treeAx, 58, TEXT_BLUE, '10px', 0.5, 0);
        this.txt('tree_b_lbl', 'Tree B', treeBx, 58, TEXT_PURPLE, '10px', 0.5, 0);

        // Tree A steps
        const treeASteps = ['1155', '3 × 385', '3 × 5 × 77', '3 × 5 × 7 × 11'];
        const treeBSteps = ['1155', '5 × 231', '5 × 3 × 77', '5 × 3 × 7 × 11'];
        const stepH = Math.min(38, (H - 180) / treeASteps.length);

        treeASteps.forEach((step, idx) => {
            const sy = 78 + idx * stepH;
            this.mainGfx.fillStyle(0xeff6ff, 1);
            this.mainGfx.fillRoundedRect(treeAx - treeW / 2 + 4, sy, treeW - 8, stepH - 6, 6);
            this.mainGfx.lineStyle(1, BLUE_LIGHT, 0.7);
            this.mainGfx.strokeRoundedRect(treeAx - treeW / 2 + 4, sy, treeW - 8, stepH - 6, 6);
            this.txt(`ta_${idx}`, step, treeAx, sy + (stepH - 6) / 2, TEXT_BLUE, '8px', 0.5, 0.5);
            if (idx < treeASteps.length - 1) {
                this.mainGfx.lineStyle(1, BLUE_LIGHT, 0.4);
                this.mainGfx.lineBetween(treeAx, sy + stepH - 6, treeAx, sy + stepH - 2);
            }
        });

        treeBSteps.forEach((step, idx) => {
            const sy = 78 + idx * stepH;
            this.mainGfx.fillStyle(0xede9fe, 1);
            this.mainGfx.fillRoundedRect(treeBx - treeW / 2 + 4, sy, treeW - 8, stepH - 6, 6);
            this.mainGfx.lineStyle(1, PURPLE_LIGHT, 0.7);
            this.mainGfx.strokeRoundedRect(treeBx - treeW / 2 + 4, sy, treeW - 8, stepH - 6, 6);
            this.txt(`tb_${idx}`, step, treeBx, sy + (stepH - 6) / 2, TEXT_PURPLE, '8px', 0.5, 0.5);
            if (idx < treeBSteps.length - 1) {
                this.mainGfx.lineStyle(1, PURPLE_LIGHT, 0.4);
                this.mainGfx.lineBetween(treeBx, sy + stepH - 6, treeBx, sy + stepH - 2);
            }
        });

        // "=" sign between them
        const eqY = 78 + treeASteps.length * stepH - stepH / 2;
        this.mainGfx.fillStyle(GOLD, 0.15);
        this.mainGfx.fillCircle(cx, eqY - 20, 18);
        this.mainGfx.lineStyle(2, GOLD, 1);
        this.mainGfx.strokeCircle(cx, eqY - 20, 18);
        this.txt('eq_sign', '=', cx, eqY - 20, TEXT_GOLD, '20px', 0.5, 0.5);

        // Bottom message
        this.txt('uf_msg', 'Different paths, SAME prime factors!', cx, eqY + 8, TEXT_GOLD, '11px', 0.5, 0);
        this.txt('uf_primes', '{3, 5, 7, 11}', cx, eqY + 26, TEXT_EMERALD, '12px', 0.5, 0);
        this.txt('uf_q', 'Product of distinct primes = ?', cx, eqY + 46, TEXT_DARK, '10px', 0.5, 0);
        this.txt('uf_ans', 'Answer: ?', cx, eqY + 64, TEXT_GOLD, '14px', 0.5, 0);
    }

    // ── Level 17: Prime Reactor — Power to 2520 ──────────────────
    private drawPrimeReactor(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.42;
        const n = (spec as any).rnNumbers?.[0] ?? 2520;
        const primeFactors = (spec as any).rnPrimeFactors ?? { 2: 3, 3: 2, 5: 1, 7: 1 };

        this.txt('reactor_title', `⚡ Prime Reactor — ${n}`, cx, 42, TEXT_PURPLE, '12px', 0.5, 0.5);

        // Reactor core (large glowing circle)
        const coreR = Math.min(50, W * 0.12);

        // Pulsing energy rings
        for (let ring = 3; ring >= 0; ring--) {
            this.mainGfx.lineStyle(1.5, PURPLE, 0.1 + ring * 0.05);
            this.mainGfx.strokeCircle(cx, cy, coreR + ring * 14);
        }

        // Core
        this.mainGfx.fillStyle(PURPLE, 0.2);
        this.mainGfx.fillCircle(cx, cy, coreR);
        this.mainGfx.fillStyle(0x7c3aed, 0.6);
        this.mainGfx.fillCircle(cx, cy, coreR * 0.6);
        this.mainGfx.lineStyle(2, PURPLE, 1);
        this.mainGfx.strokeCircle(cx, cy, coreR);

        this.txt('core_num', String(n), cx, cy, '#ffffff', '16px', 0.5, 0.5);

        // Fuel rod slots around the reactor
        const entries = Object.entries(primeFactors);
        entries.forEach(([prime, exp], idx) => {
            const angle = (idx / entries.length) * Math.PI * 2 - Math.PI / 2;
            const rx = cx + Math.cos(angle) * (coreR + 55);
            const ry = cy + Math.sin(angle) * (coreR + 55);

            // Fuel rod (vertical bar with segments)
            const rodW = 20;
            const rodH = (exp as number) * 12 + 10;

            this.mainGfx.fillStyle(0x1e293b, 1);
            this.mainGfx.fillRoundedRect(rx - rodW / 2, ry - rodH / 2, rodW, rodH, 4);
            this.mainGfx.lineStyle(1.5, GOLD, 1);
            this.mainGfx.strokeRoundedRect(rx - rodW / 2, ry - rodH / 2, rodW, rodH, 4);

            // Segments for exponent
            for (let s = 0; s < (exp as number); s++) {
                this.mainGfx.fillStyle(EMERALD_LIGHT, 0.8);
                this.mainGfx.fillRect(rx - rodW / 2 + 3, ry - rodH / 2 + 5 + s * 12, rodW - 6, 8);
            }

            // Connection beam to core
            this.mainGfx.lineStyle(1, PURPLE_LIGHT, 0.3);
            this.mainGfx.lineBetween(cx + Math.cos(angle) * coreR, cy + Math.sin(angle) * coreR, rx - Math.cos(angle) * rodW / 2, ry);

            // Label
            this.txt(`rod_${idx}`, `${prime}${this.superscript(exp as number)}`, rx, ry + rodH / 2 + 10, TEXT_DARK, '11px', 0.5, 0);
        });

        // Energy meter
        const meterW = Math.min(180, W * 0.45);
        const meterY = cy + coreR + 80;
        this.mainGfx.fillStyle(0xe5e7eb, 1);
        this.mainGfx.fillRoundedRect(cx - meterW / 2, meterY, meterW, 12, 6);
        this.mainGfx.fillStyle(EMERALD, 0.8);
        this.mainGfx.fillRoundedRect(cx - meterW / 2, meterY, meterW * 0.75, 12, 6);
        this.txt('meter_lbl', `Energy: ${n}`, cx, meterY - 8, TEXT_DARK, '9px', 0.5, 1);

        this.txt('reactor_q', 'Sum of exponents?', cx, meterY + 22, TEXT_DARK, '10px', 0.5, 0);
        this.txt('reactor_ans', 'Answer: ?', cx, meterY + 40, TEXT_GOLD, '14px', 0.5, 0);
    }

    // ── Level 18: PF Boss — 27720 ────────────────────────────────
    private drawPFBoss(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;
        const n = (spec as any).rnNumbers?.[0] ?? 27720;

        // Boss banner
        this.mainGfx.fillStyle(0x1e1b4b, 1);
        this.mainGfx.fillRect(0, 30, W, 40);
        this.txt('boss_ttl', '⚔️  BOSS: PRIME FACTORIZATION MASTER  ⚔️', cx, 50, '#a5b4fc', '12px', 0.5, 0.5);

        // Phase indicator
        const phases = ['Crystal Break', 'Factor Tree', 'Uniqueness', 'Reactor Power'];
        const phaseY = 78;
        const phaseW = Math.min(280, W * 0.72);
        const phaseX = cx - phaseW / 2;

        phases.forEach((phase, idx) => {
            const pw = phaseW / phases.length - 4;
            const px = phaseX + idx * (pw + 4);
            this.mainGfx.fillStyle(idx === 0 ? PURPLE : 0xe5e7eb, 1);
            this.mainGfx.fillRoundedRect(px, phaseY, pw, 16, 4);
            this.txt(`phase_${idx}`, `P${idx + 1}`, px + pw / 2, phaseY + 8, idx === 0 ? '#ffffff' : TEXT_LIGHT, '7px', 0.5, 0.5);
        });
        this.txt('phase_name', `Phase 1: ${phases[0]}`, cx, phaseY + 22, TEXT_PURPLE, '9px', 0.5, 0);

        // Boss health bar
        const hpY = phaseY + 38;
        const hpW = Math.min(260, W * 0.65);
        this.mainGfx.fillStyle(0x1e293b, 1);
        this.mainGfx.fillRoundedRect(cx - hpW / 2, hpY, hpW, 14, 7);
        this.mainGfx.fillStyle(0xef4444, 1);
        this.mainGfx.fillRoundedRect(cx - hpW / 2, hpY, hpW, 14, 7);
        this.txt('hp_label', `BOSS HP: 100%`, cx, hpY + 7, '#ffffff', '8px', 0.5, 0.5);

        // Central epic number with energy swirl
        const epicY = H * 0.48;
        const epicR = Math.min(55, W * 0.13);
        for (let ring = 4; ring >= 0; ring--) {
            const rColor = ring % 2 === 0 ? GOLD : PURPLE;
            this.mainGfx.lineStyle(1.5, rColor, 0.08 + ring * 0.04);
            this.mainGfx.strokeCircle(cx, epicY, epicR + ring * 10);
        }
        this.mainGfx.fillStyle(0x1e1b4b, 1);
        this.mainGfx.fillCircle(cx, epicY, epicR);
        this.mainGfx.lineStyle(2, GOLD, 1);
        this.mainGfx.strokeCircle(cx, epicY, epicR);
        this.txt('boss_num', String(n), cx, epicY, '#FFD700', '18px', 0.5, 0.5);

        // Factorization result
        const resultStr = '2³ × 3² × 5 × 7 × 11';
        this.txt('boss_factor', `${n} = ${resultStr}`, cx, epicY + epicR + 18, TEXT_GOLD, '11px', 0.5, 0);

        this.txt('boss_q', 'Number of distinct prime factors?', cx, epicY + epicR + 40, TEXT_DARK, '10px', 0.5, 0);
        this.txt('boss_ans', 'Answer: ?', cx, epicY + epicR + 58, TEXT_GOLD, '16px', 0.5, 0);
    }

    // ═════════════════════════════════════════════════════════════════
    // WORLD 4 — HCF & LCM Factory
    // ═════════════════════════════════════════════════════════════════

    // ── Level 19: LCM Sync — LCM(12, 18) ────────────────────────
    private drawLCMSync(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;
        const nums = (spec as any).rnNumbers ?? [12, 18];
        const a = nums[0] ?? 12, b = nums[1] ?? 18;

        this.txt('lcm_title', `⚙️ Gear Sync — LCM(${a}, ${b})`, cx, 42, TEXT_BLUE, '12px', 0.5, 0.5);

        // Two large gears
        const gearAx = cx - Math.min(80, W * 0.18);
        const gearBx = cx + Math.min(80, W * 0.18);
        const gearY = H * 0.38;
        const gR = Math.min(45, W * 0.1);

        this.drawGear(gearAx, gearY, gR, a, BLUE_LIGHT, ROYAL_BLUE);
        this.drawGear(gearBx, gearY, gR, Math.min(b, 20), EMERALD, 0x047857);

        this.txt('gear_a', String(a), gearAx, gearY, '#ffffff', '16px', 0.5, 0.5);
        this.txt('gear_b', String(b), gearBx, gearY, '#ffffff', '16px', 0.5, 0.5);
        this.txt('gear_a_lbl', `${a} teeth`, gearAx, gearY + gR + 14, TEXT_BLUE, '9px', 0.5, 0);
        this.txt('gear_b_lbl', `${b} teeth`, gearBx, gearY + gR + 14, TEXT_EMERALD, '9px', 0.5, 0);

        // Mesh point
        this.mainGfx.fillStyle(GOLD, 0.3);
        this.mainGfx.fillCircle(cx, gearY, 6);

        // Factory pipes background
        this.mainGfx.fillStyle(0x94a3b8, 0.15);
        this.mainGfx.fillRect(0, H * 0.56, W, 4);

        // Timeline bar
        const timeY = H * 0.62;
        const timeW = Math.min(300, W * 0.78);
        const timeX = cx - timeW / 2;

        this.mainGfx.fillStyle(0xf1f5f9, 1);
        this.mainGfx.fillRoundedRect(timeX, timeY, timeW, 50, 8);
        this.mainGfx.lineStyle(1, GRID, 1);
        this.mainGfx.strokeRoundedRect(timeX, timeY, timeW, 50, 8);

        // Multiples of A
        const lcm = (a * b) / this.gcd(a, b);
        const maxTick = lcm + 6;
        const tickScale = timeW / maxTick;

        for (let m = a; m <= maxTick; m += a) {
            const tx = timeX + m * tickScale;
            if (tx > timeX + timeW - 5) break;
            this.mainGfx.fillStyle(BLUE_LIGHT, m === lcm ? 1 : 0.6);
            this.mainGfx.fillCircle(tx, timeY + 16, 4);
            this.txt(`ta_${m}`, String(m), tx, timeY + 8, TEXT_BLUE, '7px', 0.5, 1);
        }

        // Multiples of B
        for (let m = b; m <= maxTick; m += b) {
            const tx = timeX + m * tickScale;
            if (tx > timeX + timeW - 5) break;
            this.mainGfx.fillStyle(EMERALD, m === lcm ? 1 : 0.6);
            this.mainGfx.fillCircle(tx, timeY + 34, 4);
            this.txt(`tb_${m}`, String(m), tx, timeY + 42, TEXT_EMERALD, '7px', 0.5, 0);
        }

        // Highlight LCM
        const lcmX = timeX + lcm * tickScale;
        if (lcmX <= timeX + timeW) {
            this.mainGfx.lineStyle(2, GOLD, 1);
            this.mainGfx.lineBetween(lcmX, timeY + 10, lcmX, timeY + 40);
            this.mainGfx.fillStyle(GOLD, 0.15);
            this.mainGfx.fillRoundedRect(lcmX - 14, timeY + 10, 28, 30, 4);
        }

        this.txt('lcm_q', `LCM(${a}, ${b}) = ?`, cx, timeY + 60, TEXT_DARK, '11px', 0.5, 0);
        this.txt('lcm_ans', 'Answer: ?', cx, timeY + 78, TEXT_GOLD, '14px', 0.5, 0);
    }

    // ── Level 20: HCF Optimize — HCF(36, 54) ────────────────────
    private drawHCFOptimize(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;
        const nums = (spec as any).rnNumbers ?? [36, 54];
        const a = nums[0] ?? 36, b = nums[1] ?? 54;
        const hcf = this.gcd(a, b);

        this.txt('opt_title', `🏗️ Tile Optimization — ${a}cm × ${b}cm`, cx, 42, TEXT_BLUE, '12px', 0.5, 0.5);

        // Draw floor rectangle
        const maxFloorW = Math.min(240, W * 0.6);
        const scale = maxFloorW / b;
        const floorW = b * scale;
        const floorH = a * scale;
        const floorX = cx - floorW / 2;
        const floorY = 70;

        // Floor
        this.mainGfx.fillStyle(STONE_LIGHT, 0.3);
        this.mainGfx.fillRect(floorX, floorY, floorW, floorH);
        this.mainGfx.lineStyle(2, STONE, 1);
        this.mainGfx.strokeRect(floorX, floorY, floorW, floorH);

        // Tile grid (HCF-sized tiles)
        const tileSize = hcf * scale;
        const tilesX = b / hcf;
        const tilesY = a / hcf;

        for (let ty = 0; ty < tilesY; ty++) {
            for (let tx = 0; tx < tilesX; tx++) {
                const tileX = floorX + tx * tileSize;
                const tileY = floorY + ty * tileSize;
                const color = (tx + ty) % 2 === 0 ? 0xFEF3C7 : 0xfef9c3;
                this.mainGfx.fillStyle(color, 1);
                this.mainGfx.fillRect(tileX + 1, tileY + 1, tileSize - 2, tileSize - 2);
                this.mainGfx.lineStyle(1, GOLD, 0.6);
                this.mainGfx.strokeRect(tileX, tileY, tileSize, tileSize);
            }
        }

        // Measurement markers
        this.txt('dim_w', `${b}cm`, cx, floorY - 8, TEXT_DARK, '10px', 0.5, 1);
        this.txt('dim_h', `${a}cm`, floorX - 8, floorY + floorH / 2, TEXT_DARK, '10px', 1, 0.5);

        // Tile info
        const infoY = floorY + floorH + 14;
        this.txt('tile_info', `Largest square tile: ${hcf}cm × ${hcf}cm`, cx, infoY, TEXT_GOLD, '10px', 0.5, 0);
        this.txt('tile_count', `${b / hcf} × ${a / hcf} = ${tilesX * tilesY} tiles`, cx, infoY + 16, TEXT_DARK, '10px', 0.5, 0);

        this.txt('opt_q', `What is the side of the largest square tile (HCF)?`, cx, infoY + 36, TEXT_DARK, '10px', 0.5, 0);
        this.txt('opt_ans', 'Answer: ?', cx, infoY + 54, TEXT_GOLD, '14px', 0.5, 0);
    }

    // ── Level 21: Production Repair — HCF & LCM of 96 and 404 ──
    private drawProductionRepair(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;
        const nums = (spec as any).rnNumbers ?? [96, 404];
        const a = nums[0] ?? 96, b = nums[1] ?? 404;
        const hcf = this.gcd(a, b);
        const lcm = (a * b) / hcf;

        this.txt('pr_title', `🔧 Production Repair — HCF & LCM(${a}, ${b})`, cx, 42, TEXT_BLUE, '11px', 0.5, 0.5);

        // Venn diagram
        const circR = Math.min(55, W * 0.12);
        const overlap = circR * 0.5;
        const circAx = cx - circR + overlap / 2;
        const circBx = cx + circR - overlap / 2;
        const circY = H * 0.38;

        // Left circle
        this.mainGfx.fillStyle(BLUE_LIGHT, 0.15);
        this.mainGfx.fillCircle(circAx, circY, circR);
        this.mainGfx.lineStyle(2, BLUE_LIGHT, 0.8);
        this.mainGfx.strokeCircle(circAx, circY, circR);
        this.txt('venn_a', String(a), circAx - circR * 0.3, circY - 16, TEXT_BLUE, '14px', 0.5, 0.5);
        this.txt('venn_a_pf', '2⁵ × 3', circAx - circR * 0.3, circY + 4, TEXT_BLUE, '9px', 0.5, 0);

        // Right circle
        this.mainGfx.fillStyle(EMERALD, 0.12);
        this.mainGfx.fillCircle(circBx, circY, circR);
        this.mainGfx.lineStyle(2, EMERALD, 0.8);
        this.mainGfx.strokeCircle(circBx, circY, circR);
        this.txt('venn_b', String(b), circBx + circR * 0.3, circY - 16, TEXT_EMERALD, '14px', 0.5, 0.5);
        this.txt('venn_b_pf', '2² × 101', circBx + circR * 0.3, circY + 4, TEXT_EMERALD, '9px', 0.5, 0);

        // Overlap (HCF)
        this.mainGfx.fillStyle(GOLD, 0.2);
        this.mainGfx.fillCircle(cx, circY, overlap * 0.7);
        this.txt('venn_hcf', `HCF\n${hcf}`, cx, circY - 6, TEXT_GOLD, '10px', 0.5, 0.5);
        this.txt('venn_hcf_pf', '2²', cx, circY + 10, TEXT_GOLD, '9px', 0.5, 0);

        // LCM below
        const lcmY = circY + circR + 20;
        this.mainGfx.fillStyle(0xffffff, 1);
        this.mainGfx.fillRoundedRect(cx - 110, lcmY, 220, 28, 8);
        this.mainGfx.lineStyle(1.5, PURPLE, 1);
        this.mainGfx.strokeRoundedRect(cx - 110, lcmY, 220, 28, 8);
        this.txt('lcm_val', `LCM = 2⁵ × 3 × 101 = ${lcm}`, cx, lcmY + 14, TEXT_PURPLE, '10px', 0.5, 0.5);

        // Verification
        this.txt('verify', `Verify: ${hcf} × ${lcm} = ${hcf * lcm} = ${a} × ${b} ✓`, cx, lcmY + 40, TEXT_EMERALD, '9px', 0.5, 0);

        // Conveyor belt
        this.mainGfx.fillStyle(0x94a3b8, 0.2);
        this.mainGfx.fillRect(0, lcmY + 56, W, 6);
        for (let x = 0; x < W; x += 14) {
            this.mainGfx.fillStyle(0x94a3b8, 0.4);
            this.mainGfx.fillRect(x, lcmY + 62, 9, 3);
        }

        this.txt('pr_q', `What is HCF(${a}, ${b})?`, cx, lcmY + 72, TEXT_DARK, '10px', 0.5, 0);
        this.txt('pr_ans', 'Answer: ?', cx, lcmY + 90, TEXT_GOLD, '14px', 0.5, 0);
    }

    // ── Level 22: Gear Balance — LCM(15, 20, 35) ────────────────
    private drawGearBalance(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;
        const nums = (spec as any).rnNumbers ?? [15, 20, 35];
        const gearTeeth = (spec as any).rnGearTeeth ?? [15, 20, 35];

        this.txt('gb_title', `⚙️ Gear Balance — LCM(${nums.join(', ')})`, cx, 42, TEXT_BLUE, '12px', 0.5, 0.5);

        // Three interlocking gears
        const gR = Math.min(35, W * 0.08);
        const gY = H * 0.38;
        const gearPositions = [
            { x: cx - gR * 2.2, y: gY, color: BLUE_LIGHT, borderColor: ROYAL_BLUE },
            { x: cx,            y: gY - gR * 1.2, color: EMERALD, borderColor: 0x047857 },
            { x: cx + gR * 2.2, y: gY, color: PURPLE, borderColor: 0x5b21b6 },
        ];

        gearPositions.forEach((gp, idx) => {
            this.drawGear(gp.x, gp.y, gR, Math.min(gearTeeth[idx], 20), gp.color, gp.borderColor);
            this.txt(`gg_${idx}`, String(nums[idx]), gp.x, gp.y, '#ffffff', '12px', 0.5, 0.5);
            const colors = [TEXT_BLUE, TEXT_EMERALD, TEXT_PURPLE];
            this.txt(`gg_lbl_${idx}`, `Gear ${String.fromCharCode(65 + idx)}`, gp.x, gp.y + gR + 12, colors[idx], '8px', 0.5, 0);
        });

        // LCM calculation
        let lcm = nums[0];
        for (let i = 1; i < nums.length; i++) {
            lcm = (lcm * nums[i]) / this.gcd(lcm, nums[i]);
        }

        const rotations = nums.map((n: number) => lcm / n);
        const infoY = gY + gR + 32;
        this.txt('gb_lcm', `LCM = ${lcm}`, cx, infoY, TEXT_GOLD, '14px', 0.5, 0);
        this.txt('gb_rot', `Rotations: A=${rotations[0]}, B=${rotations[1]}, C=${rotations[2]}`, cx, infoY + 18, TEXT_DARK, '9px', 0.5, 0);

        this.txt('gb_q', `LCM(${nums.join(', ')}) = ?`, cx, infoY + 42, TEXT_DARK, '11px', 0.5, 0);
        this.txt('gb_ans', 'Answer: ?', cx, infoY + 60, TEXT_GOLD, '14px', 0.5, 0);
    }

    // ── Level 23: Sync Advanced — LCM(12, 15, 21) ───────────────
    private drawSyncAdvanced(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;
        const nums = (spec as any).rnNumbers ?? [12, 15, 21];

        this.txt('sa_title', `🏭 Factory Sync — LCM(${nums.join(', ')})`, cx, 42, TEXT_BLUE, '12px', 0.5, 0.5);

        // 3 machines
        const machineW = Math.min(60, (W - 40) / 3 - 8);
        const machineH = 50;
        const machineY = 68;
        const machineGap = (W - 3 * machineW) / 4;
        const machineColors = [BLUE_LIGHT, EMERALD, PURPLE];
        const machineLabels = ['Machine A', 'Machine B', 'Machine C'];

        nums.forEach((n: number, idx: number) => {
            const mx = machineGap + idx * (machineW + machineGap);
            this.mainGfx.fillStyle(machineColors[idx], 0.15);
            this.mainGfx.fillRoundedRect(mx, machineY, machineW, machineH, 8);
            this.mainGfx.lineStyle(1.5, machineColors[idx], 1);
            this.mainGfx.strokeRoundedRect(mx, machineY, machineW, machineH, 8);

            // Blinking light
            this.mainGfx.fillStyle(machineColors[idx], 0.8);
            this.mainGfx.fillCircle(mx + machineW / 2, machineY + 12, 5);
            this.mainGfx.fillStyle(0xffffff, 0.5);
            this.mainGfx.fillCircle(mx + machineW / 2, machineY + 12, 2);

            this.txt(`mc_${idx}`, String(n), mx + machineW / 2, machineY + 32, [TEXT_BLUE, TEXT_EMERALD, TEXT_PURPLE][idx], '14px', 0.5, 0.5);
            this.txt(`mc_lbl_${idx}`, machineLabels[idx], mx + machineW / 2, machineY + machineH + 4, TEXT_LIGHT, '7px', 0.5, 0);
        });

        // Timeline
        let lcm = nums[0];
        for (let i = 1; i < nums.length; i++) {
            lcm = (lcm * nums[i]) / this.gcd(lcm, nums[i]);
        }

        const timeY = machineY + machineH + 28;
        const timeW = Math.min(300, W * 0.78);
        const timeX = cx - timeW / 2;
        const timeH = 70;

        this.mainGfx.fillStyle(0xffffff, 1);
        this.mainGfx.fillRoundedRect(timeX, timeY, timeW, timeH, 8);
        this.mainGfx.lineStyle(1, GRID, 1);
        this.mainGfx.strokeRoundedRect(timeX, timeY, timeW, timeH, 8);

        this.txt('timeline_lbl', 'Timeline', timeX + 4, timeY + 2, TEXT_LIGHT, '7px', 0, 0);

        // Draw timeline marks for each machine
        const maxT = lcm + 20;
        const tScale = timeW / maxT;
        const rowH = timeH / 3;

        nums.forEach((n: number, idx: number) => {
            const ry = timeY + idx * rowH + rowH / 2;
            const colors = [BLUE_LIGHT, EMERALD, PURPLE];
            for (let m = n; m <= maxT; m += n) {
                const tx = timeX + m * tScale;
                if (tx > timeX + timeW - 2) break;
                const isLCM = m === lcm;
                this.mainGfx.fillStyle(isLCM ? GOLD : colors[idx], isLCM ? 1 : 0.6);
                this.mainGfx.fillCircle(tx, ry, isLCM ? 5 : 3);
            }
        });

        // LCM mark
        const lcmX = timeX + lcm * tScale;
        if (lcmX < timeX + timeW) {
            this.mainGfx.lineStyle(2, GOLD, 0.8);
            this.mainGfx.lineBetween(lcmX, timeY + 4, lcmX, timeY + timeH - 4);
            this.txt('lcm_mark', String(lcm), lcmX, timeY - 6, TEXT_GOLD, '9px', 0.5, 1);
        }

        this.txt('sa_q', `First time all fire together = ?`, cx, timeY + timeH + 14, TEXT_DARK, '11px', 0.5, 0);
        this.txt('sa_ans', 'Answer: ?', cx, timeY + timeH + 32, TEXT_GOLD, '14px', 0.5, 0);
    }

    // ── Level 24: HCF & LCM Timed — 306 and 657 ─────────────────
    private drawHCFLCMTimed(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;
        const nums = (spec as any).rnNumbers ?? [306, 657];
        const a = nums[0] ?? 306, b = nums[1] ?? 657;
        const hcf = this.gcd(a, b);
        const lcm = (a * b) / hcf;

        // Timer bar
        const timerW = W - 20;
        this.mainGfx.fillStyle(0xfee2e2, 1);
        this.mainGfx.fillRoundedRect(10, 36, timerW, 10, 5);
        this.mainGfx.fillStyle(0xef4444, 1);
        this.mainGfx.fillRoundedRect(10, 36, timerW * 0.65, 10, 5);
        this.txt('timer_label', '⏱ TIMED', cx, 30, '#ef4444', '9px', 0.5, 1);

        this.txt('hl_title', `⚡ HCF & LCM(${a}, ${b})`, cx, 54, TEXT_PURPLE, '11px', 0.5, 0.5);

        // Split screen: HCF left, LCM right
        const halfW = Math.min(150, (W - 20) / 2 - 5);
        const panY = 72;
        const panH = Math.min(130, H * 0.3);

        // HCF panel (left)
        const hcfX = cx - halfW - 4;
        this.mainGfx.fillStyle(0xeff6ff, 1);
        this.mainGfx.fillRoundedRect(hcfX, panY, halfW, panH, 8);
        this.mainGfx.lineStyle(1.5, BLUE_LIGHT, 1);
        this.mainGfx.strokeRoundedRect(hcfX, panY, halfW, panH, 8);
        this.txt('hcf_hdr', 'HCF', hcfX + halfW / 2, panY + 10, TEXT_BLUE, '11px', 0.5, 0);
        this.txt('hcf_pf_a', `${a} = 2 × 3² × 17`, hcfX + halfW / 2, panY + 30, TEXT_DARK, '8px', 0.5, 0);
        this.txt('hcf_pf_b', `${b} = 3² × 73`, hcfX + halfW / 2, panY + 46, TEXT_DARK, '8px', 0.5, 0);
        this.txt('hcf_val', `HCF = 3² = ${hcf}`, hcfX + halfW / 2, panY + 66, TEXT_BLUE, '10px', 0.5, 0);

        // LCM panel (right)
        const lcmPanX = cx + 4;
        this.mainGfx.fillStyle(0xede9fe, 1);
        this.mainGfx.fillRoundedRect(lcmPanX, panY, halfW, panH, 8);
        this.mainGfx.lineStyle(1.5, PURPLE, 1);
        this.mainGfx.strokeRoundedRect(lcmPanX, panY, halfW, panH, 8);
        this.txt('lcm_hdr', 'LCM', lcmPanX + halfW / 2, panY + 10, TEXT_PURPLE, '11px', 0.5, 0);
        this.txt('lcm_pf', `2 × 3² × 17 × 73`, lcmPanX + halfW / 2, panY + 30, TEXT_DARK, '8px', 0.5, 0);
        this.txt('lcm_val', `LCM = ${lcm}`, lcmPanX + halfW / 2, panY + 50, TEXT_PURPLE, '10px', 0.5, 0);

        // Verification panel
        const verY = panY + panH + 10;
        this.mainGfx.fillStyle(0xd1fae5, 1);
        this.mainGfx.fillRoundedRect(cx - 130, verY, 260, 28, 6);
        this.mainGfx.lineStyle(1, EMERALD, 1);
        this.mainGfx.strokeRoundedRect(cx - 130, verY, 260, 28, 6);
        this.txt('verify', `${hcf} × ${lcm} = ${hcf * lcm} = ${a} × ${b} ✓`, cx, verY + 14, TEXT_EMERALD, '9px', 0.5, 0.5);

        this.txt('hl_q', `What is HCF(${a}, ${b})?`, cx, verY + 38, TEXT_DARK, '10px', 0.5, 0);
        this.txt('hl_ans', 'Answer: ?', cx, verY + 56, TEXT_GOLD, '14px', 0.5, 0);
    }

    // ═════════════════════════════════════════════════════════════════
    // WORLD 5 — Decimal Dimension
    // ═════════════════════════════════════════════════════════════════

    // ── Level 25: Terminating Portal — 13/3125 ──────────────────
    private drawTerminatingPortal(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.38;
        const frac = (spec as any).rnDecimalFraction ?? { numerator: 13, denominator: 3125 };

        // Digital matrix background
        for (let i = 0; i < 50; i++) {
            const dx = Math.random() * W;
            const dy = 40 + Math.random() * (H - 80);
            this.bgGfx.fillStyle(EMERALD_LIGHT, 0.06);
            const digit = Math.floor(Math.random() * 10);
            // We'll use fillCircle as a stand-in for falling digits
            this.bgGfx.fillCircle(dx, dy, 1);
        }

        this.txt('tp_title', `🌀 Terminating Portal`, cx, 42, TEXT_EMERALD, '13px', 0.5, 0.5);

        // Portal (concentric circles with energy)
        const portalR = Math.min(55, W * 0.12);

        for (let ring = 5; ring >= 0; ring--) {
            const alpha = 0.05 + ring * 0.04;
            this.mainGfx.lineStyle(2, EMERALD, alpha);
            this.mainGfx.strokeCircle(cx, cy, portalR + ring * 10);
        }
        this.mainGfx.fillStyle(EMERALD, 0.15);
        this.mainGfx.fillCircle(cx, cy, portalR);
        this.mainGfx.fillStyle(0x059669, 0.4);
        this.mainGfx.fillCircle(cx, cy, portalR * 0.6);
        this.mainGfx.lineStyle(2.5, EMERALD, 1);
        this.mainGfx.strokeCircle(cx, cy, portalR);

        // TERMINATING label on portal
        this.txt('portal_label', 'TERMINATING', cx, cy, '#ffffff', '10px', 0.5, 0.5);

        // Fraction above portal
        this.txt('frac_display', `${frac.numerator} / ${frac.denominator}`, cx, cy - portalR - 18, TEXT_DARK, '16px', 0.5, 0.5);

        // Factorization below portal
        const factY = cy + portalR + 15;
        this.txt('factor_info', `${frac.denominator} = 5⁵`, cx, factY, TEXT_DARK, '10px', 0.5, 0);
        this.txt('rule_info', `Only 2s and 5s → Terminating!`, cx, factY + 18, TEXT_EMERALD, '10px', 0.5, 0);

        // Decimal result streaming through portal
        const decimal = frac.numerator / frac.denominator;
        this.txt('decimal_result', `= ${decimal}`, cx, factY + 38, TEXT_GOLD, '14px', 0.5, 0);

        this.txt('tp_q', 'How many decimal places?', cx, factY + 60, TEXT_DARK, '10px', 0.5, 0);
        this.txt('tp_ans', 'Answer: ?', cx, factY + 78, TEXT_GOLD, '14px', 0.5, 0);
    }

    // ── Level 26: Repeating Stream — 1/7 ────────────────────────
    private drawRepeatingStream(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.38;

        this.txt('rs_title', `🔄 Repeating Stream — 1/7`, cx, 42, TEXT_PURPLE, '12px', 0.5, 0.5);

        // Digital stream of digits
        const digits = '142857142857142857';
        const repeatBlock = '142857';
        const blockLen = repeatBlock.length;

        const digitW = Math.min(22, (W - 40) / (digits.length + 3));
        const digitH = 28;
        const streamX = cx - ((digits.length + 3) * digitW) / 2;
        const streamY = cy - digitH / 2;

        // Leading "0."
        this.mainGfx.fillStyle(0xdbeafe, 1);
        this.mainGfx.fillRoundedRect(streamX, streamY, digitW, digitH, 4);
        this.mainGfx.lineStyle(1, BLUE_LIGHT, 1);
        this.mainGfx.strokeRoundedRect(streamX, streamY, digitW, digitH, 4);
        this.txt('d_0', '0', streamX + digitW / 2, cy, TEXT_BLUE, '12px', 0.5, 0.5);

        this.mainGfx.fillStyle(0xdbeafe, 1);
        this.mainGfx.fillRoundedRect(streamX + digitW + 2, streamY, digitW / 2, digitH, 4);
        this.txt('d_dot', '.', streamX + digitW + 2 + digitW / 4, cy, TEXT_BLUE, '14px', 0.5, 0.5);

        const digitStart = streamX + digitW * 1.7;

        for (let i = 0; i < digits.length; i++) {
            const dx = digitStart + i * digitW;
            const isInRepeat = true;
            const blockIndex = i % blockLen;
            const blockNum = Math.floor(i / blockLen);

            // Color-code repeating blocks
            const isFirstBlock = blockNum === 0;
            const fillColor = isFirstBlock ? 0xFEF3C7 : 0xfef9c3;

            this.mainGfx.fillStyle(fillColor, 1);
            this.mainGfx.fillRoundedRect(dx, streamY, digitW - 2, digitH, 3);
            this.mainGfx.lineStyle(1, isFirstBlock ? GOLD : GOLD_DARK, isFirstBlock ? 1 : 0.5);
            this.mainGfx.strokeRoundedRect(dx, streamY, digitW - 2, digitH, 3);

            this.txt(`rd_${i}`, digits[i], dx + (digitW - 2) / 2, cy, isFirstBlock ? TEXT_GOLD : TEXT_DARK, '11px', 0.5, 0.5);
        }

        // Bracket over repeating block
        const bracketStart = digitStart;
        const bracketEnd = digitStart + blockLen * digitW;
        const bracketY = streamY - 8;
        this.mainGfx.lineStyle(2, GOLD, 1);
        this.mainGfx.lineBetween(bracketStart, bracketY, bracketEnd - 2, bracketY);
        this.mainGfx.lineBetween(bracketStart, bracketY, bracketStart, bracketY + 5);
        this.mainGfx.lineBetween(bracketEnd - 2, bracketY, bracketEnd - 2, bracketY + 5);
        this.txt('repeat_label', `"${repeatBlock}" repeats`, cx, bracketY - 10, TEXT_GOLD, '10px', 0.5, 1);

        // Ellipsis
        this.txt('stream_dots', '...', digitStart + digits.length * digitW + 4, cy, TEXT_LIGHT, '14px', 0, 0.5);

        // Period info
        const infoY = streamY + digitH + 18;
        this.txt('period_info', `Period = ${blockLen}`, cx, infoY, TEXT_PURPLE, '12px', 0.5, 0);
        this.txt('rs_frac', '1/7 = 0.142857̄', cx, infoY + 18, TEXT_DARK, '11px', 0.5, 0);

        this.txt('rs_q', 'What is the period (repeating block length)?', cx, infoY + 40, TEXT_DARK, '10px', 0.5, 0);
        this.txt('rs_ans', 'Answer: ?', cx, infoY + 58, TEXT_GOLD, '14px', 0.5, 0);
    }

    // ── Level 27: Rational Irrational — Sort 8 numbers ──────────
    private drawRationalIrrational(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;

        this.txt('ri_title', '♾️ Rational vs Irrational', cx, 42, TEXT_PURPLE, '12px', 0.5, 0.5);

        // Two containers
        const contW = Math.min(130, (W - 30) / 2 - 4);
        const contH = Math.min(160, H * 0.35);
        const contAx = cx - contW - 8;
        const contBx = cx + 8;
        const contY = 62;

        // Rational container (blue)
        this.mainGfx.fillStyle(0xdbeafe, 0.5);
        this.mainGfx.fillRoundedRect(contAx, contY, contW, contH, 10);
        this.mainGfx.lineStyle(2, BLUE_LIGHT, 1);
        this.mainGfx.strokeRoundedRect(contAx, contY, contW, contH, 10);
        this.txt('rat_label', '📘 RATIONAL', contAx + contW / 2, contY + 12, TEXT_BLUE, '10px', 0.5, 0);

        // Irrational container (purple)
        this.mainGfx.fillStyle(0xede9fe, 0.5);
        this.mainGfx.fillRoundedRect(contBx, contY, contW, contH, 10);
        this.mainGfx.lineStyle(2, PURPLE, 1);
        this.mainGfx.strokeRoundedRect(contBx, contY, contW, contH, 10);
        this.txt('irr_label', '📕 IRRATIONAL', contBx + contW / 2, contY + 12, TEXT_PURPLE, '10px', 0.5, 0);

        // 8 numbers as hexagonal crystals
        const numbers = [
            { text: '√2', rational: false },
            { text: '1/3', rational: true },
            { text: 'π', rational: false },
            { text: '0.75', rational: true },
            { text: '√5', rational: false },
            { text: '22/7', rational: true },
            { text: '√9=3', rational: true },
            { text: '0.101001...', rational: false },
        ];

        // Sort into containers visually
        let ratIdx = 0, irrIdx = 0;
        numbers.forEach((num, idx) => {
            let nx: number, ny: number;
            if (num.rational) {
                nx = contAx + contW / 2 + ((ratIdx % 2) - 0.5) * 40;
                ny = contY + 34 + Math.floor(ratIdx / 2) * 30;
                ratIdx++;
            } else {
                nx = contBx + contW / 2 + ((irrIdx % 2) - 0.5) * 40;
                ny = contY + 34 + Math.floor(irrIdx / 2) * 30;
                irrIdx++;
            }

            // Hexagonal crystal
            const hexR = Math.min(16, contW * 0.12);
            const glowColor = num.rational ? BLUE_LIGHT : PURPLE;
            this.mainGfx.fillStyle(glowColor, 0.1);
            this.drawHexagon(this.mainGfx, nx, ny, hexR + 3, 0, 0, 0);
            this.drawHexagon(this.mainGfx, nx, ny, hexR, num.rational ? 0xdbeafe : 0xede9fe, glowColor, 1.5);

            this.txt(`ri_${idx}`, num.text, nx, ny, num.rational ? TEXT_BLUE : TEXT_PURPLE, '7px', 0.5, 0.5);
        });

        // Divider line
        this.mainGfx.lineStyle(1, GRID, 0.5);
        this.mainGfx.lineBetween(cx, contY, cx, contY + contH);

        const qY = contY + contH + 14;
        this.txt('ri_q', 'How many rational numbers?', cx, qY, TEXT_DARK, '11px', 0.5, 0);
        this.txt('ri_ans', 'Answer: ?', cx, qY + 18, TEXT_GOLD, '14px', 0.5, 0);
    }

    // ── Level 28: Dimension Gateway — √2 is irrational ──────────
    private drawDimensionGateway(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;

        this.txt('dg_title', '🌌 Dimension Gateway — √2 is Irrational', cx, 42, TEXT_PURPLE, '11px', 0.5, 0.5);

        // Proof steps on floating tablets
        const proofSteps = [
            'Assume √2 = p/q (reduced form)',
            'Then 2 = p²/q² → p² = 2q²',
            'So p² is even → p is even → p = 2k',
            'Then 4k² = 2q² → q² = 2k²',
            'So q is also even → CONTRADICTION!',
        ];

        const tabletW = Math.min(280, W * 0.72);
        const tabletH = Math.min(34, (H - 160) / proofSteps.length - 4);
        const tabletX = cx - tabletW / 2;
        const startY = 64;

        proofSteps.forEach((step, idx) => {
            const ty = startY + idx * (tabletH + 8);
            const isLast = idx === proofSteps.length - 1;

            // Floating stone tablet effect
            this.mainGfx.fillStyle(0xffffff, 0.05);
            this.mainGfx.fillRoundedRect(tabletX + 3, ty + 3, tabletW, tabletH, 6);

            this.mainGfx.fillStyle(isLast ? 0xfee2e2 : 0xf8fafc, 1);
            this.mainGfx.fillRoundedRect(tabletX, ty, tabletW, tabletH, 6);
            this.mainGfx.lineStyle(1.5, isLast ? 0xef4444 : STONE_LIGHT, 1);
            this.mainGfx.strokeRoundedRect(tabletX, ty, tabletW, tabletH, 6);

            // Step number
            this.mainGfx.fillStyle(isLast ? 0xef4444 : PURPLE, 1);
            this.mainGfx.fillCircle(tabletX + 14, ty + tabletH / 2, 9);
            this.txt(`ps_n_${idx}`, String(idx + 1), tabletX + 14, ty + tabletH / 2, '#ffffff', '8px', 0.5, 0.5);

            this.txt(`ps_${idx}`, step, tabletX + 30, ty + tabletH / 2, isLast ? '#991b1b' : TEXT_DARK, '8px', 0, 0.5);
        });

        // Gateway portal at end
        const portalY = startY + proofSteps.length * (tabletH + 8) + 10;
        const portalR = Math.min(30, W * 0.07);

        for (let ring = 3; ring >= 0; ring--) {
            this.mainGfx.lineStyle(1.5, PURPLE, 0.08 + ring * 0.06);
            this.mainGfx.strokeCircle(cx, portalY + portalR, portalR + ring * 8);
        }
        this.mainGfx.fillStyle(PURPLE, 0.3);
        this.mainGfx.fillCircle(cx, portalY + portalR, portalR);
        this.mainGfx.lineStyle(2, PURPLE, 1);
        this.mainGfx.strokeCircle(cx, portalY + portalR, portalR);
        this.txt('portal_icon', '√2 ∉ ℚ', cx, portalY + portalR, '#ffffff', '10px', 0.5, 0.5);

        this.txt('dg_msg', 'p/q was in reduced form, but both are even!', cx, portalY + portalR * 2 + 10, '#991b1b', '9px', 0.5, 0);
        this.txt('dg_q', 'How many steps in this proof?', cx, portalY + portalR * 2 + 28, TEXT_DARK, '10px', 0.5, 0);
        this.txt('dg_ans', 'Answer: ?', cx, portalY + portalR * 2 + 46, TEXT_GOLD, '14px', 0.5, 0);
    }

    // ── Level 29: Decimal Classify — 5 fractions ─────────────────
    private drawDecimalClassify(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;

        this.txt('dc_title', '🏷️ Decimal Classification', cx, 42, TEXT_BLUE, '12px', 0.5, 0.5);

        // 5 fraction cards
        const fractions = [
            { num: 7, den: 8, denFactors: '2³', terminating: true },
            { num: 1, den: 3, denFactors: '3¹', terminating: false },
            { num: 13, den: 125, denFactors: '5³', terminating: true },
            { num: 7, den: 12, denFactors: '2² × 3', terminating: false },
            { num: 23, den: 200, denFactors: '2³ × 5²', terminating: true },
        ];

        const cardW = Math.min(56, (W - 20) / fractions.length - 4);
        const cardH = Math.min(90, H * 0.2);
        const cardsW = fractions.length * (cardW + 4) - 4;
        const cardsX = cx - cardsW / 2;
        const cardY = 64;

        fractions.forEach((f, idx) => {
            const fx = cardsX + idx * (cardW + 4);
            const fillColor = f.terminating ? 0xd1fae5 : 0xfee2e2;
            const borderColor = f.terminating ? EMERALD : 0xef4444;

            this.mainGfx.fillStyle(fillColor, 1);
            this.mainGfx.fillRoundedRect(fx, cardY, cardW, cardH, 6);
            this.mainGfx.lineStyle(1.5, borderColor, 1);
            this.mainGfx.strokeRoundedRect(fx, cardY, cardW, cardH, 6);

            // Fraction
            this.txt(`fc_num_${idx}`, String(f.num), fx + cardW / 2, cardY + 14, TEXT_DARK, '12px', 0.5, 0.5);
            this.mainGfx.lineStyle(1, TEXT_DARK === '#1E293B' ? 0x1e293b : 0x334155, 1);
            this.mainGfx.lineBetween(fx + 6, cardY + 24, fx + cardW - 6, cardY + 24);
            this.txt(`fc_den_${idx}`, String(f.den), fx + cardW / 2, cardY + 36, TEXT_DARK, '12px', 0.5, 0.5);

            // Denominator factorization
            this.txt(`fc_pf_${idx}`, f.denFactors, fx + cardW / 2, cardY + 52, TEXT_LIGHT, '7px', 0.5, 0);

            // Terminating / Non-terminating label
            this.txt(`fc_type_${idx}`, f.terminating ? '✓ T' : '✗ NT', fx + cardW / 2, cardY + cardH - 12, f.terminating ? TEXT_EMERALD : '#991b1b', '8px', 0.5, 0.5);
        });

        // Bins below
        const binY = cardY + cardH + 14;
        const binW = Math.min(120, (W - 20) / 2 - 5);

        // Terminating bin
        this.mainGfx.fillStyle(0xd1fae5, 0.4);
        this.mainGfx.fillRoundedRect(cx - binW - 5, binY, binW, 32, 6);
        this.mainGfx.lineStyle(1, EMERALD, 1);
        this.mainGfx.strokeRoundedRect(cx - binW - 5, binY, binW, 32, 6);
        this.txt('bin_term', '✅ Terminating', cx - binW / 2 - 5, binY + 16, TEXT_EMERALD, '9px', 0.5, 0.5);

        // Non-terminating bin
        this.mainGfx.fillStyle(0xfee2e2, 0.4);
        this.mainGfx.fillRoundedRect(cx + 5, binY, binW, 32, 6);
        this.mainGfx.lineStyle(1, 0xef4444, 1);
        this.mainGfx.strokeRoundedRect(cx + 5, binY, binW, 32, 6);
        this.txt('bin_nterm', '⛔ Non-terminating', cx + binW / 2 + 5, binY + 16, '#991b1b', '9px', 0.5, 0.5);

        // Rule reminder
        this.txt('dc_rule', 'Rule: Denominator has ONLY 2s and 5s → Terminating', cx, binY + 44, TEXT_DARK, '8px', 0.5, 0);

        const termCount = fractions.filter(f => f.terminating).length;
        this.txt('dc_q', `How many fractions are terminating?`, cx, binY + 62, TEXT_DARK, '10px', 0.5, 0);
        this.txt('dc_ans', 'Answer: ?', cx, binY + 80, TEXT_GOLD, '14px', 0.5, 0);
    }

    // ── Level 30: Final Boss — THE REAL NUMBER CORE ──────────────
    private drawFinalBoss(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2;

        // Epic banner
        this.mainGfx.fillStyle(0x1e1b4b, 1);
        this.mainGfx.fillRect(0, 30, W, 44);
        this.txt('fb_ttl', '⚔️  FINAL BOSS: THE REAL NUMBER CORE  ⚔️', cx, 52, '#FFD700', '12px', 0.5, 0.5);

        // Phase indicator (5 phases)
        const phases = ['Factor Crystal', 'Euclid Engine', 'Prime Reactor', 'Gear Sync', 'Decimal Gate'];
        const phaseY = 82;
        const phaseW = Math.min(300, W * 0.78);
        const phaseX = cx - phaseW / 2;

        phases.forEach((phase, idx) => {
            const pw = phaseW / phases.length - 2;
            const px = phaseX + idx * (pw + 2);
            const colors = [GOLD, BLUE_LIGHT, PURPLE, EMERALD, 0xf97316];
            this.mainGfx.fillStyle(idx === 0 ? colors[idx] : 0xe5e7eb, 1);
            this.mainGfx.fillRoundedRect(px, phaseY, pw, 14, 3);
            this.txt(`fbp_${idx}`, `P${idx + 1}`, px + pw / 2, phaseY + 7, idx === 0 ? '#ffffff' : TEXT_LIGHT, '7px', 0.5, 0.5);
        });
        this.txt('fb_phase', `Phase 1: ${phases[0]}`, cx, phaseY + 20, TEXT_GOLD, '9px', 0.5, 0);

        // Boss health bar
        const hpY = phaseY + 34;
        const hpW = Math.min(280, W * 0.7);
        this.mainGfx.fillStyle(0x1e293b, 1);
        this.mainGfx.fillRoundedRect(cx - hpW / 2, hpY, hpW, 16, 8);
        this.mainGfx.fillStyle(0xef4444, 1);
        this.mainGfx.fillRoundedRect(cx - hpW / 2, hpY, hpW, 16, 8);
        this.txt('fb_hp', 'BOSS HP: 100%', cx, hpY + 8, '#ffffff', '8px', 0.5, 0.5);

        // Central reactor core with energy beams
        const coreY = H * 0.5;
        const coreR = Math.min(42, W * 0.1);

        // Energy beams connecting to 5 phase nodes around the core
        const phasePositions = [
            { angle: -Math.PI / 2, color: GOLD, label: '252' },
            { angle: -Math.PI / 2 + (2 * Math.PI / 5), color: BLUE_LIGHT, label: 'HCF' },
            { angle: -Math.PI / 2 + (4 * Math.PI / 5), color: PURPLE, label: 'PF' },
            { angle: -Math.PI / 2 + (6 * Math.PI / 5), color: EMERALD, label: 'LCM' },
            { angle: -Math.PI / 2 + (8 * Math.PI / 5), color: 0xf97316, label: '2.4' },
        ];

        const orbitR = coreR + Math.min(55, W * 0.12);
        phasePositions.forEach((pp, idx) => {
            const nx = cx + Math.cos(pp.angle) * orbitR;
            const ny = coreY + Math.sin(pp.angle) * orbitR;

            // Energy beam
            this.mainGfx.lineStyle(1.5, pp.color, 0.4);
            this.mainGfx.lineBetween(cx + Math.cos(pp.angle) * coreR, coreY + Math.sin(pp.angle) * coreR, nx, ny);

            // Phase node
            this.mainGfx.fillStyle(pp.color, 0.2);
            this.mainGfx.fillCircle(nx, ny, 16);
            this.mainGfx.fillStyle(pp.color, 0.7);
            this.mainGfx.fillCircle(nx, ny, 12);
            this.mainGfx.lineStyle(1.5, pp.color, 1);
            this.mainGfx.strokeCircle(nx, ny, 16);

            this.txt(`fn_${idx}`, pp.label, nx, ny, '#ffffff', '8px', 0.5, 0.5);
        });

        // Core with pulsing rings
        for (let ring = 3; ring >= 0; ring--) {
            const rColors = [GOLD, PURPLE, BLUE_LIGHT, EMERALD];
            this.mainGfx.lineStyle(1.5, rColors[ring], 0.1 + ring * 0.05);
            this.mainGfx.strokeCircle(cx, coreY, coreR + ring * 8);
        }

        // Core
        this.mainGfx.fillStyle(0x1e1b4b, 1);
        this.mainGfx.fillCircle(cx, coreY, coreR);
        this.mainGfx.lineStyle(2.5, GOLD, 1);
        this.mainGfx.strokeCircle(cx, coreY, coreR);
        this.mainGfx.fillStyle(GOLD, 0.3);
        this.mainGfx.fillCircle(cx, coreY, coreR * 0.5);
        this.txt('fb_core', '252', cx, coreY, '#FFD700', '18px', 0.5, 0.5);

        // Bottom text
        this.txt('fb_motto', '🏰 RESTORE THE NUMBER KINGDOM 🏰', cx, coreY + orbitR + 24, TEXT_GOLD, '10px', 0.5, 0);

        // Phase details
        const detailY = coreY + orbitR + 42;
        const details = [
            '252 = 2² × 3² × 7',
            'HCF(252, 105) = 21',
            'LCM(252, 105) = 1260',
            '252/105 = 2.4 (terminating)',
        ];
        details.forEach((d, idx) => {
            this.txt(`fd_${idx}`, d, cx, detailY + idx * 14, TEXT_DARK, '8px', 0.5, 0);
        });

        this.txt('fb_q', 'How many distinct prime factors does 252 have?', cx, detailY + details.length * 14 + 8, TEXT_DARK, '10px', 0.5, 0);
        this.txt('fb_ans', 'Answer: ?', cx, detailY + details.length * 14 + 26, TEXT_GOLD, '16px', 0.5, 0);
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
        const col  = val !== 0 ? (isRight ? '#059669' : '#dc2626') : TEXT_GOLD;

        // Update answer label for all modes
        const answerKeys = [
            'gate_ans', 'prime_count', 'machine_ans', 'mult_ans',
            'prime_total', 'div_ans', 'doors_ans', 'maze_hcf',
            'eng_hcf', 'hcf_result', 'timed_hcf', 'pf_q',
            'ft_q', 'vault_ans', 'uf_ans', 'reactor_ans',
            'boss_ans', 'lcm_ans', 'opt_ans', 'pr_ans',
            'gb_ans', 'sa_ans', 'hl_ans', 'tp_ans',
            'rs_ans', 'ri_ans', 'dg_ans', 'dc_ans', 'fb_ans',
            'count_label',
        ];

        for (const key of answerKeys) {
            const label = this.labels[key];
            if (label) {
                const text = label.text;
                if (text.includes('?') || text.includes('Answer')) {
                    const newText = val !== 0 ? text.replace('?', String(val)) : text;
                    label.setText(newText).setColor(col);
                }
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────────

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

    // Draw a hexagon shape
    private drawHexagon(gfx: GameObjects.Graphics, cx: number, cy: number, r: number, fill: number, stroke: number, lineW: number) {
        const points: { x: number; y: number }[] = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
        }
        if (fill) {
            gfx.fillStyle(fill, 1);
            gfx.beginPath();
            gfx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < 6; i++) gfx.lineTo(points[i].x, points[i].y);
            gfx.closePath();
            gfx.fillPath();
        }
        if (stroke && lineW > 0) {
            gfx.lineStyle(lineW, stroke, 1);
            gfx.beginPath();
            gfx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < 6; i++) gfx.lineTo(points[i].x, points[i].y);
            gfx.closePath();
            gfx.strokePath();
        }
    }

    // Draw a pentagon shape
    private drawPentagon(gfx: GameObjects.Graphics, cx: number, cy: number, r: number) {
        gfx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
            const px = cx + r * Math.cos(angle);
            const py = cy + r * Math.sin(angle);
            if (i === 0) gfx.moveTo(px, py); else gfx.lineTo(px, py);
        }
        gfx.closePath();
        gfx.fillPath();
    }

    // Draw a gear (circle with teeth)
    private drawGear(cx: number, cy: number, r: number, teeth: number, fill: number, stroke: number) {
        // Inner circle
        this.mainGfx.fillStyle(fill, 1);
        this.mainGfx.fillCircle(cx, cy, r);
        this.mainGfx.lineStyle(1.5, stroke, 1);
        this.mainGfx.strokeCircle(cx, cy, r);

        // Teeth as small rectangles around edge
        const actualTeeth = Math.min(teeth, 24);
        const toothW = Math.max(3, r * 0.2);
        const toothH = Math.max(4, r * 0.25);
        for (let i = 0; i < actualTeeth; i++) {
            const angle = (i / actualTeeth) * Math.PI * 2;
            const tx = cx + Math.cos(angle) * (r + toothH / 2);
            const ty = cy + Math.sin(angle) * (r + toothH / 2);

            this.mainGfx.save();
            this.mainGfx.fillStyle(fill, 1);
            // Approximate tooth as filled rectangle (rotated)
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const hw = toothW / 2;
            const hh = toothH / 2;
            const corners = [
                { x: tx + cos * hh - sin * (-hw), y: ty + sin * hh + cos * (-hw) },
                { x: tx + cos * hh - sin * hw, y: ty + sin * hh + cos * hw },
                { x: tx + cos * (-hh) - sin * hw, y: ty + sin * (-hh) + cos * hw },
                { x: tx + cos * (-hh) - sin * (-hw), y: ty + sin * (-hh) + cos * (-hw) },
            ];
            this.mainGfx.fillStyle(stroke, 0.8);
            this.mainGfx.beginPath();
            this.mainGfx.moveTo(corners[0].x, corners[0].y);
            for (let c = 1; c < 4; c++) this.mainGfx.lineTo(corners[c].x, corners[c].y);
            this.mainGfx.closePath();
            this.mainGfx.fillPath();
            this.mainGfx.restore();
        }

        // Center dot
        this.mainGfx.fillStyle(stroke, 1);
        this.mainGfx.fillCircle(cx, cy, r * 0.2);
    }

    // Superscript helper
    private superscript(n: number): string {
        const supers: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
        return String(n).split('').map(c => supers[c] ?? c).join('');
    }

    // GCD helper
    private gcd(a: number, b: number): number {
        a = Math.abs(a); b = Math.abs(b);
        while (b) { [a, b] = [b, a % b]; }
        return a;
    }
}
