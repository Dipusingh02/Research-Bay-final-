import React, { useState } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import Logo from "../../assets/Research.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
              <li><Link to="/upload-research-paper">Upload Paper</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Create Account</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
