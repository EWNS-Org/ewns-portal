import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Sidebar = ({ userRole }: any) => {
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [isSectionsOpen, setIsSectionsOpen] = useState(false);
    const [isMessagesOpen, setIsMessagesOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const sidebarItems = [{
        name: "Dashboard",
        hasChild: false,
        icon: null,
        isOpen: false
    }, {
        name: "Categories",
        hasChild: false, icon: null,
        isOpen: false
    }, {
        name: "Products",
        hasChild: false, icon: null,
        isOpen: false
    }, {
        name: "Services",
        hasChild: false, icon: null,
        isOpen: false
    }, {
        name: "Albums",
        hasChild: false, icon: null,
        isOpen: false
    }, {
        name: "Appointments",
        hasChild: false, icon: null,
        isOpen: false
    }, {
        name: "Messages",
        hasChild: false, icon: null,
        isOpen: false
    }, {
        name: "Settings",
        hasChild: true,
        children: [{
            name: "Themes",
            hasChild: false, icon: null,
            isOpen: false
        }, {
            name: "Custom Domain",
            hasChild: false, icon: null,
            isOpen: false
        }, {
            name: "Profile",
            hasChild: false, icon: null,
            isOpen: false
        }, {
            name: "Subscription",
            hasChild: false, icon: null,
            isOpen: false
        }], icon: null,
        isOpen: false
    },]

    return (
        <div className="flex flex-col h-screen bg-white p-4 w-64">
            {/* Logo */}
            <div className="flex items-center justify-center mb-10">
                <img src="your-logo-link-here" alt="Logo" className="h-12" />
            </div>

            {/* Navigation */}
            <nav className="space-y-4">

                {sidebarItems.map((item) => {
                    if (item.hasChild) {
                        return (<SidebarDropdown
                            icon={item.icon}
                            label={item.name}
                            isOpen={item.isOpen}
                            toggleOpen={() => { item.isOpen = !item.isOpen }}
                        >
                            {item.children?.map(child => {
                                return <SidebarSubItem label={child.name} />
                            })}
                        </SidebarDropdown>)
                    } else {
                        return <SidebarDropdown
                            icon={item.icon}
                            label={item.name}
                            isOpen={item.isOpen}
                            toggleOpen={() => { item.isOpen = !item.isOpen }}
                        />
                    }
                })}
                <SidebarItem icon="📊" label="Dashboard" />



                <SidebarDropdown
                    icon="🛒"
                    label="Products"
                    isOpen={isProductsOpen}
                    toggleOpen={() => setIsProductsOpen(!isProductsOpen)}
                >
                    <SidebarSubItem label="Product 1" />
                    <SidebarSubItem label="Product 2" />
                </SidebarDropdown>

                <SidebarDropdown
                    icon="💼"
                    label="Services"
                    isOpen={isServicesOpen}
                    toggleOpen={() => setIsServicesOpen(!isServicesOpen)}
                >
                    <SidebarSubItem label="Service 1" />
                    <SidebarSubItem label="Service 2" />
                </SidebarDropdown>

                <SidebarDropdown
                    icon="📂"
                    label="Sections"
                    isOpen={isSectionsOpen}
                    toggleOpen={() => setIsSectionsOpen(!isSectionsOpen)}
                >
                    <SidebarSubItem label="Section 1" />
                    <SidebarSubItem label="Section 2" />
                </SidebarDropdown>

                <SidebarItem icon="✉️" label="Messages" />

                <SidebarDropdown
                    icon="⚙️"
                    label="Settings"
                    isOpen={isSettingsOpen}
                    toggleOpen={() => setIsSettingsOpen(!isSettingsOpen)}
                >
                    <SidebarSubItem label="Setting 1" />
                    <SidebarSubItem label="Setting 2" />
                </SidebarDropdown>
            </nav>
        </div>
    );
};

// Single Sidebar Item Component
const SidebarItem = ({ icon, label }: any) => (
    <div className="flex items-center space-x-3 text-gray-500 hover:text-blue-600 cursor-pointer">
        <span>{icon}</span>
        <span>{label}</span>
    </div>
);

// Sidebar Dropdown Component
const SidebarDropdown = ({ icon, label, isOpen, toggleOpen, children }: any) => (
    <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between text-gray-500 hover:text-blue-600 cursor-pointer" onClick={toggleOpen}>
            <div className="flex items-center space-x-3">
                <span>{icon}</span>
                <span>{label}</span>
            </div>
            {isOpen ? <KeyboardArrowUpIcon className="h-5 w-5" /> : <KeyboardArrowDownIcon className="h-5 w-5" />}
        </div>
        {isOpen && (
            <div className="pl-8 flex flex-col space-y-1 text-gray-400">
                {children}
            </div>
        )}
    </div>
);

// Sidebar Sub-item Component
const SidebarSubItem = ({ label }: any) => (
    <div className="text-sm cursor-pointer hover:text-blue-500">
        {label}
    </div>
);

export default Sidebar;
