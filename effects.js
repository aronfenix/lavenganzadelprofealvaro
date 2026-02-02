// ============================================================
// SISTEMA DE EFECTOS VISUALES AVANZADOS
// ============================================================

class EffectsManager {
    constructor(scene) {
        this.scene = scene;
    }

    // ==================== SCREEN SHAKE ====================
    shake(intensity = 0.01, duration = 200) {
        this.scene.cameras.main.shake(duration, intensity);
    }

    // ==================== SCREEN FLASH ====================
    flash(color = 0xffffff, duration = 200) {
        this.scene.cameras.main.flash(duration,
            (color >> 16) & 0xff,
            (color >> 8) & 0xff,
            color & 0xff
        );
    }

    // ==================== SLOW MOTION ====================
    slowMotion(duration = 1000, scale = 0.3) {
        this.scene.time.timeScale = scale;
        this.scene.time.delayedCall(duration * scale, () => {
            this.scene.time.timeScale = 1;
        });
    }

    // ==================== ZOOM EFFECT ====================
    zoomTo(target, zoom = 1.5, duration = 500, callback) {
        this.scene.cameras.main.pan(target.x, target.y, duration, 'Power2');
        this.scene.cameras.main.zoomTo(zoom, duration, 'Power2', false, (cam, progress) => {
            if (progress === 1 && callback) callback();
        });
    }

    zoomReset(duration = 500) {
        this.scene.cameras.main.pan(400, 300, duration, 'Power2');
        this.scene.cameras.main.zoomTo(1, duration, 'Power2');
    }

    // ==================== DRAMATIC VIGNETTE ====================
    createVignette(intensity = 0.3) {
        // Create edge-based vignette using rectangles on the borders
        const container = this.scene.add.container(0, 0);

        // Top edge gradient
        for (let i = 0; i < 10; i++) {
            const rect = this.scene.add.rectangle(400, i * 8, 800, 16, 0x000000);
            rect.setAlpha(intensity * (1 - i / 10));
            container.add(rect);
        }

        // Bottom edge gradient
        for (let i = 0; i < 10; i++) {
            const rect = this.scene.add.rectangle(400, 600 - i * 8, 800, 16, 0x000000);
            rect.setAlpha(intensity * (1 - i / 10));
            container.add(rect);
        }

        // Left edge gradient
        for (let i = 0; i < 8; i++) {
            const rect = this.scene.add.rectangle(i * 10, 300, 20, 600, 0x000000);
            rect.setAlpha(intensity * (1 - i / 8) * 0.7);
            container.add(rect);
        }

        // Right edge gradient
        for (let i = 0; i < 8; i++) {
            const rect = this.scene.add.rectangle(800 - i * 10, 300, 20, 600, 0x000000);
            rect.setAlpha(intensity * (1 - i / 8) * 0.7);
            container.add(rect);
        }

        container.setDepth(1000);
        container.setScrollFactor(0);
        return container;
    }

    // ==================== GLITCH EFFECT ====================
    glitch(duration = 500) {
        const originalX = this.scene.cameras.main.scrollX;
        let elapsed = 0;

        const glitchEvent = this.scene.time.addEvent({
            delay: 50,
            callback: () => {
                elapsed += 50;
                if (elapsed < duration) {
                    this.scene.cameras.main.scrollX = originalX + (Math.random() - 0.5) * 20;
                    // Random color offset
                    if (Math.random() > 0.7) {
                        this.flash(Math.random() > 0.5 ? 0xff0000 : 0x00ffff, 50);
                    }
                } else {
                    this.scene.cameras.main.scrollX = originalX;
                    glitchEvent.destroy();
                }
            },
            loop: true
        });
    }

