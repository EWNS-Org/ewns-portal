import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, BrowserRouter } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import AdminDashboard from './components/admin/AdminDashboard';
import Landing from './pages/Landing';
import Sidebar from './components/common/Sidebar';
import useAuth from './hooks/useAuth';
import { LoaderProvider, useLoader } from './contexts/LoaderContext';
import Loader from './components/common/Loader';
import { Toaster } from 'react-hot-toast';
import Logout from './pages/Logout';
import Categories from './components/Categories/Categories';
import Products from './components/Products/Products';
import Services from './components/Services/Services';
import { Album, Analytics, Message } from '@mui/icons-material';
import Appointment from './components/Appointments/Appointment';
import Profile from './components/Profile/Profile';
import Subscription from './components/Subscription/Subscription';
import Themes from './components/Plugins/Themes/Themes';
import CustomDomain from './components/Plugins/CustomDomain/CustomDomain';
import Marketing from './components/Plugins/Marketing/Marketing';
import Account from './components/Settings/Account/Account';
import Albums from './components/Albums/Album';
import Messages from './components/Messages/Messages';
import AnalyticsComponent from './components/Plugins/Analytics/Analytics';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  useEffect(() => {
    let token = localStorage.getItem("token");
    let role = localStorage.getItem("userRole");

    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);


  useEffect(() => {
    if (isLoggedIn === false) {
      window.location.href = "/login"
    }
  }, [isLoggedIn]);

  if (isLoggedIn === null) {
    return <></>;
  } else {
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute isLoggedIn={isLoggedIn}><Signup /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute isLoggedIn={isLoggedIn}><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute isLoggedIn={isLoggedIn}><Signup /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute isLoggedIn={isLoggedIn}><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<PublicRoute isLoggedIn={isLoggedIn}><ResetPassword /></PublicRoute>} />
        <Route path="/verify-email/:token" element={<PublicRoute isLoggedIn={isLoggedIn}><VerifyEmail /></PublicRoute>} />

        {/* Private Routes */}
        <Route path="/dashboard" element={<PrivateRoute isLoggedIn={isLoggedIn}><Sidebar userRole={userRole}><Dashboard /></Sidebar></PrivateRoute>} />
        <Route path="/categories" element={<PrivateRoute isLoggedIn={isLoggedIn}><Sidebar userRole={userRole}><Categories /></Sidebar></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute isLoggedIn={isLoggedIn}><Sidebar userRole={userRole}><Products /></Sidebar></PrivateRoute>} />
        <Route path="/services" element={<PrivateRoute isLoggedIn={isLoggedIn}><Sidebar userRole={userRole}><Services /></Sidebar></PrivateRoute>} />
        <Route path="/albums" element={<PrivateRoute isLoggedIn={isLoggedIn}><Sidebar userRole={userRole}><Albums /></Sidebar></PrivateRoute>} />
        <Route path="/appointments" element={<PrivateRoute isLoggedIn={isLoggedIn}><Sidebar userRole={userRole}><Appointment /></Sidebar></PrivateRoute>} />
        <Route path="/messages" element={<PrivateRoute isLoggedIn={isLoggedIn}><Sidebar userRole={userRole}><Messages /></Sidebar></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute isLoggedIn={isLoggedIn}><Sidebar userRole={userRole}><Profile /></Sidebar></PrivateRoute>} />
        <Route path="/subscription" element={<PrivateRoute isLoggedIn={isLoggedIn}><Sidebar userRole={userRole}><Subscription /></Sidebar></PrivateRoute>} />
        <Route path="/logout" element={<PrivateRoute isLoggedIn={isLoggedIn}><Logout /></PrivateRoute>} />

        {/* Plugin Routes */}
        <Route path="/plugins/themes" element={<PrivateRoute isLoggedIn={isLoggedIn}><Sidebar userRole={userRole}><Themes /></Sidebar></PrivateRoute>} />
        <Route path="/plugins/custom-domain" element={<PrivateRoute isLoggedIn={isLoggedIn}><Sidebar userRole={userRole}><CustomDomain /></Sidebar></PrivateRoute>} />
        <Route path="/plugins/analytics" element={<PrivateRoute isLoggedIn={isLoggedIn}><Sidebar userRole={userRole}><AnalyticsComponent /></Sidebar></PrivateRoute>} />
        <Route path="/plugins/marketing" element={<PrivateRoute isLoggedIn={isLoggedIn}><Sidebar userRole={userRole}><Marketing /></Sidebar></PrivateRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<PrivateRoute isLoggedIn={isLoggedIn && userRole === 'ADMIN'}><Sidebar userRole={userRole}><AdminDashboard /></Sidebar></PrivateRoute>} />

        {/* Account Settings */}
        <Route path="/settings/your-account" element={<PrivateRoute isLoggedIn={isLoggedIn}><Sidebar userRole={userRole}><Account /></Sidebar></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}


const PrivateRoute = ({ isLoggedIn, children }: any) => {
  console.log(children, isLoggedIn);
  debugger
  return isLoggedIn ? children : <Navigate to="/dashboard" />;
};

const PublicRoute = ({ isLoggedIn, children }: any) => {

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default App;
