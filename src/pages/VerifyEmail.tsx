import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import "./Login.css";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { fetchPincodeDetails } from '../services/api/postalcode.service';
import { useLoader } from '../contexts/LoaderContext';
import toast from 'react-hot-toast';
import { countryList } from '../utils/constants/country-flag';
import useTailwindBreakpoint from '../hooks/useBreakpoint';
import { loginUser, verifyEmail } from '../services/api/auth.api.service';


function VerifyEmail() {

    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("Verifying your email. Please wait...");

    useEffect(() => {
        async function emailVerify() {
            let res: any = await verifyEmail(token);

            if (res && res.isSuccess) {
                setMessage("Email Verification is completed. Redirecting to Login Page...");
            } else {
                setMessage("Invalid Token. Redirecting to Login Page...");
            }

            setTimeout(() => {
                navigate("/login")
            }, 3000)
        }

        emailVerify();
    }, [])

    const breakpoint = useTailwindBreakpoint();

    return (
        <div><Grid container spacing={0} sx={{ margin: "0px", display: "flex", flexWrap: "wrap", width: "100%", height: "100%" }} className='login-page'>
            <Grid size={6} sx={{ display: breakpoint === "xs" ? "none" : "flex", height: "100%" }} >
                <div className='left-signup '>
                    <div className='left-theme'>
                        <div className='logo'>
                            <img src="/assets/logo.png" width={"200px"} />
                        </div>
                        <div className='left-content'>
                            <Typography variant='h4' color='rgba(1, 82, 168, 1)' fontSize={"40px"} >Take Your <span style={{ fontWeight: "bold" }}>Business Online </span>
                                within minutes !!</Typography>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "5%", height: "100%" }} className='signup-lef-img'>
                            <img src="/assets/signup-left.svg" width={"600px"} height={"660px"} />
                        </div>
                    </div>
                </div>
            </Grid>
            <Grid size={6} sx={{ width: breakpoint === "xs" ? "100%" : "50%" }}>
                <div className='right-signup'>
                    <div className='right-logo'>
                        <img src="/assets/logo.png" width={"200px"} />
                    </div>
                    <div className='signup-part'>
                        <Typography variant={breakpoint === "xs" ? 'h4' : 'h3'} margin="2%">Email Verification</Typography>

                    </div>
                    <Typography variant='h5' marginY={"2%"} sx={{ color: "gray" }}>{message}</Typography>
                </div>
            </Grid>
        </Grid></div>
    )
}

export default VerifyEmail