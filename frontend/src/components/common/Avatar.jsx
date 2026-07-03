import React from 'react';
import { useUserPresence } from '../../hooks/useUserPresence';
import { getStatusIndicatorClass } from '../../utils/helper';

const Avatar = ({
  src,
  alt = 'Avatar',
  size = 'w-10 h-10',
  rounded = 'rounded-lg',
  fallback = '👤',
  className = '',
  userId = null,
  showStatus = false,
  isOnline: isOnlineProp = null,
  status: statusProp = null,
}) => {
  const [imageError, setImageError] = React.useState(false);
  const { isOnline: isOnlinePresence, status: presenceStatus } = useUserPresence(userId);

  const isOnline = isOnlineProp !== null ? isOnlineProp : isOnlinePresence;
  const status = statusProp !== null ? statusProp : presenceStatus;

  const renderContent = () => {
    if (!src || imageError) {
      return (
        <div
          className={`${size} ${rounded} bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg ${className}`}
        >
          {fallback}
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        onError={() => setImageError(true)}
        className={`${size} ${rounded} object-cover ${className}`}
      />
    );
  };

  if (showStatus && (userId || isOnlineProp !== null)) {
    const statusDotClass = getStatusIndicatorClass(status);
    return (
      <div className="relative flex-shrink-0">
        {renderContent()}
        {isOnline && (
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 ${statusDotClass} rounded-full border-2 border-dark-surface`}
            title={status.charAt(0).toUpperCase() + status.slice(1)}
          />
        )}
      </div>
    );
  }

  return renderContent();
};

export default Avatar;