'use client';

import React, { useState } from 'react'
import AppointmentConfiguration from './AppointmentsConfiguration';
import "./Appointment.css";
import AllAppointments from './AllAppointments';
import AppointmentsOverview from './AppointmentsOverview';

const tabs = [
    { key: 'Overview', label: 'Overview', icon: '📊' },
    { key: 'All Appointments', label: 'All Appointments', icon: '📋' },
    { key: 'Appointments Configuration', label: 'Configuration', icon: '⚙️' },
];

function Appointment() {
    const [activeTab, setActiveTab] = useState('Overview');
    const [filter, setFilter] = useState("ALL");

    return (
        <div className="appt-root">
            {/* Page Header */}
            <div className="appt-header">
                <div>
                    <h1 className="appt-title">Appointments</h1>
                    <p className="appt-subtitle">Manage and track all your bookings</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="appt-tab-bar">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        className={`appt-tab-btn${activeTab === tab.key ? ' appt-tab-btn--active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        <span className="appt-tab-icon">{tab.icon}</span>
                        <span className="appt-tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="appt-content">
                {activeTab === 'Overview' && <AppointmentsOverview setFilter={setFilter} setActiveTab={setActiveTab} />}
                {activeTab === 'All Appointments' && <AllAppointments filter={filter} setFilter={setFilter} />}
                {activeTab === 'Appointments Configuration' && <AppointmentConfiguration />}
            </div>
        </div>
    )
}

export default Appointment