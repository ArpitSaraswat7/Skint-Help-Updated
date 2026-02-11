import { Package, Sparkle } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Empty State Component
 * Displays when no data is available
 * 
 * @param {Object} props
 * @param {React.ComponentType} props.icon - Icon component to display
 * @param {string} props.title - Main heading text
 * @param {string} props.description - Supporting description
 * @param {React.ReactNode} [props.action] - Optional action button or element
 */
export function EmptyState({
    icon: Icon = Package,
    title = "No data available",
    description = "There's nothing to show here yet.",
    action
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="glass-card p-8 rounded-2xl max-w-md">
                <div className="mb-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-xl rounded-full" />
                    <Icon className="relative h-16 w-16 mx-auto text-muted-foreground" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2">
                    {title}
                </h3>

                <p className="text-sm text-muted-foreground mb-6">
                    {description}
                </p>

                {action && (
                    <div className="flex justify-center">
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
}
