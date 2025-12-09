import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Form.css';
import './App.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    lastName: '',
    organizationName: '',
    emailId: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Your account has been created successfully! Sign in to continue.");
  };

  return (
    <div className="form-section">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <p><center>Create your account</center></p>
          <button className="google-signin-btn">
            Sign in with <span className="google-logo">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" /> Google
            </span>
          </button>
          <p><center>Or with email & password</center></p>
        </div>
        <div className="form-group name-group">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="organizationName"
            placeholder="Organization Name"
            value={formData.organizationName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="emailId"
            placeholder="Email Id"
            value={formData.emailId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Sign Up</button>
        <p>Already have an account? <Link to="/login">Sign In</Link></p>
      </form>
    </div>
  );
};

export default SignUp;
