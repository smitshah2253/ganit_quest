import Phaser, { Scene, GameObjects } from 'phaser';
import { EventBus, EVENTS } from '../engine/EventBus';
import type { LevelSpecification } from '@/data/levelSpecs';

export abstract class BaseScene extends Scene {
    protected isLevelActive: boolean = false;
    protected currentLevelData: any = null;
    protected levelSpec: LevelSpecification | null = null;
    
    // Particle emitters for common feedback
    protected glowEmitter!: GameObjects.Particles.ParticleEmitter;
    protected smokeEmitter!: GameObjects.Particles.ParticleEmitter;

    constructor(key: string) {
        super(key);
    }

    create() {
        // Shared background color
        this.cameras.main.setBackgroundColor('#ecf2f7');

        // Initialize particle emitters
        this.glowEmitter = this.add.particles(0, 0, 'spark', {
            x: this.cameras.main.width / 2,
            y: this.cameras.main.height / 2,
            speed: { min: 50, max: 150 },
            scale: { start: 0.8, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 800,
            frequency: 50,
            quantity: 3,
            blendMode: 'ADD',
            emitting: false
        });

        this.smokeEmitter = this.add.particles(0, 0, 'spark', {
            x: this.cameras.main.width / 2,
            y: this.cameras.main.height / 2,
            speed: { min: 30, max: 80 },
            scale: { start: 1.5, end: 3 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 1000,
            frequency: 30,
            quantity: 2,
            blendMode: 'NORMAL',
            emitting: false,
            tint: 0x64748b
        });

        // Resize handler
        const onResize = (gameSize: Phaser.Structs.Size) => {
            if (!this.cameras || !this.cameras.main) return;
            this.cameras.main.setSize(gameSize.width, gameSize.height);
            this.onResize(gameSize);
        };
        this.scale.on('resize', onResize);

        // Event Bus bindings
        const handleLoadLevel = (levelData: any) => {
            if (!this.scene || !this.scene.systems) return;
            this.onLevelLoad(levelData);
        };

        const handleUserInput = (data: { value: string, levelId: string }) => {
            if (!this.scene || !this.scene.systems) return;
            if (!this.isLevelActive || !this.levelSpec) return;
            if (this.levelSpec.id !== data.levelId) return; // ensure it's for this level
            this.onUserInput(data.value, data.levelId);
        };

        const handleBoardInput = (data: { inputs: string[], levelId: string }) => {
            if (!this.scene || !this.scene.systems) return;
            if (!this.isLevelActive || !this.levelSpec) return;
            if (this.levelSpec.id !== data.levelId) return;
            this.onBoardInput(data.inputs, data.levelId);
        };

        const handleCorrect = () => this.onAnswerCorrect();
        const handleWrong = () => this.onAnswerWrong();

        EventBus.on('load-level', handleLoadLevel);
        EventBus.on('user-input-changed', handleUserInput);
        EventBus.on('board-exam-input-changed', handleBoardInput);
        EventBus.on('answer-correct', handleCorrect);
        EventBus.on('answer-wrong', handleWrong);

        // Safe cleanup
        const cleanup = () => {
            EventBus.off('load-level', handleLoadLevel);
            EventBus.off('user-input-changed', handleUserInput);
            EventBus.off('board-exam-input-changed', handleBoardInput);
            EventBus.off('answer-correct', handleCorrect);
            EventBus.off('answer-wrong', handleWrong);
            this.scale.off('resize', onResize);
            this.onCleanup();
        };

        this.events.once('shutdown', cleanup);
        this.events.once('destroy', cleanup);

        // Let child classes do their specific initialization
        this.onSceneCreate();

        EventBus.emit(EVENTS.GAME_READY, this);
    }

    // Abstract & Virtual Methods for child scenes to implement
    protected abstract onSceneCreate(): void;
    protected abstract onLevelLoad(levelData: any): void;
    protected abstract onUserInput(value: string, levelId: string): void;
    protected abstract onBoardInput(inputs: string[], levelId: string): void;
    
    // Virtual method for cleanup if child needs it
    protected onCleanup(): void {}
    // Virtual method for resize logic
    protected onResize(_gameSize: Phaser.Structs.Size): void {}

    // Default implementations for feedback
    protected onAnswerCorrect() {
        this.triggerGlowEffect();
    }

    protected onAnswerWrong() {
        this.triggerSmokeEffect();
    }

    protected triggerGlowEffect() {
        if (this.glowEmitter && this.cameras.main) {
            const centerX = this.cameras.main.width / 2;
            const centerY = this.cameras.main.height / 2;
            this.glowEmitter.emitParticleAt(centerX, centerY, 30);
            this.time.delayedCall(200, () => {
                this.glowEmitter.emitParticleAt(centerX, centerY, 20);
            });
        }
    }

    protected triggerSmokeEffect() {
        if (this.smokeEmitter && this.cameras.main) {
            const centerX = this.cameras.main.width / 2;
            const centerY = this.cameras.main.height / 2;
            this.smokeEmitter.emitParticleAt(centerX, centerY, 15);
        }
    }

    // Layout helper
    protected baseLayout() {
        const W = this.cameras.main.width;
        const H = this.cameras.main.height;
        return {
            W, H,
            cx: W / 2,
            cy: H / 2
        };
    }
}
