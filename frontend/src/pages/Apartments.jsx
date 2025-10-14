import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLands } from '../hooks/useLands';
import { useApplications } from '../hooks/useApplications';
import { showSuccess, showError } from '../utils/notifications';
import '../styles/apartments.css';

const Apartments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lands: properties, loading, fetchLands } = useLands();
  const { applications, fetchApplications } = useApplications();
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    min_price: '',
    max_price: '',
    size: ''
  });

  // Company WhatsApp number
  const companyWhatsApp = '+2347038779189';

  // Check if user has already applied for a property
  const hasUserApplied = (propertyId) => {
    if (!user || !applications) return false;
    return applications.some(app => app.land_id === propertyId && app.user_id === user.id);
  };

  useEffect(() => {
    fetchLands();
    if (user) {
      fetchApplications();
    }
  }, [fetchLands, fetchApplications, user]);

  // Force refresh function
  const handleForceRefresh = () => {
    fetchLands(true);
  };

  // Filter properties based on filters
  const filteredProperties = properties.filter(property => {
    const location = `${property.address || ''} ${property.city || ''} ${property.state || ''}`;
    const matchesCity = !filters.city || location.toLowerCase().includes(filters.city.toLowerCase());
    const matchesMinPrice = !filters.min_price || property.price >= parseInt(filters.min_price);
    const matchesMaxPrice = !filters.max_price || property.price <= parseInt(filters.max_price);
    const matchesSize = !filters.size || property.size.includes(filters.size);
    
    return matchesCity && matchesMinPrice && matchesMaxPrice && matchesSize;
  });

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      min_price: '',
      max_price: '',
      size: ''
    });
  };

  const handleWhatsAppClick = (property) => {
    if (!user) {
      showError('Please login to contact us via WhatsApp');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }
    setSelectedProperty(property);
    setShowWhatsAppModal(true);
  };

  const handleApplyClick = (property) => {
    if (!user) {
      showError('Please login to apply for this property');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }
    
    if (hasUserApplied(property.id)) {
      showError('You have already applied for this property');
      return;
    }
    
    setSelectedProperty(property);
    setShowApplicationModal(true);
  };

  const handlePropertyClick = (property, event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Property clicked:', property.id);
    
    // Show property details in modal
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  const handleWhatsAppContact = () => {
    if (!user || !selectedProperty) {
      console.error('User or selectedProperty is null');
      setShowWhatsAppModal(false);
      return;
    }

    try {
      const location = `${selectedProperty.address || ''}, ${selectedProperty.city || ''}, ${selectedProperty.state || ''}`;
      const features = selectedProperty.amenities || selectedProperty.features || [];
      
      const message = `Hi! I'm interested in this property:

👤 *Customer:* ${user.full_name || 'N/A'} (ID: ${user.id || 'N/A'})
📧 *Email:* ${user.email || 'N/A'}

🏡 *Property ID:* ${selectedProperty.id}
📍 *Title:* ${selectedProperty.title}
📍 *Location:* ${location}
💰 *Price:* ₦${selectedProperty.price ? selectedProperty.price.toLocaleString() : 'N/A'}
📐 *Size:* ${selectedProperty.size || 'N/A'}

📝 *Description:*
${selectedProperty.description || 'No description available'}

✨ *Key Features:*
${Array.isArray(features) ? features.map(feature => `• ${feature}`).join('\n') : (features || 'No features listed')}

Please provide more details and arrange a site visit. Thank you!`;
      
      const whatsappUrl = `https://wa.me/${companyWhatsApp.replace('+', '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      setShowWhatsAppModal(false);
    } catch (error) {
      console.error('Error in handleWhatsAppContact:', error);
      showError('Failed to open WhatsApp. Please try again.');
      setShowWhatsAppModal(false);
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setApplicationLoading(true);
    
    try {
      const formData = new FormData(e.target);
      const applicationData = {
        user_id: user.id,
        land_id: selectedProperty.id,
        move_in_date: formData.get('move_in_date'),
        employment_status: formData.get('employment_status'),
        annual_income: parseFloat(formData.get('annual_income')),
        whatsapp_contact: formData.get('whatsapp_contact'),
        reference_contacts: formData.get('reference_contacts'),
        additional_notes: formData.get('additional_notes')
        // Note: status will default to 'pending' in backend
      };

      const response = await fetch('http://localhost/Eaglonhytes/api/land_applications.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(applicationData)
      });

      const result = await response.json();
      
      if (result.success) {
        showSuccess('Application submitted successfully!');
        setShowApplicationModal(false);
        if (user) {
          fetchApplications();
        }
      } else {
        throw new Error(result.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Application submission error:', error);
      showError(`Failed to submit application: ${error.message}`);
    } finally {
      setApplicationLoading(false);
    }
  };

  const closeModal = () => {
    setShowWhatsAppModal(false);
    setShowApplicationModal(false);
    setShowPropertyModal(false);
    setSelectedProperty(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="apartments-container">
      <div className="apartments-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Available Land Properties</h1>
            <p>Find your perfect plot of land in Abuja and surrounding areas</p>
          </div>
          <button 
            onClick={handleForceRefresh}
            style={{
              background: '#1e40af',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            disabled={loading}
          >
            {loading ? '🔄 Refreshing...' : '🔄 Refresh Images'}
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="filters">
          <input
            type="text"
            name="city"
            placeholder="Search by location"
            value={filters.city}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <input
            type="number"
            name="min_price"
            placeholder="Min Price (₦)"
            value={filters.min_price}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <input
            type="number"
            name="max_price"
            placeholder="Max Price (₦)"
            value={filters.max_price}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <select
            name="size"
            value={filters.size}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">Any Size</option>
            <option value="400">400-500 sqm</option>
            <option value="600">600-700 sqm</option>
            <option value="800">800-900 sqm</option>
            <option value="1000">1000+ sqm</option>
          </select>
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        </div>
      </div>

      <div className="apartments-grid">
        {filteredProperties.length === 0 ? (
          <div className="no-apartments">
            <h3>No properties found</h3>
            <p>Try adjusting your filters or check back later for new listings.</p>
          </div>
        ) : (
          filteredProperties.map(property => (
            <div 
              key={property.id} 
              className="apartment-card property-card"
            >
              <div 
                className="property-clickable-area"
                onClick={(e) => handlePropertyClick(property, e)}
                style={{ cursor: 'pointer' }}
              >
                <div className="apartment-image">
                  {Array.isArray(property.images) && property.images.length > 0 ? (
                    <>
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="property-badge">
                        {property.size}
                      </div>
                    </>
                  ) : (
                    <div className="no-image-placeholder" style={{ height: '200px' }}>
                      <div className="no-image-content">
                        <div className="no-image-icon">🏞️</div>
                        <div className="no-image-text">No Image</div>
                      </div>
                      <div className="property-badge">
                        {property.size}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="apartment-info">
                  <h3>{property.title}</h3>
                  <p className="apartment-address">{`${property.address || ''}, ${property.city || ''}, ${property.state || ''}`}</p>
                  
                  <div className="property-description">
                    <p>{property.description}</p>
                  </div>
                  
                  <div className="property-features">
                    {(property.amenities || property.features || []).slice(0, 2).map((feature, index) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    ))}
                    {(property.amenities || property.features || []).length > 2 && (
                      <span className="feature-more">+{(property.amenities || property.features || []).length - 2} more</span>
                    )}
                  </div>
                  
                  <div className="apartment-price">
                    <span className="rent">₦{property.price ? property.price.toLocaleString() : 'Price on request'}</span>
                    <span className="price-label">Total Price</span>
                  </div>
                </div>
              </div>
              
              <div className="property-action">
                <div className="action-buttons">
                  <button 
                    className={`apply-btn ${hasUserApplied(property.id) ? 'applied' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyClick(property);
                    }}
                    disabled={hasUserApplied(property.id)}
                  >
                    {hasUserApplied(property.id) ? 'Applied' : 'Apply'}
                  </button>
                  <button 
                    className="contact-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWhatsAppClick(property);
                    }}
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showWhatsAppModal && selectedProperty && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="whatsapp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Contact Us About This Property</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
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
                  <div className="no-image-placeholder" style={{ width: '80px', height: '80px', borderRadius: '6px' }}>
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
              
              <div className="contact-info">
                <p className="contact-message">Get in touch with our team to learn more about this property and schedule a site visit.</p>
                
                <div className="whatsapp-section">
                  <div className="whatsapp-icon">📱</div>
                  <div className="whatsapp-details">
                    <h5>WhatsApp Direct Contact</h5>
                    <p>Chat with us instantly for quick responses</p>
                  </div>
                </div>
                
                <button className="whatsapp-btn" onClick={handleWhatsAppContact}>
                  <span className="whatsapp-logo">💬</span>
                  Contact via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showApplicationModal && selectedProperty && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="application-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Apply for Property</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
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
                  <div className="no-image-placeholder" style={{ width: '80px', height: '80px', borderRadius: '6px' }}>
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

      {/* Property Details Modal */}
      {showPropertyModal && selectedProperty && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="property-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Property Details</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="property-image-gallery">
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
                  <div className="no-image-placeholder" style={{ height: '300px', borderRadius: '12px 12px 0 0' }}>
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
                  <div className="property-price-large">
                    <span className="price">₦{selectedProperty.price ? selectedProperty.price.toLocaleString() : 'Price on request'}</span>
                    <span className="price-label">Total Price</span>
                  </div>
                </div>
                
                <div className="property-location">
                  <p><strong>Location:</strong> {`${selectedProperty.address || ''}, ${selectedProperty.city || ''}, ${selectedProperty.state || ''}`}</p>
                  <p><strong>Size:</strong> {selectedProperty.size}</p>
                  <p><strong>Property ID:</strong> #{selectedProperty.id}</p>
                </div>
                
                <div className="property-description-section">
                  <h4>Description</h4>
                  <p>{selectedProperty.description || 'No description available'}</p>
                </div>
                
                <div className="property-features-section">
                  <h4>Features & Amenities</h4>
                  <div className="features-grid">
                    {(selectedProperty.amenities || selectedProperty.features || []).map((feature, index) => (
                      <div key={index} className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="property-actions-section">
                  <div className="action-buttons-large">
                    <button 
                      className={`apply-btn-large ${hasUserApplied(selectedProperty.id) ? 'applied' : ''}`}
                      onClick={() => {
                        closeModal();
                        handleApplyClick(selectedProperty);
                      }}
                      disabled={hasUserApplied(selectedProperty.id)}
                    >
                      {hasUserApplied(selectedProperty.id) ? 'Applied' : 'Apply for this Property'}
                    </button>
                    <button 
                      className="whatsapp-btn-large"
                      onClick={() => {
                        closeModal();
                        handleWhatsAppClick(selectedProperty);
                      }}
                    >
                      <span>📱</span> Contact via WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add styles for the modal and property cards
const modalStyles = `
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
  
  .whatsapp-modal, .application-modal {
    background: white;
    border-radius: 12px;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
  }
  
  .modal-header h3 {
    margin: 0;
    color: #333;
    font-size: 1.2rem;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    padding: 20px;
  }
  
  .property-summary {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .property-summary img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 6px;
  }
  
  .property-info h4 {
    margin: 0 0 5px 0;
    color: #333;
    font-size: 1rem;
  }
  
  .property-info p {
    margin: 2px 0;
    color: #666;
    font-size: 0.9rem;
  }
  
  .property-info .price {
    color: #1e40af;
    font-weight: bold;
    font-size: 1rem;
  }
  
  .contact-message {
    color: #666;
    font-size: 0.95rem;
    margin: 15px 0;
    text-align: center;
    font-style: italic;
  }
  
  .whatsapp-section {
    display: flex;
    align-items: center;
    gap: 15px;
    margin: 20px 0;
    padding: 15px;
    background: #e8f5e8;
    border-radius: 8px;
  }
  
  .whatsapp-icon {
    font-size: 2rem;
  }
  
  .whatsapp-details h5 {
    margin: 0 0 5px 0;
    color: #25d366;
    font-size: 1rem;
  }
  
  .whatsapp-details p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }
  
  .whatsapp-btn {
    width: 100%;
    background: #25d366;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background 0.3s ease;
  }
  
  .whatsapp-btn:hover {
    background: #128c7e;
  }
  
  .property-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: all 0.3s ease;
    margin-bottom: 20px;
  }
  
  .property-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
  
  .property-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #1e40af;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
  }
  
  .apartment-image {
    position: relative;
    height: 200px;
    overflow: hidden;
  }
  
  .apartment-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .apartment-info {
    padding: 20px;
  }
  
  .apartment-info h3 {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 1.2rem;
    font-weight: 600;
  }
  
  .apartment-address {
    color: #666;
    font-size: 0.9rem;
    margin: 0 0 15px 0;
  }
  
  .property-description p {
    color: #555;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0 0 15px 0;
  }
  
  .property-features {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin: 10px 0 15px 0;
  }
  
  .feature-tag {
    background: #e3f2fd;
    color: #1976d2;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .feature-more {
    color: #666;
    font-size: 0.75rem;
    font-style: italic;
  }
  
  .apartment-price {
    display: flex;
    flex-direction: column;
    margin: 15px 0;
  }
  
  .apartment-price .rent {
    color: #1e40af;
    font-size: 1.3rem;
    font-weight: bold;
    margin: 0;
  }
  
  .apartment-price .price-label {
    color: #666;
    font-size: 0.8rem;
    margin: 2px 0 0 0;
  }
  
  .property-action {
    padding: 0 20px 20px 20px;
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
  }
  
  .apply-btn {
    flex: 1;
    background: #1e40af;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .apply-btn:hover:not(:disabled) {
    background: #1e3a8a;
    transform: translateY(-1px);
  }
  
  .apply-btn.applied {
    background: #10b981;
    cursor: not-allowed;
  }
  
  .apply-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .contact-btn {
    flex: 1;
    background: #25d366;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .contact-btn:hover {
    background: #128c7e;
    transform: translateY(-1px);
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    color: #666;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #1e40af;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .application-form {
    padding: 0;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    color: #333;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
  }
  
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #1e40af;
    box-shadow: 0 0 0 2px rgba(30, 64, 175, 0.1);
  }
  
  .form-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #eee;
  }
  
  .cancel-btn {
    background: #6b7280;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .cancel-btn:hover {
    background: #4b5563;
  }
  
  .submit-btn {
    background: #1e40af;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .submit-btn:hover:not(:disabled) {
    background: #1e3a8a;
  }
  
  .submit-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
  
  .property-details-modal {
    background: white;
    border-radius: 12px;
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
  
  .property-image-gallery {
    width: 100%;
    height: 300px;
    overflow: hidden;
    border-radius: 12px 12px 0 0;
  }
  
  .main-property-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .property-details-content {
    padding: 30px;
  }
  
  .property-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .property-header h2 {
    margin: 0;
    color: #333;
    font-size: 1.8rem;
    font-weight: 700;
    flex: 1;
    min-width: 250px;
  }
  
  .property-price-large {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
  }
  
  .property-price-large .price {
    color: #1e40af;
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
  }
  
  .property-price-large .price-label {
    color: #666;
    font-size: 0.9rem;
    margin: 2px 0 0 0;
  }
  
  .property-location {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 25px;
    border-left: 4px solid #1e40af;
  }
  
  .property-location p {
    margin: 8px 0;
    color: #333;
    font-size: 1rem;
  }
  
  .property-description-section {
    margin-bottom: 25px;
  }
  
  .property-description-section h4 {
    color: #333;
    font-size: 1.3rem;
    margin: 0 0 15px 0;
    font-weight: 600;
  }
  
  .property-description-section p {
    color: #555;
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
  }
  
  .property-features-section {
    margin-bottom: 30px;
  }
  
  .property-features-section h4 {
    color: #333;
    font-size: 1.3rem;
    margin: 0 0 15px 0;
    font-weight: 600;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    background: #f0f9ff;
    border-radius: 6px;
    border: 1px solid #e0f2fe;
  }
  
  .feature-icon {
    color: #1e40af;
    font-weight: bold;
    font-size: 1.1rem;
  }
  
  .property-actions-section {
    border-top: 1px solid #eee;
    padding-top: 25px;
  }
  
  .action-buttons-large {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }
  
  .apply-btn-large {
    flex: 1;
    min-width: 200px;
    background: #1e40af;
    color: white;
    border: none;
    padding: 15px 25px;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .apply-btn-large:hover:not(:disabled) {
    background: #1e3a8a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
  }
  
  .apply-btn-large.applied {
    background: #10b981;
    cursor: not-allowed;
  }
  
  .apply-btn-large:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .whatsapp-btn-large {
    flex: 1;
    min-width: 200px;
    background: #25d366;
    color: white;
    border: none;
    padding: 15px 25px;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  
  .whatsapp-btn-large:hover {
    background: #128c7e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
  }
  
  @media (max-width: 768px) {
    .property-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .property-price-large {
      align-items: flex-start;
      text-align: left;
    }
    
    .action-buttons-large {
      flex-direction: column;
    }
    
    .apply-btn-large,
    .whatsapp-btn-large {
      min-width: 100%;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('apartments-modal-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'apartments-modal-styles';
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);
  }
}

export default Apartments;
