import Phaser, { Scene, GameObjects } from 'phaser';
import { EventBus } from '../EventBus';
import { getLevelSpec } from '../../data/levelSpecs';
import type { LevelSpecification } from '../../data/levelSpecs';
import { soundManager } from '../SoundManager';

/**
 * StatisticsScene — Interactive Statistics Learning for Chapter 13 (Class X)
 */

const BG_COLOR = 0xecf2f7;
const GRID_COLOR = 0xcbd5e1;
const PRIMARY = 0x06b6d4;    // Cyan
const SECONDARY = 0x8b5cf6;  // Purple
const SUCCESS = 0x10b981;    // Green
const FONT = 'Inter, system-ui, sans-serif';

interface DataNode {
  value: number;
  container: GameObjects.Container;
  originalX: number;
  originalY: number;
  sortedIndex: number;
}

interface FrequencyBucket {
  value: number;
  count: number;
  bar: GameObjects.Rectangle;
  label: GameObjects.Text;
}

export class StatisticsScene extends Scene {
  private levelSpec: LevelSpecification | null = null;
  private isLevelActive = false;

  private mainGraphics!: GameObjects.Graphics;
  private gridGraphics!: GameObjects.Graphics;
  private overlayGraphics!: GameObjects.Graphics;

  private titleText!: GameObjects.Text;
  private statusText!: GameObjects.Text;
  private formulaText!: GameObjects.Text;
  private instructionText!: GameObjects.Text;

  private dataNodes: DataNode[] = [];
  private frequencyBuckets: Map<number, FrequencyBucket> = new Map();
  private histogramBars: GameObjects.Rectangle[] = [];

  private dragHandle!: GameObjects.Container;
  private dropZones: GameObjects.Rectangle[] = [];

  private currentBinWidth = 10;
  private sortedData: number[] = [];
  private userSortedIndices: number[] = [];
  private isAnimating = false;

  constructor() {
    super('StatisticsScene');
  }

  create() {
    this.cameras.main.setBackgroundColor(BG_COLOR);

    this.mainGraphics = this.add.graphics();
    this.gridGraphics = this.add.graphics();
    this.overlayGraphics = this.add.graphics().setAlpha(0);

    this.drawGrid();

    this.titleText = this.add.text(22, 18, 'Statistics Lab', {
      fontFamily: FONT, fontSize: '14px', color: '#475569', fontStyle: 'bold'
    });

    this.statusText = this.add.text(22, 38, 'Load a level to begin...', {
      fontFamily: FONT, fontSize: '11px', color: '#3b82f6', fontStyle: 'bold'
    });

    this.formulaText = this.add.text(22, this.cameras.main.height - 28, '', {
      fontFamily: FONT, fontSize: '12px', color: '#0f172a', fontStyle: 'bold',
      backgroundColor: '#ffffffd9', padding: { x: 8, y: 4 }
    }).setOrigin(0, 1);

    this.instructionText = this.add.text(this.cameras.main.width / 2, 70, '', {
      fontFamily: FONT, fontSize: '13px', color: '#475569', align: 'center'
    }).setOrigin(0.5, 0);

    this.createDragHandle();
    this.setupEventListeners();

    this.scale.on('resize', this.handleResize, this);
    EventBus.emit('game-ready');
  }

  private drawGrid() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const gridSize = 40;

    this.gridGraphics.clear();
    this.gridGraphics.lineStyle(1, GRID_COLOR, 0.4);

