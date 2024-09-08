import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import "./LoginForm.css";

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            // Log the token and password
            console.log({ token, password });

            const response = await axios.post('http://localhost:8081/reset-password', { token, password });

            if (response.status === 200) {
                setMessage("Password reset successfully!");
                navigate('/login'); // Redirect to login page after successful password reset
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            if (error.response && error.response.data) {
                // Display error message from the server
                setMessage(error.response.data.message);
            } else {
                setMessage("An error occurred while resetting the password.");
            }
        }
    };

    return (
        <div>
        <Navbar />
        <div className="reset-password-container bgcolor">
        <br/>
        <br/>
        <div className='form-container' id="r-c">
            <h2>Reset Password</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>New Password:</label>
                    <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    /></div>
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <div>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    /></div>
                </div>
                <button type="submit">Reset Password</button>
            </form>
        </div>
        </div></div>
    );
};

export default ResetPassword;
