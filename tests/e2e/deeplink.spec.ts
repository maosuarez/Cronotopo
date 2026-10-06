import { expect, test } from "@playwright/test";

const ERA = "primeros-humanos";
const BLOMBOS = "primeros-humanos--blombos";

test("deep link selects the location and keeps the URL", async ({ page }) => {
  await page.goto(`/?era=${ERA}&loc=${BLOMBOS}`);
  await page.waitForSelector('html[data-scene-ready="true"]');
  const state = page.getByTestId("atlas-state");
  await expect(state).toHaveAttribute("data-era", ERA);
  await expect(state).toHaveAttribute("data-loc", BLOMBOS);
  await expect(state).toHaveAttribute("data-transitioning", "false");
  expect(new URL(page.url()).search).toBe(`?era=${ERA}&loc=${BLOMBOS}`);
});

test("invalid URL normalises to the first era", async ({ page }) => {
  await page.goto("/?era=nope&loc=zzz");
  await page.waitForSelector('html[data-scene-ready="true"]');
  const state = page.getByTestId("atlas-state");
  await expect(state).toHaveAttribute("data-era", ERA);
  await expect(state).toHaveAttribute("data-loc", "");
  expect(new URL(page.url()).search).toBe(`?era=${ERA}`);
});
