import React, { useEffect, useState } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { Button, MenuItem } from '@mui/material';
import "./Header.css"
import Popup from './Popup';
import { countryList } from '../../utils/constants/country-flag';
import { categories } from '../../utils/constants/categories';
import { fetchPincodeDetails } from '../../services/api/postalcode.service';
import { useLoader } from '../../contexts/LoaderContext';
import { useDispatch } from 'react-redux';
import { createBusinessAction } from '../../Redux/Actions/BusinessActions/business.actions';
import toast from 'react-hot-toast';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../contexts/AuthContext';
function Header({ isPopupOpen, handlePopupClose, handlePopupOpen }: any) {

    const { logout } = useAuth()
    const newBusinessInputs = [
        { label: 'Name', name: 'businessName', type: 'text', width: "100%" },
        { label: 'Email', name: 'email', type: 'email', width: "100%" },
        {
            label: 'Country Code', name: 'countryCode', type: 'select', width: "100%", menuItems: [...(
                Object.keys(countryList).map(cat => <MenuItem key={countryList[cat].dial_code} value={countryList[cat].dial_code}>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <img width={"30px"} height={"30px"} src={countryList[cat].image} />
                        <span > &nbsp; &nbsp;{countryList[cat].dial_code + " - " + cat}</span>
                    </div></MenuItem>)
            )]
        },
        { label: 'Phone', name: 'phone', type: 'number', width: "100%" },
        { label: 'Category', name: 'category', type: 'select', options: categories, width: "100%" },

        { label: 'Address', name: 'address', type: 'text', width: "100%" },
        { label: 'Pincode', name: 'pincode', type: 'number', width: "100%" },
        { label: 'State', name: 'state', type: 'text', disabled: true, width: "100%" },
        { label: 'City', name: 'city', type: 'number', disabled: true, width: "100%" },
        { label: 'Country', name: 'country', type: 'number', disabled: true, width: "100%" },
        { label: 'Short Bio', name: 'shortBio', type: 'text-area', rows: 4, width: "204%" },
    ];
    const initialFormData = {
        businessName: "",
        category: "General",
        shortBio: "",
        email: "",
        phone: "",
        address: "",
        pincode: "",
        state: "",
        country: "",
        countryCode: countryList["IN"].dial_code,
        city: ""
    };



    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const dispatch = useDispatch();


    const [formValues, setFormValues] = useState(initialFormData)

    useEffect(() => {
    }, [formValues]);

    const [createBusinessInputs, setBusinessInputs] = useState(newBusinessInputs);


    const handleChangePincode = () => {

        setFormValues((prevValues) => ({
            ...prevValues,
            state: "",
            country: "",
            pincode: "",
            city: ""
        }));
        let temp = createBusinessInputs.filter((action: any) => {
            if (action.name === "pincode") {
                action.disabled = false;
            }
            return action;
        });
        let temp2 = createBusinessActions.map((action: any) => {
            if (action.label === "Change Pincode") {
                action.display = "none"
            }
            return action;
        })
        setBusinessInputs([...temp]);
        setBusinessActions([...temp2]);
    }

    const handleResetForNewBusiness = () => {
        setFormValues(initialFormData);
        let temp = newBusinessInputs.filter((action: any) => {
            if (action.name === "pincode") {
                action.disabled = false;
            }
            return action;
        });
        let temp2 = newBusinessActions.map((action: any) => {
            if (action.label === "Change Pincode") {
                action.display = "none"
            }
            return action;
        })

        setBusinessInputs(temp);
        setBusinessActions(temp2);
    }
    const handleCreateBusiness = () => {
        let formData = {};
        setFormValues((prevValues) => {
            formData = prevValues;
            return { ...prevValues };
        });
        try {
            dispatch(createBusinessAction(formData) as any);
            handlePopupClose();
            setFormValues(initialFormData);
        }
        catch (error: any) {
            toast.error("Unable to create business");
        }
    }
    const newBusinessActions = [
        { label: 'Change Pincode', onClick: handleChangePincode, className: 'mr-2', variant: 'outlined', display: "none" },
        { label: 'Reset', onClick: handleResetForNewBusiness, className: 'mr-2', variant: 'outlined', display: "block" },
        { label: 'Create Business', onClick: handleCreateBusiness, className: 'ml-2', variant: 'contained', display: 'block' },
    ];

    const [createBusinessActions, setBusinessActions] = useState(newBusinessActions);

    const handlePopupInputChange = async (name: any, value: any) => {
        setFormValues({
            ...formValues,
            [name]: value,
        });

        if (name === "pincode" && /^\d{6}$/.test(value)) {
            try {
                showLoader();
                const res: any = await fetchPincodeDetails(value);

                setFormValues(prevFormData => ({
                    ...prevFormData,
                    city: res.city,
                    country: res.country,
                    state: res.state,
                }));
                hideLoader();
                let temp = createBusinessInputs.filter((action: any) => {
                    if (action.name === "pincode") {
                        action.disabled = true;
                    }
                    return action;
                });
                let temp2 = createBusinessActions.map((action: any) => {
                    if (action.label === "Change Pincode") {
                        action.display = "block"
                    }
                    return action;
                })
                setBusinessInputs([...temp]);
                setBusinessActions([...temp2]);
            } catch (error) {
                console.error('Error fetching pincode details:', error);
                hideLoader();
            }
        }
    }


    const handleReset = () => {

    }



    return (
        <div className='flex justify-between p-4 bg-white shadow-md w-full' style={{ alignItems: "center" }}>
            <header className="flex items-center justify-between w-full">
                <div className="flex items-center w-full">
                    <input
                        type="text"
                        placeholder="Search for pages, categories..."
                        className="px-4 py-2 w-full max-w-md rounded-full bg-purple-50 text-gray-700 outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div className="flex items-center space-x-6 w-full justify-end">
                    <Button
                        className="px-4 py-2 "
                        onClick={() => handlePopupOpen()}
                    >Create a new Business</Button>
                    <div className="relative space-x-2">
                        <button className="text-blue-600 relative">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V9a6 6 0 10-12 0v5c0 .217-.048.428-.137.615L4 17h5m0 0v1a3 3 0 106 0v-1m-6 0h6" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center justify-center space-x-2 cursor-pointer" onClick={() => navigate("/settings/your-account")}>
                        <AccountCircleIcon sx={{ color: 'blue' }} />
                        <span className="text-gray-700 font-medium">{"Your Account"}</span>

                    </div>
                    <LogoutIcon sx={{ color: "blue", cursor: "pointer" }} onClick={() => logout()} />

                </div>

            </header>
            {isPopupOpen && <Popup
                header={"Enter Business Information"}
                inputs={createBusinessInputs}
                buttons={createBusinessActions}
                onClose={handlePopupClose}
                formValues={formValues}
                setFormValues={setFormValues}
                handleInputChange={handlePopupInputChange}
            />}
        </div>
    )
}

export default Header