import Phaser, { Scene, GameObjects } from 'phaser';
import { EventBus } from '../engine/EventBus';
import { getLevelSpec } from '@/data/levelSpecs';
import type { LevelSpecification } from '@/data/levelSpecs';
import { soundManager } from '../engine/SoundManager';

const FONT = 'Inter, system-ui, -apple-system, sans-serif';

// ─── Colors ───────────────────────────────────────────────────────
const ELECTRIC_BLUE  = 0x00B4FF;
const NEON_ORANGE    = 0xFF6B35;
const SILVER         = 0xC0C0C0;
const NEON_PURPLE    = 0xAA55FF;
const DARK_BG        = 0x0A1628;
const GRID_DOTS      = 0x1A3A5C;
const CYAN           = 0x00E5FF;
const EMERALD        = 0x00E676;
const DANGER_RED     = 0xFF1744;
const FACTORY_DARK   = 0x0D1B2A;
const METAL_DARK     = 0x374151;
const METAL_LIGHT    = 0x9CA3AF;
const ENERGY_GLOW    = 0x00B4FF;
const PANEL_BG       = 0x1B2838;
const PANEL_BORDER   = 0x2A4060;

// Text colors (hex strings)
const T_BLUE    = '#00B4FF';
const T_ORANGE  = '#FF6B35';
const T_PURPLE  = '#AA55FF';
const T_CYAN    = '#00E5FF';
const T_GREEN   = '#00E676';
const T_WHITE   = '#E2E8F0';
const T_SILVER  = '#94A3B8';
const T_DARK    = '#0F172A';
const T_RED     = '#FF1744';

export class PolynomialScene extends Scene {

    private bgGfx!: GameObjects.Graphics;
    private mainGfx!: GameObjects.Graphics;
    private labels: Record<string, GameObjects.Text> = {};

    private levelSpec: LevelSpecification | null = null;
    private isLevelActive = false;
    private currentInput = 0;
    private lastInput = -9999;

    constructor() { super('PolynomialScene'); }

    // ─────────────────────────────────────────────────────────────────
    create() {
        this.cameras.main.setBackgroundColor('#0D1B2A');
        this.bgGfx   = this.add.graphics();
        this.mainGfx = this.add.graphics();

        const onLoadLevel = (levelData: any) => {
            if (!this.scene?.systems) return;
            if (!levelData.id.startsWith('lvl-poly-')) {
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

        const onCorrect = () => { this.flashScreen(0x00E676); this.celebrateSuccess(); };
        const onWrong   = () => this.flashScreen(0xFF1744);

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

        // Factory background
        this.bgGfx.fillStyle(FACTORY_DARK, 1);
        this.bgGfx.fillRect(0, 0, W, H);
        this.bgGfx.fillStyle(DARK_BG, 0.08);
        this.bgGfx.fillRect(0, 30, W, H - 64);

        // Dot-grid background
        this.bgGfx.fillStyle(GRID_DOTS, 0.4);
        for (let x = 20; x < W; x += 26) for (let y = 20; y < H; y += 26)
            this.bgGfx.fillCircle(x, y, 1.1);

        // World / level label
        const levelNum = parseInt(spec.id.replace('lvl-poly-', ''), 10);
        const worldNum = levelNum <= 6 ? 1 : levelNum <= 12 ? 2 : levelNum <= 18 ? 3 : levelNum <= 24 ? 4 : 5;
        const worldNames = ['', 'Polynomial Factory Foundations', 'Degree Control Systems', 'Zero Hunters', 'Graph Reactor Lab', 'Coefficient Mastery Center'];
        this.txt('w_lbl', `W${worldNum}: ${worldNames[worldNum]}  ·  Level ${levelNum}`, 16, 14, T_BLUE, '10px', 0, 0);

        // Formula bar at bottom
        this.bgGfx.fillStyle(PANEL_BG, 0.9);
        this.bgGfx.fillRect(0, H - 34, W, 34);
        this.bgGfx.lineStyle(1, PANEL_BORDER, 1);
        this.bgGfx.lineBetween(0, H - 34, W, H - 34);
        this.txt('formula', `📐  ${spec.formulaDisplay}`, W / 2, H - 17, T_SILVER, '11px', 0.5, 0.5);

        // Route to mode-specific draw method
        const mode = (spec as any).polyMode ?? '';
        switch (mode) {
            case 'machine_activate':        this.drawMachineActivate(spec, W, H); break;
            case 'term_identify':           this.drawTermIdentify(spec, W, H); break;
            case 'conveyor_build':          this.drawConveyorBuild(spec, W, H); break;
            case 'degree_sort':             this.drawDegreeSort(spec, W, H); break;
            case 'engine_repair':           this.drawEngineRepair(spec, W, H); break;
            case 'factory_startup':         this.drawFactoryStartup(spec, W, H); break;
            case 'reactor_classify':        this.drawReactorClassify(spec, W, H); break;
            case 'upgrade_machine':         this.drawUpgradeMachine(spec, W, H); break;
            case 'cubic_generator':         this.drawCubicGenerator(spec, W, H); break;
            case 'zone_sort':              this.drawZoneSort(spec, W, H); break;
            case 'balance_degree':          this.drawBalanceDegree(spec, W, H); break;
            case 'classification_mission':  this.drawClassificationMission(spec, W, H); break;
            case 'shutdown_find':           this.drawShutdownFind(spec, W, H); break;
            case 'root_locate':             this.drawRootLocate(spec, W, H); break;
            case 'reactor_deactivate':      this.drawReactorDeactivate(spec, W, H); break;
            case 'vault_unlock':            this.drawVaultUnlock(spec, W, H); break;
            case 'graph_repair':            this.drawGraphRepair(spec, W, H); break;
            case 'root_arena':              this.drawRootArena(spec, W, H); break;
            case 'energy_beam':             this.drawEnergyBeam(spec, W, H); break;
            case 'path_observe':            this.drawPathObserve(spec, W, H); break;
            case 'drone_guide':             this.drawDroneGuide(spec, W, H); break;
            case 'nav_repair':              this.drawNavRepair(spec, W, H); break;
            case 'intersection_predict':    this.drawIntersectionPredict(spec, W, H); break;
            case 'graph_puzzle':            this.drawGraphPuzzle(spec, W, H); break;
            case 'build_from_roots':        this.drawBuildFromRoots(spec, W, H); break;
            case 'coefficient_balance':     this.drawCoefficientBalance(spec, W, H); break;
            case 'reverse_engineer':        this.drawReverseEngineer(spec, W, H); break;
            case 'optimal_build':           this.drawOptimalBuild(spec, W, H); break;
            case 'multi_sync':              this.drawMultiSync(spec, W, H); break;
            case 'final_boss':              this.drawFinalBoss(spec, W, H); break;
            default:                        this.drawMachineActivate(spec, W, H); break;
        }

        this.refreshLive();
    }

    // ═════════════════════════════════════════════════════════════════
    // SHARED HELPERS
    // ═════════════════════════════════════════════════════════════════

    private drawPanel(gfx: GameObjects.Graphics, x: number, y: number, w: number, h: number, fillColor: number, borderColor: number, radius = 8) {
        gfx.fillStyle(fillColor, 1);
        gfx.fillRoundedRect(x, y, w, h, radius);
        gfx.lineStyle(1.5, borderColor, 1);
        gfx.strokeRoundedRect(x, y, w, h, radius);
    }

    private drawGauge(gfx: GameObjects.Graphics, x: number, y: number, w: number, h: number, fillPercent: number, color: number) {
        // Gauge background
        gfx.fillStyle(METAL_DARK, 1);
        gfx.fillRoundedRect(x, y, w, h, 4);
        gfx.lineStyle(1, METAL_LIGHT, 0.5);
        gfx.strokeRoundedRect(x, y, w, h, 4);
        // Gauge fill
        const fillW = Math.max(0, (w - 4) * Math.min(1, fillPercent));
        if (fillW > 0) {
            gfx.fillStyle(color, 0.9);
            gfx.fillRoundedRect(x + 2, y + 2, fillW, h - 4, 3);
        }
        // Glow on fill
        if (fillPercent > 0) {
            gfx.fillStyle(color, 0.15);
            gfx.fillRoundedRect(x, y - 2, w, h + 4, 6);
        }
    }

    private drawMachineBody(gfx: GameObjects.Graphics, cx: number, cy: number, w: number, h: number) {
        // Shadow
        gfx.fillStyle(0x000000, 0.2);
        gfx.fillRoundedRect(cx - w / 2 + 3, cy - h / 2 + 3, w, h, 10);
        // Main body
        gfx.fillStyle(METAL_DARK, 1);
        gfx.fillRoundedRect(cx - w / 2, cy - h / 2, w, h, 10);
        // Top metallic highlight
        gfx.fillStyle(METAL_LIGHT, 0.12);
        gfx.fillRoundedRect(cx - w / 2 + 4, cy - h / 2 + 4, w - 8, h * 0.15, 6);
        // Border
        gfx.lineStyle(2, PANEL_BORDER, 1);
        gfx.strokeRoundedRect(cx - w / 2, cy - h / 2, w, h, 10);
        // Corner bolts
        const boltR = 3;
        const offsets = [
            [cx - w / 2 + 12, cy - h / 2 + 12],
            [cx + w / 2 - 12, cy - h / 2 + 12],
            [cx - w / 2 + 12, cy + h / 2 - 12],
            [cx + w / 2 - 12, cy + h / 2 - 12],
        ];
        offsets.forEach(([bx, by]) => {
            gfx.fillStyle(METAL_LIGHT, 0.5);
            gfx.fillCircle(bx, by, boltR);
            gfx.lineStyle(1, SILVER, 0.4);
            gfx.strokeCircle(bx, by, boltR);
        });
    }

    private drawConveyorBelt(gfx: GameObjects.Graphics, x: number, y: number, w: number) {
        // Belt body
        gfx.fillStyle(METAL_DARK, 1);
        gfx.fillRect(x, y, w, 14);
        gfx.lineStyle(1.5, METAL_LIGHT, 0.6);
        gfx.strokeRect(x, y, w, 14);
        // Belt ridges
        for (let bx = x + 8; bx < x + w - 4; bx += 16) {
            gfx.fillStyle(METAL_LIGHT, 0.2);
            gfx.fillRect(bx, y + 2, 8, 10);
        }
        // Rollers at ends
        gfx.fillStyle(SILVER, 0.6);
        gfx.fillCircle(x + 4, y + 7, 6);
        gfx.fillCircle(x + w - 4, y + 7, 6);
        gfx.lineStyle(1, METAL_LIGHT, 0.8);
        gfx.strokeCircle(x + 4, y + 7, 6);
        gfx.strokeCircle(x + w - 4, y + 7, 6);
    }

    private drawReactorCore(gfx: GameObjects.Graphics, cx: number, cy: number, r: number, color: number, pulseAlpha = 0.3) {
        // Outer glow
        gfx.fillStyle(color, pulseAlpha * 0.3);
        gfx.fillCircle(cx, cy, r + 12);
        gfx.fillStyle(color, pulseAlpha * 0.5);
        gfx.fillCircle(cx, cy, r + 6);
        // Core
        gfx.fillStyle(PANEL_BG, 1);
        gfx.fillCircle(cx, cy, r);
        gfx.lineStyle(2.5, color, 0.9);
        gfx.strokeCircle(cx, cy, r);
        // Inner glow
        gfx.fillStyle(color, 0.15);
        gfx.fillCircle(cx, cy, r * 0.7);
        // Center dot
        gfx.fillStyle(color, 0.8);
        gfx.fillCircle(cx, cy, r * 0.15);
    }

    private drawTermBlock(gfx: GameObjects.Graphics, x: number, y: number, text: string, color: number) {
        const w = Math.max(50, text.length * 12 + 16);
        const h = 32;
        gfx.fillStyle(PANEL_BG, 1);
        gfx.fillRoundedRect(x - w / 2, y - h / 2, w, h, 6);
        gfx.lineStyle(2, color, 0.9);
        gfx.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 6);
        // Inner glow bar
        gfx.fillStyle(color, 0.12);
        gfx.fillRoundedRect(x - w / 2 + 2, y - h / 2 + 2, w - 4, 6, 3);
        return { w, h };
    }

    private drawNumberLine(gfx: GameObjects.Graphics, x: number, y: number, w: number, min: number, max: number) {
        // Main line
        gfx.lineStyle(2, METAL_LIGHT, 0.8);
        gfx.lineBetween(x, y, x + w, y);
        // Arrow tips
        gfx.fillStyle(METAL_LIGHT, 0.8);
        gfx.fillTriangle(x + w, y, x + w - 6, y - 4, x + w - 6, y + 4);
        gfx.fillTriangle(x, y, x + 6, y - 4, x + 6, y + 4);
        // Ticks
        const range = max - min;
        for (let v = Math.ceil(min); v <= Math.floor(max); v++) {
            const px = x + ((v - min) / range) * w;
            gfx.lineStyle(1, METAL_LIGHT, 0.6);
            gfx.lineBetween(px, y - 5, px, y + 5);
            this.txt(`nl_${v}`, String(v), px, y + 10, T_SILVER, '8px', 0.5, 0);
        }
    }

    private drawPolyGraph(gfx: GameObjects.Graphics, originX: number, originY: number, width: number, height: number, coefficients: number[], xMin: number, xMax: number, color: number) {
        // Draw axes
        const halfH = height / 2;
        const axisY = originY + halfH;
        const axisEndX = originX + width;

        // Y axis
        gfx.lineStyle(1.5, METAL_LIGHT, 0.7);
        gfx.lineBetween(originX, originY, originX, originY + height);
        // X axis
        gfx.lineBetween(originX - 10, axisY, axisEndX + 10, axisY);

        // Arrow tips on axes
        gfx.fillStyle(METAL_LIGHT, 0.7);
        gfx.fillTriangle(originX, originY, originX - 3, originY + 8, originX + 3, originY + 8);
        gfx.fillTriangle(axisEndX + 10, axisY, axisEndX + 2, axisY - 3, axisEndX + 2, axisY + 3);

        // Evaluate polynomial
        const evaluate = (x: number): number => {
            let result = 0;
            for (let i = 0; i < coefficients.length; i++) {
                result += coefficients[i] * Math.pow(x, coefficients.length - 1 - i);
            }
            return result;
        };

        // Find y range for scaling
        const steps = 200;
        const dx = (xMax - xMin) / steps;
        let yMin = Infinity, yMax = -Infinity;
        const points: { x: number; y: number }[] = [];
        for (let i = 0; i <= steps; i++) {
            const xv = xMin + i * dx;
            const yv = evaluate(xv);
            points.push({ x: xv, y: yv });
            if (yv < yMin) yMin = yv;
            if (yv > yMax) yMax = yv;
        }
        // Add margins
        const yRange = Math.max(1, yMax - yMin);
        yMin -= yRange * 0.1;
        yMax += yRange * 0.1;
        const updatedYRange = yMax - yMin;

        // Draw tick marks on x-axis
        for (let v = Math.ceil(xMin); v <= Math.floor(xMax); v++) {
            const px = originX + ((v - xMin) / (xMax - xMin)) * width;
            gfx.lineStyle(1, METAL_LIGHT, 0.3);
            gfx.lineBetween(px, axisY - 3, px, axisY + 3);
            this.txt(`gx_${v}`, String(v), px, axisY + 6, T_SILVER, '7px', 0.5, 0);
        }

        // Draw tick marks on y-axis
        const yTickStep = Math.max(1, Math.ceil(updatedYRange / 6));
        for (let v = Math.ceil(yMin); v <= Math.floor(yMax); v += yTickStep) {
            const py = originY + height - ((v - yMin) / updatedYRange) * height;
            if (Math.abs(py - axisY) > 10) {
                gfx.lineStyle(1, METAL_LIGHT, 0.3);
                gfx.lineBetween(originX - 3, py, originX + 3, py);
                this.txt(`gy_${v}`, String(v), originX - 8, py, T_SILVER, '7px', 1, 0.5);
            }
        }

        // Draw the curve
        gfx.lineStyle(2.5, color, 1);
        gfx.beginPath();
        let started = false;
        for (const pt of points) {
            const px = originX + ((pt.x - xMin) / (xMax - xMin)) * width;
            const py = originY + height - ((pt.y - yMin) / updatedYRange) * height;
            // Clamp to visible area
            if (py < originY - 20 || py > originY + height + 20) {
                started = false;
                continue;
            }
            if (!started) {
                gfx.moveTo(px, py);
                started = true;
            } else {
                gfx.lineTo(px, py);
            }
        }
        gfx.strokePath();

        // Mark x-intercepts (zeros)
        for (let i = 1; i < points.length; i++) {
            if ((points[i - 1].y > 0 && points[i].y <= 0) || (points[i - 1].y < 0 && points[i].y >= 0)) {
                // Linear interpolation for zero crossing
                const ratio = Math.abs(points[i - 1].y) / (Math.abs(points[i - 1].y) + Math.abs(points[i].y));
                const zeroX = points[i - 1].x + ratio * (points[i].x - points[i - 1].x);
                const px = originX + ((zeroX - xMin) / (xMax - xMin)) * width;
                gfx.fillStyle(EMERALD, 0.3);
                gfx.fillCircle(px, axisY, 8);
                gfx.fillStyle(EMERALD, 1);
                gfx.fillCircle(px, axisY, 4);
                gfx.lineStyle(1.5, EMERALD, 1);
                gfx.strokeCircle(px, axisY, 4);
                this.txt(`zero_${i}`, `${Math.round(zeroX * 10) / 10}`, px, axisY - 14, T_GREEN, '9px', 0.5, 1);
            }
        }

        // Mark y-intercept
        const yInt = evaluate(0);
        if (0 >= xMin && 0 <= xMax) {
            const yIntPx = originY + height - ((yInt - yMin) / updatedYRange) * height;
            if (yIntPx >= originY && yIntPx <= originY + height) {
                gfx.fillStyle(NEON_ORANGE, 0.8);
                gfx.fillCircle(originX, yIntPx, 4);
                gfx.lineStyle(1, NEON_ORANGE, 1);
                gfx.strokeCircle(originX, yIntPx, 4);
            }
        }

        // Axis labels
        this.txt('g_xlabel', 'x', axisEndX + 14, axisY - 2, T_SILVER, '9px', 0, 0.5);
        this.txt('g_ylabel', 'y', originX + 6, originY - 4, T_SILVER, '9px', 0, 1);

        return { evaluate, yMin, yMax: yMax, axisY };
    }

    private drawPipe(gfx: GameObjects.Graphics, x1: number, y1: number, x2: number, y2: number, color: number) {
        gfx.lineStyle(4, METAL_DARK, 1);
        gfx.lineBetween(x1, y1, x2, y2);
        gfx.lineStyle(2, color, 0.5);
        gfx.lineBetween(x1, y1, x2, y2);
    }

    private drawSpark(gfx: GameObjects.Graphics, x: number, y: number) {
        const colors = [NEON_ORANGE, ELECTRIC_BLUE, CYAN];
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 4 + Math.random() * 10;
            const sx = x + Math.cos(angle) * dist;
            const sy = y + Math.sin(angle) * dist;
            gfx.fillStyle(colors[i % colors.length], 0.5 + Math.random() * 0.4);
            gfx.fillCircle(sx, sy, 1 + Math.random() * 1.5);
        }
    }

