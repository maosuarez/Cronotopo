import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "revolucion-neolitica",
  order: 2,
  name: "Revolución neolítica",
  macroPeriod: "prehistory",
  startYear: -10000,
  endYear: -3500,
  summary:
    "En Oriente Próximo y Asia oriental, grupos humanos empiezan a cultivar plantas, criar animales y vivir en aldeas permanentes. Surgen los primeros santuarios monumentales, las grandes aldeas aglomeradas y nuevas técnicas como la cerámica.",
  accentColor: "#c8b97a",
  locations: [
    {
      id: "revolucion-neolitica--gobekli-tepe",
      name: "Göbekli Tepe",
      modernName: "Göbekli Tepe, Şanlıurfa",
      country: "Turquía",
      coordinates: { lat: 37.2236, lon: 38.9217 },
      year: -9500,
      summary:
        "Colina artificial en el sureste de Anatolia ocupada entre c. 9500 y 8000 a.C., durante el Neolítico precerámico. Sus recintos circulares con pilares de piedra en forma de T figuran entre los megalitos más antiguos conocidos.",
      elements: [
        {
          id: "revolucion-neolitica--gobekli-tepe--landmark",
          category: "landmark",
          name: "Recintos de pilares en T",
          yearLabel: "c. 9500 – 8000 a.C.",
          summary:
            "Grandes recintos circulares con pilares de caliza en forma de T encajados en muros de piedra, con dos pilares mayores enfrentados en el centro. Patrimonio de la Humanidad desde 2018.",
          sourceUrl: "https://es.wikipedia.org/wiki/Göbekli_Tepe",
          confidence: "medium",
        },
        {
          id: "revolucion-neolitica--gobekli-tepe--person",
          category: "person",
          name: "Cráneos con incisiones (hallazgo humano)",
          yearLabel: "c. 9500 – 8000 a.C.",
          summary:
            "No hay individuos con nombre: en 2017 se publicaron fragmentos de cráneos humanos con incisiones profundas, interpretados como parte del culto a los cráneos extendido en el Neolítico de la región.",
          sourceUrl: "https://en.wikipedia.org/wiki/Göbekli_Tepe",
          confidence: "medium",
        },
        {
          id: "revolucion-neolitica--gobekli-tepe--technology",
          category: "technology",
          name: "Canteras de caliza y cisternas",
          yearLabel: "c. 9500 – 8000 a.C.",
          summary:
            "Los pilares se extraían del lecho de caliza cercano usando herramientas de sílex. Canales tallados en la roca recogían el agua de lluvia y la conducían a cisternas excavadas bajo el yacimiento.",
          sourceUrl: "https://en.wikipedia.org/wiki/Göbekli_Tepe",
          confidence: "medium",
        },
        {
          id: "revolucion-neolitica--gobekli-tepe--culture",
          category: "culture",
          name: "Relieves de animales y pilares antropomorfos",
          yearLabel: "c. 9500 – 8000 a.C.",
          summary:
            "Los pilares muestran serpientes, zorros, jabalíes y buitres, entre otros animales. Algunos llevan brazos, manos y taparrabos tallados, lo que sugiere que representaban figuras humanas o seres sobrenaturales.",
          sourceUrl: "https://es.wikipedia.org/wiki/Göbekli_Tepe",
          confidence: "medium",
        },
        {
          id: "revolucion-neolitica--gobekli-tepe--event",
          category: "event",
          name: "Deslizamientos y abandono del recinto D",
          yearLabel: "c. 8000 a.C.",
          summary:
            "Corrimientos de ladera arrastraron escombros sobre los recintos. Tras un segundo gran deslizamiento, el recinto D fue probablemente abandonado a finales del IX milenio a.C., según la cronología revisada del sitio.",
          sourceUrl: "https://en.wikipedia.org/wiki/Göbekli_Tepe",
          confidence: "medium",
        },
      ],
    },
    {
      id: "revolucion-neolitica--catalhoyuk",
      name: "Çatalhöyük",
      modernName: "Çatalhöyük, llanura de Konya",
      country: "Turquía",
      coordinates: { lat: 37.6667, lon: 32.8281 },
      year: -7000,
      summary:
        "Gran asentamiento neolítico de Anatolia central, habitado entre c. 7500 y 5600 a.C. y en su apogeo hacia el 7000 a.C. Sus casas de adobe apiñadas, murales y enterramientos lo convierten en un ejemplo excepcional de vida aldeana temprana.",
      elements: [
        {
          id: "revolucion-neolitica--catalhoyuk--landmark",
          category: "landmark",
          name: "Casas aglutinadas del montículo este",
          yearLabel: "c. 7500 – 6000 a.C.",
          summary:
            "Viviendas de adobe pegadas unas a otras, sin calles entre ellas, a las que se entraba por el techo mediante escaleras. Los interiores estaban enlucidos y tenían plataformas, hornos y hogares.",
          sourceUrl: "https://es.wikipedia.org/wiki/Çatalhöyük",
          confidence: "medium",
        },
        {
          id: "revolucion-neolitica--catalhoyuk--person",
          category: "person",
          name: "Enterramientos bajo las casas (hallazgo humano)",
          yearLabel: "c. 7000 a.C.",
          summary:
            "Sin individuos con nombre, la población se conoce por sus muertos, enterrados flexionados bajo suelos y plataformas de las casas. Algunos cráneos se retiraron, se recubrieron de yeso y se pintaron con ocre.",
          sourceUrl: "https://en.wikipedia.org/wiki/Çatalhöyük",
          confidence: "medium",
        },
        {
          id: "revolucion-neolitica--catalhoyuk--technology",
          category: "technology",
          name: "Herramientas de obsidiana",
          yearLabel: "c. 7000 a.C.",
          summary:
            "Casi toda la industria lítica es de obsidiana: hojas, puntas, raspadores y dagas. Su producción fue una actividad principal y probablemente se intercambiaba por conchas mediterráneas y sílex de Siria.",
          sourceUrl: "https://en.wikipedia.org/wiki/Çatalhöyük",
          confidence: "medium",
        },
        {
          id: "revolucion-neolitica--catalhoyuk--culture",
          category: "culture",
          name: "Mujer sentada de Çatalhöyük",
          yearLabel: "c. 6000 a.C.",
          summary:
            "Figurilla de barro de una mujer sentada entre dos felinos, hallada por James Mellaart en 1961. Se interpretó como una diosa madre, lectura que las excavaciones posteriores han matizado.",
          sourceUrl: "https://es.wikipedia.org/wiki/Mujer_sentada_de_Çatalhöyük",
          confidence: "medium",
        },
        {
          id: "revolucion-neolitica--catalhoyuk--event",
          category: "event",
          name: "Traslado al montículo oeste",
          yearLabel: "c. 6000 a.C.",
          summary:
            "Tras el Neolítico, el montículo este quedó abandonado y la ocupación continuó en el montículo oeste, a unos 300 m, durante el Calcolítico temprano.",
          sourceUrl: "https://en.wikipedia.org/wiki/Çatalhöyük",
          confidence: "medium",
        },
      ],
    },
    {
      id: "revolucion-neolitica--jiahu",
      name: "Jiahu",
      modernName: "Jiahu, condado de Wuyang, Henan",
      country: "China",
      coordinates: { lat: 33.613, lon: 113.667 },
      year: -6500,
      summary:
        "Aldea neolítica de la llanura central china habitada entre c. 7000 y 5700 a.C. Sus habitantes cultivaban arroz y mijo, y en sus vasijas se han identificado restos de una bebida fermentada de arroz, miel y fruta.",
      elements: [
        {
          id: "revolucion-neolitica--jiahu--landmark",
          category: "landmark",
          name: "Aldea de Jiahu",
          yearLabel: "c. 7000 – 5700 a.C.",
          summary:
            "Asentamiento rodeado por un foso, con casas semiexcavadas, hornos de cerámica, fosas de almacenaje y cementerios. Muchos lo consideran uno de los primeros ejemplos de la cultura de Peiligang.",
          sourceUrl: "https://en.wikipedia.org/wiki/Jiahu",
          confidence: "medium",
        },
        {
          id: "revolucion-neolitica--jiahu--person",
          category: "person",
          name: "Tumbas de Jiahu (hallazgo humano)",
          yearLabel: "c. 7000 – 5700 a.C.",
          summary:
            "Sin individuos con nombre, se conocen cientos de enterramientos. Los ajuares, de cerámica a caparazones de tortuga, varían según la persona y se han relacionado con su oficio en vida.",
          sourceUrl: "https://en.wikipedia.org/wiki/Jiahu",
          confidence: "medium",
        },
        {
          id: "revolucion-neolitica--jiahu--technology",
          category: "technology",
          name: "Signos de Jiahu (posible protoescritura)",
          yearLabel: "c. 6000 a.C.",
          summary:
            "Once signos grabados, nueve en caparazones de tortuga y dos en hueso. Algunos recuerdan a caracteres chinos muy posteriores, pero la mayoría de especialistas duda de que formen un sistema de escritura.",
          sourceUrl: "https://en.wikipedia.org/wiki/Jiahu_symbols",
          confidence: "low",
        },
        {
          id: "revolucion-neolitica--jiahu--culture",
          category: "culture",
          name: "Flautas de hueso de grulla",
          yearLabel: "c. 7000 – 5700 a.C.",
          summary:
            "Flautas talladas en huesos del ala de la grulla de corona roja, halladas como ofrendas funerarias. Figuran entre los instrumentos musicales tocables más antiguos y permiten producir escalas de varias notas.",
          sourceUrl: "https://en.wikipedia.org/wiki/Jiahu",
          confidence: "medium",
        },
        {
          id: "revolucion-neolitica--jiahu--event",
          category: "event",
          name: "Inundación y abandono de la aldea",
          yearLabel: "c. 5700 a.C.",
          summary:
            "Una fuerte crecida de los ríos cercanos sumergió la aldea. Sus habitantes la evacuaron llevándose casi todos sus bienes, y se desconoce a dónde se trasladaron.",
          sourceUrl: "https://en.wikipedia.org/wiki/Jiahu",
          confidence: "medium",
        },
      ],
    },
  ],
};

export default era;
