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

    // Remove any leftover private declarations that conflict with BaseScene
    content = content.replace(/private isLevelActive[^\n]*\n/g, '');
    content = content.replace(/private levelSpec[^\n]*\n/g, '');
    content = content.replace(/private glowEmitter[^\n]*\n/g, '');
    content = content.replace(/private smokeEmitter[^\n]*\n/g, '');
    content = content.replace(/private currentLevelData[^\n]*\n/g, '');
    
    // Fix EventBus paths
    content = content.replace(/'\.\.\/EventBus'/g, "'../engine/EventBus'");
    content = content.replace(/'\.\.\/SoundManager'/g, "'../engine/SoundManager'");
    content = content.replace(/'\.\.\/TouchHandler'/g, "'../engine/TouchHandler'");

    // Fix levelSpecs paths
    content = content.replace(/'\.\.\/\.\.\/data\/levelSpecs'/g, "'@/data/levelSpecs'");

    fs.writeFileSync(filePath, content);
}
