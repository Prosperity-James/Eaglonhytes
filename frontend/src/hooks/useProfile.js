import { useState, useCallback } from 'react';
import { api, endpoints } from '../utils/api.js';
import { uploadImage } from '../utils/upload.js';
import { validateProfileForm, validatePasswordChange } from '../utils/validation.js';
import { showSuccess, showError } from '../utils/notifications.js';

export const useProfile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(endpoints.profile);
      
      if (response.success) {
        setProfile(response.profile || {});
        return response.profile;
      } else {
        throw new Error(response.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError(err.message);
      showError(`Failed to fetch profile: ${err.message}`);
      return {};
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (formData, profilePictureFile = null) => {
    try {
      setLoading(true);
      setError(null);

      // Validate form data
      const validationErrors = validateProfileForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        const errorMessage = Object.values(validationErrors).join(', ');
        throw new Error(errorMessage);
      }

      // Handle profile picture upload if present
      let profilePictureUrl = profile.profile_picture;
      if (profilePictureFile) {
        const uploadResult = await uploadImage(profilePictureFile, 'profile_pictures');
        profilePictureUrl = uploadResult.relativePath;
      }

      // Prepare profile data
      const profileData = {
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        profile_picture: profilePictureUrl
      };

      // Send to API
      const response = await api.put(endpoints.profile, profileData);
      
      if (response.success) {
        // Update local state
        setProfile(prev => ({ ...prev, ...profileData }));
        showSuccess('Profile updated successfully');
        return response;
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message);
      showError(`Failed to update profile: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [profile]);

  // Change password
  const changePassword = useCallback(async (currentPassword, newPassword, confirmPassword) => {
    try {
      setLoading(true);
      setError(null);

      // Validate passwords
      const validationErrors = validatePasswordChange(currentPassword, newPassword, confirmPassword);
      if (Object.keys(validationErrors).length > 0) {
        const errorMessage = Object.values(validationErrors).join(', ');
        throw new Error(errorMessage);
      }

      // Send to API
      const response = await api.post(endpoints.profile, {
        current_password: currentPassword,
        new_password: newPassword
      });
      
      if (response.success) {
        showSuccess('Password changed successfully');
        return response;
      } else {
        throw new Error(response.message || 'Failed to change password');
      }
    } catch (err) {
      setError(err.message);
      showError(`Failed to change password: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
  };
};
