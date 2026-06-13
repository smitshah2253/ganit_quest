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
        const createBody = content.substring(createIndex, updateIndex);
        
        const onLoadIndex = createBody.indexOf('const onLoadLevel =');
        if (onLoadIndex !== -1) {
            let sceneCreateLogic = createBody.substring('    create() {'.length, onLoadIndex);
            // clean up sceneCreateLogic
            sceneCreateLogic = sceneCreateLogic.replace(/this\.cameras\.main\.setBackgroundColor\('[^']+'\);\n/g, '');
            sceneCreateLogic = sceneCreateLogic.replace(/this\.cameras\.main\.setBackgroundColor\(.*?\);\n/g, '');
            
            let loadLogic = extractFunctionBody(createBody, onLoadIndex);
            // remove guard
            loadLogic = loadLogic.replace(/if \(!this\.scene\?\.systems\) return;\n\s+/g, '');
            loadLogic = loadLogic.replace(/if \(!this\.scene \|\| !this\.scene\.systems\) return;\n\s+/g, '');

            const onUserIndex = createBody.indexOf('const onUserInput =');
            let userLogic = '';
            if (onUserIndex !== -1) {
                userLogic = extractFunctionBody(createBody, onUserIndex);
                userLogic = userLogic.replace(/if \(!this\.isLevelActive \|\| !this\.levelSpec\) return;\n\s+/g, '');
                userLogic = userLogic.replace(/if \(d\.levelId !== this\.levelSpec\.id\) return;\n\s+/g, '');
                userLogic = userLogic.replace(/const v = parseFloat\(d\.value\);/g, 'const v = parseFloat(value);');
                userLogic = userLogic.replace(/d\.value/g, 'value');
                userLogic = userLogic.replace(/parseFloat\(data\.value\)/g, 'parseFloat(value)');
            }

            const onBoardIndex = createBody.indexOf('const onBoardInput =');
            let boardLogic = '';
            if (onBoardIndex !== -1) {
                boardLogic = extractFunctionBody(createBody, onBoardIndex);
                boardLogic = boardLogic.replace(/if \(!this\.isLevelActive \|\| !this\.levelSpec\) return;\n\s+/g, '');
                boardLogic = boardLogic.replace(/if \(d\.levelId !== this\.levelSpec\.id\) return;\n\s+/g, '');
                boardLogic = boardLogic.replace(/d\.inputs/g, 'inputs');
                boardLogic = boardLogic.replace(/d\.levelId/g, 'levelId');
            }

            const onResizeIndex = createBody.indexOf('const onResize =');
            let resizeLogic = '';
            if (onResizeIndex !== -1) {
                resizeLogic = extractFunctionBody(createBody, onResizeIndex);
                resizeLogic = resizeLogic.replace(/if \(!this\.cameras \|\| !this\.cameras\.main\) return;\n\s+/g, '');
                resizeLogic = resizeLogic.replace(/this\.cameras\.main\.setSize\(.*?\);\n\s+/g, '');
            }

            let replacement = `    protected onSceneCreate() {${sceneCreateLogic}}

    protected onLevelLoad(data: any) {${loadLogic}}

    protected onUserInput(value: string, levelId: string) {${userLogic}}

    protected onBoardInput(inputs: string[], levelId: string) {${boardLogic}}

    protected onResize(gs: Phaser.Structs.Size) {${resizeLogic}}

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
    }
    
    // Change private baseLayout to protected
    content = content.replace(/private baseLayout\(/g, "protected baseLayout(");

    // Write file
    fs.writeFileSync(filePath, content);
    console.log(`Refactored ${file}`);
}

function extractFunctionBody(content, startIndex) {
    let braceCount = 0;
    let started = false;
    let bodyStart = -1;
    let bodyEnd = -1;

    for (let i = startIndex; i < content.length; i++) {
        if (content[i] === '{') {
            if (!started) {
                started = true;
                bodyStart = i + 1;
            }
            braceCount++;
        } else if (content[i] === '}') {
            braceCount--;
            if (started && braceCount === 0) {
                bodyEnd = i;
                break;
            }
        }
    }

    if (bodyStart !== -1 && bodyEnd !== -1) {
        return content.substring(bodyStart, bodyEnd);
    }
    return '';
}
