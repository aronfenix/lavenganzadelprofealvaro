// ============================================================
// SISTEMA DE LOGROS Y ESTADISTICAS
// ============================================================

class AchievementSystem {
    constructor() {
        this.storageKey = 'profesorAlvaroAchievements';
        this.statsKey = 'profesorAlvaroStats';
        this.achievements = this.defineAchievements();
        this.load();
    }

    defineAchievements() {
        return {
            // Progreso
            'first_blood': {
                id: 'first_blood',
                name: 'Primera Sangre',
                description: 'Completa tu primera pregunta correcta',
                icon: 'star',
                color: '#4ecca3',
                condition: (stats) => stats.totalCorrect >= 1,
                points: 10
            },
            'level_1_complete': {
                id: 'level_1_complete',
                name: 'Geografo Europeo',
                description: 'Supera el Nivel 1: Capitales de Europa',
                icon: 'trophy',
                color: '#4ecca3',
                condition: (stats) => stats.levelsCompleted >= 1,
                points: 50
            },
            'level_2_complete': {
                id: 'level_2_complete',
                name: 'Demógrafo',
                description: 'Supera el Nivel 2: Países más poblados',
                icon: 'trophy',
                color: '#e94560',
                condition: (stats) => stats.levelsCompleted >= 2,
                points: 75
            },
            'level_3_complete': {
                id: 'level_3_complete',
                name: 'Urbanista',
                description: 'Supera el Nivel 3: Ciudades más pobladas',
                icon: 'trophy',
                color: '#ffd700',
                condition: (stats) => stats.levelsCompleted >= 3,
                points: 100
            },
            'game_complete': {
                id: 'game_complete',
                name: 'Maestro del Conocimiento',
                description: 'Derrota al Profesor Álvaro completando todos los niveles',
                icon: 'crown',
                color: '#ffd700',
                condition: (stats) => stats.victories >= 1,
                points: 200
            },

            // Combos
            'combo_3': {
                id: 'combo_3',
                name: 'En Racha',
                description: 'Consigue un combo de 3',
                icon: 'fire',
                color: '#ff6b6b',
                condition: (stats) => stats.maxCombo >= 3,
                points: 25
            },
            'combo_5': {
                id: 'combo_5',
                name: 'Imparable',
                description: 'Consigue un combo de 5',
                icon: 'fire',
                color: '#ff6b6b',
                condition: (stats) => stats.maxCombo >= 5,
                points: 50
            },
            'combo_10': {
                id: 'combo_10',
                name: 'Leyenda',
                description: 'Consigue un combo de 10',
                icon: 'fire',
                color: '#ffd700',
                condition: (stats) => stats.maxCombo >= 10,
                points: 150
            },

            // Precision
            'perfect_level': {
                id: 'perfect_level',
                name: 'Perfeccionista',
                description: 'Completa un nivel con 10/10 aciertos',
                icon: 'star',
                color: '#ffd700',
                condition: (stats) => stats.perfectLevels >= 1,
                points: 100
            },
            'no_damage': {
                id: 'no_damage',
                name: 'Intocable',
                description: 'Completa un nivel sin perder vidas',
                icon: 'shield',
                color: '#4ecca3',
                condition: (stats) => stats.noDamageLevels >= 1,
                points: 75
            },

            // Persistencia
            'play_10_games': {
                id: 'play_10_games',
                name: 'Estudiante Dedicado',
                description: 'Juega 10 partidas',
                icon: 'book',
                color: '#4ecca3',
                condition: (stats) => stats.gamesPlayed >= 10,
                points: 30
            },
            'play_50_games': {
                id: 'play_50_games',
                name: 'Adicto al Conocimiento',
                description: 'Juega 50 partidas',
                icon: 'book',
                color: '#e94560',
                condition: (stats) => stats.gamesPlayed >= 50,
                points: 100
            },
            'answer_100': {
                id: 'answer_100',
                name: 'Centurion',
                description: 'Responde 100 preguntas correctamente',
                icon: 'check',
                color: '#4ecca3',
                condition: (stats) => stats.totalCorrect >= 100,
                points: 50
            },
            'answer_500': {
                id: 'answer_500',
                name: 'Enciclopedia Andante',
                description: 'Responde 500 preguntas correctamente',
                icon: 'check',
                color: '#ffd700',
                condition: (stats) => stats.totalCorrect >= 500,
                points: 150
            },

            // Especiales
            'speedster': {
                id: 'speedster',
                name: 'Velocista',
                description: 'Responde 5 preguntas en menos de 5 segundos cada una',
                icon: 'lightning',
                color: '#00ffff',
                condition: (stats) => stats.fastAnswers >= 5,
                points: 75
            },
            'comeback': {
                id: 'comeback',
                name: 'Resurreccion',
                description: 'Gana un nivel con solo 1 vida',
                icon: 'heart',
                color: '#e94560',
                condition: (stats) => stats.comebacks >= 1,
                points: 100
            },
            'minigame_master': {
                id: 'minigame_master',
                name: 'Rey de los Minijuegos',
                description: 'Completa 10 minijuegos perfectamente',
                icon: 'gamepad',
                color: '#ff69b4',
                condition: (stats) => stats.perfectMinigames >= 10,
                points: 100
            },

            // Conocimiento especifico
            'europe_expert': {
                id: 'europe_expert',
                name: 'Experto en Europa',
                description: 'Acierta 50 preguntas de capitales europeas',
                icon: 'globe',
                color: '#4ecca3',
                condition: (stats) => stats.europeCorrect >= 50,
                points: 75
            },
            'population_expert': {
                id: 'population_expert',
                name: 'Experto en Poblacion',
                description: 'Acierta 50 preguntas de paises y ciudades pobladas',
                icon: 'users',
                color: '#e94560',
                condition: (stats) => stats.populationCorrect >= 50,
                points: 75
            },

            // Secretos
            'night_owl': {
                id: 'night_owl',
                name: 'Buho Nocturno',
                description: 'Juega entre las 00:00 y las 05:00',
                icon: 'moon',
                color: '#8b00ff',
                condition: (stats) => stats.nightOwl,
                points: 25,
                secret: true
            },
            'persistent': {
                id: 'persistent',
                name: 'Nunca Me Rindo',
                description: 'Pierde 10 veces y sigue jugando',
                icon: 'retry',
                color: '#ff6b6b',
                condition: (stats) => stats.losses >= 10 && stats.gamesPlayed > stats.losses,
                points: 50,
                secret: true
            }
        };
    }

