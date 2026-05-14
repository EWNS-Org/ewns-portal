'use client';

import { Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getBusinessDetailsAction } from '../../Redux/Actions/BusinessActions/business.actions';
import "./Profile.css";
import ProfileTab from './ProfileTab';
import AboutUsTab from './AboutTab';
import ImagesTab from './ImagesTab';
import BusinessHours from './BusinessHours';
import AddressTab from './AddressTab';
import ExternalLinksTab from './ExternalLinksTab';
import FAQTab from './FAQTab';

const tabs = ['Profile', 'About', 'Images', 'Timings', 'Address', 'External Links', 'FAQs'];

const PersonalProfile = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const router = useRouter();
    const navigate = (path: string) => router.push(path);
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
    const subDetails = businessDetails?.subscriptionDetails;
    const aiCredits = businessDetails?.aiCredits;

    const daysLeft = subDetails?.endDate
        ? Math.max(0, Math.ceil((new Date(subDetails.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : null;
    const startDateStr = subDetails?.startDate
        ? new Date(subDetails.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : '—';
    const planName = subDetails?.subscriptionName ?? 'Basic Free';
    const totalCredits = ((aiCredits?.planCredits ?? 0) + (aiCredits?.addonCredits ?? 0));

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
        <div className="profile-page">
            {/* Page Header */}
            <div className="profile-page-header">
                <h1 className="profile-page-title">Profile</h1>
                <p className="profile-page-subtitle">Manage your business details, hours, address and more</p>
            </div>

            {/* Tab Navigation */}
            <div className="profile-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`profile-tab ${activeTab === tab ? 'profile-tab--active' : ''}`}
                            onClick={() => handleTabChange(tab)}
                        >
                            {tab}
                        </button>
                    ))}
            </div>

            {/* Content Area */}
            <div className="profile-content">
                {/* Subscription Banner */}
                <div className="subscription-banner">
                    <span className="subscription-banner-title">📋 Subscription</span>
                    <div className="subscription-banner-stats">
                        <div className="subscription-stat">
                            <span className="subscription-stat__label">Plan</span>
                            <span className="subscription-stat__value">{planName}</span>
                        </div>
                        <div className="subscription-stat-divider" />
                        <div className="subscription-stat">
                            <span className="subscription-stat__label">Start Date</span>
                            <span className="subscription-stat__value">{startDateStr}</span>
                        </div>
                        <div className="subscription-stat-divider" />
                        <div className="subscription-stat">
                            <span className="subscription-stat__label">Days Left</span>
                            <span className="subscription-stat__value">{daysLeft !== null ? `${daysLeft}d` : '—'}</span>
                        </div>
                        <div className="subscription-stat-divider" />
                        <div className="subscription-stat">
                            <span className="subscription-stat__label">⚡ AI Credits</span>
                            <span className="subscription-stat__value">{totalCredits.toLocaleString()}</span>
                        </div>
                    </div>
                    <button className="subscription-more-btn" onClick={() => navigate("/subscription")}>
                        Manage
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'Profile' && <ProfileTab initialProfileDetails={initialProfileDetails} setProfileDetails={setProfile} profileDetails={profile} businessDetails={businessDetails} />}
                {activeTab === 'About' && <AboutUsTab profile={profile} setProfile={(data: any) => { setProfile((prev: any) => ({ ...prev, data })) }} />}
                {activeTab === 'Images' && <ImagesTab profile={profile} setProfile={setProfile} />}
                {activeTab === 'Timings' && <BusinessHours profileDetails={profile} setProfileDetails={setProfile} />}
                {activeTab === 'Address' && <AddressTab />}
                {activeTab === 'External Links' && <ExternalLinksTab profile={profile} setProfile={setProfile} />}
                {activeTab === 'FAQs' && <FAQTab profile={profile} setProfile={setProfile} />}
            </div>
        </div>
    );
};

export default PersonalProfile;
