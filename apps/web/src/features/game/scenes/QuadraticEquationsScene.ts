import Phaser, { Scene, GameObjects } from 'phaser';
import { EventBus } from '../engine/EventBus';
import { getLevelSpec } from '@/data/levelSpecs';
import type { LevelSpecification } from '@/data/levelSpecs';

const FONT = 'Inter, system-ui, -apple-system, sans-serif';

const DARK_BG      = 0x0A1628;
const GRID_DOTS    = 0x1A3A5C;
const T_BLUE       = '#00B4FF';
const T_WHITE      = '#E2E8F0';
const T_ORANGE     = '#F59E0B';
const T_GREEN      = '#10B981';
const T_SILVER     = '#94A3B8';

const LINE_BLUE    = 0x3B82F6;
const LINE_ORANGE  = 0xF59E0B;
const LINE_GREEN   = 0x10B981;
const CMD_DARK     = 0x0D1B2A;
const METAL_LIGHT  = 0x9CA3AF;
const PANEL_BG     = 0x1B2838;

export class QuadraticEquationsScene extends Scene {

    private bgGfx!: GameObjects.Graphics;
    private mainGfx!: GameObjects.Graphics;
    private glowGfx!: GameObjects.Graphics;
    private labels: Record<string, GameObjects.Text> = {};

    private levelSpec: LevelSpecification | null = null;
    private isLevelActive = false;
    private currentInput = 0;
    private lastInput = -9999;

    constructor() { super('QuadraticEquationsScene'); }

