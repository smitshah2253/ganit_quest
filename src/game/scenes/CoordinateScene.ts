import Phaser, { Scene, GameObjects } from 'phaser';
import { EventBus } from '../EventBus';
import { getLevelSpec } from '../../data/levelSpecs';
import type { LevelSpecification } from '../../data/levelSpecs';

export class CoordinateScene extends Scene {
    private levelSpec: LevelSpecification | null = null;
    private isLevelActive: boolean = false;

    // Grid details
    private gridGraphics!: GameObjects.Graphics;
    private laserGraphics!: GameObjects.Graphics;
    private spacing: number = 30;
    private centerX: number = 0;
    private centerY: number = 0;

    // Interactive element mapping
    private pointsList: Array<{
        gameObject: GameObjects.Arc;
        labelObject: GameObjects.Text;
        projectionX: GameObjects.Graphics;
        projectionY: GameObjects.Graphics;
        gridX: number;
        gridY: number;
        initialX: number;
        initialY: number;
        label: string;
        draggable: boolean;
    }> = [];

    // Overlay texts
    private coordinateInfoText!: GameObjects.Text;

    constructor() {
        super('CoordinateScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#ecf2f7');

        // Main layers
        this.gridGraphics = this.add.graphics();
        this.laserGraphics = this.add.graphics();

        // Level details overlay
        this.add.text(20, 20, 'Coordinate Geometry Lab', {
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: '#64748b',
            fontStyle: 'bold'
        });

        this.coordinateInfoText = this.add.text(20, 42, 'Awaiting Snaps...', {
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            color: '#3b82f6',
            fontStyle: '600'
        });

        // Event Listeners
        const onLoadLevel = (levelData: any) => {
            if (!this.scene || !this.scene.systems) return;
            if (levelData.id.startsWith('lvl-trig-')) {
                this.isLevelActive = false;
                this.scene.start('TrigonometryScene');
                return;
            }
            if (!levelData.id.startsWith('lvl-cg-')) {
                this.isLevelActive = false;
                this.scene.start('LevelScene');
                return;
            }
            this.levelSpec = getLevelSpec(levelData.id, levelData);
            this.isLevelActive = true;
            this.coordinateInfoText.setText(`Active: ${levelData.title}`);
            this.setupGrid();
        };

        const onUserInputChanged = (data: { value: string, levelId: string }) => {
            if (!this.scene || !this.scene.systems) return;
            if (!this.isLevelActive || !this.levelSpec || data.levelId !== this.levelSpec.id) return;
            // Update node position if user types coords
            const val = parseFloat(data.value);
            if (!isNaN(val)) {
                // If there's a draggable node, we can position it relative to input
                const draggableNode = this.pointsList.find(p => p.draggable);
                if (draggableNode) {
                    // Update either X or Y depending on the question's target
                    let targetGridX = draggableNode.gridX;
                    let targetGridY = draggableNode.gridY;

                    if (this.levelSpec.id === 'lvl-cg-01') {
                        // Dist from Y-axis is x = val
                        targetGridX = val;
                        targetGridY = 3;
                    } else if (this.levelSpec.id === 'lvl-cg-02') {
                        // Dist from X-axis is y = val
                        targetGridX = -5;
                        targetGridY = val;
                    } else if (this.levelSpec.id === 'lvl-cg-03') {
                        // Abscissa is x = val
                        targetGridX = val;
                        targetGridY = -2;
                    } else if (this.levelSpec.id === 'lvl-cg-04') {
                        // Ordinate is y = val
                        targetGridX = -3;
                        targetGridY = val;
                    } else if (this.levelSpec.id === 'lvl-cg-05') {
                        // Quadrant III (x * y = 16) -> let's map input directly to (-4, -4)
                        if (val === 16) {
                            targetGridX = -4;
                            targetGridY = -4;
                        }
                    } else if (this.levelSpec.id === 'lvl-cg-06') {
                        // Dist from origin = 5 -> target is (3, 4)
                        if (val === 5) {
                            targetGridX = 3;
                            targetGridY = 4;
                        }
                    } else if (this.levelSpec.id === 'lvl-cg-07') {
                        // Target is (2, 3)
                        if (val === 5) {
                            targetGridX = 2;
                            targetGridY = 3;
                        }
                    }

                    this.animatePointToGrid(draggableNode, targetGridX, targetGridY);
                }
            }
        };

        const onBoardExamInputChanged = (data: { inputs: string[], levelId: string }) => {
            if (!this.scene || !this.scene.systems) return;
            if (!this.isLevelActive || !this.levelSpec || data.levelId !== this.levelSpec.id) return;
            // Handle multi-stage notebook inputs
            const draggableNode = this.pointsList.find(p => p.draggable);
            if (draggableNode) {
                let targetX = draggableNode.gridX;
                let targetY = draggableNode.gridY;

                // Map specific levels
                if (data.inputs[0] !== undefined) {
                    const parsed = parseFloat(data.inputs[0]);
                    if (!isNaN(parsed)) {
                        if (this.levelSpec.id === 'lvl-cg-16') {
                            // Equidistant P(x, 0)
                            targetX = parsed;
                            targetY = 0;
                        } else if (this.levelSpec.id === 'lvl-cg-17') {
                            // Collinear B(4, k)
                            targetX = 4;
                            targetY = parsed;
                        } else if (this.levelSpec.id.includes('midpoint') || this.levelSpec.id === 'lvl-cg-19') {
                            targetX = parsed;
                            targetY = 6;
                        } else if (this.levelSpec.id === 'lvl-cg-20') {
                            targetX = -2;
                            targetY = parsed;
                        } else if (this.levelSpec.id === 'lvl-cg-21') {
                            targetX = parsed;
                            targetY = 5;
                        } else if (this.levelSpec.id === 'lvl-cg-22') {
                            targetX = 1;
                            targetY = parsed;
                        } else if (this.levelSpec.id === 'lvl-cg-23') {
                            targetX = parsed;
                            targetY = 3;
                        } else if (this.levelSpec.id === 'lvl-cg-24') {
                            targetX = parsed;
                            targetY = 0;
                        } else if (this.levelSpec.id === 'lvl-cg-28') {
                            targetX = parsed;
                            targetY = 6;
                        } else if (this.levelSpec.id === 'lvl-cg-29') {
                            targetX = 3;
                            targetY = parsed;
                        } else if (this.levelSpec.id === 'lvl-cg-30') {
                            targetX = parsed;
                            targetY = 2; // Approximate
                        }
                        this.animatePointToGrid(draggableNode, targetX, targetY);
                    }
                }
            }
        };

        // Attach listeners
        EventBus.on('load-level', onLoadLevel);
        EventBus.on('user-input-changed', onUserInputChanged);
        EventBus.on('board-exam-input-changed', onBoardExamInputChanged);

        // Cleanup on Scene shutdown/destroy
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
            if (this.isLevelActive && this.levelSpec) {
                this.setupGrid();
            }
        });

        // Trigger load-level if levelData is already in PhaserGame
        EventBus.emit('game-ready');
    }

    private setupGrid() {
        if (!this.levelSpec) return;

        // Reset previous nodes
        this.pointsList.forEach(p => {
            p.gameObject.destroy();
            p.labelObject.destroy();
            p.projectionX.destroy();
            p.projectionY.destroy();
        });
        this.pointsList = [];

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.centerX = width / 2;
        this.centerY = height / 2;
        // Make the grid fit nicely
        this.spacing = Math.min(width, height) / 24;
        if (this.spacing < 20) this.spacing = 20;

        this.drawCartesianGrid();

        // Load level-specific nodes from specs
        if (this.levelSpec.points) {
            this.levelSpec.points.forEach((pt, index) => {
                let startGridX = pt.x;
                let startGridY = pt.y;

                // For World 1 & 2 plotting levels, let's start the node at (0, 0) so the user drags it to target
                if (pt.draggable && (this.levelSpec!.id.startsWith('lvl-cg-01') || 
                                     this.levelSpec!.id.startsWith('lvl-cg-02') ||
                                     this.levelSpec!.id.startsWith('lvl-cg-03') ||
                                     this.levelSpec!.id.startsWith('lvl-cg-04') ||
                                     this.levelSpec!.id.startsWith('lvl-cg-05') ||
                                     this.levelSpec!.id.startsWith('lvl-cg-06') ||
                                     this.levelSpec!.id.startsWith('lvl-cg-07') ||
                                     this.levelSpec!.id.startsWith('lvl-cg-12'))) {
                    startGridX = 0;
                    startGridY = 0;
                }

                this.createCoordinatePoint(startGridX, startGridY, pt.label, pt.draggable ?? false, index);
            });
        }

        this.updateLaserLines();
    }

    private drawCartesianGrid() {
        this.gridGraphics.clear();

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Draw light grid lines
        this.gridGraphics.lineStyle(1, 0xcbd5e1, 0.4);

        // Vertical Grid lines
        for (let i = -10; i <= 10; i++) {
            const x = this.centerX + i * this.spacing;
            this.gridGraphics.lineBetween(x, 0, x, height);

            // X-Axis Numbers
            if (i !== 0) {
                this.add.text(x, this.centerY + 8, i.toString(), {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: '#64748b',
                    fontStyle: '600'
                }).setOrigin(0.5);
            }
        }

        // Horizontal Grid lines
        for (let j = -10; j <= 10; j++) {
            const y = this.centerY - j * this.spacing;
            this.gridGraphics.lineBetween(0, y, width, y);

            // Y-Axis Numbers
            if (j !== 0) {
                this.add.text(this.centerX - 14, y, j.toString(), {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: '#64748b',
                    fontStyle: '600'
                }).setOrigin(0.5);
            }
        }

        // Bold Primary Axes
        this.gridGraphics.lineStyle(3, 0x475569, 0.85);
        this.gridGraphics.lineBetween(this.centerX, 0, this.centerX, height);
        this.gridGraphics.lineBetween(0, this.centerY, width, this.centerY);

        // Draw Origin Label
        this.add.text(this.centerX - 10, this.centerY + 8, '0', {
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            color: '#475569',
            fontStyle: '700'
        }).setOrigin(0.5);

        // Axis Titles
        this.add.text(width - 25, this.centerY - 15, 'X', {
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            color: '#1e293b',
            fontStyle: '800'
        }).setOrigin(0.5);

        this.add.text(this.centerX + 15, 20, 'Y', {
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            color: '#1e293b',
            fontStyle: '800'
        }).setOrigin(0.5);
    }

    private createCoordinatePoint(gridX: number, gridY: number, label: string, draggable: boolean, index: number) {
        const screenX = this.centerX + gridX * this.spacing;
        const screenY = this.centerY - gridY * this.spacing;

        // Custom premium colored points: draggable are amber/blue, fixed are slate/blue
        const mainColor = draggable ? 0xf59e0b : 0x3b82f6; // Amber for drag, Blue for fixed
        
        // Solid core point circle
        const circle = this.add.circle(screenX, screenY, 9, mainColor).setDepth(15);
        circle.setStrokeStyle(3, 0xffffff);

        // Glowing outer halo
        const halo = this.add.circle(screenX, screenY, 18, mainColor, 0.15).setDepth(14);
        
        // Text label
        const labelText = this.add.text(screenX + 14, screenY - 14, `${label} (${gridX}, ${gridY})`, {
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            color: draggable ? '#b45309' : '#1d4ed8',
            fontStyle: '800',
            backgroundColor: '#ffffffbf',
            padding: { x: 4, y: 2 }
        }).setDepth(20).setOrigin(0, 0.5);

        // Dynamic projection lines graphics
        const projX = this.add.graphics().setDepth(5);
        const projY = this.add.graphics().setDepth(5);

        const pointData = {
            gameObject: circle,
            labelObject: labelText,
            projectionX: projX,
            projectionY: projY,
            gridX,
            gridY,
            initialX: gridX,
            initialY: gridY,
            label,
            draggable
        };

        this.pointsList.push(pointData);
        this.updateProjections(pointData);

        if (draggable) {
            circle.setInteractive({ useHandCursor: true });
            this.input.setDraggable(circle);

            // Drag behavior
            circle.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
                // Clamp within grid boundaries
                const maxOffset = 10 * this.spacing;
                const clampedX = Phaser.Math.Clamp(dragX, this.centerX - maxOffset, this.centerX + maxOffset);
                const clampedY = Phaser.Math.Clamp(dragY, this.centerY - maxOffset, this.centerY + maxOffset);

                circle.x = clampedX;
                circle.y = clampedY;
                halo.x = clampedX;
                halo.y = clampedY;

                // Live calculate grid snaps
                const liveGridX = Math.round((clampedX - this.centerX) / this.spacing);
                const liveGridY = Math.round(-(clampedY - this.centerY) / this.spacing);

                pointData.gridX = liveGridX;
                pointData.gridY = liveGridY;

                labelText.x = clampedX + 14;
                labelText.y = clampedY - 14;
                labelText.setText(`${label} (${liveGridX}, ${liveGridY})`);

                this.updateProjections(pointData);
                this.updateLaserLines();

                // Live emit point drag to React input sync
                EventBus.emit('coordinate-point-dragged', {
                    x: liveGridX,
                    y: liveGridY,
                    label,
                    index,
                    levelId: this.levelSpec?.id
                });
            });

            // On drag release, snap node to clean coordinates
            circle.on('dragend', () => {
                const snappedX = this.centerX + pointData.gridX * this.spacing;
                const snappedY = this.centerY - pointData.gridY * this.spacing;

                this.tweens.add({
                    targets: [circle, halo],
                    x: snappedX,
                    y: snappedY,
                    duration: 100,
                    ease: 'Power2',
                    onUpdate: () => {
                        labelText.x = circle.x + 14;
                        labelText.y = circle.y - 14;
                        this.updateProjections(pointData);
                        this.updateLaserLines();
                    }
                });
            });
        }
    }

    private updateProjections(pt: typeof this.pointsList[0]) {
        pt.projectionX.clear();
        pt.projectionY.clear();

        // Project lines to X and Y axes
        pt.projectionX.lineStyle(1.5, 0x64748b, 0.5);
        pt.projectionX.lineBetween(pt.gameObject.x, pt.gameObject.y, pt.gameObject.x, this.centerY);

        pt.projectionY.lineStyle(1.5, 0x64748b, 0.5);
        pt.projectionY.lineBetween(pt.gameObject.x, pt.gameObject.y, this.centerX, pt.gameObject.y);
    }

    private updateLaserLines() {
        this.laserGraphics.clear();
        if (!this.levelSpec || !this.levelSpec.lineConnections) return;

        // Draw connections (Distance lines, midpoints, polygons)
        this.levelSpec.lineConnections.forEach(([i1, i2]) => {
            const pt1 = this.pointsList[i1];
            const pt2 = this.pointsList[i2];
            if (pt1 && pt2) {
                // High contrast vector glowing lines
                this.laserGraphics.lineStyle(4, 0x10b981, 0.8); // Glowing green
                this.laserGraphics.lineBetween(pt1.gameObject.x, pt1.gameObject.y, pt2.gameObject.x, pt2.gameObject.y);

                // Add small midpoint overlay label if it is distance/section
                if (this.levelSpec!.id.startsWith('lvl-cg-13') || this.levelSpec!.id.startsWith('lvl-cg-14')) {
                    this.laserGraphics.lineStyle(2, 0xffffff, 0.9);
                }
            }
        });
    }

    private animatePointToGrid(pt: typeof this.pointsList[0], gridX: number, gridY: number) {
        const targetX = this.centerX + gridX * this.spacing;
        const targetY = this.centerY - gridY * this.spacing;

        pt.gridX = gridX;
        pt.gridY = gridY;

        this.tweens.add({
            targets: pt.gameObject,
            x: targetX,
            y: targetY,
            duration: 350,
            ease: 'Cubic.easeOut',
            onUpdate: () => {
                pt.labelObject.x = pt.gameObject.x + 14;
                pt.labelObject.y = pt.gameObject.y - 14;
                pt.labelObject.setText(`${pt.label} (${gridX}, ${gridY})`);
                this.updateProjections(pt);
                this.updateLaserLines();
            }
        });
    }
}
