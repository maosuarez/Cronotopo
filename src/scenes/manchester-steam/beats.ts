import type { SceneBeat } from "../types";

/**
 * Storyboard of "La ciudad de las chimeneas" (Manchester, c. 1780–1830).
 * Sets: cottage (A), engine house (B), mill floor (C), city (D). Shot changes are motivated:
 * spinning wheel → flywheel match cut, power followed along the shaft into the mill, crane-out over the city.
 */
export const BEATS: SceneBeat[] = [
  {
    id: "home",
    start: 0,
    end: 10,
    caption: "Antes de las fábricas se hilaba y tejía en casa: la rueca torcía el hilo y el telar manual lo convertía en tela.",
    visual:
      "Cutaway cottage lit by a hearth and a grey window. A seated woman treadles a spinning wheel (wheel turning, wool on the distaff); a weaver at a hand loom moves the batten while the shuttle crosses the warp. Labels 'Rueca' and 'Telar manual'. Ends on a close-up of the turning wheel (match cut).",
  },
  {
    id: "steam",
    start: 10,
    end: 21,
    caption: "La máquina de Watt: la caldera envía vapor al cilindro y empuja el pistón; un condensador separado lo enfría y hace el vacío.",
    visual:
      "Watt beam engine in cutaway inside a brick engine house. Coal fire glowing under the boiler, steam pipe to the half-cut cylinder: the piston moves; the pushing side glows warm (steam), the other side blue towards the condenser in its cold-water cistern. Arrows for the steam flow. Labels Caldera, Cilindro, Pistón, Condensador separado.",
  },
  {
    id: "motion",
    start: 21,
    end: 32,
    caption: "El pistón mueve el balancín; la biela y el engranaje de sol y planeta hacen girar el volante. El regulador abre sus bolas al acelerar.",
    visual:
      "Same engine: camera rises along the piston rod to the rocking beam, follows the connecting rod down to the sun-and-planet gears and the big flywheel. The engine speeds up and the centrifugal governor's balls swing outwards. Labels Balancín, Biela, Sol y planeta, Volante, Regulador centrífugo.",
  },
  {
    id: "shafts",
    start: 32,
    end: 44,
    caption: "Ejes de transmisión y correas reparten la fuerza del vapor por toda la planta hasta largas filas de mulas de hilar.",
    visual:
      "Interior of a mill floor with cast-iron columns and tall windows. A line shaft along the ceiling turns its pulleys; belts drop to two rows of spinning mules whose carriages roll out and back stretching the threads. Spinners tend the machines. Accent arrow along the shaft. Labels Eje de transmisión, Correas, Mula de hilar.",
  },
  {
    id: "mill",
    start: 44,
    end: 54,
    caption: "La hilatura de varios pisos se ilumina planta a planta junto al canal; su alta chimenea lanza humo de carbón al cielo gris.",
    visual:
      "Exterior at grey dusk: a six-storey brick cotton mill beside a canal. Its windows light up floor by floor, from the ground up; the tall chimney pours dark smoke. Barge on the canal.",
  },
  {
    id: "cottonopolis",
    start: 54,
    end: 65,
    caption: "En pocas décadas Mánchester se llena de hilaturas, chimeneas y casas obreras: la llaman «Cottonopolis», la ciudad del algodón.",
    visual:
      "Time-lapse from high above: rows of terraced houses, new mills and chimneys rise around the first mill, more smoke columns, the sky darkens. In-world label 'Cottonopolis'.",
  },
  {
    id: "railway",
    start: 65,
    end: 76,
    caption: "1830: se inaugura el ferrocarril Liverpool–Mánchester, la primera línea interurbana de pasajeros con locomotoras de vapor.",
    visual:
      "Edge of the city: station, double track on sleepers heading to the horizon. A steam locomotive with tender pulls open and covered carriages out of Manchester leaving a steam trail; onlookers on the platform. Labels 'Mánchester, 1830' and 'Hacia Liverpool'.",
  },
  {
    id: "cost",
    start: 76,
    end: 86,
    caption: "Bajo un cielo cargado de hollín, el coste humano: jornadas de doce horas o más y niños trabajando en las hilaturas.",
    visual:
      "Street level at the mill gate under a dark soot sky with falling soot. Workers, among them children, walk in to the mill; lit windows above, chimneys smoking. Slow, sober camera rising to the soot sky.",
  },
];
