const COLORS = {
  reset: '\x1b[0m',
  info: '\x1b[36m',    // Cyan
  warn: '\x1b[33m',    // Yellow
  error: '\x1b[31m',   // Red
  security: '\x1b[35m' // Magenta
};

const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
};

export const logger = {
  info: (msg) => {
    console.log(`${COLORS.info}${formatMessage('info', msg)}${COLORS.reset}`);
  },
  
  warn: (msg) => {
    console.warn(`${COLORS.warn}${formatMessage('warn', msg)}${COLORS.reset}`);
  },
  
  error: (msg, errorStack = '') => {
    console.error(`${COLORS.error}${formatMessage('error', msg)}${COLORS.reset}`);
    if (errorStack) console.error(errorStack);
  },
  
  security: (msg, context = {}) => {
    console.warn(`${COLORS.security}${formatMessage('security🚨', msg)}${COLORS.reset}`);
    if (Object.keys(context).length > 0) {
      console.warn(COLORS.security + JSON.stringify(context, null, 2) + COLORS.reset);
    }
  }
};