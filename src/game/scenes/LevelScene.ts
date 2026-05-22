import Phaser, { Scene, GameObjects } from 'phaser';
import { EventBus, EVENTS } from '../EventBus';
import { getLevelSpec } from '../../data/levelSpecs';
import type { LevelSpecification } from '../../data/levelSpecs';

export class LevelScene extends Scene {
    private currentLevelData: any;
    private levelSpec: LevelSpecification | null = null;
    private currentValue: number = 0;

    private graphics!: GameObjects.Graphics;
    private labelGraphics!: GameObjects.Graphics;
    private shapeScale: number = 0.4;
    private isLevelActive: boolean = false;
    private boardExamInputs: string[] = [];

    // Particle emitters for effects
    private glowEmitter!: GameObjects.Particles.ParticleEmitter;
    private smokeEmitter!: GameObjects.Particles.ParticleEmitter;

    // UI Label Elements
    private statusText!: GameObjects.Text;
    private bottomLabel!: GameObjects.Text;
    private sideLabel!: GameObjects.Text;
    private depthLabel!: GameObjects.Text;

    constructor() {
        super('LevelScene');
    }


    create() {
        // Soft premium light blue-gray background color to match web UI background
        this.cameras.main.setBackgroundColor('#ecf2f7');

        // Main shape graphics
        this.graphics = this.add.graphics();
        this.graphics.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2 - 20);

