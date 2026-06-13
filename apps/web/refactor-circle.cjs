const fs = require('fs');
const path = require('path');

const circleScenePath = path.join(__dirname, 'src/features/game/scenes/CircleScene.ts');
let content = fs.readFileSync(circleScenePath, 'utf8');

// 1. Change imports
content = content.replace(
    "import Phaser, { Scene, GameObjects } from 'phaser';",
    "import Phaser, { GameObjects } from 'phaser';\nimport { BaseScene } from './BaseScene';"
);

// 2. Change class signature
content = content.replace(
    "export class CircleScene extends Scene {",
    "export class CircleScene extends BaseScene {"
);

// 3. Remove protected properties now in BaseScene
content = content.replace("    private levelSpec: LevelSpecification | null = null;\n", "");
content = content.replace("    private isLevelActive: boolean = false;\n", "");

// 4. Replace create() to update()
const startCreate = content.indexOf('    create() {');
const endCreate = content.indexOf('    update() {');

const replacement = `
    protected onSceneCreate() {
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
    }

    protected onResize(gs: Phaser.Structs.Size) {
        this.formulaText.setPosition(22, gs.height - 28);
        if (this.isLevelActive) this.redraw();
    }

    protected onLevelLoad(data: any) {
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

        this.titleText.setText(\`Ch 10 – Circles: \${data.title ?? data.id}\`);
        this.statusText.setText(data.concept ?? '');
        if (this.levelSpec) {
            this.formulaText.setText(this.levelSpec.formulaDisplay ?? '');
        }
        this.formulaText.setPosition(22, this.cameras.main.height - 28);

        this.resetLabels();
        this.updateSliderVisibility();
        this.redraw();

        this.cameras.main.zoomTo(1.1, 450, 'Power2');
        this.time.delayedCall(450, () => this.cameras.main.zoomTo(1, 350, 'Power2'));
    }

    protected onUserInput(value: string, levelId: string) {
        const v = parseFloat(value);
        if (!isNaN(v)) {
            this.currentInputVal = v;
            this.syncInputToVisual(v);
        }
    }

    protected onBoardInput(inputs: string[], levelId: string) {
        let activeInput = '';
        for (let i = inputs.length - 1; i >= 0; i--) {
            if (inputs[i] && inputs[i].trim() !== '') {
                activeInput = inputs[i];
                break;
            }
        }
        if (activeInput !== '') {
            this.onUserInput(activeInput, levelId);
        }
    }

    protected onAnswerCorrect() {
        this.flashOverlay(0x10b981);
        super.onAnswerCorrect();
    }

    protected onAnswerWrong() {
        this.flashOverlay(0xef4444);
        super.onAnswerWrong();
    }

`;

content = content.substring(0, startCreate) + replacement + content.substring(endCreate);

fs.writeFileSync(circleScenePath, content);
console.log('CircleScene refactored!');
