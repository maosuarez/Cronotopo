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
| `pnpm validate:data` | Valida el contenido con zod (`pnpm validate:data <archivo-era.ts>` valida una sola era) |

## Añadir una era

1. Crea `src/data/eras/NN-<id>.ts` con el tipo `HistoricalEra` (ver `src/domain/types.ts`).
2. Regístrala en `rawEras` de `src/data/index.ts`.
3. Actualiza `EXPECTED_ERA_COUNT` en `src/domain/schema.ts` (el MVP exige exactamente 20) y ejecuta `pnpm validate:data`.

Los componentes no conocen el contenido: la timeline, el globo y el panel se adaptan solos.

La memoria de trabajo del proyecto (arquitectura, decisiones, coreografía) está en `CLAUDE.md`.
