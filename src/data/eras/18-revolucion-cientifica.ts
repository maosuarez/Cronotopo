import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "revolucion-cientifica",
  order: 18,
  name: "Revolución científica",
  macroPeriod: "early-modern",
  startYear: 1500,
  endYear: 1750,
  summary:
    "La observación sistemática, la medición precisa y el experimento sustituyen a la autoridad de los textos antiguos como fuente de conocimiento sobre la naturaleza. Universidades, observatorios y sociedades científicas dan forma a una nueva física y una nueva astronomía.",
  accentColor: "#a0c4ff",
  locations: [
    {
      id: "revolucion-cientifica--padua",
      name: "Padua",
      modernName: "Padua, Véneto",
      country: "Italia",
      coordinates: { lat: 45.4078, lon: 11.8733 },
      year: 1609,
      summary:
        "Su universidad, protegida por la república de Venecia, fue un centro de libertad intelectual y atrajo a estudiantes de toda Europa. Allí enseñaron Vesalio y Galileo, y se renovaron la anatomía y la astronomía.",
      elements: [
        {
          id: "revolucion-cientifica--padua--landmark",
          category: "landmark",
          name: "Teatro anatómico",
          yearLabel: "1595",
          year: 1595,
          summary:
            "Anfiteatro de madera con gradas elípticas muy empinadas en torno a la mesa de disección, conservado en el Palazzo del Bo. Inaugurado en 1595 por Girolamo Fabrici d'Acquapendente, es el más antiguo que se conserva.",
          sourceUrl: "https://en.wikipedia.org/wiki/Anatomical_Theatre_of_Padua",
          confidence: "high",
        },
        {
          id: "revolucion-cientifica--padua--person",
          category: "person",
          name: "Galileo Galilei",
          yearLabel: "1592 – 1610",
          summary:
            "Enseñó matemáticas en la Universidad de Padua durante dieciocho años, en la etapa más productiva de su carrera. Allí estudió el movimiento de los cuerpos y construyó sus primeros telescopios.",
          sourceUrl: "https://es.wikipedia.org/wiki/Galileo_Galilei",
          confidence: "high",
        },
        {
          id: "revolucion-cientifica--padua--technology",
          category: "technology",
          name: "Telescopio de Galileo",
          yearLabel: "1609 – 1610",
          year: 1609,
          summary:
            "Informado del invento neerlandés, Galileo construyó anteojos con lente convergente y ocular divergente cada vez más potentes. Con ellos observó desde Padua los satélites de Júpiter y el relieve de la Luna.",
          sourceUrl: "https://es.wikipedia.org/wiki/Telescopio_de_Galileo",
          confidence: "high",
        },
        {
          id: "revolucion-cientifica--padua--culture",
          category: "culture",
          name: "De humani corporis fabrica",
          yearLabel: "1543",
          year: 1543,
          summary:
            "Tratado de anatomía de Andrés Vesalio, profesor en Padua, basado en disecciones propias y no solo en Galeno. Sus grandes grabados fijaron un nuevo modelo de libro científico ilustrado.",
          sourceUrl: "https://es.wikipedia.org/wiki/De_humani_corporis_fabrica",
          confidence: "high",
        },
        {
          id: "revolucion-cientifica--padua--event",
          category: "event",
          name: "Doctorado de Elena Cornaro Piscopia",
          yearLabel: "1678",
          year: 1678,
          summary:
            "La veneciana Elena Lucrezia Cornaro Piscopia obtuvo en la Universidad de Padua el doctorado en filosofía, y se la considera a menudo la primera mujer en recibir un título de doctora universitaria.",
          sourceUrl: "https://es.wikipedia.org/wiki/Elena_Cornaro_Piscopia",
          confidence: "medium",
        },
      ],
    },
    {
      id: "revolucion-cientifica--uraniborg",
      name: "Uraniborg",
      modernName: "Isla de Ven (Hven), estrecho de Øresund",
      country: "Suecia",
      coordinates: { lat: 55.9079, lon: 12.6966 },
      year: 1580,
      summary:
        "En la isla de Hven, entonces danesa, Tycho Brahe levantó uno de los primeros grandes observatorios de la Europa moderna. Durante unos veinte años, hasta su marcha en 1597, sus mediciones alcanzaron una precisión sin precedentes.",
      elements: [
        {
          id: "revolucion-cientifica--uraniborg--landmark",
          category: "landmark",
          name: "Uraniborg",
          yearLabel: "1576 – c. 1597",
          year: 1576,
          summary:
            "Palacio-observatorio con instrumentos, biblioteca, laboratorio alquímico e imprenta, construido con apoyo de Federico II de Dinamarca. Abandonado tras la marcha de Tycho, fue demolido y hoy se ven sus cimientos.",
          sourceUrl: "https://es.wikipedia.org/wiki/Uraniborg",
          confidence: "medium",
        },
        {
          id: "revolucion-cientifica--uraniborg--person",
          category: "person",
          name: "Tycho Brahe",
          yearLabel: "1546 – 1601",
          summary:
            "Noble danés que dedicó su vida a medir con exactitud las posiciones de estrellas y planetas. Sus registros, heredados por Johannes Kepler, permitieron deducir las leyes del movimiento planetario.",
          sourceUrl: "https://es.wikipedia.org/wiki/Tycho_Brahe",
          confidence: "high",
        },
        {
          id: "revolucion-cientifica--uraniborg--technology",
          category: "technology",
          name: "Instrumentos de observación a simple vista",
          yearLabel: "c. 1576 – 1597",
          summary:
            "Antes del telescopio, Tycho perfeccionó grandes cuadrantes, sextantes y esferas armilares, incluido un cuadrante mural. Repetía y promediaba las medidas para reducir errores.",
          sourceUrl: "https://es.wikipedia.org/wiki/Tycho_Brahe",
          confidence: "medium",
        },
        {
          id: "revolucion-cientifica--uraniborg--culture",
          category: "culture",
          name: "Sistema ticónico",
          yearLabel: "1588",
          year: 1588,
          summary:
            "Modelo del cosmos en que el Sol y la Luna giran alrededor de una Tierra inmóvil, mientras los demás planetas giran alrededor del Sol. Fue una alternativa influyente a Ptolomeo y Copérnico.",
          sourceUrl: "https://es.wikipedia.org/wiki/Sistema_ticónico",
          confidence: "high",
        },
        {
          id: "revolucion-cientifica--uraniborg--event",
          category: "event",
          name: "Gran cometa de 1577",
          yearLabel: "1577",
          year: 1577,
          summary:
            "Tycho midió la posición del cometa y no detectó paralaje apreciable, lo que lo situaba mucho más allá de la Luna. El resultado contradecía la idea aristotélica de unos cielos inmutables.",
          sourceUrl: "https://es.wikipedia.org/wiki/Gran_Cometa_de_1577",
          confidence: "high",
        },
      ],
    },
    {
      id: "revolucion-cientifica--londres",
      name: "Londres",
      modernName: "Londres",
      country: "Reino Unido",
      coordinates: { lat: 51.5138, lon: -0.0984 },
      year: 1687,
      summary:
        "Tras la Restauración, Londres se convirtió en un centro de la nueva ciencia experimental gracias a la Royal Society. Allí se publicaron obras decisivas y se fundó un observatorio dedicado a la navegación.",
      elements: [
        {
          id: "revolucion-cientifica--londres--landmark",
          category: "landmark",
          name: "Real Observatorio de Greenwich",
          yearLabel: "1675",
          year: 1675,
          summary:
            "Fundado por Carlos II para mejorar la determinación de la longitud en el mar. Su primer edificio, diseñado por Christopher Wren, acogió al primer astrónomo real, John Flamsteed.",
          sourceUrl: "https://es.wikipedia.org/wiki/Real_Observatorio_de_Greenwich",
          confidence: "high",
        },
        {
          id: "revolucion-cientifica--londres--person",
          category: "person",
          name: "Robert Hooke",
          yearLabel: "1635 – 1703",
          summary:
            "Encargado de los experimentos de la Royal Society desde 1662. En Micrographia (1665) describió observaciones al microscopio y llamó células a las celdillas del corcho; también fue arquitecto tras el incendio de 1666.",
          sourceUrl: "https://es.wikipedia.org/wiki/Robert_Hooke",
          confidence: "high",
        },
        {
          id: "revolucion-cientifica--londres--technology",
          category: "technology",
          name: "Telescopio reflector de Newton",
          yearLabel: "1668 – 1672",
          summary:
            "Isaac Newton sustituyó la lente principal por un espejo metálico cóncavo para evitar la aberración cromática. Presentó un ejemplar a la Royal Society, que lo admitió como miembro en 1672.",
          sourceUrl: "https://es.wikipedia.org/wiki/Telescopio_newtoniano",
          confidence: "high",
        },
        {
          id: "revolucion-cientifica--londres--culture",
          category: "culture",
          name: "Royal Society",
          yearLabel: "1660",
          year: 1660,
          summary:
            "Sociedad fundada en Londres en 1660 y reconocida por cédula real en 1662. Defendía el conocimiento basado en el experimento y difundió resultados a través de Philosophical Transactions, desde 1665.",
          sourceUrl: "https://es.wikipedia.org/wiki/Royal_Society",
          confidence: "high",
        },
        {
          id: "revolucion-cientifica--londres--event",
          category: "event",
          name: "Publicación de los Principia",
          yearLabel: "1687",
          year: 1687,
          summary:
            "Los Philosophiæ naturalis principia mathematica de Newton se publicaron en Londres con el aval de la Royal Society y la financiación de Edmond Halley. Formulan las leyes del movimiento y la gravitación universal.",
          sourceUrl: "https://es.wikipedia.org/wiki/Philosophiæ_naturalis_principia_mathematica",
          confidence: "high",
        },
      ],
    },
  ],
};

export default era;
