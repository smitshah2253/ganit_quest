const fs = require('fs');
const path = require('path');

const scenesDir = path.join(__dirname, 'src/features/game/scenes');

fs.readdirSync(scenesDir).forEach(file => {
    if (file.endsWith('.ts')) {
        const filePath = path.join(scenesDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        content = content.replace(/from "(\.\.\/TouchHandler)"/g, 'from "../engine/TouchHandler"');
        content = content.replace(/from '(\.\.\/TouchHandler)'/g, "from '../engine/TouchHandler'");

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            console.log(`Fixed TouchHandler import in ${file}`);
        }
    }
});
