/**
 * Mobile Touch Handler for Phaser
 * Provides enhanced touch experience with:
 * - 40px+ hit zones for draggable objects
 * - Visual feedback (glow effects)
 * - Smooth drag behavior on mobile
 * - Haptic feedback support (iOS)
 */

import Phaser from 'phaser';

export interface TouchDraggableConfig {
  hitZoneRadius?: number;
  enableHaptics?: boolean;
  enableGlowFeedback?: boolean;
  dragSensitivity?: number;
}

export class TouchHandler {
  static readonly DEFAULT_HIT_ZONE = 40; // 40px hit zone for mobile
  static readonly GLOW_INTENSITY = 0.4;
  static readonly GLOW_COLOR = 0xffd700; // Gold glow

  /**
   * Make a Phaser game object mobile-friendly draggable
   * Creates invisible hit zone + visual feedback
   */
  static makeMobileDraggable(
    scene: Phaser.Scene,
    gameObject: Phaser.GameObjects.GameObject,
    config: TouchDraggableConfig = {}
  ) {
    const hitZoneRadius = config.hitZoneRadius || this.DEFAULT_HIT_ZONE;
    const enableGlowFeedback = config.enableGlowFeedback !== false;

    // Get position
    const pos = gameObject as any;
    if (!pos.x || !pos.y) return;

    // Create invisible hit zone that's 40px radius
    // This detects finger touches much better than the visible circle
    const hitZone = scene.add.circle(pos.x, pos.y, hitZoneRadius, 0x000000, 0);
    hitZone.setDepth((gameObject as any).depth - 5);

    // Make it interactive
    hitZone.setInteractive({ useHandCursor: true });
    scene.input.setDraggable(hitZone);

    // Store reference to visual object
    (hitZone as any).visualObject = gameObject;

    // Visual feedback on hover
    if (enableGlowFeedback) {
      hitZone.on('pointerover', () => {
        this.activateGlow(gameObject);
      });

      hitZone.on('pointerout', () => {
        this.deactivateGlow(gameObject);
      });
    }

    // Drag start feedback
    hitZone.on('dragstart', () => {
      this.activateGlow(gameObject, true); // Stronger glow during drag
      if (config.enableHaptics) {
        this.triggerHaptic('light');
      }
    });

    // Drag end feedback
    hitZone.on('dragend', () => {
      this.deactivateGlow(gameObject);
      if (config.enableHaptics) {
        this.triggerHaptic('medium');
      }
    });

    return hitZone;
  }

  /**
   * Apply visual glow effect to object
   */
  static activateGlow(
    gameObject: Phaser.GameObjects.GameObject,
    intensified: boolean = false
  ) {
    const intensity = intensified ? 0.6 : this.GLOW_INTENSITY;

    if (gameObject instanceof Phaser.GameObjects.Arc) {
      // Add glow circle if not already present
      const scene = gameObject.scene;
      const pos = gameObject as any;

      if (!(pos as any)._glowEffect) {
        const glow = scene.add
          .circle(pos.x, pos.y, 32, this.GLOW_COLOR, intensity)
          .setDepth((gameObject as any).depth - 1);
        (pos as any)._glowEffect = glow;

        // Pulse animation
        scene.tweens.add({
          targets: glow,
          scale: intensified ? 1.2 : 1,
          duration: 200,
          ease: 'Power2'
        });
      }
    }
  }

  /**
   * Remove visual glow effect
   */
  static deactivateGlow(gameObject: Phaser.GameObjects.GameObject) {
    const pos = gameObject as any;
    if ((pos as any)._glowEffect) {
      (pos as any)._glowEffect.destroy();
      (pos as any)._glowEffect = null;
    }
  }

  /**
   * Trigger haptic feedback on mobile
   * iOS: uses Navigator vibration API
   */
  static triggerHaptic(pattern: 'light' | 'medium' | 'heavy' = 'light') {
    if ('vibrate' in navigator) {
      const patterns: Record<string, number | number[]> = {
        light: 10,
        medium: 20,
        heavy: [30, 10, 30]
      };

      try {
        navigator.vibrate(patterns[pattern]);
      } catch (e) {
        // Silently fail if vibration not supported
      }
    }
  }

  /**
   * Update hit zone position when object moves
   * Call this in your drag handler
   */
  static updateHitZone(
    hitZone: Phaser.GameObjects.Arc,
    x: number,
    y: number
  ) {
    hitZone.x = x;
    hitZone.y = y;

    // Update glow if present
    const pos = (hitZone as any).visualObject as any;
    if (pos?._glowEffect) {
      pos._glowEffect.x = x;
      pos._glowEffect.y = y;
    }
  }

  /**
   * Detect if position is within hit zone
   */
  static isWithinHitZone(
    hitZone: Phaser.GameObjects.Arc,
    x: number,
    y: number
  ): boolean {
    const distance = Phaser.Math.Distance.Between(
      hitZone.x,
      hitZone.y,
      x,
      y
    );
    return distance <= hitZone.radius;
  }

  /**
   * Convert touch event to game coordinates
   * Handles canvas scaling and camera transforms
   */
  static convertTouchToGameCoords(
    scene: Phaser.Scene,
    pointer: Phaser.Input.Pointer
  ): { x: number; y: number } {
    const worldPoint = scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    return {
      x: worldPoint.x,
      y: worldPoint.y
    };
  }

  /**
   * Smooth drag with momentum
   * Continues movement briefly after finger lift
   */
  static createSmoothDragTween(
    scene: Phaser.Scene,
    gameObject: Phaser.GameObjects.GameObject,
    targetX: number,
    targetY: number,
    duration: number = 150
  ) {
    return scene.tweens.add({
      targets: gameObject,
      x: targetX,
      y: targetY,
      duration,
      ease: 'Power2.easeOut',
      onUpdate: () => {
        // Update any related visual elements
        if ((gameObject as any)._updateCallback) {
          (gameObject as any)._updateCallback();
        }
      }
    });
  }

  /**
   * Clamp position to boundary
   */
  static clampToBounds(
    x: number,
    y: number,
    minX: number,
    maxX: number,
    minY: number,
    maxY: number
  ): { x: number; y: number } {
    return {
      x: Phaser.Math.Clamp(x, minX, maxX),
      y: Phaser.Math.Clamp(y, minY, maxY)
    };
  }
}
