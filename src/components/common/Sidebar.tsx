import React, { useEffect, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../common/Header';




const Sidebar = ({ userRole, children }: any) => {
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState<string>(''); // State to track selected item

    const sidebarItems = [
        { name: "Dashboard", hasChild: false, icon: "📊", isOpen: false, goto: '/dashboard' },
        { name: "Profile", hasChild: false, icon: "👤", isOpen: false, goto: '/profile' },
        { name: "Categories", hasChild: false, icon: "📦", isOpen: false, goto: '/categories' },
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
    }, [navigate])

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



    return (
        <div className='w-full h-full ' style={{ display: "flex", flexDirection: "column", justifyContent: "start" }}>
            <div className='flex w-full h-full justify-center'>
                <div className="flex-column items-center justify-center mb-5  pt-5 ml-10">
                    <img src="/assets/ewns-logo.svg" alt="Logo" className="h-12 justify-center" />
                </div>
                <Header />
            </div>
            <div className=" h-[98vh] w-full flex "  >
                <nav className="h-full w-64 space-y-4 pt-5  bg-white py-4 px-4   font-sans" style={{}}>
                    {items.map((item: any, index: any) => (
                        <div key={index} style={{ borderRadius: "10px", padding: "5px", ...(selectedItem === item.goto ? { backgroundColor: "rgba(89, 50, 234, 1)" } : {}) }}>
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
                </nav >
                <div className='w-full p-[2%] justify-center align-center flex' style={{ backgroundColor: "lavender" }}>
                    {children}
                </div>
            </div >
        </div>
    );
};



export default Sidebar;
