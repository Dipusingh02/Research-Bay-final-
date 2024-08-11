import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginForm.css"; // Use the same CSS file as the LoginForm component
import Navbar from "../Navbar/Navbar";

// Validation schema
const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
});

const SignupForm = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      localStorage.setItem("userData", JSON.stringify(values));
      const response = await axios.post("http://localhost:8081/signup", {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (response.status === 201) {
        alert("Sign Up Successful!");
        navigate("/login", { state: { email: values.email } });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setFieldError("email", error.response.data.msg);
      } else {
        console.error("Error signing up", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="form-container">
        <h2>SIGN UP</h2>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <Field type="text" name="name" className="form-field" />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="error-message"
                />
              </div>
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
                <Field
                  type="password"
                  name="password"
                  className="form-field"
                />
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
                Sign Up
              </button>
            </Form>
          )}
        </Formik>
        <div className="signup-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
