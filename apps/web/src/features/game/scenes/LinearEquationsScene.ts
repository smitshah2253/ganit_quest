import Phaser, { Scene, GameObjects } from 'phaser';
import { EventBus } from '../engine/EventBus';
import { getLevelSpec } from '@/data/levelSpecs';
import type { LevelSpecification } from '@/data/levelSpecs';

const FONT = 'Inter, system-ui, -apple-system, sans-serif';

// ─── Colors ───────────────────────────────────────────────────────
const ELECTRIC_BLUE  = 0x00B4FF;
const NEON_ORANGE    = 0xFF6B35;
const NEON_PURPLE    = 0xAA55FF;
const DARK_BG        = 0x0A1628;
const GRID_DOTS      = 0x1A3A5C;
const CYAN           = 0x00E5FF;
const EMERALD        = 0x00E676;
const DANGER_RED     = 0xFF1744;
const CMD_DARK       = 0x0D1B2A;
const METAL_DARK     = 0x374151;
const METAL_LIGHT    = 0x9CA3AF;
const PANEL_BG       = 0x1B2838;
const PANEL_BORDER   = 0x2A4060;
const LINE_BLUE      = 0x3B82F6;
const LINE_ORANGE    = 0xF59E0B;

// Text colors
const T_BLUE    = '#00B4FF';
const T_ORANGE  = '#FF6B35';
const T_PURPLE  = '#AA55FF';
const T_CYAN    = '#00E5FF';
const T_GREEN   = '#00E676';
const T_WHITE   = '#E2E8F0';
const T_SILVER  = '#94A3B8';
const T_RED     = '#FF1744';

export class LinearEquationsScene extends Scene {

    private bgGfx!: GameObjects.Graphics;
    private mainGfx!: GameObjects.Graphics;
    private labels: Record<string, GameObjects.Text> = {};

    private levelSpec: LevelSpecification | null = null;
    private isLevelActive = false;
    private currentInput = 0;
    private lastInput = -9999;

    constructor() { super('LinearEquationsScene'); }

