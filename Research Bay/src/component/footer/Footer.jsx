import './footer.css';
import React from 'react';
import { FaBeer, FaCcVisa, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { LiaCcAmex } from "react-icons/lia";
import logo from "../../assets/rResearchBaylogo.png";

import creditcard from '../../assets/cardimg.jpg';
import suimg from '../../assets/24and7.png';
import satisfationimg from '../../assets/100img.jpg';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-logo">
            <div className="footer-logo-circle"> 
              <img src={logo} alt="Unibluweb" />
            </div>
            <div className="para">
              <p>ResearchBay</p>
              <p>All Rights Reserved</p>
            </div>
          </div>
        </div>
        <div className="footer-center">
          <div className="footer-contact">
            <p>Research Bay Inc.
            620 America Center, Ca 95002. United States</p>
          </div>
          <div className="footer-links">
            <h3>Quick links</h3>
            <ul>
              <li><a href="/home">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/upload-research-paper">upload Paper</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-right">
          <div className="footer-newsletter">
            <h3>SIGN UP FOR OUR NEWSLETTER ➤</h3>
            <div className="footer-secure">
              <img src={creditcard} alt="Secure Payment" />
              <img src={suimg} alt="24/7 Support" />
              <img src={satisfationimg} alt="100% Satisfaction" />
            </div>
            <h3>FOLLOW US</h3>
            <div className="footer-social">
                <a><FaLinkedin /></a>
                <a> <FaTwitter /></a>
                <a> <FaFacebook /></a>
                <a><FaInstagram /></a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>©2024 ResearchBay INC. All rights reserved.</p>
        <p>
          <a href="/policies">Terms & Conditions</a> | 
          <a href="/policies"> Policy</a> | 
          <a href="/support"> Support</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;