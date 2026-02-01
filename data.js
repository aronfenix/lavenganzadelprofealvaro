// ============================================================
// DATOS DEL JUEGO - Preguntas, frases, configuración
// ============================================================

const GAME_DATA = {
    // Configuración general
    config: {
        questionsPerLevel: 10,
        passingScore: 7,
        timePerQuestion: 20,
        basePoints: 100,
        comboMultiplier: 50
    },

    // NIVEL 1: Capitales de Europa
    capitalesEuropa: [
        { pregunta: "¿Cuál es la capital de Francia?", respuesta: "Paris", opciones: ["Paris", "Lyon", "Marsella", "Niza"], dato: "París tiene más de 2 millones de habitantes y la Torre Eiffel recibe 7 millones de visitantes al año." },
        { pregunta: "¿Cuál es la capital de Alemania?", respuesta: "Berlin", opciones: ["Munich", "Berlin", "Hamburgo", "Frankfurt"], dato: "Berlín estuvo dividida por un muro desde 1961 hasta 1989." },
        { pregunta: "¿Cuál es la capital de Italia?", respuesta: "Roma", opciones: ["Milan", "Napoles", "Roma", "Venecia"], dato: "Roma fue fundada en el año 753 a.C. y tiene casi 3000 años de historia." },
        { pregunta: "¿Cuál es la capital de Portugal?", respuesta: "Lisboa", opciones: ["Oporto", "Lisboa", "Faro", "Coimbra"], dato: "Lisboa fue destruida por un terremoto en 1755 y reconstruida completamente." },
        { pregunta: "¿Cuál es la capital de Polonia?", respuesta: "Varsovia", tipo: "escribir", dato: "Varsovia fue reconstruida casi totalmente después de la Segunda Guerra Mundial." },
        { pregunta: "¿Cuál es la capital de Austria?", respuesta: "Viena", opciones: ["Salzburgo", "Viena", "Graz", "Innsbruck"], dato: "Viena es considerada la capital mundial de la música clásica." },
        { pregunta: "¿Cuál es la capital de Bélgica?", respuesta: "Bruselas", opciones: ["Amberes", "Brujas", "Bruselas", "Gante"], dato: "Bruselas es la capital de facto de la Unión Europea." },
        { pregunta: "¿Cuál es la capital de Suecia?", respuesta: "Estocolmo", tipo: "escribir", dato: "Estocolmo está construida sobre 14 islas conectadas por 57 puentes." },
        { pregunta: "¿Cuál es la capital de Noruega?", respuesta: "Oslo", opciones: ["Bergen", "Oslo", "Trondheim", "Stavanger"], dato: "Oslo es una de las ciudades más caras del mundo." },
        { pregunta: "¿Cuál es la capital de Finlandia?", respuesta: "Helsinki", tipo: "escribir", dato: "Helsinki es la capital más al norte de la UE continental." },
        { pregunta: "¿Cuál es la capital de Dinamarca?", respuesta: "Copenhague", opciones: ["Aarhus", "Odense", "Copenhague", "Aalborg"], dato: "Copenhague tiene la estatua de la Sirenita desde 1913." },
        { pregunta: "¿Cuál es la capital de Países Bajos?", respuesta: "Amsterdam", opciones: ["Rotterdam", "La Haya", "Amsterdam", "Utrecht"], dato: "Amsterdam tiene más de 1.500 puentes y 100 km de canales." },
        { pregunta: "¿Cuál es la capital de Grecia?", respuesta: "Atenas", tipo: "escribir", dato: "Atenas es cuna de la democracia y la filosofía occidental." },
        { pregunta: "¿Cuál es la capital de Hungría?", respuesta: "Budapest", opciones: ["Debrecen", "Budapest", "Szeged", "Pecs"], dato: "Budapest se formó uniendo tres ciudades: Buda, Pest y Óbuda." },
        { pregunta: "¿Cuál es la capital de Rep. Checa?", respuesta: "Praga", opciones: ["Brno", "Praga", "Ostrava", "Plzen"], dato: "Praga es conocida como 'La Ciudad de las Cien Torres'." },
        { pregunta: "¿Cuál es la capital de Rumanía?", respuesta: "Bucarest", tipo: "escribir", dato: "Bucarest tiene el segundo edificio administrativo más grande del mundo." },
        { pregunta: "¿Cuál es la capital de Irlanda?", respuesta: "Dublin", opciones: ["Cork", "Dublin", "Galway", "Limerick"], dato: "Dublín es la ciudad natal de escritores como James Joyce y Oscar Wilde." },
        { pregunta: "¿Cuál es la capital de Suiza?", respuesta: "Berna", opciones: ["Zurich", "Ginebra", "Berna", "Basilea"], dato: "Berna, no Zúrich ni Ginebra, es la capital de Suiza desde 1848." },
        { pregunta: "¿Cuál es la capital de Croacia?", respuesta: "Zagreb", tipo: "escribir", dato: "Zagreb tiene el cementerio Mirogoj, considerado uno de los más bellos de Europa." },
        { pregunta: "¿Cuál es la capital de Serbia?", respuesta: "Belgrado", opciones: ["Novi Sad", "Belgrado", "Nis", "Kragujevac"], dato: "Belgrado significa 'Ciudad Blanca' y está en la confluencia de dos ríos." },
        { pregunta: "¿Cuál es la capital de Bulgaria?", respuesta: "Sofia", tipo: "escribir", dato: "Sofía es la tercera capital más antigua de Europa." },
        { pregunta: "¿Cuál es la capital de Eslovaquia?", respuesta: "Bratislava", opciones: ["Kosice", "Bratislava", "Presov", "Zilina"], dato: "Bratislava es la única capital que hace frontera con dos países." },
        { pregunta: "¿Cuál es la capital de Ucrania?", respuesta: "Kiev", opciones: ["Jarkov", "Kiev", "Odesa", "Lviv"], dato: "Kiev tiene más de 1.500 años de historia." },
        { pregunta: "¿Cuál es la capital de Eslovenia?", respuesta: "Liubliana", tipo: "escribir", dato: "Liubliana es conocida por su castillo medieval y su dragón símbolo." },
        { pregunta: "¿Cuál es la capital de Albania?", respuesta: "Tirana", opciones: ["Durres", "Tirana", "Vlore", "Shkoder"], dato: "Tirana es una de las capitales más jóvenes de Europa, fundada en 1614." }
    ],

    // NIVEL 2: Países más poblados
    paisesPoblados: [
        { pregunta: "¿Cuál es el país MÁS poblado del mundo?", respuesta: "India", opciones: ["China", "India", "EEUU", "Indonesia"], dato: "India superó a China en 2023 con más de 1.400 millones de habitantes." },
        { pregunta: "¿Cuál es el 2º país más poblado?", respuesta: "China", opciones: ["India", "China", "EEUU", "Indonesia"], dato: "China tiene más de 1.400 millones de habitantes y la Gran Muralla." },
        { pregunta: "¿Cuál es el 3er país más poblado?", respuesta: "Estados Unidos", tipo: "escribir", dato: "EEUU tiene más de 330 millones de habitantes." },
        { pregunta: "¿Qué país tiene más población: Brasil o Indonesia?", respuesta: "Indonesia", opciones: ["Brasil", "Indonesia"], dato: "Indonesia tiene 275 millones vs Brasil con 215 millones." },
        { pregunta: "Pakistán es el ___ país más poblado", respuesta: "Quinto", opciones: ["Cuarto", "Quinto", "Sexto", "Séptimo"], dato: "Pakistán tiene más de 230 millones de habitantes." },
        { pregunta: "¿Qué país africano es el más poblado?", respuesta: "Nigeria", tipo: "escribir", dato: "Nigeria tiene más de 220 millones de habitantes." },
        { pregunta: "¿Bangladesh supera los 170 millones?", respuesta: "Si", opciones: ["Sí", "No"], dato: "Bangladesh tiene más de 170 millones en un territorio muy pequeño." },
        { pregunta: "¿Cuál de estos países tiene más población?", respuesta: "Rusia", opciones: ["Alemania", "Francia", "Rusia", "Reino Unido"], dato: "Rusia tiene 144 millones, Alemania 84, Francia 68 y UK 67." },
        { pregunta: "¿Cuál es el país más poblado de Sudamérica?", respuesta: "Brasil", tipo: "escribir", dato: "Brasil tiene más de 215 millones de habitantes." },
        { pregunta: "¿México tiene más población que Japón?", respuesta: "Si", opciones: ["Sí", "No"], dato: "México: 130 millones, Japón: 125 millones." },
        { pregunta: "¿Filipinas supera los 110 millones?", respuesta: "Si", opciones: ["Sí", "No"], dato: "Filipinas tiene más de 115 millones de habitantes." },
        { pregunta: "¿Cuál es el país más poblado de Europa?", respuesta: "Rusia", opciones: ["Alemania", "Francia", "Rusia", "Reino Unido"], dato: "Si contamos la parte europea de Rusia, es el más poblado." },
        { pregunta: "¿Etiopía está en el top 15 de población?", respuesta: "Si", opciones: ["Sí", "No"], dato: "Etiopía tiene más de 120 millones de habitantes." },
        { pregunta: "¿Vietnam tiene más población que Alemania?", respuesta: "Si", opciones: ["Sí", "No"], dato: "Vietnam: 100 millones, Alemania: 84 millones." },
        { pregunta: "¿Egipto supera los 100 millones?", respuesta: "Si", opciones: ["Sí", "No"], dato: "Egipto superó los 100 millones en 2020." },
        { pregunta: "¿Qué país tiene más: Turquía o Irán?", respuesta: "Turquia", opciones: ["Turquía", "Irán"], dato: "Turquía: 85 millones, Irán: 87 millones. ¡Muy similar!" },
        { pregunta: "¿Tailandia supera los 70 millones?", respuesta: "Si", opciones: ["Sí", "No"], dato: "Tailandia tiene aproximadamente 72 millones de habitantes." },
        { pregunta: "¿Cuál NO está en el top 10 de población?", respuesta: "Mexico", opciones: ["Brasil", "Nigeria", "México", "Bangladesh"], dato: "México es el 10º-11º, muy cerca del top 10." },
        { pregunta: "¿República del Congo supera 100 millones?", respuesta: "Si", opciones: ["Sí", "No"], dato: "La Rep. Dem. del Congo tiene más de 100 millones." },
        { pregunta: "¿Qué continente tiene más países en top 10?", respuesta: "Asia", tipo: "escribir", dato: "Asia tiene 6 de los 10 países más poblados del mundo." }
    ],

    // NIVEL 3: Ciudades más pobladas
    ciudadesPobladas: [
        { pregunta: "¿Cuál es la ciudad MÁS poblada del mundo?", respuesta: "Tokio", opciones: ["Nueva York", "Tokio", "Shanghai", "Delhi"], dato: "El área metropolitana de Tokio tiene más de 37 millones de habitantes." },
        { pregunta: "Delhi es la capital de...", respuesta: "India", tipo: "escribir", dato: "Delhi tiene más de 32 millones de habitantes en su área metropolitana." },
        { pregunta: "¿Shanghái supera los 27 millones?", respuesta: "Si", opciones: ["Sí", "No"], dato: "Shanghái tiene más de 28 millones y es la más poblada de China." },
        { pregunta: "¿Cuál es la ciudad más poblada de América?", respuesta: "Sao Paulo", opciones: ["C. México", "Nueva York", "São Paulo", "Buenos Aires"], dato: "São Paulo tiene más de 22 millones en su área metropolitana." },
        { pregunta: "¿Pekín es más poblada que Nueva York?", respuesta: "Si", opciones: ["Sí", "No"], dato: "Pekín: 21 millones, Nueva York: 18 millones." },
        { pregunta: "¿En qué país está Mumbai?", respuesta: "India", opciones: ["Pakistán", "India", "Bangladesh", "Nepal"], dato: "Mumbai es la capital financiera de India con más de 21 millones." },
        { pregunta: "¿Cuál es la ciudad más poblada de África?", respuesta: "Lagos", tipo: "escribir", dato: "Lagos (Nigeria) tiene más de 15 millones de habitantes." },
        { pregunta: "¿Osaka está en Japón?", respuesta: "Si", opciones: ["Sí", "No"], dato: "Osaka es la segunda ciudad de Japón con 19 millones." },
        { pregunta: "¿El Cairo supera los 20 millones?", respuesta: "Si", opciones: ["Sí", "No"], dato: "El Cairo tiene más de 21 millones en su área metropolitana." },
        { pregunta: "¿Cuál es la ciudad más poblada de Europa?", respuesta: "Moscu", opciones: ["Londres", "París", "Moscú", "Estambul"], dato: "Moscú tiene más de 12 millones de habitantes." },
        { pregunta: "¿Estambul está en dos continentes?", respuesta: "Si", opciones: ["Sí", "No"], dato: "Estambul está entre Europa y Asia, dividida por el Bósforo." },
        { pregunta: "¿Karachi es la ciudad más grande de Pakistán?", respuesta: "Si", opciones: ["Sí", "No"], dato: "Karachi tiene más de 16 millones de habitantes." },
        { pregunta: "¿En qué país está Yakarta?", respuesta: "Indonesia", tipo: "escribir", dato: "Yakarta tiene más de 11 millones y se está hundiendo." },
        { pregunta: "¿Manila es la capital de Filipinas?", respuesta: "Si", opciones: ["Sí", "No"], dato: "Manila tiene más de 14 millones en su área metropolitana." },
        { pregunta: "¿Bangkok supera los 10 millones?", respuesta: "Si", opciones: ["Sí", "No"], dato: "Bangkok tiene más de 11 millones de habitantes." },
        { pregunta: "¿Qué ciudad tiene MÁS población?", respuesta: "Lima", opciones: ["Madrid", "Lima", "Roma", "Berlín"], dato: "Lima tiene 11 millones, Madrid 6.7, Roma 4.3, Berlín 3.6." },
        { pregunta: "¿Hong Kong supera los 7 millones?", respuesta: "Si", opciones: ["Sí", "No"], dato: "Hong Kong tiene aproximadamente 7.5 millones de habitantes." },
        { pregunta: "Bogotá es la capital de...", respuesta: "Colombia", tipo: "escribir", dato: "Bogotá tiene más de 8 millones de habitantes." },
        { pregunta: "¿Seúl tiene más población que Londres?", respuesta: "Si", opciones: ["Sí", "No"], dato: "Seúl: 9.7 millones, Londres: 9 millones." },
        { pregunta: "¿Río de Janeiro es más poblada que Buenos Aires?", respuesta: "Si", opciones: ["Sí", "No"], dato: "Río: 13 millones, Buenos Aires: 15 millones. ¡Buenos Aires es mayor!" }
    ],

    // Frases del profesor por situación
    frases: {
        intro: [
            "Bienvenido a mi reino del conocimiento...",
            "He preparado este examen durante años...",
            "Nadie ha conseguido derrotarme jamás...",
            "Tu ignorancia será mi victoria..."
        ],
        inicio: [
            "¡Muajajaja! ¡Prepárate para sufrir!",
            "¡Nadie aprueba mis exámenes!",
            "¡Tu perdición empieza ahora!",
            "¡Vas a conocer el verdadero fracaso!",
            "¡Mi venganza será terrible!"
        ],
        correcta: [
            "¡Grrr... Suerte de principiante!",
            "¡Imposible! ¡Has debido copiar!",
            "Esto no quedará así...",
            "¡Era demasiado fácil esa!",
            "¡No te emociones todavía!",
            "¡Un reloj roto acierta dos veces!",
            "¡Casualidad, pura casualidad!"
        ],
        incorrecta: [
            "¡JAJAJA! ¡Lo sabía!",
            "¡MUAJAJA! ¡Otro que cae!",
            "¡Delicioso fracaso!",
            "¡Música para mis oídos!",
            "¡Eso es! ¡SUSPENDE!",
            "¡Tu ignorancia me alimenta!",
            "¡Sabía que fallarías!"
        ],
        combo: [
            "¡No puede ser! ¡Para ya!",
            "¡¿Cómo es posible?!",
            "¡Estás haciendo trampa!",
            "¡Esto es inaceptable!"
        ],
        powerup: [
            "¡No! ¡Mis trampas!",
            "¡Eso es hacer trampa!",
            "¡Malditos power-ups!"
        ],
        pocasVidas: [
            "¡Jeje! ¡Ya casi caes!",
            "¡Una vida más y serás mío!",
            "¡Puedo saborear tu derrota!"
        ],
        nivelSuperado: [
            "¡Imposible! ¡Has tenido mucha suerte!",
            "¡Grrr! ¡El siguiente nivel será PEOR!",
            "¡Maldición! ¡Pero no durará tu racha!",
            "¡Prepárate para lo que viene!"
        ],
        nivelFallido: [
            "¡JAJAJAJA! ¡SABÍA QUE FRACASARÍAS!",
            "¡MUAJAJAJA! ¡OTRO ALUMNO DESTRUIDO!",
            "¡DELICIOSO! ¡TU DERROTA ME ALIMENTA!",
            "¡ERA OBVIO! ¡NADIE PUEDE CONMIGO!"
        ],
        victoriaFinal: [
            "¡NO! ¡IMPOSIBLE! ¡Has derrotado mi examen!",
            "¡Mi venganza... arruinada... por un estudiante!",
            "¡Maldición! ¡Tendré que hacer uno MÁS difícil!",
            "¡Noooo! ¡El conocimiento ha ganado!"
        ],
        derrotaFinal: [
            "¡MUAJAJAJAJA! ¡MI VENGANZA ESTÁ COMPLETA!",
            "¡EXCELENTE! ¡Otro estudiante DESTRUIDO!",
            "¡JAJAJA! ¡Vuelve cuando hayas ESTUDIADO!",
            "¡El fracaso es tu destino!"
        ],
        tiempoAgotado: [
            "¡JAJAJA! ¡Demasiado lento!",
            "¡El tiempo es mi aliado!",
            "¡Tick tock! ¡Perdiste!"
        ]
    },

    // Información de niveles
    niveles: [
        {
            id: 1,
            nombre: "CAPITALES DE EUROPA",
            descripcion: "El profesor te ha encerrado en su AULA MALDITA. Demuestra que conoces las capitales europeas para escapar.",
            escenario: "classroom",
            musica: "level1",
            color: "#4ecca3"
        },
        {
            id: 2,
            nombre: "PAÍSES MÁS POBLADOS",
            descripcion: "Has llegado a la BIBLIOTECA OSCURA. Los libros susurran datos de población... ¿los conoces?",
            escenario: "library",
            musica: "level2",
            color: "#e94560"
        },
        {
            id: 3,
            nombre: "CIUDADES MÁS POBLADAS",
            descripcion: "El LABORATORIO SECRETO del profesor. Aquí experimenta con las mentes de sus alumnos...",
            escenario: "laboratory",
            musica: "level3",
            color: "#ffd700"
        },
        {
            id: 4,
            nombre: "EXAMEN FINAL",
            descripcion: "¡EL CASTILLO DEL PROFESOR! Todo lo aprendido se pone a prueba. ¡Derrótalo de una vez por todas!",
            escenario: "castle",
            musica: "boss",
            color: "#ff6b6b"
        }
    ],

    // Historia del juego
    historia: {
        intro: [
            { personaje: "narrador", texto: "En una escuela aparentemente normal..." },
            { personaje: "narrador", texto: "Un profesor de geografía guardaba un oscuro secreto..." },
            { personaje: "profesor", texto: "¡Muajajaja! ¡Llevo años preparando mi venganza!" },
            { personaje: "profesor", texto: "¡Estoy harto de que mis alumnos no estudien!" },
            { personaje: "profesor", texto: "He creado el EXAMEN DEFINITIVO..." },
            { personaje: "profesor", texto: "¡Un examen del que NADIE puede escapar!" },
            { personaje: "narrador", texto: "Pero un valiente estudiante decidió enfrentarlo..." },
            { personaje: "narrador", texto: "¿Podrás derrotar al PROFESOR ÁLVARO?" }
        ],
        nivel1Intro: [
            { personaje: "profesor", texto: "¡Bienvenido a mi AULA MALDITA!" },
            { personaje: "profesor", texto: "¿Crees que conoces las capitales de Europa?" },
            { personaje: "profesor", texto: "¡Prepárate para la HUMILLACIÓN!" }
        ],
        nivel2Intro: [
            { personaje: "profesor", texto: "¡Vaya! Has sobrevivido al primer nivel..." },
            { personaje: "profesor", texto: "Pero mi BIBLIOTECA OSCURA será tu tumba." },
            { personaje: "profesor", texto: "¿Cuánto sabes sobre población mundial?" }
        ],
        nivel3Intro: [
            { personaje: "profesor", texto: "¡¿Cómo es posible que sigas aquí?!" },
            { personaje: "profesor", texto: "Mi LABORATORIO SECRETO te destruirá." },
            { personaje: "profesor", texto: "Las ciudades del mundo... ¡serán tu perdición!" }
        ],
        nivel4Intro: [
            { personaje: "profesor", texto: "¡IMPOSIBLE! ¡Has llegado a mi CASTILLO!" },
            { personaje: "profesor", texto: "¡Este es el EXAMEN FINAL!" },
            { personaje: "profesor", texto: "¡TODO lo que has aprendido... A PRUEBA!" },
            { personaje: "profesor", texto: "¡NADIE ha llegado tan lejos! ¡NADIE!" }
        ]
    },

    // Tips de aprendizaje
    tips: [
        "Las capitales no siempre son las ciudades más grandes del país.",
        "Asia concentra más del 60% de la población mundial.",
        "Tokio es la megalópolis más grande, no la ciudad más densa.",
        "Muchas capitales europeas están junto a grandes ríos.",
        "India superó a China como país más poblado en 2023.",
        "Lagos crece tan rápido que podría ser la mayor ciudad en 2100.",
        "Europa tiene más de 40 países independientes.",
        "El 55% de la población mundial vive en ciudades."
    ]
};

// Hacer disponible globalmente
window.GAME_DATA = GAME_DATA;
