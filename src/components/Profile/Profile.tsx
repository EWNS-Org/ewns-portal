import { Box, CardContent, CardHeader, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Card, Button, IconButton } from '@mui/material';
import React, { Profiler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { countryList } from '../../utils/constants/country-flag';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBusinessDetailsAction, updateBusinessProfileAction, uploadBusinessImagesAction } from '../../Redux/Actions/BusinessActions/business.actions';
import { Checkbox, FormControlLabel } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

import { categories } from '../../utils/constants/categories';
import { validateFields, validateTimings } from '../../Helpers/common.helper';
import { Editor } from '@tinymce/tinymce-react';
import RichEditor from '../common/BundledRichEditor/RichEditor';
import "./Profile.css";
import ProfileTab from './ProfileTab';
import AboutUsTab from './AboutTab';
import ImagesTab from './ImagesTab';
import BusinessHours from './BusinessHours';



const PersonalProfile = () => {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Profile');
    const initialProfileDetails = {
        businessName: '',
        category: '',
        url: '',
        countryCode: '',
        phone: '',
        email: '',
        googleProfileUrl: '',
        shortBio: '',
        description: '',
        externalLinks: [],
        keywords: [],
        logo: {
            favLogoUrl: '',
            logoUrl: '',
            originalLogoUrl: ''
        },
        featuredImage: {
            featuredUrl: '',
            originalUrl: '',
            bannerUrl: '',
        },
        widgets: [],
        bannerImage: {
            bannerUrl: '',
            originalUrl: ''
        },
        socialLinks: [],
        additionalInfo: [],
        isBannerFeaturedImage: true,
        isActive: true,
        timings: {
            monday: {
                isClosed: false,
                open: "09:00",
                close: "22:00"
            },
            tuesday: {
                isClosed: false,
                open: "09:00",
                close: "22:00"
            }, wednesday: {
                isClosed: false,
                open: "09:00",
                close: "22:00"
            }, thursday: {
                isClosed: false,
                open: "09:00",
                close: "22:00"
            }, friday: {
                isClosed: false,
                open: "09:00",
                close: "22:00"
            }, saturday: {
                isClosed: false,
                open: "09:00",
                close: "22:00"
            }, sunday: {
                isClosed: true,
                open: "",
                close: ""
            },
        }
    };
    const businessDetails = useSelector((state: any) => state.business.businessDetails);


    const [profile, setProfile] = useState(initialProfileDetails);
    const [previewData, setPreviewData] = useState({
        logoImage: null,
        featuredImage: null,
        bannerImage: null,
        isBannerFeaturedImage: null
    })

    const dispatch = useDispatch();


    useEffect(() => {
        if (businessDetails) {
            setProfile(businessDetails);
            setPreviewData({
                logoImage: profile?.logo?.logoUrl || null,
                featuredImage: profile?.featuredImage?.featuredUrl || null,
                bannerImage: profile.isBannerFeaturedImage ? null : profile.bannerImage?.bannerUrl,
                isBannerFeaturedImage: profile.isBannerFeaturedImage
            } as any);
        }
    }, [businessDetails, setProfile]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };
    useEffect(() => {
        let businessId = localStorage.getItem("activeBusinessId");
        if (businessId) {
            dispatch(getBusinessDetailsAction(businessId) as any);
        }
    }, [dispatch]);

    const handleUpdateProfile = async () => {
        if (activeTab === "Images") {
            let updates: any = {
                logoContent: null,
                featuredContent: null,
                bannerContent: null,
                isBannerFeaturedImage: previewData.isBannerFeaturedImage
            }
            console.log(previewData.logoImage, profile.logo?.logoUrl)
            if (previewData.logoImage !== profile.logo?.logoUrl) {
                updates.logoContent = previewData.logoImage;
            }
            if (previewData.featuredImage !== profile.featuredImage?.featuredUrl) {
                updates.featuredContent = previewData.featuredImage;
            }
            if (!previewData.isBannerFeaturedImage && previewData.bannerImage !== profile.bannerImage?.bannerUrl) {
                updates.bannerContent = previewData.bannerImage;
            };

            dispatch(uploadBusinessImagesAction(businessDetails.businessId, updates) as any);
        }
        else {
            let isFormChanged = JSON.stringify(businessDetails) !== JSON.stringify(profile);
            if (isFormChanged && validateFields(["businessName", "email"], false, profile) && validateTimings(profile.timings)) {
                dispatch(updateBusinessProfileAction(profile, businessDetails.businessId) as any);
            }
        }
    }

    return (
        <div className="w-full p-10 h-[65vh] font-semibold" style={{ fontFamily: "monospace", fontSize: "20px" }}>
            <div className="w-full p-2" style={{ display: "flex", backgroundColor: "white" }}>
                <div className="w-full" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {['Profile', 'About', 'Images', 'Timings', 'Address', 'External Links', 'FAQs'].map((tab) => (
                        <div
                            key={tab}
                            className={` w-full cursor-pointer py-2 ${activeTab === tab ? 'border-t-2 text-violet-500' : 'text-black-500'}`}
                            style={{ alignItems: "center", justifyContent: "center", display: "flex", borderColor: "rgba(89, 50, 234, 1)", color: "" }}
                            onClick={() => handleTabChange(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
            </div>

            <div className="  mx-auto p-6 w-full flex justify-between items-center border-b pb-3">
                <div>
                    <h1 className="text-2xl font-semibold">Business {activeTab}</h1>
                </div>
            </div>

            <div className='container w-full p-6 ' style={{}}>
                <div className=' w-full h-20 p-4' style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px", backgroundColor: "rgba(89, 50, 234, 1)" }}>
                    <div className='flex ' style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <div className='flex-col font-semibold' style={{ fontSize: "8px" }}>
                            <Typography sx={{ fontSize: "18px", color: "white" }}>Subscription Details  </Typography>
                            <Typography sx={{ fontSize: "18px", color: "white" }}> Basic</Typography>
                        </div>
                        <div className='flex-col  font-semibold' style={{ fontSize: "8px" }}>
                            <Typography sx={{ fontSize: "18px", color: "white" }}>Start : {"12 September, 2023"}  </Typography>
                            <Typography sx={{ fontSize: "18px", color: "white" }}> Days left : {"Unlimited"}</Typography>
                        </div>
                        <div style={{ cursor: "pointer" }} onClick={() => navigate("/subscription")}>
                            <div style={{ backgroundColor: "rgba(89, 50, 234, 1)", color: "white" }}>More Details {">>"}</div>
                        </div>
                    </div>
                </div>
                {activeTab === 'Profile' && <ProfileTab handleUpdateProfile={handleUpdateProfile} initialProfileDetails={initialProfileDetails} setProfile={setProfile} profile={profile} businessDetails={businessDetails} />}
                {activeTab === 'About' && <AboutUsTab profile={profile} setProfile={setProfile} />}
                {activeTab === 'Images' && <ImagesTab previewData={previewData} setPreviewData={setPreviewData} />}
                {activeTab === 'Timings' && <BusinessHours profile={profile} setProfile={setProfile} />}
                {activeTab === 'Address' && <AddressTab />}
                {activeTab === 'External Links' && <SocialMediaTab />}
            </div>

            <div className="flex  my-1 w-full" style={{ justifyContent: "space-between" }}>
                <Button variant='outlined' onClick={() => setProfile(businessDetails)}>
                    Reset
                </Button>
                <Button variant='contained' onClick={() => handleUpdateProfile()} >
                    Update Profile
                </Button>
            </div>
        </div >
    );
};


/* Address Tab Content */
const AddressTab = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Address</h2>
            <p>Manage your business address information.</p>
            {/* Add address input fields */}
        </div>
    );
};

/* Social Media Tab Content */
const SocialMediaTab = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Social Media</h2>
            <p>Add links to your social media profiles for better engagement.</p>
            {/* Add social media input fields */}
        </div>
    );
};

export default PersonalProfile;
