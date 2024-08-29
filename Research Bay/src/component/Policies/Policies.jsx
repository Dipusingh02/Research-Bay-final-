import React from 'react';
import './policies.css'; // Import the CSS file for styling
import Navbar from '../Navbar/Navbar';
import Footer from '../footer/Footer';

const Policies = () => {
    return (
      <div>
      <Navbar />
  <div className='bgcolor'>
        <div className="policies-container">
            <h1>Privacy and Policy </h1>
            
            <div className="flowchart">
                <div className="policy-section">
                    <h2>1. Personal Identification Information</h2>
                    <p>We collect personal data like name, email, phone number, and address when you interact with our site, such as during purchases. Submission of this information is voluntary, but refusal may limit access to certain site features.</p>
                </div>
                
                <div className="arrow"></div>

                <div className="policy-section">
                    <h2>2. How We Protect Your Information</h2>
                    <p>We implement strict data protection measures to safeguard your personal information from unauthorized access, alteration, or destruction.</p>
                </div>
                
                <div className="arrow"></div>

                <div className="policy-section">
                    <h2>3. Changes to This Privacy Policy</h2>
                    <p>We may update this policy occasionally. Check this page regularly to stay informed about how we protect your data. Your continued use of the site signifies your agreement to the updated policy.</p>
                </div>
                
                <div className="arrow"></div>

                <div className="policy-section">
                    <h2>4. Call Recording</h2>
                    <p>Your calls may be recorded for quality assurance purposes. You can opt out by disconnecting and requesting a non-recorded call.</p>
                </div>
                
                <div className="arrow"></div>

                <div className="policy-section">
                    <h2>5. Cookies & Passive Data Collection</h2>
                    <p>We use cookies, IP addresses, and URLs to improve our service and customize your experience. This helps in diagnosing issues and enhancing service delivery.</p>
                </div>
                
                <div className="arrow"></div>

                <div className="policy-section">
                    <h2>6. Use of Personal Data</h2>
                    <p>Your data is used to enable purchases, access services, and engage in activities. We do not sell or rent your data, but may share it with selected partners for service delivery.</p>
                </div>
                
                <div className="arrow"></div>

                <div className="policy-section">
                    <h2>7. Data Sharing</h2>
                    <p>We do not sell your data but may share it with partners to deliver specific services. Your data may also be shared to comply with legal obligations or to protect our rights and those of others.</p>
                </div>
                
                <div className="arrow"></div>

                <div className="policy-section">
                    <h2>8. Your Rights Over Your Data</h2>
                    <p>You can request to view, update, or delete your personal data at any time. We keep your data only as long as necessary, typically up to one year after your last interaction.</p>
                </div>
                
                <div className="arrow"></div>

                <div className="policy-section">
                    <h2>9. Service Providers</h2>
                    <p>We may share your data with third parties to provide specific services, ensuring they adhere to strict privacy standards.</p>
                </div>
                
                <div className="arrow"></div>

                <div className="policy-section">
                    <h2>10. Legal Requirements</h2>
                    <p>We may disclose personal data to comply with legal requests or to protect our rights, safety, and property.</p>
                </div>
                
                <div className="arrow"></div>

                <div className="policy-section">
                    <h2>11. Change of Ownership</h2>
                    <p>In the event of a merger or acquisition, your data may be transferred to the new entity, and you will be notified.</p>
                </div>
                
                <div className="arrow"></div>

                <div className="policy-section">
                    <h2>12. Security Measures</h2>
                    <p>We use industry-standard security measures to protect your data, though absolute security cannot be guaranteed.</p>
                </div>
                
                <div className="arrow"></div>

                <div className="policy-section">
                    <h2>13. Order and Return Policy</h2>
                    <p>Orders are typically final, but returns are accepted within 15 days for physical products, subject to a restocking fee. Downloadable products are non-returnable.</p>
                </div>
                
                <div className="arrow"></div>

                <div className="policy-section">
                    <h2>14. Refund Policy</h2>
                    <p>Refunds are only provided for defective items or unsatisfactory service reported within 48 hours. Refunds will be processed to the original payment method.</p>
                </div>
                
                <div className="arrow"></div>

                <div className="policy-section">
                    <h2>15. Typographical Errors</h2>
                    <p>If a product is listed at an incorrect price, we reserve the right to cancel the order and issue a refund.</p>
                </div>
                
                <div className="arrow"></div>

                <div className="policy-section">
                    <h2>16. Limitation of Liability</h2>
                    <p>We are not liable for any damages arising from the use of our site or products. Some limitations may not apply depending on your jurisdiction.</p>
                </div>
                
                <div className="arrow"></div>

                <div className="policy-section">
                    <h2>17. Use of Site</h2>
                    <p>Users must not engage in harassment, impersonation, or upload offensive content. All communication will be via email, with responses within 24 hours.</p>
                </div>
                
                <div className="arrow"></div>

                <div className="policy-section">
                    <h2>18. Indemnification</h2>
                    <p>You agree to indemnify us against any losses or damages arising from your use of the site or violation of these terms.</p>
                </div>
                
                <div className="arrow"></div>

                <div className="policy-section">
                    <h2>19. Third-Party Links</h2>
                    <p>Our site may contain links to third-party websites, which operate independently of our control. Use these links at your own risk.</p>
                </div>
            </div>
        </div>
        <div>
        <Footer />
        </div>
        </div>
        </div>
    );
}

export default Policies;
