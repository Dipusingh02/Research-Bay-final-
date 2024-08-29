import React from 'react';
import sing from "../../assets/getsupport.jpg";
import './support.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../footer/Footer';


const Support = () => {
  return (
    <div>
    <Navbar />
    <div className='bgcolor'>
    <div className="container-s">
      <h2 className="heading">Need Assistance? We're Here to Help!</h2>
      <p className="description">
      Our dedicated support team is here to assist you every step of the way—from selecting the right research papers to uploading your own work seamlessly. Whether you need help purchasing a paper or require guidance on uploading your research, our experts are just a call or message away.      </p>
      <div className="contact-container">
        <img 
          src={sing}
          alt="Support Team" 
          className="image"
        />
        <p className="contact">
          <strong>Contact Us:</strong><br />
          Email: support@researchbay.com<br /> <br />
          Live Chat: Available 24/7
        </p>
      </div>
      <p className="additional-info">
        We're committed to providing you with exceptional service, ensuring that your experience with our platform is smooth and hassle-free. From the moment you reach out, our team will be with you every step of the way, offering personalized support tailored to your needs.
      </p>
      <p className="thank-you">
        Thank you for choosing Researchbay. We look forward to assisting you!
      </p>
    </div>
    <div>
    <Footer />
    </div></div>
    </div>
  );
};

export default Support;
