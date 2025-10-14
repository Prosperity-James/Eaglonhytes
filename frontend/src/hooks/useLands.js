import { useState, useCallback } from 'react';
import { api, endpoints } from '../utils/api.js';
import { uploadMultipleImages } from '../utils/upload.js';
import { validateLandForm } from '../utils/validation.js';
import { showSuccess, showError } from '../utils/notifications.js';

export const useLands = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all lands from database
  const fetchLands = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Add cache-busting for API calls if force refresh
      const apiUrl = forceRefresh ? `${endpoints.lands}?_t=${Date.now()}` : endpoints.lands;
      const response = await api.get(apiUrl);
      
      // Check if response has the expected structure
      if (!response.success) {
        throw new Error(`API returned success=false: ${response.message || 'Unknown error'}`);
      }
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('🏞️ Invalid response structure:', response);
        throw new Error('Invalid response structure - expected data array');
      }
      
      // Generate a single timestamp for this fetch to use for cache-busting
      const fetchTimestamp = Date.now();
      
      // Transform database data to match frontend expectations
      const transformedLands = response.data.map(land => {
        // console.log('🏞️ Processing land:', land);
        // console.log('🏞️ Raw images:', land.images);
        
        // Parse images and handle backend vs external URLs
        let images;
        try {
          if (Array.isArray(land.images)) {
            images = land.images;
          } else if (typeof land.images === 'string') {
            // Try to parse JSON string
            images = JSON.parse(land.images);
          } else {
            images = [];
          }
        } catch (e) {
          images = [];
        }
        
        // Normalize image strings (trim, remove wrapping quotes) to avoid accidental drops
        images = images.map(img => {
          if (typeof img !== 'string') return img;
          let s = img.trim();
          // Remove wrapping double or single quotes if present
          s = s.replace(/^"|"$/g, '');
          s = s.replace(/^\'|\'$/g, '');
          return s;
        });

        // Process images: only keep actual backend uploads, remove everything else
        images = images.filter(img => {
          if (typeof img === 'string') {
            // Only keep actual backend uploads (relative paths)
            if (img.startsWith('uploads/') || img.startsWith('/uploads/') || img.startsWith('lands/')) {
              return true;
            }
            // Keep full backend URLs
            else if (img.includes('localhost/Eaglonhytes-main/api/uploads/')) {
              return true;
            }
          }
          return false;
        }).map(img => {
          // Convert relative paths to full URLs with cache-busting
          if (img.startsWith('uploads/') || img.startsWith('/uploads/') || img.startsWith('lands/')) {
            const cleanPath = img.startsWith('/') ? img.slice(1) : img;
            return `http://localhost/Eaglonhytes-main/api/uploads/${cleanPath}?v=${fetchTimestamp}`;
          }
          return img;
        });
        
        // Leave images array empty if no actual backend images exist
        // No default placeholders - properties will show without images until admin uploads them
        
        return {
          ...land,
          price: land.price, // Keep original price field
          rent_price: land.price, // Map price to rent_price for backward compatibility
          amenities: land.features ? land.features.split(',').map(f => f.trim()) : [],
          images: images,
          available_date: land.created_at ? land.created_at.split(' ')[0] : new Date().toISOString().split('T')[0],
          parking: 'Available'
        };
      });
      
      // Set the transformed lands data
      
  setLands(transformedLands);
  // Debug: log fetched lands for diagnosis
  // eslint-disable-next-line no-console
  console.debug('[useLands.fetchLands] transformedLands sample:', transformedLands.slice(0,3));
      return transformedLands;
    } catch (err) {
      setError(err.message);
      showError(`Failed to fetch lands: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new land
  const addLand = useCallback(async (formData, imageFiles = []) => {
    try {
      setLoading(true);
      setError(null);

      // Validate form data
      const validationErrors = validateLandForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        const errorMessage = Object.values(validationErrors).join(', ');
        throw new Error(errorMessage);
      }

      // Upload images if any
      let imageUrls = [];
      let uploadResults = [];
      if (imageFiles.length > 0) {
        uploadResults = await uploadMultipleImages(imageFiles, 'lands');
        // Debug: log upload results from server
        // eslint-disable-next-line no-console
        console.debug('[useLands.addLand] uploadResults:', uploadResults);
        imageUrls = uploadResults.map(result => result.relativePath);
      }

      // Prepare land data for database
      const landData = {
        title: formData.get('title'),
        description: formData.get('description'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        zip_code: formData.get('zip_code') || '',
        price: parseFloat(formData.get('price') || formData.get('rent_price')),
        size: formData.get('size'),
        land_type: formData.get('land_type') || 'residential',
        images: JSON.stringify(imageUrls.length > 0 ? imageUrls : []),
        features: formData.get('amenities') || formData.get('features') || '',
        documents: JSON.stringify(['Survey Plan', 'Certificate of Occupancy']),
        status: formData.get('status') || 'available',
        featured: formData.get('featured') ? 1 : 0,
        whatsapp_contact: formData.get('whatsapp_contact') || '+2348123456789',
        created_by: 1 // Assuming admin user ID is 1
      };

      // Send to API
      // Debug: log landData being sent
      // eslint-disable-next-line no-console
      console.debug('[useLands.addLand] landData to send:', landData);
      const response = await api.post(endpoints.lands, landData);
      // Debug: log response from lands API
      // eslint-disable-next-line no-console
      console.debug('[useLands.addLand] lands API response:', response);

      if (response.success) {
        showSuccess('Land added successfully');
        // Refresh lands list after a short delay to prevent glitching
        setTimeout(() => fetchLands(), 300);
        return response;
      } else {
        throw new Error(response.message || 'Failed to add land');
      }
    } catch (err) {
      setError(err.message);
      showError(`Failed to add land: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchLands]);

  // Update an existing land
  const updateLand = useCallback(async (landId, formData, imageFiles = [], existingImages = []) => {
    try {
      setLoading(true);
      setError(null);

      // Validate form data
      const validationErrors = validateLandForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        const errorMessage = Object.values(validationErrors).join(', ');
        throw new Error(errorMessage);
      }

      // Start with existing images that weren't removed
      let imageUrls = existingImages.map(img => {
        // Extract relative path if it's a full URL
        if (img.includes('localhost/Eaglonhytes-main/api/uploads/')) {
          return img.split('uploads/')[1].split('?')[0];
        }
        return img;
      });

      // Upload new images if any
      if (imageFiles.length > 0) {
        const uploadResults = await uploadMultipleImages(imageFiles, 'lands');
        const newImageUrls = uploadResults.map(result => result.relativePath);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      // Prepare land data for database
      const landData = {
        title: formData.get('title'),
        description: formData.get('description'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        zip_code: formData.get('zip_code') || '',
        price: parseFloat(formData.get('price') || formData.get('rent_price')),
        size: formData.get('size'),
        land_type: formData.get('land_type') || 'residential',
        images: JSON.stringify(imageUrls),
        features: formData.get('amenities') || formData.get('features') || '',
        documents: JSON.stringify(['Survey Plan', 'Certificate of Occupancy']),
        status: formData.get('status') || 'available',
        featured: formData.get('featured') ? 1 : 0,
        whatsapp_contact: formData.get('whatsapp_contact') || '+2348123456789'
      };

      // Send to API
      console.log('🚀 Sending update request for land:', landId);
      console.log('📦 Land data:', landData);
      const response = await api.put(`${endpoints.lands}?id=${landId}`, landData);
      console.log('📨 API Response:', response);
      
      if (response.success) {
        showSuccess('Land updated successfully');
        // Refresh lands list after a short delay to prevent glitching
        setTimeout(() => fetchLands(), 300);
        return response;
      } else {
        console.error('❌ Update failed:', response.message);
        throw new Error(response.message || 'Failed to update land');
      }
    } catch (err) {
      setError(err.message);
      showError(`Failed to update land: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchLands]);

  // Delete a land
  const deleteLand = useCallback(async (landId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`${endpoints.lands}?id=${landId}`);
      
      if (response.success) {
        // Refresh lands list
        await fetchLands();
        showSuccess('Land deleted successfully');
        return response;
      } else {
        throw new Error(response.message || 'Failed to delete land');
      }
    } catch (err) {
      setError(err.message);
      showError(`Failed to delete land: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchLands]);

  return {
    lands,
    loading,
    error,
    fetchLands,
    addLand,
    updateLand,
    deleteLand,
  };
};
