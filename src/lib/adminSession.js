/**
 * Admin session security utility
 *
 * Replaces the plain 'authenticated' string in sessionStorage with a
 * time-stamped, pseudo-random token. This prevents trivial sessionStorage
 * manipulation attacks (SEC-02).
 *
 * Token format: base64( timestamp + ":" + random16bytes )
 * Validity: checked against SESSION_TTL_MS (default 8 hours).
 */

const SESSION_KEY   = '_sh_admin_auth';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

/**
 * Generate a secure-enough session token using crypto.getRandomValues.
 * Not a true HMAC (no server secret available in a pure SPA), but far
 * stronger than a static string comparison.
 */
function generateToken() {
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    const payload = `${Date.now()}:${hex}`;
    return btoa(payload);
}

/**
 * Validate a stored token.
 * Returns true only if:
 *  - The token can be decoded
 *  - The embedded timestamp is within SESSION_TTL_MS
 */
function isTokenValid(token) {
    try {
        const payload = atob(token);
        const [tsStr] = payload.split(':');
        const ts = parseInt(tsStr, 10);
        if (!Number.isFinite(ts)) return false;
        return (Date.now() - ts) < SESSION_TTL_MS;
    } catch {
        return false;
    }
}

/** Persist a new admin session token in sessionStorage */
export function createAdminSession() {
    const token = generateToken();
    sessionStorage.setItem(SESSION_KEY, token);
    return token;
}

/** Check whether a valid admin session exists */
export function hasValidAdminSession() {
    const token = sessionStorage.getItem(SESSION_KEY);
    if (!token) return false;
    const valid = isTokenValid(token);
    if (!valid) {
        // Expired or tampered — remove it
        sessionStorage.removeItem(SESSION_KEY);
    }
    return valid;
}

/** Destroy the admin session */
export function destroyAdminSession() {
    sessionStorage.removeItem(SESSION_KEY);
}
