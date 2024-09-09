import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import AdminDashboard from './components/admin/AdminDashboard';
import Landing from './pages/Landing';
import Sidebar, { SidebarProps } from './components/Sidebar';
import useAuth from './hooks/useAuth';

function App() {
  const { isLoggedIn, userRole } = useAuth();

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/email-verify/:token" element={<VerifyEmail />} />

          {/* Protected routes */}
          {isLoggedIn ? (
            <>
              {/* Common layout for normal and admin */}
              <Route path="/dashboard" element={<WithSidebar><Dashboard /></WithSidebar>} />
              {userRole === 'admin' && (
                <Route path="/admin/dashboard" element={<WithSidebar><AdminDashboard /></WithSidebar>} />
              )}
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </Router>
    </div>
  );
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

export default App;
