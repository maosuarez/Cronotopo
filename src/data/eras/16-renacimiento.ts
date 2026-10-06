import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "renacimiento",
  order: 16,
  name: "Renacimiento",
  macroPeriod: "early-modern",
  startYear: 1300,
  endYear: 1600,
  summary:
    "Las ciudades italianas recuperan el legado clásico y lo transforman en un nuevo arte, una nueva arquitectura y una nueva idea del ser humano. La imprenta difunde esas ideas por Europa, mientras el comercio flamenco financia su expansión hacia el norte.",
  accentColor: "#f2c57c",
  locations: [
    {
      id: "renacimiento--florencia",
      name: "Florencia",
      modernName: "Florencia, Toscana",
      country: "Italia",
      coordinates: { lat: 43.7714, lon: 11.2542 },
      year: 1478,
      summary:
        "Enriquecida por la banca y el comercio de la lana, Florencia fue el gran laboratorio del primer Renacimiento. Bajo la influencia de los Médici reunió a arquitectos, escultores y humanistas que redefinieron el arte europeo.",
      elements: [
        {
          id: "renacimiento--florencia--landmark",
          category: "landmark",
          name: "Cúpula de Santa María del Fiore",
          yearLabel: "1420 – 1436",
          year: 1436,
          summary:
            "Filippo Brunelleschi cerró el enorme crucero de la catedral con una cúpula de doble casco levantada sin cimbra completa. Terminada en 1436, sigue siendo la mayor cúpula de ladrillo del mundo.",
          sourceUrl: "https://es.wikipedia.org/wiki/Catedral_de_Santa_María_del_Fiore",
          confidence: "high",
        },
        {
          id: "renacimiento--florencia--person",
          category: "person",
          name: "Lorenzo de Médici",
          yearLabel: "1449 – 1492",
          summary:
            "Llamado el Magnífico, gobernó de hecho la república florentina desde 1469. Fue mecenas de artistas y humanistas, entre ellos el joven Miguel Ángel, y poeta en lengua toscana.",
          sourceUrl: "https://es.wikipedia.org/wiki/Lorenzo_de_Médici",
          confidence: "high",
        },
        {
          id: "renacimiento--florencia--technology",
          category: "technology",
          name: "Perspectiva lineal",
          yearLabel: "c. 1415 – 1420",
          summary:
            "Brunelleschi demostró con tablas pintadas del baptisterio cómo representar el espacio con un punto de fuga. Alberti codificó el método en De pictura (1435) y transformó la pintura europea.",
          sourceUrl: "https://es.wikipedia.org/wiki/Filippo_Brunelleschi",
          confidence: "medium",
        },
        {
          id: "renacimiento--florencia--culture",
          category: "culture",
          name: "David de Miguel Ángel",
          yearLabel: "1501 – 1504",
          year: 1504,
          summary:
            "Estatua de mármol de más de cinco metros tallada a partir de un bloque abandonado. Se colocó ante el Palazzo Vecchio como símbolo de la república; hoy el original está en la Galería de la Academia.",
          sourceUrl: "https://es.wikipedia.org/wiki/David_(Miguel_Ángel)",
          confidence: "high",
        },
        {
          id: "renacimiento--florencia--event",
          category: "event",
          name: "Conspiración de los Pazzi",
          yearLabel: "1478",
          year: 1478,
          summary:
            "Durante una misa en la catedral, conjurados ligados a la familia Pazzi atacaron a los Médici: Giuliano murió y Lorenzo sobrevivió herido. La represión posterior reforzó el poder de Lorenzo.",
          sourceUrl: "https://es.wikipedia.org/wiki/Conspiración_de_los_Pazzi",
          confidence: "high",
        },
      ],
    },
    {
      id: "renacimiento--maguncia",
      name: "Maguncia",
      modernName: "Maguncia (Mainz), Renania-Palatinado",
      country: "Alemania",
      coordinates: { lat: 49.9994, lon: 8.2736 },
      year: 1455,
      summary:
        "Sede de uno de los principales arzobispados del Sacro Imperio, Maguncia vio nacer la imprenta de tipos móviles en Europa. Desde sus talleres la técnica se extendió en pocas décadas a todo el continente.",
      elements: [
        {
          id: "renacimiento--maguncia--landmark",
          category: "landmark",
          name: "Catedral de Maguncia",
          yearLabel: "s. X – XIII",
          summary:
            "Catedral románica de San Martín, iniciada a finales del siglo X por el arzobispo Willigis y reconstruida varias veces tras incendios. Era el centro del poder del arzobispo elector de Maguncia.",
          sourceUrl: "https://es.wikipedia.org/wiki/Catedral_de_Maguncia",
          confidence: "high",
        },
        {
          id: "renacimiento--maguncia--person",
          category: "person",
          name: "Johannes Gutenberg",
          yearLabel: "c. 1400 – 1468",
          summary:
            "Orfebre nacido en Maguncia, desarrolló allí y en Estrasburgo un sistema completo de impresión con tipos móviles. Su fecha exacta de nacimiento es desconocida; murió en su ciudad natal en 1468.",
          sourceUrl: "https://es.wikipedia.org/wiki/Johannes_Gutenberg",
          confidence: "medium",
        },
        {
          id: "renacimiento--maguncia--technology",
          category: "technology",
          name: "Imprenta de tipos móviles",
          yearLabel: "c. 1440 – 1450",
          summary:
            "Gutenberg combinó tipos metálicos fundidos en un molde manual, una aleación a base de plomo, tinta de base oleosa y una prensa adaptada de los lagares de vino. El sistema permitió producir libros en serie.",
          sourceUrl: "https://es.wikipedia.org/wiki/Imprenta",
          confidence: "medium",
        },
        {
          id: "renacimiento--maguncia--culture",
          category: "culture",
          name: "Biblia de Gutenberg",
          yearLabel: "c. 1454 – 1455",
          summary:
            "Edición de la Vulgata latina conocida como Biblia de 42 líneas. Es el primer gran libro impreso con tipos móviles en Europa y se conservan varias decenas de ejemplares, en papel y en vitela.",
          sourceUrl: "https://es.wikipedia.org/wiki/Biblia_de_Gutenberg",
          confidence: "medium",
        },
        {
          id: "renacimiento--maguncia--event",
          category: "event",
          name: "Toma de Maguncia",
          yearLabel: "1462",
          year: 1462,
          summary:
            "En la disputa por el arzobispado, las tropas de Adolfo II de Nassau tomaron y saquearon la ciudad. Muchos impresores huyeron, lo que contribuyó a difundir la imprenta por otras ciudades.",
          sourceUrl: "https://en.wikipedia.org/wiki/Mainz_Diocesan_Feud",
          confidence: "medium",
        },
      ],
    },
    {
      id: "renacimiento--amberes",
      name: "Amberes",
      modernName: "Amberes, Flandes",
      country: "Bélgica",
      coordinates: { lat: 51.2178, lon: 4.4003 },
      year: 1560,
      summary:
        "En el siglo XVI Amberes se convirtió en el gran puerto y centro financiero del norte de Europa. Su riqueza sostuvo imprentas, talleres de pintura y una intensa vida comercial, hasta que las guerras de religión la golpearon.",
      elements: [
        {
          id: "renacimiento--amberes--landmark",
          category: "landmark",
          name: "Catedral de Nuestra Señora",
          yearLabel: "1352 – 1521",
          summary:
            "Templo gótico construido durante casi dos siglos, con una torre que domina el perfil de la ciudad. Es la mayor iglesia gótica de los Países Bajos meridionales y guarda obras de Rubens.",
          sourceUrl: "https://es.wikipedia.org/wiki/Catedral_de_Nuestra_Señora_de_Amberes",
          confidence: "high",
        },
        {
          id: "renacimiento--amberes--person",
          category: "person",
          name: "Christophe Plantin",
          yearLabel: "c. 1520 – 1589",
          summary:
            "Impresor de origen francés establecido en Amberes, donde fundó una de las mayores imprentas de Europa. Su obra más ambiciosa fue la Biblia Políglota, impresa entre 1568 y 1573 bajo patrocinio de Felipe II.",
          sourceUrl: "https://es.wikipedia.org/wiki/Christophe_Plantin",
          confidence: "medium",
        },
        {
          id: "renacimiento--amberes--technology",
          category: "technology",
          name: "Bolsa de Amberes",
          yearLabel: "1531",
          year: 1531,
          summary:
            "Edificio inaugurado en 1531 como la primera lonja construida expresamente para el intercambio de mercancías. Diseñado por Domien de Waghemakere en gótico tardío, cumplió esa función hasta 1661.",
          sourceUrl: "https://en.wikipedia.org/wiki/Antwerp_Bourse",
          confidence: "high",
        },
        {
          id: "renacimiento--amberes--culture",
          category: "culture",
          name: "Pieter Bruegel el Viejo",
          yearLabel: "1551 – 1563",
          summary:
            "Ingresó como maestro en el gremio de pintores de San Lucas de Amberes en 1551. En la ciudad trabajó también para editores de grabados, antes de trasladarse a Bruselas en 1563.",
          sourceUrl: "https://es.wikipedia.org/wiki/Pieter_Brueghel_el_Viejo",
          confidence: "high",
        },
        {
          id: "renacimiento--amberes--event",
          category: "event",
          name: "Saqueo de Amberes",
          yearLabel: "1576",
          year: 1576,
          summary:
            "Tropas españolas amotinadas por falta de pago saquearon la ciudad durante varios días, con miles de víctimas. El episodio, conocido como la Furia española, aceleró el declive comercial de Amberes.",
          sourceUrl: "https://es.wikipedia.org/wiki/Saqueo_de_Amberes",
          confidence: "high",
        },
      ],
    },
  ],
};

export default era;