    // ==================== PARTICLE EXPLOSION ====================
    explode(x, y, config = {}) {
        const {
            count = 20,
            colors = [0xffd700, 0xe94560, 0x4ecca3],
            speed = 300,
            lifespan = 1000,
            scale = 1,
            gravity = 300
        } = config;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const velocity = speed * (0.5 + Math.random() * 0.5);
            const color = colors[Math.floor(Math.random() * colors.length)];

            const particle = this.scene.add.rectangle(x, y, 8 * scale, 8 * scale, color);
            particle.setDepth(500);

            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            this.scene.tweens.add({
                targets: particle,
                x: x + vx * (lifespan / 1000),
                y: y + vy * (lifespan / 1000) + gravity * Math.pow(lifespan / 1000, 2) / 2,
                alpha: 0,
                scale: 0,
                rotation: Math.random() * Math.PI * 4,
                duration: lifespan,
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    // ==================== FIREWORKS ====================
    firework(x, y) {
        // Trail going up
        const trail = this.scene.add.container(x, 600);
        const trailParticle = this.scene.add.rectangle(0, 0, 4, 12, 0xffd700);
        trail.add(trailParticle);

        this.scene.tweens.add({
            targets: trail,
            y: y,
            duration: 800,
            ease: 'Cubic.easeOut',
            onUpdate: () => {
                // Leave trail particles
                if (Math.random() > 0.5) {
                    const spark = this.scene.add.rectangle(trail.x, trail.y, 3, 3, 0xffd700);
                    this.scene.tweens.add({
                        targets: spark,
                        alpha: 0,
                        scale: 0,
                        duration: 300,
                        onComplete: () => spark.destroy()
                    });
                }
            },
            onComplete: () => {
                trail.destroy();
                this.explode(x, y, { count: 40, speed: 400, gravity: 200 });
                audioManager.playExplosion && audioManager.playExplosion();
            }
        });
    }

    // ==================== TEXT EFFECTS ====================
    createAnimatedText(x, y, text, style, effect = 'wave') {
        const container = this.scene.add.container(x, y);
        const chars = text.split('');
        let offsetX = 0;

        const tempText = this.scene.add.text(0, 0, 'W', style);
        const charWidth = tempText.width;
        tempText.destroy();

        const totalWidth = chars.length * charWidth;
        offsetX = -totalWidth / 2;

        chars.forEach((char, i) => {
            const charText = this.scene.add.text(offsetX + i * charWidth, 0, char, style);
            charText.setOrigin(0.5);
            container.add(charText);

            if (effect === 'wave') {
                this.scene.tweens.add({
                    targets: charText,
                    y: -10,
                    duration: 500,
                    yoyo: true,
                    repeat: -1,
                    delay: i * 50,
                    ease: 'Sine.easeInOut'
                });
            } else if (effect === 'rainbow') {
                const colors = [0xff0000, 0xff7f00, 0xffff00, 0x00ff00, 0x0000ff, 0x8b00ff];
                this.scene.tweens.addCounter({
                    from: 0,
                    to: colors.length - 1,
                    duration: 2000,
                    repeat: -1,
                    delay: i * 100,
                    onUpdate: (tween) => {
                        const colorIndex = Math.floor(tween.getValue());
                        charText.setTint(colors[colorIndex]);
                    }
                });
            } else if (effect === 'shake') {
                this.scene.tweens.add({
                    targets: charText,
                    x: charText.x + (Math.random() - 0.5) * 4,
                    y: charText.y + (Math.random() - 0.5) * 4,
                    duration: 50,
                    yoyo: true,
                    repeat: -1
                });
            } else if (effect === 'typewriter') {
                charText.setAlpha(0);
                this.scene.time.delayedCall(i * 80, () => {
                    charText.setAlpha(1);
                    audioManager.playDialogueBeep && audioManager.playDialogueBeep();
                });
            }
        });

        return container;
    }

    // ==================== DRAMATIC ENTRANCE ====================
    dramaticEntrance(target, from = 'bottom', duration = 800) {
        const originalX = target.x;
        const originalY = target.y;
        const originalAlpha = target.alpha;
        const originalScale = target.scale || target.scaleX || 1;

        switch(from) {
            case 'bottom':
                target.y = 700;
                target.alpha = 0;
                break;
            case 'top':
                target.y = -100;
                target.alpha = 0;
                break;
            case 'left':
                target.x = -100;
                target.alpha = 0;
                break;
            case 'right':
                target.x = 900;
                target.alpha = 0;
                break;
            case 'zoom':
                target.setScale(0);
                target.alpha = 0;
                break;
        }

        return this.scene.tweens.add({
            targets: target,
            x: originalX,
            y: originalY,
            alpha: originalAlpha,
            scale: originalScale,
            duration: duration,
            ease: 'Back.easeOut'
        });
    }

    // ==================== FLOATING ANIMATION ====================
    float(target, amplitude = 10, duration = 2000) {
        const originalY = target.y;
        return this.scene.tweens.add({
            targets: target,
            y: originalY - amplitude,
            duration: duration,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    // ==================== PULSE ANIMATION ====================
    pulse(target, scale = 1.1, duration = 500) {
        return this.scene.tweens.add({
            targets: target,
            scaleX: scale,
            scaleY: scale,
            duration: duration,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    // ==================== SCORE POPUP ====================
    scorePopup(x, y, text, color = '#ffd700') {
        const popup = this.scene.add.text(x, y, text, {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: color,
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        popup.setDepth(1000);

        this.scene.tweens.add({
            targets: popup,
            y: y - 80,
            alpha: 0,
            scale: 1.5,
            duration: 1000,
            ease: 'Cubic.easeOut',
            onComplete: () => popup.destroy()
        });

        return popup;
    }

    // ==================== LIGHTNING EFFECT ====================
    lightning(x1, y1, x2, y2, branches = 5) {
        const graphics = this.scene.add.graphics();
        graphics.setDepth(999);

        const drawBolt = (startX, startY, endX, endY, width, alpha) => {
            graphics.lineStyle(width, 0xffffff, alpha);
            graphics.beginPath();
            graphics.moveTo(startX, startY);

            const segments = 8;
            let currentX = startX;
            let currentY = startY;

            for (let i = 1; i <= segments; i++) {
                const progress = i / segments;
                const targetX = startX + (endX - startX) * progress;
                const targetY = startY + (endY - startY) * progress;

                const offsetX = (Math.random() - 0.5) * 40 * (1 - progress);
                const offsetY = (Math.random() - 0.5) * 20;

                currentX = targetX + offsetX;
                currentY = targetY + offsetY;

                graphics.lineTo(currentX, currentY);
            }

            graphics.strokePath();
        };

        // Main bolt
        drawBolt(x1, y1, x2, y2, 4, 1);
        drawBolt(x1, y1, x2, y2, 8, 0.5);

        // Branches
        for (let i = 0; i < branches; i++) {
            const t = 0.3 + Math.random() * 0.4;
            const branchX = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 30;
            const branchY = y1 + (y2 - y1) * t;
            const endBranchX = branchX + (Math.random() - 0.5) * 100;
            const endBranchY = branchY + 50 + Math.random() * 50;
            drawBolt(branchX, branchY, endBranchX, endBranchY, 2, 0.7);
        }

        // Flash and fade
        this.flash(0xffffff, 100);

        this.scene.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 200,
            onComplete: () => graphics.destroy()
        });
    }

    // ==================== COMBO METER ====================
    createComboMeter(x, y) {
        const container = this.scene.add.container(x, y);

        const bg = this.scene.add.rectangle(0, 0, 200, 30, 0x1a1a2e);
        bg.setStrokeStyle(2, 0xe94560);

        const fill = this.scene.add.rectangle(-95, 0, 0, 24, 0xe94560);
        fill.setOrigin(0, 0.5);

        const text = this.scene.add.text(0, 0, 'COMBO x0', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#ffffff'
        }).setOrigin(0.5);

        container.add([bg, fill, text]);
        container.fill = fill;
        container.text = text;

        container.setCombo = (combo) => {
            const width = Math.min(combo * 20, 190);
            this.scene.tweens.add({
                targets: fill,
                width: width,
                duration: 200,
                ease: 'Back.easeOut'
            });
            text.setText(`COMBO x${combo}`);

            if (combo >= 3) {
                text.setColor('#ffd700');
                this.pulse(container, 1.1, 200);
            } else {
                text.setColor('#ffffff');
            }
        };

        return container;
    }
}

// ==================== CINEMATIC SYSTEM ====================
class CinematicManager {
    constructor(scene) {
        this.scene = scene;
        this.letterboxTop = null;
        this.letterboxBottom = null;
        this.isActive = false;
    }

    // Enter cinematic mode with letterbox
    enter(duration = 500) {
        this.isActive = true;

        this.letterboxTop = this.scene.add.rectangle(400, -40, 800, 80, 0x000000);
        this.letterboxBottom = this.scene.add.rectangle(400, 640, 800, 80, 0x000000);
        this.letterboxTop.setDepth(2000);
        this.letterboxBottom.setDepth(2000);
        this.letterboxTop.setScrollFactor(0);
        this.letterboxBottom.setScrollFactor(0);

        this.scene.tweens.add({
            targets: this.letterboxTop,
            y: 40,
            duration: duration,
            ease: 'Cubic.easeOut'
        });

        this.scene.tweens.add({
            targets: this.letterboxBottom,
            y: 560,
            duration: duration,
            ease: 'Cubic.easeOut'
        });
    }

    // Exit cinematic mode
    exit(duration = 500) {
        if (!this.isActive) return;

        this.scene.tweens.add({
            targets: this.letterboxTop,
            y: -40,
            duration: duration,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                if (this.letterboxTop) this.letterboxTop.destroy();
            }
        });

        this.scene.tweens.add({
            targets: this.letterboxBottom,
            y: 640,
            duration: duration,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                if (this.letterboxBottom) this.letterboxBottom.destroy();
                this.isActive = false;
            }
        });
    }

    // Show dramatic dialogue
    async showDialogue(speaker, text, options = {}) {
        const {
            duration = 3000,
            color = '#ffffff',
            speakerColor = '#e94560',
            position = 'bottom'
        } = options;

        return new Promise((resolve) => {
            const y = position === 'bottom' ? 480 : 120;

            const container = this.scene.add.container(400, y);
            container.setDepth(2001);

            const bg = this.scene.add.graphics();
            bg.fillStyle(0x0a0a15, 0.95);
            bg.fillRoundedRect(-380, -50, 760, 100, 10);
            bg.lineStyle(3, Phaser.Display.Color.HexStringToColor(speakerColor).color);
            bg.strokeRoundedRect(-380, -50, 760, 100, 10);

            const speakerText = this.scene.add.text(-360, -35, speaker, {
                fontFamily: '"Press Start 2P"',
                fontSize: '12px',
                color: speakerColor
            });

            const dialogueText = this.scene.add.text(-360, -5, '', {
                fontFamily: '"Press Start 2P"',
                fontSize: '11px',
                color: color,
                wordWrap: { width: 700 }
            });

            container.add([bg, speakerText, dialogueText]);
            container.setAlpha(0);
            container.y += 30;

            // Animate in
            this.scene.tweens.add({
                targets: container,
                alpha: 1,
                y: y,
                duration: 300,
                ease: 'Back.easeOut'
            });

            // Typewriter effect
            let charIndex = 0;
            const typewriter = this.scene.time.addEvent({
                delay: 30,
                callback: () => {
                    if (charIndex < text.length) {
                        dialogueText.setText(text.substring(0, charIndex + 1));
                        charIndex++;
                        if (charIndex % 2 === 0) {
                            audioManager.playDialogueBeep && audioManager.playDialogueBeep();
                        }
                    } else {
                        typewriter.destroy();
                    }
                },
                loop: true
            });

            // Auto-advance or click to continue
            const clickHandler = () => {
                if (charIndex < text.length) {
                    // Skip to end
                    typewriter.destroy();
                    dialogueText.setText(text);
                    charIndex = text.length;
                } else {
                    // Continue
                    this.scene.input.off('pointerdown', clickHandler);
                    this.scene.tweens.add({
                        targets: container,
                        alpha: 0,
                        y: y + 30,
                        duration: 200,
                        onComplete: () => {
                            container.destroy();
                            resolve();
                        }
                    });
                }
            };

            this.scene.time.delayedCall(500, () => {
                this.scene.input.on('pointerdown', clickHandler);
            });

            // Auto advance after duration
            this.scene.time.delayedCall(duration, () => {
                if (charIndex >= text.length) {
                    clickHandler();
                }
            });
        });
    }

    // Fade to black and back
    async fadeToBlack(duration = 500) {
        return new Promise((resolve) => {
            this.scene.cameras.main.fadeOut(duration, 0, 0, 0);
            this.scene.time.delayedCall(duration, resolve);
        });
    }

    async fadeFromBlack(duration = 500) {
        return new Promise((resolve) => {
            this.scene.cameras.main.fadeIn(duration, 0, 0, 0);
            this.scene.time.delayedCall(duration, resolve);
        });
    }
}

// Make globally available
window.EffectsManager = EffectsManager;
window.CinematicManager = CinematicManager;
