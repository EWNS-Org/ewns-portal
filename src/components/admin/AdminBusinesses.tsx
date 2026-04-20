'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
    Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Chip, TextField, MenuItem, Select, FormControl, InputLabel,
    TablePagination, Box, CircularProgress, InputAdornment, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { getAllBusinessesAdmin } from '../../services/api/admin.merchants.service';

const DATE_FILTERS = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'lastWeek', label: 'Last Week' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'last3Months', label: 'Last 3 Months' },
    { value: 'last6Months', label: 'Last 6 Months' },
    { value: 'lastYear', label: 'Last Year' },
];

const CATEGORIES = [
    '', 'General', 'Manufacturers', 'Doctors', 'Restaurants', 'Automobiles', 'Hospitals',
    'InteriorDesign', 'RealEstate', 'Boutique', 'Hotel', 'Education', 'Electronics',
    'Spa', 'Logistics', 'Schools', 'KinderGarden', 'Pubs', 'Traders', 'ExportsNImports',
    'Saloon', 'SwimmingPools', 'DigitalMarketing', 'Marketing', 'Institutes', 'Other'
];

function AdminBusinesses() {
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [isActive, setIsActive] = useState('');
    const [category, setCategory] = useState('');

    const fetchBusinesses = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAllBusinessesAdmin({
                page: pagination.page,
                limit: pagination.limit,
                search,
                dateFilter: dateFilter || undefined,
                isActive: isActive || undefined,
                category: category || undefined,
            });
            if (res?.data) {
                setBusinesses(res.data.businesses || []);
                setPagination(prev => ({ ...prev, ...res.data.pagination }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, search, dateFilter, isActive, category]);

    useEffect(() => {
        fetchBusinesses();
    }, [fetchBusinesses]);

    const handleSearchClear = () => {
        setSearch('');
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setPagination(prev => ({ ...prev, page: 1 }));
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>Businesses</Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                View and manage all businesses registered on the platform.
            </Typography>

            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2, mb: 2 }}>
                <TextField
                    size="small"
                    placeholder="Search by business name, username, email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    onBlur={() => setPagination(prev => ({ ...prev, page: 1 }))}
                    sx={{ minWidth: 300 }}
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
                    <InputLabel>Created</InputLabel>
                    <Select value={dateFilter} label="Created" onChange={e => { setDateFilter(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}>
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
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Category</InputLabel>
                    <Select value={category} label="Category" onChange={e => { setCategory(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}>
                        <MenuItem value="">All Categories</MenuItem>
                        {CATEGORIES.filter(c => c).map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: 'rgba(89, 50, 234, 0.06)' }}>
                        <TableRow>
                            <TableCell><strong>Business Name</strong></TableCell>
                            <TableCell><strong>Username</strong></TableCell>
                            <TableCell><strong>Owner</strong></TableCell>
                            <TableCell><strong>Category</strong></TableCell>
                            <TableCell><strong>Created</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <CircularProgress size={28} />
                                </TableCell>
                            </TableRow>
                        ) : businesses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                                    No businesses found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            businesses.map((b: any) => (
                                <TableRow key={b._id}>
                                    <TableCell>{b.businessName}</TableCell>
                                    <TableCell>{b.businessUsername}</TableCell>
                                    <TableCell>{b.userId?.name || '-'}</TableCell>
                                    <TableCell>{b.category}</TableCell>
                                    <TableCell>{b.createdOn ? new Date(b.createdOn).toLocaleDateString() : '-'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={b.isActive ? 'Active' : 'Inactive'}
                                            color={b.isActive ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
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

export default AdminBusinesses;
