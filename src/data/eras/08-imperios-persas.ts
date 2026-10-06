import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "imperios-persas",
  order: 8,
  name: "Imperios persas",
  macroPeriod: "antiquity",
  startYear: -550,
  endYear: -330,
  summary:
    "Ciro el Grande funda el Imperio aqueménida, que llega a extenderse del Egeo al valle del Indo. Una red de satrapías, caminos y capitales monumentales sostiene el mayor estado conocido hasta entonces, hasta su conquista por Alejandro Magno.",
  accentColor: "#c792ea",
  locations: [
    {
      id: "imperios-persas--persepolis",
      name: "Persépolis",
      modernName: "Takht-e Jamshid, provincia de Fars",
      country: "Irán",
      coordinates: { lat: 29.935, lon: 52.89 },
      year: -500,
      summary:
        "Capital ceremonial aqueménida levantada sobre una gran terraza al pie del monte Rahmat. Iniciada por Darío I y ampliada por sus sucesores, era escenario de la exhibición del poder real ante los pueblos del imperio.",
      elements: [
        {
          id: "imperios-persas--persepolis--landmark",
          category: "landmark",
          name: "Apadana",
          yearLabel: "c. 515 – 465 a.C.",
          summary:
            "Gran sala de audiencias hipóstila, sostenida por altas columnas de piedra con capiteles de toros. Sus escalinatas muestran relieves de delegaciones de los pueblos sometidos portando presentes al rey.",
          sourceUrl: "https://es.wikipedia.org/wiki/Apadana",
          confidence: "medium",
        },
        {
          id: "imperios-persas--persepolis--person",
          category: "person",
          name: "Jerjes I",
          yearLabel: "r. 486 – 465 a.C.",
          summary:
            "Hijo y sucesor de Darío I. Completó obras iniciadas por su padre en Persépolis y añadió otras, como la Puerta de Todas las Naciones. Es también el rey que invadió Grecia en 480 a.C.",
          sourceUrl: "https://es.wikipedia.org/wiki/Jerjes_I",
          confidence: "high",
        },
        {
          id: "imperios-persas--persepolis--technology",
          category: "technology",
          name: "Archivos administrativos en tablillas",
          yearLabel: "c. 509 – 457 a.C.",
          summary:
            "Miles de tablillas de arcilla, sobre todo en elamita, registran raciones, pagos a trabajadores y movimientos de bienes. Revelan una administración muy organizada al servicio de la corte.",
          sourceUrl: "https://en.wikipedia.org/wiki/Persepolis_Administrative_Archives",
          confidence: "medium",
        },
        {
          id: "imperios-persas--persepolis--culture",
          category: "culture",
          name: "Inscripciones reales trilingües",
          yearLabel: "s. VI – V a.C.",
          summary:
            "Los reyes aqueménidas grabaron sus inscripciones en persa antiguo, elamita y babilonio con escritura cuneiforme. La variante persa, de pocos signos, se creó al parecer para estos textos reales.",
          sourceUrl: "https://en.wikipedia.org/wiki/Old_Persian_cuneiform",
          confidence: "medium",
        },
        {
          id: "imperios-persas--persepolis--event",
          category: "event",
          name: "Incendio de Persépolis",
          yearLabel: "330 a.C.",
          year: -330,
          summary:
            "Tras ocupar la ciudad, Alejandro Magno incendió los palacios. Las fuentes antiguas discrepan sobre si fue un acto deliberado de venganza por las guerras médicas o fruto de un banquete.",
          sourceUrl: "https://es.wikipedia.org/wiki/Persépolis",
          confidence: "high",
        },
      ],
    },
    {
      id: "imperios-persas--pasargada",
      name: "Pasargada",
      modernName: "Pasargad, provincia de Fars",
      country: "Irán",
      coordinates: { lat: 30.2001, lon: 53.1794 },
      year: -540,
      summary:
        "Primera capital del Imperio aqueménida, fundada por Ciro el Grande cerca del lugar de su victoria sobre los medos. Sus palacios dispersos entre jardines y la tumba de Ciro son Patrimonio de la Humanidad.",
      elements: [
        {
          id: "imperios-persas--pasargada--landmark",
          category: "landmark",
          name: "Tumba de Ciro",
          yearLabel: "c. 530 a.C.",
          summary:
            "Cámara funeraria de piedra con tejado a dos aguas sobre un basamento escalonado. Según los autores antiguos, Alejandro Magno la visitó y ordenó restaurarla tras hallarla saqueada.",
          sourceUrl: "https://en.wikipedia.org/wiki/Tomb_of_Cyrus",
          confidence: "medium",
        },
        {
          id: "imperios-persas--pasargada--person",
          category: "person",
          name: "Ciro el Grande",
          yearLabel: "r. c. 559 – 530 a.C.",
          summary:
            "Fundador del Imperio aqueménida. Venció a los medos, a Lidia y a Babilonia, y la tradición destaca su tolerancia con los pueblos conquistados. Fue enterrado en Pasargada.",
          sourceUrl: "https://es.wikipedia.org/wiki/Ciro_II_el_Grande",
          confidence: "medium",
        },
        {
          id: "imperios-persas--pasargada--technology",
          category: "technology",
          name: "Jardín persa (chahar bagh)",
          yearLabel: "c. 540 a.C.",
          summary:
            "Los jardines reales de Pasargada son el ejemplo más antiguo conocido del chahar bagh, el jardín persa dividido en cuatro partes por canales de agua, un modelo que perduró durante milenios.",
          sourceUrl: "https://en.wikipedia.org/wiki/Pasargadae",
          confidence: "medium",
        },
        {
          id: "imperios-persas--pasargada--culture",
          category: "culture",
          name: "Arte de síntesis aqueménida",
          yearLabel: "c. 540 – 530 a.C.",
          summary:
            "El arte y la arquitectura de Pasargada combinan precedentes elamitas, babilonios, asirios y egipcios con influencias de Anatolia. Un ejemplo es el relieve de una figura alada en la puerta de un palacio.",
          sourceUrl: "https://en.wikipedia.org/wiki/Pasargadae",
          confidence: "medium",
        },
        {
          id: "imperios-persas--pasargada--event",
          category: "event",
          name: "Victoria de Ciro sobre Astiages",
          yearLabel: "550 a.C.",
          year: -550,
          summary:
            "Ciro derrotó al rey medo Astiages y se hizo con su reino, origen del Imperio aqueménida. Según la tradición, fundó Pasargada cerca del lugar de la victoria.",
          sourceUrl: "https://en.wikipedia.org/wiki/Pasargadae",
          confidence: "medium",
        },
      ],
    },
    {
      id: "imperios-persas--susa",
      name: "Susa",
      modernName: "Shush, provincia de Juzestán",
      country: "Irán",
      coordinates: { lat: 32.1906, lon: 48.2578 },
      year: -500,
      summary:
        "Antigua capital elamita que Darío I convirtió en la principal residencia administrativa del imperio. Desde allí partía el Camino Real hacia Sardes, en Asia Menor.",
      elements: [
        {
          id: "imperios-persas--susa--landmark",
          category: "landmark",
          name: "Palacio de Darío",
          yearLabel: "c. 520 – 500 a.C.",
          summary:
            "Complejo palaciego con una gran apadana y patios decorados con ladrillo vidriado. Una inscripción de fundación de Darío enumera los pueblos y materiales llegados de todo el imperio para construirlo.",
          sourceUrl: "https://en.wikipedia.org/wiki/Palace_of_Darius_in_Susa",
          confidence: "medium",
        },
        {
          id: "imperios-persas--susa--person",
          category: "person",
          name: "Darío I",
          yearLabel: "r. 522 – 486 a.C.",
          summary:
            "Rey que reorganizó el imperio en satrapías, unificó tributos y moneda y emprendió grandes obras. Hizo de Susa su capital administrativa y fundó Persépolis.",
          sourceUrl: "https://es.wikipedia.org/wiki/Darío_I",
          confidence: "high",
        },
        {
          id: "imperios-persas--susa--technology",
          category: "technology",
          name: "Camino Real",
          yearLabel: "finales s. VI – V a.C.",
          summary:
            "Calzada de unos 2.700 km entre Susa y Sardes, con estaciones de posta donde los correos reales cambiaban de caballo. Heródoto la describió con admiración.",
          sourceUrl: "https://es.wikipedia.org/wiki/Camino_Real_(Persia)",
          confidence: "high",
        },
        {
          id: "imperios-persas--susa--culture",
          category: "culture",
          name: "Friso de los arqueros",
          yearLabel: "c. 510 a.C.",
          summary:
            "Relieve de ladrillo vidriado de colores que representa una fila de arqueros con ricas túnicas. Procede del palacio de Darío y se conserva en el Museo del Louvre.",
          sourceUrl: "https://en.wikipedia.org/wiki/Palace_of_Darius_in_Susa",
          confidence: "medium",
        },
        {
          id: "imperios-persas--susa--event",
          category: "event",
          name: "Rendición de Susa a Alejandro",
          yearLabel: "331 a.C.",
          year: -331,
          summary:
            "Tras la batalla de Gaugamela, el sátrapa de Susa entregó la ciudad y su tesoro a Alejandro Magno sin combatir. Susa perdió después buena parte de su importancia.",
          sourceUrl: "https://en.wikipedia.org/wiki/Susa",
          confidence: "high",
        },
      ],
    },
  ],
};

export default era;
