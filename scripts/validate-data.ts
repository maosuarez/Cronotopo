/**
 * Validates atlas content against the domain schema.
 *   pnpm validate:data                      → full atlas (src/data/index.ts)
 *   pnpm validate:data <era-file.ts> [...]  → only the given era files (era-level rules)
 * Exits with code 1 and a readable list of problems on failure.
 */
import path from "node:path";
import { pathToFileURL } from "node:url";
import { eraSchema, validateAtlas } from "../src/domain/schema";

function fail(title: string, errors: string[]): never {
  console.error(`\n✖ ${title}\n`);
  for (const e of errors) console.error(`  • ${e}`);
  console.error(`\n${errors.length} problema(s) encontrados.\n`);
  process.exit(1);
}

async function validateFiles(files: string[]) {
  const errors: string[] = [];
  for (const file of files) {
    const mod = (await import(pathToFileURL(path.resolve(file)).href)) as { default?: unknown };
    const result = eraSchema.safeParse(mod.default);
    if (!result.success) {
      for (const issue of result.error.issues) errors.push(`${file} › ${issue.path.join(".") || "(raíz)"}: ${issue.message}`);
    } else {
      console.log(`✔ ${file}: ${result.data.locations.length} ubicaciones, ${result.data.locations.reduce((n, l) => n + l.elements.length, 0)} elementos`);
    }
  }
  if (errors.length) fail("Archivos de era inválidos", errors);
}

async function validateAll() {
  const { rawEras } = await import("../src/data/index");
  const result = validateAtlas(rawEras);
  if (!result.ok) fail("Datos del atlas inválidos", result.errors);
  const { eras, locations, elements } = result.stats;
  console.log(`✔ Datos válidos: ${eras} eras, ${locations} ubicaciones, ${elements} elementos.`);
}

const files = process.argv.slice(2).filter((a) => a !== "--");
(files.length ? validateFiles(files) : validateAll()).catch((err: unknown) => {
  fail("No se pudieron cargar los datos", [err instanceof Error ? err.message : String(err)]);
});
