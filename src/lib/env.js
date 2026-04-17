/**
 * Environment variable configuration and validation
 * All VITE_ prefixed vars are injected at build time by Vite.
 * They are NOT secret at runtime — keep passwords strong & rotate them.
 */

export const ENV = {
    // Supabase (used by non-admin portals)
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',

    // Google Maps
    GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',

    // Admin single-owner credentials
    // Both ID and PASSWORD must match exactly — no signup, no DB, no multi-user
    ADMIN_ID: import.meta.env.VITE_ADMIN_ID || '',
    ADMIN_PASSWORD: import.meta.env.VITE_ADMIN_PASSWORD || '',

    // Environment
    IS_DEV: import.meta.env.DEV,
    IS_PROD: import.meta.env.PROD,
    MODE: import.meta.env.MODE,
};

/**
 * Validate required environment variables on startup
 */
export function validateEnv() {
    const warnings = [];

    if (!ENV.SUPABASE_URL && ENV.IS_PROD) {
        warnings.push('VITE_SUPABASE_URL is not configured');
    }
    if (!ENV.SUPABASE_ANON_KEY && ENV.IS_PROD) {
        warnings.push('VITE_SUPABASE_ANON_KEY is not configured');
    }
    if (!ENV.ADMIN_ID) {
        warnings.push('VITE_ADMIN_ID is not set — admin portal will be inaccessible');
    }
    if (!ENV.ADMIN_PASSWORD) {
        warnings.push('VITE_ADMIN_PASSWORD is not set — admin portal will be inaccessible');
    }

    if (warnings.length > 0 && ENV.IS_PROD) {
        console.warn('⚠️ Environment Configuration Warnings:');
        warnings.forEach(w => console.warn(`  - ${w}`));
    }

    return warnings;
}

if (ENV.IS_PROD) {
    validateEnv();
}
