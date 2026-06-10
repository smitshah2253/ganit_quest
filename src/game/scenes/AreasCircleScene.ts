import Phaser, { Scene, GameObjects } from 'phaser';
import { EventBus } from '../EventBus';
import { getLevelSpec } from '../../data/levelSpecs';
import type { LevelSpecification } from '../../data/levelSpecs';
import { soundManager } from '../SoundManager';

const NEON_CYAN = 0x06b6d4;
const ELECTRIC_BLUE = 0x3b82f6;
const PURPLE = 0x8b5cf6;
const GLOWING_ORANGE = 0xf97316;
const DARK_BG = 0xecf2f7; // Updated to match light academic theme
const GRID_COLOR = 0xcbd5e1;
const FONT = 'Inter, system-ui, sans-serif';

export default class AreasCircleScene extends Scene {
  private levelSpec!: LevelSpecification;
  private bgGraphics!: GameObjects.Graphics;
  private mainGraphics!: GameObjects.Graphics;
  private glowGraphics!: GameObjects.Graphics;
  private sectorFill!: GameObjects.Graphics;
  private centerX = 0;
  private centerY = 0;
  private viewScale = 6;
  private currentRadius = 5;
  private radiusHandle!: GameObjects.Container;
  private measurementLabels: Map<string, GameObjects.Text> = new Map();

  constructor() {
    super('AreasCircleScene');
  }

  create() {
    this.cameras.main.setBackgroundColor(DARK_BG);
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2 - 50;
    
    this.bgGraphics = this.add.graphics();
    this.mainGraphics = this.add.graphics();
    this.glowGraphics = this.add.graphics();
    this.sectorFill = this.add.graphics();
    
    this.drawEnergyGrid();
    
    EventBus.on('load-level', this.onLoadLevel, this);
    this.events.on('shutdown', () => {
      EventBus.off('load-level', this.onLoadLevel, this);
    });
  }

  private onLoadLevel = (levelId: string) => {
    if (!levelId.startsWith('lvl-areas-c-')) return;
    this.levelSpec = getLevelSpec(levelId);
    if (!this.levelSpec) return;
    
    this.clearScene();
    this.drawLevel();
    EventBus.emit('scene-ready', { chapter: 'Areas Related to Circles', level: this.levelSpec });
  };

  private clearScene() {
    this.mainGraphics.clear();
    this.glowGraphics.clear();
    this.sectorFill.clear();
    this.measurementLabels.forEach(label => label.destroy());
    this.measurementLabels.clear();
    if (this.radiusHandle) this.radiusHandle.destroy();
  }

  private drawEnergyGrid() {
    for (let i = 1; i <= 8; i++) {
      this.bgGraphics.lineStyle(1, GRID_COLOR, 0.5);
      this.bgGraphics.strokeCircle(this.centerX, this.centerY, i * 40);
    }
    for (let angle = 0; angle < 360; angle += 30) {
      const rad = Phaser.Math.DegToRad(angle);
      this.bgGraphics.lineStyle(1, GRID_COLOR, 0.4);
      this.bgGraphics.lineBetween(this.centerX, this.centerY, 
        this.centerX + Math.cos(rad) * 320, this.centerY + Math.sin(rad) * 320);
    }
    this.bgGraphics.fillStyle(NEON_CYAN, 0.5);
    this.bgGraphics.fillCircle(this.centerX, this.centerY, 4);
  }

