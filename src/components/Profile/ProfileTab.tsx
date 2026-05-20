'use client';

import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Button, FormControlLabel, Typography, Switch, SwitchProps, Tooltip, Card } from "@mui/material";
import { categories } from "../../utils/constants/categories";
import { countryList } from "../../utils/constants/country-flag";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/navigation';
import { validateFields } from "../../Helpers/common.helper";
import { ACTIVE_BUSINESS_ID } from "../../utils/constants";
import { getBusinessDetailsAction, toggleBusinessActiveAction, updateBusinessProfileAction } from "../../Redux/Actions/BusinessActions/business.actions";
import { useDispatch } from "react-redux";
import { useLoader } from "../../contexts/LoaderContext";

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: 'rgba(89, 50, 234, 1)',
                opacity: 1,
                border: 0,
                ...theme.applyStyles('dark', {
                    backgroundColor: '#2ECA45',
                }),
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color: theme.palette.grey[100],
            ...theme.applyStyles('dark', {
                color: theme.palette.grey[600],
            }),
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7,
            ...theme.applyStyles('dark', {
                opacity: 0.3,
            }),
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: '#E9E9EA',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
        ...theme.applyStyles('dark', {
            backgroundColor: '#39393D',
        }),
    },
}));

const ProfileTab = ({ setProfileDetails, profileDetails }: any) => {

    const router = useRouter();
    const navigate = (path: string) => router.push(path);
    const dispatch = useDispatch();
    const [profile, setProfile] = React.useState(profileDetails);
    const [hideSubmit, setHideSubmit] = React.useState(true);

    const { showLoader, hideLoader } = useLoader();

    React.useEffect(() => {
        setProfile(profileDetails);
    }, [profileDetails])

    React.useEffect(() => {
        if (JSON.stringify(profile) === JSON.stringify(profileDetails)) {
            setHideSubmit(true);
        } else {
            setHideSubmit(false);
        }
    }, [profile])

    const handleUpdateProfile = async () => {
        let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
        let isFormChanged = JSON.stringify(profileDetails) !== JSON.stringify(profile);
        if (isFormChanged && validateFields(["businessName", "email"], true, profile)) {
            await dispatch(updateBusinessProfileAction(profile, businessId) as any);
            await dispatch(getBusinessDetailsAction(businessId) as any)
        }
        setHideSubmit(true);
    }

    const toggleBusinessActive = async (val: boolean) => {
        showLoader();
        let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
        dispatch(toggleBusinessActiveAction(businessId, val) as any);
        hideLoader();
    }

    return (
        <div className="profile-tab-root">
            <Card className="profile-tab-card">
                <div className="profile-tab-card-inner">
                    {/* Business Profile Information */}
                    <h2 className="profile-section-title">Business Profile Information</h2>

                    <TextField
                        required
                        label="Business Name"
                        value={profile.businessName}
                        onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                        fullWidth
                        sx={{ mb: 2 }}
                    />

                    <div className="profile-row profile-row--thirds">
                        <Tooltip title="Not allowed to change" arrow>
                            <FormControl fullWidth>
                                <InputLabel>Business Category</InputLabel>
                                <Select disabled value={profile.category} label="Business Category">
                                    {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Tooltip>
                        <Tooltip title="Not allowed to change" arrow>
                            <FormControl fullWidth>
                                <InputLabel>Business Type</InputLabel>
                                <Select disabled value={profile.businessType && "BOTH"} label="Business Type">
                                    <MenuItem value="BOTH">Both Products & Services</MenuItem>
                                    <MenuItem value="PRODUCT">Products</MenuItem>
                                    <MenuItem value="SERVICE">Services</MenuItem>
                                </Select>
                            </FormControl>
                        </Tooltip>
                        <Tooltip title="Visit" arrow>
                            <TextField
                                label="Business URL"
                                value={"https://" + profile.url + ""}
                                fullWidth
                                sx={{ input: { cursor: 'pointer' } }}
                                onClick={() => window.open("https://" + profile.url, "_blank")}
                            />
                        </Tooltip>
                    </div>

                    {/* Contact Information */}
                    <h2 className="profile-section-title">Contact Information</h2>

                    <div className="profile-row profile-row--contact">
                        <FormControl className="profile-country-code">
                            <InputLabel>Country Code</InputLabel>
                            <Select
                                required
                                value={profile.countryCode}
                                label="Country Code"
                                onChange={(e) => setProfile({ ...profile, countryCode: e.target.value })}
                            >
                                {Object.keys(countryList).map(cat => (
                                    <MenuItem key={countryList[cat].dial_code} value={countryList[cat].dial_code}>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <img width="30" height="30" src={countryList[cat].image} alt="" />
                                            <span>&nbsp;&nbsp;{countryList[cat].dial_code + " - " + cat}</span>
                                        </div>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            type="number"
                            label="Mobile Number"
                            value={profile.phone}
                            onInput={(e: any) => {
                                e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                            }}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="profile-phone"
                        />
                        <TextField
                            label="Business Email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="profile-email"
                        />
                    </div>

                    {/* Google Business Profile */}
                    <h2 className="profile-section-title">Google Business Profile</h2>

                    <TextField
                        required
                        label="Business Profile URL"
                        value={profile.googleProfileUrl}
                        onChange={(e) => setProfile({ ...profile, googleProfileUrl: e.target.value })}
                        fullWidth
                        sx={{ mb: 2 }}
                    />

                    {/* Toggle Switches */}
                    <div className="profile-toggles">
                        <FormControlLabel
                            control={<IOSSwitch sx={{ m: 1 }} checked={profile.isActive} />}
                            label={`Business is ${profile.isActive ? "Active" : "Disabled"}`}
                            onChange={(e: any) => setProfile({ ...profile, isActive: e.target.checked })}
                        />
                        <FormControlLabel
                            control={<IOSSwitch sx={{ m: 1 }} checked={profile.enableUserLogin} />}
                            label="Enable User Login"
                            onChange={(e: any) => setProfile({ ...profile, enableUserLogin: e.target.checked })}
                        />
                        <FormControlLabel
                            control={<IOSSwitch sx={{ m: 1 }} checked={profile.enableAppointments} />}
                            label="Allow Appointments"
                            onChange={(e: any) => setProfile({ ...profile, enableAppointments: e.target.checked })}
                        />
                        <FormControlLabel
                            control={<IOSSwitch sx={{ m: 1 }} checked={profile.enableOrders} />}
                            label="Allow Orders"
                            onChange={(e: any) => setProfile({ ...profile, enableOrders: e.target.checked })}
                        />
                        <FormControlLabel
                            control={<IOSSwitch sx={{ m: 1 }} checked={profile.showAlbums} />}
                            label="Show Albums"
                            onChange={(e: any) => setProfile({ ...profile, showAlbums: e.target.checked })}
                        />
                        <FormControlLabel
                            control={<IOSSwitch sx={{ m: 1 }} checked={profile.showProducts} />}
                            label="Show Products"
                            onChange={(e: any) => setProfile({ ...profile, showProducts: e.target.checked })}
                        />
                        <FormControlLabel
                            control={<IOSSwitch sx={{ m: 1 }} checked={profile.showServices} />}
                            label="Show Services"
                            onChange={(e: any) => setProfile({ ...profile, showServices: e.target.checked })}
                        />
                    </div>
                </div>
            </Card>

            {/* Action Buttons */}
            <div className="profile-actions">
                <Button variant="outlined">Reset</Button>
                <Button variant="contained" onClick={handleUpdateProfile} disabled={hideSubmit}>
                    Update Profile
                </Button>
            </div>
        </div>
    );
};

export default ProfileTab;