import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home, LoginForm, OTPVerification, SignupForm, UploadForm } from './component';


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home /> } />
        <Route path="/home" element={<Home /> } />
        <Route path="/upload-research-paper" element={<UploadForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
      </Routes>
    </div>
  );
}

export default App;
