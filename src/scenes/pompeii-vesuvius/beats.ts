import type { SceneBeat } from "../types";

/**
 * Storyboard of "El día que desapareció Pompeya" (flagship scene). No React/three imports: the registry and the
 * unit tests read this file directly. `visual` is the acceptance criterion of each beat during polish.
 */
export const POMPEII_BEATS: SceneBeat[] = [
  {
    id: "city",
    start: 0,
    end: 12,
    caption: "Pompeya: foro, calles con pasos de piedra elevados y panaderías. Detrás, el Vesubio verde; nadie lo tenía por un volcán activo.",
    visual:
      "Golden Campanian morning. Aerial over the forum and Temple of Jupiter with the green, vine-covered Vesuvius behind (labels Foro, Vesubio); cut to a bakery courtyard (lava millstones turned by a worker, glowing oven, loaves); cut to street level: raised stepping stones in the foreground, passers-by, the street running to the north gate with Vesuvius at its end.",
  },
  {
    id: "eruption",
    start: 12,
    end: 23,
    caption: "Año 79: la tierra tiembla y la cima del Vesubio se abre. Una columna de gas, ceniza y piedra sube muy por encima de la montaña.",
    visual:
      "Same street shot: the camera shakes, dust falls from roofs, people stop; a flash at the summit and a dark column climbs; the camera tilts up and widens as the column dwarfs the houses. Cut to a high wide shot: tiny city, volcano and the column opening at the top. In-world date labels: 24 August (traditional) / 24 October? (recent evidence).",
  },
  {
    id: "pine",
    start: 23,
    end: 32,
    caption: "Plinio el Joven, que lo vio desde el otro lado de la bahía, comparó aquella nube con un pino: un tronco alto que se abre en copa.",
    visual:
      "From the Misenum headland across the bay: an Italian stone pine in the foreground rhymes with the eruption column and its umbrella cloud over Vesuvius; sea in between; labels Vesubio, Pompeya, Miseno.",
  },
  {
    id: "pumice",
    start: 32,
    end: 44,
    caption: "Durante horas cae piedra pómez sobre la ciudad. Las calles se llenan y los tejados ceden bajo el peso.",
    visual:
      "Light sinks into ash-darkness. Pale pumice rains on the empty city; the grey-white layer rises in the streets and swallows the stepping stones; roofs sag and collapse one after another, each with a puff of dust. Lightning flickers in the ash cloud.",
  },
  {
    id: "surge",
    start: 44,
    end: 57,
    caption: "Al día siguiente, corrientes piroclásticas —nubes ardientes de gas y ceniza— bajan por la ladera y alcanzan la ciudad.",
    visual:
      "Wide side view in the dark: the column partly collapses and a glowing, rolling cloud runs down the slope of Vesuvius towards the tiny city, lightning in the plume. Cut to the street looking north: the towering surge front pours over the north wall and fills the street until it swallows the camera.",
  },
  {
    id: "buried",
    start: 57,
    end: 67,
    caption: "Pompeya queda sepultada bajo varios metros de material: piedra pómez abajo y, encima, los depósitos de las corrientes.",
    visual:
      "Silent, pale-grey plain where the city stood, a weak plume over the volcano. Cut to a cutaway section of the diorama: walls of the buried houses inside a light pumice layer topped by grey surge layers; labels for each layer and the 79 street level.",
  },
  {
    id: "centuries",
    start: 67,
    end: 77,
    caption: "Pasan los siglos: sobre la ceniza se forma suelo nuevo, vuelve la vegetación y la ciudad queda oculta bajo los campos.",
    visual:
      "Same section in time-lapse: suns sweep across, a dark soil layer forms on top, grass, bushes and trees grow over the hidden city; a year counter runs from 79 towards the 18th century; Vesuvius turns green again.",
  },
  {
    id: "excavation",
    start: 77,
    end: 88,
    caption: "Desde 1748 comienzan las excavaciones: la ciudad vuelve a la luz, con el Vesubio siempre al fondo.",
    visual:
      "Aerial matching the opening shot: a pit with stratified walls widens in the green fields and reveals roofless ruins, streets and the forum with the Temple of Jupiter; label 1748; Vesuvius, now with a truncated summit, behind; golden light, slow pull-back, fade out.",
  },
];