    load() {
        try {
            this.unlockedAchievements = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            this.stats = JSON.parse(localStorage.getItem(this.statsKey) || '{}');
        } catch {
            this.unlockedAchievements = [];
            this.stats = {};
        }

        // Inicializar estadisticas por defecto
        this.stats = {
            totalCorrect: 0,
            totalWrong: 0,
            gamesPlayed: 0,
            victories: 0,
            losses: 0,
            levelsCompleted: 0,
            maxCombo: 0,
            perfectLevels: 0,
            noDamageLevels: 0,
            fastAnswers: 0,
            comebacks: 0,
            perfectMinigames: 0,
            europeCorrect: 0,
            populationCorrect: 0,
            totalPlayTime: 0,
            nightOwl: false,
            highScore: 0,
            ...this.stats
        };
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.unlockedAchievements));
        localStorage.setItem(this.statsKey, JSON.stringify(this.stats));
    }

    // Actualizar estadisticas
    updateStats(updates) {
        Object.entries(updates).forEach(([key, value]) => {
            if (typeof value === 'number' && typeof this.stats[key] === 'number') {
                this.stats[key] += value;
            } else if (key === 'maxCombo') {
                this.stats[key] = Math.max(this.stats[key] || 0, value);
            } else if (key === 'highScore') {
                this.stats[key] = Math.max(this.stats[key] || 0, value);
            } else {
                this.stats[key] = value;
            }
        });

        // Verificar hora para buho nocturno
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 5) {
            this.stats.nightOwl = true;
        }

        this.save();
        return this.checkAchievements();
    }

    // Verificar y desbloquear logros
    checkAchievements() {
        const newlyUnlocked = [];

        Object.values(this.achievements).forEach(achievement => {
            if (!this.unlockedAchievements.includes(achievement.id)) {
                if (achievement.condition(this.stats)) {
                    this.unlockedAchievements.push(achievement.id);
                    newlyUnlocked.push(achievement);
                }
            }
        });

        if (newlyUnlocked.length > 0) {
            this.save();
        }

        return newlyUnlocked;
    }

    // Obtener logros desbloqueados
    getUnlocked() {
        return this.unlockedAchievements.map(id => this.achievements[id]).filter(Boolean);
    }

    // Obtener todos los logros (para mostrar en UI)
    getAll() {
        return Object.values(this.achievements).map(a => ({
            ...a,
            unlocked: this.unlockedAchievements.includes(a.id)
        }));
    }

    // Calcular puntos totales
    getTotalPoints() {
        return this.getUnlocked().reduce((sum, a) => sum + a.points, 0);
    }

    // Obtener progreso
    getProgress() {
        const total = Object.keys(this.achievements).length;
        const unlocked = this.unlockedAchievements.length;
        return { unlocked, total, percentage: Math.floor((unlocked / total) * 100) };
    }

    // Obtener estadisticas formateadas
    getFormattedStats() {
        return {
            'Partidas jugadas': this.stats.gamesPlayed,
            'Victorias': this.stats.victories,
            'Derrotas': this.stats.losses,
            'Respuestas correctas': this.stats.totalCorrect,
            'Combo máximo': this.stats.maxCombo,
            'Niveles perfectos': this.stats.perfectLevels,
            'Mejor puntuación': this.stats.highScore
        };
    }
}

