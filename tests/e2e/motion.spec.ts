import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { test, type Browser, type CDPSession, type Page } from "@playwright/test";
import { eras } from "../../src/data/index";

/**
 * Motion capture, not assertions. Per moment: a fresh context records video to tests/motion-videos/<name>
 * and a JPEG frame sequence (q70, 720x450 via CDP Page.startScreencast) is written to tests/motion-frames/<name>.
 * page.screenshot() takes 3+ s per frame under SwiftShader (stalls the animation), so frames come from the
 * compositor screencast instead (one frame per visual update, ~real time);
 * the real timestamp of each frame (ms since trigger) goes to timings.json.
 */
const VIEWPORT = { width: 1440, height: 900 };
const FRAME = { width: 720, height: 450 };
const TAIL_MS = 400;
const root = path.resolve(__dirname, "..");

/** `mark()` sets t=0 (call right before the trigger); frames captured earlier get negative ms (pre-roll). */
type Capture = { mark: () => void; stop: () => Promise<void> };

async function startFrames(page: Page, name: string): Promise<Capture> {
  let t0 = 0; // set by mark(); stays 0 until then
  let marked = false;
  const abs: number[] = [];
  const dir = path.join(root, "motion-frames", name);
  const timings: { file: string; ms: number }[] = [];
  const writes: Promise<void>[] = [];
  let session: CDPSession | undefined;
  await (async () => {
    session = await page.context().newCDPSession(page);
    session.on("Page.screencastFrame", (f) => {
      abs.push(Date.now());
      const file = `frame-${String(timings.length).padStart(3, "0")}.jpg`;
      timings.push({ file, ms: 0 });
      writes.push(writeFile(path.join(dir, file), Buffer.from(f.data, "base64")));
      session!.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
    });
    const first = new Promise<void>((r) => session!.once("Page.screencastFrame", () => r()));
    await session.send("Page.startScreencast", { format: "jpeg", quality: 70, maxWidth: FRAME.width, maxHeight: FRAME.height, everyNthFrame: 1 });
    // Screencast start-up is slow under SwiftShader: wait for the first frame so t=0 is not skewed.
    await Promise.race([first, new Promise((r) => setTimeout(r, 5_000))]);
  })();
  return {
    mark: () => {
      t0 = Date.now();
      marked = true;
    },
    stop: async () => {
      await session!.send("Page.stopScreencast").catch(() => {});
      await Promise.all(writes);
      await session!.detach().catch(() => {});
      if (!marked) t0 = abs[0] ?? 0;
      timings.forEach((t, i) => (t.ms = abs[i] - t0));
      writeFileSync(path.join(dir, "timings.json"), JSON.stringify(timings, null, 2));
      const post = timings.filter((t) => t.ms >= 0);
      const gaps = post.slice(1).map((t, i) => t.ms - post[i].ms);
      const avg = gaps.length ? Math.round(gaps.reduce((x, y) => x + y, 0) / gaps.length) : 0;
      console.log(`[motion] ${name}: ${timings.length} frames (${post.length} from trigger), avg interval ${avg} ms`);
    },
  };
}

async function newContext(browser: Browser, name: string, reduced: boolean) {
  const dir = path.join(root, "motion-frames", name);
  const videoDir = path.join(root, "motion-videos", name);
  for (const d of [dir, videoDir]) {
    rmSync(d, { recursive: true, force: true });
    mkdirSync(d, { recursive: true });
  }
  return browser.newContext({
    viewport: VIEWPORT,
    reducedMotion: reduced ? "reduce" : "no-preference",
    recordVideo: { dir: videoDir, size: VIEWPORT },
  });
}

const idle = (page: Page) =>
  page.waitForSelector('[data-testid="atlas-state"][data-transitioning="false"]', { state: "attached", timeout: 30_000 });

async function ready(page: Page, query = "") {
  await page.goto(`/${query}`);
  await page.waitForSelector('html[data-scene-ready="true"]', { timeout: 60_000 });
  await idle(page);
  // let the intro and chrome settle before the moment under test
  await page.waitForTimeout(4_500);
}

async function transitionDone(page: Page) {
  // Wait for the store to flag the transition (it may already be running), then for it to finish.
  await page.waitForSelector('[data-testid="atlas-state"][data-transitioning="true"]', { state: "attached", timeout: 3_000 }).catch(() => {});
  await idle(page);
  await page.waitForTimeout(TAIL_MS);
}

const era7 = eras[6];
const firstLoc = eras[0].locations[0];

test.describe.configure({ mode: "serial" });

test("intro", async ({ browser }) => {
  const ctx = await newContext(browser, "intro", false);
  const page = await ctx.newPage();
  const cap = await startFrames(page, "intro");
  cap.mark();
  await page.goto("/");
  await page.waitForSelector('html[data-scene-ready="true"]', { timeout: 60_000 });
  await page.waitForTimeout(4_000);
  await cap.stop();
  await ctx.close();
});

for (const reduced of [false, true]) {
  const suffix = reduced ? "-reduced" : "";

  test(`era-change${suffix}`, async ({ browser }) => {
    const name = `era-change${suffix}`;
    const ctx = await newContext(browser, name, reduced);
    const page = await ctx.newPage();
    await ready(page);
    const option = page.getByTestId("timeline").locator(`[data-era-id="${era7.id}"]`);
    const cap = await startFrames(page, name);
    cap.mark();
    await option.click();
    await transitionDone(page);
    await cap.stop();
    await ctx.close();
  });

  test(`select${suffix}`, async ({ browser }) => {
    const name = `select${suffix}`;
    const ctx = await newContext(browser, name, reduced);
    const page = await ctx.newPage();
    await ready(page);
    const row = page.getByTestId("location-list").locator(`[data-location-id="${firstLoc.id}"]`);
    const cap = await startFrames(page, name);
    cap.mark();
    await row.click();
    await transitionDone(page);
    await page.waitForTimeout(1_000); // panel + cards finish after the camera
    await cap.stop();
    await ctx.close();
  });
}

test("close", async ({ browser }) => {
  const ctx = await newContext(browser, "close", false);
  const page = await ctx.newPage();
  await ready(page, `?era=${eras[0].id}&loc=${firstLoc.id}`);
  const cap = await startFrames(page, "close");
  cap.mark();
  await page.keyboard.press("Escape");
  await transitionDone(page);
  await cap.stop();
  await ctx.close();
});
