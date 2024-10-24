import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  BrowserRouter,
} from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Seo from "./components/SEO/SEO";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import AdminDashboard from "./components/admin/AdminDashboard";
import Landing from "./pages/Landing";
import Sidebar from "./components/common/Sidebar";
import { LoaderProvider, useLoader } from "./contexts/LoaderContext";
import Loader from "./components/common/Loader";
import { Toaster } from "react-hot-toast";
import Logout from "./pages/Logout";
import Categories from "./components/Categories/Categories";
import Products from "./components/Products/Products";
import Services from "./components/Services/Services";
import { Album, Analytics, Message } from "@mui/icons-material";
import Appointment from "./components/Appointments/Appointment";
import Profile from "./components/Profile/Profile";
import Subscription from "./components/Subscription/Subscription";
import Themes from "./components/Plugins/Themes/Themes";
import CustomDomain from "./components/Plugins/CustomDomain/CustomDomain";
import Marketing from "./components/Plugins/Marketing/Marketing";
import Account from "./components/Settings/Account/Account";
import Albums from "./components/Albums/Album";
import Messages from "./components/Messages/Messages";
import { AuthProvider } from "./contexts/AuthContext";
import AnalyticsComponent from "./components/Plugins/Analytics/Analytics";
import Testimonials from "./components/Testimonials/Testimonials";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (!token || !role) {
      localStorage.clear();
    }
    setIsLoading(false); // Now we can render the app
  }, []);

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
              <Sidebar>
                <div className="mainContentContainer">
                  <Dashboard />
                </div>
              </Sidebar>
            }
          />
          <Route
            path="/settings/seo"
            element={
              <Sidebar>
                <div className="mainContentContainer">
                  <Seo />
                </div>
              </Sidebar>
            }
          />
          <Route
            path="/categories"
            element={
              <Sidebar>
                <Categories />
              </Sidebar>
            }
          />
          <Route
            path="/products"
            element={
              <Sidebar>
                <Products />
              </Sidebar>
            }
          />
          <Route
            path="/albums"
            element={
              <Sidebar>
                <Albums />
              </Sidebar>
            }
          />
          <Route
            path="/services"
            element={
              <Sidebar>
                <Services />
              </Sidebar>
            }
          />
          <Route
            path="/appointments"
            element={
              <Sidebar>
                <Appointment />
              </Sidebar>
            }
          />
          <Route
            path="/messages"
            element={
              <Sidebar>
                <Messages />
              </Sidebar>
            }
          />
          <Route
            path="/profile"
            element={
              <Sidebar>
                <div className="mainContentContainer">
                  <Profile />
                </div>
              </Sidebar>
            }
          />
          <Route
            path="/testimonials"
            element={
              <Sidebar>
                <Testimonials />
              </Sidebar>
            }
          />
          <Route
            path="/subscription"
            element={
              <Sidebar>
                <Subscription />
              </Sidebar>
            }
          />
          <Route
            path="/logout"
            element={
              <Sidebar>
                <Logout />
              </Sidebar>
            }
          />
          <Route
            path="/plugins/themes"
            element={
              <Sidebar>
                <Themes />
              </Sidebar>
            }
          />
          <Route
            path="/plugins/custom-domain"
            element={
              <Sidebar>
                <CustomDomain />
              </Sidebar>
            }
          />
          <Route
            path="/plugins/analytics"
            element={
              <Sidebar>
                <AnalyticsComponent />
              </Sidebar>
            }
          />
          <Route
            path="/plugins/marketing"
            element={
              <Sidebar>
                <Marketing />
              </Sidebar>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <Sidebar>
                <AdminDashboard />
              </Sidebar>
            }
          />
          <Route
            path="/settings/your-account"
            element={
              <Sidebar>
                <Account />
              </Sidebar>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
