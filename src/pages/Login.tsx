import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import {
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useLoader } from "../contexts/LoaderContext";
import toast from "react-hot-toast";
import { loginUser } from "../services/api/auth.api.service";
import { useAuth } from "../contexts/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Added password visibility icons

function Login() {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoader();
    setErrorMessage(null);

    try {
      const response = await loginUser(formData);
      if (response?.status === 200) {
        login(response.data.user); // Assuming login sets user info
        toast.success("Login successful!");
        navigate("/dashboard"); // Navigate to the dashboard or appropriate route
      }
    } catch (error) {
      setErrorMessage("Invalid email or password");
      toast.error("Login failed. Please check your credentials.");
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="login-page">
      <div className="left-signup-container login-theme">
        <div className="login-signup ">
          <div className="">
            <img src="assets/login.svg" alt="Logo" />
          </div>
        </div>
      </div>

      <div className="right-signup-container">
        <form onSubmit={handleSubmit} className="signup-form">
          <div>
            <Typography variant="h4" className="let-content">
              Welcome Back!
            </Typography>
            <Typography variant="body1" className="step-one">
              Please log in to your account
            </Typography>
          </div>
          <TextField
            required
            fullWidth
            name="email"
            label="Email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {errorMessage && (
            <Typography color="error">{errorMessage}</Typography>
          )}
          <h6 className="sign-in-link text-sm underline mt-1 mb-4 text-right">
            <Link to="/forgot-password">Forgot Password?</Link>
          </h6>
          <Button
            type="submit"
            variant="contained"
            className="login-button"
            id="button"
          >
            Log In
          </Button>
          <h1 className="login-link mt-6 justify-center text-center">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </h1>
        </form>
      </div>
    </div>
  );
}

export default Login;