    // ─────────────────────────────────────────────────────────────────
    create() {
        this.cameras.main.setBackgroundColor('#0D1B2A');
        this.bgGfx   = this.add.graphics();
        this.mainGfx = this.add.graphics();

        const onLoadLevel = (levelData: any) => {
            if (!this.scene?.systems) return;
            if (!levelData.id.startsWith('lvl-le-')) {
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

        // Command center background
        this.bgGfx.fillStyle(CMD_DARK, 1);
        this.bgGfx.fillRect(0, 0, W, H);
        this.bgGfx.fillStyle(DARK_BG, 0.08);
        this.bgGfx.fillRect(0, 30, W, H - 64);

        // Dot-grid background
        this.bgGfx.fillStyle(GRID_DOTS, 0.4);
        for (let x = 20; x < W; x += 26) for (let y = 20; y < H; y += 26)
            this.bgGfx.fillCircle(x, y, 1.1);

        // World / level label
        const levelNum = parseInt(spec.id.replace('lvl-le-', ''), 10);
        const worldNum = levelNum <= 6 ? 1 : levelNum <= 12 ? 2 : levelNum <= 18 ? 3 : levelNum <= 24 ? 4 : 5;
        const worldNames = ['', 'Equation Foundations', 'Graphical Solutions', 'Substitution Lab', 'Elimination Engine', 'Real-World Command'];
        this.txt('w_lbl', `W${worldNum}: ${worldNames[worldNum]}  ·  Level ${levelNum}`, 16, 14, T_BLUE, '10px', 0, 0);

        // Formula bar at bottom
        this.bgGfx.fillStyle(PANEL_BG, 0.9);
        this.bgGfx.fillRect(0, H - 34, W, 34);
        this.bgGfx.lineStyle(1, PANEL_BORDER, 1);
        this.bgGfx.lineBetween(0, H - 34, W, H - 34);
        this.txt('formula', `📐  ${spec.formulaDisplay}`, W / 2, H - 17, T_SILVER, '11px', 0.5, 0.5);

        // Route to mode-specific draw method
        const mode = (spec as any).leMode ?? '';
        switch (mode) {
            case 'plot_line':           this.drawPlotLine(spec, W, H); break;
            case 'identify_pair':       this.drawIdentifyPair(spec, W, H); break;
            case 'standard_form':       this.drawStandardForm(spec, W, H); break;
            case 'find_solution_point':  this.drawFindSolution(spec, W, H); break;
            case 'plot_both_lines':     this.drawTwoLines(spec, W, H); break;
            case 'foundation_boss':     this.drawTwoLines(spec, W, H); break;
            case 'find_intersection':   this.drawTwoLines(spec, W, H); break;
            case 'unique_solution':     this.drawConsistencyPanel(spec, W, H); break;
            case 'parallel_detect':     this.drawParallelLines(spec, W, H); break;
            case 'coincident_check':    this.drawCoincidentLines(spec, W, H); break;
            case 'consistency_check':   this.drawConsistencyPanel(spec, W, H); break;
            case 'graphical_boss':      this.drawTwoLines(spec, W, H); break;
            case 'variable_isolate':    this.drawSubstitutionPanel(spec, W, H); break;
            case 'substitution_solve':  this.drawSubstitutionPanel(spec, W, H); break;
            case 'substitution_boss':   this.drawSubstitutionPanel(spec, W, H); break;
            case 'coefficient_match':   this.drawEliminationPanel(spec, W, H); break;
            case 'elimination_solve':   this.drawEliminationPanel(spec, W, H); break;
            case 'elimination_boss':    this.drawEliminationPanel(spec, W, H); break;
            case 'cross_multiply':      this.drawCrossMultiply(spec, W, H); break;
            case 'word_problem':        this.drawWordProblem(spec, W, H); break;
            case 'final_boss':          this.drawFinalBoss(spec, W, H); break;
            default:                    this.drawTwoLines(spec, W, H); break;
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

    private drawCoordGrid(gfx: GameObjects.Graphics, ox: number, oy: number, w: number, h: number, xRange: [number, number], yRange: [number, number]) {
        const [xMin, xMax] = xRange;
        const [yMin, yMax] = yRange;
        const xScale = w / (xMax - xMin);
        const yScale = h / (yMax - yMin);

        // Grid lines
        for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
            const px = ox + (x - xMin) * xScale;
            gfx.lineStyle(1, METAL_LIGHT, x === 0 ? 0.6 : 0.12);
            gfx.lineBetween(px, oy, px, oy + h);
            if (x !== 0) this.txt(`gx_${x}`, String(x), px, oy + h / 2 + (yMin < 0 ? (-yMin) * yScale : 0) + 10, T_SILVER, '8px', 0.5, 0);
        }
        for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
            const py = oy + h - (y - yMin) * yScale;
            gfx.lineStyle(1, METAL_LIGHT, y === 0 ? 0.6 : 0.12);
            gfx.lineBetween(ox, py, ox + w, py);
            if (y !== 0) this.txt(`gy_${y}`, String(y), ox + (xMin < 0 ? (-xMin) * xScale : 0) - 8, py, T_SILVER, '8px', 1, 0.5);
        }

        // Axes (thicker)
        const axisX = ox + (-xMin) * xScale;
        const axisY = oy + h - (-yMin) * yScale;

        if (axisX >= ox && axisX <= ox + w) {
            gfx.lineStyle(2, METAL_LIGHT, 0.7);
            gfx.lineBetween(axisX, oy, axisX, oy + h);
            // Arrow
            gfx.fillStyle(METAL_LIGHT, 0.7);
            gfx.fillTriangle(axisX, oy, axisX - 3, oy + 8, axisX + 3, oy + 8);
            this.txt('y_axis', 'y', axisX + 6, oy + 2, T_SILVER, '9px', 0, 0);
        }
        if (axisY >= oy && axisY <= oy + h) {
            gfx.lineStyle(2, METAL_LIGHT, 0.7);
            gfx.lineBetween(ox, axisY, ox + w, axisY);
            // Arrow
            gfx.fillStyle(METAL_LIGHT, 0.7);
            gfx.fillTriangle(ox + w, axisY, ox + w - 8, axisY - 3, ox + w - 8, axisY + 3);
            this.txt('x_axis', 'x', ox + w - 4, axisY - 10, T_SILVER, '9px', 1, 1);
        }

        // Origin label
        if (xMin <= 0 && xMax >= 0 && yMin <= 0 && yMax >= 0) {
            this.txt('origin', 'O', axisX - 8, axisY + 6, T_SILVER, '8px', 1, 0);
        }

        return { xScale, yScale, axisX, axisY };
    }

    private plotLine(gfx: GameObjects.Graphics, ox: number, oy: number, w: number, h: number, xRange: [number, number], yRange: [number, number], eq: { a: number, b: number, c: number }, color: number, labelKey: string) {
        const [xMin, xMax] = xRange;
        const [yMin, yMax] = yRange;
        const xScale = w / (xMax - xMin);
        const yScale = h / (yMax - yMin);
        const { a, b, c } = eq;

        if (b === 0 && a === 0) return;

        gfx.lineStyle(2.5, color, 1);
        gfx.beginPath();
        let started = false;
        const steps = 200;

        for (let i = 0; i <= steps; i++) {
            const xv = xMin + (i / steps) * (xMax - xMin);
            let yv: number;
            if (b !== 0) {
                yv = (c - a * xv) / b;
            } else {
                // Vertical line: x = c/a
                yv = yMin + (i / steps) * (yMax - yMin);
            }

            const px = ox + (xv - xMin) * xScale;
            const py = oy + h - (yv - yMin) * yScale;

            if (b === 0) {
                const vx = ox + (c / a - xMin) * xScale;
                if (!started) {
                    gfx.moveTo(vx, oy);
                    started = true;
                }
                gfx.lineTo(vx, oy + h);
                break;
            }

            if (py < oy - 20 || py > oy + h + 20) {
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

        // Equation label
        const sign1 = b >= 0 ? '+' : '−';
        const absB = Math.abs(b);
        const eqStr = `${a}x ${sign1} ${absB}y = ${c}`;
        // Find a point on the line for label placement
        const labelX = xMin + (xMax - xMin) * 0.7;
        let labelY: number;
        if (b !== 0) {
            labelY = (c - a * labelX) / b;
        } else {
            labelY = yMax * 0.7;
        }
        const lpx = ox + (labelX - xMin) * xScale;
        const lpy = oy + h - (labelY - yMin) * yScale;
        if (lpy > oy && lpy < oy + h) {
            this.txt(labelKey, eqStr, lpx, lpy - 14, color === LINE_BLUE ? T_BLUE : T_ORANGE, '9px', 0.5, 1);
        }
    }

    private drawIntersectionPoint(gfx: GameObjects.Graphics, ox: number, oy: number, w: number, h: number, xRange: [number, number], yRange: [number, number], sx: number, sy: number) {
        const [xMin, xMax] = xRange;
        const [yMin, yMax] = yRange;
        const xScale = w / (xMax - xMin);
        const yScale = h / (yMax - yMin);

        const px = ox + (sx - xMin) * xScale;
        const py = oy + h - (sy - yMin) * yScale;

        // Glow
        gfx.fillStyle(EMERALD, 0.15);
        gfx.fillCircle(px, py, 14);
        gfx.fillStyle(EMERALD, 0.3);
        gfx.fillCircle(px, py, 8);
        // Point
        gfx.fillStyle(EMERALD, 1);
        gfx.fillCircle(px, py, 4);
        gfx.lineStyle(2, EMERALD, 1);
        gfx.strokeCircle(px, py, 4);

        // Label
        this.txt('int_label', `(${sx}, ${sy})`, px + 8, py - 10, T_GREEN, '11px', 0, 1);

        // Dashed lines to axes
        gfx.lineStyle(1, EMERALD, 0.3);
        const axisX = ox + (-xMin) * xScale;
        const axisY = oy + h - (-yMin) * yScale;
        // Horizontal to y-axis
        for (let dx = axisX; dx < px; dx += 6) {
            gfx.lineBetween(dx, py, Math.min(dx + 3, px), py);
        }
        // Vertical to x-axis
        for (let dy = py; dy < axisY; dy += 6) {
            gfx.lineBetween(px, dy, px, Math.min(dy + 3, axisY));
        }
    }

    // ═════════════════════════════════════════════════════════════════
    // MODE DRAWS
    // ═════════════════════════════════════════════════════════════════

    // ── Plot Line (World 1) ──────────────────────────────────────────
    private drawPlotLine(spec: LevelSpecification, W: number, H: number) {
        const eq = (spec as any).leEquation1;
        const gridW = Math.min(W * 0.7, 300);
        const gridH = Math.min(H * 0.55, 250);
        const ox = (W - gridW) / 2;
        const oy = 36;
        const xRange: [number, number] = [-1, 7];
        const yRange: [number, number] = [-1, 7];

        this.drawCoordGrid(this.mainGfx, ox, oy, gridW, gridH, xRange, yRange);
        this.plotLine(this.mainGfx, ox, oy, gridW, gridH, xRange, yRange, eq, LINE_BLUE, 'eq1_label');

        // Highlight y-intercept
        if (eq.b !== 0) {
            const yInt = eq.c / eq.b;
            const xScale = gridW / (xRange[1] - xRange[0]);
            const yScale = gridH / (yRange[1] - yRange[0]);
            const px = ox + (0 - xRange[0]) * xScale;
            const py = oy + gridH - (yInt - yRange[0]) * yScale;
            this.mainGfx.fillStyle(NEON_ORANGE, 0.3);
            this.mainGfx.fillCircle(px, py, 10);
            this.mainGfx.fillStyle(NEON_ORANGE, 1);
            this.mainGfx.fillCircle(px, py, 4);
            this.txt('yint_mark', `y-intercept = ?`, px + 10, py - 4, T_ORANGE, '10px', 0, 0.5);
        }

        const qY = oy + gridH + 20;
        this.txt('q_label', spec.question, W / 2, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('le_ans', 'Answer: ?', W / 2, qY + 24, T_CYAN, '14px', 0.5, 0);
    }

    // ── Identify Pair (World 1) ──────────────────────────────────────
    private drawIdentifyPair(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.30;
        const eq1 = (spec as any).leEquation1;
        const eq2 = (spec as any).leEquation2;

        // Two equation panels
        const panelW = Math.min(260, W * 0.66);
        const panelH = 44;
        const gap = 16;

        this.drawPanel(this.mainGfx, cx - panelW / 2, cy - panelH - gap / 2, panelW, panelH, PANEL_BG, LINE_BLUE, 8);
        this.txt('eq1_display', `Eq 1: ${eq1.a}x + ${eq1.b}y = ${eq1.c}`, cx, cy - panelH / 2 - gap / 2, T_BLUE, '14px', 0.5, 0.5);

        this.drawPanel(this.mainGfx, cx - panelW / 2, cy + gap / 2, panelW, panelH, PANEL_BG, LINE_ORANGE, 8);
        this.txt('eq2_display', `Eq 2: ${eq2.a}x ${eq2.b < 0 ? '−' : '+'} ${Math.abs(eq2.b)}y = ${eq2.c}`, cx, cy + gap / 2 + panelH / 2, T_ORANGE, '14px', 0.5, 0.5);

        // Variable highlight panel
        const vY = cy + panelH + gap + 30;
        this.drawPanel(this.mainGfx, cx - panelW / 2, vY, panelW, 50, METAL_DARK, PANEL_BORDER, 8);
        this.txt('var_title', 'SHARED VARIABLES', cx, vY + 10, T_CYAN, '9px', 0.5, 0);
        this.txt('var_x', 'x', cx - 30, vY + 32, T_GREEN, '18px', 0.5, 0.5);
        this.txt('var_y', 'y', cx + 30, vY + 32, T_GREEN, '18px', 0.5, 0.5);
        // Glow around variables
        this.mainGfx.fillStyle(EMERALD, 0.12);
        this.mainGfx.fillCircle(cx - 30, vY + 32, 16);
        this.mainGfx.fillCircle(cx + 30, vY + 32, 16);

        const qY = vY + 66;
        this.txt('q_label', spec.question, cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('le_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Standard Form (World 1) ──────────────────────────────────────
    private drawStandardForm(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.28;

        // Before
        const beforeW = Math.min(250, W * 0.64);
        this.drawPanel(this.mainGfx, cx - beforeW / 2, cy - 30, beforeW, 44, PANEL_BG, NEON_ORANGE, 8);
        this.txt('before_title', 'ORIGINAL FORM', cx, cy - 24, T_SILVER, '8px', 0.5, 0);
        this.txt('before_eq', 'y = 2x − 3', cx, cy - 4, T_ORANGE, '16px', 0.5, 0.5);

        // Arrow
        this.mainGfx.fillStyle(CYAN, 0.7);
        const arrowY = cy + 26;
        this.mainGfx.fillTriangle(cx, arrowY + 16, cx - 6, arrowY, cx + 6, arrowY);
        this.txt('arrow_txt', 'CONVERT', cx + 14, arrowY + 6, T_CYAN, '8px', 0, 0.5);

        // After
        const afterY = cy + 42;
        this.drawPanel(this.mainGfx, cx - beforeW / 2, afterY, beforeW, 44, PANEL_BG, ELECTRIC_BLUE, 8);
        this.txt('after_title', 'STANDARD FORM: ax + by + c = 0', cx, afterY + 6, T_SILVER, '8px', 0.5, 0);
        this.txt('after_eq', '2x − y − 3 = 0', cx, afterY + 26, T_BLUE, '16px', 0.5, 0.5);

        // Coefficient extraction
        const cY = afterY + 60;
        const slotW = Math.min(60, W / 6);
        const coeffs = [{ label: 'a', value: '2', color: T_GREEN }, { label: 'b', value: '−1', color: T_PURPLE }, { label: 'c', value: '−3', color: T_ORANGE }];
        coeffs.forEach((c, i) => {
            const sx = cx + (i - 1) * (slotW + 16);
            this.drawPanel(this.mainGfx, sx - slotW / 2, cY, slotW, 36, METAL_DARK, PANEL_BORDER, 6);
            this.txt(`coeff_lbl_${i}`, c.label, sx, cY + 4, T_SILVER, '8px', 0.5, 0);
            this.txt(`coeff_val_${i}`, c.value, sx, cY + 22, c.color, '14px', 0.5, 0.5);
        });

        // Highlight 'a' with a glow
        const aX = cx - (slotW + 16);
        this.mainGfx.fillStyle(EMERALD, 0.1);
        this.mainGfx.fillRoundedRect(aX - slotW / 2 - 4, cY - 4, slotW + 8, 44, 8);
        this.mainGfx.lineStyle(2, EMERALD, 0.6);
        this.mainGfx.strokeRoundedRect(aX - slotW / 2 - 4, cY - 4, slotW + 8, 44, 8);

        const qY = cY + 50;
        this.txt('q_label', spec.question, cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('le_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Find Solution Point (World 1) ────────────────────────────────
    private drawFindSolution(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.25;
        const eq1 = (spec as any).leEquation1;
        const eq2 = (spec as any).leEquation2;
        const sx = (spec as any).leSolutionX;
        const sy = (spec as any).leSolutionY;

        // Equations
        const panelW = Math.min(260, W * 0.68);
        this.drawPanel(this.mainGfx, cx - panelW / 2, cy - 16, panelW, 32, PANEL_BG, LINE_BLUE, 6);
        this.txt('eq1_d', `Eq1: ${eq1.a}x + ${eq1.b}y = ${eq1.c}`, cx, cy, T_BLUE, '12px', 0.5, 0.5);
        this.drawPanel(this.mainGfx, cx - panelW / 2, cy + 22, panelW, 32, PANEL_BG, LINE_ORANGE, 6);
        this.txt('eq2_d', `Eq2: ${eq2.a}x ${eq2.b < 0 ? '−' : '+'} ${Math.abs(eq2.b)}y = ${eq2.c}`, cx, cy + 38, T_ORANGE, '12px', 0.5, 0.5);

        // Test point
        const tpY = cy + 70;
        this.mainGfx.fillStyle(NEON_PURPLE, 0.12);
        this.mainGfx.fillRoundedRect(cx - 50, tpY, 100, 36, 10);
        this.mainGfx.lineStyle(2, NEON_PURPLE, 0.8);
        this.mainGfx.strokeRoundedRect(cx - 50, tpY, 100, 36, 10);
        this.txt('test_pt', `(${sx}, ${sy})`, cx, tpY + 18, T_PURPLE, '16px', 0.5, 0.5);
        this.txt('test_lbl', 'TEST POINT', cx, tpY - 8, T_SILVER, '8px', 0.5, 1);

        // Verification panel
        const vY = tpY + 48;
        const vW = Math.min(260, W * 0.68);
        this.drawPanel(this.mainGfx, cx - vW / 2, vY, vW, 60, METAL_DARK, PANEL_BORDER, 8);
        this.txt('v_title', 'VERIFICATION', cx, vY + 8, T_CYAN, '9px', 0.5, 0);

        // Check eq1
        const eq1Result = eq1.a * sx + eq1.b * sy;
        const eq1Pass = eq1Result === eq1.c;
        this.txt('v_eq1', `Eq1: ${eq1.a}(${sx}) + ${eq1.b}(${sy}) = ${eq1Result}  ${eq1Pass ? '✓' : '✗'}`, cx, vY + 26, eq1Pass ? T_GREEN : T_RED, '10px', 0.5, 0.5);

        // Check eq2
        const eq2Result = eq2.a * sx + eq2.b * sy;
        const eq2Pass = eq2Result === eq2.c;
        this.txt('v_eq2', `Eq2: ${eq2.a}(${sx}) ${eq2.b < 0 ? '−' : '+'} ${Math.abs(eq2.b)}(${sy}) = ${eq2Result}  ${eq2Pass ? '✓' : '✗'}`, cx, vY + 44, eq2Pass ? T_GREEN : T_RED, '10px', 0.5, 0.5);

        const qY = vY + 72;
        this.txt('q_label', spec.question, cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('le_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Two Lines with intersection (World 1-2) ─────────────────────
    private drawTwoLines(spec: LevelSpecification, W: number, H: number) {
        const eq1 = (spec as any).leEquation1;
        const eq2 = (spec as any).leEquation2;
        const sx = (spec as any).leSolutionX;
        const sy = (spec as any).leSolutionY;

        const gridW = Math.min(W * 0.72, 320);
        const gridH = Math.min(H * 0.55, 260);
        const ox = (W - gridW) / 2;
        const oy = 36;

        // Determine range based on solution
        const pad = 3;
        const xMin = Math.min(-1, sx - pad);
        const xMax = Math.max(sx + pad, 8);
        const yMin = Math.min(-2, sy - pad);
        const yMax = Math.max(sy + pad, 8);
        const xRange: [number, number] = [xMin, xMax];
        const yRange: [number, number] = [yMin, yMax];

        this.drawCoordGrid(this.mainGfx, ox, oy, gridW, gridH, xRange, yRange);
        this.plotLine(this.mainGfx, ox, oy, gridW, gridH, xRange, yRange, eq1, LINE_BLUE, 'eq1_label');
        if (eq2.a !== 0 || eq2.b !== 0) {
            this.plotLine(this.mainGfx, ox, oy, gridW, gridH, xRange, yRange, eq2, LINE_ORANGE, 'eq2_label');
        }

        // Intersection point
        if (sx >= xMin && sx <= xMax && sy >= yMin && sy <= yMax) {
            this.drawIntersectionPoint(this.mainGfx, ox, oy, gridW, gridH, xRange, yRange, sx, sy);
        }

        const qY = oy + gridH + 12;
        this.txt('q_label', spec.question, W / 2, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('le_ans', 'Answer: ?', W / 2, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Parallel Lines (World 2) ────────────────────────────────────
    private drawParallelLines(spec: LevelSpecification, W: number, H: number) {
        const eq1 = (spec as any).leEquation1;
        const eq2 = (spec as any).leEquation2;

        const gridW = Math.min(W * 0.65, 280);
        const gridH = Math.min(H * 0.45, 220);
        const ox = (W - gridW) / 2;
        const oy = 36;
        const xRange: [number, number] = [-1, 7];
        const yRange: [number, number] = [-2, 6];

        this.drawCoordGrid(this.mainGfx, ox, oy, gridW, gridH, xRange, yRange);
        this.plotLine(this.mainGfx, ox, oy, gridW, gridH, xRange, yRange, eq1, LINE_BLUE, 'eq1_label');
        this.plotLine(this.mainGfx, ox, oy, gridW, gridH, xRange, yRange, eq2, LINE_ORANGE, 'eq2_label');

        // "NO INTERSECTION" alert
        const alertY = oy + gridH + 10;
        this.mainGfx.fillStyle(DANGER_RED, 0.12);
        this.mainGfx.fillRoundedRect(W / 2 - 90, alertY, 180, 28, 6);
        this.mainGfx.lineStyle(1.5, DANGER_RED, 0.6);
        this.mainGfx.strokeRoundedRect(W / 2 - 90, alertY, 180, 28, 6);
        this.txt('no_int', '⚠  PARALLEL — NO INTERSECTION', W / 2, alertY + 14, T_RED, '9px', 0.5, 0.5);

        const qY = alertY + 38;
        this.txt('q_label', spec.question, W / 2, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('le_ans', 'Answer: ?', W / 2, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Coincident Lines (World 2) ──────────────────────────────────
    private drawCoincidentLines(spec: LevelSpecification, W: number, H: number) {
        const eq1 = (spec as any).leEquation1;

        const gridW = Math.min(W * 0.65, 280);
        const gridH = Math.min(H * 0.45, 220);
        const ox = (W - gridW) / 2;
        const oy = 36;
        const xRange: [number, number] = [-1, 7];
        const yRange: [number, number] = [-1, 5];

        this.drawCoordGrid(this.mainGfx, ox, oy, gridW, gridH, xRange, yRange);
        // Draw one thick glowing line (since both are the same)
        this.mainGfx.lineStyle(5, LINE_BLUE, 0.4);
        // Plot as one line
        this.plotLine(this.mainGfx, ox, oy, gridW, gridH, xRange, yRange, eq1, LINE_BLUE, 'eq1_label');

        // "COINCIDENT" badge
        const alertY = oy + gridH + 10;
        this.mainGfx.fillStyle(EMERALD, 0.12);
        this.mainGfx.fillRoundedRect(W / 2 - 100, alertY, 200, 28, 6);
        this.mainGfx.lineStyle(1.5, EMERALD, 0.6);
        this.mainGfx.strokeRoundedRect(W / 2 - 100, alertY, 200, 28, 6);
        this.txt('coin_label', '∞  COINCIDENT — SAME LINE', W / 2, alertY + 14, T_GREEN, '9px', 0.5, 0.5);

        const qY = alertY + 38;
        this.txt('q_label', spec.question, W / 2, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('le_ans', 'Answer: ?', W / 2, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Consistency Panel (World 2) ─────────────────────────────────
    private drawConsistencyPanel(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.26;
        const eq1 = (spec as any).leEquation1;
        const eq2 = (spec as any).leEquation2;

        // Equations
        const panelW = Math.min(280, W * 0.72);
        this.drawPanel(this.mainGfx, cx - panelW / 2, cy - 20, panelW, 32, PANEL_BG, LINE_BLUE, 6);
        this.txt('eq1_d', `Eq1: ${eq1.a}x + ${eq1.b}y = ${eq1.c}`, cx, cy - 4, T_BLUE, '12px', 0.5, 0.5);
        this.drawPanel(this.mainGfx, cx - panelW / 2, cy + 18, panelW, 32, PANEL_BG, LINE_ORANGE, 6);
        this.txt('eq2_d', `Eq2: ${eq2.a}x ${eq2.b < 0 ? '−' : '+'} ${Math.abs(eq2.b)}y = ${eq2.c}`, cx, cy + 34, T_ORANGE, '12px', 0.5, 0.5);

        // Ratio analysis panel
        const rY = cy + 62;
        const rW = Math.min(300, W * 0.78);
        const rH = 80;
        this.drawPanel(this.mainGfx, cx - rW / 2, rY, rW, rH, METAL_DARK, PANEL_BORDER, 10);
        this.txt('r_title', '📊 RATIO ANALYSIS', cx, rY + 10, T_CYAN, '9px', 0.5, 0);

        const r1 = eq1.a / eq2.a;
        const r2 = eq1.b / eq2.b;
        const r3 = eq1.c / eq2.c;

        const slotW = Math.min(70, rW / 4.5);
        const ratios = [
            { label: 'a₁/a₂', value: r1.toFixed(2), color: T_BLUE },
            { label: 'b₁/b₂', value: r2.toFixed(2), color: T_PURPLE },
            { label: 'c₁/c₂', value: r3.toFixed(2), color: T_ORANGE },
        ];
        ratios.forEach((r, i) => {
            const rx = cx + (i - 1) * (slotW + 14);
            this.drawPanel(this.mainGfx, rx - slotW / 2, rY + 24, slotW, 36, PANEL_BG, PANEL_BORDER, 4);
            this.txt(`r_lbl_${i}`, r.label, rx, rY + 28, T_SILVER, '8px', 0.5, 0);
            this.txt(`r_val_${i}`, r.value, rx, rY + 44, r.color, '13px', 0.5, 0.5);
        });

        // Conclusion
        let conclusion: string;
        let conclusionColor: string;
        if (Math.abs(r1 - r2) > 0.01) {
            conclusion = 'a₁/a₂ ≠ b₁/b₂ → UNIQUE SOLUTION (Consistent)';
            conclusionColor = T_GREEN;
        } else if (Math.abs(r1 - r3) < 0.01) {
            conclusion = 'All ratios equal → INFINITE SOLUTIONS (Dependent)';
            conclusionColor = T_CYAN;
        } else {
            conclusion = 'a₁/a₂ = b₁/b₂ ≠ c₁/c₂ → NO SOLUTION (Inconsistent)';
            conclusionColor = T_RED;
        }
        this.txt('conclusion', conclusion, cx, rY + rH + 8, conclusionColor, '9px', 0.5, 0);

        const qY = rY + rH + 28;
        this.txt('q_label', spec.question, cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('le_ans', 'Answer: ?', cx, qY + 20, T_CYAN, '14px', 0.5, 0);
    }

    // ── Substitution Panel (World 3) ────────────────────────────────
    private drawSubstitutionPanel(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.22;
        const eq1 = (spec as any).leEquation1;
        const eq2 = (spec as any).leEquation2;
        const sx = (spec as any).leSolutionX;
        const sy = (spec as any).leSolutionY;

        // Title
        this.txt('method_title', '🧪 SUBSTITUTION METHOD', cx, cy - 12, T_CYAN, '11px', 0.5, 0.5);

        // Two equation slots
        const panelW = Math.min(280, W * 0.72);
        const slotH = 32;
        this.drawPanel(this.mainGfx, cx - panelW / 2, cy + 6, panelW, slotH, PANEL_BG, LINE_BLUE, 6);
        this.txt('eq1_sub', `Eq1: ${eq1.a}x ${eq1.b >= 0 ? '+' : '−'} ${Math.abs(eq1.b)}y = ${eq1.c}`, cx, cy + 6 + slotH / 2, T_BLUE, '12px', 0.5, 0.5);

        this.drawPanel(this.mainGfx, cx - panelW / 2, cy + slotH + 12, panelW, slotH, PANEL_BG, LINE_ORANGE, 6);
        this.txt('eq2_sub', `Eq2: ${eq2.a}x ${eq2.b >= 0 ? '+' : '−'} ${Math.abs(eq2.b)}y = ${eq2.c}`, cx, cy + slotH + 12 + slotH / 2, T_ORANGE, '12px', 0.5, 0.5);

        // Substitution flow
        const flowY = cy + 2 * slotH + 30;
        const flowW = Math.min(280, W * 0.72);
        const flowH = 80;
        this.drawPanel(this.mainGfx, cx - flowW / 2, flowY, flowW, flowH, METAL_DARK, NEON_PURPLE, 8);
        this.txt('flow_title', 'SUBSTITUTION FLOW', cx, flowY + 10, T_PURPLE, '9px', 0.5, 0);

        // Step indicators
        const steps = ['① Isolate', '② Substitute', '③ Solve'];
        const stepColors = [T_BLUE, T_PURPLE, T_GREEN];
        steps.forEach((step, i) => {
            const sx = cx + (i - 1) * (flowW / 3.5);
            this.txt(`step_${i}`, step, sx, flowY + 30, stepColors[i], '9px', 0.5, 0.5);
        });

        // Arrow connectors between steps
        this.mainGfx.lineStyle(1.5, NEON_PURPLE, 0.5);
        const stepSpacing = flowW / 3.5;
        this.mainGfx.lineBetween(cx - stepSpacing + 30, flowY + 30, cx - 30, flowY + 30);
        this.mainGfx.lineBetween(cx + 30, flowY + 30, cx + stepSpacing - 30, flowY + 30);

        // Solution display
        this.txt('sol_display', `Solution: x = ${sx}, y = ${sy}`, cx, flowY + 56, T_GREEN, '11px', 0.5, 0.5);

        // Small grid preview
        const miniGridW = Math.min(120, W * 0.3);
        const miniGridH = Math.min(80, H * 0.18);
        const miniOx = cx - miniGridW / 2;
        const miniOy = flowY + flowH + 12;
        const xRange: [number, number] = [-1, Math.max(sx + 3, 6)];
        const yRange: [number, number] = [-1, Math.max(sy + 3, 6)];
        this.drawCoordGrid(this.mainGfx, miniOx, miniOy, miniGridW, miniGridH, xRange, yRange);
        if (eq1.a !== 0 || eq1.b !== 0) this.plotLine(this.mainGfx, miniOx, miniOy, miniGridW, miniGridH, xRange, yRange, eq1, LINE_BLUE, 'mini_eq1');
        if (eq2.a !== 0 || eq2.b !== 0) this.plotLine(this.mainGfx, miniOx, miniOy, miniGridW, miniGridH, xRange, yRange, eq2, LINE_ORANGE, 'mini_eq2');

        const qY = miniOy + miniGridH + 8;
        this.txt('q_label', spec.question, cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('le_ans', 'Answer: ?', cx, qY + 18, T_CYAN, '14px', 0.5, 0);
    }

    // ── Elimination Panel (World 4) ─────────────────────────────────
    private drawEliminationPanel(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.22;
        const eq1 = (spec as any).leEquation1;
        const eq2 = (spec as any).leEquation2;

        this.txt('method_title', '⚡ ELIMINATION METHOD', cx, cy - 12, T_CYAN, '11px', 0.5, 0.5);

        const panelW = Math.min(280, W * 0.72);
        const slotH = 36;

        // Equation 1
        this.drawPanel(this.mainGfx, cx - panelW / 2, cy + 6, panelW, slotH, PANEL_BG, LINE_BLUE, 6);
        this.txt('eq1_elim', `${eq1.a}x ${eq1.b >= 0 ? '+' : '−'} ${Math.abs(eq1.b)}y = ${eq1.c}`, cx, cy + 6 + slotH / 2, T_BLUE, '13px', 0.5, 0.5);

        // Operation symbol
        const opSign = eq1.b * eq2.b < 0 ? '+' : '−';
        this.mainGfx.fillStyle(CYAN, 0.15);
        this.mainGfx.fillCircle(cx - panelW / 2 - 16, cy + slotH + 8, 12);
        this.txt('op_sign', opSign, cx - panelW / 2 - 16, cy + slotH + 8, T_CYAN, '16px', 0.5, 0.5);

        // Equation 2
        this.drawPanel(this.mainGfx, cx - panelW / 2, cy + slotH + 12, panelW, slotH, PANEL_BG, LINE_ORANGE, 6);
        this.txt('eq2_elim', `${eq2.a}x ${eq2.b >= 0 ? '+' : '−'} ${Math.abs(eq2.b)}y = ${eq2.c}`, cx, cy + slotH + 12 + slotH / 2, T_ORANGE, '13px', 0.5, 0.5);

        // Highlight matching coefficients
        if (Math.abs(eq1.b) === Math.abs(eq2.b)) {
            // y-coefficients match
            const highlightColor = eq1.b * eq2.b < 0 ? EMERALD : DANGER_RED;
            const hText = eq1.b * eq2.b < 0 ? 'OPPOSITE SIGNS → ADD' : 'SAME SIGNS → SUBTRACT';
            this.mainGfx.lineStyle(2, highlightColor, 0.6);
            this.txt('match_hint', hText, cx, cy + 2 * slotH + 22, highlightColor === EMERALD ? T_GREEN : T_RED, '9px', 0.5, 0);
        }

        // Separator line
        const sepY = cy + 2 * slotH + 36;
        this.mainGfx.lineStyle(2, METAL_LIGHT, 0.5);
        this.mainGfx.lineBetween(cx - panelW / 2 + 10, sepY, cx + panelW / 2 - 10, sepY);

        // Result equation
        const resultA = opSign === '+' ? eq1.a + eq2.a : eq1.a - eq2.a;
        const resultB = opSign === '+' ? eq1.b + eq2.b : eq1.b - eq2.b;
        const resultC = opSign === '+' ? eq1.c + eq2.c : eq1.c - eq2.c;

        const resultY = sepY + 6;
        this.drawPanel(this.mainGfx, cx - panelW / 2, resultY, panelW, slotH, PANEL_BG, EMERALD, 6);

        let resultStr = '';
        if (resultA !== 0 && resultB !== 0) {
            resultStr = `${resultA}x ${resultB >= 0 ? '+' : '−'} ${Math.abs(resultB)}y = ${resultC}`;
        } else if (resultB === 0) {
            resultStr = `${resultA}x = ${resultC}`;
        } else {
            resultStr = `${resultB}y = ${resultC}`;
        }
        this.txt('result_eq', resultStr, cx, resultY + slotH / 2, T_GREEN, '14px', 0.5, 0.5);

        // Spark effects near eliminated variable
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 4 + Math.random() * 12;
            const sparkX = cx + Math.cos(angle) * dist;
            const sparkY = sepY + Math.sin(angle) * dist;
            this.mainGfx.fillStyle(CYAN, 0.3 + Math.random() * 0.3);
            this.mainGfx.fillCircle(sparkX, sparkY, 1 + Math.random() * 1.5);
        }

        const qY = resultY + slotH + 16;
        this.txt('q_label', spec.question, cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('le_ans', 'Answer: ?', cx, qY + 18, T_CYAN, '14px', 0.5, 0);
    }

    // ── Cross-Multiplication (World 5) ──────────────────────────────
    private drawCrossMultiply(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.22;
        const eq1 = (spec as any).leEquation1;
        const eq2 = (spec as any).leEquation2;

        this.txt('method_title', '✕ CROSS-MULTIPLICATION', cx, cy - 12, T_CYAN, '11px', 0.5, 0.5);

        // Equations in standard form (ax + by - c = 0)
        const panelW = Math.min(280, W * 0.72);
        this.drawPanel(this.mainGfx, cx - panelW / 2, cy + 6, panelW, 28, PANEL_BG, LINE_BLUE, 6);
        this.txt('eq1_cm', `${eq1.a}x + ${eq1.b}y − ${eq1.c} = 0`, cx, cy + 20, T_BLUE, '11px', 0.5, 0.5);
        this.drawPanel(this.mainGfx, cx - panelW / 2, cy + 40, panelW, 28, PANEL_BG, LINE_ORANGE, 6);
        this.txt('eq2_cm', `${eq2.a}x + ${eq2.b}y − ${eq2.c} = 0`, cx, cy + 54, T_ORANGE, '11px', 0.5, 0.5);

        // Cross multiplication diagram
        const diagY = cy + 80;
        const diagW = Math.min(280, W * 0.72);
        const diagH = 86;
        this.drawPanel(this.mainGfx, cx - diagW / 2, diagY, diagW, diagH, METAL_DARK, NEON_PURPLE, 8);
        this.txt('cm_title', 'CROSS-MULTIPLICATION FORMULA', cx, diagY + 10, T_PURPLE, '8px', 0.5, 0);

        // Column headers
        const colW = diagW / 4;
        const headers = ['b₁,b₂', 'c₁,c₂', 'a₁,a₂', 'b₁,b₂'];
        const hColors = [T_PURPLE, T_ORANGE, T_BLUE, T_PURPLE];
        headers.forEach((h, i) => {
            const hx = cx - diagW / 2 + colW * i + colW / 2;
            this.txt(`h_${i}`, h, hx, diagY + 26, hColors[i], '9px', 0.5, 0);
        });

        // Values
        const vals = [
            [`${eq1.b}`, `${eq2.b}`],
            [`${-eq1.c}`, `${-eq2.c}`],
            [`${eq1.a}`, `${eq2.a}`],
            [`${eq1.b}`, `${eq2.b}`],
        ];
        vals.forEach((col, i) => {
            const vx = cx - diagW / 2 + colW * i + colW / 2;
            this.txt(`v1_${i}`, col[0], vx, diagY + 42, T_WHITE, '11px', 0.5, 0.5);
            this.txt(`v2_${i}`, col[1], vx, diagY + 58, T_WHITE, '11px', 0.5, 0.5);
        });

        // Cross arrows
        this.mainGfx.lineStyle(1.5, NEON_PURPLE, 0.4);
        for (let i = 0; i < 3; i++) {
            const x1 = cx - diagW / 2 + colW * i + colW / 2;
            const x2 = cx - diagW / 2 + colW * (i + 1) + colW / 2;
            // Forward cross
            this.mainGfx.lineBetween(x1 + 4, diagY + 42, x2 - 4, diagY + 58);
            // Backward cross
            this.mainGfx.lineBetween(x1 + 4, diagY + 58, x2 - 4, diagY + 42);
        }

        // Result
        const denom = eq1.a * eq2.b - eq2.a * eq1.b;
        const xNum = eq1.b * (-eq2.c) - eq2.b * (-eq1.c);
        const yNum = (-eq1.c) * eq2.a - (-eq2.c) * eq1.a;
        this.txt('cm_result', `x = ${xNum}/${denom} = ${denom !== 0 ? (xNum/denom).toFixed(1) : '?'}   y = ${yNum}/${denom} = ${denom !== 0 ? (yNum/denom).toFixed(1) : '?'}`, cx, diagY + diagH - 8, T_GREEN, '10px', 0.5, 1);

        const qY = diagY + diagH + 14;
        this.txt('q_label', spec.question, cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('le_ans', 'Answer: ?', cx, qY + 18, T_CYAN, '14px', 0.5, 0);
    }

    // ── Word Problem (World 5) ──────────────────────────────────────
    private drawWordProblem(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.18;
        const eq1 = (spec as any).leEquation1;
        const eq2 = (spec as any).leEquation2;
        const sx = (spec as any).leSolutionX;
        const sy = (spec as any).leSolutionY;

        this.txt('method_title', '🌍 REAL-WORLD EQUATION BUILDER', cx, cy - 6, T_CYAN, '11px', 0.5, 0.5);

        // Word problem display
        const descW = Math.min(300, W * 0.82);
        const descH = 52;
        this.drawPanel(this.mainGfx, cx - descW / 2, cy + 10, descW, descH, PANEL_BG, NEON_ORANGE, 8);
        this.txt('wp_desc', spec.question, cx, cy + 10 + descH / 2, T_WHITE, '10px', 0.5, 0.5);

        // Translated equations
        const eqY = cy + descH + 22;
        const eqW = Math.min(260, W * 0.68);
        this.drawPanel(this.mainGfx, cx - eqW / 2, eqY, eqW, 60, METAL_DARK, PANEL_BORDER, 8);
        this.txt('wp_eq_title', 'TRANSLATED EQUATIONS', cx, eqY + 8, T_CYAN, '8px', 0.5, 0);
        this.txt('wp_eq1', `Eq1: ${eq1.a}x ${eq1.b >= 0 ? '+' : '−'} ${Math.abs(eq1.b)}y = ${eq1.c}`, cx, eqY + 26, T_BLUE, '11px', 0.5, 0.5);
        this.txt('wp_eq2', `Eq2: ${eq2.a}x ${eq2.b >= 0 ? '+' : '−'} ${Math.abs(eq2.b)}y = ${eq2.c}`, cx, eqY + 42, T_ORANGE, '11px', 0.5, 0.5);

        // Solution panel
        const solY = eqY + 72;
        this.drawPanel(this.mainGfx, cx - 80, solY, 160, 40, METAL_DARK, EMERALD, 8);
        this.txt('sol_title', 'SOLUTION', cx, solY + 6, T_SILVER, '8px', 0.5, 0);
        this.txt('sol_vals', `x = ${sx},  y = ${sy}`, cx, solY + 26, T_GREEN, '13px', 0.5, 0.5);

        const qY = solY + 52;
        this.txt('le_ans', 'Answer: ?', cx, qY, T_CYAN, '14px', 0.5, 0);
    }

    // ── Final Boss (World 5) ────────────────────────────────────────
    private drawFinalBoss(spec: LevelSpecification, W: number, H: number) {
        const cx = W / 2, cy = H * 0.15;
        const eq1 = (spec as any).leEquation1;
        const eq2 = (spec as any).leEquation2;
        const sx = (spec as any).leSolutionX;
        const sy = (spec as any).leSolutionY;

        // Boss title with glow
        this.mainGfx.fillStyle(DANGER_RED, 0.08);
        this.mainGfx.fillRoundedRect(cx - 120, cy - 16, 240, 28, 10);
        this.txt('boss_title', '🏆 GRANDMASTER CHALLENGE', cx, cy, T_RED, '12px', 0.5, 0.5);

        // Two equations
        const panelW = Math.min(280, W * 0.72);
        const eqY = cy + 22;
        this.drawPanel(this.mainGfx, cx - panelW / 2, eqY, panelW, 30, PANEL_BG, LINE_BLUE, 6);
        this.txt('eq1_boss', `${eq1.a}x + ${eq1.b}y = ${eq1.c}`, cx, eqY + 15, T_BLUE, '13px', 0.5, 0.5);
        this.drawPanel(this.mainGfx, cx - panelW / 2, eqY + 36, panelW, 30, PANEL_BG, LINE_ORANGE, 6);
        this.txt('eq2_boss', `${eq2.a}x ${eq2.b >= 0 ? '+' : '−'} ${Math.abs(eq2.b)}y = ${eq2.c}`, cx, eqY + 51, T_ORANGE, '13px', 0.5, 0.5);

        // Graph
        const gridW = Math.min(W * 0.55, 220);
        const gridH = Math.min(H * 0.35, 160);
        const gox = (W - gridW) / 2;
        const goy = eqY + 76;
        const xRange: [number, number] = [-1, Math.max(sx + 3, 7)];
        const yRange: [number, number] = [-1, Math.max(sy + 3, 6)];
        this.drawCoordGrid(this.mainGfx, gox, goy, gridW, gridH, xRange, yRange);
        this.plotLine(this.mainGfx, gox, goy, gridW, gridH, xRange, yRange, eq1, LINE_BLUE, 'boss_l1');
        this.plotLine(this.mainGfx, gox, goy, gridW, gridH, xRange, yRange, eq2, LINE_ORANGE, 'boss_l2');
        this.drawIntersectionPoint(this.mainGfx, gox, goy, gridW, gridH, xRange, yRange, sx, sy);

        const qY = goy + gridH + 8;
        this.txt('q_label', spec.question, cx, qY, T_WHITE, '11px', 0.5, 0);
        this.txt('le_ans', 'Answer: ?', cx, qY + 18, T_CYAN, '14px', 0.5, 0);
    }

    // ═════════════════════════════════════════════════════════════════
    // LIVE REFRESH
    // ═════════════════════════════════════════════════════════════════
    private refreshLive() {
        if (!this.levelSpec) return;
        const ans = this.labels['le_ans'];
        if (ans) {
            if (this.currentInput !== 0 || this.lastInput === 0) {
                ans.setText(`Answer: ${this.currentInput}`);
                const spec = this.levelSpec;
                const diff = Math.abs(this.currentInput - spec.correctAnswer);
                if (diff <= (spec.tolerance || 0)) {
                    ans.setColor(T_GREEN);
                } else {
                    ans.setColor(T_CYAN);
                }
            } else {
                ans.setText('Answer: ?');
                ans.setColor(T_CYAN);
            }
        }
    }

    // ═════════════════════════════════════════════════════════════════
    // TEXT & EFFECTS HELPERS
    // ═════════════════════════════════════════════════════════════════
    private txt(key: string, text: string, x: number, y: number, color: string, size: string, originX: number, originY: number): GameObjects.Text {
        if (this.labels[key]) {
            this.labels[key].setPosition(x, y).setText(text).setColor(color).setFontSize(size).setOrigin(originX, originY);
            return this.labels[key];
        }
        const t = this.add.text(x, y, text, {
            fontFamily: FONT,
            fontSize: size,
            color,
            resolution: 2,
        }).setOrigin(originX, originY);
        this.labels[key] = t;
        return t;
    }

    private clearLabels() {
        Object.values(this.labels).forEach(t => t.destroy());
        this.labels = {};
    }

    private flashScreen(color: number) {
        const rect = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width,
            this.cameras.main.height,
            color, 0.3
        );
        this.tweens.add({
            targets: rect,
            alpha: 0,
            duration: 500,
            onComplete: () => rect.destroy(),
        });
    }

    private celebrateSuccess() {
        const W = this.cameras.main.width;
        const H = this.cameras.main.height;
        for (let i = 0; i < 20; i++) {
            const px = Math.random() * W;
            const py = Math.random() * H;
            const star = this.add.circle(px, py, 2 + Math.random() * 3, [EMERALD, CYAN, NEON_ORANGE, ELECTRIC_BLUE][Math.floor(Math.random() * 4)], 0.8);
            this.tweens.add({
                targets: star,
                y: py - 40 - Math.random() * 60,
                alpha: 0,
                scale: 0.3,
                duration: 800 + Math.random() * 600,
                ease: 'Power2',
                onComplete: () => star.destroy(),
            });
        }
    }
}
