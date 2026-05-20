import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { LevelScene } from './scenes/LevelScene';

export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#ecf2f7',
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%'
    },
    scene: [
        BootScene,
        LevelScene
    ]
};
