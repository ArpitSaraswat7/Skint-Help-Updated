import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export function useSignOut() {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignOut = async () => {
        // Determine where they are logging out from
        const isAdmin = location.pathname.startsWith('/sysadmin');

        // Execute auth cleanup (this sets isSigningOut = true, clears state, etc)
        await signOut();

        // Use React Router to REPLACE the history state. 
        // This stops the browser's Back Button from taking them back to the protected portal.
        if (isAdmin) {
            navigate('/sysadmin', { replace: true });
        } else {
            navigate('/select-role', { replace: true });
        }
    };

    return handleSignOut;
}
