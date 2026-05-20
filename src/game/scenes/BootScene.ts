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
        // Move to the level scene immediately (or menu if we had one)
        // The level will be set by the React component via EventBus
        this.scene.start('LevelScene');
    }
}
