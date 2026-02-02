// ============================================================
// ESCENAS ADICIONALES DEL JUEGO
// ============================================================

// ==================== ESCENA PRINCIPAL DEL JUEGO ====================
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.level = data.level || 1;
        this.currentQuestion = data.currentQuestion || 0;
        this.correctAnswers = data.correctAnswers || 0;
        this.totalCorrect = data.totalCorrect || 0;
        this.score = data.score || 0;
        this.lives = data.lives !== undefined ? data.lives : 3;
        this.powerups = data.powerups || { fifty: 1, hint: 1, freeze: 1 };
        this.combo = 0;
        this.maxCombo = data.maxCombo || 0;
        this.timeLeft = 25;
        this.timerPaused = false;
        this.canAnswer = true;
        this.questions = data.questions || [];
        this.currentInput = '';
        this.fromMinigame = data.fromMinigame || false;
        this.minigamePlayed = data.minigamePlayed || false;
    }

    create() {
        const levelInfo = GAME_DATA.niveles[this.level - 1];

        // Fondo
        this.bg = this.add.image(400, 300, `bg_${levelInfo.escenario}`);
        this.bg.setAlpha(0.6);

        // Cargar preguntas (solo si no venimos de un minijuego)
        if (!this.fromMinigame || this.questions.length === 0) {
            this.loadQuestions();
        }

        // Crear UI
        this.createUI();

        // Profesor
        this.createProfessor();

        // Área de pregunta y respuestas
        this.createQuestionArea();

        // Crear teclado virtual (para tablets)
        this.createVirtualKeyboard();

        // Mostrar primera pregunta
        this.showQuestion();

        // Iniciar música
        this.startLevelMusic();

        // Timer
        this.startTimer();

        // Fade in
        this.cameras.main.fadeIn(500);
    }

    loadQuestions() {
        let pool;
        switch(this.level) {
            case 1:
                // Capitales: generar opciones con otras capitales
                pool = GAME_DATA.capitalesEuropa.map(q => ({
                    ...q,
                    opciones: GAME_DATA.generarOpcionesCapital(q.respuesta)
                }));
                break;
            case 2:
                pool = [...GAME_DATA.paisesPoblados];
                break;
            case 3:
                pool = [...GAME_DATA.ciudadesPobladas];
                break;
            case 4:
                // Mix de todo
                const caps = GAME_DATA.capitalesEuropa.slice(0, 10).map(q => ({
                    ...q,
                    opciones: GAME_DATA.generarOpcionesCapital(q.respuesta)
                }));
                const paises = GAME_DATA.paisesPoblados.slice(0, 10);
                const ciudades = GAME_DATA.ciudadesPobladas.slice(0, 10);
                pool = [...caps, ...paises, ...ciudades];
                break;
            default:
                pool = [...GAME_DATA.capitalesEuropa];
        }
        this.questions = Phaser.Utils.Array.Shuffle(pool).slice(0, 10);
    }

    createUI() {
        const levelInfo = GAME_DATA.niveles[this.level - 1];

        // Barra superior
        this.add.rectangle(400, 30, 800, 60, 0x0a0a15, 0.9);

        // Nivel
        this.add.text(20, 20, `NIVEL ${this.level}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: levelInfo.color
        });

        this.add.text(20, 38, levelInfo.nombre, {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#ffffff'
        });

        // Vidas
        this.livesContainer = this.add.container(200, 30);
        this.updateLivesDisplay();

        // Pregunta actual
        this.questionNumText = this.add.text(400, 30, '1/10', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Combo
        this.comboText = this.add.text(550, 20, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#ffd700'
        });

        // Puntuación
        this.scoreText = this.add.text(780, 20, `${this.score}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#ffd700'
        }).setOrigin(1, 0);

        this.add.text(780, 38, 'PTS', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#ffd700'
        }).setOrigin(1, 0);

        // Barra de tiempo
        this.timerBg = this.add.rectangle(400, 70, 760, 16, 0x1a1a2e);
        this.timerBg.setStrokeStyle(2, 0x4ecca3);
        this.timerBar = this.add.rectangle(24, 70, 752, 12, 0x4ecca3);
        this.timerBar.setOrigin(0, 0.5);

        // Power-ups
        this.createPowerupButtons();

        // Aciertos del nivel
        this.correctText = this.add.text(20, 580, `Aciertos: ${this.correctAnswers}/10`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#4ecca3'
        });
    }

    updateLivesDisplay() {
        this.livesContainer.removeAll(true);
        for (let i = 0; i < 3; i++) {
            const heart = this.add.image(i * 25, 0, i < this.lives ? 'heart' : 'heartEmpty');
            heart.setScale(1.5);
            this.livesContainer.add(heart);
        }
    }

    createPowerupButtons() {
        this.powerupContainer = this.add.container(650, 580);

        const powerupTypes = [
            { key: 'fifty', label: '50/50' },
            { key: 'hint', label: 'PISTA' },
            { key: 'freeze', label: 'TIEMPO' }
        ];

        powerupTypes.forEach((pu, i) => {
            const btn = this.add.container(i * 55, 0);

            const bg = this.add.rectangle(0, 0, 50, 30, 0x16213e);
            bg.setStrokeStyle(2, this.powerups[pu.key] > 0 ? 0x4ecca3 : 0x666666);

            const icon = this.add.image(0, -2, `powerup_${pu.key}`);
            icon.setScale(0.4);

            const count = this.add.text(0, 12, `x${this.powerups[pu.key]}`, {
                fontFamily: '"Press Start 2P"',
                fontSize: '6px',
                color: this.powerups[pu.key] > 0 ? '#4ecca3' : '#666666'
            }).setOrigin(0.5);

            btn.add([bg, icon, count]);
            btn.setSize(50, 30);

            if (this.powerups[pu.key] > 0) {
                btn.setInteractive();
                btn.on('pointerdown', () => this.usePowerup(pu.key));
                btn.on('pointerover', () => bg.setFillStyle(0x2a3a4a));
                btn.on('pointerout', () => bg.setFillStyle(0x16213e));
            }

            btn.countText = count;
            btn.bg = bg;
            this.powerupContainer.add(btn);
            this[`${pu.key}Btn`] = btn;
        });
    }

    usePowerup(type) {
        if (!this.canAnswer || this.powerups[type] <= 0) return;

        this.powerups[type]--;
        audioManager.playUsePowerup();

        switch(type) {
            case 'fifty':
                this.use5050();
                break;
            case 'hint':
                this.useHint();
                break;
            case 'freeze':
                this.useFreeze();
                break;
        }

        this.updatePowerupUI(type);
    }

    updatePowerupUI(type) {
        const btn = this[`${type}Btn`];
        if (btn) {
            btn.countText.setText(`x${this.powerups[type]}`);
            if (this.powerups[type] <= 0) {
                btn.countText.setColor('#666666');
                btn.bg.setStrokeStyle(2, 0x666666);
                btn.disableInteractive();
            }
        }
    }

    use5050() {
        const q = this.questions[this.currentQuestion];
        if (!q.opciones || !this.answersContainer) return;

        const buttons = this.answersContainer.list.filter(c => c.isButton && !c.isDisabled);
        const wrongButtons = buttons.filter(b => b.answerText !== q.respuesta);

        Phaser.Utils.Array.Shuffle(wrongButtons).slice(0, 2).forEach(btn => {
            btn.setAlpha(0.3);
            btn.isDisabled = true;
            btn.disableInteractive();
        });
    }

    useHint() {
        const q = this.questions[this.currentQuestion];

        const hint = this.add.container(400, 300);
        const bg = this.add.rectangle(0, 0, 500, 100, 0x1a1a2e, 0.95);
        bg.setStrokeStyle(3, 0x4ecca3);

        const text = this.add.text(0, 0, `PISTA: Empieza por "${q.respuesta.charAt(0).toUpperCase()}"`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#4ecca3',
            align: 'center',
            wordWrap: { width: 450 }
        }).setOrigin(0.5);

        hint.add([bg, text]);

        this.tweens.add({
            targets: hint,
            alpha: 0,
            duration: 500,
            delay: 2500,
            onComplete: () => hint.destroy()
        });
    }

    useFreeze() {
        this.timerPaused = true;
        this.timerBar.setFillStyle(0x00ffff);

        const freezeEffect = this.add.rectangle(400, 300, 800, 600, 0x00ffff, 0.1);

        this.time.delayedCall(5000, () => {
            this.timerPaused = false;
            this.timerBar.setFillStyle(0x4ecca3);
            freezeEffect.destroy();
        });
    }

    createProfessor() {
        // Determinar tipo de profesor según nivel
        const levelInfo = GAME_DATA.niveles[this.level - 1];
        this.professorType = levelInfo.professorType || 'normal';

        // Prefijo para los sprites
        let spritePrefix = 'prof';
        if (this.professorType === 'sporty') {
            spritePrefix = 'prof_sporty';
        } else if (this.professorType === 'chef') {
            spritePrefix = 'prof_chef';
        }
        this.spritePrefix = spritePrefix;

        this.professor = this.add.sprite(100, 450, `${spritePrefix}_idle_0`);
        this.professor.setScale(2);

        this.professorIdleAnim = this.time.addEvent({
            delay: 400,
            callback: () => {
                if (this.professorState === 'idle') {
                    const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                    this.professor.setTexture(`${this.spritePrefix}_idle_${frame}`);
                }
            },
            loop: true
        });
        this.professorState = 'idle';

        // Bocadillo
        this.speechBubble = this.add.graphics();
        this.speechBubble.fillStyle(0xffffff, 0.95);
        this.speechBubble.fillRoundedRect(20, 520, 160, 60, 8);

        // Frase inicial según tipo
        let initialPhrase = '"Empecemos..."';
        if (this.professorType === 'sporty') {
            initialPhrase = '"¡A sudar!"';
        } else if (this.professorType === 'chef') {
            initialPhrase = '"¡A cocinar!"';
        }

        this.speechText = this.add.text(100, 550, initialPhrase, {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#0a0a15',
            align: 'center',
            wordWrap: { width: 140 }
        }).setOrigin(0.5);
    }

    setProfessorState(state, duration = 2000) {
        this.professorState = state;
        const prefix = this.spritePrefix || 'prof';

        // Los sprites sporty y chef solo tienen idle, talk, laugh, angry
        const validStates = ['idle', 'talk', 'laugh', 'angry'];
        const actualState = validStates.includes(state) ? state : 'idle';

        if (actualState === 'laugh') {
            this.professorAnim = this.time.addEvent({
                delay: 150,
                callback: () => {
                    const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                    this.professor.setTexture(`${prefix}_laugh_${frame}`);
                },
                loop: true
            });
        } else if (actualState === 'angry') {
            this.professorAnim = this.time.addEvent({
                delay: 200,
                callback: () => {
                    const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                    this.professor.setTexture(`${prefix}_angry_${frame}`);
                },
                loop: true
            });
        } else if (actualState === 'talk') {
            this.professorAnim = this.time.addEvent({
                delay: 150,
                callback: () => {
                    const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                    this.professor.setTexture(`${prefix}_talk_${frame}`);
                },
                loop: true
            });
        }

        this.time.delayedCall(duration, () => {
            if (this.professorAnim) this.professorAnim.destroy();
            this.professorState = 'idle';
            this.professor.setTexture(`${prefix}_idle_0`);
        });
    }

    createQuestionArea() {
        // Caja de pregunta
        this.questionBox = this.add.graphics();
        this.questionBox.fillStyle(0x0a0a15, 0.9);
        this.questionBox.fillRoundedRect(180, 90, 600, 70, 10);
        this.questionBox.lineStyle(3, 0x4ecca3);
        this.questionBox.strokeRoundedRect(180, 90, 600, 70, 10);

        this.questionText = this.add.text(480, 125, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '11px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 560 }
        }).setOrigin(0.5);

        // Contenedor de respuestas
        this.answersContainer = this.add.container(480, 260);

        // Input de texto visual
        this.textInputContainer = this.add.container(480, 200);
        this.textInputContainer.setVisible(false);

        const inputBg = this.add.graphics();
        inputBg.fillStyle(0x0a0a15, 1);
        inputBg.fillRoundedRect(-220, -25, 440, 50, 5);
        inputBg.lineStyle(3, 0x4ecca3);
        inputBg.strokeRoundedRect(-220, -25, 440, 50, 5);

        this.textInputDisplay = this.add.text(0, 0, '_', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#4ecca3'
        }).setOrigin(0.5);

        this.textInputContainer.add([inputBg, this.textInputDisplay]);

        // Keyboard input (para PC)
        this.input.keyboard.on('keydown', (event) => {
            if (!this.textInputContainer.visible || !this.canAnswer) return;

            if (event.key === 'Enter') {
                if (this.currentInput.length > 0) this.checkTextAnswer();
            } else if (event.key === 'Backspace') {
                this.currentInput = this.currentInput.slice(0, -1);
                this.updateTextInputDisplay();
            } else if (event.key.length === 1 && this.currentInput.length < 20) {
                this.currentInput += event.key.toUpperCase();
                this.updateTextInputDisplay();
            }
        });
    }

    // ==================== TECLADO VIRTUAL ====================
    createVirtualKeyboard() {
        this.virtualKeyboard = this.add.container(400, 460);
        this.virtualKeyboard.setVisible(false);

        const rows = [
            'QWERTYUIOP',
            'ASDFGHJKL',
            'ZXCVBNM'
        ];

        const keyWidth = 42;
        const keyHeight = 38;
        const padding = 4;

        rows.forEach((row, rowIndex) => {
            const rowWidth = row.length * (keyWidth + padding);
            const startX = -rowWidth / 2 + keyWidth / 2;

            for (let i = 0; i < row.length; i++) {
                const key = row[i];
                const x = startX + i * (keyWidth + padding);
                const y = rowIndex * (keyHeight + padding);

                this.createKey(x, y, key, keyWidth, keyHeight);
            }
        });

        // Fila especial: Borrar y Enviar
        const specialY = 3 * (keyHeight + padding);

        // Botón borrar
        this.createSpecialKey(-120, specialY, '⌫', 80, keyHeight, () => {
            this.currentInput = this.currentInput.slice(0, -1);
            this.updateTextInputDisplay();
            audioManager.playClick();
        });

        // Espacio (por si necesitan para nombres compuestos)
        this.createSpecialKey(0, specialY, 'ESPACIO', 100, keyHeight, () => {
            if (this.currentInput.length < 20) {
                this.currentInput += ' ';
                this.updateTextInputDisplay();
            }
            audioManager.playClick();
        });

        // Botón enviar
        this.createSpecialKey(120, specialY, 'OK', 80, keyHeight, () => {
            if (this.currentInput.length > 0) {
                this.checkTextAnswer();
            }
            audioManager.playClick();
        }, 0x4ecca3);
    }

    createKey(x, y, letter, width, height) {
        const container = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, width, height, 0x1a1a2e);
        bg.setStrokeStyle(2, 0x4ecca3);

        const text = this.add.text(0, 0, letter, {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#4ecca3'
        }).setOrigin(0.5);

        container.add([bg, text]);
        container.setSize(width, height);
        container.setInteractive();

        container.on('pointerdown', () => {
            if (this.currentInput.length < 20) {
                this.currentInput += letter;
                this.updateTextInputDisplay();
                audioManager.playClick();
            }
            bg.setFillStyle(0x4ecca3);
            text.setColor('#0a0a15');
        });

        container.on('pointerup', () => {
            bg.setFillStyle(0x1a1a2e);
            text.setColor('#4ecca3');
        });

        container.on('pointerout', () => {
            bg.setFillStyle(0x1a1a2e);
            text.setColor('#4ecca3');
        });

        this.virtualKeyboard.add(container);
    }

    createSpecialKey(x, y, label, width, height, callback, color = 0xe94560) {
        const container = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, width, height, 0x1a1a2e);
        bg.setStrokeStyle(2, color);

        const text = this.add.text(0, 0, label, {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: Phaser.Display.Color.IntegerToColor(color).rgba
        }).setOrigin(0.5);

        container.add([bg, text]);
        container.setSize(width, height);
        container.setInteractive();

        container.on('pointerdown', () => {
            callback();
            bg.setFillStyle(color);
            text.setColor('#0a0a15');
        });

        container.on('pointerup', () => {
            bg.setFillStyle(0x1a1a2e);
            text.setColor(Phaser.Display.Color.IntegerToColor(color).rgba);
        });

        container.on('pointerout', () => {
            bg.setFillStyle(0x1a1a2e);
            text.setColor(Phaser.Display.Color.IntegerToColor(color).rgba);
        });

        this.virtualKeyboard.add(container);
    }

    updateTextInputDisplay() {
        this.textInputDisplay.setText(this.currentInput + '_');
    }

    showQuestion() {
        const q = this.questions[this.currentQuestion];

        this.questionText.setText(q.pregunta);
        this.questionNumText.setText(`${this.currentQuestion + 1}/10`);

        // Limpiar
        this.answersContainer.removeAll(true);
        this.currentInput = '';
        this.updateTextInputDisplay();

        // Reset timer
        this.timeLeft = 25;
        this.timerPaused = false;
        this.updateTimerBar();

        // Verificar si tiene opciones o es de escribir
        if (q.opciones && q.opciones.length > 0) {
            // Pregunta tipo test
            this.textInputContainer.setVisible(false);
            this.virtualKeyboard.setVisible(false);

            const options = Phaser.Utils.Array.Shuffle([...q.opciones]);
            const cols = options.length <= 2 ? 1 : 2;

            options.forEach((opt, i) => {
                const col = i % cols;
                const row = Math.floor(i / cols);
                const x = cols === 1 ? 0 : -130 + col * 260;
                const y = -30 + row * 60;

                const btn = this.createAnswerButton(x, y, opt, () => {
                    if (this.canAnswer) this.checkAnswer(opt);
                }, 240);

                this.answersContainer.add(btn);
            });
        } else {
            // Pregunta de escribir - mostrar teclado virtual
            this.textInputContainer.setVisible(true);
            this.virtualKeyboard.setVisible(true);
        }

        this.canAnswer = true;

        const frases = GAME_DATA.frases.inicio;
        this.speechText.setText(`"${frases[Math.floor(Math.random() * frases.length)]}"`);
    }

    createAnswerButton(x, y, text, callback, width = 200) {
        const container = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(0x16213e, 1);
        bg.fillRoundedRect(-width/2, -22, width, 44, 5);
        bg.lineStyle(2, 0xe94560);
        bg.strokeRoundedRect(-width/2, -22, width, 44, 5);

        const label = this.add.text(0, 0, text, {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#e94560',
            align: 'center',
            wordWrap: { width: width - 20 }
        }).setOrigin(0.5);

        container.add([bg, label]);
        container.setSize(width, 44);
        container.setInteractive();
        container.isButton = true;
        container.answerText = text;
        container.bg = bg;
        container.label = label;

        container.on('pointerover', () => {
            if (container.isDisabled) return;
            bg.clear();
            bg.fillStyle(0xe94560, 1);
            bg.fillRoundedRect(-width/2, -22, width, 44, 5);
            label.setColor('#0a0a15');
        });

        container.on('pointerout', () => {
            if (container.isDisabled) return;
            bg.clear();
            bg.fillStyle(0x16213e, 1);
            bg.fillRoundedRect(-width/2, -22, width, 44, 5);
            bg.lineStyle(2, 0xe94560);
            bg.strokeRoundedRect(-width/2, -22, width, 44, 5);
            label.setColor('#e94560');
        });

        container.on('pointerdown', () => {
            if (container.isDisabled) return;
            audioManager.playClick();
            callback();
        });

        return container;
    }

    startTimer() {
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.timerPaused || !this.canAnswer) return;

                this.timeLeft--;
                this.updateTimerBar();

                if (this.timeLeft <= 5 && this.timeLeft > 0) {
                    audioManager.playTick();
                    this.timerBar.setFillStyle(0xe94560);
                }

                if (this.timeLeft <= 0) {
                    this.timeUp();
                }
            },
            loop: true
        });
    }

    updateTimerBar() {
        const width = (this.timeLeft / 25) * 752;
        this.timerBar.setSize(Math.max(0, width), 12);

        if (this.timeLeft > 12) {
            this.timerBar.setFillStyle(0x4ecca3);
        } else if (this.timeLeft > 5) {
            this.timerBar.setFillStyle(0xffd700);
        } else {
            this.timerBar.setFillStyle(0xe94560);
        }
    }

    timeUp() {
        if (!this.canAnswer) return;
        this.canAnswer = false;

        audioManager.playTimeUp();

        const q = this.questions[this.currentQuestion];
        this.processAnswer(false, q.respuesta, true);
    }

    normalizeAnswer(str) {
        return str.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s]/g, "")
            .trim();
    }

    checkTextAnswer() {
        if (!this.canAnswer) return;

        const q = this.questions[this.currentQuestion];
        const userAnswer = this.normalizeAnswer(this.currentInput);
        const correctAnswer = this.normalizeAnswer(q.respuesta);

        let isCorrect = userAnswer === correctAnswer ||
                       userAnswer.includes(correctAnswer) ||
                       correctAnswer.includes(userAnswer);

        // Alternativas comunes
        const alternatives = {
            'estados unidos': ['usa', 'eeuu', 'us', 'united states', 'ee uu', 'ee.uu'],
            'reino unido': ['uk', 'united kingdom', 'gran bretana', 'inglaterra'],
            'paises bajos': ['holanda'],
            'republica democratica del congo': ['rd congo', 'rdc', 'congo kinshasa'],
            'rep dem congo': ['rd congo', 'rdc', 'congo kinshasa', 'republica democratica del congo'],
        };

        if (!isCorrect) {
            for (const [key, alts] of Object.entries(alternatives)) {
                if (this.normalizeAnswer(key) === correctAnswer || correctAnswer.includes(this.normalizeAnswer(key))) {
                    if (alts.some(a => this.normalizeAnswer(a) === userAnswer || userAnswer.includes(this.normalizeAnswer(a)))) {
                        isCorrect = true;
                        break;
                    }
                }
            }
        }

        this.processAnswer(isCorrect, q.respuesta);
    }

    checkAnswer(answer) {
        if (!this.canAnswer) return;

        const q = this.questions[this.currentQuestion];
        const isCorrect = answer === q.respuesta;
        this.processAnswer(isCorrect, q.respuesta);
    }

    processAnswer(isCorrect, correctAnswer, isTimeout = false) {
        this.canAnswer = false;

        // Ocultar teclado
        this.virtualKeyboard.setVisible(false);

        const q = this.questions[this.currentQuestion];

        if (isCorrect) {
            this.combo++;
            if (this.combo > this.maxCombo) this.maxCombo = this.combo;

            this.correctAnswers++;
            this.totalCorrect++;

            let points = 100 + (this.level * 50);
            if (this.combo >= 3) {
                points *= (1 + (this.combo - 2) * 0.5);
                this.comboText.setText(`COMBO x${this.combo}!`);
                audioManager.playCombo(this.combo);
            }
            this.score += Math.floor(points);

            this.scoreText.setText(`${this.score}`);
            this.correctText.setText(`Aciertos: ${this.correctAnswers}/10`);

            audioManager.playCorrect();
            this.showFeedback(true);
            this.createCorrectParticles();

            const frases = GAME_DATA.frases.correcta;
            this.speechText.setText(`"${frases[Math.floor(Math.random() * frases.length)]}"`);
            this.setProfessorState('angry', 1500);

        } else {
            this.combo = 0;
            this.comboText.setText('');
            this.lives--;

            this.updateLivesDisplay();

            if (isTimeout) {
                const frases = GAME_DATA.frases.tiempoAgotado;
                this.speechText.setText(`"${frases[Math.floor(Math.random() * frases.length)]}"`);
            } else {
                const frases = GAME_DATA.frases.incorrecta;
                this.speechText.setText(`"${frases[Math.floor(Math.random() * frases.length)]}"`);
            }

            audioManager.playWrong();
            audioManager.playLoseLife();
            this.showFeedback(false, correctAnswer, q.dato);
            this.createWrongParticles();
            this.setProfessorState('laugh', 2000);
            audioManager.playLaugh();

            if (this.lives <= 0) {
                this.time.delayedCall(2500, () => this.gameOver());
                return;
            }
        }

        this.time.delayedCall(2500, () => {
            this.currentQuestion++;

            if (this.currentQuestion >= 10) {
                this.endLevel();
            } else if (this.currentQuestion === 5 && !this.minigamePlayed && this.level > 1) {
                // Lanzar minijuego a mitad del nivel (solo en niveles 2, 3 y 4)
                this.launchMinigame();
            } else {
                this.showQuestion();
            }
        });
    }

    launchMinigame() {
        if (this.timerEvent) this.timerEvent.destroy();
        audioManager.stopMusic();

        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            const baseData = {
                level: this.level,
                totalCorrect: this.totalCorrect,
                score: this.score,
                lives: this.lives,
                powerups: this.powerups,
                correctAnswers: this.correctAnswers,
                maxCombo: this.maxCombo
            };

            // Decidir tipo de minijuego según nivel
            if (this.level === 2) {
                // Nivel 2: 50% ordenar países, 50% mapa de Europa
                const random = Math.random();
                if (random < 0.5) {
                    this.scene.start('OrderingGameScene', {
                        ...baseData,
                        isCountries: true
                    });
                } else {
                    this.scene.start('MapGameScene', {
                        ...baseData,
                        mapType: 'europe',
                        isCapitals: true
                    });
                }
            } else if (this.level === 3) {
                // Nivel 3: 33% emparejar, 33% ordenar ciudades, 33% mapa mundo
                const random = Math.random();
                if (random < 0.33) {
                    this.scene.start('MatchingGameScene', {
                        ...baseData,
                        matchType: 'cities'
                    });
                } else if (random < 0.66) {
                    this.scene.start('OrderingGameScene', {
                        ...baseData,
                        isCountries: false
                    });
                } else {
                    this.scene.start('MapGameScene', {
                        ...baseData,
                        mapType: 'world',
                        isCapitals: false
                    });
                }
            } else if (this.level === 4) {
                // Nivel 4: Cualquiera de los 4 minijuegos
                const random = Math.random();
                if (random < 0.25) {
                    this.scene.start('OrderingGameScene', {
                        ...baseData,
                        isCountries: false
                    });
                } else if (random < 0.5) {
                    this.scene.start('MatchingGameScene', {
                        ...baseData,
                        matchType: 'capitals'
                    });
                } else if (random < 0.75) {
                    this.scene.start('MapGameScene', {
                        ...baseData,
                        mapType: 'europe',
                        isCapitals: true
                    });
                } else {
                    this.scene.start('MapGameScene', {
                        ...baseData,
                        mapType: 'world',
                        isCapitals: false
                    });
                }
            }
        });
    }

    showFeedback(correct, correctAnswer = '', dato = '') {
        const feedback = this.add.container(480, 400);

        const bg = this.add.graphics();
        bg.fillStyle(correct ? 0x4ecca3 : 0xe94560, 0.95);
        bg.fillRoundedRect(-220, -50, 440, correct ? 60 : 100, 10);

        let text;
        if (correct) {
            text = this.add.text(0, -20, '¡CORRECTO!', {
                fontFamily: '"Press Start 2P"',
                fontSize: '16px',
                color: '#ffffff'
            }).setOrigin(0.5);
        } else {
            text = this.add.text(0, -35, `INCORRECTO\nRespuesta: ${correctAnswer}`, {
                fontFamily: '"Press Start 2P"',
                fontSize: '9px',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);

            if (dato) {
                const datoText = this.add.text(0, 20, dato, {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '6px',
                    color: '#ffd700',
                    align: 'center',
                    wordWrap: { width: 400 }
                }).setOrigin(0.5);
                feedback.add(datoText);
            }
        }

        feedback.add([bg, text]);

        feedback.setScale(0);
        this.tweens.add({
            targets: feedback,
            scale: 1,
            duration: 200,
            ease: 'Back.easeOut'
        });

        this.time.delayedCall(2200, () => {
            this.tweens.add({
                targets: feedback,
                alpha: 0,
                scale: 0.5,
                duration: 200,
                onComplete: () => feedback.destroy()
            });
        });
    }

    createCorrectParticles() {
        for (let i = 0; i < 15; i++) {
            const star = this.add.image(
                480 + (Math.random() - 0.5) * 300,
                350 + Math.random() * 100,
                'star'
            );
            star.setScale(0.5 + Math.random() * 0.5);

            this.tweens.add({
                targets: star,
                y: star.y - 200 - Math.random() * 100,
                alpha: 0,
                scale: star.scale * 1.5,
                angle: Math.random() * 360,
                duration: 1000 + Math.random() * 500,
                ease: 'Cubic.easeOut',
                onComplete: () => star.destroy()
            });
        }
    }

    createWrongParticles() {
        for (let i = 0; i < 8; i++) {
            const skull = this.add.image(
                480 + (Math.random() - 0.5) * 200,
                300,
                'skull'
            );
            skull.setScale(0.8);

            this.tweens.add({
                targets: skull,
                y: skull.y + 150,
                alpha: 0,
                rotation: Math.random() * Math.PI * 2,
                duration: 1500,
                ease: 'Cubic.easeIn',
                onComplete: () => skull.destroy()
            });
        }
    }

    startLevelMusic() {
        audioManager.stopMusic();
        switch(this.level) {
            case 1: audioManager.playLevel1Music(); break;
            case 2: audioManager.playLevel2Music(); break;
            case 3: audioManager.playLevel3Music(); break;
            case 4: audioManager.playBossMusic(); break;
        }
    }

    endLevel() {
        if (this.timerEvent) this.timerEvent.destroy();
        audioManager.stopMusic();

        const passed = this.correctAnswers >= 7;

        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('LevelResultScene', {
                level: this.level,
                correct: this.correctAnswers,
                passed: passed,
                totalCorrect: this.totalCorrect,
                score: this.score,
                lives: this.lives,
                maxCombo: this.maxCombo,
                powerups: this.powerups
            });
        });
    }

    gameOver() {
        if (this.timerEvent) this.timerEvent.destroy();
        audioManager.stopMusic();

        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('FinalScene', {
                victory: false,
                level: this.level,
                totalCorrect: this.totalCorrect,
                score: this.score,
                reason: 'lives'
            });
        });
    }
}

