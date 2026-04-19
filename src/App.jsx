import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import { GlobalBackground } from "@/components/GlobalBackground";
import { CommandPalette } from "@/components/CommandPalette";
import { ScrollToTop } from "@/components/ScrollToTop";
import { lazy, Suspense } from "react";
import { getDashboardForRole } from "@/lib/role-routes";
import "@/lib/scroll-handler"; // Import scroll optimization

// Layouts
import { CustomerLayout } from "@/layouts/CustomerLayout";
import { RestaurantLayout } from "@/layouts/RestaurantLayout";
import { WorkerLayout } from "@/layouts/WorkerLayout";
import { AdminLayout } from "@/layouts/AdminLayout";

// ─── Critical Pages (loaded immediately for fast first paint) ───
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";

import EmailConfirm from "./pages/EmailConfirm";
import SelectRole from "./pages/SelectRole";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";

// ─── Lazy-loaded Public Pages ───
const JoinUsPage = lazy(() => import("./pages/JoinUs"));
const ContactPage = lazy(() => import("./pages/Contact"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorks"));
const ImpactPage = lazy(() => import("./pages/Impact"));
const PublicFoodMap = lazy(() => import("./pages/PublicFoodMap"));

// ─── Lazy-loaded Admin Portal Pages ───
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminApplications = lazy(() => import("./pages/AdminApplications"));
const AdminRestaurants = lazy(() => import("./pages/AdminRestaurants"));
const AdminWorkers = lazy(() => import("./pages/AdminWorkers"));
const AdminCenters = lazy(() => import("./pages/AdminCenters"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));

// ─── Lazy-loaded Restaurant Portal Pages ───
const RestaurantDashboard = lazy(() => import("./pages/RestaurantDashboard"));
const RestaurantDonations = lazy(() => import("./pages/RestaurantDonations"));
const RestaurantCenters = lazy(() => import("./pages/RestaurantCenters"));

// ─── Lazy-loaded Worker Portal Pages ───
const WorkerDashboard = lazy(() => import("./pages/WorkerDashboard"));
const WorkerPickups = lazy(() => import("./pages/WorkerPickups"));
const WorkerDistributions = lazy(() => import("./pages/WorkerDistributions"));

// ─── Lazy-loaded Customer Portal Pages ───
const PublicDashboard = lazy(() => import("./pages/PublicDashboard"));


// ─── Loading Fallback ───
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>
    </div>
);

/** Suspense wrapper for lazy-loaded pages */
function Lazy({ children }) {
    return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}


const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <ScrollToTop />
            <GlobalBackground />
            <AuthProvider>
                <TooltipProvider>
                    <CommandPalette />
                    <Toaster />
                    <Sonner />
                    <AppRoutes />
                </TooltipProvider>
            </AuthProvider>
        </BrowserRouter>
    </QueryClientProvider>
);

/**
 * Inner component so it can call useAuth (which needs AuthProvider above it).
 * Shows a full-screen loader until the initial session check finishes,
 * preventing spurious redirects to /select-role on page refresh.
 */
