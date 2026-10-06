import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "india-clasica",
  order: 11,
  name: "India clásica",
  macroPeriod: "antiquity",
  startYear: 320,
  endYear: 550,
  summary:
    "Bajo el Imperio gupta y sus aliados vakatakas, el norte y el centro de la India viven una etapa de florecimiento en la ciencia, el arte y la literatura sánscrita. Monasterios budistas y cortes hindúes conviven y patrocinan obras que influirán en toda Asia.",
  accentColor: "#f4a6c0",
  locations: [
    {
      id: "india-clasica--pataliputra",
      name: "Pataliputra",
      modernName: "Patna, Bihar",
      country: "India",
      coordinates: { lat: 25.5989, lon: 85.1847 },
      year: 405,
      summary:
        "Antigua capital de Magadha y del Imperio maurya, a orillas del Ganges, Pataliputra fue uno de los grandes centros políticos de los Gupta. Allí trabajó el astrónomo Aryabhata y la visitó el peregrino chino Faxian a comienzos del siglo V.",
      elements: [
        {
          id: "india-clasica--pataliputra--landmark",
          category: "landmark",
          name: "Yacimiento de Kumhrar",
          yearLabel: "c. 600 a.C. – 600 d.C.",
          summary:
            "Excavaciones en el barrio de Kumhrar, en Patna, han sacado a la luz restos de la antigua Pataliputra, entre ellos una sala hipóstila de época maurya. La ocupación del lugar se prolonga hasta la época gupta.",
          sourceUrl: "https://en.wikipedia.org/wiki/Kumhrar",
          confidence: "medium",
        },
        {
          id: "india-clasica--pataliputra--person",
          category: "person",
          name: "Aryabhata",
          yearLabel: "476 – c. 550",
          year: 499,
          summary:
            "Astrónomo y matemático que trabajó en Kusumapura, identificada con Pataliputra. Su tratado Aryabhatiya, compuesto según él mismo a los 23 años, propone la rotación diaria de la Tierra y una aproximación muy precisa de pi.",
          sourceUrl: "https://es.wikipedia.org/wiki/Aryabhata",
          confidence: "high",
        },
        {
          id: "india-clasica--pataliputra--technology",
          category: "technology",
          name: "Dinares de oro gupta",
          yearLabel: "s. IV – V",
          summary:
            "Los Gupta acuñaron abundantes monedas de oro de gran calidad técnica, inspiradas al principio en modelos kushanas. Sus tipos muestran al rey como arquero, jinete o cazador de leones, junto a leyendas en sánscrito.",
          sourceUrl: "https://en.wikipedia.org/wiki/Gupta_Empire",
          confidence: "high",
        },
        {
          id: "india-clasica--pataliputra--culture",
          category: "culture",
          name: "Devoción vaisnava de la corte",
          yearLabel: "s. IV – V",
          summary:
            "Varios soberanos gupta se proclamaron devotos de Visnú y usaron a Garuda como emblema real. Al mismo tiempo, la dinastía toleró y patrocinó fundaciones budistas y jainas en su territorio.",
          sourceUrl: "https://en.wikipedia.org/wiki/Gupta_Empire",
          confidence: "medium",
        },
        {
          id: "india-clasica--pataliputra--event",
          category: "event",
          name: "Estancia de Faxian",
          yearLabel: "c. 405",
          summary:
            "El monje chino Faxian, que viajó a la India en busca de textos budistas, se detuvo en Pataliputra, donde aprendió sánscrito y reunió escrituras. Su relato es una fuente clave sobre la India gupta.",
          sourceUrl: "https://en.wikipedia.org/wiki/Faxian",
          confidence: "medium",
        },
      ],
    },
    {
      id: "india-clasica--ajanta",
      name: "Ajanta",
      modernName: "Cuevas de Ajanta, Maharashtra",
      country: "India",
      coordinates: { lat: 20.5533, lon: 75.7003 },
      year: 475,
      summary:
        "Conjunto de santuarios y monasterios budistas excavados en la pared de un barranco sobre el río Waghora. La mayor parte de sus cuevas y pinturas se realizó en la segunda mitad del siglo V, bajo el rey vakataka Harishena.",
      elements: [
        {
          id: "india-clasica--ajanta--landmark",
          category: "landmark",
          name: "Cuevas de Ajanta",
          yearLabel: "s. II a.C. – s. V d.C.",
          summary:
            "Unas treinta cuevas talladas en la roca, entre salas de culto y monasterios, dispuestas en herradura sobre el río Waghora. Patrimonio de la Humanidad desde 1983, combinan arquitectura, escultura y pintura.",
          sourceUrl: "https://es.wikipedia.org/wiki/Cuevas_de_Ajanta",
          confidence: "high",
        },
        {
          id: "india-clasica--ajanta--person",
          category: "person",
          name: "Harishena",
          yearLabel: "r. c. 460 – 477",
          summary:
            "Rey de la dinastía vakataka y patrón de la segunda fase de Ajanta. Según el historiador Walter Spink, él mismo encargó la cueva 1 y animó a ministros y vasallos a excavar otras; su muerte frenó las obras.",
          sourceUrl: "https://en.wikipedia.org/wiki/Harishena",
          confidence: "medium",
        },
        {
          id: "india-clasica--ajanta--technology",
          category: "technology",
          name: "Arquitectura excavada en la roca",
          yearLabel: "s. V",
          summary:
            "Los canteros vaciaban el basalto de arriba abajo, reservando columnas, celdas y estatuas en la propia roca. Así reproducían en piedra la estructura de templos y monasterios construidos.",
          sourceUrl: "https://es.wikipedia.org/wiki/Arquitectura_excavada_en_la_roca",
          confidence: "high",
        },
        {
          id: "india-clasica--ajanta--culture",
          category: "culture",
          name: "Pinturas murales de los Jatakas",
          yearLabel: "c. 460 – 480",
          summary:
            "Los muros y techos se cubrieron de pinturas sobre enlucido que narran las vidas anteriores del Buda, los Jatakas, con escenas de corte y vida cotidiana. Son una de las cumbres de la pintura antigua india.",
          sourceUrl: "https://es.wikipedia.org/wiki/Cuevas_de_Ajanta",
          confidence: "medium",
        },
        {
          id: "india-clasica--ajanta--event",
          category: "event",
          name: "Donación de la cueva 16",
          yearLabel: "c. 475",
          summary:
            "Varahadeva, ministro del rey Harishena, costeó la cueva 16, un gran monasterio mahayana cuya inscripción registra la donación.",
          sourceUrl: "https://en.wikipedia.org/wiki/Ajanta_Caves",
          confidence: "medium",
        },
      ],
    },
    {
      id: "india-clasica--nalanda",
      name: "Nalanda",
      modernName: "Nalanda, Bihar",
      country: "India",
      coordinates: { lat: 25.1367, lon: 85.4439 },
      year: 450,
      summary:
        "Gran monasterio budista del reino de Magadha fundado bajo patrocinio gupta en el siglo V. Durante siglos fue uno de los principales centros de estudio de Asia, con monasterios y templos de ladrillo.",
      elements: [
        {
          id: "india-clasica--nalanda--landmark",
          category: "landmark",
          name: "Ruinas de la mahavihara de Nalanda",
          yearLabel: "s. V – XII",
          summary:
            "Las excavaciones han revelado hileras de monasterios y templos de ladrillo distribuidos a lo largo de un eje. El yacimiento fue declarado Patrimonio de la Humanidad en 2016.",
          sourceUrl: "https://es.wikipedia.org/wiki/Nalanda",
          confidence: "high",
        },
        {
          id: "india-clasica--nalanda--person",
          category: "person",
          name: "Kumaragupta I",
          yearLabel: "r. c. 415 – 455",
          summary:
            "Emperador gupta considerado fundador y primer patrón de Nalanda. Un sello hallado en el lugar menciona a un rey Shakraditya, al que varios especialistas identifican con él, y las monedas apoyan esa atribución.",
          sourceUrl: "https://en.wikipedia.org/wiki/Nalanda_mahavihara",
          confidence: "medium",
        },
        {
          id: "india-clasica--nalanda--technology",
          category: "technology",
          name: "Monasterios de ladrillo en torno a patios",
          yearLabel: "s. V – VI",
          summary:
            "Cada monasterio se organizaba como un bloque de ladrillo con celdas para los monjes alrededor de un patio central. La repetición de este módulo permitió ampliar el conjunto a lo largo de los siglos.",
          sourceUrl: "https://en.wikipedia.org/wiki/Nalanda_mahavihara",
          confidence: "medium",
        },
        {
          id: "india-clasica--nalanda--culture",
          category: "culture",
          name: "Donantes de varias religiones",
          yearLabel: "s. V – VI",
          summary:
            "Los sellos y las inscripciones de época gupta muestran que Nalanda recibió donaciones tanto de budistas como de no budistas: algunos sellos llevan emblemas de Lakshmi, Ganesha o Durga.",
          sourceUrl: "https://en.wikipedia.org/wiki/Nalanda_mahavihara",
          confidence: "medium",
        },
        {
          id: "india-clasica--nalanda--event",
          category: "event",
          name: "Fundación de la mahavihara",
          yearLabel: "c. 427",
          summary:
            "La fecha tradicional de fundación de Nalanda se sitúa hacia el año 427, bajo patrocinio gupta. Desde entonces funcionó casi mil años como centro de estudio, hasta su decadencia hacia el año 1400.",
          sourceUrl: "https://en.wikipedia.org/wiki/Nalanda_mahavihara",
          confidence: "medium",
        },
      ],
    },
  ],
};

export default era;
