import React from 'react'
import { Link } from 'react-router-dom'
import "./Login.css";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import { Typography } from '@mui/material';



function Login() {
    return (
        <div>
            <Grid container spacing={0} sx={{ margin: "0px" }}>
                <Grid size={6}>
                    <div className='left-signup'>
                        <div className='left-theme'>
                            <div className='logo'>
                                <img src="assets/logo.png" />
                            </div>
                            <div className='left-content'>
                                <Typography variant='h4' color='rgba(1, 82, 168, 1)' fontSize={"40px"} >Take Your <span style={{ fontWeight: "bold" }}>Business Online </span>
                                    within minutes !!</Typography>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "10%" }} className='signup-lef-img'>
                                <img src="assets/signup-left.svg" />
                            </div>
                        </div>

                    </div>
                </Grid>
                <Grid size={6}>
                    <div className='right-signup'></div>
                </Grid>
            </Grid>
        </div>
    )
}

export default Login