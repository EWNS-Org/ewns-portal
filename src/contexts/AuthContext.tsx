'use client';

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({} as any);

export const AuthProvider = ({ children }: any) => {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("userRole");
        setToken(storedToken);
        setRole(storedRole);
        // Ensure cookies are in sync with localStorage (e.g. after hard refresh)
        if (storedToken) document.cookie = `token=${storedToken}; path=/; SameSite=Lax`;
        if (storedRole) document.cookie = `userRole=${storedRole}; path=/; SameSite=Lax`;
        setHydrated(true);
    }, []);

    const login = (userToken: string, userRole: string) => {
        setToken(userToken);
        setRole(userRole);
        localStorage.setItem("token", userToken);
        localStorage.setItem("userRole", userRole);
        document.cookie = `token=${userToken}; path=/; SameSite=Lax`;
        document.cookie = `userRole=${userRole}; path=/; SameSite=Lax`;
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "userRole=; path=/; max-age=0";
    };

    const isAuthenticated = hydrated ? !!(token && role) : false;
    const userRole = hydrated ? role : null;

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, hydrated, login, logout }}>
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