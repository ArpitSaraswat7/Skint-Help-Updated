import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing command palette state
 */
export const useCommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [recentCommands, setRecentCommands] = useState(() => {
        // Load recent commands from localStorage
        try {
            const stored = localStorage.getItem('recent_commands');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // Open/close handlers
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => {
        setIsOpen(false);
        setSearch(''); // Clear search when closing
    }, []);
    const toggle = useCallback(() => setIsOpen(prev => !prev), []);

    // Add command to recent history
    const addToRecent = useCallback((commandId) => {
        setRecentCommands(prev => {
            // Remove if already exists
            const filtered = prev.filter(id => id !== commandId);
            // Add to front, keep max 5
            const updated = [commandId, ...filtered].slice(0, 5);

            // Persist to localStorage
            try {
                localStorage.setItem('recent_commands', JSON.stringify(updated));
            } catch (error) {
                console.error('Failed to save recent commands:', error);
            }

            return updated;
        });
    }, []);

    // Keyboard shortcut listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Cmd+K or Ctrl+K to open
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                toggle();
            }

            // ESC to close
            if (e.key === 'Escape' && isOpen) {
                e.preventDefault();
                close();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, toggle, close]);

    return {
        isOpen,
        search,
        setSearch,
        recentCommands,
        addToRecent,
        open,
        close,
        toggle
    };
};
