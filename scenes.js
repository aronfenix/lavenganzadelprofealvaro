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
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.totalCorrect = data.totalCorrect || 0;
        this.score = data.score || 0;
        this.lives = data.lives !== undefined ? data.lives : 3;
        this.powerups = data.powerups || { fifty: 1, hint: 1, freeze: 1 };
        this.combo = 0;
        this.maxCombo = 0;
        this.timeLeft = 25;
        this.timerPaused = false;
        this.canAnswer = true;
        this.questions = [];
        this.currentInput = '';
    }

    create() {
        const levelInfo = GAME_DATA.niveles[this.level - 1];

        // Fondo
        this.bg = this.add.image(400, 300, `bg_${levelInfo.escenario}`);
        this.bg.setAlpha(0.6);

        // Cargar preguntas
        this.loadQuestions();

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
        this.professor = this.add.sprite(100, 450, 'prof_idle_0');
        this.professor.setScale(2);

        this.professorIdleAnim = this.time.addEvent({
            delay: 400,
            callback: () => {
                if (this.professorState === 'idle') {
                    const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                    this.professor.setTexture(`prof_idle_${frame}`);
                }
            },
            loop: true
        });
        this.professorState = 'idle';

        // Bocadillo
        this.speechBubble = this.add.graphics();
        this.speechBubble.fillStyle(0xffffff, 0.95);
        this.speechBubble.fillRoundedRect(20, 520, 160, 60, 8);

        this.speechText = this.add.text(100, 550, '"Empecemos..."', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#0a0a15',
            align: 'center',
            wordWrap: { width: 140 }
        }).setOrigin(0.5);
    }

    setProfessorState(state, duration = 2000) {
        this.professorState = state;

        if (state === 'laugh') {
            this.professorAnim = this.time.addEvent({
                delay: 150,
                callback: () => {
                    const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                    this.professor.setTexture(`prof_laugh_${frame}`);
                },
                loop: true
            });
        } else if (state === 'angry') {
            this.professorAnim = this.time.addEvent({
                delay: 200,
                callback: () => {
                    const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                    this.professor.setTexture(`prof_angry_${frame}`);
                },
                loop: true
            });
        } else if (state === 'talk') {
            this.professorAnim = this.time.addEvent({
                delay: 150,
                callback: () => {
                    const frame = this.professor.texture.key.endsWith('0') ? 1 : 0;
                    this.professor.setTexture(`prof_talk_${frame}`);
                },
                loop: true
            });
        }

        this.time.delayedCall(duration, () => {
            if (this.professorAnim) this.professorAnim.destroy();
            this.professorState = 'idle';
            this.professor.setTexture('prof_idle_0');
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
            } else {
                this.showQuestion();
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

        const profState = this.victory ? 'defeat' : 'victory';
        this.professor = this.add.sprite(400, 150, `prof_${this.victory ? 'angry' : 'laugh'}_0`);
        this.professor.setScale(3.5);

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

        this.add.text(400, 280, title, {
            fontFamily: '"Press Start 2P"',
            fontSize: '28px',
            color: titleColor
        }).setOrigin(0.5);

        const subtitle = this.victory ?
            '¡Has derrotado al Profesor Álvaro!' :
            (this.reason === 'lives' ? 'Te has quedado sin vidas...' : 'No has superado el nivel...');

        this.add.text(400, 320, subtitle, {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(400, 370,
            `Nivel alcanzado: ${this.level}/4\n` +
            `Aciertos totales: ${this.totalCorrect}\n` +
            `Puntuación final: ${this.score}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#ffd700',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);

        const phraseType = this.victory ? 'victoriaFinal' : 'derrotaFinal';
        const phrase = GAME_DATA.frases[phraseType][Math.floor(Math.random() * GAME_DATA.frases[phraseType].length)];

        this.add.text(400, 440, `"${phrase}"`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: this.victory ? '#4ecca3' : '#e94560',
            align: 'center',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);

        // Guardar puntuación
        this.saveScore();

        // Botones
        this.createButton(200, 500, 'MENÚ', () => {
            audioManager.playClick();
            this.scene.start('MenuScene');
        });

        this.createButton(400, 500, 'RANKING', () => {
            audioManager.playClick();
            this.scene.start('LeaderboardScene');
        });

        this.createButton(600, 500, 'REINTENTAR', () => {
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
        this.add.text(400, 545, 'Introduce tu nombre para el ranking:', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#666666'
        }).setOrigin(0.5);

        // Input visual
        this.nameInput = '';
        this.nameContainer = this.add.container(400, 575);

        const inputBg = this.add.graphics();
        inputBg.fillStyle(0x1a1a2e, 1);
        inputBg.fillRoundedRect(-100, -15, 140, 30, 5);
        inputBg.lineStyle(2, 0x4ecca3);
        inputBg.strokeRoundedRect(-100, -15, 140, 30, 5);

        this.nameDisplay = this.add.text(-90, 0, '_', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#4ecca3'
        }).setOrigin(0, 0.5);

        // Botón guardar
        const saveBtn = this.add.container(80, 0);
        const saveBg = this.add.rectangle(0, 0, 60, 28, 0x4ecca3);
        const saveText = this.add.text(0, 0, 'OK', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#0a0a15'
        }).setOrigin(0.5);

        saveBtn.add([saveBg, saveText]);
        saveBtn.setSize(60, 28);
        saveBtn.setInteractive();
        saveBtn.on('pointerdown', () => this.saveName());

        this.nameContainer.add([inputBg, this.nameDisplay, saveBtn]);

        // Keyboard input
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

    saveName() {
        if (this.nameInput.length === 0) this.nameInput = 'ANÓNIMO';

        const scores = JSON.parse(localStorage.getItem('profesorAlvaroLeaderboard') || '[]');

        scores.push({
            name: this.nameInput,
            score: this.score,
            level: this.level,
            correct: this.totalCorrect,
            date: new Date().toISOString(),
            victory: this.victory
        });

        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem('profesorAlvaroLeaderboard', JSON.stringify(scores.slice(0, 50)));

        // Feedback visual
        if (this.nameContainer) {
            this.nameContainer.destroy();
            this.add.text(400, 575, '¡Puntuación guardada!', {
                fontFamily: '"Press Start 2P"',
                fontSize: '8px',
                color: '#4ecca3'
            }).setOrigin(0.5);
        }
    }

    saveScore() {
        // Auto-save sin nombre por si no lo introducen
        const scores = JSON.parse(localStorage.getItem('profesorAlvaroLeaderboard') || '[]');
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

    create() {
        this.add.rectangle(400, 300, 800, 600, 0x0a0a15);

        // Título
        this.add.text(400, 40, '🏆 RANKING 🏆', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            color: '#ffd700'
        }).setOrigin(0.5);

        // Cargar puntuaciones
        const scores = JSON.parse(localStorage.getItem('profesorAlvaroLeaderboard') || '[]');

        if (scores.length === 0) {
            this.add.text(400, 300, 'No hay puntuaciones todavía.\n¡Sé el primero en jugar!', {
                fontFamily: '"Press Start 2P"',
                fontSize: '10px',
                color: '#666666',
                align: 'center'
            }).setOrigin(0.5);
        } else {
            // Cabecera
            this.add.text(60, 90, '#', { fontFamily: '"Press Start 2P"', fontSize: '10px', color: '#4ecca3' });
            this.add.text(100, 90, 'NOMBRE', { fontFamily: '"Press Start 2P"', fontSize: '10px', color: '#4ecca3' });
            this.add.text(350, 90, 'PUNTOS', { fontFamily: '"Press Start 2P"', fontSize: '10px', color: '#4ecca3' });
            this.add.text(500, 90, 'NIVEL', { fontFamily: '"Press Start 2P"', fontSize: '10px', color: '#4ecca3' });
            this.add.text(620, 90, 'ACIERTOS', { fontFamily: '"Press Start 2P"', fontSize: '10px', color: '#4ecca3' });

            // Línea separadora
            this.add.rectangle(400, 110, 720, 2, 0x4ecca3);

            // Mostrar top 15
            const displayScores = scores.slice(0, 15);
            displayScores.forEach((entry, index) => {
                const y = 130 + index * 28;

                // Medallas para top 3
                let rankText = `${index + 1}`;
                let rankColor = '#ffffff';
                if (index === 0) { rankText = '🥇'; rankColor = '#ffd700'; }
                else if (index === 1) { rankText = '🥈'; rankColor = '#c0c0c0'; }
                else if (index === 2) { rankText = '🥉'; rankColor = '#cd7f32'; }

                this.add.text(60, y, rankText, {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '10px',
                    color: rankColor
                });

                this.add.text(100, y, entry.name.substring(0, 10), {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '10px',
                    color: entry.victory ? '#4ecca3' : '#ffffff'
                });

                this.add.text(350, y, `${entry.score}`, {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '10px',
                    color: '#ffd700'
                });

                this.add.text(500, y, `${entry.level}/4`, {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '10px',
                    color: '#ffffff'
                });

                this.add.text(620, y, `${entry.correct}`, {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '10px',
                    color: '#ffffff'
                });
            });
        }

        // Botón volver
        this.createButton(400, 560, 'VOLVER AL MENÚ', () => {
            audioManager.playClick();
            this.scene.start('MenuScene');
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
}
