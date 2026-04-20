'use client';

import { Button, Card, IconButton, Dialog, DialogContent, DialogTitle, useMediaQuery, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import "./Profile.css";
import { useEffect, useState } from "react";
import { uploadBusinessImagesAction } from "../../Redux/Actions/BusinessActions/business.actions";
import { ACTIVE_BUSINESS_ID } from "../../utils/constants";
import { useDispatch } from "react-redux";

const ImagesTab = ({ profile, setProfile }: any) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [previewData, setPreviewData] = useState({
        logoImage: profile?.logo?.logoUrl || null,
        featuredImage: profile?.featuredImage?.featuredUrl || null,
        bannerImage: profile.isBannerFeaturedImage ? null : profile.bannerImage?.bannerUrl,
        isBannerFeaturedImage: profile.isBannerFeaturedImage
    });
    const [fileData, setFileData] = useState<Record<string, File | null>>({
        logoImage: null,
        featuredImage: null,
        bannerImage: null,
    });
    const dispatch = useDispatch();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewSrc, setPreviewSrc] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handleImageChange = (event: any, field: any) => {
        const file = event.target.files[0];
        if (file) {
            setFileData({ ...fileData, [field]: file });
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewData({ ...previewData, [field]: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteImage = (field: any) => {
        setPreviewData({ ...previewData, [field]: "" });
    };

    useEffect(() => {
        setPreviewData({
            logoImage: profile?.logo?.logoUrl || null,
            featuredImage: profile?.featuredImage?.featuredUrl || null,
            bannerImage: profile.isBannerFeaturedImage ? null : profile.bannerImage?.bannerUrl,
            isBannerFeaturedImage: profile.isBannerFeaturedImage
        });
    }, [profile]);

    const handlePreview = (title: string, src: string) => {
        setPreviewTitle(title);
        setPreviewSrc(src);
        setPreviewOpen(true);
    };

    const handleUpdateProfile = async () => {
        let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
        if (fileData.logoImage) {
            dispatch(uploadBusinessImagesAction(businessId, fileData.logoImage, "LOGO_IMAGE") as any);
        }
        if (fileData.featuredImage) {
            dispatch(uploadBusinessImagesAction(businessId, fileData.featuredImage, "FEATURED_IMAGE") as any);
        }
        if (!previewData.isBannerFeaturedImage && fileData.bannerImage) {
            dispatch(uploadBusinessImagesAction(businessId, fileData.bannerImage, "BANNER_IMAGE") as any);
        }
    };

    const imageCards = [
        { key: 'logoImage', label: 'Logo', placeholder: 'https://placehold.co/400x400.png?text=No+Logo' },
        { key: 'featuredImage', label: 'Featured Image', placeholder: 'https://placehold.co/600x400.png?text=No+Featured' },
        ...(!previewData.isBannerFeaturedImage ? [{ key: 'bannerImage', label: 'Banner Image', placeholder: 'https://placehold.co/600x200.png?text=No+Banner' }] : []),
    ];

    return (
        <div className="w-full" style={{ fontFamily: "source Sans pro" }}>
            <div className="bg-white shadow-md w-full tab-wrapper-responsive" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px", padding: "clamp(12px, 3vw, 24px)" }}>
                <Card sx={{ padding: { xs: '12px', md: '24px' }, boxShadow: 'none', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                    <div className="images-tab-grid">
                        {imageCards.map((img) => {
                            const src = (previewData as any)[img.key];
                            return (
                                <div key={img.key} className="image-card">
                                    <h3 className="image-card-label">{img.label}</h3>
                                    <div className="image-card-preview">
                                        <img
                                            src={src || img.placeholder}
                                            alt={img.label}
                                            className="image-card-img"
                                        />
                                        <div className="image-card-overlay">
                                            <IconButton component="label" size="small" sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f3f0ff' }, boxShadow: 1 }}>
                                                <CloudUploadIcon fontSize="small" sx={{ color: "rgba(89, 50, 234, 1)" }} />
                                                <input type="file" accept="image/*" hidden onChange={(e) => handleImageChange(e, img.key)} />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f3f0ff' }, boxShadow: 1 }}
                                                onClick={() => handlePreview(img.label, src)}
                                                disabled={!src}
                                            >
                                                <VisibilityIcon fontSize="small" sx={{ color: "rgba(89, 50, 234, 1)" }} />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#fff0f0' }, boxShadow: 1 }}
                                                onClick={() => handleDeleteImage(img.key)}
                                                disabled={!src}
                                            >
                                                <DeleteIcon fontSize="small" sx={{ color: "#ef4444" }} />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
                    <Button variant='outlined'>Reset</Button>
                    <Button variant='contained' onClick={handleUpdateProfile} sx={{ backgroundColor: "rgba(89, 50, 234, 1)" }}>
                        Update Profile
                    </Button>
                </div>
            </div>

            <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth fullScreen={isMobile}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: { xs: '1rem', md: '1.25rem' } }}>
                    {previewTitle}
                    <IconButton onClick={() => setPreviewOpen(false)}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ padding: { xs: '8px', md: '20px' } }}>
                    <img src={previewSrc} alt={previewTitle} style={{ width: '100%', borderRadius: 8, maxHeight: '80vh', objectFit: 'contain' }} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ImagesTab;
