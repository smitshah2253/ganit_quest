import '@testing-library/jest-dom';
import { vi as vitest } from 'vitest';

// Mock Canvas for Phaser in JSDOM
HTMLCanvasElement.prototype.getContext = () => {
  return {
    fillStyle: '',
    fillRect: vitest.fn(),
    clearRect: vitest.fn(),
    getImageData: vitest.fn(() => ({ data: [] })),
    putImageData: vitest.fn(),
    createImageData: vitest.fn(() => []),
    setTransform: vitest.fn(),
    drawImage: vitest.fn(),
    save: vitest.fn(),
    fillText: vitest.fn(),
    restore: vitest.fn(),
    beginPath: vitest.fn(),
    moveTo: vitest.fn(),
    lineTo: vitest.fn(),
    closePath: vitest.fn(),
    stroke: vitest.fn(),
    translate: vitest.fn(),
    scale: vitest.fn(),
    rotate: vitest.fn(),
    arc: vitest.fn(),
    fill: vitest.fn(),
    measureText: vitest.fn(() => ({ width: 0 })),
    transform: vitest.fn(),
    rect: vitest.fn(),
    clip: vitest.fn(),
  } as any;
};

