import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "mesopotamia",
  order: 3,
  name: "Mesopotamia",
  macroPeriod: "antiquity",
  startYear: -3500,
  endYear: -2000,
  summary:
    "Entre el Tigris y el Éufrates surgen las primeras ciudades, la escritura cuneiforme y los primeros estados. Sumerios y acadios levantan templos monumentales, organizan grandes administraciones y crean una rica literatura religiosa.",
  accentColor: "#6fa8dc",
  locations: [
    {
      id: "mesopotamia--uruk",
      name: "Uruk",
      modernName: "Warka, gobernación de Al-Muthanna",
      country: "Irak",
      coordinates: { lat: 31.3242, lon: 45.6372 },
      year: -3200,
      summary:
        "Durante el IV milenio a.C. Uruk se convirtió en la mayor ciudad de su tiempo y dio nombre a todo un periodo. En su centro monumental aparecieron las primeras tablillas escritas, ligadas a la administración de los templos.",
      elements: [
        {
          id: "mesopotamia--uruk--landmark",
          category: "landmark",
          name: "Recinto del Eanna",
          yearLabel: "c. 4000 – 3100 a.C.",
          summary:
            "Complejo de templos dedicado a la diosa Inanna, construido durante el periodo de Uruk. Además de santuario, fue un gran centro económico que gestionaba tierras, rebaños, artesanos y escribas.",
          sourceUrl: "https://en.wikipedia.org/wiki/Eanna",
          confidence: "medium",
        },
        {
          id: "mesopotamia--uruk--person",
          category: "person",
          name: "Gilgamesh",
          yearLabel: "c. 2700 a.C.",
          summary:
            "Rey de Uruk según la Lista Real Sumeria y héroe de la epopeya que lleva su nombre. Muchos estudiosos lo consideran un gobernante histórico, aunque su figura quedó envuelta en leyenda.",
          sourceUrl: "https://es.wikipedia.org/wiki/Gilgamesh",
          confidence: "medium",
        },
        {
          id: "mesopotamia--uruk--technology",
          category: "technology",
          name: "Escritura protocuneiforme",
          yearLabel: "c. 3400 – 3200 a.C.",
          summary:
            "Las tablillas de arcilla más antiguas de Uruk registran cantidades de grano, ganado y trabajo. Este sistema administrativo, el protocuneiforme, es una de las formas de escritura más tempranas conocidas.",
          sourceUrl: "https://en.wikipedia.org/wiki/Uruk_period",
          confidence: "medium",
        },
        {
          id: "mesopotamia--uruk--culture",
          category: "culture",
          name: "Vaso de Warka",
          yearLabel: "c. 3100 – 2900 a.C.",
          summary:
            "Vaso de alabastro con relieves en registros: plantas, animales, hombres con ofrendas y una procesión ante una diosa. Saqueado del Museo Nacional de Irak en 2003, fue devuelto poco después.",
          sourceUrl: "https://es.wikipedia.org/wiki/Vaso_de_Warka",
          confidence: "medium",
        },
        {
          id: "mesopotamia--uruk--event",
          category: "event",
          name: "Expansión de Uruk",
          yearLabel: "c. 3500 – 3100 a.C.",
          summary:
            "En el Uruk tardío, el sur mesopotámico fundó enclaves y colonias en regiones vecinas y difundió su cultura material. Hacia 3200 – 3100 a.C. este dinamismo se detuvo.",
          sourceUrl: "https://en.wikipedia.org/wiki/Uruk_period",
          confidence: "medium",
        },
      ],
    },
    {
      id: "mesopotamia--ur",
      name: "Ur",
      modernName: "Tell el-Muqayyar, gobernación de Di Qar",
      country: "Irak",
      coordinates: { lat: 30.9617, lon: 46.1051 },
      year: -2100,
      summary:
        "Ciudad sumeria junto al antiguo curso del Éufrates. Su cementerio real del III milenio a.C. reveló tesoros excepcionales, y bajo la III dinastía fue capital de un estado que dominó gran parte de Mesopotamia.",
      elements: [
        {
          id: "mesopotamia--ur--landmark",
          category: "landmark",
          name: "Zigurat de Ur",
          yearLabel: "s. XXI a.C.",
          summary:
            "Torre escalonada dedicada al dios lunar Nanna, iniciada por Ur-Nammu y terminada por su hijo Shulgi. Su núcleo de adobe estaba revestido de ladrillo cocido unido con betún.",
          sourceUrl: "https://en.wikipedia.org/wiki/Ziggurat_of_Ur",
          confidence: "high",
        },
        {
          id: "mesopotamia--ur--person",
          category: "person",
          name: "Puabi",
          yearLabel: "s. XXVI a.C.",
          summary:
            "Mujer de alto rango enterrada en el cementerio real, identificada por un sello cilíndrico con su nombre. Se la suele llamar reina, aunque pudo ser sacerdotisa. Su tumba se halló casi intacta.",
          sourceUrl: "https://es.wikipedia.org/wiki/Puabi",
          confidence: "high",
        },
        {
          id: "mesopotamia--ur--technology",
          category: "technology",
          name: "Orfebrería del cementerio real",
          yearLabel: "c. 2600 – 2400 a.C.",
          summary:
            "Tocados, collares y peinetas de oro, plata, lapislázuli y cornalina muestran gran dominio del trabajo del metal. La cornalina procedía probablemente del valle del Indo.",
          sourceUrl: "https://en.wikipedia.org/wiki/Royal_Cemetery_at_Ur",
          confidence: "medium",
        },
        {
          id: "mesopotamia--ur--culture",
          category: "culture",
          name: "Estandarte de Ur",
          yearLabel: "c. 2600 a.C.",
          summary:
            "Caja de madera con mosaicos de concha, cornalina y lapislázuli hallada en el cementerio real. Una cara muestra escenas de guerra con carros; la otra, una escena de paz con un banquete y una procesión de ofrendas.",
          sourceUrl: "https://es.wikipedia.org/wiki/Estandarte_de_Ur",
          confidence: "medium",
        },
        {
          id: "mesopotamia--ur--event",
          category: "event",
          name: "Caída de Ur ante los elamitas",
          yearLabel: "c. 2000 a.C.",
          summary:
            "Bajo Ibbi-Sin, último rey de la III dinastía, elamitas y pueblos de los Zagros tomaron y arrasaron Ur. La catástrofe fue llorada en las lamentaciones sumerias por la ciudad.",
          sourceUrl: "https://es.wikipedia.org/wiki/Ibbi-Sin",
          confidence: "medium",
        },
      ],
    },
    {
      id: "mesopotamia--nippur",
      name: "Nippur",
      modernName: "Nuffar, gobernación de Al-Qadisiyya",
      country: "Irak",
      coordinates: { lat: 32.1264, lon: 45.2334 },
      year: -2200,
      summary:
        "Ciudad santa del dios Enlil, nunca fue gran potencia política, pero controlarla daba legitimidad a los reyes de Sumer y Acad. Acadios y reyes de Ur reconstruyeron sus templos durante el III milenio a.C.",
      elements: [
        {
          id: "mesopotamia--nippur--landmark",
          category: "landmark",
          name: "Ekur, templo de Enlil",
          yearLabel: "III milenio a.C.",
          summary:
            "Principal santuario de Enlil y uno de los templos más venerados de Mesopotamia. Naram-Sin lo reconstruyó y Ur-Nammu le dio su forma definitiva con una gran terraza y un zigurat.",
          sourceUrl: "https://en.wikipedia.org/wiki/Nippur",
          confidence: "high",
        },
        {
          id: "mesopotamia--nippur--person",
          category: "person",
          name: "Shulgi",
          yearLabel: "c. 2094 – 2046 a.C.",
          summary:
            "Segundo rey de la III dinastía de Ur. Construyó un templo de Inanna en Nippur, donde aparecieron estatuillas suyas en depósitos de fundación, y se presentó como patrón de las escuelas de escribas de la ciudad.",
          sourceUrl: "https://en.wikipedia.org/wiki/Nippur",
          confidence: "medium",
        },
        {
          id: "mesopotamia--nippur--technology",
          category: "technology",
          name: "Ladrillo cocido, betún y drenaje",
          yearLabel: "s. XXI a.C.",
          summary:
            "El zigurat de Ur-Nammu en Nippur tenía un núcleo de adobe revestido de ladrillo cocido con betún. Conductos de ladrillo con canalones evacuaban la lluvia desde la cima para proteger la estructura.",
          sourceUrl: "https://en.wikipedia.org/wiki/Nippur",
          confidence: "high",
        },
        {
          id: "mesopotamia--nippur--culture",
          category: "culture",
          name: "Culto de Enlil y legitimidad real",
          yearLabel: "III milenio a.C.",
          summary:
            "Reyes de Kish, Uruk, Ur y Acad dejaron ofrendas inscritas en el santuario de Enlil. Ser reconocido en Nippur se consideraba una fuente de legitimidad para gobernar sobre toda Sumeria.",
          sourceUrl: "https://en.wikipedia.org/wiki/Nippur",
          confidence: "high",
        },
        {
          id: "mesopotamia--nippur--event",
          category: "event",
          name: "Revuelta contra Naram-Sin",
          yearLabel: "s. XXIII a.C.",
          summary:
            "Varias ciudades, entre ellas Nippur bajo Amar-enlila, se rebelaron contra el rey acadio Naram-Sin. Según una tablilla, este las venció en nueve batallas y recuperó el control.",
          sourceUrl: "https://en.wikipedia.org/wiki/Nippur",
          confidence: "medium",
        },
      ],
    },
  ],
};

export default era;
