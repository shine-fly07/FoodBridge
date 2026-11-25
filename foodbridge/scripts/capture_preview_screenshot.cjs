const path = require('path');
const fs = require('fs');
const puppeteer = require('../web-portal/node_modules/puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://127.0.0.1:5174/preview';
const SCREENSHOTS_DIR = path.resolve(__dirname, '..', 'docs', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function run() {
  console.log('Capturing redesign preview screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1280,800'],
  });

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(15000);

    // 1. Desktop 1280x800 (Glossy 3D)
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    const shot1 = path.join(SCREENSHOTS_DIR, 'preview_hero_shapes.png');
    await page.screenshot({ path: shot1, fullPage: false });
    console.log(`[OK] Saved: ${shot1}`);

    // Full page desktop
    const shotFull = path.join(SCREENSHOTS_DIR, 'preview_full_page.png');
    await page.screenshot({ path: shotFull, fullPage: true });
    console.log(`[OK] Saved full page: ${shotFull}`);

    // 2. Toggle Flat-Gloss button
    const flatBtn = await page.$('button::-p-text(Flat-Gloss)');
    if (flatBtn) {
      await flatBtn.click();
      await new Promise(r => setTimeout(r, 600));
      const shot2 = path.join(SCREENSHOTS_DIR, 'preview_flat_gloss.png');
      await page.screenshot({ path: shot2, fullPage: false });
      console.log(`[OK] Saved flat gloss comparison: ${shot2}`);
    }

    // 3. Mobile 375x812
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    const shot3 = path.join(SCREENSHOTS_DIR, 'preview_mobile_hero.png');
    await page.screenshot({ path: shot3, fullPage: false });
    console.log(`[OK] Saved mobile: ${shot3}`);

  } catch (err) {
    console.error('Error taking screenshots:', err);
  } finally {
    await browser.close();
  }
}

run();