        // Separate graphics layer for dimensions/arrows
        this.labelGraphics = this.add.graphics();
        this.labelGraphics.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2 - 20);

        // Initialize particle emitters
        // Glow particles (golden sparkles) for perfect match feedback
        this.glowEmitter = this.add.particles(0, 0, 'spark', {
            x: this.cameras.main.width / 2,
            y: this.cameras.main.height / 2,
            speed: { min: 50, max: 150 },
            scale: { start: 0.8, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 800,
            frequency: 50,
            quantity: 3,
            blendMode: 'ADD',
            emitting: false
        });

        // Smoke particles (gray) for wrong answer feedback
        this.smokeEmitter = this.add.particles(0, 0, 'spark', {
            x: this.cameras.main.width / 2,
            y: this.cameras.main.height / 2,
            speed: { min: 30, max: 80 },
            scale: { start: 1.5, end: 3 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 1000,
            frequency: 30,
            quantity: 2,
            blendMode: 'NORMAL',
            emitting: false,
            tint: 0x64748b
        });

        // Handle canvas resize (e.g., orientation change, container resize on mobile)
        this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
            this.cameras.main.setSize(gameSize.width, gameSize.height);
            if (this.graphics) {
                this.graphics.setPosition(gameSize.width / 2, gameSize.height / 2 - 20);
            }
            if (this.labelGraphics) {
                this.labelGraphics.setPosition(gameSize.width / 2, gameSize.height / 2 - 20);
            }
            this.updateShape();
        });

        // Status text overlay
        this.statusText = this.add.text(20, 20, 'Ready', {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
            fontSize: '14px', 
            color: '#64748b', 
            fontStyle: 'semibold'
        });

        // Initialize label text objects (High contrast dark text on semi-transparent white glass)
        const labelStyle = {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            fontSize: '13px',
            color: '#1e293b',
            fontStyle: 'bold',
            backgroundColor: '#ffffffcc',
            padding: { x: 7, y: 3.5 }
        };

        this.bottomLabel = this.add.text(0, 0, '', labelStyle).setOrigin(0.5);
        this.sideLabel = this.add.text(0, 0, '', labelStyle).setOrigin(0.5);
        this.depthLabel = this.add.text(0, 0, '', labelStyle).setOrigin(0.5);

        // Hide labels initially
        this.hideLabels();

        // Named listeners to allow safe cleanup on shutdown/destroy
        const onLoadLevel = (levelData: any) => {
            if (!this.scene || !this.scene.systems) return;
            if (levelData.id.startsWith('lvl-cg-')) {
                this.isLevelActive = false;
                this.scene.start('CoordinateScene');
                return;
            }
            if (levelData.id.startsWith('lvl-trig-')) {
                this.isLevelActive = false;
                this.scene.start('TrigonometryScene');
                return;
            }
            if (levelData.id.startsWith('lvl-ap-')) {
                this.isLevelActive = false;
                this.scene.start('APScene');
                return;
            }
            if (levelData.id.startsWith('lvl-prob-')) {
                this.isLevelActive = false;
                this.scene.start('ProbabilityScene');
                return;
            }
            this.currentLevelData = levelData;
            this.levelSpec = getLevelSpec(levelData.id, levelData);
            this.currentValue = 0;
            this.shapeScale = 0.4; // Default starting scale (40%)
            this.isLevelActive = true;
            this.boardExamInputs = [];
            
            if (this.statusText) {
                this.statusText.setText(`Shape: ${levelData.shape.toUpperCase()}`);
            }
            
            this.hideLabels();
            this.updateShape();

            // Smooth camera transition on level load
            this.cameras.main.zoomTo(1.15, 500, 'Power2');
            this.time.delayedCall(500, () => {
                this.cameras.main.zoomTo(1, 400, 'Power2');
            });
        };

        const onUserInputChanged = (data: { value: string, levelId: string }) => {
            if (!this.scene || !this.scene.systems) return;
            if (!this.isLevelActive || !this.levelSpec) return;
            const val = parseFloat(data.value);
            if (!isNaN(val) && val > 0) {
                this.currentValue = val;
                
                // Calculate scale ratio relative to correct answer
                const ratio = Phaser.Math.Clamp(val / this.levelSpec.correctAnswer, 0.2, 2.0);
                
                this.tweens.add({
                    targets: this,
                    shapeScale: ratio,
                    duration: 350,
                    ease: 'Cubic.easeOut',
                    onUpdate: () => {
                        this.updateShape();
                    }
                });
            } else {
                this.currentValue = 0;
                this.tweens.add({
                    targets: this,
                    shapeScale: 0.4,
                    duration: 350,
                    ease: 'Cubic.easeOut',
                    onUpdate: () => this.updateShape()
                });
            }
        };

        const onBoardExamInputChanged = (data: { inputs: string[], levelId: string }) => {
            if (!this.scene || !this.scene.systems) return;
            if (!this.isLevelActive || !this.levelSpec) return;
            this.boardExamInputs = data.inputs;
            
            // Find the last valid numeric input to scale standard/fallback shapes
            let lastVal = 0;
            for (let i = data.inputs.length - 1; i >= 0; i--) {
                const val = parseFloat(data.inputs[i]);
                if (!isNaN(val) && val > 0) {
                    lastVal = val;
                    break;
                }
            }
            
            if (lastVal > 0) {
                this.currentValue = lastVal;
                const ratio = Phaser.Math.Clamp(lastVal / this.levelSpec.correctAnswer, 0.2, 2.0);
                this.tweens.add({
                    targets: this,
                    shapeScale: ratio,
                    duration: 350,
                    ease: 'Cubic.easeOut',
                    onUpdate: () => this.updateShape()
                });
            } else {
                this.currentValue = 0;
                this.updateShape();
            }
        };

        // Register listeners
        EventBus.on('load-level', onLoadLevel);
        EventBus.on('user-input-changed', onUserInputChanged);
        EventBus.on('board-exam-input-changed', onBoardExamInputChanged);
        EventBus.on('answer-correct', () => this.triggerGlowEffect());
        EventBus.on('answer-wrong', () => this.triggerSmokeEffect());

        // Safely detach all listeners on scene shutdown or destruction
        const cleanup = () => {
            EventBus.off('load-level', onLoadLevel);
            EventBus.off('user-input-changed', onUserInputChanged);
            EventBus.off('board-exam-input-changed', onBoardExamInputChanged);
            EventBus.off('answer-correct', () => this.triggerGlowEffect());
            EventBus.off('answer-wrong', () => this.triggerSmokeEffect());
        };

        this.events.once('shutdown', cleanup);
        this.events.once('destroy', cleanup);

        EventBus.emit(EVENTS.GAME_READY, this);
    }

    // Trigger golden glow particles for correct answer
    private triggerGlowEffect() {
        if (this.glowEmitter && this.cameras.main) {
            const centerX = this.cameras.main.width / 2;
            const centerY = this.cameras.main.height / 2;
            this.glowEmitter.emitParticleAt(centerX, centerY, 30);
            this.time.delayedCall(200, () => {
                this.glowEmitter.emitParticleAt(centerX, centerY, 20);
            });
        }
    }

    // Trigger gray smoke particles for wrong answer
    private triggerSmokeEffect() {
        if (this.smokeEmitter && this.cameras.main) {
            const centerX = this.cameras.main.width / 2;
            const centerY = this.cameras.main.height / 2;
            this.smokeEmitter.emitParticleAt(centerX, centerY, 15);
        }
    }

    hideLabels() {
        if (this.bottomLabel) this.bottomLabel.setVisible(false);
        if (this.sideLabel) this.sideLabel.setVisible(false);
        if (this.depthLabel) this.depthLabel.setVisible(false);
    }

    // Helper to draw clean arrows for dimension lines
    drawDimensionArrow(x1: number, y1: number, x2: number, y2: number, offset: number = 0) {
        // Apply offset orthogonally to the line vector
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx*dx + dy*dy);
        if (len === 0) return { mx: x1, my: y1 };

        const nx = -dy / len; // Orthogonal normal
        const ny = dx / len;

        const ox1 = x1 + nx * offset;
        const oy1 = y1 + ny * offset;
        const ox2 = x2 + nx * offset;
        const oy2 = y2 + ny * offset;

        // Draw extension helper lines
        this.labelGraphics.lineStyle(1.5, 0x475569, 0.5); // Thin slate
        this.labelGraphics.lineBetween(x1, y1, ox1, oy1);
        this.labelGraphics.lineBetween(x2, y2, ox2, oy2);

        // Draw the arrow body
        this.labelGraphics.lineStyle(2, 0x2563eb, 0.85); // Royal blue
        this.labelGraphics.lineBetween(ox1, oy1, ox2, oy2);

        // Arrowheads
        const arrowSize = 6;
        const angle = Math.atan2(oy2 - oy1, ox2 - ox1);
        
        this.labelGraphics.fillStyle(0x2563eb, 0.85);
        this.labelGraphics.beginPath();
        this.labelGraphics.moveTo(ox1, oy1);
        this.labelGraphics.lineTo(ox1 + arrowSize * Math.cos(angle + Math.PI/6), oy1 + arrowSize * Math.sin(angle + Math.PI/6));
        this.labelGraphics.lineTo(ox1 + arrowSize * Math.cos(angle - Math.PI/6), oy1 + arrowSize * Math.sin(angle - Math.PI/6));
        this.labelGraphics.fillPath();

        this.labelGraphics.beginPath();
        this.labelGraphics.moveTo(ox2, oy2);
        this.labelGraphics.lineTo(ox2 - arrowSize * Math.cos(angle + Math.PI/6), oy2 - arrowSize * Math.sin(angle + Math.PI/6));
        this.labelGraphics.lineTo(ox2 - arrowSize * Math.cos(angle - Math.PI/6), oy2 - arrowSize * Math.sin(angle - Math.PI/6));
        this.labelGraphics.fillPath();

        return {
            mx: (ox1 + ox2) / 2,
            my: (oy1 + oy2) / 2
        };
    }

    updateShape() {
        if (!this.currentLevelData || !this.levelSpec) return;
        
        // Ensure graphics elements are instantiated to prevent race condition crashes
        if (!this.graphics || !this.labelGraphics) return;

        this.graphics.clear();
        this.labelGraphics.clear();
        
        const shape = this.currentLevelData.shape;
        const baseDim = Math.min(this.cameras.main.width, this.cameras.main.height) * 0.35;
        const s = this.shapeScale * Math.max(60, Math.min(140, baseDim)); // Scaled base dimension, responsive
        const activeVal = this.currentValue || 0;

        // Visual Colors: Green if perfect match, Red if way too large, Blue otherwise
        let color = 0x3b82f6; // Sky Blue
        let fillOpacity = 0.25;
        
        if (activeVal > 0 && Math.abs(activeVal - this.levelSpec.correctAnswer) <= this.levelSpec.tolerance) {
            color = 0x10b981; // Vibrant Success Green
            fillOpacity = 0.45;
        } else if (this.shapeScale > 1.6) {
            color = 0xf43f5e; // Warning Rose Red
            fillOpacity = 0.35;
        }

        this.graphics.lineStyle(4, color, 1);
        this.graphics.fillStyle(color, fillOpacity);

        // Center offsets
        const cx = 0;
        const cy = 0;

        const levelId = this.currentLevelData.id;
        const inputs = this.boardExamInputs || [];

        // --- CUSTOM BOARD EXAM RENDERERS FOR ADVANCED LEVELS ---
        if (levelId === 'lvl-13') {
            this.hideLabels();
            const nVal = parseFloat(inputs[2] || '');

            // Draw warehouse outline
            const wX = -120, wY = -80, wW = 240, wH = 150;
            this.graphics.lineStyle(2, 0x475569, 0.4);
            this.graphics.strokeRect(wX, wY, wW, wH);

            if (this.bottomLabel) {
                this.bottomLabel.setText("Warehouse: 20m x 10m x 25m").setPosition(this.graphics.x, this.graphics.y - 100).setVisible(true);
            }

            // Draw filled mini-boxes
            if (!isNaN(nVal) && nVal > 0) {
                const fillRatio = Math.min(1.0, nVal / 5000);
                const fillCol = nVal === 5000 ? 0x10b981 : 0xf59e0b;
                this.graphics.fillStyle(fillCol, 0.6);
                this.graphics.fillRect(wX + 2, wY + wH * (1 - fillRatio) + 2, wW - 4, wH * fillRatio - 4);
                
                if (this.sideLabel) {
                    this.sideLabel.setText(`Boxes: ${nVal.toFixed(0)}`).setPosition(this.graphics.x, this.graphics.y + 90).setVisible(true);
                }
            }
            return;
        }

        if (levelId === 'lvl-14') {
            this.hideLabels();
            const vBucket = parseFloat(inputs[0] || '');
            const hVessel = parseFloat(inputs[1] || '');

            // Left Bucket: r = 10, h = 10 (wide)
            const bX = -100, bY = 50, bR = 60, bH = 100;
            this.graphics.lineStyle(2, 0x475569, 0.5);
            this.graphics.strokeEllipse(bX, bY + bH/2, bR, bR * 0.35);
            this.graphics.strokeEllipse(bX, bY - bH/2, bR, bR * 0.35);
            this.graphics.lineBetween(bX - bR/2, bY - bH/2, bX - bR/2, bY + bH/2);
            this.graphics.lineBetween(bX + bR/2, bY - bH/2, bX + bR/2, bY + bH/2);

            // Right Vessel: r = 5, h = 40 (tall)
            const vX = 100, vY = 50, vR = 35, vH = 150;
            this.graphics.strokeEllipse(vX, vY + vH/2, vR, vR * 0.35);
            this.graphics.strokeEllipse(vX, vY - vH/2, vR, vR * 0.35);
            this.graphics.lineBetween(vX - vR/2, vY - vH/2, vX - vR/2, vY + vH/2);
            this.graphics.lineBetween(vX + vR/2, vY - vH/2, vX + vR/2, vY + vH/2);

            if (this.bottomLabel) this.bottomLabel.setText("Bucket (r=10)").setPosition(this.graphics.x + bX, this.graphics.y + bY + bH/2 + 25).setVisible(true);
            if (this.sideLabel) this.sideLabel.setText("Vessel (r=5)").setPosition(this.graphics.x + vX, this.graphics.y + vY + vH/2 + 25).setVisible(true);

            // Potion Fill Animations
            if (vBucket === 3140) {
                let fillRatioLeft = 1.0;
                if (!isNaN(hVessel) && hVessel > 0) {
                    fillRatioLeft = Math.max(0, 1 - (hVessel / 40));
                }
                // Fill left
                if (fillRatioLeft > 0) {
                    this.graphics.fillStyle(0x3b82f6, 0.5);
                    this.graphics.fillRect(bX - bR/2 + 1, bY + bH/2 - bH * fillRatioLeft, bR - 2, bH * fillRatioLeft);
                    this.graphics.fillEllipse(bX, bY + bH/2, bR - 2, bR * 0.35);
                    this.graphics.fillEllipse(bX, bY + bH/2 - bH * fillRatioLeft, bR - 2, bR * 0.35);
                }

                // Fill right
                if (!isNaN(hVessel) && hVessel > 0) {
                    const fillRatioRight = Math.min(1.0, hVessel / 40);
                    const fillCol = hVessel === 40 ? 0x10b981 : 0xf59e0b;
                    this.graphics.fillStyle(fillCol, 0.6);
                    this.graphics.fillRect(vX - vR/2 + 1, vY + vH/2 - vH * fillRatioRight, vR - 2, vH * fillRatioRight);
                    this.graphics.fillEllipse(vX, vY + vH/2, vR - 2, vR * 0.35);
                    this.graphics.fillEllipse(vX, vY + vH/2 - vH * fillRatioRight, vR - 2, vR * 0.35);

                    if (this.depthLabel) this.depthLabel.setText(`h = ${hVessel} cm`).setPosition(this.graphics.x + vX, this.graphics.y - 50).setVisible(true);
                }
            }
            return;
        }

        if (levelId === 'lvl-15') {
            this.hideLabels();
            const vCone = parseFloat(inputs[0] || '');
            const hCyl = parseFloat(inputs[1] || '');

            // Left Cone Cup: r = 6, h = 12 (tall conical glass)
            const cX = -100, cY = 30, cR = 50, cH = 120;
            this.graphics.lineStyle(2, 0x475569, 0.5);
            this.graphics.strokeEllipse(cX, cY - cH/2, cR, cR * 0.35);
            this.graphics.beginPath();
            this.graphics.moveTo(cX - cR/2, cY - cH/2);
            this.graphics.lineTo(cX, cY + cH/2);
            this.graphics.lineTo(cX + cR/2, cY - cH/2);
            this.graphics.strokePath();

            // Right Beaker Cylinder: r = 4, h = 9 sitting lower
            const bX = 100, bY = 50, bR = 40, bH = 100;
            this.graphics.strokeEllipse(bX, bY + bH/2, bR, bR * 0.35);
            this.graphics.strokeEllipse(bX, bY - bH/2, bR, bR * 0.35);
            this.graphics.lineBetween(bX - bR/2, bY - bH/2, bX - bR/2, bY + bH/2);
            this.graphics.lineBetween(bX + bR/2, bY - bH/2, bX + bR/2, bY + bH/2);

            if (this.bottomLabel) this.bottomLabel.setText("Cone Cup").setPosition(this.graphics.x + cX, this.graphics.y + cY + cH/2 + 20).setVisible(true);
            if (this.sideLabel) this.sideLabel.setText("Beaker").setPosition(this.graphics.x + bX, this.graphics.y + bY + bH/2 + 20).setVisible(true);

            if (vCone === 144) {
                let fillRatioLeft = 1.0;
                if (!isNaN(hCyl) && hCyl > 0) {
                    fillRatioLeft = Math.max(0, 1 - (hCyl / 9));
                }

                // Fill left cone
                if (fillRatioLeft > 0) {
                    this.graphics.fillStyle(0xf59e0b, 0.6);
                    this.graphics.beginPath();
                    this.graphics.moveTo(cX - (cR/2) * fillRatioLeft, cY + cH/2 - cH * fillRatioLeft);
                    this.graphics.lineTo(cX, cY + cH/2);
                    this.graphics.lineTo(cX + (cR/2) * fillRatioLeft, cY + cH/2 - cH * fillRatioLeft);
                    this.graphics.closePath();
                    this.graphics.fillPath();
                    this.graphics.fillEllipse(cX, cY + cH/2 - cH * fillRatioLeft, cR * fillRatioLeft, cR * 0.35 * fillRatioLeft);
                }

                // Fill right beaker
                if (!isNaN(hCyl) && hCyl > 0) {
                    const fillRatioRight = Math.min(1.0, hCyl / 9);
                    const fillCol = hCyl === 9 ? 0x10b981 : 0xf59e0b;
                    this.graphics.fillStyle(fillCol, 0.6);
                    this.graphics.fillRect(bX - bR/2 + 1, bY + bH/2 - bH * fillRatioRight, bR - 2, bH * fillRatioRight);
                    this.graphics.fillEllipse(bX, bY + bH/2, bR - 2, bR * 0.35);
                    this.graphics.fillEllipse(bX, bY + bH/2 - bH * fillRatioRight, bR - 2, bR * 0.35);
                    
                    if (this.depthLabel) this.depthLabel.setText(`h = ${hCyl} cm`).setPosition(this.graphics.x + bX, this.graphics.y - 50).setVisible(true);
                }
            }
            return;
        }

        if (levelId === 'lvl-16') {
            const rad = 100;
            this.graphics.strokeCircle(cx, cy, rad);
            this.graphics.fillCircle(cx, cy, rad);
            this.graphics.strokeEllipse(cx, cy, rad * 2, rad * 0.4);
            this.hideLabels();
            if (this.bottomLabel) {
                const totalV = parseFloat(inputs[1] || '');
                this.bottomLabel.setText(isNaN(totalV) ? "Radius = 6m" : `Volume = ${totalV} m³`).setPosition(this.graphics.x, this.graphics.y + rad + 25).setVisible(true);
            }
            return;
        }

        if (levelId === 'lvl-17') {
            const hVal = parseFloat(inputs[0] || '');
            const h = 120;
            const r = 80;
            this.graphics.strokeEllipse(cx, cy + h/2, r, r * 0.35);
            this.graphics.strokeEllipse(cx, cy - h/2, r, r * 0.35);
            this.graphics.lineBetween(cx - r/2, cy - h/2, cx - r/2, cy + h/2);
            this.graphics.lineBetween(cx + r/2, cy - h/2, cx + r/2, cy + h/2);
            this.graphics.fillRect(cx - r/2, cy - h/2, r, h);
            this.graphics.fillEllipse(cx, cy - h/2, r, r * 0.35);

            this.hideLabels();
            if (this.bottomLabel) {
                this.bottomLabel.setText(`r = 10m`).setPosition(this.graphics.x, this.graphics.y + h/2 + 25).setVisible(true);
            }
            if (this.sideLabel) {
                this.sideLabel.setText(isNaN(hVal) ? "h = ?" : `h = ${hVal}m`).setPosition(this.graphics.x + r/2 + 35, this.graphics.y).setVisible(true);
            }
            return;
        }

        if (levelId === 'lvl-18') {
            const saVal = parseFloat(inputs[1] || '');
            const rad = 100;
            this.graphics.strokeCircle(cx, cy, rad);
            this.graphics.fillCircle(cx, cy, rad);
            this.graphics.strokeEllipse(cx, cy, rad * 2, rad * 0.4);
            this.hideLabels();
            if (this.bottomLabel) {
                this.bottomLabel.setText(isNaN(saVal) ? "Radius = 15m" : `Surface Area = ${saVal} m²`).setPosition(this.graphics.x, this.graphics.y + rad + 25).setVisible(true);
            }
            return;
        }

        // --- COMBINATION OF SHAPES ---
        if (levelId === 'lvl-19') {
            this.hideLabels();
            const vCone = parseFloat(inputs[0] || '');
            const vHemi = parseFloat(inputs[1] || '');

            const r = 70;
            const hCone = 80;

            // Draw Hemisphere Base
            let hemiCol = 0x3b82f6;
            if (vHemi === 56.52) hemiCol = 0x10b981;
            else if (!isNaN(vHemi)) hemiCol = 0xf59e0b;

            this.graphics.fillStyle(hemiCol, 0.4);
            this.graphics.lineStyle(3, hemiCol, 1);
            this.graphics.strokeEllipse(cx, cy, r * 2, r * 0.4);
            this.graphics.fillEllipse(cx, cy, r * 2, r * 0.4);
            this.graphics.beginPath();
            this.graphics.arc(cx, cy, r, 0, Math.PI, false);
            this.graphics.strokePath();
            this.graphics.fillPath();

            // Draw Cone surmounted on top
            let coneCol = 0x3b82f6;
            if (vCone === 37.68) coneCol = 0x10b981;
            else if (!isNaN(vCone)) coneCol = 0xf59e0b;

            this.graphics.fillStyle(coneCol, 0.4);
            this.graphics.lineStyle(3, coneCol, 1);
            this.graphics.beginPath();
            this.graphics.moveTo(cx - r, cy);
            this.graphics.lineTo(cx, cy - hCone);
            this.graphics.lineTo(cx + r, cy);
            this.graphics.closePath();
            this.graphics.strokePath();
            this.graphics.fillPath();

            if (this.bottomLabel) this.bottomLabel.setText("r = 3").setPosition(this.graphics.x, this.graphics.y + r + 20).setVisible(true);
            if (this.sideLabel) this.sideLabel.setText("h = 4").setPosition(this.graphics.x + r + 25, this.graphics.y - hCone/2).setVisible(true);
            return;
        }

        if (levelId === 'lvl-20' || levelId === 'lvl-21') {
            this.hideLabels();
            const vCyl = parseFloat(inputs[0] || '');
            const vCaps = parseFloat(inputs[1] || '');

            const r = 50;
            const hCyl = 100;

            // Draw Cylinder
            let cylCol = 0x3b82f6;
            if (vCyl > 0) cylCol = 0x10b981;
            this.graphics.fillStyle(cylCol, 0.3);
            this.graphics.lineStyle(3, cylCol, 1);
            this.graphics.strokeEllipse(cx, cy - hCyl/2, r * 2, r * 0.4);
            this.graphics.strokeEllipse(cx, cy + hCyl/2, r * 2, r * 0.4);
            this.graphics.lineBetween(cx - r, cy - hCyl/2, cx - r, cy + hCyl/2);
            this.graphics.lineBetween(cx + r, cy - hCyl/2, cx + r, cy + hCyl/2);
            this.graphics.fillRect(cx - r, cy - hCyl/2, r * 2, hCyl);
            this.graphics.fillEllipse(cx, cy + hCyl/2, r * 2, r * 0.4);
            this.graphics.fillEllipse(cx, cy - hCyl/2, r * 2, r * 0.4);

            // Draw Bottom Cap (Hemisphere)
            let capCol = 0x3b82f6;
            if (vCaps > 0) capCol = 0x10b981;
            this.graphics.fillStyle(capCol, 0.3);
            this.graphics.lineStyle(3, capCol, 1);
            this.graphics.beginPath();
            this.graphics.arc(cx, cy + hCyl/2, r, 0, Math.PI, false);
            this.graphics.strokePath();
            this.graphics.fillPath();
            this.graphics.strokeEllipse(cx, cy + hCyl/2, r * 2, r * 0.4);

            // Draw Top Cap (only for lvl-20 Space Capsule)
            if (levelId === 'lvl-20') {
                this.graphics.beginPath();
                this.graphics.arc(cx, cy - hCyl/2, r, 0, Math.PI, true);
                this.graphics.strokePath();
                this.graphics.fillPath();
                this.graphics.strokeEllipse(cx, cy - hCyl/2, r * 2, r * 0.4);
            }

            if (this.bottomLabel) this.bottomLabel.setText("r = 3").setPosition(this.graphics.x, this.graphics.y + hCyl/2 + r + 15).setVisible(true);
            return;
        }

        if (levelId === 'lvl-22') {
            this.hideLabels();
            const vCyl = parseFloat(inputs[0] || '');
            const vCone = parseFloat(inputs[1] || '');

            const r = 60;
            const hCyl = 100;
            const hCone = 50;

            // Cylinder
            let cylCol = 0x3b82f6;
            if (vCyl === 1130.4) cylCol = 0x10b981;
            else if (!isNaN(vCyl)) cylCol = 0xf59e0b;

            this.graphics.fillStyle(cylCol, 0.3);
            this.graphics.lineStyle(3, cylCol, 1);
            this.graphics.strokeEllipse(cx, cy + hCyl/2, r * 2, r * 0.4);
            this.graphics.lineBetween(cx - r, cy - hCyl/2, cx - r, cy + hCyl/2);
            this.graphics.lineBetween(cx + r, cy - hCyl/2, cx + r, cy + hCyl/2);
            this.graphics.fillRect(cx - r, cy - hCyl/2, r * 2, hCyl);
            this.graphics.fillEllipse(cx, cy + hCyl/2, r * 2, r * 0.4);
            this.graphics.fillEllipse(cx, cy - hCyl/2, r * 2, r * 0.4);

            // Cone roof surmounted on top
            let coneCol = 0x3b82f6;
            if (vCone === 113.04) coneCol = 0x10b981;
            else if (!isNaN(vCone)) coneCol = 0xf59e0b;

            this.graphics.fillStyle(coneCol, 0.4);
            this.graphics.lineStyle(3, coneCol, 1);
            this.graphics.beginPath();
            this.graphics.moveTo(cx - r, cy - hCyl/2);
            this.graphics.lineTo(cx, cy - hCyl/2 - hCone);
            this.graphics.lineTo(cx + r, cy - hCyl/2);
            this.graphics.closePath();
            this.graphics.strokePath();
            this.graphics.fillPath();

            return;
        }

        if (levelId === 'lvl-23') {
            this.hideLabels();
            const vCub = parseFloat(inputs[0] || '');
            const vCube = parseFloat(inputs[1] || '');

            // Draw Head Cuboid
            let headCol = 0x3b82f6;
            if (vCub === 480) headCol = 0x10b981;
            else if (!isNaN(vCub)) headCol = 0xf59e0b;

            this.graphics.fillStyle(headCol, 0.35);
            this.graphics.lineStyle(3, headCol, 1);
            this.graphics.strokeRect(cx - 70, cy, 140, 70);
            this.graphics.fillRect(cx - 70, cy, 140, 70);

            // Draw Top Sensor Cube
            let sensCol = 0x3b82f6;
            if (vCube === 27) sensCol = 0x10b981;
            else if (!isNaN(vCube)) sensCol = 0xf59e0b;

            this.graphics.fillStyle(sensCol, 0.4);
            this.graphics.lineStyle(3, sensCol, 1);
            this.graphics.strokeRect(cx - 20, cy - 40, 40, 40);
            this.graphics.fillRect(cx - 20, cy - 40, 40, 40);
            return;
        }

        if (levelId === 'lvl-24') {
            this.hideLabels();
            const vCub = parseFloat(inputs[0] || '');
            const vPyr = parseFloat(inputs[1] || '');

            // Cuboid Base
            let baseCol = 0x3b82f6;
            if (vCub === 600) baseCol = 0x10b981;
            else if (!isNaN(vCub)) baseCol = 0xf59e0b;

            this.graphics.fillStyle(baseCol, 0.3);
            this.graphics.lineStyle(3, baseCol, 1);
            this.graphics.strokeRect(cx - 80, cy, 160, 70);
            this.graphics.fillRect(cx - 80, cy, 160, 70);

            // Pyramid surmounting
            let pyrCol = 0x3b82f6;
            if (vPyr === 240) pyrCol = 0x10b981;
            else if (!isNaN(vPyr)) pyrCol = 0xf59e0b;

            this.graphics.fillStyle(pyrCol, 0.4);
            this.graphics.lineStyle(3, pyrCol, 1);
            this.graphics.beginPath();
            this.graphics.moveTo(cx - 80, cy);
            this.graphics.lineTo(cx, cy - 70);
            this.graphics.lineTo(cx + 80, cy);
            this.graphics.closePath();
            this.graphics.strokePath();
            this.graphics.fillPath();
            return;
        }

        // Custom Board Exam Step Writer Renderer for Level 25: Recasting Forge
        if (levelId === 'lvl-25') {
            this.hideLabels();

            const vSphereStr = (this.boardExamInputs && this.boardExamInputs[0]) || '';
            const hCylinderStr = (this.boardExamInputs && this.boardExamInputs[1]) || '';
            
            const vSphere = parseFloat(vSphereStr);
            const hCylinder = parseFloat(hCylinderStr);

            // 1. Draw the Liquid Gold Pool/Reservoir at the bottom
            const poolX = -200;
            const poolY = 100;
            const poolWidth = 400;
            const poolHeight = 25;

            // Draw pool outline
            this.graphics.lineStyle(2, 0x475569, 0.4); // Thin slate
            this.graphics.strokeRect(poolX, poolY, poolWidth, poolHeight);

            // 2. Draw Sphere on the Left (center at -120, -20)
            const sx = -120;
            const sy = -20;
            let sphereRadius = 60;
            let sphereColor = 0x3b82f6; // Sky blue by default
            let sphereOpacity = 0.25;

            if (vSphereStr.trim() !== '') {
                if (!isNaN(vSphere)) {
                    if (vSphere === 113.04) {
                        sphereColor = 0x10b981; // Vibrant success emerald green
                        sphereOpacity = 0.45;
                    } else if (vSphere > 113.04) {
                        sphereColor = 0xf43f5e; // Too large red
                    } else {
                        sphereColor = 0xf59e0b; // Amber
                    }
                    // Scale radius based on input
                    sphereRadius = 60 * Math.max(0.3, Math.min(1.6, vSphere / 113.04));
                }
            }

            // Draw Sphere
            const isStage1Correct = vSphere === 113.04;
            const hasMelted = isStage1Correct;
            const showSphere = !hasMelted || (hCylinderStr.trim() === '');

            if (showSphere) {
                this.graphics.lineStyle(3, sphereColor, 1);
                this.graphics.fillStyle(sphereColor, sphereOpacity);
                this.graphics.strokeCircle(sx, sy, sphereRadius);
                this.graphics.fillCircle(sx, sy, sphereRadius);
                
                // Elliptical equator lines to give perfect 3D spherical rendering
                this.graphics.strokeEllipse(sx, sy, sphereRadius * 2, sphereRadius * 0.4);
                
                // Center Dot
                this.labelGraphics.fillStyle(0x0f172a, 1);
                this.labelGraphics.fillCircle(sx, sy, 4);

                // Sphere Radius Helper Line
                this.graphics.lineStyle(2, 0x475569, 0.6);
                this.graphics.lineBetween(sx, sy, sx + sphereRadius, sy);
                
                // Label
                this.bottomLabel.setText("r = 3")
                    .setPosition(this.graphics.x + sx + sphereRadius/2, this.graphics.y + sy - 20)
                    .setVisible(true);
            }

            // If Stage 1 is correct, show melting animation draining into the pool!
            if (isStage1Correct) {
                // Draw pool gold fill
                let currentPoolFillRatio = 1.0;
                
                // If user is recasting (typing height), the pool shrinks
                if (!isNaN(hCylinder) && hCylinder > 0) {
                    currentPoolFillRatio = Math.max(0, 1 - (hCylinder / 9));
                }

                if (currentPoolFillRatio > 0) {
                    this.graphics.fillStyle(0xf59e0b, 0.85); // Molten Gold
                    this.graphics.fillRect(poolX + 2, poolY + poolHeight * (1 - currentPoolFillRatio) + 1, poolWidth - 4, poolHeight * currentPoolFillRatio - 2);
                }

                // If sphere is melting (no cylinder height yet), draw flow streams!
                if (hCylinderStr.trim() === '') {
                    this.graphics.lineStyle(3, 0xf59e0b, 0.8);
                    // Flowing stream from sphere bottom to pool
                    this.graphics.lineBetween(sx, sy + 15, sx, poolY);
                    this.graphics.lineBetween(sx - 10, sy + 18, sx - 10, poolY + 5);
                    this.graphics.lineBetween(sx + 10, sy + 18, sx + 10, poolY + 5);
                }
            }

            // 3. Draw Cylinder Mold on the Right (center at 120, -10)
            const cxRight = 120;
            const cyRight = poolY; // Bottom of cylinder sits exactly on top of the pool!
            const cylRadius = 45;
            const maxCylHeight = 130;
            let cylColor = 0x475569; // Faint slate mold outline
            
            // Draw cylinder mold outline
            this.graphics.lineStyle(2.5, cylColor, 0.35); // dashed or faint solid
            
            // Bottom cap ellipse
            this.graphics.strokeEllipse(cxRight, cyRight, cylRadius * 2, cylRadius * 0.4);
            // Top cap ellipse
            this.graphics.strokeEllipse(cxRight, cyRight - maxCylHeight, cylRadius * 2, cylRadius * 0.4);
            // Side lines of the mold
            this.graphics.lineBetween(cxRight - cylRadius, cyRight, cxRight - cylRadius, cyRight - maxCylHeight);
            this.graphics.lineBetween(cxRight + cylRadius, cyRight, cxRight + cylRadius, cyRight - maxCylHeight);

            // Radius indicator label
            if (this.sideLabel) {
                this.sideLabel.setText("r = 2")
                    .setPosition(this.graphics.x + cxRight, this.graphics.y + cyRight - maxCylHeight - 20)
                    .setVisible(true);
            }

            // If user types in Stage 2 (cylinder height)
            if (isStage1Correct && hCylinderStr.trim() !== '') {
                if (!isNaN(hCylinder) && hCylinder > 0) {
                    let fillRatio = Math.min(1.2, hCylinder / 9);
                    let fillHeight = maxCylHeight * fillRatio;
                    
                    let fillCylinderColor = 0xf59e0b; // Molten Gold by default
                    let fillOpacity = 0.85;

                    if (hCylinder === 9) {
                        fillCylinderColor = 0x10b981; // Success Green!
                        fillOpacity = 0.9;
                    } else if (hCylinder > 9) {
                        fillCylinderColor = 0xf43f5e; // Too high!
                    }

                    // Draw filled liquid in cylinder mold
                    this.graphics.fillStyle(fillCylinderColor, fillOpacity);
                    this.graphics.lineStyle(3, fillCylinderColor, 1);
                    
                    // Fill body
                    this.graphics.fillRect(cxRight - cylRadius + 1.5, cyRight - fillHeight, cylRadius * 2 - 3, fillHeight);
                    // Ellipse caps
                    this.graphics.fillEllipse(cxRight, cyRight, cylRadius * 2 - 3, cylRadius * 0.4);
                    this.graphics.fillEllipse(cxRight, cyRight - fillHeight, cylRadius * 2 - 3, cylRadius * 0.4);
                    this.graphics.strokeEllipse(cxRight, cyRight - fillHeight, cylRadius * 2 - 3, cylRadius * 0.4);
                    
                    // Re-draw sides of the filled part
                    this.graphics.lineBetween(cxRight - cylRadius, cyRight, cxRight - cylRadius, cyRight - fillHeight);
                    this.graphics.lineBetween(cxRight + cylRadius, cyRight, cxRight + cylRadius, cyRight - fillHeight);

                    // Height value label
                    this.depthLabel.setText(`h = ${hCylinder.toFixed(1)}`)
                        .setPosition(this.graphics.x + cxRight + cylRadius + 30, this.graphics.y + cyRight - fillHeight / 2)
                        .setVisible(true);

                    // Draw pouring stream from base pool into the cylinder!
                    if (hCylinder < 9) {
                        this.graphics.lineStyle(3, 0xf59e0b, 0.8);
                        this.graphics.lineBetween(cxRight, cyRight + 15, cxRight, cyRight - fillHeight);
                    }
                }
            } else {
                // Awaiting cylinder height
                if (this.depthLabel) this.depthLabel.setVisible(false);
            }
            return;
        }

        // --- CONVERSIONS OF SHAPES ---
        if (levelId === 'lvl-26' || levelId === 'lvl-27' || levelId === 'lvl-28' || levelId === 'lvl-29' || levelId === 'lvl-30') {
            this.hideLabels();
            const stage1Val = parseFloat(inputs[0] || '');
            const stage2Val = parseFloat(inputs[1] || '');
            const stage3Val = parseFloat(inputs[2] || '');

            // Left side starting solid
            const sX = -120, sY = -20, sSize = 50;
            let solidCol = 0x3b82f6;
            if (stage1Val > 0) solidCol = 0x10b981;

            this.graphics.fillStyle(solidCol, 0.35);
            this.graphics.lineStyle(3, solidCol, 1);

            if (levelId === 'lvl-26') {
                // Cube
                this.graphics.strokeRect(sX - sSize, sY - sSize, sSize * 2, sSize * 2);
                this.graphics.fillRect(sX - sSize, sY - sSize, sSize * 2, sSize * 2);
            } else if (levelId === 'lvl-27' || levelId === 'lvl-29') {
                // Cylinder
                this.graphics.strokeEllipse(sX, sY + sSize, sSize, sSize * 0.35);
                this.graphics.strokeEllipse(sX, sY - sSize, sSize, sSize * 0.35);
                this.graphics.lineBetween(sX - sSize, sY - sSize, sX - sSize, sY + sSize);
                this.graphics.lineBetween(sX + sSize, sY - sSize, sX + sSize, sY + sSize);
                this.graphics.fillRect(sX - sSize, sY - sSize, sSize * 2, sSize * 2);
                this.graphics.fillEllipse(sX, sY + sSize, sSize, sSize * 0.35);
                this.graphics.fillEllipse(sX, sY - sSize, sSize, sSize * 0.35);
            } else if (levelId === 'lvl-28') {
                // Cuboid Gold Bar
                this.graphics.strokeRect(sX - sSize * 1.3, sY - sSize * 0.8, sSize * 2.6, sSize * 1.6);
                this.graphics.fillRect(sX - sSize * 1.3, sY - sSize * 0.8, sSize * 2.6, sSize * 1.6);
            } else if (levelId === 'lvl-30') {
                // Mega Complex Tower (Final Boss)
                const cRadius = 40;
                const cHeight = 80;
                // Cylinder
                this.graphics.strokeEllipse(cx, cy + cHeight/2, cRadius * 2, cRadius * 0.4);
                this.graphics.strokeEllipse(cx, cy - cHeight/2, cRadius * 2, cRadius * 0.4);
                this.graphics.lineBetween(cx - cRadius, cy - cHeight/2, cx - cRadius, cy + cHeight/2);
                this.graphics.lineBetween(cx + cRadius, cy - cHeight/2, cx + cRadius, cy + cHeight/2);
                this.graphics.fillRect(cx - cRadius, cy - cHeight/2, cRadius * 2, cHeight);
                this.graphics.fillEllipse(cx, cy + cHeight/2, cRadius * 2, cRadius * 0.4);
                this.graphics.fillEllipse(cx, cy - cHeight/2, cRadius * 2, cRadius * 0.4);
                // Cone top
                this.graphics.beginPath();
                this.graphics.moveTo(cx - cRadius, cy - cHeight/2);
                this.graphics.lineTo(cx, cy - cHeight/2 - 40);
                this.graphics.lineTo(cx + cRadius, cy - cHeight/2);
                this.graphics.closePath();
                this.graphics.strokePath();
                this.graphics.fillPath();
                // Hemisphere bottom
                this.graphics.beginPath();
                this.graphics.arc(cx, cy + cHeight/2, cRadius, 0, Math.PI, false);
                this.graphics.strokePath();
                this.graphics.fillPath();
                return;
            }

            // Right side molds/moulds (representing casting results)
            const mX = 100, mY = -20;
            let moldCol = 0x475569;
            if (stage3Val > 0) moldCol = 0x10b981;
            else if (stage2Val > 0) moldCol = 0xf59e0b;

            this.graphics.fillStyle(moldCol, 0.45);
            this.graphics.lineStyle(3, moldCol, 1);

            // Draw casting visual
            for (let i = 0; i < 4; i++) {
                const ox = mX + (i % 2) * 50 - 25;
                const oy = mY + Math.floor(i / 2) * 50 - 25;
                if (levelId === 'lvl-26' || levelId === 'lvl-29') {
                    this.graphics.strokeCircle(ox, oy, 15);
                    if (stage3Val > 0) this.graphics.fillCircle(ox, oy, 15);
                } else if (levelId === 'lvl-27') {
                    this.graphics.beginPath();
                    this.graphics.moveTo(ox - 15, oy + 15);
                    this.graphics.lineTo(ox, oy - 15);
                    this.graphics.lineTo(ox + 15, oy + 15);
                    this.graphics.closePath();
                    this.graphics.strokePath();
                    if (stage3Val > 0) this.graphics.fillPath();
                } else if (levelId === 'lvl-28') {
                    this.graphics.strokeRect(ox - 15, oy - 15, 30, 30);
                    if (stage3Val > 0) this.graphics.fillRect(ox - 15, oy - 15, 30, 30);
                }
            }

            return;
        }

        if (shape.includes('cylinder')) {
            const rx = s;
            const ry = s * 0.35;
            const h = s * 1.8;
            
            // Bottom face ellipse
            this.graphics.strokeEllipse(cx, cy + h/2, rx, ry);
            this.graphics.fillEllipse(cx, cy + h/2, rx, ry);

            // Vertical side lines
            this.graphics.beginPath();
            this.graphics.moveTo(cx - rx/2, cy - h/2);
            this.graphics.lineTo(cx - rx/2, cy + h/2);
            this.graphics.moveTo(cx + rx/2, cy - h/2);
            this.graphics.lineTo(cx + rx/2, cy + h/2);
            this.graphics.strokePath();

            // Cylindrical body fill
            this.graphics.fillRect(cx - rx/2, cy - h/2, rx, h);

            // Top face ellipse
            this.graphics.fillEllipse(cx, cy - h/2, rx, ry);
            this.graphics.strokeEllipse(cx, cy - h/2, rx, ry);

            // Labeling
            this.hideLabels();
            
            // Height Arrow (right side)
            const arrowPos = this.drawDimensionArrow(cx + rx/2, cy - h/2, cx + rx/2, cy + h/2, 25);
            if (this.sideLabel) {
                this.sideLabel.setText(activeVal > 0 ? `h = ${activeVal.toFixed(1)}` : 'h = ?')
                    .setPosition(this.graphics.x + arrowPos.mx + 30, this.graphics.y + arrowPos.my).setVisible(true);
            }

            // Radius Arrow (on top ellipse face)
            this.labelGraphics.lineStyle(2, 0x475569, 0.8);
            this.labelGraphics.lineBetween(cx, cy - h/2, cx + rx/2, cy - h/2);
            if (this.bottomLabel) {
                this.bottomLabel.setText('r = 10').setPosition(this.graphics.x + cx + rx/4, this.graphics.y - h/2 - 20).setVisible(true);
            }
            
        } else if (shape.includes('cube') || shape.includes('cuboid')) {
            const sizeX = shape.includes('cuboid') ? s * 1.6 : s;
            const sizeY = shape.includes('cuboid') ? s * 0.9 : s;
            const sizeZ = s; // projection depth

            // We will draw a 3D isometric styled cuboid/cube
            const p1 = { x: cx - sizeX/2, y: cy + sizeY/2 }; // Front-Bottom-Left
            const p2 = { x: cx + sizeX/2, y: cy + sizeY/2 }; // Front-Bottom-Right
            const p3 = { x: cx + sizeX/2, y: cy - sizeY/2 }; // Front-Top-Right
            const p4 = { x: cx - sizeX/2, y: cy - sizeY/2 }; // Front-Top-Left

            // Slanted depth projection vector
            const dx = sizeZ * 0.4;
            const dy = -sizeZ * 0.3;

            const p1_3d = { x: p1.x + dx, y: p1.y + dy };
            const p2_3d = { x: p2.x + dx, y: p2.y + dy };
            const p3_3d = { x: p3.x + dx, y: p3.y + dy };
            const p4_3d = { x: p4.x + dx, y: p4.y + dy };

            // 1. Back Faces (drawn as outline only for visual transparency/premium look)
            this.graphics.lineStyle(2, color, 0.4);
            this.graphics.beginPath();
            this.graphics.moveTo(p1_3d.x, p1_3d.y);
            this.graphics.lineTo(p4_3d.x, p4_3d.y);
            this.graphics.lineTo(p3_3d.x, p3_3d.y);
            this.graphics.moveTo(p1_3d.x, p1_3d.y);
            this.graphics.lineTo(p2_3d.x, p2_3d.y);
            this.graphics.strokePath();

            this.graphics.lineStyle(4, color, 1);

            // 2. Right Side Face
            this.graphics.beginPath();
            this.graphics.moveTo(p2.x, p2.y);
            this.graphics.lineTo(p2_3d.x, p2_3d.y);
            this.graphics.lineTo(p3_3d.x, p3_3d.y);
            this.graphics.lineTo(p3.x, p3.y);
            this.graphics.closePath();
            this.graphics.fillPath();
            this.graphics.strokePath();

            // 3. Top Face
            this.graphics.beginPath();
            this.graphics.moveTo(p4.x, p4.y);
            this.graphics.lineTo(p4_3d.x, p4_3d.y);
            this.graphics.lineTo(p3_3d.x, p3_3d.y);
            this.graphics.lineTo(p3.x, p3.y);
            this.graphics.closePath();
            this.graphics.fillPath();
            this.graphics.strokePath();

            // 4. Front Face
            this.graphics.beginPath();
            this.graphics.moveTo(p1.x, p1.y);
            this.graphics.lineTo(p2.x, p2.y);
            this.graphics.lineTo(p3.x, p3.y);
            this.graphics.lineTo(p4.x, p4.y);
            this.graphics.closePath();
            this.graphics.fillPath();
            this.graphics.strokePath();

            // Labeling
            this.hideLabels();

            if (shape.includes('cube')) {
                // Bottom Width Arrow
                const botPos = this.drawDimensionArrow(p1.x, p1.y, p2.x, p2.y, 25);
                if (this.bottomLabel) {
                    this.bottomLabel.setText(activeVal > 0 ? `side (s) = ${activeVal.toFixed(1)}` : 's = ?')
                        .setPosition(this.graphics.x + botPos.mx, this.graphics.y + botPos.my).setVisible(true);
                }

                // Right Vertical Arrow
                const sidePos = this.drawDimensionArrow(p2.x, p2.y, p3.x, p3.y, 25);
                if (this.sideLabel) {
                    this.sideLabel.setText(activeVal > 0 ? `s = ${activeVal.toFixed(1)}` : 's = ?')
                        .setPosition(this.graphics.x + sidePos.mx + 10, this.graphics.y + sidePos.my).setVisible(true);
                }
            } else {
                // Cuboid
                // Length labeled as 20
                const botPos = this.drawDimensionArrow(p1.x, p1.y, p2.x, p2.y, 25);
                if (this.bottomLabel) {
                    this.bottomLabel.setText('l = 20')
                        .setPosition(this.graphics.x + botPos.mx, this.graphics.y + botPos.my).setVisible(true);
                }

                // Height is user input
                const sidePos = this.drawDimensionArrow(p2.x, p2.y, p3.x, p3.y, 25);
                if (this.sideLabel) {
                    this.sideLabel.setText(activeVal > 0 ? `h = ${activeVal.toFixed(1)}` : 'h = ?')
                        .setPosition(this.graphics.x + sidePos.mx + 20, this.graphics.y + sidePos.my).setVisible(true);
                }

                // Width labeled as 10
                const depthPos = this.drawDimensionArrow(p3.x, p3.y, p3_3d.x, p3_3d.y, 15);
                if (this.depthLabel) {
                    this.depthLabel.setText('w = 10')
                        .setPosition(this.graphics.x + depthPos.mx + 30, this.graphics.y + depthPos.my - 15).setVisible(true);
                }
            }

        } else if (shape.includes('sphere')) {
            const radius = s;
            
            // Sphere back outline + gradient
            this.graphics.strokeCircle(cx, cy, radius);
            this.graphics.fillCircle(cx, cy, radius);
            
            // Elliptical equator lines to give perfect 3D spherical rendering
            this.graphics.strokeEllipse(cx, cy, radius * 2, radius * 0.4);
            
            // Center Dot
            this.labelGraphics.fillStyle(0x0f172a, 1);
            this.labelGraphics.fillCircle(cx, cy, 4);

            // Radius vector arrow
            this.hideLabels();
            const radiusPos = this.drawDimensionArrow(cx, cy, cx + radius, cy, 0);
            if (this.bottomLabel) {
                this.bottomLabel.setText(activeVal > 0 ? `r = ${activeVal.toFixed(1)}` : 'r = ?')
                    .setPosition(this.graphics.x + radiusPos.mx, this.graphics.y + radiusPos.my - 20).setVisible(true);
            }

        } else if (shape.includes('cone')) {
            const rx = s;
            const ry = s * 0.3;
            const h = s * 2;
            
            // Base face ellipse
            this.graphics.strokeEllipse(cx, cy + h/2, rx, ry);
            this.graphics.fillEllipse(cx, cy + h/2, rx, ry);
            
            // Slanted edges to apex
            this.graphics.beginPath();
            this.graphics.moveTo(cx - rx/2, cy + h/2);
            this.graphics.lineTo(cx, cy - h/2);
            this.graphics.lineTo(cx + rx/2, cy + h/2);
            this.graphics.strokePath();
            this.graphics.fillPath();

            // Labeling
            this.hideLabels();
            
            // Height Arrow (center axis)
            this.labelGraphics.lineStyle(1.5, 0x475569, 0.5);
            this.labelGraphics.lineBetween(cx, cy - h/2, cx, cy + h/2);
            
            // Slanted dimension (slant height) for surface area, or standard height for volume
            if (this.currentLevelData.id === 'lvl-10') {
                // Slant height (diagonal)
                const diagonalPos = this.drawDimensionArrow(cx, cy - h/2, cx + rx/2, cy + h/2, 20);
                if (this.sideLabel) {
                    this.sideLabel.setText(activeVal > 0 ? `l = ${activeVal.toFixed(1)}` : 'slant l = ?')
                        .setPosition(this.graphics.x + diagonalPos.mx + 45, this.graphics.y + diagonalPos.my).setVisible(true);
                }
            } else {
                // Normal vertical height arrow (left side)
                const heightPos = this.drawDimensionArrow(cx, cy - h/2, cx, cy + h/2, -rx/2 - 20);
                if (this.sideLabel) {
                    this.sideLabel.setText(activeVal > 0 ? `h = ${activeVal.toFixed(1)}` : 'h = ?')
                        .setPosition(this.graphics.x + heightPos.mx - 40, this.graphics.y + heightPos.my).setVisible(true);
                }
            }

            // Radius labeled as 10
            this.labelGraphics.lineStyle(2, 0x475569, 0.8);
            this.labelGraphics.lineBetween(cx, cy + h/2, cx + rx/2, cy + h/2);
            if (this.bottomLabel) {
                this.bottomLabel.setText('r = 10')
                    .setPosition(this.graphics.x + cx + rx/4, this.graphics.y + h/2 + 20).setVisible(true);
            }
        } else {
            // Hemisphere or combination fallbacks
            const radius = s;
            
            // Flat base cap
            this.graphics.strokeEllipse(cx, cy, radius * 2, radius * 0.4);
            this.graphics.fillEllipse(cx, cy, radius * 2, radius * 0.4);
            
            // Dome curved shell
            this.graphics.beginPath();
            this.graphics.arc(cx, cy, radius, 0, Math.PI, true);
            this.graphics.strokePath();
            this.graphics.fillPath();

            // Labeling
            this.hideLabels();
            const radiusPos = this.drawDimensionArrow(cx, cy, cx + radius, cy, 0);
            if (this.bottomLabel) {
                this.bottomLabel.setText(activeVal > 0 ? `r = ${activeVal.toFixed(1)}` : 'r = ?')
                    .setPosition(this.graphics.x + radiusPos.mx, this.graphics.y + radiusPos.my + 20).setVisible(true);
            }
        }
    }
}
