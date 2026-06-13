import Phaser, { Scene, GameObjects } from 'phaser';
import { EventBus } from '../EventBus';
import { getLevelSpec } from '../../data/levelSpecs';
import type { LevelSpecification } from '../../data/levelSpecs';
import { soundManager } from '../SoundManager';

// Light Academic Theme Colors
const BG_COLOR = 0xecf2f7;
const GRID_COLOR = 0xcbd5e1;
const PRIMARY = 0x06b6d4;    // Cyan
const SECONDARY = 0x8b5cf6;  // Purple
const ACCENT = 0xf59e0b;     // Orange
const GROUND_COLOR = 0x94a3b8;
const TEXT_DARK = 0x1e293b;
const FONT = 'Inter, system-ui, sans-serif';

export class ApplicationsTrigScene extends Scene {
  private levelSpec: LevelSpecification | null = null;
  private isLevelActive = false;

  private bgGraphics!: GameObjects.Graphics;
  private mainGraphics!: GameObjects.Graphics;
  private glowGraphics!: GameObjects.Graphics;

  private titleText!: GameObjects.Text;
  private statusText!: GameObjects.Text;
  private formulaText!: GameObjects.Text;
  private measurementLabels: Map<string, GameObjects.Text> = new Map();

  private dragHandle!: GameObjects.Container;
  private dragHandleLabel!: GameObjects.Text;

  private originX!: number;
  private originY!: number;
  private viewScale = 4;

  // State
  private currentAngle = 30;
  private currentHeight = 10;
  private currentDistance = 20;

  constructor() {
    super('ApplicationsTrigScene');
  }

  create() {
    this.cameras.main.setBackgroundColor(BG_COLOR);
    this.originX = this.cameras.main.width / 4;
    this.originY = this.cameras.main.height - 150;

    this.bgGraphics = this.add.graphics();
    this.mainGraphics = this.add.graphics();
    this.glowGraphics = this.add.graphics();

    this.drawGrid();

    this.titleText = this.add.text(22, 18, 'Trigonometry Applications', {
      fontFamily: FONT, fontSize: '14px', color: '#475569', fontStyle: 'bold'
    });

    this.statusText = this.add.text(22, 38, 'Load a level to begin...', {
      fontFamily: FONT, fontSize: '11px', color: '#3b82f6', fontStyle: 'bold'
    });

    this.formulaText = this.add.text(22, this.cameras.main.height - 28, '', {
      fontFamily: FONT, fontSize: '12px', color: '#0f172a', fontStyle: 'bold',
      backgroundColor: '#ffffffd9', padding: { x: 8, y: 4 }
    }).setOrigin(0, 1);

    this.createDragHandle();
    this.setupEventListeners();

    this.scale.on('resize', this.handleResize, this);
    EventBus.emit('game-ready');
  }

  private drawGrid() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    this.bgGraphics.clear();
    this.bgGraphics.lineStyle(1, GRID_COLOR, 0.4);

    for (let x = 0; x <= width; x += 40) {
      this.bgGraphics.lineBetween(x, 0, x, height);
    }
    for (let y = 0; y <= height; y += 40) {
      this.bgGraphics.lineBetween(0, y, width, y);
    }

