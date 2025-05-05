import React, { useState, useEffect } from 'react';
import '../styles/notification.css';

const Notification = ({ message, duration = 3000, isVisible, onClose }) => {
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    setVisible(isVisible);
    
    if (isVisible && duration) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!visible) return null;

  return (
    <div className="notification-container">
      <div className="notification-message">
        {message}
      </div>
    </div>
  );
};

export const showNotification = (() => {
  let notificationRoot = null;
  let notificationTimeout = null;
  
  return (message, duration = 3000) => {
    if (!notificationRoot) {
      notificationRoot = document.createElement('div');
      notificationRoot.id = 'notification-root';
      document.body.appendChild(notificationRoot);
    }
    
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }

    const notification = document.createElement('div');
    notification.className = 'notification-container';
    notification.innerHTML = `<div class="notification-message">${message}</div>`;
    
    notificationRoot.innerHTML = '';
    notificationRoot.appendChild(notification);

    notificationTimeout = setTimeout(() => {
      if (notificationRoot.contains(notification)) {
        notificationRoot.removeChild(notification);
      }
    }, duration);
  };
})();

export default Notification;