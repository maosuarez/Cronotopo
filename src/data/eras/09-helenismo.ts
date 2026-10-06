import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "helenismo",
  order: 9,
  name: "Helenismo",
  macroPeriod: "antiquity",
  startYear: -323,
  endYear: -30,
  summary:
    "A la muerte de Alejandro Magno, sus generales se reparten el imperio en reinos que difunden la lengua y la cultura griegas por Oriente. Grandes capitales como Alejandría, Pérgamo y Antioquía impulsan la ciencia, las bibliotecas y el arte hasta la conquista romana.",
  accentColor: "#5fd0c8",
  locations: [
    {
      id: "helenismo--alejandria",
      name: "Alejandría",
      modernName: "Alejandría",
      country: "Egipto",
      coordinates: { lat: 31.1975, lon: 29.8925 },
      year: -250,
      summary:
        "Fundada por Alejandro en el delta del Nilo, fue la capital de los Ptolomeos y la mayor ciudad del Mediterráneo helenístico. Su Museo y su Biblioteca atrajeron a sabios de todo el mundo griego.",
      elements: [
        {
          id: "helenismo--alejandria--landmark",
          category: "landmark",
          name: "Faro de Alejandría",
          yearLabel: "c. 280 a.C.",
          summary:
            "Torre levantada en la isla de Faros bajo los primeros Ptolomeos para guiar a los barcos hacia el puerto. Fue una de las siete maravillas del mundo antiguo y la arruinaron terremotos medievales.",
          sourceUrl: "https://es.wikipedia.org/wiki/Faro_de_Alejandría",
          confidence: "medium",
        },
        {
          id: "helenismo--alejandria--person",
          category: "person",
          name: "Cleopatra VII",
          yearLabel: "69 – 30 a.C.",
          year: -69,
          summary:
            "Última soberana de la dinastía ptolemaica. Se alió con Julio César y después con Marco Antonio; tras la derrota de ambos ante Octavio, se suicidó en Alejandría y Egipto pasó a Roma.",
          sourceUrl: "https://es.wikipedia.org/wiki/Cleopatra_VII",
          confidence: "high",
        },
        {
          id: "helenismo--alejandria--technology",
          category: "technology",
          name: "Medición de la circunferencia terrestre",
          yearLabel: "c. 240 a.C.",
          summary:
            "Eratóstenes, director de la Biblioteca, comparó la sombra del sol en Siena y Alejandría el mismo día y, con geometría, calculó el tamaño de la Tierra con notable aproximación.",
          sourceUrl: "https://es.wikipedia.org/wiki/Eratóstenes",
          confidence: "medium",
        },
        {
          id: "helenismo--alejandria--culture",
          category: "culture",
          name: "Biblioteca de Alejandría",
          yearLabel: "s. III a.C.",
          summary:
            "Creada por los Ptolomeos junto al Museo, reunió la mayor colección de rollos del mundo antiguo. Allí trabajaron filólogos, matemáticos y astrónomos que editaron y comentaron los clásicos griegos.",
          sourceUrl: "https://es.wikipedia.org/wiki/Biblioteca_de_Alejandría",
          confidence: "high",
        },
        {
          id: "helenismo--alejandria--event",
          category: "event",
          name: "Asedio de Alejandría e incendio",
          yearLabel: "48 – 47 a.C.",
          year: -48,
          summary:
            "Sitiado en la ciudad, Julio César incendió naves en el puerto. Según autores antiguos, el fuego alcanzó parte del barrio del palacio y de la Biblioteca; el alcance real de los daños sigue debatido.",
          sourceUrl: "https://en.wikipedia.org/wiki/Siege_of_Alexandria_(47_BC)",
          confidence: "medium",
        },
      ],
    },
    {
      id: "helenismo--pergamo",
      name: "Pérgamo",
      modernName: "Bergama, provincia de Esmirna",
      country: "Turquía",
      coordinates: { lat: 39.1325, lon: 27.1842 },
      year: -170,
      summary:
        "Capital del reino de los Atálidas, construida en terrazas sobre una colina escarpada. Sus reyes la convirtieron en un centro artístico y cultural capaz de rivalizar con Alejandría.",
      elements: [
        {
          id: "helenismo--pergamo--landmark",
          category: "landmark",
          name: "Altar de Pérgamo",
          yearLabel: "c. 180 – 160 a.C.",
          summary:
            "Monumental altar con un friso que narra la lucha de los dioses contra los gigantes. Excavado por arqueólogos alemanes en el siglo XIX, se reconstruyó en el Museo de Pérgamo de Berlín.",
          sourceUrl: "https://es.wikipedia.org/wiki/Altar_de_Pérgamo",
          confidence: "medium",
        },
        {
          id: "helenismo--pergamo--person",
          category: "person",
          name: "Eumenes II",
          yearLabel: "r. 197 – 159 a.C.",
          year: -197,
          summary:
            "Rey de Pérgamo y aliado de Roma, con cuyo apoyo amplió mucho su reino en Asia Menor. Durante su reinado se embelleció la acrópolis y se impulsó la gran biblioteca.",
          sourceUrl: "https://es.wikipedia.org/wiki/Eumenes_II",
          confidence: "high",
        },
        {
          id: "helenismo--pergamo--technology",
          category: "technology",
          name: "Pergamino",
          yearLabel: "s. II a.C.",
          summary:
            "Soporte de escritura de piel preparada cuyo nombre deriva de Pérgamo, gran centro productor en época helenística. La leyenda transmitida por Plinio, que lo hace invento local ante la falta de papiro, es casi con certeza falsa.",
          sourceUrl: "https://en.wikipedia.org/wiki/Parchment",
          confidence: "medium",
        },
        {
          id: "helenismo--pergamo--culture",
          category: "culture",
          name: "Biblioteca de Pérgamo",
          yearLabel: "s. II a.C.",
          summary:
            "Fundada por los Atálidas, llegó a ser una de las mayores bibliotecas del mundo helenístico, solo superada por la de Alejandría. Fue también un importante centro de estudios gramaticales.",
          sourceUrl: "https://es.wikipedia.org/wiki/Biblioteca_de_Pérgamo",
          confidence: "high",
        },
        {
          id: "helenismo--pergamo--event",
          category: "event",
          name: "Legado de Átalo III a Roma",
          yearLabel: "133 a.C.",
          year: -133,
          summary:
            "El último rey atálida murió sin herederos y dejó su reino en testamento al pueblo romano. Sus territorios formaron poco después la provincia romana de Asia.",
          sourceUrl: "https://es.wikipedia.org/wiki/Átalo_III",
          confidence: "high",
        },
      ],
    },
    {
      id: "helenismo--antioquia",
      name: "Antioquía",
      modernName: "Antakya, provincia de Hatay",
      country: "Turquía",
      coordinates: { lat: 36.2047, lon: 36.1817 },
      year: -300,
      summary:
        "Fundada junto al río Orontes por Seleuco I, fue capital del Imperio seléucida y una de las grandes urbes del Mediterráneo oriental. Su trazado ortogonal imitaba el de Alejandría.",
      elements: [
        {
          id: "helenismo--antioquia--landmark",
          category: "landmark",
          name: "Santuario de Apolo en Dafne",
          yearLabel: "c. 300 a.C.",
          summary:
            "En el arrabal de Dafne, un parque de bosques y manantiales, Seleuco I fundó un gran templo de Apolo con una estatua de culto obra de Briaxis. El lugar fue célebre durante siglos.",
          sourceUrl: "https://en.wikipedia.org/wiki/Antioch",
          confidence: "medium",
        },
        {
          id: "helenismo--antioquia--person",
          category: "person",
          name: "Seleuco I Nicátor",
          yearLabel: "c. 358 – 281 a.C.",
          summary:
            "General de Alejandro que fundó el Imperio seléucida, extendido de Siria al Irán. Creó varias ciudades en el norte de Siria, entre ellas Antioquía, a la que dio el nombre de su padre.",
          sourceUrl: "https://es.wikipedia.org/wiki/Seleuco_I_Nicátor",
          confidence: "medium",
        },
        {
          id: "helenismo--antioquia--technology",
          category: "technology",
          name: "Plano en cuadrícula",
          yearLabel: "c. 300 a.C.",
          summary:
            "El arquitecto Xenario trazó la ciudad con calles rectas que se cruzaban en ángulo recto, a imitación de Alejandría. La ciudadela se situaba en el monte Silpio, sobre la llanura del Orontes.",
          sourceUrl: "https://en.wikipedia.org/wiki/Antioch",
          confidence: "medium",
        },
        {
          id: "helenismo--antioquia--culture",
          category: "culture",
          name: "Tique de Antioquía",
          yearLabel: "c. 300 a.C.",
          summary:
            "Estatua de la diosa que personificaba a la recién fundada ciudad, obra de Eutíquides, discípulo de Lisipo. Sentada sobre una roca y coronada de torres, tenía a sus pies al dios del río Orontes.",
          sourceUrl: "https://en.wikipedia.org/wiki/Eutychides",
          confidence: "medium",
        },
        {
          id: "helenismo--antioquia--event",
          category: "event",
          name: "Fundación de Antioquía",
          yearLabel: "300 a.C.",
          year: -300,
          summary:
            "Seleuco I fundó la ciudad junto con otras tres para asegurar el norte de Siria, recién conquistado. Eligió un emplazamiento a orillas del Orontes, en la fértil llanura del Amuq.",
          sourceUrl: "https://en.wikipedia.org/wiki/Antioch",
          confidence: "high",
        },
      ],
    },
  ],
};

export default era;
