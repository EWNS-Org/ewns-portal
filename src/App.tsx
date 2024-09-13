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
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AnalyticsComponent from './components/Plugins/Analytics/Analytics';


function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isAuthenticated, logout } = useAuth(); // Getting from context

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (!token || !role) {
      logout();
    }
    setIsLoading(false); // Now we can render the app
  }, [logout]);

  if (isLoading) {
    // Loading state until auth state is checked
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute
                element={
                  <Sidebar>
                    <Dashboard />
                  </Sidebar>
                }
              />
            }
          />
          <Route
            path="/categories"
            element={
              <PrivateRoute
                element={
                  <Sidebar>
                    <Categories />
                  </Sidebar>
                }
              />
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute
                element={
                  <Sidebar>
                    <Products />
                  </Sidebar>
                }
              />
            }
          />
          <Route
            path="/services"
            element={
              <PrivateRoute
                element={
                  <Sidebar>
                    <Services />
                  </Sidebar>
                }
              />
            }
          />
          <Route
            path="/appointments"
            element={
              <PrivateRoute
                element={
                  <Sidebar>
                    <Appointment />
                  </Sidebar>
                }
              />
            }
          />
          <Route
            path="/messages"
            element={
              <PrivateRoute
                element={
                  <Sidebar>
                    <Messages />
                  </Sidebar>
                }
              />
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute
                element={
                  <Sidebar>
                    <Profile />
                  </Sidebar>
                }
              />
            }
          />
          <Route
            path="/subscription"
            element={
              <PrivateRoute
                element={
                  <Sidebar>
                    <Subscription />
                  </Sidebar>
                }
              />
            }
          />
          <Route
            path="/logout"
            element={
              <PrivateRoute
                element={
                  <Sidebar>
                    <Logout />
                  </Sidebar>
                }
              />
            }
          />
          <Route
            path="/plugins/themes"
            element={
              <PrivateRoute
                element={
                  <Sidebar>
                    <Themes />
                  </Sidebar>
                }
              />
            }
          />
          <Route
            path="/plugins/custom-domain"
            element={
              <PrivateRoute
                element={
                  <Sidebar>
                    <CustomDomain />
                  </Sidebar>
                }
              />
            }
          />
          <Route
            path="/plugins/analytics"
            element={
              <PrivateRoute
                element={
                  <Sidebar>
                    <AnalyticsComponent />
                  </Sidebar>
                }
              />
            }
          />
          <Route
            path="/plugins/marketing"
            element={
              <PrivateRoute
                element={
                  <Sidebar>
                    <Marketing />
                  </Sidebar>
                }
              />
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute
                element={
                  <Sidebar>
                    <AdminDashboard />
                  </Sidebar>
                }
              />
            }
          />
          <Route
            path="/settings/your-account"
            element={
              <PrivateRoute
                element={
                  <Sidebar>
                    <Account />
                  </Sidebar>
                }
              />
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter >
  );
}

// PrivateRoute component that checks authentication
const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default App;