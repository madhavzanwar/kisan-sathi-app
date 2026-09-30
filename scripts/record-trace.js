import http from 'node:http';
import fs from 'node:fs';

async function getDebuggerUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/version', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.webSocketDebuggerUrl);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function createTarget() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/new?http://localhost:4173/', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.webSocketDebuggerUrl);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Connecting to Chrome CDP...');
  const targetWsUrl = await createTarget();
  console.log('Target WS:', targetWsUrl);

  const ws = new WebSocket(targetWsUrl);

  let id = 1;
  const callbacks = new Map();
  const traceEvents = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Tracing.dataCollected') {
      traceEvents.push(...msg.params.value);
    }
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg);
      callbacks.delete(msg.id);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve) => {
      const msgId = id++;
      callbacks.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  };

  await new Promise((resolve) => ws.onopen = resolve);

  console.log('Enabling Page & Performance tracing...');
  await send('Page.enable');
  await send('Tracing.start', {
    traceConfig: {
      includedCategories: [
        'devtools.timeline',
        'v8.execute',
        'disabled-by-default-devtools.timeline',
        'disabled-by-default-devtools.timeline.frame'
      ]
    }
  });

  console.log('Navigating to landing page...');
  await send('Page.navigate', { url: 'http://localhost:4173/' });
  await new Promise(r => setTimeout(r, 2000));

  console.log('Scrolling down through all landing sections...');
  for (let step = 0; step < 10; step++) {
    await send('Runtime.evaluate', {
      expression: `window.scrollBy(0, window.innerHeight * 0.8);`
    });
    await new Promise(r => setTimeout(r, 300));
  }

  await new Promise(r => setTimeout(r, 1000));

  console.log('Stopping trace...');
  await send('Tracing.end');

  // Wait for tracingComplete
  await new Promise(r => setTimeout(r, 2000));

  fs.mkdirSync('docs/traces', { recursive: true });
  fs.writeFileSync('docs/traces/landing-scroll-trace.json', JSON.stringify({ traceEvents }, null, 2));
  console.log(`Trace saved to docs/traces/landing-scroll-trace.json (${traceEvents.length} events recorded)`);

  // Analyze events
  let longTasks = 0;
  let layoutCount = 0;
  let paintCount = 0;

  for (const ev of traceEvents) {
    if (ev.name === 'RunTask' && ev.dur > 50000) { // > 50ms
      longTasks++;
    }
    if (ev.name === 'Layout') layoutCount++;
    if (ev.name === 'Paint') paintCount++;
  }

  console.log('Trace Summary:', {
    totalEvents: traceEvents.length,
    longTasksOver50ms: longTasks,
    layouts: layoutCount,
    paints: paintCount
  });

  ws.close();
}

run().catch(console.error);
