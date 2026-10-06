import type { SceneBeat } from "../types";

/**
 * Storyboard of "El templo de Atenea" (Parthenon, 447–432 a.C.). Light travels from late-afternoon gold to dusk.
 * Pure data: no React/three imports (read by the registry and the unit tests).
 */
export const beats: SceneBeat[] = [
  {
    id: "ruinas",
    start: 0,
    end: 10,
    caption: "La Acrópolis de Atenas tras el saqueo persa de 480 a.C.: templos quemados y tambores de columna caídos.",
    visual:
      "Aerial approach from the south-east over the city to the Acropolis rock in raking gold light; on the old platform, blackened column stumps, fallen drums and charred blocks. Label: saqueo persa, 480 a.C.",
  },
  {
    id: "pericles",
    start: 10,
    end: 20,
    caption: "Pericles impulsa un nuevo templo. Fidias supervisa las obras; Ictino y Calícrates son sus arquitectos.",
    visual:
      "Medium shot of four robed figures (labelled Pericles, Fidias, Ictino, Calícrates) on the cleared platform; a glowing plan (peristyle outline and 46 column rings) is drawn on the stone, then translucent ghost columns rise as the camera cranes up.",
  },
  {
    id: "tambores",
    start: 20,
    end: 32,
    caption: "Con mármol del monte Pentélico, los tambores se apilan uno sobre otro hasta formar cada columna.",
    visual:
      "Close-up: a wooden crane lowers a marble drum onto a half-built corner column, workers at the winch, pile of drums labelled Mármol del Pentélico. Pull back: time-lapse of the 46 columns rising drum by drum, cella walls and entablature set in place.",
  },
  {
    id: "entasis",
    start: 32,
    end: 42,
    caption: "Éntasis: el fuste de la columna se abomba levemente. Aquí se exagera; en el templo real la curva apenas se percibe.",
    visual:
      "Low shot of the north-east corner columns against the sky with two straight accent guide lines; the shafts swell visibly (label: éntasis exagerada), hold, then relax to the real, almost straight profile (label: escala real).",
  },
  {
    id: "estilobato",
    start: 42,
    end: 51,
    caption: "El estilóbato también se curva: su centro sube unos 11 cm en 69 m. Exagerado aquí, en la realidad es casi invisible.",
    visual:
      "Frontal view of the long north side with a straight accent reference line at the platform edge; the whole stylobate and entablature arch upwards (label: exagerada ×40), then settle back to the real curve (label: real ≈ 11 cm en 69 m).",
  },
  {
    id: "color",
    start: 51,
    end: 61,
    caption: "Frisos y esculturas recibían color: el templo no era blanco. Los tonos exactos son una reconstrucción.",
    hypothesis: true,
    visual:
      "Close view of the east corner entablature: a wave of paint sweeps along triglyphs (blue), metopes (red ground, coloured figures), cornice strips and pediment statues; painters on a scaffold. Label: colores reconstruidos (hipótesis).",
  },
  {
    id: "partenos",
    start: 61,
    end: 72,
    caption: "Dentro, en la cella, la Atenea Pártenos de Fidias: una estatua de oro y marfil de unos 12 metros.",
    visual:
      "Camera passes through the east door into the dim cella with its two-storey colonnade and tilts up to the gold-and-ivory Athena (shield, spear, Nike in hand); a person at her feet and a ≈ 12 m arrow give the scale; labels oro / marfil.",
  },
  {
    id: "panateneas",
    start: 72,
    end: 84,
    caption: "La procesión de las Panateneas sube por la Acrópolis hacia el templo de Atenea, ahora terminado.",
    visual:
      "Dusk: a long procession climbs the west ramp, passes the Propylaea and walks along the north flank; the camera rises to a final wide view of the finished, painted Parthenon against the sunset.",
  },
];

export const DURATION = beats[beats.length - 1].end;
