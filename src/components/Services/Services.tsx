'use client';

import React, { useEffect, useState } from 'react';
import {
    Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, InputAdornment, MenuItem, Paper, Switch,
    Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
    TableRow, TextField, Tooltip, Typography, FormControl, InputLabel, Select, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { getAllServicesAction, addServiceAction, updateServiceAction, deleteServiceAction, toggleServiceAction } from '../../Redux/Actions/Services/service.actions';
import { getAllCategoriesAction } from '../../Redux/Actions/Categories/category.actions';
import { ACTIVE_BUSINESS_ID } from '../../utils/constants';
import toast from 'react-hot-toast';
import RichEditor from '../common/BundledRichEditor/RichEditor';
import './Services.css';

const initForm = {
    title: '',
    subTitle: '',
    description: '',
    category: { categoryId: '', categoryName: '' },
    sku: '',
    files: [] as File[],
};

export default function Services() {
    const dispatch = useDispatch();
    const allServices = useSelector((state: any) => state.services.allServices);
    const allCategories = useSelector((state: any) => state.categories.allCategories);

    const [services, setServices] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [form, setForm] = useState<any>(initForm);
    const [filePreviews, setFilePreviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const businessId = typeof window !== 'undefined' ? localStorage.getItem(ACTIVE_BUSINESS_ID) : null;

    useEffect(() => {
        if (businessId) {
            dispatch(getAllServicesAction(businessId) as any);
            dispatch(getAllCategoriesAction(businessId) as any);
        }
    }, [dispatch]);

    useEffect(() => {
        if (allServices) setServices(Array.isArray(allServices) ? allServices : allServices.services || []);
    }, [allServices]);

    const filtered = services.filter((s) =>
        s.title?.toLowerCase().includes(search.toLowerCase()) ||
        s.subTitle?.toLowerCase().includes(search.toLowerCase())
    );

    const handleOpen = (service?: any) => {
        if (service) {
            setEditMode(true);
            setSelectedId(service._id);
            setForm({
                title: service.title || '',
                subTitle: service.subTitle || '',
                description: service.description || '',
                category: service.category || { categoryId: '', categoryName: '' },
                sku: service.sku || '',
                files: [],
            });
            setFilePreviews(service.media || []);
        } else {
            setEditMode(false);
            setSelectedId(null);
            setForm(initForm);
            setFilePreviews([]);
        }
        setDialogOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setForm((prev: any) => ({ ...prev, files: [...prev.files, ...files] }));
        const previews = files.map((f) => ({ type: f.type.startsWith('video') ? 'video' : 'image', url: URL.createObjectURL(f) }));
        setFilePreviews((prev) => [...prev, ...previews]);
    };

    const handleRemovePreview = (index: number) => {
        setFilePreviews((prev) => prev.filter((_, i) => i !== index));
        setForm((prev: any) => {
            const newFiles = prev.files.filter((_: any, i: number) => i !== index);
            return { ...prev, files: newFiles };
        });
    };

    const handleCategoryChange = (e: any) => {
        const cats = allCategories?.categories || allCategories || [];
        const cat = cats.find((c: any) => c._id === e.target.value);
        setForm((prev: any) => ({
            ...prev,
            category: { categoryId: e.target.value, categoryName: cat?.name || '' }
        }));
    };

    const handleSave = async () => {
        if (!form.title || !form.subTitle || !form.description) {
            toast.error('Please fill all required fields');
            return;
        }
        setLoading(true);
        try {
            if (editMode && selectedId) {
                await dispatch(updateServiceAction(businessId, selectedId, {
                    title: form.title, subTitle: form.subTitle, description: form.description,
                    category: form.category, sku: form.sku,
                }) as any);
                toast.success('Service updated successfully');
            } else {
                await dispatch(addServiceAction(businessId, form) as any);
                toast.success('Service created successfully');
            }
            await dispatch(getAllServicesAction(businessId) as any);
            setDialogOpen(false);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedId) return;
        setLoading(true);
        try {
            await dispatch(deleteServiceAction(businessId, selectedId) as any);
            await dispatch(getAllServicesAction(businessId) as any);
            toast.success('Service deleted');
            setDeleteDialogOpen(false);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (service: any) => {
        await dispatch(toggleServiceAction(businessId, service._id, !service.isActive) as any);
        await dispatch(getAllServicesAction(businessId) as any);
    };

    const cats = allCategories?.categories || allCategories || [];

    return (
        <div className="svc-root">
            {/* Header */}
            <div className="svc-header">
                <div>
                    <h1 className="svc-title">Services</h1>
                    <p className="svc-subtitle">Manage the services your business offers</p>
                </div>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    className="svc-add-btn"
                    onClick={() => handleOpen()}
                >
                    Add Service
                </Button>
            </div>

            {/* Toolbar */}
            <div className="svc-toolbar">
                <TextField
                    size="small"
                    placeholder="Search services..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" sx={{ color: '#9ca3af' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: 280, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    {filtered.length} service{filtered.length !== 1 ? 's' : ''}
                </Typography>
            </div>

            {/* Table */}
            <Paper className="svc-table-paper" elevation={0}>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {['#', 'Title', 'Subtitle', 'Category', 'SKU', 'Media', 'Status', 'Actions'].map((h) => (
                                    <TableCell key={h} className="svc-th">{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8}>
                                        <div className="svc-empty">
                                            <span className="svc-empty-icon">🛠️</span>
                                            <span className="svc-empty-text">No services found</span>
                                            <span className="svc-empty-sub">Add your first service to get started</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((svc, idx) => (
                                    <TableRow key={svc._id} className="svc-row">
                                        <TableCell className="svc-td svc-td-num">{page * rowsPerPage + idx + 1}</TableCell>
                                        <TableCell className="svc-td">
                                            <span className="svc-name">{svc.title}</span>
                                        </TableCell>
                                        <TableCell className="svc-td svc-td-muted">{svc.subTitle}</TableCell>
                                        <TableCell className="svc-td">
                                            {svc.category?.categoryName ? (
                                                <Chip label={svc.category.categoryName} size="small" className="svc-chip" />
                                            ) : '—'}
                                        </TableCell>
                                        <TableCell className="svc-td svc-td-mono">{svc.sku || '—'}</TableCell>
                                        <TableCell className="svc-td">
                                            {svc.media?.length > 0 ? (
                                                <div className="svc-media-thumb">
                                                    {svc.media[0].type === 'image' ? (
                                                        <img src={svc.media[0].url} alt="" className="svc-thumb-img" />
                                                    ) : (
                                                        <div className="svc-thumb-video">▶</div>
                                                    )}
                                                    {svc.media.length > 1 && (
                                                        <span className="svc-media-count">+{svc.media.length - 1}</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="svc-td-muted">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="svc-td">
                                            <Switch
                                                checked={!!svc.isActive}
                                                onChange={() => handleToggle(svc)}
                                                size="small"
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#5932ea' },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#5932ea' }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="svc-td">
                                            <div className="svc-actions">
                                                <Tooltip title="Edit">
                                                    <IconButton size="small" onClick={() => handleOpen(svc)} className="svc-action-btn svc-edit-btn">
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton size="small" onClick={() => { setSelectedId(svc._id); setDeleteDialogOpen(true); }} className="svc-action-btn svc-delete-btn">
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {filtered.length > 0 && (
                    <TablePagination
                        component="div"
                        count={filtered.length}
                        page={page}
                        onPageChange={(_, p) => setPage(p)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
                        rowsPerPageOptions={[8, 16, 32]}
                    />
                )}
            </Paper>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ className: 'svc-dialog' }}>
                <DialogTitle className="svc-dialog-title">
                    {editMode ? 'Edit Service' : 'Add New Service'}
                    <IconButton onClick={() => setDialogOpen(false)} size="small" sx={{ position: 'absolute', right: 12, top: 12 }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers className="svc-dialog-content">
                    <Stack spacing={2.5} sx={{ mt: 0.5 }}>
                        <TextField label="Title *" size="small" fullWidth value={form.title}
                            onChange={(e) => setForm((p: any) => ({ ...p, title: e.target.value }))} />
                        <TextField label="Subtitle *" size="small" fullWidth value={form.subTitle}
                            onChange={(e) => setForm((p: any) => ({ ...p, subTitle: e.target.value }))} />
                        <div>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#374151' }}>Service Details *</Typography>
                            <RichEditor
                                value={form.description}
                                onChange={(val: string) => setForm((p: any) => ({ ...p, description: val }))}
                                height={280}
                                placeholder="Describe your service in detail..."
                            />
                            <div style={{ height: 42 }} />
                        </div>
                        <FormControl size="small" fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select value={form.category?.categoryId || ''} label="Category" onChange={handleCategoryChange}>
                                {cats.map((c: any) => (
                                    <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField label="SKU" size="small" fullWidth value={form.sku}
                            onChange={(e) => setForm((p: any) => ({ ...p, sku: e.target.value }))} />

                        <div>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#374151' }}>Media</Typography>
                            <div className="svc-media-grid">
                                {filePreviews.map((fp, i) => (
                                    <div key={i} className="svc-media-preview">
                                        {fp.type === 'image' ? (
                                            <img src={fp.url} alt="" className="svc-preview-img" />
                                        ) : (
                                            <video src={fp.url} className="svc-preview-img" />
                                        )}
                                        <button className="svc-preview-remove" onClick={() => handleRemovePreview(i)}>✕</button>
                                    </div>
                                ))}
                                <label className="svc-upload-box">
                                    <AttachFileIcon sx={{ color: '#9ca3af', fontSize: 28 }} />
                                    <span className="svc-upload-text">Add Media</span>
                                    <input type="file" multiple accept="image/*,video/*" hidden onChange={handleFileChange} />
                                </label>
                            </div>
                        </div>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                    <Button onClick={() => setDialogOpen(false)} sx={{ color: '#6b7280', textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} disabled={loading}
                        sx={{ background: 'linear-gradient(135deg, #5932ea, #7c5af0)', textTransform: 'none', borderRadius: '8px', px: 3 }}>
                        {loading ? 'Saving...' : editMode ? 'Update Service' : 'Create Service'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ className: 'svc-dialog' }}>
                <DialogTitle>Delete Service</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
                        Are you sure you want to delete this service? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#6b7280', textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}
                        sx={{ textTransform: 'none', borderRadius: '8px' }}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}