import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Typography, TextField, Button } from "@mui/material";
import { useLoader } from "../contexts/LoaderContext";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

function ForgotPassword() {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const { login } = useAuth(); // Assuming you may need this if you want to handle auto-login after reset

  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     showLoader();
  //     setErrorMessage(null);

  //     try {
  //       const response = await resetPassword({ email });
  //       if (response?.status === 200) {
  //         toast.success(
  //           "Password reset instructions have been sent to your email."
  //         );
  //         navigate("/login"); // Navigate to login or appropriate route
  //       }
  //     } catch (error) {
  //       setErrorMessage("Failed to send password reset email.");
  //       toast.error("Error sending email. Please try again.");
  //     } finally {
  //       hideLoader();
  //     }
  //   };

  return (
    <div className="login-page">
      <div className="left-signup-container login-theme">
        <div className="">
          <div className="">
            <img src="assets/login.svg" alt="Logo" />
          </div>
        </div>
      </div>

      <div className="right-signup-container">
        {/* add henadl submit onSubmit={handleSubmit} */}
        <form className="signup-form">
          <div>
            <Typography variant="h4" className="let-content">
              Forgot Password?
            </Typography>
            <Typography variant="body1" className="step-one">
              Enter your email to receive password reset instructions.
            </Typography>
          </div>
          <TextField
            required
            fullWidth
            name="email"
            label="Email"
            variant="outlined"
            value={email}
            onChange={handleChange}
            margin="normal"
          />
          {errorMessage && (
            <Typography color="error">{errorMessage}</Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            className="forgot-password-button"
            id="button"
          >
            Send Reset Link
          </Button>
          <h1 className="login-link mt-6 justify-center text-center">
            Remembered your password? <Link to="/login">Log In</Link>
          </h1>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;