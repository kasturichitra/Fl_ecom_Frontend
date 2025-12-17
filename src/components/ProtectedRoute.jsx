import { Navigate, Outlet } from "react-router-dom";
import { useAuthGetMe } from "../hooks/useAuth";

const ProtectedRoute = () => {
    // const { data, isLoading, isError } = useAuthGetMe();

    const {isAuthenticated, isLoading, isError} = useAuthGetMe();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-3xl font-bold text-indigo-600 animate-pulse">
                    Loading...
                </div>
            </div>
        );
    }

    // If there's an error or no data, redirect to login
    if (isError || !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
