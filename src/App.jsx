import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { GlobalBackground } from "@/components/GlobalBackground";
import { CommandPalette } from "@/components/CommandPalette";
import { lazy, Suspense } from "react";
import "@/lib/scroll-handler"; // Import scroll optimization

// Layouts
import { CustomerLayout } from "@/layouts/CustomerLayout";
import { RestaurantLayout } from "@/layouts/RestaurantLayout";
import { WorkerLayout } from "@/layouts/WorkerLayout";
import { OwnerLayout } from "@/layouts/OwnerLayout";

// Public Pages (loaded immediately)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import JoinUs from "./pages/JoinUs";
import Contact from "./pages/Contact";
import SelectRole from "./pages/SelectRole";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import EmailConfirm from "./pages/EmailConfirm";

// Lazy load heavy public pages
const HowItWorksPage = lazy(() => import("./pages/HowItWorks"));
const ImpactPage = lazy(() => import("./pages/Impact"));
const PublicFoodMap = lazy(() => import("./pages/PublicFoodMap"));

// Lazy load all protected dashboards (only load when needed)
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminRestaurants = lazy(() => import("./pages/AdminRestaurants"));
const AdminWorkers = lazy(() => import("./pages/AdminWorkers"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const RestaurantDashboard = lazy(() => import("./pages/RestaurantDashboard"));
const RestaurantDonations = lazy(() => import("./pages/RestaurantDonations"));
const RestaurantCenters = lazy(() => import("./pages/RestaurantCenters"));
const WorkerDashboard = lazy(() => import("./pages/WorkerDashboard"));
const WorkerPickups = lazy(() => import("./pages/WorkerPickups"));
const WorkerDistributions = lazy(() => import("./pages/WorkerDistributions"));
const PublicDashboard = lazy(() => import("./pages/PublicDashboard"));

// Loading fallback component
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

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <GlobalBackground />
            <AuthProvider>
                <TooltipProvider>
                    <CommandPalette />
                    <Toaster />
                    <Sonner />
                    <Routes>
                        {/* Public Routes with Customer Layout (Default) */}
                        <Route element={<CustomerLayout />}>
                            <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
                            <Route path="/join-us" element={<JoinUs />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/how-it-works" element={<Suspense fallback={<PageLoader />}><HowItWorksPage /></Suspense>} />
                            <Route path="/impact" element={<Suspense fallback={<PageLoader />}><ImpactPage /></Suspense>} />
                            <Route path="/food-map" element={<Suspense fallback={<PageLoader />}><PublicFoodMap /></Suspense>} />
                        </Route>

                        {/* Auth Routes */}
                        <Route path="/select-role" element={<SelectRole />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/auth" element={<Navigate to="/select-role" replace />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />
                        <Route path="/auth/confirm" element={<EmailConfirm />} />
                        <Route path="/portal/:type/login" element={<Navigate to="/select-role" replace />} />

                        {/* Owner / Admin Portal */}
                        <Route path="/owner" element={<OwnerLayout />}>
                            <Route
                                path="dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <Suspense fallback={<PageLoader />}>
                                            <AdminDashboard />
                                        </Suspense>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="restaurants"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <Suspense fallback={<PageLoader />}>
                                            <AdminRestaurants />
                                        </Suspense>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="workers"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <Suspense fallback={<PageLoader />}>
                                            <AdminWorkers />
                                        </Suspense>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="analytics"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <Suspense fallback={<PageLoader />}>
                                            <AdminAnalytics />
                                        </Suspense>
                                    </ProtectedRoute>
                                }
                            />
                        </Route>

                        {/* Legacy Admin Route Redirect */}
                        <Route path="/admin/dashboard" element={<Navigate to="/owner/dashboard" replace />} />

                        {/* Restaurant Portal */}
                        <Route path="/restaurant" element={<RestaurantLayout />}>
                            <Route
                                path="dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['restaurant', 'admin']}>
                                        <Suspense fallback={<PageLoader />}>
                                            <RestaurantDashboard />
                                        </Suspense>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="donations"
                                element={
                                    <ProtectedRoute allowedRoles={['restaurant', 'admin']}>
                                        <Suspense fallback={<PageLoader />}>
                                            <RestaurantDonations />
                                        </Suspense>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="centers"
                                element={
                                    <ProtectedRoute allowedRoles={['restaurant', 'admin']}>
                                        <Suspense fallback={<PageLoader />}>
                                            <RestaurantCenters />
                                        </Suspense>
                                    </ProtectedRoute>
                                }
                            />
                        </Route>

                        {/* Worker Portal */}
                        <Route path="/worker" element={<WorkerLayout />}>
                            <Route
                                path="dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['worker', 'admin']}>
                                        <Suspense fallback={<PageLoader />}>
                                            <WorkerDashboard />
                                        </Suspense>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="pickups"
                                element={
                                    <ProtectedRoute allowedRoles={['worker', 'admin']}>
                                        <Suspense fallback={<PageLoader />}>
                                            <WorkerPickups />
                                        </Suspense>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="distributions"
                                element={
                                    <ProtectedRoute allowedRoles={['worker', 'admin']}>
                                        <Suspense fallback={<PageLoader />}>
                                            <WorkerDistributions />
                                        </Suspense>
                                    </ProtectedRoute>
                                }
                            />
                        </Route>

                        {/* Customer Portal (Protected Area) */}
                        <Route path="/customer" element={<CustomerLayout />}>
                            <Route
                                path="dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['public', 'customer', 'admin']}>
                                        <Suspense fallback={<PageLoader />}>
                                            <PublicDashboard />
                                        </Suspense>
                                    </ProtectedRoute>
                                }
                            />
                        </Route>

                        {/* Requested Dashboard Aliases */}
                        <Route path="/admin-dashboard" element={<Navigate to="/owner/dashboard" replace />} />
                        <Route path="/restaurant-dashboard" element={<Navigate to="/restaurant/dashboard" replace />} />
                        <Route path="/worker-dashboard" element={<Navigate to="/worker/dashboard" replace />} />
                        <Route path="/public-dashboard" element={<Navigate to="/customer/dashboard" replace />} />

                        {/* Redirect based on role */}
                        <Route path="/dashboard" element={<DashboardRedirect />} />

                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </TooltipProvider>
            </AuthProvider>
        </BrowserRouter>
    </QueryClientProvider >
);

// Component to redirect to appropriate dashboard based on user role
function DashboardRedirect() {
    const { profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return <Navigate to="/select-role" replace />;
    }

    // Redirect based on role
    switch (profile.role) {
        case 'admin':
            return <Navigate to="/owner/dashboard" replace />;
        case 'restaurant':
            return <Navigate to="/restaurant/dashboard" replace />;
        case 'worker':
            return <Navigate to="/worker/dashboard" replace />;
        default: // public/customer
            return <Navigate to="/customer/dashboard" replace />;
    }
}

export default App;
