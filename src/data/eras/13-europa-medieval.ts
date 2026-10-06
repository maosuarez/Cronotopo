import type { HistoricalEra } from "@/domain/types";

const era: HistoricalEra = {
  id: "europa-medieval",
  order: 13,
  name: "Europa medieval",
  macroPeriod: "middle-ages",
  startYear: 800,
  endYear: 1400,
  summary:
    "Desde el imperio de Carlomagno hasta el auge de las ciudades, Europa occidental reorganiza su poder en torno a reyes, la Iglesia y el comercio. Catedrales góticas, universidades y repúblicas mercantiles marcan la plenitud medieval.",
  accentColor: "#c9a0dc",
  locations: [
    {
      id: "europa-medieval--aquisgran",
      name: "Aquisgrán",
      modernName: "Aachen, Renania del Norte-Westfalia",
      country: "Alemania",
      coordinates: { lat: 50.7748, lon: 6.0839 },
      year: 805,
      summary:
        "Ciudad de aguas termales que Carlomagno eligió como residencia principal y centro de su corte. Su capilla palatina fue durante siglos el lugar de coronación de los reyes germánicos.",
      elements: [
        {
          id: "europa-medieval--aquisgran--landmark",
          category: "landmark",
          name: "Capilla Palatina",
          yearLabel: "c. 792 – 805",
          summary:
            "Templo octogonal con cúpula, núcleo de la actual catedral de Aquisgrán, atribuido al arquitecto Odón de Metz. Inspirado en modelos bizantinos como San Vital de Rávena, es Patrimonio de la Humanidad desde 1978.",
          sourceUrl: "https://es.wikipedia.org/wiki/Catedral_de_Aquisgrán",
          confidence: "medium",
        },
        {
          id: "europa-medieval--aquisgran--person",
          category: "person",
          name: "Carlomagno",
          yearLabel: "c. 747 – 814",
          year: 814,
          summary:
            "Rey de los francos coronado emperador en Roma en el año 800. Hizo de Aquisgrán su residencia favorita, murió allí en 814 y fue enterrado en su capilla palatina.",
          sourceUrl: "https://es.wikipedia.org/wiki/Carlomagno",
          confidence: "medium",
        },
        {
          id: "europa-medieval--aquisgran--technology",
          category: "technology",
          name: "Minúscula carolingia",
          yearLabel: "finales del s. VIII – s. IX",
          summary:
            "Escritura clara y regular, con letras separadas y minúsculas uniformes, que se difundió desde los centros culturales del Imperio carolingio. Facilitó la copia de textos y es la base de nuestras minúsculas actuales.",
          sourceUrl: "https://es.wikipedia.org/wiki/Minúscula_carolingia",
          confidence: "high",
        },
        {
          id: "europa-medieval--aquisgran--culture",
          category: "culture",
          name: "Renacimiento carolingio",
          yearLabel: "finales del s. VIII – s. IX",
          summary:
            "Carlomagno reunió en su corte a eruditos como Alcuino de York para impulsar la enseñanza, corregir textos religiosos y copiar autores clásicos. Muchas obras latinas antiguas nos han llegado gracias a esas copias.",
          sourceUrl: "https://es.wikipedia.org/wiki/Renacimiento_carolingio",
          confidence: "high",
        },
        {
          id: "europa-medieval--aquisgran--event",
          category: "event",
          name: "Coronación de Otón I",
          yearLabel: "936",
          year: 936,
          summary:
            "Otón I fue coronado rey de Germania en Aquisgrán en 936, vinculándose así a la herencia de Carlomagno. La ciudad acogió coronaciones reales germánicas durante unos seis siglos.",
          sourceUrl: "https://es.wikipedia.org/wiki/Otón_I_el_Grande",
          confidence: "high",
        },
      ],
    },
    {
      id: "europa-medieval--paris",
      name: "París",
      modernName: "París",
      country: "Francia",
      coordinates: { lat: 48.8531, lon: 2.35 },
      year: 1250,
      summary:
        "Capital de los reyes Capetos, París creció en los siglos XII y XIII hasta ser una de las mayores ciudades de Europa. Su catedral gótica y su universidad la convirtieron en referente religioso e intelectual.",
      elements: [
        {
          id: "europa-medieval--paris--landmark",
          category: "landmark",
          name: "Catedral de Notre Dame",
          yearLabel: "1163 – c. 1345",
          year: 1163,
          summary:
            "Catedral gótica iniciada en 1163 en la Île de la Cité bajo el obispo Maurice de Sully. Su construcción se prolongó cerca de dos siglos; tras el incendio de 2019 fue restaurada y reabierta en 2024.",
          sourceUrl: "https://es.wikipedia.org/wiki/Catedral_de_Notre_Dame_de_París",
          confidence: "medium",
        },
        {
          id: "europa-medieval--paris--person",
          category: "person",
          name: "Luis IX (San Luis)",
          yearLabel: "1214 – 1270",
          summary:
            "Rey de Francia desde 1226, mandó construir en su palacio de la Cité la Sainte-Chapelle para guardar reliquias de la Pasión. Murió durante la octava cruzada y fue canonizado en 1297.",
          sourceUrl: "https://es.wikipedia.org/wiki/Luis_IX_de_Francia",
          confidence: "high",
        },
        {
          id: "europa-medieval--paris--technology",
          category: "technology",
          name: "Arbotante",
          yearLabel: "finales del s. XII",
          summary:
            "Arco exterior que transmite el empuje de las bóvedas a contrafuertes separados del muro. Notre Dame fue uno de los primeros edificios en usarlo, lo que permitió muros más altos y ventanales más grandes.",
          sourceUrl: "https://es.wikipedia.org/wiki/Arbotante",
          confidence: "medium",
        },
        {
          id: "europa-medieval--paris--culture",
          category: "culture",
          name: "Universidad de París",
          yearLabel: "c. 1150 – 1231",
          summary:
            "Surgida de las escuelas catedralicias, la corporación de maestros y estudiantes recibió privilegios reales en 1200 y protección papal en 1231. Fue el gran centro europeo de teología y filosofía escolástica.",
          sourceUrl: "https://es.wikipedia.org/wiki/Universidad_de_París",
          confidence: "medium",
        },
        {
          id: "europa-medieval--paris--event",
          category: "event",
          name: "Asedio vikingo de París",
          yearLabel: "885 – 886",
          year: 885,
          summary:
            "Una gran flota vikinga remontó el Sena y cercó París durante casi un año. La resistencia dirigida por el conde Odón y el obispo Gozlin dio prestigio a Odón, que luego sería elegido rey.",
          sourceUrl: "https://es.wikipedia.org/wiki/Sitio_de_París_(885-886)",
          confidence: "high",
        },
      ],
    },
    {
      id: "europa-medieval--venecia",
      name: "Venecia",
      modernName: "Venecia, Véneto",
      country: "Italia",
      coordinates: { lat: 45.4344, lon: 12.3397 },
      year: 1204,
      summary:
        "República marítima construida sobre las islas de una laguna, gobernada por un dux electo. Su flota y sus redes comerciales con Bizancio y Oriente la hicieron una de las potencias más ricas del Mediterráneo.",
      elements: [
        {
          id: "europa-medieval--venecia--landmark",
          category: "landmark",
          name: "Basílica de San Marcos",
          yearLabel: "1063 – 1094",
          year: 1063,
          summary:
            "Iglesia de planta de cruz griega con cinco cúpulas, inspirada en la de los Santos Apóstoles de Constantinopla. Custodia las reliquias de san Marcos y fue la capilla del dux; sus mosaicos cubren bóvedas y cúpulas.",
          sourceUrl: "https://es.wikipedia.org/wiki/Basílica_de_San_Marcos",
          confidence: "high",
        },
        {
          id: "europa-medieval--venecia--person",
          category: "person",
          name: "Enrico Dandolo",
          yearLabel: "c. 1107 – 1205",
          summary:
            "Dux de Venecia desde 1192, anciano y casi ciego. Negoció el transporte de la cuarta cruzada y participó en el desvío que culminó con la toma de Constantinopla en 1204.",
          sourceUrl: "https://es.wikipedia.org/wiki/Enrico_Dandolo",
          confidence: "medium",
        },
        {
          id: "europa-medieval--venecia--technology",
          category: "technology",
          name: "Arsenal de Venecia",
          yearLabel: "s. XII",
          summary:
            "Astilleros y depósitos estatales donde se construían y armaban las galeras de la república. Su organización por etapas permitió producir barcos con una rapidez excepcional para la época.",
          sourceUrl: "https://es.wikipedia.org/wiki/Arsenal_de_Venecia",
          confidence: "medium",
        },
        {
          id: "europa-medieval--venecia--culture",
          category: "culture",
          name: "Caballos de San Marcos",
          yearLabel: "1204",
          year: 1204,
          summary:
            "Cuadriga de bronce dorado de la Antigüedad que los venecianos se llevaron del hipódromo de Constantinopla tras el saqueo de 1204. Colocada en la fachada de San Marcos, se convirtió en símbolo de la ciudad.",
          sourceUrl: "https://es.wikipedia.org/wiki/Caballos_de_San_Marcos",
          confidence: "high",
        },
        {
          id: "europa-medieval--venecia--event",
          category: "event",
          name: "Paz de Venecia",
          yearLabel: "1177",
          year: 1177,
          summary:
            "Venecia acogió la reconciliación entre el emperador Federico Barbarroja y el papa Alejandro III, que puso fin a años de conflicto. El acuerdo reforzó el prestigio diplomático de la república.",
          sourceUrl: "https://en.wikipedia.org/wiki/Treaty_of_Venice",
          confidence: "high",
        },
      ],
    },
  ],
};

export default era;
