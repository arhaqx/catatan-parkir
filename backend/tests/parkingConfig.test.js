const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const PARKING_CONFIG = require('../constants/parkingConfig');

describe('Parking Operational Configuration', () => {
  test('memiliki nilai tarif dan batas kapasitas yang valid', () => {
    assert.equal(PARKING_CONFIG.RATE_PER_MOTORCYCLE, 3000);
    assert.equal(PARKING_CONFIG.STANDARD_CAPACITY, 90);
    assert.equal(PARKING_CONFIG.OVERLOAD_LIMIT, 110);
    assert.equal(PARKING_CONFIG.DEFAULT_OFFICER_NAME, 'Ucup');
    assert.equal(PARKING_CONFIG.DB_BUSY_TIMEOUT_MS, 5000);
  });

  test('memiliki konfigurasi pagination dan batas ukuran yang valid', () => {
    assert.equal(PARKING_CONFIG.DEFAULT_PAGE_SIZE, 20);
    assert.equal(PARKING_CONFIG.MAX_PAGE_SIZE, 100);
    assert.ok(PARKING_CONFIG.DEFAULT_PAGE_SIZE < PARKING_CONFIG.MAX_PAGE_SIZE);
    assert.equal(PARKING_CONFIG.API_VERSION, '1.4.0');
  });
});
