import React, { useState } from "react";
import {
  PhoneIcon as Phone,
  EnvelopeIcon as Mail,
  MapPinIcon as MapPin,
  ClockIcon as Clock,
  PaperAirplaneIcon as Send,
  UserIcon as User,
  ChatBubbleLeftRightIcon as MessageSquare,
} from "@heroicons/react/24/outline";
import "../styles/contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const response = await fetch('http://localhost/Eaglonhytes/api/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitMessage('✅ Message sent successfully! We will get back to you soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        
        // Message sent successfully - no additional prompts
      } else {
        setSubmitMessage('❌ ' + (data.message || 'Failed to send message. Please try again.'));
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitMessage('❌ Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="contact-icon" />,
      title: "Phone/WhatsApp",
      details: ["+234 703 877 9189", "+234 812 316 6662"],
      description: "For land sales, property development, building materials procurement, or any business needs, reach out via WhatsApp or call for personalized assistance."
    },
    {
      icon: <MapPin className="contact-icon" />,
      title: "Physical Address",
      details: ["Building Materials Market, Timber Shed, Kugbo, Abuja FCT, Nigeria"],
      description: "Visit our office for in-person inquiries."
    },
    {
      icon: <Clock className="contact-icon" />,
      title: "Office Hours",
      details: ["Mon-Fri: 9:00 AM - 6:00 PM", "Sat-Sun: 10:00 AM - 4:00 PM"],
      description: "We're here to help"
    },
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-background"></div>
        <div className="contact-hero-overlay">
          <div className="hero-content">
            <h1 className="contact-title">Get In Touch</h1>
            <p className="contact-subtitle">
              Ready to build your dream? Have questions about our company? 
              We're here to help you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-info-card">
                {info.icon}
                <h3>{info.title}</h3>
                <div className="contact-details">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="contact-detail">{detail}</p>
                  ))}
                </div>
                <p className="contact-description">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-content">
            <div className="form-section">
              <div className="contact-form-card">
                <div className="form-card-header">
                  <h2 className="form-card-title">Send Us a Message</h2>
                  <p className="form-card-description">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>
                
                {submitMessage && (
                  <div className="success-message">
                    {submitMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">
                      <User className="form-icon" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">
                      <Mail className="form-icon" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">
                      <Phone className="form-icon" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">
                      <MessageSquare className="form-icon" />
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="land-inquiry">Land Purchase Inquiry</option>
                      <option value="property-development">Property Development</option>
                      <option value="building-materials">Building Materials</option>
                      <option value="site-visit">Schedule Site Visit</option>
                      <option value="general">General Question</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    <MessageSquare className="form-icon" />
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="btn-icon" />
                      Send Message
                    </>
                  )}
                </button>
                </form>
              </div>
            </div>

            <div className="map-section">
              <h3>Find Us</h3>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps?q=Building+Materials+Market,+Timber+Shed,+Kugbo,+Abuja+FCT,+Nigeria&output=embed"
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: '15px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Eaglophytes Global Consults Location"
                ></iframe>
              </div>
              
              <div className="location-info">
                <h4>Getting Here</h4>
                <ul>
                  <li>🚗 Car: Easy access from Abuja city center via Keffi-Abuja Expressway</li>
                  <li>🚌 Bus: Take any bus heading to Kugbo or Building Materials Market</li>
                  <li>🚕 Taxi: Available from anywhere in Abuja</li>
                  <li>🅿️ Parking: Secure parking available on-site</li>
                  <li>🏢 Landmark: Timber Shed, Kugbo, near Building Materials Market</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="quick-links-section" style={{ padding: '4rem 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem', fontFamily: 'Inter, sans-serif' }}>Quick Links</h2>
            <p style={{ fontSize: '1.2rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>Explore more about our services and offerings</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <a href="/lands" style={{ 
              display: 'block', 
              padding: '2rem', 
              backgroundColor: 'white', 
              borderRadius: '16px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
              textDecoration: 'none', 
              color: '#1f2937',
              transition: 'all 0.3s ease',
              border: '1px solid #e5e7eb',
              borderTop: '4px solid #D4AF37'
            }}>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#D4AF37', fontFamily: 'Inter, sans-serif' }}>Available Lands</h4>
              <p style={{ color: '#6b7280', margin: 0, lineHeight: '1.5' }}>Browse our verified land properties across Abuja</p>
            </a>
            <a href="/faq" style={{ 
              display: 'block', 
              padding: '2rem', 
              backgroundColor: 'white', 
              borderRadius: '16px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
              textDecoration: 'none', 
              color: '#1f2937',
              transition: 'all 0.3s ease',
              border: '1px solid #e5e7eb',
              borderTop: '4px solid #D4AF37'
            }}>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#D4AF37', fontFamily: 'Inter, sans-serif' }}>FAQ</h4>
              <p style={{ color: '#6b7280', margin: 0, lineHeight: '1.5' }}>Find answers to common questions about land sales</p>
            </a>
            <a href="/about" style={{ 
              display: 'block', 
              padding: '2rem', 
              backgroundColor: 'white', 
              borderRadius: '16px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
              textDecoration: 'none', 
              color: '#1f2937',
              transition: 'all 0.3s ease',
              border: '1px solid #e5e7eb',
              borderTop: '4px solid #D4AF37'
            }}>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#D4AF37', fontFamily: 'Inter, sans-serif' }}>About Us</h4>
              <p style={{ color: '#6b7280', margin: 0, lineHeight: '1.5' }}>Learn more about our company and services</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
