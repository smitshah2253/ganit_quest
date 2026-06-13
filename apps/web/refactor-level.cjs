const fs = require('fs');
const path = require('path');

const levelScenePath = path.join(__dirname, 'src/features/game/scenes/LevelScene.ts');
let content = fs.readFileSync(levelScenePath, 'utf8');

// 1. Change imports
content = content.replace(
    "import Phaser, { Scene, GameObjects } from 'phaser';",
    "import Phaser, { GameObjects } from 'phaser';\nimport { BaseScene } from './BaseScene';"
);

// 2. Change class signature
content = content.replace(
    "export class LevelScene extends Scene {",
    "export class LevelScene extends BaseScene {"
);

// 3. Remove protected properties now in BaseScene
content = content.replace("private currentLevelData: any;", "");
content = content.replace("private levelSpec: LevelSpecification | null = null;", "");
content = content.replace("private isLevelActive: boolean = false;", "");
content = content.replace("private glowEmitter!: GameObjects.Particles.ParticleEmitter;", "");
content = content.replace("private smokeEmitter!: GameObjects.Particles.ParticleEmitter;", "");

// 4. Replace create() to hideLabels()
const startCreate = content.indexOf('    create() {');
const endCreate = content.indexOf('    hideLabels() {');

const replacement = `
    protected onSceneCreate() {
        this.graphics = this.add.graphics();
        this.graphics.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2 - 20);

        this.labelGraphics = this.add.graphics();
        this.labelGraphics.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2 - 20);

        this.statusText = this.add.text(20, 20, 'Ready', {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
            fontSize: '14px', 
            color: '#64748b', 
            fontStyle: 'semibold'
        });

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

        this.hideLabels();
    }

    protected onResize(gameSize: Phaser.Structs.Size) {
        if (this.graphics) {
            this.graphics.setPosition(gameSize.width / 2, gameSize.height / 2 - 20);
        }
        if (this.labelGraphics) {
            this.labelGraphics.setPosition(gameSize.width / 2, gameSize.height / 2 - 20);
        }
        this.updateShape();
    }

    protected onLevelLoad(levelData: any) {
        if (levelData.id.startsWith('lvl-cg-')) { this.isLevelActive = false; this.scene.start('CoordinateScene'); return; }
        if (levelData.id.startsWith('lvl-trig-')) { this.isLevelActive = false; this.scene.start('TrigonometryScene'); return; }
        if (levelData.id.startsWith('lvl-apptrig-')) { this.isLevelActive = false; this.scene.start('ApplicationsTrigScene'); return; }
        if (levelData.id.startsWith('lvl-ap-')) { this.isLevelActive = false; this.scene.start('APScene'); return; }
        if (levelData.id.startsWith('lvl-prob-')) { this.isLevelActive = false; this.scene.start('ProbabilityScene'); return; }
        if (levelData.id.startsWith('lvl-tri-')) { this.isLevelActive = false; this.scene.start('TriangleScene'); return; }
        if (levelData.id.startsWith('lvl-circle-')) { this.isLevelActive = false; this.scene.start('CircleScene'); return; }
        if (levelData.id.startsWith('lvl-areas-c-')) { this.isLevelActive = false; this.scene.start('AreasCircleScene'); return; }
        if (levelData.id.startsWith('lvl-stats-')) { this.isLevelActive = false; this.scene.start('StatisticsScene'); return; }
        
        this.currentLevelData = levelData;
        this.levelSpec = getLevelSpec(levelData.id, levelData);
        this.currentValue = 0;
        this.shapeScale = 0.4;
        this.isLevelActive = true;
        this.boardExamInputs = [];
        
        if (this.statusText) {
            this.statusText.setText(\`Shape: \${levelData.shape.toUpperCase()}\`);
        }
        
        this.hideLabels();
        this.updateShape();

        this.cameras.main.zoomTo(1.15, 500, 'Power2');
        this.time.delayedCall(500, () => {
            this.cameras.main.zoomTo(1, 400, 'Power2');
        });
    }

    protected onUserInput(value: string, levelId: string) {
        const val = parseFloat(value);
        if (!isNaN(val) && val > 0) {
            this.currentValue = val;
            const ratio = Phaser.Math.Clamp(val / this.levelSpec!.correctAnswer, 0.2, 2.0);
            this.tweens.add({
                targets: this,
                shapeScale: ratio,
                duration: 350,
                ease: 'Cubic.easeOut',
                onUpdate: () => this.updateShape()
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
    }

    protected onBoardInput(inputs: string[], levelId: string) {
        this.boardExamInputs = inputs;
        let lastVal = 0;
        for (let i = inputs.length - 1; i >= 0; i--) {
            const val = parseFloat(inputs[i]);
            if (!isNaN(val) && val > 0) {
                lastVal = val;
                break;
            }
        }
        if (lastVal > 0) {
            this.currentValue = lastVal;
            const ratio = Phaser.Math.Clamp(lastVal / this.levelSpec!.correctAnswer, 0.2, 2.0);
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
    }

`;

content = content.substring(0, startCreate) + replacement + content.substring(endCreate);

// 5. Remove triggerGlowEffect and triggerSmokeEffect completely (between create/onBoardInput and hideLabels, wait no, they are before hideLabels, and we already removed them by replacing up to hideLabels!)
// Wait, the original file has:
//     // Trigger golden glow particles for correct answer
//     private triggerGlowEffect() { ... }
//     private triggerSmokeEffect() { ... }
//     hideLabels() {
// So `startCreate` to `hideLabels()` covered `triggerGlowEffect` and `triggerSmokeEffect`. They are gone!

fs.writeFileSync(levelScenePath, content);
console.log('LevelScene refactored!');
