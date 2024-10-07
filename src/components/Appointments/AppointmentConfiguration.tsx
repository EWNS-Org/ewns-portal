import { Button, Card, Checkbox, FormControlLabel, Stack } from '@mui/material'
import React from 'react'

function AppointmentConfiguration() {

    const handleUpdateSlotConfig = async ()=>{

    }
  return (
    <div className="w-full " style={{ fontFamily: "source Sans pro" }}>
        <div className=" h-[760px] bg-white shadow-md w-full" style={{ borderRadius: "15px" }}>
            <Stack  width={"100%"} style={{height: "90%", padding: "1% 2%"  }}>
                <Card sx={{ padding: "2%"  }}>
                    <div>
                    <FormControlLabel
                            control={
                                <Checkbox
                                    // checked={appointmentConfig.isSameAsBizHours || false}
                                    // onChange={(e) =>
                                    //     handleCheckBizHours(e.target.checked)
                                    // }
                                />
                            }
                            label="Enable Appointments"
                            sx={{}}
                        />
                    </div>
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
        </div>
    </div>
  )
}

export default AppointmentConfiguration