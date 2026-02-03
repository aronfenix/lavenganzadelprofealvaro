// ============================================================
// ESCENAS MEJORADAS CON CINEMATICAS Y EFECTOS AVANZADOS
// ============================================================

// ==================== INTRO CINEMATICA ====================
class CinematicIntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CinematicIntroScene' });
    }

    create() {
        this.effects = new EffectsManager(this);

        // Fondo negro inicial
        this.bg = this.add.rectangle(400, 300, 800, 600, 0x0a0a15);

        // Skip button - funciona en cualquier momento
        this.add.text(650, 20, 'ENTER/CLICK: Saltar', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#444444'
        });

        this.canSkip = true;

        this.input.keyboard.on('keydown-ENTER', () => {
            if (this.canSkip) this.goToMenu();
        });

        this.input.on('pointerdown', () => {
            if (this.canSkip) this.goToMenu();
        });

        // Iniciar intro
        this.startIntro();
    }

    goToMenu() {
        this.canSkip = false;
        if (this.profAnim) this.profAnim.destroy();
        this.cameras.main.fadeOut(300);
        this.time.delayedCall(300, () => {
            this.scene.start('EnhancedMenuScene');
        });
    }

    startIntro() {
        // Paso 1: Mostrar año y lugar
        const yearText = this.add.text(400, 280, 'CEIP PERU - MADRID', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            color: '#4ecca3'
        }).setOrigin(0.5).setAlpha(0);

        const year2Text = this.add.text(400, 330, '2026', {
            fontFamily: '"Press Start 2P"',
            fontSize: '48px',
            color: '#e94560'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: [yearText, year2Text],
            alpha: 1,
            duration: 1000,
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: [yearText, year2Text],
                        alpha: 0,
                        duration: 500,
                        onComplete: () => {
                            yearText.destroy();
                            year2Text.destroy();
                            this.showNarration();
                        }
                    });
                });
            }
        });
    }

    showNarration() {
        // Texto de narración
        const narrationText = this.add.text(400, 280, 'En el CEIP Peru de Madrid...', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#4ecca3',
            align: 'center',
            wordWrap: { width: 700 }
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: narrationText,
            alpha: 1,
            duration: 800
        });

        this.time.delayedCall(2500, () => {
            narrationText.setText('Los alumnos de 6º de Primaria\nenfrentan su mayor desafío...');

            this.time.delayedCall(2500, () => {
                this.tweens.add({
                    targets: narrationText,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        narrationText.destroy();
                        this.showProfessor();
                    }
                });
            });
        });
    }

    showProfessor() {
        // Profesor aparece
        this.professor = this.add.sprite(400, 250, 'prof_idle_0');
        this.professor.setScale(3.5);
        this.professor.setAlpha(0);

        this.tweens.add({
            targets: this.professor,
            alpha: 1,
            scale: 4,
            duration: 1000,
            ease: 'Back.easeOut'
        });

        // Animación
        this.profAnim = this.time.addEvent({
            delay: 150,
            callback: () => {
                if (this.professor && this.professor.texture) {
                    const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                    this.professor.setTexture(`prof_talk_${frame}`);
                }
            },
            loop: true
        });

        // Dialogo
        this.dialogueBox = this.add.container(400, 520);

        const boxBg = this.add.graphics();
        boxBg.fillStyle(0x1a1a2e, 0.95);
        boxBg.fillRoundedRect(-350, -50, 700, 100, 10);
        boxBg.lineStyle(3, 0xe94560);
        boxBg.strokeRoundedRect(-350, -50, 700, 100, 10);

        const speakerText = this.add.text(-330, -35, 'PROFESOR ALVARO', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#e94560'
        });

        this.dialogueText = this.add.text(0, 10, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 650 }
        }).setOrigin(0.5);

        this.dialogueBox.add([boxBg, speakerText, this.dialogueText]);
        this.dialogueBox.setAlpha(0);

        this.tweens.add({
            targets: this.dialogueBox,
            alpha: 1,
            duration: 500
        });

        // Secuencia de dialogos
        this.time.delayedCall(500, () => this.showDialogues());
    }

    showDialogues() {
        const dialogues = [
            'Llevo AÑOS enseñando Geografía a 6º de Primaria...',
            '¡Y estoy HARTO de que nadie estudie!',
            '¿Creéis que las capitales se aprenden solas?',
            '¡MUAJAJAJA! ¡He creado el EXAMEN DEFINITIVO!',
            '¡Un examen del que NINGÚN alumno puede escapar!'
        ];

        let index = 0;

        const showNext = () => {
            if (index >= dialogues.length) {
                this.finishIntro();
                return;
            }

            // Typewriter effect
            const text = dialogues[index];
            let charIndex = 0;
            this.dialogueText.setText('');

            const typeTimer = this.time.addEvent({
                delay: 35,
                callback: () => {
                    if (charIndex < text.length) {
                        this.dialogueText.setText(text.substring(0, charIndex + 1));
                        charIndex++;
                    } else {
                        typeTimer.destroy();
                    }
                },
                loop: true
            });

            // Efectos según diálogo
            if (index === 3) {
                // Risa malvada
                this.time.delayedCall(500, () => {
                    if (this.profAnim) this.profAnim.destroy();
                    this.profAnim = this.time.addEvent({
                        delay: 100,
                        callback: () => {
                            if (this.professor && this.professor.texture) {
                                const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                                this.professor.setTexture(`prof_laugh_${frame}`);
                            }
                        },
                        loop: true
                    });
                    this.effects.shake(0.01, 300);
                    audioManager.playLaugh && audioManager.playLaugh();
                });
            }

            index++;
            this.time.delayedCall(2800, showNext);
        };

        showNext();
    }

    finishIntro() {
        // Limpiar
        if (this.profAnim) this.profAnim.destroy();

        // Mostrar texto final
        this.dialogueText.setText('Pero los alumnos de 6º decidieron plantarle cara...');

        this.time.delayedCall(2500, () => {
            // Ir al menu
            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('EnhancedMenuScene');
            });
        });
    }
}

