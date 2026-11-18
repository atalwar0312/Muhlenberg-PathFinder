// Smoke tests ensure that repository cleanup does not break the served website.
const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../pathfinder/backend/app');

test('Express serves the canonical frontend and essential assets', async (t) => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    if (server.listening) return resolve();
    server.once('listening', resolve);
    server.once('error', reject);
  });

  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));

  const base = `http://127.0.0.1:${server.address().port}`;
  const paths = [
    '/',
    '/index.html',
    '/login.html',
    '/login.css',
    '/login.js',
    '/Main.js',
    '/courses.html',
    '/major.html',
    '/minor.html',
    '/opportunities.html',
    '/programs.html',
    '/course-catalog.csv',
    '/campus-background.jpg',
    '/pathfinder-logo-red.png',
    '/pathfinder-logo-white.png',
  ];

  for (const path of paths) {
    await t.test(`GET ${path}`, async () => {
      const response = await fetch(base + path);
      assert.equal(response.status, 200, `${path} should be served successfully`);
      const body = await response.arrayBuffer();
      assert.ok(body.byteLength > 0, `${path} should not be empty`);
    });
  }

  await t.test('GET /api/health', async () => {
    const response = await fetch(base + '/api/health');
    assert.equal(response.status, 200);
    const payload = await response.json();
    assert.equal(payload.status, 'ok');
  });

  await t.test('login and logout scripts remain wired', async () => {
    const login = await (await fetch(base + '/login.js')).text();
    const dashboard = await (await fetch(base + '/Main.js')).text();
    assert.match(login, /pathfinder-authenticated/);
    assert.match(login, /signed_out/);
    assert.match(dashboard, /sessionStorage\.removeItem\("pathfinder-authenticated"\)/);
    assert.match(dashboard, /login\.html\?signed_out=1/);
    assert.match(dashboard, /buildHalChatWidget/);
    assert.match(dashboard, /course-catalog\.csv/);
  });
});
