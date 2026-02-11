import {
    House,
    Package,
    Truck,
    Users,
    MapPin,
    FileText,
    SignOut,
    Plus,
    User,
    Gear,
    ChartBarHorizontal,
    Heart
} from '@phosphor-icons/react';

/**
 * Command Registry for Command Palette
 * Each command has: id, label, icon, action, keywords, role (optional), shortcut (optional)
 */

export const createCommands = (navigate, user, signOut) => {
    const commands = [];

    // ============================================
    // NAVIGATION COMMANDS
    // ============================================

    // Public Portal Commands
    if (!user || user.role === 'public') {
        commands.push(
            {
                id: 'nav-public-dashboard',
                label: 'Public Dashboard',
                icon: House,
                action: () => navigate('/public/dashboard'),
                keywords: ['home', 'public', 'dashboard', 'main'],
                group: 'Navigation',
                role: 'public'
            },
            {
                id: 'nav-public-requests',
                label: 'My Food Requests',
                icon: FileText,
                action: () => navigate('/public/requests'),
                keywords: ['requests', 'food', 'my requests', 'history'],
                group: 'Navigation',
                role: 'public'
            }
        );
    }

    // Restaurant Portal Commands
    if (user?.role === 'restaurant') {
        commands.push(
            {
                id: 'nav-restaurant-dashboard',
                label: 'Restaurant Dashboard',
                icon: House,
                action: () => navigate('/restaurant/dashboard'),
                keywords: ['home', 'restaurant', 'dashboard', 'main'],
                group: 'Navigation',
                role: 'restaurant'
            },
            {
                id: 'nav-restaurant-donations',
                label: 'My Donations',
                icon: Package,
                action: () => navigate('/restaurant/donations'),
                keywords: ['donations', 'food', 'my donations', 'history'],
                group: 'Navigation',
                role: 'restaurant'
            }
        );
    }

    // Worker Portal Commands
    if (user?.role === 'worker') {
        commands.push(
            {
                id: 'nav-worker-dashboard',
                label: 'Worker Dashboard',
                icon: House,
                action: () => navigate('/worker/dashboard'),
                keywords: ['home', 'worker', 'dashboard', 'main'],
                group: 'Navigation',
                role: 'worker'
            },
            {
                id: 'nav-worker-pickups',
                label: 'My Pickups',
                icon: Truck,
                action: () => navigate('/worker/pickups'),
                keywords: ['pickups', 'deliveries', 'my pickups', 'collections'],
                group: 'Navigation',
                role: 'worker'
            }
        );
    }

    // Admin/Owner Portal Commands
    if (user?.role === 'owner') {
        commands.push(
            {
                id: 'nav-owner-dashboard',
                label: 'Admin Dashboard',
                icon: House,
                action: () => navigate('/owner/dashboard'),
                keywords: ['home', 'admin', 'owner', 'dashboard', 'main'],
                group: 'Navigation',
                role: 'owner'
            },
            {
                id: 'nav-owner-restaurants',
                label: 'Manage Restaurants',
                icon: Package,
                action: () => navigate('/owner/restaurants'),
                keywords: ['restaurants', 'manage', 'partners', 'donors'],
                group: 'Navigation',
                role: 'owner'
            },
            {
                id: 'nav-owner-workers',
                label: 'Manage Workers',
                icon: Users,
                action: () => navigate('/owner/workers'),
                keywords: ['workers', 'manage', 'team', 'staff'],
                group: 'Navigation',
                role: 'owner'
            },
            {
                id: 'nav-owner-centers',
                label: 'Manage Centers',
                icon: MapPin,
                action: () => navigate('/owner/centers'),
                keywords: ['centers', 'manage', 'locations', 'distribution'],
                group: 'Navigation',
                role: 'owner'
            },
            {
                id: 'nav-owner-analytics',
                label: 'Analytics',
                icon: ChartBar,
                action: () => navigate('/owner/analytics'),
                keywords: ['analytics', 'stats', 'reports', 'insights'],
                group: 'Navigation',
                role: 'owner'
            }
        );
    }

    // ============================================
    // ACTION COMMANDS
    // ============================================

    // Restaurant Actions
    if (user?.role === 'restaurant') {
        commands.push({
            id: 'action-create-donation',
            label: 'Create New Donation',
            icon: Plus,
            action: () => navigate('/restaurant/dashboard?action=create'),
            keywords: ['create', 'new', 'donation', 'add', 'donate'],
            group: 'Actions',
            role: 'restaurant',
            shortcut: 'Ctrl+N'
        });
    }

    // Public Actions
    if (!user || user.role === 'public') {
        commands.push({
            id: 'action-request-food',
            label: 'Request Food',
            icon: Heart,
            action: () => navigate('/public/dashboard?action=request'),
            keywords: ['request', 'food', 'help', 'need'],
            group: 'Actions',
            role: 'public',
            shortcut: 'Ctrl+N'
        });
    }

    // ============================================
    // SETTINGS & PROFILE COMMANDS
    // ============================================

    if (user && user.role) {
        commands.push(
            {
                id: 'nav-profile',
                label: 'My Profile',
                icon: User,
                action: () => navigate(`/${user.role}/profile`),
                keywords: ['profile', 'account', 'settings', 'me'],
                group: 'Settings'
            },
            {
                id: 'nav-settings',
                label: 'Settings',
                icon: Gear,
                action: () => navigate(`/${user.role}/settings`),
                keywords: ['settings', 'preferences', 'config'],
                group: 'Settings'
            }
        );
    }

    // ============================================
    // AUTH COMMANDS
    // ============================================

    if (user) {
        commands.push({
            id: 'action-sign-out',
            label: 'Sign Out',
            icon: SignOut,
            action: () => {
                signOut();
                navigate('/');
            },
            keywords: ['sign out', 'logout', 'exit', 'leave'],
            group: 'Actions',
            shortcut: 'Ctrl+Q'
        });
    } else {
        commands.push({
            id: 'action-sign-in',
            label: 'Sign In',
            icon: User,
            action: () => navigate('/login'),
            keywords: ['sign in', 'login', 'auth', 'enter'],
            group: 'Actions'
        });
    }

    return commands;
};

/**
 * Filter commands based on search query
 */
export const filterCommands = (commands, query) => {
    if (!query) return commands;

    const lowerQuery = query.toLowerCase();

    return commands.filter(command => {
        const labelMatch = command.label.toLowerCase().includes(lowerQuery);
        const keywordsMatch = command.keywords.some(keyword =>
            keyword.toLowerCase().includes(lowerQuery)
        );
        return labelMatch || keywordsMatch;
    });
};

/**
 * Group commands by category
 */
export const groupCommands = (commands) => {
    const groups = {};

    commands.forEach(command => {
        const group = command.group || 'Other';
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(command);
    });

    return groups;
};
