'use client';

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
        <div className="container w-full" style={{ fontFamily: "source Sans pro", }}>
            <div className="bg-white shadow-md w-full tab-wrapper-responsive" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px", padding: "clamp(12px, 3vw, 24px)" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack  width={"100%"} style={{  }}>
                        <Card sx={{ }} className="tab-card-responsive">
                            <CardContent sx={{ width: "100%", padding: { xs: '8px', md: '16px' } }}>

                                {Object.keys(profile.timings).map((day) => (
                                    <div className="hours-row" key={day}>
                                        <div className="hours-day">
                                            <Typography variant="body1" sx={{ textTransform: 'capitalize', fontSize: { xs: '0.85rem', md: '1rem' } }}>{day}</Typography>
                                        </div>
                                        <div className="hours-picker">
                                            {profile.timings[day].isClosed ? (
                                                <Typography className="hours-closed-label" variant="body1">Closed</Typography>
                                            ) : (
                                                <TimePicker
                                                    ampm={false}
                                                    label="Open"
                                                    value={dayjs(`${profile.timings[day].open}`, 'HH:mm')}
                                                    onChange={(newValue) => handleTimeChange(day, 'open', newValue)}
                                                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                                />
                                            )}
                                        </div>
                                        <div className="hours-picker">
                                            {profile.timings[day].isClosed ? (
                                                <Typography className="hours-closed-label" variant="body1">Closed</Typography>
                                            ) : (
                                                <TimePicker
                                                    ampm={false}
                                                    label="Close"
                                                    value={dayjs(`${profile.timings[day].close}`, 'HH:mm')}
                                                    onChange={(newValue) => handleTimeChange(day, 'close', newValue)}
                                                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                                />
                                            )}
                                        </div>
                                        <div className="hours-check">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={profile.timings[day].isClosed}
                                                        onChange={() => handleClosedChange(day)}
                                                        sx={{ color: "rgba(89, 50, 234, 1)" }}
                                                        color="primary"
                                                    />
                                                }
                                                label="Closed"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </Stack>
                    <div style={{display:"flex", justifyContent:"space-between", marginTop: "16px"}}>
                    <Button variant='outlined' >
                        Reset
                    </Button>
                    <Button variant='contained' onClick={handleUpdateProfile} sx={{backgroundColor: "rgba(89, 50, 234, 1)"}}>
                        Update Profile
                    </Button>
                </div>
                </LocalizationProvider>
            </div>
        </div >
    )
}

export default BusinessHours