import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { test, type Page } from "@playwright/test";
import { getSceneLocation, scenes } from "../../src/scenes/registry";
import { midpoint } from "../../src/scenes/beats";

/**
 * Frame capture for scene polish (not assertions):
 *  tests/scene-frames/<scene>/mid-<NN>-<beatId>.jpg  — beat midpoints (compare against caption + visual)
 *  tests/scene-frames/<scene>/tr-<NN>-<k>.jpg        — every ~150 ms across each beat boundary (±0.6 s)
 *  tests/scene-frames/<scene>/index.json             — time, beat id, caption and visual of every frame
 * The player is paused and seeked (scenes are deterministic), so software rendering speed doesn't matter.
 */
type Handle = { seek: (t: number) => void; pause: () => void; ready: boolean; duration: number };
const root = path.resolve(__dirname, "..", "scene-frames");
const STEP = 0.15;
const SPAN = 0.6;

async function settle(page: Page) {
  await page.evaluate(() => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))));
  await page.waitForTimeout(120);
}

async function shot(page: Page, file: string) {
  const cdp = await page.context().newCDPSession(page);
  const { data } = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 80 });
  writeFileSync(file, Buffer.from(data, "base64"));
  await cdp.detach();
}

for (const scene of scenes.filter((s) => s.id !== "placeholder")) {
  test(`scene ${scene.id}`, async ({ page }) => {
    const found = getSceneLocation(scene.elementId);
    if (!found) throw new Error(`scene ${scene.id}: element ${scene.elementId} not found`);
    const dir = path.join(root, scene.id);
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    await page.goto(`/?era=${found.era.id}&loc=${found.location.id}&scene=${scene.elementId}&debug=1`);
    await page.waitForFunction(() => (window as unknown as { __scene?: Handle }).__scene?.ready === true, null, { timeout: 180_000 });
    await page.evaluate(() => (window as unknown as { __scene: Handle }).__scene.pause());
    const seek = async (t: number) => {
      await page.evaluate((x) => (window as unknown as { __scene: Handle }).__scene.seek(x), t);
      await settle(page);
    };
    const index: { file: string; time: number; beat: string; caption: string; visual: string }[] = [];
    const beatOf = (t: number) => scene.beats.find((b) => t >= b.start && t < b.end) ?? scene.beats[scene.beats.length - 1];
    const capture = async (file: string, t: number) => {
      await seek(t);
      await shot(page, path.join(dir, file));
      const b = beatOf(t);
      index.push({ file, time: Number(t.toFixed(2)), beat: b.id, caption: b.caption, visual: b.visual });
    };
    for (const [i, b] of scene.beats.entries()) await capture(`mid-${String(i).padStart(2, "0")}-${b.id}.jpg`, midpoint(b));
    for (const [i, b] of scene.beats.slice(1).entries()) {
      let k = 0;
      for (let t = b.start - SPAN; t <= b.start + SPAN + 1e-6; t += STEP) await capture(`tr-${String(i + 1).padStart(2, "0")}-${k++}.jpg`, t);
    }
    writeFileSync(path.join(dir, "index.json"), JSON.stringify(index, null, 2));
  });
}
