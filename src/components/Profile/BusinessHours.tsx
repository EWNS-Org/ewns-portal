import React, { useEffect, useState } from 'react'

import {
    Box,
    Typography,
    Grid,
    TextField,
    Card,
    CardContent,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import 'dayjs/locale/en-gb';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { profile } from 'console';




const locales = ['en', 'en-gb', 'de'];

type LocaleKey = (typeof locales)[number];

function BusinessHours({ profile, setProfile }: any) {


    const handleTimeChange = (day: any, field: any, newValue: any) => {
        setProfile({ ...profile, timings: { ...profile.timings, [day]: { ...profile.timings[day], [field]: newValue } } })

    };

    const handleClosedChange = (day: any) => {
        setProfile({ ...profile, timings: { ...profile.timings, [day]: { ...profile.timings[day], isClosed: !profile.timings[day].isClosed, ...(profile.timings[day].isClosed ? { open: "09:00", close: "22:00" } : {}) } } })
    };

    return (
        <div className="container  w-full" style={{ fontFamily: "source Sans pro" }}>
            <div className=" bg-white p-6 h-[800px] shadow-md w-full" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={4} width={"100%"}>
                        <Card sx={{ margin: 'auto', mt: 4 }}>
                            <CardContent sx={{ width: "100%" }}>
                                <div>
                                    <Typography variant="h5" component="div" sx={{ mb: 2, width: "20%" }}>
                                        Business Hours
                                    </Typography>
                                </div>
                                {Object.keys(profile.timings).map((day) => (
                                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", height: "100%", alignItems: "center", padding: "1% 2%", margin: "0% 2%" }}>
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
                                                        value={!profile.timings[day].isClosed ? dayjs(`1970-01-01T${profile.timings[day].open}:00`) : null}
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
                                                        value={profile.timings[day].close ? dayjs(`1970-01-01T${profile.timings[day].close}:00`) : null}
                                                        onChange={(newValue) => handleTimeChange(day, 'close', newValue)}
                                                    />
                                                )}

                                            </Grid>
                                        </div>
                                        <div>
                                            <Grid item xs={4} sx={{ width: "20%" }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={profile.timings[day].isClosed}
                                                            onChange={() => handleClosedChange(day)}
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
                </LocalizationProvider>
            </div>
        </div >
    )
}

export default BusinessHours