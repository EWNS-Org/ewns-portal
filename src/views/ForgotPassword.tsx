'use client';

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import "./Signup.css";
import Grid from '@mui/material/Grid2';
import { Button, TextField, Typography } from '@mui/material';
import { useLoader } from '../contexts/LoaderContext';
import toast from 'react-hot-toast';
import useTailwindBreakpoint from '../hooks/useBreakpoint';
import { forgotPassword } from '../services/api/auth.api.service';

function ForgotPassword() {
    const router = useRouter();
    const navigate = (path: string) => router.push(path);

    const { showLoader, hideLoader } = useLoader();
    const breakpoint = useTailwindBreakpoint();

    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const validate = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            toast.error("Invalid email format.");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (validate()) {
            showLoader();
            let res: any = await forgotPassword(email);
            if (res) {
                setSubmitted(true);
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
                                <Typography variant='h4' color='rgba(1, 82, 168, 1)' fontSize={"40px"}>Take Your <span style={{ fontWeight: "bold" }}>Business Online </span>
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
                        <div className='right-logo desktop-only'>
                            <img src="/assets/ewns-logo.svg" style={{ width: '100%', maxWidth: '200px' }} alt="logo" />
                        </div>
                        <div className='mobile-auth-hero'>
                            <img src="/assets/ewns-logo.svg" alt="logo" className='mobile-auth-hero-logo' />
                            <img src="assets/signup-left.svg" alt="banner" className='mobile-auth-hero-img' />
                            <Typography variant='body2' sx={{ color: 'rgba(255,255,255,0.85)', mt: 1, textAlign: 'center' }}>Take your business online in minutes</Typography>
                        </div>
                        <div className='signup-part'>
                            <Typography variant='h3' sx={{ margin: '2%', fontSize: { xs: '1.5rem', md: '2.5rem' } }}>Forgot Password</Typography>
                        </div>
                        {!submitted ? (
                            <>
                                <Typography variant='body1' marginY={1} sx={{ color: "gray", fontSize: { xs: '0.9rem', md: '1.125rem' } }}>Enter your email address and we'll send you a link to reset your password.</Typography>
                                <div className='login-form'>
                                    <div className='step-one'>
                                        <TextField
                                            type="email"
                                            id="outlined-required-email"
                                            value={email}
                                            label="Email"
                                            onChange={(e) => setEmail(e.target.value)}
                                            sx={{ marginBottom: "3%", width: "100%" }}
                                        />
                                        <Button onClick={() => handleSubmit()} variant='contained' sx={{ width: "100%", height: "48px", borderRadius: '8px', textTransform: 'none', fontSize: '1rem' }}>Send Reset Link</Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Typography variant='h6' marginY={"2%"} sx={{ color: "green" }}>
                                If an account exists with that email, a password reset link has been sent. Please check your inbox.
                            </Typography>
                        )}
                        <div style={{ borderTop: "1px solid #e5e7eb", width: "100%", margin: "16px 0" }}></div>
                        <div>
                            <Button onClick={() => navigate("/login")} variant='outlined' sx={{ width: "100%", height: "48px", borderRadius: '8px', textTransform: 'none', fontSize: '1rem' }}>Back to Login</Button>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default ForgotPassword