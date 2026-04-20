'use client';

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ACTIVE_BUSINESS_ID } from '../../utils/constants';
import { getAllAppointmentCountsAction } from '../../Redux/Actions/AppointmentActions/appointment.actions';

const statCards = [
    {
        key: 'all',
        filter: 'ALL',
        label: 'Total Appointments',
        icon: '📅',
        gradient: 'appt-card-gradient--purple',
    },
    {
        key: 'day',
        filter: 'TODAY',
        label: "Today's Appointments",
        icon: '☀️',
        gradient: 'appt-card-gradient--blue',
    },
    {
        key: 'week',
        filter: 'WEEK',
        label: "This Week",
        icon: '📆',
        gradient: 'appt-card-gradient--teal',
    },
    {
        key: 'month',
        filter: 'MONTH',
        label: "This Month",
        icon: '🗓️',
        gradient: 'appt-card-gradient--orange',
    },
];

function AppointmentsOverview({ setFilter, setActiveTab }: any) {
    const allCounts = useSelector((state: any) => state.appointments.allCounts);
    const [counts, setCounts] = useState<any>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchCounts() {
            let businessID = localStorage.getItem(ACTIVE_BUSINESS_ID);
            await dispatch(getAllAppointmentCountsAction(businessID) as any);
        }
        fetchCounts();
    }, [dispatch]);

    useEffect(() => {
        setCounts(allCounts);
    }, [allCounts]);

    const handleCardClick = (filter: string) => {
        setFilter(filter);
        setActiveTab('All Appointments');
    };

    return (
        <div className="appt-overview">
            <h2 className="appt-section-title">Overview</h2>
            <div className="appt-stats-grid">
                {statCards.map((card) => (
                    <button
                        key={card.key}
                        className={`appt-stat-card ${card.gradient}`}
                        onClick={() => handleCardClick(card.filter)}
                    >
                        <div className="appt-stat-icon">{card.icon}</div>
                        <div className="appt-stat-body">
                            <span className="appt-stat-count">
                                {counts ? (counts[card.key] ?? '—') : '—'}
                            </span>
                            <span className="appt-stat-label">{card.label}</span>
                        </div>
                        <div className="appt-stat-arrow">→</div>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default AppointmentsOverview