/**
 * Logging utility that only logs in development mode
 * Prevents console.log statements from appearing in production
 */

const isDev = import.meta.env.DEV;

export const logger = {
    /**
     * Debug logs - only shown in development
     */
    debug: (...args) => {
        if (isDev) {
            console.log('[DEBUG]', ...args);
        }
    },

    /**
     * Info logs - only shown in development
     */
    info: (...args) => {
        if (isDev) {
            console.info('[INFO]', ...args);
        }
    },

    /**
     * Warning logs - shown in all environments
     */
    warn: (...args) => {
        console.warn('[WARN]', ...args);
    },

    /**
     * Error logs - shown in all environments
     */
    error: (...args) => {
        console.error('[ERROR]', ...args);
    },

    /**
     * Table logs - only shown in development
     */
    table: (data) => {
        if (isDev) {
            console.table(data);
        }
    }
};
