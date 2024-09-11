import React, { useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom';

function Logout() {

    const { logout } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        logout();
        navigate('/login');
    }, [])
    return (
        <div>Logout</div>
    )
}

export default Logout