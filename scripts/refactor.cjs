const fs = require('fs');
let content = fs.readFileSync('src/data/specs/areasCircleSpecs.ts', 'utf8');

// 1. Change export array to const Record
content = content.replace(/export const areasCircleLevels:\s*LevelSpecification\[\]\s*=\s*\[/, 'const areasCircleSpecs: Record<string, LevelSpecification> = {');
content = content.replace(/\];\s*export default areasCircleLevels;/, '};\n\nexport default areasCircleSpecs;');

// 2. Change objects to properties: { id: '...', -> '...': { id: '...',
content = content.replace(/{\s*id:\s*'([^']+)',/g, '\"$1\": {\n    id: \'$1\',');

// 3. Fix correctAnswer: ['5'] -> correctAnswer: 5
content = content.replace(/correctAnswer:\s*\[['"]([^'"]+)['"]\]/g, (match, val) => {
    if(val.includes('/')) {
        let [num, den] = val.split('/');
        return 'correctAnswer: ' + (parseFloat(num)/parseFloat(den));
    }
    return 'correctAnswer: ' + val;
});

// Some objects might have multiple answers, let's fix boss level correctAnswer
content = content.replace(/correctAnswer:\s*\[['"]([^'"]+)['"],\s*['"]([^'"]+)['"],\s*['"]([^'"]+)['"]\]/g, 'correctAnswer: ' + (3465/2));

// Fix inputLabels
content = content.replace(/inputLabels:\s*\[['"]([^'"]+)['"][^\]]*\]/g, 'inputLabel: \'$1\'');

// 4. Add missing properties to each level
content = content.replace(/starsNeeded:\s*(\d+),/g, `starsNeeded: $1,
    question: 'Areas Related to Circles Challenge',
    placeholder: 'Type value...',
    tolerance: 0.1,
    calculateValue: (val) => val,
    getDimensionsLabel: (val) => \`Value = \${val}\`,
    bookPage: {
      title: '📖 Areas Related to Circles',
      concept: 'Apply the formulas for circle areas, sectors, and arcs.',
      formulaBreakdown: 'See level hints.',
      stepByStep: ['Analyze the given values.', 'Calculate the target measurement.'],
      visualTip: 'Observe the interactive circular grid.'
    }`);

fs.writeFileSync('src/data/specs/areasCircleSpecs.ts', content);