  private drawLevel() {
    const spec = this.levelSpec;
    const visualType = spec.visualType || 'areas_circle_resize';
    this.currentRadius = spec.simulationParams?.radius || spec.simulationParams?.targetRadius || 7;
    
    switch (visualType) {
      case 'areas_circle_resize':
      case 'areas_circle_shield':
      case 'areas_circle_dynamic':
      case 'areas_circle_optimize':
      case 'areas_circle_field':
        this.drawInteractiveCircle(spec);
        break;
      case 'areas_circle_circumference':
      case 'areas_circle_navigation':
        this.drawCircumferenceLevel(spec);
        break;
      case 'areas_circle_fill':
      case 'areas_circle_growth':
        this.drawAreaFillLevel(spec);
        break;
      case 'areas_circle_sector':
      case 'areas_circle_scanner':
      case 'areas_circle_radar':
      case 'areas_circle_slice':
        this.drawSectorLevel(spec);
        break;
      case 'areas_circle_ring':
      case 'areas_circle_garden':
        this.drawRingLevel(spec);
        break;
      case 'areas_circle_rotation':
      case 'areas_circle_wheel':
      case 'areas_circle_wheel_system':
      case 'areas_circle_pipe':
        this.drawWheelRotationLevel(spec);
        break;
      case 'areas_circle_arc_route':
      case 'areas_circle_arc_puzzle':
        this.drawArcRouteLevel(spec);
        break;
      case 'areas_circle_semicircle':
        this.drawSemicircleLevel(spec);
        break;
      case 'areas_circle_quadrant':
        this.drawQuadrantLevel(spec);
        break;
      case 'areas_circle_overlap':
        this.drawOverlapLevel(spec);
        break;
      case 'areas_circle_dome':
        this.drawDomeLevel(spec);
        break;
      case 'areas_circle_track':
        this.drawTrackLevel(spec);
        break;
      case 'areas_circle_multi':
        this.drawMultiCircleLevel(spec);
        break;
      default:
        this.drawInteractiveCircle(spec);
    }
    this.drawLevelPanel(spec);
  }

  // --- PART 2 START ---
  private drawInteractiveCircle(spec: LevelSpecification) {
    const targetRadius = spec.simulationParams?.targetRadius || 7;
    
    // Draw target outline if applicable
    if (spec.visualType === 'areas_circle_resize' || spec.visualType === 'areas_circle_shield') {
      this.glowGraphics.lineStyle(2, PURPLE, 0.3);
      this.glowGraphics.strokeCircle(this.centerX, this.centerY, targetRadius * this.viewScale);
    }
    
    // Draw active circle
    this.glowGraphics.lineStyle(4, NEON_CYAN, 0.3);
    this.glowGraphics.strokeCircle(this.centerX, this.centerY, this.currentRadius * this.viewScale + 5);
    
    this.mainGraphics.lineStyle(3, NEON_CYAN, 1);
    this.mainGraphics.strokeCircle(this.centerX, this.centerY, this.currentRadius * this.viewScale);
    
    // Draw radius line
    this.mainGraphics.lineStyle(2, ELECTRIC_BLUE, 0.8);
    this.mainGraphics.lineBetween(this.centerX, this.centerY,
      this.centerX + this.currentRadius * this.viewScale, this.centerY);
    
    // Draw center point
    this.mainGraphics.fillStyle(NEON_CYAN, 1);
    this.mainGraphics.fillCircle(this.centerX, this.centerY, 4);
    
    this.updateMeasurements();
    
    // Add drag handle if it's a resize challenge
    if (spec.visualType === 'areas_circle_resize' || spec.visualType === 'areas_circle_shield') {
      this.createRadiusHandle(spec);
    }
  }

