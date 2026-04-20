'use client';

import React, { useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { useRouter } from 'next/navigation';

function Logout() {

    const { logout } = useAuth();
    const router = useRouter();
    const navigate = (path: string) => router.push(path);
    useEffect(() => {
        logout();
        navigate('/login');
    }, [])
    return (
        <div>Logout</div>
    )
}

export default Logout