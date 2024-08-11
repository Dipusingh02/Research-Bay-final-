import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./LoginForm.css"; // Use the same CSS file as the LoginForm component

// Validation schema
const OTPVerificationSchema = Yup.object().shape({
  otp: Yup.string().length(6, "Invalid OTP").required("Required"),
});

const OTPVerification = () => {
  const location = useLocation();
  const { email } = location.state || {}; // Retrieve email from navigation state
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(true);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const response = await axios.post(
        "http://localhost:1000/auth/verify-otp",
        {
          email: userData.email,
          otp: values.otp,
        }
      );
      if (response.status === 200) {
        // Update user data in the backend
        await axios.put("http://localhost:1000/auth/update-user", userData);
        // Remove user data from local storage
        localStorage.removeItem("userData");
        // Redirect to login or another page after successful verification
        window.location.href = "/";
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        console.error("Error verifying OTP", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1000/auth/resend-otp",
        { email }
      );
      console.log("OTP resend response", response.data);
      if (response.status === 200) {
        alert("OTP resent successfully!");
        setOtpSent(true);
      }
    } catch (error) {
      console.error("Error resending OTP", error);
      setError("Error resending OTP");
    }
  };

  return (
    <div className="form-container">
      <h2>Verify OTP</h2>
      <Formik
        initialValues={{ otp: "" }}
        validationSchema={OTPVerificationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
            <div className="form-group">
              <label htmlFor="otp">OTP</label>
              <Field type="text" name="otp" className="form-field" />
              <ErrorMessage
                name="otp"
                component="div"
                className="error-message"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              Verify OTP
            </button>
            <button
              type="button"
              onClick={handleResendOTP}
              className="submit-button"
            >
              Resend OTP
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OTPVerification;