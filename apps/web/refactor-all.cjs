const fs = require('fs');
const path = require('path');

const scenesDir = path.join(__dirname, 'src/features/game/scenes');

const filesToRefactor = [
    'APScene.ts',
    'ApplicationsTrigScene.ts',
    'AreasCircleScene.ts',
    'CoordinateScene.ts',
    'ProbabilityScene.ts',
    'StatisticsScene.ts',
    'TriangleScene.ts',
    'TrigonometryScene.ts'
];

for (const file of filesToRefactor) {
    const filePath = path.join(scenesDir, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Imports
    content = content.replace(
        /import Phaser, \{ Scene, GameObjects \} from 'phaser';/g,
        "import Phaser, { GameObjects } from 'phaser';\nimport { BaseScene } from './BaseScene';"
    );

    // 2. Class extension
    content = content.replace(
        new RegExp(`export class ${file.replace('.ts', '')} extends Scene \\{`),
        `export class ${file.replace('.ts', '')} extends BaseScene {`
    );

    // 3. Remove common private properties
    content = content.replace(/    private levelSpec: LevelSpecification \| null = null;\n/g, "");
    content = content.replace(/    private levelSpec: any = null;\n/g, "");
    content = content.replace(/    private isLevelActive: boolean = false;\n/g, "");
    content = content.replace(/    private glowEmitter!: GameObjects.Particles.ParticleEmitter;\n/g, "");
    content = content.replace(/    private smokeEmitter!: GameObjects.Particles.ParticleEmitter;\n/g, "");

    // 4. Refactor create() to class methods
    const createStartIndex = content.indexOf('    create() {');
    const updateStartIndex = content.indexOf('    update() {');

    if (createStartIndex !== -1 && updateStartIndex !== -1) {
        const createBody = content.substring(createStartIndex, updateStartIndex);

        // Find where the event handlers start
        const onLoadLevelIndex = createBody.indexOf('const onLoadLevel');
        
        if (onLoadLevelIndex !== -1) {
            let customCreateLogic = createBody.substring('    create() {'.length, onLoadLevelIndex);
            
            // Remove background color since BaseScene handles it
            customCreateLogic = customCreateLogic.replace(/this\.cameras\.main\.setBackgroundColor\('[^']+'\);\n/g, '');

            // Extract the body of onLoadLevel
            const onLoadBodyStart = createBody.indexOf('{', onLoadLevelIndex) + 1;
            // Hacky but works for this specific codebase format: onLoadLevel goes until `const onUserInput`
            const onUserInputIndex = createBody.indexOf('const onUserInput');
            let onLoadLogic = createBody.substring(onLoadBodyStart, onUserInputIndex);
            onLoadLogic = onLoadLogic.substring(0, onLoadLogic.lastIndexOf('};')).trim();
            // remove `if (!this.scene?.systems) return;`
            onLoadLogic = onLoadLogic.replace(/if \(!this\.scene\?\.systems\) return;\n/g, '');

            // Extract onUserInput
            const onBoardInputIndex = createBody.indexOf('const onBoardInput');
            const onUserInputStart = createBody.indexOf('{', onUserInputIndex) + 1;
            let onUserLogic = createBody.substring(onUserInputStart, onBoardInputIndex);
            onUserLogic = onUserLogic.substring(0, onUserLogic.lastIndexOf('};')).trim();
            // remove guards
            onUserLogic = onUserLogic.replace(/if \(!this\.isLevelActive \|\| !this\.levelSpec\) return;\n/g, '');
            onUserLogic = onUserLogic.replace(/if \(d\.levelId !== this\.levelSpec\.id\) return;\n/g, '');
            onUserLogic = onUserLogic.replace(/const v = parseFloat\(d\.value\);/g, 'const v = parseFloat(value);');
            onUserLogic = onUserLogic.replace(/d\.value/g, 'value');

            // Extract onBoardInput
            const onCorrectIndex = createBody.indexOf('const onCorrect');
            const onBoardInputStart = createBody.indexOf('{', onBoardInputIndex) + 1;
            let onBoardLogic = createBody.substring(onBoardInputStart, onCorrectIndex);
            onBoardLogic = onBoardLogic.substring(0, onBoardLogic.lastIndexOf('};')).trim();
            // remove guards
            onBoardLogic = onBoardLogic.replace(/if \(!this\.isLevelActive \|\| !this\.levelSpec\) return;\n/g, '');
            onBoardLogic = onBoardLogic.replace(/if \(d\.levelId !== this\.levelSpec\.id\) return;\n/g, '');
            onBoardLogic = onBoardLogic.replace(/d\.inputs/g, 'inputs');
            onBoardLogic = onBoardLogic.replace(/d\.levelId/g, 'levelId');

            // Extract onResize
            const onResizeIndex = createBody.indexOf('const onResize = (gs: Phaser.Structs.Size) => {');
            let onResizeLogic = "";
            if (onResizeIndex !== -1) {
                const onResizeStart = createBody.indexOf('{', onResizeIndex) + 1;
                const scaleOnIndex = createBody.indexOf('this.scale.on', onResizeStart);
                onResizeLogic = createBody.substring(onResizeStart, scaleOnIndex);
                onResizeLogic = onResizeLogic.substring(0, onResizeLogic.lastIndexOf('};')).trim();
                onResizeLogic = onResizeLogic.replace(/if \(!this\.cameras \|\| !this\.cameras\.main\) return;\n/g, '');
                onResizeLogic = onResizeLogic.replace(/this\.cameras\.main\.setSize\(gs\.width, gs\.height\);\n/g, '');
            }

            const replacement = `
    protected onSceneCreate() {${customCreateLogic}}

    protected onResize(gs: Phaser.Structs.Size) {
        ${onResizeLogic}
    }

    protected onLevelLoad(data: any) {
        ${onLoadLogic}
    }

    protected onUserInput(value: string, levelId: string) {
        ${onUserLogic}
    }

    protected onBoardInput(inputs: string[], levelId: string) {
        ${onBoardLogic}
    }

    protected onAnswerCorrect() {
        if (this.flashOverlay) this.flashOverlay(0x10b981);
        super.onAnswerCorrect();
    }

    protected onAnswerWrong() {
        if (this.flashOverlay) this.flashOverlay(0xef4444);
        super.onAnswerWrong();
    }
`;

            content = content.substring(0, createStartIndex) + replacement + content.substring(updateStartIndex);
        }
    }

    // Replace private baseLayout with protected
    content = content.replace(/private baseLayout\(\)/g, "protected baseLayout()");

    fs.writeFileSync(filePath, content);
    console.log(`Refactored ${file}`);
}
