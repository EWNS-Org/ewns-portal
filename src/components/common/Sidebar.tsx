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
  selectClasses,
} from "@mui/material";
import { AiFillPlusCircle } from "react-icons/ai";
import { MdDevices } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  getBusinessDetailsAction,
  getAllBusinessesAction,
} from "../../Redux/Actions/BusinessActions/business.actions";
import { getAvatar } from "../../Helpers/common.helper";

const Sidebar = ({ userRole, children }: any) => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<string | undefined>("/dashboard");
  const [company, setCompany] = useState("");
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);
  const [sidebarItemsState, setSidebarItemsState] = useState<any>([]);

  const dispatch = useDispatch();
  const businesses = useSelector((state: any) => state.business.businesses);

  const sidebarItems : any= [
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
      name: "Categories & Testimonials",
      hasChild: false,
      icon: <FiBox />,
      isOpen: false,
      goto: "/categories",
    },
    {
      name: "Products",
      hasChild: false,
      icon: <FiShoppingCart />,
      isOpen: false,
      goto: "/products",
    },
    {
      name: "Blogs & Services",
      hasChild: false,
      icon: <FiBriefcase />,
      isOpen: false,
      goto: "/blogs-services",
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
      name: "SEO",
      hasChild: false,
      icon: <FiSearch />,
      isOpen: false,
      goto: "/seo",
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

  useEffect(()=>{
    let pathname = window.location.pathname;

    for(let it of sidebarItems){
      if(it.hasChild){
        for(let it2 of it?.children){
          if(it2.goto === pathname){
            it.isOpen = true;
            setSelectedItem(it2.goto);
          }
        }
      }else if(it.goto === pathname){
        setSelectedItem(it.goto);
      }
    }
  }, [])

  useEffect(() => {
    dispatch(getAllBusinessesAction() as any);
    setSidebarItemsState(sidebarItems); // Initialize state for sidebar items
  }, [dispatch]);

  useEffect(() => {
    if (businesses?.length > 0) {
      setAllBusinesses(businesses);
      const businessId =
        localStorage.getItem("activeBusinessId") || businesses[0]?._id;
      dispatch(getBusinessDetailsAction(businessId) as any);
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
        <div className="sidebar-logo" style={{cursor:"pointer"}} onClick={()=>window.open(window.location.hostname)}>
          <img src="/assets/ewns-logo.svg" alt="Logo" />
        </div>
        <div className="business-selector">
          <Box>
          <Select
            labelId="company-select"
            id="company-simple-select"
            value={company}
            onChange={handleChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Select company' }}
            fullWidth
            sx={{
                maxHeight: 56,
                width: 250,
                '&.MuiList-root': {
                },
                [`& .${selectClasses.select}`]: {
                    display: 'flex',
                    alignItems: 'center',
                },
            }}
        >
            {allBusinesses?.length > 0 && allBusinesses.map((business: any) => {
                return <MenuItem value={business?._id} key={business?._id} sx={{ marginBottom: "2%" }}>
                    <ListItemAvatar>
                    <Avatar {...getAvatar(business?.businessName ? business?.businessName : "Prem Prakash")} />
                    </ListItemAvatar>
                    <ListItemText primary={business.businessName} secondary={business.businessUsername} />
                </MenuItem>
            })}
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
                      className={`sidebar-sub-item ${
                        selectedItem === childItem.goto ? "sidebar-item-selected" : ""
                      }`}
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