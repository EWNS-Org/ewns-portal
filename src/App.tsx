import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import AdminDashboard from './components/admin/AdminDashboard';
import Landing from './pages/Landing';
import Sidebar from './components/Sidebar';
import useAuth from './hooks/useAuth';
import { LoaderProvider } from './contexts/LoaderContext';
import Loader from './components/Loader';
import { Toaster } from 'react-hot-toast';
import Logout from './pages/Logout';
import Home from './components/Home';

function App() {

  return (
    <Home />
  );
}


export default App;
