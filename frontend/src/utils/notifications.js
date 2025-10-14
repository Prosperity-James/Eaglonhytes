// Centralized notification/toast system

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Default notification configuration
const DEFAULT_CONFIG = {
  duration: 3000, // 3 seconds
  position: 'top-right',
  showCloseButton: true,
};

// Create a notification manager
class NotificationManager {
  constructor() {
    this.notifications = [];
    this.listeners = [];
    this.nextId = 1;
  }

  // Add a listener for notification changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of changes
  notify() {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  // Show a notification
  show(message, type = NOTIFICATION_TYPES.INFO, config = {}) {
    const notification = {
      id: this.nextId++,
      message,
      type,
      timestamp: Date.now(),
      ...DEFAULT_CONFIG,
      ...config,
    };

    this.notifications.push(notification);
    this.notify();

    // Auto-remove after duration
    if (notification.duration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, notification.duration);
    }

    return notification.id;
  }

  // Remove a notification
  remove(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notify();
  }

  // Clear all notifications
  clear() {
    this.notifications = [];
    this.notify();
  }

  // Convenience methods
  success(message, config = {}) {
    return this.show(message, NOTIFICATION_TYPES.SUCCESS, config);
  }

  error(message, config = {}) {
    return this.show(message, NOTIFICATION_TYPES.ERROR, { duration: 5000, ...config });
  }

  warning(message, config = {}) {
    return this.show(message, NOTIFICATION_TYPES.WARNING, { duration: 4000, ...config });
  }

  info(message, config = {}) {
    return this.show(message, NOTIFICATION_TYPES.INFO, config);
  }
}

// Create global notification manager instance
export const notificationManager = new NotificationManager();

// Convenience functions for direct use
export const showNotification = (message, type, config) => 
  notificationManager.show(message, type, config);

export const showSuccess = (message, config) => 
  notificationManager.success(message, config);

export const showError = (message, config) => 
  notificationManager.error(message, config);

export const showWarning = (message, config) => 
  notificationManager.warning(message, config);

export const showInfo = (message, config) => 
  notificationManager.info(message, config);

// React hook is available in ../hooks/useNotifications.js

export default notificationManager;
