// Land/Property View Component - Shows detailed view of a specific land property
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import contentValidator from '../utils/contentValidator';
import ValidationErrorModal from '../components/ValidationErrorModal';
import '../styles/content-validation.css';
import '../styles/apartment-view.css';


const ApartmentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [application, setApplication] = useState({
    move_in_date: '',
    whatsapp_contact: '',
    additional_notes: ''
  });
  const [comments, setComments] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState({ rating: 5, comment: '' });
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [contentErrors, setContentErrors] = useState({});
  const [showValidationModal, setShowValidationModal] = useState(false);

  // Real-time content validation
  const handleContentValidation = (fieldName, value) => {
    const result = contentValidator.validateContent(value, fieldName);
    setContentErrors(prev => ({
      ...prev,
      [fieldName]: result.isValid ? '' : result.message
    }));
    return result.isValid;
  };

  useEffect(() => {
    fetchApartment();
    fetchComments();
  }, [id]);

  const fetchApartment = async () => {
    try {
      const response = await fetch(`http://localhost/Eaglonhytes/api/lands.php?id=${id}`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        setApartment(data.data[0]); // Get the first (and only) land property
      } else {
        console.error('Land not found');
        navigate('/lands');
      }
    } catch (error) {
      console.error('Error fetching land:', error);
      navigate('/lands');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    // Content validation for profanity and gibberish
    const contentValidation = contentValidator.validateFields({
      whatsapp_contact: application.whatsapp_contact,
      additional_notes: application.additional_notes
    });

    if (!contentValidation.isValid) {
      setContentErrors(contentValidation.errors);
      setShowValidationModal(true);
      return;
    }

    try {
      const response = await fetch('http://localhost/Zinq%20Bridge%20Apartments/api/applications.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...application,
          apartment_id: parseInt(id)
        }),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Application submitted successfully!');
        setShowApplicationForm(false);
        setApplication({
          move_in_date: '',
          whatsapp_contact: '',
          additional_notes: ''
        });
        setContentErrors({}); // Clear content errors on successful submission
      } else {
        alert(data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplication({
      ...application,
      [name]: value
    });
    
    // Real-time validation for text fields
    if (name === 'whatsapp_contact' || name === 'additional_notes') {
      handleContentValidation(name, value);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await fetch(`http://localhost/Zinq%20Bridge%20Apartments/api/apartment_comments.php?apartment_id=${id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setComments(data.comments);
        setAverageRating(data.average_rating);
        setTotalComments(data.total_comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    // Content validation for profanity and gibberish
    const contentValidation = contentValidator.validateFields({
      comment: newComment.comment
    });

    if (!contentValidation.isValid) {
      setContentErrors(contentValidation.errors);
      setShowValidationModal(true);
      return;
    }

    try {
      const response = await fetch('http://localhost/Zinq%20Bridge%20Apartments/api/apartment_comments.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apartment_id: parseInt(id),
          rating: newComment.rating,
          comment: newComment.comment
        }),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Comment added successfully!');
        setShowCommentForm(false);
        setNewComment({ rating: 5, comment: '' });
        setContentErrors({}); // Clear content errors on successful submission
        fetchComments(); // Refresh comments
      } else {
        alert(data.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Error submitting comment');
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
          onClick={interactive ? () => onStarClick(i) : undefined}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading apartment details...</div>;
  }

  if (!apartment) {
    return <div className="error">Apartment not found</div>;
  }

  return (
    <div className="modern-apartment-view">
      {/* Hero Section */}
      <div className="apartment-hero">
        <button onClick={() => navigate('/apartments')} className="modern-back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Apartments
        </button>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="apartment-title">{apartment.title}</h1>
            <div className="apartment-location">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {apartment.address}, {apartment.city}, {apartment.state}
            </div>
            <div className="price-hero">
              <span className="price-amount">₦{apartment.rent_price.toLocaleString()}</span>
              <span className="price-period">/{apartment.rental_period || 'month'}</span>
            </div>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">{apartment.bedrooms === 0 ? 'Studio' : apartment.bedrooms}</div>
              <div className="stat-label">Bedrooms</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{apartment.bathrooms}</div>
              <div className="stat-label">Bathrooms</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Image Gallery */}
      <div className="modern-gallery-section">
        {apartment.images && apartment.images.length > 0 ? (
          <div className="modern-image-gallery">
            <div className="main-image" onClick={() => setShowImageModal(true)}>
              <img
                src={`http://localhost/Zinq%20Bridge%20Apartments/api/uploads/${apartment.images[selectedImageIndex]}`}
                alt={`${apartment.title} - Image ${selectedImageIndex + 1}`}
                onError={(e) => {
                  e.target.src = '/assets/placeholder-apartment.jpg';
                }}
              />
              <div className="image-overlay">
                <div className="view-all-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  View Full Size
                </div>
                <div className="image-counter">
                  {selectedImageIndex + 1} / {apartment.images.length}
                </div>
              </div>
            </div>
            
            {apartment.images.length > 1 && (
              <div className="thumbnail-grid">
                {apartment.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={`http://localhost/Zinq%20Bridge%20Apartments/api/uploads/${image}`}
                      alt={`${apartment.title} - Image ${index + 1}`}
                      onError={(e) => {
                        e.target.src = '/assets/placeholder-apartment.jpg';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="no-images-placeholder">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
            <p>No Images Available</p>
          </div>
        )}
      </div>

      {/* Full Screen Image Modal */}
      {showImageModal && apartment.images && apartment.images.length > 0 && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn"
              onClick={() => setShowImageModal(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            
            <div className="modal-image-container">
              <img
                src={`http://localhost/Zinq%20Bridge%20Apartments/api/uploads/${apartment.images[selectedImageIndex]}`}
                alt={`${apartment.title} - Image ${selectedImageIndex + 1}`}
                onError={(e) => {
                  e.target.src = '/assets/placeholder-apartment.jpg';
                }}
              />
            </div>
            
            {apartment.images.length > 1 && (
              <>
                <button 
                  className="carousel-nav-btn prev-btn"
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === 0 ? apartment.images.length - 1 : prev - 1
                  )}
                >
                  ‹
                </button>
                
                <button 
                  className="carousel-nav-btn next-btn"
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === apartment.images.length - 1 ? 0 : prev + 1
                  )}
                >
                  ›
                </button>
                
                <div className="modal-thumbnails">
                  {apartment.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`modal-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={`http://localhost/Zinq%20Bridge%20Apartments/api/uploads/${image}`}
                        alt={`Thumbnail ${index + 1}`}
                        onError={(e) => {
                          e.target.src = '/assets/placeholder-apartment.jpg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <div className="modal-image-info">
              <span>{selectedImageIndex + 1} of {apartment.images.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="apartment-main-content">
        <div className="content-grid">
          {/* Left Column */}
          <div className="left-column">
            {/* Description Card */}
            <div className="info-card">
              <h3 className="card-title">Description</h3>
              <p className="description-text">{apartment.description}</p>
            </div>

            {/* Amenities Card */}
            {apartment.amenities && apartment.amenities.length > 0 && (
              <div className="info-card">
                <h3 className="card-title">Amenities</h3>
                <div className="modern-amenities-grid">
                  {apartment.amenities.map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Details Card */}
            <div className="info-card sticky-card">
              <h3 className="card-title">Property Details</h3>
              
              
              <div className="detail-row">
                <span className="detail-label">Available Date</span>
                <span className="detail-value">{new Date(apartment.available_date).toLocaleDateString()}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Property Type</span>
                <span className="detail-value">{apartment.bedrooms === 0 ? 'Studio' : `${apartment.bedrooms} Bedroom`}</span>
              </div>
              

              {/* Action Button */}
              <div className="action-section">
                {user ? (
                  apartment.status === 'available' ? (
                    <button 
                      onClick={() => setShowApplicationForm(true)}
                      className="modern-apply-btn"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 11l3 3L22 4"/>
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                      </svg>
                      Apply Now
                    </button>
                  ) : (
                    <button className="modern-unavailable-btn" disabled>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                      Not Available
                    </button>
                  )
                ) : (
                  <button onClick={() => navigate('/login')} className="modern-login-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
                      <polyline points="10,17 15,12 10,7"/>
                      <line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                    Login to Apply
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Reviews Section */}
      <div className="modern-reviews-section">
        <div className="reviews-header">
          <div className="header-content">
            <h3 className="section-title">Reviews & Ratings</h3>
            <div className="rating-overview">
              {totalComments > 0 ? (
                <div className="rating-stats">
                  <div className="rating-score">
                    <span className="score-number">{averageRating}</span>
                    <div className="score-stars">{renderStars(Math.round(averageRating))}</div>
                  </div>
                  <div className="rating-info">
                    <span className="review-count">{totalComments} review{totalComments !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              ) : (
                <div className="no-ratings">
                  <span>No reviews yet</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {user && (
          <div className="review-form-section">
            {!showCommentForm ? (
              <button 
                onClick={() => setShowCommentForm(true)}
                className="write-review-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Write a Review
              </button>
            ) : (
              <div className="modern-review-form">
                <div className="form-header">
                  <h4>Share Your Experience</h4>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowCommentForm(false);
                      setNewComment({ rating: 5, comment: '' });
                    }}
                    className="close-form-btn"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleCommentSubmit} className="review-form">
                  <div className="rating-section">
                    <label className="form-label">Your Rating</label>
                    <div className="interactive-stars">
                      {renderStars(newComment.rating, true, (rating) => 
                        setNewComment({ ...newComment, rating })
                      )}
                    </div>
                  </div>
                  
                  <div className="comment-section">
                    <label className="form-label">Your Review</label>
                    <textarea
                      value={newComment.comment}
                      onChange={(e) => {
                        setNewComment({ ...newComment, comment: e.target.value });
                        handleContentValidation('comment', e.target.value);
                      }}
                      placeholder="Tell others about your experience with this apartment..."
                      className="review-textarea"
                      rows="4"
                      required
                    />
                    {contentErrors.comment && (
                      <div className="error-message" style={{color: 'red', fontSize: '14px', marginTop: '5px'}}>
                        {contentErrors.comment}
                      </div>
                    )}
                  </div>
                  
                  <div className="form-buttons">
                    <button type="submit" className="submit-review-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                      Submit Review
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowCommentForm(false);
                        setNewComment({ rating: 5, comment: '' });
                      }}
                      className="cancel-review-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        <div className="reviews-list">
          {commentsLoading ? (
            <div className="reviews-loading">
              <div className="loading-spinner"></div>
              <span>Loading reviews...</span>
            </div>
          ) : comments.length > 0 ? (
            <div className="reviews-grid">
              {comments.map((comment) => (
                <div key={comment.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {comment.profile_picture ? (
                          <img 
                            src={`http://localhost/Zinq%20Bridge%20Apartments/api/uploads/profile_pictures/${comment.profile_picture}`}
                            alt={comment.full_name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="avatar-fallback" style={{display: comment.profile_picture ? 'none' : 'flex'}}>
                          {comment.full_name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="reviewer-details">
                        <h5 className="reviewer-name">{comment.full_name}</h5>
                        <div className="review-stars">{renderStars(comment.rating)}</div>
                      </div>
                    </div>
                    <div className="review-date">
                      {formatDate(comment.created_at)}
                    </div>
                  </div>
                  <div className="review-text">
                    <p>{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reviews-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              <h4>No reviews yet</h4>
              <p>Be the first to share your experience with this apartment!</p>
            </div>
          )}
        </div>
      </div>

      {showApplicationForm && (
        <div className="application-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Apply for {apartment.title}</h3>
              <button 
                onClick={() => setShowApplicationForm(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleApplicationSubmit} className="application-form">
              <div className="form-group">
                <label>Desired Move-in Date:</label>
                <input
                  type="date"
                  name="move_in_date"
                  value={application.move_in_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>WhatsApp Contact:</label>
                <input
                  type="tel"
                  name="whatsapp_contact"
                  value={application.whatsapp_contact}
                  onChange={handleInputChange}
                  placeholder="Enter your WhatsApp number (e.g., +234 803 123 4567)"
                  required
                />
                {contentErrors.whatsapp_contact && (
                  <div className="error-message" style={{color: 'red', fontSize: '14px', marginTop: '5px'}}>
                    {contentErrors.whatsapp_contact}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Additional Notes:</label>
                <textarea
                  name="additional_notes"
                  value={application.additional_notes}
                  onChange={handleInputChange}
                  placeholder="Any additional information you'd like to share"
                  rows="3"
                />
                {contentErrors.additional_notes && (
                  <div className="error-message" style={{color: 'red', fontSize: '14px', marginTop: '5px'}}>
                    {contentErrors.additional_notes}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Submit Application
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowApplicationForm(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Validation Error Modal */}
      <ValidationErrorModal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        errors={contentErrors}
      />
    </div>
  );
};

export default ApartmentView;
