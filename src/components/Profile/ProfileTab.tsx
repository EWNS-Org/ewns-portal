import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Button, Checkbox, FormControlLabel, Typography, Switch, SwitchProps, Theme, Tooltip, Card } from "@mui/material";
import { categories } from "../../utils/constants/categories";
import { countryList } from "../../utils/constants/country-flag";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import { useNavigate } from "react-router-dom";
import { validateFields, validateTimings } from "../../Helpers/common.helper";
import { ACTIVE_BUSINESS_ID } from "../../utils/constants";
import { getBusinessDetailsAction, toggleBusinessActiveAction, updateBusinessProfileAction } from "../../Redux/Actions/BusinessActions/business.actions";
import { useDispatch } from "react-redux";
import { useLoader } from "../../contexts/LoaderContext";

const ProfileTab = ({ setProfileDetails, profileDetails }: any) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [profile, setProfile] = React.useState(profileDetails);
    const [hideSubmit, setHideSubmit] = React.useState(true);

    const {showLoader, hideLoader} = useLoader();

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

    React.useEffect(()=>{
        setProfile(profileDetails);
        console.log(profile)
    }, [profileDetails])

    React.useEffect(()=>{
        if(JSON.stringify(profile) === JSON.stringify(profileDetails)){
            setHideSubmit(true);
        }else{
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
        <div className="w-full " style={{ fontFamily: "source Sans pro" }}>
            <div className=" p-4 h-[680px] bg-white shadow-md w-full" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
                <Stack  width={"100%"} style={{  }}>
                    <Card sx={{  padding: "2%", height: "560px" }}>
                        <div className="h-full w-full">
                            <h2 className="text-xl font-semibold mb-6">Business Profile Information</h2>

                            <div className="">
                                <TextField
                                    required
                                    id="outlined-required"
                                    label={"Business Name"}
                                    value={profile.businessName}
                                    onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                                    sx={{ width: "100%", height: "100%", marginBottom: "2%" }}
                                />

                                <Box sx={{  cursor: "zoom-in", marginBottom: "2%", display:"flex", justifyContent:"space-between" }}>
                                <Tooltip title="Not allowed to change" arrow>
                                    <FormControl sx={{ width: "30%" }} >
                                        <InputLabel id="demo-simple-select-label">Business Category</InputLabel>
                                        <Select disabled
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={profile.category}
                                            label="Business Category"
                                        >
                                            {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    </Tooltip>
                                    <Tooltip title="Not allowed to change" arrow>
                                    <FormControl sx={{ width: "30%" }} >
                                        <InputLabel id="demo-simple-select-type">Business Type</InputLabel>
                                        <Select disabled
                                            labelId="demo-simple-select-type"
                                            id="demo-simple-select-type"
                                            value={profile.businessType && "BOTH"}
                                            label="Business Type"
                                        >
                                            {<MenuItem  value={"BOTH"}>{"Both Products & Services"}</MenuItem>}
                                            {<MenuItem  value={"PRODUCT"}>{"Products"}</MenuItem>}
                                            {<MenuItem  value={"SERVICE"}>{"Services"}</MenuItem>}
                                        </Select>
                                    </FormControl>
                                    </Tooltip>
                                    <div className='flex' style={{width:"30%"}}  >
                                    <Tooltip title="Visit" arrow>
                                        <TextField
                                            id="outlined-required"
                                            label={"Business URL"}
                                            value={"https://" + profile.url}
                                            sx={{
                                                width: "100%", height: "100%", input: { cursor: 'pointer' }, color: "gray",
                                            }}
                                            onClick={() => window.open("https://" + profile.url, "_blank")}
                                        />
                                    </Tooltip>


                                </div>
                                </Box>


                            </div>
                            <div className="w-full">
                                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>

                                <div className="h-full w-full mb-[2%]">
                                    <div style={{ display: "flex", width: "100%" }}>
                                        <Box sx={{ width: "15%" }}>
                                            <FormControl sx={{ width: "100%", height: "100%" }}>
                                                <InputLabel id="demo-simple-select-label">Country Code</InputLabel>
                                                <Select required
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={profile.countryCode}
                                                    label="Country Code"
                                                    onChange={(e) => setProfile({ ...profile, countryCode: e.target.value })}
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
                                            type="number"
                                            id="outlined-required"
                                            label={"Mobile Number"}
                                            value={profile.phone}
                                            onInput={(e: any) => {
                                                e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                                            }}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            sx={{ marginX: "1%", width: "40%", height: "100%" }}
                                        />
                                        <TextField
                                            id="outlined-required"
                                            label={"Business Email"}
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            sx={{ width: "50%", height: "100%" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-[2%] w-full h-full">
                                <h2 className="text-xl font-semibold mb-4">Google Business Profile</h2>
                                <div className="col-span-1 mb-6">
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label={"Business Profile URL"}
                                        value={profile.googleProfileUrl}
                                        onChange={(e) => setProfile({ ...profile, googleProfileUrl: e.target.value })}
                                        sx={{ width: "100%", height: "100%" }}
                                    />
                                </div>
                                <div style={{ display: "flex" }}>
                                    <FormControlLabel
                                        control={<IOSSwitch sx={{ m: 1 }} checked={profile.isActive} />}
                                        label={`Business is ${profile.isActive ? "Active" : "Disabled"}`}
                                        onChange={(e: any) => setProfile({...profile, isActive: e.target.checked})}
                                    />
                                    <FormControlLabel
                                        control={<IOSSwitch sx={{ m: 1 }} checked={profile.enableUserLogin} />}
                                        label={`Enable User Login`}
                                        onChange={(e: any) => setProfile({...profile, enableUserLogin: e.target.checked})}
                                    />
                                    <FormControlLabel
                                        control={<IOSSwitch sx={{ m: 1 }} checked={profile.enableAppointments} />}
                                        label={`Allow Appointments`}
                                        onChange={(e: any) => setProfile({...profile, enableAppointments: e.target.checked})}
                                    />
                                    <FormControlLabel
                                        control={<IOSSwitch sx={{ m: 1 }} checked={profile.enableOrders} />}
                                        label={`Allow Orders`}
                                        onChange={(e: any) => setProfile({...profile, enableOrders: e.target.checked})}
                                    />
                                    <FormControlLabel
                                        control={<IOSSwitch sx={{ m: 1 }} checked={profile.showAlbums} />}
                                        label={`Show Albums`}
                                        onChange={(e: any) => setProfile({...profile, showAlbums: e.target.checked})}
                                    />
                                    <FormControlLabel
                                        control={<IOSSwitch sx={{ m: 1 }} checked={profile.showProducts} />}
                                        label={`Show Products`}
                                        onChange={(e: any) => setProfile({...profile, showProducts: e.target.checked})}
                                    />
                                    <FormControlLabel
                                        control={<IOSSwitch sx={{ m: 1 }} checked={profile.showServices} />}
                                        label={`Show Services`}
                                        onChange={(e: any) => setProfile({...profile, showServices: e.target.checked})}
                                    />
                                </div>
                            </div>


                        </div>
                        
                    </Card>
                </Stack>

                <div style={{display:"flex", justifyContent:"space-between", marginTop: "2%"}}>
                    <Button variant='outlined' >
                        Reset
                    </Button>
                    <Button variant='contained' onClick={handleUpdateProfile} disabled={hideSubmit} >
                        Update Profile
                    </Button>
                </div>
            </div>

        </div >
    );
};

export default ProfileTab;