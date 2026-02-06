// ============================================================
// FIREBASE CONFIGURATION - Leaderboard compartido
// ============================================================

// Configuración de Firebase (el usuario debe crear su proyecto en Firebase Console)
const firebaseConfig = {
    // INSTRUCCIONES PARA CONFIGURAR:
    // 1. Ve a https://console.firebase.google.com/
    // 2. Crea un nuevo proyecto (gratis)
    // 3. Ve a "Realtime Database" y crea una base de datos
    // 4. En las reglas, pon: { "rules": { ".read": true, ".write": true } }
    // 5. Copia tu configuración aquí abajo:

    apiKey: "AIzaSyAFbl1QfAwsGeQCvto4WAmbThtCtEQ4NhM",
    authDomain: "la-venganza-del-profe-alvaro.firebaseapp.com",
    databaseURL: "https://la-venganza-del-profe-alvaro-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "la-venganza-del-profe-alvaro",
    storageBucket: "la-venganza-del-profe-alvaro.firebasestorage.app",
    messagingSenderId: "999306931083",
    appId: "1:999306931083:web:8a0e51b81e3bd59f881d8e"
};

// ==================== LEADERBOARD MANAGER ====================
class LeaderboardManager {
    constructor() {
        this.isFirebaseEnabled = false;
        this.db = null;
        this.localStorageKey = 'profesorAlvaroLeaderboard';

        this.initFirebase();
    }

    initFirebase() {
        // Verificar si Firebase está configurado correctamente
        if (firebaseConfig.apiKey === "TU_API_KEY") {
            console.log('Firebase no configurado. Usando localStorage.');
            this.isFirebaseEnabled = false;
            return;
        }

        try {
            // Verificar si Firebase SDK está cargado
            if (typeof firebase !== 'undefined') {
                firebase.initializeApp(firebaseConfig);
                this.db = firebase.database();
                this.isFirebaseEnabled = true;
                console.log('Firebase inicializado correctamente.');
            } else {
                console.log('Firebase SDK no cargado. Usando localStorage.');
                this.isFirebaseEnabled = false;
            }
        } catch (error) {
            console.log('Error al inicializar Firebase:', error);
            this.isFirebaseEnabled = false;
        }
    }

    // Guardar puntuación
    async saveScore(entry) {
        // Siempre guardar en localStorage como backup
        this.saveToLocalStorage(entry);

        // Si Firebase está habilitado, también guardar ahí
        if (this.isFirebaseEnabled && this.db) {
            try {
                const newScoreRef = this.db.ref('leaderboard').push();
                await newScoreRef.set({
                    ...entry,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
                console.log('Puntuación guardada en Firebase');
            } catch (error) {
                console.log('Error al guardar en Firebase:', error);
            }
        }
    }

    // Obtener puntuaciones
    async getScores(limit = 50) {
        // Si Firebase está habilitado, obtener de ahí
        if (this.isFirebaseEnabled && this.db) {
            try {
                const snapshot = await this.db.ref('leaderboard')
                    .orderByChild('score')
                    .limitToLast(limit)
                    .once('value');

                const scores = [];
                snapshot.forEach(child => {
                    scores.push(child.val());
                });

                // Ordenar de mayor a menor
                scores.sort((a, b) => b.score - a.score);

                // Sincronizar con localStorage
                localStorage.setItem(this.localStorageKey, JSON.stringify(scores));

                return scores;
            } catch (error) {
                console.log('Error al obtener de Firebase, usando localStorage:', error);
                return this.getFromLocalStorage();
            }
        }

        return this.getFromLocalStorage();
    }

    // localStorage helpers
    saveToLocalStorage(entry) {
        const scores = this.getFromLocalStorage();
        scores.push(entry);
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem(this.localStorageKey, JSON.stringify(scores.slice(0, 50)));
    }

    getFromLocalStorage() {
        try {
            return JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
        } catch {
            return [];
        }
    }

    // Limpiar leaderboard local (para testing)
    clearLocal() {
        localStorage.removeItem(this.localStorageKey);
    }
}

// Instancia global
const leaderboardManager = new LeaderboardManager();
window.leaderboardManager = leaderboardManager;
