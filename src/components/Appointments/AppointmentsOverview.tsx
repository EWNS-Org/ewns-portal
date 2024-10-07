import { Box, Card, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ACTIVE_BUSINESS_ID } from '../../utils/constants';
import { getAllAppointmentCountsAction } from '../../Redux/Actions/AppointmentActions/appointment.actions';

function AppointmentsOverview({setFilter, setActiveTab}: any) {

    const allCounts = useSelector((state: any)=> {
    return state.appointments.allCounts
});

    const [counts, setCounts] = useState<any>(null);

    const dispatch = useDispatch();

    useEffect(()=>{
        async function fetchCounts(){
            let businessID = localStorage.getItem(ACTIVE_BUSINESS_ID);

            await dispatch(getAllAppointmentCountsAction(businessID) as any);
        }

        fetchCounts();
    }, [dispatch]);

    useEffect(()=>{
        console.log(allCounts)
        setCounts(allCounts);
    }, [allCounts]);

  return (
    <div className="w-full " style={{ fontFamily: "source Sans pro" }}>
            <div className=" bg-white p-6 h-[680px] shadow-md w-full" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
                <Stack spacing={4} width={"100%"} style={{ }}>
                    <Card sx={{ padding: "2%", height: "630px" }}>
                        <div style={{display:"flex", width: "100%", justifyContent:"space-between", marginBottom: "5%"}}>
                            <Card sx={{ padding: "2%",width:"40%",  display: "flex", justifyContent:"space-between", cursor:"pointer" }} onClick={()=>{setFilter("ALL"); setActiveTab("All Appointments");}}>
                                <Typography variant='h5'>All Appointments:</Typography>
                                <Typography variant='h5' color='gray'>{counts && counts.all}</Typography>
                            </Card>
                            <Card sx={{ padding: "2%",width:"40%", display: "flex", justifyContent: "space-between", cursor:"pointer" }} onClick={()=>{setFilter("TODAY"); setActiveTab("All Appointments");}}>
                                <Typography variant='h5'>Today's Appointments:</Typography>
                                <Typography variant='h6' color='gray'>{counts && counts.day}</Typography>
                            </Card>
                        </div>
                        <div style={{display:"flex", width: "100%", justifyContent:"space-between", marginBottom: "5%"}}>
                            <Card sx={{ padding: "2%",width:"40%",  display: "flex", justifyContent:"space-between", cursor:"pointer" }} onClick={()=>{setFilter("WEEK"); setActiveTab("All Appointments");}}>
                                <Typography variant='h5'>This weeks Appointments:</Typography>
                                <Typography variant='h5' color='gray'>{counts && counts.week}</Typography>
                            </Card>
                            <Card sx={{ padding: "2%",width:"40%", display: "flex", justifyContent: "space-between", cursor:"pointer" }} onClick={()=>{setFilter("MONTH"); setActiveTab("All Appointments");}}>
                                <Typography variant='h5'>This Month's Appointments:</Typography>
                                <Typography variant='h6' color='gray'>{counts && counts.month}</Typography>
                            </Card>
                        </div>
                    </Card>
                </Stack>
            </div>
        </div>
  )
}

export default AppointmentsOverview