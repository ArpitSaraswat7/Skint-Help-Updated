import {
    House,
    Package,
    Truck,
    Users,
    FileText,
    SignOut,
    Plus,
    User,
    Gear,
    ChartBar,
    Heart
} from '@phosphor-icons/react';
import { getDashboardForRole } from './role-routes';

/**
 * Command Registry for Command Palette
 * Each command has: id, label, icon, action, keywords, role (optional), shortcut (optional)
 * 
 * ✅ FIXED: Uses getDashboardForRole() for correct route mapping
 */

export const createCommands = (navigate, user, signOut) => {
    const commands = [];

    // ============================================
    // NAVIGATION COMMANDS
    // ============================================

    // Public Portal Commands (when no user or public role)
    if (!user || user.role === 'public') {
        commands.push(
            {
                id: 'nav-public-home',
                label: 'Home',
                icon: House,
                action: () => navigate('/'),
                keywords: ['home', 'public', 'main', 'start'],
                group: 'Navigation',
                role: 'public'
            },
            {
                id: 'nav-public-how-it-works',
                label: 'How It Works',
                icon: FileText,
                action: () => navigate('/how-it-works'),
                keywords: ['learn', 'guide', 'tutorial', 'how'],
                group: 'Navigation',
                role: 'public'
            },
            {
                id: 'nav-public-map',
                label: 'Food Map',
                icon: House,
                action: () => navigate('/food-map'),
                keywords: ['map', 'locations', 'find food', 'near me'],
                group: 'Navigation',
                role: 'public'
            }
        );
    }

    // Restaurant Portal Commands
    // ✅ FIXED: Uses getDashboardForRole('restaurant') instead of hardcoded path
    if (user?.role === 'restaurant' || user?.role === 'admin') {
        commands.push(
            {
                id: 'nav-restaurant-dashboard',
                label: 'Restaurant Dashboard',
                icon: House,
                action: () => navigate(getDashboardForRole('restaurant')),
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
            },
            {
                id: 'nav-restaurant-centers',
                label: 'Collection Centers',
                icon: House,
                action: () => navigate('/restaurant/centers'),
                keywords: ['centers', 'locations', 'partners', 'pickups'],
                group: 'Navigation',
                role: 'restaurant'
            },
            {
                id: 'action-new-donation',
                label: 'New Donation',
                icon: Plus,
                action: () => navigate('/restaurant/dashboard'),
                keywords: ['create', 'new', 'add donation', 'donate food'],
                group: 'Actions',
                role: 'restaurant',
                shortcut: 'Ctrl+N'
            }
        );
    }

    // Worker Portal Commands
    // ✅ FIXED: Uses getDashboardForRole('worker')
    if (user?.role === 'worker' || user?.role === 'admin') {
        commands.push(
            {
                id: 'nav-worker-dashboard',
                label: 'Worker Dashboard',
                icon: House,
                action: () => navigate(getDashboardForRole('worker')),
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
            },
            {
                id: 'nav-worker-distributions',
                label: 'Distributions',
                icon: Package,
                action: () => navigate('/worker/distributions'),
                keywords: ['distributions', 'deliveries', 'drop-off', 'handout'],
                group: 'Navigation',
                role: 'worker'
            }
        );
    }

    // Admin/Owner Portal Commands
    if (user?.role === 'admin') {
        commands.push(
            {
                id: 'nav-admin-dashboard',
                label: 'Admin Dashboard',
                icon: House,
                action: () => navigate(getDashboardForRole('admin')),
                keywords: ['home', 'admin', 'dashboard', 'main'],
                group: 'Navigation',
                role: 'admin'
            },
            {
                id: 'nav-admin-restaurants',
                label: 'Manage Restaurants',
                icon: Truck,
                action: () => navigate('/admin/restaurants'),
                keywords: ['restaurants', 'partners', 'manage', 'list'],
                group: 'Navigation',
                role: 'admin'
            },
            {
                id: 'nav-admin-workers',
                label: 'Manage Workers',
                icon: Users,
                action: () => navigate('/admin/workers'),
                keywords: ['workers', 'staff', 'manage', 'team'],
                group: 'Navigation',
                role: 'admin'
            },
            {
                id: 'nav-admin-centers',
                label: 'Collection Centers',
                icon: House,
                action: () => navigate('/admin/centers'),
                keywords: ['centers', 'locations', 'manage'],
                group: 'Navigation',
                role: 'admin'
            },
            {
                id: 'nav-admin-analytics',
                label: 'Analytics',
                icon: ChartBar,
                action: () => navigate('/admin/analytics'),
                keywords: ['analytics', 'stats', 'reports', 'metrics'],
                group: 'Navigation',
                role: 'admin'
            }
        );
    }

    // ============================================
    // UTILITY COMMANDS
    // ============================================

    if (user) {
        commands.push(
            {
                id: 'action-profile',
                label: 'View Profile',
                icon: User,
                action: () => {
                    // TODO: Implement profile view/edit page
                    console.log('Profile page not yet implemented');
                },
                keywords: ['profile', 'account', 'settings', 'me'],
                group: 'Account'
            },
            {
                id: 'action-sign-out',
                label: 'Sign Out',
                icon: SignOut,
                action: () => signOut?.(),
                keywords: ['logout', 'sign out', 'exit', 'leave'],
                group: 'Account',
                shortcut: 'Shift+Cmd+Q'
            }
        );
    }

    // ============================================
    // HELP COMMANDS
    // ============================================

    commands.push(
        {
            id: 'nav-about',
            label: 'About Skint Help',
            icon: Heart,
            action: () => navigate('/impact'),
            keywords: ['about', 'info', 'mission', 'vision'],
            group: 'Help'
        },
        {
            id: 'nav-contact',
            label: 'Contact Support',
            icon: FileText,
            action: () => navigate('/contact'),
            keywords: ['contact', 'support', 'help', 'email'],
            group: 'Help'
        }
    );

    return commands;
};

/**
 * Filter commands by search query
 */
export const filterCommands = (commands, search) => {
    if (!search) return commands;

    const lowerSearch = search.toLowerCase();
    return commands.filter(cmd => {
        return (
            cmd.label.toLowerCase().includes(lowerSearch) ||
            cmd.keywords?.some(keyword =>
                keyword.toLowerCase().includes(lowerSearch)
            )
        );
    });
};

/**
 * Group commands by category
 */
export const groupCommands = (commands) => {
    return commands.reduce((groups, cmd) => {
        const group = cmd.group || 'Other';
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(cmd);
        return groups;
    }, {});
};