  private createRadiusHandle(spec: LevelSpecification) {
    if (this.radiusHandle) this.radiusHandle.destroy();
    
    const handleX = this.centerX + this.currentRadius * this.viewScale;
    this.radiusHandle = this.add.container(handleX, this.centerY);
    
    const handle = this.add.circle(0, 0, 10, GLOWING_ORANGE, 1).setStrokeStyle(2, 0xffffff);
    const glow = this.add.circle(0, 0, 18, GLOWING_ORANGE, 0.3);
    
    this.radiusHandle.add([glow, handle]);
    this.tweens.add({ targets: glow, scale: 1.5, alpha: 0, duration: 1000, repeat: -1 });
    
    this.radiusHandle.setSize(24, 24);
    this.radiusHandle.setInteractive({ draggable: true, useHandCursor: true });
    this.input.setDraggable(this.radiusHandle);
    
    this.radiusHandle.on('drag', (pointer: Phaser.Input.Pointer) => {
      const dx = pointer.x - this.centerX;
      const dy = pointer.y - this.centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      this.currentRadius = Phaser.Math.Clamp(Math.round(distance / this.viewScale * 10) / 10, 1, 35);
      
      this.radiusHandle.x = this.centerX + this.currentRadius * this.viewScale;
      this.radiusHandle.y = this.centerY; // Keep horizontal for simplicity
      
      this.clearGraphics();
      this.drawInteractiveCircle(spec);
      
      EventBus.emit('user-input-changed', { value: this.currentRadius.toString(), levelId: spec.id });
    });
  }

  private drawCircumferenceLevel(spec: LevelSpecification) {
    this.drawInteractiveCircle(spec);
    
    // Draw circumference path highlight
    this.glowGraphics.lineStyle(4, GLOWING_ORANGE, 0.8);
    this.glowGraphics.beginPath();
    // Simulate drawing circumference
    let progress = 0;
    
    this.time.addEvent({
      delay: 20,
      repeat: 60,
      callback: () => {
        progress += Math.PI * 2 / 60;
        this.glowGraphics.clear();
        this.glowGraphics.lineStyle(4, GLOWING_ORANGE, 0.8);
        this.glowGraphics.beginPath();
        this.glowGraphics.arc(this.centerX, this.centerY, this.currentRadius * this.viewScale, 0, progress, false);
        this.glowGraphics.strokePath();
        
        if (progress >= Math.PI * 2) soundManager.playSuccess();
      }
    });
  }

  private drawAreaFillLevel(spec: LevelSpecification) {
    this.drawInteractiveCircle(spec);
    
    // Animated fill
    let filledSlices = 0;
    const slices = 24;
    const fillNext = () => {
      if (!this.scene.isActive()) return;
      if (filledSlices >= slices) {
        soundManager.playSuccess();
        return;
      }
      
      const startAngle = (filledSlices * 360 / slices) - 90;
      const endAngle = ((filledSlices + 1) * 360 / slices) - 90;
      
      this.sectorFill.fillStyle(NEON_CYAN, 0.5);
      this.sectorFill.beginPath();
      this.sectorFill.moveTo(this.centerX, this.centerY);
      this.sectorFill.arc(this.centerX, this.centerY, this.currentRadius * this.viewScale,
        Phaser.Math.DegToRad(startAngle), Phaser.Math.DegToRad(endAngle), false);
      this.sectorFill.closePath();
      this.sectorFill.fillPath();
      
      filledSlices++;
      this.time.delayedCall(50, fillNext);
    };
    
    this.time.delayedCall(300, fillNext);
  }

  private drawSectorLevel(spec: LevelSpecification) {
    const angle = spec.simulationParams?.angle || 60;
    
    this.mainGraphics.lineStyle(2, ELECTRIC_BLUE, 0.5);
    this.mainGraphics.strokeCircle(this.centerX, this.centerY, this.currentRadius * this.viewScale);
    
    // Draw sector
    const startAngle = -90;
    const endAngle = startAngle + angle;
    
    this.sectorFill.fillStyle(NEON_CYAN, 0.6);
    this.sectorFill.beginPath();
    this.sectorFill.moveTo(this.centerX, this.centerY);
    this.sectorFill.arc(this.centerX, this.centerY, this.currentRadius * this.viewScale,
      Phaser.Math.DegToRad(startAngle), Phaser.Math.DegToRad(endAngle), false);
    this.sectorFill.closePath();
    this.sectorFill.fillPath();
    
    this.sectorFill.lineStyle(2, NEON_CYAN, 1);
    this.sectorFill.strokePath();
    
    // Draw angle indicator
    this.glowGraphics.lineStyle(2, GLOWING_ORANGE, 0.8);
    const arcRadius = this.currentRadius * this.viewScale * 0.4;
    this.glowGraphics.beginPath();
    this.glowGraphics.arc(this.centerX, this.centerY, arcRadius,
      Phaser.Math.DegToRad(startAngle), Phaser.Math.DegToRad(endAngle), false);
    this.glowGraphics.strokePath();
    
    const midRad = Phaser.Math.DegToRad(startAngle + angle / 2);
    this.addLabel('angle', `${angle}°`, 
      this.centerX + Math.cos(midRad) * (arcRadius + 20),
      this.centerY + Math.sin(midRad) * (arcRadius + 20), '#f97316');
      
    this.updateMeasurements();
  }

