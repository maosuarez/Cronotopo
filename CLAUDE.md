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
- [x] F1 Dominio y utilidades
- [x] F2 Contenido (300 elementos)
- [x] F3 Escena 3D (+ Coreografía)
- [x] F4 Estado, cámara y URL
- [x] F5 Interfaz
- [ ] F6 QA (e2e + motion)
- [ ] F6.5 Pulido de movimiento (≥2 iteraciones)
- [ ] F7 Revisión final + README

## Estado
- F0 ✅ scaffold, deps exactas, scripts, `output: 'export'`, build+lint verdes.
- F1 ✅ types/schema/sceneRegistry, lib geo/years/camera (puro), 34 tests verdes. (0,0)→+X, lon+90→−Z, polo N→+Y.
- F2 ✅ 20 eras / 60 ubicaciones / 300 elementos, `validate:data` verde. Auditoría adversarial aplicada (4 errores factuales, ~16 matices, coordenadas de Pataliputra/Tebas/Lisboa/Londres/Pittsburgh).
- F3 ✅ escena (globo Blue Marble, atmósfera fresnel tintable, barrido temporal, estrellas, marcadores, arcos trazables, CameraRig+OrbitControls, SceneDirector con las 4 timelines). `next build` ok; captura era 1 revisada (marcadores en Etiopía/Sudáfrica/Francia). Commit antes que F2 porque el contenido corre en paralelo.
- F4 ✅ store (+`displayedEraId`, `sceneReady`), director robusto a interrupciones, `frameShift` (setViewOffset) para encuadrar a la izquierda del panel / arriba del bottom sheet, `useUrlSync` + `lib/url.ts`, tests store/url, e2e deep link verde.
- F5 ✅ tokens en `globals.css` (@theme, `--accent` con @property), Timeline (listbox, ←/→ Home/End foco, Enter/Espacio confirma), EraHeader, LocationList, InfoPanel (panel/bottom sheet), ElementCard, LoadingScreen, AccentSync, Announcer. Capturas 1440/390 revisadas; sin scroll horizontal (360/390/1440). Luz principal sigue a la cámara (siempre se ve el hemisferio iluminado).

## Decisiones
- React 19.2.8: la que fija create-next-app 16.3.8; compatible con R3F 9.8 (`>=19 <19.4`) y drei 10.
- e2e sirven el export estático (`out/`) con `serve` en :4173; requiere `pnpm build` previo.
- Sincronía URL con `history.pushState/replaceState` + `popstate` (sin `useSearchParams`, evita Suspense/CSR bailout en export estático y rerenders del router).
- `AGENTS.md` lo genera Next 16 y se versiona tal cual (no es documentación propia).
- Validación zod en build: `pnpm build` = `validate-data && next build`; `data/index.ts` no importa zod (fuera del bundle cliente).
- Ids: location `${eraId}--${slug}`, element `${locationId}--${category}` → unicidad trivial.
- Coordenadas 2–4 decimales verificadas numéricamente: se exige que no terminen en 0 (JS pierde ceros finales).
- `rangeLabel?` opcional en era (era 20: "1900 – presente", endYear 2026).
- Formato de años: a.C. siempre; d.C. solo < 1000 (117 d.C., 1969); separador de miles solo ≥ 10.000.
- Prehistoria: yearLabel en "años AP" cuando la fuente data así.
- Idle rotation = `OrbitControls.autoRotate` (la cámara orbita; el globo no rota → posiciones de marcadores fijas en mundo).
- Era mostrada (`displayedEraId`, en el store) separada de `activeEraId`: cambia en el `swapEra` de la timeline (t≈0,4 s), para que la salida de la era anterior se vea; header y LocationList leen `displayedEraId`, la timeline `activeEraId`.
- Estado e2e: `<div data-testid="atlas-state" data-era data-loc data-transitioning hidden>` (sin exponer el store en window).
- Starfield: radio 25/profundidad 20 (el shader de drei duplica la distancia efectiva y con 50/40 quedaban fuera de `far`).
- Timeline: foco ≠ selección (cada cambio de era cuesta ~3 s de coreografía). Grupos con ≤2 eras usan etiqueta corta visible ("Contemporánea"), nombre accesible completo.
- InfoPanel `role=dialog aria-modal=false`; en móvil con el sheet abierto timeline y chips quedan `inert`.
- Política de confianza: todo `yearLabel` con "c." lleva confidence ≥ medium (80 elementos bajados de high a medium tras la auditoría), según la regla editorial literal.
- `@types/node` 24 (peer de Vitest 5).

