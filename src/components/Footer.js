import React from 'react';
import './css/Footer.css'; // Import custom CSS for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <p>Email: contact@example.com</p>
            <p>Phone: +123 456 7890</p>
          </div>
          <div className="col-md-4 text-center">
            <h5>Follow Us</h5>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>
          <div className="col-md-4 text-end">
            <h5>About Us</h5>
            <p>We provide the best therapeutic companion services.</p>
          </div>
        </div>
        <div className="text-center mt-3">
          <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;