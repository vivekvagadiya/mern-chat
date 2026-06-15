import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Pin, Star, MoreVertical } from 'lucide-react';
import { getTimeAgo } from '../../mock/data.js';
import { toggleFavorite } from '../../store/slices/chatSlice.js';
import { formatChatDate, isUserOnline, getUserStatus, getStatusIndicatorClass, formatLastSeen } from '../../utils/helper.js';
import Avatar from '../common/Avatar.jsx';

export default function ConversationItem({ conversation }) {
  const dispatch = useDispatch();
  const currentConversationId = useSelector((state) => state.chat.currentConversationId);
  const { onlineUsers, userStatuses } = useSelector((state) => state.socket);
  const isActive = conversation._id === currentConversationId;
  const [showActions, setShowActions] = React.useState(false);

  // Get user online status for direct conversations
  const isUserOnlineStatus = conversation.type === 'direct' && conversation.participants?.length > 0
    ? isUserOnline(conversation.participants[0]._id, onlineUsers, userStatuses)
    : false;

  const userStatus = conversation.type === 'direct' && conversation.participants?.length > 0
    ? getUserStatus(conversation.participants[0]._id, userStatuses)
    : 'offline';

  const getStatusIndicator = (status) => {
    return getStatusIndicatorClass(status);
  };

  return (
    <motion.div
      className={`relative group mb-1.5 rounded-lg cursor-pointer transition-all ${
        isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-dark-surface-alt'
      }`}
      whileHover={{ x: 4 }}
    >
      <div className="p-3 flex items-start gap-3">
        {/* Avatar & Status */}
        <div className="relative flex-shrink-0">
          <Avatar
            src={conversation.type === 'direct' ? conversation.avatar : conversation.groupAvatar}
            alt={conversation.displayName}
            fallback={conversation.type === 'group' ? '👥' : '👤'}
          />
          {conversation.type === 'direct' && isUserOnlineStatus && (
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusIndicator(userStatus)} rounded-full border border-dark-surface`}
              title={`${userStatus.charAt(0).toUpperCase() + userStatus.slice(1)}`}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 mb-0.5">
            <h3
              className={`font-medium text-sm truncate ${isActive ? 'text-primary' : 'text-dark-text'}`}
            >
              {conversation.name}
            </h3>
            <span className="text-xs text-dark-text-muted flex-shrink-0">
              {formatChatDate(conversation.updatedAt)}
            </span>
          </div>

          <p className="text-xs text-dark-text-muted truncate">
            {conversation?.lastMessage?.content || 'No messages yet'}
          </p>
        </div>

        {/* Unread Badge */}
        {/* {conversation.unread > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white"
          >
            {conversation.unread}
          </motion.div>
        )} */}
      </div>

      {/* Hover Actions */}
      {/* <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={showActions || isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
        transition={{ duration: 0.15 }}
        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(togglePinned(conversation._id));
          }}
          className={`p-1.5 rounded transition-colors ${
            conversation.isPinned
              ? 'text-primary bg-primary/10'
              : 'text-dark-text-muted hover:bg-dark-surface-2'
          }`}
        >
          <Pin size={14} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(toggleFavorite(conversation.id));
          }}
          className={`p-1.5 rounded transition-colors ${
            conversation.isFavorite
              ? 'text-accent bg-accent/10'
              : 'text-dark-text-muted hover:bg-dark-surface-2'
          }`}
        >
          <Star size={14} fill={conversation.isFavorite ? 'currentColor' : 'none'} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-1.5 rounded text-dark-text-muted hover:bg-dark-surface-2 transition-colors"
        >
          <MoreVertical size={14} />
        </motion.button>
      </motion.div> */}
    </motion.div>
  );
}
