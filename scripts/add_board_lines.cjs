const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'data', 'specs', 'areasCircleSpecs.ts');
let content = fs.readFileSync(targetPath, 'utf8');

// Regex to match each level block and inject boardExamLines before the end of the object.
// The objects look like:
// "lvl-areas-c-XX": { ... bookPage: { ... } }, or similar. Let's find bookPage block and insert after it.

const levelRegex = /("lvl-areas-c-\d{2}":\s*{[\s\S]*?bookPage:\s*{[\s\S]*?}\s*)/g;

content = content.replace(levelRegex, (match) => {
    // Check if boardExamLines already exists to avoid duplication
    if (match.includes('boardExamLines:')) return match;
    
    // We can extract some data if we wanted, but generic lines are okay too.
    // Let's do a generic one based on the visual type or just a standard one.
    
    const lines = `,
    boardExamLines: [
      { lineNum: 1, textBefore: "Analyze the circular geometry given." },
      { lineNum: 2, textBefore: "Apply the relevant formula (Area, Circumference, Sector, etc.)" },
      { lineNum: 3, textBefore: "Calculated Value = ", hasInput: true, inputIndex: 0, correctAnswer: "0", placeholder: "value", textAfter: "", widthChars: 5 }
    ]`;
    
    return match + lines;
});

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Done modifying areasCircleSpecs.ts');
