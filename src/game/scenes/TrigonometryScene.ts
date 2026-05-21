import Phaser, { Scene, GameObjects } from 'phaser';
import { EventBus } from '../EventBus';
import { getLevelSpec } from '../../data/levelSpecs';
import type { LevelSpecification } from '../../data/levelSpecs';

export class TrigonometryScene extends Scene {
    private levelSpec: LevelSpecification | null = null;
    private isLevelActive: boolean = false;

    // Drawing layers
    private backgroundGraphics!: GameObjects.Graphics;
    private mainGraphics!: GameObjects.Graphics;
    private glowGraphics!: GameObjects.Graphics;

    // Interactive handle
    private dragHandle!: GameObjects.Arc;
    private dragHandleLabel!: GameObjects.Text;

    // Live variables
    private currentAngle: number = 0; // in degrees, 0 to 90
    private currentWidth: number = 200; // adjacent side px
    private currentHeight: number = 150; // opposite side px

    // UI text objects
    private levelTitleText!: GameObjects.Text;
    private statusInfoText!: GameObjects.Text;
    private dimensionLabels: Record<string, GameObjects.Text> = {};
    private formulaOverlayText!: GameObjects.Text;

    // Snapping sound/feedback variables
    private lastSnappedAngle: number = -1;

    constructor() {
        super('TrigonometryScene');
    }

    create() {
        // Set premium light-blue-gray canvas background
        this.cameras.main.setBackgroundColor('#ecf2f7');

        // Graphics layers
        this.backgroundGraphics = this.add.graphics();
        this.mainGraphics = this.add.graphics();
        this.glowGraphics = this.add.graphics();

        // Level details overlay
        this.levelTitleText = this.add.text(25, 25, 'Trigonometry Lab', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '15px',
            color: '#475569',
            fontStyle: 'bold'
        });

