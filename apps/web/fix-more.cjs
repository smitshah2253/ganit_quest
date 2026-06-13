const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

// Rename exports from XxxScreen to XxxPage
const exportRenames = [
  ['LoginScreen', 'LoginPage'],
  ['RegisterScreen', 'RegisterPage'],
  ['ForgotPasswordScreen', 'ForgotPasswordPage'],
  ['ResetPasswordScreen', 'ResetPasswordPage'],
  ['HomeScreen', 'HomePage'],
  ['GradeScreen', 'GradeSelectionPage'],
  ['ChapterScreen', 'ChapterListPage'],
  ['ChapterIntroScreen', 'ChapterIntroPage'],
  ['LevelGridScreen', 'LevelGridPage'],
  ['LearnScreen', 'LearnPage'],
  ['LeaderboardScreen', 'LeaderboardPage']
];

walkDir(srcDir, (filePath) => {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Fix exports
  for (const [oldName, newName] of exportRenames) {
    if (content.includes(`export const ${oldName}`) || content.includes(`function ${oldName}`)) {
      content = content.replace(new RegExp(oldName, 'g'), newName);
    }
  }

  // Fix specific broken imports
  content = content.replace(/\.\/LanguageSwitcher/g, '../common/LanguageSwitcher');
  content = content.replace(/\.\.\/chapter\/ChapterGrid/g, '../components/ChapterGrid');
  content = content.replace(/\.\.\/chapter\/LevelGrid/g, '../components/LevelGrid');
  content = content.replace(/\.\/concept-panel\/ConceptPanel/g, '@/features/learn/components/ConceptPanel');
  content = content.replace(/\.\/scenes\//g, '../scenes/');
  content = content.replace(/\.\.\/EventBus/g, '../engine/EventBus');
  content = content.replace(/\.\.\/SoundManager/g, '../engine/SoundManager');
  content = content.replace(/\.\.\/learn\/animations\//g, '../animations/');
  content = content.replace(/\.\.\/learn\/Paywall/g, '../components/Paywall');
  content = content.replace(/\.\/gameStore/g, './game.store');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
  }
});
console.log("Done");
