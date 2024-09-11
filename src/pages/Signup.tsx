import React, { useEffect, useState } from 'react'
import "./Signup.css";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { fetchPincodeDetails } from '../services/api/postalcode.service';
import { useLoader } from '../contexts/LoaderContext';
import toast from 'react-hot-toast';
import { countryList } from '../utils/country-flag';
import useTailwindBreakpoint from '../hooks/useBreakpoint';
import { register } from '../services/api/auth.api.service';
import { useNavigate } from 'react-router-dom';



function Signup() {
    const navigate = useNavigate()
    const categories = ["General", "Hospital"];
    const [hideNext, setHideNext] = useState(true)

    const { showLoader, hideLoader } = useLoader();
    const breakpoint = useTailwindBreakpoint();

    const validateStep2 = (showToast: boolean) => {

        if (!formData.businessName.trim()) {
            showToast ?? toast.error("Business Name is required.");
            return false;
        }

        if (!categories.includes(formData.category)) {
            showToast ?? toast.error("Invalid business category.");
            return false;
        }

        if (!formData.shortBio.trim()) {
            showToast ?? toast.error("Business Description is required.");
            return false;
        }
        return true;
    };

    const validateStep1 = (showToast: boolean) => {
        if (!formData.name.trim()) {
            showToast ?? toast.error("Full Name is required.");
            return false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            showToast ?? toast.error("Invalid email format.");
            return false;
        }

        if (formData.password.length < 6) {
            showToast ?? toast.error("Password must be at least 6 characters.");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            showToast ?? toast.error("Passwords do not match.");
            return false;
        }

        if (!formData.address.trim()) {
            showToast ?? toast.error("Address is required.");
            return false;
        }

        if (!/^\d{6}$/.test(formData.pincode)) {
            showToast ?? toast.error("Invalid pincode format.");
            return false;
        }
        return true;
    }


    const [showFirstStep, setShowFirstStep] = React.useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        pincode: "",
        state: "",
        city: "",
        country: "",
        businessName: "",
        category: categories[0],
        shortBio: "",
        countryCode: countryList["IN"].dial_code,
        mobileNumber: ""
    });

    useEffect(() => {
        if (showFirstStep) {
            if (validateStep1(false)) {
                setHideNext(false)
            } else {
                setHideNext(true)
            }
        } else {
            if (validateStep2(false)) {
                setHideNext(false)
            } else {
                setHideNext(true)
            }
        }
    }, [formData, showFirstStep])

    const handlePincodeChange = async (e: any) => {
        const updatedPincode = e.target.value;

        setFormData(prevFormData => ({ ...prevFormData, pincode: updatedPincode }));

        if (updatedPincode.length === 6 && /^\d{6}$/.test(updatedPincode)) {
            try {
                showLoader();
                const res: any = await fetchPincodeDetails(updatedPincode);

                setFormData(prevFormData => ({
                    ...prevFormData,
                    city: res.city,
                    country: res.country,
                    state: res.state,
                }));
                hideLoader();
            } catch (error) {
                console.error('Error fetching pincode details:', error);
                hideLoader();
            }
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                city: '',
                country: '',
                state: '',
            }));
        }
    };


    const handleSignup = async () => {
        if (validateStep1(true) && validateStep2(true)) {
            showLoader();
            let res = await register(formData);

            if (res && res.isSuccess) {
                navigate("/login")
            }
            hideLoader();
        }
        hideLoader();

    }

    return (
        <div className='login-page' style={{ height: breakpoint === 'xs' ? "100%" : "1235px" }} >
            <Grid container spacing={0} sx={{ margin: "0px", display: "flex", flexWrap: "wrap", width: "100%", height: "100%" }} >
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
                            {
                                showFirstStep ?
                                    <div style={{ display: "flex", justifyContent: "center", marginTop: "2%", height: "100%" }} className='signup-lef-img'>
                                        <img src="assets/signup-left.svg" alt='signup-left' width={"600px"} height={"100%"} />
                                    </div>
                                    :
                                    <div style={{ display: "flex", justifyContent: "center", marginTop: "2%", height: "100%" }} className='signup-lef-img'>
                                        <img src="assets/signup-second.svg" alt='signup-left2' width={"600px"} height={"100%"} />
                                    </div>
                            }

                        </div>

                    </div>
                </Grid>
                <Grid size={6} sx={{ width: breakpoint === "xs" ? "100%" : "50%", height: "100%" }}>
                    <div className='right-signup'>
                        <div className='right-logo'>
                            <img src="assets/logo.png" alt='logo' width={"200px"} />
                        </div>
                        <div className='signup-part'>
                            <Typography onClick={() => setShowFirstStep(true)} variant='h2' sx={{ alignItems: "center", justifyContent: "center", display: !showFirstStep ? "flex" : "none", color: "blue", cursor: "pointer" }}> {"<"} </Typography>
                            <Typography variant={breakpoint === "xs" ? 'h4' : 'h3'} margin="2%">Sign up </Typography>
                            <Typography sx={{ alignItems: "end", justifyContent: "end", display: "flex" }} variant='h5' margin="2%">(Step&nbsp;<strong style={{ color: "blue" }}>{showFirstStep ? "1 " : " 2 "}</strong> &nbsp;of 2)
                            </Typography>
                        </div>
                        <Typography variant='h5' marginY={"2%"} sx={{ color: "gray" }}>It’s time to get your business online</Typography>
                        <div className='signup-form'>
                            {
                                showFirstStep ?
                                    <div className='step-one'>
                                        <TextField
                                            required
                                            id="outlined-required"
                                            label="Full Name"
                                            sx={{ marginBottom: "3%", marginRight: "2%", width: "100%" }}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            value={formData.name}
                                        /><TextField
                                            required
                                            id="outlined-required"
                                            label="Email"
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            value={formData.email}
                                            sx={{ marginBottom: "3%", width: "100%" }}
                                        />
                                        <div style={{ display: "flex" }}>
                                            <TextField
                                                required
                                                id="outlined-required"
                                                label="Password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                sx={{ marginBottom: "2%", marginRight: "2%", width: "60%" }}
                                            /><TextField
                                                required
                                                id="outlined-required"
                                                label="Confirm Password"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                sx={{ marginBottom: "2%", width: "60%" }}
                                            />
                                        </div>

                                        <div style={{ display: "flex", width: "100%", marginBottom: "2%", }}>
                                            <Box sx={{ width: "30%" }}>
                                                <FormControl sx={{ width: "100%", height: "100%" }}>
                                                    <InputLabel id="demo-simple-select-label">Country Code</InputLabel>
                                                    <Select required
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={formData.countryCode}
                                                        label="Country Code"
                                                        onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                                    >
                                                        {Object.keys(countryList).map(cat => <MenuItem key={countryList[cat].dial_code} value={countryList[cat].dial_code}>
                                                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                                <img width={"30px"} height={"30px"} src={countryList[cat].image} />
                                                                <span > &nbsp; &nbsp;{countryList[cat].dial_code + " - " + cat}</span>
                                                            </div></MenuItem>)}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            <TextField
                                                required
                                                id="outlined-required"
                                                label={"Mobile Number"}
                                                value={formData.mobileNumber}
                                                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                                sx={{ margin: " 1% 2%", width: "100%", height: "100%" }}
                                            />
                                        </div>
                                        <TextField
                                            required
                                            value={formData.address}
                                            id="outlined-required"
                                            label="Business Address"
                                            sx={{ marginBottom: "2%", width: "100%", marginRight: "2%" }}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />

                                        <div style={{ display: "flex", justifyContent: "space-between   " }}>
                                            <TextField
                                                type='number'
                                                required
                                                disabled={formData.pincode.length === 6}
                                                id="outlined-required"
                                                label="Zip Code"
                                                sx={{ marginBottom: "2%", marginRight: "2%", width: "50%" }}
                                                value={formData.pincode}
                                                onChange={(e) => handlePincodeChange(e)}
                                            />

                                            <TextField
                                                disabled
                                                id="outlined-required"
                                                label={formData.city || "City"}
                                                value={formData.city}
                                                sx={{ marginBottom: "2%", width: "60%" }}
                                            />
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <TextField
                                                disabled
                                                id="outlined-required"
                                                value={formData.state}
                                                label={formData.state || "State"}
                                                sx={{ marginBottom: "2%", marginRight: "2%", width: "60%" }}
                                            /><TextField
                                                disabled
                                                id="outlined-required"
                                                label={formData.country || "Country"}
                                                sx={{ marginBottom: "2%", width: "60%" }}
                                                value={formData.country}
                                            />
                                        </div>
                                        {formData.pincode.length === 6 && <Button onClick={() => setFormData({ ...formData, pincode: '', city: '', state: '', country: '' })} sx={{ border: "1px solid blue", width: "fit-content", padding: "0.5% 2%", marginBottom: "2%", cursor: "pointer" }}>change pincode</Button>}
                                        <Button disabled={hideNext} onClick={() => setShowFirstStep(false)} variant='contained' sx={{ width: "100%", height: "15%" }}>Next</Button>
                                    </div> :
                                    <div>
                                        <TextField
                                            required
                                            id="outlined-required"
                                            label="Business Name"
                                            sx={{ marginBottom: "2%", width: "100%" }}
                                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                            value={formData.businessName}
                                        />
                                        <TextField
                                            required
                                            id="outlined-required"
                                            label="Business Description"
                                            multiline
                                            rows={4}
                                            sx={{ marginBottom: "2%", width: "100%" }}
                                            onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
                                            value={formData.shortBio}
                                        />
                                        <Box sx={{ minWidth: 120, marginY: "2%" }}>
                                            <FormControl sx={{ width: "100%" }}>
                                                <InputLabel id="demo-simple-select-label">Business Category</InputLabel>
                                                <Select required
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={formData.category}
                                                    label="Business Category"
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                >
                                                    {categories.map(cat => <MenuItem value={cat}>{cat}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                        <Button disabled={hideNext} onClick={() => handleSignup()} variant='contained' sx={{ width: "100%", height: "15%" }}>Sign up</Button>

                                    </div>
                            }
                        </div>
                        <div style={{ marginTop: "3%" }}>
                            <Typography variant={breakpoint === 'xs' ? 'caption' : 'h6'}>Already have an account ? &nbsp;<a href="/login" style={{ color: "blue" }}>Log In here</a></Typography>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div >
    )
}

export default Signup