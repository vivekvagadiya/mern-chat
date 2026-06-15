export const formatChatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  const diffDays = Math.floor(
    (now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24)
  );

  if (diffDays < 7) {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
    });
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

export const getTimeStamp = (dateString) => {
  const date = new Date(dateString);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday =
    date.toDateString() === today.toDateString();

  const isYesterday =
    date.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year:
      date.getFullYear() !== today.getFullYear()
        ? 'numeric'
        : undefined,
  });
};

// User presence utility functions
export const isUserOnline = (userId, onlineUsers, userStatuses) => {
  // Check if user is in online users list
  const isOnline = onlineUsers.some(user => (user._id === userId || user.id === userId));
  
  // Also check user statuses for more detailed information
  const userStatus = userStatuses[userId];
  
  return isOnline || (userStatus && userStatus.isOnline);
};

export const getUserStatus = (userId, userStatuses) => {
  const userStatus = userStatuses[userId];
  return userStatus ? userStatus.status : 'offline';
};

export const getUserLastSeen = (userId, userStatuses) => {
  const userStatus = userStatuses[userId];
  return userStatus ? userStatus.lastSeen : null;
};

export const getStatusIndicatorClass = (status) => {
  const statusClasses = {
    online: 'bg-success',
    away: 'bg-warning',
    busy: 'bg-danger',
    offline: 'bg-dark-text-muted',
  };
  return statusClasses[status] || statusClasses.offline;
};

export const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return 'Never';
  
  const date = new Date(lastSeen);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};