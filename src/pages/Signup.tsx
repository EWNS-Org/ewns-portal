import React from 'react'
import { Link } from 'react-router-dom'
import './Signup.css';

function Signup() {
    return (
        <div><div className="login-container">
            <div className="signup-left">
                <div className="business-promo">
                    <img src="/assets/logo.png" alt="logo" />

                    <div className="business-image">
                        <img src="/assets/signup-homepage.png" width="600px" height="500px" alt="Business Illustration" />
                    </div>
                </div>
            </div>

            <div className="login-right">
                <div className="login-box">
                    <h1>Sign up</h1>
                    <p>Please login to continue to your account.</p>
                    <form>
                        <div className="form-group">
                            <label htmlFor="businessname">Business Name</label>
                            <input
                                type="text"
                                id="businessname"
                                placeholder="Business Name..."
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="Your Full Name">Full Name</label>
                            <input
                                type="text"
                                id="fullname"
                                placeholder="Full Name..."
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="text"
                                id="phone"
                                placeholder="Phone Number..."
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Email</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="jonas_kahwald@gmail.com"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input">
                                <input type="password" id="password" placeholder="Password" />
                                <span className="password-toggle">👁️</span> {/* Icon to toggle visibility */}
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmpassword">Confirm Password</label>
                            <div className="password-input">
                                <input type="password" id="confirmpassword" placeholder="Password" />
                                <span className="password-toggle">👁️</span> {/* Icon to toggle visibility */}
                            </div>
                        </div>

                        <button type="submit" className="btn-primary">
                            Sign up
                        </button>

                        <div className="signup-link">
                            Already have an account ? <Link to="/login">Sign in</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div></div>
    )
}

export default Signup