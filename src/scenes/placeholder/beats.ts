import type { SceneBeat } from "../types";

/** Placeholder storyboard (10 s) used to build and test the player. Replaced by real scenes later. */
export const PLACEHOLDER_DURATION = 10;

export const placeholderBeats: SceneBeat[] = [
  {
    id: "emerge",
    start: 0,
    end: 3.5,
    caption: "Un bloque de ocre emerge de la oscuridad y empieza a girar.",
    visual: "Icosaedro ocre oscuro que crece desde escala 0 y gira despacio.",
  },
  {
    id: "scrape",
    start: 3.5,
    end: 7,
    caption: "Al raspar sus caras, el ocre se aviva hacia un rojo intenso.",
    visual: "El color pasa de ocre a rojo; el giro se acelera ligeramente.",
  },
  {
    id: "pigment",
    start: 7,
    end: 10,
    caption: "El pigmento brilla: quizá ya servía para pintar cuerpos y objetos.",
    visual: "Color dorado y pulso de escala suave.",
    hypothesis: true,
  },
];
