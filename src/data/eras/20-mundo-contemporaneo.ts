import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "mundo-contemporaneo",
  order: 20,
  name: "Mundo contemporáneo",
  macroPeriod: "contemporary",
  startYear: 1900,
  endYear: 2026,
  rangeLabel: "1900 – presente",
  summary:
    "Guerras mundiales, revoluciones y la Guerra Fría redibujan el mapa político del planeta. La física, la exploración espacial y la electrónica digital transforman la vida cotidiana a una velocidad sin precedentes.",
  accentColor: "#6ee7ff",
  locations: [
    {
      id: "mundo-contemporaneo--berlin",
      name: "Berlín",
      modernName: "Berlín",
      country: "Alemania",
      coordinates: { lat: 52.52, lon: 13.405 },
      year: 1989,
      summary:
        "Capital imperial, republicana y nazi, Berlín fue dividida tras 1945 y se convirtió en el símbolo de la Guerra Fría. La caída del Muro en 1989 abrió el camino a la reunificación alemana.",
      elements: [
        {
          id: "mundo-contemporaneo--berlin--landmark",
          category: "landmark",
          name: "Edificio del Reichstag",
          yearLabel: "1894 – 1999",
          summary:
            "Sede parlamentaria inaugurada en 1894 e incendiada en 1933, hecho que los nazis usaron para suspender libertades. Restaurado tras la reunificación, desde 1999 alberga el Bundestag bajo una cúpula de vidrio.",
          sourceUrl: "https://es.wikipedia.org/wiki/Edificio_del_Reichstag",
          confidence: "high",
        },
        {
          id: "mundo-contemporaneo--berlin--person",
          category: "person",
          name: "Albert Einstein",
          yearLabel: "1914 – 1932",
          summary:
            "Vivió y trabajó en Berlín como miembro de la Academia Prusiana de Ciencias, y allí completó la teoría de la relatividad general en 1915. Abandonó Alemania ante el ascenso del nazismo.",
          sourceUrl: "https://es.wikipedia.org/wiki/Albert_Einstein",
          confidence: "high",
        },
        {
          id: "mundo-contemporaneo--berlin--technology",
          category: "technology",
          name: "Computadora Z3",
          yearLabel: "1941",
          year: 1941,
          summary:
            "Máquina electromecánica de relés construida por Konrad Zuse en Berlín. Se considera la primera computadora digital programable y totalmente automática en funcionar; el original se destruyó en un bombardeo.",
          sourceUrl: "https://es.wikipedia.org/wiki/Z3_(computadora)",
          confidence: "high",
        },
        {
          id: "mundo-contemporaneo--berlin--culture",
          category: "culture",
          name: "La ópera de tres centavos",
          yearLabel: "1928",
          year: 1928,
          summary:
            "Obra de teatro musical de Bertolt Brecht y Kurt Weill estrenada en Berlín. Su crítica social y sus canciones la convirtieron en un emblema de la vibrante cultura de la República de Weimar.",
          sourceUrl: "https://es.wikipedia.org/wiki/La_ópera_de_tres_centavos",
          confidence: "high",
        },
        {
          id: "mundo-contemporaneo--berlin--event",
          category: "event",
          name: "Caída del Muro de Berlín",
          yearLabel: "1989",
          year: 1989,
          summary:
            "La noche del 9 de noviembre de 1989, tras un anuncio confuso sobre la libertad de viajar, miles de berlineses orientales cruzaron los pasos fronterizos. Alemania se reunificó en octubre de 1990.",
          sourceUrl: "https://es.wikipedia.org/wiki/Caída_del_Muro_de_Berlín",
          confidence: "high",
        },
      ],
    },
    {
      id: "mundo-contemporaneo--cabo-canaveral",
      name: "Cabo Cañaveral",
      modernName: "Complejo de Lanzamiento 39, Centro Espacial Kennedy, Florida",
      country: "Estados Unidos",
      coordinates: { lat: 28.6084, lon: -80.6043 },
      year: 1969,
      summary:
        "La costa atlántica de Florida se convirtió en la principal base de lanzamientos de Estados Unidos durante la carrera espacial. Desde el Complejo 39 partieron las misiones Apolo a la Luna y, más tarde, los transbordadores espaciales.",
      elements: [
        {
          id: "mundo-contemporaneo--cabo-canaveral--landmark",
          category: "landmark",
          name: "Complejo de Lanzamiento 39",
          yearLabel: "1967 – presente",
          summary:
            "Conjunto de plataformas de lanzamiento, 39A y 39B, construido para el cohete Saturno V en la isla Merritt. Sirvió a las misiones Apolo y al transbordador espacial, y hoy lo usan vehículos comerciales.",
          sourceUrl: "https://en.wikipedia.org/wiki/Kennedy_Space_Center_Launch_Complex_39",
          confidence: "high",
        },
        {
          id: "mundo-contemporaneo--cabo-canaveral--person",
          category: "person",
          name: "Kurt H. Debus",
          yearLabel: "1962 – 1974",
          summary:
            "Ingeniero alemán que había trabajado en los cohetes V-2 y fue miembro de las SS. En 1962 se convirtió en el primer director del centro de lanzamientos de Florida, luego Centro Espacial Kennedy.",
          sourceUrl: "https://en.wikipedia.org/wiki/Kurt_H._Debus",
          confidence: "high",
        },
        {
          id: "mundo-contemporaneo--cabo-canaveral--technology",
          category: "technology",
          name: "Saturno V",
          yearLabel: "1967 – 1973",
          summary:
            "Cohete de tres etapas desarrollado por la NASA bajo la dirección técnica de Wernher von Braun. Llevó a las tripulaciones Apolo hacia la Luna y realizó trece lanzamientos entre 1967 y 1973.",
          sourceUrl: "https://es.wikipedia.org/wiki/Saturno_V",
          confidence: "high",
        },
        {
          id: "mundo-contemporaneo--cabo-canaveral--culture",
          category: "culture",
          name: "Carrera espacial",
          yearLabel: "1957 – 1975",
          summary:
            "La rivalidad entre Estados Unidos y la Unión Soviética por la conquista del espacio se vivió como un espectáculo mundial. Los lanzamientos retransmitidos por televisión marcaron a toda una generación.",
          sourceUrl: "https://es.wikipedia.org/wiki/Carrera_espacial",
          confidence: "medium",
        },
        {
          id: "mundo-contemporaneo--cabo-canaveral--event",
          category: "event",
          name: "Lanzamiento del Apolo 11",
          yearLabel: "1969",
          year: 1969,
          summary:
            "El 16 de julio de 1969 un Saturno V despegó de la plataforma 39A con Neil Armstrong, Buzz Aldrin y Michael Collins. Cuatro días después, Armstrong y Aldrin pisaron la Luna.",
          sourceUrl: "https://es.wikipedia.org/wiki/Apolo_11",
          confidence: "high",
        },
      ],
    },
    {
      id: "mundo-contemporaneo--silicon-valley",
      name: "Silicon Valley",
      modernName: "Garaje de HP, 367 Addison Avenue, Palo Alto, California",
      country: "Estados Unidos",
      coordinates: { lat: 37.4431, lon: -122.1548 },
      year: 1971,
      summary:
        "El sur de la bahía de San Francisco, en torno a la Universidad de Stanford, se convirtió en el gran polo mundial de la electrónica y la informática. La industria de los semiconductores le dio su nombre en la década de 1970.",
      elements: [
        {
          id: "mundo-contemporaneo--silicon-valley--landmark",
          category: "landmark",
          name: "Garaje de HP",
          yearLabel: "1939",
          year: 1939,
          summary:
            "Pequeño garaje de Palo Alto donde Bill Hewlett y David Packard fundaron su empresa en 1939. Está reconocido oficialmente como lugar de nacimiento de Silicon Valley.",
          sourceUrl: "https://en.wikipedia.org/wiki/HP_Garage",
          confidence: "high",
        },
        {
          id: "mundo-contemporaneo--silicon-valley--person",
          category: "person",
          name: "Frederick Terman",
          yearLabel: "1900 – 1982",
          summary:
            "Profesor de ingeniería y luego rector académico de Stanford. Animó a sus alumnos, entre ellos Hewlett y Packard, a crear empresas cerca de la universidad e impulsó el parque industrial de Stanford.",
          sourceUrl: "https://es.wikipedia.org/wiki/Frederick_Terman",
          confidence: "high",
        },
        {
          id: "mundo-contemporaneo--silicon-valley--technology",
          category: "technology",
          name: "Intel 4004",
          yearLabel: "1971",
          year: 1971,
          summary:
            "Se considera el primer microprocesador comercial en un solo chip; lo lanzó Intel. Concebido para una calculadora japonesa, integraba en una pastilla de silicio toda la unidad central de proceso.",
          sourceUrl: "https://es.wikipedia.org/wiki/Intel_4004",
          confidence: "high",
        },
        {
          id: "mundo-contemporaneo--silicon-valley--culture",
          category: "culture",
          name: "Homebrew Computer Club",
          yearLabel: "1975 – 1986",
          summary:
            "Club de aficionados a la informática que se reunía en la zona de Menlo Park. En sus encuentros se intercambiaban ideas y diseños; Steve Wozniak presentó allí el prototipo del Apple I.",
          sourceUrl: "https://es.wikipedia.org/wiki/Homebrew_Computer_Club",
          confidence: "high",
        },
        {
          id: "mundo-contemporaneo--silicon-valley--event",
          category: "event",
          name: "Fundación de Fairchild Semiconductor",
          yearLabel: "1957",
          year: 1957,
          summary:
            "Ocho ingenieros que abandonaron el laboratorio de William Shockley fundaron la empresa para fabricar transistores de silicio. De sus antiguos empleados surgieron después Intel y muchas otras compañías.",
          sourceUrl: "https://es.wikipedia.org/wiki/Fairchild_Semiconductor",
          confidence: "high",
        },
      ],
    },
  ],
};

export default era;
