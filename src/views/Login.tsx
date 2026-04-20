'use client';

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import "./Login.css";
import "./Signup.css";
import Grid from '@mui/material/Grid2';
import { Button, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useLoader } from '../contexts/LoaderContext';
import toast from 'react-hot-toast';
import useTailwindBreakpoint from '../hooks/useBreakpoint';
import { loginUser } from '../services/api/auth.api.service';
import { useAuth } from '../contexts/AuthContext';

function Login() {
    const router = useRouter();
    const navigate = (path: string) => router.push(path);

    const { showLoader, hideLoader } = useLoader();
    const breakpoint = useTailwindBreakpoint();

    const { login } = useAuth();
    const validate = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            toast.error("Invalid email format.");
            return false;
        }
        return true;
    };

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (validate()) {
            showLoader();
            let res: any = await loginUser(formData);

            if (res && res.isSuccess) {
                login(res.data.token, res.data.userType);

                if (res.data.userType === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else if (res.data.userType === 'MERCHANT') {
                    navigate('/dashboard');
                }
            }
            hideLoader();
        }
    }

    return (
        <div>
            <Grid container spacing={0} sx={{ display: "flex", flexWrap: "wrap", width: "100%", minHeight: "100vh" }} className='login-page'>
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: "none", md: "flex" }, minHeight: "100vh" }}>
                    <div className='left-signup'>
                        <div className='left-theme' style={{ padding: "5%" }}>
                            <div className='left-content'>
                                <Typography variant='h4' color='rgba(1, 82, 168, 1)' sx={{ fontSize: { xs: '28px', md: '40px' } }}>Take Your <span style={{ fontWeight: "bold" }}>Business Online </span>
                                    within minutes !!</Typography>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "5%" }} className='signup-lef-img'>
                                <img src="assets/signup-left.svg" style={{ maxWidth: "100%", height: "auto" }} alt="signup" />
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <div className='right-signup'>
                        {/* Desktop logo */}
                        <div className='right-logo desktop-only'>
                            <img src="/assets/ewns-logo.svg" style={{ height: '40px', width: 'auto' }} alt="logo" />
                        </div>
                        {/* Mobile hero header */}
                        <div className='mobile-auth-hero'>
                            <img src="/assets/ewns-logo.svg" alt="logo" className='mobile-auth-hero-logo' />
                            <img src="assets/signup-left.svg" alt="banner" className='mobile-auth-hero-img' />
                            <Typography variant='body2' sx={{  mt: 1, textAlign: 'center' }}>Take your business online in minutes</Typography>
                        </div>
                        <div className='signup-part'>
                            <Typography variant='h5' sx={{ fontWeight: 700, color: '#111827', fontSize: { xs: '1.5rem', md: '1.75rem' } }}>Log In to your account</Typography>
                        </div>
                        <Typography variant='body2' marginY={0.5} sx={{ color: "#6b7280" }}>It's time to get your business online</Typography>
                        <div className='login-form'>
                            <div className='step-one'>
                                <TextField
                                    type="email"
                                    id="outlined-required-email"
                                    value={formData.email}
                                    label="Email"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    sx={{ marginBottom: "2%", width: "100%" }}
                                />
                                <TextField
                                    type={showPassword ? 'text' : 'password'}
                                    id="outlined-required-password"
                                    label="Password"
                                    sx={{ marginBottom: "2%", width: "100%" }}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    value={formData.password}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button onClick={() => navigate("/forgot-password")} size="small" sx={{ textTransform: 'none', width: "fit-content", padding: "4px 12px", marginBottom: "12px", cursor: "pointer", color: '#1565c0', fontWeight: 500 }}>Forgot Password?</Button>
                                <Button onClick={() => handleLogin()} variant='contained' sx={{ width: "100%", minHeight: "48px", borderRadius: '8px', textTransform: 'none', fontSize: '1rem' }}>Log In</Button>
                            </div>
                        </div>
                        <div style={{ borderTop: "1px solid #e5e7eb", width: "100%", margin: "16px 0" }}></div>
                        <div>
                            <Button onClick={() => navigate("/signup")} variant='outlined' sx={{ width: "100%", minHeight: "48px", borderRadius: '8px', textTransform: 'none', fontSize: '1rem', fontWeight: 600 }}>Create New Account</Button>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default Login