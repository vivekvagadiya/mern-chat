import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Pin, Star, MoreVertical } from 'lucide-react';
import { formatChatDate } from '../../utils/helper.js';
import Avatar from '../common/Avatar.jsx';
import { useToast } from '../ToastContainer.jsx';
import { chatFavoriteApi, chatPinnedApi } from '../../api/conversation.js';

export default function ConversationItem({ conversation }) {
  const dispatch = useDispatch();
  const { currentConversationId, typingUsers } = useSelector((state) => state.chat);
  const { onlineUsers, userStatuses } = useSelector((state) => state.socket);
  const isActive = conversation._id === currentConversationId;
  const [showActions, setShowActions] = React.useState(false);
  const toast = useToast();

  // Get current user ID to find the other participant in direct conversations
  const { user: currentUser } = useSelector((state) => state.auth);

  // Find the other user in direct conversation (not the current user)
  const getOtherParticipant = (conversation) => {
    if (!conversation.participants || conversation.type !== 'direct') return null;
    return (
      conversation.participants.find((p) => p._id !== currentUser?.id) ||
      conversation.participants[0]
    );
  };

  const otherParticipant = getOtherParticipant(conversation);

  const currentTypingUserIds = typingUsers?.[conversation._id] || [];
  const otherTypingUserIds = currentTypingUserIds.filter(
    (id) => id !== (currentUser?._id || currentUser?.id)
  );
  const isTyping = otherTypingUserIds.length > 0;

  const handlePinChat = async () => {
    try {
      const result = await chatPinnedApi(conversation?._id);
      toast.success(result?.isPinned ? 'Chat pinned successfully' : 'Chat unpinned successfully');
    } catch (error) {
      toast.error(error?.message || '');
    }
  };

  const handleFavoriteChat = async () => {
    try {
      const result = await chatFavoriteApi(conversation?._id);
      toast.success(
        result?.isFavorite ? 'Chat favorited successfully' : 'Chat unfavorited successfully'
      );
    } catch (error) {
      toast.error(error?.message || '');
    }
  };

  return (
    <motion.div
      className={`relative group mb-1.5 rounded-lg cursor-pointer transition-all ${
        isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-dark-surface-alt'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      whileHover={{ x: 4 }}
    >
      <div className="p-3 flex items-start gap-3">
        {/* Avatar & Status */}
        <Avatar
          src={conversation.type === 'direct' ? conversation.avatar : conversation.groupAvatar}
          alt={conversation.displayName}
          fallback={conversation.type === 'group' ? '👥' : '👤'}
          userId={otherParticipant?._id || otherParticipant?.id}
          showStatus={conversation.type === 'direct'}
        />

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

          <p className="text-xs truncate">
            {isTyping ? (
              <span className="text-primary font-medium italic animate-pulse">typing...</span>
            ) : (
              <span className="text-dark-text-muted">
                {conversation?.lastMessage?.content || 'No messages yet'}
              </span>
            )}
          </p>
        </div>

        {/* Unread Badge */}
        {conversation.unread > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white"
          >
            {conversation.unread}
          </motion.div>
        )}
      </div>

      {/* Hover Actions */}
      <AnimatePresence>
        {(showActions || isActive) && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handlePinChat();
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
                handleFavoriteChat();
              }}
              className={`p-1.5 rounded transition-colors ${
                conversation.isFavorite
                  ? 'text-accent bg-accent/10'
                  : 'text-dark-text-muted hover:bg-dark-surface-2'
              }`}
            >
              <Star size={14} fill={conversation.isFavorite ? 'currentColor' : 'none'} />
            </motion.button>

            {/* <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded text-dark-text-muted hover:bg-dark-surface-2 transition-colors"
            >
              <MoreVertical size={14} />
            </motion.button> */}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