// ==================== ESCENA RESULTADO DE NIVEL ====================
class LevelResultScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelResultScene' });
    }

    init(data) {
        this.level = data.level;
        this.correct = data.correct;
        this.passed = data.passed;
        this.totalCorrect = data.totalCorrect;
        this.score = data.score;
        this.lives = data.lives;
        this.maxCombo = data.maxCombo;
        this.powerups = data.powerups;
    }

    create() {
        this.add.rectangle(400, 300, 800, 600, 0x0a0a15);

        const profState = this.passed ? 'angry' : 'laugh';
        this.professor = this.add.sprite(400, 180, `prof_${profState}_0`);
        this.professor.setScale(3.5);

        this.time.addEvent({
            delay: 200,
            callback: () => {
                const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                this.professor.setTexture(`prof_${profState}_${frame}`);
            },
            loop: true
        });

        const title = this.passed ? '¡NIVEL SUPERADO!' : 'NIVEL FALLIDO';
        const titleColor = this.passed ? '#4ecca3' : '#e94560';

        this.add.text(400, 320, title, {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            color: titleColor
        }).setOrigin(0.5);

        this.add.text(400, 380,
            `Aciertos: ${this.correct}/10\n` +
            `Combo máximo: x${this.maxCombo}\n` +
            `Puntuación: ${this.score}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '11px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);

        const phraseType = this.passed ? 'nivelSuperado' : 'nivelFallido';
        const phrase = GAME_DATA.frases[phraseType][Math.floor(Math.random() * GAME_DATA.frases[phraseType].length)];

        this.add.text(400, 470, `"${phrase}"`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#ffd700',
            align: 'center',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);

        if (this.passed) {
            audioManager.playLevelVictory();
            this.createConfetti();
        } else {
            audioManager.playLevelDefeat();
        }

        const btnText = this.passed ?
            (this.level >= 4 ? 'VER RESULTADO' : 'SIGUIENTE NIVEL') :
            'VER RESULTADO';

        this.createButton(400, 540, btnText, () => {
            audioManager.playClick();
            this.nextScene();
        });

        this.cameras.main.fadeIn(500);
    }

    createButton(x, y, text, callback) {
        const container = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(0x16213e, 1);
        bg.fillRoundedRect(-120, -20, 240, 40, 5);
        bg.lineStyle(3, 0xe94560);
        bg.strokeRoundedRect(-120, -20, 240, 40, 5);

        const label = this.add.text(0, 0, text, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#e94560'
        }).setOrigin(0.5);

        container.add([bg, label]);
        container.setSize(240, 40);
        container.setInteractive();

        container.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(0xe94560, 1);
            bg.fillRoundedRect(-120, -20, 240, 40, 5);
            label.setColor('#0a0a15');
        });

        container.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(0x16213e, 1);
            bg.fillRoundedRect(-120, -20, 240, 40, 5);
            bg.lineStyle(3, 0xe94560);
            bg.strokeRoundedRect(-120, -20, 240, 40, 5);
            label.setColor('#e94560');
        });

        container.on('pointerdown', callback);
        return container;
    }

    createConfetti() {
        for (let i = 0; i < 40; i++) {
            this.time.delayedCall(i * 80, () => {
                const confetti = this.add.image(Math.random() * 800, -20, 'confetti');
                confetti.setTint(Phaser.Display.Color.RandomRGB().color);

                this.tweens.add({
                    targets: confetti,
                    y: 650,
                    x: confetti.x + (Math.random() - 0.5) * 200,
                    rotation: Math.PI * 4,
                    duration: 2500 + Math.random() * 1000,
                    onComplete: () => confetti.destroy()
                });
            });
        }
    }

    nextScene() {
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            if (this.passed && this.level < 4) {
                this.scene.start('LevelIntroScene', {
                    level: this.level + 1,
                    totalCorrect: this.totalCorrect,
                    score: this.score,
                    lives: this.lives,
                    powerups: this.powerups
                });
            } else {
                this.scene.start('FinalScene', {
                    victory: this.passed && this.level >= 4,
                    level: this.level,
                    totalCorrect: this.totalCorrect,
                    score: this.score
                });
            }
        });
    }
}

// ==================== ESCENA FINAL ====================
class FinalScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FinalScene' });
    }

    init(data) {
        this.victory = data.victory;
        this.level = data.level;
        this.totalCorrect = data.totalCorrect;
        this.score = data.score;
        this.reason = data.reason;
    }

    create() {
        const bgColor = this.victory ? 0x1a2a1a : 0x2a1a1a;
        this.add.rectangle(400, 300, 800, 600, bgColor);

        // Profesor más pequeño y arriba
        this.professor = this.add.sprite(400, 80, `prof_${this.victory ? 'angry' : 'laugh'}_0`);
        this.professor.setScale(2.5);

        this.time.addEvent({
            delay: this.victory ? 100 : 200,
            callback: () => {
                if (this.victory) {
                    this.professor.x = 400 + (Math.random() - 0.5) * 10;
                } else {
                    const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                    this.professor.setTexture(`prof_laugh_${frame}`);
                }
            },
            loop: true
        });

        const title = this.victory ? '¡VICTORIA!' : 'GAME OVER';
        const titleColor = this.victory ? '#4ecca3' : '#e94560';

        this.add.text(400, 170, title, {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            color: titleColor
        }).setOrigin(0.5);

        const subtitle = this.victory ?
            '¡Has derrotado al Profesor Álvaro!' :
            (this.reason === 'lives' ? 'Te has quedado sin vidas...' : 'No has superado el nivel...');

        this.add.text(400, 200, subtitle, {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Epílogo narrativo según victoria o derrota
        if (this.victory) {
            const epilogos = [
                'El Profesor Álvaro, derrotado y humillado,\ndecide retirarse al campo a criar gallinas.\n"Ya no me queda nada que enseñar..."',
                'Ante la evidencia de tu conocimiento,\nel Profesor Álvaro abandona la enseñanza.\nAhora cultiva tomates en un pueblo de Segovia.',
                'El temido Profesor Álvaro se retira.\nSe le vio por última vez comprando una furgoneta\npara irse a vivir a las montañas.',
                'Victoria total. El Profesor Álvaro\nha vendido su bata de laboratorio\ny ahora hace quesos artesanales en Asturias.'
            ];
            const epilogo = epilogos[Math.floor(Math.random() * epilogos.length)];

            this.add.text(400, 248, epilogo, {
                fontFamily: '"Press Start 2P"',
                fontSize: '6px',
                color: '#88ccaa',
                align: 'center',
                lineSpacing: 6
            }).setOrigin(0.5);
        } else {
            this.add.text(400, 240,
                `Nivel: ${this.level}/4  |  Aciertos: ${this.totalCorrect}  |  Puntos: ${this.score}`, {
                fontFamily: '"Press Start 2P"',
                fontSize: '9px',
                color: '#ffd700',
                align: 'center'
            }).setOrigin(0.5);
        }

        const phraseType = this.victory ? 'victoriaFinal' : 'derrotaFinal';
        const phrase = GAME_DATA.frases[phraseType][Math.floor(Math.random() * GAME_DATA.frases[phraseType].length)];

        this.add.text(400, this.victory ? 295 : 275, `"${phrase}"`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: this.victory ? '#4ecca3' : '#e94560',
            align: 'center',
            wordWrap: { width: 550 }
        }).setOrigin(0.5);

        // Guardar puntuación
        this.saveScore();

        // Botones más pequeños y arriba
        this.createSmallButton(130, 320, 'MENU', () => {
            audioManager.playClick();
            this.scene.start('EnhancedMenuScene');
        });

        this.createSmallButton(310, 320, 'RANKING', () => {
            audioManager.playClick();
            this.scene.start('LeaderboardScene');
        });

        this.createSmallButton(490, 320, 'REINTENTAR', () => {
            audioManager.playClick();
            this.scene.start('LevelIntroScene', { level: 1 });
        });

        // Input para nombre si es puntuación alta
        if (this.score > 0) {
            this.showNameInput();
        }

        if (this.victory) {
            audioManager.playVictory();
            this.createMassiveConfetti();
        } else {
            audioManager.playDefeat();
        }

        this.cameras.main.fadeIn(500);
    }

    showNameInput() {
        this.add.text(400, 365, 'Introduce tu nombre:', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#4ecca3'
        }).setOrigin(0.5);

        // Input visual
        this.nameInput = '';
        this.nameContainer = this.add.container(400, 390);

        const inputBg = this.add.graphics();
        inputBg.fillStyle(0x1a1a2e, 1);
        inputBg.fillRoundedRect(-120, -12, 180, 24, 5);
        inputBg.lineStyle(2, 0x4ecca3);
        inputBg.strokeRoundedRect(-120, -12, 180, 24, 5);

        this.nameDisplay = this.add.text(-30, 0, '_', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#4ecca3'
        }).setOrigin(0.5);

        // Botón guardar
        const saveBtn = this.add.container(100, 0);
        const saveBg = this.add.rectangle(0, 0, 60, 22, 0x4ecca3);
        const saveText = this.add.text(0, 0, 'OK', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#0a0a15'
        }).setOrigin(0.5);

        saveBtn.add([saveBg, saveText]);
        saveBtn.setSize(60, 22);
        saveBtn.setInteractive();
        saveBtn.on('pointerdown', () => this.saveName());

        this.nameContainer.add([inputBg, this.nameDisplay, saveBtn]);

        // Teclado virtual para tablets
        this.createNameKeyboard();

        // Keyboard input para PC
        this.input.keyboard.on('keydown', (event) => {
            if (event.key === 'Enter') {
                this.saveName();
            } else if (event.key === 'Backspace') {
                this.nameInput = this.nameInput.slice(0, -1);
                this.nameDisplay.setText(this.nameInput + '_');
            } else if (event.key.length === 1 && this.nameInput.length < 10) {
                this.nameInput += event.key.toUpperCase();
                this.nameDisplay.setText(this.nameInput + '_');
            }
        });
    }

    createNameKeyboard() {
        // Teclado compacto que cabe en pantalla
        this.keyboard = this.add.container(400, 490);

        const keys = 'QWERTYUIOPASDFGHJKLZXCVBNM';
        const rows = [
            keys.slice(0, 10),
            keys.slice(10, 19),
            keys.slice(19, 26)
        ];

        rows.forEach((row, rowIndex) => {
            const startX = -((row.length - 1) * 28) / 2;

            for (let i = 0; i < row.length; i++) {
                const key = row[i];
                const x = startX + i * 28;
                const y = rowIndex * 32 - 32;

                const keyBtn = this.add.container(x, y);
                const keyBg = this.add.rectangle(0, 0, 26, 28, 0x1a1a2e);
                keyBg.setStrokeStyle(2, 0x4ecca3);
                const keyText = this.add.text(0, 0, key, {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '8px',
                    color: '#4ecca3'
                }).setOrigin(0.5);

                keyBtn.add([keyBg, keyText]);
                keyBtn.setSize(26, 28);
                keyBtn.setInteractive();

                keyBtn.on('pointerdown', () => {
                    if (this.nameInput.length < 10) {
                        this.nameInput += key;
                        this.nameDisplay.setText(this.nameInput + '_');
                        audioManager.playClick();
                    }
                });

                this.keyboard.add(keyBtn);
            }
        });

        // Botón borrar al lado de la última fila
        const delBtn = this.add.container(130, 32);
        const delBg = this.add.rectangle(0, 0, 50, 28, 0x1a1a2e);
        delBg.setStrokeStyle(2, 0xe94560);
        const delText = this.add.text(0, 0, 'DEL', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#e94560'
        }).setOrigin(0.5);

        delBtn.add([delBg, delText]);
        delBtn.setSize(50, 28);
        delBtn.setInteractive();
        delBtn.on('pointerdown', () => {
            this.nameInput = this.nameInput.slice(0, -1);
            this.nameDisplay.setText(this.nameInput + '_');
            audioManager.playClick();
        });

        this.keyboard.add(delBtn);
    }

    createSmallButton(x, y, text, callback) {
        const container = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, 140, 30, 0x16213e);
        bg.setStrokeStyle(2, 0x4ecca3);

        const label = this.add.text(0, 0, text, {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#4ecca3'
        }).setOrigin(0.5);

        container.add([bg, label]);
        container.setSize(140, 30);
        container.setInteractive();

        container.on('pointerover', () => {
            bg.setFillStyle(0x4ecca3);
            label.setColor('#0a0a15');
        });

        container.on('pointerout', () => {
            bg.setFillStyle(0x16213e);
            label.setColor('#4ecca3');
        });

        container.on('pointerdown', callback);
        return container;
    }

    async saveName() {
        if (this.nameInput.length === 0) this.nameInput = 'ANONIMO';

        const entry = {
            name: this.nameInput,
            score: this.score,
            level: this.level,
            correct: this.totalCorrect,
            date: new Date().toISOString(),
            victory: this.victory
        };

        // Guardar usando el manager (Firebase + localStorage)
        try {
            if (window.leaderboardManager) {
                await leaderboardManager.saveScore(entry);
            } else {
                // Fallback a localStorage
                const scores = JSON.parse(localStorage.getItem('profesorAlvaroLeaderboard') || '[]');
                scores.push(entry);
                scores.sort((a, b) => b.score - a.score);
                localStorage.setItem('profesorAlvaroLeaderboard', JSON.stringify(scores.slice(0, 50)));
            }
        } catch (e) {
            console.log('Error guardando:', e);
        }

        // Feedback visual
        if (this.nameContainer) {
            this.nameContainer.destroy();
        }
        if (this.keyboard) {
            this.keyboard.destroy();
        }
        this.add.text(400, 420, '¡Puntuación guardada!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#4ecca3'
        }).setOrigin(0.5);
    }

    saveScore() {
        // Auto-save sin nombre por si no lo introducen
        // No guardamos aquí, solo al introducir nombre
    }

    createButton(x, y, text, callback) {
        const container = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(0x16213e, 1);
        bg.fillRoundedRect(-70, -18, 140, 36, 5);
        bg.lineStyle(2, 0xe94560);
        bg.strokeRoundedRect(-70, -18, 140, 36, 5);

        const label = this.add.text(0, 0, text, {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#e94560'
        }).setOrigin(0.5);

        container.add([bg, label]);
        container.setSize(140, 36);
        container.setInteractive();

        container.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(0xe94560, 1);
            bg.fillRoundedRect(-70, -18, 140, 36, 5);
            label.setColor('#0a0a15');
        });

        container.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(0x16213e, 1);
            bg.fillRoundedRect(-70, -18, 140, 36, 5);
            bg.lineStyle(2, 0xe94560);
            bg.strokeRoundedRect(-70, -18, 140, 36, 5);
            label.setColor('#e94560');
        });

        container.on('pointerdown', callback);
        return container;
    }

    createMassiveConfetti() {
        for (let i = 0; i < 100; i++) {
            this.time.delayedCall(i * 50, () => {
                const confetti = this.add.image(Math.random() * 800, -20, 'confetti');
                confetti.setTint(Phaser.Display.Color.RandomRGB().color);
                confetti.setScale(1 + Math.random());

                this.tweens.add({
                    targets: confetti,
                    y: 650,
                    x: confetti.x + (Math.random() - 0.5) * 300,
                    rotation: Math.PI * 6,
                    duration: 2000 + Math.random() * 2000,
                    onComplete: () => confetti.destroy()
                });
            });
        }
    }
}

// ==================== ESCENA LEADERBOARD ====================
class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LeaderboardScene' });
    }

    async create() {
        this.add.rectangle(400, 300, 800, 600, 0x0a0a15);

        // Título
        this.add.text(400, 40, 'RANKING GLOBAL', {
            fontFamily: '"Press Start 2P"',
            fontSize: '22px',
            color: '#ffd700'
        }).setOrigin(0.5);

        // Indicador de carga
        this.loadingText = this.add.text(400, 300, 'Cargando...', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#4ecca3'
        }).setOrigin(0.5);

        // Cargar puntuaciones (Firebase o localStorage)
        let scores = [];
        try {
            if (window.leaderboardManager) {
                scores = await leaderboardManager.getScores(50);
            } else {
                scores = JSON.parse(localStorage.getItem('profesorAlvaroLeaderboard') || '[]');
            }
        } catch (e) {
            scores = JSON.parse(localStorage.getItem('profesorAlvaroLeaderboard') || '[]');
        }

        this.loadingText.destroy();
        this.displayLeaderboard(scores);

        // Botón volver
        this.createButton(400, 560, 'VOLVER AL MENU', () => {
            audioManager.playClick();
            this.scene.start('EnhancedMenuScene');
        });

        this.cameras.main.fadeIn(500);
    }

    displayLeaderboard(scores) {
        if (scores.length === 0) {
            this.add.text(400, 300, 'No hay puntuaciones todavía.\n¡Sé el primero en jugar!', {
                fontFamily: '"Press Start 2P"',
                fontSize: '10px',
                color: '#666666',
                align: 'center'
            }).setOrigin(0.5);
            return;
        }

        // Cabecera
        this.add.text(50, 85, '#', { fontFamily: '"Press Start 2P"', fontSize: '9px', color: '#4ecca3' });
        this.add.text(90, 85, 'NOMBRE', { fontFamily: '"Press Start 2P"', fontSize: '9px', color: '#4ecca3' });
        this.add.text(320, 85, 'PUNTOS', { fontFamily: '"Press Start 2P"', fontSize: '9px', color: '#4ecca3' });
        this.add.text(450, 85, 'NIVEL', { fontFamily: '"Press Start 2P"', fontSize: '9px', color: '#4ecca3' });
        this.add.text(550, 85, 'FECHA', { fontFamily: '"Press Start 2P"', fontSize: '9px', color: '#4ecca3' });

        // Línea separadora
        this.add.rectangle(400, 105, 720, 2, 0x4ecca3);

        // Mostrar top 15
        const displayScores = scores.slice(0, 15);
        displayScores.forEach((entry, index) => {
            const y = 125 + index * 28;

            // Medallas para top 3
            let rankText = `${index + 1}`;
            let rankColor = '#ffffff';
            if (index === 0) { rankText = '1'; rankColor = '#ffd700'; }
            else if (index === 1) { rankText = '2'; rankColor = '#c0c0c0'; }
            else if (index === 2) { rankText = '3'; rankColor = '#cd7f32'; }

            // Medalla visual para top 3
            if (index < 3) {
                const medalColors = [0xffd700, 0xc0c0c0, 0xcd7f32];
                this.add.circle(35, y + 5, 12, medalColors[index]);
            }

            this.add.text(50, y, rankText, {
                fontFamily: '"Press Start 2P"',
                fontSize: '10px',
                color: rankColor
            });

            this.add.text(90, y, (entry.name || 'ANONIMO').substring(0, 10), {
                fontFamily: '"Press Start 2P"',
                fontSize: '10px',
                color: entry.victory ? '#4ecca3' : '#ffffff'
            });

            this.add.text(320, y, `${entry.score}`, {
                fontFamily: '"Press Start 2P"',
                fontSize: '10px',
                color: '#ffd700'
            });

            this.add.text(450, y, `${entry.level}/4`, {
                fontFamily: '"Press Start 2P"',
                fontSize: '10px',
                color: '#ffffff'
            });

            // Fecha formateada
            let dateStr = '-';
            if (entry.date) {
                const d = new Date(entry.date);
                dateStr = `${d.getDate()}/${d.getMonth()+1}`;
            }
            this.add.text(550, y, dateStr, {
                fontFamily: '"Press Start 2P"',
                fontSize: '9px',
                color: '#888888'
            });
        });
    }

    createButton(x, y, text, callback) {
        const container = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(0x16213e, 1);
        bg.fillRoundedRect(-120, -20, 240, 40, 5);
        bg.lineStyle(3, 0xe94560);
        bg.strokeRoundedRect(-120, -20, 240, 40, 5);

        const label = this.add.text(0, 0, text, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#e94560'
        }).setOrigin(0.5);

        container.add([bg, label]);
        container.setSize(240, 40);
        container.setInteractive();

        container.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(0xe94560, 1);
            bg.fillRoundedRect(-120, -20, 240, 40, 5);
            label.setColor('#0a0a15');
        });

        container.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(0x16213e, 1);
            bg.fillRoundedRect(-120, -20, 240, 40, 5);
            bg.lineStyle(3, 0xe94560);
            bg.strokeRoundedRect(-120, -20, 240, 40, 5);
            label.setColor('#e94560');
        });

        container.on('pointerdown', callback);
        return container;
    }
}

// ==================== MINIJUEGO: ORDENAR POR POBLACIÓN ====================
class OrderingGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OrderingGameScene' });
    }

    init(data) {
        this.level = data.level || 2;
        this.totalCorrect = data.totalCorrect || 0;
        this.score = data.score || 0;
        this.lives = data.lives !== undefined ? data.lives : 3;
        this.powerups = data.powerups || { fifty: 1, hint: 1, freeze: 1 };
        this.isCountries = data.isCountries !== false; // true para países, false para ciudades
        this.correctAnswers = data.correctAnswers || 0;
        this.maxCombo = data.maxCombo || 0;
    }

    create() {
        try {
            const levelInfo = GAME_DATA.niveles[this.level - 1];

            // Fondo
            if (levelInfo && levelInfo.escenario) {
                this.bg = this.add.image(400, 300, `bg_${levelInfo.escenario}`);
                this.bg.setAlpha(0.5);
            } else {
                this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);
            }

            // Título
            this.add.text(400, 30, 'ORDENA POR POBLACIÓN', {
                fontFamily: '"Press Start 2P"',
                fontSize: '16px',
                color: '#ffd700'
            }).setOrigin(0.5);

            this.add.text(400, 55, '(de MÁS a MENOS poblado)', {
                fontFamily: '"Press Start 2P"',
                fontSize: '9px',
                color: '#4ecca3'
            }).setOrigin(0.5);

            // Seleccionar 5 elementos aleatorios
            const source = this.isCountries ? GAME_DATA.top20Paises : GAME_DATA.top20Ciudades;

            // Verificar que tenemos datos
            if (!source || source.length === 0) {
                console.error('OrderingGameScene: No se encontraron datos para ordenar');
                this.showErrorAndReturn('Error al cargar datos');
                return;
            }

            const shuffled = Phaser.Utils.Array.Shuffle([...source]);
            this.items = shuffled.slice(0, 5);
            this.correctOrder = [...this.items].sort((a, b) => a.posicion - b.posicion);

            // Mezclar para mostrar
            this.displayItems = Phaser.Utils.Array.Shuffle([...this.items]);

            // Crear slots
            this.slots = [];
            this.cards = [];
            this.selectedCard = null;

            this.createSlots();
            this.createCards();

            // Botón confirmar
            this.confirmBtn = this.createButton(400, 550, 'CONFIRMAR ORDEN', () => {
                this.checkOrder();
            });

            // Instrucciones
            this.add.text(400, 580, 'Arrastra o toca para intercambiar posiciones', {
                fontFamily: '"Press Start 2P"',
                fontSize: '7px',
                color: '#666666'
            }).setOrigin(0.5);

            this.cameras.main.fadeIn(500);
        } catch (error) {
            console.error('OrderingGameScene create error:', error);
            this.showErrorAndReturn('Error en el minijuego');
        }
    }

    showErrorAndReturn(message) {
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        this.add.text(400, 280, message, {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#e94560'
        }).setOrigin(0.5);
        this.add.text(400, 320, 'Volviendo al juego...', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.time.delayedCall(2000, () => this.returnToGame());
    }

    createSlots() {
        for (let i = 0; i < 5; i++) {
            const y = 130 + i * 85;

            // Número de posición
            this.add.text(50, y, `${i + 1}.`, {
                fontFamily: '"Press Start 2P"',
                fontSize: '20px',
                color: '#4ecca3'
            }).setOrigin(0.5);

            // Slot visual
            const slot = this.add.rectangle(420, y, 600, 70, 0x1a1a2e, 0.5);
            slot.setStrokeStyle(2, 0x4ecca3);
            slot.slotIndex = i;

            this.slots.push(slot);
        }
    }

    createCards() {
        this.displayItems.forEach((item, i) => {
            const y = 130 + i * 85;
            const card = this.createCard(420, y, item, i);
            this.cards.push(card);
        });
    }

    createCard(x, y, item, index) {
        const container = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, 580, 65, 0x16213e);
        bg.setStrokeStyle(3, 0xe94560);

        const name = this.add.text(-270, -10, item.nombre, {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#ffffff'
        });

        const info = this.add.text(-270, 15, this.isCountries ? item.continente : `${item.pais}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#888888'
        });

        container.add([bg, name, info]);
        container.setSize(580, 65);
        container.setInteractive({ draggable: true });

        container.itemData = item;
        container.currentSlot = index;
        container.bg = bg;

        // Eventos de drag
        container.on('dragstart', () => {
            container.setDepth(100);
            bg.setStrokeStyle(4, 0xffd700);
        });

        container.on('drag', (pointer, dragX, dragY) => {
            container.y = dragY;
        });

        container.on('dragend', () => {
            container.setDepth(0);
            bg.setStrokeStyle(3, 0xe94560);
            this.snapToSlot(container);
        });

        // Click para seleccionar (alternativa al drag)
        container.on('pointerdown', () => {
            if (this.selectedCard && this.selectedCard !== container) {
                // Intercambiar
                this.swapCards(this.selectedCard, container);
                this.selectedCard.bg.setStrokeStyle(3, 0xe94560);
                this.selectedCard = null;
            } else if (this.selectedCard === container) {
                // Deseleccionar
                this.selectedCard.bg.setStrokeStyle(3, 0xe94560);
                this.selectedCard = null;
            } else {
                // Seleccionar
                this.selectedCard = container;
                bg.setStrokeStyle(4, 0xffd700);
            }
        });

        return container;
    }

    snapToSlot(card) {
        // Encontrar slot más cercano
        let closestSlot = 0;
        let minDist = Infinity;

        this.slots.forEach((slot, i) => {
            const dist = Math.abs(card.y - slot.y);
            if (dist < minDist) {
                minDist = dist;
                closestSlot = i;
            }
        });

        // Si ya hay una carta en ese slot, intercambiar
        const existingCard = this.cards.find(c => c !== card && c.currentSlot === closestSlot);
        if (existingCard) {
            existingCard.currentSlot = card.currentSlot;
            this.tweens.add({
                targets: existingCard,
                y: this.slots[existingCard.currentSlot].y,
                duration: 200
            });
        }

        card.currentSlot = closestSlot;
        this.tweens.add({
            targets: card,
            y: this.slots[closestSlot].y,
            duration: 200
        });
    }

    swapCards(card1, card2) {
        const slot1 = card1.currentSlot;
        const slot2 = card2.currentSlot;

        card1.currentSlot = slot2;
        card2.currentSlot = slot1;

        this.tweens.add({
            targets: card1,
            y: this.slots[slot2].y,
            duration: 200
        });

        this.tweens.add({
            targets: card2,
            y: this.slots[slot1].y,
            duration: 200
        });

        audioManager.playClick();
    }

    checkOrder() {
        // Ordenar cartas por su slot actual
        const orderedCards = [...this.cards].sort((a, b) => a.currentSlot - b.currentSlot);
        const userOrder = orderedCards.map(c => c.itemData);

        let correct = 0;
        userOrder.forEach((item, i) => {
            if (item.posicion === this.correctOrder[i].posicion) {
                correct++;
                orderedCards[i].bg.setFillStyle(0x2a5a2a);
            } else {
                orderedCards[i].bg.setFillStyle(0x5a2a2a);
            }
        });

        const isFullyCorrect = correct === 5;
        const points = correct * 50;

        this.score += points;
        if (isFullyCorrect) {
            this.totalCorrect++;
            audioManager.playCorrect();
        } else {
            audioManager.playWrong();
            this.lives--;
        }

        // Mostrar feedback
        this.showFeedback(correct, isFullyCorrect);

        // Continuar después
        this.time.delayedCall(2500, () => {
            this.returnToGame();
        });
    }

    showFeedback(correct, isFullyCorrect) {
        const feedback = this.add.container(400, 300);

        const bg = this.add.rectangle(0, 0, 400, 150, isFullyCorrect ? 0x4ecca3 : 0xe94560, 0.95);
        bg.setStrokeStyle(4, 0xffffff);

        const title = this.add.text(0, -40, isFullyCorrect ? '¡PERFECTO!' : `${correct}/5 CORRECTOS`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const points = this.add.text(0, 10, `+${correct * 50} puntos`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#ffd700'
        }).setOrigin(0.5);

        const orderText = this.add.text(0, 50, 'Orden correcto: ' + this.correctOrder.map(i => i.nombre.substring(0, 8)).join(' > '), {
            fontFamily: '"Press Start 2P"',
            fontSize: '6px',
            color: '#ffffff',
            wordWrap: { width: 380 }
        }).setOrigin(0.5);

        feedback.add([bg, title, points, orderText]);
        feedback.setScale(0);

        this.tweens.add({
            targets: feedback,
            scale: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }

    returnToGame() {
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('GameScene', {
                level: this.level,
                totalCorrect: this.totalCorrect,
                score: this.score,
                lives: this.lives,
                powerups: this.powerups,
                fromMinigame: true,
                minigamePlayed: true,
                currentQuestion: 5,
                correctAnswers: this.correctAnswers,
                maxCombo: this.maxCombo
            });
        });
    }

    createButton(x, y, text, callback) {
        const container = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, 280, 45, 0x16213e);
        bg.setStrokeStyle(3, 0x4ecca3);

        const label = this.add.text(0, 0, text, {
            fontFamily: '"Press Start 2P"',
            fontSize: '11px',
            color: '#4ecca3'
        }).setOrigin(0.5);

        container.add([bg, label]);
        container.setSize(280, 45);
        container.setInteractive();

        container.on('pointerover', () => {
            bg.setFillStyle(0x4ecca3);
            label.setColor('#0a0a15');
        });

        container.on('pointerout', () => {
            bg.setFillStyle(0x16213e);
            label.setColor('#4ecca3');
        });

        container.on('pointerdown', callback);
        return container;
    }
}

