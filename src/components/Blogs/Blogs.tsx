'use client';

import React, { useEffect, useState } from 'react';
import {
    Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, InputAdornment, MenuItem, Paper, Switch,
    Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
    TableRow, TextField, Tooltip, Typography, FormControl, InputLabel, Select, Stack, Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBlogsAction, addBlogAction, updateBlogAction, deleteBlogAction, toggleBlogAction } from '../../Redux/Actions/Blogs/blog.actions';
import { getAllCategoriesAction } from '../../Redux/Actions/Categories/category.actions';
import { ACTIVE_BUSINESS_ID } from '../../utils/constants';
import toast from 'react-hot-toast';
import RichEditor from '../common/BundledRichEditor/RichEditor';
import './Blogs.css';

const initForm = {
    title: '',
    subTitle: '',
    description: '',
    bloggerName: '',
    category: { categoryId: '', categoryName: '' },
    sku: '',
    files: [] as File[],
};

export default function Blogs() {
    const dispatch = useDispatch();
    const allBlogs = useSelector((state: any) => state.blogs.allBlogs);
    const allCategories = useSelector((state: any) => state.categories.allCategories);

    const [blogs, setBlogs] = useState<any[]>([]);
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
            dispatch(getAllBlogsAction(businessId) as any);
            dispatch(getAllCategoriesAction(businessId) as any);
        }
    }, [dispatch]);

    useEffect(() => {
        if (allBlogs) setBlogs(Array.isArray(allBlogs) ? allBlogs : allBlogs.blogs || []);
    }, [allBlogs]);

    const filtered = blogs.filter((b) =>
        b.title?.toLowerCase().includes(search.toLowerCase()) ||
        b.bloggerName?.toLowerCase().includes(search.toLowerCase())
    );

    const handleOpen = (blog?: any) => {
        if (blog) {
            setEditMode(true);
            setSelectedId(blog._id);
            setForm({
                title: blog.title || '',
                subTitle: blog.subTitle || '',
                description: blog.description || '',
                bloggerName: blog.bloggerName || '',
                category: blog.category || { categoryId: '', categoryName: '' },
                sku: blog.sku || '',
                files: [],
            });
            setFilePreviews(blog.media || []);
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
        setForm((prev: any) => ({ ...prev, files: prev.files.filter((_: any, i: number) => i !== index) }));
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
        if (!form.title || !form.subTitle || !form.bloggerName) {
            toast.error('Please fill all required fields');
            return;
        }
        setLoading(true);
        try {
            if (editMode && selectedId) {
                await dispatch(updateBlogAction(businessId, selectedId, {
                    title: form.title, subTitle: form.subTitle, description: form.description,
                    bloggerName: form.bloggerName, category: form.category, sku: form.sku,
                }) as any);
                toast.success('Blog updated successfully');
            } else {
                await dispatch(addBlogAction(businessId, form) as any);
                toast.success('Blog created successfully');
            }
            await dispatch(getAllBlogsAction(businessId) as any);
            setDialogOpen(false);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedId) return;
        setLoading(true);
        try {
            await dispatch(deleteBlogAction(businessId, selectedId) as any);
            await dispatch(getAllBlogsAction(businessId) as any);
            toast.success('Blog deleted');
            setDeleteDialogOpen(false);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (blog: any) => {
        await dispatch(toggleBlogAction(businessId, blog._id, !blog.isActive) as any);
        await dispatch(getAllBlogsAction(businessId) as any);
    };

    const cats = allCategories?.categories || allCategories || [];

    return (
        <div className="blog-root">
            {/* Header */}
            <div className="blog-header">
                <div>
                    <h1 className="blog-title">Blogs</h1>
                    <p className="blog-subtitle">Create and manage your blog posts</p>
                </div>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    className="blog-add-btn"
                    onClick={() => handleOpen()}
                >
                    New Blog Post
                </Button>
            </div>

            {/* Stats */}
            <div className="blog-stats">
                <div className="blog-stat-card">
                    <span className="blog-stat-value">{blogs.length}</span>
                    <span className="blog-stat-label">Total Posts</span>
                </div>
                <div className="blog-stat-card blog-stat-card--active">
                    <span className="blog-stat-value">{blogs.filter(b => b.isActive).length}</span>
                    <span className="blog-stat-label">Published</span>
                </div>
                <div className="blog-stat-card blog-stat-card--draft">
                    <span className="blog-stat-value">{blogs.filter(b => !b.isActive).length}</span>
                    <span className="blog-stat-label">Drafts</span>
                </div>
            </div>

            {/* Toolbar */}
            <div className="blog-toolbar">
                <TextField
                    size="small"
                    placeholder="Search blogs..."
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
                    {filtered.length} post{filtered.length !== 1 ? 's' : ''}
                </Typography>
            </div>

            {/* Table */}
            <Paper className="blog-table-paper" elevation={0}>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {['#', 'Title', 'Blogger', 'Category', 'SKU', 'Media', 'Published', 'Actions'].map((h) => (
                                    <TableCell key={h} className="blog-th">{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8}>
                                        <div className="blog-empty">
                                            <ArticleOutlinedIcon sx={{ fontSize: 48, color: '#d1d5db', mb: 1 }} />
                                            <span className="blog-empty-text">No blog posts yet</span>
                                            <span className="blog-empty-sub">Start writing your first post</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((blog, idx) => (
                                    <TableRow key={blog._id} className="blog-row">
                                        <TableCell className="blog-td blog-td-num">{page * rowsPerPage + idx + 1}</TableCell>
                                        <TableCell className="blog-td">
                                            <div className="blog-title-cell">
                                                <span className="blog-post-title">{blog.title}</span>
                                                {blog.subTitle && <span className="blog-post-subtitle">{blog.subTitle}</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="blog-td">
                                            <div className="blog-blogger">
                                                <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: '#ede9fe', color: '#5932ea' }}>
                                                    {blog.bloggerName?.[0]?.toUpperCase()}
                                                </Avatar>
                                                <span className="blog-blogger-name">{blog.bloggerName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="blog-td">
                                            {blog.category?.categoryName ? (
                                                <Chip label={blog.category.categoryName} size="small" className="blog-chip" />
                                            ) : '—'}
                                        </TableCell>
                                        <TableCell className="blog-td blog-td-mono">{blog.sku || '—'}</TableCell>
                                        <TableCell className="blog-td">
                                            {blog.media?.length > 0 ? (
                                                <div className="blog-media-thumb">
                                                    {blog.media[0].type === 'image' ? (
                                                        <img src={blog.media[0].url} alt="" className="blog-thumb-img" />
                                                    ) : (
                                                        <div className="blog-thumb-video">▶</div>
                                                    )}
                                                    {blog.media.length > 1 && (
                                                        <span className="blog-media-count">+{blog.media.length - 1}</span>
                                                    )}
                                                </div>
                                            ) : <span className="blog-td-muted">—</span>}
                                        </TableCell>
                                        <TableCell className="blog-td">
                                            <Switch
                                                checked={!!blog.isActive}
                                                onChange={() => handleToggle(blog)}
                                                size="small"
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#5932ea' },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#5932ea' }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="blog-td">
                                            <div className="blog-actions">
                                                <Tooltip title="Edit">
                                                    <IconButton size="small" onClick={() => handleOpen(blog)} className="blog-action-btn blog-edit-btn">
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton size="small" onClick={() => { setSelectedId(blog._id); setDeleteDialogOpen(true); }} className="blog-action-btn blog-delete-btn">
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
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ className: 'blog-dialog' }}>
                <DialogTitle className="blog-dialog-title">
                    {editMode ? 'Edit Blog Post' : 'New Blog Post'}
                    <IconButton onClick={() => setDialogOpen(false)} size="small" sx={{ position: 'absolute', right: 12, top: 12 }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers className="blog-dialog-content">
                    <Stack spacing={2.5} sx={{ mt: 0.5 }}>
                        <TextField label="Title *" size="small" fullWidth value={form.title}
                            onChange={(e) => setForm((p: any) => ({ ...p, title: e.target.value }))} />
                        <TextField label="Subtitle *" size="small" fullWidth value={form.subTitle}
                            onChange={(e) => setForm((p: any) => ({ ...p, subTitle: e.target.value }))} />
                        <TextField label="Blogger Name *" size="small" fullWidth value={form.bloggerName}
                            onChange={(e) => setForm((p: any) => ({ ...p, bloggerName: e.target.value }))} />
                        <div>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#374151' }}>Blog Details</Typography>
                            <RichEditor
                                value={form.description}
                                onChange={(val: string) => setForm((p: any) => ({ ...p, description: val }))}
                                height={320}
                                placeholder="Write your blog content here..."
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
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#374151' }}>Cover Media</Typography>
                            <div className="blog-media-grid">
                                {filePreviews.map((fp, i) => (
                                    <div key={i} className="blog-media-preview">
                                        {fp.type === 'image' ? (
                                            <img src={fp.url} alt="" className="blog-preview-img" />
                                        ) : (
                                            <video src={fp.url} className="blog-preview-img" />
                                        )}
                                        <button className="blog-preview-remove" onClick={() => handleRemovePreview(i)}>✕</button>
                                    </div>
                                ))}
                                <label className="blog-upload-box">
                                    <AttachFileIcon sx={{ color: '#9ca3af', fontSize: 28 }} />
                                    <span className="blog-upload-text">Add Media</span>
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
                        {loading ? 'Saving...' : editMode ? 'Update Post' : 'Publish Post'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ className: 'blog-dialog' }}>
                <DialogTitle>Delete Blog Post</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
                        Are you sure you want to delete this blog post? This action cannot be undone.
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
