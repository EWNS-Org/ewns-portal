'use client';

import React from 'react';
import { Typography, Grid, Card, CardContent } from '@mui/material';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';

const statCards = [
    { label: 'Total Merchants', icon: <PeopleOutlinedIcon fontSize="large" />, value: '-' },
    { label: 'Total Businesses', icon: <WorkOutlineOutlinedIcon fontSize="large" />, value: '-' },
    { label: 'AI Quota Used', icon: <AutoAwesomeOutlinedIcon fontSize="large" />, value: '-' },
    { label: 'Active Subscriptions', icon: <CardMembershipOutlinedIcon fontSize="large" />, value: '-' },
];

function AdminDashboard() {
    return (
        <div style={{ padding: '2rem' }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                Welcome to the EWNS Admin Panel. Manage merchants, businesses, AI quota, and subscriptions from the sidebar.
            </Typography>

            <Grid container spacing={3} sx={{ marginTop: '1rem' }}>
                {statCards.map((card) => (
                    <Grid item xs={12} sm={6} md={3} key={card.label}>
                        <Card variant="outlined" sx={{ borderRadius: 3 }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <div style={{ color: 'rgba(89, 50, 234, 1)' }}>{card.icon}</div>
                                <div>
                                    <Typography variant="h5" fontWeight={700}>{card.value}</Typography>
                                    <Typography variant="body2" color="text.secondary">{card.label}</Typography>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default AdminDashboard;
