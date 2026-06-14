/**
 * Security utilities for EmailJS and form submissions (SEC-03 / CQ-02)
 * Handles client-side rate limiting, input sanitization, and format validation.
 */

// Max 3 submissions per hour across the app to prevent abuse
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_WINDOW = 3;
const STORAGE_KEY = '_sh_email_submissions';

/**
 * Check if the user has exceeded their email submission rate limit.
 * If exceeded, throws an Error with a user-friendly message.
 */
export function checkEmailRateLimit() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const now = Date.now();
        
        if (!stored) return;
        
        let timestamps = JSON.parse(stored);
        if (!Array.isArray(timestamps)) {
            timestamps = [];
        }
        
        // Filter out timestamps outside the active window
        timestamps = timestamps.filter(ts => (now - ts) < RATE_LIMIT_WINDOW_MS);
        
        if (timestamps.length >= MAX_SUBMISSIONS_PER_WINDOW) {
            const oldest = timestamps[0];
            const remainingMs = RATE_LIMIT_WINDOW_MS - (now - oldest);
            const remainingMins = Math.ceil(remainingMs / (60 * 1000));
            throw new Error(`Too many submissions. Please wait ${remainingMins} minute(s) before trying again.`);
        }
    } catch (err) {
        if (err.message.includes('Too many submissions')) {
            throw err;
        }
        // Fallback for JSON parse errors
        localStorage.removeItem(STORAGE_KEY);
    }
}

/**
 * Record a successful email submission timestamp.
 */
export function recordEmailSubmission() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const now = Date.now();
        let timestamps = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(timestamps)) timestamps = [];
        
        timestamps.push(now);
        // Only keep the last few
        timestamps = timestamps.filter(ts => (now - ts) < RATE_LIMIT_WINDOW_MS);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(timestamps));
    } catch {
        // Silently fail if localStorage is blocked
    }
}

/**
 * Sanitize a string to prevent XSS and HTML injection.
 * Strips HTML tags and trims whitespace.
 */
export function sanitizeInput(value) {
    if (typeof value !== 'string') return '';
    let sanitized = value.trim();
    // Strip HTML tags using regex
    sanitized = sanitized.replace(/<[^>]*>/g, '');
    // Convert essential HTML special characters to entities
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };
    return sanitized.replace(/[&<>"'/]/g, (m) => map[m]);
}

/**
 * Basic email format validation.
 */
export function validateEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email.trim());
}

/**
 * Basic phone format validation.
 * Supports digits, spaces, hyphens, parentheses, and starting + sign.
 */
export function validatePhone(phone) {
    if (!phone) return true; // Phone is optional in some forms
    if (typeof phone !== 'string') return false;
    const regex = /^\+?[0-9\s\-()]{7,20}$/;
    return regex.test(phone.trim());
}
