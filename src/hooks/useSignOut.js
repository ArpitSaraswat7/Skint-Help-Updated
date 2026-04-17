import { useAuth } from "@/contexts/AuthContext";

export function useSignOut() {
    const { signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();

        // ✅ HARD REDIRECT (no React routing)
        window.location.href = "/select-role";
    };

    return handleSignOut;
}