    // Ground line
    this.bgGraphics.lineStyle(3, GROUND_COLOR, 1);
    this.bgGraphics.lineBetween(0, this.originY, width, this.originY);
  }

  private createDragHandle() {
    const handleCircle = this.add.circle(0, 0, 12, PRIMARY, 1.0).setStrokeStyle(3, 0xffffff);
    const glow = this.add.circle(0, 0, 20, PRIMARY, 0.3);

    this.dragHandle = this.add.container(0, 0, [glow, handleCircle]);
    this.dragHandle.setSize(44, 44);
    this.dragHandle.setInteractive({ useHandCursor: true });
    this.input.setDraggable(this.dragHandle);

    this.dragHandleLabel = this.add.text(0, 0, 'AIM', {
      fontFamily: FONT, fontSize: '10px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.dragHandle.add(this.dragHandleLabel);

    this.tweens.add({ targets: glow, scale: 1.5, alpha: 0, duration: 1000, repeat: -1 });

    this.dragHandle.on('drag', (pointer: Phaser.Input.Pointer) => {
      this.handleDrag(pointer.x, pointer.y);
    });

    this.dragHandle.setVisible(false);
  }

  private setupEventListeners() {
    const onLoadLevel = (data: any) => {
      if (!this.scene?.systems) return;
      if (!data.id.startsWith('lvl-apptrig-')) {
        this.isLevelActive = false;
        return;
      }

      this.levelSpec = getLevelSpec(data.id, data);
      this.isLevelActive = true;

      this.titleText.setText(`Ch 9 – App of Trig: ${data.title ?? data.id}`);
      this.statusText.setText(data.concept ?? '');

      if (this.levelSpec) {
        this.formulaText.setText(this.levelSpec.formulaDisplay ?? '');
        this.currentAngle = this.levelSpec.simulationParams?.angle || 30;
        this.currentHeight = (this.levelSpec.simulationParams as any)?.height || 10;
        this.currentDistance = (this.levelSpec.simulationParams as any)?.distance || 20;
      }

      this.formulaText.setPosition(22, this.cameras.main.height - 28);

      this.clearGraphics();
      this.drawLevel();
    };

    const onUserInput = (d: { value: string; levelId: string }) => {
      if (!this.isLevelActive || !this.levelSpec) return;
      if (d.levelId !== this.levelSpec.id) return;
      // Sync from UI if needed
    };

    const onBoardInput = (d: { inputs: string[]; levelId: string }) => {
      if (!this.isLevelActive || !this.levelSpec) return;
      if (d.levelId !== this.levelSpec.id) return;
    };

    EventBus.on('load-level', onLoadLevel);
    EventBus.on('user-input-changed', onUserInput);
    EventBus.on('board-exam-input-changed', onBoardInput);

    this.events.once('shutdown', () => {
      EventBus.off('load-level', onLoadLevel);
      EventBus.off('user-input-changed', onUserInput);
      EventBus.off('board-exam-input-changed', onBoardInput);
    });
  }

  private clearGraphics() {
    this.mainGraphics.clear();
    this.glowGraphics.clear();
    this.measurementLabels.forEach(label => label.destroy());
    this.measurementLabels.clear();
  }

  private drawLevel() {
    if (!this.levelSpec) return;
    const mode = this.levelSpec.trigMode || 'angle';

    switch (mode) {
      case 'angle':
        this.drawObservationAngle();
        break;
      case 'heights_distances':
        this.drawHeightsAndDistances();
        break;
      case 'boss':
        this.drawBossLakeCloud();
        break;
      default:
        this.drawObservationAngle();
    }
  }

  // --- PART 2 START ---
  private handleDrag(x: number, y: number) {
    if (this.levelSpec?.trigMode === 'angle') {
      const dx = x - this.originX;
      const dy = this.originY - y;
      let angleRad = Math.atan2(dy, dx);
      if (angleRad < 0) angleRad += Math.PI * 2;
      let angleDeg = Phaser.Math.RadToDeg(angleRad);
      angleDeg = Phaser.Math.Clamp(angleDeg, 0, 90);
      
      const prevAngle = this.currentAngle;
      this.currentAngle = Math.round(angleDeg);
      
      // Snap to standard angles
      const standardAngles = [30, 45, 60];
      for (const std of standardAngles) {
        if (Math.abs(this.currentAngle - std) < 3) {
          this.currentAngle = std;
          if (prevAngle !== std) soundManager.playSnap();
          break;
        }
      }
      
      EventBus.emit('user-input-changed', { value: this.currentAngle.toString(), levelId: this.levelSpec?.id });
    } else if (this.levelSpec?.trigMode === 'heights_distances') {
      const isHeightMode = (this.levelSpec.simulationParams as any)?.isHeightMode ?? false;
      if (isHeightMode) {
        const height = (this.originY - y) / this.viewScale;
        this.currentHeight = Phaser.Math.Clamp(Math.round(height), 1, 50);
        EventBus.emit('user-input-changed', { value: this.currentHeight.toString(), levelId: this.levelSpec?.id });
      } else {
        const distance = (x - this.originX) / this.viewScale;
        this.currentDistance = Phaser.Math.Clamp(Math.round(distance), 1, 50);
        EventBus.emit('user-input-changed', { value: this.currentDistance.toString(), levelId: this.levelSpec?.id });
      }
    }
    
    this.clearGraphics();
    this.drawLevel();
  }

  private drawObservationAngle() {
    this.mainGraphics.lineStyle(2, PRIMARY, 1);
    
    // Draw horizontal line (distance)
    const distPx = this.currentDistance * this.viewScale;
    this.mainGraphics.lineBetween(this.originX, this.originY, this.originX + distPx, this.originY);
    
    // Draw vertical line (height)
    const heightPx = Math.tan(Phaser.Math.DegToRad(this.currentAngle)) * distPx;
    this.mainGraphics.lineBetween(this.originX + distPx, this.originY, this.originX + distPx, this.originY - heightPx);
    
    // Draw line of sight
    this.mainGraphics.lineStyle(3, ACCENT, 0.8);
    this.mainGraphics.lineBetween(this.originX, this.originY, this.originX + distPx, this.originY - heightPx);
    
    // Draw angle arc
    this.glowGraphics.lineStyle(2, PRIMARY, 0.8);
    this.glowGraphics.beginPath();
    this.glowGraphics.arc(this.originX, this.originY, 40, 0, Phaser.Math.DegToRad(-this.currentAngle), true);
    this.glowGraphics.strokePath();
    
    // Draw observer point
    this.mainGraphics.fillStyle(TEXT_DARK, 1);
    this.mainGraphics.fillCircle(this.originX, this.originY, 5);
    
    // Draw target object (e.g. top of tower)
    this.mainGraphics.fillStyle(SECONDARY, 1);
    this.mainGraphics.fillCircle(this.originX + distPx, this.originY - heightPx, 8);
    
    this.addLabel('angle', `${this.currentAngle}°`, this.originX + 60, this.originY - 15, '#06b6d4');
    this.addLabel('distance', `x = ${this.currentDistance}m`, this.originX + distPx/2, this.originY + 20, '#64748b');
    this.addLabel('height', `h = ?`, this.originX + distPx + 20, this.originY - heightPx/2, '#8b5cf6');
    
    // Position drag handle
    this.dragHandle.setPosition(this.originX + distPx, this.originY - heightPx);
    this.dragHandle.setVisible(true);
  }

  private drawHeightsAndDistances() {
    this.mainGraphics.lineStyle(2, PRIMARY, 1);
    
    const distPx = this.currentDistance * this.viewScale;
    const heightPx = this.currentHeight * this.viewScale;
    
    // Ground
    this.mainGraphics.lineBetween(this.originX, this.originY, this.originX + distPx, this.originY);
    // Vertical
    this.mainGraphics.lineBetween(this.originX + distPx, this.originY, this.originX + distPx, this.originY - heightPx);
    // Hypotenuse
    this.mainGraphics.lineStyle(2, GRID_COLOR, 0.5);
    this.mainGraphics.lineBetween(this.originX, this.originY, this.originX + distPx, this.originY - heightPx);
    
    // Object (Building/Tower)
    this.mainGraphics.fillStyle(TEXT_DARK, 0.1);
    this.mainGraphics.fillRect(this.originX + distPx - 20, this.originY - heightPx, 40, heightPx);
    this.mainGraphics.lineStyle(2, TEXT_DARK, 0.5);
    this.mainGraphics.strokeRect(this.originX + distPx - 20, this.originY - heightPx, 40, heightPx);
    
    const isHeightMode = (this.levelSpec?.simulationParams as any)?.isHeightMode ?? false;
    
    this.addLabel('height', `h = ${this.currentHeight}m`, this.originX + distPx + 40, this.originY - heightPx/2, isHeightMode ? '#06b6d4' : '#64748b');
    this.addLabel('distance', `d = ${this.currentDistance}m`, this.originX + distPx/2, this.originY + 20, !isHeightMode ? '#06b6d4' : '#64748b');
    
    const angle = Math.round(Phaser.Math.RadToDeg(Math.atan2(heightPx, distPx)));
    this.addLabel('angle', `${angle}°`, this.originX + 40, this.originY - 15, '#f59e0b');
    
    if (isHeightMode) {
      this.dragHandle.setPosition(this.originX + distPx, this.originY - heightPx);
    } else {
      this.dragHandle.setPosition(this.originX + distPx, this.originY);
    }
    this.dragHandle.setVisible(true);
  }

  private drawBossLakeCloud() {
    const cloudHeight = this.currentHeight;
    const hPx = cloudHeight * this.viewScale;
    const dPx = this.currentDistance * this.viewScale;
    
    // Reflection (depth matches height)
    this.glowGraphics.fillStyle(0xffffff, 0.3);
    this.glowGraphics.fillCircle(this.originX + dPx, this.originY + hPx, 20);
    
    // Lines of sight
    this.mainGraphics.lineStyle(2, ACCENT, 0.8);
    this.mainGraphics.lineBetween(this.originX, this.originY - 10, this.originX + dPx, this.originY - hPx); // Up to cloud
    this.mainGraphics.lineStyle(2, SECONDARY, 0.8);
    this.mainGraphics.lineBetween(this.originX, this.originY - 10, this.originX + dPx, this.originY + hPx); // Down to reflection
    
    this.addLabel('cloud', `Cloud`, this.originX + dPx, this.originY - hPx - 30, '#1e293b');
    this.addLabel('reflection', `Reflection`, this.originX + dPx, this.originY + hPx + 30, '#64748b');
    
    this.dragHandle.setPosition(this.originX + dPx, this.originY - hPx);
    this.dragHandle.setVisible(true);
  }

  private addLabel(key: string, text: string, x: number, y: number, color: string) {
    if (this.measurementLabels.has(key)) {
      this.measurementLabels.get(key)!.setText(text).setPosition(x, y);
      return;
    }
    const label = this.add.text(x, y, text, {
      fontFamily: FONT, fontSize: '12px', color: color, fontStyle: 'bold',
      backgroundColor: '#ffffffd9', padding: { x: 4, y: 2 }
    }).setOrigin(0.5);
    this.measurementLabels.set(key, label);
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    this.cameras.main.setSize(gameSize.width, gameSize.height);
    this.originX = gameSize.width / 4;
    this.originY = gameSize.height - 150;
    this.formulaText.setPosition(22, gameSize.height - 28);
    this.drawGrid();
    if (this.isLevelActive) {
      this.clearGraphics();
      this.drawLevel();
    }
  }
}
