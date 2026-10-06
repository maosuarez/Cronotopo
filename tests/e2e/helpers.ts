import { expect, type Page } from "@playwright/test";

/** Software WebGL is slow: generous scene-ready timeout. */
export async function gotoAtlas(page: Page, query = "") {
  await page.goto(`/${query}`);
  await page.waitForSelector('html[data-scene-ready="true"]', { timeout: 45_000 });
}

export async function waitIdle(page: Page, timeout = 15_000) {
  await expect(page.getByTestId("atlas-state")).toHaveAttribute("data-transitioning", "false", { timeout });
}

export const search = (page: Page) => new URL(page.url()).search;

/**
 * Console messages that are not app errors. Each pattern is documented.
 * - THREE.Clock deprecation: three.js warning (r18x), emitted by the R3F canvas; not our code.
 * - GPU stall / ReadPixels: Chromium emits these (as console.error-typed messages in some builds)
 *   under SwiftShader software rendering only.
 */
export const IGNORED_CONSOLE = [/THREE\.Clock/i, /GPU stall due to ReadPixels/i, /swiftshader/i];

export function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    if (IGNORED_CONSOLE.some((re) => re.test(text))) return;
    errors.push(`console: ${text}`);
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  return errors;
}
