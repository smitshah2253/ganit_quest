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

        // Listen for level data from React
        EventBus.on('load-level', (levelData: any) => {
            this.currentLevelData = levelData;
            this.levelSpec = getLevelSpec(levelData.id, levelData);
            this.currentValue = 0;
            this.shapeScale = 0.4; // Default starting scale (40%)
            this.isLevelActive = true;
            
            if (this.statusText) {
                this.statusText.setText(`Shape: ${levelData.shape.toUpperCase()}`);
            }
            
            this.hideLabels();
            this.updateShape();
        });

        // Listen for user input from React
        EventBus.on('user-input-changed', (data: { value: string, levelId: string }) => {
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
        });

        EventBus.emit(EVENTS.GAME_READY, this);
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
        const s = this.shapeScale * 140; // Scaled base dimension
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
