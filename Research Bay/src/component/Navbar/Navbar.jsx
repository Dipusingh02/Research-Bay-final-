import React, { useState, useEffect } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/Research.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Replace with the correct user ID or logic to get the ID
        const userId = "actual-user-id"; // Replace with actual user ID logic
        const response = await fetch(`http://localhost:8081/profile/${userId}`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          console.log("User Data: ", data.user);  // Debugging line
          setIsLoggedIn(true);
          setUserProfile(data.user);  // Set user profile data if available
        } else {
          setIsLoggedIn(false);
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    // Handle logout logic here (e.g., clearing session data or calling a logout endpoint)
    setIsLoggedIn(false);
    setUserProfile(null);
    navigate("/login");
  };

  return (
    <div>
      <div className="nav">
        <div className="navbar-container">
          <div className="navbar-logo">
            <img src={Logo} alt="cgc-logo" />
          </div>
          <button className="hamburger" onClick={toggleMenu}>
            <span className={isOpen ? "hamburger-icon open" : "hamburger-icon"}>&#9776;</span>
          </button>
          <div className={`navbar-links ${isOpen ? "show" : ""}`}>
            <ul>
              <li><Link to="/">Home</Link></li>
              {isLoggedIn ? (
                <>
                  <li><Link to="/upload-research-paper">Upload Paper</Link></li>
                  <li><Link to={`/profile/${userProfile?.id}`}>{userProfile?.name || "Profile"}</Link></li>
                  <li onClick={handleLogout}>Logout</li>
                </>
              ) : (
                <>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/signup">Create Account</Link></li>
                </>
              )}
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