  private drawRingLevel(spec: LevelSpecification) {
    const outerRadius = spec.simulationParams?.outerRadius || 14;
    const innerRadius = spec.simulationParams?.innerRadius || 7;
    
    this.mainGraphics.lineStyle(2, NEON_CYAN, 1);
    this.mainGraphics.strokeCircle(this.centerX, this.centerY, outerRadius * this.viewScale);
    this.mainGraphics.lineStyle(2, ELECTRIC_BLUE, 1);
    this.mainGraphics.strokeCircle(this.centerX, this.centerY, innerRadius * this.viewScale);
    
    // Fill the ring between inner and outer
    this.sectorFill.fillStyle(PURPLE, 0.5);
    this.sectorFill.beginPath();
    this.sectorFill.arc(this.centerX, this.centerY, outerRadius * this.viewScale, 0, Math.PI * 2, false);
    this.sectorFill.arc(this.centerX, this.centerY, innerRadius * this.viewScale, 0, Math.PI * 2, true);
    this.sectorFill.closePath();
    this.sectorFill.fillPath();
    
    this.addLabel('outer', `R = ${outerRadius}cm`,
      this.centerX + outerRadius * this.viewScale + 20, this.centerY, '#06b6d4');
    this.addLabel('inner', `r = ${innerRadius}cm`,
      this.centerX + innerRadius * this.viewScale / 2, this.centerY + 15, '#3b82f6');
  }

  private drawWheelRotationLevel(spec: LevelSpecification) {
    const radius = spec.simulationParams?.radius || 7;
    const rotations = spec.simulationParams?.rotations || 1;
    
    // Draw wheel
    this.mainGraphics.lineStyle(3, NEON_CYAN, 1);
    this.mainGraphics.strokeCircle(this.centerX, this.centerY, radius * this.viewScale);
    
    // Draw spokes
    for (let i = 0; i < 4; i++) {
      const angle = Phaser.Math.DegToRad(i * 45);
      this.mainGraphics.lineBetween(
        this.centerX - Math.cos(angle) * radius * this.viewScale,
        this.centerY - Math.sin(angle) * radius * this.viewScale,
        this.centerX + Math.cos(angle) * radius * this.viewScale,
        this.centerY + Math.sin(angle) * radius * this.viewScale
      );
    }
    
    // Ground line
    this.bgGraphics.lineStyle(2, GRID_COLOR, 0.8);
    this.bgGraphics.lineBetween(50, this.centerY + radius * this.viewScale, 
                                this.cameras.main.width - 50, this.centerY + radius * this.viewScale);
                                
    this.addLabel('wheel', `r = ${radius}`, this.centerX, this.centerY - radius * this.viewScale - 20, '#06b6d4');
    if (rotations > 1) {
      this.addLabel('rotations', `Rotations: ${rotations}`, this.centerX, this.centerY + radius * this.viewScale + 30, '#f97316');
    }
  }

