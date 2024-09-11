import React, { useEffect } from 'react'
import { LoaderProvider } from '../contexts/LoaderContext'
import Loader from './Loader'
import { Toaster } from 'react-hot-toast'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import VerifyEmail from '../pages/VerifyEmail'
import ResetPassword from '../pages/ResetPassword'
import ForgotPassword from '../pages/ForgotPassword'
import Signup from '../pages/Signup'
import Login from '../pages/Login'
import Sidebar from './Sidebar'
import useAuth from '../hooks/useAuth'
import Logout from '../pages/Logout'
import AdminDashboard from './admin/AdminDashboard'
import Dashboard from './Dashboard'

function Home() {
    const { isLoggedIn, userRole, checkAuth } = useAuth();
    console.log(isLoggedIn)

    useEffect(() => {
        checkAuth();
    }, [])
    return (
        <div className="App">
            <LoaderProvider>
                <div>
                    <Loader />
                    <Toaster position='top-right' />
                </div>
                <div>
                    <Router>
                        <Routes>
                            {isLoggedIn ? (
                                <>
                                    <Route path="/dashboard" element={<WithSidebar><Dashboard /></WithSidebar>} />
                                    <Route path="/logout" element={<Logout />} />

                                    {userRole === 'ADMIN' && (
                                        <Route path="/admin/dashboard" element={<WithSidebar><AdminDashboard /></WithSidebar>} />
                                    )}
                                    <Route path="*" element={<Navigate to="/dashboard" />} />
                                </>
                            ) : (<>
                                <Route path="/" element={<Signup />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/reset-password/:token" element={<ResetPassword />} />
                                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                                <Route path="*" element={<Navigate to="/login" />} />
                            </>
                            )}


                        </Routes>
                    </Router>
                </div>

            </LoaderProvider>
        </div>
    )
}



const WithSidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { userRole } = useAuth(); // Get user role to pass to Sidebar
    return (
        <div className="app-container">
            <Sidebar userRole={userRole} />
            <div className="main-content">
                {children}
            </div>
        </div>
    );
};

export default Home