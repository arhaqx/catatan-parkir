const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../server');

describe('Server Root & Health Check Endpoint', () => {
  let server;
  let baseUrl;

  test('setup test server on dynamic port', (t, done) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      done();
    });
  });

  test('GET / mengembalikan status online dan metadata server', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.status, 'online');
    assert.equal(typeof body.message, 'string');
    assert.equal(body.version, '1.0.0');
    assert.equal(typeof body.uptime_seconds, 'number');
    assert.ok(body.timestamp);
    assert.ok(body.cloudinary === 'configured' || body.cloudinary === 'not_configured');
  });

  test('teardown server', (t, done) => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });
});
