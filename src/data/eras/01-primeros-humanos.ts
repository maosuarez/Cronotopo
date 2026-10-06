import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "primeros-humanos",
  order: 1,
  name: "Primeros humanos",
  macroPeriod: "prehistory",
  startYear: -300000,
  endYear: -10000,
  summary:
    "Homo sapiens surge en África y, durante cientos de miles de años, desarrolla herramientas, ornamentos y las primeras imágenes. La expansión por el planeta culmina con el arte de las cuevas europeas.",
  accentColor: "#e0a458",
  locations: [
    {
      id: "primeros-humanos--omo-kibish",
      name: "Omo Kibish",
      modernName: "Formación Kibish, valle del Omo",
      country: "Etiopía",
      coordinates: { lat: 4.8004, lon: 35.9671 },
      year: -231000,
      summary:
        "En los sedimentos del bajo valle del Omo aparecieron algunos de los fósiles de Homo sapiens más antiguos conocidos. Su datación los sitúa hace al menos 230.000 años.",
      elements: [
        {
          id: "primeros-humanos--omo-kibish--landmark",
          category: "landmark",
          name: "Formación Kibish",
          yearLabel: "c. 230.000 – 100.000 años AP",
          summary:
            "Secuencia de sedimentos fluviales y deltaicos junto al río Omo. Sus capas, separadas por cenizas volcánicas datables, conservan fósiles humanos y herramientas de piedra de la Edad de Piedra Media.",
          sourceUrl: "https://en.wikipedia.org/wiki/Omo_Kibish_Formation",
          confidence: "medium",
        },
        {
          id: "primeros-humanos--omo-kibish--person",
          category: "person",
          name: "Omo I (hallazgo fósil)",
          yearLabel: "c. 233.000 años AP",
          year: -231000,
          summary:
            "No hay individuos con nombre: Omo I es un cráneo parcial y otros restos hallados en 1967 por el equipo de Richard Leakey. Es uno de los Homo sapiens más antiguos identificados.",
          sourceUrl: "https://en.wikipedia.org/wiki/Omo_remains",
          confidence: "medium",
        },
        {
          id: "primeros-humanos--omo-kibish--technology",
          category: "technology",
          name: "Herramientas de la Edad de Piedra Media",
          yearLabel: "c. 200.000 años AP",
          summary:
            "En la formación se recuperaron núcleos y lascas tallados con técnicas de preparación previa del núcleo, propias de la Edad de Piedra Media africana.",
          sourceUrl: "https://es.wikipedia.org/wiki/Edad_de_Piedra_Media",
          confidence: "medium",
        },
        {
          id: "primeros-humanos--omo-kibish--culture",
          category: "culture",
          name: "Cazadores-recolectores del Omo",
          yearLabel: "c. 230.000 años AP",
          summary:
            "Los primeros sapiens del valle vivían en grupos móviles de cazadores-recolectores. Su modo de vida se infiere de los restos fósiles, las herramientas y el entorno fluvial en que aparecen.",
          sourceUrl: "https://en.wikipedia.org/wiki/Middle_Stone_Age",
          confidence: "low",
        },
        {
          id: "primeros-humanos--omo-kibish--event",
          category: "event",
          name: "Erupción del volcán Shala",
          yearLabel: "c. 233.000 años AP",
          year: -231000,
          summary:
            "Una gran erupción del Shala, en el Rift etíope, depositó una capa de ceniza sobre los sedimentos que contienen a Omo I. Su datación, publicada en 2022, fija la edad mínima del fósil.",
          sourceUrl: "https://en.wikipedia.org/wiki/Omo_remains",
          confidence: "medium",
        },
      ],
    },
    {
      id: "primeros-humanos--blombos",
      name: "Cueva de Blombos",
      modernName: "Cueva de Blombos, Cabo Occidental",
      country: "Sudáfrica",
      coordinates: { lat: -34.4144, lon: 21.2225 },
      year: -73000,
      summary:
        "Pequeña cueva sobre la costa del océano Índico excavada desde 1991. Sus capas de la Edad de Piedra Media muestran pigmentos, ornamentos y grabados que evidencian pensamiento simbólico temprano.",
      elements: [
        {
          id: "primeros-humanos--blombos--landmark",
          category: "landmark",
          name: "Cueva de Blombos",
          yearLabel: "c. 100.000 – 70.000 años AP",
          summary:
            "Abrigo costero en un acantilado calizo del sur de Sudáfrica. Las excavaciones dirigidas por Christopher Henshilwood la convirtieron en un sitio clave para estudiar el origen del comportamiento moderno.",
          sourceUrl: "https://es.wikipedia.org/wiki/Cueva_de_Blombos",
          confidence: "medium",
        },
        {
          id: "primeros-humanos--blombos--person",
          category: "person",
          name: "Dientes humanos de Blombos (hallazgo fósil)",
          yearLabel: "c. 100.000 – 70.000 años AP",
          summary:
            "Sin individuos con nombre, la presencia humana se documenta con dientes de Homo sapiens hallados en los niveles de la Edad de Piedra Media, asociados a los mismos estratos que los objetos simbólicos.",
          sourceUrl: "https://es.wikipedia.org/wiki/Cueva_de_Blombos",
          confidence: "medium",
        },
        {
          id: "primeros-humanos--blombos--technology",
          category: "technology",
          name: "Taller de ocre",
          yearLabel: "c. 100.000 años AP",
          year: -98000,
          summary:
            "Dos conchas de abulón con una mezcla de ocre, hueso y carbón, junto a piedras para moler. Publicado en 2011, es uno de los talleres de pigmentos más antiguos conocidos.",
          sourceUrl: "https://es.wikipedia.org/wiki/Cueva_de_Blombos",
          confidence: "medium",
        },
        {
          id: "primeros-humanos--blombos--culture",
          category: "culture",
          name: "Cuentas de concha perforadas",
          yearLabel: "c. 75.000 años AP",
          year: -73000,
          summary:
            "Conchas de pequeños caracoles marinos perforadas y con marcas de uso, probablemente ensartadas como adorno personal. Figuran entre los ornamentos más antiguos documentados.",
          sourceUrl: "https://es.wikipedia.org/wiki/Cueva_de_Blombos",
          confidence: "medium",
        },
        {
          id: "primeros-humanos--blombos--event",
          category: "event",
          name: "El dibujo más antiguo conocido",
          yearLabel: "c. 73.000 años AP",
          year: -71000,
          summary:
            "Alguien trazó líneas cruzadas con un lápiz de ocre sobre una lasca de silcreta. El hallazgo, publicado en 2018, es el dibujo más antiguo identificado hasta ahora atribuido a Homo sapiens.",
          sourceUrl: "https://es.wikipedia.org/wiki/Cueva_de_Blombos",
          confidence: "medium",
        },
      ],
    },
    {
      id: "primeros-humanos--chauvet",
      name: "Cueva de Chauvet",
      modernName: "Cueva de Chauvet-Pont d'Arc, Ardèche",
      country: "Francia",
      coordinates: { lat: 44.3875, lon: 4.4142 },
      year: -34000,
      summary:
        "Descubierta en 1994, conserva más de mil imágenes del Paleolítico superior, muchas de animales. Un derrumbe selló su entrada durante milenios y preservó pinturas y huellas.",
      elements: [
        {
          id: "primeros-humanos--chauvet--landmark",
          category: "landmark",
          name: "Cueva de Chauvet-Pont d'Arc",
          yearLabel: "c. 36.000 – 30.000 años AP",
          summary:
            "Cavidad caliza sobre el valle del Ardèche, cerca del arco natural de Pont d'Arc. Declarada Patrimonio de la Humanidad en 2014; el público visita una réplica, la Caverne du Pont d'Arc.",
          sourceUrl: "https://es.wikipedia.org/wiki/Cueva_de_Chauvet",
          confidence: "medium",
        },
        {
          id: "primeros-humanos--chauvet--person",
          category: "person",
          name: "Huellas infantiles (hallazgo humano)",
          yearLabel: "c. 26.000 años AP",
          summary:
            "Sin individuos con nombre, la presencia humana más directa son huellas de pies atribuidas a un niño o preadolescente, acompañadas de marcas de antorcha.",
          sourceUrl: "https://es.wikipedia.org/wiki/Cueva_de_Chauvet",
          confidence: "medium",
        },
        {
          id: "primeros-humanos--chauvet--technology",
          category: "technology",
          name: "Pintura al carbón y raspado",
          yearLabel: "c. 36.000 años AP",
          summary:
            "Los artistas raspaban la pared para aclararla, pintaban con carbón vegetal y ocre y difuminaban el trazo para sugerir volumen y movimiento, aprovechando el relieve de la roca.",
          sourceUrl: "https://es.wikipedia.org/wiki/Cueva_de_Chauvet",
          confidence: "medium",
        },
        {
          id: "primeros-humanos--chauvet--culture",
          category: "culture",
          name: "Arte auriñaciense",
          yearLabel: "c. 36.000 – 30.000 años AP",
          summary:
            "Leones, rinocerontes, caballos y mamuts dominan los paneles, una fauna poco habitual en otras cuevas. Su calidad obligó a revisar la idea de que el arte rupestre evolucionó de lo simple a lo complejo.",
          sourceUrl: "https://es.wikipedia.org/wiki/Auriñaciense",
          confidence: "medium",
        },
        {
          id: "primeros-humanos--chauvet--event",
          category: "event",
          name: "Sellado de la entrada",
          yearLabel: "c. 21.000 años AP",
          summary:
            "Desprendimientos del acantilado cerraron la entrada original de la cueva. El sellado conservó intactas las pinturas, los restos de oso y las huellas hasta su descubrimiento en 1994.",
          sourceUrl: "https://es.wikipedia.org/wiki/Cueva_de_Chauvet",
          confidence: "medium",
        },
      ],
    },
  ],
};

export default era;
