import React, { useEffect, useState } from "react";
import "./Signup.css";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Import eye icons
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { fetchPincodeDetails } from "../services/api/postalcode.service";
import { useLoader } from "../contexts/LoaderContext";
import { countryList } from "../utils/constants/country-flag";
import { categories } from "../utils/constants/categories";
import useTailwindBreakpoint from "../hooks/useBreakpoint";
import { register } from "../services/api/auth.api.service";
import { useNavigate } from "react-router-dom";
import { validateFields } from "../Helpers/common.helper";
import { IoChevronBackOutline } from "react-icons/io5";

function Signup() {
  const navigate = useNavigate();
  const [hideNext, setHideNext] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

  const { showLoader, hideLoader } = useLoader();
  const breakpoint = useTailwindBreakpoint();

  const handleSignInClick = () => {
    navigate("/login");
  };
  const [showStep, setShowStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    addressLine1: "",
    addressLine2: "",
    pincode: "",
    state: "",
    city: "",
    landmark: "",
    country: "",
    businessName: "",
    category: categories[0],
    shortBio: "",
    countryCode: countryList["IN"].dial_code,
    mobileNumber: "",
    businessType: "",
  });

  useEffect(() => {
    const checkValidStep = () => {
      if (showStep === 1) {
        return validateFields(
          [
            "name",
            "email",
            "password",
            "confirmPassword",
            "countryCode",
            "mobileNumber",
          ],
          true,
          formData
        );
      } else if (showStep === 2) {
        return validateFields(
          [
            "addressLine1",
            "addressLine2",
            "pincode",
            "landmark",
            "city",
            "state",
            "country",
          ],
          false,
          formData
        );
      } else if (showStep === 3) {
        return validateFields(
          ["businessName", "category", "shortBio", "businessType"],
          false,
          formData
        );
      }
      return false;
    };

    setHideNext(!checkValidStep());
  }, [formData, showStep]);

  const handlePincodeChange = async (e: any) => {
    const updatedPincode = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      pincode: updatedPincode,
    }));

    if (updatedPincode.length === 6 && /^\d{6}$/.test(updatedPincode)) {
      try {
        showLoader();
        const res: any = await fetchPincodeDetails(updatedPincode);

        setFormData((prevFormData) => ({
          ...prevFormData,
          city: res.city,
          country: res.country,
          state: res.state,
        }));
        hideLoader();
      } catch (error) {
        console.error("Error fetching pincode details:", error);
        hideLoader();
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        city: "",
        country: "",
        state: "",
      }));
    }
  };

  const handleSignup = async () => {
    if (
      validateFields(
        [
          "name",
          "email",
          "password",
          "confirmPassword",
          "address",
          "pincode",
          "businessName",
          "category",
          "shortBio",
        ],
        true,
        formData
      )
    ) {
      showLoader();
      let res = await register(formData);

      if (res && res.isSuccess) {
        navigate("/login");
      }
      hideLoader();
    }
    hideLoader();
  };

  const handleNext = async () => {
    if (showStep === 3) {
      await handleSignup();
    } else {
      setShowStep(showStep + 1);
    }
  };

  return (
    // form hear the singUp page will start
    <div className="signup-container">
      <div className="signup-div-container">
        <div
          className={`left-signup-container ${
            breakpoint === "xs" ? "hidden" : ""
          }`}
        >
          <div className="left-signup p-6">
            <div className="left-theme">
              <div className="logo">
                <img src="assets/logo.png" width={"200px"} alt="logo" />
              </div>
              <div className="left-content">
                <Typography variant="h4" className="heading">
                  Take Your <span className="bold-text">Business Online </span>{" "}
                  within minutes !!
                </Typography>
              </div>
              <div className="signup-lef-img">
                <img src="assets/signup-left.svg" alt="signup-left" />
              </div>
            </div>
          </div>
        </div>
        <div className="right-signup-container">
          <div className="right-signup">
            <div className="signup-part flex-row-vertically mb-4 ">
              <div
                onClick={() => setShowStep(showStep - 1)}
                className={`back-arrow ${showStep > 1 ? "" : "hidden"}`}
              >
                <IoChevronBackOutline />
              </div>
              <Typography variant="h4" className="signup-title">
                Sign up
              </Typography>
              <Typography variant="h5" className="step-count">
                (Step&nbsp;
                <strong className="step-highlight">{showStep}</strong> &nbsp;of
                3)
              </Typography>
            </div>
            <Typography variant="h5" className="subheading">
              It’s time to get your business online
            </Typography>
            <div className="signup-form">
              {showStep === 1 && (
                <div className="step-one">
                  <TextField
                    required
                    id="outlined-required"
                    label="Full Name"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    value={formData.name}
                    className="form-field"
                  />
                  <TextField
                    required
                    id="outlined-required"
                    label="Email"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    value={formData.email}
                    className="form-field"
                  />
                  <div className="form-row">
                    <TextField
                      required
                      id="outlined-required"
                      label="Password"
                      type={showPassword ? "text" : "password"} // Toggle password visibility
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="form-half-field"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <FiEyeOff /> : <FiEye />}{" "}
                              {/* Eye icon */}
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      required
                      id="outlined-required"
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"} // Toggle confirm password visibility
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="form-half-field"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}{" "}
                              {/* Eye icon */}
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>

                  <div className="form-row flex-row gap-6">
                    <div className="form-half-field">
                      <FormControl className="full-width">
                        <Select
                          required
                          labelId="country-code-label"
                          id="country-code-select"
                          value={formData.countryCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              countryCode: e.target.value,
                            })
                          }
                        >
                          {Object.keys(countryList).map((cat) => (
                            <MenuItem
                              key={countryList[cat].dial_code}
                              value={countryList[cat].dial_code}
                            >
                              <div className="country-option flex-row ">
                                <img
                                  width={"30px"}
                                  height={"30px"}
                                  src={countryList[cat].image}
                                  alt="flag"
                                />
                                <span>
                                  &nbsp;{" "}
                                  {countryList[cat].dial_code + " - " + cat}
                                </span>
                              </div>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <TextField
                      required
                      id="outlined-required"
                      label="Mobile Number"
                      value={formData.mobileNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mobileNumber: e.target.value,
                        })
                      }
                      className="form-field form-half-field number"
                    />
                  </div>
                </div>
              )}
              {showStep === 2 && (
                <div className="step-one">
                  <TextField
                    required
                    value={formData.addressLine1}
                    id="outlined-required"
                    label="Flat/Road/Building/Floor Number."
                    onChange={(e) =>
                      setFormData({ ...formData, addressLine1: e.target.value })
                    }
                    className="form-field"
                  />
                  <TextField
                    required
                    value={formData.addressLine2}
                    id="outlined-required"
                    label="Area/Colony/Street"
                    onChange={(e) =>
                      setFormData({ ...formData, addressLine2: e.target.value })
                    }
                    className="form-field"
                  />
                  <div className="form-row">
                    <TextField
                      required
                      value={formData.pincode}
                      id="outlined-required"
                      label="Pincode"
                      onChange={handlePincodeChange}
                      className="form-half-field"
                    />
                    <TextField
                      required
                      value={formData.state}
                      id="outlined-required"
                      label="State"
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="form-half-field"
                    />
                  </div>
                  <div className="form-row">
                    <TextField
                      required
                      value={formData.city}
                      id="outlined-required"
                      label="City"
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="form-half-field"
                    />
                    <TextField
                      required
                      value={formData.landmark}
                      id="outlined-required"
                      label="Landmark"
                      onChange={(e) =>
                        setFormData({ ...formData, landmark: e.target.value })
                      }
                      className="form-half-field"
                    />
                  </div>
                </div>
              )}

              {showStep === 3 && (
                <div className="step-one">
                  <TextField
                    required
                    value={formData.businessName}
                    id="outlined-required"
                    label="Business Name"
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                    className="form-field"
                  />
                  <TextField
                    required
                    value={formData.shortBio}
                    id="outlined-required"
                    label="Short Description about business"
                    onChange={(e) =>
                      setFormData({ ...formData, shortBio: e.target.value })
                    }
                    className="form-field"
                  />
                  <div className="form-field mb-4">
                    <FormControl fullWidth>
                      <InputLabel id="category-label">
                        Business Category
                      </InputLabel>
                      <Select
                        labelId="category-label"
                        id="category-select"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-label-type">Business Type</InputLabel>
                    <Select required
                        labelId="demo-simple-select-label-type"
                        id="demo-simple-select-type"
                        value={formData.businessType}
                        label="Business Type"
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    >
                        {<MenuItem value={"SERVICE"}>{"Services"}</MenuItem>}
                        {<MenuItem value={"PRODUCT"}>{"Products"}</MenuItem>}
                        {<MenuItem value={"BOTH"}>{"Both"}</MenuItem>}
                    </Select>
                </FormControl>
                </div>
              )}

              <div className="form-action">
                <Button
                  disabled={hideNext}
                  variant="contained"
                  onClick={handleNext}
                  id="button"
                  className={`signup-next-btn ${hideNext ? "disabled" : ""}`}
                >
                  {showStep === 3 ? "Sign up" : "Next"}
                </Button>
              </div>
            </div>
            <h1 className="sign-in-container mt-6 justify-center text-center">
              Already have an account?{" "}
              <span className="sign-in-link" onClick={handleSignInClick}>
                Sign In
              </span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;