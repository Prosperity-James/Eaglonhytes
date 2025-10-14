import React, { useState, useRef, useEffect, memo } from 'react';
import { BuildingOfficeIcon, XMarkIcon } from '@heroicons/react/24/outline';

const LandForm = memo(({ mode = 'add', initialData = null, onSubmit, onCancel, isSubmitting = false, errors = {} }) => {
  // Form data state - single source of truth
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zip_code: initialData?.zip_code || '',
    price: initialData?.price || initialData?.rent_price || '',
    size: initialData?.size || '',
    land_type: initialData?.land_type || 'residential',
    amenities: initialData?.amenities ? initialData.amenities.join(', ') : '',
    status: initialData?.status || 'available',
    featured: initialData?.featured || false,
    whatsapp_contact: initialData?.whatsapp_contact || '+2348123456789',
  });

  // Image state - separate from form data
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState(initialData?.images || []);
  const fileInputRef = useRef(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    
    setSelectedFiles(prev => [...prev, ...files]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove new image preview
  const removeNewImage = (index) => {
    // Revoke object URL to prevent memory leak
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('📋 [LandForm] Form data state:', formData);
    
    // Create FormData object
    const submitData = new FormData();
    
    // Append form fields
    Object.keys(formData).forEach(key => {
      console.log(`📝 Appending ${key}:`, formData[key]);
      submitData.append(key, formData[key]);
    });
    
    console.log('✅ [LandForm] Submitting FormData with', selectedFiles.length, 'new files and', existingImages.length, 'existing images');
    
    // Pass both FormData and selected files
    onSubmit(submitData, selectedFiles, existingImages);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* General Error */}
      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Enter land title"
          required
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter land description"
        />
      </div>

      {/* Address & City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Street address"
            required
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="City"
            required
          />
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
        </div>
      </div>

      {/* State & Zip Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errors.state ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="State"
            required
          />
          {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Zip Code</label>
          <input
            type="text"
            name="zip_code"
            value={formData.zip_code}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Zip code (optional)"
          />
        </div>
      </div>

      {/* Size & Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Size (sqm) <span className="text-red-500">*</span>
          </label>
          <select
            name="size"
            value={formData.size}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errors.size ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Select size</option>
            <option value="no_size">No Size Specified</option>
            {[100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000].map(size => (
              <option key={size} value={size}>{size} sqm</option>
            ))}
          </select>
          {errors.size && <p className="mt-1 text-sm text-red-600">{errors.size}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Price (₦) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter price"
            step="0.01"
            required
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
        </div>
      </div>

      {/* Land Type & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Land Type</label>
          <select
            name="land_type"
            value={formData.land_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="agricultural">Agricultural</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Amenities</label>
        <input
          type="text"
          name="amenities"
          value={formData.amenities}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter amenities (comma separated)"
        />
        <p className="mt-1 text-xs text-gray-500">Example: Water, Electricity, Security, Fenced</p>
      </div>

      {/* WhatsApp Contact */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">WhatsApp Contact</label>
        <input
          type="tel"
          name="whatsapp_contact"
          value={formData.whatsapp_contact}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="+234XXXXXXXXXX"
        />
      </div>

      {/* Featured Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="featured"
          id="featured"
          checked={formData.featured}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
          Mark as featured property
        </label>
      </div>

      {/* Images Section */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Property Images</label>

        {/* Existing Images (Edit Mode) */}
        {mode === 'edit' && existingImages.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-sm text-gray-600">Current Images:</p>
            <div className="grid grid-cols-3 gap-2">
              {existingImages.map((image, index) => (
                <div key={`existing-${index}`} className="relative group">
                  <img
                    src={image.startsWith('http') ? image : `http://localhost/Eaglonhytes/api/uploads/${image}`}
                    alt={`Current ${index + 1}`}
                    className="object-cover w-full h-24 rounded-lg"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute flex items-center justify-center w-6 h-6 text-white bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -top-2 -right-2 hover:bg-red-600"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Image Previews */}
        {previewUrls.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-sm text-gray-600">New Images to Upload:</p>
            <div className="grid grid-cols-3 gap-2">
              {previewUrls.map((url, index) => (
                <div key={`new-${index}`} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="object-cover w-full h-24 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute flex items-center justify-center w-6 h-6 text-white bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -top-2 -right-2 hover:bg-red-600"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
          <div className="space-y-1 text-center">
            <BuildingOfficeIcon className="w-12 h-12 mx-auto text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label className="relative font-medium text-blue-600 bg-white rounded-md cursor-pointer hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Upload images</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  disabled={isSubmitting}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
          </div>
        </div>
        {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end pt-4 space-x-3 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add Land' : 'Update Land'}
        </button>
      </div>
    </form>
  );
});

LandForm.displayName = 'LandForm';

export default LandForm;
