import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { LevelScene } from '../scenes/LevelScene';
import { CoordinateScene } from '../scenes/CoordinateScene';
import { TrigonometryScene } from '../scenes/TrigonometryScene';
import { ApplicationsTrigScene } from '../scenes/ApplicationsTrigScene';
import { APScene } from '../scenes/APScene';
import { ProbabilityScene } from '../scenes/ProbabilityScene';
import { TriangleScene } from '../scenes/TriangleScene';
import { CircleScene } from '../scenes/CircleScene';
import AreasCircleScene from '../scenes/AreasCircleScene';
import { StatisticsScene } from '../scenes/StatisticsScene';
import { RealNumbersScene } from '../scenes/RealNumbersScene';

export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#ecf2f7',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%',
        expandParent: true
    },
    scene: [
        BootScene,
        LevelScene,
        CoordinateScene,
        TrigonometryScene,
        ApplicationsTrigScene,
        APScene,
        ProbabilityScene,
        TriangleScene,
        CircleScene,
        AreasCircleScene,
        StatisticsScene,
        RealNumbersScene
    ]
};
