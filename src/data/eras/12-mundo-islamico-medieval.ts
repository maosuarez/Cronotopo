import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "mundo-islamico-medieval",
  order: 12,
  name: "Mundo islámico medieval",
  macroPeriod: "middle-ages",
  startYear: 600,
  endYear: 1200,
  summary:
    "Tras la expansión iniciada en el siglo VII, el islam une bajo califatos rivales un territorio que va de al-Ándalus a Asia Central. Sus capitales se convierten en focos de comercio, traducción y avance científico.",
  accentColor: "#4cc9f0",
  locations: [
    {
      id: "mundo-islamico-medieval--bagdad",
      name: "Bagdad",
      modernName: "Bagdad",
      country: "Irak",
      coordinates: { lat: 33.3475, lon: 44.335 },
      year: 830,
      summary:
        "Fundada por el califa abasí al-Mansur junto al Tigris, Bagdad se convirtió en pocas décadas en una de las mayores ciudades del mundo. Bajo los abasíes fue el gran centro de traducción y estudio del saber griego, persa e indio.",
      elements: [
        {
          id: "mundo-islamico-medieval--bagdad--landmark",
          category: "landmark",
          name: "Ciudad redonda de Bagdad",
          yearLabel: "762 – 766",
          year: 762,
          summary:
            "Núcleo fundacional de Bagdad, de planta circular, con murallas, cuatro puertas y el palacio y la mezquita del califa en el centro. No se conserva nada visible: se conoce por descripciones de autores medievales.",
          sourceUrl: "https://en.wikipedia.org/wiki/Round_city_of_Baghdad",
          confidence: "high",
        },
        {
          id: "mundo-islamico-medieval--bagdad--person",
          category: "person",
          name: "Al-Juarismi",
          yearLabel: "c. 780 – c. 850",
          summary:
            "Matemático y astrónomo de origen persa vinculado a la Casa de la Sabiduría de Bagdad. Su tratado sobre al-jabr dio nombre al álgebra, y la latinización de su nombre originó la palabra algoritmo.",
          sourceUrl: "https://es.wikipedia.org/wiki/Al-Juarismi",
          confidence: "medium",
        },
        {
          id: "mundo-islamico-medieval--bagdad--technology",
          category: "technology",
          name: "Fabricación de papel",
          yearLabel: "finales del s. VIII",
          summary:
            "La técnica del papel, de origen chino, llegó al mundo islámico a través de Asia Central y se fabricó en Bagdad desde finales del siglo VIII. Más barato que el pergamino, impulsó la administración y la producción de libros.",
          sourceUrl: "https://en.wikipedia.org/wiki/Paper",
          confidence: "medium",
        },
        {
          id: "mundo-islamico-medieval--bagdad--culture",
          category: "culture",
          name: "Movimiento de traducción",
          yearLabel: "s. VIII – X",
          summary:
            "Con mecenazgo de califas y élites, eruditos de distintas lenguas y religiones tradujeron al árabe obras griegas, persas e indias de filosofía, medicina y astronomía, en torno a la Casa de la Sabiduría.",
          sourceUrl: "https://es.wikipedia.org/wiki/Casa_de_la_Sabiduría",
          confidence: "high",
        },
        {
          id: "mundo-islamico-medieval--bagdad--event",
          category: "event",
          name: "Asedio de Bagdad",
          yearLabel: "812 – 813",
          year: 813,
          summary:
            "En la guerra civil entre los hijos de Harún al-Rashid, las tropas de al-Mamún sitiaron Bagdad durante más de un año. La ciudad cayó en 813, el califa al-Amín murió y al-Mamún quedó como único soberano.",
          sourceUrl: "https://en.wikipedia.org/wiki/Siege_of_Baghdad_(812–813)",
          confidence: "high",
        },
      ],
    },
    {
      id: "mundo-islamico-medieval--cordoba",
      name: "Córdoba",
      modernName: "Córdoba, Andalucía",
      country: "España",
      coordinates: { lat: 37.8792, lon: -4.7797 },
      year: 961,
      summary:
        "Capital del emirato y después del califato omeya de al-Ándalus, Córdoba fue en el siglo X una de las mayores ciudades de Europa. Su mezquita aljama y su vida intelectual reflejan el esplendor andalusí.",
      elements: [
        {
          id: "mundo-islamico-medieval--cordoba--landmark",
          category: "landmark",
          name: "Mezquita de Córdoba",
          yearLabel: "785 – 987",
          year: 785,
          summary:
            "Iniciada por Abderramán I en 785 y ampliada por sus sucesores hasta finales del siglo X, su bosque de columnas y arcos la convirtió en el principal monumento del islam occidental. Hoy es catedral.",
          sourceUrl: "https://es.wikipedia.org/wiki/Mezquita-catedral_de_Córdoba",
          confidence: "high",
        },
        {
          id: "mundo-islamico-medieval--cordoba--person",
          category: "person",
          name: "Abulcasis",
          yearLabel: "c. 936 – c. 1013",
          summary:
            "Médico cordobés que trabajó en la corte califal. Su enciclopedia médica al-Tasrif dedica un tratado a la cirugía con dibujos de instrumentos, y su traducción latina se usó en Europa durante siglos.",
          sourceUrl: "https://es.wikipedia.org/wiki/Abulcasis",
          confidence: "medium",
        },
        {
          id: "mundo-islamico-medieval--cordoba--technology",
          category: "technology",
          name: "Arcos superpuestos",
          yearLabel: "s. VIII",
          summary:
            "Para ganar altura con columnas reaprovechadas, los constructores de la mezquita superpusieron dos órdenes de arcos: de herradura abajo y de medio punto arriba, con dovelas alternas de piedra y ladrillo.",
          sourceUrl: "https://es.wikipedia.org/wiki/Mezquita-catedral_de_Córdoba",
          confidence: "high",
        },
        {
          id: "mundo-islamico-medieval--cordoba--culture",
          category: "culture",
          name: "Biblioteca de al-Hakam II",
          yearLabel: "961 – 976",
          summary:
            "El califa al-Hakam II, gran bibliófilo, reunió en Córdoba una biblioteca célebre por su tamaño, con copistas y agentes que adquirían libros en todo el mundo islámico. Fue dispersada tras su muerte.",
          sourceUrl: "https://es.wikipedia.org/wiki/Alhakén_II",
          confidence: "medium",
        },
        {
          id: "mundo-islamico-medieval--cordoba--event",
          category: "event",
          name: "Proclamación del califato",
          yearLabel: "929",
          year: 929,
          summary:
            "Abderramán III se proclamó califa en 929, asumiendo la dignidad califal, que los emires omeyas no habían reclamado frente a Bagdad, y rivalizando con los fatimíes. Córdoba pasó a ser capital de un califato independiente que duró hasta 1031.",
          sourceUrl: "https://es.wikipedia.org/wiki/Califato_de_Córdoba",
          confidence: "high",
        },
      ],
    },
    {
      id: "mundo-islamico-medieval--el-cairo",
      name: "El Cairo",
      modernName: "El Cairo",
      country: "Egipto",
      coordinates: { lat: 30.0457, lon: 31.2627 },
      year: 1000,
      summary:
        "Fundada por los fatimíes junto a la antigua Fustat, El Cairo se convirtió en la capital de un califato chií que dominó Egipto y buena parte del Mediterráneo oriental. Fue un gran centro de comercio, ciencia y saber religioso.",
      elements: [
        {
          id: "mundo-islamico-medieval--el-cairo--landmark",
          category: "landmark",
          name: "Mezquita de al-Azhar",
          yearLabel: "970 – 972",
          year: 972,
          summary:
            "Construida por los fatimíes poco después de fundar la ciudad, fue desde muy pronto un centro de enseñanza. Ampliada por dinastías posteriores, alberga una de las instituciones de estudio más antiguas en funcionamiento.",
          sourceUrl: "https://es.wikipedia.org/wiki/Mezquita_de_al-Azhar",
          confidence: "high",
        },
        {
          id: "mundo-islamico-medieval--el-cairo--person",
          category: "person",
          name: "Alhacén (Ibn al-Haytham)",
          yearLabel: "c. 965 – c. 1040",
          summary:
            "Científico nacido en Basora que pasó buena parte de su vida en El Cairo fatimí. Su Libro de óptica explicó la visión como luz que entra en el ojo y defendió la comprobación experimental.",
          sourceUrl: "https://es.wikipedia.org/wiki/Alhacén",
          confidence: "medium",
        },
        {
          id: "mundo-islamico-medieval--el-cairo--technology",
          category: "technology",
          name: "Nilómetro de la isla de Roda",
          yearLabel: "861",
          year: 861,
          summary:
            "Pozo con una columna graduada, comunicado con el Nilo, que permitía medir el nivel de la crecida anual. De esa medida dependía la previsión de las cosechas y los impuestos de Egipto.",
          sourceUrl: "https://es.wikipedia.org/wiki/Nilómetro",
          confidence: "high",
        },
        {
          id: "mundo-islamico-medieval--el-cairo--culture",
          category: "culture",
          name: "Documentos de la Guenizá de El Cairo",
          yearLabel: "s. X – XIII",
          summary:
            "En el depósito de la sinagoga Ben Ezra de Fustat se acumularon durante siglos cartas, contratos y textos religiosos. Revelan con detalle la vida cotidiana y el comercio mediterráneo de la época fatimí.",
          sourceUrl: "https://es.wikipedia.org/wiki/Guenizá_del_Cairo",
          confidence: "high",
        },
        {
          id: "mundo-islamico-medieval--el-cairo--event",
          category: "event",
          name: "Fundación de El Cairo",
          yearLabel: "969",
          year: 969,
          summary:
            "Tras conquistar Egipto, el general Jawhar al-Siqilli fundó una nueva ciudad palaciega para el califa fatimí al-Muizz. Llamada al-Qahira, la victoriosa, acabaría absorbiendo a la vecina Fustat.",
          sourceUrl: "https://es.wikipedia.org/wiki/El_Cairo",
          confidence: "high",
        },
      ],
    },
  ],
};

export default era;