// ==================== MINIJUEGO: EMPAREJAR ====================
class MatchingGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MatchingGameScene' });
    }

    init(data) {
        this.level = data.level || 1;
        this.totalCorrect = data.totalCorrect || 0;
        this.score = data.score || 0;
        this.lives = data.lives !== undefined ? data.lives : 3;
        this.powerups = data.powerups || { fifty: 1, hint: 1, freeze: 1 };
        this.matchType = data.matchType || 'capitals'; // 'capitals', 'countries', 'cities'
        this.correctAnswers = data.correctAnswers || 0;
        this.maxCombo = data.maxCombo || 0;
    }

    create() {
        try {
            const levelInfo = GAME_DATA.niveles[this.level - 1];

            // Fondo
            if (levelInfo && levelInfo.escenario) {
                this.bg = this.add.image(400, 300, `bg_${levelInfo.escenario}`);
                this.bg.setAlpha(0.5);
            } else {
                this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);
            }

            // Título según tipo
            let title = 'EMPAREJA CAPITALES';
            let subtitle = 'Conecta cada país con su capital';

            if (this.matchType === 'countries') {
                title = 'EMPAREJA PAÍSES';
                subtitle = 'Conecta cada país con su continente';
            } else if (this.matchType === 'cities') {
                title = 'EMPAREJA CIUDADES';
                subtitle = 'Conecta cada ciudad con su país';
            }

            this.add.text(400, 25, title, {
                fontFamily: '"Press Start 2P"',
                fontSize: '16px',
                color: '#ffd700'
            }).setOrigin(0.5);

            this.add.text(400, 50, subtitle, {
                fontFamily: '"Press Start 2P"',
                fontSize: '8px',
                color: '#4ecca3'
            }).setOrigin(0.5);

            // Generar pares
            this.generatePairs();

            // Verificar que tenemos pares
            if (!this.pairs || this.pairs.length === 0) {
                console.error('MatchingGameScene: No se generaron pares');
                this.showErrorAndReturn('Error al cargar el minijuego');
                return;
            }

            // Estado del juego
            this.selectedLeft = null;
            this.selectedRight = null;
            this.matchedPairs = 0;
            this.totalPairs = this.pairs.length;
            this.wrongAttempts = 0;

            // Crear elementos
            this.createMatchingElements();

            // Gráficos para líneas
            this.linesGraphics = this.add.graphics();

            this.cameras.main.fadeIn(500);
        } catch (error) {
            console.error('MatchingGameScene create error:', error);
            this.showErrorAndReturn('Error en el minijuego');
        }
    }

    showErrorAndReturn(message) {
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        this.add.text(400, 280, message, {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#e94560'
        }).setOrigin(0.5);
        this.add.text(400, 320, 'Volviendo al juego...', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.time.delayedCall(2000, () => this.returnToGame());
    }

    generatePairs() {
        this.pairs = [];

        try {
            if (this.matchType === 'capitals') {
                const caps = Phaser.Utils.Array.Shuffle([...GAME_DATA.capitalesEuropa]).slice(0, 5);
                caps.forEach(c => {
                    // Extraer nombre del país de la pregunta (manejar diferentes formatos)
                    let country = c.pregunta
                        .replace('¿Cuál es la capital de ', '')
                        .replace('Cual es la capital de ', '')
                        .replace('?', '')
                        .trim();
                    this.pairs.push({
                        left: country,
                        right: c.respuesta
                    });
                });
            } else if (this.matchType === 'countries') {
                const countries = Phaser.Utils.Array.Shuffle([...GAME_DATA.top20Paises]).slice(0, 5);
                countries.forEach(c => {
                    this.pairs.push({
                        left: c.nombre,
                        right: c.continente
                    });
                });
            } else if (this.matchType === 'cities') {
                const cities = Phaser.Utils.Array.Shuffle([...GAME_DATA.top20Ciudades]).slice(0, 5);
                cities.forEach(c => {
                    this.pairs.push({
                        left: c.nombre,
                        right: c.pais
                    });
                });
            }

            // Verificar que se generaron pares
            if (this.pairs.length === 0) {
                console.error('MatchingGameScene: No se pudieron generar pares');
            }
        } catch (error) {
            console.error('MatchingGameScene generatePairs error:', error);
            this.pairs = [];
        }
    }

    createMatchingElements() {
        this.leftItems = [];
        this.rightItems = [];

        // Mezclar lados
        const leftTexts = Phaser.Utils.Array.Shuffle(this.pairs.map(p => p.left));
        const rightTexts = Phaser.Utils.Array.Shuffle(this.pairs.map(p => p.right));

        // Crear columna izquierda
        leftTexts.forEach((text, i) => {
            const y = 110 + i * 90;
            const item = this.createMatchItem(120, y, text, 'left', i);
            this.leftItems.push(item);
        });

        // Crear columna derecha
        rightTexts.forEach((text, i) => {
            const y = 110 + i * 90;
            const item = this.createMatchItem(680, y, text, 'right', i);
            this.rightItems.push(item);
        });
    }

    createMatchItem(x, y, text, side, index) {
        const container = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, 220, 70, 0x16213e);
        bg.setStrokeStyle(3, side === 'left' ? 0x4ecca3 : 0xe94560);

        const label = this.add.text(0, 0, text, {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 200 }
        }).setOrigin(0.5);

        container.add([bg, label]);
        container.setSize(220, 70);
        container.setInteractive();

        container.itemText = text;
        container.side = side;
        container.itemIndex = index;
        container.bg = bg;
        container.label = label;
        container.isMatched = false;

        container.on('pointerdown', () => {
            if (container.isMatched) return;

            audioManager.playClick();

            if (side === 'left') {
                if (this.selectedLeft) {
                    this.selectedLeft.bg.setStrokeStyle(3, 0x4ecca3);
                }
                this.selectedLeft = container;
                bg.setStrokeStyle(4, 0xffd700);
            } else {
                if (this.selectedRight) {
                    this.selectedRight.bg.setStrokeStyle(3, 0xe94560);
                }
                this.selectedRight = container;
                bg.setStrokeStyle(4, 0xffd700);
            }

            // Verificar si hay pareja seleccionada
            if (this.selectedLeft && this.selectedRight) {
                this.checkMatch();
            }
        });

        return container;
    }

    checkMatch() {
        const leftText = this.selectedLeft.itemText;
        const rightText = this.selectedRight.itemText;

        // Buscar si es pareja correcta
        const isCorrect = this.pairs.some(p => p.left === leftText && p.right === rightText);

        if (isCorrect) {
            // Correcto
            audioManager.playCorrect();
            this.matchedPairs++;
            this.score += 40;

            // Marcar como emparejados
            this.selectedLeft.isMatched = true;
            this.selectedRight.isMatched = true;
            this.selectedLeft.bg.setFillStyle(0x2a5a2a);
            this.selectedRight.bg.setFillStyle(0x2a5a2a);
            this.selectedLeft.bg.setStrokeStyle(3, 0x4ecca3);
            this.selectedRight.bg.setStrokeStyle(3, 0x4ecca3);

            // Dibujar línea conectora
            this.linesGraphics.lineStyle(3, 0x4ecca3);
            this.linesGraphics.lineBetween(
                this.selectedLeft.x + 110, this.selectedLeft.y,
                this.selectedRight.x - 110, this.selectedRight.y
            );

            // Verificar si completó todo
            if (this.matchedPairs >= this.totalPairs) {
                this.totalCorrect++;
                this.time.delayedCall(1000, () => this.showResult(true));
            }
        } else {
            // Incorrecto
            audioManager.playWrong();
            this.wrongAttempts++;

            // Flash rojo
            this.selectedLeft.bg.setFillStyle(0x5a2a2a);
            this.selectedRight.bg.setFillStyle(0x5a2a2a);

            this.time.delayedCall(300, () => {
                if (!this.selectedLeft.isMatched) {
                    this.selectedLeft.bg.setFillStyle(0x16213e);
                    this.selectedLeft.bg.setStrokeStyle(3, 0x4ecca3);
                }
                if (!this.selectedRight.isMatched) {
                    this.selectedRight.bg.setFillStyle(0x16213e);
                    this.selectedRight.bg.setStrokeStyle(3, 0xe94560);
                }
            });

            if (this.wrongAttempts >= 3) {
                this.lives--;
                this.time.delayedCall(500, () => this.showResult(false));
            }
        }

        this.selectedLeft = null;
        this.selectedRight = null;
    }

    showResult(success) {
        const feedback = this.add.container(400, 300);

        const bgColor = success ? 0x4ecca3 : 0xe94560;
        const bg = this.add.rectangle(0, 0, 400, 150, bgColor, 0.95);
        bg.setStrokeStyle(4, 0xffffff);

        const title = this.add.text(0, -30, success ? '¡COMPLETADO!' : 'DEMASIADOS ERRORES', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const points = this.add.text(0, 20, `+${this.matchedPairs * 40} puntos`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#ffd700'
        }).setOrigin(0.5);

        feedback.add([bg, title, points]);
        feedback.setScale(0);

        this.tweens.add({
            targets: feedback,
            scale: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });

        this.time.delayedCall(2000, () => {
            this.returnToGame();
        });
    }

    returnToGame() {
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('GameScene', {
                level: this.level,
                totalCorrect: this.totalCorrect,
                score: this.score,
                lives: this.lives,
                powerups: this.powerups,
                fromMinigame: true,
                minigamePlayed: true,
                currentQuestion: 5,
                correctAnswers: this.correctAnswers,
                maxCombo: this.maxCombo
            });
        });
    }
}

