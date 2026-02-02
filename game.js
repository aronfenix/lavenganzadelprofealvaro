// ============================================================
// LA VENGANZA DEL PROFESOR ÁLVARO - JUEGO PRINCIPAL
// ============================================================

// ==================== ESCENA DE CARGA ====================
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        const loadingFill = document.getElementById('loading-fill');
        const loadingText = document.getElementById('loading-text');
        let progress = 0;

        const updateLoading = (text, prog) => {
            loadingText.textContent = text;
            loadingFill.style.width = prog + '%';
        };

        // Generar sprites del profesor
        updateLoading('Invocando al Profesor Álvaro...', 10);
        const states = ['idle', 'talk', 'laugh', 'angry', 'shock', 'point', 'victory', 'defeat', 'walk'];
        states.forEach(state => {
            for (let frame = 0; frame < 2; frame++) {
                this.textures.addBase64(`prof_${state}_${frame}`, SpriteGenerator.createProfessor(state, frame));
            }
        });

        // Generar escenarios
        updateLoading('Creando el Aula Maldita...', 30);
        this.textures.addBase64('bg_classroom', SpriteGenerator.createClassroomBackground());

        updateLoading('Abriendo la Biblioteca Oscura...', 45);
        this.textures.addBase64('bg_library', SpriteGenerator.createLibraryBackground());

        updateLoading('Activando el Laboratorio...', 60);
        this.textures.addBase64('bg_laboratory', SpriteGenerator.createLaboratoryBackground());

        updateLoading('Entrando al Castillo...', 75);
        this.textures.addBase64('bg_castle', SpriteGenerator.createCastleBackground());

        // Generar mapas
        updateLoading('Dibujando mapas...', 85);
        this.textures.addBase64('map_europe', SpriteGenerator.createEuropeMap());
        this.textures.addBase64('map_world', SpriteGenerator.createWorldMap());

        // Generar partículas y UI
        updateLoading('Preparando efectos...', 90);
        ['star', 'skull', 'heart', 'heartEmpty', 'lightning', 'confetti'].forEach(type => {
            this.textures.addBase64(type, SpriteGenerator.createParticle(type));
        });

        // Power-ups
        ['fifty', 'hint', 'freeze', 'extraLife'].forEach(type => {
            this.textures.addBase64(`powerup_${type}`, SpriteGenerator.createPowerupIcon(type));
        });

        updateLoading('¡Listo para el examen!', 100);
    }

    create() {
        this.time.delayedCall(800, () => {
            document.getElementById('loading-screen').classList.add('hidden');
            this.scene.start('CinematicIntroScene');
        });
    }
}

// ==================== ESCENA DE INTRO ====================
class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    create() {
        this.dialogueIndex = 0;
        this.isTyping = false;
        this.canSkip = false;
        this.fullText = '';

        // Fondo negro
        this.add.rectangle(400, 300, 800, 600, 0x0a0a15);

        // Profesor (aparecerá después)
        this.professor = this.add.sprite(400, 250, 'prof_idle_0');
        this.professor.setScale(4);
        this.professor.setAlpha(0);

        // Caja de diálogo
        this.dialogueBox = this.add.graphics();
        this.dialogueBox.fillStyle(0x1a1a2e, 0.95);
        this.dialogueBox.fillRoundedRect(50, 420, 700, 150, 10);
        this.dialogueBox.lineStyle(4, 0xe94560);
        this.dialogueBox.strokeRoundedRect(50, 420, 700, 150, 10);

