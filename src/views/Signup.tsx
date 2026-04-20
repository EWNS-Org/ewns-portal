'use client';

import React, { useEffect, useState } from 'react'
import "./Signup.css";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { Button, Chip, FormControl, IconButton, InputLabel, MenuItem, Select, Step, StepLabel, Stepper, TextField, Typography, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { fetchPincodeDetails } from '../services/api/postalcode.service';
import { useLoader } from '../contexts/LoaderContext';
import toast from 'react-hot-toast';
import { countryList } from '../utils/constants/country-flag';
import useTailwindBreakpoint from '../hooks/useBreakpoint';
import { register } from '../services/api/auth.api.service';
import { useRouter } from 'next/navigation';
import { categories } from '../utils/constants/categories';
import { validateFields } from '../Helpers/common.helper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



function Signup() {
    const router = useRouter()
    const navigate = (path: string) => router.push(path)
    const [hideNext, setHideNext] = useState(true)

    const { showLoader, hideLoader } = useLoader();
    const breakpoint = useTailwindBreakpoint();

    const [showStep, setShowStep] = React.useState<number>(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        addressLine1: "",
        addressLine2: "",
        pincode: "",
        state: "",
        city: "",
        landmark: "",
        country: "",
        businessName: "",
        category: categories[0],
        shortBio: "",
        countryCode: countryList["IN"].dial_code,
        mobileNumber: "",
        businessType: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        console.log(formData, showStep, validateFields(["name", "email", "password", "confirmPassword", "countryCode", "mobileNumber"], false, formData))
        if (showStep === 1) {
            if (validateFields(["name", "email", "password", "confirmPassword", "countryCode", "mobileNumber"], true, formData)) {
                setHideNext(false)
            } else {
                setHideNext(true)
            }
        } else if(showStep === 2){
            if (validateFields(["addressLine1", "addressLine2", "pincode", "landmark", "city", "state", "country"], false, formData)) {
                setHideNext(false)
            } else {
                setHideNext(true)
            }
        }else if(showStep === 3){
            if (validateFields(["businessName", "category", "shortBio", "businessType"], false, formData)) {
                setHideNext(false)
            } else {
                setHideNext(true)
            }
        }
    }, [formData, showStep])


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
        if (validateFields(["name", "email", "password", "confirmPassword", "address", "pincode", "businessName", "category", "shortBio"], true, formData)) {
            showLoader();
            let res = await register(formData);

            if (res && res.isSuccess) {
                navigate("/login")
            }
            hideLoader();
        }
        hideLoader();

    }

    const handleNext = async () => {
        if(showStep === 3){
            await handleSignup();
        }else{
            setShowStep(showStep + 1)
        }
    }

    return (
        <div className='login-page'>
            <Grid container spacing={0} sx={{ margin: "0px", display: "flex", flexWrap: "wrap", width: "100%", minHeight: "100vh" }} >
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: "none", md: "flex" }, minHeight: "100vh" }} >
                    <div className='left-signup'>
                        <div className='left-theme'>
                            <div className='logo'>
                                <img src="/assets/ewns-logo.svg" style={{ height: '48px', width: 'auto' }} alt="logo" />
                            </div>
                            <div className='left-content'>
                                <Typography variant='h4' color='rgba(1, 82, 168, 1)' sx={{ fontSize: { xs: '28px', md: '40px' } }} >Take Your <span style={{ fontWeight: "bold" }}>Business Online </span>
                                    within minutes !!</Typography>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "2%" }} className='signup-lef-img'>
                                <img src="assets/signup-left.svg" alt='signup-left' style={{ maxWidth: "100%", height: "auto" }} />
                            </div>
                        </div>

                    </div>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <div className='right-signup'>
                        <div className='right-logo'>
                            <img src="/assets/ewns-logo.svg" style={{ height: '48px', width: 'auto' }} alt="logo" />
                        </div>
                        <div className='signup-part' style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                            {showStep > 1 && (
                                <IconButton onClick={() => setShowStep(showStep - 1)} sx={{ color: '#1565c0' }} size="small">
                                    <ArrowBackIcon />
                                </IconButton>
                            )}
                            <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 600 }}>Create Account</Typography>
                        </div>

                        <Stepper activeStep={showStep - 1} alternativeLabel sx={{ my: 2 }}>
                            {['Personal Info', 'Address', 'Business'].map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <div className='signup-form'>
                            {showStep === 1 && <div className='step-one'>
                                        <TextField
                                            required
                                            id="signup-name"
                                            label="Full Name"
                                            size="medium"
                                            sx={{ marginBottom: "12px", width: "100%" }}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            value={formData.name}
                                        />
                                        <TextField
                                            required
                                            id="signup-email"
                                            label="Email"
                                            type="email"
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            value={formData.email}
                                            sx={{ marginBottom: "12px", width: "100%" }}
                                        />
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                                            <TextField
                                                required
                                                id="signup-password"
                                                label="Password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                sx={{ marginBottom: "8px", flex: 1, minWidth: { xs: "100%", sm: "200px" } }}
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
                                            <TextField
                                                required
                                                id="signup-confirm-password"
                                                label="Confirm Password"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                sx={{ marginBottom: "8px", flex: 1, minWidth: { xs: "100%", sm: "200px" } }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                edge="end"
                                                            >
                                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        </div>

                                        <div style={{ display: "flex", flexWrap: "wrap", width: "100%", marginBottom: "8px", gap: "12px" }}>
                                            <FormControl sx={{ width: { xs: "100%", sm: "35%" } }} size="medium">
                                                <InputLabel id="country-code-label">Country Code</InputLabel>
                                                <Select required
                                                    labelId="country-code-label"
                                                    id="country-code-select"
                                                    value={formData.countryCode}
                                                    label="Country Code"
                                                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                                    renderValue={(selected) => {
                                                        const entry = Object.entries(countryList).find(([, v]: [string, any]) => v.dial_code === selected) as [string, any] | undefined;
                                                        if (!entry) return selected;
                                                        return (
                                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                                <img width="20" height="20" src={entry[1].image} alt={entry[0]} style={{ borderRadius: '2px' }} />
                                                                <span>{entry[1].dial_code}</span>
                                                            </div>
                                                        );
                                                    }}
                                                >
                                                    {Object.keys(countryList).map(code => (
                                                        <MenuItem key={countryList[code].dial_code} value={countryList[code].dial_code}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                                <img width="24" height="24" src={countryList[code].image} alt={code} style={{ borderRadius: '2px' }} />
                                                                <span>{countryList[code].dial_code} — {code}</span>
                                                            </div>
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <TextField
                                                required
                                                id="signup-mobile"
                                                label="Mobile Number"
                                                value={formData.mobileNumber}
                                                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                                sx={{ flex: 1, minWidth: { xs: "100%", sm: "180px" } }}
                                            />
                                        </div>

                            </div>}
                            {showStep === 2 && <div className='step-one'>
                                        <TextField
                                        required
                                        value={formData.addressLine1}
                                        id="signup-addr1"
                                        label="Flat / Road / Building / Floor No."
                                        sx={{ marginBottom: "12px", width: "100%" }}
                                        onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                    />
                                    <TextField
                                        required
                                        value={formData.addressLine2}
                                        id="signup-addr2"
                                        label="Building Name / Street Name"
                                        sx={{ marginBottom: "12px", width: "100%" }}
                                        onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                                    />
                                    <TextField
                                        required
                                        value={formData.landmark}
                                        id="signup-landmark"
                                        label="Landmark"
                                        sx={{ marginBottom: "12px", width: "100%" }}
                                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                    />
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                                        <TextField
                                            type='number'
                                            required
                                            disabled={formData.pincode.length === 6}
                                            id="signup-pincode"
                                            label="Zip Code"
                                            sx={{ marginBottom: "12px", flex: 1, minWidth: { xs: "100%", sm: "150px" } }}
                                            value={formData.pincode}
                                            onChange={(e) => handlePincodeChange(e)}
                                        />
                                        <TextField
                                            disabled
                                            id="signup-city"
                                            label="City"
                                            value={formData.city}
                                            sx={{ marginBottom: "12px", flex: 1, minWidth: { xs: "100%", sm: "150px" } }}
                                        />
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                                        <TextField
                                            disabled
                                            id="signup-state"
                                            value={formData.state}
                                            label="State"
                                            sx={{ marginBottom: "12px", flex: 1, minWidth: { xs: "100%", sm: "150px" } }}
                                        />
                                        <TextField
                                            disabled
                                            id="signup-country"
                                            label="Country"
                                            sx={{ marginBottom: "12px", flex: 1, minWidth: { xs: "100%", sm: "150px" } }}
                                            value={formData.country}
                                        />
                                    </div>
                                    {formData.pincode.length === 6 && (
                                        <Button
                                            onClick={() => setFormData({ ...formData, pincode: '', city: '', state: '', country: '' })}
                                            size="small"
                                            sx={{ textTransform: 'none', color: '#1565c0', fontWeight: 500, mb: 1 }}
                                        >
                                            Change Zip Code
                                        </Button>
                                    )}
                            </div>}
                            {showStep === 3 && <div className='step-one'>
                                <TextField
                                    required
                                    id="signup-biz-name"
                                    label="Business Name"
                                    sx={{ marginBottom: "12px", width: "100%" }}
                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                    value={formData.businessName}
                                />
                                <TextField
                                    required
                                    id="signup-biz-desc"
                                    label="Business Description"
                                    multiline
                                    rows={3}
                                    sx={{ marginBottom: "12px", width: "100%" }}
                                    onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
                                    value={formData.shortBio}
                                />
                                <FormControl fullWidth sx={{ marginBottom: "12px" }}>
                                    <InputLabel id="biz-category-label">Business Category</InputLabel>
                                    <Select required
                                        labelId="biz-category-label"
                                        id="biz-category-select"
                                        value={formData.category}
                                        label="Business Category"
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Business Type</Typography>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                    {[
                                        { value: 'SERVICE', label: 'Services' },
                                        { value: 'PRODUCT', label: 'Products' },
                                        { value: 'BOTH', label: 'Both' },
                                    ].map((opt) => (
                                        <Chip
                                            key={opt.value}
                                            label={opt.label}
                                            clickable
                                            onClick={() => setFormData({ ...formData, businessType: opt.value })}
                                            variant={formData.businessType === opt.value ? 'filled' : 'outlined'}
                                            color={formData.businessType === opt.value ? 'primary' : 'default'}
                                            sx={{ fontSize: '0.875rem', px: 1 }}
                                        />
                                    ))}
                                </div>
                            </div>}
                        </div>
                        <Button disabled={hideNext} onClick={handleNext} variant='contained' sx={{ width: "100%", minHeight: "48px", borderRadius: '8px', textTransform: 'none', fontSize: '1rem' }}>
                            {showStep === 3 ? 'Create Account' : 'Next'}
                        </Button>

                        <div style={{ marginTop: "16px" }}>
                            <Typography variant='body2' sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>Already have an account? &nbsp;<a href="/login" style={{ color: "#1565c0", fontWeight: 500 }}>Log In here</a></Typography>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default Signup