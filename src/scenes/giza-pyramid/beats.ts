import type { SceneBeat } from "../types";

/** Storyboard of "Construir una montaña de piedra" (Giza, c. 2560 a.C.). Each caption matches what is on screen. */
export const GIZA_BEATS: SceneBeat[] = [
  {
    id: "plateau",
    start: 0,
    end: 10,
    caption: "La meseta de Guiza, junto al Nilo desbordado por la crecida. La Gran Pirámide apenas empieza: sus primeras hiladas.",
    visual:
      "High aerial establishing shot from over the flood, descending slowly west: a sheet of flood water with palm-lined dikes, the escarpment, the desert plateau and on it a huge square base with only two or three courses laid. Labels 'Nilo en crecida' and 'Gran Pirámide' fade in.",
  },
  {
    id: "quarry",
    start: 10,
    end: 20,
    caption: "En la misma meseta se abren canteras: los bloques del núcleo se cortan en la roca y se desbastan allí mismo.",
    visual:
      "Medium shot pushing into a stepped quarry pit cut in the plateau: a grid of blocks separated by trenches, workers pounding and dressing blocks, a freed block rising out, dust in the air. Label 'Cantera · bloques del núcleo'.",
  },
  {
    id: "barges",
    start: 20,
    end: 31,
    caption: "Por canales llegan barcazas con caliza fina de Tura para el revestimiento, como registra el Diario de Merer (Wadi al-Jarf).",
    visual:
      "Low shot over the water between palm-lined dikes: barges loaded with white blocks glide toward a stone quay at the foot of the plateau. Label 'Caliza fina de Tura' follows the lead barge; a papyrus sheet with hieratic lines fades in with label 'Diario de Merer · papiros de Wadi al-Jarf'.",
  },
  {
    id: "sledge",
    start: 31,
    end: 41,
    caption: "Los bloques viajan sobre trineos de madera. Un obrero vierte agua delante: la arena mojada reduce la fricción.",
    visual:
      "Close tracking shot: a wooden sledge with a block hauled by two rope teams; a man on the front of the sledge pours water from a jar onto the sand, leaving a dark wet strip under the runners. Label 'Arena mojada: menos fricción'.",
  },
  {
    id: "ramp",
    start: 41,
    end: 51,
    caption: "Una hipótesis: una rampa de cascotes para subir los bloques. Cómo se hizo exactamente sigue en debate.",
    hypothesis: true,
    visual:
      "Wide shot of the pyramid at about 40 % of its height with a long straight ramp against its south face, outlined in amber; teams haul blocks up the ramp. In-world label 'Rampa · una de las hipótesis' with the hypothesis tag.",
  },
  {
    id: "timelapse",
    start: 51,
    end: 62,
    caption: "Hilada tras hilada, la pirámide crece. Al final se coloca el revestimiento de caliza blanca pulida.",
    visual:
      "Time-lapse orbit: courses stack up quickly to the apex while shadows swing; the ramp grows and then disappears; the white polished casing rises from the base and covers the stepped core.",
  },
  {
    id: "gleam",
    start: 62,
    end: 71,
    caption: "Terminada, la pirámide brilla al sol de mediodía: medía unos 146 m de altura original.",
    visual:
      "Low hero shot from the south-east: the finished white pyramid gleaming under the zenith sun; a golden dimension line rises beside it with the label '≈ 146 m · altura original'.",
  },
  {
    id: "village",
    start: 71,
    end: 82,
    caption: "No la levantaron esclavos, sino cuadrillas organizadas de trabajadores que vivían en un poblado cercano.",
    visual:
      "Crane move to the workers' town at the desert edge, with the pyramid behind it: rows of mud-brick houses, bakery smoke, gangs of workers walking in groups toward the plateau. Labels 'Poblado de los trabajadores' and 'Cuadrillas organizadas'.",
  },
];