// ==================== MENU MEJORADO ====================
class EnhancedMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EnhancedMenuScene' });
    }

    create() {
        this.effects = new EffectsManager(this);

        // Fondo con parallax
        this.createBackground();

        // Titulo
        this.createTitle();

        // Profesor animado
        this.createProfessor();

        // Menu de botones
        this.createMenu();

        // Estadisticas rapidas
        this.createStatsDisplay();

        // Musica
        this.input.once('pointerdown', () => {
            audioManager.init && audioManager.init();
            audioManager.resume && audioManager.resume();
            audioManager.playMenuMusic && audioManager.playMenuMusic();
        });

        this.cameras.main.fadeIn(500);

        // ===== MODO DEBUG =====
        // Atajos de teclado para probar escenas directamente
        this.createDebugMode();
    }

    createDebugMode() {
        // Texto de ayuda debug (pequeño y discreto)
        const debugHelp = this.add.text(10, 580, 'DEBUG: M=Mapa F=Final V=Victoria O=Orden T=Match', {
            fontFamily: '"Press Start 2P"',
            fontSize: '6px',
            color: '#333333'
        });

        // Atajos de teclado
        this.input.keyboard.on('keydown-M', () => {
            // Probar MapGameScene (mapa de Europa)
            this.scene.start('MapGameScene', {
                level: 1,
                mapType: 'europe',
                isCapitals: true,
                totalCorrect: 5,
                score: 1000,
                lives: 3
            });
        });

        this.input.keyboard.on('keydown-F', () => {
            // Probar FinalScene (derrota)
            this.scene.start('FinalScene', {
                victory: false,
                level: 3,
                totalCorrect: 15,
                score: 3500,
                reason: 'lives'
            });
        });

        this.input.keyboard.on('keydown-V', () => {
            // Probar FinalScene (victoria)
            this.scene.start('FinalScene', {
                victory: true,
                level: 4,
                totalCorrect: 35,
                score: 8500
            });
        });

        this.input.keyboard.on('keydown-O', () => {
            // Probar OrderingGameScene
            this.scene.start('OrderingGameScene', {
                level: 2,
                totalCorrect: 10,
                score: 2000,
                lives: 3
            });
        });

        this.input.keyboard.on('keydown-T', () => {
            // Probar MatchingGameScene
            this.scene.start('MatchingGameScene', {
                level: 1,
                totalCorrect: 5,
                score: 1200,
                lives: 3
            });
        });

        this.input.keyboard.on('keydown-W', () => {
            // Probar MapGameScene (mapa del mundo)
            this.scene.start('MapGameScene', {
                level: 3,
                mapType: 'world',
                isCapitals: false,
                totalCorrect: 20,
                score: 4000,
                lives: 3
            });
        });
    }

    createBackground() {
        // Capa de fondo
        this.bg = this.add.image(400, 300, 'bg_classroom');
        this.bg.setAlpha(0.3);

        // Particulas flotantes
        for (let i = 0; i < 30; i++) {
            const particle = this.add.rectangle(
                Math.random() * 800,
                Math.random() * 600,
                4,
                4,
                0xe94560
            ).setAlpha(0.2 + Math.random() * 0.3);

            this.tweens.add({
                targets: particle,
                y: particle.y - 100 - Math.random() * 100,
                alpha: 0,
                duration: 3000 + Math.random() * 3000,
                repeat: -1,
                delay: Math.random() * 3000,
                onRepeat: () => {
                    particle.y = 600 + Math.random() * 100;
                    particle.x = Math.random() * 800;
                    particle.setAlpha(0.2 + Math.random() * 0.3);
                }
            });
        }
    }

    createTitle() {
        // Sombra del titulo
        this.add.text(403, 73, 'LA VENGANZA DEL', {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#000000'
        }).setOrigin(0.5).setAlpha(0.5);

        this.add.text(400, 70, 'LA VENGANZA DEL', {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#e94560'
        }).setOrigin(0.5);

        this.add.text(403, 108, 'PROFESOR ALVARO', {
            fontFamily: '"Press Start 2P"',
            fontSize: '26px',
            color: '#000000'
        }).setOrigin(0.5).setAlpha(0.5);

        const mainTitle = this.add.text(400, 105, 'PROFESOR ALVARO', {
            fontFamily: '"Press Start 2P"',
            fontSize: '26px',
            color: '#e94560'
        }).setOrigin(0.5);

        // Glow pulsante
        this.tweens.add({
            targets: mainTitle,
            scale: 1.02,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createProfessor() {
        this.professor = this.add.sprite(650, 400, 'prof_idle_0');
        this.professor.setScale(2.5);

        // Animacion idle
        this.time.addEvent({
            delay: 400,
            callback: () => {
                const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                this.professor.setTexture(`prof_idle_${frame}`);
            },
            loop: true
        });

        // Movimiento suave
        this.effects.float(this.professor, 8, 2500);

        // Bocadillo con frases
        this.speechBubble = this.add.container(650, 280);

        const bubbleBg = this.add.graphics();
        bubbleBg.fillStyle(0xffffff, 0.95);
        bubbleBg.fillRoundedRect(-100, -30, 200, 60, 10);

        // Triangulo del bocadillo
        bubbleBg.fillTriangle(-20, 30, 20, 30, 0, 50);

        this.speechText = this.add.text(0, 0, '"Te atreves?"', {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#0a0a15',
            align: 'center',
            wordWrap: { width: 180 }
        }).setOrigin(0.5);

        this.speechBubble.add([bubbleBg, this.speechText]);

        // Cambiar frases
        const phrases = [
            '"Te atreves?"',
            '"Nadie aprueba..."',
            '"Muajajaja..."',
            '"Preparate..."',
            '"Tu perdicion..."',
            '"Sera LEGENDARIO!"'
        ];

        let phraseIndex = 0;
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                phraseIndex = (phraseIndex + 1) % phrases.length;
                this.speechText.setText(phrases[phraseIndex]);
            },
            loop: true
        });
    }

    createMenu() {
        const menuX = 180;
        const startY = 200;
        const spacing = 55;

        const menuItems = [
            { text: 'JUGAR', action: () => this.startGame() },
            { text: 'MODO ESTUDIO', action: () => this.scene.start('StudyModeScene') },
            { text: 'RANKING', action: () => this.scene.start('LeaderboardScene') },
            { text: 'LOGROS', action: () => this.scene.start('AchievementsScene') },
            { text: 'INSTRUCCIONES', action: () => this.showInstructions() }
        ];

        menuItems.forEach((item, index) => {
            const btn = this.createMenuButton(menuX, startY + index * spacing, item.text, item.action);

            // Animacion de entrada escalonada
            btn.setAlpha(0);
            btn.x -= 50;

            this.tweens.add({
                targets: btn,
                alpha: 1,
                x: menuX,
                duration: 400,
                delay: 200 + index * 100,
                ease: 'Back.easeOut'
            });
        });
    }

    createMenuButton(x, y, text, callback) {
        const container = this.add.container(x, y);

        // Fondo con gradiente simulado
        const bg = this.add.graphics();
        bg.fillStyle(0x16213e, 1);
        bg.fillRoundedRect(-120, -22, 240, 44, 8);
        bg.lineStyle(3, 0xe94560);
        bg.strokeRoundedRect(-120, -22, 240, 44, 8);

        // Icono decorativo
        const icon = this.add.rectangle(-100, 0, 8, 8, 0xe94560);

        const label = this.add.text(0, 0, text, {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#e94560'
        }).setOrigin(0.5);

        container.add([bg, icon, label]);
        container.setSize(240, 44);
        container.setInteractive();

        container.on('pointerover', () => {
            audioManager.playHover && audioManager.playHover();
            bg.clear();
            bg.fillStyle(0xe94560, 1);
            bg.fillRoundedRect(-120, -22, 240, 44, 8);
            label.setColor('#0a0a15');
            icon.setFillStyle(0x0a0a15);

            this.tweens.add({
                targets: container,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100
            });
        });

        container.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(0x16213e, 1);
            bg.fillRoundedRect(-120, -22, 240, 44, 8);
            bg.lineStyle(3, 0xe94560);
            bg.strokeRoundedRect(-120, -22, 240, 44, 8);
            label.setColor('#e94560');
            icon.setFillStyle(0xe94560);

            this.tweens.add({
                targets: container,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });

        container.on('pointerdown', () => {
            audioManager.playClick && audioManager.playClick();
            callback();
        });

        return container;
    }

    createStatsDisplay() {
        const stats = achievementSystem.stats;
        const progress = achievementSystem.getProgress();

        // Panel de estadisticas
        const statsPanel = this.add.container(650, 540);

        const panelBg = this.add.graphics();
        panelBg.fillStyle(0x0a0a15, 0.8);
        panelBg.fillRoundedRect(-120, -35, 240, 70, 5);

        const statsText = this.add.text(0, -15, `Record: ${stats.highScore || 0}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#ffd700'
        }).setOrigin(0.5);

        const achieveText = this.add.text(0, 10, `Logros: ${progress.unlocked}/${progress.total}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#4ecca3'
        }).setOrigin(0.5);

        statsPanel.add([panelBg, statsText, achieveText]);
    }

    startGame() {
        achievementSystem.updateStats({ gamesPlayed: 1 });

        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('LevelIntroScene', { level: 1 });
        });
    }

    showInstructions() {
        const panel = this.add.container(400, 300);

        const bg = this.add.graphics();
        bg.fillStyle(0x0a0a15, 0.98);
        bg.fillRoundedRect(-350, -250, 700, 500, 10);
        bg.lineStyle(4, 0xe94560);
        bg.strokeRoundedRect(-350, -250, 700, 500, 10);

        const title = this.add.text(0, -210, 'COMO JUGAR', {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#e94560'
        }).setOrigin(0.5);

        const content = this.add.text(0, -20,
            '4 NIVELES DE DESAFÍO:\n\n' +
            '1. Capitales de Europa\n' +
            '2. TOP 20 Países más poblados\n' +
            '3. TOP 20 Ciudades más pobladas\n' +
            '4. EXAMEN FINAL - ¡TODO MEZCLADO!\n\n' +
            '* 10 preguntas por nivel\n' +
            '* Necesitas 7/10 para pasar\n' +
            '* Tienes 3 vidas\n' +
            '* Consigue COMBOS para más puntos\n' +
            '* MINIJUEGOS especiales a mitad de nivel\n' +
            '* Usa el MODO ESTUDIO para practicar\n\n' +
            '¡Demuestra que el conocimiento\n' +
            'es más fuerte que el miedo!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#4ecca3',
            align: 'center',
            lineSpacing: 6
        }).setOrigin(0.5);

        const closeBtn = this.add.text(0, 210, '[ CERRAR ]', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#ffd700'
        }).setOrigin(0.5).setInteractive();

        closeBtn.on('pointerdown', () => {
            audioManager.playClick && audioManager.playClick();
            panel.destroy();
        });

        closeBtn.on('pointerover', () => closeBtn.setColor('#ffffff'));
        closeBtn.on('pointerout', () => closeBtn.setColor('#ffd700'));

        panel.add([bg, title, content, closeBtn]);

        // Animacion de entrada
        panel.setScale(0);
        this.tweens.add({
            targets: panel,
            scale: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }
}

