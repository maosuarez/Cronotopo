import { expect, test, type Page } from "@playwright/test";
import { placeholderBeats } from "../../src/scenes/placeholder/beats";
import { gotoAtlas, search } from "./helpers";

const ERA = "primeros-humanos";
const LOC = "primeros-humanos--blombos";
const SCENE = "primeros-humanos--blombos--technology";
const beatAtSix = placeholderBeats.find((b) => b.start <= 6 && 6 < b.end)!;

type SceneHandle = { seek: (t: number) => void; play: () => void; pause: () => void; time: number; ready: boolean };
const sceneTime = (page: Page) => page.evaluate(() => (window as unknown as { __scene: SceneHandle }).__scene.time);

async function waitSceneReady(page: Page) {
  await page.waitForFunction(() => (window as unknown as { __scene?: SceneHandle }).__scene?.ready === true, null, {
    timeout: 45_000,
  });
}

test("opens from the card, seeks, pauses and closes back to the panel", async ({ page }) => {
  await gotoAtlas(page, `?era=${ERA}&loc=${LOC}&debug=1`);
  const open = page.getByTestId("open-scene");
  await expect(open).toHaveCount(1);
  await expect(open).toHaveAttribute("data-element-id", SCENE);
  await open.click();

  const player = page.getByTestId("scene-player");
  await expect(player).toBeVisible();
  await expect(page.getByTestId("atlas-state")).toHaveAttribute("data-scene", SCENE);
  expect(search(page)).toBe(`?era=${ERA}&loc=${LOC}&scene=${SCENE}&debug=1`);
  await waitSceneReady(page);

  const caption = page.getByTestId("scene-caption");
  await expect(caption).toContainText(placeholderBeats[0].caption);
  await page.evaluate(() => (window as unknown as { __scene: SceneHandle }).__scene.seek(6));
  await expect(caption).toContainText(beatAtSix.caption);

  await page.evaluate(() => (window as unknown as { __scene: SceneHandle }).__scene.pause());
  const paused = await sceneTime(page);
  await page.waitForTimeout(600);
  expect(await sceneTime(page)).toBe(paused);

  await page.keyboard.press("Escape");
  await expect(player).toHaveCount(0);
  await expect(page.getByTestId("info-panel")).toBeVisible();
  await expect(page.getByTestId("atlas-state")).toHaveAttribute("data-scene", "");
  expect(search(page)).toBe(`?era=${ERA}&loc=${LOC}&debug=1`);
  await expect(open).toBeFocused();
  expect(await page.evaluate(() => "__scene" in window)).toBe(false);
});

test("deep link with scene opens the player directly", async ({ page }) => {
  await page.goto(`/?era=${ERA}&loc=${LOC}&scene=${SCENE}&debug=1`);
  await waitSceneReady(page);
  await expect(page.getByTestId("scene-player")).toBeVisible();
  await expect(page.getByTestId("scene-caption")).toBeVisible();
  expect(search(page)).toBe(`?era=${ERA}&loc=${LOC}&scene=${SCENE}&debug=1`);
});

test("back button closes the player and keeps the location", async ({ page }) => {
  await gotoAtlas(page, `?era=${ERA}&loc=${LOC}`);
  await page.getByTestId("open-scene").click();
  await expect(page.getByTestId("scene-player")).toBeVisible();
  expect(search(page)).toBe(`?era=${ERA}&loc=${LOC}&scene=${SCENE}`);
  await page.goBack();
  await expect(page.getByTestId("scene-player")).toHaveCount(0);
  await expect(page.getByTestId("info-panel")).toBeVisible();
  expect(search(page)).toBe(`?era=${ERA}&loc=${LOC}`);
  await page.goForward();
  await expect(page.getByTestId("scene-player")).toBeVisible();
});

test("Space toggles play/pause even with a control focused", async ({ page }) => {
  await gotoAtlas(page, `?era=${ERA}&loc=${LOC}&debug=1`);
  await page.getByTestId("open-scene").click();
  await waitSceneReady(page);
  await page.evaluate(() => {
    const scene = (window as unknown as { __scene: SceneHandle }).__scene;
    scene.pause();
    scene.seek(0);
  });
  await page.getByRole("button", { name: "Momento siguiente" }).focus();
  await page.keyboard.press("Space");
  await expect(page.getByTestId("scene-play")).toHaveAttribute("aria-label", "Pausar");
  await page.keyboard.press("Space");
  await expect(page.getByTestId("scene-play")).toHaveAttribute("aria-label", "Reproducir");
  const t = await sceneTime(page);
  // Space must not also activate the focused "next" button.
  expect(t).toBeLessThan(placeholderBeats[1].start);
});
