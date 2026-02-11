/**
 * Environment variable configuration and validation
 */

export const ENV = {
    // Supabase
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',

    // Google Maps
    GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',

    // Feature Flags
    ENABLE_DEMO_MODE: import.meta.env.VITE_ENABLE_DEMO_MODE === 'true',

    // Environment
    IS_DEV: import.meta.env.DEV,
    IS_PROD: import.meta.env.PROD,
    MODE: import.meta.env.MODE,
};

/**
 * Validate required environment variables
 */
export function validateEnv() {
    const warnings = [];

    if (!ENV.SUPABASE_URL && ENV.IS_PROD) {
        warnings.push('VITE_SUPABASE_URL is not configured');
    }

    if (!ENV.SUPABASE_ANON_KEY && ENV.IS_PROD) {
        warnings.push('VITE_SUPABASE_ANON_KEY is not configured');
    }

    if (!ENV.GOOGLE_MAPS_API_KEY) {
        warnings.push('VITE_GOOGLE_MAPS_API_KEY is not configured - maps will not work');
    }

    if (warnings.length > 0 && ENV.IS_PROD) {
        console.warn('⚠️ Environment Configuration Warnings:');
        warnings.forEach(warning => console.warn(`  - ${warning}`));
    }

    return warnings;
}

// Validate on module load
if (ENV.IS_PROD) {
    validateEnv();
}
