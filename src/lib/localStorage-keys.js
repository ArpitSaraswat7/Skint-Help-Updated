/**
 * Centralized localStorage key management
 * Prevents inconsistent key naming and makes refactoring easier
 */

export const STORAGE_KEYS = Object.freeze({
    // Auth & Role Management
    SELECTED_ROLE: 'selectedRole',
    USER_ROLE: 'userRole',
    PENDING_ROLE: 'pendingRole',

    // Admin session (sessionStorage — cleared on tab close)
    ADMIN_AUTH: '_sh_admin_auth',

    // Supabase (auto-prefixed)
    SUPABASE_PREFIX: 'sb-',
});

/**
 * Safely get a localStorage value with type coercion
 */
export function getLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item !== null ? item : defaultValue;
    } catch (error) {
        console.warn(`Failed to read localStorage key "${key}":`, error);
        return defaultValue;
    }
}

/**
 * Safely set a localStorage value
 */
export function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.warn(`Failed to write localStorage key "${key}":`, error);
        return false;
    }
}

/**
 * Safely remove a localStorage value
 */
export function removeLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.warn(`Failed to remove localStorage key "${key}":`, error);
        return false;
    }
}

/**
 * Clear all supabase-related storage
 */
export function clearSupabaseStorage() {
    try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(STORAGE_KEYS.SUPABASE_PREFIX) || key.startsWith('supabase.')) {
                localStorage.removeItem(key);
            }
        });
        return true;
    } catch (error) {
        console.warn('Failed to clear Supabase storage:', error);
        return false;
    }
}
