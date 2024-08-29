import React, { useState } from "react";
import Modal from 'react-modal';
import { Navbar } from "../../components";
import { Footer } from "../../container";
import "./form.css";

Modal.setAppElement('#root'); // Set the app element for accessibility

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: ""
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
  
    const timestamp = new Date().toISOString();
  
    const dataWithTimestamp = {
      ...formData,
      timestamp,
    };
  
    console.log("Form Data with Timestamp:", dataWithTimestamp);

    // Open the modal immediately after form submission
    setIsModalOpen(true);
  
    fetch('https://script.google.com/macros/s/AKfycbwTm4TV6uVND-VvUSLlKA8CPj9OcYbGPyvYZKv8LWz-NeeoMjux9VHst3ZugUPyjUmMHw/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataWithTimestamp),
    })
    .then(response => {
      console.log('Success!', response);
      // You can close the modal or display another message here if needed
    })
    .catch(error => console.error('Error!', error.message));
  
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      message: ""
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="gradient__bg" id="contactid">
      <div className="container">
        <div className="contact-form">
          <h1 className="gradient__text">Get In Touch</h1>
          <form onSubmit={handleSubmit} className="contact-inputs">
            <div className="uniblu__header-content__input">
              <input
                type="text"
                name="name"
                placeholder="Name"
                autoComplete="off"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="uniblu__header-content__input">
              <input
                type="email"
                name="email"
                placeholder="Your Email address"
                autoComplete="off"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="uniblu__header-content__input">
              <input
                type="text" 
                name="phoneNumber"
                placeholder="Phone"
                autoComplete="off"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="uniblu__header-content__input">
              <textarea
                placeholder="Any Enquiry"
                name="message"
                cols="30"
                rows="6"
                autoComplete="off"
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <div className="uniblu__header-content__input">
              <button type="submit">Submit</button> 
            </div>
          </form>
        </div>
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Submission Success"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2 className="modal-heading gradient__text">Thank you!</h2>
        <br />
        <p className="modal-content">We will get back to you soon</p>
        <br />
        <button className="modal-button " onClick={closeModal}>Close</button>
      </Modal>
    </div>
    
  );
};

export default Form;
