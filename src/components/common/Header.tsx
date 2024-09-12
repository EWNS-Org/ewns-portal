import React, { useState } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { Button, MenuItem } from '@mui/material';
import "./Header.css"
import Popup from './Popup';
import { countryList } from '../../utils/country-flag';
function Header() {

    const navigate = useNavigate();
    const categories = ["General", "Hospital"]
    const handleSubmit = () => { }

    const [isPopupOpen, setPopupOpen] = useState<boolean>(false);

    const handlePopupOpen = () => {
        setPopupOpen(true);
    };

    const handlePopupClose = () => {
        setPopupOpen(false);
    };

    const createBusinessActions = [
        { label: 'Create Business', onClick: handleSubmit, className: 'submit-btn' }
    ];

    const createBusinessInputs = [
        { label: 'Name', name: 'business-name', type: 'text', width: "100%" },
        { label: 'Email', name: 'business-email', type: 'email', width: "100%" },
        {
            label: 'Country Code', name: 'business-country-code', type: 'select', width: "100%", menuItems: [...(
                Object.keys(countryList).map(cat => <MenuItem key={countryList[cat].dial_code} value={countryList[cat].dial_code}>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <img width={"30px"} height={"30px"} src={countryList[cat].image} />
                        <span > &nbsp; &nbsp;{countryList[cat].dial_code + " - " + cat}</span>
                    </div></MenuItem>)
            )]
        },
        { label: 'Phone', name: 'business-phone', type: 'number', width: "100%" },
        { label: 'Category', name: 'business-category', type: 'select', options: categories, width: "100%" },

        { label: 'Address', name: 'business-address', type: 'text', width: "100%" },
        { label: 'Pincode', name: 'business-pincode', type: 'number', width: "100%" },
        { label: 'State', name: 'business-state', type: 'text', disabled: true, width: "100%" },
        { label: 'City', name: 'business-city', type: 'number', disabled: true, width: "100%" },
        { label: 'Country', name: 'business-country', type: 'number', disabled: true, width: "100%" },
        { label: 'Short Bio', name: 'business-short-bio', type: 'text-area', rows: 4, width: "204%" },

    ]
    return (
        <div className='flex items-center justify-between p-4 bg-white shadow-md w-full ml-[2.25%]'>
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
                </div>

            </header>
            {isPopupOpen && <Popup
                header={"Enter Business Information"}
                inputs={createBusinessInputs}
                buttons={createBusinessActions}
                onClose={handlePopupClose}
            />}
        </div>
    )
}

export default Header