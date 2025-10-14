import React from 'react';
import { Facebook, Instagram, Mail, Phone, MapPin, ShoppingCart, Twitter } from 'lucide-react';

// Accurate X (Twitter) icon SVG (bold, stylized X in black circle)
const XLogo = (props) => (
  <svg {...props} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="60" fill="black" />
    <path d="M35 35 L85 85 M85 35 L35 85" stroke="white" strokeWidth="12" strokeLinecap="round" />
  </svg>
);

const XIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M4 4L20 20" />
    <path d="M20 4L4 20" />
  </svg>
);

const Footer = () => {
  return (
    <>
      {/* External CSS Styles */}
      <style>{`
       /* =========================
   FOOTER STYLES
   ========================= */

/* ---------- Footer Wrapper ---------- */
.footer {
  background: #0A1A2F;
  color: #FFFFFF;
  padding: 4rem 0 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin-top: 4rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* ---------- Layout ---------- */
.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

/* ---------- Column Headers ---------- */
.footer-column h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #D4AF37;
  position: relative;
}

.footer-column h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 40px;
  height: 3px;
  border-radius: 2px;
  background: #D4AF37;
}

/* =========================
   BRANDING
   ========================= */
.brand-section {
  max-width: 300px;
}

.brand-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.nav-icon {
  width: 32px;
  height: 32px;
  filter: none;
  color: #D4AF37;
}

.brand {
  font-size: 1.8rem;
  font-weight: 700;
  color: #D4AF37;
}

.brand-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: #FFFFFF;
}

.brand-description {
  color: #CCCCCC;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.9rem;
  color: #CCCCCC;
}

.feature-icon {
  width: 16px;
  height: 16px;
  color: #D4AF37;
}

/* =========================
   QUICK LINKS
   ========================= */
.footer-column a {
  display: block;
  padding: 0.5rem 0 0.5rem 20px;
  color: #CCCCCC;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.footer-column a::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #D4AF37;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.footer-column a:hover {
  color: #D4AF37;
  padding-left: 25px;
}

.footer-column a:hover::before {
  opacity: 1;
  transform: translateX(0);
}

/* =========================
   CONTACT INFO
   ========================= */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.95rem;
  color: #CCCCCC;
}

.contact-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #D4AF37;
}

/* =========================
   SOCIAL MEDIA
   ========================= */
.social-media {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  background: #121212;
  color: #D4AF37;
  border: 2px solid #D4AF37;
  border-radius: 12px;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.social-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: #D4AF37;
  transition: left 0.3s ease;
  z-index: 0;
}

.social-link:hover::before {
  left: 0;
}

.social-link:hover {
  color: #121212;
  background: #D4AF37;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}

.social-icon {
  width: 22px;
  height: 22px;
  position: relative;
  z-index: 1;
}

/* =========================
   NEWSLETTER
   ========================= */
.newsletter {
  background: #121212;
  padding: 2rem;
  border-radius: 15px;
  color: #FFFFFF;
  margin-bottom: 3rem;
  border: 1.5px solid #D4AF37;
}

.newsletter h3 {
  color: #D4AF37;
  margin-bottom: 1rem;
}

.newsletter h3::after {
  background: #D4AF37;
}

.newsletter p {
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.newsletter-form {
  display: flex;
  gap: 0.8rem;
  margin-top: 1rem;
}

.newsletter-input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 1px solid #D4AF37;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  background: #0A1A2F;
  color: #FFFFFF;
}

.newsletter-input::placeholder {
  color: #CCCCCC;
}

.newsletter-btn {
  padding: 0.8rem 1.5rem;
  background: #D4AF37;
  color: #121212;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.newsletter-btn:hover {
  background: #FFFFFF;
  color: #0A1A2F;
  transform: translateY(-2px);
}

/* =========================
   FOOTER BOTTOM
   ========================= */
.footer-bottom {
  border-top: 1px solid #D4AF37;
  padding: 2rem 0;
  text-align: center;
  background: #121212;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  font-size: 0.9rem;
  color: #CCCCCC;
}

.footer-links {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.footer-links a {
  font-size: 0.9rem;
  color: #CCCCCC;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #D4AF37;
}

/* =========================
   RESPONSIVE DESIGN
   ========================= */
@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .brand-section {
    max-width: none;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .newsletter-btn {
    align-self: flex-start;
  }

  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .footer-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 2rem 0 0;
  }

  .social-media {
    justify-content: center;
  }

  .footer-links {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
}
      `}</style>

      <footer className="footer">
        <div className="footer-container">
          {/* Newsletter Section */}
          <div className="newsletter">
            <h3>Stay Updated</h3>
            <p>Subscribe to our newsletter for the latest land deals, new properties, and exclusive offers!</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button className="newsletter-btn">Subscribe</button>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="footer-content">
            <div className="footer-column brand-section">
              <div className="brand-header">
                <MapPin className="nav-icon" />
                <div>
                  <span className="brand-name">Eaglonhytes Global Consults</span>
                </div>
              </div>
              <p className="brand-description">
                Your trusted partner in land acquisition, property development, and building materials supply across Abuja, Nigeria. Building dreams with verified titles and quality service.
              </p>
            </div>

            <div className="footer-column">
              <h3>Quick Links</h3>
              <a href="/">Home</a>
              <a href="/lands">Available Lands</a>
              <a href="/about">About Us</a>
              <a href="/contact">Contact</a>
              <a href="/faq">FAQ</a>
              <a href="/shipping">Delivery Services</a>
            </div>

            <div className="footer-column">
              <h3>Contact Info</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <Phone className="contact-icon" />
                  <span>+234 703 877 9189</span>
                </div>
                <div className="contact-item">
                  <Phone className="contact-icon" />
                  <span>+234 812 316 6662</span>
                </div>
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <span>globalsolutions351@gmail.com</span>
                </div>
                <div className="contact-item">
                  <MapPin className="contact-icon" />
                  <span>Building Materials Market, Timber Shed, Kugbo, Abuja FCT, Nigeria</span>
                </div>
              </div>
            </div>

            <div className="footer-column">
              <h3>Follow Us</h3>
              <div className="social-media">
                <a href="#" className="">
                  <Facebook className="social-icon" />
                </a>
                <a href="#" className="">
                  <Twitter className="social-icon" />
                </a>
                <a href="#" className="">
                  <Instagram className="social-icon" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; {new Date().getFullYear()} Eaglonhytes Global Consults. All Rights Reserved.
            </p>
            <div className="footer-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;