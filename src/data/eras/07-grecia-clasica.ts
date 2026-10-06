import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "grecia-clasica",
  order: 7,
  name: "Grecia clásica",
  macroPeriod: "antiquity",
  startYear: -500,
  endYear: -323,
  summary:
    "Tras rechazar las invasiones persas, las ciudades griegas viven un florecimiento sin precedentes en política, arte, teatro y pensamiento. La rivalidad entre Atenas y Esparta desemboca en la guerra del Peloponeso, y el periodo se cierra con la muerte de Alejandro Magno.",
  accentColor: "#8fb8e8",
  locations: [
    {
      id: "grecia-clasica--atenas",
      name: "Atenas",
      modernName: "Atenas, Ática",
      country: "Grecia",
      coordinates: { lat: 37.9717, lon: 23.7261 },
      year: -432,
      summary:
        "Tras las guerras médicas, Atenas lideró la Liga de Delos y desarrolló su democracia. Bajo Pericles, la Acrópolis se cubrió de templos y la ciudad se convirtió en el gran centro cultural del mundo griego.",
      elements: [
        {
          id: "grecia-clasica--atenas--landmark",
          category: "landmark",
          name: "Partenón",
          yearLabel: "447 – 432 a.C.",
          year: -447,
          summary:
            "Templo dórico de mármol dedicado a Atenea en la Acrópolis, obra de los arquitectos Ictino y Calícrates bajo la supervisión de Fidias. Su decoración escultórica es una cumbre del arte clásico.",
          sourceUrl: "https://es.wikipedia.org/wiki/Partenón",
          confidence: "high",
        },
        {
          id: "grecia-clasica--atenas--person",
          category: "person",
          name: "Pericles",
          yearLabel: "c. 495 – 429 a.C.",
          summary:
            "Estratego y orador que dominó la política ateniense durante décadas. Impulsó el programa de obras de la Acrópolis y dirigió la ciudad al inicio de la guerra del Peloponeso; murió durante la peste.",
          sourceUrl: "https://es.wikipedia.org/wiki/Pericles",
          confidence: "medium",
        },
        {
          id: "grecia-clasica--atenas--technology",
          category: "technology",
          name: "Trirreme",
          yearLabel: "s. V a.C.",
          summary:
            "Nave de guerra rápida movida por tres órdenes de remeros y armada con un espolón de bronce. La flota de trirremes, impulsada por Temístocles, fue la base del poder naval ateniense.",
          sourceUrl: "https://es.wikipedia.org/wiki/Trirreme",
          confidence: "high",
        },
        {
          id: "grecia-clasica--atenas--culture",
          category: "culture",
          name: "Tragedia en el teatro de Dioniso",
          yearLabel: "s. V a.C.",
          summary:
            "En el teatro de Dioniso, al pie de la Acrópolis, se estrenaron en concurso obras de Esquilo, Sófocles y Eurípides durante las fiestas en honor del dios. Se la considera cuna de la tradición teatral occidental.",
          sourceUrl: "https://es.wikipedia.org/wiki/Teatro_de_Dioniso",
          confidence: "high",
        },
        {
          id: "grecia-clasica--atenas--event",
          category: "event",
          name: "Batalla de Salamina",
          yearLabel: "480 a.C.",
          year: -480,
          summary:
            "En el estrecho entre la isla de Salamina y el Ática, la flota griega dirigida por Temístocles derrotó a la armada persa de Jerjes. La victoria salvó a Atenas, que había sido evacuada e incendiada.",
          sourceUrl: "https://es.wikipedia.org/wiki/Batalla_de_Salamina",
          confidence: "high",
        },
      ],
    },
    {
      id: "grecia-clasica--esparta",
      name: "Esparta",
      modernName: "Esparta, Laconia",
      country: "Grecia",
      coordinates: { lat: 37.0819, lon: 22.4236 },
      year: -480,
      summary:
        "Ciudad sin murallas en el valle del Eurotas, gobernada por dos reyes y una asamblea de ciudadanos-soldado. Su poder se apoyaba en un ejército de élite y en el trabajo forzado de los ilotas.",
      elements: [
        {
          id: "grecia-clasica--esparta--landmark",
          category: "landmark",
          name: "Santuario de Artemisa Ortia",
          yearLabel: "c. s. VIII a.C. – s. IV d.C.",
          summary:
            "Santuario junto al río Eurotas, uno de los principales de Esparta. Las excavaciones británicas de principios del siglo XX hallaron miles de exvotos, entre ellos figurillas de plomo y máscaras de terracota.",
          sourceUrl: "https://en.wikipedia.org/wiki/Sanctuary_of_Artemis_Orthia",
          confidence: "medium",
        },
        {
          id: "grecia-clasica--esparta--person",
          category: "person",
          name: "Leónidas I",
          yearLabel: "† 480 a.C.",
          year: -480,
          summary:
            "Rey espartano de la dinastía Agíada. Encabezó la defensa del paso de las Termópilas frente al ejército de Jerjes y murió allí con su guardia de espartanos.",
          sourceUrl: "https://es.wikipedia.org/wiki/Leónidas_I",
          confidence: "high",
        },
        {
          id: "grecia-clasica--esparta--technology",
          category: "technology",
          name: "Falange de hoplitas",
          yearLabel: "s. V a.C.",
          summary:
            "Infantería pesada con gran escudo redondo, lanza y armadura de bronce, que combatía en formación cerrada. Los espartanos, entrenados de forma permanente, fueron sus practicantes más temidos.",
          sourceUrl: "https://es.wikipedia.org/wiki/Hoplita",
          confidence: "high",
        },
        {
          id: "grecia-clasica--esparta--culture",
          category: "culture",
          name: "Agogé",
          yearLabel: "s. V a.C.",
          summary:
            "Educación obligatoria y colectiva de los varones espartanos desde la infancia. Combinaba entrenamiento físico y militar, disciplina y vida en grupo, y era requisito para la plena ciudadanía.",
          sourceUrl: "https://es.wikipedia.org/wiki/Agogé",
          confidence: "high",
        },
        {
          id: "grecia-clasica--esparta--event",
          category: "event",
          name: "Terremoto de Esparta",
          yearLabel: "c. 464 a.C.",
          year: -464,
          summary:
            "Un fuerte sismo devastó Esparta y causó numerosas víctimas. Los ilotas de Mesenia aprovecharon la crisis para sublevarse, lo que dio inicio a la tercera guerra mesenia.",
          sourceUrl: "https://en.wikipedia.org/wiki/464_BC_Sparta_earthquake",
          confidence: "medium",
        },
      ],
    },
    {
      id: "grecia-clasica--olimpia",
      name: "Olimpia",
      modernName: "Antigua Olimpia, Élide",
      country: "Grecia",
      coordinates: { lat: 37.6383, lon: 21.63 },
      year: -456,
      summary:
        "Santuario panhelénico de Zeus en el valle del Alfeo, donde se celebraban los Juegos Olímpicos cada cuatro años. Los siglos V y IV a.C. fueron su edad de oro, con nuevos templos, tesoros e instalaciones deportivas.",
      elements: [
        {
          id: "grecia-clasica--olimpia--landmark",
          category: "landmark",
          name: "Templo de Zeus",
          yearLabel: "c. 472 – 456 a.C.",
          year: -456,
          summary:
            "Gran templo dórico proyectado por el arquitecto Libón en el recinto sagrado del Altis. Sus frontones y metopas, con la carrera de Pélope y los trabajos de Heracles, son referentes del estilo severo.",
          sourceUrl: "https://en.wikipedia.org/wiki/Temple_of_Zeus,_Olympia",
          confidence: "medium",
        },
        {
          id: "grecia-clasica--olimpia--person",
          category: "person",
          name: "Fidias",
          yearLabel: "c. 435 a.C.",
          summary:
            "Escultor ateniense que realizó en Olimpia la estatua de culto de Zeus. Su taller, junto al santuario, fue identificado en excavaciones que hallaron herramientas y moldes de terracota.",
          sourceUrl: "https://en.wikipedia.org/wiki/Phidias",
          confidence: "medium",
        },
        {
          id: "grecia-clasica--olimpia--technology",
          category: "technology",
          name: "Técnica crisoelefantina",
          yearLabel: "s. V a.C.",
          summary:
            "Estatuas con armazón de madera recubierto de placas de marfil para la piel y láminas de oro para ropajes. Con ella se hizo el Zeus de Olimpia, una de las siete maravillas del mundo antiguo.",
          sourceUrl: "https://es.wikipedia.org/wiki/Crisoelefantina",
          confidence: "high",
        },
        {
          id: "grecia-clasica--olimpia--culture",
          category: "culture",
          name: "Juegos Olímpicos",
          yearLabel: "776 a.C. (trad.) – 393 d.C.",
          summary:
            "Festival en honor de Zeus con carreras, lucha, pentatlón y pruebas hípicas. Una tregua sagrada protegía a atletas y visitantes, y los vencedores recibían una corona de olivo.",
          sourceUrl: "https://es.wikipedia.org/wiki/Juegos_Olímpicos_antiguos",
          confidence: "medium",
        },
        {
          id: "grecia-clasica--olimpia--event",
          category: "event",
          name: "Exclusión de Esparta de los Juegos",
          yearLabel: "c. 420 a.C.",
          year: -420,
          summary:
            "Según Tucídides, los eleos vetaron a los espartanos por atacar Lépreo durante la tregua olímpica y les impusieron una multa, que Esparta rechazó pagar alegando que la tregua aún no regía.",
          sourceUrl: "https://en.wikipedia.org/wiki/Ancient_Olympic_Games",
          confidence: "medium",
        },
      ],
    },
  ],
};

export default era;