  private drawArcRouteLevel(spec: LevelSpecification) {
    this.drawSectorLevel(spec);
    // Emphasize the arc part
    const angle = spec.simulationParams?.angle || 90;
    const startAngle = -90;
    const endAngle = startAngle + angle;
    
    this.glowGraphics.lineStyle(6, GLOWING_ORANGE, 1);
    this.glowGraphics.beginPath();
    this.glowGraphics.arc(this.centerX, this.centerY, this.currentRadius * this.viewScale,
      Phaser.Math.DegToRad(startAngle), Phaser.Math.DegToRad(endAngle), false);
    this.glowGraphics.strokePath();
  }

  private drawSemicircleLevel(spec: LevelSpecification) {
    const radius = spec.simulationParams?.radius || spec.simulationParams?.diameter ? (spec.simulationParams.diameter! / 2) : 7;
    
    this.mainGraphics.lineStyle(3, NEON_CYAN, 1);
    this.mainGraphics.beginPath();
    this.mainGraphics.arc(this.centerX, this.centerY, radius * this.viewScale, 0, Math.PI, true);
    this.mainGraphics.closePath();
    this.mainGraphics.strokePath();
    
    this.sectorFill.fillStyle(NEON_CYAN, 0.4);
    this.sectorFill.beginPath();
    this.sectorFill.arc(this.centerX, this.centerY, radius * this.viewScale, 0, Math.PI, true);
    this.sectorFill.closePath();
    this.sectorFill.fillPath();
    
    this.addLabel('semi', `d = ${radius * 2}`, this.centerX, this.centerY + 15, '#06b6d4');
  }

  private drawQuadrantLevel(spec: LevelSpecification) {
    spec.simulationParams = { ...spec.simulationParams, angle: 90 };
    this.drawSectorLevel(spec);
  }

  private drawOverlapLevel(spec: LevelSpecification) {
    const radius = spec.simulationParams?.radius || 14;
    const offset = radius * this.viewScale * 0.8; // overlap distance
    
    // Circle 1
    this.mainGraphics.lineStyle(2, ELECTRIC_BLUE, 0.8);
    this.mainGraphics.strokeCircle(this.centerX - offset/2, this.centerY, radius * this.viewScale);
    
    // Circle 2
    this.mainGraphics.lineStyle(2, NEON_CYAN, 0.8);
    this.mainGraphics.strokeCircle(this.centerX + offset/2, this.centerY, radius * this.viewScale);
    
    // This is a simplified visual representation of overlap
    this.addLabel('overlap', 'Intersection Area', this.centerX, this.centerY - radius * this.viewScale - 20, '#f97316');
  }

  private drawDomeLevel(spec: LevelSpecification) {
    this.drawSemicircleLevel(spec);
    // Add 3D ellipse base to look like a dome
    const radius = spec.simulationParams?.radius || 7;
    
    this.glowGraphics.lineStyle(2, PURPLE, 0.8);
    this.glowGraphics.strokeEllipse(this.centerX, this.centerY, radius * this.viewScale * 2, radius * this.viewScale * 0.5);
  }

  private drawTrackLevel(spec: LevelSpecification) {
    const radius = spec.simulationParams?.radius || 35;
    const rScaled = radius * this.viewScale / 2; // scaled down to fit screen
    const straight = 50; // visual representation
    
    // Draw track
    this.mainGraphics.lineStyle(4, NEON_CYAN, 0.8);
    
    // Top straight
    this.mainGraphics.lineBetween(this.centerX - straight, this.centerY - rScaled, this.centerX + straight, this.centerY - rScaled);
    // Bottom straight
    this.mainGraphics.lineBetween(this.centerX - straight, this.centerY + rScaled, this.centerX + straight, this.centerY + rScaled);
    
    // Left curve
    this.mainGraphics.beginPath();
    this.mainGraphics.arc(this.centerX - straight, this.centerY, rScaled, Math.PI/2, Math.PI*1.5, false);
    this.mainGraphics.strokePath();
    
    // Right curve
    this.mainGraphics.beginPath();
    this.mainGraphics.arc(this.centerX + straight, this.centerY, rScaled, -Math.PI/2, Math.PI/2, false);
    this.mainGraphics.strokePath();
    
    this.addLabel('track_r', `r=${radius}m`, this.centerX + straight + rScaled/2, this.centerY, '#06b6d4');
  }

