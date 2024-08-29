import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Footer from "../footer/Footer";
import "./LoginForm.css";

const LoginForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
  });

  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    console.log("Form values:", values); 
    try {
      const response = await axios.post(
        "http://localhost:8081/signin",
        values
      );
      console.log("Server response", response.data);
      if (response.data.userId) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("name", response.data.name);
        navigate("/home");
      } else {
        console.error("User ID is missing in the response");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.log("Server error response:", error.response.data);
        setFieldError("email", error.response.data.msg || "Login failed");
      } else {
        console.error("Error logging in", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="gradient__bg">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <div className="form-container">
              <h2>LOGIN</h2>
              <Form className="login-form">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field type="email" name="email" className="form-field" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Field type="password" name="password" className="form-field" />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error-message"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  Login
                </button>
              </Form>
              <div className="login-options">
                <div className="signup-link">
                  Don't have an account? <Link to="/signup">Sign Up</Link>
                </div>
                <div className="forgot-password-link">
                  <Link to="/forget-password">Forgot Password?</Link>
                </div>
              </div>
            </div>
          )}
        </Formik>
      </div>
      <Footer />
    </div>
  );
};

export default LoginForm;
