'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRouter } from 'next/navigation';
import { Avatar, Button, IconButton, MenuItem, Paper, List, ListItemButton, ListItemIcon, ListItemText, Typography, ClickAwayListener, Popover, Box } from '@mui/material';
import { getAiCreditsBalance } from '../../services/api/subscription.service';
import "./Header.css"
import Popup from './Popup';
import { countryList } from '../../utils/constants/country-flag';
import { categories } from '../../utils/constants/categories';
import { fetchPincodeDetails } from '../../services/api/postalcode.service';
import { useLoader } from '../../contexts/LoaderContext';
import { useDispatch, useSelector } from 'react-redux';
import { createBusinessAction, getAllBusinessesAction, getBusinessDetailsAction, getUserDetailsAction } from '../../Redux/Actions/BusinessActions/business.actions';
import toast from 'react-hot-toast';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../../contexts/AuthContext';
import { getAvatar } from '../../Helpers/common.helper';
import { ACTIVE_BUSINESS_ID, AUTH_TOKEN } from '../../utils/constants';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import RssFeedOutlinedIcon from '@mui/icons-material/RssFeedOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
function Header({ isPopupOpen, handlePopupClose, handlePopupOpen, onMenuClick, sidebarCollapsed }: any) {

    const { logout, userRole } = useAuth()
    const searchRef = useRef<HTMLDivElement>(null);

    const allSearchablePages = useMemo(() => {
        const merchantPages = [
            { name: "Dashboard", icon: <DashboardOutlinedIcon fontSize="small" />, goto: '/dashboard' },
            { name: "Profile", icon: <PersonOutlinedIcon fontSize="small" />, goto: '/profile' },
            { name: "Category & Testimonials", icon: <CategoryOutlinedIcon fontSize="small" />, goto: '/categories' },
            { name: "Products", icon: <ShoppingCartOutlinedIcon fontSize="small" />, goto: '/products' },
            { name: "Services", icon: <ArticleOutlinedIcon fontSize="small" />, goto: '/services', parent: 'Content Studio' },
            { name: "Blogs", icon: <RssFeedOutlinedIcon fontSize="small" />, goto: '/blogs', parent: 'Content Studio' },
            { name: "Albums", icon: <PhotoLibraryOutlinedIcon fontSize="small" />, goto: '/albums' },
            { name: "Appointments", icon: <CalendarTodayOutlinedIcon fontSize="small" />, goto: '/appointments' },
            { name: "Messages", icon: <MailOutlinedIcon fontSize="small" />, goto: '/messages' },
            { name: "Manage SEO", icon: <AutoAwesomeOutlinedIcon fontSize="small" />, goto: '/seo-studio', parent: 'AI Studio' },
            { name: "Subscription", icon: <CardMembershipOutlinedIcon fontSize="small" />, goto: '/subscription' },
            { name: "Account Settings", icon: <ManageAccountsOutlinedIcon fontSize="small" />, goto: '/settings/your-account', parent: 'Settings' },
            { name: "Themes", icon: <PaletteOutlinedIcon fontSize="small" />, goto: '/plugins/themes', parent: 'Plugins' },
            { name: "Custom Domain", icon: <LanguageOutlinedIcon fontSize="small" />, goto: '/plugins/custom-domain', parent: 'Plugins' },
            { name: "Analytics", icon: <TrendingUpOutlinedIcon fontSize="small" />, goto: '/plugins/analytics', parent: 'Plugins' },
            { name: "Marketing", icon: <CampaignOutlinedIcon fontSize="small" />, goto: '/plugins/marketing', parent: 'Plugins' },
        ];
        const adminPages = [
            { name: "Dashboard", icon: <DashboardOutlinedIcon fontSize="small" />, goto: '/admin/dashboard' },
            { name: "Merchants", icon: <PeopleOutlinedIcon fontSize="small" />, goto: '/admin/merchants' },
            { name: "Businesses", icon: <WorkOutlineOutlinedIcon fontSize="small" />, goto: '/admin/businesses' },
            { name: "AI Quota", icon: <AutoAwesomeOutlinedIcon fontSize="small" />, goto: '/admin/ai-quota' },
            { name: "Manage Subscriptions", icon: <CardMembershipOutlinedIcon fontSize="small" />, goto: '/admin/manage-subscriptions' },
        ];
        return userRole === 'ADMIN' ? adminPages : merchantPages;
    }, [userRole]);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const q = searchQuery.toLowerCase();
        return allSearchablePages.filter(p =>
            p.name.toLowerCase().includes(q) ||
            (p as any).parent?.toLowerCase().includes(q) ||
            p.goto.toLowerCase().includes(q)
        );
    }, [searchQuery, allSearchablePages]);

    const handleSearchSelect = (goto: string) => {
        setSearchQuery('');
        setSearchOpen(false);
        router.push(goto);
    };

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
        { label: 'Business Type', name: 'businessType', type: 'select', options: ["Products", "Services", "Both"], width: "100%" },
        { label: 'Flat/Floor/Apart No.', name: 'addressLine1', type: 'text', width: "100%" },
        { label: 'Building/Apart/Road Name', name: 'addressLine2', type: 'text', width: "100%" },
        { label: 'Landmark', name: 'landmark', type: 'text', width: "100%" },
        { label: 'Pincode', name: 'pincode', type: 'number', width: "100%" },
        { label: 'State', name: 'state', type: 'text', disabled: true, width: "100%" },
        { label: 'City', name: 'city', type: 'number', disabled: true, width: "100%" },
        { label: 'Country', name: 'country', type: 'number', disabled: true, width: "100%" },
        { label: 'Short Bio', name: 'shortBio', type: 'text', width: "100%" },
    ];
    const initialFormData = {
        businessName: "",
        category: "General",
        shortBio: "",
        email: "",
        mobileNumber: "",
        address: "",
        pincode: "",
        state: "",
        country: "",
        countryCode: countryList["IN"].dial_code,
        city: ""
    };



    const router = useRouter();
    const navigate = (path: string) => router.push(path);
    const { showLoader, hideLoader } = useLoader();
    const dispatch = useDispatch();

    const userDetails = useSelector((state: any) => state.business.userDetails);

    const [userData, setUserData] = useState<any>(null);
    const [aiCredits, setAiCredits] = useState<{ planCredits: number; addonCredits: number } | null>(null);
    const [aiCreditsAnchor, setAiCreditsAnchor] = useState<HTMLButtonElement | null>(null);
    const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null);

    const [formValues, setFormValues] = useState(initialFormData)

    useEffect(() => {
        if (userRole === 'ADMIN') return;
        async function fetchUserDetails(){
            await dispatch(getUserDetailsAction() as any);
        }
        fetchUserDetails();
    }, []);

    useEffect(()=>{
        setUserData(userDetails);
    }, [userDetails]);

    useEffect(() => {
        if (userRole === 'ADMIN') return;
        const businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
        if (!businessId) return;
        getAiCreditsBalance(businessId).then((data) => {
            if (data) setAiCredits(data);
        }).catch(() => {});
    }, [userRole]);

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
                {/* Hamburger for mobile */}
                <IconButton
                    onClick={onMenuClick}
                    sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
                    aria-label="Open menu"
                >
                    <MenuIcon />
                </IconButton>
                {/* Logo for mobile */}
                <img
                    src="/assets/ewns-logo.svg"
                    alt="Logo"
                    style={{ height: 32, display: 'none' }}
                    className="mobile-header-logo"
                />
                {/* Logo when sidebar is collapsed on desktop */}
                {sidebarCollapsed && (
                    <img
                        src="/assets/ewns-logo.svg"
                        alt="Logo"
                        className="desktop-collapsed-logo"
                        style={{ height: 32, marginRight: 16 }}
                    />
                )}
                <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
                    <div className="header-search-wrapper" ref={searchRef} style={{ position: 'relative' }}>
                        <div style={{ position: 'relative' }}>
                            <SearchIcon sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 20, pointerEvents: 'none' }} />
                            <input
                                type="text"
                                placeholder="Search pages..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                                onFocus={() => setSearchOpen(true)}
                                className="px-4 py-2 w-full max-w-md rounded-full bg-purple-50 text-gray-700 outline-none focus:ring-2 focus:ring-purple-500"
                                style={{ paddingLeft: 40 }}
                            />
                        </div>
                        {searchOpen && searchQuery.trim() && (
                            <Paper sx={{ position: 'absolute', top: '100%', left: 0, right: 0, mt: 0.5, zIndex: 1500, maxHeight: 320, overflowY: 'auto', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
                                {searchResults.length > 0 ? (
                                    <List dense sx={{ py: 0.5 }}>
                                        {searchResults.map((page) => (
                                            <ListItemButton key={page.goto} onClick={() => handleSearchSelect(page.goto)} sx={{ py: 1, px: 2, '&:hover': { backgroundColor: '#f1f5f9' } }}>
                                                <ListItemIcon sx={{ minWidth: 36, color: '#5932EA' }}>{page.icon}</ListItemIcon>
                                                <ListItemText
                                                    primary={page.name}
                                                    secondary={(page as any).parent || null}
                                                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                                                    secondaryTypographyProps={{ fontSize: '0.75rem', color: '#94a3b8' }}
                                                />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography sx={{ p: 2, color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center' }}>No pages found</Typography>
                                )}
                            </Paper>
                        )}
                    </div>
                </ClickAwayListener>

                <div className="flex items-center space-x-2 md:space-x-6 w-full justify-end">
                    {userRole !== 'ADMIN' && (
                    <>
                        <IconButton
                            onClick={(e) => setAiCreditsAnchor(e.currentTarget)}
                            sx={{
                                width: 36, height: 36,
                                border: '1px solid #e5e7eb',
                                borderRadius: '10px',
                                color: '#64748b',
                                '&:hover': { background: '#f8fafc', color: '#5932EA' },
                            }}
                        >
                            <AutoAwesomeOutlinedIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                        <Popover
                            open={Boolean(aiCreditsAnchor)}
                            anchorEl={aiCreditsAnchor}
                            onClose={() => setAiCreditsAnchor(null)}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                            slotProps={{ paper: { sx: { borderRadius: '12px', mt: 1, p: 2.5, minWidth: 220, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' } } }}
                        >
                            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, mb: 1 }}>AI Credits Balance</Typography>
                            <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                                {aiCredits ? (aiCredits.planCredits + aiCredits.addonCredits) : '—'}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>Plan: {aiCredits?.planCredits ?? 0}</Typography>
                                <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>Add-on: {aiCredits?.addonCredits ?? 0}</Typography>
                            </Box>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => { setAiCreditsAnchor(null); navigate('/subscription'); }}
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #5932EA, #8B5CF6)',
                                    fontWeight: 600,
                                    fontSize: '0.8rem',
                                    '&:hover': { background: 'linear-gradient(135deg, #4825D0, #7C4FE0)' },
                                }}
                            >
                                Get More Credits
                            </Button>
                        </Popover>
                    </>
                    )}
                    <IconButton
                        sx={{
                            width: 36, height: 36,
                            border: '1px solid #e5e7eb',
                            borderRadius: '10px',
                            color: '#64748b',
                            '&:hover': { background: '#f8fafc', color: '#5932EA' },
                        }}
                    >
                        <NotificationsOutlinedIcon sx={{ fontSize: 20 }} />
                    </IconButton>

                    <div className="flex items-center justify-center space-x-1 cursor-pointer" style={{ padding: '4px 8px', borderRadius: 10, border: '1px solid #e5e7eb' }} onClick={(e) => setProfileAnchor(e.currentTarget)}>
                        <Avatar {...getAvatar(userData ? userData.name : "Prem Prakash")} sx={{ width: 30, height: 30, fontSize: '0.8rem' }} />
                        <span className="text-gray-700 font-medium hidden md:inline" style={{ fontSize: '0.875rem' }}>{userData ? userData.name : "Your Account"}</span>
                        <KeyboardArrowDownIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                    </div>
                    <Popover
                        open={Boolean(profileAnchor)}
                        anchorEl={profileAnchor}
                        onClose={() => setProfileAnchor(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        slotProps={{ paper: { sx: { borderRadius: '12px', mt: 1, minWidth: 200, boxShadow: '0 8px 30px rgba(0,0,0,0.12)', py: 0.5 } } }}
                    >
                        <List dense sx={{ py: 0 }}>
                            <ListItemButton onClick={() => { setProfileAnchor(null); navigate('/profile'); }} sx={{ py: 1, px: 2 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}><StorefrontOutlinedIcon fontSize="small" sx={{ color: '#5932EA' }} /></ListItemIcon>
                                <ListItemText primary="Business Profile" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
                            </ListItemButton>
                            <ListItemButton onClick={() => { setProfileAnchor(null); navigate('/settings/your-account'); }} sx={{ py: 1, px: 2 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}><ManageAccountsOutlinedIcon fontSize="small" sx={{ color: '#5932EA' }} /></ListItemIcon>
                                <ListItemText primary="Your Account" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
                            </ListItemButton>
                            <ListItemButton onClick={() => { setProfileAnchor(null); navigate('/subscription'); }} sx={{ py: 1, px: 2 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}><CardMembershipOutlinedIcon fontSize="small" sx={{ color: '#5932EA' }} /></ListItemIcon>
                                <ListItemText primary="Subscriptions" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
                            </ListItemButton>
                            <Box sx={{ borderTop: '1px solid #e5e7eb', my: 0.5 }} />
                            <ListItemButton onClick={() => { setProfileAnchor(null); logout(); }} sx={{ py: 1, px: 2 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}><LogoutIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
                                <ListItemText primary="Log Out" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500, color: '#ef4444' }} />
                            </ListItemButton>
                        </List>
                    </Popover>

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