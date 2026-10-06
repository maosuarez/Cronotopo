import type { SceneBeat } from "../types";

/**
 * Storyboard of "La máquina que multiplicó los libros" (Mainz, c. 1450–1455).
 * One candle-lit workshop; the camera travels from station to station (scribe → casting → composing → press)
 * and ends on a map of Europe drawn on a fresh sheet.
 */
export const beats: SceneBeat[] = [
  {
    id: "scribe",
    start: 0,
    end: 10,
    caption: "Antes de la imprenta, cada libro se copiaba a mano, letra a letra. Una sola copia podía llevar meses.",
    visual:
      "Over-the-shoulder close-up of a scribe at a sloped desk: the right page fills line by line with gothic script. Time-lapse: the window cycles day/night, the candle burns down, label 'días → semanas → meses'. Camera pulls back to reveal scribe, desk and window.",
  },
  {
    id: "mould",
    start: 10,
    end: 21,
    caption: "En un molde de mano se vierte una aleación fundida de plomo, estaño y antimonio sobre la matriz: así salen los tipos.",
    visual:
      "Casting bench by a glowing brazier. A ladle takes molten metal from the pot (label 'plomo · estaño · antimonio') and pours it into the wooden hand mould (label 'matriz' at its base). The mould opens, a type sort jumps out; time-lapse cycles fill a growing grid of sorts.",
  },
  {
    id: "compose",
    start: 21,
    end: 32,
    caption: "En el componedor, los tipos se colocan en espejo, línea a línea, y las líneas van llenando la forma.",
    visual:
      "Close-up of the composing stick on the imposing stone: sorts drop in from right to left showing mirrored capitals (IN PRINCIPIO reversed), label 'letras en espejo'. The finished line slides onto the forme, which then fills line by line (two mirrored columns).",
  },
  {
    id: "ink",
    start: 32,
    end: 40,
    caption: "Con balas de cuero se reparte sobre la forma una tinta grasa, a base de aceite, que se adhiere al metal.",
    visual:
      "Three-quarter close-up of the forme locked on the press bed. Two leather ink balls on wooden handles dab across it; the metal letters turn glossy black progressively. Ink slab beside. Labels 'balas de cuero' and 'tinta al aceite'.",
  },
  {
    id: "press",
    start: 40,
    end: 51,
    caption: "La prensa de husillo, adaptada de las prensas de vino, baja la platina y aprieta el papel contra los tipos.",
    visual:
      "Wide shot: the wooden screw press and, beside it, a wine press model rising from the floor (label 'prensa de vino'), both screws turning together. The tympan with the blank sheet folds onto the forme, the pressman pulls the bar, the screw turns and the platen comes down (labels 'husillo', 'platina').",
  },
  {
    id: "sheet",
    start: 51,
    end: 61,
    caption: "Al levantar el pliego aparece la página: dos columnas en letra gótica, como en la Biblia de 42 líneas.",
    visual:
      "The tympan opens and the printed sheet lifts off, turning to face the camera: a two-column page of dense gothic type blocks (42 lines per column, blank space for the hand-painted initial). Labels '2 columnas' and '42 líneas'. Slow push-in.",
  },
  {
    id: "multiply",
    start: 61,
    end: 69,
    caption: "Pliego tras pliego, la prensa repite la misma página, idéntica, mucho más deprisa que cualquier copista.",
    visual:
      "Wide shot of the workshop: the press cycles up and down, identical printed sheets appear one after another on the drying lines overhead and a stack grows on the bench.",
  },
  {
    id: "europe",
    start: 69,
    end: 80,
    caption: "Desde Maguncia, la imprenta se extiende: hacia 1500 ya hay prensas en ciudades de buena parte de Europa.",
    visual:
      "Camera cranes to a top-down view of a large sheet on a table: a stylised map of Europe inks in. Mainz lights up (label 'Maguncia'), then tiny glowing press markers pop up across Europe outward from it; label 'hacia 1500' at the end.",
  },
];

export const DURATION = beats[beats.length - 1].end;
