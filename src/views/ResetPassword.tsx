'use client';

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import "./Signup.css";
import Grid from '@mui/material/Grid2';
import { Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useLoader } from '../contexts/LoaderContext';
import toast from 'react-hot-toast';
import { resetPassword, validateResetToken } from '../services/api/auth.api.service';

function ResetPassword() {
    const router = useRouter();
    const params = useParams();
    const navigate = (path: string) => router.push(path);
    const token = params?.token as string;

    const { showLoader, hideLoader } = useLoader();

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [submitted, setSubmitted] = useState(false);
    const [tokenStatus, setTokenStatus] = useState<'loading' | 'valid' | 'invalid'>('loading');

    useEffect(() => {
        const checkToken = async () => {
            if (!token) {
                setTokenStatus('invalid');
                return;
            }
            const res = await validateResetToken(token);
            if (res && res.isSuccess) {
                setTokenStatus('valid');
            } else {
                setTokenStatus('invalid');
                toast.error("Invalid or expired reset link.");
                setTimeout(() => navigate('/login'), 3000);
            }
        };
        checkToken();
    }, [token]);

    const validate = () => {
        if (formData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (validate()) {
            showLoader();
            let res: any = await resetPassword(token, formData.newPassword);
            if (res && res.isSuccess) {
                setSubmitted(true);
                toast.success("Password reset successfully!");
            }
            hideLoader();
        }
    }

    const renderContent = () => {
        if (tokenStatus === 'loading') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0', gap: '1rem' }}>
                    <CircularProgress />
                    <Typography variant='body1' color='text.secondary'>Validating your reset link...</Typography>
                </div>
            );
        }

        if (tokenStatus === 'invalid') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0', gap: '1rem' }}>
                    <Typography variant='h6' color='error' fontWeight={600}>Invalid Request</Typography>
                    <Typography variant='body1' color='text.secondary' textAlign='center'>
                        This password reset link is invalid or has expired. Redirecting to login...
                    </Typography>
                    <Button onClick={() => navigate("/login")} variant='contained' sx={{ minHeight: '48px', borderRadius: '8px', textTransform: 'none', fontSize: '1rem', mt: 1 }}>Go to Login</Button>
                </div>
            );
        }

        if (submitted) {
            return (
                <>
                    <Typography variant='body1' marginY={1} sx={{ color: "green", fontWeight: 500 }}>
                        Your password has been reset successfully.
                    </Typography>
                    <Button onClick={() => navigate("/login")} variant='contained' sx={{ width: "100%", minHeight: "48px", borderRadius: '8px', textTransform: 'none', fontSize: '1rem', mt: 2 }}>Go to Login</Button>
                </>
            );
        }

        return (
            <>
                <Typography variant='body1' marginY={1} sx={{ color: "gray", fontSize: { xs: '0.9rem', md: '1.125rem' } }}>Enter your new password below.</Typography>
                <div className='login-form'>
                    <div className='step-one'>
                        <TextField
                            type="password"
                            id="outlined-new-password"
                            value={formData.newPassword}
                            label="New Password"
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            sx={{ marginBottom: "12px", width: "100%" }}
                        />
                        <TextField
                            type="password"
                            id="outlined-confirm-password"
                            value={formData.confirmPassword}
                            label="Confirm Password"
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            sx={{ marginBottom: "12px", width: "100%" }}
                        />
                        <Button onClick={() => handleSubmit()} variant='contained' sx={{ width: "100%", minHeight: "48px", borderRadius: '8px', textTransform: 'none', fontSize: '1rem' }}>Reset Password</Button>
                    </div>
                </div>
            </>
        );
    };

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
                        <div className='right-logo desktop-only'>
                            <img src="/assets/ewns-logo.svg" style={{ width: '100%', maxWidth: '200px' }} alt="logo" />
                        </div>
                        <div className='mobile-auth-hero'>
                            <img src="/assets/ewns-logo.svg" alt="logo" className='mobile-auth-hero-logo' />
                            <img src="assets/signup-left.svg" alt="banner" className='mobile-auth-hero-img' />
                        </div>
                        <div className='signup-part'>
                            <Typography variant='h3' sx={{ margin: '2%', fontSize: { xs: '1.5rem', md: '2.5rem' } }}>Reset Password</Typography>
                        </div>
                        {renderContent()}
                        {tokenStatus === 'valid' && (
                            <>
                                <div style={{ borderTop: "1px solid #e5e7eb", width: "100%", margin: "16px 0" }}></div>
                                <div>
                                    <Button onClick={() => navigate("/login")} variant='outlined' sx={{ width: "100%", minHeight: "48px", borderRadius: '8px', textTransform: 'none', fontSize: '1rem' }}>Back to Login</Button>
                                </div>
                            </>
                        )}
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default ResetPassword