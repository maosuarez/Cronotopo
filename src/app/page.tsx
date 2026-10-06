import { ExperienceLoader } from "@/components/scene/ExperienceLoader";
import { AtlasUrlSync } from "@/components/ui/AtlasUrlSync";

export default function Home() {
  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <ExperienceLoader />
      <AtlasUrlSync />
    </main>
  );
}
