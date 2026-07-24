import { chromium } from 'playwright';

const BASE = 'http://localhost:8085/manus/';
const OUT = 'C:/Users/manus/AppData/Local/Temp/claude/c--Users-manus-manushri-portfolio-sample2/839f3c1a-649d-4768-993a-e024d77910fc/scratchpad';

const browser = await chromium.launch();

async function openGame(page) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  // Wait for terminal input to be ready
  await page.waitForSelector('input, textarea', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);
  // Try clicking the terminal area first to focus it
  const termInput = page.locator('input[type="text"], textarea').first();
  await termInput.click({ timeout: 10000 }).catch(() => {});
  await termInput.fill('play').catch(async () => {
    await page.keyboard.type('play');
  });
  await page.keyboard.press('Enter');
  await page.waitForSelector('text=Snake.exe', { timeout: 15000 });
  await page.waitForTimeout(800);
}

// --- Desktop: test resizing the draggable window itself ---
{
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await context.newPage();
  await openGame(page);

  await page.screenshot({ path: `${OUT}/desktop_initial.png` });

  // Find the resize handle (bottom-right corner of the game window)
  const resizeHandle = page.locator('.cursor-nwse-resize').last();
  const box = await resizeHandle.boundingBox();
  if (box) {
    // Drag to make it short and wide
    await page.mouse.move(box.x + 2, box.y + 2);
    await page.mouse.down();
    await page.mouse.move(box.x + 300, box.y - 150, { steps: 15 });
    await page.mouse.up();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/desktop_short_wide.png` });
  }

  const resizeHandle2 = page.locator('.cursor-nwse-resize').last();
  const box2 = await resizeHandle2.boundingBox();
  if (box2) {
    // Drag to make it tall and narrow
    await page.mouse.move(box2.x + 2, box2.y + 2);
    await page.mouse.down();
    await page.mouse.move(box2.x - 250, box2.y + 250, { steps: 15 });
    await page.mouse.up();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/desktop_tall_narrow.png` });
  }

  await context.close();
}

// --- Phone viewport ---
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await openGame(page);
  await page.screenshot({ path: `${OUT}/phone_portrait.png` });
  await context.close();
}

// --- Tablet (iPad) portrait ---
{
  const context = await browser.newContext({ viewport: { width: 834, height: 1194 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await openGame(page);
  await page.screenshot({ path: `${OUT}/tablet_portrait.png` });
  await context.close();
}

// --- Tablet (iPad) landscape ---
{
  const context = await browser.newContext({ viewport: { width: 1194, height: 834 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await openGame(page);
  await page.screenshot({ path: `${OUT}/tablet_landscape.png` });
  await context.close();
}

await browser.close();
console.log('done');
