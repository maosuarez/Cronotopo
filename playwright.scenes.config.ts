import { defineConfig, devices } from "@playwright/test";

/** Parallel agents use their own port (SCENES_PORT) so servers never cross. */
const PORT = Number(process.env.SCENES_PORT ?? 4173);

/** Scene frame capture (`pnpm test:scenes [-- <scene-id>]`). Requires `pnpm build`. Not part of test:e2e. */
export default defineConfig({
  testDir: "tests/e2e",
  testMatch: "scenes.spec.ts",
  timeout: 900_000,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 720 } } }],
  webServer: {
    command: `pnpm exec serve out -l ${PORT} --no-clipboard`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