    create() {
        this.cameras.main.setBackgroundColor('#0D1B2A');
        this.bgGfx   = this.add.graphics();
        this.glowGfx = this.add.graphics();
        this.mainGfx = this.add.graphics();

        // Ambient glow
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const cx = w / 2;
        const cy = h / 2;
        
        const ambient = this.add.graphics();
        ambient.fillGradientStyle(0x0A1628, 0x0A1628, 0x0D1B2A, 0x0D1B2A, 1, 1, 1, 1);
        ambient.fillRect(0, 0, w, h);
        ambient.setDepth(-1);

        const onLoadLevel = (levelData: any) => {
            if (!this.scene?.systems) return;
            if (!levelData.id.startsWith('lvl-qe-')) {
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

        const onCorrect = () => { this.flashScreen(0x10B981); this.celebrateSuccess(); };
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

        const onResize = (gameSize: Phaser.Structs.Size) => {
            if (!this.isLevelActive) return;
            ambient.clear();
            ambient.fillGradientStyle(0x0A1628, 0x0A1628, 0x0D1B2A, 0x0D1B2A, 1, 1, 1, 1);
            ambient.fillRect(0, 0, gameSize.width, gameSize.height);
            this.drawLevel();
        };
        this.scale.on('resize', onResize);
    }

    update(time: number, delta: number) {
        if (!this.isLevelActive) return;
        if (Math.abs(this.currentInput - this.lastInput) > 0.001) {
            this.lastInput = this.currentInput;
            this.drawLevel();
        }
    }

    private clearLabels() {
        Object.values(this.labels).forEach(l => l.destroy());
        this.labels = {};
    }

    private createLabel(id: string, text: string, x: number, y: number, color = T_WHITE, size = '14px', bold = false, originX = 0.5, originY = 0.5, bg = true) {
        if (!this.labels[id]) {
            this.labels[id] = this.add.text(x, y, text, {
                fontFamily: FONT, fontSize: size, color, fontStyle: bold ? 'bold' : 'normal',
                backgroundColor: bg ? 'rgba(13, 27, 42, 0.7)' : 'transparent', padding: { x: bg ? 4 : 0, y: bg ? 2 : 0 }
            }).setOrigin(originX, originY);
        } else {
            this.labels[id].setText(text).setPosition(x, y);
        }
    }

    private flashScreen(color: number) {
        const flash = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, this.cameras.main.width, this.cameras.main.height, color, 0.3);
        flash.setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({ targets: flash, alpha: 0, duration: 600, onComplete: () => flash.destroy() });
    }

    private celebrateSuccess() {
        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY;
        for (let i = 0; i < 30; i++) {
            const star = this.add.circle(cx, cy, Math.random() * 4 + 2, [0xFFE066, 0x00E676, 0x00E5FF][Math.floor(Math.random() * 3)]);
            this.tweens.add({
                targets: star,
                x: cx + (Math.random() - 0.5) * 600,
                y: cy + (Math.random() - 0.5) * 600,
                alpha: 0,
                scale: Math.random() * 2,
                duration: 800 + Math.random() * 600,
                ease: 'Cubic.easeOut',
                onComplete: () => star.destroy()
            });
        }
    }

    private drawLevel() {
        if (!this.levelSpec) return;
        this.bgGfx.clear();
        this.glowGfx.clear();
        this.mainGfx.clear();
        this.clearLabels();

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const cx = w / 2;
        const cy = h / 2;

        const mode = this.levelSpec.qeMode || 'parabola';
        const eq = this.levelSpec.qeEquation || { a: 1, b: 0, c: 0 };
        const activeVal = this.currentInput;

        // Draw rich grid for Cartesian modes
        if (['parabola', 'roots', 'projectile'].includes(mode)) {
            this.drawCoordGrid(this.bgGfx, cx, cy, w, h);
        } else {
            this.drawSimpleGrid(w, h, cx, cy);
        }

        // Draw Formula Panel
        this.bgGfx.fillStyle(PANEL_BG, 0.9);
        this.bgGfx.fillRect(0, h - 34, w, 34);
        this.bgGfx.lineStyle(1, 0x2A4060, 1);
        this.bgGfx.lineBetween(0, h - 34, w, h - 34);
        this.createLabel('formula', `📐  ${this.levelSpec.formulaDisplay}`, w / 2, h - 17, T_SILVER, '12px', false, 0.5, 0.5, false);


        switch (mode) {
            case 'parabola':
            case 'roots':
            case 'projectile':
                this.drawParabola(cx, cy, w, h, eq, activeVal, mode);
                break;
            case 'area_model':
                this.drawAreaModel(cx, cy, eq, activeVal);
                break;
            case 'completing_square':
                this.drawCompletingSquare(cx, cy, eq, activeVal);
                break;
            case 'word_problem':
            default:
                this.drawWordProblem(cx, cy, eq, activeVal);
                break;
        }
    }

    private drawSimpleGrid(w: number, h: number, cx: number, cy: number) {
        this.bgGfx.lineStyle(1, GRID_DOTS, 0.4);
        const step = 40;
        for (let x = cx % step; x < w; x += step) { this.bgGfx.lineBetween(x, 0, x, h); }
        for (let y = cy % step; y < h; y += step) { this.bgGfx.lineBetween(0, y, w, y); }
        this.bgGfx.lineStyle(2, 0x334155, 0.8);
        this.bgGfx.lineBetween(0, cy, w, cy);
        this.bgGfx.lineBetween(cx, 0, cx, h);
    }

    private drawCoordGrid(gfx: GameObjects.Graphics, cx: number, cy: number, w: number, h: number) {
        // Dot-grid background
        gfx.fillStyle(GRID_DOTS, 0.4);
        for (let x = 20; x < w; x += 26) for (let y = 20; y < h; y += 26)
            gfx.fillCircle(x, y, 1.1);

        const step = 40;
        
        // Grid lines
        for (let x = cx % step; x < w; x += step) {
            const mathX = Math.round((x - cx) / step);
            gfx.lineStyle(1, METAL_LIGHT, mathX === 0 ? 0.6 : 0.12);
            gfx.lineBetween(x, 0, x, h);
            if (mathX !== 0 && mathX % 2 === 0) {
                this.createLabel(`gx_${mathX}`, String(mathX), x, cy + 10, T_SILVER, '10px', false, 0.5, 0, false);
            }
        }
        for (let y = cy % step; y < h; y += step) {
            const mathY = Math.round((cy - y) / step);
            gfx.lineStyle(1, METAL_LIGHT, mathY === 0 ? 0.6 : 0.12);
            gfx.lineBetween(0, y, w, y);
            if (mathY !== 0 && mathY % 2 === 0) {
                this.createLabel(`gy_${mathY}`, String(mathY), cx - 10, y, T_SILVER, '10px', false, 1, 0.5, false);
            }
        }

        // Axes (thicker)
        gfx.lineStyle(2, METAL_LIGHT, 0.7);
        gfx.lineBetween(cx, 0, cx, h);
        gfx.lineBetween(0, cy, w, cy);

        // Arrows
        gfx.fillStyle(METAL_LIGHT, 0.7);
        gfx.fillTriangle(cx, 0, cx - 4, 10, cx + 4, 10);
        gfx.fillTriangle(w, cy, w - 10, cy - 4, w - 10, cy + 4);

        this.createLabel('y_axis', 'y', cx + 10, 10, T_SILVER, '12px', false, 0, 0, false);
        this.createLabel('x_axis', 'x', w - 10, cy - 15, T_SILVER, '12px', false, 1, 1, false);
        this.createLabel('origin', 'O', cx - 12, cy + 8, T_SILVER, '10px', false, 1, 0, false);
    }

    private drawParabola(cx: number, cy: number, w: number, h: number, eq: {a:number, b:number, c:number}, activeVal: number, mode: string) {
        const scale = 40; // match the coordinate grid step
        const { a, b, c } = eq;
        
        // Use activeVal to modify equation for interactive levels
        let drawA = a;
        let drawB = b;
        let drawC = c;
        if (this.levelSpec?.id === 'lvl-qe-01') drawA = activeVal || 2;
        if (this.levelSpec?.id === 'lvl-qe-02') drawB = activeVal || 3;
        
        // --- Glow Pass ---
        this.glowGfx.lineStyle(8, LINE_BLUE, 0.2);
        this.glowGfx.beginPath();
        for (let x = -w/2; x < w/2; x += 5) {
            const mathX = x / scale;
            const mathY = drawA * mathX * mathX + drawB * mathX + drawC;
            const screenX = cx + x;
            const screenY = cy - mathY * scale;
            if (x === -w/2) this.glowGfx.moveTo(screenX, screenY);
            else this.glowGfx.lineTo(screenX, screenY);
        }
        this.glowGfx.strokePath();

        this.glowGfx.lineStyle(16, LINE_BLUE, 0.05);
        this.glowGfx.beginPath();
        for (let x = -w/2; x < w/2; x += 5) {
            const mathX = x / scale;
            const mathY = drawA * mathX * mathX + drawB * mathX + drawC;
            const screenX = cx + x;
            const screenY = cy - mathY * scale;
            if (x === -w/2) this.glowGfx.moveTo(screenX, screenY);
            else this.glowGfx.lineTo(screenX, screenY);
        }
        this.glowGfx.strokePath();

        // --- Main Pass ---
        this.mainGfx.lineStyle(3, LINE_BLUE, 1);
        this.mainGfx.beginPath();
        for (let x = -w/2; x < w/2; x += 5) {
            const mathX = x / scale;
            const mathY = drawA * mathX * mathX + drawB * mathX + drawC;
            const screenX = cx + x;
            const screenY = cy - mathY * scale;
            if (x === -w/2) this.mainGfx.moveTo(screenX, screenY);
            else this.mainGfx.lineTo(screenX, screenY);
        }
        this.mainGfx.strokePath();

        // Vertex
        const vx = -drawB / (2 * drawA);
        const vy = drawA * vx * vx + drawB * vx + drawC;
        
        // Vertex Glow
        this.glowGfx.fillStyle(LINE_ORANGE, 0.3);
        this.glowGfx.fillCircle(cx + vx * scale, cy - vy * scale, 12);
        this.glowGfx.fillCircle(cx + vx * scale, cy - vy * scale, 18);
        
        this.mainGfx.fillStyle(LINE_ORANGE, 1);
        this.mainGfx.fillCircle(cx + vx * scale, cy - vy * scale, 6);
        this.mainGfx.lineStyle(2, 0xFFFFFF, 0.8);
        this.mainGfx.strokeCircle(cx + vx * scale, cy - vy * scale, 6);
        this.createLabel('vertex', `V(${vx.toFixed(1)}, ${vy.toFixed(1)})`, cx + vx * scale, cy - vy * scale - 25, T_ORANGE, '14px', true);

        // Draw projectile active point
        if (mode === 'projectile') {
            const targetT = activeVal || 0;
            const projY = drawA * targetT * targetT + drawB * targetT + drawC;
            
            this.glowGfx.fillStyle(LINE_GREEN, 0.3);
            this.glowGfx.fillCircle(cx + targetT * scale, cy - projY * scale, 16);
            this.mainGfx.fillStyle(LINE_GREEN, 1);
            this.mainGfx.fillCircle(cx + targetT * scale, cy - projY * scale, 8);
            this.mainGfx.lineStyle(2, 0xFFFFFF, 1);
            this.mainGfx.strokeCircle(cx + targetT * scale, cy - projY * scale, 8);
            this.createLabel('projectile', `t=${targetT.toFixed(1)}s, h=${Math.max(0, projY).toFixed(1)}m`, cx + targetT * scale, cy - projY * scale - 30, T_GREEN, '16px', true);
        }

        // Roots
        if (mode === 'roots' || mode === 'parabola') {
            const discriminant = drawB * drawB - 4 * drawA * drawC;
            if (discriminant >= 0) {
                const r1 = (-drawB + Math.sqrt(discriminant)) / (2 * drawA);
                const r2 = (-drawB - Math.sqrt(discriminant)) / (2 * drawA);
                
                this.glowGfx.fillStyle(LINE_GREEN, 0.2);
                this.glowGfx.fillCircle(cx + r1 * scale, cy, 14);
                this.mainGfx.fillStyle(LINE_GREEN, 1);
                this.mainGfx.fillCircle(cx + r1 * scale, cy, 6);
                this.mainGfx.lineStyle(2, 0xFFFFFF, 0.8);
                this.mainGfx.strokeCircle(cx + r1 * scale, cy, 6);
                this.createLabel('root1', `x=${r1.toFixed(1)}`, cx + r1 * scale, cy + 25, T_GREEN, '14px', true);
                
                if (Math.abs(r1 - r2) > 0.01) {
                    this.glowGfx.fillStyle(LINE_GREEN, 0.2);
                    this.glowGfx.fillCircle(cx + r2 * scale, cy, 14);
                    this.mainGfx.fillStyle(LINE_GREEN, 1);
                    this.mainGfx.fillCircle(cx + r2 * scale, cy, 6);
                    this.mainGfx.lineStyle(2, 0xFFFFFF, 0.8);
                    this.mainGfx.strokeCircle(cx + r2 * scale, cy, 6);
                    this.createLabel('root2', `x=${r2.toFixed(1)}`, cx + r2 * scale, cy + 25, T_GREEN, '14px', true);
                }
            }
        }
    }

    private drawAreaModel(cx: number, cy: number, eq: {a:number, b:number, c:number}, activeVal: number) {
        // Area model visualization for factoring
        const scale = 30;
        let side1 = 0;
        let side2 = 0;
        
        if (this.levelSpec?.qeRoots) {
            side1 = Math.abs(this.levelSpec.qeRoots[0]);
            side2 = Math.abs(this.levelSpec.qeRoots[1]);
        } else {
            side1 = 4; side2 = 2; // fallback
        }

        const width = side1 * scale;
        const height = side2 * scale;
        
        // Animate based on activeVal
        const displayW = Math.max(10, width * (activeVal || this.levelSpec?.correctAnswer || 1) / (this.levelSpec?.correctAnswer || 1));
        const displayH = Math.max(10, height);

        // Glow
        this.glowGfx.fillStyle(LINE_BLUE, 0.15);
        this.glowGfx.fillRoundedRect(cx - displayW/2 - 5, cy - displayH/2 - 5, displayW + 10, displayH + 10, 8);

        this.mainGfx.fillStyle(0x1E3A8A, 0.6);
        this.mainGfx.lineStyle(2, LINE_BLUE, 1);
        this.mainGfx.fillRoundedRect(cx - displayW/2, cy - displayH/2, displayW, displayH, 4);
        this.mainGfx.strokeRoundedRect(cx - displayW/2, cy - displayH/2, displayW, displayH, 4);

        this.createLabel('area', `Area = ${eq.c !== 0 ? Math.abs(eq.c) : '?' }`, cx, cy, T_WHITE, '18px', true);
        this.createLabel('side1', `(x ${this.levelSpec?.qeRoots ? (this.levelSpec.qeRoots[0] > 0 ? '-' : '+') : ''} ${side1})`, cx, cy - displayH/2 - 20, T_ORANGE, '16px', true);
        this.createLabel('side2', `(x ${this.levelSpec?.qeRoots ? (this.levelSpec.qeRoots[1] > 0 ? '-' : '+') : ''} ${side2})`, cx - displayW/2 - 40, cy, T_ORANGE, '16px', true);
    }

    private drawCompletingSquare(cx: number, cy: number, eq: {a:number, b:number, c:number}, activeVal: number) {
        const s = 120;
        // Central square x^2
        this.glowGfx.fillStyle(LINE_BLUE, 0.15);
        this.glowGfx.fillRoundedRect(cx - s/2 - 4, cy - s/2 - 4, s+8, s+8, 8);
        this.mainGfx.fillStyle(0x1E3A8A, 0.6);
        this.mainGfx.lineStyle(2, LINE_BLUE, 1);
        this.mainGfx.fillRoundedRect(cx - s/2, cy - s/2, s, s, 4);
        this.mainGfx.strokeRoundedRect(cx - s/2, cy - s/2, s, s, 4);
        this.createLabel('sq_x2', 'x²', cx, cy, T_WHITE, '20px', true);

        // Right rectangle (bx/2)
        const bHalf = Math.abs(eq.b) / 2;
        const rectW = 36;
        this.mainGfx.fillStyle(0x1E3A8A, 0.4);
        this.mainGfx.lineStyle(2, LINE_ORANGE, 0.8);
        this.mainGfx.fillRoundedRect(cx + s/2 + 8, cy - s/2, rectW, s, 4);
        this.mainGfx.strokeRoundedRect(cx + s/2 + 8, cy - s/2, rectW, s, 4);
        this.createLabel('rect_r', `${bHalf}x`, cx + s/2 + 8 + rectW/2, cy, T_ORANGE, '16px', true);

        // Bottom rectangle (bx/2)
        this.mainGfx.fillRoundedRect(cx - s/2, cy + s/2 + 8, s, rectW, 4);
        this.mainGfx.strokeRoundedRect(cx - s/2, cy + s/2 + 8, s, rectW, 4);
        this.createLabel('rect_b', `${bHalf}x`, cx, cy + s/2 + 8 + rectW/2, T_ORANGE, '16px', true);

        // The missing corner piece to "complete the square"
        let cornerOpacity = 0.2;
        let cornerColor = 0x475569;
        const targetVal = this.levelSpec?.correctAnswer || (bHalf * bHalf);
        if (activeVal > 0) {
            cornerOpacity = 0.8;
            if (Math.abs(activeVal - targetVal) < 0.1) cornerColor = LINE_GREEN;
            else cornerColor = 0xF43F5E;
        }

        if (activeVal > 0) {
            this.glowGfx.fillStyle(cornerColor, 0.3);
            this.glowGfx.fillRoundedRect(cx + s/2 + 8 - 4, cy + s/2 + 8 - 4, rectW + 8, rectW + 8, 8);
        }

        this.mainGfx.fillStyle(cornerColor, cornerOpacity);
        this.mainGfx.lineStyle(2, cornerColor, 0.9);
        this.mainGfx.fillRoundedRect(cx + s/2 + 8, cy + s/2 + 8, rectW, rectW, 4);
        this.mainGfx.strokeRoundedRect(cx + s/2 + 8, cy + s/2 + 8, rectW, rectW, 4);
        
        if (activeVal > 0) {
            this.createLabel('corner', `+${activeVal}`, cx + s/2 + 8 + rectW/2, cy + s/2 + 8 + rectW/2, T_WHITE, '16px', true);
        } else {
            this.createLabel('corner', `?`, cx + s/2 + 8 + rectW/2, cy + s/2 + 8 + rectW/2, T_WHITE, '20px', true);
        }
    }

    private drawWordProblem(cx: number, cy: number, eq: {a:number, b:number, c:number}, activeVal: number) {
        // Generic visual for word problems
        this.glowGfx.fillStyle(LINE_BLUE, 0.15);
        this.glowGfx.fillCircle(cx, cy, 110);
        this.glowGfx.fillCircle(cx, cy, 140);

        this.mainGfx.fillStyle(0x1E3A8A, 0.5);
        this.mainGfx.lineStyle(3, LINE_BLUE, 0.9);
        this.mainGfx.fillCircle(cx, cy, 100);
        this.mainGfx.strokeCircle(cx, cy, 100);
        
        this.createLabel('wp_eq', `${eq.a}x² ${eq.b >= 0 ? '+' : ''}${eq.b}x ${eq.c >= 0 ? '+' : ''}${eq.c} = 0`, cx, cy - 25, T_WHITE, '20px', true);
        if (activeVal > 0) {
            this.createLabel('wp_ans', `x = ${activeVal}`, cx, cy + 25, T_GREEN, '22px', true);
        }
    }
}
