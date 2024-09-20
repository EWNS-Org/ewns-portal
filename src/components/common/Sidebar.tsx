import React, { useEffect, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import { Avatar, Box, Button, Drawer, Icon, ListItemAvatar, ListItemText, ListSubheader, MenuItem, Select, SelectChangeEvent, drawerClasses, selectClasses, styled } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import { useDispatch, useSelector } from 'react-redux';
import { getBusinessDetailsAction, getAllBusinessesAction } from '../../Redux/Actions/BusinessActions/business.actions';

import AddCircleIcon from '@mui/icons-material/AddCircle';



const Sidebar = ({ userRole, children }: any) => {
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [company, setCompany] = React.useState("");
    const [allBusinesses, setAllBusinesses] = React.useState([]);
    const [isPopupOpen, setPopupOpen] = useState<boolean>(false);

    const handlePopupOpen = () => {
        setPopupOpen(true);
    };
    const dispatch = useDispatch();
    const businesses = useSelector((state: any) => {
        return state.business.businesses;
    });

    useEffect(() => {
        dispatch(getAllBusinessesAction() as any);
    }, [dispatch]);

    useEffect(() => {
        if (businesses?.length > 0) {
            setAllBusinesses(businesses);
            let bussId = localStorage.getItem("activeBusinessId") as string;
            let isCurrent = businesses.filter((x: any) => x._id === bussId);

            if (bussId && isCurrent?.length > 0) {
                setCompany(bussId);
            } else {
                localStorage.setItem("activeBusinessId", businesses[0]?._id);
                setCompany(businesses[0]?._id);
            }
        }
    }, [businesses]);
    const handlePopupClose = () => {
        setPopupOpen(false);
        setCompany(localStorage.getItem("activeBusinessId") as string);
    };
    useEffect(() => {
        let businessId = localStorage.getItem("activeBusinessId");
        if (businessId) {
            setCompany(localStorage.getItem("activeBusinessId") as string);

        }
    }, [setCompany])

    useEffect(() => {
        if (userRole === "ADMIN") {
            adminSidebarItems.map((item: any, index: number) => {
                if (window.location.pathname.includes(item.goto)) {
                    handleItemClick(item, index);
                } else if (item.hasChild) {
                    item.children.map((subItem: any, childIndex: number) => {
                        if (window.location.pathname.includes(subItem.goto)) {
                            handleItemClick(subItem, childIndex);
                        }
                    })
                }
            })
        } else {
            sidebarItems.map((item: any, index: number) => {
                if (window.location.pathname.includes(item.goto)) {
                    handleItemClick(item, index);
                } else if (item.hasChild) {
                    item.children.map((subItem: any, childIndex: number) => {
                        if (window.location.pathname.includes(subItem.goto)) {
                            handleItemClick(subItem, childIndex);
                        }
                    })
                }
            })
        }
    }, [navigate]);

    const sidebarItems = [
        { name: "Dashboard", hasChild: false, icon: "📊", isOpen: false, goto: '/dashboard' },
        { name: "Profile", hasChild: false, icon: "👤", isOpen: false, goto: '/profile' },
        { name: "Categories", hasChild: false, icon: "📦", isOpen: false, goto: '/categories' },
        { name: "Testimonials", hasChild: false, icon: "📦", isOpen: false, goto: '/testimonials' },
        { name: "Products", hasChild: false, icon: "🛒", isOpen: false, goto: '/products' },
        { name: "Services", hasChild: false, icon: "💼", isOpen: false, goto: '/services' },
        { name: "Albums", hasChild: false, icon: "🎵", isOpen: false, goto: '/albums' },
        { name: "Appointments", hasChild: false, icon: "📅", isOpen: false, goto: '/appointments' },
        { name: "Messages", hasChild: false, icon: "✉️", isOpen: false, goto: '/messages' },
        { name: "Subscription", hasChild: false, icon: "📅", isOpen: false, goto: '/subscription' },
        {
            name: "Settings",
            hasChild: true,
            icon: "⚙️",
            isOpen: true,
            children: [
                { name: "Account", hasChild: false, icon: "🧑‍💻", isOpen: false, goto: '/settings/your-account' },
            ]
        },
        {
            name: "Plugins",
            hasChild: true,
            icon: "🧩",
            isOpen: true,
            children: [
                { name: "Themes", hasChild: false, icon: "🎨", isOpen: false, goto: '/plugins/themes' },
                { name: "Custom Domain", hasChild: false, icon: "🌐", isOpen: false, goto: '/plugins/custom-domain' },
                { name: "Analytics", hasChild: false, icon: "📈", isOpen: false, goto: '/plugins/analytics' },
                { name: "Marketing", hasChild: false, icon: "📋", isOpen: false, goto: '/plugins/marketing' },
            ]
        },

    ];

    const adminSidebarItems = [
        { name: "All Merchants List", hasChild: false, icon: "📊", isOpen: false, goto: '/admin/all-merchants' },
        { name: "Analytics", hasChild: false, icon: "📦", isOpen: false, goto: '/analytics' },
        { name: "Products", hasChild: false, icon: "🛒", isOpen: false, goto: '/products' }
    ];

    const [items, setItems] = useState(userRole === "ADMIN" ? adminSidebarItems : sidebarItems);

    const handleItemClick = (item: any, index: number) => {

        if (item.hasChild) {
            const newItems: any = [...items];
            newItems[index].isOpen = !newItems[index].isOpen;
            setItems(newItems);
        } else {
            setSelectedItem(item.goto);
            navigate(item.goto);
        }
    };

    const handleChange = (event: SelectChangeEvent) => {
        if (event.target.value) {
            setCompany(event.target.value as string);
            localStorage.setItem("activeBusinessId", event.target.value);
            dispatch(getBusinessDetailsAction(event.target.value) as any);
        }
    };


    return (
        <div className='w-full h-full ' style={{ display: "flex", flexDirection: "row", justifyContent: "start" }}>



            <div className=" h-[98vh] w-64 flex "  >
                <nav className="flex-col h-full w-64 px-4 bg-white font-sans" style={{ justifySelf: "space-between", }}>

                    <div className="flex h-[5%] w-full " style={{ alignItems: "center", justifyContent: "center", }}>
                        <img src="/assets/ewns-logo.svg" alt="Logo" className="h-12 w-full justify-center" />
                    </div>

                    <div className='h-[8%] flex w-full' style={{ justifyContent: "center", alignItems: "center" }} >

                        <Box
                            sx={{
                                display: 'flex',
                                width: "100%"
                            }}
                        >
                            <Select
                                labelId="company-select"
                                id="company-simple-select"
                                value={company}
                                onChange={handleChange}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Select company' }}
                                fullWidth
                                sx={{
                                    maxHeight: 56,
                                    width: 250,
                                    '&.MuiList-root': {
                                    },
                                    [`& .${selectClasses.select}`]: {
                                        display: 'flex',
                                        alignItems: 'center',
                                    },
                                }}
                            >
                                {allBusinesses?.length > 0 && allBusinesses.map((business: any) => {
                                    return <MenuItem value={business?._id} key={business?._id} sx={{ marginBottom: "2%" }}>
                                        <ListItemAvatar>
                                            <Avatar alt="Company Name">
                                                <DevicesRoundedIcon sx={{ fontSize: '1rem' }} />

                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={business.businessName} secondary={business.businessUsername} />
                                    </MenuItem>
                                })}

                                <Button key="create-business" onClick={() => handlePopupOpen()} variant='contained' sx={{ height: "100%", width: "100%" }} >Create Business</Button>

                            </Select>
                        </Box>
                    </div>

                    <div>
                        {items.map((item: any, index: any) => (
                            <div key={index} style={{ marginBottom: "2%", borderRadius: "10px", padding: "5px", ...(selectedItem === item.goto ? { backgroundColor: "rgba(89, 50, 234, 1)" } : {}) }}>
                                <div
                                    className={`flex items-center justify-between cursor-pointer ${selectedItem === item.goto ? "text-white" : "text-gray-500"}  `}
                                    style={{ marginBottom: "2%", }}
                                    onClick={() => handleItemClick(item, index)}
                                >
                                    <div className="flex items-center space-x-3" style={{}}>
                                        {item.icon && item.icon}
                                        <span >{item.name}</span>
                                    </div>
                                    {item.hasChild && (
                                        <div>
                                            {item.isOpen ? (
                                                <KeyboardArrowUpIcon className="h-5 w-5" />
                                            ) : (
                                                <KeyboardArrowDownIcon className="h-5 w-5" />
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Child links */}
                                {item.isOpen && item.hasChild && (
                                    <div className={`pl-4 flex flex-col space-y-1  `} >
                                        {item.children.map((child: any, childIndex: any) => (
                                            <span
                                                key={child.name}
                                                className={`pl-4 py-2 text-sm cursor-pointer  ${selectedItem === child.goto ? "text-white" : "text-gray-500"} `}
                                                onClick={() => handleItemClick(child, childIndex)}
                                                style={{ marginBottom: "4%", borderTopLeftRadius: "5px", borderBottomLeftRadius: "5px", ...(selectedItem === child.goto ? { backgroundColor: "rgba(89, 50, 234, 1)", content: "white" } : {}) }}
                                            >
                                                {child.icon && <span>{child.icon}</span>}
                                                {child.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                        }
                    </div>
                </nav >
            </div >
            <div className='flex-col w-full h-full justify-center px-4'>
                <Header isPopupOpen={isPopupOpen} handlePopupOpen={handlePopupOpen} handlePopupClose={handlePopupClose} />

                <div className='w-full h-[98vh] p-[2%] justify-center align-center flex' style={{ backgroundColor: "lavender" }}>

                    {children}
                </div>
            </div>

        </div >
    );
};



export default Sidebar;