// ==================== MODO ESTUDIO ====================
class StudyModeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StudyModeScene' });
    }

    create() {
        this.add.rectangle(400, 300, 800, 600, 0x0a0a15);

        this.add.text(400, 50, 'MODO ESTUDIO', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            color: '#4ecca3'
        }).setOrigin(0.5);

        this.add.text(400, 90, 'Aprende antes de jugar', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#888888'
        }).setOrigin(0.5);

        // Opciones de estudio
        const topics = [
            { id: 'capitals', name: 'Capitales de Europa', icon: 'EU', color: '#4ecca3' },
            { id: 'countries', name: 'TOP 20 Paises', icon: 'WLD', color: '#e94560' },
            { id: 'cities', name: 'TOP 20 Ciudades', icon: 'CTY', color: '#ffd700' },
            { id: 'locations', name: 'Ubicaciones', icon: 'MAP', color: '#ff69b4' }
        ];

        topics.forEach((topic, index) => {
            this.createTopicButton(400, 180 + index * 80, topic);
        });

        // Boton volver
        this.createButton(400, 540, 'VOLVER', () => {
            this.scene.start('EnhancedMenuScene');
        });

        this.cameras.main.fadeIn(500);
    }

    createTopicButton(x, y, topic) {
        const container = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(0x16213e, 1);
        bg.fillRoundedRect(-280, -30, 560, 60, 10);
        bg.lineStyle(3, Phaser.Display.Color.HexStringToColor(topic.color).color);
        bg.strokeRoundedRect(-280, -30, 560, 60, 10);

        const icon = this.add.text(-240, 0, topic.icon, {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: topic.color
        }).setOrigin(0.5);

        const name = this.add.text(0, 0, topic.name, {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const arrow = this.add.text(240, 0, '>', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: topic.color
        }).setOrigin(0.5);

        container.add([bg, icon, name, arrow]);
        container.setSize(560, 60);
        container.setInteractive();

        container.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(Phaser.Display.Color.HexStringToColor(topic.color).color, 0.3);
            bg.fillRoundedRect(-280, -30, 560, 60, 10);
            bg.lineStyle(3, Phaser.Display.Color.HexStringToColor(topic.color).color);
            bg.strokeRoundedRect(-280, -30, 560, 60, 10);
        });

        container.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(0x16213e, 1);
            bg.fillRoundedRect(-280, -30, 560, 60, 10);
            bg.lineStyle(3, Phaser.Display.Color.HexStringToColor(topic.color).color);
            bg.strokeRoundedRect(-280, -30, 560, 60, 10);
        });

        container.on('pointerdown', () => {
            audioManager.playClick && audioManager.playClick();
            this.scene.start('FlashcardScene', { topic: topic.id, topicName: topic.name, color: topic.color });
        });

        return container;
    }

    createButton(x, y, text, callback) {
        const btn = this.add.text(x, y, `[ ${text} ]`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#e94560'
        }).setOrigin(0.5).setInteractive();

        btn.on('pointerover', () => btn.setColor('#ffffff'));
        btn.on('pointerout', () => btn.setColor('#e94560'));
        btn.on('pointerdown', () => {
            audioManager.playClick && audioManager.playClick();
            callback();
        });

        return btn;
    }
}

