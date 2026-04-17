import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { logger } from "@/lib/logger";

/**
 * ✅ FIXED: Uses React Router navigation instead of hard redirect
 * 
 * Before: window.location.href = "/select-role" ❌
 * - Causes full page reload
 * - Loses all state and context
 * - Poor UX for SPA
 * 
 * After: navigate("/select-role", { replace: true }) ✅
 * - Smooth SPA navigation
 * - Preserves state management
 * - Better performance
 */
export function useSignOut() {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut();
            logger.debug("User signed out successfully");
            
            // ✅ USE REACT ROUTER NAVIGATION (SPA)
            // replace: true removes /select-role from browser history,
            // so users can't go back to protected pages
            navigate("/select-role", { replace: true });
        } catch (error) {
            logger.error("Sign out error:", error);
            // Even on error, navigate away to prevent user seeing stale state
            navigate("/select-role", { replace: true });
        }
    };

    return handleSignOut;
}