// ==================== STUDY MODE ====================
class StudyMode {
    constructor() {
        this.currentTopic = null;
        this.flashcards = [];
        this.currentIndex = 0;
        this.knownCards = [];
        this.unknownCards = [];
    }

    // Generar flashcards por tema
    generateFlashcards(topic) {
        this.currentTopic = topic;
        this.flashcards = [];
        this.currentIndex = 0;
        this.knownCards = [];
        this.unknownCards = [];

        switch(topic) {
            case 'capitals':
                this.flashcards = GAME_DATA.capitalesEuropa.map(q => ({
                    front: q.pregunta.replace('Cual es la capital de ', '').replace('?', ''),
                    back: q.respuesta,
                    fact: q.dato,
                    type: 'capital'
                }));
                break;

            case 'countries':
                this.flashcards = GAME_DATA.top20Paises.map(p => ({
                    front: `${p.nombre} - Poblacion`,
                    back: p.poblacion,
                    extra: `Continente: ${p.continente}`,
                    fact: p.dato,
                    type: 'country'
                }));
                break;

            case 'cities':
                this.flashcards = GAME_DATA.top20Ciudades.map(c => ({
                    front: `${c.nombre} - Poblacion`,
                    back: c.poblacion,
                    extra: `Pais: ${c.pais} | Continente: ${c.continente}`,
                    fact: c.dato,
                    type: 'city'
                }));
                break;

            case 'locations':
                // Mezcla de ubicaciones
                const countryLocs = GAME_DATA.top20Paises.map(p => ({
                    front: `Donde esta ${p.nombre}?`,
                    back: p.continente,
                    fact: p.dato,
                    type: 'location'
                }));
                const cityLocs = GAME_DATA.top20Ciudades.map(c => ({
                    front: `En que pais esta ${c.nombre}?`,
                    back: c.pais,
                    fact: c.dato,
                    type: 'location'
                }));
                this.flashcards = [...countryLocs, ...cityLocs];
                break;
        }

        // Mezclar
        this.flashcards = Phaser.Utils.Array.Shuffle(this.flashcards);
        return this.flashcards;
    }

    getCurrentCard() {
        return this.flashcards[this.currentIndex] || null;
    }

    markKnown() {
        if (this.currentIndex < this.flashcards.length) {
            this.knownCards.push(this.flashcards[this.currentIndex]);
            this.currentIndex++;
        }
        return this.getCurrentCard();
    }

    markUnknown() {
        if (this.currentIndex < this.flashcards.length) {
            this.unknownCards.push(this.flashcards[this.currentIndex]);
            this.currentIndex++;
        }
        return this.getCurrentCard();
    }

    getProgress() {
        return {
            current: this.currentIndex,
            total: this.flashcards.length,
            known: this.knownCards.length,
            unknown: this.unknownCards.length
        };
    }

    // Repetir solo las que no sabias
    repeatUnknown() {
        if (this.unknownCards.length > 0) {
            this.flashcards = Phaser.Utils.Array.Shuffle([...this.unknownCards]);
            this.currentIndex = 0;
            this.unknownCards = [];
            return true;
        }
        return false;
    }

    isComplete() {
        return this.currentIndex >= this.flashcards.length;
    }
}

// Instancias globales
const achievementSystem = new AchievementSystem();
const studyMode = new StudyMode();

window.achievementSystem = achievementSystem;
window.studyMode = studyMode;
