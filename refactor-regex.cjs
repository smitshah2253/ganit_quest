const fs = require('fs');
const path = require('path');

const scenesDir = path.join(__dirname, 'apps/web/src/features/game/scenes');

const files = [
    'APScene.ts',
    'ApplicationsTrigScene.ts',
    'AreasCircleScene.ts',
    'CoordinateScene.ts',
    'ProbabilityScene.ts',
    'StatisticsScene.ts',
    'TriangleScene.ts',
    'TrigonometryScene.ts'
];

for (const file of files) {
    const filePath = path.join(scenesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Fix Imports
    content = content.replace(
        "import Phaser, { Scene, GameObjects } from 'phaser';",
        "import Phaser, { GameObjects } from 'phaser';\nimport { BaseScene } from './BaseScene';"
    );
    content = content.replace(
        "import { Scene, GameObjects } from 'phaser';",
        "import { GameObjects } from 'phaser';\nimport { BaseScene } from './BaseScene';"
    );

    // 2. Change class signature
    content = content.replace(
        `export class ${file.replace('.ts', '')} extends Scene {`,
        `export class ${file.replace('.ts', '')} extends BaseScene {`
    );

    // 3. Remove properties
    content = content.replace(/    private levelSpec.*?null;\n/g, "");
    content = content.replace(/    private isLevelActive.*?false;\n/g, "");
    content = content.replace(/    private glowEmitter.*?;\n/g, "");
    content = content.replace(/    private smokeEmitter.*?;\n/g, "");

    // 4. Refactor create() to class methods
    const createIndex = content.indexOf('    create() {');
    const updateIndex = content.indexOf('    update() {');
    
    if (createIndex !== -1 && updateIndex !== -1) {
        let createBody = content.substring(createIndex, updateIndex);
        
        // Extract sceneCreateLogic (everything before onLoadLevel)
        let sceneCreateLogic = '';
        const mCreate = createBody.match(/^[\s\S]*?(?=const onLoadLevel =)/);
        if (mCreate) {
            sceneCreateLogic = mCreate[0].replace('    create() {', '').trim();
            sceneCreateLogic = sceneCreateLogic.replace(/this\.cameras\.main\.setBackgroundColor\('[^']+'\);\n/g, '');
            sceneCreateLogic = sceneCreateLogic.replace(/this\.cameras\.main\.setBackgroundColor\(.*?\);\n/g, '');
        }

        // Extract onLoadLevel
        let loadLogic = '';
        const mLoad = createBody.match(/const onLoadLevel = \([^)]+\) => \{([\s\S]*?)\};\s*(?:const onUserInput|const onBoardInput|const onCorrect|EventBus\.on)/);
        if (mLoad) {
            loadLogic = mLoad[1].trim();
            loadLogic = loadLogic.replace(/if \(!this\.scene\?\.systems\) return;\n\s+/g, '');
            loadLogic = loadLogic.replace(/if \(!this\.scene \|\| !this\.scene\.systems\) return;\n\s+/g, '');
        }

        // Extract onUserInput
        let userLogic = '';
        const mUser = createBody.match(/const onUserInput = \([^)]+\) => \{([\s\S]*?)\};\s*(?:const onBoardInput|const onCorrect|EventBus\.on)/);
        if (mUser) {
            userLogic = mUser[1].trim();
            userLogic = userLogic.replace(/if \(!this\.isLevelActive \|\| !this\.levelSpec\) return;\n\s+/g, '');
            userLogic = userLogic.replace(/if \(d\.levelId !== this\.levelSpec\.id\) return;\n\s+/g, '');
            userLogic = userLogic.replace(/const v = parseFloat\(d\.value\);/g, 'const v = parseFloat(value);');
            userLogic = userLogic.replace(/parseFloat\(data\.value\)/g, 'parseFloat(value)');
            userLogic = userLogic.replace(/d\.value/g, 'value');
            userLogic = userLogic.replace(/data\.value/g, 'value');
        }

        // Extract onBoardInput
        let boardLogic = '';
        const mBoard = createBody.match(/const onBoardInput = \([^)]+\) => \{([\s\S]*?)\};\s*(?:const onCorrect|const onWrong|EventBus\.on)/);
        if (mBoard) {
            boardLogic = mBoard[1].trim();
            boardLogic = boardLogic.replace(/if \(!this\.isLevelActive \|\| !this\.levelSpec\) return;\n\s+/g, '');
            boardLogic = boardLogic.replace(/if \(d\.levelId !== this\.levelSpec\.id\) return;\n\s+/g, '');
            boardLogic = boardLogic.replace(/d\.inputs/g, 'inputs');
            boardLogic = boardLogic.replace(/data\.inputs/g, 'inputs');
            boardLogic = boardLogic.replace(/d\.levelId/g, 'levelId');
            boardLogic = boardLogic.replace(/data\.levelId/g, 'levelId');
        }

        // Extract onResize
        let resizeLogic = '';
        const mResize = createBody.match(/const onResize = \([^)]+\) => \{([\s\S]*?)\};\s*(?:this\.scale\.on)/);
        if (mResize) {
            resizeLogic = mResize[1].trim();
            resizeLogic = resizeLogic.replace(/if \(!this\.cameras \|\| !this\.cameras\.main\) return;\n\s+/g, '');
            resizeLogic = resizeLogic.replace(/this\.cameras\.main\.setSize\(.*?\);\n\s+/g, '');
            // Some might use gs or gameSize
            resizeLogic = resizeLogic.replace(/gs\./g, 'gameSize.');
        }

        let replacement = `    protected onSceneCreate() {
        ${sceneCreateLogic}
    }

    protected onLevelLoad(data: any) {
        ${loadLogic}
    }

    protected onUserInput(value: string, levelId: string) {
        ${userLogic}
    }

    protected onBoardInput(inputs: string[], levelId: string) {
        ${boardLogic}
    }

    protected onResize(gameSize: Phaser.Structs.Size) {
        ${resizeLogic}
    }

    protected onAnswerCorrect() {
        if ((this as any).flashOverlay) (this as any).flashOverlay(0x10b981);
        if ((this as any).triggerGlowEffect) super.onAnswerCorrect();
        else super.onAnswerCorrect();
    }

    protected onAnswerWrong() {
        if ((this as any).flashOverlay) (this as any).flashOverlay(0xef4444);
        if ((this as any).triggerSmokeEffect) super.onAnswerWrong();
        else super.onAnswerWrong();
    }
`;
        content = content.substring(0, createIndex) + replacement + content.substring(updateIndex);
    }
    
    // Change private baseLayout to protected
    content = content.replace(/private baseLayout\(/g, "protected baseLayout(");

    // Write file
    fs.writeFileSync(filePath, content);
    console.log(`Refactored ${file}`);
}