## Coreografía
Fuente única: `src/lib/choreography.ts` (constantes + 4 timelines GSAP con nombre). La escena lee el objeto mutable `sceneMotion` en `useFrame`; solo las timelines escriben en él. La UI 2D (Framer Motion) usa `UI_MOTION` del mismo archivo. Un `SceneDirector` escucha el store y lanza la timeline del momento, matando la anterior (interrumpible: los vuelos capturan la pose inicial al empezar).
Principio: lo importante se mueve primero y más (cámara > marcadores > arcos > UI). Curvas: viaje `power2.inOut`, llegada `expo.out`, salida `power2.in`, pop `back.out(2.2)`, trazo `power2.out`, tinte `sine.inOut`.

1. **Carga inicial (`intro`, ≈3,2 s)** — LoadingScreen se funde 0,6 s cuando la textura está lista. t=0 estrellas 0→1 (1,8 s), cámara dolly desde distancia 7,5 al encuadre de la era 1 (2,6 s `expo.out`, frena con peso). t=0,2 atmósfera 0→1 (1,4 s). t=1,5 marcadores pop escalonado (0,7 s, stagger 0,12). +0,25 arcos se trazan (0,9 s, stagger 0,15). t=1,7 UI (header, timeline) sube escalonada (0,8 s, stagger 0,12). Rotación idle tras la intro.
2. **Cambio de era (`eraChange`, ≈2,6–3,2 s)** — t=0 marcadores encogen/funden escalonados (0,35 s `power2.in`), arcos se apagan (0,3 s). t=0,1 tinte de atmósfera/luz/acento hacia el `accentColor` nuevo (1,1 s) + barrido temporal (banda luminosa que recorre el globo de polo a polo, 1,3 s, fuerza sube-baja). t=0,15 vuelo de cámara al centroide de la nueva era (1,6–2,2 s según ángulo, se aleja hasta 0,9 a mitad de trayectos largos). t=0,4 swap de datos. Al 62 % del vuelo entran los marcadores nuevos (pop) y después los arcos. Header: sale 0,25 s, entra 0,55 s con 0,35 s de retardo.
3. **Selección (`select`, ≈1,6–2,2 s)** — t=0 vuelo a la ubicación (distancia 1,75) + otros marcadores se atenúan a 0,3 (0,45 s). Al 55 % del vuelo, realce del elegido (anillo + brillo, `back.out`). Panel entra a 0,95 s (0,65 s `expo.out`, mientras la cámara frena), tarjetas escalonadas 0,07 s desde panel+0,25 s.
4. **Cierre (`close`, ≈1,5 s)** — Panel sale en bloque 0,3 s `power2.in`. t=0 desrealce (0,35 s). t=0,12 cámara vuelve al encuadre de la era (1,2–1,6 s, poca elevación). t=0,35 marcadores recuperan opacidad (0,5 s). Idle se reanuda 4 s después de la última interacción.

**Reduced motion**: vuelos → corte con fundido del canvas (0,18 s out / 0,28 s in); marcadores y arcos solo funden (sin pop ni trazo); tinte 0,3 s; sin barrido, sin pulso, sin rotación idle; panel y tarjetas solo opacidad 0,2 s sin desplazamiento ni stagger.

### Iteraciones de pulido
(pendiente F6.5)

## Bloqueos

## Fuentes
- Textura: NASA Visible Earth, Blue Marble Next Generation (dic. 2004, topografía+batimetría), `world.topo.bathy.200412.3x5400x2700.jpg` → redimensionada a 2048×1024 (344 KB) en `public/textures/earth-day-2048.jpg`. Dominio público. https://visibleearth.nasa.gov/images/73909
