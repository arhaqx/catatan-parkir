/**
 * Structured Logger Helper
 * Memberikan format log konsisten dengan ISO timestamp dan level
 */

const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

/**
 * Format string log terstruktur
 * @param {string} level - Log level (INFO, WARN, ERROR, DEBUG)
 * @param {string} message - Pesan log
 * @param {object|null} metadata - Objek metadata opsional
 * @returns {string} String log berformat
 */
function formatLogMessage(level, message, metadata = null) {
  const timestamp = new Date().toISOString();
  const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : '';
  return `[${timestamp}] [${level}]: ${message}${metaStr}`;
}

const logger = {
  info(message, metadata) {
    console.log(formatLogMessage(LOG_LEVELS.INFO, message, metadata));
  },
  warn(message, metadata) {
    console.warn(formatLogMessage(LOG_LEVELS.WARN, message, metadata));
  },
  error(message, metadata) {
    console.error(formatLogMessage(LOG_LEVELS.ERROR, message, metadata));
  },
  debug(message, metadata) {
    if (process.env.DEBUG === 'true') {
      console.debug(formatLogMessage(LOG_LEVELS.DEBUG, message, metadata));
    }
  },
  formatLogMessage,
  LOG_LEVELS
};

module.exports = logger;
