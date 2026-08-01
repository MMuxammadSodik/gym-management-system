import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import {
    getToken,
    logout,
    validateToken
} from "../services/auth";

function PublicRoute({ children }) {

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
        return <h2>Loading...</h2>;
    }

    if (authenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default PublicRoute;