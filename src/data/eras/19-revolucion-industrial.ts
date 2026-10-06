import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "revolucion-industrial",
  order: 19,
  name: "Revolución industrial",
  macroPeriod: "contemporary",
  startYear: 1760,
  endYear: 1900,
  summary:
    "El carbón, el vapor y las máquinas transforman la producción, primero en Gran Bretaña y luego en Europa continental y Estados Unidos. Surgen la fábrica, el ferrocarril y la gran ciudad obrera, junto con nuevas desigualdades y movimientos sociales.",
  accentColor: "#c9a77c",
  locations: [
    {
      id: "revolucion-industrial--manchester",
      name: "Mánchester",
      modernName: "Mánchester, Gran Mánchester",
      country: "Reino Unido",
      coordinates: { lat: 53.4794, lon: -2.2453 },
      year: 1830,
      summary:
        "La industria algodonera convirtió a Mánchester en la que se considera a menudo la primera gran ciudad industrial del mundo. Canales, fábricas de vapor y el ferrocarril la conectaron con el puerto de Liverpool y con los mercados globales.",
      elements: [
        {
          id: "revolucion-industrial--manchester--landmark",
          category: "landmark",
          name: "Hilanderías de Ancoats",
          yearLabel: "c. 1790 – s. XIX",
          summary:
            "Barrio de grandes hilanderías de algodón junto a los canales, considerado el primer suburbio industrial del mundo. Entre sus fábricas más antiguas están las Murray's Mills, iniciadas en 1798.",
          sourceUrl: "https://en.wikipedia.org/wiki/Ancoats",
          confidence: "medium",
        },
        {
          id: "revolucion-industrial--manchester--person",
          category: "person",
          name: "Friedrich Engels",
          yearLabel: "1842 – 1844",
          summary:
            "Hijo de un industrial alemán, trabajó en la empresa textil familiar en Mánchester. De su observación de los barrios obreros nació La situación de la clase obrera en Inglaterra, publicada en 1845.",
          sourceUrl: "https://es.wikipedia.org/wiki/Friedrich_Engels",
          confidence: "high",
        },
        {
          id: "revolucion-industrial--manchester--technology",
          category: "technology",
          name: "Canal de Bridgewater",
          yearLabel: "1761",
          year: 1761,
          summary:
            "Encargado por el duque de Bridgewater para llevar el carbón de sus minas de Worsley a Mánchester. Abarató el combustible de la ciudad y suele considerarse el inicio de la era de los canales en Gran Bretaña.",
          sourceUrl: "https://es.wikipedia.org/wiki/Canal_de_Bridgewater",
          confidence: "high",
        },
        {
          id: "revolucion-industrial--manchester--culture",
          category: "culture",
          name: "Escuela de Mánchester",
          yearLabel: "s. XIX",
          summary:
            "Movimiento liberal encabezado por Richard Cobden y John Bright que defendía el libre comercio. Impulsó la campaña contra las Leyes del Grano, que fueron derogadas en 1846.",
          sourceUrl: "https://es.wikipedia.org/wiki/Escuela_de_Mánchester",
          confidence: "high",
        },
        {
          id: "revolucion-industrial--manchester--event",
          category: "event",
          name: "Ferrocarril Liverpool–Mánchester",
          yearLabel: "1830",
          year: 1830,
          summary:
            "Inaugurado en septiembre de 1830, fue el primer ferrocarril interurbano con tracción a vapor y horario regular para pasajeros y mercancías. En la inauguración murió atropellado el diputado William Huskisson.",
          sourceUrl: "https://en.wikipedia.org/wiki/Liverpool_and_Manchester_Railway",
          confidence: "high",
        },
      ],
    },
    {
      id: "revolucion-industrial--essen",
      name: "Essen",
      modernName: "Essen, Renania del Norte-Westfalia",
      country: "Alemania",
      coordinates: { lat: 51.4508, lon: 7.0131 },
      year: 1880,
      summary:
        "Situada sobre la cuenca carbonífera del Ruhr, Essen pasó de pequeña ciudad a gran centro minero y siderúrgico en el siglo XIX. La empresa Krupp la convirtió en sinónimo de la industria pesada alemana.",
      elements: [
        {
          id: "revolucion-industrial--essen--landmark",
          category: "landmark",
          name: "Mina de carbón de Zollverein",
          yearLabel: "1847 – 1986",
          year: 1847,
          summary:
            "Mina fundada en 1847 por Franz Haniel, con extracción de carbón desde 1851 hasta 1986. Su conjunto de pozos y coquería es Patrimonio de la Humanidad desde 2001.",
          sourceUrl: "https://es.wikipedia.org/wiki/Complejo_industrial_de_la_mina_de_carbón_de_Zollverein",
          confidence: "high",
        },
        {
          id: "revolucion-industrial--essen--person",
          category: "person",
          name: "Alfred Krupp",
          yearLabel: "1812 – 1887",
          summary:
            "Heredó de adolescente la pequeña fundición de su padre y la transformó en un gigante del acero. Sus productos, de ruedas ferroviarias a cañones, le valieron el apodo de rey de los cañones.",
          sourceUrl: "https://es.wikipedia.org/wiki/Alfred_Krupp",
          confidence: "high",
        },
        {
          id: "revolucion-industrial--essen--technology",
          category: "technology",
          name: "Llanta ferroviaria sin soldadura",
          yearLabel: "c. 1851",
          year: 1851,
          summary:
            "Krupp patentó una llanta de rueda ferroviaria de acero sin soldadura, que se convirtió en la principal fuente de ingresos de la empresa gracias a las ventas a ferrocarriles de Estados Unidos.",
          sourceUrl: "https://en.wikipedia.org/wiki/Alfred_Krupp",
          confidence: "medium",
        },
        {
          id: "revolucion-industrial--essen--culture",
          category: "culture",
          name: "Paternalismo industrial de Krupp",
          yearLabel: "s. XIX",
          summary:
            "La empresa ofreció a sus obreros viviendas subvencionadas y prestaciones de salud y jubilación, algo inusual en la época.",
          sourceUrl: "https://en.wikipedia.org/wiki/Krupp",
          confidence: "medium",
        },
        {
          id: "revolucion-industrial--essen--event",
          category: "event",
          name: "Fundación de la fábrica Krupp",
          yearLabel: "1811",
          year: 1811,
          summary:
            "Friedrich Krupp fundó en Essen una fundición para producir acero fundido. No logró hacerla rentable antes de morir en 1826, y su hijo Alfred tomó las riendas del negocio.",
          sourceUrl: "https://en.wikipedia.org/wiki/Krupp",
          confidence: "high",
        },
      ],
    },
    {
      id: "revolucion-industrial--pittsburgh",
      name: "Pittsburgh",
      modernName: "Pittsburgh, Pensilvania",
      country: "Estados Unidos",
      coordinates: { lat: 40.4406, lon: -79.9959 },
      year: 1875,
      summary:
        "En la confluencia de los ríos Allegheny y Monongahela, junto a grandes yacimientos de carbón, Pittsburgh se convirtió en la capital del acero estadounidense. Sus acerías alimentaron el ferrocarril y el crecimiento urbano del país.",
      elements: [
        {
          id: "revolucion-industrial--pittsburgh--landmark",
          category: "landmark",
          name: "Acería Edgar Thomson",
          yearLabel: "1875",
          year: 1875,
          summary:
            "Acería de Andrew Carnegie en Braddock, junto al Monongahela, diseñada en torno al convertidor Bessemer. Produjo su primer acero en agosto de 1875 para raíles y sigue en funcionamiento.",
          sourceUrl: "https://en.wikipedia.org/wiki/Edgar_Thomson_Steel_Works",
          confidence: "high",
        },
        {
          id: "revolucion-industrial--pittsburgh--person",
          category: "person",
          name: "Andrew Carnegie",
          yearLabel: "1835 – 1919",
          summary:
            "Inmigrante escocés que llegó de niño a Pittsburgh y levantó un imperio siderúrgico. Tras vender su empresa en 1901 dedicó su fortuna a la filantropía, sobre todo a bibliotecas públicas.",
          sourceUrl: "https://es.wikipedia.org/wiki/Andrew_Carnegie",
          confidence: "high",
        },
        {
          id: "revolucion-industrial--pittsburgh--technology",
          category: "technology",
          name: "Proceso Bessemer",
          yearLabel: "1856",
          summary:
            "Método patentado por Henry Bessemer que elimina impurezas del arrabio insuflando aire a través del metal fundido. Fue el primer proceso barato para producir acero en masa.",
          sourceUrl: "https://es.wikipedia.org/wiki/Proceso_Bessemer",
          confidence: "high",
        },
        {
          id: "revolucion-industrial--pittsburgh--culture",
          category: "culture",
          name: "Biblioteca Carnegie de Pittsburgh",
          yearLabel: "1895",
          year: 1895,
          summary:
            "Red de bibliotecas públicas financiada por Carnegie, cuya sede principal abrió en 1895 en el barrio de Oakland. Encarnó su idea de que la riqueza industrial debía devolverse a la comunidad.",
          sourceUrl: "https://en.wikipedia.org/wiki/Carnegie_Library_of_Pittsburgh",
          confidence: "high",
        },
        {
          id: "revolucion-industrial--pittsburgh--event",
          category: "event",
          name: "Huelga de Homestead",
          yearLabel: "1892",
          year: 1892,
          summary:
            "Conflicto laboral en la acería de Carnegie en Homestead, cerca de Pittsburgh. El enfrentamiento armado entre huelguistas y agentes de la agencia Pinkerton causó muertos y debilitó a los sindicatos del acero.",
          sourceUrl: "https://es.wikipedia.org/wiki/Huelga_de_Homestead",
          confidence: "high",
        },
      ],
    },
  ],
};

export default era;
