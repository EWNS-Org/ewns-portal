'use client';

import { useState, useEffect } from 'react';

const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [userRole, setUserRole] = useState<'ADMIN' | 'MERCHANT' | null>(null);


    // Function to set token and role in localStorage
    const login = (token: string, role: 'ADMIN' | 'MERCHANT') => {

        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);
        setIsLoggedIn(true);
        setUserRole(role);
    };

    // Function to clear auth on logout
    const clearAuth = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setUserRole(null);
    };



    const logout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUserRole(null);
    }

    const checkAuth = () => {
        let token = localStorage.getItem("token");
        let role: any = localStorage.getItem("userRole");

        if (token && role) {
            localStorage.setItem('token', token);
            localStorage.setItem('userRole', role);
            setIsLoggedIn(true);
            setUserRole(role);
            return true;
        } else {
            localStorage.clear();
            return false;
        }
    }

    return {
        isLoggedIn,
        userRole,
        login,
        clearAuth,
        logout,
        checkAuth,
        setIsLoggedIn
    };
};

export default useAuth;
