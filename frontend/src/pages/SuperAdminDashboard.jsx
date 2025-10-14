import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLands } from '../hooks/useLands';
import { useUsers } from '../hooks/useUsers';
import { useApplications } from '../hooks/useApplications';
import { useProfile } from '../hooks/useProfile';
import { useNotifications } from '../hooks/useNotifications';
import { api, endpoints } from '../utils/api';
import { uploadImage, createImagePreviews } from '../utils/upload';
import { validateLandForm, validateUserForm } from '../utils/validation';
import { showSuccess, showError } from '../utils/notifications';
import ConfirmModal from '../components/ConfirmModal';
import LandForm from '../components/LandForm';
import ToastNotifications from '../components/ToastNotifications';
import MediaSlideshow from '../components/MediaSlideshow';
import '../styles/admin-dashboard.css';
import {
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ChevronDownIcon,
  PlusIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  Cog8ToothIcon,
  KeyIcon,
  ShieldCheckIcon,
  BellAlertIcon,
  DocumentDuplicateIcon,
  PrinterIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const SuperAdminDashboard = () => {
  const { user, logout, updateUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  // Custom hooks for data management
  const { lands, loading: landsLoading, fetchLands, addLand, updateLand, deleteLand } = useLands();
  const { users, loading: usersLoading, fetchUsers, addUser, updateUser: updateUserData, deleteUser } = useUsers();
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
      
      console.log('Contact messages API response:', data);
      
      if (data.success) {
        console.log('Contact messages data:', data.data);
        setContactMessages(data.data || []);
      } else {
        console.log('Contact messages fetch failed:', data.message);
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
    // Temporarily fetch for all users to test functionality
    if (user) {
      fetchContactMessages();
    } else {
      setContactMessagesLoading(false);
    }
  }, [user, fetchContactMessages]);
  
  const { profile, loading: profileLoading, fetchProfile, updateProfile, changePassword } = useProfile();
  const { notifications: toastNotifications, success: showSuccess, error: showError } = useNotifications();
  
  // State for actual notifications from API
  const [systemNotifications, setSystemNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  
  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const response = await fetch('http://localhost/Eaglonhytes-main/api/notifications.php', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setSystemNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };
  
  // Fetch notifications on mount and set interval
  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);
  
  // Calculate unread count from notifications
  const unreadCount = systemNotifications.filter(notification => notification.is_read === 0).length;
  
  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await fetch('http://localhost/Eaglonhytes-main/api/notifications.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: 'mark_read',
          notification_id: notificationId
        })
      });
      const data = await response.json();
      if (data.success) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('http://localhost/Eaglonhytes-main/api/notifications.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: 'mark_all_read'
        })
      });
      const data = await response.json();
      if (data.success) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };
  
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
  
  // Image handling state
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoadingPreviews, setIsLoadingPreviews] = useState(false);

  // Content management state
  const [contentPosts, setContentPosts] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentTableExists, setContentTableExists] = useState(true);
  
  // Media slideshow state
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [slideshowMedia, setSlideshowMedia] = useState([]);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  
  // Helper function to get pending applications count
  const getPendingCount = () => {
    return applications.filter(app => app.status === 'pending').length;
  };

  // Content management functions
  const fetchContentPosts = useCallback(async () => {
    try {
      setContentLoading(true);
      const response = await fetch('http://localhost/Eaglonhytes-main/api/content_posts.php', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setContentPosts(data.data || []);
        // Check if setup is required
        if (data.setup_required || (data.message && data.message.includes('not yet created'))) {
          setContentTableExists(false);
        } else {
          setContentTableExists(true);
        }
      } else {
        showError('Failed to fetch content posts: ' + data.message);
      }
    } catch (error) {
      showError('Failed to fetch content posts: ' + error.message);
    } finally {
      setContentLoading(false);
    }
  }, []);

  // Fetch content posts on mount
  useEffect(() => {
    if (user && activeTab === 'content') {
      fetchContentPosts();
    }
  }, [user, activeTab, fetchContentPosts]);

  // Open media slideshow
  const openSlideshow = (mediaItems, startIndex = 0) => {
    setSlideshowMedia(mediaItems);
    setSlideshowIndex(startIndex);
    setShowSlideshow(true);
  };

  // Close media slideshow
  const closeSlideshow = () => {
    setShowSlideshow(false);
    setSlideshowMedia([]);
    setSlideshowIndex(0);
  };

  // Delete content post
  const deleteContentPost = async (postId) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`http://localhost/Eaglonhytes-main/api/content_posts.php?id=${postId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        showSuccess('Post deleted successfully');
        fetchContentPosts();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showError('Failed to delete post: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Setup content management table
  const setupContentTable = async () => {
    try {
      setContentLoading(true);
      const response = await fetch('http://localhost/Eaglonhytes-main/api/setup_content.php', {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        showSuccess('Content management setup completed successfully!');
        setContentTableExists(true);
        fetchContentPosts();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showError('Failed to setup content management: ' + error.message);
    } finally {
      setContentLoading(false);
    }
  };
  
  // Computed values
  const loading = landsLoading || usersLoading || applicationsLoading || contactMessagesLoading || profileLoading;
  const stats = {
    total_lands: lands.length,
    sold_lands: lands.filter(land => land.status === 'sold').length,
    pending_applications: getPendingCount(),
    monthly_revenue: lands.reduce((total, land) => total + (parseFloat(land.price || land.rent_price) || 0), 0)
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

  // Fetch all dashboard data using hooks
  const fetchDashboardData = useCallback(async () => {
    try {
      console.log('🔄 Starting to fetch dashboard data...');
      const results = await Promise.all([
        fetchLands(),
        fetchUsers(),
        fetchApplications(),
        fetchProfile()
      ]);
      console.log('✅ Dashboard data fetched successfully:', {
        lands: results[0]?.length || 0,
        users: results[1]?.length || 0,
        applications: results[2]?.length || 0,
        profile: results[3] ? 'loaded' : 'failed'
      });
    } catch (error) {
      console.error('❌ Failed to fetch dashboard data:', error);
      showError('Failed to fetch dashboard data: ' + error.message);
    }
  }, [fetchLands, fetchUsers, fetchApplications, fetchProfile]);

  // Initialize on mount and when user changes
  useEffect(() => {
    if (user && !showModal) {
      console.log('🔄 Fetching dashboard data for user:', user.full_name);
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Auto-refresh applications every 30 seconds to keep pending count updated
  useEffect(() => {
    if (!user || showModal) return;
    
    const interval = setInterval(() => {
      if (!showModal) {
        console.log('🔄 Auto-refreshing applications for pending count update...');
        fetchApplications();
      }
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [user, showModal, fetchApplications]);

  const handleLogout = () => {
    logout();
  };

  // Modal handlers
  const openModal = (type, item = null) => {
    console.log('🔓 Opening modal:', type, 'with item:', item);
    setModalType(type);
    setSelectedItem(item);
    setImageFiles([]);
    setImagePreviews([]);
    setIsLoadingPreviews(false);
    setFormErrors({});
    setIsSubmitting(false);
    setShowModal(true);
    console.log('✅ Modal state set to true');
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedItem(null);
    setImageFiles([]);
    setImagePreviews([]);
    setFormErrors({});
    setIsSubmitting(false);
  };

  // Image handling
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Show loading state to prevent glitching perception
    setIsLoadingPreviews(true);
    
    try {
      // Create previews in parallel
      const previews = await createImagePreviews(files);
      
      // Batch state updates together using React 18's automatic batching
      setImageFiles(files);
      setImagePreviews(previews.map(p => p.preview));
    } catch (error) {
      showError('Failed to create image previews: ' + error.message);
      setImageFiles([]);
      setImagePreviews([]);
    } finally {
      setIsLoadingPreviews(false);
    }
  };


  // CRUD Operations using hooks
  const handleLandFormSubmit = async (formData, imageFiles, existingImages = []) => {
    setIsSubmitting(true);
    setFormErrors({});
    
    try {
      if (modalType === 'addLand') {
        await addLand(formData, imageFiles);
      } else if (modalType === 'editLand') {
        // For edit mode, we need to handle existing images
        await updateLand(selectedItem.id, formData, imageFiles, existingImages);
      }
      
      // Close modal immediately after success
      setShowModal(false);
      setModalType('');
      setSelectedItem(null);
      setImageFiles([]);
      setImagePreviews([]);
      setFormErrors({});
    } catch (error) {
      setFormErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLand = (landId) => {
    showConfirmDialog(
      'Delete Land',
      'Are you sure you want to delete this land? This action cannot be undone.',
      () => deleteLand(landId)
    );
  };

  const handleDeleteUser = (userId) => {
    showConfirmDialog(
      'Delete User',
      'Are you sure you want to delete this user? This action cannot be undone.',
      () => deleteUser(userId)
    );
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});
    
    try {
      const formData = new FormData(e.target);
      
      // Simple client-side validation
      const fullName = formData.get('full_name')?.trim();
      const email = formData.get('email')?.trim();
      const password = formData.get('password')?.trim();
      
      if (!fullName) {
        setFormErrors({ full_name: 'Full Name is required' });
        return;
      }
      
      if (!email) {
        setFormErrors({ email: 'Email is required' });
        return;
      }
      
      if (!password) {
        setFormErrors({ password: 'Password is required' });
        return;
      }
      
      if (password.length < 6) {
        setFormErrors({ password: 'Password must be at least 6 characters' });
        return;
      }
      
      await addUser(formData);
      closeModal();
    } catch (error) {
      setFormErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});
    
    try {
      const formData = new FormData(e.target);
      await updateUserData(selectedItem.id, formData);
      
      // If updating current user's profile, refresh user context
      if (selectedItem.id === user?.id) {
        await refreshUser();
      }
      
      closeModal();
    } catch (error) {
      setFormErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplicationAction = async (applicationId, action, rejectionReason = '') => {
    try {
      setIsSubmitting(true);
      if (action === 'approved') {
        await approveApplication(applicationId);
      } else if (action === 'rejected') {
        await rejectApplication(applicationId, rejectionReason);
      }
      
      // Refresh applications to ensure pending count updates
      await fetchApplications();
      
      closeModal();
      setFormErrors({});
    } catch (error) {
      setFormErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});
    
    try {
      const formData = new FormData(e.target);
      const profilePictureFile = imageFiles.length > 0 ? imageFiles[0] : null;
      await updateProfile(formData, profilePictureFile);
      setImageFiles([]);
      setImagePreviews([]);
    } catch (error) {
      setFormErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});
    
    try {
      const formData = new FormData(e.target);
      const currentPassword = formData.get('current_password');
      const newPassword = formData.get('new_password');
      const confirmPassword = formData.get('confirm_password');
      
      await changePassword(currentPassword, newPassword, confirmPassword);
      closeModal();
      e.target.reset();
    } catch (error) {
      setFormErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'lands', label: 'Lands', icon: BuildingOfficeIcon },
    { id: 'users', label: 'Users', icon: UserGroupIcon },
    { id: 'applications', label: 'Applications', icon: CreditCardIcon },
    { id: 'content', label: 'News & Updates', icon: DocumentTextIcon },
    { id: 'messages', label: 'Contact Messages', icon: ChatBubbleLeftRightIcon },
    { id: 'reports', label: 'Reports', icon: ChartBarIcon },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon }
  ];

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <span className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
            Super Admin
          </span>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Loading...
            </>
          ) : (
            <>
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
              Refresh Data
            </>
          )}
        </button>
      </div>
      
      {/* Debug Info */}
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Info:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="font-medium">Lands:</span> {lands.length} items
            {landsLoading && <span className="text-blue-600 ml-1">(loading...)</span>}
          </div>
          <div>
            <span className="font-medium">Users:</span> {users.length} items
            {usersLoading && <span className="text-blue-600 ml-1">(loading...)</span>}
          </div>
          <div>
            <span className="font-medium">Applications:</span> {applications.length} items
            {applicationsLoading && <span className="text-blue-600 ml-1">(loading...)</span>}
          </div>
          <div>
            <span className="font-medium">User:</span> {user ? user.full_name : 'Not logged in'}
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Lands</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.total_lands || 0}</p>
              <p className="mt-1 text-sm text-green-600">+2 this month</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <BuildingOfficeIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupied Units</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.sold_lands || 0}</p>
              <p className="mt-1 text-sm text-green-600">+5 this month</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <UserGroupIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-900">₦{Number(stats?.monthly_revenue || 0).toLocaleString()}</p>
              <p className="mt-1 text-sm text-green-600">+12% from last month</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <CreditCardIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Applications</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.pending_applications || 0}</p>
              <p className="mt-1 text-sm text-red-600">-3 from last week</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <ChartBarIcon className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
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

  // Lands Management Component
  const LandsManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Lands Management</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => fetchDashboardData()}
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
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Add Land button clicked');
              openModal('addLand');
            }}
            className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Land</span>
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
                    console.error('Image failed to load:', e.target.src);
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
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Edit button clicked for land:', land.id);
                    openModal('editLand', land);
                  }}
                  className="flex-1 px-3 py-2 text-sm text-white transition-colors bg-gradient-to-r from-blue-600 to-yellow-500 rounded-lg hover:from-blue-700 hover:to-yellow-600"
                >
                  Edit
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('View button clicked for land:', land.id);
                    openModal('viewLand', land);
                  }}
                  className="flex-1 px-3 py-2 text-sm text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  View
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Delete button clicked for land:', land.id);
                    handleDeleteLand(land.id);
                  }}
                  className="px-3 py-2 text-sm text-red-700 transition-colors bg-red-100 rounded-lg hover:bg-red-200"
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Tenants Management Component
  const TenantsManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Tenants Management</h2>
        <button 
          onClick={() => openModal('addTenant')}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Tenant</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Tenant</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Unit</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Rent</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.filter(user => !user.is_admin).map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full">
                        <span className="text-sm font-medium text-gray-700">
                          {tenant.full_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{tenant.full_name}</div>
                        <div className="text-sm text-gray-500">{tenant.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    Unit A-{tenant.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    $2,500/month
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openModal('viewTenant', tenant)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openModal('editTenant', tenant)}
                        className="text-green-600 hover:text-green-900"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(tenant.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
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
  const ApplicationsManagement = () => {
    const [statusFilter, setStatusFilter] = useState('');
    
    const filteredApplications = applications.filter(app => {
      if (!statusFilter) return true;
      return app.status === statusFilter;
    });
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Applications Management</h2>
          <div className="flex space-x-2">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
            >
              <option value="">All Status ({applications.length})</option>
              <option value="pending">Pending ({applications.filter(app => app.status === 'pending').length})</option>
              <option value="approved">Approved ({applications.filter(app => app.status === 'approved').length})</option>
              <option value="rejected">Rejected ({applications.filter(app => app.status === 'rejected').length})</option>
            </select>
          <button 
            onClick={() => {
              console.log('🔄 Manual refresh of applications triggered');
              fetchApplications();
            }}
            className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            disabled={applicationsLoading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{applicationsLoading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-700"
          >
            <PrinterIcon className="w-5 h-5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Applicant</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Apartment</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {statusFilter ? `No ${statusFilter} applications found` : 'No applications found'}
                  </td>
                </tr>
              ) : (
                filteredApplications.map((application) => (
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
                        <div className="text-sm text-gray-500">{application.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {application.apartment_title || 'N/A'}
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
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      {application.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApplicationAction(application.id, 'approved')}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Approve Application"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <div className="w-4 h-4 border-b-2 border-green-600 rounded-full animate-spin"></div>
                            ) : (
                              <CheckIcon className="w-4 h-4" />
                            )}
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedItem(application);
                              setModalType('rejectApplication');
                              setShowModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            <XMarkIcon className="w-4 h-4" />
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
  };

  // Contact Messages Management Component
  const ContactMessagesManagement = () => {
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replyError, setReplyError] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    
    const handleViewMessage = (message) => {
      setSelectedMessage(message);
      setShowMessageModal(true);
    };
    
    const handleReplyMessage = (message) => {
      setSelectedMessage(message);
      setReplyText('');
      setReplyError('');
      setShowReplyModal(true);
    };
    
    const closeMessageModal = () => {
      setShowMessageModal(false);
      setSelectedMessage(null);
    };
    
    const closeReplyModal = () => {
      setShowReplyModal(false);
      setSelectedMessage(null);
      setReplyText('');
      setReplyError('');
    };
    
    const handleSendReply = async () => {
      if (!replyText.trim()) {
        setReplyError('Reply message is required');
        return;
      }
      
      setIsReplying(true);
      setReplyError('');
      
      try {
        const response = await fetch('http://localhost/Eaglonhytes-main/api/contact.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            action: 'reply',
            message_id: selectedMessage.id,
            reply: replyText
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          showSuccess(`Reply sent successfully to ${selectedMessage.name}`);
          await fetchContactMessages();
          closeReplyModal();
        } else {
          const errorMsg = data.message || 'Failed to send reply';
          setReplyError(errorMsg);
          showError(errorMsg);
        }
      } catch (error) {
        const errorMsg = 'Failed to send reply. Please try again.';
        setReplyError(errorMsg);
        showError(errorMsg);
      } finally {
        setIsReplying(false);
      }
    };
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
          <button 
            onClick={fetchContactMessages}
            className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            disabled={contactMessagesLoading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{contactMessagesLoading ? 'Loading...' : 'Refresh'}</span>
          </button>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Subject</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contactMessagesLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Loading messages...
                    </td>
                  </tr>
                ) : contactMessages.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No contact messages found
                    </td>
                  </tr>
                ) : (
                  contactMessages.map((message) => (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{message.name}</div>
                        {message.phone && (
                          <div className="text-sm text-gray-500">{message.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{message.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{message.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(message.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          message.status === 'new' ? 'bg-red-100 text-red-800' :
                          message.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {message.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewMessage(message)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          {message.status !== 'replied' && (
                            <button 
                              onClick={() => handleReplyMessage(message)}
                              className="text-green-600 hover:text-green-900"
                            >
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
        
        {/* Message Detail Modal */}
        {showMessageModal && selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Message</h3>
                  <button 
                    onClick={closeMessageModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm text-gray-900">{selectedMessage.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedMessage.email}</p>
                    </div>
                  </div>
                  
                  {selectedMessage.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{selectedMessage.phone}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <p className="text-sm text-gray-900">{selectedMessage.subject}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <p className="text-sm text-gray-900 capitalize">{selectedMessage.status}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Received</label>
                      <p className="text-sm text-gray-900">{new Date(selectedMessage.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {selectedMessage.admin_reply && (
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <label className="block text-sm font-medium text-green-900">Admin Reply</label>
                      <p className="mt-1 text-sm text-green-800 whitespace-pre-wrap">{selectedMessage.admin_reply}</p>
                      {selectedMessage.replied_at && (
                        <p className="mt-2 text-xs text-green-600">
                          Replied on {new Date(selectedMessage.replied_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4 border-t">
                    {selectedMessage.status !== 'replied' && (
                      <button 
                        onClick={() => {
                          closeMessageModal();
                          setTimeout(() => handleReplyMessage(selectedMessage), 100);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Reply to Message
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        const mailtoUrl = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`;
                        window.location.href = mailtoUrl;
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Reply via Email
                    </button>
                    
                    {selectedMessage.phone && (
                      <button 
                        onClick={() => {
                          const whatsappUrl = `https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}?text=Hi ${selectedMessage.name}, thank you for contacting us regarding: ${selectedMessage.subject}`;
                          window.open(whatsappUrl, '_blank');
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Reply via WhatsApp
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Reply Modal */}
        {showReplyModal && selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Reply to Message</h3>
                  <button 
                    onClick={closeReplyModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">From: <span className="font-medium text-gray-900">{selectedMessage.name}</span></p>
                  <p className="text-sm text-gray-600">Email: <span className="font-medium text-gray-900">{selectedMessage.email}</span></p>
                  <p className="text-sm text-gray-600 mt-2">Subject: <span className="font-medium text-gray-900">{selectedMessage.subject}</span></p>
                  <p className="text-sm text-gray-600 mt-2">Original Message:</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedMessage.message?.substring(0, 150)}...</p>
                </div>
                
                <div>
                  <label htmlFor="reply_text" className="block mb-2 text-sm font-medium text-gray-700">
                    Your Reply <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="reply_text"
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Type your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    This reply will be sent to {selectedMessage.email}
                  </p>
                </div>
                
                {replyError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{replyError}</p>
                  </div>
                )}
                
                <div className="flex justify-end mt-6 space-x-3">
                  <button
                    onClick={closeReplyModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    disabled={isReplying}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendReply}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                    disabled={isReplying}
                  >
                    {isReplying ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Reports Management Component
  const ReportsManagement = () => {
    // Calculate revenue data from lands
    const calculateRevenueData = () => {
      if (!lands || lands.length === 0) return 0;
      const monthlyRevenue = lands.reduce((total, land) => {
        return total + (parseFloat(land.price || land.rent_price) || 0);
      }, 0);
      return monthlyRevenue;
    };

    // Calculate application status distribution
    const getApplicationStats = () => {
      if (!applications || applications.length === 0) {
        return { pending: 0, approved: 0, rejected: 0, total: 0 };
      }
      
      const statusCounts = applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {});
      
      return {
        pending: statusCounts.pending || 0,
        approved: statusCounts.approved || 0,
        rejected: statusCounts.rejected || 0,
        total: applications.length
      };
    };

    const revenueData = calculateRevenueData();
    const appStats = getApplicationStats();
    
    console.log('📊 Reports Data:', { 
      landsCount: lands?.length || 0, 
      applicationsCount: applications?.length || 0, 
      revenueData, 
      appStats 
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => fetchDashboardData()}
              className="flex items-center px-4 py-2 space-x-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-b-2 border-gray-600 rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              <span>Refresh</span>
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-700"
            >
              <PrinterIcon className="w-5 h-5" />
              <span>Print</span>
            </button>
            <button 
              onClick={() => exportReportsData()}
              className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-green-600">₦{revenueData.toLocaleString()}</p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sold Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {lands.length > 0 ? Math.round((lands.filter(land => land.status === 'sold').length / lands.length) * 100) : 0}%
                </p>
              </div>
              <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                <p className="text-2xl font-bold text-yellow-600">{appStats.pending}</p>
              </div>
              <DocumentTextIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-purple-600">{users.length}</p>
              </div>
              <UserGroupIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Revenue Chart - Real Data Visualization */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Revenue Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                <span className="text-sm font-medium text-gray-700">Available Lands Value</span>
                <span className="text-lg font-bold text-green-600">
                ₦{(lands || []).filter(land => land.status === 'available').reduce((sum, land) => sum + (parseFloat(land.price || land.rent_price) || 0), 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                <span className="text-sm font-medium text-gray-700">Sold Lands Value</span>
                <span className="text-lg font-bold text-blue-600">
                ₦{(lands || []).filter(land => land.status === 'sold').reduce((sum, land) => sum + (parseFloat(land.price || land.rent_price) || 0), 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-sm font-medium text-gray-700">Total Potential Revenue</span>
                <span className="text-lg font-bold text-gray-900">₦{revenueData.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Application Status Distribution - Real Data */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Application Status Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">{appStats.pending}</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-yellow-500 rounded-full" 
                      style={{ width: `${appStats.total > 0 ? (appStats.pending / appStats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Approved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">{appStats.approved}</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-green-500 rounded-full" 
                      style={{ width: `${appStats.total > 0 ? (appStats.approved / appStats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Rejected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">{appStats.rejected}</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-red-500 rounded-full" 
                      style={{ width: `${appStats.total > 0 ? (appStats.rejected / appStats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Applications</span>
                  <span className="text-lg font-bold text-gray-900">{appStats.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top Performing Apartments */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Highest Revenue Lands</h3>
            <div className="space-y-3">
              {lands.length > 0 ? lands
                .sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0))
                .slice(0, 5)
                .map((land, index) => (
                  <div key={land.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{land.title}</p>
                      <p className="text-xs text-gray-500">{land.city}, {land.state}</p>
                    </div>
                    <span className="text-sm font-bold text-green-600">₦{parseFloat(land.price || 0).toLocaleString()}</span>
                  </div>
                )) : (
                  <div className="p-4 text-center text-gray-500">
                    <BuildingOfficeIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No land data available</p>
                  </div>
                )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Applications</h3>
            <div className="space-y-3">
              {applications.length > 0 ? applications
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 5)
                .map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{application.full_name}</p>
                      <p className="text-xs text-gray-500">{application.land_title || application.apartment_title}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {application.status}
                    </span>
                  </div>
                )) : (
                  <div className="p-4 text-center text-gray-500">
                    <DocumentTextIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No applications yet</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Settings Management Component (Profile Settings Only)
  const SettingsManagement = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [showPasswordChange, setShowPasswordChange] = useState(false);

    const handleEditProfile = () => {
      console.log('Edit Profile clicked');
      console.log('Current isEditing state:', isEditing);
      console.log('Profile data:', profile);
      setEditFormData({
        full_name: profile.full_name || '',
        email: profile.email || ''
      });
      setIsEditing(true);
      console.log('Set isEditing to true');
    };


    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        </div>

        <div className="max-w-4xl">
          {/* Profile Information Card */}
          <div className="p-6 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center mb-6 space-x-4">
              <div className="flex items-center justify-center w-20 h-20 overflow-hidden bg-gray-300 rounded-full">
                {profile.profile_picture ? (
                  <img 
                    src={`http://localhost/Eaglonhytes-main/api/uploads/profile_pictures/${profile.profile_picture}`}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-2xl font-medium text-gray-700">
                    {profile.full_name?.charAt(0) || user?.full_name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
                <p className="text-sm text-gray-600">Manage your personal information and account settings</p>
              </div>
            </div>

            {!isEditing ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">User ID</label>
                    <p className="px-3 py-2 text-sm text-gray-900 rounded-lg bg-gray-50">
                      #{profile.id || 'Not available'}
                    </p>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                    <p className="px-3 py-2 text-sm text-gray-900 rounded-lg bg-gray-50">
                      {profile.full_name || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
                    <p className="px-3 py-2 text-sm text-gray-900 rounded-lg bg-gray-50">
                      {profile.email || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                    <p className="px-3 py-2 text-sm text-gray-900 rounded-lg bg-gray-50">
                      {profile.phone || 'Not set'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Account Type</label>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      profile.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {profile.is_admin ? 'Administrator' : 'Regular User'}
                    </span>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Account Status</label>
                    <span className="inline-flex px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                      Active
                    </span>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Member Since</label>
                    <p className="px-3 py-2 text-sm text-gray-900 rounded-lg bg-gray-50">
                      {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Not available'}
                    </p>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="px-3 py-2 text-sm text-gray-900 rounded-lg bg-gray-50">
                      {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                    <input 
                      type="text" 
                      name="full_name"
                      defaultValue={profile.full_name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      defaultValue={profile.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      defaultValue={profile.phone}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Profile Picture</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {imagePreviews.length > 0 && (
                      <div className="mt-2">
                        <img 
                          src={imagePreviews[0]} 
                          alt="Preview" 
                          className="object-cover w-16 h-16 rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center px-6 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setImageFiles([]);
                      setImagePreviews([]);
                    }}
                    className="px-6 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {!isEditing && (
              <div className="flex pt-6 mt-6 space-x-3 border-t border-gray-200">
                <button 
                  onClick={handleEditProfile}
                  className="flex items-center px-6 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
                <button 
                  onClick={() => setShowPasswordChange(true)}
                  className="flex items-center px-6 py-2 space-x-2 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <KeyIcon className="w-4 h-4" />
                  <span>Change Password</span>
                </button>
              </div>
            )}
          </div>

          {/* Password Change Modal */}
          {showPasswordChange && (
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Change Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Current Password</label>
                  <input 
                    type="password" 
                    name="current_password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">New Password</label>
                  <input 
                    type="password" 
                    name="new_password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input 
                    type="password" 
                    name="confirm_password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {isSubmitting ? 'Changing...' : 'Change Password'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowPasswordChange(false)}
                    className="px-6 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Users Management Component
  const UsersManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
        <button 
          onClick={() => openModal('addUser')}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full">
                        <span className="text-sm font-medium text-gray-700">
                          {user.full_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {user.phone || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openModal('viewUser', user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openModal('editUser', user)}
                        className="text-green-600 hover:text-green-900"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
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

  // Content Management Component
  const ContentManagement = () => {
    // Show setup screen if table doesn't exist
    if (!contentTableExists) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">News & Updates</h2>
          </div>
          
          <div className="py-12 text-center">
            <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">Content Management Setup Required</h3>
            <p className="text-gray-600 mb-6">
              The content management system needs to be set up. This will create the necessary database table and add sample content.
            </p>
            <button 
              onClick={setupContentTable}
              disabled={contentLoading}
              className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {contentLoading ? (
                <>
                  <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Setting up...
                </>
              ) : (
                <>
                  <Cog6ToothIcon className="w-5 h-5 mr-2" />
                  Setup Content Management
                </>
              )}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">News & Updates</h2>
          <div className="flex space-x-2">
            <button 
              onClick={fetchContentPosts}
              className="flex items-center px-3 py-2 space-x-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={contentLoading}
            >
              {contentLoading ? (
                <div className="w-4 h-4 border-b-2 border-gray-600 rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
            </button>
            <button 
              onClick={() => openModal('addContent')}
              className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Post</span>
            </button>
          </div>
        </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contentPosts.map((post) => (
          <div key={post.id} className="overflow-hidden transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
            {/* Featured Image/Video Preview */}
            <div className="bg-gray-200 aspect-w-16 aspect-h-9">
              {post.media_items && post.media_items.length > 0 ? (
                <div 
                  className="relative cursor-pointer group"
                  onClick={() => openSlideshow(post.media_items, 0)}
                >
                  {post.media_items[0].type === 'video' ? (
                    <div className="flex items-center justify-center w-full h-48 bg-gray-800">
                      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all"></div>
                      <PlayIcon className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-all" />
                      <div className="absolute bottom-2 right-2 px-2 py-1 text-xs text-white bg-black bg-opacity-60 rounded">
                        {post.media_items.length} media
                      </div>
                    </div>
                  ) : (
                    <>
                      <img 
                        src={post.media_items[0].url?.startsWith('http') 
                          ? post.media_items[0].url 
                          : `http://localhost/Eaglonhytes-main/api/uploads/${post.media_items[0].url}`} 
                        alt={post.title} 
                        className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
                      />
                      {post.media_items.length > 1 && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 text-xs text-white bg-black bg-opacity-60 rounded">
                          +{post.media_items.length - 1} more
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-48 bg-gray-300">
                  <DocumentTextIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  post.category === 'new_lands' ? 'bg-green-100 text-green-800' :
                  post.category === 'company_updates' ? 'bg-blue-100 text-blue-800' :
                  post.category === 'market_insights' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {post.category.replace('_', ' ').toUpperCase()}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  post.status === 'published' ? 'bg-green-100 text-green-800' :
                  post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {post.status}
                </span>
              </div>
              
              <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2">{post.title}</h3>
              <p className="mb-4 text-sm text-gray-600 line-clamp-3">{post.excerpt || post.content.substring(0, 150) + '...'}</p>
              
              <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                <span>By {post.author_name || 'Admin'}</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => openModal('editContent', post)}
                  className="flex-1 px-3 py-2 text-sm text-white transition-colors bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700"
                >
                  Edit
                </button>
                <button 
                  onClick={() => openModal('viewContent', post)}
                  className="flex-1 px-3 py-2 text-sm text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  View
                </button>
                <button 
                  onClick={() => {
                    showConfirmDialog(
                      'Delete Post',
                      'Are you sure you want to delete this post? This action cannot be undone.',
                      () => deleteContentPost(post.id)
                    );
                  }}
                  className="px-3 py-2 text-sm text-red-700 transition-colors bg-red-100 rounded-lg hover:bg-red-200"
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {contentPosts.length === 0 && !contentLoading && (
        <div className="py-12 text-center">
          <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">No content posts yet</h3>
          <p className="text-gray-600 mb-4">Create your first news update or announcement.</p>
          <button 
            onClick={() => openModal('addContent')}
            className="inline-flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add First Post
          </button>
        </div>
      )}
      </div>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'lands':
        return <LandsManagement />;
      case 'tenants':
        return <TenantsManagement />;
      case 'applications':
        return <ApplicationsManagement />;
      case 'users':
        return <UsersManagement />;
      case 'content':
        return <ContentManagement />;
      case 'messages':
        return <ContactMessagesManagement />;
      case 'reports':
        return <ReportsManagement />;
      case 'settings':
        return <SettingsManagement />;
      default:
        return (
          <div className="py-12 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{navigationItems.find(item => item.id === activeTab)?.label}</h2>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        );
    }
  };

  if (!user?.is_admin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 text-gray-600">Admin privileges required.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const Modal = () => {
    console.log('🎭 Modal render - showModal:', showModal, 'modalType:', modalType);
    if (!showModal) return null;

    const renderModalContent = () => {
      console.log('📝 Rendering modal content for type:', modalType);
      switch (modalType) {
        case 'viewApplication':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Application Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Applicant Name</label>
                  <p className="text-sm text-gray-900">{selectedItem?.applicant_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedItem?.applicant_email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">WhatsApp Contact</label>
                  <p className="text-sm text-gray-900">{selectedItem?.whatsapp_contact || 'Not provided'}</p>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">Apartment</label>
                  <p className="text-sm text-gray-900">{selectedItem?.apartment_title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Move-in Date</label>
                  <p className="text-sm text-gray-900">{selectedItem?.move_in_date ? new Date(selectedItem.move_in_date).toLocaleDateString() : 'Not specified'}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                  <p className="text-sm text-gray-900">{selectedItem?.additional_notes || 'No additional notes'}</p>
                </div>
                {selectedItem?.rejection_reason && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
                    <p className="p-3 text-sm text-red-600 rounded-lg bg-red-50">{selectedItem.rejection_reason}</p>
                  </div>
                )}
              </div>
            </div>
          );

        case 'viewApartment':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Property Details</h3>
              
              {/* Apartment Images */}
              {selectedItem?.images && selectedItem.images.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-3 text-sm font-medium text-gray-700">Images</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedItem.images.map((image, index) => (
                      <img 
                        key={index}
                        src={`http://localhost/Eaglonhytes-main/api/uploads/${image}`} 
                        alt={`${selectedItem.title} - Image ${index + 1}`} 
                        className="object-cover w-full h-20 rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <p className="text-sm text-gray-900">{selectedItem?.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedItem?.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedItem?.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="text-sm text-gray-900">{selectedItem?.address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <p className="text-sm text-gray-900">{selectedItem?.city}, {selectedItem?.state}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <p className="text-sm text-gray-900">₦{Number(selectedItem?.price || selectedItem?.rent_price).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Available Date</label>
                  <p className="text-sm text-gray-900">{selectedItem?.available_date || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parking</label>
                  <p className="text-sm text-gray-900">{selectedItem?.parking || 'Not specified'}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900">{selectedItem?.description}</p>
                </div>
                {selectedItem?.amenities && selectedItem.amenities.length > 0 && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Amenities</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedItem.amenities.map((amenity, index) => (
                        <span key={index} className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );

        case 'addLand':
        case 'editLand':
        case 'addApartment':
        case 'editApartment':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                {(modalType === 'addLand' || modalType === 'addApartment') ? 'Add New Land' : 'Edit Land'}
              </h3>
              
              <LandForm
                key={selectedItem?.id || 'new-land'}
                mode={modalType === 'addLand' || modalType === 'addApartment' ? 'add' : 'edit'}
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


        case 'addTenant':
        case 'editTenant':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                {modalType === 'addTenant' ? 'Add New Tenant' : 'Edit Tenant'}
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
                  <input 
                    type="text" 
                    name="full_name"
                    defaultValue={selectedItem?.full_name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Tenant full name"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    defaultValue={selectedItem?.email || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Tenant email"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    defaultValue={selectedItem?.phone || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Tenant phone number"
                  />
                </div>
                <div className="flex justify-end mt-6 space-x-3">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    {modalType === 'addTenant' ? 'Add Tenant' : 'Update Tenant'}
                  </button>
                </div>
              </form>
            </div>
          );

        case 'viewTenant':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Tenant Details</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-300 rounded-full">
                    <span className="text-xl font-medium text-gray-700">
                      {selectedItem?.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedItem?.full_name}</h4>
                    <p className="text-sm text-gray-500">{selectedItem?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{selectedItem?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Unit</label>
                    <p className="text-sm text-gray-900">Unit A-{selectedItem?.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rent</label>
                    <p className="text-sm text-gray-900">$2,500/month</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );



        case 'changePassword':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Change Password</h3>
              {formErrors.general && (
                <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
                  {formErrors.general}
                </div>
              )}
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Current Password</label>
                  <input 
                    type="password" 
                    name="current_password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                  <input 
                    type="password" 
                    name="new_password"
                    className={`w-full px-3 py-2 border rounded-lg ${
                      formErrors.new_password ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="Enter new password"
                    required
                  />
                  {formErrors.new_password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.new_password}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input 
                    type="password" 
                    name="confirm_password"
                    className={`w-full px-3 py-2 border rounded-lg ${
                      formErrors.confirm_password ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                    required
                  />
                  {formErrors.confirm_password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.confirm_password}</p>
                  )}
                </div>
                <div className="flex justify-end mt-6 space-x-3">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          );

        case 'editProfile':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Edit Profile</h3>
              {formErrors.general && (
                <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
                  {formErrors.general}
                </div>
              )}
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
                  <input 
                    type="text" 
                    name="full_name"
                    defaultValue={profile.full_name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    defaultValue={profile.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    defaultValue={profile.phone}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Profile Picture</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setImageFiles(files);
                      
                      // Create previews
                      const previews = files.map(file => URL.createObjectURL(file));
                      setImagePreviews(previews);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  {formErrors.image && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.image}</p>
                  )}
                  
                  {/* Current profile picture */}
                  {profile.profile_picture && !imagePreviews.length && (
                    <div className="mt-2">
                      <p className="mb-2 text-sm text-gray-600">Current profile picture:</p>
                      <img 
                        src={`http://localhost/Eaglonhytes-main/api/uploads/profile_pictures/${profile.profile_picture}`}
                        alt="Current profile"
                        className="object-cover w-20 h-20 rounded-full"
                      />
                    </div>
                  )}
                  
                  {/* New image preview */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-2">
                      <p className="mb-2 text-sm text-gray-600">New profile picture:</p>
                      <img 
                        src={imagePreviews[0]}
                        alt="New profile preview"
                        className="object-cover w-20 h-20 rounded-full"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end mt-6 space-x-3">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            </div>
          );

        case 'addUser':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Add New User</h3>
              
              {formErrors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{formErrors.general}</p>
                </div>
              )}
              
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="full_name"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.full_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                  />
                  {formErrors.full_name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.full_name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="password" 
                    name="password"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter password (min 6 characters)"
                  />
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Phone (Optional)</label>
                  <input 
                    type="text" 
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number (optional)"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Role</label>
                  <select 
                    name="role"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="user"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className="flex justify-end mt-6 space-x-3">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Adding User...' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          );

        case 'editUser':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Edit User</h3>
              <form onSubmit={handleEditUser} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
                  <input 
                    type="text" 
                    name="full_name"
                    defaultValue={selectedItem?.full_name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="User full name"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    defaultValue={selectedItem?.email || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="User email"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    defaultValue={selectedItem?.phone || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="User phone number"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Password <span className="text-gray-400 text-xs">(leave blank to keep current password)</span>
                  </label>
                  <input 
                    type="password" 
                    name="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="New password (optional)"
                    minLength="6"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Role</label>
                  <select 
                    name="role"
                    defaultValue={selectedItem?.is_admin ? 'admin' : 'user'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end mt-6 space-x-3">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Update User
                  </button>
                </div>
              </form>
            </div>
          );

        case 'viewUser':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">User Details</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-300 rounded-full">
                    <span className="text-xl font-medium text-gray-700">
                      {selectedItem?.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedItem?.full_name}</h4>
                    <p className="text-sm text-gray-500">{selectedItem?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{selectedItem?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <p className="text-sm text-gray-900">{selectedItem?.is_admin ? 'Admin' : 'User'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created</label>
                    <p className="text-sm text-gray-900">{new Date(selectedItem?.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );

        case 'approveApplication':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Approve Application</h3>
              <div className="p-4 mb-6 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center">
                  <CheckIcon className="w-5 h-5 mr-2 text-green-600" />
                  <p className="text-sm text-green-800">
                    You are about to approve this application. An email notification will be sent to the applicant.
                  </p>
                </div>
              </div>
              
              {/* Applicant Information Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Applicant Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-sm text-gray-900 font-medium">{selectedItem?.applicant_name || selectedItem?.user_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <p className="text-sm text-gray-900">{selectedItem?.applicant_email || selectedItem?.user_email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">WhatsApp Contact</label>
                    <p className="text-sm text-gray-900">{selectedItem?.whatsapp_contact || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                    <p className="text-sm text-gray-900">#{selectedItem?.user_id}</p>
                  </div>
                </div>
              </div>

              {/* Property Information Section */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Property Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Property Title</label>
                    <p className="text-sm text-gray-900 font-medium">{selectedItem?.land_title || selectedItem?.apartment_title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Property ID</label>
                    <p className="text-sm text-gray-900">#{selectedItem?.land_id}</p>
                  </div>
                </div>
              </div>

              {/* Application Details Section */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Application Details
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Desired Purchase Date</label>
                      <p className="text-sm text-gray-900">{selectedItem?.move_in_date ? new Date(selectedItem.move_in_date).toLocaleDateString() : 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Employment Status</label>
                      <p className="text-sm text-gray-900">{selectedItem?.employment_status || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Annual Income</label>
                      <p className="text-sm text-gray-900 font-medium text-green-600">
                        {selectedItem?.annual_income ? `₦${Number(selectedItem.annual_income).toLocaleString()}` : 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Application Date</label>
                      <p className="text-sm text-gray-900">{selectedItem?.created_at ? new Date(selectedItem.created_at).toLocaleDateString() : 'Not available'}</p>
                    </div>
                  </div>
                  
                  {selectedItem?.reference_contacts && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reference Contacts</label>
                      <div className="p-3 bg-white rounded border">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedItem.reference_contacts}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedItem?.additional_notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                      <div className="p-3 bg-white rounded border">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedItem.additional_notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 mb-6 border border-yellow-200 rounded-lg bg-yellow-50">
                <div className="flex items-start">
                  <CurrencyDollarIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Payment Information</p>
                    <p className="mt-1 text-sm text-yellow-700">
                      The approval email will inform the tenant that payment will be done directly at the apartment location.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleApplicationAction(selectedItem.id, 'approved')}
                  className="flex items-center px-4 py-2 space-x-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  <CheckIcon className="w-4 h-4" />
                  <span>{isSubmitting ? 'Approving...' : 'Approve & Send Email'}</span>
                </button>
              </div>
            </div>
          );

        case 'rejectApplication':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Reject Application</h3>
              <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-red-600" />
                  <p className="text-sm text-red-800">
                    You are about to reject this application. An email notification will be sent to the applicant.
                  </p>
                </div>
              </div>
              
              {/* Applicant Information Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Applicant Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-sm text-gray-900 font-medium">{selectedItem?.applicant_name || selectedItem?.user_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <p className="text-sm text-gray-900">{selectedItem?.applicant_email || selectedItem?.user_email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">WhatsApp Contact</label>
                    <p className="text-sm text-gray-900">{selectedItem?.whatsapp_contact || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                    <p className="text-sm text-gray-900">#{selectedItem?.user_id}</p>
                  </div>
                </div>
              </div>

              {/* Property Information Section */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Property Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Property Title</label>
                    <p className="text-sm text-gray-900 font-medium">{selectedItem?.land_title || selectedItem?.apartment_title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Property ID</label>
                    <p className="text-sm text-gray-900">#{selectedItem?.land_id}</p>
                  </div>
                </div>
              </div>

              {/* Application Details Section */}
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Application Details
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Desired Purchase Date</label>
                      <p className="text-sm text-gray-900">{selectedItem?.move_in_date ? new Date(selectedItem.move_in_date).toLocaleDateString() : 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Employment Status</label>
                      <p className="text-sm text-gray-900">{selectedItem?.employment_status || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Annual Income</label>
                      <p className="text-sm text-gray-900 font-medium text-green-600">
                        {selectedItem?.annual_income ? `₦${Number(selectedItem.annual_income).toLocaleString()}` : 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Application Date</label>
                      <p className="text-sm text-gray-900">{selectedItem?.created_at ? new Date(selectedItem.created_at).toLocaleDateString() : 'Not available'}</p>
                    </div>
                  </div>
                  
                  {selectedItem?.reference_contacts && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reference Contacts</label>
                      <div className="p-3 bg-white rounded border">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedItem.reference_contacts}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedItem?.additional_notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                      <div className="p-3 bg-white rounded border">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedItem.additional_notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const rejectionReason = formData.get('rejection_reason');
                handleApplicationAction(selectedItem.id, 'rejected', rejectionReason);
              }}>
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Reason for Rejection *
                  </label>
                  <textarea
                    name="rejection_reason"
                    rows="4"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Please provide a clear reason for rejecting this application. This will be included in the email to the applicant."
                  ></textarea>
                  <p className="mt-1 text-xs text-gray-500">
                    This reason will be included in the rejection email sent to the applicant.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex items-center px-4 py-2 space-x-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                    disabled={isSubmitting}
                  >
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    <span>{isSubmitting ? 'Rejecting...' : 'Reject & Send Email'}</span>
                  </button>
                </div>
              </form>
            </div>
          );

        case 'addContent':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Add New Content Post</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter post title..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="news">News</option>
                      <option value="new_lands">New Lands</option>
                      <option value="company_updates">Company Updates</option>
                      <option value="market_insights">Market Insights</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description for preview..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write your content here..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="tag1, tag2, tag3..."
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
                    Featured Post
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implement save functionality
                      setShowModal(false);
                    }}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Post
                  </button>
                </div>
              </div>
            </div>
          );

        case 'editContent':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Edit Content Post</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    defaultValue={selectedItem?.title}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter post title..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                      defaultValue={selectedItem?.category}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="news">News</option>
                      <option value="new_lands">New Lands</option>
                      <option value="company_updates">Company Updates</option>
                      <option value="market_insights">Market Insights</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                      defaultValue={selectedItem?.status}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                  <textarea
                    rows={2}
                    defaultValue={selectedItem?.excerpt}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description for preview..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    rows={6}
                    defaultValue={selectedItem?.content}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write your content here..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input
                    type="text"
                    defaultValue={selectedItem?.tags}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="tag1, tag2, tag3..."
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured-edit"
                    defaultChecked={selectedItem?.featured}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="featured-edit" className="ml-2 text-sm font-medium text-gray-700">
                    Featured Post
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implement update functionality
                      setShowModal(false);
                    }}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Post
                  </button>
                </div>
              </div>
            </div>
          );

        case 'viewContent':
          return (
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">View Content Post</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedItem?.title}</h4>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedItem?.category === 'new_lands' ? 'bg-green-100 text-green-800' :
                      selectedItem?.category === 'company_updates' ? 'bg-blue-100 text-blue-800' :
                      selectedItem?.category === 'market_insights' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedItem?.category?.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedItem?.status === 'published' ? 'bg-green-100 text-green-800' :
                      selectedItem?.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedItem?.status?.toUpperCase()}
                    </span>
                    {selectedItem?.featured && (
                      <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                        FEATURED
                      </span>
                    )}
                  </div>
                </div>
                
                {selectedItem?.excerpt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                    <p className="text-gray-600 italic">{selectedItem.excerpt}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <div className="prose max-w-none">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedItem?.content}</p>
                  </div>
                </div>
                
                {selectedItem?.tags && typeof selectedItem.tags === 'string' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.split(',').map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created</label>
                    <p className="text-sm text-gray-600">
                      {selectedItem?.created_at ? new Date(selectedItem.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Views</label>
                    <p className="text-sm text-gray-600">{selectedItem?.views || 0}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setModalType('editContent');
                      // Keep the modal open, just switch to edit mode
                    }}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Post
                  </button>
                </div>
              </div>
            </div>
          );

        default:
          return (
            <div className="p-6">
              <p className="text-gray-500">Modal content not found</p>
            </div>
          );
      }
    };

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalType === 'viewApplication' && 'Application Details'}
                {modalType === 'approveApplication' && 'Approve Application'}
                {modalType === 'rejectApplication' && 'Reject Application'}
                {(modalType === 'addLand' || modalType === 'addApartment') && 'Add Land'}
                {(modalType === 'editLand' || modalType === 'editApartment') && 'Edit Land'}
                {(modalType === 'viewLand' || modalType === 'viewApartment') && 'Land Details'}
                {modalType === 'addTenant' && 'Add Tenant'}
                {modalType === 'editTenant' && 'Edit Tenant'}
                {modalType === 'viewTenant' && 'Tenant Details'}
                {modalType === 'changePassword' && 'Change Password'}
                {modalType === 'addUser' && 'Add User'}
                {modalType === 'editUser' && 'Edit User'}
                {modalType === 'viewUser' && 'User Details'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            {renderModalContent()}
          </div>
        </div>
      </div>
    );
  };



  // Export functionality for reports
  const exportReportsData = () => {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Prepare data for export
      const exportData = {
        reportDate: currentDate,
        summary: {
          totalLands: lands.length,
          availableLands: lands.filter(land => land.status === 'available').length,
          soldLands: lands.filter(land => land.status === 'sold').length,
          totalUsers: users.length,
          totalApplications: applications.length,
          pendingApplications: applications.filter(app => app.status === 'pending').length,
          approvedApplications: applications.filter(app => app.status === 'approved').length,
          rejectedApplications: applications.filter(app => app.status === 'rejected').length,
          totalRevenue: lands.reduce((sum, land) => sum + (parseFloat(land.price || land.rent_price) || 0), 0)
        },
        lands: lands.map(land => ({
          id: land.id,
          title: land.title,
          address: land.address,
          city: land.city,
          state: land.state,
          price: land.price || land.rent_price,
          status: land.status,
          size: land.size
        })),
        applications: applications.map(app => ({
          id: app.id,
          applicant_name: app.full_name,
          email: app.email,
          land_title: app.land_title,
          status: app.status,
          created_at: app.created_at
        }))
      };
      
      // Convert to CSV format
      const csvContent = convertToCSV(exportData);
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `eaglonhytes-report-${currentDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess('Report exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      showError('Failed to export report');
    }
  };

  // Helper function to convert data to CSV
  const convertToCSV = (data) => {
    let csv = 'Eaglonhytes Land Sales Report\n';
    csv += `Report Date: ${data.reportDate}\n\n`;
    
    // Summary section
    csv += 'SUMMARY\n';
    csv += 'Metric,Value\n';
    csv += `Total Lands,${data.summary.totalLands}\n`;
    csv += `Available Lands,${data.summary.availableLands}\n`;
    csv += `Sold Lands,${data.summary.soldLands}\n`;
    csv += `Total Users,${data.summary.totalUsers}\n`;
    csv += `Total Applications,${data.summary.totalApplications}\n`;
    csv += `Pending Applications,${data.summary.pendingApplications}\n`;
    csv += `Approved Applications,${data.summary.approvedApplications}\n`;
    csv += `Rejected Applications,${data.summary.rejectedApplications}\n`;
    csv += `Total Revenue,₦${data.summary.totalRevenue.toLocaleString()}\n\n`;
    
    // Lands section
    csv += 'LANDS INVENTORY\n';
    csv += 'ID,Title,Address,City,State,Price,Status,Size\n';
    data.lands.forEach(land => {
      csv += `${land.id},"${land.title}","${land.address}",${land.city},${land.state},${land.price},${land.status},${land.size}\n`;
    });
    
    csv += '\n';
    
    // Applications section
    csv += 'APPLICATIONS\n';
    csv += 'ID,Applicant Name,Email,Land Title,Status,Application Date\n';
    data.applications.forEach(app => {
      csv += `${app.id},"${app.applicant_name}",${app.email},"${app.land_title}",${app.status},${app.created_at}\n`;
    });
    
    return csv;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Toast Notifications */}
      <ToastNotifications />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <img style={{ width: "60px", height: "60px" }} src="/assets/icon/logo.png" alt="Eaglonhytes" />
              <span className="text-xl font-bold text-gray-900">Eaglonhytes</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <XMarkIcon className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          <div className="flex items-center justify-center">
            <span className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
              Super Admin Access
            </span>
          </div>
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
                className={`w-full flex items-center px-3 py-2 mt-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-500 hover:text-gray-600 lg:hidden"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome Super Admin, {user?.full_name?.split(' ')[0] || 'Admin'}!
                </h1>
                <p className="text-sm text-gray-600">You have full system control. Here's what's happening with your land sales today.</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                  className="relative p-2 text-gray-400 transition-colors hover:text-gray-500"
                >
                  <BellIcon className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full -top-1 -right-1">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotificationDropdown && (
                  <div className="absolute right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-80">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="overflow-y-auto max-h-96">
                      {systemNotifications.length > 0 ? (
                        systemNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => {
                              console.log('🔔 Notification clicked:', notification);
                              console.log('📍 Redirect to:', notification.redirect_to);
                              
                              if (notification.is_read === 0) {
                                markNotificationAsRead(notification.id);
                              }
                              
                              // Handle redirect based on notification type
                              if (notification.redirect_to) {
                                // If it starts with /, it's a route - use navigate
                                if (notification.redirect_to.startsWith('/')) {
                                  console.log('🚀 Navigating to route:', notification.redirect_to);
                                  navigate(notification.redirect_to);
                                } else {
                                  // Otherwise it's a tab name - switch tabs
                                  console.log('📑 Switching to tab:', notification.redirect_to);
                                  setActiveTab(notification.redirect_to);
                                }
                              } else {
                                console.log('⚠️ No redirect_to value found');
                              }
                              
                              setShowNotificationDropdown(false);
                            }}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                              notification.is_read === 0 ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                                notification.type === 'success' ? 'bg-green-500' :
                                notification.type === 'info' ? 'bg-blue-500' :
                                notification.type === 'warning' ? 'bg-yellow-500' :
                                notification.type === 'error' ? 'bg-red-500' :
                                'bg-gray-500'
                              }`}></div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className={`text-sm font-medium ${
                                    notification.is_read === 0 ? 'text-gray-900' : 'text-gray-700'
                                  }`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(notification.created_at).toLocaleTimeString()}
                                  </p>
                                </div>
                                <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <BellIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500">No notifications</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  className="flex items-center p-2 space-x-3 rounded-lg hover:bg-gray-50"
                >
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

      {/* Media Slideshow */}
      <MediaSlideshow
        mediaItems={slideshowMedia}
        isOpen={showSlideshow}
        onClose={closeSlideshow}
        initialIndex={slideshowIndex}
      />
    </div>
  );
};

export default SuperAdminDashboard;