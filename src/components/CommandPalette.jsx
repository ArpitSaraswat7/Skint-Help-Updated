import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { useAuth } from '@/contexts/AuthContext';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { createCommands, filterCommands, groupCommands } from '@/lib/commands';
import './CommandPalette.css';

export function CommandPalette() {
    const navigate = useNavigate();
    const { user, profile, signOut } = useAuth();
    const { isOpen, search, setSearch, recentCommands, addToRecent, close } = useCommandPalette();
    const inputRef = useRef(null);

    // Create commands based on current user
    const allCommands = createCommands(navigate, profile, signOut);

    // Filter commands based on search
    const filteredCommands = filterCommands(allCommands, search);

    // Group filtered commands
    const groupedCommands = groupCommands(filteredCommands);

    // Get recent commands
    const recentCommandsList = recentCommands
        .map(id => allCommands.find(cmd => cmd.id === id))
        .filter(Boolean);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Handle command execution
    const executeCommand = (command) => {
        addToRecent(command.id);
        command.action();
        close();
    };

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="command-palette-backdrop"
                        onClick={close}
                    />

                    {/* Command Palette */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="command-palette-container"
                    >
                        <Command className="command-palette" label="Command Menu">
                            {/* Search Input */}
                            <div className="command-search-wrapper">
                                <MagnifyingGlass className="command-search-icon" weight="bold" />
                                <Command.Input
                                    ref={inputRef}
                                    value={search}
                                    onValueChange={setSearch}
                                    placeholder="Type a command or search..."
                                    className="command-search-input"
                                />
                                {search && (
                                    <button
                                        onClick={() => setSearch('')}
                                        className="command-clear-button"
                                        aria-label="Clear search"
                                    >
                                        <X weight="bold" />
                                    </button>
                                )}
                            </div>

                            <Command.List className="command-list">
                                <Command.Empty className="command-empty">
                                    <div className="command-empty-content">
                                        <MagnifyingGlass size={48} weight="thin" />
                                        <p>No commands found</p>
                                        <span>Try searching for something else</span>
                                    </div>
                                </Command.Empty>

                                {/* Recent Commands */}
                                {!search && recentCommandsList.length > 0 && (
                                    <Command.Group heading="Recent" className="command-group">
                                        {recentCommandsList.map((command) => {
                                            const Icon = command.icon;
                                            return (
                                                <Command.Item
                                                    key={command.id}
                                                    value={command.label}
                                                    onSelect={() => executeCommand(command)}
                                                    className="command-item"
                                                >
                                                    <Icon className="command-item-icon" weight="duotone" />
                                                    <span className="command-item-label">{command.label}</span>
                                                    {command.shortcut && (
                                                        <kbd className="command-item-shortcut">{command.shortcut}</kbd>
                                                    )}
                                                </Command.Item>
                                            );
                                        })}
                                    </Command.Group>
                                )}

                                {/* Grouped Commands */}
                                {Object.entries(groupedCommands).map(([groupName, commands]) => (
                                    <Command.Group key={groupName} heading={groupName} className="command-group">
                                        {commands.map((command) => {
                                            const Icon = command.icon;
                                            return (
                                                <Command.Item
                                                    key={command.id}
                                                    value={command.label}
                                                    keywords={command.keywords}
                                                    onSelect={() => executeCommand(command)}
                                                    className="command-item"
                                                >
                                                    <Icon className="command-item-icon" weight="duotone" />
                                                    <span className="command-item-label">{command.label}</span>
                                                    {command.shortcut && (
                                                        <kbd className="command-item-shortcut">{command.shortcut}</kbd>
                                                    )}
                                                </Command.Item>
                                            );
                                        })}
                                    </Command.Group>
                                ))}
                            </Command.List>

                            {/* Footer */}
                            <div className="command-footer">
                                <div className="command-footer-hint">
                                    <kbd>↑</kbd>
                                    <kbd>↓</kbd>
                                    <span>Navigate</span>
                                </div>
                                <div className="command-footer-hint">
                                    <kbd>↵</kbd>
                                    <span>Select</span>
                                </div>
                                <div className="command-footer-hint">
                                    <kbd>ESC</kbd>
                                    <span>Close</span>
                                </div>
                            </div>
                        </Command>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
