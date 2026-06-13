import { Events } from 'phaser';

// Global Event Bus to communicate between React and Phaser
export const EventBus = new Events.EventEmitter();

export const EVENTS = {
    GAME_READY: 'game-ready',
    LEVEL_COMPLETED: 'level-completed',
    UPDATE_XP: 'update-xp',
    RESTART_LEVEL: 'restart-level'
};
