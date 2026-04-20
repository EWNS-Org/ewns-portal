'use client';

import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import "./Signup.css";
import Grid from '@mui/material/Grid2';
import { Button, TextField, Typography } from '@mui/material';
import { useLoader } from '../contexts/LoaderContext';
import toast from 'react-hot-toast';
import useTailwindBreakpoint from '../hooks/useBreakpoint';
import { resetPassword } from '../services/api/auth.api.service';

function ResetPassword() {
    const router = useRouter();
    const params = useParams();
    const navigate = (path: string) => router.push(path);
    const token = params?.token as string;

    const { showLoader, hideLoader } = useLoader();
    const breakpoint = useTailwindBreakpoint();

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [submitted, setSubmitted] = useState(false);

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
                        <div className='right-logo'>
                            <img src="/assets/ewns-logo.svg" style={{ width: '100%', maxWidth: '200px' }} alt="logo" />
                        </div>
                        <div className='signup-part'>
                            <Typography variant={breakpoint === "xs" ? 'h4' : 'h3'} margin="2%">Reset Password</Typography>
                        </div>
                        {!submitted ? (
                            <>
                                <Typography variant='h6' marginY={"2%"} sx={{ color: "gray" }}>Enter your new password below.</Typography>
                                <div className='login-form'>
                                    <div className='step-one'>
                                        <TextField
                                            type="password"
                                            id="outlined-new-password"
                                            value={formData.newPassword}
                                            label="New Password"
                                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                            sx={{ marginBottom: "3%", width: "100%" }}
                                        />
                                        <TextField
                                            type="password"
                                            id="outlined-confirm-password"
                                            value={formData.confirmPassword}
                                            label="Confirm Password"
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            sx={{ marginBottom: "3%", width: "100%" }}
                                        />
                                        <Button onClick={() => handleSubmit()} variant='contained' sx={{ width: "100%", height: "50px" }}>Reset Password</Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Typography variant='h6' marginY={"2%"} sx={{ color: "green" }}>
                                    Your password has been reset successfully.
                                </Typography>
                                <Button onClick={() => navigate("/login")} variant='contained' sx={{ width: "100%", height: "50px", marginTop: "2%" }}>Go to Login</Button>
                            </>
                        )}
                        <div style={{ borderTop: "1px solid #ccc", width: "100%", margin: "2% 0" }}></div>
                        <div>
                            <Button onClick={() => navigate("/login")} variant='outlined' sx={{ width: "100%", height: "50px" }}>Back to Login</Button>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default ResetPassword