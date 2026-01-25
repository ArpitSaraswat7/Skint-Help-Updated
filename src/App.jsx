import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { GlobalBackground } from "@/components/GlobalBackground";

// Layouts
import { CustomerLayout } from "@/layouts/CustomerLayout";
import { RestaurantLayout } from "@/layouts/RestaurantLayout";
import { WorkerLayout } from "@/layouts/WorkerLayout";
import { OwnerLayout } from "@/layouts/OwnerLayout";

// Public Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import JoinUs from "./pages/JoinUs";
import Contact from "./pages/Contact";
import SelectRole from "./pages/SelectRole";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import HowItWorksPage from "./pages/HowItWorks";
import ImpactPage from "./pages/Impact";
import PublicFoodMap from "./pages/PublicFoodMap";

// Protected Dashboards
import AdminDashboard from "./pages/AdminDashboard";
import AdminRestaurants from "./pages/AdminRestaurants";
import AdminWorkers from "./pages/AdminWorkers";
import AdminAnalytics from "./pages/AdminAnalytics";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import RestaurantDonations from "./pages/RestaurantDonations";
import RestaurantCenters from "./pages/RestaurantCenters";
import WorkerDashboard from "./pages/WorkerDashboard";
import WorkerPickups from "./pages/WorkerPickups";
import WorkerDistributions from "./pages/WorkerDistributions";
import PublicDashboard from "./pages/PublicDashboard";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <GlobalBackground />
            <AuthProvider>
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <Routes>
                        {/* Public Routes with Customer Layout (Default) */}
                        <Route element={<CustomerLayout />}>
                            <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
                            <Route path="/join-us" element={<JoinUs />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/how-it-works" element={<HowItWorksPage />} />
                            <Route path="/impact" element={<ImpactPage />} />
                            <Route path="/food-map" element={<PublicFoodMap />} />
                        </Route>

                        {/* Auth Routes */}
                        <Route path="/select-role" element={<SelectRole />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/auth" element={<Navigate to="/select-role" replace />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />
                        <Route path="/portal/:type/login" element={<Navigate to="/select-role" replace />} />

                        {/* Owner / Admin Portal */}
                        <Route path="/owner" element={<OwnerLayout />}>
                            <Route
                                path="dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="restaurants"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminRestaurants />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="workers"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminWorkers />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="analytics"
                                element={
                                    <ProtectedRoute allowedRoles={['admin']}>
                                        <AdminAnalytics />
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
                                        <RestaurantDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="donations"
                                element={
                                    <ProtectedRoute allowedRoles={['restaurant', 'admin']}>
                                        <RestaurantDonations />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="centers"
                                element={
                                    <ProtectedRoute allowedRoles={['restaurant', 'admin']}>
                                        <RestaurantCenters />
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
                                        <WorkerDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="pickups"
                                element={
                                    <ProtectedRoute allowedRoles={['worker', 'admin']}>
                                        <WorkerPickups />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="distributions"
                                element={
                                    <ProtectedRoute allowedRoles={['worker', 'admin']}>
                                        <WorkerDistributions />
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
                                        <PublicDashboard />
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
