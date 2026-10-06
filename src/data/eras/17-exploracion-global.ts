import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "exploracion-global",
  order: 17,
  name: "Exploración global",
  macroPeriod: "early-modern",
  startYear: 1450,
  endYear: 1700,
  summary:
    "Las navegaciones ibéricas conectan por mar Europa, África, Asia y América por primera vez de forma estable. El nuevo mapa del mundo trae comercio, intercambio biológico y cultural, pero también conquistas y colapsos de sociedades enteras.",
  accentColor: "#5ec2b7",
  locations: [
    {
      id: "exploracion-global--lisboa",
      name: "Lisboa",
      modernName: "Lisboa",
      country: "Portugal",
      coordinates: { lat: 38.7078, lon: -9.1365 },
      year: 1498,
      summary:
        "Capital de la monarquía portuguesa y punto de partida de sus flotas hacia África y Asia. La llegada de especias de la India por la ruta del cabo de Buena Esperanza la convirtió en uno de los grandes puertos de Europa.",
      elements: [
        {
          id: "exploracion-global--lisboa--landmark",
          category: "landmark",
          name: "Monasterio de los Jerónimos",
          yearLabel: "1501 – c. 1600",
          summary:
            "Mandado construir por Manuel I en Belém, junto al lugar de partida de las flotas, y financiado en parte con el comercio de especias. Es la obra cumbre del estilo manuelino y alberga la tumba de Vasco da Gama.",
          sourceUrl: "https://es.wikipedia.org/wiki/Monasterio_de_los_Jerónimos_de_Belém",
          confidence: "medium",
        },
        {
          id: "exploracion-global--lisboa--person",
          category: "person",
          name: "Manuel I de Portugal",
          yearLabel: "1469 – 1521",
          summary:
            "Rey de Portugal desde 1495. Durante su reinado partieron las expediciones de Vasco da Gama a la India y de Pedro Álvares Cabral, que llegó a Brasil en 1500, y Lisboa se enriqueció con el comercio ultramarino.",
          sourceUrl: "https://es.wikipedia.org/wiki/Manuel_I_de_Portugal",
          confidence: "high",
        },
        {
          id: "exploracion-global--lisboa--technology",
          category: "technology",
          name: "Carabela",
          yearLabel: "s. XV",
          summary:
            "Embarcación ligera y maniobrable, con velas latinas que le permitían ceñir el viento (navegar de bolina). Los portugueses la usaron para explorar la costa africana a lo largo del siglo XV.",
          sourceUrl: "https://es.wikipedia.org/wiki/Carabela",
          confidence: "high",
        },
        {
          id: "exploracion-global--lisboa--culture",
          category: "culture",
          name: "Estilo manuelino",
          yearLabel: "c. 1490 – 1520",
          summary:
            "Variante portuguesa del gótico tardío que incorpora motivos marítimos: cuerdas, anclas, corales, esferas armilares y la cruz de la Orden de Cristo. Expresa en piedra el orgullo de los descubrimientos.",
          sourceUrl: "https://es.wikipedia.org/wiki/Estilo_manuelino",
          confidence: "medium",
        },
        {
          id: "exploracion-global--lisboa--event",
          category: "event",
          name: "Viaje de Vasco da Gama a la India",
          yearLabel: "1497 – 1499",
          year: 1497,
          summary:
            "La flota de Vasco da Gama zarpó de Lisboa en 1497, dobló el cabo de Buena Esperanza y llegó a Calicut en 1498. Abrió la ruta marítima directa entre Europa y Asia.",
          sourceUrl: "https://es.wikipedia.org/wiki/Vasco_da_Gama",
          confidence: "high",
        },
      ],
    },
    {
      id: "exploracion-global--tenochtitlan",
      name: "Tenochtitlan",
      modernName: "Centro Histórico de Ciudad de México",
      country: "México",
      coordinates: { lat: 19.4333, lon: -99.1328 },
      year: 1519,
      summary:
        "Capital mexica fundada sobre un islote del lago de Texcoco y unida a tierra firme por calzadas. Cuando llegaron los españoles en 1519 era una de las mayores ciudades del mundo; tras su conquista en 1521 sobre ella se levantó Ciudad de México.",
      elements: [
        {
          id: "exploracion-global--tenochtitlan--landmark",
          category: "landmark",
          name: "Templo Mayor",
          yearLabel: "s. XIV – 1521",
          summary:
            "Gran pirámide doble dedicada a Huitzilopochtli y Tláloc, ampliada en sucesivas etapas constructivas. Destruida tras la conquista, sus restos se excavan sistemáticamente desde 1978.",
          sourceUrl: "https://es.wikipedia.org/wiki/Templo_Mayor",
          confidence: "high",
        },
        {
          id: "exploracion-global--tenochtitlan--person",
          category: "person",
          name: "Moctezuma Xocoyotzin",
          yearLabel: "c. 1466 – 1520",
          summary:
            "Huey tlatoani de Tenochtitlan desde 1502 o 1503, expandió el dominio mexica. Recibió a Hernán Cortés en 1519, fue retenido por los españoles y murió en 1520 en circunstancias que las fuentes cuentan de forma distinta.",
          sourceUrl: "https://es.wikipedia.org/wiki/Moctezuma_Xocoyotzin",
          confidence: "medium",
        },
        {
          id: "exploracion-global--tenochtitlan--technology",
          category: "technology",
          name: "Chinampas",
          yearLabel: "s. XIV – XVI",
          summary:
            "Parcelas de cultivo construidas en aguas poco profundas con capas de lodo y vegetación, sujetas por árboles y separadas por canales. Daban cosechas intensivas para abastecer a la ciudad.",
          sourceUrl: "https://es.wikipedia.org/wiki/Chinampa",
          confidence: "high",
        },
        {
          id: "exploracion-global--tenochtitlan--culture",
          category: "culture",
          name: "Piedra del Sol",
          yearLabel: "c. s. XV – XVI",
          summary:
            "Monolito de basalto tallado con imágenes cosmológicas mexicas en torno a un rostro central. Enterrado tras la conquista, reapareció en 1790 en la plaza mayor y hoy está en el Museo Nacional de Antropología.",
          sourceUrl: "https://es.wikipedia.org/wiki/Piedra_del_Sol",
          confidence: "medium",
        },
        {
          id: "exploracion-global--tenochtitlan--event",
          category: "event",
          name: "Caída de Tenochtitlan",
          yearLabel: "1521",
          year: 1521,
          summary:
            "Tras un largo asedio por tierra y lago, las fuerzas de Hernán Cortés y sus numerosos aliados indígenas, sobre todo tlaxcaltecas, tomaron la ciudad el 13 de agosto de 1521, debilitada por la viruela y el hambre.",
          sourceUrl: "https://es.wikipedia.org/wiki/Sitio_de_Tenochtitlan",
          confidence: "high",
        },
      ],
    },
    {
      id: "exploracion-global--malaca",
      name: "Malaca",
      modernName: "Ciudad de Malaca, estado de Malaca",
      country: "Malasia",
      coordinates: { lat: 2.1944, lon: 102.2486 },
      year: 1511,
      summary:
        "Puerto que controlaba el estrecho entre el océano Índico y el mar de la China Meridional, capital de un sultanato próspero. Su conquista por Portugal en 1511 y por los neerlandeses en 1641 muestra la lucha europea por las rutas de Asia.",
      elements: [
        {
          id: "exploracion-global--malaca--landmark",
          category: "landmark",
          name: "A Famosa",
          yearLabel: "1511 – 1512",
          summary:
            "Fortaleza levantada por los portugueses junto al mar tras tomar la ciudad. Los británicos la demolieron en 1811; solo sobrevive la puerta de Santiago, renovada por los neerlandeses en 1670.",
          sourceUrl: "https://en.wikipedia.org/wiki/A_Famosa",
          confidence: "high",
        },
        {
          id: "exploracion-global--malaca--person",
          category: "person",
          name: "Afonso de Albuquerque",
          yearLabel: "c. 1453 – 1515",
          summary:
            "Gobernador de la India portuguesa, dirigió la conquista de Malaca en 1511 tras haber tomado Goa. Su estrategia de bases fortificadas permitió a Portugal dominar rutas clave del océano Índico.",
          sourceUrl: "https://es.wikipedia.org/wiki/Afonso_de_Albuquerque",
          confidence: "medium",
        },
        {
          id: "exploracion-global--malaca--technology",
          category: "technology",
          name: "Navegación con los monzones",
          yearLabel: "s. XV – XVI",
          summary:
            "Los barcos de China, Java y las Molucas llegaban con el monzón del noreste, y los de la India, Arabia y África oriental, con el del suroeste. Malaca era la escala obligada entre ambos.",
          sourceUrl: "https://en.wikipedia.org/wiki/Malacca_Sultanate",
          confidence: "medium",
        },
        {
          id: "exploracion-global--malaca--culture",
          category: "culture",
          name: "Suma Oriental de Tomé Pires",
          yearLabel: "1512 – 1515",
          summary:
            "Tratado escrito por el boticario portugués Tomé Pires, que vivió en Malaca tras la conquista. Describe los pueblos, productos y redes comerciales de Asia y es una fuente esencial sobre el sultanato.",
          sourceUrl: "https://en.wikipedia.org/wiki/Suma_Oriental",
          confidence: "high",
        },
        {
          id: "exploracion-global--malaca--event",
          category: "event",
          name: "Conquista neerlandesa de Malaca",
          yearLabel: "1640 – 1641",
          year: 1641,
          summary:
            "Tras meses de asedio, la Compañía Neerlandesa de las Indias Orientales, aliada con el sultanato de Johor, arrebató la ciudad a los portugueses en enero de 1641.",
          sourceUrl: "https://en.wikipedia.org/wiki/Siege_of_Malacca_(1641)",
          confidence: "high",
        },
      ],
    },
  ],
};

export default era;
