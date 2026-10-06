import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "roma",
  order: 10,
  name: "Roma",
  macroPeriod: "antiquity",
  startYear: -27,
  endYear: 476,
  summary:
    "Con Augusto, Roma pasa de república a imperio y une todo el Mediterráneo bajo un mismo poder, con ciudades, calzadas y leyes comunes. En los siglos siguientes el centro de gravedad se desplaza hacia Oriente, mientras el Imperio de Occidente se desintegra hasta 476.",
  accentColor: "#e2726e",
  locations: [
    {
      id: "roma--roma",
      name: "Roma",
      modernName: "Roma, Lacio",
      country: "Italia",
      coordinates: { lat: 41.8922, lon: 12.4852 },
      year: 117,
      summary:
        "Capital de un imperio que alcanzó su máxima extensión bajo Trajano. Foros, templos, termas y anfiteatros hicieron de ella la mayor ciudad del mundo mediterráneo durante los primeros siglos de nuestra era.",
      elements: [
        {
          id: "roma--roma--landmark",
          category: "landmark",
          name: "Coliseo",
          yearLabel: "80 d.C.",
          year: 80,
          summary:
            "Anfiteatro Flavio, iniciado bajo Vespasiano e inaugurado por Tito. Acogía combates de gladiadores y cacerías de fieras, y es el mayor anfiteatro construido por los romanos.",
          sourceUrl: "https://es.wikipedia.org/wiki/Coliseo",
          confidence: "high",
        },
        {
          id: "roma--roma--person",
          category: "person",
          name: "Augusto",
          yearLabel: "r. 27 a.C. – 14 d.C.",
          year: -27,
          summary:
            "Heredero de Julio César y vencedor de las guerras civiles, se convirtió en el primer emperador manteniendo la apariencia de las instituciones republicanas. Emprendió un gran programa de obras en Roma.",
          sourceUrl: "https://es.wikipedia.org/wiki/Augusto",
          confidence: "high",
        },
        {
          id: "roma--roma--technology",
          category: "technology",
          name: "Hormigón romano: la cúpula del Panteón",
          yearLabel: "c. 125 d.C.",
          summary:
            "Mezcla de cal, ceniza volcánica y piedras que fraguaba con gran resistencia. Con él se construyó hacia 125 d.C. la cúpula del Panteón, aún hoy la mayor cúpula de hormigón sin armar del mundo.",
          sourceUrl: "https://en.wikipedia.org/wiki/Roman_concrete",
          confidence: "medium",
        },
        {
          id: "roma--roma--culture",
          category: "culture",
          name: "Eneida",
          yearLabel: "c. 29 – 19 a.C.",
          summary:
            "Poema épico de Virgilio sobre el troyano Eneas, mítico antepasado de los romanos. Escrito en tiempos de Augusto, exaltaba el destino de Roma y se convirtió en el gran clásico de la literatura latina.",
          sourceUrl: "https://es.wikipedia.org/wiki/Eneida",
          confidence: "medium",
        },
        {
          id: "roma--roma--event",
          category: "event",
          name: "Saqueo de Roma por los visigodos",
          yearLabel: "410 d.C.",
          year: 410,
          summary:
            "Las tropas visigodas de Alarico entraron en Roma y la saquearon durante tres días. Era la primera vez en siglos que la ciudad caía ante un enemigo extranjero.",
          sourceUrl: "https://es.wikipedia.org/wiki/Saqueo_de_Roma_(410)",
          confidence: "high",
        },
      ],
    },
    {
      id: "roma--pompeya",
      name: "Pompeya",
      modernName: "Pompei, Campania",
      country: "Italia",
      coordinates: { lat: 40.75, lon: 14.4861 },
      year: 79,
      summary:
        "Próspera ciudad de Campania al pie del Vesubio. Sepultada por la erupción del año 79, conserva casas, tiendas, pinturas e inscripciones que muestran la vida cotidiana romana con un detalle excepcional.",
      elements: [
        {
          id: "roma--pompeya--landmark",
          category: "landmark",
          name: "Anfiteatro de Pompeya",
          yearLabel: "c. 70 a.C.",
          summary:
            "Uno de los anfiteatros romanos más antiguos que se conservan. Hacia el año 59, una riña mortal entre pompeyanos y nucerinos durante unos juegos provocó la prohibición de los espectáculos durante diez años.",
          sourceUrl: "https://en.wikipedia.org/wiki/Amphitheatre_of_Pompeii",
          confidence: "medium",
        },
        {
          id: "roma--pompeya--person",
          category: "person",
          name: "Lucio Cecilio Jucundo",
          yearLabel: "s. I d.C.",
          summary:
            "Banquero de Pompeya. En su casa se hallaron en 1875 tablillas enceradas con recibos de sus operaciones, una fuente valiosa sobre la economía y los negocios de la ciudad.",
          sourceUrl: "https://en.wikipedia.org/wiki/Lucius_Caecilius_Iucundus",
          confidence: "high",
        },
        {
          id: "roma--pompeya--technology",
          category: "technology",
          name: "Agua corriente del acueducto del Serino",
          yearLabel: "c. 20 a.C.",
          summary:
            "Desde época de Augusto, un ramal del acueducto del Serino, construido por Agripa, llevó agua corriente a Pompeya, que se distribuía a fuentes públicas, termas y casas.",
          sourceUrl: "https://en.wikipedia.org/wiki/Pompeii",
          confidence: "medium",
        },
        {
          id: "roma--pompeya--culture",
          category: "culture",
          name: "Frescos de la Villa de los Misterios",
          yearLabel: "s. I a.C.",
          summary:
            "Un gran ciclo pictórico de figuras casi a tamaño natural, sobre fondo rojo, representa escenas que suelen interpretarse como un rito de iniciación en el culto de Dioniso.",
          sourceUrl: "https://es.wikipedia.org/wiki/Villa_de_los_Misterios",
          confidence: "medium",
        },
        {
          id: "roma--pompeya--event",
          category: "event",
          name: "Erupción del Vesubio",
          yearLabel: "79 d.C.",
          year: 79,
          summary:
            "El volcán sepultó Pompeya bajo metros de cenizas y piedra pómez, y Herculano bajo flujos piroclásticos. Plinio el Joven describió la erupción, en la que murió su tío Plinio el Viejo.",
          sourceUrl: "https://es.wikipedia.org/wiki/Erupción_del_Vesubio_del_año_79",
          confidence: "high",
        },
      ],
    },
    {
      id: "roma--constantinopla",
      name: "Constantinopla",
      modernName: "Estambul",
      country: "Turquía",
      coordinates: { lat: 41.0125, lon: 28.98 },
      year: 330,
      summary:
        "Constantino refundó la antigua Bizancio, junto al Bósforo, como nueva capital imperial. Pronto se convirtió en el centro político del Imperio de Oriente, que sobrevivió a la caída de Occidente.",
      elements: [
        {
          id: "roma--constantinopla--landmark",
          category: "landmark",
          name: "Hipódromo de Constantinopla",
          yearLabel: "s. IV d.C.",
          summary:
            "Circo para carreras de carros construido bajo Septimio Severo y renovado a gran escala por Constantino. Fue el escenario principal de la vida pública de la ciudad; aún se conserva el obelisco de Teodosio.",
          sourceUrl: "https://en.wikipedia.org/wiki/Hippodrome_of_Constantinople",
          confidence: "high",
        },
        {
          id: "roma--constantinopla--person",
          category: "person",
          name: "Constantino I",
          yearLabel: "r. 306 – 337 d.C.",
          year: 306,
          summary:
            "Emperador que reunificó el imperio, favoreció al cristianismo y trasladó la capital a Oriente. La ciudad que levantó sobre Bizancio llevó su nombre.",
          sourceUrl: "https://es.wikipedia.org/wiki/Constantino_I",
          confidence: "high",
        },
        {
          id: "roma--constantinopla--technology",
          category: "technology",
          name: "Murallas de Teodosio",
          yearLabel: "s. V d.C.",
          summary:
            "Sistema defensivo terrestre construido bajo Teodosio II, con doble muralla, torres y foso. Protegió la ciudad durante casi mil años y fue una de las obras de fortificación más complejas de la Antigüedad.",
          sourceUrl: "https://es.wikipedia.org/wiki/Murallas_de_Constantinopla",
          confidence: "high",
        },
        {
          id: "roma--constantinopla--culture",
          category: "culture",
          name: "Código Teodosiano",
          yearLabel: "438 d.C.",
          year: 438,
          summary:
            "Recopilación oficial de leyes imperiales en 16 libros, iniciada en 429 y promulgada por Teodosio II en 438. Al año siguiente se adoptó en Occidente; luego la sustituyó el Corpus Iuris Civilis de Justiniano.",
          sourceUrl: "https://es.wikipedia.org/wiki/Código_Teodosiano",
          confidence: "high",
        },
        {
          id: "roma--constantinopla--event",
          category: "event",
          name: "Dedicación de Constantinopla",
          yearLabel: "330 d.C.",
          year: 330,
          summary:
            "Constantino inauguró solemnemente la nueva capital tras años de obras. Desde entonces la ciudad rivalizó con Roma como sede del poder imperial.",
          sourceUrl: "https://es.wikipedia.org/wiki/Constantinopla",
          confidence: "high",
        },
      ],
    },
  ],
};

export default era;
