const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const logger = require('../utils/logger');

describe('Structured Logger Utility', () => {
  test('memiliki definisi level log yang lengkap', () => {
    assert.equal(logger.LOG_LEVELS.INFO, 'INFO');
    assert.equal(logger.LOG_LEVELS.WARN, 'WARN');
    assert.equal(logger.LOG_LEVELS.ERROR, 'ERROR');
    assert.equal(logger.LOG_LEVELS.DEBUG, 'DEBUG');
  });

  test('memformat pesan log tanpa metadata dengan benar', () => {
    const formatted = logger.formatLogMessage('INFO', 'Server started successfully');
    assert.match(formatted, /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\]: Server started successfully$/);
  });

  test('memformat pesan log dengan metadata JSON', () => {
    const formatted = logger.formatLogMessage('WARN', 'High capacity reached', { count: 88, limit: 90 });
    assert.match(formatted, /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[WARN\]: High capacity reached {"count":88,"limit":90}$/);
  });

  test('metode info, warn, error dapat dipanggil tanpa melempar error', () => {
    assert.doesNotThrow(() => {
      logger.info('Test info logging');
      logger.warn('Test warn logging');
      logger.error('Test error logging');
      logger.debug('Test debug logging');
    });
  });
});
