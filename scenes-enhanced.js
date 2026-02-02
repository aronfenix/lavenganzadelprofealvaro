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
        this.cinematic = new CinematicManager(this);

        // Fondo negro inicial
        this.bg = this.add.rectangle(400, 300, 800, 600, 0x000000);

        // Iniciar secuencia cinematica
        this.runCinematic();
    }

    async runCinematic() {
        await this.delay(500);

        // Texto inicial con efecto
        const yearText = this.effects.createAnimatedText(400, 300, '2024', {
            fontFamily: '"Press Start 2P"',
            fontSize: '48px',
            color: '#4ecca3'
        }, 'typewriter');

        await this.delay(2000);

        this.tweens.add({
            targets: yearText,
            alpha: 0,
            duration: 500
        });

        await this.delay(600);

        // Primera escena: La escuela
        await this.cinematic.fadeFromBlack(500);
        this.cinematic.enter();

        this.schoolBg = this.add.rectangle(400, 300, 800, 600, 0x1a2a1a);
        const schoolText = this.add.text(400, 150, 'INSTITUTO DE ENSENANZA', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: '#4ecca3'
        }).setOrigin(0.5);

        await this.cinematic.showDialogue('NARRADOR',
            'En un instituto aparentemente normal, algo oscuro se gestaba en el departamento de Geografia...',
            { duration: 5000, speakerColor: '#4ecca3' }
        );

        // Efecto de glitch
        this.effects.glitch(300);
        await this.delay(500);

        // Transicion al despacho
        await this.cinematic.fadeToBlack(500);
        schoolText.destroy();
        this.schoolBg.setFillStyle(0x1a1a2e);

        await this.cinematic.fadeFromBlack(500);

        // Profesor aparece
        this.professor = this.add.sprite(400, 280, 'prof_idle_0');
        this.professor.setScale(4);
        this.professor.setAlpha(0);

        this.effects.dramaticEntrance(this.professor, 'zoom', 1000);
        await this.delay(1200);

        // Animacion del profesor hablando
        this.profAnim = this.time.addEvent({
            delay: 150,
            callback: () => {
                const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                this.professor.setTexture(`prof_talk_${frame}`);
            },
            loop: true
        });

        await this.cinematic.showDialogue('PROFESOR ALVARO',
            'Llevo ANOS soportando la ignorancia de mis alumnos...',
            { duration: 4000, speakerColor: '#e94560' }
        );

        // Efecto de enfado
        this.effects.shake(0.01, 300);
        this.professor.setTexture('prof_angry_0');

        await this.cinematic.showDialogue('PROFESOR ALVARO',
            'Nadie estudia! Nadie se esfuerza! Pues ahora... PAGARAN!',
            { duration: 4000, speakerColor: '#e94560' }
        );

        // Risa malvada con efectos
        this.profAnim.destroy();
        this.profAnim = this.time.addEvent({
            delay: 100,
            callback: () => {
                const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                this.professor.setTexture(`prof_laugh_${frame}`);
                this.professor.y = 280 + (frame === 0 ? -3 : 3);
            },
            loop: true
        });

        audioManager.playLaugh && audioManager.playLaugh();
        this.effects.flash(0xe94560, 200);

        await this.cinematic.showDialogue('PROFESOR ALVARO',
            'MUAJAJAJA! He creado el EXAMEN DEFINITIVO!',
            { duration: 3000, speakerColor: '#e94560' }
        );

        // Lightning effect
        this.effects.lightning(200, 0, 400, 300);
        await this.delay(300);
        this.effects.lightning(600, 0, 400, 300);
        await this.delay(500);

        await this.cinematic.showDialogue('PROFESOR ALVARO',
            'Un examen del que NADIE puede escapar! El conocimiento sera su prision!',
            { duration: 4000, speakerColor: '#e94560' }
        );

        // Transicion dramatica
        this.profAnim.destroy();
        await this.cinematic.fadeToBlack(800);

        // Texto final
        const heroText = this.add.text(400, 250, 'Pero un valiente estudiante\ndecidia enfrentarlo...', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#4ecca3',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);

        await this.cinematic.fadeFromBlack(500);
        this.tweens.add({
            targets: heroText,
            alpha: 1,
            duration: 1000
        });

        await this.delay(3000);

        // Titulo del juego con efectos
        await this.cinematic.fadeToBlack(500);
        heroText.destroy();

        this.showTitle();
    }

    showTitle() {
        this.cinematic.exit();

        // Fondo con particulas
        this.bg.setFillStyle(0x0a0a15);

        // Particulas de fondo
        for (let i = 0; i < 50; i++) {
            const star = this.add.rectangle(
                Math.random() * 800,
                Math.random() * 600,
                2 + Math.random() * 3,
                2 + Math.random() * 3,
                0xffffff
            ).setAlpha(0.3 + Math.random() * 0.5);

            this.tweens.add({
                targets: star,
                alpha: 0.1,
                duration: 1000 + Math.random() * 2000,
                yoyo: true,
                repeat: -1
            });
        }

        // Titulo con efecto de aparicion
        const title1 = this.add.text(400, 180, 'LA VENGANZA DEL', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            color: '#e94560'
        }).setOrigin(0.5).setAlpha(0);

        const title2 = this.add.text(400, 240, 'PROFESOR ALVARO', {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px',
            color: '#e94560'
        }).setOrigin(0.5).setAlpha(0);

        // Glow effect
        const glow = this.add.text(400, 240, 'PROFESOR ALVARO', {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px',
            color: '#ff6b6b'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: title1,
            alpha: 1,
            y: 150,
            duration: 800,
            delay: 500,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: [title2, glow],
            alpha: 1,
            y: 220,
            duration: 800,
            delay: 1000,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: glow,
            alpha: 0.5,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            delay: 2000
        });

        // Subtitulo
        const subtitle = this.add.text(400, 280, 'Un juego de conocimiento y supervivencia', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#4ecca3'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: subtitle,
            alpha: 1,
            duration: 800,
            delay: 1800
        });

        // Profesor miniatura
        const miniProf = this.add.sprite(400, 380, 'prof_idle_0');
        miniProf.setScale(2.5).setAlpha(0);

        this.tweens.add({
            targets: miniProf,
            alpha: 1,
            duration: 800,
            delay: 2200
        });

        this.time.addEvent({
            delay: 400,
            callback: () => {
                const frame = miniProf.texture.key.endsWith('0') ? 1 : 0;
                miniProf.setTexture(`prof_idle_${frame}`);
            },
            loop: true
        });

        // Boton de continuar
        this.time.delayedCall(3000, () => {
            const continueText = this.add.text(400, 500, '[ PULSA PARA CONTINUAR ]', {
                fontFamily: '"Press Start 2P"',
                fontSize: '12px',
                color: '#ffd700'
            }).setOrigin(0.5).setAlpha(0);

            this.tweens.add({
                targets: continueText,
                alpha: 1,
                duration: 500
            });

            this.tweens.add({
                targets: continueText,
                alpha: 0.5,
                duration: 800,
                yoyo: true,
                repeat: -1,
                delay: 500
            });

            this.input.once('pointerdown', () => {
                audioManager.playClick && audioManager.playClick();
                this.cameras.main.fadeOut(500);
                this.time.delayedCall(500, () => {
                    this.scene.start('EnhancedMenuScene');
                });
            });

            // Tambien permitir saltar con teclado
            this.input.keyboard.once('keydown', () => {
                audioManager.playClick && audioManager.playClick();
                this.cameras.main.fadeOut(500);
                this.time.delayedCall(500, () => {
                    this.scene.start('EnhancedMenuScene');
                });
            });
        });

        // Skip intro text
        this.add.text(700, 580, 'ENTER: Saltar', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#444444'
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('EnhancedMenuScene');
        });

        this.cameras.main.fadeIn(1000);
    }

    delay(ms) {
        return new Promise(resolve => this.time.delayedCall(ms, resolve));
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

        // Vignette
        this.effects.createVignette(0.3);

        // Musica
        this.input.once('pointerdown', () => {
            audioManager.init && audioManager.init();
            audioManager.resume && audioManager.resume();
            audioManager.playMenuMusic && audioManager.playMenuMusic();
        });

        this.cameras.main.fadeIn(500);
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
            '4 NIVELES DE DESAFIO:\n\n' +
            '1. Capitales de Europa\n' +
            '2. TOP 20 Paises mas poblados\n' +
            '3. TOP 20 Ciudades mas pobladas\n' +
            '4. EXAMEN FINAL - TODO MEZCLADO!\n\n' +
            '* 10 preguntas por nivel\n' +
            '* Necesitas 7/10 para pasar\n' +
            '* Tienes 3 vidas\n' +
            '* Consigue COMBOS para mas puntos\n' +
            '* MINIJUEGOS especiales a mitad de nivel\n' +
            '* Usa el MODO ESTUDIO para practicar\n\n' +
            'Demuestra que el conocimiento\n' +
            'es mas fuerte que el miedo!', {
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
