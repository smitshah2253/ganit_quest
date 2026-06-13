import { Scene } from 'phaser';

export class BootScene extends Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Preload any necessary assets here
        // Since we are using procedurally generated graphics for MVP, we might not need many images
        // We could load basic textures or fonts if needed
    }

    create() {
        // Generate global textures for particles
        if (!this.textures.exists('particle_star')) {
            const g = this.make.graphics({ x: 0, y: 0 }, false);
            g.fillStyle(0xffffff, 1);
            g.fillCircle(4, 4, 4);
            g.generateTexture('particle_star', 8, 8);
        }
        // Move to the level scene immediately (or menu if we had one)
        // The level will be set by the React component via EventBus
        this.scene.start('LevelScene');
    }
}
