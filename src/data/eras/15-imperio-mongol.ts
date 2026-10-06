import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "imperio-mongol",
  order: 15,
  name: "Imperio mongol",
  macroPeriod: "middle-ages",
  startYear: 1206,
  endYear: 1368,
  summary:
    "Gengis Kan unifica las tribus de la estepa en 1206 y sus sucesores crean el mayor imperio terrestre contiguo de la historia, de Corea a Europa oriental. Tras conquistas devastadoras, la pax mongolica facilita el intercambio de personas, ideas y mercancías a través de Eurasia.",
  accentColor: "#9fd8ff",
  locations: [
    {
      id: "imperio-mongol--karakorum",
      name: "Karakórum",
      modernName: "Kharkhorin, valle del Orjón",
      country: "Mongolia",
      coordinates: { lat: 47.2103, lon: 102.8478 },
      year: 1254,
      summary:
        "Capital del Imperio mongol unificado desde 1235 hasta el traslado de la corte a China bajo Kublai. En esta ciudad de la estepa coincidían embajadores, artesanos cautivos y religiosos de toda Eurasia.",
      elements: [
        {
          id: "imperio-mongol--karakorum--landmark",
          category: "landmark",
          name: "Ruinas de Karakórum",
          yearLabel: "1235 – s. XIV",
          year: 1235,
          summary:
            "Ciudad amurallada en el valle del Orjón, con un palacio, barrios de artesanos y templos. Hoy apenas quedan restos excavados; parte de sus materiales se reutilizó en el monasterio de Erdene Zuu, del siglo XVI.",
          sourceUrl: "https://es.wikipedia.org/wiki/Karakorum",
          confidence: "high",
        },
        {
          id: "imperio-mongol--karakorum--person",
          category: "person",
          name: "Ogodei Kan",
          yearLabel: "r. 1229 – 1241",
          summary:
            "Tercer hijo y sucesor de Gengis Kan como gran kan. Mandó amurallar Karakórum y convertirla en capital estable del imperio, mientras sus ejércitos avanzaban por China y Europa oriental.",
          sourceUrl: "https://es.wikipedia.org/wiki/Ogodei",
          confidence: "high",
        },
        {
          id: "imperio-mongol--karakorum--technology",
          category: "technology",
          name: "Árbol de plata de Guillaume Boucher",
          yearLabel: "c. 1254",
          summary:
            "Fuente con forma de árbol, obra de un orfebre parisino cautivo en la corte mongola, que servía distintas bebidas por sus caños mediante un mecanismo oculto. La describió el fraile Guillermo de Rubruck.",
          sourceUrl: "https://en.wikipedia.org/wiki/Guillaume_Boucher",
          confidence: "medium",
        },
        {
          id: "imperio-mongol--karakorum--culture",
          category: "culture",
          name: "Pluralidad religiosa",
          yearLabel: "s. XIII",
          summary:
            "En la capital convivían templos budistas, mezquitas y una iglesia cristiana de la Iglesia del Oriente. Los grandes kanes favorecían a distintos cultos y procuraban atraer la oración de todos ellos.",
          sourceUrl: "https://en.wikipedia.org/wiki/Karakorum",
          confidence: "medium",
        },
        {
          id: "imperio-mongol--karakorum--event",
          category: "event",
          name: "Debate religioso ante Möngke",
          yearLabel: "1254",
          year: 1254,
          summary:
            "El gran kan Möngke organizó en Karakórum un debate entre cristianos, musulmanes y budistas, con jueces de cada fe. Participó el fraile Guillermo de Rubruck, que dejó testimonio del encuentro.",
          sourceUrl: "https://en.wikipedia.org/wiki/William_of_Rubruck",
          confidence: "medium",
        },
      ],
    },
    {
      id: "imperio-mongol--samarcanda",
      name: "Samarcanda",
      modernName: "Samarcanda",
      country: "Uzbekistán",
      coordinates: { lat: 39.6714, lon: 66.9878 },
      year: 1220,
      summary:
        "Gran ciudad de la Ruta de la Seda y una de las capitales del Imperio corasmio, fue tomada por Gengis Kan en 1220. Tras la conquista, la ciudad se desplazó al sur del viejo emplazamiento de Afrasiab y quedó bajo el kanato de Chagatai.",
      elements: [
        {
          id: "imperio-mongol--samarcanda--landmark",
          category: "landmark",
          name: "Afrasiab",
          yearLabel: "s. VII a.C. – 1220",
          summary:
            "Gran montículo que guarda la antigua Samarcanda, ocupada desde la Antigüedad hasta la conquista mongola. Tras su destrucción quedó abandonado, y sus excavaciones han revelado murallas, palacios y pinturas sogdianas.",
          sourceUrl: "https://en.wikipedia.org/wiki/Afrasiyab_(Samarkand)",
          confidence: "high",
        },
        {
          id: "imperio-mongol--samarcanda--person",
          category: "person",
          name: "Qiu Chuji (Changchun)",
          yearLabel: "1148 – 1227",
          summary:
            "Maestro taoísta llamado por Gengis Kan, que atravesó Asia Central para reunirse con él. Pasó por Samarcanda poco después de la conquista y su viaje quedó registrado en una crónica escrita por un discípulo.",
          sourceUrl: "https://en.wikipedia.org/wiki/Qiu_Chuji",
          confidence: "high",
        },
        {
          id: "imperio-mongol--samarcanda--technology",
          category: "technology",
          name: "Cerámica vidriada de Shah-i-Zinda",
          yearLabel: "1340 – 1361",
          summary:
            "Los mausoleos más antiguos conservados de la necrópolis de Shah-i-Zinda, de la década de 1340 y de 1361, anteriores a Tamerlán, se revisten de terracota tallada y azulejos vidriados de gran riqueza.",
          sourceUrl: "https://en.wikipedia.org/wiki/Shah-i-Zinda",
          confidence: "medium",
        },
        {
          id: "imperio-mongol--samarcanda--culture",
          category: "culture",
          name: "Culto a Qutham ibn Abbas",
          yearLabel: "s. XIII – XIV",
          summary:
            "El santuario de Qutham ibn Abbas, primo de Mahoma venerado como el rey viviente, sobrevivió a la conquista mongola y se convirtió en uno de los lugares sagrados más importantes de la ciudad.",
          sourceUrl: "https://en.wikipedia.org/wiki/Samarkand",
          confidence: "medium",
        },
        {
          id: "imperio-mongol--samarcanda--event",
          category: "event",
          name: "Toma de Samarcanda",
          yearLabel: "1220",
          year: 1220,
          summary:
            "Durante la campaña contra el Imperio corasmio, el ejército de Gengis Kan sitió y tomó Samarcanda. La conquista causó una gran destrucción y la deportación de parte de sus artesanos.",
          sourceUrl: "https://en.wikipedia.org/wiki/Siege_of_Samarkand_(1220)",
          confidence: "high",
        },
      ],
    },
    {
      id: "imperio-mongol--janbalic",
      name: "Janbalic (Dadu)",
      modernName: "Pekín",
      country: "China",
      coordinates: { lat: 39.924, lon: 116.357 },
      year: 1290,
      summary:
        "Kublai Kan mandó construir junto a la antigua Zhongdu una nueva capital, Dadu, conocida por los mongoles como Janbalic, la ciudad del kan. Fue la sede de la dinastía Yuan y el origen del trazado del Pekín actual.",
      elements: [
        {
          id: "imperio-mongol--janbalic--landmark",
          category: "landmark",
          name: "Estupa Blanca del templo Miaoying",
          yearLabel: "1279",
          year: 1279,
          summary:
            "Gran estupa de estilo tibetano diseñada por el artista nepalí Araniko por encargo de Kublai. Es uno de los pocos edificios de época Yuan que se conservan en Pekín.",
          sourceUrl: "https://en.wikipedia.org/wiki/Miaoying_Temple",
          confidence: "high",
        },
        {
          id: "imperio-mongol--janbalic--person",
          category: "person",
          name: "Kublai Kan",
          yearLabel: "1215 – 1294",
          summary:
            "Nieto de Gengis Kan y gran kan desde 1260. Fundó la dinastía Yuan, mandó construir Dadu como capital y completó la conquista de los Song del Sur.",
          sourceUrl: "https://es.wikipedia.org/wiki/Kublai_Kan",
          confidence: "high",
        },
        {
          id: "imperio-mongol--janbalic--technology",
          category: "technology",
          name: "Canales de Guo Shoujing",
          yearLabel: "1292 – 1293",
          year: 1293,
          summary:
            "El ingeniero y astrónomo Guo Shoujing llevó agua de manantiales cercanos hasta Dadu mediante canales con esclusas, y el Gran Canal se prolongó hasta la capital para abastecerla de grano del sur.",
          sourceUrl: "https://en.wikipedia.org/wiki/Guo_Shoujing",
          confidence: "high",
        },
        {
          id: "imperio-mongol--janbalic--culture",
          category: "culture",
          name: "Teatro zaju",
          yearLabel: "s. XIII – XIV",
          summary:
            "Bajo los Yuan floreció el zaju, un drama en cuatro actos que combinaba diálogo, canto y música. Dramaturgos como Guan Hanqing, activo en Dadu, escribieron obras que siguen representándose.",
          sourceUrl: "https://en.wikipedia.org/wiki/Zaju",
          confidence: "medium",
        },
        {
          id: "imperio-mongol--janbalic--event",
          category: "event",
          name: "Caída de Dadu ante los Ming",
          yearLabel: "1368",
          year: 1368,
          summary:
            "El ejército del nuevo emperador Ming tomó Dadu y la corte Yuan huyó a la estepa mongola. El hecho marca el fin del dominio mongol sobre China.",
          sourceUrl: "https://en.wikipedia.org/wiki/Khanbaliq",
          confidence: "high",
        },
      ],
    },
  ],
};

export default era;
