import { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser } from "../services/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function refreshUser() {

        setLoading(true);

        try {

            const currentUser = await getCurrentUser();

            setUser(currentUser);

        } catch (error) {

            console.error(error);

            setUser(null);

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        refreshUser();

    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}