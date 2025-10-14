import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BellIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost/Eaglonhytes/api/notifications.php', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch('http://localhost/Eaglonhytes/api/notifications.php', {
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

  const markAllAsRead = async () => {
    try {
      const response = await fetch('http://localhost/Eaglonhytes/api/notifications.php', {
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

  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch('http://localhost/Eaglonhytes/api/notifications.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: 'delete',
          notification_id: notificationId
        })
      });
      const data = await response.json();
      if (data.success) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
      case 'error':
        return <ExclamationCircleIcon className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <ExclamationCircleIcon className="w-6 h-6 text-yellow-600" />;
      default:
        return <InformationCircleIcon className="w-6 h-6 text-blue-600" />;
    }
  };

  const getNotificationBgColor = (type, isRead) => {
    if (isRead) return 'bg-gray-50';
    switch (type) {
      case 'success':
        return 'bg-green-50 border-l-4 border-green-500';
      case 'error':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'warning':
        return 'bg-yellow-50 border-l-4 border-yellow-500';
      default:
        return 'bg-blue-50 border-l-4 border-blue-500';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return notif.is_read === 0;
    if (filter === 'read') return notif.is_read === 1;
    return true;
  });

  const unreadCount = notifications.filter(n => n.is_read === 0).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-amber-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg hover:from-amber-600 hover:to-yellow-600 shadow-md"
              >
                Mark All as Read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'unread' 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'read' 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Read ({notifications.length - unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <BellIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No {filter !== 'all' ? filter : ''} notifications
              </h3>
              <p className="text-gray-600">
                {filter === 'unread' 
                  ? "You're all caught up!" 
                  : "You don't have any notifications yet"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg ${
                  getNotificationBgColor(notification.type, notification.is_read)
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {new Date(notification.created_at).toLocaleString()}
                        </span>
                        {notification.is_read === 0 && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm font-medium text-amber-600 hover:text-amber-700"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
