'use client';

import React, { useEffect, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import RssFeedOutlinedIcon from '@mui/icons-material/RssFeedOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import { useRouter, usePathname } from 'next/navigation';
import Header from '../common/Header';
import { Avatar, Box, Button, Drawer, IconButton, ListItemAvatar, ListItemText, MenuItem, Select, SelectChangeEvent, selectClasses } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getBusinessDetailsAction, getAllBusinessesAction } from '../../Redux/Actions/BusinessActions/business.actions';
import { getAvatar } from '../../Helpers/common.helper';
import './Sidebar.css';

const Sidebar = ({ userRole, children }: any) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const navigate = (path: string) => router.push(path);
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [mobileSearchQuery, setMobileSearchQuery] = useState('');
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
        if (userRole !== 'ADMIN') {
            dispatch(getAllBusinessesAction() as any);
        }
    }, [dispatch, userRole]);

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
        if (!pathname) return;
        if (userRole === "ADMIN") {
            adminSidebarItems.map((item: any, index: number) => {
                if (pathname.includes(item.goto)) {
                    handleItemClick(item, index);
                } else if (item.hasChild) {
                    item.children.map((subItem: any, childIndex: number) => {
                        if (pathname.includes(subItem.goto)) {
                            handleItemClick(subItem, childIndex);
                        }
                    })
                }
            })
        } else {
            sidebarItems.map((item: any, index: number) => {
                if (pathname.includes(item.goto)) {
                    handleItemClick(item, index);
                } else if (item.hasChild) {
                    item.children.map((subItem: any, childIndex: number) => {
                        if (pathname.includes(subItem.goto)) {
                            handleItemClick(subItem, childIndex);
                        }
                    })
                }
            })
        }
    }, [pathname]);

    const sidebarItems = [
        { name: "Dashboard", hasChild: false, icon: <DashboardOutlinedIcon fontSize="small" />, isOpen: false, goto: '/dashboard' },
        { name: "Profile", hasChild: false, icon: <PersonOutlinedIcon fontSize="small" />, isOpen: false, goto: '/profile' },
        { name: "Category & Testimonials", hasChild: false, icon: <CategoryOutlinedIcon fontSize="small" />, isOpen: false, goto: '/categories' },
        { name: "Products", hasChild: false, icon: <ShoppingCartOutlinedIcon fontSize="small" />, isOpen: false, goto: '/products' },
        {
            name: "Content Studio",
            hasChild: true,
            icon: <WorkOutlineOutlinedIcon fontSize="small" />,
            isOpen: true,
            children: [
                { name: "Services", hasChild: false, icon: <ArticleOutlinedIcon fontSize="small" />, isOpen: false, goto: '/services' },
                { name: "Blogs", hasChild: false, icon: <RssFeedOutlinedIcon fontSize="small" />, isOpen: false, goto: '/blogs' },
            ]
        },
        { name: "Albums", hasChild: false, icon: <PhotoLibraryOutlinedIcon fontSize="small" />, isOpen: false, goto: '/albums' },
        { name: "Appointments", hasChild: false, icon: <CalendarTodayOutlinedIcon fontSize="small" />, isOpen: false, goto: '/appointments' },
        { name: "Messages", hasChild: false, icon: <MailOutlinedIcon fontSize="small" />, isOpen: false, goto: '/messages' },
        {
            name: "AI Studio",
            hasChild: true,
            icon: <AutoAwesomeOutlinedIcon fontSize="small" />,
            isOpen: true,
            children: [
                { name: "Manage SEO", hasChild: false, icon: <ManageSearchOutlinedIcon fontSize="small" />, isOpen: false, goto: '/seo-studio' },
            ]
        },
        { name: "Subscription", hasChild: false, icon: <CardMembershipOutlinedIcon fontSize="small" />, isOpen: false, goto: '/subscription' },
        {
            name: "Settings",
            hasChild: true,
            icon: <SettingsOutlinedIcon fontSize="small" />,
            isOpen: true,
            children: [
                { name: "Account", hasChild: false, icon: <ManageAccountsOutlinedIcon fontSize="small" />, isOpen: false, goto: '/settings/your-account' },
            ]
        },
        {
            name: "Plugins",
            hasChild: true,
            icon: <ExtensionOutlinedIcon fontSize="small" />,
            isOpen: true,
            children: [
                { name: "Themes", hasChild: false, icon: <PaletteOutlinedIcon fontSize="small" />, isOpen: false, goto: '/plugins/themes' },
                { name: "Custom Domain", hasChild: false, icon: <LanguageOutlinedIcon fontSize="small" />, isOpen: false, goto: '/plugins/custom-domain' },
                { name: "Analytics", hasChild: false, icon: <TrendingUpOutlinedIcon fontSize="small" />, isOpen: false, goto: '/plugins/analytics' },
                { name: "Marketing", hasChild: false, icon: <CampaignOutlinedIcon fontSize="small" />, isOpen: false, goto: '/plugins/marketing' },
            ]
        },

    ];

    const adminSidebarItems = [
        { name: "Dashboard", hasChild: false, icon: <DashboardOutlinedIcon fontSize="small" />, isOpen: false, goto: '/admin/dashboard' },
        { name: "Merchants", hasChild: false, icon: <PeopleOutlinedIcon fontSize="small" />, isOpen: false, goto: '/admin/merchants' },
        { name: "Businesses", hasChild: false, icon: <WorkOutlineOutlinedIcon fontSize="small" />, isOpen: false, goto: '/admin/businesses' },
        { name: "AI Quota", hasChild: false, icon: <AutoAwesomeOutlinedIcon fontSize="small" />, isOpen: false, goto: '/admin/ai-quota' },
        { name: "Manage Subscriptions", hasChild: false, icon: <CardMembershipOutlinedIcon fontSize="small" />, isOpen: false, goto: '/admin/manage-subscriptions' },
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
            setMobileOpen(false);
        }
    };

    const handleChange = (event: SelectChangeEvent) => {
        if (event.target.value) {
            setCompany(event.target.value as string);
            localStorage.setItem("activeBusinessId", event.target.value);
            dispatch(getBusinessDetailsAction(event.target.value) as any);
        }
    };

    const sidebarContent = (isMobile = false) => (
        <nav className={`sidebar-nav ${!isMobile && sidebarCollapsed ? 'sidebar-nav--collapsed' : ''}`}>
            <div className="sidebar-logo">
                {!(sidebarCollapsed && !isMobile) && (
                    <img src="/assets/ewns-logo.svg" alt="Logo" className="sidebar-logo-img" />
                )}
                {/* Close button visible only on mobile */}
                <IconButton className="sidebar-close-btn" onClick={() => setMobileOpen(false)} sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <CloseIcon />
                </IconButton>
                {/* Collapse/Expand toggle for desktop */}
                {!isMobile && (
                    <IconButton
                        className="sidebar-collapse-btn"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        sx={{ display: { xs: 'none', md: 'flex' } }}
                        size="small"
                    >
                        {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                )}
            </div>

            {!(sidebarCollapsed && !isMobile) && userRole !== 'ADMIN' && (
            <div className="sidebar-company-select">
                <Box sx={{ display: 'flex', width: '100%' }}>
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
                            width: '100%',
                            [`& .${selectClasses.select}`]: {
                                display: 'flex',
                                alignItems: 'center',
                            },
                        }}
                    >
                        {allBusinesses?.length > 0 && allBusinesses.map((business: any) => (
                            <MenuItem value={business?._id} key={business?._id} sx={{ marginBottom: '2%' }}>
                                <ListItemAvatar>
                                    <Avatar {...getAvatar(business?.businessName ? business?.businessName : "Prem Prakash")} />
                                </ListItemAvatar>
                                <ListItemText primary={business.businessName} secondary={business.businessUsername} />
                            </MenuItem>
                        ))}
                        <MenuItem
                            onClick={(e) => { e.stopPropagation(); handlePopupOpen(); setMobileOpen(false); }}
                            sx={{ borderTop: '1px solid #eee', mt: 1, pt: 1, color: 'rgba(89, 50, 234, 1)', fontWeight: 600 }}
                        >
                            + Create Business
                        </MenuItem>
                    </Select>
                </Box>
            </div>
            )}

            {/* Search - mobile only, non-admin */}
            {userRole !== 'ADMIN' && (
            <div className="sidebar-mobile-extras">
                <input
                    type="text"
                    placeholder="Search pages..."
                    className="sidebar-mobile-search"
                    value={mobileSearchQuery}
                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                />
            </div>
            )}

            <div className="sidebar-menu">
                {items.filter((item: any) => {
                    if (!mobileSearchQuery.trim() || !isMobile) return true;
                    const q = mobileSearchQuery.toLowerCase();
                    if (item.name.toLowerCase().includes(q)) return true;
                    if (item.hasChild && item.children?.some((c: any) => c.name.toLowerCase().includes(q))) return true;
                    return false;
                }).map((item: any, index: any) => (
                    <div key={index} className="sidebar-menu-item" style={selectedItem === item.goto ? { backgroundColor: 'rgba(89, 50, 234, 1)' } : {}}>
                        <div
                            className={`sidebar-menu-link ${selectedItem === item.goto ? 'sidebar-menu-link--active' : ''}`}
                            onClick={() => handleItemClick(item, index)}
                        >
                            <div className="sidebar-menu-label">
                                {item.icon && item.icon}
                                {!(sidebarCollapsed && !isMobile) && <span>{item.name}</span>}
                            </div>
                            {item.hasChild && !(sidebarCollapsed && !isMobile) && (
                                <div>
                                    {item.isOpen ? <KeyboardArrowUpIcon className="h-5 w-5" /> : <KeyboardArrowDownIcon className="h-5 w-5" />}
                                </div>
                            )}
                        </div>

                        {item.isOpen && item.hasChild && !(sidebarCollapsed && !isMobile) && (
                            <div className="sidebar-submenu">
                                {item.children.map((child: any, childIndex: any) => (
                                    <span
                                        key={child.name}
                                        className={`sidebar-submenu-item ${selectedItem === child.goto ? 'sidebar-submenu-item--active' : ''}`}
                                        onClick={() => handleItemClick(child, childIndex)}
                                    >
                                        {child.icon && <span>{child.icon}</span>}
                                        {!(sidebarCollapsed && !isMobile) && child.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </nav>
    );

    return (
        <div className="sidebar-layout">
            {/* Desktop sidebar */}
            <aside className={`sidebar-desktop ${sidebarCollapsed ? 'sidebar-desktop--collapsed' : ''}`}>
                {sidebarContent(false)}
            </aside>

            {/* Mobile drawer */}
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: 280,
                        boxSizing: 'border-box',
                    },
                }}
            >
                {sidebarContent(true)}
            </Drawer>

            {/* Main content area */}
            <div className="sidebar-main">
                <Header
                    isPopupOpen={isPopupOpen}
                    handlePopupOpen={handlePopupOpen}
                    handlePopupClose={handlePopupClose}
                    onMenuClick={() => setMobileOpen(true)}
                    sidebarCollapsed={sidebarCollapsed}
                />
                <div className="sidebar-content-area">
                    {children}
                </div>
            </div>
        </div>
    );
};



export default Sidebar;
