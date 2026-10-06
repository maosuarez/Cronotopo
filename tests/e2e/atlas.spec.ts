import { expect, test } from "@playwright/test";
import { eras } from "../../src/data/index";
import { collectErrors, gotoAtlas, search, waitIdle } from "./helpers";

const first = eras[0];
const second = eras[1];
const third = eras[2];
const roma = eras.find((e) => e.id === "roma")!;

const state = (page: import("@playwright/test").Page) => page.getByTestId("atlas-state");
const locationNames = async (page: import("@playwright/test").Page) =>
  (await page.getByTestId("location-list").locator("button span.font-serif").allTextContents()).map((s) => s.trim());

test("loads without console errors", async ({ page }) => {
  const errors = collectErrors(page);
  await gotoAtlas(page);
  await waitIdle(page);
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});

test("changing era updates location list and URL", async ({ page }) => {
  await gotoAtlas(page);
  await page.getByTestId("timeline").locator(`[data-era-id="${second.id}"]`).click();
  await expect(state(page)).toHaveAttribute("data-era", second.id);
  await waitIdle(page);
  await expect.poll(() => locationNames(page)).toEqual(second.locations.map((l) => l.name));
  expect(search(page)).toBe(`?era=${second.id}`);
});

test("selecting a location opens the panel with 5 cards", async ({ page }) => {
  await gotoAtlas(page);
  const loc = first.locations[1];
  await page.getByTestId("location-list").locator(`[data-location-id="${loc.id}"]`).click();
  const panel = page.getByTestId("info-panel");
  await expect(panel.getByRole("heading", { level: 2 })).toHaveText(loc.name);
  await expect(panel.getByTestId("element-card")).toHaveCount(5);
  expect(search(page)).toBe(`?era=${first.id}&loc=${loc.id}`);
});

test("deep link opens the panel for that location", async ({ page }) => {
  const loc = roma.locations[2];
  await gotoAtlas(page, `?era=${roma.id}&loc=${loc.id}`);
  await expect(page.getByTestId("info-panel").getByRole("heading", { level: 2 })).toHaveText(loc.name);
  await expect(state(page)).toHaveAttribute("data-era", roma.id);
});

test("Escape closes the panel and drops loc", async ({ page }) => {
  const loc = first.locations[0];
  await gotoAtlas(page, `?era=${first.id}&loc=${loc.id}`);
  await expect(page.getByTestId("info-panel")).toBeVisible();
  await waitIdle(page);
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("info-panel")).toHaveCount(0);
  await expect(state(page)).toHaveAttribute("data-loc", "");
  expect(search(page)).toBe(`?era=${first.id}`);
});

test("timeline keyboard: ArrowRight x2 + Enter, then End and Home", async ({ page }) => {
  await gotoAtlas(page);
  await page.getByTestId("timeline").focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(state(page)).toHaveAttribute("data-era", third.id);
  expect(search(page)).toBe(`?era=${third.id}`);
  // Old and new headers briefly coexist while cross-fading (and the director may not have flagged
  // the transition yet): wait for the new one, then until only it is left.
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1.filter({ hasText: third.name })).toHaveCount(1, { timeout: 20_000 });
  await expect(h1).toHaveCount(1, { timeout: 20_000 });
  await waitIdle(page);

  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(state(page)).toHaveAttribute("data-era", eras[eras.length - 1].id);
  await waitIdle(page);
  await page.keyboard.press("Home");
  await page.keyboard.press("Enter");
  await expect(state(page)).toHaveAttribute("data-era", first.id);
});

test.describe("invalid URLs", () => {
  test("unknown era and loc fall back to era 1", async ({ page }) => {
    await gotoAtlas(page, "?era=nope");
    await expect(state(page)).toHaveAttribute("data-era", first.id);
    await expect(state(page)).toHaveAttribute("data-loc", "");
    expect(search(page)).toBe(`?era=${first.id}`);
  });

  test("valid era with bogus loc keeps the era, no selection", async ({ page }) => {
    await gotoAtlas(page, `?era=${roma.id}&loc=bogus`);
    await expect(state(page)).toHaveAttribute("data-era", roma.id);
    await expect(state(page)).toHaveAttribute("data-loc", "");
    await expect(page.getByTestId("info-panel")).toHaveCount(0);
    expect(search(page)).toBe(`?era=${roma.id}`);
  });

  test("loc only (unknown) falls back to era 1", async ({ page }) => {
    await gotoAtlas(page, "?loc=zzz");
    await expect(state(page)).toHaveAttribute("data-era", first.id);
    await expect(state(page)).toHaveAttribute("data-loc", "");
    expect(search(page)).toBe(`?era=${first.id}`);
  });
});

test("back/forward walks era -> location -> era 1", async ({ page }) => {
  await gotoAtlas(page);
  await page.getByTestId("timeline").locator(`[data-era-id="${second.id}"]`).click();
  await expect(state(page)).toHaveAttribute("data-era", second.id);
  await waitIdle(page);
  const loc = second.locations[0];
  await page.getByTestId("location-list").locator(`[data-location-id="${loc.id}"]`).click();
  await expect(page.getByTestId("info-panel")).toBeVisible();
  await waitIdle(page);

  await page.goBack();
  await expect(page.getByTestId("info-panel")).toHaveCount(0);
  await expect(state(page)).toHaveAttribute("data-era", second.id);
  await expect(state(page)).toHaveAttribute("data-loc", "");
  await waitIdle(page);

  await page.goBack();
  await expect(state(page)).toHaveAttribute("data-era", first.id);
  await waitIdle(page);

  await page.goForward();
  await expect(state(page)).toHaveAttribute("data-era", second.id);
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("location opens as bottom sheet without horizontal scroll", async ({ page }) => {
    await gotoAtlas(page);
    const loc = first.locations[0];
    await page.getByTestId("location-list").locator(`[data-location-id="${loc.id}"]`).click();
    const panel = page.getByTestId("info-panel");
    await expect(panel).toBeVisible();
    await waitIdle(page);
    const box = (await panel.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(388);
    expect(Math.round(box.y + box.height)).toBeGreaterThanOrEqual(843);
    expect(box.y).toBeGreaterThan(844 * 0.3);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(overflow).toBe(true);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("selecting a location settles quickly", async ({ page }) => {
    await gotoAtlas(page);
    await waitIdle(page);
    const loc = first.locations[0];
    await page.getByTestId("location-list").locator(`[data-location-id="${loc.id}"]`).click();
    const t0 = Date.now();
    await expect(state(page)).toHaveAttribute("data-loc", loc.id);
    await waitIdle(page, 3_000);
    expect(Date.now() - t0).toBeLessThan(1_200);
    await expect(page.getByTestId("info-panel")).toBeVisible();
  });
});
