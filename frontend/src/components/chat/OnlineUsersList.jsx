import React from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Circle } from 'lucide-react';
import { getStatusIndicatorClass, formatLastSeen, getUserStatus } from '../../utils/helper.js';
import Avatar from '../common/Avatar.jsx';

export default function OnlineUsersList({ showTitle = true, maxVisible = 10 }) {
  const { onlineUsers, userStatuses, connected } = useSelector((state) => state.socket);
  const { user: currentUser } = useSelector((state) => state.auth);

  // Filter out current user from online users
  const otherOnlineUsers = onlineUsers.filter(user => 
    (user._id !== currentUser?._id && user.id !== currentUser?.id)
  );

  // Limit the number of visible users
  const displayUsers = otherOnlineUsers.slice(0, maxVisible);
  const hasMoreUsers = otherOnlineUsers.length > maxVisible;

  if (!connected || onlineUsers.length === 0) {
    return null;
  }

  return (
    <div className="bg-dark-surface rounded-lg p-4">
      {showTitle && (
        <div className="flex items-center gap-2 mb-3">
          <Users size={16} className="text-dark-text-muted" />
          <h3 className="text-sm font-medium text-dark-text">
            Online Users ({otherOnlineUsers.length})
          </h3>
        </div>
      )}

      <div className="space-y-2">
        <AnimatePresence>
          {displayUsers.map((user) => {
            const userId = user._id || user.id;
            const userStatus = getUserStatus(userId, userStatuses);
            const statusClass = getStatusIndicatorClass(userStatus);
            
            return (
              <motion.div
                key={userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-surface-alt transition-colors cursor-pointer"
              >
                {/* Avatar with status indicator */}
                <div className="relative flex-shrink-0">
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    fallback="👤"
                    size="sm"
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${statusClass} rounded-full border border-dark-surface`}
                    title={`${userStatus.charAt(0).toUpperCase() + userStatus.slice(1)}`}
                  />
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark-text truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-dark-text-muted">
                    {userStatus === 'online' ? 'Active now' : `Last seen ${formatLastSeen(userStatuses[userId]?.lastSeen)}`}
                  </p>
                </div>

                {/* Status dot */}
                <div className={`w-2 h-2 ${statusClass} rounded-full`} />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {hasMoreUsers && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-2"
          >
            <button className="text-xs text-primary hover:text-primary/80 transition-colors">
              +{otherOnlineUsers.length - maxVisible} more users
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Compact version for sidebar
export function CompactOnlineUsersList() {
  const { onlineUsers, userStatuses, connected } = useSelector((state) => state.socket);
  const { user: currentUser } = useSelector((state) => state.auth);

  const otherOnlineUsers = onlineUsers.filter(user => 
    (user._id !== currentUser?._id && user.id !== currentUser?.id)
  );

  if (!connected || otherOnlineUsers.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-2 border-t border-dark-border">
      <div className="flex items-center gap-2 mb-2">
        <Circle size={8} className="text-success fill-current" />
        <span className="text-xs text-dark-text-muted">
          {otherOnlineUsers.length} online
        </span>
      </div>
      
      <div className="flex -space-x-2">
        {otherOnlineUsers.slice(0, 5).map((user) => {
          const userId = user._id || user.id;
          const userStatus = getUserStatus(userId, userStatuses);
          const statusClass = getStatusIndicatorClass(userStatus);
          
          return (
            <div key={userId} className="relative">
              <Avatar
                src={user.avatar}
                alt={user.name}
                fallback="👤"
                size="xs"
                className="border-2 border-dark-surface"
              />
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 ${statusClass} rounded-full border border-dark-surface`}
              />
            </div>
          );
        })}
        
        {otherOnlineUsers.length > 5 && (
          <div className="flex items-center justify-center w-6 h-6 bg-dark-surface-alt border-2 border-dark-surface rounded-full text-xs text-dark-text-muted">
            +{otherOnlineUsers.length - 5}
          </div>
        )}
      </div>
    </div>
  );
}
