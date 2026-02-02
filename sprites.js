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
    },

    // ==================== NUEVOS ESCENARIOS ====================

    // Crear escenario del gimnasio
    createGymnasiumBackground() {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Pared del gimnasio
        const wallGradient = ctx.createLinearGradient(0, 0, 0, 400);
        wallGradient.addColorStop(0, '#4a3a2a');
        wallGradient.addColorStop(1, '#3a2a1a');
        ctx.fillStyle = wallGradient;
        ctx.fillRect(0, 0, 800, 400);

        // Ladrillos
        ctx.fillStyle = '#5a4a3a';
        for (let y = 0; y < 400; y += 30) {
            for (let x = 0; x < 800; x += 60) {
                const offsetX = (y % 60 === 0) ? 0 : 30;
                ctx.fillRect(x + offsetX, y, 58, 28);
            }
        }

        // Espalderas en la pared
        for (let i = 0; i < 3; i++) {
            const ex = 100 + i * 280;
            ctx.fillStyle = '#5a3d2a';
            ctx.fillRect(ex, 50, 120, 300);
            ctx.fillStyle = '#4a2d1a';
            // Barras horizontales
            for (let j = 0; j < 10; j++) {
                ctx.fillRect(ex + 5, 60 + j * 30, 110, 8);
            }
            // Barras verticales
            ctx.fillRect(ex + 10, 50, 10, 300);
            ctx.fillRect(ex + 100, 50, 10, 300);
        }

        // Canasta de baloncesto
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(700, 100, 10, 80);
        ctx.fillStyle = '#e94560';
        ctx.fillRect(650, 100, 60, 5);
        // Aro
        ctx.strokeStyle = '#ff6b00';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(680, 115, 20, 0, Math.PI * 2);
        ctx.stroke();
        // Red (simplificada)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(665 + i * 6, 120);
            ctx.lineTo(670 + i * 4, 150);
            ctx.stroke();
        }

        // Suelo del gimnasio (parquet)
        ctx.fillStyle = '#8b6914';
        ctx.fillRect(0, 400, 800, 200);

        // Líneas del parquet
        ctx.fillStyle = '#9b7924';
        for (let y = 400; y < 600; y += 20) {
            for (let x = 0; x < 800; x += 80) {
                const offsetX = (y % 40 === 0) ? 0 : 40;
                ctx.fillRect(x + offsetX, y, 78, 18);
            }
        }

        // Líneas de la cancha
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        // Línea central
        ctx.beginPath();
        ctx.moveTo(400, 400);
        ctx.lineTo(400, 600);
        ctx.stroke();
        // Círculo central
        ctx.beginPath();
        ctx.arc(400, 500, 60, 0, Math.PI * 2);
        ctx.stroke();
        // Áreas
        ctx.strokeRect(0, 420, 150, 160);
        ctx.strokeRect(650, 420, 150, 160);

        // Bancos a los lados
        ctx.fillStyle = '#3a2515';
        ctx.fillRect(20, 450, 80, 30);
        ctx.fillRect(700, 450, 80, 30);
        ctx.fillStyle = '#2a1505';
        ctx.fillRect(25, 480, 8, 40);
        ctx.fillRect(87, 480, 8, 40);
        ctx.fillRect(705, 480, 8, 40);
        ctx.fillRect(767, 480, 8, 40);

        // Balones
        ctx.fillStyle = '#ff6b00';
        ctx.beginPath();
        ctx.arc(50, 540, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(50, 540, 15, 0, Math.PI * 2);
        ctx.moveTo(35, 540);
        ctx.lineTo(65, 540);
        ctx.stroke();

        // Reloj de pared
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(400, 80, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = '#e94560';
        ctx.font = '20px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('0:00', 400, 88);

        return canvas.toDataURL();
    },

    // Crear escenario del comedor
    createCafeteriaBackground() {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Pared
        const wallGradient = ctx.createLinearGradient(0, 0, 0, 350);
        wallGradient.addColorStop(0, '#f5f0e0');
        wallGradient.addColorStop(1, '#e5e0d0');
        ctx.fillStyle = wallGradient;
        ctx.fillRect(0, 0, 800, 350);

        // Azulejos en la pared (estilo cocina)
        ctx.fillStyle = '#ffffff';
        for (let y = 200; y < 350; y += 25) {
            for (let x = 0; x < 800; x += 25) {
                ctx.fillRect(x + 1, y + 1, 23, 23);
            }
        }
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 1;
        for (let y = 200; y < 350; y += 25) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(800, y);
            ctx.stroke();
        }
        for (let x = 0; x < 800; x += 25) {
            ctx.beginPath();
            ctx.moveTo(x, 200);
            ctx.lineTo(x, 350);
            ctx.stroke();
        }

        // Mostrador de comida
        ctx.fillStyle = '#4a4a5a';
        ctx.fillRect(50, 280, 700, 80);
        ctx.fillStyle = '#3a3a4a';
        ctx.fillRect(50, 350, 700, 20);

        // Cristal del mostrador
        ctx.fillStyle = 'rgba(200, 230, 255, 0.3)';
        ctx.fillRect(55, 250, 690, 35);
        ctx.strokeStyle = '#aaaaaa';
        ctx.lineWidth = 2;
        ctx.strokeRect(55, 250, 690, 35);

        // Bandejas de comida
        const foodColors = ['#8b4513', '#ffd700', '#ff6347', '#32cd32', '#daa520'];
        for (let i = 0; i < 5; i++) {
            // Bandeja
            ctx.fillStyle = '#c0c0c0';
            ctx.fillRect(80 + i * 140, 290, 100, 60);
            ctx.fillStyle = '#a0a0a0';
            ctx.fillRect(80 + i * 140, 345, 100, 8);
            // Comida
            ctx.fillStyle = foodColors[i];
            ctx.fillRect(90 + i * 140, 300, 80, 35);
        }

        // Suelo
        ctx.fillStyle = '#8b8b8b';
        ctx.fillRect(0, 370, 800, 230);

        // Patrón del suelo (baldosas)
        for (let y = 370; y < 600; y += 50) {
            for (let x = 0; x < 800; x += 50) {
                ctx.fillStyle = (x + y) % 100 === 0 ? '#9b9b9b' : '#7b7b7b';
                ctx.fillRect(x, y, 49, 49);
            }
        }

        // Mesas del comedor
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 3; col++) {
                const mx = 120 + col * 250;
                const my = 420 + row * 90;
                // Mesa
                ctx.fillStyle = '#e0d0b0';
                ctx.fillRect(mx, my, 180, 50);
                ctx.fillStyle = '#c0b090';
                ctx.fillRect(mx, my + 45, 180, 8);
                // Patas
                ctx.fillStyle = '#a0a0a0';
                ctx.fillRect(mx + 10, my + 50, 10, 30);
                ctx.fillRect(mx + 160, my + 50, 10, 30);

                // Bandejas en las mesas
                ctx.fillStyle = '#d0d0d0';
                ctx.fillRect(mx + 20, my + 5, 40, 30);
                ctx.fillRect(mx + 80, my + 5, 40, 30);
                ctx.fillRect(mx + 130, my + 5, 40, 30);
            }
        }

        // Menú en la pared
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(320, 30, 160, 120);
        ctx.strokeStyle = '#5a3d2a';
        ctx.lineWidth = 8;
        ctx.strokeRect(320, 30, 160, 120);
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('MENU', 400, 55);
        ctx.font = '7px "Press Start 2P"';
        ctx.fillText('1. Sopa...', 400, 80);
        ctx.fillText('2. Pollo...', 400, 100);
        ctx.fillText('3. Fruta', 400, 120);

        // Reloj
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(700, 80, 35, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.moveTo(700, 80);
        ctx.lineTo(700, 55);
        ctx.moveTo(700, 80);
        ctx.lineTo(720, 80);
        ctx.stroke();

        // Cartel "SILENCIO"
        ctx.fillStyle = '#e94560';
        ctx.fillRect(100, 50, 150, 40);
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('¡SILENCIO!', 175, 77);

        return canvas.toDataURL();
    },

    // ==================== SPRITES DEL PROFESOR CON OUTFITS ====================
    // El mismo Profesor Álvaro pero con accesorios/caracterización

    // Profesor Álvaro con outfit deportivo (mismo personaje + accesorios)
    createProfessorSporty(state = 'idle', frame = 0) {
        const canvas = document.createElement('canvas');
        canvas.width = 96;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const c = this.colors;

        // Configuraciones de estado (IGUAL que el original)
        let eyeOffsetX = 0, eyeOffsetY = 0;
        let mouthOpen = false, mouthBig = false, eyesClosed = false, eyebrowsAngry = false;
        let armLeftAngle = 0, armRightAngle = 0, bodyOffsetY = 0;

        switch(state) {
            case 'idle': eyeOffsetX = frame % 2 === 0 ? 0 : 1; break;
            case 'talk': mouthOpen = frame % 2 === 0; eyeOffsetX = Math.sin(frame * 0.5) * 2; break;
            case 'laugh': mouthOpen = true; mouthBig = true; eyesClosed = true; bodyOffsetY = frame % 2 === 0 ? -2 : 2; break;
            case 'angry': eyebrowsAngry = true; mouthOpen = frame % 2 === 0; bodyOffsetY = frame % 2 === 0 ? -1 : 1; break;
        }

        const cx = 48;
        const baseY = 20 + bodyOffsetY;

        // === CUERPO (chándal en vez de bata, mismo estilo) ===
        // Chaqueta de chándal roja
        ctx.fillStyle = '#c41e3a';
        this.drawPixelRect(ctx, cx - 24, baseY + 55, 48, 50);

        // Rayas blancas laterales
        ctx.fillStyle = '#ffffff';
        this.drawPixelRect(ctx, cx - 24, baseY + 55, 4, 50);
        this.drawPixelRect(ctx, cx + 20, baseY + 55, 4, 50);

        // Cremallera
        ctx.fillStyle = c.gold;
        for (let i = 0; i < 5; i++) {
            this.drawPixelRect(ctx, cx - 2, baseY + 58 + i * 9, 4, 4);
        }

        // === PIERNAS (pantalón de chándal) ===
        ctx.fillStyle = '#1a1a2e';
        this.drawPixelRect(ctx, cx - 14, baseY + 100, 12, 20);
        this.drawPixelRect(ctx, cx + 2, baseY + 100, 12, 20);
        // Rayas laterales
        ctx.fillStyle = '#ffffff';
        this.drawPixelRect(ctx, cx - 14, baseY + 100, 2, 20);
        this.drawPixelRect(ctx, cx + 12, baseY + 100, 2, 20);

        // Zapatillas deportivas
        ctx.fillStyle = '#ffffff';
        this.drawPixelRect(ctx, cx - 16, baseY + 118, 14, 6);
        this.drawPixelRect(ctx, cx + 2, baseY + 118, 14, 6);
        ctx.fillStyle = '#c41e3a';
        this.drawPixelRect(ctx, cx - 14, baseY + 120, 4, 3);
        this.drawPixelRect(ctx, cx + 10, baseY + 120, 4, 3);

        // === BRAZOS (mismo estilo que original) ===
        this.drawArmSporty(ctx, cx - 24, baseY + 58, armLeftAngle, true);
        this.drawArmSporty(ctx, cx + 24, baseY + 58, armRightAngle, false);

        // === SILBATO (accesorio) ===
        ctx.fillStyle = '#c0c0c0';
        this.drawPixelRect(ctx, cx - 4, baseY + 52, 8, 4);
        ctx.beginPath();
        ctx.arc(cx + 8, baseY + 54, 5, 0, Math.PI * 2);
        ctx.fill();
        // Cordón rojo
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 4, baseY + 54);
        ctx.quadraticCurveTo(cx - 15, baseY + 45, cx - 20, baseY + 54);
        ctx.stroke();

        // === CABEZA (EXACTAMENTE igual que original) ===
        ctx.fillStyle = c.skin;
        this.drawPixelRect(ctx, cx - 20, baseY + 8, 40, 48);

        // Calva
        ctx.fillStyle = c.skinLight;
        this.drawPixelRect(ctx, cx - 18, baseY, 36, 15);
        this.drawPixelRect(ctx, cx - 14, baseY - 4, 28, 8);

        // Brillo de la calva
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        this.drawPixelRect(ctx, cx - 6, baseY + 2, 12, 6);

        // Pelo a los lados (igual)
        ctx.fillStyle = c.hair;
        this.drawPixelRect(ctx, cx - 24, baseY + 12, 8, 28);
        this.drawPixelRect(ctx, cx + 16, baseY + 12, 8, 28);

        // === CINTA DEPORTIVA (accesorio sobre la calva) ===
        ctx.fillStyle = '#c41e3a';
        this.drawPixelRect(ctx, cx - 20, baseY + 6, 40, 6);
        ctx.fillStyle = '#ffffff';
        this.drawPixelRect(ctx, cx - 4, baseY + 7, 8, 4);

        // Orejas
        ctx.fillStyle = c.skin;
        this.drawPixelRect(ctx, cx - 24, baseY + 20, 6, 14);
        this.drawPixelRect(ctx, cx + 18, baseY + 20, 6, 14);

        // === CARA (EXACTAMENTE igual que original) ===
        ctx.fillStyle = c.hair;
        if (eyebrowsAngry) {
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
            ctx.fillStyle = c.white;
            this.drawPixelRect(ctx, cx - 14, baseY + 26 + eyeOffsetY, 10, 10);
            this.drawPixelRect(ctx, cx + 4, baseY + 26 + eyeOffsetY, 10, 10);
            ctx.fillStyle = c.black;
            this.drawPixelRect(ctx, cx - 10 + eyeOffsetX, baseY + 28 + eyeOffsetY, 5, 6);
            this.drawPixelRect(ctx, cx + 6 + eyeOffsetX, baseY + 28 + eyeOffsetY, 5, 6);
            ctx.fillStyle = c.white;
            this.drawPixelRect(ctx, cx - 9 + eyeOffsetX, baseY + 29 + eyeOffsetY, 2, 2);
            this.drawPixelRect(ctx, cx + 7 + eyeOffsetX, baseY + 29 + eyeOffsetY, 2, 2);
        }

        // Nariz
        ctx.fillStyle = c.skinDark;
        this.drawPixelRect(ctx, cx - 4, baseY + 34, 8, 10);
        this.drawPixelRect(ctx, cx - 2, baseY + 42, 4, 4);

        // === BARBA (EXACTAMENTE igual que original) ===
        ctx.fillStyle = c.hair;
        this.drawPixelRect(ctx, cx - 16, baseY + 44, 32, 16);
        ctx.fillStyle = c.hairDark;
        this.drawPixelRect(ctx, cx - 12, baseY + 52, 24, 10);
        this.drawPixelRect(ctx, cx - 8, baseY + 58, 16, 6);

        // Boca
        if (mouthOpen) {
            ctx.fillStyle = c.red;
            const mouthHeight = mouthBig ? 10 : 6;
            this.drawPixelRect(ctx, cx - 8, baseY + 46, 16, mouthHeight);
            ctx.fillStyle = c.white;
            this.drawPixelRect(ctx, cx - 6, baseY + 46, 12, 3);
        }

        return canvas.toDataURL();
    },

    // Brazo con manga de chándal
    drawArmSporty(ctx, x, y, angle, isLeft) {
        const c = this.colors;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle * Math.PI / 180);

        // Brazo (chándal rojo con raya)
        ctx.fillStyle = '#c41e3a';
        if (isLeft) {
            this.drawPixelRect(ctx, -12, 0, 12, 35);
            ctx.fillStyle = '#ffffff';
            this.drawPixelRect(ctx, -12, 0, 2, 35);
        } else {
            this.drawPixelRect(ctx, 0, 0, 12, 35);
            ctx.fillStyle = '#ffffff';
            this.drawPixelRect(ctx, 10, 0, 2, 35);
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

    // Profesor Álvaro con outfit de chef (mismo personaje + accesorios)
    createProfessorChef(state = 'idle', frame = 0) {
        const canvas = document.createElement('canvas');
        canvas.width = 96;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const c = this.colors;

        let eyeOffsetX = 0, eyeOffsetY = 0;
        let mouthOpen = false, mouthBig = false, eyesClosed = false, eyebrowsAngry = false;
        let armLeftAngle = 0, armRightAngle = 0, bodyOffsetY = 0;

        switch(state) {
            case 'idle': eyeOffsetX = frame % 2 === 0 ? 0 : 1; break;
            case 'talk': mouthOpen = frame % 2 === 0; eyeOffsetX = Math.sin(frame * 0.5) * 2; break;
            case 'laugh': mouthOpen = true; mouthBig = true; eyesClosed = true; bodyOffsetY = frame % 2 === 0 ? -2 : 2; break;
            case 'angry': eyebrowsAngry = true; mouthOpen = frame % 2 === 0; bodyOffsetY = frame % 2 === 0 ? -1 : 1; break;
        }

        const cx = 48;
        const baseY = 20 + bodyOffsetY;

        // === CUERPO (chaqueta de chef sobre la bata base) ===
        ctx.fillStyle = '#ffffff';
        this.drawPixelRect(ctx, cx - 24, baseY + 55, 48, 50);

        // Doble botonadura de chef
        ctx.fillStyle = '#1a1a2e';
        for (let i = 0; i < 3; i++) {
            this.drawPixelRect(ctx, cx - 10, baseY + 62 + i * 12, 5, 5);
            this.drawPixelRect(ctx, cx + 5, baseY + 62 + i * 12, 5, 5);
        }

        // Cuello de chef
        ctx.fillStyle = '#f0f0f0';
        this.drawPixelRect(ctx, cx - 18, baseY + 52, 36, 8);

        // === DELANTAL (accesorio) ===
        ctx.fillStyle = '#f5f5f5';
        this.drawPixelRect(ctx, cx - 18, baseY + 70, 36, 35);
        // Bolsillo
        ctx.fillStyle = '#e8e8e8';
        this.drawPixelRect(ctx, cx - 10, baseY + 78, 20, 12);
        // Cucharón asomando
        ctx.fillStyle = '#c0c0c0';
        this.drawPixelRect(ctx, cx + 4, baseY + 72, 4, 10);

        // === PIERNAS ===
        ctx.fillStyle = '#2a2a4a';
        this.drawPixelRect(ctx, cx - 14, baseY + 100, 12, 20);
        this.drawPixelRect(ctx, cx + 2, baseY + 100, 12, 20);

        // Zapatos
        ctx.fillStyle = '#1a1a1a';
        this.drawPixelRect(ctx, cx - 16, baseY + 118, 14, 6);
        this.drawPixelRect(ctx, cx + 2, baseY + 118, 14, 6);

        // === BRAZOS (manga de chef) ===
        this.drawArmChef(ctx, cx - 24, baseY + 58, armLeftAngle, true);
        this.drawArmChef(ctx, cx + 24, baseY + 58, armRightAngle, false);

        // === CABEZA (EXACTAMENTE igual que original) ===
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

        // === GORRO DE CHEF (accesorio sobre la cabeza) ===
        ctx.fillStyle = '#ffffff';
        // Base del gorro
        this.drawPixelRect(ctx, cx - 22, baseY - 6, 44, 10);
        // Parte abombada
        ctx.beginPath();
        ctx.ellipse(cx, baseY - 18, 22, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        // Pliegues decorativos
        ctx.strokeStyle = '#e8e8e8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 12, baseY - 25);
        ctx.lineTo(cx - 8, baseY - 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 12, baseY - 25);
        ctx.lineTo(cx + 8, baseY - 10);
        ctx.stroke();

        // Orejas
        ctx.fillStyle = c.skin;
        this.drawPixelRect(ctx, cx - 24, baseY + 20, 6, 14);
        this.drawPixelRect(ctx, cx + 18, baseY + 20, 6, 14);

        // === CARA (EXACTAMENTE igual que original) ===
        ctx.fillStyle = c.hair;
        if (eyebrowsAngry) {
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
            ctx.fillStyle = c.white;
            this.drawPixelRect(ctx, cx - 14, baseY + 26 + eyeOffsetY, 10, 10);
            this.drawPixelRect(ctx, cx + 4, baseY + 26 + eyeOffsetY, 10, 10);
            ctx.fillStyle = c.black;
            this.drawPixelRect(ctx, cx - 10 + eyeOffsetX, baseY + 28 + eyeOffsetY, 5, 6);
            this.drawPixelRect(ctx, cx + 6 + eyeOffsetX, baseY + 28 + eyeOffsetY, 5, 6);
            ctx.fillStyle = c.white;
            this.drawPixelRect(ctx, cx - 9 + eyeOffsetX, baseY + 29 + eyeOffsetY, 2, 2);
            this.drawPixelRect(ctx, cx + 7 + eyeOffsetX, baseY + 29 + eyeOffsetY, 2, 2);
        }

        // Nariz
        ctx.fillStyle = c.skinDark;
        this.drawPixelRect(ctx, cx - 4, baseY + 34, 8, 10);
        this.drawPixelRect(ctx, cx - 2, baseY + 42, 4, 4);

        // === BARBA (EXACTAMENTE igual que original) ===
        ctx.fillStyle = c.hair;
        this.drawPixelRect(ctx, cx - 16, baseY + 44, 32, 16);
        ctx.fillStyle = c.hairDark;
        this.drawPixelRect(ctx, cx - 12, baseY + 52, 24, 10);
        this.drawPixelRect(ctx, cx - 8, baseY + 58, 16, 6);

        // Boca
        if (mouthOpen) {
            ctx.fillStyle = c.red;
            const mouthHeight = mouthBig ? 10 : 6;
            this.drawPixelRect(ctx, cx - 8, baseY + 46, 16, mouthHeight);
            ctx.fillStyle = c.white;
            this.drawPixelRect(ctx, cx - 6, baseY + 46, 12, 3);
        }

        return canvas.toDataURL();
    },

    // Brazo con manga de chef
    drawArmChef(ctx, x, y, angle, isLeft) {
        const c = this.colors;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle * Math.PI / 180);

        // Brazo (chaqueta blanca)
        ctx.fillStyle = '#ffffff';
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

    // ==================== MAPAS INTERACTIVOS MEJORADOS ====================

    // Datos de países europeos con posiciones para el mapa interactivo (700x500)
    europeCountries: {
        'España': { x: 150, y: 350, capital: 'Madrid' },
        'Francia': { x: 230, y: 270, capital: 'París' },
        'Alemania': { x: 320, y: 210, capital: 'Berlín' },
        'Italia': { x: 340, y: 340, capital: 'Roma' },
        'Reino Unido': { x: 190, y: 170, capital: 'Londres' },
        'Portugal': { x: 100, y: 360, capital: 'Lisboa' },
        'Polonia': { x: 400, y: 200, capital: 'Varsovia' },
        'Suecia': { x: 360, y: 100, capital: 'Estocolmo' },
        'Noruega': { x: 320, y: 80, capital: 'Oslo' },
        'Finlandia': { x: 430, y: 90, capital: 'Helsinki' },
        'Grecia': { x: 450, y: 390, capital: 'Atenas' },
        'Países Bajos': { x: 270, y: 190, capital: 'Ámsterdam' },
        'Bélgica': { x: 260, y: 210, capital: 'Bruselas' },
        'Austria': { x: 360, y: 260, capital: 'Viena' },
        'Suiza': { x: 290, y: 280, capital: 'Berna' },
        'Irlanda': { x: 130, y: 170, capital: 'Dublín' },
        'Dinamarca': { x: 320, y: 150, capital: 'Copenhague' },
        'República Checa': { x: 370, y: 230, capital: 'Praga' },
        'Hungría': { x: 410, y: 270, capital: 'Budapest' },
        'Rumanía': { x: 470, y: 300, capital: 'Bucarest' },
        'Bulgaria': { x: 470, y: 340, capital: 'Sofía' },
        'Ucrania': { x: 520, y: 230, capital: 'Kiev' },
        'Rusia': { x: 580, y: 150, capital: 'Moscú' },
        'Turquía': { x: 550, y: 380, capital: 'Ankara' }
    },

    // Datos de países/ciudades del mundo con posiciones (700x500)
    worldLocations: {
        'China': { x: 540, y: 200, capital: 'Pekín', type: 'country' },
        'India': { x: 490, y: 260, capital: 'Nueva Delhi', type: 'country' },
        'Estados Unidos': { x: 120, y: 180, capital: 'Washington', type: 'country' },
        'Brasil': { x: 200, y: 340, capital: 'Brasilia', type: 'country' },
        'Rusia': { x: 480, y: 100, capital: 'Moscú', type: 'country' },
        'Japón': { x: 620, y: 200, capital: 'Tokio', type: 'country' },
        'México': { x: 100, y: 250, capital: 'Ciudad de México', type: 'country' },
        'Indonesia': { x: 570, y: 330, capital: 'Yakarta', type: 'country' },
        'Pakistán': { x: 460, y: 230, capital: 'Islamabad', type: 'country' },
        'Nigeria': { x: 330, y: 300, capital: 'Abuya', type: 'country' },
        'Bangladesh': { x: 510, y: 250, capital: 'Daca', type: 'country' },
        'Egipto': { x: 370, y: 230, capital: 'El Cairo', type: 'country' },
        'Filipinas': { x: 590, y: 280, capital: 'Manila', type: 'country' },
        'Vietnam': { x: 555, y: 270, capital: 'Hanói', type: 'country' },
        'Etiopía': { x: 390, y: 300, capital: 'Adís Abeba', type: 'country' },
        'Australia': { x: 600, y: 400, capital: 'Canberra', type: 'country' },
        'Argentina': { x: 180, y: 420, capital: 'Buenos Aires', type: 'country' },
        'Sudáfrica': { x: 370, y: 410, capital: 'Pretoria', type: 'country' },
        'Canadá': { x: 130, y: 120, capital: 'Ottawa', type: 'country' },
        'España': { x: 300, y: 190, capital: 'Madrid', type: 'country' }
    },

    // Crear mapa de Europa interactivo mejorado
    createEuropeMapLarge() {
        const canvas = document.createElement('canvas');
        canvas.width = 700;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Océano azul
        ctx.fillStyle = '#1a3a5a';
        ctx.fillRect(0, 0, 700, 500);

        // Función para dibujar país con borde
        const drawCountry = (points, color) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i][0], points[i][1]);
            }
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#0a2030';
            ctx.lineWidth = 2;
            ctx.stroke();
        };

        // Península Ibérica (España + Portugal)
        drawCountry([[80, 300], [200, 280], [220, 380], [180, 420], [80, 400]], '#c9a050');

        // Francia
        drawCountry([[200, 220], [300, 200], [320, 300], [260, 340], [200, 310]], '#7eb07e');

        // Reino Unido
        drawCountry([[160, 120], [230, 110], [240, 200], [180, 220], [155, 180]], '#d07070');

        // Irlanda
        drawCountry([[100, 130], [155, 130], [160, 200], [110, 200]], '#70b070');

        // Países Bajos, Bélgica, Alemania
        drawCountry([[250, 160], [400, 140], [420, 280], [340, 300], [260, 260]], '#d0a070');

        // Suiza, Austria
        drawCountry([[270, 260], [380, 240], [400, 290], [290, 310]], '#f0d0d0');

        // Italia
        drawCountry([[320, 280], [380, 260], [400, 320], [380, 420], [320, 400], [300, 340]], '#70a0d0');

        // Escandinavia (Noruega, Suecia, Finlandia)
        drawCountry([[280, 20], [480, 30], [500, 150], [420, 180], [340, 200], [300, 120]], '#a0c0a0');

        // Polonia
        drawCountry([[380, 170], [460, 160], [480, 240], [400, 260]], '#e0c090');

        // Europa del Este (Ucrania, etc.)
        drawCountry([[460, 140], [620, 100], [660, 280], [520, 320], [480, 240]], '#d0b080');

        // Balcanes y Grecia
        drawCountry([[400, 300], [500, 280], [520, 400], [420, 430], [380, 380]], '#b0d0b0');

        // Turquía
        drawCountry([[500, 340], [650, 320], [680, 420], [530, 440]], '#d09090');

        // Norte de África (referencia)
        ctx.fillStyle = '#6a5a4a';
        ctx.fillRect(50, 440, 500, 60);

        // Etiquetas de países principales
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;

        const labels = [
            ['ESPAÑA', 150, 355],
            ['PORTUGAL', 90, 380],
            ['FRANCIA', 250, 265],
            ['REINO UNIDO', 195, 160],
            ['IRLANDA', 130, 165],
            ['ALEMANIA', 340, 200],
            ['ITALIA', 350, 350],
            ['SUECIA', 370, 90],
            ['NORUEGA', 310, 70],
            ['FINLANDIA', 450, 100],
            ['POLONIA', 420, 200],
            ['UCRANIA', 550, 200],
            ['GRECIA', 460, 380],
            ['TURQUÍA', 580, 380]
        ];

        labels.forEach(([text, x, y]) => {
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        });

        // Marcadores de capitales (círculos rojos)
        ctx.fillStyle = '#ff4444';
        const capitals = [
            [150, 350], [100, 360], [230, 270], [190, 170], [130, 170],
            [320, 210], [340, 340], [360, 100], [320, 80], [430, 90],
            [400, 200], [520, 230], [450, 390], [550, 380]
        ];
        capitals.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        return canvas.toDataURL();
    },

    // Crear mapa del mundo interactivo mejorado
    createWorldMapLarge() {
        const canvas = document.createElement('canvas');
        canvas.width = 700;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Océano azul
        ctx.fillStyle = '#1a3a5a';
        ctx.fillRect(0, 0, 700, 500);

        // Función para dibujar continente
        const drawContinent = (points, color) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i][0], points[i][1]);
            }
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#0a2030';
            ctx.lineWidth = 2;
            ctx.stroke();
        };

        // América del Norte (Canadá + EEUU)
        drawContinent([
            [30, 50], [200, 40], [220, 120], [200, 200], [140, 220],
            [100, 280], [60, 250], [40, 160]
        ], '#7eb07e');

        // México y América Central
        drawContinent([
            [60, 220], [140, 220], [120, 300], [80, 320], [50, 280]
        ], '#a0c090');

        // América del Sur
        drawContinent([
            [120, 280], [240, 300], [260, 380], [220, 460], [140, 470], [100, 400], [100, 320]
        ], '#70a070');

        // Europa
        drawContinent([
            [280, 120], [380, 100], [400, 180], [360, 220], [300, 210], [270, 160]
        ], '#d0a080');

        // África
        drawContinent([
            [290, 220], [420, 200], [460, 300], [420, 420], [320, 450], [280, 360], [270, 280]
        ], '#c0a060');

        // Rusia / Norte de Asia
        drawContinent([
            [380, 50], [650, 40], [680, 140], [620, 180], [500, 200], [400, 160]
        ], '#b0c0a0');

        // Asia Central y del Sur (India, Pakistán, etc.)
        drawContinent([
            [420, 180], [540, 170], [560, 280], [500, 320], [440, 300], [420, 240]
        ], '#e0c090');

        // China y Este de Asia
        drawContinent([
            [500, 140], [620, 130], [640, 220], [600, 280], [520, 260], [500, 200]
        ], '#d0b080');

        // Sudeste Asiático
        drawContinent([
            [540, 260], [620, 250], [640, 350], [580, 380], [530, 340]
        ], '#90b090');

        // Japón
        drawContinent([
            [620, 170], [660, 160], [670, 230], [640, 250], [615, 210]
        ], '#f0c0c0');

        // Indonesia
        drawContinent([
            [540, 320], [620, 310], [630, 360], [560, 370]
        ], '#a0c0a0');

        // Australia
        drawContinent([
            [560, 370], [680, 360], [690, 440], [640, 470], [560, 450]
        ], '#d09060');

        // Etiquetas de continentes y países principales
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;

        const labels = [
            ['CANADÁ', 130, 100],
            ['EEUU', 120, 180],
            ['MÉXICO', 90, 260],
            ['BRASIL', 200, 360],
            ['ARGENTINA', 170, 430],
            ['EUROPA', 330, 170],
            ['RUSIA', 520, 100],
            ['CHINA', 560, 200],
            ['INDIA', 490, 280],
            ['JAPÓN', 640, 200],
            ['INDONESIA', 580, 340],
            ['AUSTRALIA', 620, 410],
            ['ÁFRICA', 360, 320],
            ['EGIPTO', 380, 230],
            ['NIGERIA', 340, 300]
        ];

        labels.forEach(([text, x, y]) => {
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        });

        // Marcadores de capitales/ciudades importantes (círculos rojos)
        ctx.fillStyle = '#ff4444';
        const cities = [
            [130, 120], [120, 180], [100, 250], [200, 340], [180, 420],
            [300, 190], [480, 100], [540, 200], [490, 260], [620, 200],
            [570, 330], [600, 400], [370, 230], [330, 300], [390, 300]
        ];
        cities.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        return canvas.toDataURL();
    }
};

// Hacer disponible globalmente
window.SpriteGenerator = SpriteGenerator;