  private drawMultiCircleLevel(spec: LevelSpecification) {
    const radii = spec.simulationParams?.radii || [7, 14];
    
    const r1 = radii[0] * this.viewScale;
    const r2 = radii[1] * this.viewScale;
    
    // Left circle
    this.sectorFill.fillStyle(ELECTRIC_BLUE, 0.5);
    this.sectorFill.fillCircle(this.centerX - r1 - 20, this.centerY, r1);
    this.mainGraphics.lineStyle(2, ELECTRIC_BLUE, 1);
    this.mainGraphics.strokeCircle(this.centerX - r1 - 20, this.centerY, r1);
    
    // Right circle
    this.sectorFill.fillStyle(PURPLE, 0.5);
    this.sectorFill.fillCircle(this.centerX + r2 + 20, this.centerY, r2);
    this.mainGraphics.lineStyle(2, PURPLE, 1);
    this.mainGraphics.strokeCircle(this.centerX + r2 + 20, this.centerY, r2);
    
    this.addLabel('c1', `r=${radii[0]}`, this.centerX - r1 - 20, this.centerY + r1 + 20, '#3b82f6');
    this.addLabel('c2', `r=${radii[1]}`, this.centerX + r2 + 20, this.centerY + r2 + 20, '#8b5cf6');
  }

  private clearGraphics() {
    this.mainGraphics.clear();
    this.glowGraphics.clear();
    this.sectorFill.clear();
    this.measurementLabels.forEach((label, key) => {
      if (key !== 'radius' && key !== 'area' && key !== 'circumference') {
        label.destroy();
        this.measurementLabels.delete(key);
      }
    });
  }

  private addLabel(key: string, text: string, x: number, y: number, color: string) {
    if (this.measurementLabels.has(key)) {
      this.measurementLabels.get(key)!.setText(text).setPosition(x, y);
      return;
    }
    const label = this.add.text(x, y, text, {
      fontFamily: FONT, fontSize: '13px', color: color, fontStyle: 'bold',
      backgroundColor: '#ffffffd9', padding: { x: 6, y: 3 }
    }).setOrigin(0.5);
    this.measurementLabels.set(key, label);
  }

  private updateMeasurements() {
    const area = (22/7) * this.currentRadius * this.currentRadius;
    this.addLabel('area', `Area ≈ ${area.toFixed(1)}`,
      this.centerX, this.centerY + this.currentRadius * this.viewScale + 30, '#8b5cf6');
  }

  private drawLevelPanel(spec: LevelSpecification) {
    const panelY = this.cameras.main.height - 80;
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 0.9);
    graphics.fillRoundedRect(20, panelY, this.cameras.main.width - 40, 60, 12);
    graphics.lineStyle(2, GRID_COLOR, 1);
    graphics.strokeRoundedRect(20, panelY, this.cameras.main.width - 40, 60, 12);
    
    this.add.text(40, panelY + 15, spec.title || spec.question, {
      fontFamily: FONT, fontSize: '15px', color: '#1e293b', fontStyle: 'bold'
    });
    
    this.add.text(40, panelY + 35, spec.description || '', {
      fontFamily: FONT, fontSize: '12px', color: '#64748b'
    });
    
    if (spec.formulaDisplay) {
      this.add.text(this.cameras.main.width - 40, panelY + 30, spec.formulaDisplay, {
        fontFamily: FONT, fontSize: '14px', color: '#f97316', fontStyle: 'bold'
      }).setOrigin(1, 0.5);
    }
  }
}

