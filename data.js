// ============================================================
// DATOS DEL JUEGO - Preguntas, frases, configuración
// ============================================================

const GAME_DATA = {
    // Configuración general
    config: {
        questionsPerLevel: 10,
        passingScore: 7,
        timePerQuestion: 25,
        basePoints: 100,
        comboMultiplier: 50
    },

    // Lista de todas las capitales europeas (para opciones)
    capitalesLista: [
        "Madrid", "París", "Berlín", "Roma", "Lisboa", "Londres", "Varsovia",
        "Viena", "Bruselas", "Estocolmo", "Oslo", "Helsinki", "Copenhague",
        "Ámsterdam", "Atenas", "Budapest", "Praga", "Bucarest", "Dublín",
        "Berna", "Zagreb", "Belgrado", "Sofía", "Bratislava", "Kiev",
        "Liubliana", "Tirana", "Minsk", "Moscú", "Vilna", "Riga", "Tallin"
    ],

    // NIVEL 1: Capitales de Europa (opciones = otras capitales)
    capitalesEuropa: [
        { pregunta: "¿Cuál es la capital de Francia?", respuesta: "París", dato: "París tiene más de 2 millones de habitantes y la Torre Eiffel recibe 7 millones de visitantes al año." },
        { pregunta: "¿Cuál es la capital de Alemania?", respuesta: "Berlín", dato: "Berlín estuvo dividida por un muro desde 1961 hasta 1989." },
        { pregunta: "¿Cuál es la capital de Italia?", respuesta: "Roma", dato: "Roma fue fundada en el año 753 a.C. y tiene casi 3000 años de historia." },
        { pregunta: "¿Cuál es la capital de Portugal?", respuesta: "Lisboa", dato: "Lisboa fue destruida por un terremoto en 1755 y reconstruida completamente." },
        { pregunta: "¿Cuál es la capital de Polonia?", respuesta: "Varsovia", dato: "Varsovia fue reconstruida casi totalmente después de la Segunda Guerra Mundial." },
        { pregunta: "¿Cuál es la capital de Austria?", respuesta: "Viena", dato: "Viena es considerada la capital mundial de la música clásica." },
        { pregunta: "¿Cuál es la capital de Bélgica?", respuesta: "Bruselas", dato: "Bruselas es la capital de facto de la Unión Europea." },
        { pregunta: "¿Cuál es la capital de Suecia?", respuesta: "Estocolmo", dato: "Estocolmo está construida sobre 14 islas conectadas por 57 puentes." },
        { pregunta: "¿Cuál es la capital de Noruega?", respuesta: "Oslo", dato: "Oslo es una de las ciudades más caras del mundo." },
        { pregunta: "¿Cuál es la capital de Finlandia?", respuesta: "Helsinki", dato: "Helsinki es la capital más al norte de la UE continental." },
        { pregunta: "¿Cuál es la capital de Dinamarca?", respuesta: "Copenhague", dato: "Copenhague tiene la estatua de la Sirenita desde 1913." },
        { pregunta: "¿Cuál es la capital de Países Bajos?", respuesta: "Ámsterdam", dato: "Ámsterdam tiene más de 1.500 puentes y 100 km de canales." },
        { pregunta: "¿Cuál es la capital de Grecia?", respuesta: "Atenas", dato: "Atenas es cuna de la democracia y la filosofía occidental." },
        { pregunta: "¿Cuál es la capital de Hungría?", respuesta: "Budapest", dato: "Budapest se formó uniendo tres ciudades: Buda, Pest y Óbuda." },
        { pregunta: "¿Cuál es la capital de República Checa?", respuesta: "Praga", dato: "Praga es conocida como 'La Ciudad de las Cien Torres'." },
        { pregunta: "¿Cuál es la capital de Rumanía?", respuesta: "Bucarest", dato: "Bucarest tiene el segundo edificio administrativo más grande del mundo." },
        { pregunta: "¿Cuál es la capital de Irlanda?", respuesta: "Dublín", dato: "Dublín es la ciudad natal de escritores como James Joyce y Oscar Wilde." },
        { pregunta: "¿Cuál es la capital de Suiza?", respuesta: "Berna", dato: "Berna, no Zúrich ni Ginebra, es la capital de Suiza desde 1848." },
        { pregunta: "¿Cuál es la capital de Croacia?", respuesta: "Zagreb", dato: "Zagreb tiene el cementerio Mirogoj, considerado uno de los más bellos de Europa." },
        { pregunta: "¿Cuál es la capital de Serbia?", respuesta: "Belgrado", dato: "Belgrado significa 'Ciudad Blanca' y está en la confluencia del Danubio y el Sava." },
        { pregunta: "¿Cuál es la capital de Bulgaria?", respuesta: "Sofía", dato: "Sofía es la tercera capital más antigua de Europa." },
        { pregunta: "¿Cuál es la capital de Eslovaquia?", respuesta: "Bratislava", dato: "Bratislava es la única capital que hace frontera con dos países." },
        { pregunta: "¿Cuál es la capital de Ucrania?", respuesta: "Kiev", dato: "Kiev tiene más de 1.500 años de historia." },
        { pregunta: "¿Cuál es la capital de Eslovenia?", respuesta: "Liubliana", dato: "Liubliana es conocida por su castillo medieval y su dragón símbolo." },
        { pregunta: "¿Cuál es la capital de Albania?", respuesta: "Tirana", dato: "Tirana es una de las capitales más jóvenes de Europa, fundada en 1614." },
        { pregunta: "¿Cuál es la capital de Reino Unido?", respuesta: "Londres", dato: "Londres fue la ciudad más poblada del mundo en el siglo XIX." },
        { pregunta: "¿Cuál es la capital de Rusia?", respuesta: "Moscú", dato: "Moscú tiene el metro más profundo del mundo y estaciones como palacios." },
        { pregunta: "¿Cuál es la capital de Lituania?", respuesta: "Vilna", dato: "Vilna tiene uno de los cascos antiguos más grandes de Europa del Este." },
        { pregunta: "¿Cuál es la capital de Letonia?", respuesta: "Riga", dato: "Riga es famosa por su arquitectura Art Nouveau." },
        { pregunta: "¿Cuál es la capital de Estonia?", respuesta: "Tallin", dato: "Tallin tiene una de las ciudades medievales mejor conservadas de Europa." }
    ],

    // TOP 20 PAÍSES MÁS POBLADOS DEL MUNDO (2024)
    top20Paises: [
        { posicion: 1, nombre: "India", poblacion: "1.440 millones", continente: "Asia", dato: "India superó a China como el país más poblado en 2023." },
        { posicion: 2, nombre: "China", poblacion: "1.425 millones", continente: "Asia", dato: "China tuvo la política del hijo único durante décadas." },
        { posicion: 3, nombre: "Estados Unidos", poblacion: "340 millones", continente: "América", dato: "EEUU es el tercer país más poblado y también uno de los más grandes." },
        { posicion: 4, nombre: "Indonesia", poblacion: "277 millones", continente: "Asia", dato: "Indonesia está formada por más de 17.000 islas." },
        { posicion: 5, nombre: "Pakistán", poblacion: "240 millones", continente: "Asia", dato: "Pakistán se independizó de India en 1947." },
        { posicion: 6, nombre: "Nigeria", poblacion: "230 millones", continente: "África", dato: "Nigeria es el país más poblado de África." },
        { posicion: 7, nombre: "Brasil", poblacion: "216 millones", continente: "América", dato: "Brasil es el país más poblado de Sudamérica y habla portugués." },
        { posicion: 8, nombre: "Bangladés", poblacion: "175 millones", continente: "Asia", dato: "Bangladés es uno de los países más densamente poblados del mundo." },
        { posicion: 9, nombre: "Rusia", poblacion: "144 millones", continente: "Europa/Asia", dato: "Rusia es el país más grande del mundo en superficie." },
        { posicion: 10, nombre: "México", poblacion: "130 millones", continente: "América", dato: "México es el país hispanohablante más poblado del mundo." },
        { posicion: 11, nombre: "Etiopía", poblacion: "130 millones", continente: "África", dato: "Etiopía nunca fue colonizada por europeos." },
        { posicion: 12, nombre: "Japón", poblacion: "124 millones", continente: "Asia", dato: "Japón tiene una de las poblaciones más envejecidas del mundo." },
        { posicion: 13, nombre: "Filipinas", poblacion: "117 millones", continente: "Asia", dato: "Filipinas está formada por más de 7.000 islas." },
        { posicion: 14, nombre: "Egipto", poblacion: "112 millones", continente: "África", dato: "El 95% de los egipcios vive junto al río Nilo." },
        { posicion: 15, nombre: "Vietnam", poblacion: "100 millones", continente: "Asia", dato: "Vietnam tiene forma de S y costa de más de 3.000 km." },
        { posicion: 16, nombre: "Rep. Dem. Congo", poblacion: "102 millones", continente: "África", dato: "El Congo tiene el segundo río más caudaloso del mundo." },
        { posicion: 17, nombre: "Irán", poblacion: "90 millones", continente: "Asia", dato: "Irán era conocido como Persia hasta 1935." },
        { posicion: 18, nombre: "Turquía", poblacion: "86 millones", continente: "Europa/Asia", dato: "Turquía está en dos continentes: Europa y Asia." },
        { posicion: 19, nombre: "Alemania", poblacion: "84 millones", continente: "Europa", dato: "Alemania es el país más poblado de la Unión Europea." },
        { posicion: 20, nombre: "Tailandia", poblacion: "72 millones", continente: "Asia", dato: "Tailandia significa 'Tierra de los libres' y nunca fue colonizada." }
    ],

    // TOP 20 CIUDADES MÁS POBLADAS DEL MUNDO (áreas metropolitanas, 2024)
    top20Ciudades: [
        { posicion: 1, nombre: "Tokio", poblacion: "37 millones", pais: "Japón", continente: "Asia", dato: "Tokio es la megalópolis más grande del planeta." },
        { posicion: 2, nombre: "Delhi", poblacion: "32 millones", pais: "India", continente: "Asia", dato: "Delhi es una de las ciudades más antiguas del mundo, con 5000 años." },
        { posicion: 3, nombre: "Shanghái", poblacion: "29 millones", pais: "China", continente: "Asia", dato: "Shanghái es el puerto con más tráfico del mundo." },
        { posicion: 4, nombre: "São Paulo", poblacion: "22 millones", pais: "Brasil", continente: "América", dato: "São Paulo tiene la mayor comunidad japonesa fuera de Japón." },
        { posicion: 5, nombre: "Ciudad de México", poblacion: "22 millones", pais: "México", continente: "América", dato: "Ciudad de México está construida sobre un lago desecado." },
        { posicion: 6, nombre: "El Cairo", poblacion: "21 millones", pais: "Egipto", continente: "África", dato: "El Cairo está junto a las pirámides de Giza." },
        { posicion: 7, nombre: "Bombay (Mumbai)", poblacion: "21 millones", pais: "India", continente: "Asia", dato: "Bombay es la capital financiera de India y sede de Bollywood." },
        { posicion: 8, nombre: "Pekín", poblacion: "21 millones", pais: "China", continente: "Asia", dato: "Pekín (Beijing) significa 'Capital del Norte' en chino." },
        { posicion: 9, nombre: "Daca", poblacion: "19 millones", pais: "Bangladés", continente: "Asia", dato: "Daca es una de las ciudades con mayor densidad del mundo." },
        { posicion: 10, nombre: "Osaka", poblacion: "19 millones", pais: "Japón", continente: "Asia", dato: "Osaka es conocida como la 'cocina de Japón'." },
        { posicion: 11, nombre: "Nueva York", poblacion: "18 millones", pais: "Estados Unidos", continente: "América", dato: "Nueva York tiene más de 800 idiomas hablados." },
        { posicion: 12, nombre: "Karachi", poblacion: "17 millones", pais: "Pakistán", continente: "Asia", dato: "Karachi es el principal puerto y centro financiero de Pakistán." },
        { posicion: 13, nombre: "Buenos Aires", poblacion: "15 millones", pais: "Argentina", continente: "América", dato: "Buenos Aires es conocida como el 'París de Sudamérica'." },
        { posicion: 14, nombre: "Calcuta", poblacion: "15 millones", pais: "India", continente: "Asia", dato: "Calcuta fue capital de la India británica hasta 1911." },
        { posicion: 15, nombre: "Estambul", poblacion: "15 millones", pais: "Turquía", continente: "Europa/Asia", dato: "Estambul es la única ciudad del mundo en dos continentes." },
        { posicion: 16, nombre: "Lagos", poblacion: "15 millones", pais: "Nigeria", continente: "África", dato: "Lagos es la ciudad más poblada de África." },
        { posicion: 17, nombre: "Kinshasa", poblacion: "14 millones", pais: "Rep. Dem. Congo", continente: "África", dato: "Kinshasa es la mayor ciudad francófona del mundo." },
        { posicion: 18, nombre: "Manila", poblacion: "14 millones", pais: "Filipinas", continente: "Asia", dato: "Manila es una de las ciudades más densamente pobladas." },
        { posicion: 19, nombre: "Río de Janeiro", poblacion: "13 millones", pais: "Brasil", continente: "América", dato: "Río fue capital de Brasil hasta 1960." },
        { posicion: 20, nombre: "Guangzhou", poblacion: "13 millones", pais: "China", continente: "Asia", dato: "Guangzhou (Cantón) es cuna de la cocina cantonesa." }
    ],

    // NIVEL 2: Preguntas sobre los 20 países más poblados
    paisesPoblados: [
        // Identificar cuáles están en el top 20
        { pregunta: "¿Cuál es el país MÁS poblado del mundo?", respuesta: "India", opciones: ["China", "India", "Estados Unidos", "Indonesia"], dato: "India superó a China en 2023 con más de 1.440 millones." },
        { pregunta: "¿Cuál es el SEGUNDO país más poblado?", respuesta: "China", opciones: ["India", "China", "Estados Unidos", "Rusia"], dato: "China tiene 1.425 millones de habitantes." },
        { pregunta: "¿Qué país es el más poblado de AMÉRICA?", respuesta: "Estados Unidos", opciones: ["Brasil", "México", "Estados Unidos", "Argentina"], dato: "EEUU tiene 340 millones, Brasil 216 y México 130." },
        { pregunta: "¿Qué país es el más poblado de ÁFRICA?", respuesta: "Nigeria", opciones: ["Egipto", "Sudáfrica", "Nigeria", "Etiopía"], dato: "Nigeria tiene 230 millones de habitantes." },
        { pregunta: "¿Qué país es el más poblado de EUROPA?", respuesta: "Rusia", opciones: ["Alemania", "Francia", "Rusia", "Reino Unido"], dato: "Rusia tiene 144 millones; Alemania 84 millones." },

        // Ubicación por continente
        { pregunta: "¿En qué continente está INDONESIA?", respuesta: "Asia", opciones: ["Asia", "África", "Oceanía", "América"], dato: "Indonesia está en el sudeste asiático, formada por 17.000 islas." },
        { pregunta: "¿En qué continente está NIGERIA?", respuesta: "África", opciones: ["Asia", "África", "América", "Europa"], dato: "Nigeria está en África Occidental." },
        { pregunta: "¿En qué continente está BANGLADÉS?", respuesta: "Asia", opciones: ["Asia", "África", "Europa", "Oceanía"], dato: "Bangladés está en el sur de Asia, junto a India." },
        { pregunta: "¿En qué continente está ETIOPÍA?", respuesta: "África", opciones: ["Asia", "África", "América", "Europa"], dato: "Etiopía está en el Cuerno de África, al este del continente." },
        { pregunta: "¿En qué continente está PAKISTÁN?", respuesta: "Asia", opciones: ["Asia", "África", "Europa", "Oceanía"], dato: "Pakistán está en el sur de Asia, entre India e Irán." },

        // Comparaciones
        { pregunta: "¿Qué país tiene MÁS población?", respuesta: "Indonesia", opciones: ["Indonesia", "Brasil", "Japón", "Alemania"], dato: "Indonesia: 277M, Brasil: 216M, Japón: 124M, Alemania: 84M." },
        { pregunta: "¿Qué país tiene MÁS población?", respuesta: "Pakistán", opciones: ["Pakistán", "Rusia", "México", "Egipto"], dato: "Pakistán: 240M, Rusia: 144M, México: 130M, Egipto: 112M." },
        { pregunta: "¿Qué país tiene MÁS población?", respuesta: "Vietnam", opciones: ["Vietnam", "Alemania", "Francia", "España"], dato: "Vietnam: 100M, Alemania: 84M, Francia: 68M, España: 48M." },
        { pregunta: "¿Qué país tiene MÁS población?", respuesta: "Etiopía", opciones: ["Etiopía", "Sudáfrica", "Kenia", "Marruecos"], dato: "Etiopía: 130M, es el segundo más poblado de África." },

        // Verdadero o falso sobre el top 20
        { pregunta: "¿FILIPINAS está en el top 20 de población mundial?", respuesta: "Sí", opciones: ["Sí", "No"], dato: "Filipinas es el 13º país más poblado con 117 millones." },
        { pregunta: "¿ESPAÑA está en el top 20 de población mundial?", respuesta: "No", opciones: ["Sí", "No"], dato: "España tiene 48 millones, no llega al top 20." },
        { pregunta: "¿IRÁN está en el top 20 de población mundial?", respuesta: "Sí", opciones: ["Sí", "No"], dato: "Irán es el 17º con 90 millones de habitantes." },
        { pregunta: "¿AUSTRALIA está en el top 20 de población mundial?", respuesta: "No", opciones: ["Sí", "No"], dato: "Australia solo tiene 26 millones de habitantes." },
        { pregunta: "¿TAILANDIA está en el top 20 de población mundial?", respuesta: "Sí", opciones: ["Sí", "No"], dato: "Tailandia es el 20º con 72 millones." },
        { pregunta: "¿ARGENTINA está en el top 20 de población mundial?", respuesta: "No", opciones: ["Sí", "No"], dato: "Argentina tiene 46 millones, no llega al top 20." },

        // País hispanohablante más poblado
        { pregunta: "¿Cuál es el país HISPANOHABLANTE más poblado?", respuesta: "México", opciones: ["España", "México", "Argentina", "Colombia"], dato: "México tiene 130 millones de hispanohablantes nativos." },

        // Turquía especial
        { pregunta: "¿TURQUÍA está en Europa, Asia o ambos?", respuesta: "Ambos", opciones: ["Europa", "Asia", "Ambos", "África"], dato: "Una pequeña parte de Turquía (Tracia) está en Europa." }
    ],

    // NIVEL 3: Preguntas sobre las 20 ciudades más pobladas
    ciudadesPobladas: [
        // Top ciudades
        { pregunta: "¿Cuál es la ciudad MÁS poblada del mundo?", respuesta: "Tokio", opciones: ["Nueva York", "Tokio", "Shanghái", "Delhi"], dato: "Tokio tiene 37 millones en su área metropolitana." },
        { pregunta: "¿Cuál es la SEGUNDA ciudad más poblada?", respuesta: "Delhi", opciones: ["Shanghái", "Delhi", "Pekín", "Nueva York"], dato: "Delhi tiene 32 millones de habitantes." },
        { pregunta: "¿Cuál es la ciudad más poblada de AMÉRICA?", respuesta: "São Paulo", opciones: ["Nueva York", "Ciudad de México", "São Paulo", "Buenos Aires"], dato: "São Paulo tiene 22 millones, Nueva York 18 millones." },
        { pregunta: "¿Cuál es la ciudad más poblada de EUROPA?", respuesta: "Estambul", opciones: ["Londres", "París", "Moscú", "Estambul"], dato: "Estambul tiene 15 millones, Moscú 12 millones." },
        { pregunta: "¿Cuál es la ciudad más poblada de ÁFRICA?", respuesta: "Lagos", opciones: ["El Cairo", "Lagos", "Johannesburgo", "Nairobi"], dato: "Lagos (Nigeria) tiene 15 millones de habitantes." },

        // Ubicación: ¿En qué país está?
        { pregunta: "¿En qué país está SHANGHÁI?", respuesta: "China", opciones: ["China", "Japón", "Corea del Sur", "Vietnam"], dato: "Shanghái es la ciudad más poblada de China." },
        { pregunta: "¿En qué país está KARACHI?", respuesta: "Pakistán", opciones: ["India", "Pakistán", "Bangladés", "Irán"], dato: "Karachi es la mayor ciudad de Pakistán." },
        { pregunta: "¿En qué país está DACA?", respuesta: "Bangladés", opciones: ["India", "Pakistán", "Bangladés", "Myanmar"], dato: "Daca es la capital de Bangladés." },
        { pregunta: "¿En qué país está KINSHASA?", respuesta: "Rep. Dem. Congo", opciones: ["Nigeria", "Rep. Dem. Congo", "Sudáfrica", "Kenia"], dato: "Kinshasa es la mayor ciudad francófona del mundo." },
        { pregunta: "¿En qué país está MANILA?", respuesta: "Filipinas", opciones: ["Indonesia", "Filipinas", "Vietnam", "Tailandia"], dato: "Manila es la capital de Filipinas." },
        { pregunta: "¿En qué país está GUANGZHOU (Cantón)?", respuesta: "China", opciones: ["China", "Japón", "Vietnam", "Corea"], dato: "Guangzhou es la cuna de la comida cantonesa." },

        // Ubicación por continente
        { pregunta: "¿En qué continente está EL CAIRO?", respuesta: "África", opciones: ["Asia", "África", "Europa", "Oceanía"], dato: "El Cairo está en Egipto, al norte de África." },
        { pregunta: "¿En qué continente está BOMBAY (Mumbai)?", respuesta: "Asia", opciones: ["Asia", "África", "Europa", "América"], dato: "Bombay está en India, en el sur de Asia." },
        { pregunta: "¿En qué continente está BUENOS AIRES?", respuesta: "América", opciones: ["Europa", "América", "Asia", "Oceanía"], dato: "Buenos Aires está en Argentina, Sudamérica." },

        // Preguntas especiales
        { pregunta: "¿Qué ciudad está en DOS continentes?", respuesta: "Estambul", opciones: ["Moscú", "Estambul", "El Cairo", "Tokio"], dato: "Estambul está entre Europa y Asia, dividida por el Bósforo." },
        { pregunta: "OSAKA y TOKIO están en el mismo país. ¿Cuál?", respuesta: "Japón", opciones: ["China", "Japón", "Corea del Sur", "Taiwán"], dato: "Las dos ciudades más grandes de Japón." },
        { pregunta: "¿Qué ciudad es capital de su país?", respuesta: "Pekín", opciones: ["Shanghái", "Pekín", "Guangzhou", "Bombay"], dato: "Pekín es la capital de China, Shanghái no." },

        // Comparaciones
        { pregunta: "¿Qué ciudad tiene MÁS población?", respuesta: "El Cairo", opciones: ["El Cairo", "Lagos", "Londres", "París"], dato: "El Cairo: 21M, Lagos: 15M, Londres: 9M, París: 11M." },
        { pregunta: "¿Qué ciudad tiene MÁS población?", respuesta: "Ciudad de México", opciones: ["Nueva York", "Ciudad de México", "Los Ángeles", "Chicago"], dato: "CDMX: 22M, Nueva York: 18M." },
        { pregunta: "¿Qué ciudad tiene MÁS población?", respuesta: "Bombay", opciones: ["Bombay", "Londres", "Nueva York", "París"], dato: "Bombay: 21M, Nueva York: 18M, Londres: 9M." }
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
            nombre: "TOP 20 PAÍSES",
            descripcion: "Has llegado al GIMNASIO. ¡El profesor deportista te reta! ¿Conoces los 20 países más poblados?",
            escenario: "gymnasium",
            musica: "level2",
            color: "#e94560",
            professorType: "sporty"
        },
        {
            id: 3,
            nombre: "TOP 20 CIUDADES",
            descripcion: "¡Bienvenido al COMEDOR! El chef Álvaro cocina preguntas difíciles. ¿Sabes las 20 ciudades más pobladas?",
            escenario: "cafeteria",
            musica: "level3",
            color: "#ffd700",
            professorType: "chef"
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
            { personaje: "profesor", texto: "¡Pero ahora estamos en MI GIMNASIO!" },
            { personaje: "profesor", texto: "¡Aquí entreno tu FRACASO! ¿Conoces los 20 países más poblados?" }
        ],
        nivel3Intro: [
            { personaje: "profesor", texto: "¡¿Cómo es posible que sigas aquí?!" },
            { personaje: "profesor", texto: "¡Bienvenido a MI COMEDOR! ¡Hoy cocino tu DERROTA!" },
            { personaje: "profesor", texto: "¿Sabes cuáles son las 20 ciudades más grandes del mundo?" }
        ],
        nivel4Intro: [
            { personaje: "profesor", texto: "¡IMPOSIBLE! ¡Has llegado a mi CASTILLO!" },
            { personaje: "profesor", texto: "¡Este es el EXAMEN FINAL!" },
            { personaje: "profesor", texto: "¡TODO lo que has aprendido... A PRUEBA!" },
            { personaje: "profesor", texto: "¡NADIE ha llegado tan lejos! ¡NADIE!" }
        ]
    },

    // Función para generar opciones de capitales (llamar desde el juego)
    generarOpcionesCapital: function(respuestaCorrecta) {
        let opciones = [respuestaCorrecta];
        let disponibles = this.capitalesLista.filter(c => c !== respuestaCorrecta);

        while (opciones.length < 4) {
            const idx = Math.floor(Math.random() * disponibles.length);
            opciones.push(disponibles[idx]);
            disponibles.splice(idx, 1);
        }

        // Mezclar
        return opciones.sort(() => Math.random() - 0.5);
    }
};

// Hacer disponible globalmente
window.GAME_DATA = GAME_DATA;
