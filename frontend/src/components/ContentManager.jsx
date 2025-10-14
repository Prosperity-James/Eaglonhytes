import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../utils/notifications.js';
import api from '../utils/api.js';

const ContentManager = () => {
  const [storyContent, setStoryContent] = useState({
    title: '',
    content_paragraph_1: '',
    content_paragraph_2: '',
    image_url: ''
  });
  
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('story');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      setLoading(true);
      
      // Fetch story
      const storyResponse = await api.get('/content_management.php?action=get_story');
      if (storyResponse.success && storyResponse.data) {
        setStoryContent(storyResponse.data);
      }
      
      // Fetch carousel
      const carouselResponse = await api.get('/content_management.php?action=get_carousel');
      if (carouselResponse.success && carouselResponse.data) {
        setCarouselImages(ensureMinimumCarouselSlots(carouselResponse.data));
      } else {
        // If no carousel data, create 5 empty slots
        setCarouselImages(ensureMinimumCarouselSlots([]));
      }
      
    } catch (error) {
      console.error('Error fetching content:', error);
      showError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const updateStory = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/content_management.php?action=update_story', storyContent);
      if (response.success) {
        showSuccess('Story content updated successfully');
      } else {
        showError(response.message || 'Failed to update story');
      }
    } catch (error) {
      console.error('Error updating story:', error);
      showError('Failed to update story');
    }
  };

  const updateCarouselImage = (index, field, value) => {
    const updatedImages = [...carouselImages];
    updatedImages[index] = { ...updatedImages[index], [field]: value };
    setCarouselImages(updatedImages);
  };

  const addCarouselImage = () => {
    const newImage = {
      id: Date.now(), // Temporary ID
      title: 'New Image',
      subtitle: 'Edit this subtitle',
      image_url: `/assets/placeholder-carousel-${Math.floor(Math.random() * 5) + 1}.jpg`,
      button_text: 'View More',
      button_link: '/lands',
      display_order: carouselImages.length + 1
    };
    setCarouselImages([...carouselImages, newImage]);
  };

  // Ensure minimum 5 carousel slots
  const ensureMinimumCarouselSlots = (images) => {
    const minSlots = 5;
    if (images.length < minSlots) {
      const additionalSlots = [];
      for (let i = images.length; i < minSlots; i++) {
        additionalSlots.push({
          id: `placeholder-${i + 1}`,
          title: `Carousel Image ${i + 1}`,
          subtitle: 'Click to add your content',
          image_url: `/assets/placeholder-carousel-${i + 1}.jpg`,
          button_text: 'Learn More',
          button_link: '/about',
          display_order: i + 1,
          isPlaceholder: true
        });
      }
      return [...images, ...additionalSlots];
    }
    return images;
  };

  const removeCarouselImage = (index) => {
    const updatedImages = carouselImages.filter((_, i) => i !== index);
    setCarouselImages(updatedImages);
  };

  const saveCarousel = async () => {
    try {
      // Filter out placeholder-only images that haven't been customized
      const imagesToSave = carouselImages.filter(image => {
        // Keep images that are not placeholders OR have been customized
        return !image.isPlaceholder || 
               image.title !== `Carousel Image ${image.display_order}` ||
               image.subtitle !== 'Click to add your content' ||
               !image.image_url.includes('placeholder-carousel');
      });

      const response = await api.post('/content_management.php?action=update_carousel', {
        images: imagesToSave
      });
      if (response.success) {
        showSuccess('Carousel images updated successfully');
        fetchAllContent(); // Refresh data
      } else {
        showError(response.message || 'Failed to update carousel');
      }
    } catch (error) {
      console.error('Error updating carousel:', error);
      showError('Failed to update carousel');
    }
  };

  // Image upload functions
  const handleImageUpload = async (file, type, index = null) => {
    try {
      setUploading(true);
      setApiError(null);
      console.log('Starting upload:', { fileName: file.name, fileSize: file.size, fileType: file.type });
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        throw new Error('File size must be less than 10MB');
      }
      
      // Create form data
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'content');
      
      console.log('Uploading to API...');
      
      // Use direct API call
      const response = await api.postForm('/upload_image.php?type=content', formData);
      
      console.log('Upload response:', response);
      
      if (response.success) {
        const imageUrl = response.url;
        
        if (type === 'story') {
          // Update local state immediately
          setStoryContent(prev => {
            const updated = { ...prev, image_url: imageUrl };

            // Auto-save the new image_url to backend so it persists
            (async () => {
              try {
                const saveResp = await api.post('/content_management.php?action=update_story', updated);
                if (saveResp && saveResp.success) {
                  showSuccess('Story image uploaded and saved successfully');
                } else {
                  showError(saveResp.message || 'Uploaded but failed to save story image');
                }
              } catch (err) {
                console.error('Error saving uploaded story image:', err);
                showError('Uploaded but failed to save story image');
              }
            })();

            return updated;
          });
        } else if (type === 'carousel' && index !== null) {
          // Update state immediately and auto-save carousel to backend
          setCarouselImages(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], image_url: imageUrl };

            // Auto-save updated carousel images (non-blocking)
            (async () => {
              try {
                const response = await api.post('/content_management.php?action=update_carousel', { images: updated });
                if (response && response.success) {
                  showSuccess('Carousel image uploaded and saved successfully');
                } else {
                  showError(response.message || 'Uploaded but failed to save carousel image');
                }
              } catch (err) {
                console.error('Error saving uploaded carousel image:', err);
                setApiError(err.message || String(err));
                showError('Uploaded but failed to save carousel image');
              }
            })();

            return updated;
          });
        }
      } else {
        showError(response.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      // Capture detailed error for debugging UI
      const msg = error && error.message ? error.message : String(error);
      setApiError(msg);
      showError(`Upload failed: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e, dropZone) => {
    e.preventDefault();
    setDragOver(dropZone);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleDrop = (e, type, index = null) => {
    e.preventDefault();
    setDragOver(null);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleImageUpload(imageFile, type, index);
    } else {
      showError('Please drop an image file');
    }
  };

  const handleFileSelect = (e, type, index = null) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file, type, index);
    } else {
      showError('Please select an image file');
    }
  };

  if (loading) {
    return <div className="loading">Loading content...</div>;
  }

  return (
    <div className="content-manager">
      <h2>Content Management</h2>
      {apiError && (
        <div style={{ background: '#ffe6e6', color: '#660000', padding: '10px', borderRadius: '6px', marginBottom: '12px' }}>
          <strong>API Error:</strong>
          <div style={{ fontFamily: 'monospace', fontSize: '12px', whiteSpace: 'pre-wrap', marginTop: '6px' }}>{apiError}</div>
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={activeTab === 'story' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('story')}
        >
          Story Content
        </button>
        <button 
          className={activeTab === 'carousel' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('carousel')}
        >
          Carousel Images
        </button>
      </div>

      {/* Story Content Tab */}
      {activeTab === 'story' && (
        <div className="tab-content">
          <h3>Edit Story Section</h3>
          <form onSubmit={updateStory} className="story-form">
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={storyContent.title}
                onChange={(e) => setStoryContent({...storyContent, title: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>First Paragraph:</label>
              <textarea
                value={storyContent.content_paragraph_1}
                onChange={(e) => setStoryContent({...storyContent, content_paragraph_1: e.target.value})}
                rows="4"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Second Paragraph:</label>
              <textarea
                value={storyContent.content_paragraph_2}
                onChange={(e) => setStoryContent({...storyContent, content_paragraph_2: e.target.value})}
                rows="4"
                required
              />
            </div>
            
              <div className="form-group">
              <label>Story Image:</label>
              <div className="image-preview">
                <img 
                  src={storyContent.image_url || '/assets/storyimg.jpg'}
                  alt="Story Image"
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div style={{
                  display: 'none',
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#f8f9fa',
                  border: '2px dashed #dee2e6',
                  borderRadius: '8px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6c757d',
                  flexDirection: 'column'
                }}>
                  <p style={{ margin: '0', textAlign: 'center', fontSize: '14px' }}>
                    📷 Add storyimg.jpg to /assets/ folder (or upload a story image below)
                  </p>
                </div>
                <p style={{ marginTop: '10px', color: '#666', fontSize: '12px' }}>
                  Using uploaded story image if set; otherwise using /assets/storyimg.jpg
                </p>
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary">Update Story</button>
          </form>
        </div>
      )}

      {/* Carousel Images Tab */}
      {activeTab === 'carousel' && (
        <div className="tab-content">
          <h3>Manage Carousel Images</h3>
          
          {carouselImages.map((image, index) => (
            <div key={image.id || index} className="carousel-item-editor">
              <h4>Image {index + 1}</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={image.title}
                    onChange={(e) => updateCarouselImage(index, 'title', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Subtitle:</label>
                  <input
                    type="text"
                    value={image.subtitle}
                    onChange={(e) => updateCarouselImage(index, 'subtitle', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Carousel Image:</label>
                <div className="image-upload-section">
                  <div 
                    className={`image-drop-zone carousel-drop ${dragOver === `carousel-${index}` ? 'drag-over' : ''}`}
                    onDragOver={(e) => handleDragOver(e, `carousel-${index}`)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'carousel', index)}
                  >
                    {image.image_url ? (
                      <div className="image-preview">
                        <img src={image.image_url} alt={image.title} />
                        <div className="image-overlay">
                          <button 
                            type="button" 
                            onClick={() => document.getElementById(`carousel-file-input-${index}`).click()}
                            disabled={uploading}
                          >
                            {uploading ? 'Uploading...' : 'Change Image'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="drop-placeholder">
                        <p>🖼️ Drag & drop image here</p>
                        <button 
                          type="button" 
                          onClick={() => document.getElementById(`carousel-file-input-${index}`).click()}
                          disabled={uploading}
                        >
                          {uploading ? 'Uploading...' : 'Choose Image'}
                        </button>
                      </div>
                    )}
                  </div>
                  <input
                    id={`carousel-file-input-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, 'carousel', index)}
                    style={{ display: 'none' }}
                  />
                  <div className="url-input-section">
                    <label>Or paste image URL:</label>
                    <input
                      type="url"
                      value={image.image_url}
                      onChange={(e) => updateCarouselImage(index, 'image_url', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-row">
                
                <div className="form-group">
                  <label>Button Text:</label>
                  <input
                    type="text"
                    value={image.button_text}
                    onChange={(e) => updateCarouselImage(index, 'button_text', e.target.value)}
                  />
                </div>
              </div>
              
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={() => removeCarouselImage(index)}
              >
                Remove Image
              </button>
            </div>
          ))}
          
          <div className="carousel-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={addCarouselImage}
            >
              Add New Image
            </button>
            
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={saveCarousel}
            >
              Save All Changes
            </button>
          </div>
        </div>
      )}

      <style>{`
        .content-manager {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .tab-navigation {
          display: flex;
          margin-bottom: 20px;
          border-bottom: 1px solid #ddd;
        }
        
        .tab {
          padding: 10px 20px;
          background: none;
          border: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }
        
        .tab.active {
          border-bottom-color: #007bff;
          color: #007bff;
        }
        
        .tab-content {
          padding: 20px 0;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .carousel-item-editor {
          border: 1px solid #ddd;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 4px;
        }
        
        .carousel-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .btn-primary {
          background: #007bff;
          color: white;
        }
        
        .btn-secondary {
          background: #6c757d;
          color: white;
        }
        
        .btn-danger {
          background: #dc3545;
          color: white;
        }
        
        .loading {
          text-align: center;
          padding: 50px;
        }
        
        .image-upload-section {
          margin-bottom: 15px;
        }
        
        .image-drop-zone {
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 10px;
          min-height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .image-drop-zone:hover {
          border-color: #007bff;
          background-color: #f8f9fa;
        }
        
        .image-drop-zone.drag-over {
          border-color: #007bff;
          background-color: #e3f2fd;
          transform: scale(1.02);
        }
        
        .carousel-drop {
          min-height: 120px;
        }
        
        .image-preview {
          position: relative;
          width: 100%;
          max-width: 300px;
        }
        
        .image-preview img {
          width: 100%;
          height: auto;
          max-height: 200px;
          object-fit: cover;
          border-radius: 4px;
        }
        
        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 4px;
        }
        
        .image-preview:hover .image-overlay {
          opacity: 1;
        }
        
        .image-overlay button {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .drop-placeholder {
          color: #666;
        }
        
        .drop-placeholder p {
          margin: 5px 0;
        }
        
        .drop-placeholder button {
          background: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }
        
        .url-input-section {
          margin-top: 10px;
        }
        
        .url-input-section label {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }
        
        .url-input-section input {
          font-size: 12px;
          padding: 6px;
        }
      `}</style>
    </div>
  );
};

export default ContentManager;
