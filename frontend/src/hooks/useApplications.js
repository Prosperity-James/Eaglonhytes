import { useState, useCallback } from 'react';
import { api, endpoints } from '../utils/api.js';
import { showSuccess, showError } from '../utils/notifications.js';

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all applications
  const fetchApplications = useCallback(async () => {
    console.log('📋 fetchApplications called - starting...');
    try {
      setLoading(true);
      setError(null);
      console.log('📋 Making API call to:', endpoints.applications);
      const response = await api.get(endpoints.applications);
      console.log('📋 API call completed successfully');
      
      console.log('📋 Raw applications API response:', response);
      console.log('📋 Response.data:', response.data);
      
      if (!response.success) {
        throw new Error(`API returned success=false: ${response.message || 'Unknown error'}`);
      }
      
      const applicationsData = response.data || [];
      console.log('📋 Setting applications state with', applicationsData.length, 'items');
      
      setApplications(applicationsData);
      return applicationsData;
    } catch (err) {
      console.error('📋 fetchApplications error:', err);
      setError(err.message);
      showError(`Failed to fetch applications: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Update application status (approve/reject)
  const updateApplicationStatus = useCallback(async (applicationId, status, rejectionReason = '') => {
    try {
      setLoading(true);
      setError(null);

      const updateData = {
        status: status,
        rejection_reason: rejectionReason,
        admin_notes: status === 'approved' ? 'Application approved by admin' : 'Application rejected by admin'
      };

      const response = await api.put(`${endpoints.applications}?id=${applicationId}`, updateData);
      
      if (response.success) {
        // Update local state
        setApplications(prev => prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: status, rejection_reason: rejectionReason }
            : app
        ));
        
        const message = status === 'approved' ? 'Application approved successfully' : 'Application rejected successfully';
        showSuccess(message);
        return response;
      } else {
        throw new Error(response.message || `Failed to ${status} application`);
      }
    } catch (err) {
      setError(err.message);
      showError(`Failed to update application: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Approve application
  const approveApplication = useCallback(async (applicationId) => {
    return updateApplicationStatus(applicationId, 'approved');
  }, [updateApplicationStatus]);

  // Reject application
  const rejectApplication = useCallback(async (applicationId, rejectionReason) => {
    return updateApplicationStatus(applicationId, 'rejected', rejectionReason);
  }, [updateApplicationStatus]);

  // Get applications by status
  const getApplicationsByStatus = useCallback((status) => {
    return applications.filter(app => app.status === status);
  }, [applications]);

  // Submit new application
  const submitApplication = useCallback(async (applicationData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(endpoints.applications, applicationData);
      
      if (response.success) {
        // Add to local state
        const newApplication = {
          id: response.id,
          ...applicationData,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setApplications(prev => [newApplication, ...prev]);
        showSuccess('Application submitted successfully');
        return response;
      } else {
        throw new Error(response.message || 'Failed to submit application');
      }
    } catch (err) {
      setError(err.message);
      showError(`Failed to submit application: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get pending applications count
  const getPendingCount = useCallback(() => {
    return applications.filter(app => app.status === 'pending').length;
  }, [applications]);

  return {
    applications,
    loading,
    error,
    fetchApplications,
    submitApplication,
    updateApplicationStatus,
    approveApplication,
    rejectApplication,
    getApplicationsByStatus,
    getPendingCount,
  };
};
