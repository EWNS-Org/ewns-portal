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
import Dashboard from './Dashboard/Dashboard'
import Categories from './Categories/Categories'
import Products from './Products/Products'
import Services from './Services/Services'
import { Album, Analytics, Message } from '@mui/icons-material'
import Appointment from './Appointments/Appointment'
import Profile from './Profile/Profile'
import Subscription from './Subscription/Subscription'
import Themes from './Plugins/Themes/Themes'
import CustomDomain from './Plugins/CustomDomain/CustomDomain'
import Marketing from './Plugins/Marketing/Marketing'
import Account from './Settings/Account/Account'

function Home() {
    const { isLoggedIn, userRole, checkAuth } = useAuth();
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
                                    <Route path="/plugins/themes" element={<WithSidebar><Themes /></WithSidebar>} />
                                    <Route path="/plugins/custom-domain" element={<WithSidebar><CustomDomain /></WithSidebar>} />
                                    <Route path="/plugins/analytics" element={<WithSidebar><Analytics /></WithSidebar>} />
                                    <Route path="/plugins/marketing" element={<WithSidebar><Marketing /></WithSidebar>} />
                                    <Route path="/settings/account" element={<WithSidebar><Account /></WithSidebar>} />
                                    <Route path="/dashboard" element={<WithSidebar><Dashboard /></WithSidebar>} />
                                    <Route path="/categories" element={<WithSidebar><Categories /></WithSidebar>} />
                                    <Route path="/products" element={<WithSidebar><Products /></WithSidebar>} />
                                    <Route path="/services" element={<WithSidebar><Services /></WithSidebar>} />
                                    <Route path="/albums" element={<WithSidebar><Album /></WithSidebar>} />
                                    <Route path="/appointments" element={<WithSidebar><Appointment /></WithSidebar>} />
                                    <Route path="/messages" element={<WithSidebar><Message /></WithSidebar>} />
                                    <Route path="/profile" element={<WithSidebar><Profile /></WithSidebar>} />
                                    <Route path="/subscription" element={<WithSidebar><Subscription /></WithSidebar>} />

                                    <Route path="/logout" element={<Logout />} />

                                    {userRole === 'ADMIN' && (
                                        <Route path="/admin/dashboard" element={<WithSidebar><AdminDashboard /></WithSidebar>} />
                                    )}
                                </>
                            ) : (<>
                                <Route path="/" element={<Signup />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/reset-password/:token" element={<ResetPassword />} />
                                <Route path="/verify-email/:token" element={<VerifyEmail />} />
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