        this.statusInfoText = this.add.text(25, 48, 'Ready to sweeping...', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            color: '#3b82f6',
            fontStyle: 'bold'
        });

        this.formulaOverlayText = this.add.text(25, this.cameras.main.height - 35, '', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '13px',
            color: '#0f172a',
            fontStyle: 'bold',
            backgroundColor: '#ffffffd9',
            padding: { x: 8, y: 4 }
        }).setOrigin(0, 1);

        // Interactive Drag Handle Node (Neon Cyan Circle)
        this.dragHandle = this.add.circle(0, 0, 10, 0x06b6d4, 1.0)
            .setStrokeStyle(3, 0xffffff)
            .setInteractive({ useHandCursor: true });
        
        this.input.setDraggable(this.dragHandle);

        this.dragHandleLabel = this.add.text(0, 0, 'DRAG', {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '9px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Setup drag events
        this.input.on('drag', (pointer: Phaser.Input.Pointer, _gameObject: any, _dragX: number, _dragY: number) => {
            if (!this.isLevelActive || !this.levelSpec) return;
            const mode = this.levelSpec.trigMode || 'angle';
            const cx = this.cameras.main.width / 2;
            const cy = this.cameras.main.height / 2 + 30;

            if (mode === 'angle' || mode === 'identity' || mode === 'complementary') {
                // Calculate angle from base horizontal center point
                let dx = pointer.x - cx;
                let dy = cy - pointer.y; // invert Y for screen coords

                // Bound drag in quadrant I (0 to 90 degrees)
                if (dx < 0) dx = 0;
                if (dy < 0) dy = 0;

                let angleRad = Math.atan2(dy, dx);
                let angleDeg = Phaser.Math.RadToDeg(angleRad);
                
                // Keep strictly within [0, 90] degrees
                angleDeg = Phaser.Math.Clamp(angleDeg, 0, 90);

                // Magnetic Snapping to benchmark angles: 30, 45, 60, 90
                const benchAngles = [0, 30, 45, 60, 90];
                for (const bench of benchAngles) {
                    if (Math.abs(angleDeg - bench) < 3.0) {
                        angleDeg = bench;
                        // Trigger simple glowing flash on snap change
                        if (this.lastSnappedAngle !== bench) {
                            this.lastSnappedAngle = bench;
                            this.triggerSnapFlash();
                        }
                        break;
                    }
                }

                if (angleDeg % 1 !== 0 && !benchAngles.includes(angleDeg)) {
                    angleDeg = Math.round(angleDeg);
                }

                this.currentAngle = angleDeg;
                this.syncValueToReact(angleDeg);

            } else if (mode === 'ratio' || mode === 'heights_distances' || mode === 'boss') {
                // Resize triangle dimensions based on mouse coordinates
                let dx = pointer.x - (cx - 100); // Shift base left for triangle layout
                let dy = cy - pointer.y; // Opposite height

                const maxDragX = Math.min(400, this.cameras.main.width * 0.7);
                const maxDragY = Math.min(300, this.cameras.main.height * 0.6);
                if (dx < 30) dx = 30; // Min limits
                if (dy < 10) dy = 10;
                if (dx > maxDragX) dx = maxDragX;
                if (dy > maxDragY) dy = maxDragY;

                this.currentWidth = Math.round(dx);
                this.currentHeight = Math.round(dy);

                // Compute ratio
                let finalVal = 0;
                if (this.levelSpec.id === 'lvl-trig-07') {
                    // Pythagoras hypotenuse
                    const rawHyp = Math.sqrt((dx * dx) + (dy * dy));
                    // Scale down for readable integers
                    const scaleFactor = 50; 
                    const calculatedHyp = rawHyp / scaleFactor;
                    finalVal = Math.round(calculatedHyp * 10) / 10;
                } else if (this.levelSpec.id === 'lvl-trig-12') {
                    // Adjacent side length challenge
                    // Adjacent = Opposite / tan θ => Target ratio 0.75, opposite = 6.
                    // Map drag adjacent distance
                    const scaleFactor = 40; 
                    finalVal = Math.round((dx / scaleFactor) * 10) / 10;
                } else {
                    // standard sin/cos/tan ratio
                    const hyp = Math.sqrt((dx * dx) + (dy * dy));
                    const formula = this.levelSpec.trigFormulaType || 'sin';
                    if (formula === 'sin') {
                        finalVal = dy / hyp;
                    } else if (formula === 'cos') {
                        finalVal = dx / hyp;
                    } else if (formula === 'tan') {
                        finalVal = dy / dx;
                    }
                    finalVal = Math.round(finalVal * 1000) / 1000;
                }

                this.syncValueToReact(finalVal);
            }
        });

        // Event Listeners for scene switching/level loading
        const onLoadLevel = (levelData: any) => {
            if (!this.scene || !this.scene.systems) return;
            if (!levelData.id.startsWith('lvl-trig-')) {
                this.isLevelActive = false;
                this.scene.start('LevelScene');
                return;
            }

            this.levelSpec = getLevelSpec(levelData.id, levelData);
            this.isLevelActive = true;

            this.levelTitleText.setText(`Chapter 8: ${levelData.title}`);
            this.statusInfoText.setText(`Concept: ${levelData.concept}`);
            if (this.levelSpec) {
                this.formulaOverlayText.setText(this.levelSpec.formulaDisplay);
            }

            // Reposition formula overlay on resize safety
            this.formulaOverlayText.setPosition(25, this.cameras.main.height - 25);

            this.resetVisualState();
            this.redrawScene();
        };

        const onUserInputChanged = (data: { value: string, levelId: string }) => {
            if (!this.scene || !this.scene.systems) return;
            if (!this.isLevelActive || !this.levelSpec || data.levelId !== this.levelSpec.id) return;
            const val = parseFloat(data.value);
            if (!isNaN(val)) {
                // If React changes the slider/input, reflect smoothly in Phaser
                const mode = this.levelSpec.trigMode || 'angle';
                if (mode === 'angle' || mode === 'identity' || mode === 'complementary') {
                    this.currentAngle = Phaser.Math.Clamp(val, 0, 90);
                } else {
                    // Set default triangle dimensions matching ratio
                    if (this.levelSpec.id === 'lvl-trig-07') {
                        // Pythagorean hypotenuse
                        const sideC = val;
                        // sideC² = sideA² + sideB² (3, 4, 5 pattern)
                        this.currentWidth = (sideC * 4 / 5) * 50;
                        this.currentHeight = (sideC * 3 / 5) * 50;
                    } else if (this.levelSpec.id === 'lvl-trig-12') {
                        // Adjacent target
                        this.currentWidth = val * 40;
                        this.currentHeight = 6 * 40;
                    } else {
                        const formula = this.levelSpec.trigFormulaType || 'sin';
                        if (formula === 'sin') {
                            this.currentHeight = val * 250;
                            this.currentWidth = Math.sqrt(250 * 250 - this.currentHeight * this.currentHeight);
                        } else if (formula === 'cos') {
                            this.currentWidth = val * 250;
                            this.currentHeight = Math.sqrt(250 * 250 - this.currentWidth * this.currentWidth);
                        } else if (formula === 'tan') {
                            this.currentWidth = 200;
                            this.currentHeight = val * 200;
                        }
                    }
                }
            }
        };

        const onBoardExamInputChanged = (data: { inputs: string[], levelId: string }) => {
            if (!this.scene || !this.scene.systems) return;
            if (!this.isLevelActive || !this.levelSpec || data.levelId !== this.levelSpec.id) return;
            if (data.inputs[0] !== undefined) {
                onUserInputChanged({ value: data.inputs[0], levelId: data.levelId });
            }
        };

        EventBus.on('load-level', onLoadLevel);
        EventBus.on('user-input-changed', onUserInputChanged);
        EventBus.on('board-exam-input-changed', onBoardExamInputChanged);

        const cleanup = () => {
            EventBus.off('load-level', onLoadLevel);
            EventBus.off('user-input-changed', onUserInputChanged);
            EventBus.off('board-exam-input-changed', onBoardExamInputChanged);
        };
        this.events.once('shutdown', cleanup);
        this.events.once('destroy', cleanup);

        // Handle canvas resize (e.g., orientation change, container resize on mobile)
        this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
            this.cameras.main.setSize(gameSize.width, gameSize.height);
            if (this.formulaOverlayText) {
                this.formulaOverlayText.setPosition(25, gameSize.height - 35);
            }
        });

        // Let the system know the game is booted
        EventBus.emit('game-ready');
    }

    private syncValueToReact(value: number) {
        if (!this.levelSpec) return;
        EventBus.emit('user-input-changed', {
            value: String(value),
            levelId: this.levelSpec.id
        });
        EventBus.emit('board-exam-input-changed', {
            inputs: [String(value)],
            levelId: this.levelSpec.id
        });
    }

    private triggerSnapFlash() {
        this.tweens.add({
            targets: this.dragHandle,
            scaleX: 1.6,
            scaleY: 1.6,
            duration: 100,
            yoyo: true,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.dragHandle.setScale(1.0);
            }
        });
    }

    private resetVisualState() {
        this.currentAngle = 0;
        this.currentWidth = 200;
        this.currentHeight = 150;

        // Clear previous texts
        Object.values(this.dimensionLabels).forEach(lbl => lbl.destroy());
        this.dimensionLabels = {};
    }

    update() {
        if (!this.isLevelActive || !this.levelSpec) return;
        this.redrawScene();
    }

    private redrawScene() {
        this.mainGraphics.clear();
        this.glowGraphics.clear();
        this.backgroundGraphics.clear();

        const mode = this.levelSpec?.trigMode || 'angle';

        if (mode === 'angle') {
            this.renderAngleFoundations();
        } else if (mode === 'ratio') {
            this.renderRatiosTriangle();
        } else if (mode === 'identity') {
            this.renderIdentityLab();
        } else if (mode === 'complementary') {
            this.renderComplementaryGrid();
        } else if (mode === 'heights_distances' || mode === 'boss') {
            this.renderHeightsLandscape();
        }
    }

    // ==========================================
    // MODE 1: Angle Foundations (World 1)
    // ==========================================
    private renderAngleFoundations() {
        const cx = this.cameras.main.width / 2;
        const cy = this.cameras.main.height / 2 + 30;
        const radius = Math.min(180, Math.min(this.cameras.main.width, this.cameras.main.height) * 0.38);

        // Draw dynamic coordinate baselines (dashed horizontal baseline)
        const extent = radius + 60;
        this.backgroundGraphics.lineStyle(2, 0xcbd5e1, 1);
        this.backgroundGraphics.lineBetween(cx - extent, cy, cx + extent, cy);
        this.backgroundGraphics.lineBetween(cx, cy - extent, cx, cy + 20);

        // Draw reference arc
        this.backgroundGraphics.lineStyle(1.5, 0x94a3b8, 0.5);
        this.backgroundGraphics.beginPath();
        this.backgroundGraphics.arc(cx, cy, radius, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(360), false);
        this.backgroundGraphics.strokePath();

        // Target angle beam (dashed amber line)
        const targetAngle = this.levelSpec?.trigTargetAngle || 45;
        const targetRad = Phaser.Math.DegToRad(targetAngle);
        const tx = cx + radius * Math.cos(targetRad);
        const ty = cy - radius * Math.sin(targetRad); // invert Y

        this.backgroundGraphics.lineStyle(2, 0xf59e0b, 0.4);
        this.drawDashedLine(this.backgroundGraphics, cx, cy, tx, ty, 5, 5);

        // Draw sweeping sector arc
        const currentRad = Phaser.Math.DegToRad(this.currentAngle);
        this.mainGraphics.fillStyle(0x06b6d4, 0.08);
        this.mainGraphics.slice(cx, cy, radius - 20, 0, -currentRad, true);
        this.mainGraphics.fillPath();

        // Main laser line (neon cyan glow beam)
        const lx = cx + radius * Math.cos(currentRad);
        const ly = cy - radius * Math.sin(currentRad);

        this.drawNeonLaser(cx, cy, lx, ly, 0x06b6d4);

        // Reposition Interactive Drag Handle
        this.dragHandle.setPosition(lx, ly);
        this.dragHandleLabel.setPosition(lx, ly);

        // Dynamic Angle Text labels
        this.drawOrUpdateLabel('angle_label', `${this.currentAngle}°`, cx + 45 * Math.cos(currentRad / 2), cy - 45 * Math.sin(currentRad / 2), '#0891b2', '14px', '800');
        this.drawOrUpdateLabel('target_label', `TARGET: ${targetAngle}°`, tx + 20, ty - 10, '#d97706', '11px', '700');
    }

    // ==========================================
    // MODE 2: Trigonometric Ratios (World 2)
    // ==========================================
    private renderRatiosTriangle() {
        const layoutScale = Math.min(1, Math.min(this.cameras.main.width, this.cameras.main.height) / 500);
        const cx = this.cameras.main.width / 2 - 120 * layoutScale;
        const cy = this.cameras.main.height / 2 + 100 * layoutScale;

        const w = this.currentWidth;
        const h = this.currentHeight;

        // Draw right-angle square marker at corner (cx + w, cy)
        this.backgroundGraphics.lineStyle(1.5, 0x64748b, 0.8);
        this.backgroundGraphics.lineBetween(cx + w - 15, cy, cx + w - 15, cy - 15);
        this.backgroundGraphics.lineBetween(cx + w - 15, cy - 15, cx + w, cy - 15);

        // Draw base triangle area shape (very subtle fill)
        this.mainGraphics.fillStyle(0x3b82f6, 0.04);
        this.mainGraphics.beginPath();
        this.mainGraphics.moveTo(cx, cy);
        this.mainGraphics.lineTo(cx + w, cy);
        this.mainGraphics.lineTo(cx + w, cy - h);
        this.mainGraphics.closePath();
        this.mainGraphics.fillPath();

        // Draw triangle border (neat premium line)
        this.mainGraphics.lineStyle(2.5, 0x475569, 1);
        this.mainGraphics.strokeTriangle(cx, cy, cx + w, cy, cx + w, cy - h);

        // Highlight Opposite side with Neon Pink
        this.drawNeonLaser(cx + w, cy, cx + w, cy - h, 0xec4899);

        // Highlight Adjacent side with Neon Indigo
        this.drawNeonLaser(cx, cy, cx + w, cy, 0x6366f1);

        // Highlight Hypotenuse with Neon Cyan
        this.drawNeonLaser(cx, cy, cx + w, cy - h, 0x06b6d4);

        // Reposition drag handle at top vertex
        this.dragHandle.setPosition(cx + w, cy - h);
        this.dragHandleLabel.setPosition(cx + w, cy - h);

        // Compute hypotenuse and angle θ for text labeling
        const hypVal = Math.sqrt(w * w + h * h);
        const thetaRad = Math.atan2(h, w);
        const thetaDeg = Math.round(Phaser.Math.RadToDeg(thetaRad));

        // Draw side label texts
        const scaleFactor = this.levelSpec?.id === 'lvl-trig-07' ? 50 : (this.levelSpec?.id === 'lvl-trig-12' ? 40 : 1);
        const displayOpp = (h / scaleFactor).toFixed(1);
        const displayAdj = (w / scaleFactor).toFixed(1);
        const displayHyp = (hypVal / scaleFactor).toFixed(1);

        this.drawOrUpdateLabel('opp_side', `OPPOSITE (AB): ${displayOpp}`, cx + w + 15, cy - h / 2, '#ec4899', '11px', '700');
        this.drawOrUpdateLabel('adj_side', `ADJACENT (BC): ${displayAdj}`, cx + w / 2, cy + 18, '#6366f1', '11px', '700', 0.5);
        this.drawOrUpdateLabel('hyp_side', `HYPOTENUSE (AC): ${displayHyp}`, cx + w / 2 - 30, cy - h / 2 - 15, '#06b6d4', '11px', '700', 0.5);
        
        // Draw Angle θ arc
        this.mainGraphics.lineStyle(1.5, 0x64748b, 0.8);
        this.mainGraphics.beginPath();
        this.mainGraphics.arc(cx, cy, 50, 0, Phaser.Math.DegToRad(-thetaDeg), true);
        this.mainGraphics.strokePath();
        this.drawOrUpdateLabel('theta_label', `θ = ${thetaDeg}°`, cx + 32, cy - 18, '#0f172a', '12px', '800');
    }

    // ==========================================
    // MODE 3: Identity Lab (World 3)
    // ==========================================
    private renderIdentityLab() {
        const cx = this.cameras.main.width / 2;
        const cy = this.cameras.main.height / 2 + 20;
        const radius = Math.min(150, Math.min(this.cameras.main.width, this.cameras.main.height) * 0.33); // unit circle scale

        // Draw unit circle grid
        this.backgroundGraphics.lineStyle(1.5, 0xcbd5e1, 0.8);
        this.backgroundGraphics.strokeCircle(cx, cy, radius);
        
        // Baselines
        this.backgroundGraphics.lineStyle(1, 0x94a3b8, 0.4);
        this.backgroundGraphics.lineBetween(cx - radius - 30, cy, cx + radius + 30, cy);
        this.backgroundGraphics.lineBetween(cx, cy - radius - 30, cx, cy + radius + 30);

        // Active angle calculations
        const currentRad = Phaser.Math.DegToRad(this.currentAngle);
        const px = cx + radius * Math.cos(currentRad);
        const py = cy - radius * Math.sin(currentRad);

        // Sine vertical projection (Neon Pink)
        this.drawNeonLaser(px, cy, px, py, 0xec4899);

        // Cosine horizontal projection (Neon Indigo)
        this.drawNeonLaser(cx, cy, px, cy, 0x6366f1);

        // Radial vector line (Neon Cyan)
        this.drawNeonLaser(cx, cy, px, py, 0x06b6d4);

        // Drag handle positioning
        this.dragHandle.setPosition(px, py);
        this.dragHandleLabel.setPosition(px, py);

        // Projections text labels
        const sinVal = Math.sin(currentRad);
        const cosVal = Math.cos(currentRad);

        this.drawOrUpdateLabel('sin_proj', `sin θ = ${sinVal.toFixed(3)}`, px + 12, cy - (py - cy) / 2 - 60, '#ec4899', '11px', '700');
        this.drawOrUpdateLabel('cos_proj', `cos θ = ${cosVal.toFixed(3)}`, cx + (px - cx) / 2, cy + 18, '#6366f1', '11px', '700', 0.5);
        this.drawOrUpdateLabel('theta_ind', `θ = ${this.currentAngle}°`, cx + 35 * Math.cos(currentRad / 2), cy - 35 * Math.sin(currentRad / 2), '#0f172a', '11px', '800');

        // Draw Pythagorean visual balance indicator (sin²θ + cos²θ = 1.00)
        const totalSum = (sinVal * sinVal) + (cosVal * cosVal);
        this.drawOrUpdateLabel('pythagorean_status', `sin²θ + cos²θ = (${sinVal.toFixed(2)})² + (${cosVal.toFixed(2)})² = ${totalSum.toFixed(2)}`, cx, cy - radius - 20, '#0284c7', '12px', '800', 0.5);
    }

    // ==========================================
    // MODE 4: Complementary Angles (World 4)
    // ==========================================
    private renderComplementaryGrid() {
        const cx = this.cameras.main.width / 2;
        const cy = this.cameras.main.height / 2 + 30;
        const radius = Math.min(180, Math.min(this.cameras.main.width, this.cameras.main.height) * 0.38);

        // Baselines
        const compExtent = radius + 40;
        this.backgroundGraphics.lineStyle(1.5, 0xcbd5e1, 1);
        this.backgroundGraphics.lineBetween(cx - compExtent, cy, cx + compExtent, cy);
        this.backgroundGraphics.lineBetween(cx, cy - compExtent, cx, cy + 20);

        // Perpendicular bounding box representing 90°
        this.backgroundGraphics.lineStyle(1, 0xef4444, 0.4);
        this.backgroundGraphics.lineBetween(cx + radius, cy, cx + radius, cy - radius);
        this.backgroundGraphics.lineBetween(cx, cy - radius, cx + radius, cy - radius);

        const currentRad = Phaser.Math.DegToRad(this.currentAngle);
        const px = cx + radius * Math.cos(currentRad);
        const py = cy - radius * Math.sin(currentRad);

        // Draw primary angle sweep (Neon Cyan)
        this.drawNeonLaser(cx, cy, px, py, 0x06b6d4);

        // Draw complementary mirror beam (90° - θ) (Neon Orange)
        const compAngle = 90 - this.currentAngle;
        const compRad = Phaser.Math.DegToRad(compAngle);
        const mx = cx + radius * Math.cos(compRad);
        const my = cy - radius * Math.sin(compRad);

        this.backgroundGraphics.lineStyle(2.5, 0xf97316, 0.8);
        this.drawDashedLine(this.backgroundGraphics, cx, cy, mx, my, 6, 4);

        // Draw complementary bridge connector joining both peaks
        this.backgroundGraphics.lineStyle(2, 0x10b981, 0.5);
        this.backgroundGraphics.lineBetween(px, py, mx, my);

        // Drag handle
        this.dragHandle.setPosition(px, py);
        this.dragHandleLabel.setPosition(px, py);

        // Label markings
        this.drawOrUpdateLabel('angle_a', `θ = ${this.currentAngle}°`, cx + 55, cy - 20, '#06b6d4', '12px', '800');
        this.drawOrUpdateLabel('angle_b', `90° - θ = ${compAngle}°`, cx + 20, cy - 55, '#f97316', '12px', '800');
        this.drawOrUpdateLabel('bridge_conn', `COMPLEMENTARY SYNC`, (px + mx) / 2, (py + my) / 2 - 12, '#10b981', '9px', '800', 0.5);
    }

    // ==========================================
    // MODE 5: Heights & Distances (World 5)
    // ==========================================
    private renderHeightsLandscape() {
        const heightsScale = Math.min(1, Math.min(this.cameras.main.width, this.cameras.main.height) / 500);
        const cx = this.cameras.main.width / 2 - 140 * heightsScale;
        const cy = this.cameras.main.height / 2 + 100 * heightsScale;

        const w = this.currentWidth;
        const h = this.currentHeight;

        // 1. Draw premium silhouette vector landscape backgrounds
        this.backgroundGraphics.fillStyle(0xcbd5e1, 0.3); // Sky ground baseline
        this.backgroundGraphics.fillRect(cx - 80, cy, this.cameras.main.width, 10);

        if (this.levelSpec?.id === 'lvl-trig-26') {
            // Draw stylized minimal Mountain silhouette
            this.backgroundGraphics.fillStyle(0x94a3b8, 0.4);
            this.backgroundGraphics.beginPath();
            this.backgroundGraphics.moveTo(cx + w - 100, cy);
            this.backgroundGraphics.lineTo(cx + w, cy - h); // Peak
            this.backgroundGraphics.lineTo(cx + w + 100, cy);
            this.backgroundGraphics.closePath();
            this.backgroundGraphics.fillPath();

            // Peak indicator line
            this.backgroundGraphics.lineStyle(1.5, 0xef4444, 0.8);
            this.backgroundGraphics.lineBetween(cx + w, cy - h, cx + w, cy);
        } else {
            // Draw minimalist Observation Tower/Building silhouette
            this.backgroundGraphics.fillStyle(0x64748b, 0.45);
            this.backgroundGraphics.fillRect(cx + w - 25, cy - h, 50, h);
            
            // Tower dome top
            this.backgroundGraphics.fillStyle(0x475569, 0.7);
            this.backgroundGraphics.fillEllipse(cx + w, cy - h, 20, 15);
        }

        // 2. Draw neat dashed baseline measurement markers
        this.backgroundGraphics.lineStyle(2, 0x64748b, 0.7);
        this.drawDashedLine(this.backgroundGraphics, cx, cy, cx + w, cy, 6, 6); // Ground range
        this.drawDashedLine(this.backgroundGraphics, cx + w, cy - h, cx + w, cy, 6, 6); // Height

        // 3. Main laser sight vector line of sight (Neon Cyan)
        this.drawNeonLaser(cx, cy, cx + w, cy - h, 0x06b6d4);

        // Reposition drag handle at top summit target point
        this.dragHandle.setPosition(cx + w, cy - h);
        this.dragHandleLabel.setPosition(cx + w, cy - h);

        // Compute angle of elevation
        const thetaRad = Math.atan2(h, w);
        const thetaDeg = Math.round(Phaser.Math.RadToDeg(thetaRad));

        // Display height/distance dimensions based on specific level values
        let displayHeight = "h";
        let displayDistance = "d";

        if (this.levelSpec?.id === 'lvl-trig-25') {
            displayDistance = "20m";
            displayHeight = `${(20 * Math.tan(thetaRad)).toFixed(1)}m`;
        } else if (this.levelSpec?.id === 'lvl-trig-26') {
            displayDistance = "100m";
            displayHeight = `${(100 * Math.tan(thetaRad)).toFixed(1)}m`;
        } else if (this.levelSpec?.id === 'lvl-trig-27') {
            displayDistance = "10m";
            const ladderLen = 10 / Math.cos(thetaRad);
            this.drawOrUpdateLabel('hyp_len', `Ladder: ${ladderLen.toFixed(1)}m`, cx + w/2 - 20, cy - h/2 - 20, '#0f172a', '11px', '700');
        } else if (this.levelSpec?.id === 'lvl-trig-28') {
            displayHeight = "50m";
            displayDistance = `${(50 / Math.tan(thetaRad)).toFixed(1)}m`;
        } else if (this.levelSpec?.id === 'lvl-trig-29') {
            displayHeight = `${(40 * Math.tan(thetaRad)).toFixed(1)}m`;
            // Two towers baseline division representation
            this.backgroundGraphics.lineStyle(1.5, 0xd97706, 0.7);
            this.backgroundGraphics.lineBetween(cx + w / 2, cy, cx + w / 2, cy - h);
        }

        // Draw dynamic numeric overlay markers on sides
        this.drawOrUpdateLabel('obs_height', `Height (h): ${displayHeight}`, cx + w + 35, cy - h / 2, '#475569', '11px', '700');
        this.drawOrUpdateLabel('obs_distance', `Distance (d): ${displayDistance}`, cx + w / 2, cy + 18, '#475569', '11px', '700', 0.5);

        // Draw Angle of Elevation Arc at bottom-left corner
        this.mainGraphics.lineStyle(2, 0x0f172a, 0.8);
        this.mainGraphics.beginPath();
        this.mainGraphics.arc(cx, cy, 60, 0, Phaser.Math.DegToRad(-thetaDeg), true);
        this.mainGraphics.strokePath();
        this.drawOrUpdateLabel('elevation_angle', `Elevation: ${thetaDeg}°`, cx + 45, cy - 22, '#0f172a', '11px', '800');
    }

    // ==========================================
    // HELPER: Neon overlap line drawing utility
    // ==========================================
    private drawNeonLaser(x1: number, y1: number, x2: number, y2: number, hexColor: number) {
        // Overlay three lines to create volumetric neon glowing filter
        this.glowGraphics.lineStyle(8, hexColor, 0.15);
        this.glowGraphics.lineBetween(x1, y1, x2, y2);

        this.glowGraphics.lineStyle(4, hexColor, 0.4);
        this.glowGraphics.lineBetween(x1, y1, x2, y2);

        this.mainGraphics.lineStyle(2, 0xffffff, 1.0);
        this.mainGraphics.lineBetween(x1, y1, x2, y2);
    }

    // ==========================================
    // HELPER: Dashed line generator
    // ==========================================
    private drawDashedLine(graphics: GameObjects.Graphics, x1: number, y1: number, x2: number, y2: number, dashLength: number, gapLength: number) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const dashes = Math.floor(distance / (dashLength + gapLength));
        
        const deltaX = (dx / distance) * (dashLength + gapLength);
        const deltaY = (dy / distance) * (dashLength + gapLength);
        const dashX = (dx / distance) * dashLength;
        const dashY = (dy / distance) * dashLength;

        for (let i = 0; i < dashes; i++) {
            const startX = x1 + i * deltaX;
            const startY = y1 + i * deltaY;
            graphics.lineBetween(startX, startY, startX + dashX, startY + dashY);
        }
    }

    // ==========================================
    // HELPER: Text labels tracking & auto-rendering
    // ==========================================
    private drawOrUpdateLabel(key: string, text: string, x: number, y: number, color: string, fontSize = '11px', fontWeight = '600', originX = 0) {
        if (this.dimensionLabels[key]) {
            this.dimensionLabels[key].setText(text);
            this.dimensionLabels[key].setPosition(x, y);
        } else {
            this.dimensionLabels[key] = this.add.text(x, y, text, {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: fontSize,
                color: color,
                fontStyle: fontWeight === '800' || fontWeight === '700' || fontWeight === '600' ? 'bold' : fontWeight,
                backgroundColor: '#ffffffbf',
                padding: { x: 5, y: 3 }
            }).setOrigin(originX, 0.5);
        }
    }
}
