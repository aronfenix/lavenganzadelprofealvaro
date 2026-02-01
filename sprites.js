// ============================================================
// GENERADOR DE SPRITES PIXEL ART
// Crea todos los gráficos del juego proceduralmente
// ============================================================

const SpriteGenerator = {
    // Colores del profesor Álvaro
    colors: {
        skin: '#e8b89d',
        skinLight: '#f5d0b9',
        skinDark: '#d4a088',
        hair: '#3d2914',
        hairDark: '#2d1f0f',
        coat: '#1a1a2e',
        coatAccent: '#e94560',
        white: '#ffffff',
        black: '#0f0f23',
        red: '#8b0000',
        gold: '#ffd700'
    },

    // Crear sprite del profesor con diferentes estados
    createProfessor(state = 'idle', frame = 0) {
        const canvas = document.createElement('canvas');
        canvas.width = 96;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const c = this.colors;

        // Posiciones base
        let eyeOffsetX = 0;
        let eyeOffsetY = 0;
        let mouthOpen = false;
        let mouthBig = false;
        let eyesClosed = false;
        let eyebrowsAngry = false;
        let armLeftAngle = 0;
        let armRightAngle = 0;
        let bodyOffsetY = 0;

        // Configurar según estado
        switch(state) {
            case 'idle':
                eyeOffsetX = frame % 2 === 0 ? 0 : 1;
                break;
            case 'talk':
                mouthOpen = frame % 2 === 0;
                eyeOffsetX = Math.sin(frame * 0.5) * 2;
                break;
            case 'laugh':
                mouthOpen = true;
                mouthBig = true;
                eyesClosed = true;
                bodyOffsetY = frame % 2 === 0 ? -2 : 2;
                armLeftAngle = frame % 2 === 0 ? -10 : 10;
                armRightAngle = frame % 2 === 0 ? 10 : -10;
                break;
            case 'angry':
                eyebrowsAngry = true;
                mouthOpen = frame % 2 === 0;
                bodyOffsetY = frame % 2 === 0 ? -1 : 1;
                break;
            case 'shock':
                mouthOpen = true;
                mouthBig = true;
                eyeOffsetY = -2;
                break;
            case 'point':
                armRightAngle = -45;
                eyeOffsetX = 3;
                break;
            case 'victory':
                mouthOpen = true;
                mouthBig = true;
                eyesClosed = true;
                armLeftAngle = -60;
                armRightAngle = -60;
                bodyOffsetY = frame % 2 === 0 ? -3 : 0;
                break;
            case 'defeat':
                eyesClosed = true;
                bodyOffsetY = 5;
                armLeftAngle = 20;
                armRightAngle = 20;
                break;
            case 'walk':
                eyeOffsetX = frame % 2 === 0 ? -1 : 1;
                armLeftAngle = frame % 2 === 0 ? 20 : -20;
                armRightAngle = frame % 2 === 0 ? -20 : 20;
                break;
        }

        // Centro del sprite
        const cx = 48;
        const baseY = 20 + bodyOffsetY;

        // === CUERPO (bata de villano) ===
        ctx.fillStyle = c.coat;
        this.drawPixelRect(ctx, cx - 24, baseY + 55, 48, 50);

        // Cuello de la bata
        ctx.fillStyle = c.coatAccent;
        this.drawPixelRect(ctx, cx - 20, baseY + 55, 8, 15);
        this.drawPixelRect(ctx, cx + 12, baseY + 55, 8, 15);

        // Botones
        ctx.fillStyle = c.gold;
        for (let i = 0; i < 4; i++) {
            this.drawPixelRect(ctx, cx - 2, baseY + 62 + i * 10, 4, 4);
        }

        // === PIERNAS ===
        ctx.fillStyle = '#2a2a4a';
        this.drawPixelRect(ctx, cx - 14, baseY + 100, 12, 20);
        this.drawPixelRect(ctx, cx + 2, baseY + 100, 12, 20);

        // Zapatos
        ctx.fillStyle = '#1a1a1a';
        this.drawPixelRect(ctx, cx - 16, baseY + 118, 14, 6);
        this.drawPixelRect(ctx, cx + 2, baseY + 118, 14, 6);

        // === BRAZOS ===
        this.drawArm(ctx, cx - 24, baseY + 58, armLeftAngle, true);
        this.drawArm(ctx, cx + 24, baseY + 58, armRightAngle, false);

        // === CABEZA ===
        // Base de la cabeza
        ctx.fillStyle = c.skin;
        this.drawPixelRect(ctx, cx - 20, baseY + 8, 40, 48);

        // Calva
        ctx.fillStyle = c.skinLight;
        this.drawPixelRect(ctx, cx - 18, baseY, 36, 15);
        this.drawPixelRect(ctx, cx - 14, baseY - 4, 28, 8);

        // Brillo de la calva
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        this.drawPixelRect(ctx, cx - 6, baseY + 2, 12, 6);

        // Pelo a los lados
        ctx.fillStyle = c.hair;
        this.drawPixelRect(ctx, cx - 24, baseY + 12, 8, 28);
        this.drawPixelRect(ctx, cx + 16, baseY + 12, 8, 28);

        // Orejas
        ctx.fillStyle = c.skin;
        this.drawPixelRect(ctx, cx - 24, baseY + 20, 6, 14);
        this.drawPixelRect(ctx, cx + 18, baseY + 20, 6, 14);

        // === CARA ===
        // Cejas
        ctx.fillStyle = c.hair;
        if (eyebrowsAngry) {
            // Cejas en V (enfadado)
            this.drawPixelRect(ctx, cx - 14, baseY + 18, 10, 4);
            this.drawPixelRect(ctx, cx + 4, baseY + 18, 10, 4);
            this.drawPixelRect(ctx, cx - 14, baseY + 16, 4, 4);
            this.drawPixelRect(ctx, cx + 10, baseY + 16, 4, 4);
        } else {
            this.drawPixelRect(ctx, cx - 14, baseY + 20, 10, 4);
            this.drawPixelRect(ctx, cx + 4, baseY + 20, 10, 4);
        }

        // Ojos
        if (eyesClosed) {
            ctx.fillStyle = c.hair;
            this.drawPixelRect(ctx, cx - 12, baseY + 28, 8, 3);
            this.drawPixelRect(ctx, cx + 4, baseY + 28, 8, 3);
        } else {
            // Blanco del ojo
            ctx.fillStyle = c.white;
            this.drawPixelRect(ctx, cx - 14, baseY + 26 + eyeOffsetY, 10, 10);
            this.drawPixelRect(ctx, cx + 4, baseY + 26 + eyeOffsetY, 10, 10);

            // Pupila
            ctx.fillStyle = c.black;
            this.drawPixelRect(ctx, cx - 10 + eyeOffsetX, baseY + 28 + eyeOffsetY, 5, 6);
            this.drawPixelRect(ctx, cx + 6 + eyeOffsetX, baseY + 28 + eyeOffsetY, 5, 6);

            // Brillo del ojo
            ctx.fillStyle = c.white;
            this.drawPixelRect(ctx, cx - 9 + eyeOffsetX, baseY + 29 + eyeOffsetY, 2, 2);
            this.drawPixelRect(ctx, cx + 7 + eyeOffsetX, baseY + 29 + eyeOffsetY, 2, 2);
        }

        // Nariz
        ctx.fillStyle = c.skinDark;
        this.drawPixelRect(ctx, cx - 4, baseY + 34, 8, 10);
        this.drawPixelRect(ctx, cx - 2, baseY + 42, 4, 4);

        // === BARBA ===
        ctx.fillStyle = c.hair;
        this.drawPixelRect(ctx, cx - 16, baseY + 44, 32, 16);
        ctx.fillStyle = c.hairDark;
        this.drawPixelRect(ctx, cx - 12, baseY + 52, 24, 10);
        this.drawPixelRect(ctx, cx - 8, baseY + 58, 16, 6);

        // Boca (a través de la barba)
        if (mouthOpen) {
            ctx.fillStyle = c.red;
            const mouthHeight = mouthBig ? 10 : 6;
            this.drawPixelRect(ctx, cx - 8, baseY + 46, 16, mouthHeight);

            // Dientes superiores
            ctx.fillStyle = c.white;
            this.drawPixelRect(ctx, cx - 6, baseY + 46, 12, 3);
        }

        return canvas.toDataURL();
    },

    drawArm(ctx, x, y, angle, isLeft) {
        const c = this.colors;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle * Math.PI / 180);

        // Brazo (bata)
        ctx.fillStyle = c.coat;
        if (isLeft) {
            this.drawPixelRect(ctx, -12, 0, 12, 35);
        } else {
            this.drawPixelRect(ctx, 0, 0, 12, 35);
        }

        // Mano
        ctx.fillStyle = c.skin;
        if (isLeft) {
            this.drawPixelRect(ctx, -10, 32, 10, 12);
        } else {
            this.drawPixelRect(ctx, 2, 32, 10, 12);
        }

        ctx.restore();
    },

    drawPixelRect(ctx, x, y, w, h) {
        ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
    },

    // Crear escenario del aula
    createClassroomBackground() {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Pared
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, '#2d4a3d');
        gradient.addColorStop(1, '#1a2d24');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 400);

        // Pizarra
        ctx.fillStyle = '#0a1a0a';
        ctx.fillRect(150, 50, 500, 250);
        ctx.strokeStyle = '#5a3d2a';
        ctx.lineWidth = 15;
        ctx.strokeRect(150, 50, 500, 250);

        // Texto en la pizarra
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px "Press Start 2P"';
        ctx.fillText('EXAMEN', 340, 120);
        ctx.font = '12px "Press Start 2P"';
        ctx.fillText('No hay escape...', 300, 180);

        // Fórmulas falsas
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '10px monospace';
        ctx.fillText('E = mc²', 180, 250);
        ctx.fillText('∑ = ?', 550, 220);

        // Suelo
        ctx.fillStyle = '#3d2a1a';
        ctx.fillRect(0, 400, 800, 200);

        // Patrón del suelo
        ctx.fillStyle = '#4d3a2a';
        for (let y = 400; y < 600; y += 40) {
            for (let x = 0; x < 800; x += 80) {
                ctx.fillRect(x + (y % 80 === 0 ? 0 : 40), y, 40, 40);
            }
        }

        // Pupitres en perspectiva
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 4; col++) {
                const dx = 100 + col * 180;
                const dy = 420 + row * 80;
                this.drawDesk(ctx, dx, dy, 0.8 - row * 0.2);
            }
        }

        // Ventanas con luz siniestra
        ctx.fillStyle = '#1a3a5a';
        ctx.fillRect(30, 80, 80, 120);
        ctx.fillRect(690, 80, 80, 120);

        // Marcos
        ctx.strokeStyle = '#5a3d2a';
        ctx.lineWidth = 8;
        ctx.strokeRect(30, 80, 80, 120);
        ctx.strokeRect(690, 80, 80, 120);

        // Cruz de la ventana
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(70, 80);
        ctx.lineTo(70, 200);
        ctx.moveTo(30, 140);
        ctx.lineTo(110, 140);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(730, 80);
        ctx.lineTo(730, 200);
        ctx.moveTo(690, 140);
        ctx.lineTo(770, 140);
        ctx.stroke();

        // Luz exterior tenebrosa
        const lightGradient = ctx.createRadialGradient(70, 140, 0, 70, 140, 60);
        lightGradient.addColorStop(0, 'rgba(233, 69, 96, 0.3)');
        lightGradient.addColorStop(1, 'rgba(233, 69, 96, 0)');
        ctx.fillStyle = lightGradient;
        ctx.fillRect(30, 80, 80, 120);

        return canvas.toDataURL();
    },

    drawDesk(ctx, x, y, scale) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        // Superficie
        ctx.fillStyle = '#5a4030';
        ctx.fillRect(0, 0, 120, 50);

        // Borde
        ctx.fillStyle = '#4a3020';
        ctx.fillRect(0, 45, 120, 8);

        // Patas
        ctx.fillStyle = '#3a2515';
        ctx.fillRect(5, 50, 10, 30);
        ctx.fillRect(105, 50, 10, 30);

        ctx.restore();
    },

    // Crear escenario de biblioteca
    createLibraryBackground() {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Fondo oscuro
        const gradient = ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#0a0a15');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);

        // Estanterías
        for (let i = 0; i < 4; i++) {
            this.drawBookshelf(ctx, 50 + i * 200, 50, 150, 350);
        }

        // Suelo de madera oscura
        ctx.fillStyle = '#2a1a10';
        ctx.fillRect(0, 450, 800, 150);

        // Patrón del suelo
        for (let y = 450; y < 600; y += 30) {
            for (let x = 0; x < 800; x += 100) {
                ctx.fillStyle = x % 200 === 0 ? '#3a2a1a' : '#2a1a10';
                ctx.fillRect(x, y, 100, 30);
            }
        }

        // Mesa central
        ctx.fillStyle = '#3a2515';
        ctx.fillRect(250, 400, 300, 80);
        ctx.fillStyle = '#2a1a0a';
        ctx.fillRect(260, 475, 20, 60);
        ctx.fillRect(520, 475, 20, 60);

        // Libros en la mesa
        const bookColors = ['#8b0000', '#006400', '#00008b', '#8b4513'];
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = bookColors[i % bookColors.length];
            ctx.fillRect(280 + i * 40, 380, 30, 25);
        }

        // Candelabro con luz
        this.drawCandelabra(ctx, 400, 100);

        // Niebla/polvo
        for (let i = 0; i < 20; i++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.05})`;
            ctx.beginPath();
            ctx.arc(Math.random() * 800, Math.random() * 600, Math.random() * 50 + 20, 0, Math.PI * 2);
            ctx.fill();
        }

        return canvas.toDataURL();
    },

    drawBookshelf(ctx, x, y, w, h) {
        // Marco
        ctx.fillStyle = '#3a2515';
        ctx.fillRect(x, y, w, h);

        // Interior
        ctx.fillStyle = '#2a1a0a';
        ctx.fillRect(x + 10, y + 10, w - 20, h - 20);

        // Estantes
        const shelfCount = 5;
        const shelfHeight = (h - 20) / shelfCount;

        for (let i = 0; i < shelfCount; i++) {
            // Estante
            ctx.fillStyle = '#4a3020';
            ctx.fillRect(x + 10, y + 10 + i * shelfHeight + shelfHeight - 8, w - 20, 8);

            // Libros
            let bx = x + 15;
            while (bx < x + w - 25) {
                const bookWidth = 8 + Math.random() * 15;
                const bookHeight = shelfHeight - 15 - Math.random() * 10;
                const colors = ['#8b0000', '#006400', '#00008b', '#8b4513', '#4a0080', '#804000'];
                ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                ctx.fillRect(bx, y + 10 + i * shelfHeight + (shelfHeight - 8 - bookHeight), bookWidth, bookHeight);
                bx += bookWidth + 2;
            }
        }
    },

    drawCandelabra(ctx, x, y) {
        // Base
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(x - 40, y + 80, 80, 10);
        ctx.fillRect(x - 5, y + 30, 10, 50);

        // Brazos
        ctx.fillRect(x - 50, y + 30, 100, 8);

        // Velas
        const candlePositions = [-45, -15, 15, 45];
        candlePositions.forEach(offset => {
            ctx.fillStyle = '#f5f5dc';
            ctx.fillRect(x + offset - 4, y + 10, 8, 25);

            // Llama
            const gradient = ctx.createRadialGradient(x + offset, y + 5, 0, x + offset, y + 5, 15);
            gradient.addColorStop(0, 'rgba(255, 200, 50, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.5)');
            gradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x + offset, y + 5, 15, 0, Math.PI * 2);
            ctx.fill();
        });
    },

    // Crear escenario de laboratorio
    createLaboratoryBackground() {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Fondo metálico
        const gradient = ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, '#2a3a4a');
        gradient.addColorStop(1, '#1a2a3a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);

        // Paneles metálicos
        for (let y = 0; y < 600; y += 150) {
            for (let x = 0; x < 800; x += 200) {
                ctx.strokeStyle = '#3a4a5a';
                ctx.lineWidth = 3;
                ctx.strokeRect(x + 10, y + 10, 180, 130);

                // Tornillos
                ctx.fillStyle = '#5a6a7a';
                ctx.beginPath();
                ctx.arc(x + 20, y + 20, 5, 0, Math.PI * 2);
                ctx.arc(x + 180, y + 20, 5, 0, Math.PI * 2);
                ctx.arc(x + 20, y + 130, 5, 0, Math.PI * 2);
                ctx.arc(x + 180, y + 130, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Mesa de laboratorio
        ctx.fillStyle = '#4a5a6a';
        ctx.fillRect(100, 400, 600, 30);
        ctx.fillStyle = '#3a4a5a';
        ctx.fillRect(120, 430, 30, 100);
        ctx.fillRect(650, 430, 30, 100);

        // Tubos de ensayo
        const tubeColors = ['#00ff00', '#ff00ff', '#00ffff', '#ffff00', '#ff0000'];
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = '#aaaaaa';
            ctx.fillRect(200 + i * 60, 350, 20, 50);
            ctx.fillStyle = tubeColors[i];
            ctx.fillRect(203 + i * 60, 370, 14, 27);

            // Burbujas
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.beginPath();
            ctx.arc(210 + i * 60, 380, 3, 0, Math.PI * 2);
            ctx.arc(208 + i * 60, 388, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Pantallas/monitores
        ctx.fillStyle = '#0a0a15';
        ctx.fillRect(500, 200, 150, 100);
        ctx.strokeStyle = '#4ecca3';
        ctx.lineWidth = 4;
        ctx.strokeRect(500, 200, 150, 100);

        // Texto en pantalla
        ctx.fillStyle = '#4ecca3';
        ctx.font = '10px monospace';
        ctx.fillText('SISTEMA ACTIVO', 515, 230);
        ctx.fillText('SUJETO: ALUMNO', 515, 250);
        ctx.fillText('ESTADO: PRUEBA', 515, 270);

        // Máquina misteriosa
        ctx.fillStyle = '#2a2a3a';
        ctx.fillRect(50, 150, 120, 200);
        ctx.fillStyle = '#e94560';
        ctx.beginPath();
        ctx.arc(110, 250, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(110, 250, 20, 0, Math.PI * 2);
        ctx.fill();

        // Cables
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(170, 250);
        ctx.bezierCurveTo(250, 200, 300, 300, 400, 250);
        ctx.stroke();

        ctx.strokeStyle = '#00ffff';
        ctx.beginPath();
        ctx.moveTo(170, 280);
        ctx.bezierCurveTo(220, 350, 350, 280, 400, 350);
        ctx.stroke();

        return canvas.toDataURL();
    },

    // Crear escenario del castillo
    createCastleBackground() {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Cielo tormentoso
        const skyGradient = ctx.createLinearGradient(0, 0, 0, 300);
        skyGradient.addColorStop(0, '#0a0a15');
        skyGradient.addColorStop(0.5, '#1a1a2e');
        skyGradient.addColorStop(1, '#2a1a2a');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, 800, 300);

        // Relámpagos (estáticos para el fondo)
        ctx.strokeStyle = 'rgba(255, 255, 200, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(600, 0);
        ctx.lineTo(580, 50);
        ctx.lineTo(600, 80);
        ctx.lineTo(570, 150);
        ctx.stroke();

        // Montañas
        ctx.fillStyle = '#1a1a2a';
        ctx.beginPath();
        ctx.moveTo(0, 300);
        ctx.lineTo(200, 150);
        ctx.lineTo(350, 250);
        ctx.lineTo(500, 100);
        ctx.lineTo(650, 200);
        ctx.lineTo(800, 120);
        ctx.lineTo(800, 300);
        ctx.closePath();
        ctx.fill();

        // Castillo
        ctx.fillStyle = '#2a2a3a';

        // Torre izquierda
        ctx.fillRect(150, 150, 80, 250);
        ctx.fillStyle = '#3a3a4a';
        ctx.fillRect(150, 130, 80, 30);
        // Almenas
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(150 + i * 25, 110, 15, 25);
        }

        // Cuerpo central
        ctx.fillStyle = '#2a2a3a';
        ctx.fillRect(230, 200, 200, 200);

        // Torre derecha
        ctx.fillRect(430, 150, 80, 250);
        ctx.fillStyle = '#3a3a4a';
        ctx.fillRect(430, 130, 80, 30);
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(430 + i * 25, 110, 15, 25);
        }

        // Puerta principal
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(280, 280, 100, 120);
        ctx.fillStyle = '#5a3d2a';
        ctx.fillRect(285, 285, 90, 110);

        // Detalles de la puerta
        ctx.fillStyle = '#3a2515';
        ctx.fillRect(325, 285, 5, 110);
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(285, 290 + i * 28, 90, 3);
        }

        // Aldaba
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(355, 340, 8, 0, Math.PI * 2);
        ctx.fill();

        // Ventanas con luz roja
        const windowPositions = [[170, 200], [210, 250], [450, 200], [490, 250], [290, 220], [350, 220]];
        windowPositions.forEach(([wx, wy]) => {
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(wx, wy, 30, 40);
            ctx.fillStyle = 'rgba(233, 69, 96, 0.5)';
            ctx.fillRect(wx + 3, wy + 3, 24, 34);
        });

        // Suelo rocoso
        ctx.fillStyle = '#3a3a4a';
        ctx.fillRect(0, 400, 800, 200);

        // Rocas
        for (let i = 0; i < 20; i++) {
            ctx.fillStyle = `rgb(${50 + Math.random() * 30}, ${50 + Math.random() * 30}, ${60 + Math.random() * 30})`;
            ctx.beginPath();
            ctx.arc(Math.random() * 800, 450 + Math.random() * 150, 10 + Math.random() * 30, 0, Math.PI * 2);
            ctx.fill();
        }

        // Niebla inferior
        const fogGradient = ctx.createLinearGradient(0, 500, 0, 600);
        fogGradient.addColorStop(0, 'rgba(100, 100, 120, 0)');
        fogGradient.addColorStop(1, 'rgba(100, 100, 120, 0.5)');
        ctx.fillStyle = fogGradient;
        ctx.fillRect(0, 500, 800, 100);

        return canvas.toDataURL();
    },

    // Crear partículas
    createParticle(type) {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        switch(type) {
            case 'star':
                ctx.fillStyle = '#ffd700';
                ctx.fillRect(6, 0, 4, 4);
                ctx.fillRect(0, 6, 4, 4);
                ctx.fillRect(12, 6, 4, 4);
                ctx.fillRect(6, 12, 4, 4);
                ctx.fillRect(6, 6, 4, 4);
                ctx.fillStyle = '#ffff00';
                ctx.fillRect(7, 7, 2, 2);
                break;

            case 'skull':
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(3, 2, 10, 8);
                ctx.fillRect(5, 10, 6, 4);
                ctx.fillStyle = '#000000';
                ctx.fillRect(4, 4, 3, 3);
                ctx.fillRect(9, 4, 3, 3);
                ctx.fillRect(6, 11, 2, 2);
                ctx.fillRect(8, 11, 2, 2);
                break;

            case 'heart':
                ctx.fillStyle = '#e94560';
                ctx.fillRect(2, 4, 4, 4);
                ctx.fillRect(10, 4, 4, 4);
                ctx.fillRect(4, 2, 4, 4);
                ctx.fillRect(8, 2, 4, 4);
                ctx.fillRect(4, 6, 8, 4);
                ctx.fillRect(6, 10, 4, 4);
                break;

            case 'heartEmpty':
                ctx.strokeStyle = '#e94560';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(8, 14);
                ctx.lineTo(2, 7);
                ctx.lineTo(2, 4);
                ctx.lineTo(5, 2);
                ctx.lineTo(8, 5);
                ctx.lineTo(11, 2);
                ctx.lineTo(14, 4);
                ctx.lineTo(14, 7);
                ctx.lineTo(8, 14);
                ctx.stroke();
                break;

            case 'lightning':
                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.moveTo(10, 0);
                ctx.lineTo(4, 7);
                ctx.lineTo(8, 7);
                ctx.lineTo(6, 16);
                ctx.lineTo(12, 8);
                ctx.lineTo(8, 8);
                ctx.lineTo(10, 0);
                ctx.fill();
                break;

            case 'confetti':
                const colors = ['#e94560', '#4ecca3', '#ffd700', '#ff69b4', '#00ffff'];
                ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                ctx.fillRect(4, 4, 8, 8);
                break;
        }

        return canvas.toDataURL();
    },

    // Crear icono de power-up
    createPowerupIcon(type) {
        const canvas = document.createElement('canvas');
        canvas.width = 48;
        canvas.height = 48;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Fondo circular
        const gradient = ctx.createRadialGradient(24, 24, 0, 24, 24, 24);

        switch(type) {
            case 'fifty':
                gradient.addColorStop(0, '#ffd700');
                gradient.addColorStop(1, '#ff8c00');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(24, 24, 22, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000';
                ctx.font = 'bold 16px "Press Start 2P"';
                ctx.textAlign = 'center';
                ctx.fillText('50', 24, 22);
                ctx.fillText('50', 24, 36);
                break;

            case 'hint':
                gradient.addColorStop(0, '#4ecca3');
                gradient.addColorStop(1, '#2d8a6e');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(24, 24, 22, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 24px "Press Start 2P"';
                ctx.textAlign = 'center';
                ctx.fillText('?', 24, 32);
                break;

            case 'freeze':
                gradient.addColorStop(0, '#00ffff');
                gradient.addColorStop(1, '#0080ff');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(24, 24, 22, 0, Math.PI * 2);
                ctx.fill();
                // Copo de nieve
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 3;
                for (let i = 0; i < 6; i++) {
                    ctx.save();
                    ctx.translate(24, 24);
                    ctx.rotate(i * Math.PI / 3);
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, 15);
                    ctx.stroke();
                    ctx.restore();
                }
                break;

            case 'extraLife':
                gradient.addColorStop(0, '#ff69b4');
                gradient.addColorStop(1, '#e94560');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(24, 24, 22, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 20px "Press Start 2P"';
                ctx.textAlign = 'center';
                ctx.fillText('+1', 24, 32);
                break;
        }

        // Borde brillante
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(24, 24, 21, 0, Math.PI * 2);
        ctx.stroke();

        return canvas.toDataURL();
    },

    // Crear mapa de Europa simplificado
    createEuropeMap() {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Océano
        ctx.fillStyle = '#0a2a4a';
        ctx.fillRect(0, 0, 400, 300);

        // Patrón de agua
        for (let y = 0; y < 300; y += 8) {
            for (let x = 0; x < 400; x += 8) {
                if (Math.random() > 0.8) {
                    ctx.fillStyle = '#1a3a5a';
                    ctx.fillRect(x, y, 8, 8);
                }
            }
        }

        // Continentes simplificados
        ctx.fillStyle = '#2d5a2d';

        // Península Ibérica
        ctx.beginPath();
        ctx.moveTo(50, 180);
        ctx.lineTo(90, 150);
        ctx.lineTo(110, 170);
        ctx.lineTo(100, 210);
        ctx.lineTo(60, 220);
        ctx.lineTo(40, 200);
        ctx.closePath();
        ctx.fill();

        // Francia
        ctx.beginPath();
        ctx.moveTo(100, 130);
        ctx.lineTo(150, 120);
        ctx.lineTo(160, 160);
        ctx.lineTo(130, 180);
        ctx.lineTo(100, 165);
        ctx.closePath();
        ctx.fill();

        // Reino Unido
        ctx.beginPath();
        ctx.moveTo(80, 90);
        ctx.lineTo(110, 80);
        ctx.lineTo(115, 130);
        ctx.lineTo(85, 135);
        ctx.closePath();
        ctx.fill();

        // Europa Central
        ctx.beginPath();
        ctx.moveTo(150, 110);
        ctx.lineTo(250, 100);
        ctx.lineTo(270, 150);
        ctx.lineTo(240, 190);
        ctx.lineTo(160, 180);
        ctx.lineTo(140, 140);
        ctx.closePath();
        ctx.fill();

        // Italia
        ctx.beginPath();
        ctx.moveTo(170, 160);
        ctx.lineTo(190, 150);
        ctx.lineTo(210, 200);
        ctx.lineTo(195, 240);
        ctx.lineTo(175, 220);
        ctx.closePath();
        ctx.fill();

        // Escandinavia
        ctx.beginPath();
        ctx.moveTo(160, 30);
        ctx.lineTo(200, 20);
        ctx.lineTo(210, 100);
        ctx.lineTo(170, 110);
        ctx.closePath();
        ctx.fill();

        // Europa del Este
        ctx.beginPath();
        ctx.moveTo(250, 80);
        ctx.lineTo(350, 50);
        ctx.lineTo(380, 150);
        ctx.lineTo(320, 200);
        ctx.lineTo(260, 170);
        ctx.closePath();
        ctx.fill();

        // Grecia
        ctx.beginPath();
        ctx.moveTo(230, 200);
        ctx.lineTo(260, 190);
        ctx.lineTo(270, 230);
        ctx.lineTo(240, 250);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    // Crear mapa del mundo simplificado
    createWorldMap() {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Océano
        ctx.fillStyle = '#0a2a4a';
        ctx.fillRect(0, 0, 400, 300);

        // Continentes
        ctx.fillStyle = '#2d5a2d';

        // América del Norte
        ctx.beginPath();
        ctx.moveTo(20, 50);
        ctx.lineTo(100, 30);
        ctx.lineTo(120, 100);
        ctx.lineTo(80, 150);
        ctx.lineTo(30, 130);
        ctx.closePath();
        ctx.fill();

        // América del Sur
        ctx.beginPath();
        ctx.moveTo(70, 160);
        ctx.lineTo(110, 170);
        ctx.lineTo(100, 270);
        ctx.lineTo(60, 250);
        ctx.closePath();
        ctx.fill();

        // Europa/África
        ctx.beginPath();
        ctx.moveTo(170, 60);
        ctx.lineTo(220, 50);
        ctx.lineTo(240, 100);
        ctx.lineTo(220, 200);
        ctx.lineTo(180, 180);
        ctx.lineTo(160, 100);
        ctx.closePath();
        ctx.fill();

        // Asia
        ctx.beginPath();
        ctx.moveTo(230, 40);
        ctx.lineTo(380, 30);
        ctx.lineTo(390, 150);
        ctx.lineTo(300, 180);
        ctx.lineTo(240, 130);
        ctx.closePath();
        ctx.fill();

        // Australia
        ctx.beginPath();
        ctx.moveTo(320, 200);
        ctx.lineTo(380, 190);
        ctx.lineTo(390, 250);
        ctx.lineTo(340, 260);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    }
};

// Hacer disponible globalmente
window.SpriteGenerator = SpriteGenerator;
