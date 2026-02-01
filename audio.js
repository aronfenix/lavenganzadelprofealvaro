// ============================================================
// SISTEMA DE AUDIO 8-BIT
// Música y efectos de sonido generados proceduralmente
// ============================================================

class AudioManager {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.isPlaying = false;
        this.currentTrack = null;
        this.oscillators = [];
        this.volume = 0.5;
        this.musicVolume = 0.4;
        this.sfxVolume = 0.6;
    }

    init() {
        if (this.context) return;

        this.context = new (window.AudioContext || window.webkitAudioContext)();

        // Master gain
        this.masterGain = this.context.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(this.context.destination);

        // Separate gains for music and SFX
        this.musicGain = this.context.createGain();
        this.musicGain.gain.value = this.musicVolume;
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.context.createGain();
        this.sfxGain.gain.value = this.sfxVolume;
        this.sfxGain.connect(this.masterGain);
    }

    resume() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    // ==================== EFECTOS DE SONIDO ====================

    playNote(frequency, duration, type = 'square', gain = this.sfxGain, delay = 0, volume = 0.3) {
        if (!this.context) this.init();

        const osc = this.context.createOscillator();
        const gainNode = this.context.createGain();

        osc.type = type;
        osc.frequency.value = frequency;

        const startTime = this.context.currentTime + delay;
        gainNode.gain.setValueAtTime(volume, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        osc.connect(gainNode);
        gainNode.connect(gain);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.1);

        return osc;
    }

    // Sonido de respuesta correcta
    playCorrect() {
        if (!this.context) this.init();
        this.playNote(523, 0.1, 'square', this.sfxGain, 0, 0.3);
        this.playNote(659, 0.1, 'square', this.sfxGain, 0.1, 0.3);
        this.playNote(784, 0.15, 'square', this.sfxGain, 0.2, 0.4);
        this.playNote(1047, 0.2, 'square', this.sfxGain, 0.35, 0.3);
    }

    // Sonido de respuesta incorrecta
    playWrong() {
        if (!this.context) this.init();
        this.playNote(200, 0.15, 'sawtooth', this.sfxGain, 0, 0.4);
        this.playNote(180, 0.15, 'sawtooth', this.sfxGain, 0.1, 0.4);
        this.playNote(150, 0.3, 'sawtooth', this.sfxGain, 0.2, 0.5);
    }

    // Sonido de combo
    playCombo(level) {
        if (!this.context) this.init();
        const baseFreq = 400 + level * 50;
        for (let i = 0; i < 4; i++) {
            this.playNote(baseFreq + i * 100, 0.08, 'square', this.sfxGain, i * 0.05, 0.25);
        }
    }

    // Sonido de power-up obtenido
    playPowerup() {
        if (!this.context) this.init();
        const notes = [523, 659, 784, 1047, 1319];
        notes.forEach((note, i) => {
            this.playNote(note, 0.1, 'square', this.sfxGain, i * 0.08, 0.3);
        });
    }

    // Sonido de usar power-up
    playUsePowerup() {
        if (!this.context) this.init();
        for (let i = 0; i < 8; i++) {
            this.playNote(800 + i * 100, 0.05, 'sine', this.sfxGain, i * 0.03, 0.2);
        }
    }

    // Sonido de perder vida
    playLoseLife() {
        if (!this.context) this.init();
        this.playNote(400, 0.1, 'square', this.sfxGain, 0, 0.4);
        this.playNote(300, 0.1, 'square', this.sfxGain, 0.1, 0.4);
        this.playNote(200, 0.2, 'square', this.sfxGain, 0.2, 0.5);
        this.playNote(150, 0.3, 'sawtooth', this.sfxGain, 0.4, 0.3);
    }

    // Sonido de victoria de nivel
    playLevelVictory() {
        if (!this.context) this.init();
        const melody = [523, 587, 659, 698, 784, 880, 988, 1047];
        melody.forEach((note, i) => {
            this.playNote(note, 0.12, 'square', this.sfxGain, i * 0.1, 0.3);
            this.playNote(note / 2, 0.12, 'triangle', this.sfxGain, i * 0.1, 0.2);
        });
    }

    // Sonido de derrota de nivel
    playLevelDefeat() {
        if (!this.context) this.init();
        const melody = [400, 380, 350, 320, 280, 240, 200, 150];
        melody.forEach((note, i) => {
            this.playNote(note, 0.15, 'sawtooth', this.sfxGain, i * 0.12, 0.3);
        });
    }

    // Sonido de victoria final
    playVictory() {
        if (!this.context) this.init();
        const fanfare = [
            { note: 523, dur: 0.15 }, { note: 523, dur: 0.15 }, { note: 523, dur: 0.15 },
            { note: 523, dur: 0.3 }, { note: 415, dur: 0.3 }, { note: 466, dur: 0.3 },
            { note: 523, dur: 0.15 }, { note: 466, dur: 0.1 }, { note: 523, dur: 0.5 }
        ];

        let time = 0;
        fanfare.forEach(({ note, dur }) => {
            this.playNote(note, dur * 0.9, 'square', this.sfxGain, time, 0.35);
            this.playNote(note / 2, dur * 0.9, 'triangle', this.sfxGain, time, 0.25);
            time += dur;
        });
    }

    // Sonido de derrota final
    playDefeat() {
        if (!this.context) this.init();
        const doom = [300, 280, 260, 240, 220, 200, 180, 160, 140, 120, 100];
        doom.forEach((note, i) => {
            this.playNote(note, 0.2, 'sawtooth', this.sfxGain, i * 0.15, 0.25 + i * 0.02);
        });
    }

    // Risa malvada del profesor
    playLaugh() {
        if (!this.context) this.init();
        for (let i = 0; i < 6; i++) {
            const freq = 150 + (i % 2) * 50;
            this.playNote(freq, 0.12, 'square', this.sfxGain, i * 0.15, 0.3);
        }
    }

    // Sonido de click/selección
    playClick() {
        if (!this.context) this.init();
        this.playNote(800, 0.05, 'square', this.sfxGain, 0, 0.2);
    }

    // Sonido de hover
    playHover() {
        if (!this.context) this.init();
        this.playNote(600, 0.03, 'sine', this.sfxGain, 0, 0.1);
    }

    // Sonido de tiempo agotándose
    playTick() {
        if (!this.context) this.init();
        this.playNote(1000, 0.05, 'square', this.sfxGain, 0, 0.15);
    }

    // Sonido de tiempo agotado
    playTimeUp() {
        if (!this.context) this.init();
        for (let i = 0; i < 3; i++) {
            this.playNote(600, 0.1, 'square', this.sfxGain, i * 0.15, 0.3);
        }
        this.playNote(200, 0.4, 'sawtooth', this.sfxGain, 0.45, 0.4);
    }

    // Sonido de diálogo
    playDialogueBeep() {
        if (!this.context) this.init();
        const freq = 200 + Math.random() * 100;
        this.playNote(freq, 0.03, 'square', this.sfxGain, 0, 0.1);
    }

    // ==================== MÚSICA ====================

    stopMusic() {
        this.isPlaying = false;
        this.oscillators.forEach(osc => {
            try { osc.stop(); } catch (e) {}
        });
        this.oscillators = [];
        this.currentTrack = null;
    }

    // Música del menú - misteriosa y tensa
    playMenuMusic() {
        if (this.isPlaying && this.currentTrack === 'menu') return;
        this.stopMusic();
        if (!this.context) this.init();

        this.isPlaying = true;
        this.currentTrack = 'menu';

        const melody = [
            { note: 220, dur: 0.4 }, { note: 262, dur: 0.4 },
            { note: 247, dur: 0.4 }, { note: 220, dur: 0.4 },
            { note: 196, dur: 0.4 }, { note: 220, dur: 0.4 },
            { note: 262, dur: 0.8 }, { note: 247, dur: 0.8 }
        ];

        const bass = [220, 165, 196, 165];

        let melodyIndex = 0;
        let bassIndex = 0;
        let melodyTime = 0;

        const playLoop = () => {
            if (!this.isPlaying || this.currentTrack !== 'menu') return;

            // Melodía principal
            const m = melody[melodyIndex];
            this.playNote(m.note, m.dur * 0.8, 'triangle', this.musicGain, 0, 0.2);

            melodyIndex = (melodyIndex + 1) % melody.length;
            melodyTime += m.dur * 1000;

            setTimeout(playLoop, m.dur * 1000);
        };

        const playBass = () => {
            if (!this.isPlaying || this.currentTrack !== 'menu') return;

            this.playNote(bass[bassIndex], 0.3, 'triangle', this.musicGain, 0, 0.15);
            bassIndex = (bassIndex + 1) % bass.length;

            setTimeout(playBass, 400);
        };

        playLoop();
        playBass();
    }

    // Música del nivel 1 - Tensa pero accesible
    playLevel1Music() {
        if (this.isPlaying && this.currentTrack === 'level1') return;
        this.stopMusic();
        if (!this.context) this.init();

        this.isPlaying = true;
        this.currentTrack = 'level1';

        const melody = [
            330, 330, 392, 330, 294, 330, 392, 440,
            392, 330, 294, 262, 294, 330, 294, 262
        ];
        const bass = [165, 196, 220, 196];

        let melodyIndex = 0;
        let bassIndex = 0;

        const playMelody = () => {
            if (!this.isPlaying || this.currentTrack !== 'level1') return;

            this.playNote(melody[melodyIndex], 0.18, 'square', this.musicGain, 0, 0.15);
            melodyIndex = (melodyIndex + 1) % melody.length;

            setTimeout(playMelody, 200);
        };

        const playBass = () => {
            if (!this.isPlaying || this.currentTrack !== 'level1') return;

            this.playNote(bass[bassIndex], 0.35, 'triangle', this.musicGain, 0, 0.12);
            bassIndex = (bassIndex + 1) % bass.length;

            setTimeout(playBass, 400);
        };

        playMelody();
        playBass();
    }

    // Música del nivel 2 - Más intensa
    playLevel2Music() {
        if (this.isPlaying && this.currentTrack === 'level2') return;
        this.stopMusic();
        if (!this.context) this.init();

        this.isPlaying = true;
        this.currentTrack = 'level2';

        const melody = [
            392, 440, 494, 440, 392, 349, 330, 294,
            330, 349, 392, 440, 494, 523, 494, 440
        ];
        const bass = [196, 220, 247, 220];

        let melodyIndex = 0;
        let bassIndex = 0;

        const playMelody = () => {
            if (!this.isPlaying || this.currentTrack !== 'level2') return;

            this.playNote(melody[melodyIndex], 0.15, 'square', this.musicGain, 0, 0.15);
            melodyIndex = (melodyIndex + 1) % melody.length;

            setTimeout(playMelody, 175);
        };

        const playBass = () => {
            if (!this.isPlaying || this.currentTrack !== 'level2') return;

            this.playNote(bass[bassIndex], 0.3, 'sawtooth', this.musicGain, 0, 0.1);
            bassIndex = (bassIndex + 1) % bass.length;

            setTimeout(playBass, 350);
        };

        playMelody();
        playBass();
    }

    // Música del nivel 3 - Científica/tecnológica
    playLevel3Music() {
        if (this.isPlaying && this.currentTrack === 'level3') return;
        this.stopMusic();
        if (!this.context) this.init();

        this.isPlaying = true;
        this.currentTrack = 'level3';

        const arpeggio = [262, 330, 392, 523, 392, 330, 262, 196];
        const bass = [131, 165, 196, 165];

        let arpIndex = 0;
        let bassIndex = 0;

        const playArp = () => {
            if (!this.isPlaying || this.currentTrack !== 'level3') return;

            this.playNote(arpeggio[arpIndex], 0.1, 'square', this.musicGain, 0, 0.12);
            arpIndex = (arpIndex + 1) % arpeggio.length;

            setTimeout(playArp, 125);
        };

        const playBass = () => {
            if (!this.isPlaying || this.currentTrack !== 'level3') return;

            this.playNote(bass[bassIndex], 0.4, 'triangle', this.musicGain, 0, 0.15);
            bassIndex = (bassIndex + 1) % bass.length;

            setTimeout(playBass, 500);
        };

        playArp();
        playBass();
    }

    // Música del boss/nivel final - Épica
    playBossMusic() {
        if (this.isPlaying && this.currentTrack === 'boss') return;
        this.stopMusic();
        if (!this.context) this.init();

        this.isPlaying = true;
        this.currentTrack = 'boss';

        const melody = [
            440, 440, 523, 440, 392, 440, 523, 587,
            659, 587, 523, 440, 523, 587, 659, 698
        ];
        const bass = [110, 131, 147, 165, 147, 131];
        const drums = [1, 0, 1, 0, 1, 1, 1, 0];

        let melodyIndex = 0;
        let bassIndex = 0;
        let drumIndex = 0;

        const playMelody = () => {
            if (!this.isPlaying || this.currentTrack !== 'boss') return;

            this.playNote(melody[melodyIndex], 0.12, 'square', this.musicGain, 0, 0.18);
            this.playNote(melody[melodyIndex] * 2, 0.12, 'square', this.musicGain, 0, 0.08);
            melodyIndex = (melodyIndex + 1) % melody.length;

            setTimeout(playMelody, 150);
        };

        const playBass = () => {
            if (!this.isPlaying || this.currentTrack !== 'boss') return;

            this.playNote(bass[bassIndex], 0.25, 'sawtooth', this.musicGain, 0, 0.12);
            bassIndex = (bassIndex + 1) % bass.length;

            setTimeout(playBass, 300);
        };

        const playDrums = () => {
            if (!this.isPlaying || this.currentTrack !== 'boss') return;

            if (drums[drumIndex]) {
                // Kick drum simulation
                this.playNote(60, 0.1, 'sine', this.musicGain, 0, 0.2);
            }
            // Hi-hat
            this.playNote(8000, 0.02, 'square', this.musicGain, 0, 0.05);

            drumIndex = (drumIndex + 1) % drums.length;
            setTimeout(playDrums, 150);
        };

        playMelody();
        playBass();
        playDrums();
    }

    // Música de victoria
    playVictoryMusic() {
        if (this.isPlaying && this.currentTrack === 'victory') return;
        this.stopMusic();
        if (!this.context) this.init();

        this.isPlaying = true;
        this.currentTrack = 'victory';

        const melody = [
            523, 587, 659, 784, 659, 784, 880, 784,
            880, 988, 880, 784, 659, 784, 659, 523
        ];

        let index = 0;

        const play = () => {
            if (!this.isPlaying || this.currentTrack !== 'victory') return;

            this.playNote(melody[index], 0.2, 'square', this.musicGain, 0, 0.2);
            this.playNote(melody[index] / 2, 0.2, 'triangle', this.musicGain, 0, 0.15);
            index = (index + 1) % melody.length;

            setTimeout(play, 250);
        };

        play();
    }

    // Música de derrota
    playDefeatMusic() {
        if (this.isPlaying && this.currentTrack === 'defeat') return;
        this.stopMusic();
        if (!this.context) this.init();

        this.isPlaying = true;
        this.currentTrack = 'defeat';

        const melody = [220, 196, 175, 165, 147, 131, 117, 110];
        let index = 0;

        const play = () => {
            if (!this.isPlaying || this.currentTrack !== 'defeat') return;

            this.playNote(melody[index % melody.length], 0.4, 'sawtooth', this.musicGain, 0, 0.15);
            index++;

            if (index < melody.length * 2) {
                setTimeout(play, 500);
            }
        };

        play();
    }

    // ==================== CONTROL DE VOLUMEN ====================

    setMasterVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        if (this.masterGain) {
            this.masterGain.gain.value = this.volume;
        }
    }

    setMusicVolume(vol) {
        this.musicVolume = Math.max(0, Math.min(1, vol));
        if (this.musicGain) {
            this.musicGain.gain.value = this.musicVolume;
        }
    }

    setSfxVolume(vol) {
        this.sfxVolume = Math.max(0, Math.min(1, vol));
        if (this.sfxGain) {
            this.sfxGain.gain.value = this.sfxVolume;
        }
    }

    toggleMute() {
        if (this.masterGain) {
            if (this.masterGain.gain.value > 0) {
                this.masterGain.gain.value = 0;
            } else {
                this.masterGain.gain.value = this.volume;
            }
        }
    }
}

// Instancia global
window.audioManager = new AudioManager();
