import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp } from '../src/app.js';

async function withServer(client, run) {
  const server = createApp(client).listen(0, '127.0.0.1');
  await once(server, 'listening');
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise(resolve => server.close(resolve)); }
}
function fakeClient(result, calls = []) {
  const builder = {};
  for (const method of ['from', 'select', 'order', 'limit', 'ilike']) {
    builder[method] = (...args) => { calls.push([method, ...args]); return builder; };
  }
  builder.then = (resolve, reject) => Promise.resolve(result).then(resolve, reject);
  return builder;
}
test('course list returns Supabase fields and forwards name search', async () => {
  const calls = [];
  const rows = [{ id: 1, prefix: 'CSI', number: '101', name: 'Example' }];
  await withServer(fakeClient({ data: rows, error: null }, calls), async base => {
    const response = await fetch(`${base}/api/courses?q=data`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { data_source: 'supabase', data: rows });
    assert.ok(calls.some(c => c[0] === 'from' && c[1] === 'courses'));
    assert.ok(calls.some(c => c[0] === 'limit' && c[1] === 100));
    assert.ok(calls.some(c => c[0] === 'ilike' && c[1] === 'name' && c[2] === '%data%'));
  });
});
test('invalid searches return 400 without querying the database', async () => {
  const calls = [];
  await withServer(fakeClient({ data: [] }, calls), async base => {
    for (const q of ['q=a&q=b', `q=${'a'.repeat(201)}`]) {
      assert.equal((await fetch(`${base}/api/courses?${q}`)).status, 400);
    }
    assert.equal(calls.length, 0);
  });
});
test('upstream failure returns generic 502', async () => {
  await withServer(fakeClient({ error: { message: 'test failure' } }), async base => {
    const response = await fetch(`${base}/api/courses`);
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { error: 'Unable to retrieve courses from the database' });
  });
});
test('empty course table succeeds', async () => {
  await withServer(fakeClient({ data: [], error: null }), async base => {
    assert.deepEqual(await (await fetch(`${base}/api/courses`)).json(), { data_source: 'supabase', data: [] });
  });
});
test('student and single-course endpoints remain explicitly sample data', async () => {
  await withServer(null, async base => {
    for (const path of ['/api/students/0000000000', '/api/courses/DEMO-101']) {
      assert.equal((await (await fetch(`${base}${path}`)).json()).data_source, 'sample');
    }
    assert.equal((await fetch(`${base}/api/students/missing`)).status, 404);
    assert.equal((await fetch(`${base}/api/courses/missing`)).status, 404);
  });
});
test('health does not claim a successful database connection; private paths unavailable', async () => {
  await withServer(null, async base => {
    assert.equal((await (await fetch(`${base}/api/health`)).json()).database_status, 'not_checked');
    for (const path of ['/.env', '/src/supabase.js', '/package.json', '/api/unknown']) {
      assert.equal((await fetch(`${base}${path}`)).status, 404);
    }
  });
});
