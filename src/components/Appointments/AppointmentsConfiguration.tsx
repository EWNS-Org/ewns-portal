import { Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useDispatch, useSelector } from 'react-redux';
import { getAppointmentConfigAction, updateAppointmentConfigAction } from '../../Redux/Actions/AppointmentActions/appointment.actions';
import { ACTIVE_BUSINESS_ID } from '../../utils/constants';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getBusinessDetailsAction } from '../../Redux/Actions/BusinessActions/business.actions';
import { getDefaultAppointmentConfigTimings, validateTimings } from '../../Helpers/common.helper';
import { useLoader } from '../../contexts/LoaderContext';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltipp from '../common/Tooltip';
import toast from 'react-hot-toast';
import Popup from '../common/Popup';
import { useNavigate } from 'react-router-dom';

function AppointmentsConfiguration() {
    dayjs.extend(customParseFormat);

    const [weekSlots, setWeeklySlots] = useState<any>([]);
    const [appointmentConfig, setAppointmentConfig] = useState<any>({});
    const [showEnableAppointmentsPopup, setShowEnableAppointmentsPopup] = useState<any>(false);

    const {showLoader, hideLoader} = useLoader();


    const {appointments, business } = useSelector((state: any) => {
        return state
    });


    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        async function fetchAppointmentConfig(){
            showLoader();
            let businessID = localStorage.getItem(ACTIVE_BUSINESS_ID);
            await dispatch(getAppointmentConfigAction(businessID) as any);
            await dispatch(getBusinessDetailsAction(businessID) as any);
            hideLoader();
        }

        console.log(appointments)
        if(!appointments || !appointments?.appointmentConfiguration && !appointments.loading){
            fetchAppointmentConfig();
        }else{
            setWeeklySlots(appointments?.appointmentConfiguration?.weeklySlots);
            setAppointmentConfig(appointments?.appointmentConfiguration);
        }

    }, [appointments.appointmentConfiguration]);

    
      const handleTimeChange = (day: any, field: any, newValue: any) => {
        setWeeklySlots({ ...weekSlots, [day]: { ...weekSlots[day], [field]: newValue.format("HH:mm") } })

    };

    useEffect(()=>{
        if(business?.businessDetails?.enableAppointments){
            setShowEnableAppointmentsPopup(false);
        }else{
            setShowEnableAppointmentsPopup(true);
        }
    }, [business.businessDetails])

    const handleClosedChange = (day: any) => {
        setWeeklySlots({ ...weekSlots, [day]: { ...weekSlots[day], isClosed: !weekSlots[day].isClosed, ...(weekSlots[day].isClosed ? { open: "09:00", close: "22:00" } : {}) } });
    };

    const handleCheckBizHours = async (val: any) =>{
        let bussId = localStorage.getItem(ACTIVE_BUSINESS_ID);

        showLoader();
        if(val){
            await dispatch(updateAppointmentConfigAction(bussId, {
                weeklySlots: business.businessDetails.timings,
                isSameAsBizHours: true
            }) as any);
        }else{
            await dispatch(updateAppointmentConfigAction(bussId, {
                isSameAsBizHours: false
            }) as any);
            setAppointmentConfig({...appointmentConfig, isSameAsBizHours: val})
        }
        hideLoader();
    }

    const getFisrtAndLastDateOfWeek = () => {
        let curr = new Date;
        let first = curr.getDate() - curr.getDay();
        let last = first + 6;

        let firstday = new Date(curr.setDate(first)).toDateString()
        let lastday = new Date(curr.setDate(last)).toDateString();
        return {firstday, lastday};
    }

    const popupinputs = [{
        label: "Go to Profile",
        variant:"contained",
        onClick: ()=> navigate("/profile")
    }]

    const handleUpdateSlotConfig = async () => {
        let check = validateTimings(weekSlots);

        if(check.valid){
            let bussId = localStorage.getItem(ACTIVE_BUSINESS_ID);

            showLoader();
            await dispatch(updateAppointmentConfigAction(bussId, {
                weeklySlots: weekSlots,
                isSameAsBizHours: appointmentConfig.isSameAsBizHours,
                gapBetweenSlotsInMinutes: appointmentConfig.gapBetweenSlotsInMinutes,
                slotSizeInMinutes: appointmentConfig.slotSizeInMinutes
            }) as any);
            hideLoader();
        }else{
            toast.error(check.message);
        }
    }
  return (
    <div className="w-full " style={{ fontFamily: "source Sans pro" }}>
        <div className=" h-[760px] bg-white shadow-md w-full" style={{ borderRadius: "15px" }}>
            <Stack  width={"100%"} style={{height: "90%", padding: "1% 2%"  }}>
                <Card sx={{ padding: "1%"  }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div style={{display:"flex", justifyContent:"space-between",}}>
                        <div>
                            <div style={{display: "flex", alignItems:"center"}}>
                                <Typography variant="h5">Weekly Available Appointment Slots </Typography>
                                <Tooltipp placement="top" title={<h2>Please select the start time and end time during which appointments can be scheduled. The start time should represent the earliest available time in the day, and the end time should be the latest time you are available for appointments. Ensure that the selected time range covers the full duration you wish to allow for appointments.</h2>}>
                                    <IconButton>
                                        <HelpOutlineIcon />
                                    </IconButton>
                                </Tooltipp>
                            </div>
                            
                            <Typography variant='h6' color="gray" >{getFisrtAndLastDateOfWeek().firstday + " to " + getFisrtAndLastDateOfWeek().lastday} </Typography>
                        
                        </div>
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between", width: "100%"}}>
                    <Stack  width={"70%"} style={{  }}>
                        <Card sx={{  height:"560px" }}>
                            <CardContent sx={{ width: "90%" }}>

                                {Object.keys(weekSlots).map((day) => (
                                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", height: "100%", alignItems: "center", padding:"0.5% 1%" }} key={day}>
                                        <div style={{ width: "20%", height: "60px", alignItems: "center", justifyContent: "start", display: "flex" }}>
                                            <Grid item >
                                                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{day}</Typography>
                                            </Grid>
                                        </div>
                                        <div style={{ width: "30%", }}>
                                            <Grid item sx={{ width: "100%", }}>
                                                {weekSlots[day].isClosed ? (
                                                    <Typography style={{ alignItems: "center", justifyContent: "start", display: "flex" }} variant="body1">Closed</Typography>
                                                ) : (
                                                    <TimePicker
                                                    disabled={appointmentConfig.isSameAsBizHours}
                                                        ampm={false} // Disables AM/PM to force 24-hour format
                                                        label="Start Time"
                                                        value={!weekSlots[day].isClosed ? dayjs(`${weekSlots[day].open}`, 'hh:mm') : null}
                                                        onChange={(newValue) => handleTimeChange(day, 'open', newValue)}
                                                    />
                                                )}
                                            </Grid>
                                        </div>
                                        <div style={{ width: "30%", }}>
                                            <Grid item sx={{ width: "100%", }}>
                                                {weekSlots[day].isClosed ? (
                                                    <Typography style={{ alignSelf: "center", justifyContent: "start", display: "flex" }} variant="body1">Closed</Typography>
                                                ) : (
                                                    <TimePicker
                                                        disabled={appointmentConfig.isSameAsBizHours}
                                                        ampm={false} // Disables AM/PM to force 24-hour format
                                                        label="Close Time"
                                                        value={!weekSlots[day].isClosed ? dayjs(`${weekSlots[day].close}`, 'HH:mm') : null}
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
                                                        disabled={appointmentConfig.isSameAsBizHours}

                                                            checked={weekSlots[day].isClosed}
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
                    <Card style={{width:"35%", padding: "2% 2%"}}>
                        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", marginBottom: "2%"}}>
                                <Typography variant='h6'>Use Business Hours Timings for Appointments</Typography>
                                <Checkbox
                                    checked={appointmentConfig.isSameAsBizHours || false}
                                    onChange={(e) =>
                                        handleCheckBizHours(e.target.checked)
                                    }
                                />
                        </div>
                        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", marginBottom: "2%"}}>
                                <Typography variant='h6'>Appointment Slot Size:</Typography>
                                <FormControl sx={{ width: "30%" }} >
                                    <InputLabel id="demo-simple-select-type">Slot size</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-type"
                                        onChange={(e) => setAppointmentConfig({...appointmentConfig, slotSizeInMinutes: e.target.value})}
                                        id="demo-simple-select-type"
                                        value={appointmentConfig.slotSizeInMinutes || ''}
                                        label="Slot size"
                                    >
                                        {<MenuItem  value={30}>{"30 Mins"}</MenuItem>}
                                        {<MenuItem  value={45}>{"45 Mins"}</MenuItem>}
                                        {<MenuItem  value={60}>{"1 Hour"}</MenuItem>}
                                        {<MenuItem  value={90}>{"1.5 Hours"}</MenuItem>}
                                        {<MenuItem  value={120}>{"2 Hours"}</MenuItem>}
                                    </Select>
                                </FormControl>
                        </div>
                        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", marginBottom: "2%"}}>
                            <Typography variant='h6'>Gap Between Appointments:</Typography>
                            <FormControl sx={{ width: "30%" }} >
                                <InputLabel id="demo-simple-select-type">Gap time</InputLabel>
                                <Select
                                    labelId="demo-simple-select-type"
                                    id="demo-simple-select-type"
                                    value={appointmentConfig.gapBetweenSlotsInMinutes || ''}
                                    onChange={(e) => setAppointmentConfig({...appointmentConfig, gapBetweenSlotsInMinutes: e.target.value})}
                                    label="Gap in mins"
                                >
                                    {<MenuItem  value={5}>{"5 Mins"}</MenuItem>}
                                    {<MenuItem  value={10}>{"10 Mins"}</MenuItem>}
                                    {<MenuItem  value={20}>{"20 Mins"}</MenuItem>}
                                    {<MenuItem  value={30}>{"30 Mins"}</MenuItem>}
                                    {<MenuItem  value={45}>{"45 Mins"}</MenuItem>}
                                    {<MenuItem  value={60}>{"1 Hour"}</MenuItem>}
                                </Select>
                            </FormControl>
                        </div>
                    </Card>
                    </div>
                    
                </LocalizationProvider>
                </Card>
            </Stack>
            
        <div style={{display:"flex", justifyContent:"space-between", marginTop: "1%", padding : "0% 2%"}}>
            <Button variant='outlined' >
                Reset
            </Button>
            <Button variant='contained' onClick={handleUpdateSlotConfig} >
                Update Configuration
            </Button>
        </div>
        {showEnableAppointmentsPopup && <Popup
            header={"Please Go to Profile and Enable Appointments."}
            buttons={popupinputs}
            >
        </Popup>}
        </div>
    </div>
  )
}

export default AppointmentsConfiguration;