'use client';

import React, { useEffect, useState } from 'react'
import Popup from '../common/Popup'
import { FormControl, InputLabel, Select, TextField, Theme, Tooltip, styled } from "@mui/material";
import { Box, Button, Card, CardActions, CardContent, Checkbox, FormControlLabel, Grid, MenuItem, Stack, Switch, SwitchProps, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { createBusinessAddressAction, deleteBusinessAddressAction, getAllBusinessAddressesAction, makeBusinessAddressDefaultAction, updateBusinessAddressAction } from '../../Redux/Actions/BusinessActions/business.actions';
import { countryList } from '../../utils/constants/country-flag';
import { fetchPincodeDetails } from '../../services/api/postalcode.service';
import { useLoader } from '../../contexts/LoaderContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { validateFields } from '../../Helpers/common.helper';
import MapPopup from '../common/MapPopup';
import zIndex from '@mui/material/styles/zIndex';


const initialAddresses = [
    {
        id: 1,
        name: 'John Doe',
        addressLine1: '789 New St',
        addressLine2: '789 New St',
        pincode: "524001",
        city: "Nellore",
        state: "Andhra Pradesh",
        landmark: "landmark",
        country: "India",
        coords: {
            lat: "73.2332",
            lng: "24.3435"
        },
        phoneNumber: "8297997256",
        isDefault: false
    }
];

function AddressTab() {
    const [addresses, setAddresses] = useState(initialAddresses);
    const businessAddresses = useSelector((state: any) => state.business.businessAddresses);
    const [isPopupOpen, setIsPopupOpen] = useState({
        editAddressPopup: false,
        createAddressPopup: false
    })
    const router = useRouter();
    const navigate = (path: string) => router.push(path);
    const dispatch = useDispatch();

    const { showLoader, hideLoader } = useLoader();

    const initAddressInputs = [
        { label: 'Name', name: 'name', type: 'text', width: "100%" },
        { label: 'Address Line 1', name: 'addressLine1', type: 'text', width: "100%" },
        { label: 'Address Line 2', name: 'addressLine2', type: 'text', width: "100%" },
        { label: 'Landmark', name: 'landmark', type: 'text', width: "100%" },
        { label: 'Pincode', name: 'pincode', type: 'number', width: "100%" },
        { label: 'State', name: 'state', type: 'text', disabled: true, width: "100%" },
        { label: 'City', name: 'city', type: 'number', disabled: true, width: "100%" },
        { label: 'Country', name: 'country', type: 'number', disabled: true, width: "100%" },
        {
            label: 'Country Code', name: 'countryCode', type: 'select', width: "100%", menuItems: [...(
                Object.keys(countryList).map(cat => <MenuItem key={countryList[cat].dial_code} value={countryList[cat].dial_code}>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <img width={"30px"} height={"30px"} src={countryList[cat].image} />
                        <span > &nbsp; &nbsp;{countryList[cat].dial_code + " - " + cat}</span>
                    </div></MenuItem>)
            )]
        },
        { label: 'Phone', name: 'phoneNumber', type: 'number', width: "100%" },
        { label: 'Latitude', name: 'lat', type: 'text', width: "100%", disabled: true },
        { label: 'Longitude', name: 'lng', type: 'text', width: "100%", disabled: true },
    ];

    const [createAddressInputs, setAddressInputs] = useState(initAddressInputs);

    const initialFormData = {
        name: "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        lat: "",
        lng: "",
        pincode: "",
        state: "",
        country: "",
        countryCode: countryList["IN"].dial_code,
        city: "",
        phoneNumber: "",
        _id: ""
    };

    const handleChangePincode = () => {

        setFormValues((prevValues: any) => ({
            ...prevValues,
            state: "",
            country: "",
            pincode: "",
            city: ""
        }));
        let temp = createAddressInputs.filter((action: any) => {
            if (action.name === "pincode") {
                action.disabled = false;
            }
            return action;
        });
        let temp2 = createAddressActions.map((action: any) => {
            if (action.label === "Change Pincode") {
                action.display = "none"
            }
            return action;
        })
        setAddressInputs([...temp]);
        setCreateAddressActions([...temp2]);
    }

    const handleCreateOrUpdateAddress = async (type: any, id: any = null) => {
        try {
            showLoader();

            let formData: any = {};
            setFormValues((prevValues: any) => {
                formData = prevValues;
                return { ...prevValues };
            });
            let businessId = localStorage.getItem("activeBusinessId");
            formData["coords"] = {
                lat: formData.lat,
                lng: formData.lng,
            }

            if (!validateFields(["name", "addressLine1", "addressLine2", "pincode", "state", "city", "country", "countryCode", "coords", "phoneNumber", "landmark"], true, formData)) {
                hideLoader();
                return;
            }
            if (type === "CREATE") {
                await dispatch(createBusinessAddressAction(formData, businessId) as any);
            } else if (type === "UPDATE") {
                await dispatch(updateBusinessAddressAction(formData, businessId, id) as any);
            }
            console.log(type, id, formData)
            setIsPopupOpen({ createAddressPopup: false, editAddressPopup: false });
            setFormValues(initialFormData);
            await dispatch(getAllBusinessAddressesAction(businessId) as any);
        }
        catch (error: any) {
            toast.error("Unable to create address");
        }
        finally {
            hideLoader();
        }
    }

    const handleResetForNewBusiness = () => {
        setFormValues(initialFormData)
    }

    const handleAddCoordinates = () => {
        setIsMapOpen(true);
    };
    const newAddressActions = [
        { label: 'Change Pincode', onClick: handleChangePincode, className: 'mr-2', variant: 'outlined', display: "none" },
        { label: 'Add Coordinates', onClick: handleAddCoordinates, className: 'mr-2', variant: 'outlined', display: "block" },
        { label: 'Reset', onClick: handleResetForNewBusiness, className: 'mr-2', variant: 'outlined', display: "block" },
        { label: 'Create Address', onClick: () => handleCreateOrUpdateAddress("CREATE"), className: 'ml-2', variant: 'contained', display: 'block' },
    ];

    const editAddressActions = [
        { label: 'Change Pincode', onClick: handleChangePincode, className: 'mr-2', variant: 'outlined', display: () => formValues.pincode.length === 5 ? "hide" : "block" },
        { label: 'Add Coordinates', onClick: handleAddCoordinates, className: 'mr-2', variant: 'outlined', display: "block" },
        { label: 'Reset', onClick: handleResetForNewBusiness, className: 'mr-2', variant: 'outlined', display: "block" },
        { label: 'Update Address', onClick: () => handleCreateOrUpdateAddress("UPDATE", formValues._id), className: 'ml-2', variant: 'contained', display: 'block' },
    ];

    const [createAddressActions, setCreateAddressActions] = useState(newAddressActions);

    const [formValues, setFormValues] = useState<any>(initialFormData);

    const handlePopupInputChange = async (name: any, value: any) => {
        setFormValues({
            ...formValues,
            [name]: value,
        });

        if (name === "pincode" && /^\d{6}$/.test(value)) {
            try {
                showLoader();
                const res: any = await fetchPincodeDetails(value);

                setFormValues((prevFormData: any) => ({
                    ...prevFormData,
                    city: res.city,
                    country: res.country,
                    state: res.state,
                }));
                hideLoader();
                let temp = createAddressInputs.filter((action: any) => {
                    if (action.name === "pincode") {
                        action.disabled = true;
                    }
                    return action;
                });
                let temp2 = createAddressActions.map((action: any) => {
                    if (action.label === "Change Pincode") {
                        action.display = "block"
                    }
                    return action;
                })
                setAddressInputs([...temp]);
                setCreateAddressActions([...temp2]);
            } catch (error) {
                console.error('Error fetching pincode details:', error);
                hideLoader();
            }
        }

    }

    const editAddress = (id: any) => {
        let address = addresses.filter((x: any) => x._id === id);
        if (address.length === 1) {
            setFormValues({ ...address[0], lng: address[0].coords.lng, lat: address[0].coords.lat });
            setIsPopupOpen({ ...isPopupOpen, editAddressPopup: true });
        }
    };

    const deleteAddress = async (id: any) => {
        showLoader();
        const businessId = localStorage.getItem("activeBusinessId");
        await dispatch(deleteBusinessAddressAction(businessId, id) as any);
        await dispatch(getAllBusinessAddressesAction(businessId) as any);
        hideLoader();

    }

    useEffect(() => {
        showLoader();
        let businessId = localStorage.getItem("activeBusinessId");

        if (businessId)
            dispatch(getAllBusinessAddressesAction(businessId) as any)

        hideLoader();
    }, [dispatch]);

    useEffect(() => {
        showLoader();

        setAddresses(businessAddresses);
        hideLoader();

    }, [businessAddresses])

    const handlePopupClose = (popupType: string) => {
        setIsPopupOpen({ ...isPopupOpen, [popupType]: false });
    }
    const [isMapOpen, setIsMapOpen] = useState(false);

    const handleSelectCoordinates = (coords: any) => {
        setFormValues((prevValues: any) => ({
            ...prevValues, lat: coords.lat, lng: coords.lng
        }))
    };

    const makeAddressDefault = async (id: any) => {
        showLoader();
        const businessId = localStorage.getItem("activeBusinessId");
        await dispatch(makeBusinessAddressDefaultAction(businessId, id) as any);
        await dispatch(getAllBusinessAddressesAction(businessId) as any);
        hideLoader();
    }

    const IOSSwitch = styled((props: SwitchProps) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
    ))(({ theme }) => ({
        width: 42,
        height: 26,
        padding: 0,
        zIndex:0,
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

    return (
        <div className="w-full" style={{ fontFamily: "source Sans pro" }}>
            <div className="bg-white shadow-md w-full tab-wrapper-responsive" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px", padding: "clamp(12px, 3vw, 24px)" }}>
                <Stack spacing={4} width={"100%"} style={{  }}>
                        <Box sx={{  }}>
                            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                                <Typography variant='h5' sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>All Addresses</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => { setFormValues(initialFormData); setIsPopupOpen({ ...isPopupOpen, createAddressPopup: true }); }}
                                    sx={{ backgroundColor: "rgba(89, 50, 234, 1)" }}
                                >
                                    Add New Address
                                </Button>
                            </div>

                            <Grid container spacing={2} className="address-grid tab-scroll-area" sx={{ padding: "1%", marginTop: '8px' }}>
                                {addresses?.length > 0 ? addresses.map((address: any) => (
                                    <Grid item xs={12} sm={6} md={4} key={address.id}>
                                        <Card sx={{ borderTop: "1px solid gray", padding: { xs: '8px', md: '2%' } }}>
                                            <CardContent sx={{ padding: { xs: '8px', md: '16px' } }}>
                                                <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>{address.name}</Typography>
                                                <div style={{ margin: "8px 0" }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {address.addressLine1}, {address.addressLine2},
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {address.landmark}, {address.city}, {address.pincode},
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {address.state}, {address.country}.
                                                    </Typography>
                                                </div>

                                                {address?.coords?.lat && <Typography variant="body2" color="text.secondary">
                                                    Coords: {address.coords.lat}, {address.coords.lng}
                                                </Typography>}

                                                <Typography variant="body2" color="text.secondary">
                                                    Phone: {address.phoneNumber}
                                                </Typography>
                                            </CardContent>
                                            <CardActions sx={{ width: "100%", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                                                <div style={{ display: "flex", gap: 8 }}>
                                                    <EditIcon onClick={() => editAddress(address._id)} sx={{ cursor: "pointer", color: "rgba(89, 50, 234, 1)" }} />
                                                    <DeleteIcon onClick={() => deleteAddress(address._id)} sx={{ cursor: "pointer", color: "rgba(89, 50, 234, 1)" }} />
                                                </div>

                                                <FormControlLabel
                                                    control={<IOSSwitch sx={{ m: 1 }} checked={address.isDefault} />}
                                                    label={`Is Default`}
                                                    onChange={(e) => makeAddressDefault(address._id)}
                                                />
                                            </CardActions>
                                        </Card>
                                    </Grid>)) :
                                    <div style={{ padding: '16px' }}>
                                        <Typography>No Addresses found</Typography>
                                    </div>
                                }
                            </Grid>
                        </Box>
                </Stack>
            </div>

            {isPopupOpen.createAddressPopup && <Popup
                header={"Create New Address"}
                onClose={() => handlePopupClose("createAddressPopup")}
                inputs={createAddressInputs}
                buttons={createAddressActions}
                formValues={formValues}
                setFormValues={setFormValues}
                handleInputChange={handlePopupInputChange}
            />}

            {isPopupOpen.editAddressPopup && <Popup
                header={"Update Address"}
                onClose={() => handlePopupClose("editAddressPopup")}
                formValues={formValues}
                inputs={createAddressInputs}
                buttons={editAddressActions}
                setFormValues={setFormValues}
                handleInputChange={handlePopupInputChange}
            />}

            {isMapOpen && <MapPopup
            sx={{zIndex:1111}}
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                onSelectCoordinates={handleSelectCoordinates}
            />}
        </div>
    )
}

export default AddressTab