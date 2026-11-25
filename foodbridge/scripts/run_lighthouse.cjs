const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const REPORT_PATH = path.resolve(__dirname, '..', 'docs', 'lighthouse_report.json');

function checkServer(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(port, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const ok = await checkServer(port);
    if (ok) return true;
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

async function main() {
  console.log('[Lighthouse] Building web-portal for production...');
  execSync('npm --prefix web-portal run build', { stdio: 'inherit' });

  console.log('[Lighthouse] Starting Vite preview server on port 4173...');
  const preview = spawn('npx', ['vite', 'preview', '--port', '4173', '--host', '127.0.0.1'], {
    cwd: path.resolve(__dirname, '..', 'web-portal'),
    shell: true,
  });

  try {
    const ready = await waitForServer(4173);
    if (!ready) {
      throw new Error('Vite preview server failed to respond on port 4173 in time.');
    }
    console.log('[Lighthouse] Preview server is up on http://127.0.0.1:4173');

    console.log('[Lighthouse] Running Lighthouse audit on production build...');
    const cmd = `npx lighthouse http://127.0.0.1:4173 --output=json --output-path="${REPORT_PATH}" --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage" --only-categories=performance,accessibility,best-practices,seo`;
    execSync(cmd, { stdio: 'inherit' });

    console.log(`[Lighthouse] Report written to ${REPORT_PATH}`);
    if (fs.existsSync(REPORT_PATH)) {
      const data = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
      const categories = data.categories || {};
      const scores = {
        performance: Math.round((categories.performance?.score || 0) * 100),
        accessibility: Math.round((categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
        seo: Math.round((categories.seo?.score || 0) * 100),
      };

      console.log('--------------------------------------------');
      console.log('LIGHTHOUSE AUDIT RESULTS (Mobile Emulation):');
      console.log(`  Performance:    ${scores.performance}/100`);
      console.log(`  Accessibility:  ${scores.accessibility}/100`);
      console.log(`  Best Practices: ${scores.bestPractices}/100`);
      console.log(`  SEO:            ${scores.seo}/100`);
      console.log('--------------------------------------------');
    }
  } finally {
    console.log('[Lighthouse] Stopping preview server...');
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /pid ${preview.pid} /T /F`, { stdio: 'ignore' });
      } else {
        preview.kill();
      }
    } catch (_e) {}
  }
}

main().catch((err) => {
  console.error('[Lighthouse] Error:', err);
  process.exit(1);
});