// ==================== FLASHCARDS ====================
class FlashcardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FlashcardScene' });
    }

    init(data) {
        this.topic = data.topic;
        this.topicName = data.topicName;
        this.color = data.color;
    }

    create() {
        this.effects = new EffectsManager(this);

        this.add.rectangle(400, 300, 800, 600, 0x0a0a15);

        // Titulo
        this.add.text(400, 40, this.topicName, {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: this.color
        }).setOrigin(0.5);

        // Generar flashcards
        studyMode.generateFlashcards(this.topic);

        // Progreso
        this.progressText = this.add.text(400, 80, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#888888'
        }).setOrigin(0.5);

        // Area de la carta
        this.cardContainer = this.add.container(400, 300);
        this.createCard();

        // Botones
        this.createControls();

        this.updateProgress();
        this.cameras.main.fadeIn(500);
    }

    createCard() {
        this.cardContainer.removeAll(true);

        const card = studyMode.getCurrentCard();
        if (!card) {
            this.showComplete();
            return;
        }

        this.isFlipped = false;

        // Carta
        const cardBg = this.add.graphics();
        cardBg.fillStyle(0x16213e, 1);
        cardBg.fillRoundedRect(-250, -120, 500, 240, 15);
        cardBg.lineStyle(4, Phaser.Display.Color.HexStringToColor(this.color).color);
        cardBg.strokeRoundedRect(-250, -120, 500, 240, 15);

        // Contenido frontal
        this.frontContent = this.add.container(0, 0);

        const questionText = this.add.text(0, -20, card.front, {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 450 }
        }).setOrigin(0.5);

        const tapHint = this.add.text(0, 80, 'Toca para ver respuesta', {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#666666'
        }).setOrigin(0.5);

        this.frontContent.add([questionText, tapHint]);

        // Contenido trasero
        this.backContent = this.add.container(0, 0);
        this.backContent.setAlpha(0);

        const answerText = this.add.text(0, -40, card.back, {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: this.color,
            align: 'center'
        }).setOrigin(0.5);

        let extras = [];
        if (card.extra) {
            extras.push(this.add.text(0, 10, card.extra, {
                fontFamily: '"Press Start 2P"',
                fontSize: '10px',
                color: '#888888'
            }).setOrigin(0.5));
        }

        if (card.fact) {
            extras.push(this.add.text(0, 60, card.fact, {
                fontFamily: '"Press Start 2P"',
                fontSize: '8px',
                color: '#4ecca3',
                align: 'center',
                wordWrap: { width: 450 }
            }).setOrigin(0.5));
        }

        this.backContent.add([answerText, ...extras]);

        this.cardContainer.add([cardBg, this.frontContent, this.backContent]);

        // Interaccion para voltear
        cardBg.setInteractive(new Phaser.Geom.Rectangle(-250, -120, 500, 240), Phaser.Geom.Rectangle.Contains);
        cardBg.on('pointerdown', () => this.flipCard());
    }

    flipCard() {
        if (this.isFlipping) return;
        this.isFlipping = true;

        audioManager.playClick && audioManager.playClick();

        this.tweens.add({
            targets: this.cardContainer,
            scaleX: 0,
            duration: 150,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                this.isFlipped = !this.isFlipped;
                this.frontContent.setAlpha(this.isFlipped ? 0 : 1);
                this.backContent.setAlpha(this.isFlipped ? 1 : 0);

                this.tweens.add({
                    targets: this.cardContainer,
                    scaleX: 1,
                    duration: 150,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        this.isFlipping = false;
                    }
                });
            }
        });
    }

    createControls() {
        // Boton: Lo se
        const knowBtn = this.createButton(250, 480, 'LO SE', '#4ecca3', () => {
            studyMode.markKnown();
            this.nextCard();
        });

        // Boton: No lo se
        const dontKnowBtn = this.createButton(550, 480, 'NO LO SE', '#e94560', () => {
            studyMode.markUnknown();
            this.nextCard();
        });

        // Boton volver
        this.createButton(100, 550, 'VOLVER', '#888888', () => {
            this.scene.start('StudyModeScene');
        });
    }

    createButton(x, y, text, color, callback) {
        const btn = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(0x16213e, 1);
        bg.fillRoundedRect(-80, -20, 160, 40, 8);
        bg.lineStyle(2, Phaser.Display.Color.HexStringToColor(color).color);
        bg.strokeRoundedRect(-80, -20, 160, 40, 8);

        const label = this.add.text(0, 0, text, {
            fontFamily: '"Press Start 2P"',
            fontSize: '11px',
            color: color
        }).setOrigin(0.5);

        btn.add([bg, label]);
        btn.setSize(160, 40);
        btn.setInteractive();

        btn.on('pointerdown', () => {
            audioManager.playClick && audioManager.playClick();
            callback();
        });

        return btn;
    }

    nextCard() {
        this.updateProgress();

        this.tweens.add({
            targets: this.cardContainer,
            x: -400,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                this.cardContainer.x = 800;
                this.createCard();
                this.tweens.add({
                    targets: this.cardContainer,
                    x: 400,
                    alpha: 1,
                    duration: 200
                });
            }
        });
    }

    updateProgress() {
        const progress = studyMode.getProgress();
        this.progressText.setText(`${progress.current}/${progress.total} | Sabes: ${progress.known} | Repasar: ${progress.unknown}`);
    }

    showComplete() {
        this.cardContainer.removeAll(true);

        const progress = studyMode.getProgress();

        const completeBg = this.add.graphics();
        completeBg.fillStyle(0x16213e, 1);
        completeBg.fillRoundedRect(-200, -100, 400, 200, 15);

        const title = this.add.text(0, -60, 'COMPLETADO!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#4ecca3'
        }).setOrigin(0.5);

        const stats = this.add.text(0, -10, `Sabias: ${progress.known}\nPara repasar: ${progress.unknown}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        this.cardContainer.add([completeBg, title, stats]);

        if (progress.unknown > 0) {
            const repeatBtn = this.createButton(400, 400, 'REPASAR LAS FALLADAS', '#ffd700', () => {
                studyMode.repeatUnknown();
                this.updateProgress();
                this.cardContainer.x = 800;
                this.createCard();
                this.tweens.add({
                    targets: this.cardContainer,
                    x: 400,
                    duration: 200
                });
            });
        }
    }
}

// ==================== ESCENA DE LOGROS ====================
class AchievementsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AchievementsScene' });
    }

    create() {
        this.add.rectangle(400, 300, 800, 600, 0x0a0a15);

        // Titulo
        this.add.text(400, 40, 'LOGROS', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            color: '#ffd700'
        }).setOrigin(0.5);

        // Progreso general
        const progress = achievementSystem.getProgress();
        this.add.text(400, 80, `${progress.unlocked}/${progress.total} desbloqueados (${progress.percentage}%)`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#888888'
        }).setOrigin(0.5);

        // Puntos totales
        this.add.text(400, 105, `Puntos: ${achievementSystem.getTotalPoints()}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#4ecca3'
        }).setOrigin(0.5);

        // Lista de logros con scroll
        const achievements = achievementSystem.getAll();
        const visibleAchievements = achievements.filter(a => !a.secret || a.unlocked);

        const startY = 150;
        const itemHeight = 55;
        const maxVisible = 7;

        this.scrollY = 0;
        this.achievementContainer = this.add.container(0, 0);

        visibleAchievements.forEach((achievement, index) => {
            const item = this.createAchievementItem(400, startY + index * itemHeight, achievement);
            this.achievementContainer.add(item);
        });

        // Mascara de scroll
        const mask = this.add.graphics();
        mask.fillRect(0, 130, 800, 400);
        this.achievementContainer.setMask(mask.createGeometryMask());

        // Scroll con rueda
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            const maxScroll = Math.max(0, (visibleAchievements.length - maxVisible) * itemHeight);
            this.scrollY = Phaser.Math.Clamp(this.scrollY + deltaY * 0.5, 0, maxScroll);
            this.achievementContainer.y = -this.scrollY;
        });

        // Boton volver
        this.add.text(400, 560, '[ VOLVER ]', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#e94560'
        }).setOrigin(0.5).setInteractive()
            .on('pointerdown', () => this.scene.start('EnhancedMenuScene'))
            .on('pointerover', function() { this.setColor('#ffffff'); })
            .on('pointerout', function() { this.setColor('#e94560'); });

        this.cameras.main.fadeIn(500);
    }

    createAchievementItem(x, y, achievement) {
        const container = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(achievement.unlocked ? 0x1a2a1a : 0x1a1a2a, 1);
        bg.fillRoundedRect(-350, -22, 700, 44, 5);

        if (achievement.unlocked) {
            bg.lineStyle(2, Phaser.Display.Color.HexStringToColor(achievement.color).color);
            bg.strokeRoundedRect(-350, -22, 700, 44, 5);
        }

        // Icono
        const iconBg = this.add.circle(-310, 0, 18, achievement.unlocked ?
            Phaser.Display.Color.HexStringToColor(achievement.color).color : 0x333333);

        const iconText = this.add.text(-310, 0, achievement.unlocked ? '*' : '?', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: achievement.unlocked ? '#ffffff' : '#666666'
        }).setOrigin(0.5);

        // Nombre
        const name = this.add.text(-270, -8, achievement.name, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: achievement.unlocked ? '#ffffff' : '#666666'
        });

        // Descripcion
        const desc = this.add.text(-270, 8, achievement.unlocked ? achievement.description : '???', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: achievement.unlocked ? '#888888' : '#444444'
        });

        // Puntos
        const points = this.add.text(320, 0, `${achievement.points}pts`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: achievement.unlocked ? '#ffd700' : '#444444'
        }).setOrigin(1, 0.5);

        container.add([bg, iconBg, iconText, name, desc, points]);
        return container;
    }
}

// Hacer disponibles globalmente
window.CinematicIntroScene = CinematicIntroScene;
window.EnhancedMenuScene = EnhancedMenuScene;
window.StudyModeScene = StudyModeScene;
window.FlashcardScene = FlashcardScene;
window.AchievementsScene = AchievementsScene;
