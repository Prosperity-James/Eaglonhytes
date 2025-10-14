import React, { useEffect, useState } from "react";
import { ShoppingBag, Star, Users, Award, X, MapPin, Ruler, Phone, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLands } from '../hooks/useLands.js';
import { useApplications } from '../hooks/useApplications.js';
import { useAuth } from '../context/AuthContext';
import { showSuccess, showError } from '../utils/notifications.js';
import api, { endpoints } from '../utils/api.js';
import "../styles/home.css";
import "../styles/home-apartments.css";

// Import images so the bundler (Vite) resolves them and they are included in the build
import storyImg from '../../../assets/storyimg.jpg';
import sustainabilityImg from '../../../assets/sustainability.jpg';
import transactionsImg from '../../../assets/transactions.jpg';
import unityImg from '../../../assets/unity.jpg';
import logoImg from '../../../assets/logo.png';

// Use bundled image imports for the carousel
const defaultCarouselImages = [
  { id: 1, src: storyImg, title: "Welcome to Eaglonhytes", subtitle: "Your trusted real estate partner" },
  { id: 2, src: sustainabilityImg, title: "Premium Land Properties", subtitle: "Secure your investment with us" },
  { id: 3, src: transactionsImg, title: "Building Materials Supply", subtitle: "Quality materials for your projects" },
  { id: 4, src: unityImg, title: "Trusted by Diaspora", subtitle: "Building dreams across continents" },
  { id: 5, src: logoImg, title: "Expert Consultation", subtitle: "Professional guidance every step" },
];

const achievements = [
  { number: "500+", label: "Happy Clients", icon: <Users className="stat-icon" /> },
  { number: "50+", label: "Modern Building Materials", icon: <ShoppingBag className="stat-icon" /> },
  { number: "20+", label: "Years Of Experience", icon: <Award className="stat-icon" /> },
];


