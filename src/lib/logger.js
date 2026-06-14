/**
 * Logging utility that only logs in development mode
 * Prevents console statements from appearing in production (CQ-05)
 */

const isDev = import.meta.env.DEV;

export const logger = {
    /** Debug logs - only shown in development */
    debug: (...args) => {
        if (isDev) {
            console.log('[DEBUG]', ...args);
        }
    },

    /** Info logs - only shown in development */
    info: (...args) => {
        if (isDev) {
            console.info('[INFO]', ...args);
        }
    },

    /** Warning logs - only shown in development (CQ-05: gated in prod) */
    warn: (...args) => {
        if (isDev) {
            console.warn('[WARN]', ...args);
        }
    },

    /** Error logs - only shown in development (CQ-05: prevent schema leakage in prod) */
    error: (...args) => {
        if (isDev) {
            console.error('[ERROR]', ...args);
        }
    },

    /** Table logs - only shown in development */
    table: (data) => {
        if (isDev) {
            console.table(data);
        }
    }
};

