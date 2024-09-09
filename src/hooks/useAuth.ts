import { useState, useEffect } from 'react';

const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);

    useEffect(() => {
        // Example: Fetch authentication status and user role from API or localStorage
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole'); // Example: 'admin' or 'user'

        if (token) {
            setIsLoggedIn(true);
            setUserRole(role === 'admin' ? 'admin' : 'user');
        } else {
            setIsLoggedIn(false);
            setUserRole(null);
        }
    }, []);

    return { isLoggedIn, userRole };
};

export default useAuth;