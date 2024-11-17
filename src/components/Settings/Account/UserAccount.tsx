import { Box, Button, Card, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { countryList } from '../../../utils/constants/country-flag'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetailsAction } from '../../../Redux/Actions/BusinessActions/business.actions';
import Popup from '../../common/Popup';
import { useLoader } from '../../../contexts/LoaderContext';
import { fetchPincodeDetails } from '../../../services/api/postalcode.service';

function UserAccount() {

    const userDetails = useSelector((state: any) => state.user.userDetails);
    const dispatch = useDispatch();
    const {showLoader, hideLoader} = useLoader();
    const [showSubmit, setShowSubmit] = useState(false);
 
    useEffect(()=>{
        async function getUSerData(){
            await dispatch(getUserDetailsAction() as any);
        }
        getUSerData();
    }, [dispatch]);

    const [userData, setUserData] = useState<any>(null);
    const [resetPassword, setResetPassword] = useState<any>({
        showPopup: false,
        newPassword: null,
        newConfirmPassword: null,
        oldPassword: null
    });

    useEffect(()=>{
        if(JSON.stringify(userDetails) === JSON.stringify(userData)){
            setShowSubmit(false);
        }else{
            setShowSubmit(true);
        }
    }, [userData]);

    useEffect(()=>{
        setUserData(userDetails);
    }, [userDetails]);

    const handlePincodeChange = async (e: any) => {
        const updatedPincode = e.target.value;
        setUserData((prevFormData: any) => ({
          ...prevFormData,
          address: {
            ...prevFormData.address,
            pincode: updatedPincode
          },
        }));
    
        if (updatedPincode.length === 6 && /^\d{6}$/.test(updatedPincode)) {
          try {
            showLoader();
            const res: any = await fetchPincodeDetails(updatedPincode);
    
            setUserData((prevFormData: any) => ({
              ...prevFormData,
              address: {
                ...prevFormData.address,
              city: res.city,
              country: res.country,
              state: res.state
              }
            }));
            hideLoader();
          } catch (error) {
            console.error("Error fetching pincode details:", error);
            hideLoader();
          }
        } else {
          setUserData((prevFormData: any) => ({
            ...prevFormData,
            address:{
                ...prevFormData.address,
                city: "",
                country: "",
                state: "",
            }
          }));
        }
      };
    const updateUSerData = async () => {
        
    }

    const changePassword = async () => {

    }

  return (
    <div className="w-full " style={{ fontFamily: "source Sans pro" }}>
    {
        userData && <div className=" p-4 h-[680px] bg-white shadow-md w-full" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
        <Stack  width={"100%"} style={{  }}>
            <Card sx={{  padding: "2%", height: "560px", width:"100%" }}>
                <Typography sx={{marginBottom: "2%"}} variant='h4' color="gray">User Account Details</Typography>
                <div className="w-full" style={{ display:"flex",justifyContent:"space-between"}}>
                    <TextField
                        required
                        id="outlined-required"
                        label={"User Name"}
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        sx={{ width: "49%", marginBottom: "2%" }}
                    />
                    <TextField
                        id="outlined-required"
                        label={"Email"}
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        sx={{ width: "49%", height: "100%" }}
                    />
                </div>
                <div style={{width: "100%", display:"flex", justifyContent:"space-between", marginBottom:"2%"}}>
                    <div style={{width: "49%", display:"flex", justifyContent:"space-between"}}>
                        <Box sx={{width: "30%"  }}>
                            <FormControl sx={{ width: "100%"}}>
                                <InputLabel id="demo-simple-select-label">Country Code</InputLabel>
                                <Select required
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={userData.address.countryCode}
                                    label="Country Code"
                                    onChange={(e) => setUserData({ ...userData, address: {...userData.address, countryCode: e.target.value} })}
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
                            label={"Phone Number"}
                            value={userData.mobileNumber}
                            onInput={(e: any) => {
                                e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                            }}
                            onChange={(e) => setUserData({ ...userData, mobileNumber: e.target.value })}
                            sx={{width: "68%"  }}
                        />
                    </div>
                    <TextField
                        required
                        value={userData.address.addressLine1}
                        id="outlined-required"
                        label="Flat/Road/Building/Floor Number."
                        onChange={(e) =>
                        setUserData({ ...userData,  address:{...userData.address, addressLine1: e.target.value }})
                        }
                        className="form-field"
                        sx={{width:"49%"}}
                    />
                </div>
                <div className='w-full flex space-x-2 mb-[2%]'>
                    <TextField
                        required
                        value={userData.address.addressLine2}
                        id="outlined-required"
                        label="Area/Colony/Street"
                        onChange={(e) =>
                            setUserData({ ...userData,  address:{...userData.address, addressLine2: e.target.value }})
                        }
                        className="form-field"
                        sx={{width:"33%"}}
                    />
                    <TextField
                    required
                    value={userData.address.landmark}
                    id="outlined-required"
                    label="Landmark"
                    onChange={(e) =>
                        setUserData({ ...userData,  address:{...userData.address, landmark: e.target.value }})
                    }
                    sx={{width:"33%"}}
                    className="form-half-field"
                    />
                     <TextField
                        required
                        value={userData?.address?.pincode}
                        id="outlined-required"
                        label="Pincode"
                        onChange={handlePincodeChange}
                        sx={{width:"33%"}}
                        className="form-half-field"
                    />
                </div>
                <div className="flex space-x-2 mb-[2%] w-full">
                    <TextField
                        value={userData?.address?.state}
                        id="outlined-required"
                        label="State"
                        onChange={(e) =>
                            setUserData({ ...userData, address: {...userData.address, state: e.target.value} })
                        }
                        sx={{width:"33%"}}
                        className="form-half-field"
                        disabled
                    />
                    <TextField
                        value={userData?.address?.city}
                        id="outlined-required"
                        label="City"
                        onChange={(e) =>
                            setUserData({ ...userData, address: {...userData.address, city: e.target.value} })
                        }
                        disabled
                        sx={{width:"33%"}}
                        className="form-half-field"
                    />
                     <TextField
                        value={userData?.address?.country}
                        id="outlined-required"
                        disabled
                        label="Country"
                        onChange={(e) =>
                            setUserData({ ...userData, address: {...userData.address, country: e.target.value} })
                        }
                        sx={{width:"33%"}}
                        className="form-half-field"
                    />
                </div>
                <div>
                    <Button onClick={()=>setResetPassword({...resetPassword, showPopup: true})}>Change Password</Button>
                </div>               
            </Card>
        </Stack>

        <div style={{display:"flex", justifyContent:"space-between", marginTop: "2%"}}>
            <Button variant='outlined' >
                Reset
            </Button>
            <Button variant='contained' 
            disabled={!showSubmit}
                //onClick={handleUpdateProfile} disabled={hideSubmit} 
            >
                Update Account
            </Button>
        </div>
    </div>
    }

    {resetPassword.showPopup && 
        <Popup header="Change Password" onClose={()=>setResetPassword({newPassword: null, newConfirmPassword:null, oldPassword: null, showPopup: false})}>
            <div>
                <div style={{display:"flex", flexDirection:"column"}}>
                    <TextField
                        required
                        id="outlined-required"
                        label={"Old Password"}
                        value={resetPassword.oldPassword}
                        onChange={(e) => setResetPassword({ ...resetPassword, oldPassword: e.target.value })}
                        sx={{ width: "49%", marginBottom: "2%" }}
                    />

                    <TextField
                        required
                        id="outlined-required"
                        label={"New Password"}
                        type="password"
                        value={resetPassword.newPassword}
                        onChange={(e) => setResetPassword({ ...resetPassword, newPassword: e.target.value })}
                        sx={{ width: "49%", marginBottom: "2%" }}
                    />

                    <TextField
                        required
                        id="outlined-required"
                        label={"Confirm New Password"}
                        type='password'
                        value={resetPassword.newConfirmPassword}
                        onChange={(e) => setResetPassword({ ...resetPassword, newConfirmPassword: e.target.value })}
                        sx={{ width: "49%", marginBottom: "2%" }}
                    />
                </div>

                <div style={{display:"flex", justifyContent:"space-between"}}>
                    <Button variant='outlined' onClick={()=>setResetPassword({newPassword: null, newConfirmPassword:null, oldPassword: null, showPopup: false})}>Cancel</Button>
                    <Button variant='contained' onClick={()=>changePassword()}>Submit</Button>
                </div>
            </div>
            
        </Popup>
    } 
        
    </div >
  )
}

export default UserAccount