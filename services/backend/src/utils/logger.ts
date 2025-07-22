const pino = console; // Using console for simplicity in Codespaces. Replace with Pino/Winston for prod.

export const logger = {
  info: (message: string, context?: object) => {
    pino.log(`[INFO] ${message}`, context || '');
  },
  warn: (message: string, context?: object) => {
    pino.warn(`[WARN] ${message}`, context || '');
  },
  error: (message: string, error?: any, context?: object) => {
    pino.error(`[ERROR] ${message}`, {
      error: error?.message || error,
      context: context || {},
      stack: error?.stack,
    });
  },
};