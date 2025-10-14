import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLands } from '../hooks/useLands';
import { useApplications } from '../hooks/useApplications';
import { useProfile } from '../hooks/useProfile';
import { useNotifications } from '../hooks/useNotifications';
import { api, endpoints } from '../utils/api';
import { uploadImage, createImagePreviews } from '../utils/upload';
import { showSuccess, showError } from '../utils/notifications';
import ConfirmModal from '../components/ConfirmModal';
import LandForm from '../components/LandForm';
import NewsManager from '../components/NewsManager';
import ToastNotifications from '../components/ToastNotifications';
import '../styles/admin-dashboard.css';
import {
  HomeIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ChevronDownIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

/**
 * Admin Dashboard (Limited Access)
 * - Can edit lands (status & images only)
 * - Can manage applications
 * - Can view/reply to messages
 * - Cannot see other admins
 * - Cannot view revenue reports
 * - Cannot export data
 * - Cannot access system settings
 */
const AdminDashboard = () => {
  const { user, logout, updateUser, refreshUser } = useAuth();
  
  // Custom hooks for data management
  const { lands, loading: landsLoading, fetchLands, addLand, updateLand, deleteLand } = useLands();
  const { applications, loading: applicationsLoading, fetchApplications, approveApplication, rejectApplication } = useApplications();
  
  // Contact messages state
  const [contactMessages, setContactMessages] = useState([]);
  const [contactMessagesLoading, setContactMessagesLoading] = useState(true);
  
  // Fetch contact messages
  const fetchContactMessages = useCallback(async () => {
    try {
      setContactMessagesLoading(true);
      const response = await fetch('http://localhost/Eaglonhytes-main/api/contact.php', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setContactMessages(data.data || []);
      } else {
        setContactMessages([]);
      }
    } catch (error) {
      console.error('Contact messages fetch error:', error);
      setContactMessages([]);
    } finally {
      setContactMessagesLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (user) {
      fetchContactMessages();
    } else {
      setContactMessagesLoading(false);
    }
  }, [user, fetchContactMessages]);
  
  const { profile, loading: profileLoading, fetchProfile, updateProfile, changePassword } = useProfile();
  const { notifications: systemNotifications } = useNotifications();
  
  // Calculate unread count from notifications
  const unreadCount = systemNotifications.filter(notification => notification.unread).length;
  
  // UI state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmTitle, setConfirmTitle] = useState('');
  
  // Helper function to get pending applications count
  const getPendingCount = () => {
    return applications.filter(app => app.status === 'pending').length;
  };
  
  // Computed values
  const loading = landsLoading || applicationsLoading || contactMessagesLoading || profileLoading;
  const stats = {
    total_lands: lands.length,
    sold_lands: lands.filter(land => land.status === 'sold').length,
    pending_applications: getPendingCount()
  };

  // Helper to show confirmation dialog
  const showConfirmDialog = (title, message, action) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };
  
  const handleConfirmAction = async () => {
    if (confirmAction) {
      setIsSubmitting(true);
      try {
        await confirmAction();
      } catch (error) {
        showError(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      await Promise.all([
        fetchLands(),
        fetchApplications(),
        fetchProfile()
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      showError('Failed to fetch dashboard data: ' + error.message);
    }
  }, [fetchLands, fetchApplications, fetchProfile]);

  // Initialize on mount
  useEffect(() => {
    if (user && !showModal) {
      fetchDashboardData();
    }
  }, [user]);

  // Auto-refresh applications
  useEffect(() => {
    if (!user || showModal) return;
    
    const interval = setInterval(() => {
      if (!showModal) {
        fetchApplications();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [user, showModal, fetchApplications]);

  const handleLogout = () => {
    logout();
  };

  // Modal handlers
  const openModal = (type, item = null) => {
    console.log('🔓 [AdminDashboard] Opening modal:', type, 'with item:', item);
    setModalType(type);
    setSelectedItem(item);
    setFormErrors({});
    setIsSubmitting(false);
    setShowModal(true);
    console.log('✅ [AdminDashboard] Modal state set to true');
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedItem(null);
    setFormErrors({});
    setIsSubmitting(false);
  };

  // Land form submit handler
  const handleLandFormSubmit = async (formData, imageFiles, existingImages = []) => {
    setIsSubmitting(true);
    setFormErrors({});
    
    try {
      if (modalType === 'addLand') {
        // Add new land
        await addLand(formData, imageFiles);
      } else {
        // Update existing land
        await updateLand(selectedItem.id, formData, imageFiles, existingImages);
      }
      setShowModal(false);
      setModalType('');
      setSelectedItem(null);
      setFormErrors({});
    } catch (error) {
      setFormErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete land handler
  const handleDeleteLand = async () => {
    setIsSubmitting(true);
    try {
      await deleteLand(selectedItem.id);
      setShowModal(false);
      setModalType('');
      setSelectedItem(null);
    } catch (error) {
      setFormErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Application action handler
  const handleApplicationAction = async (applicationId, action, rejectionReason = '') => {
    try {
      setIsSubmitting(true);
      if (action === 'approved') {
        await approveApplication(applicationId);
      } else if (action === 'rejected') {
        await rejectApplication(applicationId, rejectionReason);
      }
      
      await fetchApplications();
      closeModal();
      setFormErrors({});
    } catch (error) {
      setFormErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation items for Admin (limited)
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'lands', label: 'Lands', icon: BuildingOfficeIcon },
    { id: 'applications', label: 'Applications', icon: CreditCardIcon },
    { id: 'news', label: 'News', icon: DocumentTextIcon },
    { id: 'messages', label: 'Messages', icon: ChatBubbleLeftRightIcon }
  ];

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
          Admin Access
        </span>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Lands</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.total_lands || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <BuildingOfficeIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sold Properties</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.sold_lands || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Applications</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.pending_applications || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <CreditCardIcon className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
            <button 
              onClick={() => setActiveTab('applications')}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Applicant</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Land</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.slice(0, 5).map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full">
                        <span className="text-sm font-medium text-gray-700">
                          {application.full_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{application.full_name}</div>
                        <div className="text-sm text-gray-500">{application.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {application.land_title || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      application.status === 'approved' ? 'bg-green-100 text-green-800' :
                      application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(application.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedItem(application);
                          setModalType('approveApplication');
                          setShowModal(true);
                        }}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full hover:bg-green-200"
                      >
                        <CheckIcon className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(application);
                          setModalType('rejectApplication');
                          setShowModal(true);
                        }}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full hover:bg-red-200"
                      >
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Applications Management Component
  const ApplicationsManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Applications Management</h2>
        <button 
          onClick={() => fetchApplications()}
          className="flex items-center px-3 py-2 space-x-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          disabled={applicationsLoading}
        >
          {applicationsLoading ? (
            <div className="w-4 h-4 border-b-2 border-gray-600 rounded-full animate-spin"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <CreditCardIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {applications.filter(app => app.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">
                {applications.filter(app => app.status === 'approved').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Applicant</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Land</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Purchase Date</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Income</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date Applied</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No applications found
                  </td>
                </tr>
              ) : (
                applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full">
                          <span className="text-sm font-bold text-white">
                            {application.full_name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{application.full_name}</div>
                          <div className="text-sm text-gray-500">{application.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{application.land_title || 'N/A'}</div>
                      <div className="text-sm text-gray-500">₦{Number(application.land_price || 0).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {application.desired_purchase_date ? new Date(application.desired_purchase_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      ₦{Number(application.annual_income || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        application.status === 'approved' ? 'bg-green-100 text-green-800' :
                        application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(application.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal('viewApplication', application)}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full hover:bg-blue-200"
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          View
                        </button>
                        {application.status === 'pending' && (
                          <>
                            <button
                              onClick={() => openModal('approveApplication', application)}
                              className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full hover:bg-green-200"
                            >
                              <CheckIcon className="w-4 h-4 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => openModal('rejectApplication', application)}
                              className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full hover:bg-red-200"
                            >
                              <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Lands Management Component (Full Access)
  const LandsManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Lands Management</h2>
        <div className="flex gap-3">
          <button 
            onClick={() => openModal('addLand')}
            className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg hover:from-amber-600 hover:to-yellow-600 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Land</span>
          </button>
          <button 
            onClick={() => fetchLands()}
            className="flex items-center px-3 py-2 space-x-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            {loading ? (
              <div className="w-4 h-4 border-b-2 border-gray-600 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lands.map((land) => (
          <div key={land.id} className="overflow-hidden transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
            <div className="bg-gray-200 aspect-w-16 aspect-h-9">
              {land.images && land.images.length > 0 ? (
                <img 
                  src={land.images[0].startsWith('http') ? land.images[0] : `http://localhost/Eaglonhytes-main/api/uploads/${land.images[0]}`} 
                  alt={land.title} 
                  className="object-cover w-full h-48"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-48 bg-gray-300">
                  <BuildingOfficeIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{land.title}</h3>
              <p className="mb-2 text-sm text-gray-600">{land.address}, {land.city}, {land.state}</p>
              <p className="mb-4 text-sm text-gray-600">{land.description?.substring(0, 100)}...</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-blue-600">₦{Number(land.price || land.rent_price).toLocaleString()}</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  land.status === 'available' ? 'bg-green-100 text-green-800' : 
                  land.status === 'sold' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {land.status}
                </span>
              </div>
              <div className="mb-4 text-sm text-gray-600">
                <span>{land.size} sqm</span>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => openModal('viewLand', land)}
                  className="flex-1 px-3 py-2 text-sm text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  View
                </button>
                <button 
                  onClick={() => openModal('editLand', land)}
                  className="flex-1 px-3 py-2 text-sm text-white transition-colors bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800"
                >
                  Edit
                </button>
                <button 
                  onClick={() => openModal('deleteLand', land)}
                  className="flex-1 px-3 py-2 text-sm text-white transition-colors bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Messages Management Component
  const MessagesManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
        <button 
          onClick={() => fetchContactMessages()}
          className="flex items-center px-3 py-2 space-x-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          disabled={contactMessagesLoading}
        >
          {contactMessagesLoading ? (
            <div className="w-4 h-4 border-b-2 border-gray-600 rounded-full animate-spin"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </button>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-3xl font-bold text-gray-900">{contactMessages.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-3xl font-bold text-yellow-600">
                {contactMessages.filter(msg => msg.status === 'unread').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <BellIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Replied</p>
              <p className="text-3xl font-bold text-green-600">
                {contactMessages.filter(msg => msg.status === 'replied').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Sender</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Message</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contactMessages.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No messages found
                  </td>
                </tr>
              ) : (
                contactMessages.map((message) => (
                  <tr key={message.id} className={`hover:bg-gray-50 ${message.status === 'unread' ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full">
                          <span className="text-sm font-bold text-white">
                            {message.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{message.name}</div>
                          <div className="text-sm text-gray-500">{message.email}</div>
                          {message.phone && (
                            <div className="text-sm text-gray-500">{message.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{message.subject || 'No Subject'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {message.message?.substring(0, 100)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        message.status === 'replied' ? 'bg-green-100 text-green-800' :
                        message.status === 'unread' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {message.status || 'unread'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(message.created_at).toLocaleDateString()}
                      <div className="text-xs text-gray-400">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal('viewMessage', message)}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full hover:bg-blue-200"
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          View
                        </button>
                        {message.status !== 'replied' && (
                          <button
                            onClick={() => openModal('replyMessage', message)}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full hover:bg-green-200"
                          >
                            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                            Reply
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render active tab content
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'lands':
        return <LandsManagement />;
      case 'applications':
        return <ApplicationsManagement />;
      case 'news':
        return <NewsManager />;
      case 'content':
        return (
          <div className="py-12 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Content Management</h2>
            <p className="text-gray-600">Content editor has been disabled. Carousel and story images are now static assets.</p>
          </div>
        );
      case 'messages':
        return <MessagesManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  // Modal Component
  const Modal = () => {
    if (!showModal) return null;

    const renderModalContent = () => {
      switch (modalType) {
        case 'editLand':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Edit Land</h3>
              <LandForm
                key={selectedItem?.id}
                mode="edit"
                initialData={selectedItem}
                onSubmit={handleLandFormSubmit}
                onCancel={closeModal}
                isSubmitting={isSubmitting}
                errors={formErrors}
              />
            </div>
          );

        case 'viewLand':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Land Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem?.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedItem?.status === 'available' ? 'bg-green-100 text-green-800' : 
                      selectedItem?.status === 'sold' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedItem?.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem?.description || 'No description'}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <p className="mt-1 text-sm font-bold text-blue-600">₦{Number(selectedItem?.price || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Size</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem?.size ? `${selectedItem.size} sqm` : 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Land Type</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{selectedItem?.land_type || 'residential'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem?.address}, {selectedItem?.city}, {selectedItem?.state}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem?.zip_code || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amenities / Features</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem?.features || selectedItem?.amenities || 'No amenities listed'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">WhatsApp Contact</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem?.whatsapp_contact || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Featured</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedItem?.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedItem?.featured ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                {selectedItem?.images && selectedItem.images.length > 0 && (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Images</label>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedItem.images.map((image, index) => (
                        <img 
                          key={index}
                          src={image.startsWith('http') ? image : `http://localhost/Eaglonhytes-main/api/uploads/${image}`}
                          alt={`Land ${index + 1}`}
                          className="object-cover w-full h-24 rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-end pt-4 border-t">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          );

        case 'addLand':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Add New Land</h3>
              <LandForm
                key="new-land"
                mode="add"
                initialData={null}
                onSubmit={handleLandFormSubmit}
                onCancel={closeModal}
                isSubmitting={isSubmitting}
                errors={formErrors}
              />
            </div>
          );

        case 'deleteLand':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Delete Land</h3>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete <strong>{selectedItem?.title}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteLand}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          );

        case 'viewApplication':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Application Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Applicant Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem?.full_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Land</label>
                    <p className="mt-1 text-sm font-medium text-gray-900">{selectedItem?.land_title}</p>
                    <p className="text-sm text-gray-500">₦{Number(selectedItem?.land_price || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedItem?.status === 'approved' ? 'bg-green-100 text-green-800' :
                      selectedItem?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedItem?.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Desired Purchase Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedItem?.desired_purchase_date ? new Date(selectedItem.desired_purchase_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employment Status</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{selectedItem?.employment_status || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Annual Income</label>
                    <p className="mt-1 text-sm font-bold text-green-600">₦{Number(selectedItem?.annual_income || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">WhatsApp Contact</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem?.whatsapp_contact || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reference Contacts</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem?.reference_contacts || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem?.additional_notes || 'No additional notes'}</p>
                </div>
                {selectedItem?.admin_notes && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <label className="block text-sm font-medium text-blue-900">Admin Notes</label>
                    <p className="mt-1 text-sm text-blue-800">{selectedItem.admin_notes}</p>
                  </div>
                )}
                {selectedItem?.rejection_reason && (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <label className="block text-sm font-medium text-red-900">Rejection Reason</label>
                    <p className="mt-1 text-sm text-red-800">{selectedItem.rejection_reason}</p>
                  </div>
                )}
                <div className="flex justify-end pt-4 border-t">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          );

        case 'approveApplication':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Approve Application</h3>
              <p className="mb-4 text-gray-700">
                Are you sure you want to approve the application from <strong>{selectedItem?.full_name}</strong> for <strong>{selectedItem?.land_title}</strong>?
              </p>
              <div>
                <label htmlFor="admin_notes" className="block mb-2 text-sm font-medium text-gray-700">
                  Admin Notes (Optional)
                </label>
                <textarea
                  id="admin_notes"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add any notes for this approval..."
                  value={formErrors.admin_notes || ''}
                  onChange={(e) => setFormErrors({ ...formErrors, admin_notes: e.target.value })}
                />
              </div>
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApplicationAction(selectedItem.id, 'approved', formErrors.admin_notes || '')}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Approving...' : 'Approve Application'}
                </button>
              </div>
            </div>
          );

        case 'rejectApplication':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Reject Application</h3>
              <p className="mb-4 text-gray-700">
                Are you sure you want to reject the application from <strong>{selectedItem?.full_name}</strong> for <strong>{selectedItem?.land_title}</strong>?
              </p>
              <div>
                <label htmlFor="rejection_reason" className="block mb-2 text-sm font-medium text-gray-700">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="rejection_reason"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Please provide a reason for rejection..."
                  value={formErrors.rejection_reason || ''}
                  onChange={(e) => setFormErrors({ ...formErrors, rejection_reason: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!formErrors.rejection_reason?.trim()) {
                      setFormErrors({ ...formErrors, general: 'Rejection reason is required' });
                      return;
                    }
                    handleApplicationAction(selectedItem.id, 'rejected', formErrors.rejection_reason);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Rejecting...' : 'Reject Application'}
                </button>
              </div>
              {formErrors.general && (
                <p className="mt-2 text-sm text-red-600">{formErrors.general}</p>
              )}
            </div>
          );

        case 'viewMessage':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Message Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem?.email}</p>
                  </div>
                </div>
                {selectedItem?.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.phone}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <p className="mt-1 text-sm font-medium text-gray-900">{selectedItem?.subject || 'No Subject'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedItem?.message}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedItem?.status === 'replied' ? 'bg-green-100 text-green-800' :
                      selectedItem?.status === 'unread' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedItem?.status || 'unread'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Received</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedItem?.created_at ? new Date(selectedItem.created_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
                {selectedItem?.admin_reply && (
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <label className="block text-sm font-medium text-green-900">Admin Reply</label>
                    <p className="mt-1 text-sm text-green-800 whitespace-pre-wrap">{selectedItem.admin_reply}</p>
                  </div>
                )}
                <div className="flex justify-end pt-4 space-x-3 border-t">
                  {selectedItem?.status !== 'replied' && (
                    <button 
                      type="button"
                      onClick={() => {
                        closeModal();
                        setTimeout(() => openModal('replyMessage', selectedItem), 100);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      Reply to Message
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          );

        case 'replyMessage':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Reply to Message</h3>
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">From: <span className="font-medium text-gray-900">{selectedItem?.name}</span></p>
                <p className="text-sm text-gray-600">Email: <span className="font-medium text-gray-900">{selectedItem?.email}</span></p>
                <p className="text-sm text-gray-600 mt-2">Original Message:</p>
                <p className="text-sm text-gray-900 mt-1">{selectedItem?.message?.substring(0, 150)}...</p>
              </div>
              <div>
                <label htmlFor="reply_message" className="block mb-2 text-sm font-medium text-gray-700">
                  Your Reply <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="reply_message"
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Type your reply here..."
                  value={formErrors.reply_message || ''}
                  onChange={(e) => setFormErrors({ ...formErrors, reply_message: e.target.value })}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  This reply will be sent to {selectedItem?.email}
                </p>
              </div>
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!formErrors.reply_message?.trim()) {
                      setFormErrors({ ...formErrors, general: 'Reply message is required' });
                      return;
                    }
                    setIsSubmitting(true);
                    try {
                      const response = await fetch('http://localhost/Eaglonhytes-main/api/contact.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                          action: 'reply',
                          message_id: selectedItem.id,
                          reply: formErrors.reply_message
                        })
                      });
                      const data = await response.json();
                      if (data.success) {
                        showSuccess(`Reply sent successfully to ${selectedItem.name}`);
                        await fetchContactMessages();
                        closeModal();
                        setFormErrors({});
                      } else {
                        const errorMsg = data.message || 'Failed to send reply';
                        setFormErrors({ ...formErrors, general: errorMsg });
                        showError(errorMsg);
                      }
                    } catch (error) {
                      const errorMsg = 'Failed to send reply';
                      setFormErrors({ ...formErrors, general: errorMsg });
                      showError(errorMsg);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
              {formErrors.general && (
                <p className="mt-2 text-sm text-red-600">{formErrors.general}</p>
              )}
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
        <div className="relative w-full max-w-4xl mx-4 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          {renderModalContent()}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Toast Notifications */}
      <ToastNotifications />
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out transform bg-white border-r border-gray-200 lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Eaglonhytes</h1>
            <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded">Admin</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <nav className="px-3 mt-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 mb-2 text-sm font-medium transition-colors rounded-lg ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-yellow-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-6 py-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Bars3Icon className="w-6 h-6 text-gray-500" />
            </button>

            <div className="flex items-center ml-auto space-x-4">
              <div className="relative">
                <button className="relative p-2 text-gray-500 hover:text-gray-700">
                  <BellIcon className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              <div className="relative">
                <button className="flex items-center p-2 space-x-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
                    <span className="text-sm font-medium text-gray-700">
                      {user?.full_name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <span className="hidden text-sm font-medium text-gray-700 md:block">{user?.full_name}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 max-h-screen p-6 overflow-y-auto">
          <div className="max-h-full overflow-y-auto">
            {renderActiveTab()}
          </div>
        </main>
      </div>
      
      {Modal()}
      
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAction}
        title={confirmTitle}
        message={confirmMessage}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default AdminDashboard;
