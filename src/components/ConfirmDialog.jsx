import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { logger } from "@/lib/logger";
import { useState } from "react";

/**
 * Reusable Confirmation Dialog Component
 * 
 * @param {boolean} open - Controls dialog visibility
 * @param {function} onOpenChange - Callback when dialog open state changes
 * @param {function} onConfirm - Callback when user confirms action
 * @param {string} title - Dialog title
 * @param {string} description - Dialog description
 * @param {string} confirmText - Text for confirm button (default: "Confirm")
 * @param {string} cancelText - Text for cancel button (default: "Cancel")
 * @param {string} variant - Button variant: "destructive" or "default"
 * @param {React.ReactNode} icon - Optional icon to display
 * @param {React.ReactNode} children - Optional additional content
 */
export function ConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
    icon,
    children,
}) {
    const [isConfirming, setIsConfirming] = useState(false);

    const handleConfirm = async (e) => {
        e.preventDefault();
        if (isConfirming) return;
        setIsConfirming(true);
        if (typeof onConfirm === 'function') {
            try {
                await onConfirm();
            } catch (error) {
                logger.error('Error in onConfirm:', error);
            }
        }
        setIsConfirming(false);
        if (typeof onOpenChange === 'function') {
            onOpenChange(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="glass-card border-white/20">
                <AlertDialogHeader>
                    {icon && (
                        <div className="mb-4 flex justify-center">
                            <div className={`
                w-16 h-16 rounded-full flex items-center justify-center
                ${variant === 'destructive'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-green-500/20 text-green-400'
                                }
              `}>
                                {icon}
                            </div>
                        </div>
                    )}
                    <AlertDialogTitle className="text-center text-xl">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-muted-foreground">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {children && (
                    <div className="py-4">
                        {children}
                    </div>
                )}

                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel disabled={isConfirming} className="glass-card border-white/20 hover:bg-white/10">
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isConfirming}
                        className={
                            variant === 'destructive'
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                        }
                    >
                        {isConfirming ? "Processing..." : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
