import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "china-antigua",
  order: 6,
  name: "China antigua",
  macroPeriod: "antiquity",
  startYear: -1600,
  endYear: -500,
  summary:
    "En la llanura del río Amarillo, las dinastías Shang y Zhou forjan un estado basado en el bronce ritual, la adivinación y la escritura. Al final del periodo, en un mundo de reinos rivales, Confucio formula una ética que marcará a China durante milenios.",
  accentColor: "#7ccf9a",
  locations: [
    {
      id: "china-antigua--anyang",
      name: "Yin",
      modernName: "Yinxu, Anyang (Henan)",
      country: "China",
      coordinates: { lat: 36.1225, lon: 114.3186 },
      year: -1200,
      summary:
        "Yin fue la última capital de la dinastía Shang, junto al río Huan. Sus ruinas, conocidas como Yinxu, han dado palacios, tumbas reales, bronces y miles de huesos oraculares con la escritura china más antigua conocida.",
      elements: [
        {
          id: "china-antigua--anyang--landmark",
          category: "landmark",
          name: "Ruinas de Yin (Yinxu)",
          yearLabel: "c. 1300 – 1046 a.C.",
          summary:
            "Conjunto de cimientos de palacios y templos, talleres y un cementerio real a orillas del río Huan. Es el yacimiento Shang mejor conocido y fue declarado Patrimonio de la Humanidad en 2006.",
          sourceUrl: "https://es.wikipedia.org/wiki/Yinxu",
          confidence: "medium",
        },
        {
          id: "china-antigua--anyang--person",
          category: "person",
          name: "Fu Hao",
          yearLabel: "c. 1200 a.C.",
          summary:
            "Esposa del rey Wu Ding, sacerdotisa y jefa militar mencionada en inscripciones oraculares. Su tumba, hallada intacta en 1976, contenía cientos de bronces, jades y armas.",
          sourceUrl: "https://es.wikipedia.org/wiki/Fu_Hao",
          confidence: "medium",
        },
        {
          id: "china-antigua--anyang--technology",
          category: "technology",
          name: "Fundición de bronce en moldes de piezas",
          yearLabel: "c. 1300 – 1046 a.C.",
          summary:
            "Los talleres Shang colaban bronce en moldes cerámicos de varias piezas, lo que permitía vasijas rituales enormes y decoradas, como el ding Houmuwu, el mayor bronce chino antiguo conocido.",
          sourceUrl: "https://en.wikipedia.org/wiki/Houmuwu_ding",
          confidence: "medium",
        },
        {
          id: "china-antigua--anyang--culture",
          category: "culture",
          name: "Huesos oraculares",
          yearLabel: "c. 1250 – 1046 a.C.",
          summary:
            "Los adivinos aplicaban calor a omóplatos de buey y caparazones de tortuga e interpretaban las grietas; después grababan pregunta y respuesta. Son el corpus de escritura china más antiguo conocido.",
          sourceUrl: "https://es.wikipedia.org/wiki/Huesos_oraculares",
          confidence: "medium",
        },
        {
          id: "china-antigua--anyang--event",
          category: "event",
          name: "Traslado de la capital a Yin",
          yearLabel: "c. 1300 a.C.",
          summary:
            "Según la tradición historiográfica, el rey Pan Geng trasladó la corte Shang a Yin, que siguió siendo capital hasta la caída de la dinastía. La fecha exacta es incierta.",
          sourceUrl: "https://en.wikipedia.org/wiki/Pan_Geng",
          confidence: "medium",
        },
      ],
    },
    {
      id: "china-antigua--haojing",
      name: "Haojing",
      modernName: "Yacimiento de Fenghao, distrito de Chang'an (Xi'an)",
      country: "China",
      coordinates: { lat: 34.21, lon: 108.72 },
      year: -1000,
      summary:
        "Hao y su ciudad gemela Feng, a orillas del río Feng, fueron la capital de los Zhou occidentales durante unos tres siglos. Hoy son un yacimiento arqueológico en las afueras de Xi'an.",
      elements: [
        {
          id: "china-antigua--haojing--landmark",
          category: "landmark",
          name: "Ciudades gemelas de Feng y Hao",
          yearLabel: "c. 1050 – 771 a.C.",
          summary:
            "Feng albergaba el templo ancestral de los Zhou y Hao el palacio real y la administración. Las excavaciones han revelado cimientos de edificios, talleres y cementerios.",
          sourceUrl: "https://en.wikipedia.org/wiki/Fenghao",
          confidence: "medium",
        },
        {
          id: "china-antigua--haojing--person",
          category: "person",
          name: "Rey Wu de Zhou",
          yearLabel: "c. 1046 a.C.",
          summary:
            "Fundador de la dinastía Zhou tras vencer al último rey Shang en la batalla de Muye. Estableció la corte en Hao, que se convirtió en el centro político del nuevo reino.",
          sourceUrl: "https://es.wikipedia.org/wiki/Rey_Wu_de_Zhou",
          confidence: "medium",
        },
        {
          id: "china-antigua--haojing--technology",
          category: "technology",
          name: "Carro de guerra",
          yearLabel: "c. 1200 – 771 a.C.",
          summary:
            "Introducido en China en época Shang, el carro tirado por caballos se convirtió en símbolo de poder aristocrático bajo los Zhou. Se enterraban carros completos con sus caballos en las tumbas de la élite.",
          sourceUrl: "https://en.wikipedia.org/wiki/Chariots_in_ancient_China",
          confidence: "medium",
        },
        {
          id: "china-antigua--haojing--culture",
          category: "culture",
          name: "Mandato del Cielo",
          yearLabel: "c. 1046 a.C.",
          summary:
            "Los Zhou justificaron su conquista con la idea de que el Cielo concede el derecho a gobernar al soberano virtuoso y lo retira al injusto. El concepto legitimó los cambios dinásticos chinos durante siglos.",
          sourceUrl: "https://es.wikipedia.org/wiki/Mandato_del_Cielo",
          confidence: "medium",
        },
        {
          id: "china-antigua--haojing--event",
          category: "event",
          name: "Saqueo de Haojing",
          yearLabel: "771 a.C.",
          year: -771,
          summary:
            "Tras la rebelión del marqués de Shen, los Quanrong saquearon Feng y Hao y mataron al rey You. La corte se trasladó al este, a Luoyi, y terminó el periodo de los Zhou occidentales.",
          sourceUrl: "https://en.wikipedia.org/wiki/Fenghao",
          confidence: "high",
        },
      ],
    },
    {
      id: "china-antigua--qufu",
      name: "Qufu",
      modernName: "Qufu (Shandong)",
      country: "China",
      coordinates: { lat: 35.5819, lon: 116.9862 },
      year: -520,
      summary:
        "Qufu fue la capital del estado de Lu, gobernado por descendientes del duque de Zhou y considerado guardián de los ritos Zhou. Allí nació y enseñó Confucio a finales del periodo de Primavera y Otoño.",
      elements: [
        {
          id: "china-antigua--qufu--landmark",
          category: "landmark",
          name: "Capital del estado de Lu",
          yearLabel: "c. s. XI – 249 a.C.",
          summary:
            "Ciudad amurallada que fue sede de los duques de Lu durante siglos. Sus restos arqueológicos se encuentran bajo y alrededor de la actual Qufu.",
          sourceUrl: "https://en.wikipedia.org/wiki/Lu_(state)",
          confidence: "medium",
        },
        {
          id: "china-antigua--qufu--person",
          category: "person",
          name: "Confucio",
          yearLabel: "551 – 479 a.C.",
          year: -551,
          summary:
            "Pensador y maestro nacido en Lu. Defendió el gobierno por la virtud, el respeto a los ritos y la piedad filial; sus discípulos recogieron sus enseñanzas en las Analectas.",
          sourceUrl: "https://es.wikipedia.org/wiki/Confucio",
          confidence: "high",
        },
        {
          id: "china-antigua--qufu--technology",
          category: "technology",
          name: "Libros de tiras de bambú",
          yearLabel: "c. s. VI a.C.",
          summary:
            "Los textos se escribían en tiras de bambú o madera atadas con cordel. Los ejemplares conservados más antiguos son del siglo V a.C., aunque textos anteriores aluden a este soporte.",
          sourceUrl: "https://en.wikipedia.org/wiki/Bamboo_and_wooden_slips",
          confidence: "medium",
        },
        {
          id: "china-antigua--qufu--culture",
          category: "culture",
          name: "Anales de Primavera y Otoño",
          yearLabel: "722 – 481 a.C.",
          summary:
            "Crónica oficial del estado de Lu que registra año a año sucesos políticos y fenómenos naturales. La tradición atribuye a Confucio su edición, y da nombre a todo el periodo.",
          sourceUrl: "https://es.wikipedia.org/wiki/Anales_de_Primavera_y_Otoño",
          confidence: "high",
        },
        {
          id: "china-antigua--qufu--event",
          category: "event",
          name: "Batalla de Changshao",
          yearLabel: "684 a.C.",
          year: -684,
          summary:
            "Lu rechazó una invasión del vecino estado de Qi. El Zuozhuan la recuerda por el consejo de Cao Gui de esperar a que el enemigo agotara su ímpetu antes de contraatacar.",
          sourceUrl: "https://en.wikipedia.org/wiki/Battle_of_Changshao",
          confidence: "medium",
        },
      ],
    },
  ],
};

export default era;