        // Nombre del personaje
        this.speakerText = this.add.text(80, 435, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#e94560'
        });

        // Texto del diálogo
        this.dialogueText = this.add.text(80, 470, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#ffffff',
            wordWrap: { width: 640 },
            lineSpacing: 8
        });

        // Indicador de continuar
        this.continueText = this.add.text(680, 545, '>', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: '#4ecca3'
        });
        this.continueText.setAlpha(0);

        this.tweens.add({
            targets: this.continueText,
            alpha: 1,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Skip text
        this.add.text(650, 20, 'ENTER: Saltar', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#666666'
        });

        // Input
        this.input.on('pointerdown', () => this.advanceDialogue());
        this.input.keyboard.on('keydown-SPACE', () => this.advanceDialogue());
        this.input.keyboard.on('keydown-ENTER', () => this.skipIntro());

        // Iniciar la historia
        this.cameras.main.fadeIn(1000);
        this.time.delayedCall(1000, () => this.showDialogue());

        // Inicializar audio al primer click
        this.input.once('pointerdown', () => {
            audioManager.init();
            audioManager.playMenuMusic();
        });
    }

    showDialogue() {
        const historia = GAME_DATA.historia.intro;
        if (this.dialogueIndex >= historia.length) {
            this.endIntro();
            return;
        }

        const current = historia[this.dialogueIndex];
        this.isTyping = true;
        this.canSkip = false;
        this.fullText = current.texto;

        // Configurar según personaje
        if (current.personaje === 'profesor') {
            this.speakerText.setText('PROFESOR ÁLVARO');
            this.speakerText.setColor('#e94560');

            // Mostrar profesor
            if (this.professor.alpha === 0) {
                this.tweens.add({
                    targets: this.professor,
                    alpha: 1,
                    duration: 500
                });
            }

            // Animar profesor hablando
            this.professorTalk = this.time.addEvent({
                delay: 150,
                callback: () => {
                    const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                    this.professor.setTexture(`prof_talk_${frame}`);
                },
                loop: true
            });
        } else {
            this.speakerText.setText('NARRADOR');
            this.speakerText.setColor('#4ecca3');

            // Ocultar profesor si es narrador
            if (this.dialogueIndex < 2) {
                this.professor.setAlpha(0);
            }
        }

        // Efecto de máquina de escribir
        this.dialogueText.setText('');
        let charIndex = 0;

        this.typewriter = this.time.addEvent({
            delay: 40,
            callback: () => {
                if (charIndex < this.fullText.length) {
                    this.dialogueText.setText(this.fullText.substring(0, charIndex + 1));
                    charIndex++;
                    audioManager.playDialogueBeep();
                } else {
                    this.typewriter.destroy();
                    this.isTyping = false;
                    this.canSkip = true;
                    if (this.professorTalk) {
                        this.professorTalk.destroy();
                        this.professor.setTexture('prof_idle_0');
                    }
                }
            },
            loop: true
        });
    }

    advanceDialogue() {
        if (this.isTyping) {
            // Mostrar texto completo inmediatamente
            this.typewriter.destroy();
            this.dialogueText.setText(this.fullText);
            this.isTyping = false;
            this.canSkip = true;
            if (this.professorTalk) {
                this.professorTalk.destroy();
                this.professor.setTexture('prof_idle_0');
            }
        } else if (this.canSkip) {
            this.dialogueIndex++;
            this.showDialogue();
        }
    }

    skipIntro() {
        if (this.typewriter) this.typewriter.destroy();
        if (this.professorTalk) this.professorTalk.destroy();
        this.endIntro();
    }

    endIntro() {
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('MenuScene');
        });
    }
}

