const LOG_LEVELS = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const fromEnv = process.env.AI_DEV_CLI_LOG_LEVEL?.toLowerCase();
const currentLevel = LOG_LEVELS[fromEnv] ?? LOG_LEVELS.info;

function shouldLog(level) {
  return LOG_LEVELS[level] >= currentLevel;
}

export const logger = {
  info(...args) {
    if (shouldLog("info")) {
      console.log('[INFO]', ...args);
    }
  },
  warn(...args) {
    if (shouldLog("warn")) {
      console.warn('[WARN]', ...args);
    }
  },
  error(...args) {
    if (shouldLog("error")) {
      console.error('[ERROR]', ...args);
    }
  },
  debug(...args) {
    if (shouldLog("debug")) {
      console.debug('[DEBUG]', ...args);
    }
  },
};