    private drawWarningTriangle(gfx: GameObjects.Graphics, cx: number, cy: number, size: number) {
        gfx.fillStyle(DANGER_RED, 0.9);
        gfx.fillTriangle(cx, cy - size, cx - size * 0.9, cy + size * 0.6, cx + size * 0.9, cy + size * 0.6);
        gfx.lineStyle(1.5, 0xFFFFFF, 0.8);
        gfx.strokeTriangle(cx, cy - size, cx - size * 0.9, cy + size * 0.6, cx + size * 0.9, cy + size * 0.6);
    }

    private drawSteam(gfx: GameObjects.Graphics, x: number, y: number, count: number) {
        for (let i = 0; i < count; i++) {
            const sx = x - 15 + Math.random() * 30;
            const sy = y - Math.random() * 30;
            const r = 2 + Math.random() * 4;
            gfx.fillStyle(0xFFFFFF, 0.08 + Math.random() * 0.12);
            gfx.fillCircle(sx, sy, r);
        }
    }

    // Superscript helper
    private sup(n: number | string): string {
        const supers: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
        return String(n).split('').map(c => supers[c] ?? c).join('');
    }

    // ═════════════════════════════════════════════════════════════════
    // WORLD 1 — Polynomial Factory Foundations
    // ═════════════════════════════════════════════════════════════════

