import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Link, useNavigate } from 'react-router-dom';




const Sidebar = ({ userRole }: any) => {

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
        {
            name: "Settings",
            hasChild: true,
            icon: "⚙️",
            isOpen: true,
            children: [
                { name: "Account", hasChild: false, icon: "🧑‍💻", isOpen: false, goto: '/settings/account' },
            ]
        }
    ];


    const adminSidebarItems = [
        { name: "All Merchants List", hasChild: false, icon: "📊", isOpen: false, goto: '/admin/all-merchants', children: null },
        { name: "Analytics", hasChild: false, icon: "📦", isOpen: false, goto: '/analytics' },
        { name: "Products", hasChild: false, icon: "🛒", isOpen: false, goto: '/products' }
    ]

    const navigate = useNavigate();
    const [items, setItems] = useState(userRole === "ADMIN" ? adminSidebarItems : sidebarItems);

    const toggleItem = (index: number) => {
        const newItems: any = [...items];
        newItems[index].isOpen = !newItems[index].isOpen;
        setItems(newItems);
    };

    const handleChildClick = (child: any) => {
        console.log(child.goto)
        navigate(child.goto)
    }

    return (
        <div className="flex flex-col h-screen bg-white p-4 w-64 pt-[5%] border font-sans">
            <div className="flex items-center justify-center ">
                <img src="/assets/ewns-logo.svg" alt="Logo" className="h-12" />
            </div>

            <nav className="space-y-4 pt-10">
                {items.map((item, index) => (
                    <div key={index} onClick={() => navigate(item.goto as any)} >
                        <div
                            className="flex items-center justify-between text-gray-500 hover:text-blue-600 cursor-pointer "
                            onClick={() => toggleItem(index)}
                        >
                            <div className="flex items-center space-x-3 ">
                                {item.icon && <span>{item.icon}</span>}
                                <span>{item.name}</span>
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

                        {item.isOpen && item.children && (
                            <div className="pl-8 flex flex-col space-y-1 text-gray-400 mt-2">
                                {item.children.map((child, childIndex) => (

                                    <div

                                        className="text-sm cursor-pointer hover:text-blue-500 mt-2"
                                        key={child.name}
                                    >

                                        <a href={child.goto as any}>
                                            {child.icon && <span>{child.icon}</span>}
                                            {child.name}
                                        </a>
                                    </div>

                                ))}
                            </div>
                        )
                        }
                    </div >
                ))
                }
            </nav >
        </div >
    );
};


export default Sidebar;
