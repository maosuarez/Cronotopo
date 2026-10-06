import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "civilizacion-del-indo",
  order: 5,
  name: "Civilización del Indo",
  macroPeriod: "antiquity",
  startYear: -3300,
  endYear: -1300,
  summary:
    "En las llanuras del Indo y sus afluentes florece una civilización urbana con ciudades planificadas, redes de drenaje y un comercio que llegaba hasta Mesopotamia. Su escritura sigue sin descifrar y las causas de su declive, tras el 1900 a.C., aún se debaten.",
  accentColor: "#d98c5f",
  locations: [
    {
      id: "civilizacion-del-indo--mohenjo-daro",
      name: "Mohenjo-daro",
      modernName: "Mohenjo-daro, distrito de Larkana, Sindh",
      country: "Pakistán",
      coordinates: { lat: 27.3292, lon: 68.1389 },
      year: -2500,
      summary:
        "Construida hacia el 2500 a.C., fue una de las mayores ciudades de la civilización del Indo. Se dividía en una ciudadela elevada y una ciudad baja con calles ordenadas, pozos y desagües cubiertos.",
      elements: [
        {
          id: "civilizacion-del-indo--mohenjo-daro--landmark",
          category: "landmark",
          name: "Gran Baño",
          yearLabel: "c. 2500 a.C.",
          summary:
            "Piscina de ladrillo impermeabilizada con betún, rodeada de un patio porticado en la ciudadela. Se le atribuye un posible uso de purificación religiosa.",
          sourceUrl: "https://en.wikipedia.org/wiki/Great_Bath,_Mohenjo-daro",
          confidence: "medium",
        },
        {
          id: "civilizacion-del-indo--mohenjo-daro--person",
          category: "person",
          name: "El «Rey sacerdote» (escultura)",
          yearLabel: "c. 2000 – 1900 a.C.",
          summary:
            "No se conoce a ningún individuo por su nombre: esta figura de esteatita de un hombre barbado con manto decorado es el retrato humano más célebre de la ciudad. Su apodo es moderno y no prueba que gobernaran reyes o sacerdotes.",
          sourceUrl: "https://en.wikipedia.org/wiki/Priest-King_(sculpture)",
          confidence: "medium",
        },
        {
          id: "civilizacion-del-indo--mohenjo-daro--technology",
          category: "technology",
          name: "Pozos y desagües urbanos",
          yearLabel: "c. 2500 – 1900 a.C.",
          summary:
            "La ciudad contaba con cientos de pozos circulares de ladrillo y una red de desagües cubiertos a lo largo de las calles. Algunas casas tenían cuartos de baño conectados a ella.",
          sourceUrl: "https://en.wikipedia.org/wiki/Mohenjo-daro",
          confidence: "medium",
        },
        {
          id: "civilizacion-del-indo--mohenjo-daro--culture",
          category: "culture",
          name: "La «Bailarina»",
          yearLabel: "c. 2300 – 1750 a.C.",
          summary:
            "Estatuilla de bronce de una joven desnuda con brazaletes, hallada en 1926 y fundida a la cera perdida. Se conserva en el Museo Nacional de Nueva Delhi.",
          sourceUrl: "https://en.wikipedia.org/wiki/Dancing_Girl_(prehistoric_sculpture)",
          confidence: "medium",
        },
        {
          id: "civilizacion-del-indo--mohenjo-daro--event",
          category: "event",
          name: "Abandono de la ciudad",
          yearLabel: "c. 1900 – 1700 a.C.",
          summary:
            "Con el declive de la civilización del Indo, Mohenjo-daro quedó abandonada. Se han propuesto inundaciones repetidas, cambios fluviales y agotamiento del entorno, sin consenso sobre la causa.",
          sourceUrl: "https://en.wikipedia.org/wiki/Mohenjo-daro",
          confidence: "medium",
        },
      ],
    },
    {
      id: "civilizacion-del-indo--harappa",
      name: "Harappa",
      modernName: "Harappa, distrito de Sahiwal, Punyab",
      country: "Pakistán",
      coordinates: { lat: 30.6289, lon: 72.8639 },
      year: -2600,
      summary:
        "Ciudad junto a un antiguo curso del río Ravi que dio nombre a la civilización harappa. Su ocupación abarca desde las primeras fases, hacia el 3300 a.C., hasta el periodo harappa tardío.",
      elements: [
        {
          id: "civilizacion-del-indo--harappa--landmark",
          category: "landmark",
          name: "Montículos de Harappa",
          yearLabel: "c. 2600 – 1900 a.C.",
          summary:
            "En su fase madura la ciudad ocupaba unas 150 hectáreas de casas de ladrillo repartidas en varios montículos. Era una de las mayores urbes de su tiempo.",
          sourceUrl: "https://en.wikipedia.org/wiki/Harappa",
          confidence: "medium",
        },
        {
          id: "civilizacion-del-indo--harappa--person",
          category: "person",
          name: "Enterramientos del cementerio H (hallazgo humano)",
          yearLabel: "c. 1900 – 1300 a.C.",
          summary:
            "Sin individuos con nombre, los restos de este cementerio de Harappa documentan a la población tardía. Junto a inhumaciones aparecen urnas pintadas con huesos cremados, una práctica nueva en la región.",
          sourceUrl: "https://en.wikipedia.org/wiki/Cemetery_H_culture",
          confidence: "medium",
        },
        {
          id: "civilizacion-del-indo--harappa--technology",
          category: "technology",
          name: "Pesos y medidas estandarizados",
          yearLabel: "c. 2600 – 1900 a.C.",
          summary:
            "Los harappas usaban pesos de piedra con una escala fija de gradaciones, uniforme en toda la civilización. Esa regularidad sugiere un comercio y una administración muy organizados.",
          sourceUrl: "https://en.wikipedia.org/wiki/Harappa",
          confidence: "medium",
        },
        {
          id: "civilizacion-del-indo--harappa--culture",
          category: "culture",
          name: "Sellos de esteatita y escritura del Indo",
          yearLabel: "c. 2600 – 1900 a.C.",
          summary:
            "Pequeños sellos cuadrados con animales y signos, quizá usados para marcar propiedades y mercancías. Sus inscripciones pertenecen a la escritura del Indo, que sigue sin descifrar.",
          sourceUrl: "https://es.wikipedia.org/wiki/Escritura_del_Indo",
          confidence: "medium",
        },
        {
          id: "civilizacion-del-indo--harappa--event",
          category: "event",
          name: "Primeros signos de la fase Ravi",
          yearLabel: "c. 3300 – 3200 a.C.",
          summary:
            "En la primera ocupación del sitio aparecieron tablillas con marcas en forma de tridente y de planta, parecidas a signos posteriores de la escritura del Indo. No está claro que sean escritura.",
          sourceUrl: "https://en.wikipedia.org/wiki/Harappa",
          confidence: "low",
        },
      ],
    },
    {
      id: "civilizacion-del-indo--lothal",
      name: "Lothal",
      modernName: "Lothal, distrito de Ahmedabad, Guyarat",
      country: "India",
      coordinates: { lat: 22.5214, lon: 72.2494 },
      year: -2200,
      summary:
        "Una de las ciudades más meridionales de la civilización del Indo, cerca del golfo de Khambhat. Fue un activo centro artesanal y comercial; en él apareció incluso un sello del golfo Pérsico.",
      elements: [
        {
          id: "civilizacion-del-indo--lothal--landmark",
          category: "landmark",
          name: "La dársena",
          yearLabel: "c. 2300 – 1900 a.C.",
          summary:
            "Gran estanque rectangular de ladrillo junto a un almacén elevado. Su excavador lo identificó como un muelle conectado a un río, pero otros arqueólogos lo interpretan como un depósito de riego.",
          sourceUrl: "https://en.wikipedia.org/wiki/Lothal",
          confidence: "medium",
        },
        {
          id: "civilizacion-del-indo--lothal--person",
          category: "person",
          name: "Tumbas de Lothal (hallazgo humano)",
          yearLabel: "c. 2400 – 1900 a.C.",
          summary:
            "Sin individuos con nombre, solo se han hallado unas pocas tumbas para una población mucho mayor, lo que sugiere que también se practicaba la cremación. Los restos confirman la continuidad harappa tras las inundaciones.",
          sourceUrl: "https://en.wikipedia.org/wiki/Lothal",
          confidence: "medium",
        },
        {
          id: "civilizacion-del-indo--lothal--technology",
          category: "technology",
          name: "Taller de cuentas",
          yearLabel: "c. 2400 – 1900 a.C.",
          summary:
            "Un taller con patio, habitaciones y un horno de doble cámara producía cuentas de cornalina, ágata y esteatita. Cuentas grabadas de cornalina del Indo han aparecido en Kish, Ur y Susa.",
          sourceUrl: "https://en.wikipedia.org/wiki/Lothal",
          confidence: "medium",
        },
        {
          id: "civilizacion-del-indo--lothal--culture",
          category: "culture",
          name: "Vasija del cuervo y el zorro",
          yearLabel: "c. 2400 – 1900 a.C.",
          summary:
            "Una vasija pintada muestra pájaros con peces en el pico sobre un árbol y un animal parecido a un zorro debajo. La escena se ha comparado con una fábula del Panchatantra, lectura que es solo una hipótesis.",
          sourceUrl: "https://en.wikipedia.org/wiki/Lothal",
          confidence: "medium",
        },
        {
          id: "civilizacion-del-indo--lothal--event",
          category: "event",
          name: "La gran inundación",
          yearLabel: "c. 1900 a.C.",
          summary:
            "Según el Servicio Arqueológico de la India, una gran crecida colmató la dársena y arrasó la ciudad, ya debilitada por inundaciones previas. Después solo quedó una pequeña población sin vida urbana.",
          sourceUrl: "https://en.wikipedia.org/wiki/Lothal",
          confidence: "medium",
        },
      ],
    },
  ],
};

export default era;
