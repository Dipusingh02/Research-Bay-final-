import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { About, ContactUs, ForgotPassword, Home, Library, LoginForm, OTPVerification, Policies, ResetPassword, SignupForm, Support, UploadForm } from './component';


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginForm /> } />
        <Route path="/home" element={<Home /> } />
        <Route path="/upload-research-paper" element={<UploadForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<About />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/support" element={<Support />} />
        <Route path="/library" element={<Library />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
