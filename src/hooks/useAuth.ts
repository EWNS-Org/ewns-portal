import { useState, useEffect } from 'react';

const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<'ADMIN' | 'MERCHANT' | null>(null);
    useEffect(() => {
        // Retrieve token and role from localStorage
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole') as 'ADMIN' | 'MERCHANT' | null;

        if (token && role) {
            setIsLoggedIn(true);
            setUserRole(role);
        } else {
            setIsLoggedIn(false);
            setUserRole(null);
        }
        console.log(token, role, isLoggedIn)

    }, []);

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
        checkAuth
    };
};

export default useAuth;
