'use client';

import React, { useEffect, useState } from 'react';
import {
    Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Chip, IconButton, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Tab, Tabs, Box, Switch, FormControlLabel,
    Select, MenuItem, InputLabel, FormControl, CircularProgress, Tooltip, Menu
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import SeedIcon from '@mui/icons-material/PlaylistAdd';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
    getAllSubscriptionPlans, addSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan,
    getAllAddonPacks, addAddonPack, updateAddonPack, deleteAddonPack,
    seedSubscriptionData,
} from '@/services/api/admin.subscription.service';

const DURATION_TYPES = ['DAY', 'WEEK', 'MONTH', 'QUARTER', 'HALF', 'YEAR'];

const emptyPlan = {
    name: '', details: '', price: '', currency: 'INR', type: 'MONTH',
    subscriptionId: '', isActive: true, noOfDays: '',
    aiCredits: { credits: 1000 },
    discount: { type: 'percentage', value: '' },
    tags: '',
    limitations: { businesses: 2, services: 5, blogs: 5, products: 10, orders: 10 },
};

const emptyAddon = { name: '', credits: '', price: '', currency: 'INR', isActive: true };

function TabPanel({ children, value, index }: any) {
    return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;
}

export default function AdminManageSubscriptions() {
    const [tab, setTab] = useState(0);

    // ── Plans state ──
    const [plans, setPlans] = useState<any[]>([]);
    const [plansLoading, setPlansLoading] = useState(true);
    const [planDialog, setPlanDialog] = useState(false);
    const [planForm, setPlanForm] = useState<any>(emptyPlan);
    const [editPlanId, setEditPlanId] = useState<string | null>(null);
    const [planSaving, setPlanSaving] = useState(false);
    const [deletePlanId, setDeletePlanId] = useState<string | null>(null);

    // ── Addons state ──
    const [addons, setAddons] = useState<any[]>([]);
    const [addonsLoading, setAddonsLoading] = useState(true);
    const [addonDialog, setAddonDialog] = useState(false);
    const [addonForm, setAddonForm] = useState<any>(emptyAddon);
    const [editAddonId, setEditAddonId] = useState<string | null>(null);
    const [addonSaving, setAddonSaving] = useState(false);
    const [deleteAddonId, setDeleteAddonId] = useState<string | null>(null);

    // ── Seed state ──
    const [seedAnchorEl, setSeedAnchorEl] = useState<null | HTMLElement>(null);
    const [seedLoading, setSeedLoading] = useState(false);

    const fetchPlans = async () => {
        setPlansLoading(true);
        try {
            const res: any = await getAllSubscriptionPlans();
            if (res?.isSuccess) setPlans(res.data || []);
        } finally {
            setPlansLoading(false);
        }
    };

    const fetchAddons = async () => {
        setAddonsLoading(true);
        try {
            const res: any = await getAllAddonPacks();
            if (res?.isSuccess) setAddons(res.data || []);
        } finally {
            setAddonsLoading(false);
        }
    };

    useEffect(() => { fetchPlans(); fetchAddons(); }, []);

    const openAddPlan = () => { setEditPlanId(null); setPlanForm(emptyPlan); setPlanDialog(true); };
    const openEditPlan = (plan: any) => {
        setEditPlanId(plan._id);
        setPlanForm({
            ...plan,
            tags: Array.isArray(plan.tags) ? plan.tags.join(', ') : plan.tags || '',
            discount: plan.discount || { type: 'percentage', value: '' },
        });
        setPlanDialog(true);
    };

    const handleSavePlan = async () => {
        setPlanSaving(true);
        try {
            const payload = {
                ...planForm,
                tags: planForm.tags ? planForm.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
            };
            const res: any = editPlanId
                ? await updateSubscriptionPlan(editPlanId, payload)
                : await addSubscriptionPlan(payload);
            if (res?.isSuccess) { setPlanDialog(false); fetchPlans(); }
        } finally {
            setPlanSaving(false);
        }
    };

    const handleDeletePlan = async () => {
        if (!deletePlanId) return;
        const res: any = await deleteSubscriptionPlan(deletePlanId);
        if (res?.isSuccess) { setDeletePlanId(null); fetchPlans(); }
        else setDeletePlanId(null);
    };

    const openAddAddon = () => { setEditAddonId(null); setAddonForm(emptyAddon); setAddonDialog(true); };
    const openEditAddon = (addon: any) => { setEditAddonId(addon._id); setAddonForm({ ...addon }); setAddonDialog(true); };

    const handleSaveAddon = async () => {
        setAddonSaving(true);
        try {
            const res: any = editAddonId
                ? await updateAddonPack(editAddonId, addonForm)
                : await addAddonPack(addonForm);
            if (res?.isSuccess) { setAddonDialog(false); fetchAddons(); }
        } finally {
            setAddonSaving(false);
        }
    };

    const handleDeleteAddon = async () => {
        if (!deleteAddonId) return;
        const res: any = await deleteAddonPack(deleteAddonId);
        if (res?.isSuccess) { setDeleteAddonId(null); fetchAddons(); }
        else setDeleteAddonId(null);
    };

    const handleSeed = async (type: 'plans' | 'addons' | 'all') => {
        setSeedAnchorEl(null);
        setSeedLoading(true);
        try {
            const res: any = await seedSubscriptionData(type);
            if (res?.isSuccess) {
                if (type !== 'addons') fetchPlans();
                if (type !== 'plans') fetchAddons();
            }
        } finally {
            setSeedLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Typography variant="h4" fontWeight={700}>Manage Subscriptions</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={seedLoading ? <CircularProgress size={16} /> : <SeedIcon />}
                        endIcon={<KeyboardArrowDownIcon />}
                        onClick={e => setSeedAnchorEl(e.currentTarget)}
                        disabled={seedLoading}
                        sx={{ textTransform: 'none', fontWeight: 600, borderColor: 'rgba(89,50,234,0.5)', color: 'rgba(89,50,234,1)' }}
                    >
                        Seed Data
                    </Button>
                    <Menu anchorEl={seedAnchorEl} open={!!seedAnchorEl} onClose={() => setSeedAnchorEl(null)}>
                        <MenuItem onClick={() => handleSeed('plans')}>Seed only Plans</MenuItem>
                        <MenuItem onClick={() => handleSeed('addons')}>Seed only Add Ons</MenuItem>
                        <MenuItem onClick={() => handleSeed('all')}>Seed Plans &amp; Add Ons</MenuItem>
                    </Menu>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={tab === 0 ? openAddPlan : openAddAddon}
                        sx={{ backgroundColor: 'rgba(89, 50, 234, 1)', textTransform: 'none', fontWeight: 600 }}
                    >
                        {tab === 0 ? 'Add Plan' : 'Add Addon Pack'}
                    </Button>
                </Box>
            </div>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tab label="Subscription Plans" />
                <Tab label="Addon Packs" />
            </Tabs>

            {/* ── Subscription Plans ── */}
            <TabPanel value={tab} index={0}>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: 'rgba(89, 50, 234, 0.06)' }}>
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Price</strong></TableCell>
                                <TableCell><strong>Duration</strong></TableCell>
                                <TableCell><strong>AI Credits</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell align="right"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {plansLoading ? (
                                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}><CircularProgress size={28} /></TableCell></TableRow>
                            ) : plans.length === 0 ? (
                                <TableRow><TableCell colSpan={6} align="center" sx={{ color: 'text.secondary', py: 4 }}>No subscription plans found.</TableCell></TableRow>
                            ) : plans.map((plan) => (
                                <TableRow key={plan._id} hover>
                                    <TableCell>
                                        <Typography fontWeight={600}>{plan.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{plan.details}</Typography>
                                    </TableCell>
                                    <TableCell>{plan.currency} {plan.price}</TableCell>
                                    <TableCell>{plan.noOfDays ? `${plan.noOfDays} days` : plan.type}</TableCell>
                                    <TableCell>{plan.aiCredits?.credits ?? '-'}</TableCell>
                                    <TableCell>
                                        <Chip label={plan.isActive ? 'Active' : 'Inactive'} color={plan.isActive ? 'success' : 'default'} size="small" />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton size="small" onClick={() => openEditPlan(plan)}><EditOutlinedIcon fontSize="small" /></IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error" onClick={() => setDeletePlanId(plan._id)}><DeleteOutlineIcon fontSize="small" /></IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>

            {/* ── Addon Packs ── */}
            <TabPanel value={tab} index={1}>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: 'rgba(89, 50, 234, 0.06)' }}>
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Credits</strong></TableCell>
                                <TableCell><strong>Price</strong></TableCell>
                                <TableCell><strong>Currency</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell align="right"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {addonsLoading ? (
                                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}><CircularProgress size={28} /></TableCell></TableRow>
                            ) : addons.length === 0 ? (
                                <TableRow><TableCell colSpan={6} align="center" sx={{ color: 'text.secondary', py: 4 }}>No addon packs found.</TableCell></TableRow>
                            ) : addons.map((addon) => (
                                <TableRow key={addon._id} hover>
                                    <TableCell><Typography fontWeight={600}>{addon.name}</Typography></TableCell>
                                    <TableCell>{addon.credits}</TableCell>
                                    <TableCell>{addon.price}</TableCell>
                                    <TableCell>{addon.currency}</TableCell>
                                    <TableCell>
                                        <Chip label={addon.isActive ? 'Active' : 'Inactive'} color={addon.isActive ? 'success' : 'default'} size="small" />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton size="small" onClick={() => openEditAddon(addon)}><EditOutlinedIcon fontSize="small" /></IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error" onClick={() => setDeleteAddonId(addon._id)}><DeleteOutlineIcon fontSize="small" /></IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>

            {/* ── Plan Dialog ── */}
            <Dialog open={planDialog} onClose={() => setPlanDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editPlanId ? 'Edit Subscription Plan' : 'Add Subscription Plan'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
                    <TextField label="Name" value={planForm.name} onChange={e => setPlanForm({ ...planForm, name: e.target.value })} fullWidth />
                    <TextField label="Details" value={planForm.details} onChange={e => setPlanForm({ ...planForm, details: e.target.value })} fullWidth multiline rows={2} />
                    <TextField label="Subscription ID" value={planForm.subscriptionId} onChange={e => setPlanForm({ ...planForm, subscriptionId: e.target.value })} fullWidth />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField label="Price" value={planForm.price} onChange={e => setPlanForm({ ...planForm, price: e.target.value })} fullWidth />
                        <TextField label="Currency" value={planForm.currency} onChange={e => setPlanForm({ ...planForm, currency: e.target.value })} fullWidth />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Duration Type</InputLabel>
                            <Select label="Duration Type" value={planForm.type} onChange={e => setPlanForm({ ...planForm, type: e.target.value })}>
                                {DURATION_TYPES.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField label="No. of Days" type="number" value={planForm.noOfDays} onChange={e => setPlanForm({ ...planForm, noOfDays: e.target.value })} fullWidth />
                    </Box>
                    <TextField label="Tags (comma-separated)" value={planForm.tags} onChange={e => setPlanForm({ ...planForm, tags: e.target.value })} fullWidth />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Discount Type</InputLabel>
                            <Select label="Discount Type" value={planForm.discount?.type || 'percentage'} onChange={e => setPlanForm({ ...planForm, discount: { ...planForm.discount, type: e.target.value } })}>
                                <MenuItem value="percentage">Percentage</MenuItem>
                                <MenuItem value="amount">Amount</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField label="Discount Value" value={planForm.discount?.value || ''} onChange={e => setPlanForm({ ...planForm, discount: { ...planForm.discount, value: e.target.value } })} fullWidth />
                    </Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 1 }}>Limitations</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                            label="AI Credits"
                            type="number"
                            value={planForm.aiCredits?.credits ?? ''}
                            onChange={e => setPlanForm({ ...planForm, aiCredits: { credits: Number(e.target.value) } })}
                            sx={{ width: 'calc(33% - 8px)' }}
                        />
                        {['businesses', 'services', 'blogs', 'products', 'orders'].map(key => (
                            <TextField
                                key={key}
                                label={key.charAt(0).toUpperCase() + key.slice(1)}
                                type="number"
                                value={planForm.limitations?.[key] ?? ''}
                                onChange={e => setPlanForm({ ...planForm, limitations: { ...planForm.limitations, [key]: Number(e.target.value) } })}
                                sx={{ width: 'calc(33% - 8px)' }}
                            />
                        ))}
                    </Box>
                    <FormControlLabel control={<Switch checked={planForm.isActive} onChange={e => setPlanForm({ ...planForm, isActive: e.target.checked })} />} label="Active" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPlanDialog(false)} disabled={planSaving}>Cancel</Button>
                    <Button variant="contained" onClick={handleSavePlan} disabled={planSaving}
                        sx={{ backgroundColor: 'rgba(89, 50, 234, 1)', textTransform: 'none' }}>
                        {planSaving ? <CircularProgress size={18} color="inherit" /> : editPlanId ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Addon Dialog ── */}
            <Dialog open={addonDialog} onClose={() => setAddonDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle>{editAddonId ? 'Edit Addon Pack' : 'Add Addon Pack'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
                    <TextField label="Name" value={addonForm.name} onChange={e => setAddonForm({ ...addonForm, name: e.target.value })} fullWidth />
                    <TextField label="Credits" type="number" value={addonForm.credits} onChange={e => setAddonForm({ ...addonForm, credits: Number(e.target.value) })} fullWidth />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField label="Price" type="number" value={addonForm.price} onChange={e => setAddonForm({ ...addonForm, price: Number(e.target.value) })} fullWidth />
                        <TextField label="Currency" value={addonForm.currency} onChange={e => setAddonForm({ ...addonForm, currency: e.target.value })} fullWidth />
                    </Box>
                    <FormControlLabel control={<Switch checked={addonForm.isActive} onChange={e => setAddonForm({ ...addonForm, isActive: e.target.checked })} />} label="Active" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddonDialog(false)} disabled={addonSaving}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveAddon} disabled={addonSaving}
                        sx={{ backgroundColor: 'rgba(89, 50, 234, 1)', textTransform: 'none' }}>
                        {addonSaving ? <CircularProgress size={18} color="inherit" /> : editAddonId ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Delete Plan Confirm ── */}
            <Dialog open={!!deletePlanId} onClose={() => setDeletePlanId(null)} maxWidth="xs" fullWidth>
                <DialogTitle>Delete Subscription Plan</DialogTitle>
                <DialogContent><Typography>Are you sure you want to delete this plan? This cannot be undone.</Typography></DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeletePlanId(null)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDeletePlan}>Delete</Button>
                </DialogActions>
            </Dialog>

            {/* ── Delete Addon Confirm ── */}
            <Dialog open={!!deleteAddonId} onClose={() => setDeleteAddonId(null)} maxWidth="xs" fullWidth>
                <DialogTitle>Delete Addon Pack</DialogTitle>
                <DialogContent><Typography>Are you sure you want to delete this addon pack? This cannot be undone.</Typography></DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteAddonId(null)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDeleteAddon}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