    // ── Level 1: Machine Activate — Count terms of 3x² + 2x − 5 ──
    private drawMachineActivate(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.38;

        // Factory ambient particles
        for (let i = 0; i < 30; i++) {
            const px = Math.random() * W;
            const py = 40 + Math.random() * (H - 100);
            this.bgGfx.fillStyle(ELECTRIC_BLUE, 0.06 + Math.random() * 0.1);
            this.bgGfx.fillCircle(px, py, 1 + Math.random() * 2);
        }

        // Large factory machine (center)
        const mW = Math.min(280, W * 0.72);
        const mH = Math.min(160, H * 0.32);
        this.drawMachineBody(this.mainGfx, cx, cy, mW, mH);

        // Title label on machine
        this.txt('machine_title', 'POLYNOMIAL MACHINE', cx, cy - mH / 2 + 16, T_CYAN, '10px', 0.5, 0.5);
        this.txt('machine_sub', 'Count the components', cx, cy - mH / 2 + 30, T_SILVER, '8px', 0.5, 0.5);

        // Three term blocks inside the machine
        const termSpacing = Math.min(80, mW / 4);
        const terms = ['3x²', '+2x', '−5'];
        const termColors = [ELECTRIC_BLUE, NEON_PURPLE, NEON_ORANGE];
        const termTextColors = [T_BLUE, T_PURPLE, T_ORANGE];

        terms.forEach((term, i) => {
            const tx = cx + (i - 1) * termSpacing;
            const ty = cy + 4;
            this.drawTermBlock(this.mainGfx, tx, ty, term, termColors[i]);
            this.txt(`term_${i}`, term, tx, ty, termTextColors[i], '14px', 0.5, 0.5);

            // Connecting pipes between blocks
            if (i < terms.length - 1) {
                const nextX = cx + (i) * termSpacing;
                this.drawPipe(this.mainGfx, tx + 28, ty, nextX - 28, ty, termColors[i]);
            }
        });

        // TERM COUNTER gauge at bottom
        const gaugeY = cy + mH / 2 + 20;
        const gaugeW = Math.min(200, W * 0.5);
        this.txt('gauge_label', 'TERM COUNTER', cx, gaugeY - 12, T_CYAN, '9px', 0.5, 0.5);
        this.drawGauge(this.mainGfx, cx - gaugeW / 2, gaugeY, gaugeW, 18, 0, ELECTRIC_BLUE);

        // Question
        this.txt('q_label', 'How many TERMS does 3x² + 2x − 5 have?', cx, gaugeY + 30, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, gaugeY + 50, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 2: Term Identify — Coefficient of x³ in 4x³ − 7x + 2 ──
    private drawTermIdentify(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.35;

        // Machine body
        const mW = Math.min(280, W * 0.72);
        const mH = Math.min(130, H * 0.26);
        this.drawMachineBody(this.mainGfx, cx, cy, mW, mH);

        // Polynomial display on machine
        this.txt('poly_display', '4x³ − 7x + 2', cx, cy - 16, T_WHITE, '18px', 0.5, 0.5);

        // Magnifying glass / scanner highlight on 4x³
        const scanX = cx - 56;
        const scanR = 26;
        this.mainGfx.fillStyle(ELECTRIC_BLUE, 0.08);
        this.mainGfx.fillCircle(scanX, cy - 16, scanR + 6);
        this.mainGfx.lineStyle(2.5, ELECTRIC_BLUE, 0.8);
        this.mainGfx.strokeCircle(scanX, cy - 16, scanR);
        // Scanner handle
        this.mainGfx.lineStyle(3, ELECTRIC_BLUE, 0.6);
        this.mainGfx.lineBetween(scanX + scanR * 0.7, cy - 16 + scanR * 0.7, scanX + scanR * 1.3, cy - 16 + scanR * 1.3);

        // Control panel below
        const panelY = cy + mH / 2 + 18;
        const panelW = Math.min(260, W * 0.66);
        const panelH = 70;
        this.drawPanel(this.mainGfx, cx - panelW / 2, panelY, panelW, panelH, PANEL_BG, PANEL_BORDER);
        this.txt('panel_title', '🔍 COMPONENT SCANNER', cx, panelY + 12, T_CYAN, '9px', 0.5, 0.5);

        // Slots
        const slotW = Math.min(70, panelW / 4);
        const slotNames = ['Coefficient', 'Variable', 'Power'];
        const slotVals  = ['4', 'x', '3'];
        const slotColors = [T_ORANGE, T_GREEN, T_PURPLE];
        slotNames.forEach((name, i) => {
            const sx = cx - panelW / 2 + 20 + i * (slotW + 12);
            const sy = panelY + 28;
            this.drawPanel(this.mainGfx, sx, sy, slotW, 30, METAL_DARK, PANEL_BORDER, 4);
            this.txt(`slot_name_${i}`, name, sx + slotW / 2, sy + 2, T_SILVER, '7px', 0.5, 0);
            this.txt(`slot_val_${i}`, slotVals[i], sx + slotW / 2, sy + 18, slotColors[i], '13px', 0.5, 0.5);
        });

        // Arrow from 4x³ to coefficient slot
        const arrowStartY = cy + mH / 2;
        this.mainGfx.lineStyle(1.5, NEON_ORANGE, 0.6);
        this.mainGfx.lineBetween(scanX, arrowStartY, cx - panelW / 2 + 20 + slotW / 2, panelY + 28);

        // Other terms dimmer
        this.txt('dim_1', '−7x', cx + 30, cy + 8, T_SILVER, '10px', 0.5, 0.5);
        this.txt('dim_2', '+2', cx + 70, cy + 8, T_SILVER, '10px', 0.5, 0.5);

        // Question
        const qY = panelY + panelH + 12;
        this.txt('q_label', 'What is the COEFFICIENT of x³ in 4x³ − 7x + 2?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 3: Conveyor Build — Coefficient of x in standard form ──
    private drawConveyorBuild(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.32;

        // Conveyor belt
        const beltW = Math.min(300, W * 0.8);
        const beltX = cx - beltW / 2;
        const beltY = cy;
        this.drawConveyorBelt(this.mainGfx, beltX, beltY, beltW);

        // Title
        this.txt('conv_title', 'STANDARD FORM CONVEYOR', cx, cy - 30, T_CYAN, '10px', 0.5, 0.5);

        // Unordered terms on belt (scattered)
        const unorderedTerms = ['+5', '−3x', '+x²'];
        const unorderedColors = [NEON_ORANGE, NEON_PURPLE, ELECTRIC_BLUE];
        const unorderedTColors = [T_ORANGE, T_PURPLE, T_BLUE];
        const termPositions = [beltX + beltW * 0.2, beltX + beltW * 0.5, beltX + beltW * 0.8];

        unorderedTerms.forEach((term, i) => {
            const tx = termPositions[i];
            const ty = beltY - 22;
            this.drawTermBlock(this.mainGfx, tx, ty, term, unorderedColors[i]);
            this.txt(`uterm_${i}`, term, tx, ty, unorderedTColors[i], '12px', 0.5, 0.5);
        });

        // Reorder arrows
        this.mainGfx.lineStyle(1.5, CYAN, 0.5);
        const arrowY1 = beltY + 24;
        const arrowY2 = beltY + 40;
        this.mainGfx.lineBetween(cx - 20, arrowY1, cx - 20, arrowY2);
        this.mainGfx.lineBetween(cx, arrowY1, cx, arrowY2);
        this.mainGfx.lineBetween(cx + 20, arrowY1, cx + 20, arrowY2);
        // Arrow heads
        [-20, 0, 20].forEach(ox => {
            this.mainGfx.fillStyle(CYAN, 0.5);
            this.mainGfx.fillTriangle(cx + ox, arrowY2 + 4, cx + ox - 4, arrowY2 - 2, cx + ox + 4, arrowY2 - 2);
        });

        // Standard form result area
        const resultY = beltY + 58;
        const resultW = Math.min(260, W * 0.66);
        this.drawPanel(this.mainGfx, cx - resultW / 2, resultY, resultW, 40, PANEL_BG, PANEL_BORDER);
        this.txt('result_title', 'STANDARD FORM', cx, resultY + 6, T_SILVER, '8px', 0.5, 0);

        // Display: x² − 3x + 5 with −3x highlighted
        this.txt('sf_t1', 'x²', cx - 45, resultY + 24, T_BLUE, '14px', 0.5, 0.5);
        this.txt('sf_t2', '− 3x', cx, resultY + 24, T_PURPLE, '14px', 0.5, 0.5);
        this.txt('sf_t3', '+ 5', cx + 45, resultY + 24, T_ORANGE, '14px', 0.5, 0.5);

        // Glowing highlight on −3x
        this.mainGfx.fillStyle(NEON_PURPLE, 0.1);
        this.mainGfx.fillRoundedRect(cx - 28, resultY + 12, 56, 24, 4);
        this.mainGfx.lineStyle(1.5, NEON_PURPLE, 0.6);
        this.mainGfx.strokeRoundedRect(cx - 28, resultY + 12, 56, 24, 4);

        // Question
        const qY = resultY + 52;
        this.txt('q_label', 'Coefficient of x when arranged in standard form?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 4: Degree Sort — Degree of 5x⁴ + 2x − 1 ──
    private drawDegreeSort(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.30;

        // Polynomial displayed as machine components
        const terms = ['5x⁴', '+2x', '−1'];
        const powers = [4, 1, 0];
        const termColors = [ELECTRIC_BLUE, NEON_PURPLE, NEON_ORANGE];
        const tColors = [T_BLUE, T_PURPLE, T_ORANGE];
        const termSpacing = Math.min(80, W / 5);

        terms.forEach((term, i) => {
            const tx = cx + (i - 1) * termSpacing;
            this.drawTermBlock(this.mainGfx, tx, cy, term, termColors[i]);
            this.txt(`dt_${i}`, term, tx, cy, tColors[i], '13px', 0.5, 0.5);
            // Power label below each
            this.txt(`dp_${i}`, `power: ${powers[i]}`, tx, cy + 24, T_SILVER, '8px', 0.5, 0);
        });

        // Vertical power meter on the right
        const meterX = cx + termSpacing * 2;
        const meterY = cy - 50;
        const meterH = 120;
        const meterW = 24;
        this.drawPanel(this.mainGfx, meterX, meterY, meterW, meterH, METAL_DARK, PANEL_BORDER, 4);
        this.txt('meter_title', 'DEGREE', meterX + meterW / 2, meterY - 12, T_CYAN, '8px', 0.5, 1);
        // Degree markings 0-5
        for (let d = 0; d <= 5; d++) {
            const dy = meterY + meterH - 10 - (d / 5) * (meterH - 20);
            this.mainGfx.lineStyle(1, METAL_LIGHT, 0.4);
            this.mainGfx.lineBetween(meterX + 2, dy, meterX + meterW - 2, dy);
            this.txt(`dm_${d}`, String(d), meterX - 6, dy, T_SILVER, '8px', 1, 0.5);
        }
        // Highlight degree 4 on meter
        const deg4Y = meterY + meterH - 10 - (4 / 5) * (meterH - 20);
        this.mainGfx.fillStyle(ELECTRIC_BLUE, 0.3);
        this.mainGfx.fillRoundedRect(meterX + 2, deg4Y - 5, meterW - 4, 10, 3);
        this.mainGfx.fillStyle(ELECTRIC_BLUE, 0.9);
        this.mainGfx.fillCircle(meterX + meterW / 2, deg4Y, 4);

        // Arrow from 5x⁴ to degree 4
        this.mainGfx.lineStyle(1.5, ELECTRIC_BLUE, 0.5);
        this.mainGfx.lineBetween(cx - termSpacing + 30, cy - 16, meterX, deg4Y);
        this.txt('arrow_label', 'highest power → 4', cx + termSpacing * 0.8, cy - 40, T_BLUE, '9px', 0.5, 0.5);

        // Sorting bays at bottom (greyed out)
        const bayY = cy + 65;
        const bayW = Math.min(75, W / 5);
        const bayLabels = ['Linear (1)', 'Quadratic (2)', 'Cubic (3)'];
        bayLabels.forEach((label, i) => {
            const bx = cx + (i - 1) * (bayW + 10);
            this.drawPanel(this.mainGfx, bx - bayW / 2, bayY, bayW, 32, METAL_DARK, METAL_LIGHT, 6);
            this.txt(`bay_${i}`, label, bx, bayY + 16, T_SILVER, '8px', 0.5, 0.5);
        });
        this.txt('bay_note', '(Degree 4 doesn\'t fit these!)', cx, bayY + 40, T_ORANGE, '8px', 0.5, 0);

        // Question
        this.txt('q_label', 'What is the DEGREE of 5x⁴ + 2x − 1?', cx, bayY + 58, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, bayY + 76, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 5: Engine Repair — P(x)=2x²+?x+3, P(1)=12, find ? ──
    private drawEngineRepair(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.34;

        // Machine/engine body
        const mW = Math.min(260, W * 0.68);
        const mH = Math.min(120, H * 0.24);
        this.drawMachineBody(this.mainGfx, cx, cy, mW, mH);
        this.txt('engine_title', '⚙ POLYNOMIAL ENGINE', cx, cy - mH / 2 + 14, T_CYAN, '9px', 0.5, 0.5);

        // Polynomial with missing part: 2x² + [?]x + 3
        const polyY = cy - 6;
        this.txt('ep_1', '2x²', cx - 55, polyY, T_BLUE, '14px', 0.5, 0.5);
        this.txt('ep_2', '+', cx - 22, polyY, T_WHITE, '14px', 0.5, 0.5);

        // Glowing empty slot for ?
        const slotX = cx;
        this.mainGfx.fillStyle(DANGER_RED, 0.1);
        this.mainGfx.fillRoundedRect(slotX - 18, polyY - 14, 36, 28, 6);
        this.mainGfx.lineStyle(2, DANGER_RED, 0.8);
        this.mainGfx.strokeRoundedRect(slotX - 18, polyY - 14, 36, 28, 6);
        this.txt('ep_slot', '?', slotX, polyY, T_RED, '16px', 0.5, 0.5);

        this.txt('ep_3', 'x', cx + 18, polyY, T_WHITE, '14px', 0.5, 0.5);
        this.txt('ep_4', '+ 3', cx + 50, polyY, T_ORANGE, '14px', 0.5, 0.5);

        // Sparks around the broken part
        this.drawSpark(this.mainGfx, slotX - 20, polyY - 18);
        this.drawSpark(this.mainGfx, slotX + 22, polyY + 16);

        // Warning signs
        this.drawWarningTriangle(this.mainGfx, cx - mW / 2 + 20, cy, 8);
        this.drawWarningTriangle(this.mainGfx, cx + mW / 2 - 20, cy, 8);

        // Substitution panel
        const subY = cy + mH / 2 + 14;
        const subW = Math.min(260, W * 0.66);
        this.drawPanel(this.mainGfx, cx - subW / 2, subY, subW, 68, PANEL_BG, PANEL_BORDER);
        this.txt('sub_title', 'SUBSTITUTION PANEL', cx, subY + 10, T_CYAN, '9px', 0.5, 0.5);
        this.txt('sub_1', 'x = 1  →  P(1) = 12', cx, subY + 26, T_WHITE, '10px', 0.5, 0.5);
        this.txt('sub_2', '2(1)² + ?(1) + 3 = 12', cx, subY + 40, T_SILVER, '10px', 0.5, 0.5);
        this.txt('sub_3', '2 + ? + 3 = 12  →  ? = 7', cx, subY + 54, T_GREEN, '10px', 0.5, 0.5);

        // Question
        const qY = subY + 78;
        this.txt('q_label', 'P(x) = 2x² + ?x + 3. If P(1) = 12, find ?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 6: Factory Startup — Terms in 7x³ − x² + 4x − 8 ──
    private drawFactoryStartup(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.32;

        // Factory control panel background
        const panelW = Math.min(300, W * 0.78);
        const panelH = Math.min(100, H * 0.20);
        this.drawPanel(this.mainGfx, cx - panelW / 2, cy - panelH / 2, panelW, panelH, PANEL_BG, PANEL_BORDER, 10);
        this.txt('fcs_title', '⚡ FACTORY CONTROL SYSTEM', cx, cy - panelH / 2 + 14, T_CYAN, '9px', 0.5, 0.5);

        // LED display for polynomial
        const ledY = cy - 4;
        const ledW = panelW - 30;
        this.mainGfx.fillStyle(0x000000, 0.6);
        this.mainGfx.fillRoundedRect(cx - ledW / 2, ledY - 16, ledW, 32, 4);
        this.mainGfx.lineStyle(1, ELECTRIC_BLUE, 0.4);
        this.mainGfx.strokeRoundedRect(cx - ledW / 2, ledY - 16, ledW, 32, 4);

        // Terms as separate segments
        const segs = ['7x³', '−x²', '+4x', '−8'];
        const segColors = [T_BLUE, T_PURPLE, T_GREEN, T_ORANGE];
        const segW = ledW / segs.length;
        segs.forEach((seg, i) => {
            const sx = cx - ledW / 2 + i * segW + segW / 2;
            // Segment divider
            if (i > 0) {
                this.mainGfx.lineStyle(1, PANEL_BORDER, 0.5);
                this.mainGfx.lineBetween(cx - ledW / 2 + i * segW, ledY - 14, cx - ledW / 2 + i * segW, ledY + 14);
            }
            this.txt(`seg_${i}`, seg, sx, ledY, segColors[i], '13px', 0.5, 0.5);
        });

        // Startup progress bar
        const progY = cy + panelH / 2 + 14;
        this.txt('prog_label', 'STARTUP PROGRESS', cx, progY - 4, T_SILVER, '8px', 0.5, 1);
        this.drawGauge(this.mainGfx, cx - 100, progY, 200, 14, 0, EMERALD);

        // Four numbered indicators
        const indY = progY + 24;
        for (let i = 1; i <= 4; i++) {
            const ix = cx - 60 + (i - 1) * 40;
            this.mainGfx.fillStyle(EMERALD, 0.2);
            this.mainGfx.fillCircle(ix, indY, 12);
            this.mainGfx.lineStyle(1.5, EMERALD, 0.7);
            this.mainGfx.strokeCircle(ix, indY, 12);
            this.txt(`ind_${i}`, String(i), ix, indY, T_GREEN, '11px', 0.5, 0.5);
        }

        // Factory machinery in background
        this.mainGfx.fillStyle(METAL_DARK, 0.3);
        this.mainGfx.fillRect(10, H * 0.7, 40, H * 0.2);
        this.mainGfx.fillRect(W - 50, H * 0.7, 40, H * 0.2);
        this.drawSteam(this.mainGfx, 30, H * 0.7, 8);
        this.drawSteam(this.mainGfx, W - 30, H * 0.7, 8);

        // Question
        const qY = indY + 22;
        this.txt('q_label', '7x³ − x² + 4x − 8 has how many terms?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ═════════════════════════════════════════════════════════════════
    // WORLD 2 — Degree Control Systems
    // ═════════════════════════════════════════════════════════════════

    // ── Level 7: Reactor Classify — 5x + 3 is degree ___? ──
    private drawReactorClassify(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.28;

        // Polynomial display above
        this.drawPanel(this.mainGfx, cx - 80, cy - 30, 160, 36, PANEL_BG, ELECTRIC_BLUE, 6);
        this.txt('rc_poly', '5x + 3', cx, cy - 12, T_WHITE, '16px', 0.5, 0.5);

        // Three reactor zones side by side
        const zoneW = Math.min(85, (W - 40) / 3 - 6);
        const zoneH = 100;
        const zoneY = cy + 20;
        const zones = [
            { label: 'LINEAR', degree: 1, color: EMERALD, tColor: T_GREEN, correct: true },
            { label: 'QUADRATIC', degree: 2, color: NEON_PURPLE, tColor: T_PURPLE, correct: false },
            { label: 'CUBIC', degree: 3, color: NEON_ORANGE, tColor: T_ORANGE, correct: false },
        ];

        zones.forEach((zone, i) => {
            const zx = cx + (i - 1) * (zoneW + 10) - zoneW / 2;
            const zy = zoneY;

            // Zone panel
            const fillColor = zone.correct ? zone.color : METAL_DARK;
            const alpha = zone.correct ? 0.15 : 1;
            this.mainGfx.fillStyle(fillColor, zone.correct ? 1 : 1);
            if (zone.correct) {
                this.mainGfx.fillStyle(zone.color, 0.1);
                this.mainGfx.fillRoundedRect(zx - 4, zy - 4, zoneW + 8, zoneH + 8, 10);
            }
            this.drawPanel(this.mainGfx, zx, zy, zoneW, zoneH, zone.correct ? PANEL_BG : METAL_DARK, zone.color, 8);

            // Reactor core in zone
            const coreR = Math.min(16, zoneW / 4);
            this.drawReactorCore(this.mainGfx, zx + zoneW / 2, zy + 40, coreR, zone.color, zone.correct ? 0.5 : 0.15);

            // Zone labels
            this.txt(`zone_lbl_${i}`, zone.label, zx + zoneW / 2, zy + 10, zone.tColor, '9px', 0.5, 0.5);
            this.txt(`zone_deg_${i}`, `Degree ${zone.degree}`, zx + zoneW / 2, zy + zoneH - 14, zone.tColor, '8px', 0.5, 0.5);
        });

        // Energy flow lines from polynomial to LINEAR zone
        const lineStartY = cy + 6;
        const lineEndY = zoneY;
        const linearCx = cx - (zoneW + 10);
        this.mainGfx.lineStyle(1.5, EMERALD, 0.4);
        this.mainGfx.lineBetween(cx, lineStartY, linearCx, lineEndY);
        // Pulse dots along the line
        for (let t = 0.2; t < 1; t += 0.2) {
            const px = cx + (linearCx - cx) * t;
            const py = lineStartY + (lineEndY - lineStartY) * t;
            this.mainGfx.fillStyle(EMERALD, 0.6);
            this.mainGfx.fillCircle(px, py, 2);
        }

        // Question
        const qY = zoneY + zoneH + 16;
        this.txt('q_label', '5x + 3 is degree ___?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 8: Upgrade Machine — Adding 2x² to 3x+1, new degree? ──
    private drawUpgradeMachine(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.38;

        // Left machine (linear: 3x+1) — small
        const lmW = Math.min(90, W * 0.22);
        const lmH = 60;
        const lmX = cx - Math.min(120, W * 0.3);
        this.drawMachineBody(this.mainGfx, lmX, cy, lmW, lmH);
        this.txt('lm_poly', '3x + 1', lmX, cy - 6, T_WHITE, '11px', 0.5, 0.5);
        this.txt('lm_label', 'LINEAR', lmX, cy + 18, T_SILVER, '7px', 0.5, 0.5);
        // Small energy gauge
        this.drawGauge(this.mainGfx, lmX - 20, cy + lmH / 2 + 4, 40, 8, 0.33, EMERALD);
        this.txt('lm_deg', 'Deg: 1', lmX, cy + lmH / 2 + 18, T_GREEN, '8px', 0.5, 0);

        // Upgrade station (middle)
        const usW = Math.min(60, W * 0.15);
        const usH = 45;
        this.drawPanel(this.mainGfx, cx - usW / 2, cy - usH / 2, usW, usH, PANEL_BG, CYAN, 6);
        this.txt('us_label', 'UPGRADE', cx, cy - 10, T_CYAN, '8px', 0.5, 0.5);
        this.txt('us_term', '+2x²', cx, cy + 8, T_BLUE, '12px', 0.5, 0.5);
        // Plus icon
        this.mainGfx.fillStyle(CYAN, 0.6);
        this.mainGfx.fillCircle(cx, cy - usH / 2 - 8, 6);
        this.txt('us_plus', '+', cx, cy - usH / 2 - 8, T_DARK, '10px', 0.5, 0.5);

        // Right machine (quadratic: 2x²+3x+1) — bigger
        const rmW = Math.min(120, W * 0.28);
        const rmH = 80;
        const rmX = cx + Math.min(120, W * 0.3);
        this.drawMachineBody(this.mainGfx, rmX, cy, rmW, rmH);
        this.txt('rm_poly', '2x² + 3x + 1', rmX, cy - 6, T_WHITE, '11px', 0.5, 0.5);
        this.txt('rm_label', 'QUADRATIC', rmX, cy + 22, T_SILVER, '7px', 0.5, 0.5);
        // Bigger energy gauge
        this.drawGauge(this.mainGfx, rmX - 30, cy + rmH / 2 + 4, 60, 8, 0.66, NEON_PURPLE);
        this.txt('rm_deg', 'Deg: 2', rmX, cy + rmH / 2 + 18, T_PURPLE, '8px', 0.5, 0);

        // Arrow from left to right through upgrade station
        this.mainGfx.lineStyle(2, CYAN, 0.5);
        this.mainGfx.lineBetween(lmX + lmW / 2, cy, cx - usW / 2, cy);
        this.mainGfx.lineBetween(cx + usW / 2, cy, rmX - rmW / 2, cy);
        // Arrow heads
        this.mainGfx.fillStyle(CYAN, 0.5);
        this.mainGfx.fillTriangle(cx - usW / 2, cy, cx - usW / 2 - 6, cy - 4, cx - usW / 2 - 6, cy + 4);
        this.mainGfx.fillTriangle(rmX - rmW / 2, cy, rmX - rmW / 2 - 6, cy - 4, rmX - rmW / 2 - 6, cy + 4);

        // Question
        const qY = cy + rmH / 2 + 32;
        this.txt('q_label', 'Adding 2x² to 3x + 1, what is the new degree?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 9: Cubic Generator — x³ − 6x² + 11x − 6: how many coefficients? ──
    private drawCubicGenerator(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.38;

        // Large generator machine
        const gW = Math.min(280, W * 0.72);
        const gH = Math.min(140, H * 0.28);
        this.drawMachineBody(this.mainGfx, cx, cy, gW, gH);
        this.txt('gen_title', '⚡ CUBIC GENERATOR', cx, cy - gH / 2 + 14, T_CYAN, '10px', 0.5, 0.5);

        // Four chamber slots
        const chambers = [
            { coeff: '1', term: 'x³', color: ELECTRIC_BLUE, tColor: T_BLUE },
            { coeff: '−6', term: 'x²', color: NEON_PURPLE, tColor: T_PURPLE },
            { coeff: '+11', term: 'x', color: EMERALD, tColor: T_GREEN },
            { coeff: '−6', term: 'const', color: NEON_ORANGE, tColor: T_ORANGE },
        ];
        const chamberW = Math.min(50, (gW - 40) / 4 - 6);
        const chamberH = 52;
        const chamberY = cy - 10;

        chambers.forEach((ch, i) => {
            const chX = cx - (chambers.length * (chamberW + 8)) / 2 + i * (chamberW + 8) + chamberW / 2;
            // Chamber
            this.drawPanel(this.mainGfx, chX - chamberW / 2, chamberY - chamberH / 2, chamberW, chamberH, METAL_DARK, ch.color, 6);
            // Coefficient inside
            this.txt(`ch_coeff_${i}`, ch.coeff, chX, chamberY - 6, ch.tColor, '14px', 0.5, 0.5);
            // Term label below
            this.txt(`ch_term_${i}`, ch.term, chX, chamberY + 16, T_SILVER, '8px', 0.5, 0.5);

            // Pipes between chambers
            if (i < chambers.length - 1) {
                const nextX = cx - (chambers.length * (chamberW + 8)) / 2 + (i + 1) * (chamberW + 8) + chamberW / 2;
                this.drawPipe(this.mainGfx, chX + chamberW / 2, chamberY, nextX - chamberW / 2, chamberY, ch.color);
            }
        });

        // Coefficient counter display
        const countY = cy + gH / 2 + 14;
        this.drawPanel(this.mainGfx, cx - 60, countY, 120, 28, PANEL_BG, CYAN, 4);
        this.txt('count_display', 'Coefficients: ?', cx, countY + 14, T_CYAN, '10px', 0.5, 0.5);

        // Faint cubic curve in background
        this.mainGfx.lineStyle(1, ELECTRIC_BLUE, 0.1);
        this.mainGfx.beginPath();
        for (let x = 0; x <= 40; x++) {
            const xv = -1 + x * 0.15;
            const yv = Math.pow(xv, 3) - 6 * Math.pow(xv, 2) + 11 * xv - 6;
            const px = cx - gW / 2 + 10 + (x / 40) * (gW - 20);
            const py = cy - yv * 4;
            if (x === 0) this.mainGfx.moveTo(px, py);
            else this.mainGfx.lineTo(px, py);
        }
        this.mainGfx.strokePath();

        // Question
        const qY = countY + 38;
        this.txt('q_label', 'x³ − 6x² + 11x − 6: how many coefficients?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 10: Zone Sort — x² − 4: what degree? ──
    private drawZoneSort(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.28;

        // Package on conveyor
        const convW = Math.min(260, W * 0.66);
        this.drawConveyorBelt(this.mainGfx, cx - convW / 2, cy, convW);

        // Package
        const pkgW = 80;
        this.drawPanel(this.mainGfx, cx - pkgW / 2, cy - 30, pkgW, 28, PANEL_BG, ELECTRIC_BLUE, 4);
        this.txt('pkg_poly', 'x² − 4', cx, cy - 16, T_WHITE, '13px', 0.5, 0.5);

        // Three destination zones below
        const zoneW = Math.min(80, (W - 40) / 3 - 8);
        const zoneH = 60;
        const zoneY = cy + 40;
        const destinations = [
            { label: 'CONSTANT', deg: 0, color: NEON_ORANGE, tColor: T_ORANGE, correct: false },
            { label: 'LINEAR', deg: 1, color: EMERALD, tColor: T_GREEN, correct: false },
            { label: 'QUADRATIC', deg: 2, color: NEON_PURPLE, tColor: T_PURPLE, correct: true },
        ];

        destinations.forEach((dest, i) => {
            const dx = cx + (i - 1) * (zoneW + 10) - zoneW / 2;
            if (dest.correct) {
                this.mainGfx.fillStyle(dest.color, 0.08);
                this.mainGfx.fillRoundedRect(dx - 4, zoneY - 4, zoneW + 8, zoneH + 8, 10);
            }
            this.drawPanel(this.mainGfx, dx, zoneY, zoneW, zoneH, dest.correct ? PANEL_BG : METAL_DARK, dest.color, 6);
            this.txt(`dest_lbl_${i}`, dest.label, dx + zoneW / 2, zoneY + 14, dest.tColor, '9px', 0.5, 0.5);
            this.txt(`dest_deg_${i}`, `Deg ${dest.deg}`, dx + zoneW / 2, zoneY + 30, dest.tColor, '8px', 0.5, 0.5);

            // Routing arrows
            this.mainGfx.lineStyle(1, dest.color, dest.correct ? 0.6 : 0.2);
            this.mainGfx.lineBetween(cx, cy + 14, dx + zoneW / 2, zoneY);
        });

        // Show factored form faintly below
        this.txt('factored', '(x + 2)(x − 2)', cx, zoneY + zoneH + 8, T_SILVER, '9px', 0.5, 0);

        // Question
        const qY = zoneY + zoneH + 26;
        this.txt('q_label', 'x² − 4: what degree?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 11: Balance Degree — Side A: 3x²+x. Min degree for Side B? ──
    private drawBalanceDegree(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.40;

        // Balance beam / seesaw
        // Fulcrum
        this.mainGfx.fillStyle(METAL_DARK, 1);
        this.mainGfx.fillTriangle(cx, cy + 20, cx - 16, cy + 40, cx + 16, cy + 40);
        this.mainGfx.lineStyle(1.5, METAL_LIGHT, 0.6);
        this.mainGfx.strokeTriangle(cx, cy + 20, cx - 16, cy + 40, cx + 16, cy + 40);

        // Beam (tilted - left side heavier)
        const beamW = Math.min(260, W * 0.66);
        const tilt = 6;
        this.mainGfx.lineStyle(4, METAL_LIGHT, 0.8);
        this.mainGfx.lineBetween(cx - beamW / 2, cy - tilt, cx + beamW / 2, cy + tilt);

        // Left side (Side A): 3x² + x
        const leftX = cx - beamW / 2 + 10;
        const leftY = cy - tilt - 50;
        const sideW = Math.min(90, beamW * 0.35);
        this.drawPanel(this.mainGfx, leftX, leftY, sideW, 45, PANEL_BG, ELECTRIC_BLUE, 6);
        this.txt('side_a_lbl', 'SIDE A', leftX + sideW / 2, leftY + 8, T_BLUE, '8px', 0.5, 0.5);
        this.txt('side_a_poly', '3x² + x', leftX + sideW / 2, leftY + 28, T_WHITE, '12px', 0.5, 0.5);

        // Degree meter for Side A
        this.drawPanel(this.mainGfx, leftX + sideW + 6, leftY + 8, 36, 28, METAL_DARK, ELECTRIC_BLUE, 4);
        this.txt('deg_a', '2', leftX + sideW + 24, leftY + 22, T_BLUE, '14px', 0.5, 0.5);

        // Right side (Side B): empty
        const rightX = cx + beamW / 2 - sideW - 10;
        const rightY = cy + tilt - 50;
        this.drawPanel(this.mainGfx, rightX, rightY, sideW, 45, PANEL_BG, NEON_PURPLE, 6);
        this.txt('side_b_lbl', 'SIDE B', rightX + sideW / 2, rightY + 8, T_PURPLE, '8px', 0.5, 0.5);
        this.txt('side_b_poly', '???', rightX + sideW / 2, rightY + 28, T_SILVER, '12px', 0.5, 0.5);

        // Degree meter for Side B (unknown)
        this.drawPanel(this.mainGfx, rightX - 42, rightY + 8, 36, 28, METAL_DARK, NEON_PURPLE, 4);
        this.txt('deg_b', '?', rightX - 24, rightY + 22, T_PURPLE, '14px', 0.5, 0.5);

        // Question
        const qY = cy + 52;
        this.txt('q_label', 'Side A: 3x² + x. Minimum degree for Side B to balance?', cx, qY, T_WHITE, '10px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 12: Classification Mission — 2x⁴ − x³ + x: degree? ──
    private drawClassificationMission(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.32;

        // Mission control dashboard
        const dashW = Math.min(300, W * 0.78);
        const dashH = Math.min(160, H * 0.32);
        this.drawPanel(this.mainGfx, cx - dashW / 2, cy - dashH / 2, dashW, dashH, PANEL_BG, PANEL_BORDER, 10);

        // Title bar
        this.mainGfx.fillStyle(ELECTRIC_BLUE, 0.15);
        this.mainGfx.fillRoundedRect(cx - dashW / 2 + 2, cy - dashH / 2 + 2, dashW - 4, 22, { tl: 8, tr: 8, bl: 0, br: 0 });
        this.txt('mc_title', '🎯 CLASSIFICATION MISSION', cx, cy - dashH / 2 + 13, T_CYAN, '9px', 0.5, 0.5);

        // Large polynomial display
        const polyY = cy - 14;
        this.txt('mc_poly', '2x⁴ − x³ + x', cx, polyY, T_WHITE, '18px', 0.5, 0.5);

        // Highlight highest power term (2x⁴)
        const hlW = 52;
        this.mainGfx.fillStyle(ELECTRIC_BLUE, 0.1);
        this.mainGfx.fillRoundedRect(cx - 66, polyY - 14, hlW, 28, 4);
        this.mainGfx.lineStyle(1.5, ELECTRIC_BLUE, 0.6);
        this.mainGfx.strokeRoundedRect(cx - 66, polyY - 14, hlW, 28, 4);

        // Power scanner
        this.txt('scanner_lbl', 'Power Scanner:', cx, polyY + 22, T_SILVER, '9px', 0.5, 0);
        this.txt('scanner_val', 'Degree = 4', cx, polyY + 36, T_BLUE, '12px', 0.5, 0);

        // Timer bar (visual only)
        const timerY = cy + dashH / 2 - 18;
        this.drawGauge(this.mainGfx, cx - dashW / 2 + 15, timerY, dashW - 30, 10, 0.7, NEON_ORANGE);
        this.txt('timer_lbl', 'MISSION TIMER', cx, timerY - 8, T_SILVER, '7px', 0.5, 1);

        // Classification buttons below dashboard
        const btnY = cy + dashH / 2 + 14;
        const btnW = Math.min(55, (W - 40) / 5 - 4);
        const degLabels = ['Deg 1', 'Deg 2', 'Deg 3', 'Deg 4', 'Deg 5'];
        const degColors = [EMERALD, NEON_PURPLE, NEON_ORANGE, ELECTRIC_BLUE, CYAN];
        degLabels.forEach((lbl, i) => {
            const bx = cx + (i - 2) * (btnW + 6) - btnW / 2;
            const isCorrect = i === 3;
            this.drawPanel(this.mainGfx, bx, btnY, btnW, 24, isCorrect ? PANEL_BG : METAL_DARK, degColors[i], 4);
            this.txt(`btn_${i}`, lbl, bx + btnW / 2, btnY + 12, isCorrect ? T_BLUE : T_SILVER, '8px', 0.5, 0.5);
        });

        // Question
        const qY = btnY + 34;
        this.txt('q_label', '2x⁴ − x³ + x: what is the degree?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ═════════════════════════════════════════════════════════════════
    // WORLD 3 — Zero Hunters
    // ═════════════════════════════════════════════════════════════════

    // ── Level 13: Shutdown Find — P(x)=2x−6, P(x)=0 at x=? ──
    private drawShutdownFind(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.32;

        // Reactor with energy output display
        const reactorR = Math.min(40, W * 0.1);
        this.drawReactorCore(this.mainGfx, cx, cy, reactorR, ELECTRIC_BLUE, 0.35);
        this.txt('reactor_lbl', 'REACTOR OUTPUT', cx, cy - reactorR - 14, T_CYAN, '8px', 0.5, 0.5);

        // P(x) display inside reactor
        this.txt('sd_poly', 'P(x) = 2x − 6', cx, cy - 6, T_WHITE, '12px', 0.5, 0.5);
        this.txt('sd_output', 'P(x) = ?', cx, cy + 10, T_SILVER, '10px', 0.5, 0.5);

        // Target zone indicator
        const targetY = cy + reactorR + 18;
        this.drawPanel(this.mainGfx, cx - 80, targetY, 160, 28, METAL_DARK, EMERALD, 4);
        this.txt('target_lbl', 'TARGET: P(x) = 0', cx, targetY + 14, T_GREEN, '10px', 0.5, 0.5);

        // Danger zone indicator
        this.drawPanel(this.mainGfx, cx - 80, targetY + 34, 160, 20, METAL_DARK, DANGER_RED, 4);
        this.txt('danger_lbl', '⚠ DANGER: P(x) ≠ 0', cx, targetY + 44, T_RED, '8px', 0.5, 0.5);

        // Number line at bottom
        const nlY = targetY + 68;
        const nlW = Math.min(240, W * 0.62);
        this.drawNumberLine(this.mainGfx, cx - nlW / 2, nlY, nlW, -2, 6);
        this.txt('nl_title', 'x values', cx, nlY + 24, T_SILVER, '8px', 0.5, 0);

        // Highlight x=3 on number line
        const x3px = cx - nlW / 2 + ((3 - (-2)) / (6 - (-2))) * nlW;
        this.mainGfx.fillStyle(EMERALD, 0.3);
        this.mainGfx.fillCircle(x3px, nlY, 8);
        this.mainGfx.fillStyle(EMERALD, 0.9);
        this.mainGfx.fillCircle(x3px, nlY, 4);

        // Question
        const qY = nlY + 36;
        this.txt('q_label', 'P(x) = 2x − 6. At what x does P(x) = 0?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 14: Root Locate — x²−5x+6: find the SMALLER root ──
    private drawRootLocate(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.28;

        // Graph area
        const gW = Math.min(260, W * 0.66);
        const gH = Math.min(120, H * 0.24);
        const gX = cx - gW / 2;
        const gY = cy - gH / 2;

        this.drawPolyGraph(this.mainGfx, cx - gW / 2, gY, gW, gH, [1, -5, 6], -1, 6, ELECTRIC_BLUE);

        // Factored form below graph
        const factY = gY + gH + 12;
        this.drawPanel(this.mainGfx, cx - 80, factY, 160, 24, PANEL_BG, NEON_PURPLE, 4);
        this.txt('factored', '(x − 2)(x − 3) = 0', cx, factY + 12, T_PURPLE, '10px', 0.5, 0.5);

        // Root detector probes
        const probeY = factY + 32;
        this.txt('probe_lbl', '🔍 ROOT DETECTOR', cx, probeY, T_CYAN, '9px', 0.5, 0);

        // Mark roots
        const rootInfoY = probeY + 18;
        this.drawPanel(this.mainGfx, cx - 55, rootInfoY, 50, 24, PANEL_BG, EMERALD, 4);
        this.txt('root1', 'x = 2', cx - 30, rootInfoY + 12, T_GREEN, '10px', 0.5, 0.5);
        this.drawPanel(this.mainGfx, cx + 5, rootInfoY, 50, 24, PANEL_BG, NEON_PURPLE, 4);
        this.txt('root2', 'x = 3', cx + 30, rootInfoY + 12, T_PURPLE, '10px', 0.5, 0.5);

        // Highlight smaller root
        this.mainGfx.fillStyle(EMERALD, 0.15);
        this.mainGfx.fillRoundedRect(cx - 59, rootInfoY - 4, 58, 32, 6);

        // Question
        const qY = rootInfoY + 32;
        this.txt('q_label', 'x² − 5x + 6: find the SMALLER root', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 15: Reactor Deactivate — P(x)=3x+9, enter zero ──
    private drawReactorDeactivate(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.34;

        // Reactor in DANGER mode
        const reactorR = Math.min(48, W * 0.12);
        // Red pulsing glow
        this.mainGfx.fillStyle(DANGER_RED, 0.08);
        this.mainGfx.fillCircle(cx, cy, reactorR + 20);
        this.mainGfx.fillStyle(DANGER_RED, 0.12);
        this.mainGfx.fillCircle(cx, cy, reactorR + 12);
        this.drawReactorCore(this.mainGfx, cx, cy, reactorR, DANGER_RED, 0.5);

        // Polynomial inside
        this.txt('rd_poly', 'P(x) = 3x + 9', cx, cy - 8, T_WHITE, '13px', 0.5, 0.5);
        this.txt('rd_status', '⚠ CRITICAL', cx, cy + 10, T_RED, '9px', 0.5, 0.5);

        // Warning lights
        [-1, 1].forEach(side => {
            const wx = cx + side * (reactorR + 30);
            this.drawWarningTriangle(this.mainGfx, wx, cy, 10);
        });

        // Steam effects
        this.drawSteam(this.mainGfx, cx - 30, cy - reactorR - 10, 10);
        this.drawSteam(this.mainGfx, cx + 30, cy - reactorR - 10, 10);

        // Deactivation computation panel
        const compY = cy + reactorR + 20;
        const compW = Math.min(240, W * 0.62);
        this.drawPanel(this.mainGfx, cx - compW / 2, compY, compW, 72, PANEL_BG, PANEL_BORDER);
        this.txt('comp_title', '🔓 DEACTIVATION SEQUENCE', cx, compY + 10, T_CYAN, '9px', 0.5, 0.5);
        this.txt('comp_1', '3x + 9 = 0', cx, compY + 26, T_WHITE, '10px', 0.5, 0.5);
        this.txt('comp_2', '3x = −9', cx, compY + 40, T_SILVER, '10px', 0.5, 0.5);
        this.txt('comp_3', 'x = −3', cx, compY + 54, T_GREEN, '11px', 0.5, 0.5);

        // Question
        const qY = compY + 82;
        this.txt('q_label', 'P(x) = 3x + 9. Enter zero to deactivate.', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 16: Vault Unlock — x²−7x+12: find the LARGER root ──
    private drawVaultUnlock(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.34;

        // Vault door
        const vaultW = Math.min(200, W * 0.52);
        const vaultH = Math.min(140, H * 0.28);
        // Door body
        this.mainGfx.fillStyle(METAL_DARK, 1);
        this.mainGfx.fillRoundedRect(cx - vaultW / 2, cy - vaultH / 2, vaultW, vaultH, 12);
        this.mainGfx.lineStyle(3, METAL_LIGHT, 0.6);
        this.mainGfx.strokeRoundedRect(cx - vaultW / 2, cy - vaultH / 2, vaultW, vaultH, 12);
        // Door rivets
        for (let i = 0; i < 6; i++) {
            const rx = cx - vaultW / 2 + 15 + i * ((vaultW - 30) / 5);
            this.mainGfx.fillStyle(METAL_LIGHT, 0.3);
            this.mainGfx.fillCircle(rx, cy - vaultH / 2 + 10, 3);
            this.mainGfx.fillCircle(rx, cy + vaultH / 2 - 10, 3);
        }

        // Polynomial on vault
        this.txt('vault_poly', 'x² − 7x + 12', cx, cy - vaultH / 2 + 26, T_WHITE, '12px', 0.5, 0.5);

        // Two combination locks
        const lockSpacing = Math.min(60, vaultW / 3);
        const locks = [
            { label: 'LOCK 1', root: '3', color: NEON_PURPLE },
            { label: 'LOCK 2', root: '4', color: NEON_ORANGE },
        ];
        locks.forEach((lock, i) => {
            const lx = cx + (i === 0 ? -1 : 1) * lockSpacing / 2;
            const ly = cy + 6;
            // Lock circle
            this.mainGfx.fillStyle(PANEL_BG, 1);
            this.mainGfx.fillCircle(lx, ly, 22);
            this.mainGfx.lineStyle(2, lock.color, 0.8);
            this.mainGfx.strokeCircle(lx, ly, 22);
            this.mainGfx.lineStyle(1, lock.color, 0.3);
            this.mainGfx.strokeCircle(lx, ly, 18);
            // Lock label and root
            this.txt(`lock_lbl_${i}`, lock.label, lx, ly - 30, T_SILVER, '7px', 0.5, 0.5);
            this.txt(`lock_val_${i}`, lock.root, lx, ly, i === 0 ? T_PURPLE : T_ORANGE, '14px', 0.5, 0.5);
        });

        // Factored form
        this.txt('fact_form', '(x − 3)(x − 4) = 0', cx, cy + vaultH / 2 - 14, T_SILVER, '9px', 0.5, 0.5);

        // Highlight the larger root (4) with glow
        const lock2x = cx + lockSpacing / 2;
        this.mainGfx.fillStyle(NEON_ORANGE, 0.1);
        this.mainGfx.fillCircle(lock2x, cy + 6, 28);

        // Question
        const qY = cy + vaultH / 2 + 10;
        this.txt('q_label', 'x² − 7x + 12: find the LARGER root', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 17: Graph Repair — x²−4: positive x-intercept? ──
    private drawGraphRepair(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.28;

        // Graph area
        const gW = Math.min(260, W * 0.66);
        const gH = Math.min(140, H * 0.28);
        const gX = cx - gW / 2;
        const gY = cy - gH / 2 + 10;

        this.drawPolyGraph(this.mainGfx, gX, gY, gW, gH, [1, 0, -4], -4, 4, ELECTRIC_BLUE);

        // Repair beacon at positive intercept (2, 0)
        const posIntX = gX + ((2 - (-4)) / (4 - (-4))) * gW;
        const axisY = gY + gH / 2;
        this.mainGfx.fillStyle(EMERALD, 0.2);
        this.mainGfx.fillCircle(posIntX, axisY, 14);
        this.mainGfx.fillStyle(EMERALD, 0.4);
        this.mainGfx.fillCircle(posIntX, axisY, 8);
        this.txt('repair_beacon', '🔧', posIntX + 12, axisY - 12, T_GREEN, '12px', 0, 0.5);
        this.txt('pos_int_lbl', '(2, 0)', posIntX, axisY + 16, T_GREEN, '9px', 0.5, 0);

        // Mark vertex
        const vertexX = gX + ((0 - (-4)) / (4 - (-4))) * gW;
        this.txt('vertex_lbl', '(0, −4)', vertexX + 8, gY + gH - 10, T_SILVER, '8px', 0, 0.5);

        // "Broken" section indicator
        this.txt('broken_lbl', '⚠ REPAIR NEEDED', posIntX + 6, axisY - 24, T_ORANGE, '7px', 0, 1);

        // Graph title
        this.txt('graph_title', 'y = x² − 4', cx, gY - 10, T_WHITE, '11px', 0.5, 1);

        // Question
        const qY = gY + gH + 24;
        this.txt('q_label', 'x² − 4: positive x-intercept?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 18: Root Arena — x²−9: sum of zeros? ──
    private drawRootArena(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.32;

        // Arena / colosseum outline
        const arenaW = Math.min(260, W * 0.68);
        const arenaH = Math.min(110, H * 0.22);
        // Arena base (elliptical shape approximation)
        this.mainGfx.fillStyle(PANEL_BG, 0.8);
        this.mainGfx.fillRoundedRect(cx - arenaW / 2, cy - arenaH / 2, arenaW, arenaH, 20);
        this.mainGfx.lineStyle(2.5, NEON_PURPLE, 0.6);
        this.mainGfx.strokeRoundedRect(cx - arenaW / 2, cy - arenaH / 2, arenaW, arenaH, 20);
        // Arena inner ring
        this.mainGfx.lineStyle(1, NEON_PURPLE, 0.2);
        this.mainGfx.strokeRoundedRect(cx - arenaW / 2 + 8, cy - arenaH / 2 + 8, arenaW - 16, arenaH - 16, 16);

        // Scoreboard at top
        this.drawPanel(this.mainGfx, cx - 70, cy - arenaH / 2 - 30, 140, 26, PANEL_BG, ELECTRIC_BLUE, 4);
        this.txt('scoreboard', 'x² − 9', cx, cy - arenaH / 2 - 17, T_WHITE, '13px', 0.5, 0.5);

        // Two root portals inside arena
        const portalR = Math.min(22, arenaW / 8);
        // Portal x=3
        const p1x = cx + arenaW * 0.22;
        this.drawReactorCore(this.mainGfx, p1x, cy, portalR, EMERALD, 0.4);
        this.txt('portal_1', 'x = 3', p1x, cy, T_GREEN, '10px', 0.5, 0.5);
        this.txt('portal_1_lbl', 'ROOT α', p1x, cy + portalR + 10, T_GREEN, '7px', 0.5, 0);
        // Portal x=−3
        const p2x = cx - arenaW * 0.22;
        this.drawReactorCore(this.mainGfx, p2x, cy, portalR, NEON_ORANGE, 0.4);
        this.txt('portal_2', 'x = −3', p2x, cy, T_ORANGE, '10px', 0.5, 0.5);
        this.txt('portal_2_lbl', 'ROOT β', p2x, cy + portalR + 10, T_ORANGE, '7px', 0.5, 0);

        // Sum calculation
        const sumY = cy + arenaH / 2 + 14;
        this.drawPanel(this.mainGfx, cx - 90, sumY, 180, 32, PANEL_BG, CYAN, 4);
        this.txt('sum_calc', '3 + (−3) = 0', cx, sumY + 10, T_CYAN, '11px', 0.5, 0.5);
        this.txt('sum_lbl', 'SUM OF ZEROS', cx, sumY + 24, T_SILVER, '7px', 0.5, 0.5);

        // Challenge counter
        this.drawPanel(this.mainGfx, W - 65, cy - arenaH / 2, 55, 20, METAL_DARK, NEON_PURPLE, 4);
        this.txt('challenge', 'LVL 18', W - 37, cy - arenaH / 2 + 10, T_PURPLE, '8px', 0.5, 0.5);

        // Question
        const qY = sumY + 42;
        this.txt('q_label', 'x² − 9: sum of zeros?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ═════════════════════════════════════════════════════════════════
    // WORLD 4 — Graph Reactor Lab
    // ═════════════════════════════════════════════════════════════════

    // ── Level 19: Energy Beam — y=2x−4: x-axis crossing? ──
    private drawEnergyBeam(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.34;

        // Graph area
        const gW = Math.min(260, W * 0.66);
        const gH = Math.min(160, H * 0.32);
        const gX = cx - gW / 2;
        const gY = cy - gH / 2;

        const graphResult = this.drawPolyGraph(this.mainGfx, gX, gY, gW, gH, [2, -4], -2, 5, ELECTRIC_BLUE);

        // Energy beam effect along the line
        const axisY = gY + gH / 2;
        this.mainGfx.lineStyle(4, ELECTRIC_BLUE, 0.15);
        this.mainGfx.beginPath();
        for (let i = 0; i <= 30; i++) {
            const xv = -2 + i * (7 / 30);
            const yv = 2 * xv - 4;
            const px = gX + ((xv - (-2)) / (5 - (-2))) * gW;
            const pyRaw = axisY - (yv / 8) * gH * 0.5;
            if (i === 0) this.mainGfx.moveTo(px, pyRaw);
            else this.mainGfx.lineTo(px, pyRaw);
        }
        this.mainGfx.strokePath();

        // Target/crosshair at zero point (2, 0)
        const zeroX = gX + ((2 - (-2)) / (5 - (-2))) * gW;
        // Crosshair
        this.mainGfx.lineStyle(1.5, EMERALD, 0.8);
        this.mainGfx.lineBetween(zeroX - 10, axisY, zeroX + 10, axisY);
        this.mainGfx.lineBetween(zeroX, axisY - 10, zeroX, axisY + 10);
        this.mainGfx.strokeCircle(zeroX, axisY, 8);
        this.mainGfx.strokeCircle(zeroX, axisY, 14);
        this.txt('target_lbl', '(2, 0)', zeroX, axisY + 18, T_GREEN, '9px', 0.5, 0);

        // Title
        this.txt('beam_title', 'y = 2x − 4', cx, gY - 10, T_WHITE, '11px', 0.5, 1);

        // Question
        const qY = gY + gH + 18;
        this.txt('q_label', 'y = 2x − 4: where does it cross the x-axis?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 20: Path Observe — x²−4: how many x-axis crossings? ──
    private drawPathObserve(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.30;

        // Graph
        const gW = Math.min(260, W * 0.66);
        const gH = Math.min(140, H * 0.28);
        const gX = cx - gW / 2;
        const gY = cy - gH / 2;

        this.drawPolyGraph(this.mainGfx, gX, gY, gW, gH, [1, 0, -4], -4, 4, ELECTRIC_BLUE);

        // Crossing point indicators
        const axisY = gY + gH / 2;
        // Crossing at x=-2
        const c1x = gX + (((-2) - (-4)) / (4 - (-4))) * gW;
        this.mainGfx.fillStyle(NEON_ORANGE, 0.25);
        this.mainGfx.fillCircle(c1x, axisY, 12);
        this.drawPanel(this.mainGfx, c1x - 10, axisY - 24, 20, 16, PANEL_BG, NEON_ORANGE, 4);
        this.txt('crossing_1', '①', c1x, axisY - 16, T_ORANGE, '10px', 0.5, 0.5);
        this.txt('c1_lbl', 'x = −2', c1x, axisY + 16, T_ORANGE, '8px', 0.5, 0);

        // Crossing at x=2
        const c2x = gX + ((2 - (-4)) / (4 - (-4))) * gW;
        this.mainGfx.fillStyle(EMERALD, 0.25);
        this.mainGfx.fillCircle(c2x, axisY, 12);
        this.drawPanel(this.mainGfx, c2x - 10, axisY - 24, 20, 16, PANEL_BG, EMERALD, 4);
        this.txt('crossing_2', '②', c2x, axisY - 16, T_GREEN, '10px', 0.5, 0.5);
        this.txt('c2_lbl', 'x = 2', c2x, axisY + 16, T_GREEN, '8px', 0.5, 0);

        // Counter
        const countY = gY + gH + 16;
        this.drawPanel(this.mainGfx, cx - 70, countY, 140, 24, PANEL_BG, CYAN, 4);
        this.txt('crossing_count', 'Crossings: ?', cx, countY + 12, T_CYAN, '10px', 0.5, 0.5);

        // Title
        this.txt('graph_title', 'y = x² − 4', cx, gY - 10, T_WHITE, '11px', 0.5, 1);

        // Question
        const qY = countY + 32;
        this.txt('q_label', 'x² − 4: how many x-axis crossings?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 21: Drone Guide — −x²+4x: x at peak? ──
    private drawDroneGuide(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.30;

        // Graph
        const gW = Math.min(260, W * 0.66);
        const gH = Math.min(140, H * 0.28);
        const gX = cx - gW / 2;
        const gY = cy - gH / 2;

        this.drawPolyGraph(this.mainGfx, gX, gY, gW, gH, [-1, 4, 0], -1, 5, NEON_PURPLE);

        // Vertex/peak at x=2, y=4
        const axisY = gY + gH / 2;
        const vertexXpx = gX + ((2 - (-1)) / (5 - (-1))) * gW;
        // The y value is 4 at vertex, we need to map it
        // Find y range from the graph: y ranges from about -5 to 4
        const yMin = -5, yMax = 5;
        const vertexYpx = gY + gH - ((4 - yMin) / (yMax - yMin)) * gH;

        // Drone icon at vertex
        this.mainGfx.fillStyle(CYAN, 0.2);
        this.mainGfx.fillCircle(vertexXpx, vertexYpx, 14);
        this.mainGfx.fillStyle(CYAN, 0.7);
        this.mainGfx.fillCircle(vertexXpx, vertexYpx, 4);
        this.txt('drone_icon', '🛸', vertexXpx, vertexYpx - 16, T_CYAN, '14px', 0.5, 0.5);

        // Dotted lines showing vertex position
        this.mainGfx.lineStyle(1, CYAN, 0.3);
        // Vertical dashed line
        for (let dy = vertexYpx; dy < axisY; dy += 6) {
            this.mainGfx.lineBetween(vertexXpx, dy, vertexXpx, dy + 3);
        }
        // Horizontal dashed line
        for (let dx = gX; dx < vertexXpx; dx += 6) {
            this.mainGfx.lineBetween(dx, vertexYpx, dx + 3, vertexYpx);
        }

        // Vertex marker with coordinates
        this.txt('vertex_coord', '(2, 4)', vertexXpx + 14, vertexYpx - 4, T_CYAN, '9px', 0, 0.5);
        this.txt('peak_lbl', 'PEAK', vertexXpx + 14, vertexYpx + 8, T_SILVER, '7px', 0, 0);

        // Title
        this.txt('graph_title', 'y = −x² + 4x', cx, gY - 10, T_WHITE, '11px', 0.5, 1);

        // Question
        const qY = gY + gH + 18;
        this.txt('q_label', '−x² + 4x: at what x is the peak?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 22: Nav Repair — x²−2x−3: P(0)=? ──
    private drawNavRepair(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.30;

        // Graph
        const gW = Math.min(260, W * 0.66);
        const gH = Math.min(140, H * 0.28);
        const gX = cx - gW / 2;
        const gY = cy - gH / 2;

        this.drawPolyGraph(this.mainGfx, gX, gY, gW, gH, [1, -2, -3], -3, 5, ELECTRIC_BLUE);

        // y-intercept highlight (0, -3)
        const axisY = gY + gH / 2;
        const originPx = gX + ((0 - (-3)) / (5 - (-3))) * gW;
        // Approximate y-intercept position
        const yIntVal = -3;
        // We need to figure out the scale. The graph function handles this internally.
        // Let's manually draw a repair marker near the origin.
        this.mainGfx.fillStyle(NEON_ORANGE, 0.25);
        this.mainGfx.fillCircle(originPx, axisY + 20, 12);
        this.mainGfx.fillStyle(NEON_ORANGE, 0.7);
        this.mainGfx.fillCircle(originPx, axisY + 20, 5);
        this.txt('repair_marker', '🔧', originPx + 10, axisY + 10, T_ORANGE, '10px', 0, 0.5);
        this.txt('yint_lbl', '(0, −3)', originPx, axisY + 36, T_ORANGE, '9px', 0.5, 0);

        // Substitution panel
        const subY = gY + gH + 14;
        this.drawPanel(this.mainGfx, cx - 100, subY, 200, 36, PANEL_BG, PANEL_BORDER, 4);
        this.txt('sub_calc', 'P(0) = 0² − 2(0) − 3 = −3', cx, subY + 12, T_WHITE, '10px', 0.5, 0.5);
        this.txt('sub_result', 'y-intercept = −3', cx, subY + 26, T_GREEN, '9px', 0.5, 0.5);

        // Navigation display
        this.txt('nav_title', '📡 NAVIGATION DISPLAY', cx, gY - 12, T_CYAN, '9px', 0.5, 1);

        // Question
        const qY = subY + 44;
        this.txt('q_label', 'x² − 2x − 3: P(0) = ?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 23: Intersection Predict — x²−x−6: negative zero? ──
    private drawIntersectionPredict(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.30;

        // Graph
        const gW = Math.min(260, W * 0.66);
        const gH = Math.min(140, H * 0.28);
        const gX = cx - gW / 2;
        const gY = cy - gH / 2;

        this.drawPolyGraph(this.mainGfx, gX, gY, gW, gH, [1, -1, -6], -4, 5, NEON_PURPLE);

        // Highlight both zeros
        const axisY = gY + gH / 2;

        // Zero at x=-2 (negative) — special marker
        const neg2px = gX + (((-2) - (-4)) / (5 - (-4))) * gW;
        this.mainGfx.fillStyle(ELECTRIC_BLUE, 0.2);
        this.mainGfx.fillCircle(neg2px, axisY, 16);
        this.mainGfx.lineStyle(2, ELECTRIC_BLUE, 0.8);
        this.mainGfx.strokeCircle(neg2px, axisY, 12);
        this.txt('neg_zero', 'x = −2', neg2px, axisY - 18, T_BLUE, '10px', 0.5, 1);
        this.txt('neg_target', '🎯', neg2px + 14, axisY - 8, T_BLUE, '10px', 0, 0.5);

        // Zero at x=3
        const pos3px = gX + ((3 - (-4)) / (5 - (-4))) * gW;
        this.mainGfx.fillStyle(NEON_PURPLE, 0.15);
        this.mainGfx.fillCircle(pos3px, axisY, 10);
        this.txt('pos_zero', 'x = 3', pos3px, axisY - 14, T_PURPLE, '9px', 0.5, 1);

        // Factored form
        const factY = gY + gH + 12;
        this.drawPanel(this.mainGfx, cx - 70, factY, 140, 22, PANEL_BG, NEON_PURPLE, 4);
        this.txt('fact_form', '(x + 2)(x − 3)', cx, factY + 11, T_PURPLE, '10px', 0.5, 0.5);

        // Prediction target indicator
        this.txt('predict_lbl', '🔮 PREDICTION TARGET: negative side', cx, factY + 30, T_SILVER, '8px', 0.5, 0);

        // Title
        this.txt('graph_title', 'y = x² − x − 6', cx, gY - 10, T_WHITE, '11px', 0.5, 1);

        // Question
        const qY = factY + 44;
        this.txt('q_label', 'x² − x − 6: negative zero?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 24: Graph Puzzle — x³−4x: how many total zeros? ──
    private drawGraphPuzzle(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.30;

        // Graph
        const gW = Math.min(260, W * 0.66);
        const gH = Math.min(140, H * 0.28);
        const gX = cx - gW / 2;
        const gY = cy - gH / 2;

        this.drawPolyGraph(this.mainGfx, gX, gY, gW, gH, [1, 0, -4, 0], -3, 3, NEON_PURPLE);

        // Mark each crossing with numbered indicator
        const axisY = gY + gH / 2;
        const zeros = [
            { x: -2, label: 'x = −2', num: '①', color: NEON_ORANGE, tColor: T_ORANGE },
            { x: 0, label: 'x = 0', num: '②', color: ELECTRIC_BLUE, tColor: T_BLUE },
            { x: 2, label: 'x = 2', num: '③', color: EMERALD, tColor: T_GREEN },
        ];

        zeros.forEach((z, i) => {
            const zpx = gX + ((z.x - (-3)) / (3 - (-3))) * gW;
            this.mainGfx.fillStyle(z.color, 0.2);
            this.mainGfx.fillCircle(zpx, axisY, 10);
            this.drawPanel(this.mainGfx, zpx - 10, axisY - 24, 20, 16, PANEL_BG, z.color, 4);
            this.txt(`zn_${i}`, z.num, zpx, axisY - 16, z.tColor, '10px', 0.5, 0.5);
            this.txt(`zl_${i}`, z.label, zpx, axisY + 14, z.tColor, '8px', 0.5, 0);
        });

        // Zero counter
        const countY = gY + gH + 12;
        this.drawPanel(this.mainGfx, cx - 70, countY, 140, 24, PANEL_BG, CYAN, 4);
        this.txt('zero_counter', 'Zeros found: ?', cx, countY + 12, T_CYAN, '10px', 0.5, 0.5);

        // Factored form
        this.txt('fact_form', 'x(x − 2)(x + 2)', cx, countY + 32, T_SILVER, '9px', 0.5, 0);

        // Title
        this.txt('graph_title', 'y = x³ − 4x', cx, gY - 10, T_WHITE, '11px', 0.5, 1);

        // Question
        const qY = countY + 48;
        this.txt('q_label', 'x³ − 4x: how many total zeros?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ═════════════════════════════════════════════════════════════════
    // WORLD 5 — Coefficient Mastery Center
    // ═════════════════════════════════════════════════════════════════

    // ── Level 25: Build From Roots — Zeros 2 and 5: product of zeros? ──
    private drawBuildFromRoots(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.36;

        // Polynomial assembly machine
        const mW = Math.min(280, W * 0.72);
        const mH = Math.min(150, H * 0.30);
        this.drawMachineBody(this.mainGfx, cx, cy, mW, mH);
        this.txt('asm_title', '⚙ POLYNOMIAL ASSEMBLER', cx, cy - mH / 2 + 14, T_CYAN, '9px', 0.5, 0.5);

        // Two input ports showing roots
        const portW = Math.min(60, mW / 5);
        const portH = 36;
        const portY = cy - 18;

        // Alpha port
        const alphaX = cx - mW / 4;
        this.drawPanel(this.mainGfx, alphaX - portW / 2, portY - portH / 2, portW, portH, METAL_DARK, EMERALD, 6);
        this.txt('alpha_lbl', 'α', alphaX, portY - portH / 2 - 6, T_GREEN, '10px', 0.5, 1);
        this.txt('alpha_val', '2', alphaX, portY, T_GREEN, '16px', 0.5, 0.5);

        // Beta port
        const betaX = cx + mW / 4;
        this.drawPanel(this.mainGfx, betaX - portW / 2, portY - portH / 2, portW, portH, METAL_DARK, NEON_PURPLE, 6);
        this.txt('beta_lbl', 'β', betaX, portY - portH / 2 - 6, T_PURPLE, '10px', 0.5, 1);
        this.txt('beta_val', '5', betaX, portY, T_PURPLE, '16px', 0.5, 0.5);

        // Formula display in center
        this.txt('formula_disp', 'P(x) = x² − (α+β)x + αβ', cx, cy + 14, T_WHITE, '10px', 0.5, 0.5);

        // Calculation panel below machine
        const calcY = cy + mH / 2 + 10;
        const calcW = Math.min(260, W * 0.66);
        this.drawPanel(this.mainGfx, cx - calcW / 2, calcY, calcW, 56, PANEL_BG, PANEL_BORDER, 6);
        this.txt('calc_sum', 'Sum: α + β = 2 + 5 = 7', cx, calcY + 12, T_SILVER, '9px', 0.5, 0.5);
        this.txt('calc_prod', 'Product: α × β = 2 × 5 = 10', cx, calcY + 26, T_ORANGE, '10px', 0.5, 0.5);
        this.txt('calc_result', 'Output: x² − 7x + 10', cx, calcY + 42, T_GREEN, '10px', 0.5, 0.5);

        // Highlight product calculation
        this.mainGfx.fillStyle(NEON_ORANGE, 0.08);
        this.mainGfx.fillRoundedRect(cx - calcW / 2 + 4, calcY + 18, calcW - 8, 16, 3);

        // Question
        const qY = calcY + 64;
        this.txt('q_label', 'Zeros 2 and 5: product of zeros?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 26: Coefficient Balance — x²−5x+6: what is −b/a? ──
    private drawCoefficientBalance(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.35;

        // Reactor with two gauges
        const reactorR = Math.min(36, W * 0.09);
        this.drawReactorCore(this.mainGfx, cx, cy - 20, reactorR, ELECTRIC_BLUE, 0.3);
        this.txt('cb_poly', 'x² − 5x + 6', cx, cy - 20, T_WHITE, '11px', 0.5, 0.5);

        // Coefficients labeled
        const coeffY = cy + reactorR - 4;
        this.drawPanel(this.mainGfx, cx - 110, coeffY, 220, 22, PANEL_BG, PANEL_BORDER, 4);
        this.txt('coeff_labels', 'a = 1    b = −5    c = 6', cx, coeffY + 11, T_SILVER, '9px', 0.5, 0.5);

        // Two gauge panels
        const gaugeW = Math.min(100, (W - 30) / 2 - 10);
        const gaugeH = 58;
        const gaugeY = coeffY + 30;

        // Sum gauge
        const sumGx = cx - gaugeW - 8;
        this.drawPanel(this.mainGfx, sumGx, gaugeY, gaugeW, gaugeH, PANEL_BG, EMERALD, 6);
        this.txt('sum_gauge_lbl', 'Sum of Zeros', sumGx + gaugeW / 2, gaugeY + 10, T_GREEN, '8px', 0.5, 0.5);
        this.txt('sum_formula', '−b/a', sumGx + gaugeW / 2, gaugeY + 24, T_SILVER, '9px', 0.5, 0.5);
        this.txt('sum_calc', '= −(−5)/1 = 5', sumGx + gaugeW / 2, gaugeY + 38, T_GREEN, '10px', 0.5, 0.5);
        this.txt('sum_check', '2 + 3 = 5 ✓', sumGx + gaugeW / 2, gaugeY + 50, T_SILVER, '7px', 0.5, 0.5);

        // Product gauge
        const prodGx = cx + 8;
        this.drawPanel(this.mainGfx, prodGx, gaugeY, gaugeW, gaugeH, PANEL_BG, NEON_PURPLE, 6);
        this.txt('prod_gauge_lbl', 'Product of Zeros', prodGx + gaugeW / 2, gaugeY + 10, T_PURPLE, '8px', 0.5, 0.5);
        this.txt('prod_formula', 'c/a', prodGx + gaugeW / 2, gaugeY + 24, T_SILVER, '9px', 0.5, 0.5);
        this.txt('prod_calc', '= 6/1 = 6', prodGx + gaugeW / 2, gaugeY + 38, T_PURPLE, '10px', 0.5, 0.5);
        this.txt('prod_check', '2 × 3 = 6 ✓', prodGx + gaugeW / 2, gaugeY + 50, T_SILVER, '7px', 0.5, 0.5);

        // Question
        const qY = gaugeY + gaugeH + 12;
        this.txt('q_label', 'x² − 5x + 6: what is −b/a?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 27: Reverse Engineer — 2x²−8x+6: product = c/a? ──
    private drawReverseEngineer(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.34;

        // Reverse-engineering workstation (blueprint style)
        const wsW = Math.min(280, W * 0.72);
        const wsH = Math.min(160, H * 0.32);

        // Blueprint background
        this.mainGfx.fillStyle(0x0A1A2E, 1);
        this.mainGfx.fillRoundedRect(cx - wsW / 2, cy - wsH / 2, wsW, wsH, 8);
        // Blueprint grid
        this.mainGfx.lineStyle(0.5, 0x1A3A5C, 0.2);
        for (let gx = cx - wsW / 2; gx < cx + wsW / 2; gx += 12) {
            this.mainGfx.lineBetween(gx, cy - wsH / 2, gx, cy + wsH / 2);
        }
        for (let gy = cy - wsH / 2; gy < cy + wsH / 2; gy += 12) {
            this.mainGfx.lineBetween(cx - wsW / 2, gy, cx + wsW / 2, gy);
        }
        this.mainGfx.lineStyle(1.5, ELECTRIC_BLUE, 0.5);
        this.mainGfx.strokeRoundedRect(cx - wsW / 2, cy - wsH / 2, wsW, wsH, 8);
        this.txt('ws_title', '🔧 REVERSE-ENGINEERING STATION', cx, cy - wsH / 2 + 14, T_CYAN, '9px', 0.5, 0.5);

        // Polynomial with coefficients highlighted
        const polyY = cy - wsH / 2 + 36;
        this.txt('re_poly', '2x² − 8x + 6', cx, polyY, T_WHITE, '14px', 0.5, 0.5);

        // Coefficient labels
        const coeffRow = polyY + 22;
        this.txt('re_a', 'a = 2', cx - 60, coeffRow, T_BLUE, '10px', 0.5, 0.5);
        this.txt('re_b', 'b = −8', cx, coeffRow, T_PURPLE, '10px', 0.5, 0.5);
        this.txt('re_c', 'c = 6', cx + 60, coeffRow, T_ORANGE, '10px', 0.5, 0.5);

        // Computation
        const compY = coeffRow + 22;
        this.txt('re_comp', 'c / a = 6 / 2 = 3', cx, compY, T_GREEN, '12px', 0.5, 0.5);
        // Highlight computation
        this.mainGfx.fillStyle(EMERALD, 0.08);
        this.mainGfx.fillRoundedRect(cx - 80, compY - 10, 160, 22, 4);

        // Verification
        const verY = compY + 24;
        this.txt('re_verify', 'Verify: zeros are 1 and 3', cx, verY, T_SILVER, '9px', 0.5, 0.5);
        this.txt('re_prod', 'Product: 1 × 3 = 3  ✓', cx, verY + 14, T_GREEN, '9px', 0.5, 0.5);

        // Question
        const qY = cy + wsH / 2 + 10;
        this.txt('q_label', '2x² − 8x + 6: product of zeros = c/a = ?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 28: Optimal Build — Sum=3, product=−10: constant term? ──
    private drawOptimalBuild(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.36;

        // Construction machine
        const mW = Math.min(280, W * 0.72);
        const mH = Math.min(140, H * 0.28);
        this.drawMachineBody(this.mainGfx, cx, cy, mW, mH);
        this.txt('ob_title', '🏗 POLYNOMIAL CONSTRUCTOR', cx, cy - mH / 2 + 14, T_CYAN, '9px', 0.5, 0.5);

        // Input panel
        const inputY = cy - 18;
        const inputW = Math.min(110, mW / 3);
        // Sum input
        this.drawPanel(this.mainGfx, cx - inputW - 5, inputY - 16, inputW, 32, METAL_DARK, EMERALD, 4);
        this.txt('input_sum_lbl', 'Sum', cx - inputW / 2 - 5, inputY - 12, T_SILVER, '7px', 0.5, 0);
        this.txt('input_sum_val', '3', cx - inputW / 2 - 5, inputY + 4, T_GREEN, '14px', 0.5, 0.5);

        // Product input
        this.drawPanel(this.mainGfx, cx + 5, inputY - 16, inputW, 32, METAL_DARK, NEON_PURPLE, 4);
        this.txt('input_prod_lbl', 'Product', cx + inputW / 2 + 5, inputY - 12, T_SILVER, '7px', 0.5, 0);
        this.txt('input_prod_val', '−10', cx + inputW / 2 + 5, inputY + 4, T_PURPLE, '14px', 0.5, 0.5);

        // Assembly process
        const asmY = cy + 16;
        this.txt('asm_step', 'x² − (3)x + (−10)', cx, asmY, T_WHITE, '11px', 0.5, 0.5);
        this.txt('asm_result', '= x² − 3x − 10', cx, asmY + 16, T_GREEN, '11px', 0.5, 0.5);

        // Highlight constant term
        this.mainGfx.fillStyle(NEON_ORANGE, 0.12);
        this.mainGfx.fillRoundedRect(cx + 42, asmY + 6, 40, 20, 4);
        this.mainGfx.lineStyle(1.5, NEON_ORANGE, 0.6);
        this.mainGfx.strokeRoundedRect(cx + 42, asmY + 6, 40, 20, 4);

        // Verification panel below machine
        const vY = cy + mH / 2 + 10;
        const vW = Math.min(220, W * 0.56);
        this.drawPanel(this.mainGfx, cx - vW / 2, vY, vW, 28, PANEL_BG, PANEL_BORDER, 4);
        this.txt('verify', 'Verify: zeros are 5 and −2', cx, vY + 14, T_SILVER, '9px', 0.5, 0.5);

        // Question
        const qY = vY + 36;
        this.txt('q_label', 'Sum = 3, product = −10: constant term?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 29: Multi Sync — 3x²−12x+9: sum = −b/a? ──
    private drawMultiSync(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.36;

        // Three synchronized reactor displays
        const rW = Math.min(85, (W - 30) / 3 - 6);
        const rH = Math.min(110, H * 0.22);
        const rY = cy - rH / 2;
        const reactors = [
            { title: 'COEFFICIENTS', color: ELECTRIC_BLUE },
            { title: 'ZEROS', color: EMERALD },
            { title: 'GRAPH', color: NEON_PURPLE },
        ];

        reactors.forEach((r, i) => {
            const rx = cx + (i - 1) * (rW + 8) - rW / 2;
            this.drawPanel(this.mainGfx, rx, rY, rW, rH, PANEL_BG, r.color, 8);

            // Reactor core in each
            const coreR = Math.min(12, rW / 5);
            this.drawReactorCore(this.mainGfx, rx + rW / 2, rY + 20, coreR, r.color, 0.3);
            this.txt(`r_title_${i}`, r.title, rx + rW / 2, rY + 38, T_SILVER, '7px', 0.5, 0);
        });

        // Reactor 1 content: polynomial and coefficients
        const r1x = cx - (rW + 8) - rW / 2;
        this.txt('r1_poly', '3x²−12x+9', r1x + rW / 2, rY + 52, T_WHITE, '9px', 0.5, 0.5);
        this.txt('r1_a', 'a=3', r1x + rW / 2, rY + 66, T_BLUE, '8px', 0.5, 0);
        this.txt('r1_b', 'b=−12', r1x + rW / 2, rY + 78, T_BLUE, '8px', 0.5, 0);
        this.txt('r1_c', 'c=9', r1x + rW / 2, rY + 90, T_BLUE, '8px', 0.5, 0);

        // Reactor 2 content: zeros on a mini number line
        const r2x = cx - rW / 2;
        this.txt('r2_zeros', 'Zeros: 1, 3', r2x + rW / 2, rY + 52, T_GREEN, '9px', 0.5, 0);
        // Mini number line
        const nlY = rY + 72;
        const nlW = rW - 16;
        this.mainGfx.lineStyle(1, METAL_LIGHT, 0.5);
        this.mainGfx.lineBetween(r2x + 8, nlY, r2x + rW - 8, nlY);
        // Mark 1 and 3
        const nl1x = r2x + 8 + nlW * 0.25;
        const nl3x = r2x + 8 + nlW * 0.75;
        this.mainGfx.fillStyle(EMERALD, 0.8);
        this.mainGfx.fillCircle(nl1x, nlY, 3);
        this.mainGfx.fillCircle(nl3x, nlY, 3);
        this.txt('r2_1', '1', nl1x, nlY + 6, T_GREEN, '7px', 0.5, 0);
        this.txt('r2_3', '3', nl3x, nlY + 6, T_GREEN, '7px', 0.5, 0);

        // Reactor 3 content: mini parabola
        const r3x = cx + (rW + 8) - rW / 2;
        // Simple parabola drawing
        this.mainGfx.lineStyle(1.5, NEON_PURPLE, 0.7);
        this.mainGfx.beginPath();
        for (let t = 0; t <= 20; t++) {
            const xv = -0.5 + t * 0.25;
            const yv = 3 * Math.pow(xv, 2) - 12 * xv + 9;
            const px = r3x + 10 + (t / 20) * (rW - 20);
            const py = rY + 90 - yv * 3;
            if (t === 0) this.mainGfx.moveTo(px, py);
            else this.mainGfx.lineTo(px, py);
        }
        this.mainGfx.strokePath();

        // Sync lines connecting reactors
        this.mainGfx.lineStyle(1, CYAN, 0.3);
        this.mainGfx.lineBetween(r1x + rW, rY + rH / 2, r2x, rY + rH / 2);
        this.mainGfx.lineBetween(r2x + rW, rY + rH / 2, r3x, rY + rH / 2);

        // Calculation panel
        const calcY = rY + rH + 10;
        const calcW = Math.min(240, W * 0.62);
        this.drawPanel(this.mainGfx, cx - calcW / 2, calcY, calcW, 32, PANEL_BG, CYAN, 4);
        this.txt('ms_calc', '−b/a = −(−12)/3 = 12/3 = 4', cx, calcY + 10, T_CYAN, '10px', 0.5, 0.5);
        this.txt('ms_verify', 'Sum: 1 + 3 = 4  ✓', cx, calcY + 24, T_GREEN, '8px', 0.5, 0.5);

        // Question
        const qY = calcY + 42;
        this.txt('q_label', '3x² − 12x + 9: sum of zeros = −b/a = ?', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Level 30: Final Boss — 2x²+3x−2: find positive zero ──
    private drawFinalBoss(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.38;

        // City skyline in background
        const skyY = H * 0.65;
        const buildings = [
            { x: 10, w: 30, h: 80 }, { x: 45, w: 22, h: 60 }, { x: 70, w: 35, h: 100 },
            { x: 110, w: 25, h: 70 }, { x: 140, w: 40, h: 90 },
        ];
        buildings.forEach(b => {
            // Left side buildings
            this.bgGfx.fillStyle(0x0A1628, 0.4);
            this.bgGfx.fillRect(b.x, skyY - b.h, b.w, b.h + (H - skyY));
            // Windows
            for (let wy = skyY - b.h + 8; wy < skyY; wy += 12) {
                for (let wx = b.x + 4; wx < b.x + b.w - 4; wx += 8) {
                    this.bgGfx.fillStyle(ELECTRIC_BLUE, 0.08);
                    this.bgGfx.fillRect(wx, wy, 4, 6);
                }
            }
            // Right side mirror
            const rx = W - b.x - b.w;
            this.bgGfx.fillStyle(0x0A1628, 0.4);
            this.bgGfx.fillRect(rx, skyY - b.h, b.w, b.h + (H - skyY));
            for (let wy = skyY - b.h + 8; wy < skyY; wy += 12) {
                for (let wx = rx + 4; wx < rx + b.w - 4; wx += 8) {
                    this.bgGfx.fillStyle(ELECTRIC_BLUE, 0.08);
                    this.bgGfx.fillRect(wx, wy, 4, 6);
                }
            }
        });

        // BOSS PHASE DISPLAY
        this.drawPanel(this.mainGfx, cx - 80, cy - 110, 160, 22, PANEL_BG, DANGER_RED, 4);
        this.txt('boss_title', '🏆 FINAL BOSS', cx, cy - 99, T_RED, '10px', 0.5, 0.5);

        // Central reactor core (large, glowing)
        const coreR = Math.min(50, W * 0.12);
        // Multiple glow layers
        this.mainGfx.fillStyle(ELECTRIC_BLUE, 0.04);
        this.mainGfx.fillCircle(cx, cy, coreR + 30);
        this.mainGfx.fillStyle(NEON_PURPLE, 0.06);
        this.mainGfx.fillCircle(cx, cy, coreR + 20);
        this.drawReactorCore(this.mainGfx, cx, cy, coreR, ELECTRIC_BLUE, 0.5);

        // Phase display: polynomial
        this.txt('boss_poly', '2x² + 3x − 2', cx, cy - 12, T_WHITE, '14px', 0.5, 0.5);

        // Factored form
        this.txt('boss_fact', '(2x − 1)(x + 2)', cx, cy + 6, T_PURPLE, '10px', 0.5, 0.5);

        // Two zeros
        const zeroY = cy + coreR + 18;
        // Zero x = 1/2 (positive) — highlighted
        const posZeroX = cx + 50;
        this.mainGfx.fillStyle(EMERALD, 0.15);
        this.mainGfx.fillRoundedRect(posZeroX - 30, zeroY - 8, 60, 32, 6);
        this.drawPanel(this.mainGfx, posZeroX - 28, zeroY - 6, 56, 28, PANEL_BG, EMERALD, 4);
        this.txt('zero_pos', 'x = 0.5', posZeroX, zeroY + 8, T_GREEN, '11px', 0.5, 0.5);
        this.txt('zero_pos_lbl', '✦ POSITIVE', posZeroX, zeroY + 24, T_GREEN, '7px', 0.5, 0);

        // Zero x = -2
        const negZeroX = cx - 50;
        this.drawPanel(this.mainGfx, negZeroX - 28, zeroY - 6, 56, 28, METAL_DARK, NEON_PURPLE, 4);
        this.txt('zero_neg', 'x = −2', negZeroX, zeroY + 8, T_PURPLE, '11px', 0.5, 0.5);
        this.txt('zero_neg_lbl', 'NEGATIVE', negZeroX, zeroY + 24, T_SILVER, '7px', 0.5, 0);

        // Energy bars / boss health meter
        const hpY = cy - coreR - 16;
        const hpW = Math.min(180, W * 0.46);
        this.txt('hp_lbl', 'BOSS HP', cx, hpY - 10, T_RED, '7px', 0.5, 1);
        this.drawGauge(this.mainGfx, cx - hpW / 2, hpY, hpW, 10, 0.85, DANGER_RED);

        // Energy bar for player
        const epY = hpY - 20;
        this.txt('ep_lbl', 'ENERGY', cx, epY - 10, T_GREEN, '7px', 0.5, 1);
        this.drawGauge(this.mainGfx, cx - hpW / 2, epY, hpW, 10, 0.6, EMERALD);

        // Question
        const qY = zeroY + 38;
        this.txt('q_label', '2x² + 3x − 2: find the positive zero', cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('poly_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
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
        const col  = val !== 0 ? (isRight ? '#00E676' : '#FF1744') : T_CYAN;

        // Update answer label for all modes
        const answerKeys = [
            'poly_ans', 'count_display', 'crossing_count',
            'zero_counter',
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

        // Update gauges for applicable levels
        const mode = (spec as any).polyMode ?? '';
        if (mode === 'machine_activate' && val !== 0) {
            // Update term counter gauge
            const W = this.cameras.main.width;
            const cx = W / 2;
            const gaugeW = Math.min(200, W * 0.5);
            const cy = this.cameras.main.height * 0.38;
            const mH = Math.min(160, this.cameras.main.height * 0.32);
            const gaugeY = cy + mH / 2 + 20;
            const percent = Math.min(1, val / 5);
            // Redraw gauge with current value
            this.mainGfx.fillStyle(METAL_DARK, 1);
            this.mainGfx.fillRoundedRect(cx - gaugeW / 2, gaugeY, gaugeW, 18, 4);
            const fillW = Math.max(0, (gaugeW - 4) * percent);
            if (fillW > 0) {
                this.mainGfx.fillStyle(isRight ? EMERALD : ELECTRIC_BLUE, 0.9);
                this.mainGfx.fillRoundedRect(cx - gaugeW / 2 + 2, gaugeY + 2, fillW, 14, 3);
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
                tint: [0x00B4FF, 0x00E676, 0xAA55FF, 0xFF6B35], quantity: 25, duration: 200
            });
            const t = this.add.text(W / 2, H / 2 - 50, '✅ Excellent!', {
                fontFamily: FONT, fontSize: '28px', color: '#00E676', fontStyle: 'bold',
                stroke: '#0D1B2A', strokeThickness: 5
            }).setOrigin(0.5).setAlpha(0).setScale(0.4).setDepth(200);
            this.tweens.add({ targets: t, scale: 1.1, alpha: 1, duration: 350, ease: 'Back.easeOut',
                yoyo: true, hold: 850, onComplete: () => { t.destroy(); p.destroy(); } });
        } catch { /* noop */ }
    }
}
