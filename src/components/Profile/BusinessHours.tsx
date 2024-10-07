import React, { useEffect, useState } from 'react'

import {
    Box,
    Typography,
    Grid,
    TextField,
    Card,
    CardContent,
    FormControlLabel,
    Checkbox,
    Button
} from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import 'dayjs/locale/en-gb';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { profile } from 'console';
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ACTIVE_BUSINESS_ID } from '../../utils/constants';
import { validateFields, validateTimings } from '../../Helpers/common.helper';
import { updateBusinessProfileAction } from '../../Redux/Actions/BusinessActions/business.actions';
import { useDispatch } from 'react-redux';

dayjs.extend(customParseFormat);

const locales = ['en', 'en-gb', 'de'];

type LocaleKey = (typeof locales)[number];

function BusinessHours({ profileDetails, setProfileDetails }: any) {

    const [profile, setProfile] = useState(profileDetails);

    const dispatch = useDispatch();

    const handleUpdateProfile = async () => {
        let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
        let isFormChanged = JSON.stringify(profileDetails) !== JSON.stringify(profile);
        if (isFormChanged && validateTimings(profile.timings)) {
            dispatch(updateBusinessProfileAction(profile, businessId) as any);
        }
    }

    useEffect(()=>{
        setProfile(profileDetails);
    }, [profileDetails])

    const handleTimeChange = (day: any, field: any, newValue: any) => {
        setProfile({ ...profile, timings: { ...profile.timings, [day]: { ...profile.timings[day], [field]: newValue } } })

    };

    const handleClosedChange = (day: any) => {
        setProfile({ ...profile, timings: { ...profile.timings, [day]: { ...profile.timings[day], isClosed: !profile.timings[day].isClosed, ...(profile.timings[day].isClosed ? { open: "09:00", close: "22:00" } : {}) } } })
    };

    return (
        <div className="container  w-full" style={{ fontFamily: "source Sans pro", }}>
            <div className=" bg-white  p-6 h-[680px] shadow-md w-full" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px", }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack  width={"100%"} style={{  }}>
                        <Card sx={{  height:"560px" }}>
                            <CardContent sx={{ width: "90%" }}>

                                {Object.keys(profile.timings).map((day) => (
                                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", height: "100%", alignItems: "center", padding:"0.5% 5%" }}>
                                        <div style={{ width: "20%", height: "60px", alignItems: "center", justifyContent: "start", display: "flex" }}>
                                            <Grid item >
                                                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{day}</Typography>
                                            </Grid>
                                        </div>
                                        <div style={{ width: "30%", }}>
                                            <Grid item sx={{ width: "100%", }}>
                                                {profile.timings[day].isClosed ? (
                                                    <Typography style={{ alignItems: "center", justifyContent: "start", display: "flex" }} variant="body1">Closed</Typography>
                                                ) : (
                                                    <TimePicker
                                                        ampm={false} // Disables AM/PM to force 24-hour format
                                                        label="Open Time"
                                                        value={!profile.timings[day].isClosed ? dayjs(`${profile.timings[day].open}`, 'HH:mm') : null}
                                                        onChange={(newValue) => handleTimeChange(day, 'open', newValue)}
                                                    />
                                                )}
                                            </Grid>
                                        </div>
                                        <div style={{ width: "30%", }}>
                                            <Grid item sx={{ width: "100%", }}>
                                                {profile.timings[day].isClosed ? (
                                                    <Typography style={{ alignSelf: "center", justifyContent: "start", display: "flex" }} variant="body1">Closed</Typography>
                                                ) : (
                                                    <TimePicker
                                                        ampm={false} // Disables AM/PM to force 24-hour format
                                                        label="Close Time"
                                                        value={!profile.timings[day].isClosed ? dayjs(`${profile.timings[day].close}`, 'HH:mm') : null}
                                                        onChange={(newValue) => handleTimeChange(day, 'close', newValue)}
                                                    />
                                                )}

                                            </Grid>
                                        </div>
                                        <div>
                                            <Grid item  sx={{ width: "20%" }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={profile.timings[day].isClosed}
                                                            onChange={() => handleClosedChange(day)}
                                                            sx={{ color: "rgba(89, 50, 234, 1)", }}
                                                            color="primary"
                                                        />
                                                    }
                                                    label="Closed"
                                                />
                                            </Grid>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </Stack>
                    <div style={{display:"flex", justifyContent:"space-between", marginTop: "2%"}}>
                    <Button variant='outlined' >
                        Reset
                    </Button>
                    <Button variant='contained' onClick={handleUpdateProfile} >
                        Update Profile
                    </Button>
                </div>
                </LocalizationProvider>
            </div>
        </div >
    )
}

export default BusinessHours