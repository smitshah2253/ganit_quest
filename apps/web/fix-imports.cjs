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

const mappings = {
  // stores
  'store/authStore': '@/store/auth.store',
  'store/gameStore': '@/store/game.store',
  'store/subscriptionStore': '@/store/subscription.store',
  
  // common & layout
  'components/Header': '@/components/layout/Header',
  'components/LanguageSwitcher': '@/components/common/LanguageSwitcher',
  
  // auth
  'components/auth/LoginScreen': '@/features/auth/pages/LoginPage',
  'components/auth/RegisterScreen': '@/features/auth/pages/RegisterPage',
  'components/auth/ForgotPasswordScreen': '@/features/auth/pages/ForgotPasswordPage',
  'components/auth/ResetPasswordScreen': '@/features/auth/pages/ResetPasswordPage',
  
  // home
  'components/screens/HomeScreen': '@/features/home/pages/HomePage',
  'components/screens/GradeScreen': '@/features/home/pages/GradeSelectionPage',
  
  // chapters
  'components/screens/ChapterScreen': '@/features/chapters/pages/ChapterListPage',
  'components/screens/ChapterIntroScreen': '@/features/chapters/pages/ChapterIntroPage',
  'components/screens/LevelGridScreen': '@/features/chapters/pages/LevelGridPage',
  'components/chapter/ChapterGrid': '@/features/chapters/components/ChapterGrid',
  'components/chapter/LevelGrid': '@/features/chapters/components/LevelGrid',
  
  // game
  'components/GameContainer': '@/features/game/components/GameContainer',
  'components/ResultScreen': '@/features/game/components/ResultScreen',
  'components/ConceptBook': '@/features/game/components/ConceptBook',
  'game/EventBus': '@/features/game/engine/EventBus',
  'game/SoundManager': '@/features/game/engine/SoundManager',
  'game/TouchHandler': '@/features/game/engine/TouchHandler',
  'game/config': '@/features/game/engine/config',
  'game/PhaserGame': '@/features/game/engine/PhaserGame',
  
  // learn
  'components/screens/LearnScreen': '@/features/learn/pages/LearnPage',
  'components/concept-panel/ConceptPanel': '@/features/learn/components/ConceptPanel',
  'components/concept-panel/ConceptPanelHeader': '@/features/learn/components/ConceptPanelHeader',
  'components/concept-panel/BoardExamNotebook': '@/features/learn/components/BoardExamNotebook',
  'components/concept-panel/FormulaDisplayBox': '@/features/learn/components/FormulaDisplayBox',
  'components/learn/Paywall': '@/features/learn/components/Paywall',
  
  // leaderboard
  'components/screens/LeaderboardScreen': '@/features/leaderboard/pages/LeaderboardPage',
  
  // i18n
  'i18n': '@/i18n',
  
  // other common imports
  'components/common/ProtectedRoute': '@/components/common/ProtectedRoute',
  'app/routes': '@/app/routes'
};

const prefixMappings = [
  ['game/scenes/', '@/features/game/scenes/'],
  ['game/mechanics/', '@/features/game/engine/mechanics/'], // wait, engine or game? The structure has them... let's just do game/
  ['components/learn/animations/', '@/features/learn/animations/'],
  ['data/', '@/data/'],
  ['assets/', '@/assets/'],
  ['i18n/', '@/i18n/']
];

walkDir(srcDir, (filePath) => {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // We find all imports: import ... from '...'
  content = content.replace(/from\s+['"]([^'"]+)['"]/g, (match, importPath) => {
    // If it's a relative import, let's try to resolve it from the OLD file location to get the "src-relative" path
    // Wait, the files have MOVED. So we can't easily resolve.
    // Instead, just look for the old strings manually or use a regex to match the ends.
    // E.g. if importPath is '../../store/authStore', it ends with 'store/authStore'
    
    // Check exact matches
    for (const [oldPath, newPath] of Object.entries(mappings)) {
      if (importPath.endsWith(oldPath)) {
        return `from '${newPath}'`;
      }
    }
    
    // Check prefix matches
    for (const [oldPrefix, newPrefix] of prefixMappings) {
      const parts = importPath.split('/');
      // e.g. '../../game/scenes/BootScene'
      const idx = importPath.lastIndexOf(oldPrefix);
      if (idx !== -1) {
        const trailing = importPath.substring(idx + oldPrefix.length);
        return `from '${newPrefix}${trailing}'`;
      }
    }
    
    // Generic fix for other store/data/assets that might just be `../store/X`
    if (importPath.includes('/store/')) {
        const name = importPath.split('/').pop();
        if (name === 'authStore') return `from '@/store/auth.store'`;
        if (name === 'gameStore') return `from '@/store/game.store'`;
        if (name === 'subscriptionStore') return `from '@/store/subscription.store'`;
    }
    
    if (importPath.includes('/data/')) {
        const trailing = importPath.substring(importPath.indexOf('/data/') + 6);
        return `from '@/data/${trailing}'`;
    }

    if (importPath.includes('/assets/')) {
        const trailing = importPath.substring(importPath.indexOf('/assets/') + 8);
        return `from '@/assets/${trailing}'`;
    }

    return match; // return unchanged
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
  }
});

console.log("Imports fixed!");
