/**
 * Error message sanitizer (SEC-05)
 *
 * Prevents raw Supabase / database error messages from leaking to users
 * in production (they reveal table names, constraints, schema structure).
 *
 * In development, the original message is preserved for debugging.
 */

import { ENV } from '@/lib/env';

const SUPABASE_ERROR_MAP = {
    // Auth errors
    'Invalid login credentials': 'Invalid email or password. Please try again.',
    'Email not confirmed': 'Please confirm your email before signing in.',
    'User already registered': 'An account with this email already exists.',
    'Password should be at least 6 characters': 'Password must be at least 8 characters.',
    'over_email_send_rate_limit': 'Too many requests. Please wait a moment and try again.',
    'Token has expired or is invalid': 'Your session has expired. Please sign in again.',

    // Network / connection
    'Failed to fetch': 'Could not connect to the server. Check your internet connection.',
    'NetworkError': 'Network error. Please check your connection.',

    // Generic DB / constraint errors (common PGRST codes)
    'duplicate key value': 'This record already exists.',
    'violates foreign key constraint': 'Cannot complete this action — a related record is missing.',
    'violates not-null constraint': 'A required field is missing.',
    'relation': 'A database configuration error occurred. Please contact support.',
    'PGRST': 'A server error occurred. Please try again.',
};

/**
 * Returns a user-safe error message.
 * In development, the original is returned for full debugging context.
 */
export function sanitizeError(error) {
    if (!error) return 'An unexpected error occurred.';

    const raw = typeof error === 'string' ? error : (error?.message || String(error));

    // In development, pass through the raw message
    if (ENV.IS_DEV) return raw;

    // Match against known error patterns
    for (const [pattern, friendly] of Object.entries(SUPABASE_ERROR_MAP)) {
        if (raw.toLowerCase().includes(pattern.toLowerCase())) {
            return friendly;
        }
    }

    // Default safe message for anything unrecognized
    return 'Something went wrong. Please try again.';
}
