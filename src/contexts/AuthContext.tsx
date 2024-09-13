import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({} as any);

export const AuthProvider = ({ children }: any) => {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    const login = (userToken: string, role: string) => {
        setToken(userToken);
        setRole(role);
        localStorage.setItem("token", userToken);
        localStorage.setItem("userRole", role);
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
    };

    const isAuthenticated = !!(localStorage.getItem("token") && localStorage.getItem("userRole"));

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};