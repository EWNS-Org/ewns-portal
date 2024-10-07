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
import AddressTab from './AddressTab';
import ExternalLinksTab from './ExternalLinksTab';
import FAQTab from './FAQTab';



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
        businessType: "BOTH",
        enableUserLogin: true,
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
        },
        enableAppointments: true,
        enableOrders: true,
    };
    const businessDetails = useSelector((state: any) => state.business.businessDetails);

    const [profile, setProfile] = useState(initialProfileDetails);
    const [showButtons, setShowButtons] = useState<boolean>(true);

    const dispatch = useDispatch();

    useEffect(() => {
        if (businessDetails) {
            setProfile(businessDetails);
        }
    }, [businessDetails, setProfile]);

    useEffect(() => {
        if (["Address", "External Links", "FAQs"].includes(activeTab)) {
            setShowButtons(false);
        } else {
            setShowButtons(true);
        }
    }, [activeTab])

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };
    useEffect(() => {
        let businessId = localStorage.getItem("activeBusinessId");
        if (businessId) {
            dispatch(getBusinessDetailsAction(businessId) as any);
        }
    }, [dispatch]);

    return (
        <div className="w-full  h-[65vh] font-semibold font-sans" style={{ fontSize: "20px" }}>
            <div className="w-full py-1" style={{ display: "flex", backgroundColor: "white" }}>
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

           

            <div className='container w-full py-4 ' style={{}}>
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
                {activeTab === 'Profile' && <ProfileTab  initialProfileDetails={initialProfileDetails} setProfileDetails={setProfile} profileDetails={profile} businessDetails={businessDetails} />}
                {activeTab === 'About' && <AboutUsTab profile={profile} setProfile={(data:any) => {setProfile((prev: any)=>({...prev, data}))}} />}
                {activeTab === 'Images' && <ImagesTab profile={profile} setProfile={setProfile} />}
                {activeTab === 'Timings' && <BusinessHours profileDetails={profile} setProfileDetails={setProfile} />}
                {activeTab === 'Address' && <AddressTab />}
                {activeTab === 'External Links' && <ExternalLinksTab profile={profile} setProfile={setProfile} />}
                {activeTab === 'FAQs' && <FAQTab profile={profile} setProfile={setProfile} />}
            </div>


        </div >
    );
};

export default PersonalProfile;
