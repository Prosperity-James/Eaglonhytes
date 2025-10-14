import { useState, useCallback } from 'react';
import { api, endpoints } from '../utils/api.js';
import { validateUserForm } from '../utils/validation.js';
import { showSuccess, showError } from '../utils/notifications.js';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    console.log('👥 fetchUsers called - starting...');
    try {
      setLoading(true);
      setError(null);
      console.log('👥 Making API call to:', endpoints.users);
      const response = await api.get(endpoints.users);
      console.log('👥 API call completed successfully');
      
      console.log('👥 Raw users API response:', response);
      console.log('👥 Response.data:', response.data);
      console.log('👥 Response.users:', response.users);
      
      // Check if response has the expected structure
      if (!response.success) {
        throw new Error(`API returned success=false: ${response.message || 'Unknown error'}`);
      }
      
      const userData = response.data || response.users || [];
      console.log('👥 Final userData:', userData);
      console.log('👥 userData length:', userData.length);
      
      if (!Array.isArray(userData)) {
        console.error('👥 Invalid userData structure:', userData);
        throw new Error('Invalid response structure - expected users array');
      }
      
      console.log('👥 Setting users state with', userData.length, 'items');
      setUsers(userData);
      return userData;
    } catch (err) {
      console.error('👥 fetchUsers error:', err);
      setError(err.message);
      showError(`Failed to fetch users: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new user
  const addUser = useCallback(async (formData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate form data (for new user)
      const validationErrors = validateUserForm(formData, false);
      if (Object.keys(validationErrors).length > 0) {
        const errorMessage = Object.values(validationErrors).join(', ');
        throw new Error(errorMessage);
      }

      // Prepare user data
      const userData = {
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        is_admin: formData.get('role') === 'admin' ? 1 : 0,
        password: formData.get('password') || 'defaultpassword123' // Use provided password or default
      };

      // Send to API
      const response = await api.post(endpoints.users, userData);
      
      if (response.success) {
        // Refresh users list to get the complete user data from server
        await fetchUsers();
        showSuccess('User added successfully');
        return response;
      } else {
        throw new Error(response.message || 'Failed to add user');
      }
    } catch (err) {
      setError(err.message);
      showError(`Failed to add user: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // Update an existing user
  const updateUser = useCallback(async (userId, formData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate form data (for edit)
      const validationErrors = validateUserForm(formData, true);
      if (Object.keys(validationErrors).length > 0) {
        const errorMessage = Object.values(validationErrors).join(', ');
        throw new Error(errorMessage);
      }

      // Prepare user data
      const userData = {
        id: userId,
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        is_admin: formData.get('role') === 'admin' ? 1 : 0
      };

      // Add password if provided (for editing)
      const password = formData.get('password');
      if (password && password.trim() !== '') {
        userData.password = password;
      }

      // Send to API
      const response = await api.put(endpoints.users, userData);
      
      if (response.success) {
        // Update local state
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, ...userData } : user
        ));
        showSuccess('User updated successfully');
        return response;
      } else {
        throw new Error(response.message || 'Failed to update user');
      }
    } catch (err) {
      setError(err.message);
      showError(`Failed to update user: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a user
  const deleteUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`${endpoints.users}?id=${userId}`);
      
      if (response.success) {
        // Remove from local state
        setUsers(prev => prev.filter(user => user.id !== userId));
        showSuccess('User deleted successfully');
        return response;
      } else {
        throw new Error(response.message || 'Failed to delete user');
      }
    } catch (err) {
      setError(err.message);
      showError(`Failed to delete user: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
  };
};
