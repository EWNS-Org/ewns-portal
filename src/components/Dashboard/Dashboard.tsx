'use client';

import React from 'react';
import { Typography, Card, CardContent, Box, LinearProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/navigation';

const quickActions = [
    { label: 'Manage Products', icon: <InventoryOutlinedIcon />, path: '/products', color: '#3b82f6' },
    { label: 'View Orders', icon: <ShoppingCartOutlinedIcon />, path: '/orders', color: '#10b981' },
    { label: 'Categories', icon: <CategoryOutlinedIcon />, path: '/categories', color: '#f59e0b' },
    { label: 'Services', icon: <DesignServicesOutlinedIcon />, path: '/services', color: '#8b5cf6' },
    { label: 'Appointments', icon: <CalendarMonthOutlinedIcon />, path: '/appointments', color: '#ec4899' },
    { label: 'My Website', icon: <StorefrontOutlinedIcon />, path: '/plugins/themes', color: '#06b6d4' },
];

const gettingStartedSteps = [
    { label: 'Set up your business profile', path: '/profile' },
    { label: 'Add product categories', path: '/categories' },
    { label: 'Add your first product', path: '/products' },
    { label: 'Customize your website theme', path: '/plugins/themes' },
    { label: 'Set up a custom domain', path: '/plugins/custom-domain' },
];

const Dashboard: React.FC = () => {
    const router = useRouter();

    return (
        <div className="pg-root">
            <div className="pg-header">
                <h1 className="pg-title">Dashboard</h1>
                <p className="pg-subtitle">Welcome back! Here's an overview of your business.</p>
            </div>

            {/* Quick Actions */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, mt: 1 }}>
                Quick Actions
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {quickActions.map((action) => (
                    <Grid size={{ xs: 6, sm: 4, md: 2 }} key={action.label}>
                        <Card
                            variant="outlined"
                            sx={{
                                cursor: 'pointer',
                                borderRadius: 3,
                                textAlign: 'center',
                                transition: 'all 0.2s',
                                '&:hover': { boxShadow: 3, borderColor: action.color, transform: 'translateY(-2px)' },
                            }}
                            onClick={() => router.push(action.path)}
                        >
                            <CardContent sx={{ py: 2.5, px: 1 }}>
                                <Box sx={{ color: action.color, mb: 1 }}>{React.cloneElement(action.icon, { fontSize: 'large' })}</Box>
                                <Typography variant="body2" fontWeight={500}>{action.label}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Getting Started Guide */}
            <div className="pg-card">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <TipsAndUpdatesOutlinedIcon sx={{ color: '#f59e0b' }} />
                    <Typography variant="subtitle1" fontWeight={600}>Getting Started</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Complete these steps to set up your online store and start selling.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {gettingStartedSteps.map((step, idx) => (
                        <Box
                            key={idx}
                            onClick={() => router.push(step.path)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 1.5,
                                borderRadius: 2,
                                border: '1px solid #e5e7eb',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                '&:hover': { backgroundColor: '#f9fafb', borderColor: '#3b82f6' },
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{
                                    width: 28, height: 28, borderRadius: '50%',
                                    backgroundColor: '#eff6ff', color: '#3b82f6',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.8rem', fontWeight: 700,
                                }}>
                                    {idx + 1}
                                </Box>
                                <Typography variant="body2" fontWeight={500}>{step.label}</Typography>
                            </Box>
                            <ArrowForwardIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
                        </Box>
                    ))}
                </Box>
            </div>
        </div>
    );
};

export default Dashboard;
