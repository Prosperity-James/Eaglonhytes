import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../hooks/useApplications';
import { showSuccess, showError } from '../utils/notifications';
import '../styles/applications.css';

const Applications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applications: allApplications, loading, fetchApplications, approveApplication, rejectApplication } = useApplications();
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      fetchApplications();
    }
  }, [user, fetchApplications]);

  // Filter applications based on user role and status filter
  useEffect(() => {
    let filtered = allApplications;
    
    // If not admin, show only user's own applications
    if (user?.role !== 'admin') {
      filtered = allApplications.filter(app => parseInt(app.user_id) === parseInt(user.id));
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    setFilteredApplications(filtered);
  }, [allApplications, user, statusFilter]);

  const handleApprove = async (applicationId) => {
    try {
      setActionLoading(true);
      await approveApplication(applicationId);
      await fetchApplications();
      showSuccess('Application approved successfully!');
    } catch (error) {
      showError('Failed to approve application: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (application) => {
    setSelectedApplication(application);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      showError('Please provide a rejection reason');
      return;
    }
    
    try {
      setActionLoading(true);
      await rejectApplication(selectedApplication.id, rejectionReason);
      await fetchApplications();
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedApplication(null);
      showSuccess('Application rejected successfully!');
    } catch (error) {
      showError('Failed to reject application: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectionReason('');
    setSelectedApplication(null);
  };

  const handleEditApplication = (application) => {
    setSelectedApplication(application);
    // Pre-populate form with current application data
    setEditFormData({
      move_in_date: application.move_in_date || '',
      employment_status: application.employment_status || '',
      annual_income: application.annual_income || '',
      whatsapp_contact: application.whatsapp_contact || '',
      reference_contacts: application.reference_contacts || '',
      additional_notes: application.additional_notes || ''
    });
    setShowEditModal(true);
  };

  const handleViewProperty = (landId) => {
    navigate(`/land/${landId}`);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedApplication(null);
    setEditFormData({});
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApplication) return;
    
    try {
      setEditLoading(true);
      
      const response = await fetch(`http://localhost/Eaglonhytes/api/land_applications.php?id=${selectedApplication.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...editFormData,
          status: 'pending' // Keep as pending after edit
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        showSuccess('Application updated successfully!');
        await fetchApplications(); // Refresh the applications list
        closeEditModal();
      } else {
        throw new Error(data.message || 'Failed to update application');
      }
    } catch (error) {
      showError('Failed to update application: ' + error.message);
    } finally {
      setEditLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffa500';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'withdrawn': return '#6c757d';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="applications-container">
      <div className="applications-header">
        <h1>My Applications</h1>
        <p>Track the status of your land applications</p>
      </div>

      {/* Filter Controls */}
      <div className="filter-controls" style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <label style={{ fontWeight: '600', color: '#333' }}>Filter by Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', background: 'white' }}
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>
            Showing {filteredApplications.length} of {allApplications.length} applications
          </span>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="no-applications">
          <h3>No applications yet</h3>
          <p>You haven't applied for any properties yet. Browse our available lands and submit your first application!</p>
          <a href="/lands" className="browse-btn">Browse Properties</a>
        </div>
      ) : (
        <div className="applications-list">
          {filteredApplications.map(application => (
            <div key={application.id} className="application-card">
              <div className="application-header">
                <h3>{application.land_title || `Land Property #${application.land_id}`}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(application.status) }}
                >
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </div>

              <div className="application-details">
                <div className="detail-row">
                  <strong>Applied on:</strong> {new Date(application.created_at).toLocaleDateString()}
                </div>
                <div className="detail-row">
                  <strong>Desired Purchase Date:</strong> {new Date(application.move_in_date).toLocaleDateString()}
                </div>
                <div className="detail-row">
                  <strong>Employment Status:</strong> {application.employment_status}
                </div>
                <div className="detail-row">
                  <strong>Annual Income:</strong> ₦{Number(application.annual_income).toLocaleString()}
                </div>
                <div className="detail-row">
                  <strong>WhatsApp Contact:</strong> {application.whatsapp_contact}
                </div>
                
                {application.reference_contacts && (
                  <div className="detail-row">
                    <strong>Reference Contacts:</strong>
                    <p className="notes">{application.reference_contacts}</p>
                  </div>
                )}
                
                {application.additional_notes && (
                  <div className="detail-row">
                    <strong>Additional Notes:</strong>
                    <p className="notes">{application.additional_notes}</p>
                  </div>
                )}

                {application.admin_notes && (
                  <div className="detail-row admin-notes">
                    <strong>Admin Notes:</strong>
                    <p className="notes">{application.admin_notes}</p>
                  </div>
                )}
                
                {application.rejection_reason && (
                  <div className="detail-row rejection-reason">
                    <strong>Rejection Reason:</strong>
                    <p className="notes">{application.rejection_reason}</p>
                  </div>
                )}
              </div>

              <div className="application-actions">
                {user?.role === 'admin' && application.status === 'pending' && (
                  <div className="admin-actions" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <button 
                      onClick={() => handleApprove(application.id)}
                      disabled={actionLoading}
                      className="approve-btn"
                      style={{
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: actionLoading ? 'not-allowed' : 'pointer',
                        opacity: actionLoading ? 0.7 : 1
                      }}
                    >
                      {actionLoading ? 'Approving...' : '✓ Approve'}
                    </button>
                    <button 
                      onClick={() => handleRejectClick(application)}
                      disabled={actionLoading}
                      className="reject-btn"
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: actionLoading ? 'not-allowed' : 'pointer',
                        opacity: actionLoading ? 0.7 : 1
                      }}
                    >
                      {actionLoading ? 'Rejecting...' : '✗ Reject'}
                    </button>
                  </div>
                )}
                {application.status === 'pending' && user?.role !== 'admin' && (
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditApplication(application)}
                    style={{
                      background: '#1e40af',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                  >
                    Edit Application
                  </button>
                )}
                <button 
                  className="view-apartment-btn"
                  onClick={() => handleViewProperty(application.land_id)}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  View Property
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && selectedApplication && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="reject-modal" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div className="modal-header" style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#dc3545', fontSize: '1.3rem' }}>Reject Application</h3>
              <p style={{ margin: '10px 0 0 0', color: '#666' }}>
                Application for: {selectedApplication.land_title}
              </p>
            </div>
            
            <form onSubmit={handleRejectSubmit}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                  Reason for Rejection *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows="4"
                  required
                  placeholder="Please provide a clear reason for rejecting this application..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div className="form-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  onClick={closeRejectModal}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={actionLoading || !rejectionReason.trim()}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: actionLoading || !rejectionReason.trim() ? 'not-allowed' : 'pointer',
                    opacity: actionLoading || !rejectionReason.trim() ? 0.7 : 1
                  }}
                >
                  {actionLoading ? 'Rejecting...' : 'Reject Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Application Modal */}
      {showEditModal && selectedApplication && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="edit-modal" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div className="modal-header" style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#1e40af', fontSize: '1.3rem' }}>Edit Application</h3>
              <p style={{ margin: '10px 0 0 0', color: '#666' }}>
                Application for: {selectedApplication.land_title}
              </p>
            </div>
            
            <div className="edit-notice" style={{
              background: '#ecfdf5',
              border: '1px solid #10b981',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#065f46' }}>Edit Your Application</h4>
              <p style={{ margin: 0, color: '#065f46', fontSize: '0.9rem' }}>
                You can update your application details below. Changes will reset your application status to pending for admin review.
              </p>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div className="edit-form" style={{
                background: '#f8f9fa',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <h4 style={{ margin: '0 0 20px 0', color: '#333' }}>Update Application Details</h4>
                
                <div style={{ display: 'grid', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Desired Purchase Date</label>
                    <input
                      type="date"
                      value={editFormData.move_in_date}
                      onChange={(e) => handleEditFormChange('move_in_date', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Employment Status</label>
                    <select
                      value={editFormData.employment_status}
                      onChange={(e) => handleEditFormChange('employment_status', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select Employment Status</option>
                      <option value="employed_full_time">Employed (Full-time)</option>
                      <option value="employed_part_time">Employed (Part-time)</option>
                      <option value="self_employed">Self-employed</option>
                      <option value="business_owner">Business Owner</option>
                      <option value="freelancer">Freelancer</option>
                      <option value="retired">Retired</option>
                      <option value="student">Student</option>
                      <option value="unemployed">Unemployed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Annual Income (₦)</label>
                    <input
                      type="number"
                      value={editFormData.annual_income}
                      onChange={(e) => handleEditFormChange('annual_income', e.target.value)}
                      placeholder="Enter your annual income"
                      min="0"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>WhatsApp Contact Number</label>
                    <input
                      type="tel"
                      value={editFormData.whatsapp_contact}
                      onChange={(e) => handleEditFormChange('whatsapp_contact', e.target.value)}
                      placeholder="Enter your WhatsApp number"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Reference Contacts</label>
                    <textarea
                      value={editFormData.reference_contacts}
                      onChange={(e) => handleEditFormChange('reference_contacts', e.target.value)}
                      placeholder="Provide reference contacts (names, phone numbers, relationships)"
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Additional Notes</label>
                    <textarea
                      value={editFormData.additional_notes}
                      onChange={(e) => handleEditFormChange('additional_notes', e.target.value)}
                      placeholder="Any additional information you'd like to provide"
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>
              </div>
            
              <div className="form-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  onClick={closeEditModal}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={editLoading}
                  style={{
                    background: '#1e40af',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: editLoading ? 'not-allowed' : 'pointer',
                    opacity: editLoading ? 0.7 : 1
                  }}
                >
                  {editLoading ? 'Updating...' : 'Update Application'}
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;

// Add additional styles for rejection reason and loading
const additionalStyles = `
  .rejection-reason {
    background-color: #fef2f2;
    border-left: 4px solid #ef4444;
    padding: 10px;
    border-radius: 4px;
    margin-top: 10px;
  }
  
  .rejection-reason strong {
    color: #dc2626;
  }
  
  .rejection-reason .notes {
    color: #7f1d1d;
    margin-top: 5px;
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
`;

// Inject additional styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('applications-additional-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'applications-additional-styles';
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
  }
}
