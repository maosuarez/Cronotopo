import { CalendarClock, Cog, Landmark, Palette, UserRound, type LucideIcon } from "lucide-react";
import type { ElementCategory, MacroPeriod } from "@/domain/types";

export const categoryMeta: Record<ElementCategory, { label: string; Icon: LucideIcon }> = {
  landmark: { label: "Monumento", Icon: Landmark },
  person: { label: "Personaje", Icon: UserRound },
  technology: { label: "Tecnología", Icon: Cog },
  culture: { label: "Cultura", Icon: Palette },
  event: { label: "Acontecimiento", Icon: CalendarClock },
};

export const macroPeriodLabels: Record<MacroPeriod, string> = {
  prehistory: "Prehistoria",
  antiquity: "Antigüedad",
  "middle-ages": "Edad Media",
  "early-modern": "Edad Moderna",
  contemporary: "Edad Contemporánea",
};

/** Visible label for narrow groups (≤ 2 eras); the full label stays as the accessible name. */
export const macroPeriodShortLabels: Record<MacroPeriod, string> = {
  ...macroPeriodLabels,
  contemporary: "Contemporánea",
};
