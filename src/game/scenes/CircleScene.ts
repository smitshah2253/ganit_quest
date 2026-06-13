import Phaser, { Scene, GameObjects } from 'phaser';
import { EventBus } from '../EventBus';
import { getLevelSpec } from '../../data/levelSpecs';
import type { LevelSpecification } from '../../data/levelSpecs';
import { soundManager } from '../SoundManager';

/**
 * CircleScene — interactive visual models for Chapter 10: Circles (Class X)
 *
 * World 1 (lvl-circle-01..06) — Circle & Tangent Foundations
 * World 2 (lvl-circle-07..12) — Radius & Tangent Mechanics
 * World 3 (lvl-circle-13..18) — Equal Tangent Systems
 * World 4 (lvl-circle-19..24) — Circle Construction
 * World 5 (lvl-circle-25..30) — Orbital Mastery
 */
export class CircleScene extends Scene {
    private levelSpec: LevelSpecification | null = null;
    private isLevelActive: boolean = false;

    // Graphics layers
    private bg!: GameObjects.Graphics;      // Dot-grid background
    private main!: GameObjects.Graphics;    // Geometry contours
    private glow!: GameObjects.Graphics;    // Glowing laser beams
    private overlay!: GameObjects.Graphics; // Visual feedback flashes

    // Interactive element (e.g. angle slider equivalent driven by drag or input)
    private sliderHandle!: GameObjects.Arc;

    // Live state
    private currentInputVal: number = 0;   // Live typed value from React
    private rotationOffset: number = 0;    // Slider dragging angle
    private lastSnap: number = -1;

    // Text labels pool
    private labels: Record<string, GameObjects.Text> = {};

    // HUD Title overlays
    private titleText!: GameObjects.Text;
    private statusText!: GameObjects.Text;
    private formulaText!: GameObjects.Text;

