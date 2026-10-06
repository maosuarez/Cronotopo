@AGENTS.md

# Atlas Histórico Interactivo — memoria de trabajo

Plan maestro completo: `prompt-atlas-historico.md` (no versionado). Este archivo es la fuente de verdad del estado.

## Objetivo
Navegador 3D de la historia: globo (espacio) + timeline (tiempo). 20 eras × 3 ubicaciones × 5 elementos = 300 elementos.
El motor es agnóstico al contenido: renderiza `HistoricalEra → HistoricalLocation → HistoricalElement` desde datos tipados locales.
Agregar una era = un archivo en `src/data/eras/` + registro en `src/data/index.ts`.

Flujo: Tierra idle → elegir era → 3 marcadores + arcos → click marcador → vuelo de cámara → panel 5 elementos → cerrar → vuelta al encuadre de la era.

## Stack (versiones exactas en package.json)
Next.js 16.3.8 (App Router, `output: 'export'`) · React 19.2.8 · TS estricto · three 0.186.1 · @react-three/fiber 9.8.1 · drei 10.7.9 ·
GSAP 3.15 · Zustand 5 · Tailwind 4 · Framer Motion 14 (solo UI 2D) · lucide-react · zod 4 · Vitest 5 · Playwright 1.63 · pnpm 11.

## Arquitectura
```
src/app            layout, page, globals.css
src/components/scene  Experience (dynamic ssr:false), Earth, Atmosphere, Starfield, LocationMarkers, Marker, EraArcs, CameraRig
src/components/ui     Timeline, EraHeader, InfoPanel, ElementCard, LocationList, LoadingScreen
src/domain         types.ts, schema.ts (zod), sceneRegistry.ts   — sin React ni Three
src/data/eras      01..20 archivos de era; src/data/index.ts agrega/ordena/valida
src/lib            geo.ts, camera.ts, years.ts, choreography.ts
src/store          useAtlasStore.ts
src/hooks          useUrlSync.ts, useReducedMotion.ts
scripts/validate-data.ts · tests/unit · tests/e2e · public/textures · public/models
```
Reglas: escena 3D ↔ UI 2D solo vía store. `scene/` y `ui/` no importan `data/eras/*` (usan store o `data/index.ts`). `domain/` no importa React/Three.

Store: `activeEraId`, `selectedLocationId`, `hoveredLocationId`, `isTransitioning`; `setEra` (limpia selección), `selectLocation`, `clearSelection`.

## Invariantes de datos
- 20 eras, `order` 1..20 sin huecos; ids únicos globales; location id = `${eraId}--${slug}`.
- `startYear < endYear`; ningún año 0; `location.year ∈ [startYear, endYear]`.
- lat ∈ [-90,90], lon ∈ [-180,180], 2–4 decimales.
- 5 elementos por ubicación, uno por categoría (landmark, person, technology, culture, event).
- summary de elemento ≤ 280; sourceUrl `https://`.
- Total 60 ubicaciones, 300 elementos.

## Tareas (fases)
- [x] F0 Setup
- [ ] F1 Dominio y utilidades
- [ ] F2 Contenido (300 elementos)
- [ ] F3 Escena 3D (+ Coreografía)
- [ ] F4 Estado, cámara y URL
- [ ] F5 Interfaz
- [ ] F6 QA (e2e + motion)
- [ ] F6.5 Pulido de movimiento (≥2 iteraciones)
- [ ] F7 Revisión final + README

## Estado
- F0 ✅ scaffold, deps exactas, scripts, `output: 'export'`, build+lint verdes.

## Decisiones
- React 19.2.8: la que fija create-next-app 16.3.8; compatible con R3F 9.8 (`>=19 <19.4`) y drei 10.
- e2e sirven el export estático (`out/`) con `serve` en :4173; requiere `pnpm build` previo.
- Sincronía URL con `history.pushState/replaceState` + `popstate` (sin `useSearchParams`, evita Suspense/CSR bailout en export estático y rerenders del router).
- `AGENTS.md` lo genera Next 16 y se versiona tal cual (no es documentación propia).
- `@types/node` 24 (peer de Vitest 5).

## Coreografía

## Bloqueos

## Fuentes
