import type { SceneBeat } from "../types";

/** Storyboard of "Nace la escritura" (Uruk, c. 3400–3000 a.C.). Each caption matches what is on screen. */
export const URUK_BEATS: SceneBeat[] = [
  {
    id: "plain",
    start: 0,
    end: 12,
    caption: "Hacia 3400 a.C., Uruk crece entre canales y palmerales junto al Éufrates, en el sur de Mesopotamia.",
    visual:
      "Wide aerial establishing shot: flat alluvial plain, the river with irrigation canals, palm groves, a dense mud-brick city. The camera drifts toward the centre; labels 'Recinto del Eanna' and 'Templo Blanco' appear over the two sacred precincts.",
  },
  {
    id: "temple-economy",
    start: 12,
    end: 24,
    caption: "El templo reunía cebada, rebaños y trabajo: administraba buena parte de los bienes de la ciudad.",
    visual:
      "Medium shot at the Eanna precinct gate: workers carry sacks of barley in a line, a flock of sheep is herded through the gate, piles of sacks grow in the courtyard.",
  },
  {
    id: "tokens",
    start: 24,
    end: 36,
    caption: "Según una hipótesis muy aceptada, antes se contaba con fichas de arcilla guardadas en bullas selladas.",
    hypothesis: true,
    visual:
      "Close-up on a table: small clay tokens (cones, spheres, discs) drop into a hollow clay ball (bulla); the ball closes and a cylinder seal rolls over it leaving a band of impressions.",
  },
  {
    id: "first-tablet",
    start: 36,
    end: 48,
    caption: "Un escriba presiona el cálamo sobre arcilla húmeda: el signo de la cebada y unas marcas numéricas.",
    visual:
      "Extreme close-up of a wet clay tablet: a reed stylus presses round and D-shaped numeral impressions, then draws the pictographic barley sign (an ear of grain). Label 'Protocuneiforme'.",
  },
  {
    id: "evolution",
    start: 48,
    end: 60,
    caption: "Con los siglos, el dibujo se simplifica, gira y se convierte en un grupo de cuñas: el cuneiforme.",
    visual:
      "Time-lapse on a neutral clay background: the barley pictograph morphs in three stages (drawn sign → rotated, simplified strokes → wedge-shaped strokes). Stage labels: 'pictograma', 'trazos', 'cuñas'.",
  },
  {
    id: "archive",
    start: 60,
    end: 72,
    caption: "Las tablillas se apilaban en archivos. La escritura nació, ante todo, para llevar las cuentas.",
    visual:
      "Shelves stacked with tablets inside a dim store room; the camera pulls back out of the building and rises to a wide view of Uruk at golden hour.",
  },
];
