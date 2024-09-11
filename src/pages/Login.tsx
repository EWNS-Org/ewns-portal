import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./Login.css";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { fetchPincodeDetails } from '../services/api/postalcode.service';
import { useLoader } from '../contexts/LoaderContext';
import toast from 'react-hot-toast';
import { countryList } from '../utils/country-flag';
import useTailwindBreakpoint from '../hooks/useBreakpoint';
import { loginUser } from '../services/api/auth.api.service';
import useAuth from '../hooks/useAuth';

function Login() {
    const navigate = useNavigate();

    const { showLoader, hideLoader } = useLoader();
    const breakpoint = useTailwindBreakpoint();

    const { login, checkAuth, userRole } = useAuth();
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
        <div><div style={{ height: breakpoint === 'xs' ? "100%" : "1235px" }} >
            <Grid container spacing={0} sx={{ margin: "0px", display: "flex", flexWrap: "wrap", width: "100%", height: "100%" }} className='login-page'>
                <Grid size={6} sx={{ display: breakpoint === "xs" ? "none" : "flex", height: "100%" }} >
                    <div className='left-signup '>
                        <div className='left-theme'>
                            <div className='logo'>
                                <img src="assets/logo.png" width={"200px"} />
                            </div>
                            <div className='left-content'>
                                <Typography variant='h4' color='rgba(1, 82, 168, 1)' fontSize={"40px"} >Take Your <span style={{ fontWeight: "bold" }}>Business Online </span>
                                    within minutes !!</Typography>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "5%", height: "100%" }} className='signup-lef-img'>
                                <img src="assets/signup-left.svg" width={"600px"} height={"660px"} />
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid size={6} sx={{ width: breakpoint === "xs" ? "100%" : "50%" }}>
                    <div className='right-signup'>
                        <div className='right-logo'>
                            <img src="assets/logo.png" width={"200px"} />
                        </div>
                        <div className='signup-part'>
                            <Typography variant={breakpoint === "xs" ? 'h4' : 'h3'} margin="2%">Log In to your account</Typography>

                        </div>
                        <Typography variant='h5' marginY={"2%"} sx={{ color: "gray" }}>It’s time to get your business online</Typography>
                        <div className='login-form'>
                            <div className='step-one'>
                                <TextField
                                    type="email"
                                    id="outlined-required"
                                    value={formData.email}
                                    label="Email"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    sx={{ marginBottom: "2%", marginRight: "2%", width: "100%" }}
                                /><TextField
                                    type="password"
                                    id="outlined-required"
                                    label="Password"
                                    sx={{ marginBottom: "2%", width: "100%%" }}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    value={formData.password}
                                />
                                {<Button onClick={() => navigate("/forgot-password")} sx={{ border: "1px solid blue", width: "fit-content", padding: "0.5% 2%", marginBottom: "2%", cursor: "pointer" }}>Forgot Password</Button>}
                                <Button onClick={() => handleLogin()} variant='contained' sx={{ width: "100%", height: "15%" }}>Log In</Button>
                            </div>
                        </div>
                        <div style={{ border: "0.5px  gray", width: "80%", margin: "2% 5%" }}></div>
                        <div style={{}}>
                            <Button onClick={() => navigate("/")} variant='contained' sx={{ width: "100%", height: "100%" }}>Create New Account</Button>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div ></div>
    )
}

export default Login