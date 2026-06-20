const fs = require('fs');
let content = fs.readFileSync('c:/Users/Smit/OneDrive/Desktop/Projects/startup/gamified_math/apps/web/src/features/game/scenes/TriangleScene.ts', 'utf8');

// Replace this.lbl('A', Ax + 10, Ay - 8, ...) with this.lbl('A', 'A', Ax + 10, Ay - 8, ...)
// It finds this.lbl('STRING', followed by a number or an expression that doesn't start with a quote
content = content.replace(/this\.lbl\((['"`])([^'"`]+)\1,\s*([^'"`\s][^,]*),\s*([^,]+)/g, (match, q, text, arg2, arg3) => {
    // If arg2 looks like it could be a coordinate, meaning the actual 'text' arg was omitted
    // For example, if arg2 is 'Bx - 22' or 'Ax'
    return `this.lbl(${q}${text}${q}, ${q}${text}${q}, ${arg2}, ${arg3}`;
});

fs.writeFileSync('c:/Users/Smit/OneDrive/Desktop/Projects/startup/gamified_math/apps/web/src/features/game/scenes/TriangleScene.ts', content);
console.log('Fixed TriangleScene');
