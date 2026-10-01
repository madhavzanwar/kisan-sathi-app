const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../frontend/node_modules/playwright-core'));

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TRACE_OUTPUT = path.resolve(__dirname, '../docs/scroll-trace.json');

async function recordScrollTrace() {
  console.log('[PERF TRACE] Launching Chrome for scripted scroll tracing...');

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--enable-gpu-benchmarking', '--disable-background-timer-throttling']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  const client = await context.newCDPSession(page);

  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  console.log('[PERF TRACE] Starting Chrome CDP Tracing...');
  await client.send('Tracing.start', {
    categories: '-* ,devtools.timeline,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.frame,toplevel,blink.console',
    options: 'sampling-frequency=10000',
  });

  // Scripted smooth scroll from top to bottom
  console.log('[PERF TRACE] Performing scripted scroll from top to bottom...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      const distance = 100;
      const delay = 30; // ~33fps step for smooth scrolling over ~3 seconds
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      let current = 0;

      const timer = setInterval(() => {
        current += distance;
        window.scrollTo({ top: current, behavior: 'instant' });
        if (current >= maxScroll) {
          clearInterval(timer);
          resolve();
        }
      }, delay);
    });
  });

  await page.waitForTimeout(500);

  // Scripted smooth scroll back up
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      const distance = 150;
      const delay = 25;
      let current = window.scrollY;

      const timer = setInterval(() => {
        current -= distance;
        window.scrollTo({ top: current, behavior: 'instant' });
        if (current <= 0) {
          clearInterval(timer);
          resolve();
        }
      }, delay);
    });
  });

  await page.waitForTimeout(500);

  console.log('[PERF TRACE] Stopping Tracing and collecting events...');
  const traceEvents = [];

  client.on('Tracing.dataCollected', (event) => {
    traceEvents.push(...event.value);
  });

  await new Promise((resolve) => {
    client.on('Tracing.tracingComplete', resolve);
    client.send('Tracing.end');
  });

  await browser.close();

  console.log(`[PERF TRACE] Collected ${traceEvents.length} trace events.`);
  fs.writeFileSync(TRACE_OUTPUT, JSON.stringify(traceEvents, null, 2));

  // Analyze Chrome Trace Events
  // 1. Long Tasks (> 50ms)
  const longTasks = traceEvents.filter(
    (e) => (e.name === 'RunTask' || e.name === 'Task') && e.dur && e.dur > 50000 // duration in microseconds
  );

  // 2. BeginFrame / DrawFrame timestamps to calculate frame durations
  const frameEvents = traceEvents
    .filter((e) => e.name === 'DrawFrame' || e.name === 'BeginFrame' || e.name === 'GenerateRenderPass')
    .sort((a, b) => a.ts - b.ts);

  const frameDurationsMs = [];
  for (let i = 1; i < frameEvents.length; i++) {
    const diffMs = (frameEvents[i].ts - frameEvents[i - 1].ts) / 1000;
    if (diffMs > 0 && diffMs < 500) {
      frameDurationsMs.push(diffMs);
    }
  }

  const totalFrames = frameDurationsMs.length || 1;
  const framesOver16_7ms = frameDurationsMs.filter((d) => d > 16.7).length;
  const framesOver50ms = frameDurationsMs.filter((d) => d > 50.0).length;
  const droppedFrames = traceEvents.filter((e) => e.name === 'DroppedFrame').length;

  const avgDuration = frameDurationsMs.reduce((a, b) => a + b, 0) / (totalFrames || 1);

  console.log('\n===========================================================');
  console.log('REAL SCROLL PERFORMANCE TRACE RESULTS');
  console.log('===========================================================');
  console.log(`Total Frames Sampled:       ${totalFrames}`);
  console.log(`Average Frame Duration:     ${avgDuration.toFixed(2)} ms (~${(1000 / avgDuration).toFixed(0)} FPS)`);
  console.log(`Frames > 16.7 ms (60fps):   ${framesOver16_7ms} (${((framesOver16_7ms / totalFrames) * 100).toFixed(1)}%)`);
  console.log(`Frames > 50.0 ms (severe):  ${framesOver50ms} (${((framesOver50ms / totalFrames) * 100).toFixed(1)}%)`);
  console.log(`Long Tasks (> 50ms):        ${longTasks.length}`);
  console.log(`Dropped Frames:             ${droppedFrames}`);
  console.log('===========================================================\n');

  const report = {
    totalFrames,
    avgDurationMs: Number(avgDuration.toFixed(2)),
    framesOver16_7ms,
    framesOver50ms,
    longTasksCount: longTasks.length,
    droppedFrames,
  };

  fs.writeFileSync('scripts/scroll-report.json', JSON.stringify(report, null, 2));
  return report;
}

recordScrollTrace().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
