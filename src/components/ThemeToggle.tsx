import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import './ThemeToggle.css';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isChecked = theme === 'light';

    return (
        <div className="neo-toggle-container">
            <input
                className="neo-toggle-input"
                id="neo-toggle"
                type="checkbox"
                checked={isChecked}
                onChange={toggleTheme}
            />
            <label className="neo-toggle" htmlFor="neo-toggle">
                <div className="neo-track">
                    <div className="neo-background-layer" />
                    <div className="neo-grid-layer" />
                    <div className="neo-spectrum-analyzer">
                        <div className="neo-spectrum-bar" />
                        <div className="neo-spectrum-bar" />
                        <div className="neo-spectrum-bar" />
                        <div className="neo-spectrum-bar" />
                        <div className="neo-spectrum-bar" />
                    </div>
                    <div className="neo-track-highlight" />
                </div>
                <div className="neo-thumb">
                    <div className="neo-thumb-ring" />
                    <div className="neo-thumb-core">
                        <div className="neo-thumb-icon">
                            <div className="neo-thumb-wave" />
                            <div className="neo-thumb-pulse" />
                        </div>
                    </div>
                </div>
                <div className="neo-gesture-area" />
                <div className="neo-interaction-feedback">
                    <div className="neo-ripple" />
                    <div className="neo-progress-arc" />
                </div>
                <div className="neo-status">
                    <div className="neo-status-indicator">
                        <div className="neo-status-dot" />
                        <div className="neo-status-text" />
                    </div>
                </div>
            </label>
        </div>
    );
}
