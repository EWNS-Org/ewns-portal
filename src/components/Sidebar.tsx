import React from 'react';
import { Link } from 'react-router-dom';

export interface SidebarProps {
    userRole: 'admin' | 'user' | null; // You can define other roles as needed
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }: SidebarProps) => {
    return (
        <div className="sidebar">
            <ul>
                {userRole === 'admin' ? (
                    <>
                        <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
                        <li><Link to="/admin/manage-users">Manage Users</Link></li>
                        {/* Add more admin-specific links */}
                    </>
                ) : (
                    <>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/user/profile">Profile</Link></li>
                        {/* Add more user-specific links */}
                    </>
                )}
                {/* Common Links */}
                <li><Link to="/settings">Settings</Link></li>
                <li><Link to="/logout">Logout</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
