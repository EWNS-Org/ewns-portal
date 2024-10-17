import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { RiGalleryView2 } from "react-icons/ri";
import { FaUsersLine } from "react-icons/fa6";
import {
  RiArrowDropDownLine,
  RiArrowDropUpLine,
  RiArrowDropRightLine,
} from "react-icons/ri";
import {
  FiUser,
  FiBox,
  FiShoppingCart,
  FiBriefcase,
  FiMusic,
  FiCalendar,
  FiMail,
  FiSettings,
  FiUserCheck,
  FiGlobe,
  FiBarChart,
  FiClipboard,
  FiSearch,
} from "react-icons/fi";
import { FaPuzzlePiece } from "react-icons/fa";

import {
  Box,
  Button,
  Avatar,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { AiFillPlusCircle } from "react-icons/ai";
import { MdDevices } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  getBusinessDetailsAction,
  getAllBusinessesAction,
} from "../../Redux/Actions/BusinessActions/business.actions";
import "./sidebar.css";

const Sidebar = ({ userRole, children }: any) => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [company, setCompany] = useState("");
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);
  const [sidebarItemsState, setSidebarItemsState] = useState<any>([]);

  const dispatch = useDispatch();
  const businesses = useSelector((state: any) => state.business.businesses);

  const sidebarItems = [
    {
      name: "Dashboard",
      hasChild: false,
      icon: <RiGalleryView2 />,
      isOpen: false,
      goto: "/dashboard",
    },
    {
      name: "Profile",
      hasChild: false,
      icon: <FiUser />,
      isOpen: false,
      goto: "/profile",
    },
    {
      name: "Categories",
      hasChild: false,
      icon: <FiBox />,
      isOpen: false,
      goto: "/categories",
    },
    {
      name: "Testimonials",
      hasChild: false,
      icon: <FaUsersLine />,
      isOpen: false,
      goto: "/testimonials",
    },
    {
      name: "Products",
      hasChild: false,
      icon: <FiShoppingCart />,
      isOpen: false,
      goto: "/products",
    },
    {
      name: "Services",
      hasChild: false,
      icon: <FiBriefcase />,
      isOpen: false,
      goto: "/services",
    },
    {
      name: "Albums",
      hasChild: false,
      icon: <FiMusic />,
      isOpen: false,
      goto: "/albums",
    },
    {
      name: "Appointments",
      hasChild: false,
      icon: <FiCalendar />,
      isOpen: false,
      goto: "/appointments",
    },
    {
      name: "Messages",
      hasChild: false,
      icon: <FiMail />,
      isOpen: false,
      goto: "/messages",
    },
    {
      name: "Subscription",
      hasChild: false,
      icon: <FiCalendar />,
      isOpen: false,
      goto: "/subscription",
    },
    {
      name: "Settings",
      hasChild: true,
      icon: <FiSettings />,
      isOpen: false,
      children: [
        {
          name: "Account",
          hasChild: false,
          icon: <FiUserCheck />,
          isOpen: false,
          goto: "/settings/your-account",
        },
        {
          name: "SEO",
          hasChild: false,
          icon: <FiSearch />,
          isOpen: false,
          goto: "/settings/seo",
        },
      ],
    },
    {
      name: "Plugins",
      hasChild: true,
      icon: <FaPuzzlePiece />,
      isOpen: false,
      children: [
        {
          name: "Themes",
          hasChild: false,
          icon: <FaPuzzlePiece />,
          isOpen: false,
          goto: "/plugins/themes",
        },
        {
          name: "Custom Domain",
          hasChild: false,
          icon: <FiGlobe />,
          isOpen: false,
          goto: "/plugins/custom-domain",
        },
        {
          name: "Analytics",
          hasChild: false,
          icon: <FiBarChart />,
          isOpen: false,
          goto: "/plugins/analytics",
        },
        {
          name: "Marketing",
          hasChild: false,
          icon: <FiClipboard />,
          isOpen: false,
          goto: "/plugins/marketing",
        },
      ],
    },
  ];

  useEffect(() => {
    dispatch(getAllBusinessesAction() as any);
    setSidebarItemsState(sidebarItems); // Initialize state for sidebar items
  }, [dispatch]);

  useEffect(() => {
    if (businesses?.length > 0) {
      setAllBusinesses(businesses);
      const businessId =
        localStorage.getItem("activeBusinessId") || businesses[0]?._id;
      setCompany(businessId);
      localStorage.setItem("activeBusinessId", businessId);
    }
  }, [businesses]);

  const handlePopupOpen = () => setPopupOpen(true);
  const handlePopupClose = () => {
    setPopupOpen(false);
    setCompany(localStorage.getItem("activeBusinessId") as string);
  };

  const handleChange = (event: SelectChangeEvent) => {
    const businessId = event.target.value;
    setCompany(businessId);
    localStorage.setItem("activeBusinessId", businessId);
    dispatch(getBusinessDetailsAction(businessId) as any);
  };

  // Toggle dropdown for items with children
  const toggleDropdown = (index: number) => {
    const updatedSidebarItems = sidebarItemsState.map(
      (item: any, i: number) => {
        if (i === index) {
          return { ...item, isOpen: !item.isOpen };
        }
        return item;
      }
    );
    setSidebarItemsState(updatedSidebarItems);
  };

  const handleItemClick = (item: any) => {
    if (!item.hasChild) {
      setSelectedItem(item.goto);
      navigate(item.goto);
    } else {
      // Toggle the dropdown
      toggleDropdown(sidebarItemsState.indexOf(item));
    }
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <div className="sidebar-logo">
          <img src="/assets/ewns-logo.svg" alt="Logo" />
        </div>

        <div className="business-selector">
          <Box>
            <Select
              id="company-select"
              value={company}
              onChange={handleChange}
              displayEmpty
              fullWidth
              className="company-select"
              placeholder="Select a business"
              sx={{ color: "black" }} // Set text color to black
            >
              <MenuItem value="" disabled>
                <em>Select a business</em> {/* Placeholder text */}
              </MenuItem>
              {allBusinesses.map((business: any) => (
                <MenuItem value={business?._id} key={business?._id}>
                  <ListItemAvatar>
                    <Avatar>
                      <MdDevices />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={business.businessName} />
                </MenuItem>
              ))}
              <Button
                onClick={handlePopupOpen}
                variant="contained"
                className="create-business-button"
              >
                <AiFillPlusCircle /> Create Business
              </Button>
            </Select>
          </Box>
        </div>

        <div>
          {sidebarItemsState.map((item: any, index: number) => (
            <div key={index}>
              <div
                className={`sidebar-item ${
                  selectedItem === item.goto ? "sidebar-item-selected" : ""
                }`}
                onClick={() => handleItemClick(item)}
              >
                <div className="flex-row gap-2">
                  <div className="">{item.icon}</div>
                  <div className="mt-1">{item.name}</div>
                  {item.hasChild && (
                    <div>
                      {item.isOpen ? (
                        <RiArrowDropUpLine />
                      ) : (
                        <RiArrowDropDownLine />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {item.isOpen && item.hasChild && (
                <div className="sidebar-item-children">
                  {item.children.map((childItem: any, childIndex: number) => (
                    <div
                      key={childIndex}
                      className="sidebar-sub-item"
                      onClick={() => handleItemClick(childItem)}
                    >
                      <div className="flex-row-vertically gap-2">
                        <span>
                          <RiArrowDropRightLine />
                        </span>
                        <span>{childItem.icon}</span>
                        <span className="mt-1">{childItem.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        <Header
          isPopupOpen={isPopupOpen}
          handlePopupOpen={handlePopupOpen}
          handlePopupClose={handlePopupClose}
        />
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
