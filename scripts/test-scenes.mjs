// `pnpm test:scenes [-- <scene-id> ...]` → Playwright scene capture, optionally filtered by scene id.
import { spawnSync } from "node:child_process";

const ids = process.argv.slice(2).filter((a) => a !== "--" && !a.startsWith("-"));
const extra = process.argv.slice(2).filter((a) => a.startsWith("-") && a !== "--");
const args = ["exec", "playwright", "test", "--config", "playwright.scenes.config.ts", ...extra];
if (ids.length) args.push("-g", ids.map((id) => `scene ${id}$`).join("|"));
const r = spawnSync("pnpm", args, { stdio: "inherit", env: { ...process.env, SCENE_IDS: ids.join(",") } });
process.exit(r.status ?? 1);
