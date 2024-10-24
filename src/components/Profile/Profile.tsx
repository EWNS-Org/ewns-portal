import {
  Box,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Card,
  Button,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { countryList } from "../../utils/constants/country-flag";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBusinessDetailsAction } from "../../Redux/Actions/BusinessActions/business.actions";
import { Checkbox, FormControlLabel } from "@mui/material";
import ProfileTab from "./ProfileTab";
import AboutUsTab from "./AboutTab";
import ImagesTab from "./ImagesTab";
import BusinessHours from "./BusinessHours";
import AddressTab from "./AddressTab";
import ExternalLinksTab from "./ExternalLinksTab";
import FAQTab from "./FAQTab";

const PersonalProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile");
  const initialProfileDetails = {
    businessName: "",
    category: "",
    url: "",
    countryCode: "",
    phone: "",
    email: "",
    googleProfileUrl: "",
    shortBio: "",
    description: "",
    externalLinks: [],
    keywords: [],
    logo: {
      favLogoUrl: "",
      logoUrl: "",
      originalLogoUrl: "",
    },
    featuredImage: {
      featuredUrl: "",
      originalUrl: "",
      bannerUrl: "",
    },
    widgets: [],
    bannerImage: {
      bannerUrl: "",
      originalUrl: "",
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
        close: "22:00",
      },
      tuesday: {
        isClosed: false,
        open: "09:00",
        close: "22:00",
      },
      wednesday: {
        isClosed: false,
        open: "09:00",
        close: "22:00",
      },
      thursday: {
        isClosed: false,
        open: "09:00",
        close: "22:00",
      },
      friday: {
        isClosed: false,
        open: "09:00",
        close: "22:00",
      },
      saturday: {
        isClosed: false,
        open: "09:00",
        close: "22:00",
      },
      sunday: {
        isClosed: true,
        open: "",
        close: "",
      },
    },
    enableAppointments: true,
    enableOrders: true,
  };
  const businessDetails = useSelector(
    (state: any) => state.business.businessDetails
  );

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
  }, [activeTab]);

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
    <div className="personal-profile-container">
      <div className="tab-header">
        <div className="tab-list">
          {[
            "Profile",
            "About",
            "Images",
            "Timings",
            "Address",
            "External Links",
            "FAQs",
          ].map((tab) => (
            <div
              key={tab}
              className={`tab-item ${activeTab === tab ? "active-tab" : ""}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      <div className="profile-content">
        <div className="subscription-header">
          <div className="subscription-details">
            <Typography sx={{ fontSize: "18px", color: "white" }}>
              Subscription Details
            </Typography>
            <Typography sx={{ fontSize: "18px", color: "white" }}>
              Basic
            </Typography>
          </div>
          <div className="subscription-period">
            <Typography sx={{ fontSize: "18px", color: "white" }}>
              Start: {"12 September, 2023"}
            </Typography>
            <Typography sx={{ fontSize: "18px", color: "white" }}>
              Days left: {"Unlimited"}
            </Typography>
          </div>
          <div
            className="more-details"
            onClick={() => navigate("/subscription")}
          >
            More Details {">>"}
          </div>
        </div>

        {activeTab === "Profile" && (
          <ProfileTab
            initialProfileDetails={initialProfileDetails}
            setProfileDetails={setProfile}
            profileDetails={profile}
            businessDetails={businessDetails}
          />
        )}
        {activeTab === "About" && (
          <AboutUsTab
            profile={profile}
            setProfile={(data: any) => {
              setProfile((prev: any) => ({ ...prev, data }));
            }}
          />
        )}
        {activeTab === "Images" && (
          <ImagesTab profile={profile} setProfile={setProfile} />
        )}
        {activeTab === "Timings" && (
          <BusinessHours
            profileDetails={profile}
            setProfileDetails={setProfile}
          />
        )}
        {activeTab === "Address" && <AddressTab />}
        {activeTab === "External Links" && (
          <ExternalLinksTab profile={profile} setProfile={setProfile} />
        )}
        {activeTab === "FAQs" && (
          <FAQTab profile={profile} setProfile={setProfile} />
        )}
      </div>
    </div>
  );
};

export default PersonalProfile;