    constructor() {
        super('CircleScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#ecf2f7');

        this.bg = this.add.graphics();
        this.main = this.add.graphics();
        this.glow = this.add.graphics();
        this.overlay = this.add.graphics().setAlpha(0);

        // Title and Subtitle Headers
        this.titleText = this.add.text(22, 18, 'Orbital Geometry Nexus', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px', color: '#475569', fontStyle: 'bold'
        });
        this.statusText = this.add.text(22, 38, 'Load a level to calibrate shields...', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px', color: '#06b6d4', fontStyle: 'bold'
        });

        // Formula Footer
        this.formulaText = this.add.text(22, this.cameras.main.height - 28, '', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px', color: '#0f172a', fontStyle: 'bold',
            backgroundColor: '#ffffffd9',
            padding: { x: 8, y: 4 }
        }).setOrigin(0, 1);

        // Slider Handle (for manual rotation aim in World 1)
        this.sliderHandle = this.add.circle(0, 0, 11, 0x06b6d4, 1.0)
            .setStrokeStyle(3, 0xffffff)
            .setVisible(false);
        
        // Set interactive hit zone centered at (0, 0) with a 40px radius (80px diameter) for touch usability
        this.sliderHandle.setInteractive(new Phaser.Geom.Circle(0, 0, 40), Phaser.Geom.Circle.Contains);
        this.input.setDraggable(this.sliderHandle);

        this.input.on('drag', (_ptr: any, _go: any, dragX: number, dragY: number) => {
            this.onSliderDrag(dragX, dragY);
        });

        // ── Event listeners ──────────────────────────────────────────
        const onLoadLevel = (data: any) => {
            if (!this.scene?.systems) return;
            if (!data.id.startsWith('lvl-circle-')) {
                this.isLevelActive = false;
                this.scene.start('LevelScene');
                return;
            }
            this.levelSpec = getLevelSpec(data.id, data);
            this.isLevelActive = true;
            this.currentInputVal = 0;
            this.rotationOffset = 0;
            this.lastSnap = -1;

            this.titleText.setText(`Ch 10 – Circles: ${data.title ?? data.id}`);
            this.statusText.setText(data.concept ?? '');
            if (this.levelSpec) {
                // Ensure pure general formula is displayed to prevent answer leaks!
                this.formulaText.setText(this.levelSpec.formulaDisplay ?? '');
            }
            this.formulaText.setPosition(22, this.cameras.main.height - 28);

            this.resetLabels();
            this.updateSliderVisibility();
            this.redraw();

            // Saffron pulse zoom effect
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
            // Map the last filled entry or first entry to live visual rendering
            let activeInput = '';
            for (let i = d.inputs.length - 1; i >= 0; i--) {
                if (d.inputs[i] && d.inputs[i].trim() !== '') {
                    activeInput = d.inputs[i];
                    break;
                }
            }
            if (activeInput !== '') {
                onUserInput({ value: activeInput, levelId: d.levelId });
            }
        };

        const onCorrect = () => this.flashOverlay(0x10b981);
        const onWrong = () => this.flashOverlay(0xef4444);

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
        };
        this.events.once('shutdown', cleanup);
        this.events.once('destroy', cleanup);

        this.scale.on('resize', (gs: Phaser.Structs.Size) => {
            this.cameras.main.setSize(gs.width, gs.height);
            this.formulaText.setPosition(22, gs.height - 28);
            if (this.isLevelActive) this.redraw();
        });

        EventBus.emit('game-ready');
    }

    update() {
        if (this.isLevelActive) this.redraw();
    }

    // ─────────────────────────────────────────────────────────────────
    // SLIDER / INTERACTIVE DRAG HANDLE (Rotating Laser Aiming)
    // ─────────────────────────────────────────────────────────────────
    private onSliderDrag(dragX: number, dragY: number) {
        if (!this.isLevelActive || !this.levelSpec) return;
        const world = this.worldNumber();
        if (world !== 1) return;

        const { cx, cy } = this.baseLayout();
        
        // Emitter location in level 1/3
        const id = this.levelSpec.id;
        let emitX = cx - 180, emitY = cy;
        if (id === 'lvl-circle-03') { emitX = cx; emitY = cy - 160; }

        // Find angle between emitter and drag point
        const angleRad = Math.atan2(dragY - emitY, dragX - emitX);
        let angleDeg = Math.round(Phaser.Math.RadToDeg(angleRad));

        // Normalize depending on level direction
        if (id === 'lvl-circle-01') {
            // Emitter at left (-180, 0) aiming right. Deflection from horizontal (0° is straight right).
            // Tangent lies at roughly -30° (upward tangent) or 30° (downward tangent)
            // Let's constrain angle to +/- 60°
            angleDeg = Phaser.Math.Clamp(angleDeg, -60, 60);
            this.rotationOffset = angleDeg;
            const positiveVal = Math.abs(angleDeg);

            // Magnetic snap to exact correct angle (30°)
            if (Math.abs(positiveVal - 30) < 1.8 && this.lastSnap !== 30) {
                this.lastSnap = 30;
                soundManager.playSnap();
                this.tweens.add({ targets: this.sliderHandle, scaleX: 1.5, scaleY: 1.5, duration: 80, yoyo: true });
                this.rotationOffset = angleDeg < 0 ? -30 : 30;
            }
            EventBus.emit('user-input-changed', { value: String(Math.abs(this.rotationOffset)), levelId: this.levelSpec.id });
        } else if (id === 'lvl-circle-03') {
            // Emitter at top (0, -160) aiming down. Center line is straight down (90°).
            // Tangent is at 90 - 30 = 60° or 90 + 30 = 120°.
            // Deflection angle is absolute offset from center line.
            // Let's constrain to 45° - 135°
            angleDeg = Phaser.Math.Clamp(angleDeg, 45, 135);
            const deflection = Math.abs(angleDeg - 90);
            this.rotationOffset = angleDeg;

            // Snap to 30° deflection (which is 60° or 120° in radial coordinates)
            if (Math.abs(deflection - 30) < 1.8 && this.lastSnap !== 30) {
                this.lastSnap = 30;
                soundManager.playSnap();
                this.tweens.add({ targets: this.sliderHandle, scaleX: 1.5, scaleY: 1.5, duration: 80, yoyo: true });
                this.rotationOffset = angleDeg < 90 ? 60 : 120;
            }
            EventBus.emit('user-input-changed', { value: String(Math.abs(this.rotationOffset - 90)), levelId: this.levelSpec.id });
        }
    }

    private syncInputToVisual(v: number) {
        if (!this.levelSpec) return;
        const id = this.levelSpec.id;

        if (id === 'lvl-circle-01') {
            // Update rotationOffset from typed input
            this.rotationOffset = Phaser.Math.Clamp(v, -60, 60);
        } else if (id === 'lvl-circle-03') {
            // Update rotationOffset from typed input (map to deflection from 90°)
            this.rotationOffset = 90 + Phaser.Math.Clamp(v, -60, 60);
        }
    }

    private updateSliderVisibility() {
        if (!this.levelSpec) return;
        const id = this.levelSpec.id;
        const { cx, cy } = this.baseLayout();

        if (id === 'lvl-circle-01') {
            const emitX = cx - 180, emitY = cy;
            const r = 160;
            const rad = Phaser.Math.DegToRad(this.rotationOffset);
            this.sliderHandle.setPosition(emitX + r * Math.cos(rad), emitY + r * Math.sin(rad)).setVisible(true);
        } else if (id === 'lvl-circle-03') {
            const emitX = cx, emitY = cy - 160;
            const r = 160;
            const rad = Phaser.Math.DegToRad(this.rotationOffset === 0 ? 90 : this.rotationOffset);
            this.sliderHandle.setPosition(emitX + r * Math.cos(rad), emitY + r * Math.sin(rad)).setVisible(true);
        } else {
            this.sliderHandle.setVisible(false);
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
            case 2: this.drawWorld2_Mechanics();    break;
            case 3: this.drawWorld3_EqualTangents(); break;
            case 4: this.drawWorld4_Construction();  break;
            case 5: this.drawWorld5_Mastery();       break;
        }

        // Keep interactive drag handles in sync with scaling/moving coordinates
        this.updateSliderVisibility();
    }

    // Dot-Grid procedural background
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

    // ═════════════════════════════════════════════════════════════════
    // WORLD 1 — Circle & Tangent Foundations
    // ═════════════════════════════════════════════════════════════════
    private drawWorld1_Foundations() {
        const id = this.levelSpec!.id;
        const { cx, cy } = this.baseLayout();

        // 1. Draw central storage core
        const rCore = 80;
        let coreColor = 0x06b6d4; // Cyan core
        let contactGlow = false;

        // Visual success locks
        if (id === 'lvl-circle-01' && Math.abs(Math.abs(this.rotationOffset) - 30) < 1.0) {
            coreColor = 0x10b981; // Green lock
            contactGlow = true;
        }
        if (id === 'lvl-circle-03' && Math.abs(Math.abs(this.rotationOffset - 90) - 30) < 1.0) {
            coreColor = 0x10b981; // Green lock
            contactGlow = true;
        }
        if (id === 'lvl-circle-02' && this.currentInputVal === 2) {
            coreColor = 0x10b981;
        }
        if (id === 'lvl-circle-04' && this.currentInputVal === 120) {
            coreColor = 0x10b981;
        }
        if (id === 'lvl-circle-05' && this.currentInputVal === 8) {
            coreColor = 0x10b981;
            contactGlow = true;
        }

        this.drawCore(cx, cy, rCore, coreColor);

        // --- SPECIFIC LEVEL RENDERERS ---
        if (id === 'lvl-circle-01') {
            const emitX = cx - 180, emitY = cy;

            // Draw Emitter station P
            this.drawEmitter(emitX, emitY, 0x06b6d4);
            this.lbl('P (Emitter)', emitX - 10, emitY - 20, '#0891b2');

            // Draw center line OP
            this.main.lineStyle(1.5, 0x64748b, 0.5);
            this.main.lineBetween(emitX, emitY, cx, cy);

            // Draw rotating laser beam
            const beamLen = 280;
            const rad = Phaser.Math.DegToRad(this.rotationOffset);
            const bx = emitX + beamLen * Math.cos(rad);
            const by = emitY + beamLen * Math.sin(rad);

            this.drawLaser(emitX, emitY, bx, by, contactGlow ? 0x10b981 : 0xf97316);

            // Draw contact point helper
            if (contactGlow) {
                // Point of contact T is at angle +/- 60 degrees from emitter.
                const sign = this.rotationOffset < 0 ? -1 : 1;
                const tx = cx - rCore * Math.cos(Phaser.Math.DegToRad(60));
                const ty = cy + sign * rCore * Math.sin(Phaser.Math.DegToRad(60));
                
                // Draw perpendicular radius OT
                this.main.lineStyle(2, 0x10b981, 0.85);
                this.main.lineBetween(cx, cy, tx, ty);
                this.lbl('O', cx - 12, cy - 12, '#475569');
                this.lbl('T', tx + (tx > cx ? 12 : -12), ty + (ty > cy ? 12 : -12), '#10b981');
                this.main.fillStyle(0x10b981, 1);
                this.main.fillCircle(tx, ty, 6);
                
                // Perpendicular angle indicator
                this.drawRightAngleMarkerForPoints(cx, cy, tx, ty, emitX, emitY, 12);
            }
            this.setLbl('instruct', 'Drag the handle or enter angle to make beam tangent!', cx, cy + rCore + 40, '#64748b', '11px');
        }

        else if (id === 'lvl-circle-02') {
            // Three trajectories
            const emitX = cx - 180, emitY = cy + 40;
            this.drawEmitter(emitX, emitY, 0x475569);
            this.lbl('P', emitX - 10, emitY - 20, '#475569');

            // Line 1: Secant (cuts circular core)
            this.main.lineStyle(2, 0xef4444, 0.85);
            this.main.lineBetween(emitX, emitY, cx + 50, cy - 100);
            this.lbl('Beam 1 (Secant)', cx - 80, cy - 35, '#ef4444', '10px');

            // Line 2: Tangent (touches circle at exactly one point)
            const tangentColor = this.currentInputVal === 2 ? 0x10b981 : 0x06b6d4;
            this.drawLaser(emitX, emitY, cx + 180, cy - 56, tangentColor);
            this.lbl('Beam 2 (Tangent)', cx - 20, cy - 80, this.cStr(tangentColor), '11px');

            // Line 3: Misses completely
            this.main.lineStyle(2, 0x64748b, 0.6);
            this.main.lineBetween(emitX, emitY, cx + 180, cy - 150);
            this.lbl('Beam 3', cx + 30, cy - 120, '#64748b', '10px');
        }

        else if (id === 'lvl-circle-03') {
            // Emitter at top
            const emitX = cx, emitY = cy - 160;
            this.drawEmitter(emitX, emitY, 0x06b6d4);
            this.lbl('P (Transmitter)', emitX + 15, emitY - 15, '#0891b2');

            // Center line straight down
            this.main.lineStyle(1.5, 0x64748b, 0.4);
            this.main.lineBetween(emitX, emitY, cx, cy);

            const rad = Phaser.Math.DegToRad(this.rotationOffset === 0 ? 90 : this.rotationOffset);
            const beamLen = 260;
            const bx = emitX + beamLen * Math.cos(rad);
            const by = emitY + beamLen * Math.sin(rad);

            this.drawLaser(emitX, emitY, bx, by, contactGlow ? 0x10b981 : 0xf97316);

            if (contactGlow) {
                const sign = this.rotationOffset < 90 ? -1 : 1;
                // Contact point T is 60° deflection from straight down in coordinates (radial is 90° +/- 30°)
                const contactAngle = this.rotationOffset < 90 ? 150 : 30; // 150° or 30° radial
                const tx = cx + rCore * Math.cos(Phaser.Math.DegToRad(contactAngle));
                const ty = cy + rCore * Math.sin(Phaser.Math.DegToRad(contactAngle));

                this.main.lineStyle(2, 0x10b981, 0.85);
                this.main.lineBetween(cx, cy, tx, ty);
                this.lbl('T', tx + sign * 14, ty - 12, '#10b981');
                this.main.fillStyle(0x10b981, 1);
                this.main.fillCircle(tx, ty, 6);

                this.drawRightAngleMarkerForPoints(cx, cy, tx, ty, emitX, emitY, 12);
            }
        }

        else if (id === 'lvl-circle-04') {
            // Refueling dock bridge
            const emitX = cx - 180, emitY = cy;
            this.drawEmitter(emitX, emitY, 0x0891b2);
            this.lbl('Refueling Dock P', emitX - 15, emitY - 20, '#0891b2');

            // Tangent contact point T (r = 80, OP = 180. cos(36.87°) => x=50, y=62)
            // By Pythagoras: 180^2 - 80^2 = 32400 - 6400 = 26000. sqrt(26000) = 161.
            const tx = cx - (80 * 80 / 180);
            const ty = cy - 80 * Math.sqrt(1 - (80/180)*(80/180));

            // Bridge path
            const bridgeCol = this.currentInputVal === 120 ? 0x10b981 : 0x3b82f6;
            this.drawLaser(emitX, emitY, tx, ty, bridgeCol);

            // Radius OT
            this.main.lineStyle(2, 0x475569, 0.7);
            this.main.lineBetween(cx, cy, tx, ty);

            // Perpendicular sign
            this.drawRightAngleMarkerForPoints(cx, cy, tx, ty, emitX, emitY, 12);

            this.lbl('OT = 90 km', (cx + tx) / 2 + 10, (cy + ty) / 2 - 15, '#475569', '11px');
            this.lbl('OP = 150 km', cx - 90, cy + 18, '#0891b2', '11px');
            this.lbl('Bridge PT = ?', (emitX + tx) / 2 - 20, (emitY + ty) / 2 - 20, this.cStr(bridgeCol), '12px');
        }

        else if (id === 'lvl-circle-05') {
            // Safety threshold reactor
            const inputD = this.currentInputVal > 0 ? Phaser.Math.Clamp(this.currentInputVal, 2, 16) : 4;
            
            // Render the safety margin core
            const visualD = inputD * 10; // Scale units to pixels
            const beamY = cy - visualD;

            // Draw laser line horizontally
            this.drawLaser(cx - 200, beamY, cx + 200, beamY, contactGlow ? 0x10b981 : 0xef4444);

            if (contactGlow) {
                // Perpendicular radius straight up
                this.main.lineStyle(2, 0x10b981, 0.9);
                this.main.lineBetween(cx, cy, cx, cy - rCore);
                this.main.fillStyle(0x10b981, 1);
                this.main.fillCircle(cx, cy - rCore, 6);
                this.lbl('T', cx + 12, cy - rCore - 12, '#10b981');
                this.drawRightAngleMarkerForPoints(cx, cy, cx, cy - rCore, cx - 200, cy - rCore, 12);
            }

            this.lbl(`Beam Distance d = ${inputD}`, cx - 110, beamY - 14, contactGlow ? '#10b981' : '#ef4444', '12px');
            this.lbl('Core Radius r = 8', cx, cy - 20, '#475569', '12px');
        }

        else if (id === 'lvl-circle-06') {
            // Conceptual manual diagram
            const tx = cx;
            const ty = cy - rCore;
            this.main.lineStyle(2.5, 0x10b981, 1.0);
            this.main.lineBetween(cx - 150, ty, cx + 150, ty);
            this.main.fillStyle(0x10b981, 1);
            this.main.fillCircle(tx, ty, 6);

            this.main.lineStyle(1.5, 0x64748b, 0.6);
            this.main.lineBetween(cx, cy, tx, ty);

            this.lbl('Tangent Line', cx - 90, ty - 16, '#10b981', '12px');
            this.lbl('Point of Contact (T)', tx, ty - 16, '#10b981', '11px');
            this.lbl('Radius (OT) ⊥ Tangent', cx + 16, (cy + ty) / 2, '#475569', '11px');
        }
    }

    // ═════════════════════════════════════════════════════════════════
    // WORLD 2 — Radius & Tangent Mechanics
    // ═════════════════════════════════════════════════════════════════
    private drawWorld2_Mechanics() {
        const id = this.levelSpec!.id;
        const { cx, cy } = this.baseLayout();
        const rCore = 80;

        let locked = false;
        if (id === 'lvl-circle-07' && this.currentInputVal === 90) locked = true;
        if (id === 'lvl-circle-08' && this.currentInputVal === 90) locked = true;
        if (id === 'lvl-circle-09' && this.currentInputVal === 120) locked = true;
        if (id === 'lvl-circle-10' && this.currentInputVal === 25) locked = true;
        if (id === 'lvl-circle-11' && this.currentInputVal === 15) locked = true;
        if (id === 'lvl-circle-12' && this.currentInputVal === 10) locked = true;

        this.drawCore(cx, cy, rCore, locked ? 0x10b981 : 0x06b6d4);

        // Standard layout
        const tx = cx;
        const ty = cy - rCore;

        if (id === 'lvl-circle-07' || id === 'lvl-circle-08') {
            const angleVal = this.currentInputVal > 0 ? Phaser.Math.Clamp(this.currentInputVal, 45, 120) : 80;
            const laserRad = Phaser.Math.DegToRad(90 - angleVal);
            
            // Draw tangent line rotated by error
            const lx1 = tx - 140 * Math.cos(laserRad);
            const ly1 = ty + 140 * Math.sin(laserRad);
            const lx2 = tx + 140 * Math.cos(laserRad);
            const ly2 = ty - 140 * Math.sin(laserRad);

            this.drawLaser(lx1, ly1, lx2, ly2, locked ? 0x10b981 : 0xf97316);

            // Radius OT
            this.main.lineStyle(2.5, 0x475569, 0.85);
            this.main.lineBetween(cx, cy, tx, ty);
            this.lbl('OT (Radius)', cx + 15, cy - 40, '#475569', '11px');

            if (locked) {
                this.drawRightAngleMarkerForPoints(cx, cy, tx, ty, tx - 140, ty, 12);
            }

            this.lbl(`Angle = ${angleVal}°`, tx - 60, ty - 20, locked ? '#10b981' : '#f97316', '12px');
        }

        else if (id === 'lvl-circle-09') {
            const extX = cx - 180;
            this.drawEmitter(extX, ty, 0x06b6d4);
            this.lbl('P', extX - 10, ty - 15, '#0891b2');

            // Tangent PT
            const laserCol = locked ? 0x10b981 : 0x3b82f6;
            this.drawLaser(extX, ty, tx, ty, laserCol);
            
            // Radius OT
            this.main.lineStyle(2, 0x475569, 0.7);
            this.main.lineBetween(cx, cy, tx, ty);

            // Hypotenuse OP
            this.main.lineStyle(1.5, 0x06b6d4, 0.55);
            this.main.lineBetween(cx, cy, extX, ty);

            this.drawRightAngleMarkerForPoints(cx, cy, tx, ty, extX, ty, 12);

            this.lbl('Radius r = 50 m', cx + 15, cy - 40, '#475569', '11px');
            this.lbl('OP = 130 m', (cx + extX)/2, (cy + ty)/2 + 18, '#0891b2', '11px');
            this.lbl('Tangent PT = ?', (extX + tx)/2, ty - 16, this.cStr(laserCol), '12px');
        }

        else if (id === 'lvl-circle-10') {
            const extX = cx - 180;
            this.drawEmitter(extX, ty, 0x06b6d4);
            this.lbl('P', extX - 10, ty - 15, '#0891b2');

            // Docking path PT
            this.drawLaser(extX, ty, tx, ty, locked ? 0x10b981 : 0x3b82f6);

            // Radius OT
            this.main.lineStyle(2, 0x475569, 0.7);
            this.main.lineBetween(cx, cy, tx, ty);

            // Hypotenuse OP (Distance to center = ?)
            const hypCol = locked ? 0x10b981 : 0x6366f1;
            this.main.lineStyle(2.5, hypCol, 0.85);
            this.main.lineBetween(cx, cy, extX, ty);

            this.drawRightAngleMarkerForPoints(cx, cy, tx, ty, extX, ty, 12);

            this.lbl('Radius r = 7 km', cx + 15, cy - 40, '#475569', '11px');
            this.lbl('PT = 24 km', (extX + tx)/2, ty - 16, '#0891b2', '11px');
            this.lbl('OP = ?', (cx + extX)/2, (cy + ty)/2 + 18, this.cStr(hypCol), '12px');
        }

        else if (id === 'lvl-circle-11') {
            const extX = cx - 180;
            this.drawEmitter(extX, ty, 0x06b6d4);
            this.lbl('P', extX - 10, ty - 15, '#0891b2');

            this.drawLaser(extX, ty, tx, ty, locked ? 0x10b981 : 0x3b82f6);
            this.main.lineStyle(2, 0x475569, 0.7);
            this.main.lineBetween(cx, cy, tx, ty);
            this.main.lineStyle(1.5, 0x06b6d4, 0.55);
            this.main.lineBetween(cx, cy, extX, ty);

            this.drawRightAngleMarkerForPoints(cx, cy, tx, ty, extX, ty, 12);

            this.lbl('Radius r = 8', cx + 15, cy - 40, '#475569', '11px');
            this.lbl('OP = 17', (cx + extX)/2, (cy + ty)/2 + 18, '#0891b2', '11px');
            this.lbl('Beam PT = ?', (extX + tx)/2, ty - 16, locked ? '#10b981' : '#3b82f6', '12px');
        }

        else if (id === 'lvl-circle-12') {
            // General theorem proof illustration
            this.drawLaser(cx - 150, ty, cx + 150, ty, 0x10b981);
            this.main.lineStyle(2.5, 0x475569, 0.85);
            this.main.lineBetween(cx, cy, tx, ty);
            this.drawRightAngleMarkerForPoints(cx, cy, tx, ty, cx - 150, ty, 12);

            this.lbl('T (Point of Contact)', tx, ty - 16, '#10b981', '11px');
            this.lbl('Radius (OT) ⊥ Tangent (PT)', cx + 15, cy - 40, '#475569', '11px');
        }
    }

    // ═════════════════════════════════════════════════════════════════
    // WORLD 3 — Equal Tangent Systems
    // ═════════════════════════════════════════════════════════════════
    private drawWorld3_EqualTangents() {
        const id = this.levelSpec!.id;
        const { cx, cy } = this.baseLayout();
        const rCore = 70;

        let locked = false;
        if (id === 'lvl-circle-13' && this.currentInputVal === 15) locked = true;
        if (id === 'lvl-circle-14' && this.currentInputVal === 6) locked = true;
        if (id === 'lvl-circle-15' && this.currentInputVal === 12) locked = true;
        if (id === 'lvl-circle-16' && this.currentInputVal === 3) locked = true;
        if (id === 'lvl-circle-17' && this.currentInputVal === 14) locked = true;
        if (id === 'lvl-circle-18' && this.currentInputVal === 13) locked = true;

        this.drawCore(cx, cy, rCore, locked ? 0x10b981 : 0x06b6d4);

        if (id === 'lvl-circle-13' || id === 'lvl-circle-14' || id === 'lvl-circle-15') {
            const extX = cx - 180, extY = cy;
            this.drawEmitter(extX, extY, 0x06b6d4);
            this.lbl('P', extX - 10, extY - 15, '#0891b2');

            // Tangent contact points A and B
            // In right △OAP, OP = 180, OA = 70. AM = 70 * 70 / 180.
            const txA = cx - (70 * 70 / 180);
            const tyA = cy - 70 * Math.sqrt(1 - (70/180)*(70/180));
            const txB = txA;
            const tyB = cy + 70 * Math.sqrt(1 - (70/180)*(70/180));

            // Equal tangents PA and PB
            const laserCol = locked ? 0x10b981 : 0x06b6d4;
            this.drawLaser(extX, extY, txA, tyA, laserCol);
            this.drawLaser(extX, extY, txB, tyB, laserCol);

            // Radii OA and OB
            this.main.lineStyle(1.5, 0x475569, 0.6);
            this.main.lineBetween(cx, cy, txA, tyA);
            this.main.lineBetween(cx, cy, txB, tyB);

            this.lbl('A', txA, tyA - 12, '#475569');
            this.lbl('B', txB, tyB + 12, '#475569');

            if (id === 'lvl-circle-13') {
                this.lbl('PA = 15 m', (extX + txA)/2, (extY + tyA)/2 - 16, '#0891b2', '12px');
                this.lbl('PB = ?', (extX + txB)/2, (extY + tyB)/2 + 18, this.cStr(laserCol), '12px');
            } else if (id === 'lvl-circle-14') {
                this.lbl('PA = 2x + 5', (extX + txA)/2, (extY + tyA)/2 - 16, '#0891b2', '12px');
                this.lbl('PB = 17', (extX + txB)/2, (extY + tyB)/2 + 18, '#475569', '12px');
                if (locked) {
                    this.setLbl('bal_lbl', 'Balanced! 2(6)+5 = 17 ✓', cx, cy + rCore + 40, '#10b981', '12px');
                }
            } else if (id === 'lvl-circle-15') {
                this.lbl('PA = 3y - 4', (extX + txA)/2, (extY + tyA)/2 - 16, '#0891b2', '12px');
                this.lbl('PB = 2y + 8', (extX + txB)/2, (extY + tyB)/2 + 18, '#475569', '12px');
                if (locked) {
                    this.setLbl('bal_lbl', 'Calibrated! PA = PB = 32 ✓', cx, cy + rCore + 40, '#10b981', '12px');
                }
            }
        }

        else if (id === 'lvl-circle-16') {
            // Circumscribed Quadrilateral Frame
            // Radius 70. Quadrilateral boundary ABCD enclosing the circle.
            const ax = cx - 110, ay = cy - 90;
            const bx = cx + 120, by = cy - 80;
            const cx_ = cx + 110, cy_ = cy + 100;
            const dx = cx - 130, dy = cy + 90;

            this.main.lineStyle(3, locked ? 0x10b981 : 0x3b82f6, 1.0);
            this.main.beginPath();
            this.main.moveTo(ax, ay);
            this.main.lineTo(bx, by);
            this.main.lineTo(cx_, cy_);
            this.main.lineTo(dx, dy);
            this.main.closePath();
            this.main.strokePath();

            // Draw vertex dots
            const color = locked ? 0x10b981 : 0x1d4ed8;
            [{x: ax, y: ay, l: 'A'}, {x: bx, y: by, l: 'B'}, {x: cx_, y: cy_, l: 'C'}, {x: dx, y: dy, l: 'D'}].forEach(v => {
                this.main.fillStyle(color, 1);
                this.main.fillCircle(v.x, v.y, 5);
                this.lbl(v.l, v.x + (v.x > cx ? 12 : -12), v.y + (v.y > cy ? 12 : -12), '#475569');
            });

            this.lbl('AB = 6', (ax + bx)/2, (ay + by)/2 - 14, '#475569', '12px');
            this.lbl('BC = 7', (bx + cx_)/2 + 20, (by + cy_)/2, '#475569', '12px');
            this.lbl('CD = 4', (cx_ + dx)/2, (cy_ + dy)/2 + 14, '#475569', '12px');
            this.lbl('AD = ?', (ax + dx)/2 - 20, (ay + dy)/2, locked ? '#10b981' : '#dc2626', '12px');

            if (locked) {
                this.setLbl('quad_thm', 'Theorem: AB + CD = BC + AD (6 + 4 = 7 + 3) ✓', cx, cy + rCore + 50, '#10b981', '11px');
            }
        }

        else if (id === 'lvl-circle-17') {
            // Triple Tangent Network (Chain of circles)
            // Left Circle: centered at cx - 110. Right Circle: centered at cx + 110.
            this.main.clear();
            
            // Draw two circles
            this.drawCore(cx - 100, cy, 50, 0x475569);
            this.drawCore(cx + 100, cy, 50, 0x475569);

            // External anchor P
            const extX = cx, extY = cy + 120;
            this.drawEmitter(extX, extY, 0x06b6d4);
            this.lbl('P', extX, extY + 18, '#0891b2');

            // Tangents PA, PB to circle 1, PB, PC to circle 2
            const txA = cx - 130, tyA = cy + 30;
            const txB = cx, tyB = cy - 50;
            const txC = cx + 130, tyC = cy + 30;

            const tangentCol = locked ? 0x10b981 : 0x06b6d4;
            this.drawLaser(extX, extY, txA, tyA, tangentCol);
            this.drawLaser(extX, extY, txB, tyB, tangentCol);
            this.drawLaser(extX, extY, txC, tyC, tangentCol);

            this.lbl('A', txA - 10, tyA - 10, '#475569');
            this.lbl('B', txB, tyB - 14, '#475569');
            this.lbl('C', txC + 10, tyC - 10, '#475569');

            this.lbl('PA = 14', (extX + txA)/2 - 12, (extY + tyA)/2, '#475569', '11px');
            this.lbl('PB', (extX + txB)/2 + 10, (extY + tyB)/2, '#475569', '11px');
            this.lbl('PC = ?', (extX + txC)/2 + 12, (extY + tyC)/2, this.cStr(tangentCol), '12px');
        }

        else if (id === 'lvl-circle-18') {
            // General Theorem equal tangents proof illustration
            const extX = cx - 180, extY = cy;
            this.drawEmitter(extX, extY, 0x06b6d4);
            this.lbl('P', extX - 10, extY - 15, '#0891b2');

            const txA = cx - (70 * 70 / 180);
            const tyA = cy - 70 * Math.sqrt(1 - (70/180)*(70/180));
            const txB = txA;
            const tyB = cy + 70 * Math.sqrt(1 - (70/180)*(70/180));

            this.drawLaser(extX, extY, txA, tyA, 0x10b981);
            this.drawLaser(extX, extY, txB, tyB, 0x10b981);

            this.lbl('A', txA, tyA - 12, '#475569');
            this.lbl('B', txB, tyB + 12, '#475569');
            this.lbl('PA = PB', (extX + txA)/2, (extY + tyA)/2 - 16, '#10b981', '12px');
        }
    }

    // ═════════════════════════════════════════════════════════════════
    // WORLD 4 — Circle Construction Challenges
    // ═════════════════════════════════════════════════════════════════
    private drawWorld4_Construction() {
        const id = this.levelSpec!.id;
        const { cx, cy } = this.baseLayout();
        const rCore = 60;

        let locked = false;
        if (id === 'lvl-circle-19' && this.currentInputVal === 42) locked = true;
        if (id === 'lvl-circle-20' && this.currentInputVal === 8) locked = true;
        if (id === 'lvl-circle-21' && this.currentInputVal === 30) locked = true;
        if (id === 'lvl-circle-22' && this.currentInputVal === 7) locked = true;
        if (id === 'lvl-circle-23' && this.currentInputVal === 7) locked = true;
        if (id === 'lvl-circle-24' && this.currentInputVal === 16) locked = true;

        this.drawCore(cx, cy, rCore, locked ? 0x10b981 : 0x06b6d4);

        if (id === 'lvl-circle-19' || id === 'lvl-circle-21' || id === 'lvl-circle-23') {
            // Triangle circumscribing a circle
            // Vertices chosen such that circle of radius 60 is inscribed
            // For lvl-circle-19: r = 4, BD = 6, DC = 8. Tangents = x.
            // visual scale: 15px per unit.
            const scale = 14;
            const r = 4 * scale;
            const x = 7 * scale;
            const bd = 6 * scale;
            const dc = 8 * scale;

            this.main.clear();
            this.drawCore(cx, cy, r, locked ? 0x10b981 : 0x06b6d4);

            // Vertices
            const bx = cx - bd, by = cy + r;
            const cx_ = cx + dc, cy_ = cy + r;
            // Apex A lies directly above circle such that AB = x+6, AC = x+8.
            const ax = cx_ - (dc * 2 * (x+bd)/(bd+dc)); // Derived geometrically
            const ay = cy - r - 1.6*x; // scaled height

            const color = locked ? 0x10b981 : 0x3b82f6;
            this.main.lineStyle(3, color, 1.0);
            this.main.strokeTriangle(ax, ay, bx, by, cx_, cy_);

            [{x: ax, y: ay, l: 'A'}, {x: bx, y: by, l: 'B'}, {x: cx_, y: cy_, l: 'C'}].forEach(v => {
                this.main.fillStyle(color, 1);
                this.main.fillCircle(v.x, v.y, 5);
                this.lbl(v.l, v.x + (v.x > cx ? 12 : -12), v.y + (v.y > cy ? 12 : -12), '#475569');
            });

            // Draw contact points
            this.main.fillStyle(0x10b981, 1);
            this.main.fillCircle(cx, cy + r, 4); // D
            this.lbl('D', cx, cy + r + 14, '#10b981', '10px');

            if (id === 'lvl-circle-19') {
                this.lbl('BD = 6 km', (bx + cx)/2, cy + r + 15, '#475569', '11px');
                this.lbl('DC = 8 km', (cx_ + cx)/2, cy + r + 15, '#475569', '11px');
                this.lbl('Radius r = 4 km', cx, cy - 10, '#0891b2', '11px');
                this.lbl('Perimeter ABC = ?', ax, ay - 24, locked ? '#10b981' : '#dc2626', '12px');
            } else if (id === 'lvl-circle-21') {
                this.lbl('AD = 4', (ax + bx)/2 - 15, (ay + by)/2 - 15, '#475569', '11px');
                this.lbl('BE = 5', (bx + cx_)/2, cy + r + 15, '#475569', '11px');
                this.lbl('CF = 6', (cx_ + ax)/2 + 15, (cy_ + ay)/2 - 15, '#475569', '11px');
                this.lbl('Perimeter = ?', ax, ay - 24, locked ? '#10b981' : '#dc2626', '12px');
            } else if (id === 'lvl-circle-23') {
                this.lbl('AB = 12', (ax + bx)/2 - 25, (ay + by)/2, '#475569', '11px');
                this.lbl('BC = 8', (bx + cx_)/2, cy + r + 15, '#475569', '11px');
                this.lbl('AC = 10', (cx_ + ax)/2 + 25, (cy_ + ay)/2, '#475569', '11px');
                this.lbl('Segment AD = ?', ax - 25, ay + 20, locked ? '#10b981' : '#dc2626', '12px');
            }
        }

        else if (id === 'lvl-circle-20') {
            // Concentric circles
            this.main.clear();
            const rInner = 50;
            const rOuter = 83; // ratio 3:5

            this.drawCore(cx, cy, rOuter, 0x3b82f6, 0.08); // Outer ring
            this.drawCore(cx, cy, rInner, locked ? 0x10b981 : 0x06b6d4, 0.2); // Inner ring

            // Draw tangent chord
            const tangentY = cy - rInner;
            const halfChord = Math.sqrt(rOuter*rOuter - rInner*rInner);
            
            const chordCol = locked ? 0x10b981 : 0xf97316;
            this.drawLaser(cx - halfChord, tangentY, cx + halfChord, tangentY, chordCol);

            // Radius lines R and r
            this.main.lineStyle(2, 0x475569, 0.7);
            this.main.lineBetween(cx, cy, cx, cy - rInner); // r
            this.main.lineStyle(2, 0x3b82f6, 0.7);
            this.main.lineBetween(cx, cy, cx + halfChord, tangentY); // R

            this.lbl('r = 3', cx - 14, cy - 25, '#475569', '11px');
            this.lbl('R = 5', cx + halfChord/2 - 12, cy - rInner/2 + 10, '#3b82f6', '11px');
            this.lbl('Chord = ?', cx, tangentY - 16, this.cStr(chordCol), '12px');
        }

        else if (id === 'lvl-circle-22') {
            // Circumscribed quadrilateral ABCD
            const ax = cx - 100, ay = cy - 80;
            const bx = cx + 110, by = cy - 70;
            const cx_ = cx + 100, cy_ = cy + 90;
            const dx = cx - 120, dy = cy + 80;

            this.main.lineStyle(3, locked ? 0x10b981 : 0x3b82f6, 1.0);
            this.main.beginPath();
            this.main.moveTo(ax, ay);
            this.main.lineTo(bx, by);
            this.main.lineTo(cx_, cy_);
            this.main.lineTo(dx, dy);
            this.main.closePath();
            this.main.strokePath();

            [{x: ax, y: ay, l: 'A'}, {x: bx, y: by, l: 'B'}, {x: cx_, y: cy_, l: 'C'}, {x: dx, y: dy, l: 'D'}].forEach(v => {
                this.main.fillStyle(locked ? 0x10b981 : 0x1d4ed8, 1);
                this.main.fillCircle(v.x, v.y, 5);
                this.lbl(v.l, v.x + (v.x > cx ? 12 : -12), v.y + (v.y > cy ? 12 : -12), '#475569');
            });

            this.lbl('AB = 8', (ax + bx)/2, (ay + by)/2 - 14, '#475569', '11px');
            this.lbl('BC = 10', (bx + cx_)/2 + 20, (by + cy_)/2, '#475569', '11px');
            this.lbl('CD = 9', (cx_ + dx)/2, (cy_ + dy)/2 + 14, '#475569', '11px');
            this.lbl('AD = ?', (ax + dx)/2 - 20, (ay + dy)/2, locked ? '#10b981' : '#dc2626', '12px');
        }

        else if (id === 'lvl-circle-24') {
            // General review illustration showing circumscription
            const rInner = 50;
            const rOuter = 83;
            this.drawCore(cx, cy, rOuter, 0x3b82f6, 0.05);
            this.drawCore(cx, cy, rInner, 0x10b981, 0.15);
            const tangentY = cy - rInner;
            const halfChord = Math.sqrt(rOuter*rOuter - rInner*rInner);
            this.drawLaser(cx - halfChord, tangentY, cx + halfChord, tangentY, 0x10b981);
            this.lbl('Chord touches inner ring at 1 point', cx, tangentY - 16, '#10b981', '11px');
        }
    }

    // ═════════════════════════════════════════════════════════════════
    // WORLD 5 — Orbital Mastery Challenges
    // ═════════════════════════════════════════════════════════════════
    private drawWorld5_Mastery() {
        const id = this.levelSpec!.id;
        const { cx, cy } = this.baseLayout();
        const rCore = 70;

        let locked = false;
        if (id === 'lvl-circle-25' && this.currentInputVal === 12) locked = true;
        if (id === 'lvl-circle-26' && this.currentInputVal === 240) locked = true;
        if (id === 'lvl-circle-27' && Math.abs(this.currentInputVal - 6.67) < 0.1) locked = true;
        if (id === 'lvl-circle-28' && this.currentInputVal === 12) locked = true;
        if (id === 'lvl-circle-29' && this.currentInputVal === 60) locked = true;
        if (id === 'lvl-circle-30' && this.currentInputVal === 90) locked = true;

        this.drawCore(cx, cy, rCore, locked ? 0x10b981 : 0x06b6d4);

        if (id === 'lvl-circle-25') {
            // Two parallel tangents
            this.drawLaser(cx - 140, cy - rCore, cx + 140, cy - rCore, locked ? 0x10b981 : 0xef4444);
            this.drawLaser(cx - 140, cy + rCore, cx + 140, cy + rCore, locked ? 0x10b981 : 0xef4444);

            // Diameter connecting line
            this.main.lineStyle(2, 0x475569, 0.7);
            this.main.lineBetween(cx, cy - rCore, cx, cy + rCore);
            this.main.fillStyle(0x475569, 1);
            this.main.fillCircle(cx, cy, 4);

            this.lbl('Radius r = 6 m', cx + 15, cy - 25, '#475569', '11px');
            this.lbl('Radius r = 6 m', cx + 15, cy + 25, '#475569', '11px');
            this.lbl('Distance between beams = ?', cx - 90, cy, locked ? '#10b981' : '#dc2626', '12px');
        }

        else if (id === 'lvl-circle-26') {
            // Tangent Quadrilateral Area
            const extX = cx - 180, extY = cy;
            this.drawEmitter(extX, extY, 0x06b6d4);
            this.lbl('P', extX - 10, extY - 15, '#0891b2');

            const txA = cx - (70 * 70 / 180);
            const tyA = cy - 70 * Math.sqrt(1 - (70/180)*(70/180));
            const txB = txA;
            const tyB = cy + 70 * Math.sqrt(1 - (70/180)*(70/180));

            // Shade the quadrilateral OAPB
            const quadCol = locked ? 0x10b981 : 0x3b82f6;
            this.main.fillStyle(quadCol, 0.15);
            this.main.beginPath();
            this.main.moveTo(cx, cy);
            this.main.lineTo(txA, tyA);
            this.main.lineTo(extX, extY);
            this.main.lineTo(txB, tyB);
            this.main.closePath();
            this.main.fillPath();

            // Beams and radii
            this.drawLaser(extX, extY, txA, tyA, locked ? 0x10b981 : 0x06b6d4);
            this.drawLaser(extX, extY, txB, tyB, locked ? 0x10b981 : 0x06b6d4);
            this.main.lineStyle(1.8, 0x475569, 0.75);
            this.main.lineBetween(cx, cy, txA, tyA);
            this.main.lineBetween(cx, cy, txB, tyB);

            this.lbl('A', txA, tyA - 12, '#475569');
            this.lbl('B', txB, tyB + 12, '#475569');
            this.lbl('O', cx + 12, cy - 12, '#475569');

            this.lbl('Radius r = 10', (cx + txA)/2 + 15, (cy + tyA)/2 - 10, '#475569', '11px');
            this.lbl('OP = 26', cx - 90, cy + 18, '#0891b2', '11px');
            this.lbl('Area OAPB = ?', cx, cy, this.cStr(quadCol), '12px');
        }

        else if (id === 'lvl-circle-27') {
            // Chord AB and tangents meeting at P
            const scale = 14;
            const r = 5 * scale;
            const chord = 8 * scale;
            const halfChord = chord / 2;
            const om = 3 * scale;

            this.main.clear();
            this.drawCore(cx, cy, r, locked ? 0x10b981 : 0x06b6d4);

            // Vertices
            // Midpoint of chord M is on center line. Let's make it vertical chord.
            const mx = cx - om;
            const ax = mx, ay = cy - halfChord;
            const bx = mx, by = cy + halfChord;

            // Chord AB
            this.main.lineStyle(2, 0x475569, 0.85);
            this.main.lineBetween(ax, ay, bx, by);
            this.lbl('A', ax - 10, ay - 10, '#475569');
            this.lbl('B', bx - 10, by + 10, '#475569');

            // Tangents intersecting at P (extX = cx - (r*r/om))
            const extX = cx - (r * r / om);
            const extY = cy;
            this.drawEmitter(extX, extY, 0x06b6d4);
            this.lbl('P', extX - 12, extY - 14, '#0891b2');

            // Laser tangents PA and PB
            const laserCol = locked ? 0x10b981 : 0x06b6d4;
            this.drawLaser(extX, extY, ax, ay, laserCol);
            this.drawLaser(extX, extY, bx, by, laserCol);

            // Radii OA and OB
            this.main.lineStyle(1.5, 0x475569, 0.65);
            this.main.lineBetween(cx, cy, ax, ay);
            this.main.lineBetween(cx, cy, bx, by);
            this.main.lineBetween(cx, cy, extX, extY); // center line

            this.lbl('Chord AB = 8', mx - 20, cy, '#475569', '11px');
            this.lbl('Radius r = 5', (cx + ax)/2 + 10, (cy + ay)/2 - 10, '#475569', '11px');
            this.lbl('Bridge PA = ?', (extX + ax)/2 - 10, (extY + ay)/2 - 15, this.cStr(laserCol), '12px');
        }

        else if (id === 'lvl-circle-28') {
            // Direct common tangent between two circles
            this.main.clear();

            // Two circles: Circle 1 at cx - 80 (R = 50), Circle 2 at cx + 80 (r = 20)
            // Separated by d = 160 pixels (R=50, r=20. visual: d = 130 km -> scale 10x)
            const c1x = cx - 80, c1y = cy;
            const c2x = cx + 80, c2y = cy;

            this.drawCore(c1x, c1y, 55, 0x3b82f6); // Circle 1
            this.drawCore(c2x, c2y, 25, 0x6366f1); // Circle 2

            // direct common tangent on top
            // Tan angle theta: sin(theta) = (R-r)/d = (55-25)/160 = 30/160 = 0.1875.
            const theta = Math.asin(30/160);
            const tx1 = c1x + 55 * Math.sin(theta);
            const ty1 = c1y - 55 * Math.cos(theta);
            const tx2 = c2x + 25 * Math.sin(theta);
            const ty2 = c2y - 25 * Math.cos(theta);

            this.drawLaser(tx1, ty1, tx2, ty2, locked ? 0x10b981 : 0xf97316);

            // Center connecting line
            this.main.lineStyle(1.5, 0x64748b, 0.45);
            this.main.lineBetween(c1x, c1y, c2x, c2y);

            this.lbl('R = 8 km', c1x, c1y - 70, '#3b82f6', '11px');
            this.lbl('r = 3 km', c2x, c2y - 40, '#6366f1', '11px');
            this.lbl('Separation d = 13 km', cx, cy + 18, '#64748b', '11px');
            this.lbl('Common Tangent = ?', cx, (ty1 + ty2)/2 - 16, locked ? '#10b981' : '#dc2626', '12px');
        }

        else if (id === 'lvl-circle-29' || id === 'lvl-circle-30') {
            // Master reactor diagrams (Boss visual)
            const extX = cx - 180, extY = cy;

            this.drawEmitter(extX, extY, 0x06b6d4);
            this.lbl('P', extX - 10, extY - 15, '#0891b2');

            // Draw tangents and radii
            const txA = cx - (70 * 70 / 180);
            const tyA = cy - 70 * Math.sqrt(1 - (70/180)*(70/180));
            const txB = txA;
            const tyB = cy + 70 * Math.sqrt(1 - (70/180)*(70/180));

            this.drawLaser(extX, extY, txA, tyA, 0x10b981);
            this.drawLaser(extX, extY, txB, tyB, 0x10b981);

            this.main.lineStyle(2, 0x475569, 0.85);
            this.main.lineBetween(cx, cy, txA, tyA);
            this.main.lineBetween(cx, cy, txB, tyB);
            this.main.lineStyle(1.5, 0x64748b, 0.55);
            this.main.lineBetween(cx, cy, extX, extY);

            this.drawRightAngleMarkerForPoints(cx, cy, txA, tyA, extX, extY, 12);
            this.drawRightAngleMarkerForPoints(cx, cy, txB, tyB, extX, extY, 12);

            this.lbl('A', txA, tyA - 12, '#475569');
            this.lbl('B', txB, tyB + 12, '#475569');
            this.lbl('O', cx + 12, cy - 12, '#475569');

            this.lbl('Tangent PA ⊥ OA', (extX + txA)/2, (extY + tyA)/2 - 16, '#10b981', '10px');
            this.lbl('Tangent PB ⊥ OB', (extX + txB)/2, (extY + tyB)/2 + 18, '#10b981', '10px');
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // VISUAL GRAPHICS DRAW HELPERS
    // ─────────────────────────────────────────────────────────────────

    private drawCore(x: number, y: number, r: number, color: number, fillAlpha = 0.12) {
        // Draw orbital concentric grid rings procedurally
        this.glow.lineStyle(8, color, 0.15);
        this.glow.strokeCircle(x, y, r);
        this.glow.lineStyle(3, color, 0.45);
        this.glow.strokeCircle(x, y, r + 14);

        // Core fill & boundary
        this.main.fillStyle(color, fillAlpha);
        this.main.fillCircle(x, y, r);
        this.main.lineStyle(3.5, color, 1.0);
        this.main.strokeCircle(x, y, r);

        // Holographic grid details
        this.main.lineStyle(1, 0xffffff, 0.25);
        this.main.strokeCircle(x, y, r - 15);
        this.main.lineStyle(1, color, 0.35);
        this.main.lineBetween(x - r, y, x + r, y);
        this.main.lineBetween(x, y - r, x, y + r);
    }

    private drawEmitter(x: number, y: number, color: number) {
        // Futuristic satellite emitter shape
        this.main.fillStyle(color, 1.0);
        this.main.fillCircle(x, y, 7);
        this.main.fillStyle(0xffffff, 1.0);
        this.main.fillCircle(x, y, 3);
        this.main.lineStyle(2, color, 0.85);
        this.main.strokeCircle(x, y, 14);
    }

    private drawLaser(x1: number, y1: number, x2: number, y2: number, color: number) {
        // Glowing laser path line
        this.glow.lineStyle(12, color, 0.15);
        this.glow.lineBetween(x1, y1, x2, y2);
        this.glow.lineStyle(4, color, 0.55);
        this.glow.lineBetween(x1, y1, x2, y2);
        
        // Crisp inner core line
        this.main.lineStyle(2, 0xffffff, 1.0);
        this.main.lineBetween(x1, y1, x2, y2);
    }

    // Helper to draw right-angle perpendicular markers on the tangent points
    private drawRightAngleMarkerForPoints(cx: number, cy: number, tx: number, ty: number, extX: number, extY: number, size = 12) {
        const dxRad = tx - cx;
        const dyRad = ty - cy;
        const lenRad = Math.sqrt(dxRad*dxRad + dyRad*dyRad);
        if (lenRad === 0) return;

        const uxRad = dxRad / lenRad; // Unit radius vector
        const uyRad = dyRad / lenRad;

        const dxTan = extX - tx;
        const dyTan = extY - ty;
        const lenTan = Math.sqrt(dxTan*dxTan + dyTan*dyTan);
        if (lenTan === 0) return;

        const uxTan = dxTan / lenTan; // Unit tangent vector
        const uyTan = dyTan / lenTan;

        // Vertices of perpendicular square corner
        const p1x = tx + uxRad * size;
        const p1y = ty + uyRad * size;
        
        const p2x = tx + uxRad * size + uxTan * size;
        const p2y = ty + uyRad * size + uyTan * size;

        const p3x = tx + uxTan * size;
        const p3y = ty + uyTan * size;

        this.main.lineStyle(1.5, 0x475569, 0.8);
        this.main.beginPath();
        this.main.moveTo(p1x, p1y);
        this.main.lineTo(p2x, p2y);
        this.main.lineTo(p3x, p3y);
        this.main.strokePath();
    }

    private flashOverlay(color: number) {
        this.overlay.clear().fillStyle(color, 0.18).fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.overlay.setAlpha(1);
        this.tweens.add({ targets: this.overlay, alpha: 0, duration: 600, ease: 'Cubic.easeOut' });
    }

    private cStr(hex: number): string {
        return '#' + hex.toString(16).padStart(6, '0');
    }

    // ── Label pool helpers ───────────────────────────────────────────
    private lbl(text: string, x: number, y: number, color = '#1e293b', fontSize = '12px') {
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

    private baseLayout() {
        const W = this.cameras.main.width;
        const H = this.cameras.main.height;
        const cx = W / 2;
        const cy = H / 2 + 10;
        return { cx, cy, W, H };
    }

    private worldNumber(): number {
        const id = this.levelSpec?.id ?? '';
        const num = parseInt(id.replace('lvl-circle-', ''), 10);
        if (num >= 1  && num <= 6)  return 1;
        if (num >= 7  && num <= 12) return 2;
        if (num >= 13 && num <= 18) return 3;
        if (num >= 19 && num <= 24) return 4;
        if (num >= 25 && num <= 30) return 5;
        return 1;
    }
}
