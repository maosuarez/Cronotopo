# Atlas Histórico

Navegador 3D de la historia: un globo interactivo y una línea de tiempo con 20 eras, 60 lugares y 300 elementos documentados.
Next.js (export estático) · React Three Fiber · GSAP · Zustand · Tailwind.

## Requisitos

- Node 22+ y pnpm 11
- Para los tests e2e: `pnpm exec playwright install chromium`

## Instalar y correr

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build          # valida los datos y exporta el sitio estático a out/
pnpm start          # sirve out/
```

Enlaces directos: `/?era=roma&loc=roma--pompeya`.

## Scripts

| Script | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | `validate:data` + `next build` (export estático en `out/`) |
| `pnpm start` | Sirve `out/` |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Tests unitarios (Vitest) |
| `pnpm test:e2e` | Tests e2e (Playwright sobre `out/`; ejecuta antes `pnpm build`) |
| `pnpm test:motion` | Graba video y secuencias de frames de las 4 transiciones en `tests/motion-frames/` |
| `pnpm test:scenes` | Captura frames de las escenas animadas (`-- <id>` para una sola) |
| `pnpm validate:data` | Valida el contenido con zod (`pnpm validate:data <archivo-era.ts>` valida una sola era) |

## Escenas animadas

Seis tarjetas abren un "video" animado hecho 100 % con código (React Three Fiber, sin assets): botón «▶ Ver escena» o `&scene=<elementId>` en la URL.

| Escena | Enlace |
|---|---|
| Nace la escritura (Uruk) | `/?era=mesopotamia&loc=mesopotamia--uruk&scene=mesopotamia--uruk--technology` |
| Construir una montaña de piedra (Giza) | `/?era=egipto-antiguo&loc=egipto-antiguo--giza&scene=egipto-antiguo--giza--landmark` |
| El templo de Atenea (Atenas) | `/?era=grecia-clasica&loc=grecia-clasica--atenas&scene=grecia-clasica--atenas--landmark` |
| El día que desapareció Pompeya | `/?era=roma&loc=roma--pompeya&scene=roma--pompeya--event` |
| La máquina que multiplicó los libros (Maguncia) | `/?era=renacimiento&loc=renacimiento--maguncia&scene=renacimiento--maguncia--technology` |
| La ciudad de las chimeneas (Manchester) | `/?era=revolucion-industrial&loc=revolucion-industrial--manchester&scene=revolucion-industrial--manchester--technology` |

Controles: Espacio (play/pausa), ←/→ (beat anterior/siguiente), C (subtítulos), Esc (cerrar). `pnpm test:scenes [-- <id>]` captura frames de revisión en `tests/scene-frames/`. Kit de primitivas: `src/scenes/kit/` (vista previa en `?debug=kit`).

## Añadir una era

1. Crea `src/data/eras/NN-<id>.ts` con el tipo `HistoricalEra` (ver `src/domain/types.ts`).
2. Regístrala en `rawEras` de `src/data/index.ts`.
3. Actualiza `EXPECTED_ERA_COUNT` en `src/domain/schema.ts` (el MVP exige exactamente 20) y ejecuta `pnpm validate:data`.

Los componentes no conocen el contenido: la timeline, el globo y el panel se adaptan solos.

La memoria de trabajo del proyecto (arquitectura, decisiones, coreografía) está en `CLAUDE.md`.