    for (let x = 0; x <= width; x += gridSize) {
      this.gridGraphics.lineBetween(x, 0, x, height);
    }
    for (let y = 0; y <= height; y += gridSize) {
      this.gridGraphics.lineBetween(0, y, width, y);
    }
  }

  private createDragHandle() {
    const handleCircle = this.add.circle(0, 0, 12, PRIMARY, 1.0).setStrokeStyle(3, 0xffffff);
    const glow = this.add.circle(0, 0, 20, PRIMARY, 0.3);

    this.dragHandle = this.add.container(0, 0, [glow, handleCircle]);
    this.dragHandle.setSize(44, 44);
    this.dragHandle.setInteractive({ useHandCursor: true });
    this.input.setDraggable(this.dragHandle);

    this.tweens.add({ targets: glow, scale: 1.5, alpha: 0, duration: 1000, repeat: -1 });
    this.dragHandle.setVisible(false);
  }

  private setupEventListeners() {
    const onLoadLevel = (data: any) => {
      if (!this.scene?.systems) return;
      if (!data.id.startsWith('lvl-stats-')) {
        this.isLevelActive = false;
        return;
      }

      this.levelSpec = getLevelSpec(data.id, data);
      this.isLevelActive = true;

      this.titleText.setText(`Ch 13 – Statistics: ${data.title ?? data.id}`);
      this.statusText.setText(data.concept ?? '');

      if (this.levelSpec) {
        this.formulaText.setText(this.levelSpec.formulaDisplay ?? '');
        this.instructionText.setText(this.getInstructionText());
      }

      this.formulaText.setPosition(22, this.cameras.main.height - 28);
      this.instructionText.setPosition(this.cameras.main.width / 2, 70);

      this.resetScene();
      this.setupLevel();

      this.cameras.main.zoomTo(1.05, 300, 'Power2');
      this.time.delayedCall(300, () => {
        this.cameras.main.zoomTo(1, 250, 'Power2');
      });
    };

    const onUserInput = (d: { value: string; levelId: string }) => {
      if (!this.isLevelActive || !this.levelSpec) return;
      if (d.levelId !== this.levelSpec.id) return;
      const val = parseFloat(d.value);
      if (!isNaN(val)) this.syncInputToVisual(val);
    };

    const onBoardInput = (d: { inputs: string[]; levelId: string }) => {
      if (!this.isLevelActive || !this.levelSpec) return;
      if (d.levelId !== this.levelSpec.id) return;
      if (d.inputs[0] !== undefined) onUserInput({ value: d.inputs[0], levelId: d.levelId });
    };

    const onCorrect = () => this.flashOverlay(SUCCESS);
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
  }

  private getInstructionText(): string {
    const mode = this.levelSpec?.statsMode;
    switch (mode) {
      case 'collection': return 'Drag the data points to arrange them in ascending order';
      case 'frequency': return 'Build the frequency distribution by dragging data to value buckets';
      case 'intervals': return 'Adjust the bin width slider to create class intervals';
      case 'cumulative': return 'Watch the cumulative frequency curve build as data accumulates';
      case 'median': return 'Find the median by sorting the data and identifying the middle value';
      case 'boss': return 'Complete the full statistical analysis: sort, group, and calculate';
      default: return 'Analyze the data to find the required statistic';
    }
  }

  private resetScene() {
    this.dataNodes.forEach(node => node.container.destroy());
    this.dataNodes = [];
    this.frequencyBuckets.forEach(bucket => { bucket.bar.destroy(); bucket.label.destroy(); });
    this.frequencyBuckets.clear();
    this.histogramBars.forEach(bar => bar.destroy());
    this.histogramBars = [];
    this.dropZones.forEach(zone => zone.destroy());
    this.dropZones = [];
    this.mainGraphics.clear();
    this.userSortedIndices = [];
    this.currentBinWidth = 10;
    this.isAnimating = false;
    this.dragHandle.setVisible(false);
  }

  private setupLevel() {
    if (!this.levelSpec) return;
    const mode = this.levelSpec.statsMode;
    const data = this.levelSpec.statsData ?? [];
    this.sortedData = [...data].sort((a, b) => a - b);

    switch (mode) {
      case 'collection': this.setupDataCollection(data); break;
      case 'frequency': this.setupFrequencyDistribution(data); break;
      case 'intervals': this.setupClassIntervals(data); break;
      case 'cumulative': this.setupCumulativeFrequency(data); break;
      case 'median': this.setupMedianFinder(data); break;
      case 'boss': this.setupBossChallenge(data); break;
      default: this.setupDataCollection(data);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WORLD 1: Data Collection - Drag-sort scatter nodes
  // ═══════════════════════════════════════════════════════════════════════════
  private setupDataCollection(data: number[]) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const startY = height / 2;
    const spacing = Math.min(60, (width - 100) / data.length);
    const startX = (width - (data.length - 1) * spacing) / 2;

    data.forEach((val, i) => {
      const randomX = Phaser.Math.Between(50, width - 50);
      const randomY = Phaser.Math.Between(120, height - 100);
      const sortedIndex = this.sortedData.indexOf(val);
      const targetX = startX + sortedIndex * spacing;
      const targetY = startY;

      const node = this.createDataNode(randomX, randomY, val, i);
      node.originalX = randomX;
      node.originalY = randomY;
      node.sortedIndex = sortedIndex;

      node.container.setSize(48, 48);
      node.container.setInteractive({ useHandCursor: true });
      this.input.setDraggable(node.container);

      node.container.on('drag', (pointer: Phaser.Input.Pointer) => {
        if (this.isAnimating) return;
        node.container.x = pointer.x;
        node.container.y = pointer.y;

        const distToTarget = Phaser.Math.Distance.Between(pointer.x, pointer.y, targetX, targetY);
        if (distToTarget < 30 && !this.userSortedIndices.includes(i)) {
          this.userSortedIndices.push(i);
          this.flashNodeSuccess(node.container);
          soundManager.playSnap();
          node.container.setPosition(targetX, targetY);
          this.checkCollectionComplete();
        }
      });

      node.container.setScale(0);
      this.tweens.add({ targets: node.container, scale: 1, duration: 400, delay: i * 80, ease: 'Back.easeOut' });
    });

    this.drawTargetZones(data.length, startX, startY, spacing);
  }

  private createDataNode(x: number, y: number, value: number, index: number): DataNode {
    const bg = this.add.circle(0, 0, 24, 0xffffff, 0.9).setStrokeStyle(2, PRIMARY);
    const glow = this.add.circle(0, 0, 28, PRIMARY, 0.2);
    const text = this.add.text(0, 0, value.toString(), { fontFamily: FONT, fontSize: '13px', color: '#0f172a', fontStyle: 'bold' }).setOrigin(0.5);
    const container = this.add.container(x, y, [glow, bg, text]);
    const node: DataNode = { value, container, originalX: x, originalY: y, sortedIndex: index };
    this.dataNodes.push(node);
    return node;
  }

  private drawTargetZones(count: number, startX: number, y: number, spacing: number) {
    for (let i = 0; i < count; i++) {
      const x = startX + i * spacing;
      this.gridGraphics.lineStyle(2, SECONDARY, 0.3);
      this.gridGraphics.strokeCircle(x, y, 35);
      this.add.text(x, y + 45, `${i + 1}`, { fontFamily: FONT, fontSize: '11px', color: '#94a3b8' }).setOrigin(0.5);
    }
  }

  private flashNodeSuccess(container: GameObjects.Container) {
    this.tweens.add({ targets: container, scale: 1.2, duration: 150, yoyo: true, ease: 'Power2' });
  }

  private checkCollectionComplete() {
    const data = this.levelSpec?.statsData ?? [];
    if (this.userSortedIndices.length === data.length) {
      this.isAnimating = true;
      this.time.delayedCall(500, () => {
        this.isAnimating = false;
        EventBus.emit('user-input-changed', { value: String(data.length), levelId: this.levelSpec?.id });
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WORLD 2: Frequency Distribution
  // ═══════════════════════════════════════════════════════════════════════════
  private setupFrequencyDistribution(data: number[]) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const frequencies = new Map<number, number>();
    data.forEach(val => frequencies.set(val, (frequencies.get(val) || 0) + 1));

    const uniqueValues = Array.from(frequencies.keys()).sort((a, b) => a - b);
    const maxFreq = Math.max(...Array.from(frequencies.values()));
    const bucketWidth = Math.min(70, (width - 100) / uniqueValues.length);
    const startX = (width - uniqueValues.length * bucketWidth) / 2 + bucketWidth / 2;
    const bucketY = height - 100;
    const maxBarHeight = 200;

    uniqueValues.forEach((val, i) => {
      const x = startX + i * bucketWidth;
      const freq = frequencies.get(val) || 0;
      
      const dropZone = this.add.rectangle(x, bucketY + 40, bucketWidth - 10, 60, 0xffffff, 0.3).setStrokeStyle(2, SECONDARY, 0.5);
      this.dropZones.push(dropZone);

      this.add.text(x, bucketY + 70, `${val}`, { fontFamily: FONT, fontSize: '12px', color: '#475569', fontStyle: 'bold' }).setOrigin(0.5);

      const barHeight = (freq / maxFreq) * maxBarHeight;
      const bar = this.add.rectangle(x, bucketY, bucketWidth - 15, 0, PRIMARY, 0.7).setOrigin(0.5, 1);
      const label = this.add.text(x, bucketY - barHeight - 10, '0', { fontFamily: FONT, fontSize: '13px', color: '#0f172a', fontStyle: 'bold' }).setOrigin(0.5);

      this.frequencyBuckets.set(val, { value: val, count: 0, bar, label });
      this.tweens.add({ targets: bar, height: barHeight, duration: 800, delay: i * 150, ease: 'Power2' });
      this.tweens.add({
        targets: label, y: bucketY - barHeight - 10, duration: 800, delay: i * 150, ease: 'Power2',
        onUpdate: () => {
          const progress = this.tweens.getTweensOf(bar)[0]?.progress ?? 1;
          label.setText(String(Math.round(freq * progress)));
        }
      });
    });

    this.add.text(width / 2, height - 50, 'Data Values', { fontFamily: FONT, fontSize: '12px', color: '#94a3b8' }).setOrigin(0.5);
    this.time.delayedCall(1500, () => {
      EventBus.emit('user-input-changed', { value: String(maxFreq), levelId: this.levelSpec?.id });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WORLD 3: Class Intervals
  // ═══════════════════════════════════════════════════════════════════════════
  private setupClassIntervals(data: number[]) {
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    this.currentBinWidth = Math.max(5, Math.ceil((maxVal - minVal) / 5));
    
    this.drawHistogram(data, this.currentBinWidth);
    
    this.time.delayedCall(1000, () => {
      EventBus.emit('user-input-changed', { value: String(5), levelId: this.levelSpec?.id });
    });
  }

  private drawHistogram(data: number[], binWidth: number) {
    this.histogramBars.forEach(b => b.destroy());
    this.histogramBars = [];
    
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const numBins = Math.max(1, Math.ceil((maxVal - minVal) / binWidth));
    const bins = new Array(numBins).fill(0);
    
    data.forEach(val => {
      const idx = Math.min(Math.floor((val - minVal) / binWidth), numBins - 1);
      bins[idx]++;
    });

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const chartBottom = height - 120;
    const chartHeight = chartBottom - 150;
    const maxFreq = Math.max(...bins, 1);
    const barWidth = Math.min(80, (width - 150) / numBins);
    const startX = (width - numBins * barWidth) / 2 + barWidth / 2;

    bins.forEach((freq, i) => {
      const x = startX + i * barWidth;
      const barHeight = (freq / maxFreq) * chartHeight * 0.9;
      
      const bar = this.add.rectangle(x, chartBottom, barWidth - 5, barHeight, PRIMARY, 0.7).setOrigin(0.5, 1);
      this.histogramBars.push(bar);
      bar.setScale(1, 0);
      this.tweens.add({ targets: bar, scaleY: 1, duration: 300, delay: i * 50, ease: 'Power2' });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WORLD 4: Cumulative Frequency
  // ═══════════════════════════════════════════════════════════════════════════
  private setupCumulativeFrequency(data: number[]) {
    this.drawHistogram(data, 10); // Draw background histogram
    
    const maxFreq = data.length;
    this.time.delayedCall(1000, () => {
      EventBus.emit('user-input-changed', { value: String(maxFreq), levelId: this.levelSpec?.id });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WORLD 5: Median & Boss
  // ═══════════════════════════════════════════════════════════════════════════
  private setupMedianFinder(data: number[]) {
    this.setupDataCollection(data);
    const mid = Math.floor(this.sortedData.length / 2);
    const median = this.sortedData.length % 2 !== 0 ? this.sortedData[mid] : (this.sortedData[mid - 1] + this.sortedData[mid]) / 2;
    
    this.time.delayedCall(2000, () => {
      EventBus.emit('user-input-changed', { value: String(median), levelId: this.levelSpec?.id });
    });
  }

  private setupBossChallenge(data: number[]) {
    this.setupMedianFinder(data);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════
  private syncInputToVisual(val: number) {
    if (this.levelSpec?.statsMode === 'intervals') {
      this.currentBinWidth = Math.max(1, Math.round(val));
      this.drawHistogram(this.levelSpec.statsData ?? [], this.currentBinWidth);
    }
  }

  private flashOverlay(color: number) {
    this.overlayGraphics.clear();
    this.overlayGraphics.fillStyle(color, 0.3);
    this.overlayGraphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    this.tweens.add({ targets: this.overlayGraphics, alpha: 0, duration: 400, ease: 'Power2', onStart: () => { this.overlayGraphics.setAlpha(1); } });
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    this.cameras.main.setSize(gameSize.width, gameSize.height);
    this.formulaText.setPosition(22, gameSize.height - 28);
    this.instructionText.setPosition(gameSize.width / 2, 70);
    this.drawGrid();
    if (this.isLevelActive) {
      this.resetScene();
      this.setupLevel();
    }
  }
}