function AppRoutes() {
    const { isSessionChecked } = useAuth();

    // Block route rendering until we know whether a session exists.
    // This prevents protected routes from seeing user=null and redirecting
    // to /select-role before the session has been restored from Supabase.
    if (!isSessionChecked) {
        return <PageLoader />;
    }

    return (
        <Routes>
            {/* ═══════════════════════════════════════════
                PUBLIC ROUTES (CustomerLayout with Navbar/Footer)
                ═══════════════════════════════════════════ */}
            <Route element={<CustomerLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/join-us" element={<Lazy><JoinUsPage /></Lazy>} />
                <Route path="/contact" element={<Lazy><ContactPage /></Lazy>} />
                <Route path="/how-it-works" element={<Lazy><HowItWorksPage /></Lazy>} />
                <Route path="/impact" element={<Lazy><ImpactPage /></Lazy>} />
                <Route path="/food-map" element={<Lazy><PublicFoodMap /></Lazy>} />
            </Route>

            {/* ═══════════════════════════════════════════
                AUTH ROUTES (no layout wrapper)
                ═══════════════════════════════════════════ */}
            <Route path="/select-role" element={<SelectRole />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth" element={<Navigate to="/select-role" replace />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/confirm" element={<EmailConfirm />} />
            {/* Legacy portal login redirect */}
            <Route path="/portal/:type/login" element={<Navigate to="/select-role" replace />} />

            {/* ═══════════════════════════════════════════
                ADMIN PORTAL — hidden path: /sysadmin
                Login: /sysadmin  |  Portal: /sysadmin/dashboard
                ═══════════════════════════════════════════ */}
            {/* Admin standalone login page — no layout wrapper */}
            <Route path="/sysadmin" element={<AdminLogin />} />

            {/* Admin portal — requires admin role in profile */}
            <Route path="/sysadmin" element={<AdminLayout />}>
                <Route path="dashboard" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Lazy><AdminDashboard /></Lazy>
                    </ProtectedRoute>
                } />
                <Route path="applications" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Lazy><AdminApplications /></Lazy>
                    </ProtectedRoute>
                } />
                <Route path="restaurants" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Lazy><AdminRestaurants /></Lazy>
                    </ProtectedRoute>
                } />
                <Route path="workers" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Lazy><AdminWorkers /></Lazy>
                    </ProtectedRoute>
                } />
                <Route path="centers" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Lazy><AdminCenters /></Lazy>
                    </ProtectedRoute>
                } />
                <Route path="analytics" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Lazy><AdminAnalytics /></Lazy>
                    </ProtectedRoute>
                } />
            </Route>

            {/* ═══════════════════════════════════════════
                RESTAURANT PORTAL
                Allowed: restaurant, admin
                ═══════════════════════════════════════════ */}
            <Route path="/restaurant" element={<RestaurantLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={
                    <ProtectedRoute allowedRoles={['restaurant', 'admin']}>
                        <Lazy><RestaurantDashboard /></Lazy>
                    </ProtectedRoute>
                } />
                <Route path="donations" element={
                    <ProtectedRoute allowedRoles={['restaurant', 'admin']}>
                        <Lazy><RestaurantDonations /></Lazy>
                    </ProtectedRoute>
                } />
                <Route path="centers" element={
                    <ProtectedRoute allowedRoles={['restaurant', 'admin']}>
                        <Lazy><RestaurantCenters /></Lazy>
                    </ProtectedRoute>
                } />
            </Route>

            {/* ═══════════════════════════════════════════
                WORKER PORTAL
                Allowed: worker, admin
                ═══════════════════════════════════════════ */}
            <Route path="/worker" element={<WorkerLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={
                    <ProtectedRoute allowedRoles={['worker', 'admin']}>
                        <Lazy><WorkerDashboard /></Lazy>
                    </ProtectedRoute>
                } />
                <Route path="pickups" element={
                    <ProtectedRoute allowedRoles={['worker', 'admin']}>
                        <Lazy><WorkerPickups /></Lazy>
                    </ProtectedRoute>
                } />
                <Route path="distributions" element={
                    <ProtectedRoute allowedRoles={['worker', 'admin']}>
                        <Lazy><WorkerDistributions /></Lazy>
                    </ProtectedRoute>
                } />
            </Route>

            {/* ═══════════════════════════════════════════
                CUSTOMER PORTAL (Protected)
                Allowed: public, customer, admin
                ═══════════════════════════════════════════ */}
            <Route path="/customer" element={<CustomerLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={
                    <ProtectedRoute allowedRoles={['public', 'customer', 'admin']}>
                        <Lazy><PublicDashboard /></Lazy>
                    </ProtectedRoute>
                } />
            </Route>

            {/* ═══════════════════════════════════════════
                LEGACY / ALIAS REDIRECTS
                ═══════════════════════════════════════════ */}
            {/* Old /admin and /cp paths redirect to hidden /sysadmin */}
            <Route path="/admin"           element={<Navigate to="/sysadmin" replace />} />
            <Route path="/admin/*"          element={<Navigate to="/sysadmin" replace />} />
            <Route path="/cp"              element={<Navigate to="/sysadmin" replace />} />
            <Route path="/cp/*"            element={<Navigate to="/sysadmin" replace />} />
            <Route path="/admin-dashboard" element={<Navigate to="/sysadmin/dashboard" replace />} />
            <Route path="/restaurant-dashboard" element={<Navigate to="/restaurant/dashboard" replace />} />
            <Route path="/worker-dashboard"     element={<Navigate to="/worker/dashboard" replace />} />
            <Route path="/public-dashboard"     element={<Navigate to="/customer/dashboard" replace />} />

            {/* Smart redirect: /dashboard → user's portal */}
            <Route path="/dashboard" element={<DashboardRedirect />} />

            {/* ═══════════════════════════════════════════
                404 CATCH-ALL
                ═══════════════════════════════════════════ */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

/**
 * Smart redirect component — sends authenticated users
 * to their role-specific dashboard.
 */
function DashboardRedirect() {
    const { profile, loading, user, isSigningOut } = useAuth();

    // During sign-out, show nothing
    if (isSigningOut) {
        return null;
    }

    if (loading) {
        return <PageLoader />;
    }

    // Not authenticated — redirect to public home
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // User exists but profile not loaded — retry briefly
    if (!profile) {
        return <PageLoader />;
    }

    // User has profile — redirect to their dashboard
    const dashboardPath = getDashboardForRole(profile.role);
    return <Navigate to={dashboardPath} replace />;
}

export default App;
