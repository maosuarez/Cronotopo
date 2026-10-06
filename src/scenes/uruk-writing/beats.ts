import type { SceneBeat } from "../types";

/**
 * Storyboard of "Nace la escritura" (Uruk, c. 3400–3000 a.C.). Each caption matches what is on screen.
 * The scene is one continuous camera move through a single diorama: plain → Eanna courtyard → storeroom table
 * (tokens, first tablet, evolution of the sign) → archive shelves → back out over the city.
 */
export const URUK_BEATS: SceneBeat[] = [
  {
    id: "plain",
    start: 0,
    end: 12,
    caption: "Hacia 3400 a.C., Uruk crece entre canales y palmerales junto al Éufrates, en el sur de Mesopotamia.",
    visual:
      "Wide aerial shot in morning haze: flat plain, the Euphrates with palm groves on its banks, irrigation canals between fields, a dense mud-brick city. The camera drifts in; labels 'Éufrates', 'Recinto del Eanna' and 'Templo Blanco · Kullaba' (white temple on its high terrace, separate from the Eanna).",
  },
  {
    id: "temple-economy",
    start: 12,
    end: 24,
    caption: "El templo reunía cebada, rebaños y trabajo: administraba buena parte de los bienes de la ciudad.",
    visual:
      "The camera descends to the Eanna gate: a line of workers carries sacks of barley into a storeroom, a shepherd drives a flock of sheep into the courtyard, the pile of sacks grows. Small labels 'Cebada' and 'Rebaños'.",
  },
  {
    id: "tokens",
    start: 24,
    end: 36,
    caption: "Según una hipótesis muy aceptada, antes se contaba con fichas de arcilla guardadas en bullas selladas.",
    hypothesis: true,
    visual:
      "The storeroom's front wall sinks (cutaway) and the camera pushes in to a reed mat on the table: clay tokens (cones, spheres, discs) hop into a hollow clay ball, the ball is closed and a cylinder seal rolls around it leaving a band of raised impressions. Label 'Fichas de arcilla' with the Hipótesis tag, then 'Bulla sellada'.",
  },
  {
    id: "first-tablet",
    start: 36,
    end: 48,
    caption: "Un escriba presiona el cálamo sobre arcilla húmeda: el signo de la cebada y unas marcas numéricas.",
    visual:
      "Macro shot of a wet clay tablet: a reed stylus presses D-shaped and round numeral impressions, then draws the pictographic barley sign (an ear of grain). Labels 'Marcas numéricas', 'Cebada' and 'Protocuneiforme'.",
  },
  {
    id: "evolution",
    start: 48,
    end: 60,
    caption: "Con los siglos, el dibujo se simplifica, gira y se convierte en un grupo de cuñas: el cuneiforme.",
    visual:
      "Time-lapse along the table: two later tablets appear next to the first; on each the barley sign morphs (pictograph → rotated, simplified strokes → wedge-shaped impressions). Labels 'Pictograma', 'Girado y simplificado', 'Cuñas: cuneiforme' and an arrow 'Siglos'.",
  },
  {
    id: "archive",
    start: 60,
    end: 72,
    caption: "Las tablillas se apilaban en archivos. La escritura nació, ante todo, para llevar las cuentas.",
    visual:
      "Pull back into the storeroom: shelves filled with stacked tablets behind the scribe's table. The front wall closes and the camera rises out of the precinct to a wide view of Uruk in golden evening light.",
  },
];
