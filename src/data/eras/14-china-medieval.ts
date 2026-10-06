import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "china-medieval",
  order: 14,
  name: "China medieval",
  macroPeriod: "middle-ages",
  startYear: 600,
  endYear: 1400,
  summary:
    "Las dinastías Tang y Song hacen de China el estado más poblado y urbanizado del mundo, con capitales cosmopolitas y una economía cada vez más comercial. Imprenta, pólvora, brújula y papel moneda se desarrollan o generalizan en este periodo.",
  accentColor: "#f07167",
  locations: [
    {
      id: "china-medieval--changan",
      name: "Chang'an",
      modernName: "Xi'an, Shaanxi",
      country: "China",
      coordinates: { lat: 34.2198, lon: 108.9594 },
      year: 700,
      summary:
        "Capital de la dinastía Tang, Chang'an era una enorme ciudad amurallada y planificada, final oriental de la Ruta de la Seda. En ella convivían mercaderes, monjes y diplomáticos de toda Asia.",
      elements: [
        {
          id: "china-medieval--changan--landmark",
          category: "landmark",
          name: "Gran Pagoda de la Oca Salvaje",
          yearLabel: "652",
          year: 652,
          summary:
            "Pagoda budista levantada en el monasterio de Da Ci'en para guardar los textos e imágenes traídos de la India por Xuanzang. Reconstruida y ampliada después, sigue siendo un símbolo de Xi'an.",
          sourceUrl: "https://en.wikipedia.org/wiki/Giant_Wild_Goose_Pagoda",
          confidence: "high",
        },
        {
          id: "china-medieval--changan--person",
          category: "person",
          name: "Xuanzang",
          yearLabel: "602 – 664",
          summary:
            "Monje budista que viajó a la India por la Ruta de la Seda y regresó a Chang'an en 645 con cientos de textos. Dedicó el resto de su vida a traducirlos al chino y dejó una crónica de su viaje.",
          sourceUrl: "https://es.wikipedia.org/wiki/Xuanzang",
          confidence: "high",
        },
        {
          id: "china-medieval--changan--technology",
          category: "technology",
          name: "Planificación en cuadrícula",
          yearLabel: "s. VII – IX",
          summary:
            "La ciudad se trazó como un gran rectángulo de calles rectas que delimitaban barrios amurallados, con el palacio al norte y dos mercados oficiales. Su modelo inspiró capitales como Nara y Heian-kyō en Japón.",
          sourceUrl: "https://en.wikipedia.org/wiki/Chang'an",
          confidence: "high",
        },
        {
          id: "china-medieval--changan--culture",
          category: "culture",
          name: "Estela nestoriana",
          yearLabel: "781",
          year: 781,
          summary:
            "Estela de piedra erigida en Chang'an que relata en chino y siríaco la llegada del cristianismo de la Iglesia del Oriente a la China Tang. Refleja el ambiente religioso diverso de la capital.",
          sourceUrl: "https://es.wikipedia.org/wiki/Estela_nestoriana",
          confidence: "high",
        },
        {
          id: "china-medieval--changan--event",
          category: "event",
          name: "Toma de Chang'an por An Lushan",
          yearLabel: "756",
          year: 756,
          summary:
            "Durante la rebelión del general An Lushan, sus tropas ocuparon la capital y el emperador Xuanzong huyó a Sichuan. La guerra debilitó de forma duradera al poder central Tang.",
          sourceUrl: "https://es.wikipedia.org/wiki/Rebelión_de_An_Lushan",
          confidence: "high",
        },
      ],
    },
    {
      id: "china-medieval--kaifeng",
      name: "Bianjing (Kaifeng)",
      modernName: "Kaifeng, Henan",
      country: "China",
      coordinates: { lat: 34.795, lon: 114.345 },
      year: 1100,
      summary:
        "Capital de la dinastía Song del Norte junto al Gran Canal, Kaifeng fue una de las mayores ciudades del mundo en el siglo XI. Su vida comercial, con mercados abiertos de día y de noche, contrastaba con las ciudades cerradas de los Tang.",
      elements: [
        {
          id: "china-medieval--kaifeng--landmark",
          category: "landmark",
          name: "Pagoda de Hierro",
          yearLabel: "1049",
          year: 1049,
          summary:
            "Pagoda del templo Youguo construida con ladrillos vidriados de varios colores que, vistos de lejos, le dan un tono gris de hierro. Ha resistido terremotos e inundaciones durante casi mil años.",
          sourceUrl: "https://en.wikipedia.org/wiki/Iron_Pagoda",
          confidence: "high",
        },
        {
          id: "china-medieval--kaifeng--person",
          category: "person",
          name: "Bao Zheng",
          yearLabel: "999 – 1062",
          summary:
            "Funcionario Song que fue prefecto de Kaifeng a mediados del siglo XI. Su fama de juez íntegro e implacable con los corruptos lo convirtió en figura legendaria del teatro y la literatura chinos.",
          sourceUrl: "https://en.wikipedia.org/wiki/Bao_Zheng",
          confidence: "high",
        },
        {
          id: "china-medieval--kaifeng--technology",
          category: "technology",
          name: "Torre astronómica de Su Song",
          yearLabel: "1088 – 1092",
          summary:
            "El sabio Su Song dirigió en Kaifeng la construcción de una torre con esfera armilar y globo celeste movidos por una rueda hidráulica con escape, uno de los relojes mecánicos más complejos de su tiempo.",
          sourceUrl: "https://en.wikipedia.org/wiki/Su_Song",
          confidence: "high",
        },
        {
          id: "china-medieval--kaifeng--culture",
          category: "culture",
          name: "A lo largo del río durante el Festival Qingming",
          yearLabel: "c. s. XII",
          summary:
            "Rollo pintado atribuido a Zhang Zeduan que muestra con gran detalle la vida urbana a orillas de un río, con barcos, tiendas y multitudes. Suele interpretarse como una visión de Kaifeng, aunque se debate.",
          sourceUrl: "https://en.wikipedia.org/wiki/Along_the_River_During_the_Qingming_Festival",
          confidence: "medium",
        },
        {
          id: "china-medieval--kaifeng--event",
          category: "event",
          name: "Incidente de Jingkang",
          yearLabel: "1127",
          year: 1127,
          summary:
            "Los yurchen de la dinastía Jin tomaron Kaifeng y se llevaron cautivos al emperador Qinzong y a su padre Huizong. La corte Song huyó al sur y acabó estableciendo su capital en Hangzhou.",
          sourceUrl: "https://en.wikipedia.org/wiki/Jingkang_incident",
          confidence: "high",
        },
      ],
    },
    {
      id: "china-medieval--hangzhou",
      name: "Lin'an (Hangzhou)",
      modernName: "Hangzhou, Zhejiang",
      country: "China",
      coordinates: { lat: 30.267, lon: 120.153 },
      year: 1250,
      summary:
        "Capital de los Song del Sur tras la pérdida del norte, Hangzhou creció junto al Lago del Oeste y el extremo sur del Gran Canal. Fue un gran centro comercial y cultural hasta su conquista por los mongoles.",
      elements: [
        {
          id: "china-medieval--hangzhou--landmark",
          category: "landmark",
          name: "Pagoda de las Seis Armonías",
          yearLabel: "970; reconstruida en 1165",
          summary:
            "Pagoda junto al río Qiantang, erigida en 970 y reconstruida en época Song del Sur tras ser destruida. Además de su función religiosa, servía de referencia para la navegación fluvial.",
          sourceUrl: "https://en.wikipedia.org/wiki/Liuhe_Pagoda",
          confidence: "high",
        },
        {
          id: "china-medieval--hangzhou--person",
          category: "person",
          name: "Shen Kuo",
          yearLabel: "1031 – 1095",
          summary:
            "Erudito y funcionario nacido en Qiantang, la actual Hangzhou. Sus Ensayos de la piscina de los sueños tratan de astronomía, geología y técnica, e incluyen la primera descripción clara de la aguja magnética.",
          sourceUrl: "https://es.wikipedia.org/wiki/Shen_Kuo",
          confidence: "medium",
        },
        {
          id: "china-medieval--hangzhou--technology",
          category: "technology",
          name: "Papel moneda huizi",
          yearLabel: "s. XII",
          summary:
            "El gobierno Song del Sur emitió billetes llamados huizi como dinero oficial a gran escala. Su uso facilitó el comercio, pero las emisiones excesivas acabaron provocando inflación.",
          sourceUrl: "https://en.wikipedia.org/wiki/Huizi_(currency)",
          confidence: "medium",
        },
        {
          id: "china-medieval--hangzhou--culture",
          category: "culture",
          name: "Lago del Oeste y la calzada de Su Shi",
          yearLabel: "1090",
          summary:
            "Siendo gobernador de Hangzhou, el poeta Su Shi mandó dragar el Lago del Oeste y construir con el lodo una calzada arbolada. El lago se convirtió en un paisaje cantado por poetas y pintores.",
          sourceUrl: "https://en.wikipedia.org/wiki/Su_Causeway",
          confidence: "medium",
        },
        {
          id: "china-medieval--hangzhou--event",
          category: "event",
          name: "Rendición de Lin'an",
          yearLabel: "1276",
          year: 1276,
          summary:
            "Ante el avance del ejército mongol dirigido por Bayan, la corte Song del Sur entregó su capital sin combate. La resistencia Song continuó en el sur hasta su derrota final en 1279.",
          sourceUrl: "https://en.wikipedia.org/wiki/Southern_Song_dynasty",
          confidence: "high",
        },
      ],
    },
  ],
};

export default era;
