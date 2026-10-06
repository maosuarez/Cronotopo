import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "egipto-antiguo",
  order: 4,
  name: "Egipto antiguo",
  macroPeriod: "antiquity",
  startYear: -3100,
  endYear: -1000,
  summary:
    "A orillas del Nilo, un estado unificado gobernado por faraones mantiene durante dos milenios una cultura de notable continuidad. Pirámides, templos y tumbas reales reflejan su poder, su escritura y sus creencias sobre el más allá.",
  accentColor: "#e8c547",
  locations: [
    {
      id: "egipto-antiguo--giza",
      name: "Guiza",
      modernName: "Necrópolis de Guiza, El Cairo",
      country: "Egipto",
      coordinates: { lat: 29.9761, lon: 31.1328 },
      year: -2560,
      summary:
        "Meseta desértica al oeste del Nilo donde los faraones de la IV dinastía levantaron sus pirámides durante el Imperio Antiguo. La necrópolis incluye templos, tumbas de funcionarios y la Gran Esfinge.",
      elements: [
        {
          id: "egipto-antiguo--giza--landmark",
          category: "landmark",
          name: "Gran Pirámide de Guiza",
          yearLabel: "c. 2560 a.C.",
          summary:
            "Tumba del faraón Keops y la mayor de las tres pirámides de Guiza. Es la única de las siete maravillas del mundo antiguo que se conserva y fue la construcción más alta del mundo durante milenios.",
          sourceUrl: "https://es.wikipedia.org/wiki/Gran_Pirámide_de_Guiza",
          confidence: "medium",
        },
        {
          id: "egipto-antiguo--giza--person",
          category: "person",
          name: "Keops (Jufu)",
          yearLabel: "c. 2589 – 2566 a.C.",
          summary:
            "Segundo faraón de la IV dinastía, ordenó construir la Gran Pirámide. Paradójicamente, su retrato más seguro es una estatuilla de marfil de unos siete centímetros hallada en Abidos.",
          sourceUrl: "https://es.wikipedia.org/wiki/Keops",
          confidence: "medium",
        },
        {
          id: "egipto-antiguo--giza--technology",
          category: "technology",
          name: "Transporte de piedra por el Nilo",
          yearLabel: "c. 2560 a.C.",
          summary:
            "El diario del inspector Merer, hallado en 2013 en Wadi al-Jarf, registra cómo su equipo llevaba en barco bloques de caliza blanca desde las canteras de Tura hasta Guiza en el reinado de Keops.",
          sourceUrl: "https://es.wikipedia.org/wiki/Diario_de_Merer",
          confidence: "medium",
        },
        {
          id: "egipto-antiguo--giza--culture",
          category: "culture",
          name: "Barca funeraria de Keops",
          yearLabel: "c. 2566 a.C.",
          summary:
            "Nave de cedro desmontada y enterrada en un foso al pie de la Gran Pirámide, descubierta en 1954. Sus tablas iban unidas con cuerdas; su función ritual en el entierro del rey sigue discutiéndose.",
          sourceUrl: "https://es.wikipedia.org/wiki/Barca_solar_de_Keops",
          confidence: "medium",
        },
        {
          id: "egipto-antiguo--giza--event",
          category: "event",
          name: "Estela del Sueño de Tutmosis IV",
          yearLabel: "c. 1401 a.C.",
          summary:
            "En su primer año de reinado, Tutmosis IV erigió una estela entre las patas de la Gran Esfinge. En ella cuenta que la Esfinge le prometió el trono en sueños a cambio de liberarla de la arena.",
          sourceUrl: "https://es.wikipedia.org/wiki/Estela_del_Sueño",
          confidence: "medium",
        },
      ],
    },
    {
      id: "egipto-antiguo--tebas",
      name: "Tebas",
      modernName: "Luxor",
      country: "Egipto",
      coordinates: { lat: 25.7188, lon: 32.6573 },
      year: -1450,
      summary:
        "Capital religiosa y a menudo política del Imperio Nuevo, a ambos lados del Nilo. En la orilla oriental se alzaban los templos de Amón; en la occidental, los templos funerarios y las tumbas reales.",
      elements: [
        {
          id: "egipto-antiguo--tebas--landmark",
          category: "landmark",
          name: "Templo de Karnak",
          yearLabel: "desde c. 2000 a.C.",
          summary:
            "Inmenso conjunto de templos dedicado sobre todo a Amón, ampliado por sucesivos faraones durante siglos. Su sala hipóstila de columnas gigantes es una de las construcciones más célebres de Egipto.",
          sourceUrl: "https://es.wikipedia.org/wiki/Templo_de_Karnak",
          confidence: "medium",
        },
        {
          id: "egipto-antiguo--tebas--person",
          category: "person",
          name: "Hatshepsut",
          yearLabel: "c. 1479 – 1458 a.C.",
          summary:
            "Reina de la XVIII dinastía que gobernó como faraón. Gran constructora, emprendió obras en Karnak y levantó su templo funerario en Deir el-Bahari, donde se narra su expedición al país de Punt.",
          sourceUrl: "https://es.wikipedia.org/wiki/Hatshepsut",
          confidence: "medium",
        },
        {
          id: "egipto-antiguo--tebas--technology",
          category: "technology",
          name: "Tumbas reales excavadas en la roca",
          yearLabel: "c. 1500 – 1070 a.C.",
          summary:
            "En el Valle de los Reyes, los faraones del Imperio Nuevo hicieron excavar en la montaña largas galerías y cámaras decoradas con textos funerarios, en lugar de levantar pirámides visibles.",
          sourceUrl: "https://es.wikipedia.org/wiki/Valle_de_los_Reyes",
          confidence: "medium",
        },
        {
          id: "egipto-antiguo--tebas--culture",
          category: "culture",
          name: "Fiesta de Opet",
          yearLabel: "desde s. XV a.C.",
          summary:
            "Cada año, durante la crecida, las imágenes de Amón, Mut y Jonsu viajaban en procesión de Karnak a Luxor para renovar el vínculo entre el dios y el rey. Está atestiguada desde Hatshepsut.",
          sourceUrl: "https://es.wikipedia.org/wiki/Fiesta_de_Opet",
          confidence: "high",
        },
        {
          id: "egipto-antiguo--tebas--event",
          category: "event",
          name: "Huelga de Deir el-Medina",
          yearLabel: "s. XII a.C.",
          summary:
            "Bajo Ramsés III, los artesanos de las tumbas reales dejaron de trabajar por el retraso de sus raciones de grano. Es una de las primeras huelgas documentadas de la historia.",
          sourceUrl: "https://en.wikipedia.org/wiki/Deir_el-Medina",
          confidence: "medium",
        },
      ],
    },
    {
      id: "egipto-antiguo--abu-simbel",
      name: "Abu Simbel",
      modernName: "Abu Simbel, gobernación de Asuán",
      country: "Egipto",
      coordinates: { lat: 22.3369, lon: 31.6256 },
      year: -1264,
      summary:
        "Dos templos excavados en la roca en la Baja Nubia por orden de Ramsés II, en una región rica en oro que Egipto controlaba. En 1968 se trasladaron a un terreno más alto para salvarlos del lago Nasser.",
      elements: [
        {
          id: "egipto-antiguo--abu-simbel--landmark",
          category: "landmark",
          name: "Gran Templo de Ramsés II",
          yearLabel: "c. 1264 – 1244 a.C.",
          summary:
            "Templo tallado en la montaña y dedicado a Ra-Horajty, Ptah, Amón y al propio rey divinizado. Su fachada está dominada por cuatro colosos sedentes de Ramsés II.",
          sourceUrl: "https://es.wikipedia.org/wiki/Abu_Simbel",
          confidence: "medium",
        },
        {
          id: "egipto-antiguo--abu-simbel--person",
          category: "person",
          name: "Ramsés II",
          yearLabel: "c. 1279 – 1213 a.C.",
          summary:
            "Faraón de la XIX dinastía con uno de los reinados más largos de Egipto. Llenó el país y Nubia de templos y estatuas, y firmó con los hititas uno de los primeros tratados de paz conocidos.",
          sourceUrl: "https://es.wikipedia.org/wiki/Ramsés_II",
          confidence: "medium",
        },
        {
          id: "egipto-antiguo--abu-simbel--technology",
          category: "technology",
          name: "Orientación solar del santuario",
          yearLabel: "c. 1264 a.C.",
          summary:
            "El templo está orientado para que, dos veces al año, el sol naciente penetre hasta el santuario e ilumine las estatuas de Ramsés, Amón y Ra-Horajty, pero no la de Ptah.",
          sourceUrl: "https://en.wikipedia.org/wiki/Abu_Simbel",
          confidence: "medium",
        },
        {
          id: "egipto-antiguo--abu-simbel--culture",
          category: "culture",
          name: "Templo de Hathor y Nefertari",
          yearLabel: "c. 1264 – 1244 a.C.",
          summary:
            "El templo menor está dedicado a la diosa Hathor, personificada por Nefertari, la gran esposa real. Se considera el segundo templo egipcio conocido dedicado a una reina; sus pilares llevan el rostro de Hathor.",
          sourceUrl: "https://en.wikipedia.org/wiki/Abu_Simbel",
          confidence: "medium",
        },
        {
          id: "egipto-antiguo--abu-simbel--event",
          category: "event",
          name: "Batalla de Qadesh",
          yearLabel: "c. 1274 a.C.",
          summary:
            "Choque entre egipcios e hititas junto al río Orontes, en la actual Siria. Ramsés II la presentó como una gran victoria personal en los relieves de la sala hipóstila del Gran Templo.",
          sourceUrl: "https://es.wikipedia.org/wiki/Batalla_de_Qadesh",
          confidence: "medium",
        },
      ],
    },
  ],
};

export default era;