// ==================== ESCENA DE MENÚ ====================
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Fondo
        this.bg = this.add.image(400, 300, 'bg_classroom');
        this.bg.setAlpha(0.4);

        // Título
        this.add.text(400, 80, 'LA VENGANZA DEL', {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            color: '#e94560'
        }).setOrigin(0.5);

        this.add.text(400, 120, 'PROFESOR ÁLVARO', {
            fontFamily: '"Press Start 2P"',
            fontSize: '28px',
            color: '#e94560'
        }).setOrigin(0.5);

        // Efecto de brillo en el título
        const titleGlow = this.add.text(400, 120, 'PROFESOR ÁLVARO', {
            fontFamily: '"Press Start 2P"',
            fontSize: '28px',
            color: '#ff6b6b'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: titleGlow,
            alpha: 0.5,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Profesor animado
        this.professor = this.add.sprite(400, 280, 'prof_idle_0');
        this.professor.setScale(3);

        // Animación idle
        this.time.addEvent({
            delay: 400,
            callback: () => {
                const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                this.professor.setTexture(`prof_idle_${frame}`);
            },
            loop: true
        });

        // Movimiento lateral
        this.tweens.add({
            targets: this.professor,
            x: 500,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Bocadillo
        this.speechBubble = this.add.graphics();
        this.speechBubble.fillStyle(0xffffff, 0.95);
        this.speechBubble.fillRoundedRect(280, 380, 240, 50, 8);

        this.speechText = this.add.text(400, 405, '"¿Te atreves?"', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#0a0a15'
        }).setOrigin(0.5);

        // Cambiar frases
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                const frases = ['"¿Te atreves?"', '"Nadie aprueba..."', '"Muajajaja..."', '"Tu perdición..."'];
                this.speechText.setText(frases[Math.floor(Math.random() * frases.length)]);
            },
            loop: true
        });

        // Botones
        this.createButton(400, 450, 'JUGAR', () => {
            audioManager.playClick();
            this.startGame();
        });

        this.createButton(250, 510, 'RANKING', () => {
            audioManager.playClick();
            this.scene.start('LeaderboardScene');
        }, 180);

        this.createButton(550, 510, 'INSTRUCCIONES', () => {
            audioManager.playClick();
            this.showInstructions();
        }, 180);

        // Instrucciones de audio
        this.add.text(400, 565, 'Click para activar audio', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#666666'
        }).setOrigin(0.5);

        // Iniciar música
        this.input.once('pointerdown', () => {
            audioManager.init();
            audioManager.resume();
            audioManager.playMenuMusic();
        });

        this.cameras.main.fadeIn(500);
    }

    createButton(x, y, text, callback, width = 240) {
        const container = this.add.container(x, y);
        const halfWidth = width / 2;

        const bg = this.add.graphics();
        bg.fillStyle(0x16213e, 1);
        bg.fillRoundedRect(-halfWidth, -22, width, 44, 5);
        bg.lineStyle(3, 0xe94560);
        bg.strokeRoundedRect(-halfWidth, -22, width, 44, 5);

        const label = this.add.text(0, 0, text, {
            fontFamily: '"Press Start 2P"',
            fontSize: width < 200 ? '11px' : '14px',
            color: '#e94560'
        }).setOrigin(0.5);

        container.add([bg, label]);
        container.setSize(width, 44);
        container.setInteractive();

        container.on('pointerover', () => {
            audioManager.playHover();
            bg.clear();
            bg.fillStyle(0xe94560, 1);
            bg.fillRoundedRect(-halfWidth, -22, width, 44, 5);
            label.setColor('#0a0a15');
        });

        container.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(0x16213e, 1);
            bg.fillRoundedRect(-halfWidth, -22, width, 44, 5);
            bg.lineStyle(3, 0xe94560);
            bg.strokeRoundedRect(-halfWidth, -22, width, 44, 5);
            label.setColor('#e94560');
        });

        container.on('pointerdown', callback);

        return container;
    }

    showInstructions() {
        // Panel de instrucciones
        const panel = this.add.container(400, 300);

        const bg = this.add.graphics();
        bg.fillStyle(0x0a0a15, 0.98);
        bg.fillRoundedRect(-350, -250, 700, 500, 10);
        bg.lineStyle(4, 0xe94560);
        bg.strokeRoundedRect(-350, -250, 700, 500, 10);

        const title = this.add.text(0, -210, 'INSTRUCCIONES', {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#e94560'
        }).setOrigin(0.5);

        const content = this.add.text(0, -50,
            '4 NIVELES DE TERROR:\n\n' +
            '1. Capitales de Europa\n' +
            '2. Países más poblados\n' +
            '3. Ciudades más pobladas\n' +
            '4. EXAMEN FINAL - ¡TODO!\n\n' +
            '• 10 preguntas por nivel\n' +
            '• Necesitas 7/10 para pasar\n' +
            '• Tienes 3 vidas\n' +
            '• Consigue COMBOS para más puntos\n' +
            '• Usa POWER-UPS sabiamente\n\n' +
            '¡Demuestra que el conocimiento\n' +
            'es más fuerte que el miedo!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '11px',
            color: '#4ecca3',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);

        const closeBtn = this.add.text(0, 200, '[ CERRAR ]', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#ffd700'
        }).setOrigin(0.5).setInteractive();

        closeBtn.on('pointerdown', () => {
            audioManager.playClick();
            panel.destroy();
        });

        closeBtn.on('pointerover', () => closeBtn.setColor('#ffffff'));
        closeBtn.on('pointerout', () => closeBtn.setColor('#ffd700'));

        panel.add([bg, title, content, closeBtn]);
    }

    startGame() {
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('LevelIntroScene', { level: 1 });
        });
    }
}

