import { ScenePlayer } from "@/components/player/ScenePlayer";
import { ExperienceLoader } from "@/components/scene/ExperienceLoader";
import { AccentSync } from "@/components/ui/AccentSync";
import { Announcer } from "@/components/ui/Announcer";
import { AtlasUrlSync } from "@/components/ui/AtlasUrlSync";
import { EraHeader } from "@/components/ui/EraHeader";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { LocationList } from "@/components/ui/LocationList";
import { Timeline } from "@/components/ui/Timeline";

export default function Home() {
  return (
    <main aria-label="Atlas Histórico" className="relative h-dvh w-full overflow-hidden">
      <a
        href="#timeline-list"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-(--z-loader) focus:rounded-hair focus:bg-void focus:px-3 focus:py-2 focus:text-meta focus:text-ink"
      >
        Ir a la línea de tiempo
      </a>
      <div
        role="img"
        aria-label="Globo terráqueo interactivo. Usa la lista de ubicaciones para explorar con teclado."
        className="absolute inset-0 z-(--z-canvas)"
      >
        <ExperienceLoader />
      </div>
      <AtlasUrlSync />
      <AccentSync />
      <Announcer />
      <EraHeader />
      <LocationList />
      <Timeline />
      <InfoPanel />
      <ScenePlayer />
      <LoadingScreen />
    </main>
  );
}
