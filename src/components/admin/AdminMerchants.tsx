'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
    Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Chip, TextField, MenuItem, Select, FormControl, InputLabel,
    TablePagination, Box, CircularProgress, InputAdornment, IconButton, Menu
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getAllMerchants, toggleMerchantStatus } from '../../services/api/admin.merchants.service';

const DATE_FILTERS = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'lastWeek', label: 'Last Week' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'last3Months', label: 'Last 3 Months' },
    { value: 'last6Months', label: 'Last 6 Months' },
    { value: 'lastYear', label: 'Last Year' },
];

function AdminMerchants() {
    const [merchants, setMerchants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [isActive, setIsActive] = useState('');
    const [subscriptionType, setSubscriptionType] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedMerchant, setSelectedMerchant] = useState<any>(null);

    const fetchMerchants = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAllMerchants({
                page: pagination.page,
                limit: pagination.limit,
                search,
                dateFilter: dateFilter || undefined,
                isActive: isActive || undefined,
                subscriptionType: subscriptionType || undefined,
            });
            if (res?.data) {
                setMerchants(res.data.merchants || []);
                setPagination(prev => ({ ...prev, ...res.data.pagination }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, search, dateFilter, isActive, subscriptionType]);

    useEffect(() => {
        fetchMerchants();
    }, [fetchMerchants]);

    const handleSearchClear = () => {
        setSearch('');
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, merchant: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedMerchant(merchant);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedMerchant(null);
    };

    const handleToggleStatus = async () => {
        if (!selectedMerchant) return;
        try {
            await toggleMerchantStatus(selectedMerchant._id);
            fetchMerchants();
        } catch (err) {
            console.error(err);
        } finally {
            handleMenuClose();
        }
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setPagination(prev => ({ ...prev, page: 1 }));
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>Merchants</Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                View and manage all registered merchants on the platform.
            </Typography>

            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2, mb: 2 }}>
                <TextField
                    size="small"
                    placeholder="Search by name, email, username..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    onBlur={() => setPagination(prev => ({ ...prev, page: 1 }))}
                    sx={{ minWidth: 280 }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
                        endAdornment: search ? (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={handleSearchClear}><ClearIcon fontSize="small" /></IconButton>
                            </InputAdornment>
                        ) : null,
                    }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Joined</InputLabel>
                    <Select value={dateFilter} label="Joined" onChange={e => { setDateFilter(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}>
                        {DATE_FILTERS.map(f => <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select value={isActive} label="Status" onChange={e => { setIsActive(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}>
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="true">Active</MenuItem>
                        <MenuItem value="false">Inactive</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 130 }}>
                    <InputLabel>Subscription</InputLabel>
                    <Select value={subscriptionType} label="Subscription" onChange={e => { setSubscriptionType(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}>
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="paid">Paid</MenuItem>
                        <MenuItem value="free">Free</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: 'rgba(89, 50, 234, 0.06)' }}>
                        <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Username</strong></TableCell>
                            <TableCell><strong>Businesses</strong></TableCell>
                            <TableCell><strong>Joined</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Plan</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                    <CircularProgress size={28} />
                                </TableCell>
                            </TableRow>
                        ) : merchants.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                                    No merchants found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            merchants.map((m: any) => (
                                <TableRow key={m._id}>
                                    <TableCell>{m.name}</TableCell>
                                    <TableCell>{m.email}</TableCell>
                                    <TableCell>{m.username}</TableCell>
                                    <TableCell>{m.businessCount || 0}</TableCell>
                                    <TableCell>{m.createdOn ? new Date(m.createdOn).toLocaleDateString() : '-'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={m.isActive ? 'Active' : 'Inactive'}
                                            color={m.isActive ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={m.isPaid ? 'Paid' : 'Free'}
                                            color={m.isPaid ? 'primary' : 'default'}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, m)}>
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleToggleStatus}>
                        {selectedMerchant?.isActive ? 'Disable User' : 'Enable User'}
                    </MenuItem>
                </Menu>
                <TablePagination
                    component="div"
                    count={pagination.total}
                    page={pagination.page - 1}
                    onPageChange={(_, newPage) => setPagination(prev => ({ ...prev, page: newPage + 1 }))}
                    rowsPerPage={pagination.limit}
                    onRowsPerPageChange={e => setPagination(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </TableContainer>
        </div>
    );
}

export default AdminMerchants;
