import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { Button, MenuItem } from "@mui/material";
import "./Header.css";
import Popup from "./Popup";
import { countryList } from "../../utils/constants/country-flag";
import { categories } from "../../utils/constants/categories";
import { fetchPincodeDetails } from "../../services/api/postalcode.service";
import { useLoader } from "../../contexts/LoaderContext";
import { useDispatch } from "react-redux";
import { createBusinessAction } from "../../Redux/Actions/BusinessActions/business.actions";
import toast from "react-hot-toast";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../contexts/AuthContext";
import { FaBell } from "react-icons/fa"; // Importing the FaBell icon from react-icons

function Header({ isPopupOpen, handlePopupClose, handlePopupOpen }: any) {
  const { logout } = useAuth();
  const newBusinessInputs = [
    { label: "Name", name: "businessName", type: "text", width: "100%" },
    { label: "Email", name: "email", type: "email", width: "100%" },
    {
      label: "Country Code",
      name: "countryCode",
      type: "select",
      width: "100%",
      menuItems: [
        ...Object.keys(countryList).map((cat) => (
          <MenuItem
            key={countryList[cat].dial_code}
            value={countryList[cat].dial_code}
          >
            <div className="country-item">
              <img
                width={"30px"}
                height={"30px"}
                src={countryList[cat].image}
                alt={countryList[cat].name} // Add a meaningful alt text
              />
              <span>
                &nbsp; &nbsp;{countryList[cat].dial_code + " - " + cat}
              </span>
            </div>
          </MenuItem>
        )),
      ],
    },
    { label: "Phone", name: "phone", type: "number", width: "100%" },
    {
      label: "Category",
      name: "category",
      type: "select",
      options: categories,
      width: "100%",
    },
    {
      label: "Business Type",
      name: "businessType",
      type: "select",
      options: ["Products", "Services", "Both"],
      width: "100%",
    },
    {
      label: "Flat/Floor/Apart No.",
      name: "addressLine1",
      type: "text",
      width: "100%",
    },
    {
      label: "Building/Apart/Road Name",
      name: "addressLine2",
      type: "text",
      width: "100%",
    },
    { label: "Landmark", name: "landmark", type: "text", width: "100%" },
    { label: "Pincode", name: "pincode", type: "number", width: "100%" },
    {
      label: "State",
      name: "state",
      type: "text",
      disabled: true,
      width: "100%",
    },
    {
      label: "City",
      name: "city",
      type: "number",
      disabled: true,
      width: "100%",
    },
    {
      label: "Country",
      name: "country",
      type: "number",
      disabled: true,
      width: "100%",
    },
    { label: "Short Bio", name: "shortBio", type: "text", width: "204%" },
  ];
  const initialFormData = {
    businessName: "",
    category: "General",
    shortBio: "",
    email: "",
    mobileNumber: "",
    address: "",
    pincode: "",
    state: "",
    country: "",
    countryCode: countryList["IN"].dial_code,
    city: "",
  };

  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState(initialFormData);

  useEffect(() => {}, [formValues]);

  const [createBusinessInputs, setBusinessInputs] = useState(newBusinessInputs);

  const handleChangePincode = () => {
    setFormValues((prevValues) => ({
      ...prevValues,
      state: "",
      country: "",
      pincode: "",
      city: "",
    }));
    let temp = createBusinessInputs.filter((action: any) => {
      if (action.name === "pincode") {
        action.disabled = false;
      }
      return action;
    });
    let temp2 = createBusinessActions.map((action: any) => {
      if (action.label === "Change Pincode") {
        action.display = "none";
      }
      return action;
    });
    setBusinessInputs([...temp]);
    setBusinessActions([...temp2]);
  };

  const handleResetForNewBusiness = () => {
    setFormValues(initialFormData);
    let temp = newBusinessInputs.filter((action: any) => {
      if (action.name === "pincode") {
        action.disabled = false;
      }
      return action;
    });
    let temp2 = newBusinessActions.map((action: any) => {
      if (action.label === "Change Pincode") {
        action.display = "none";
      }
      return action;
    });

    setBusinessInputs(temp);
    setBusinessActions(temp2);
  };

  const handleCreateBusiness = () => {
    let formData = {};
    setFormValues((prevValues) => {
      formData = prevValues;
      return { ...prevValues };
    });
    try {
      dispatch(createBusinessAction(formData) as any);
      handlePopupClose();
      setFormValues(initialFormData);
    } catch (error: any) {
      toast.error("Unable to create business");
    }
  };

  const newBusinessActions = [
    {
      label: "Change Pincode",
      onClick: handleChangePincode,
      className: "mr-2",
      variant: "outlined",
      display: "none",
    },
    {
      label: "Reset",
      onClick: handleResetForNewBusiness,
      className: "mr-2",
      variant: "outlined",
      display: "block",
    },
    {
      label: "Create Business",
      onClick: handleCreateBusiness,
      className: "ml-2",
      variant: "contained",
      display: "block",
    },
  ];

  const [createBusinessActions, setBusinessActions] =
    useState(newBusinessActions);

  const handlePopupInputChange = async (name: any, value: any) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });

    if (name === "pincode" && /^\d{6}$/.test(value)) {
      try {
        showLoader();
        const res: any = await fetchPincodeDetails(value);

        setFormValues((prevFormData) => ({
          ...prevFormData,
          city: res.city,
          country: res.country,
          state: res.state,
        }));
        hideLoader();
        let temp = createBusinessInputs.filter((action: any) => {
          if (action.name === "pincode") {
            action.disabled = true;
          }
          return action;
        });
        let temp2 = createBusinessActions.map((action: any) => {
          if (action.label === "Change Pincode") {
            action.display = "block";
          }
          return action;
        });
        setBusinessInputs([...temp]);
        setBusinessActions([...temp2]);
      } catch (error) {
        console.error("Error fetching pincode details:", error);
        hideLoader();
      }
    }
  };

  const handleReset = () => {};

  return (
    <div className="header-container">
      <header className="header-content">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for pages, categories..."
            className="search-input"
          />
        </div>

        <div className="actions-container">
          <Button
            variant="outlined"
            className="w-fit"
            onClick={() => handlePopupOpen()}
          >
            Create a new Business
          </Button>

          <button className="notification-button">
            <FaBell className="notification-icon" />
          </button>

          <div
            className="account-container"
            onClick={() => navigate("/settings/your-account")}
          >
            <AccountCircleIcon className="account-icon" />
            <span className="account-text">Your Account</span>
          </div>
          <div
            className="logout-container"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <LogoutIcon className="logout-icon" />
            <span className="account-text">Logout</span>
          </div>
        </div>
      </header>
      {isPopupOpen && (
        <Popup
          header={"Enter Business Information"}
          inputs={createBusinessInputs}
          buttons={createBusinessActions}
          onClose={handlePopupClose}
          formValues={formValues}
          setFormValues={setFormValues}
          handleInputChange={handlePopupInputChange}
        />
      )}
    </div>
  );
}

export default Header;
