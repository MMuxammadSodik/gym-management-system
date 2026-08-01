import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/Loading/Loading";
import {
    getToken,
    logout,
    validateToken
} from "../services/auth";

function ProtectedRoute() {

    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {

        async function checkAuth() {

            const token = getToken();

            if (!token) {
                setAuthenticated(false);
                setLoading(false);
                return;
            }

            try {

                await validateToken();
                setAuthenticated(true);

            } catch (error) {

                console.error(error);

                logout();
                setAuthenticated(false);

            } finally {

                setLoading(false);

            }

        }

        checkAuth();

    }, []);

    if (loading) {
        return <Loading />;
    }

    if (!authenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;