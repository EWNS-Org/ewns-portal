import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
function Header() {

    const navigate = useNavigate();
    return (
        <header className="flex items-center justify-between p-4 bg-white shadow-md w-full ml-[2.25%]">
            <div className="flex items-center w-full">
                <input
                    type="text"
                    placeholder="Search for pages, categories..."
                    className="px-4 py-2 w-full max-w-md rounded-full bg-purple-50 text-gray-700 outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>

            <div className="flex items-center space-x-6 w-full justify-end">

                <div className="relative">
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

    )
}

export default Header