// ==================== ESCENA INTRO DE NIVEL ====================
class LevelIntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelIntroScene' });
    }

    init(data) {
        this.level = data.level || 1;
        this.totalCorrect = data.totalCorrect || 0;
        this.score = data.score || 0;
        this.lives = data.lives !== undefined ? data.lives : 3;
        this.powerups = data.powerups || { fifty: 1, hint: 1, freeze: 1 };
    }

    create() {
        const levelInfo = GAME_DATA.niveles[this.level - 1];
        const bgKey = `bg_${levelInfo.escenario}`;

        // Fondo del nivel
        this.bg = this.add.image(400, 300, bgKey);

        // Overlay oscuro
        this.overlay = this.add.rectangle(400, 300, 800, 600, 0x0a0a15, 0.8);

        // Número de nivel grande
        this.levelNum = this.add.text(400, 150, `NIVEL ${this.level}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '48px',
            color: levelInfo.color
        }).setOrigin(0.5).setAlpha(0);

        // Nombre del nivel
        this.levelName = this.add.text(400, 220, levelInfo.nombre, {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5).setAlpha(0);

        // Descripción
        this.levelDesc = this.add.text(400, 300, levelInfo.descripcion, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#4ecca3',
            align: 'center',
            wordWrap: { width: 600 },
            lineSpacing: 8
        }).setOrigin(0.5).setAlpha(0);

        // Profesor
        this.professor = this.add.sprite(400, 450, 'prof_talk_0');
        this.professor.setScale(2.5);
        this.professor.setAlpha(0);

        // Animaciones de entrada
        this.tweens.add({
            targets: this.levelNum,
            alpha: 1,
            y: 120,
            duration: 800,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: this.levelName,
            alpha: 1,
            duration: 500,
            delay: 400
        });

        this.tweens.add({
            targets: this.levelDesc,
            alpha: 1,
            duration: 500,
            delay: 800
        });

        this.tweens.add({
            targets: this.professor,
            alpha: 1,
            duration: 500,
            delay: 1000
        });

        // Animación del profesor
        this.time.addEvent({
            delay: 200,
            callback: () => {
                const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                this.professor.setTexture(`prof_talk_${frame}`);
            },
            loop: true
        });

        // Mostrar diálogo del nivel
        this.time.delayedCall(1500, () => {
            this.showLevelDialogue();
        });

        // Música del nivel
        audioManager.stopMusic();
        this.cameras.main.fadeIn(500);
    }

    showLevelDialogue() {
        const dialogues = GAME_DATA.historia[`nivel${this.level}Intro`];
        let index = 0;

        const dialogueBox = this.add.graphics();
        dialogueBox.fillStyle(0x1a1a2e, 0.95);
        dialogueBox.fillRoundedRect(100, 480, 600, 80, 8);
        dialogueBox.lineStyle(3, 0xe94560);
        dialogueBox.strokeRoundedRect(100, 480, 600, 80, 8);

        const dialogueText = this.add.text(400, 520, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 560 }
        }).setOrigin(0.5);

        const showNext = () => {
            if (index >= dialogues.length) {
                this.startLevel();
                return;
            }

            dialogueText.setText(dialogues[index].texto);
            audioManager.playDialogueBeep();
            index++;

            this.time.delayedCall(2500, showNext);
        };

        showNext();
    }

    startLevel() {
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('GameScene', {
                level: this.level,
                totalCorrect: this.totalCorrect,
                score: this.score,
                lives: this.lives,
                powerups: this.powerups
            });
        });
    }
}