const Home = () => {
  const { lands: properties, loading, error, fetchLands } = useLands();
  const { submitApplication } = useApplications();
  const { user } = useAuth();
  const [carouselImages, setCarouselImages] = useState(defaultCarouselImages);
  // Carousel is static now; no loading state required for fetch
  const [carouselLoading, setCarouselLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Carousel images are static (sourced from /assets). Removed remote fetch to keep images static.
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const navigate = useNavigate();

  // Load real properties from backend
  useEffect(() => {
    fetchLands();
  }, [fetchLands]);

  // Force refresh function
  const handleForceRefresh = () => {
    fetchLands(true);
  };

  // Handle property click - show property detail modal
  const handlePropertyClick = (property, event) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  // Handle apply button click
  const handleApplyClick = (property, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!user) {
      showError('Please log in to apply for properties');
      navigate('/login');
      return;
    }
    
    setSelectedProperty(property);
    setShowApplicationModal(true);
  };

  // Handle WhatsApp click
  const handleWhatsAppClick = (property, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!user) {
      showError('Please log in to contact via WhatsApp');
      navigate('/login');
      return;
    }
    
    const message = `Hi! I'm interested in the property: ${property.title}\n\nLocation: ${property.address || ''}, ${property.city || ''}, ${property.state || ''}\nPrice: ₦${property.price ? property.price.toLocaleString() : 'Price on request'}\n\nCustomer Details:\nName: ${user.name}\nEmail: ${user.email}\nPhone: ${user.phone || 'Not provided'}\n\nPlease provide more information about this property.`;
    
    const whatsappUrl = `https://wa.me/2347038779189?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Handle application form submission
  const handleApplicationSubmit = async (event) => {
    event.preventDefault();
    
    if (!user || !selectedProperty) {
      showError('Please log in to submit applications');
      return;
    }
    
    setApplicationLoading(true);
    
    try {
      const formData = new FormData(event.target);
      const applicationData = {
        land_id: selectedProperty.id,
        user_id: user.id,
        move_in_date: formData.get('move_in_date'),
        employment_status: formData.get('employment_status'),
        annual_income: parseFloat(formData.get('annual_income')),
        whatsapp_contact: formData.get('whatsapp_contact'),
        reference_contacts: formData.get('reference_contacts'),
        additional_notes: formData.get('additional_notes'),
        status: 'pending'
      };
      
      const result = await submitApplication(applicationData);
      
      if (result.success) {
        showSuccess('Application submitted successfully!');
        setShowApplicationModal(false);
        setSelectedProperty(null);
      }
    } catch (error) {
      showError(`Failed to submit application: ${error.message}`);
    } finally {
      setApplicationLoading(false);
    }
  };

  // Close modals
  const closeModal = () => {
    setShowPropertyModal(false);
    setShowApplicationModal(false);
    setSelectedProperty(null);
  };

  // Auto-slide for carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading amazing products...</p>
      </div>
    );
  }

  return (
    <>
      {/* Styles for Home */}
      <style>{`
        .home-page {
          font-family: 'Inter', sans-serif;
          color: #333;
          overflow-x: hidden;
        }
        
        /* Property Preview Styles */
        .section-subtitle {
          text-align: center;
          color: #666;
          font-size: 1rem;
          margin-bottom: 2.5rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .apartment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .property-preview-card {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          background: white;
          max-width: 320px;
          margin: 0 auto;
        }
        
        .property-preview-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .apartment-image-container {
          position: relative;
          overflow: hidden;
          height: 180px;
          border-radius: 12px 12px 0 0;
        }
        
        .apartment-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .property-preview-card:hover .apartment-image {
          transform: scale(1.05);
        }
        
        .property-size-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(30, 64, 175, 0.9);
          color: white;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 2;
          backdrop-filter: blur(4px);
        }
        
        .property-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(30, 64, 175, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 12px 12px 0 0;
        }
        
        .property-preview-card:hover .property-overlay {
          opacity: 1;
        }
        
        .view-more-text {
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          text-align: center;
          padding: 8px;
        }
        
        .apartment-info {
          padding: 1rem;
        }
        
        .apartment-name {
          font-size: 1rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .apartment-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 0.5rem;
        }
        
        .apartment-details {
          margin-bottom: 0.75rem;
        }
        
        .apartment-location {
          display: block;
          color: #666;
          font-size: 0.85rem;
          margin-bottom: 2px;
        }
        
        .apartment-specs {
          color: #888;
          font-size: 0.8rem;
        }
        
        .property-description-preview {
          margin: 0.75rem 0;
        }
        
        .property-description-preview p {
          color: #666;
          font-size: 0.85rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0;
        }
        
        .view-apartment-btn {
          width: 100%;
          background: #1e40af;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        
        .view-apartment-btn:hover {
          background: #1d4ed8;
        }
        
        .view-all-properties {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 2.5rem;
          padding: 0 1rem;
        }
        
        .view-all-btn {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3);
        }
        
        .view-all-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .apartment-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
          }
          
          .property-preview-card {
            max-width: 100%;
          }
          
          .apartment-image-container {
            height: 160px;
          }
        }
        
        @media (max-width: 480px) {
          .apartment-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .apartment-image-container {
            height: 140px;
          }
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .property-detail-modal, .application-modal {
          background: white;
          border-radius: 12px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .application-modal {
          max-width: 600px;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          background: white;
          border-radius: 12px 12px 0 0;
          z-index: 10;
        }
        
        .modal-header h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
        }
        
        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          color: #6b7280;
          transition: all 0.2s ease;
        }
        
        .close-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }
        
        .modal-content {
          padding: 24px;
        }
        
        /* Property Detail Modal Styles */
        .property-images {
          margin-bottom: 24px;
        }
        
        .main-property-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 8px;
        }
        
        .property-details-content {
          space-y: 24px;
        }
        
        .property-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .property-header h2 {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          flex: 1;
          min-width: 250px;
        }
        
        .property-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e40af;
          background: #eff6ff;
          padding: 8px 16px;
          border-radius: 8px;
        }
        
        .property-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
          color: #374151;
        }
        
        .info-item svg {
          color: #1e40af;
          flex-shrink: 0;
        }
        
        .land-type-badge {
          background: #10b981;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .property-description {
          margin-bottom: 24px;
        }
        
        .property-description h4 {
          margin: 0 0 12px 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
        }
        
        .property-description p {
          margin: 0;
          color: #6b7280;
          line-height: 1.6;
        }
        
        .property-features {
          margin-bottom: 32px;
        }
        
        .property-features h4 {
          margin: 0 0 12px 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
        }
        
        .features-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .feature-tag {
          background: #e0e7ff;
          color: #3730a3;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .property-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .apply-btn, .whatsapp-btn {
          flex: 1;
          min-width: 140px;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
        }
        
        .apply-btn {
          background: #1e40af;
          color: white;
        }
        
        .apply-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }
        
        .whatsapp-btn {
          background: #25d366;
          color: white;
        }
        
        .whatsapp-btn:hover {
          background: #22c55e;
          transform: translateY(-1px);
        }
        
        /* Application Modal Styles */
        .property-summary {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
        }
        
        .property-summary img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 6px;
          flex-shrink: 0;
        }
        
        .property-summary .property-info {
          flex: 1;
        }
        
        .property-summary h4 {
          margin: 0 0 4px 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }
        
        .property-summary p {
          margin: 0 0 4px 0;
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .property-summary .price {
          font-weight: 600;
          color: #1e40af;
        }
        
        .application-form {
          space-y: 20px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #374151;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          transition: border-color 0.2s ease;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #1e40af;
          box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
        }
        
        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
        
        .cancel-btn, .submit-btn {
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .cancel-btn {
          background: #f3f4f6;
          color: #374151;
        }
        
        .cancel-btn:hover {
          background: #e5e7eb;
        }
        
        .submit-btn {
          background: #1e40af;
          color: white;
        }
        
        .submit-btn:hover:not(:disabled) {
          background: #1d4ed8;
        }
        
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        /* No Image Placeholder Styles */
        .no-image-placeholder {
          width: 100%;
          height: 180px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border-radius: 12px 12px 0 0;
        }
        
        .no-image-content {
          text-align: center;
          color: #64748b;
        }
        
        .no-image-icon {
          font-size: 2rem;
          margin-bottom: 8px;
          opacity: 0.6;
        }
        
        .no-image-text {
          font-size: 0.875rem;
          font-weight: 500;
          opacity: 0.8;
        }
        
        /* Responsive Modal Styles */
        @media (max-width: 768px) {
          .modal-overlay {
            padding: 10px;
          }
          
          .property-detail-modal, .application-modal {
            max-height: 95vh;
          }
          
          .modal-content {
            padding: 16px;
          }
          
          .property-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .property-header h2 {
            font-size: 1.5rem;
            min-width: auto;
          }
          
          .property-actions {
            flex-direction: column;
          }
          
          .apply-btn, .whatsapp-btn {
            min-width: auto;
          }
          
          .property-summary {
            flex-direction: column;
          }
          
          .property-summary img {
            width: 100%;
            height: 120px;
          }
          
          .form-actions {
            flex-direction: column-reverse;
          }
          
          .cancel-btn, .submit-btn {
            width: 100%;
          }
        }
        
        /* Keep all your existing CSS here */
      `}</style>

      <div className="home-page">
        {/* Hero Carousel */}
        <section className="hero-carousel">
          {carouselImages.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-slide ${index === currentIndex ? "active" : ""}`}
              style={{ backgroundImage: `url(${slide.src})` }}
            >
              <div className="carousel-overlay">
                <h2>{slide.title}</h2>
                <p>{slide.subtitle}</p>
                <a href="/lands" className="carousel-btn"><span>Lands</span></a>
              </div>
            </div>
          ))}
          <button className="carousel-nav prev" onClick={prevSlide}>‹</button>
          <button className="carousel-nav next" onClick={nextSlide}>›</button>
          <div className="carousel-dots">
            {carouselImages.map((_, index) => (
              <span key={index} className={index === currentIndex ? "dot active" : "dot"} onClick={() => setCurrentIndex(index)}></span>
            ))}
          </div>
        </section>

        {/* About Hero */}
        <section className="about-hero">
          <div className="about-hero-overlay">
            <div className="hero-content">
              <p className="about-subtitle">
                Discover why we are the best choice for your next investment.
              </p>
              <div className="hero-stats">
                {achievements.map((stat, index) => (
                  <div key={index} className="stat-item">
                    {stat.icon}
                    <span className="stat-number">{stat.number}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about-section">
          <div className="container">
            <div className="story-content1 image-left">
              <div className="story-text">
              <h2 className="section-title">Our Story</h2>
              <p className="about-text">
                Founded in 2018, our mission is to empower Nigerians at home and in the diaspora to build their dreams with confidence and transparency.
              </p>
              <p className="about-text">
                What began as a simple idea is now a trusted choice for Nigerians looking to build their dreams with ease.
              </p>
              </div>
              <div className="story-image">
              <img 
                src={'/assets/storyimg.jpg'}
                alt="Real Estate Keys - Our Story"
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '15px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div style={{
                display: 'none',
                width: '100%',
                height: '400px',
                backgroundColor: '#f8f9fa',
                border: '2px dashed #dee2e6',
                borderRadius: '15px',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6c757d',
                flexDirection: 'column'
              }}>
                <p>📷 Add storyimg.jpg to /assets/ folder</p>
              </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="apartments-section">
          {error && <div className="container error-message">Error: {error}</div>}
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2 className="section-title">Our Lands</h2>
                <p className="section-subtitle">Discover premium land properties in prime locations across Abuja</p>
              </div>
              <button 
                onClick={handleForceRefresh}
                style={{
                  background: '#1e40af',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
                disabled={loading}
              >
                {loading ? '🔄 Refreshing...' : '🔄 Refresh Images'}
              </button>
            </div>
            <div className="apartment-grid">
              {properties.length > 0 ? (
                properties.map((property) => (
                  <div 
                    className="apartment-card property-preview-card" 
                    key={property.id}
                    onClick={(e) => handlePropertyClick(property, e)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="apartment-image-container">
                      {Array.isArray(property.images) && property.images.length > 0 ? (
                        <>
                          <img 
                            src={property.images[0]} 
                            alt={property.title} 
                            className="apartment-image"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="property-size-badge">{property.size}</div>
                          <div className="property-overlay">
                            <span className="view-more-text">Click to View Details</span>
                          </div>
                        </>
                      ) : (
                        <div className="no-image-placeholder">
                          <div className="no-image-content">
                            <div className="no-image-icon">🏞️</div>
                            <div className="no-image-text">No Image</div>
                            <div className="property-size-badge">{property.size}</div>
                          </div>
                          <div className="property-overlay">
                            <span className="view-more-text">Click to View Details</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="apartment-info">
                      <h3 className="apartment-name">{property.title}</h3>
                      <div className="apartment-price">₦{Number(property.price || 0).toLocaleString()}</div>
                      <div className="apartment-details">
                        <span className="apartment-location">{`${property.address || ''}, ${property.city || ''}, ${property.state || ''}`}</span>
                        <span className="apartment-specs">{property.size} • {property.land_type || 'Residential'}</span>
                      </div>
                      <div className="property-description-preview">
                        <p>{property.description}</p>
                      </div>
                      <button className="view-apartment-btn">View Details</button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-apartments">No Properties available at the moment.</p>
              )}
            </div>
            <div className="view-all-properties">
              <button 
                className="view-all-btn"
                onClick={() => navigate('/lands')}
              >
                View All Properties →
              </button>
            </div>
          </div>
        </section>

        {/* Property Detail Modal */}
        {showPropertyModal && selectedProperty && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="property-detail-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Property Details</h3>
                <button className="close-btn" onClick={closeModal}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="modal-content">
                <div className="property-images">
                  {Array.isArray(selectedProperty.images) && selectedProperty.images.length > 0 ? (
                    <img 
                      src={selectedProperty.images[0]} 
                      alt={selectedProperty.title}
                      className="main-property-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="no-image-placeholder" style={{ height: '300px', borderRadius: '8px' }}>
                      <div className="no-image-content">
                        <div className="no-image-icon" style={{ fontSize: '3rem' }}>🏞️</div>
                        <div className="no-image-text" style={{ fontSize: '1rem' }}>No Image Available</div>
                        <div style={{ fontSize: '0.875rem', marginTop: '8px', opacity: '0.6' }}>
                          Admin can upload images for this property
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="property-details-content">
                  <div className="property-header">
                    <h2>{selectedProperty.title}</h2>
                    <div className="property-price">₦{Number(selectedProperty.price || 0).toLocaleString()}</div>
                  </div>
                  
                  <div className="property-info-grid">
                    <div className="info-item">
                      <MapPin size={20} />
                      <span>{`${selectedProperty.address || ''}, ${selectedProperty.city || ''}, ${selectedProperty.state || ''}`}</span>
                    </div>
                    <div className="info-item">
                      <Ruler size={20} />
                      <span>{selectedProperty.size}</span>
                    </div>
                    <div className="info-item">
                      <span className="land-type-badge">{selectedProperty.land_type || 'Residential'}</span>
                    </div>
                  </div>
                  
                  <div className="property-description">
                    <h4>Description</h4>
                    <p>{selectedProperty.description}</p>
                  </div>
                  
                  {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                    <div className="property-features">
                      <h4>Features</h4>
                      <div className="features-list">
                        {selectedProperty.amenities.map((feature, index) => (
                          <span key={index} className="feature-tag">{feature}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="property-actions">
                    <button 
                      className="apply-btn"
                      onClick={(e) => handleApplyClick(selectedProperty, e)}
                    >
                      Apply Now
                    </button>
                    <button 
                      className="whatsapp-btn"
                      onClick={(e) => handleWhatsAppClick(selectedProperty, e)}
                    >
                      <MessageCircle size={20} />
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Application Modal */}
        {showApplicationModal && selectedProperty && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="application-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Apply for Property</h3>
                <button className="close-btn" onClick={closeModal}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="modal-content">
                <div className="property-summary">
                  {Array.isArray(selectedProperty.images) && selectedProperty.images.length > 0 ? (
                    <img 
                      src={selectedProperty.images[0]} 
                      alt={selectedProperty.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="no-image-placeholder" style={{ width: '80px', height: '80px', borderRadius: '6px', fontSize: '0.75rem' }}>
                      <div className="no-image-content">
                        <div className="no-image-icon" style={{ fontSize: '1.5rem', marginBottom: '2px' }}>🏞️</div>
                      </div>
                    </div>
                  )}
                  <div className="property-info">
                    <h4>{selectedProperty.title}</h4>
                    <p>{`${selectedProperty.address || ''}, ${selectedProperty.city || ''}, ${selectedProperty.state || ''}`}</p>
                    <p className="price">₦{selectedProperty.price ? selectedProperty.price.toLocaleString() : 'Price on request'}</p>
                  </div>
                </div>
                
                <form onSubmit={handleApplicationSubmit} className="application-form">
                  <div className="form-group">
                    <label htmlFor="move_in_date">Desired Purchase Date:</label>
                    <input 
                      type="date" 
                      id="move_in_date" 
                      name="move_in_date" 
                      required 
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="employment_status">Employment Status:</label>
                    <select id="employment_status" name="employment_status" required>
                      <option value="">Select Employment Status</option>
                      <option value="Full-time Employee">Full-time Employee</option>
                      <option value="Part-time Employee">Part-time Employee</option>
                      <option value="Self-employed">Self-employed</option>
                      <option value="Business Owner">Business Owner</option>
                      <option value="Freelancer">Freelancer</option>
                      <option value="Retired">Retired</option>
                      <option value="Student">Student</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="annual_income">Annual Income (₦):</label>
                    <input 
                      type="number" 
                      id="annual_income" 
                      name="annual_income" 
                      required 
                      min="0"
                      step="1000"
                      placeholder="e.g., 5000000"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="whatsapp_contact">WhatsApp Number:</label>
                    <input 
                      type="tel" 
                      id="whatsapp_contact" 
                      name="whatsapp_contact" 
                      required 
                      placeholder="e.g., +2348123456789"
                      defaultValue={user?.phone || ''}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="reference_contacts">Reference Contacts:</label>
                    <textarea 
                      id="reference_contacts" 
                      name="reference_contacts" 
                      rows="3"
                      placeholder="Please provide at least 2 references with names and phone numbers"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="additional_notes">Additional Notes:</label>
                    <textarea 
                      id="additional_notes" 
                      name="additional_notes" 
                      rows="4"
                      placeholder="Tell us why you're interested in this property and any additional information..."
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={closeModal}>
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn" disabled={applicationLoading}>
                      {applicationLoading ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
