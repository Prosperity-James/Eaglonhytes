import { useState, useEffect } from 'react';
import { notificationManager } from '../utils/notifications.js';

// React hook for using notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  return {
    notifications,
    show: notificationManager.show.bind(notificationManager),
    success: notificationManager.success.bind(notificationManager),
    error: notificationManager.error.bind(notificationManager),
    warning: notificationManager.warning.bind(notificationManager),
    info: notificationManager.info.bind(notificationManager),
    remove: notificationManager.remove.bind(notificationManager),
    clear: notificationManager.clear.bind(notificationManager),
  };
};
