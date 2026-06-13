const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const scenes = [
    'APScene.ts',
    'ApplicationsTrigScene.ts',
    'AreasCircleScene.ts',
    'CoordinateScene.ts',
    'ProbabilityScene.ts',
    'StatisticsScene.ts',
    'TriangleScene.ts',
    'TrigonometryScene.ts'
];

for (const scene of scenes) {
    const targetPath = path.join(__dirname, 'apps/web/src/features/game/scenes', scene);
    try {
        const content = execSync(`git show HEAD:src/game/scenes/${scene}`, { encoding: 'utf8' });
        fs.writeFileSync(targetPath, content);
        console.log(`Restored ${scene}`);
    } catch (e) {
        console.error(`Failed to restore ${scene}`, e.message);
    }
}
