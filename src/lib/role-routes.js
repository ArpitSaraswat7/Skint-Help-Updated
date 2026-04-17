/**
 * Centralized role → route mapping.
 * Single source of truth for all portal redirects.
 */

/** Dashboard paths per role */
const ROLE_DASHBOARDS = Object.freeze({
    admin: '/sysadmin/dashboard',
    restaurant: '/restaurant/dashboard',
    worker: '/worker/dashboard',
    public: '/customer/dashboard',
    customer: '/customer/dashboard',
});

/** Portal base paths per role (for layout-level guards) */
const ROLE_PORTALS = Object.freeze({
    admin: '/sysadmin',
    restaurant: '/restaurant',
    worker: '/worker',
    public: '/customer',
    customer: '/customer',
});

/** Valid application roles */
const VALID_ROLES = Object.freeze(['admin', 'restaurant', 'worker', 'public']);

/**
 * Get the dashboard path for a given role.
 * Falls back to public dashboard for unknown roles.
 */
export function getDashboardForRole(role) {
    return ROLE_DASHBOARDS[role] || ROLE_DASHBOARDS.public;
}

/**
 * Get the portal base path for a given role.
 */
export function getPortalForRole(role) {
    return ROLE_PORTALS[role] || ROLE_PORTALS.public;
}

/**
 * Check if a role string is valid.
 */
export function isValidRole(role) {
    return VALID_ROLES.includes(role);
}

/**
 * Sanitize a role string — returns the role if valid, 'public' otherwise.
 */
export function sanitizeRole(role) {
    return isValidRole(role) ? role : 'public';
}

export { ROLE_DASHBOARDS, ROLE_PORTALS, VALID_ROLES };