// ==================== MINIJUEGO: MAPA INTERACTIVO ====================
class MapGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MapGameScene' });
    }

    init(data) {
        this.level = data.level || 2;
        this.totalCorrect = data.totalCorrect || 0;
        this.score = data.score || 0;
        this.lives = data.lives !== undefined ? data.lives : 3;
        this.powerups = data.powerups || { fifty: 1, hint: 1, freeze: 1 };
        this.correctAnswers = data.correctAnswers || 0;
        this.maxCombo = data.maxCombo || 0;
        this.mapType = data.mapType || 'europe'; // 'europe' o 'world'
        this.isCapitals = data.isCapitals !== false; // true para capitales, false para países
    }

    create() {
        try {
            // Fondo según el tipo de mapa
            if (this.mapType === 'europe') {
                this.add.rectangle(400, 300, 800, 600, 0x0a2a4a);
                this.map = this.add.image(400, 320, 'map_europe_large');
                this.locations = SpriteGenerator.europeCountries ? { ...SpriteGenerator.europeCountries } : {};
                this.mapScale = 1.0;
            } else {
                this.add.rectangle(400, 300, 800, 600, 0x0a3a5a);
                this.map = this.add.image(400, 320, 'map_world_large');
                this.locations = SpriteGenerator.worldLocations ? { ...SpriteGenerator.worldLocations } : {};
                this.mapScale = 1.0;
            }

            // Verificar que tenemos ubicaciones
            if (Object.keys(this.locations).length === 0) {
                console.error('MapGameScene: No se encontraron ubicaciones para el mapa');
                this.showErrorAndReturn('Error al cargar el mapa');
                return;
            }

            // Ajustar posición del mapa
            this.mapOffsetX = 50;
            this.mapOffsetY = 70;

            // Título
            const titleText = this.mapType === 'europe' ?
                (this.isCapitals ? '¿DÓNDE ESTÁ LA CAPITAL?' : '¿DÓNDE ESTÁ EL PAÍS?') :
                '¿DÓNDE ESTÁ EN EL MUNDO?';

            this.add.text(400, 25, titleText, {
                fontFamily: '"Press Start 2P"',
                fontSize: '14px',
                color: '#ffd700'
            }).setOrigin(0.5);

            // Preparar preguntas
            this.prepareQuestions();

            // Verificar que tenemos preguntas
            if (!this.questions || this.questions.length === 0) {
                console.error('MapGameScene: No se pudieron generar preguntas');
                this.showErrorAndReturn('Error al cargar preguntas');
                return;
            }

            // Variables del juego
            this.currentQuestion = 0;
            this.totalQuestions = Math.min(5, this.questions.length);
            this.correctInRound = 0;
            this.hintShown = false;

            // UI
            this.createUI();

            // Mostrar primera pregunta
            this.showQuestion();

            // Input del mapa
            this.map.setInteractive();
            this.map.on('pointerdown', (pointer) => this.handleMapClick(pointer));

            // Marcador para mostrar dónde se hizo clic
            this.clickMarker = this.add.circle(0, 0, 8, 0xffd700);
            this.clickMarker.setVisible(false);

            // Marcador de posición correcta
            this.correctMarker = this.add.circle(0, 0, 12, 0x4ecca3);
            this.correctMarker.setStrokeStyle(3, 0xffffff);
            this.correctMarker.setVisible(false);

            this.cameras.main.fadeIn(500);
        } catch (error) {
            console.error('MapGameScene error:', error);
            this.showErrorAndReturn('Error en el minijuego');
        }
    }

    showErrorAndReturn(message) {
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        this.add.text(400, 280, message, {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#e94560'
        }).setOrigin(0.5);
        this.add.text(400, 320, 'Volviendo al juego...', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.time.delayedCall(2000, () => this.returnToGame());
    }

    prepareQuestions() {
        // Convertir ubicaciones a array y mezclar
        const locationArray = Object.entries(this.locations).map(([name, data]) => ({
            name: name,
            ...data
        }));

        // Mezclar y tomar 5
        Phaser.Utils.Array.Shuffle(locationArray);
        this.questions = locationArray.slice(0, 5);
    }

    createUI() {
        // Panel de pregunta
        this.questionPanel = this.add.container(400, 560);

        const panelBg = this.add.graphics();
        panelBg.fillStyle(0x1a1a2e, 0.95);
        panelBg.fillRoundedRect(-350, -35, 700, 70, 10);
        panelBg.lineStyle(3, 0xe94560);
        panelBg.strokeRoundedRect(-350, -35, 700, 70, 10);

        this.questionText = this.add.text(0, -10, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.hintText = this.add.text(0, 15, 'Haz clic en el mapa', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#4ecca3'
        }).setOrigin(0.5);

        this.questionPanel.add([panelBg, this.questionText, this.hintText]);

        // Contador de preguntas
        this.progressText = this.add.text(700, 25, '1/5', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#4ecca3'
        }).setOrigin(0.5);

        // Puntuación
        this.scoreText = this.add.text(100, 25, `${this.score}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#ffd700'
        }).setOrigin(0.5);
    }

    showQuestion() {
        if (this.currentQuestion >= this.totalQuestions) {
            this.endMinigame();
            return;
        }

        const q = this.questions[this.currentQuestion];

        let questionStr;
        if (this.isCapitals && q.capital) {
            questionStr = `¿Dónde está ${q.capital}?`;
        } else {
            questionStr = `¿Dónde está ${q.name}?`;
        }

        this.questionText.setText(questionStr);
        this.hintText.setText('Haz clic en el mapa');
        this.progressText.setText(`${this.currentQuestion + 1}/${this.totalQuestions}`);

        this.clickMarker.setVisible(false);
        this.correctMarker.setVisible(false);
        this.hintShown = false;
        this.canClick = true;
    }

    handleMapClick(pointer) {
        if (!this.canClick) return;
        this.canClick = false;

        const q = this.questions[this.currentQuestion];

        // Calcular posición relativa al mapa
        const mapBounds = this.map.getBounds();
        const clickX = pointer.x - mapBounds.left;
        const clickY = pointer.y - mapBounds.top;

        // Posición correcta (escalada al tamaño del mapa)
        const correctX = q.x * (mapBounds.width / 700) + mapBounds.left;
        const correctY = q.y * (mapBounds.height / 500) + mapBounds.top;

        // Mostrar marcador de clic
        this.clickMarker.setPosition(pointer.x, pointer.y);
        this.clickMarker.setVisible(true);

        // Calcular distancia
        const distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, correctX, correctY);

        // Determinar puntuación basada en distancia
        let points = 0;
        let message = '';
        let messageColor = '#e94560';

        if (distance < 30) {
            points = 100;
            message = '¡PERFECTO!';
            messageColor = '#4ecca3';
            this.correctInRound++;
            audioManager.playCorrect();
        } else if (distance < 60) {
            points = 75;
            message = '¡MUY CERCA!';
            messageColor = '#4ecca3';
            this.correctInRound++;
            audioManager.playCorrect();
        } else if (distance < 100) {
            points = 50;
            message = '¡CERCA!';
            messageColor = '#ffd700';
            audioManager.playClick();
        } else if (distance < 150) {
            points = 25;
            message = 'Un poco lejos...';
            messageColor = '#ff9900';
            audioManager.playClick();
        } else {
            points = 0;
            message = '¡Fallaste!';
            messageColor = '#e94560';
            this.lives--;
            audioManager.playWrong();
        }

        // Mostrar posición correcta
        this.correctMarker.setPosition(correctX, correctY);
        this.correctMarker.setVisible(true);

        // Línea desde clic hasta posición correcta
        if (distance > 30) {
            const line = this.add.graphics();
            line.lineStyle(2, 0xffffff, 0.5);
            line.lineBetween(pointer.x, pointer.y, correctX, correctY);
            this.time.delayedCall(1500, () => line.destroy());
        }

        // Actualizar puntuación
        this.score += points;
        this.scoreText.setText(`${this.score}`);

        // Mostrar feedback
        this.hintText.setText(message);
        this.hintText.setColor(messageColor);

        // Efecto visual
        if (points >= 75) {
            this.tweens.add({
                targets: this.clickMarker,
                scale: 1.5,
                alpha: 0,
                duration: 500
            });
        }

        // Siguiente pregunta
        this.time.delayedCall(1500, () => {
            this.currentQuestion++;
            this.showQuestion();
        });
    }

    endMinigame() {
        // Calcular resultado
        const success = this.correctInRound >= 3;
        const bonusPoints = this.correctInRound * 30;
        this.score += bonusPoints;

        if (success) {
            this.totalCorrect++;
        }

        // Mostrar resultado
        const feedback = this.add.container(400, 300);

        const bgColor = success ? 0x4ecca3 : 0xe94560;
        const bg = this.add.rectangle(0, 0, 400, 180, bgColor, 0.95);
        bg.setStrokeStyle(4, 0xffffff);

        const title = this.add.text(0, -50, success ? '¡BIEN HECHO!' : 'NECESITAS PRACTICAR', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const stats = this.add.text(0, 0, `Aciertos cercanos: ${this.correctInRound}/5`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const points = this.add.text(0, 35, `+${bonusPoints} puntos bonus`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#ffd700'
        }).setOrigin(0.5);

        feedback.add([bg, title, stats, points]);
        feedback.setScale(0);

        this.tweens.add({
            targets: feedback,
            scale: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });

        if (success) {
            audioManager.playCorrect();
        } else {
            audioManager.playWrong();
        }

        this.time.delayedCall(2500, () => {
            this.returnToGame();
        });
    }

    returnToGame() {
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('GameScene', {
                level: this.level,
                totalCorrect: this.totalCorrect,
                score: this.score,
                lives: this.lives,
                powerups: this.powerups,
                fromMinigame: true,
                minigamePlayed: true,
                currentQuestion: 5,
                correctAnswers: this.correctAnswers,
                maxCombo: this.maxCombo
            });
        });
    }
}
