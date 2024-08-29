import React, { useState } from 'react';
import Navbar from "../Navbar/Navbar";
import Footer from "../footer/Footer";
import "./LoginForm.css";
const ForgotPassword = () => {
    // Declare a state variable to hold the email input
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8081/forget-password-linkemail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password reset link sent successfully');
            } else {
                setMessage(data.message || 'Error sending password reset link');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An unexpected error occurred');
        }
    };

    return (
        <div >
        <Navbar />
        <div className="gradient__bg fp-container">
            <h2>Forgot Password</h2>
            <form  onSubmit={onSubmit} className="form-container">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
        </div>
        <Footer />
        </div>
    );
};

export default ForgotPassword;
