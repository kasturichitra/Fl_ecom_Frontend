import { Navigate, Outlet } from "react-router-dom";
import { useAuthGetMe } from "../hooks/useAuth";

const PublicRoute = () => {
    const { isAuthenticated, isLoading } = useAuthGetMe();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-3xl font-bold text-indigo-600 animate-pulse">
                    Loading...
                </div>
            </div>
        );
    }

    // If already authenticated, redirect to home/dashboard
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Otherwise, render the public/auth page
    return <Outlet />;
};

export default PublicRoute;
