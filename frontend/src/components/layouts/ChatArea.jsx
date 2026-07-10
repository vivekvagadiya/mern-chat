import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Video, Info, Clock, Menu, Check, CheckCheck } from 'lucide-react';
import { getTimeAgo } from '../../mock/data.js';
import MessageBubble from '../chat/MessageBubble';
import MessageComposer from '../chat/MessageComposer';
import { setSidebarOpen } from '../../store/slices/uiSlice.js';
import { markConversationAsRead } from '../../store/slices/chatSlice.js';
import { useConversation } from '../../hooks/useConversation.js';
import { fetchMessages } from '../../store/actions/message.actions.js';
import { formatChatDate, getTimeStamp } from '../../utils/helper.js';
import Avatar from '../common/Avatar.jsx';
import ChatInfoModal from '../modals/ChatInfoModal';
import GroupInfoModal from '../modals/GroupInfoModal';
import { useUserPresence } from '../../hooks/useUserPresence';

export default function ChatArea() {
  const dispatch = useDispatch();
  const messagesContainerRef = useRef(null);
  const { mobileView } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const { typingUsers, messagesLoading } = useSelector((state) => state.chat);
  const { messages, currentConversation, pagination } = useConversation();
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const currentTypingUserIds = typingUsers?.[currentConversation?._id] || [];
  const otherTypingUserIds = currentTypingUserIds.filter((id) => id !== (user?._id || user?.id));

  const getOtherParticipant = (conv) => {
    if (!conv || !conv.participants || conv.type !== 'direct') return null;
    return (
      conv.participants.find((p) => p._id !== user?.id && p._id !== user?._id) ||
      conv.participants[0]
    );
  };

  const otherParticipant = getOtherParticipant(currentConversation);
  const { isOnline, lastSeenText } = useUserPresence(otherParticipant?._id || otherParticipant?.id);

  const prevScrollHeightRef = useRef(0);
  const prevScrollTopRef = useRef(0);
  const isInitialLoadRef = useRef(true);
  const isFetchingMoreRef = useRef(false);

  // Reset scroll state on chat switch and fetch messages
  useEffect(() => {
    isInitialLoadRef.current = true;
    isFetchingMoreRef.current = false;
    prevScrollHeightRef.current = 0;
    prevScrollTopRef.current = 0;
    if (currentConversation?._id) {
      dispatch(fetchMessages({ chatId: currentConversation._id }));
      dispatch(markConversationAsRead(currentConversation._id));
    }
  }, [currentConversation?._id, dispatch]);

  const loadMoreMessages = async () => {
    if (
      messagesLoading ||
      isFetchingMoreRef.current ||
      !pagination?.hasMore ||
      !pagination?.nextCursor ||
      !currentConversation?._id
    ) {
      return;
    }

    isFetchingMoreRef.current = true;

    // Capture scroll details before prepending new messages
    const container = messagesContainerRef.current;
    if (container) {
      prevScrollHeightRef.current = container.scrollHeight;
      prevScrollTopRef.current = container.scrollTop;
    }

    try {
      await dispatch(
        fetchMessages({
          chatId: currentConversation._id,
          before: pagination.nextCursor,
        })
      ).unwrap();
    } catch (error) {
      console.error('Error fetching older messages:', error);
    } finally {
      isFetchingMoreRef.current = false;
    }
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    if (container.scrollTop < 50) {
      loadMoreMessages();
    }
  };

  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    if (isInitialLoadRef.current) {
      container.scrollTop = container.scrollHeight;
      if (messages.length > 0) {
        isInitialLoadRef.current = false;
      }
      return;
    }

    if (prevScrollHeightRef.current > 0) {
      const scrollHeightDiff = container.scrollHeight - prevScrollHeightRef.current;
      container.scrollTop = prevScrollTopRef.current + scrollHeightDiff;
      prevScrollHeightRef.current = 0;
      prevScrollTopRef.current = 0;
    } else {
      const isNearBottom =
        container.scrollHeight - container.clientHeight - container.scrollTop < 150;
      if (isNearBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages]);

  if (!currentConversation) {
    return (
      <div className="flex-1 flex flex-col bg-gradient-to-br from-dark-surface via-dark-bg to-dark-surface-alt overflow-hidden">
        {/* Header for mobile/no-chat view to allow reopening the sidebar */}
        {mobileView && (
          <div className="flex items-center p-4 border-b border-dark-border backdrop-blur-md bg-dark-surface/50 sticky top-0 z-10">
            <button
              onClick={() => dispatch(setSidebarOpen(true))}
              className="p-2 hover:bg-dark-surface-alt rounded-lg transition-colors text-dark-text mr-3"
            >
              <Menu size={20} />
            </button>
            <h2 className="font-semibold text-dark-text">Chats</h2>
          </div>
        )}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">💬</span>
            </div>
            <h2 className="text-xl font-semibold text-dark-text mb-2">Select a conversation</h2>
            <p className="text-dark-text-muted">Choose a chat to start messaging</p>
          </div>
        </div>
      </div>
    );
  }

  const conversationMemberCount =
    currentConversation.type === 'group' ? currentConversation.participants?.length || 0 : 1;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-dark-surface via-dark-bg to-dark-surface-alt overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-border backdrop-blur-md bg-dark-surface/50 sticky top-0 z-10">
        <div className="flex items-center gap-3 flex-1">
          {mobileView && (
            <button
              onClick={() => dispatch(setSidebarOpen(true))}
              className="p-2 hover:bg-dark-surface-alt rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
          )}

          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg">
              {currentConversation.avatar}
            </div> */}
            <Avatar
              src={currentConversation.avatar}
              alt={currentConversation.username || ''}
              size="w-10 h-10"
              userId={otherParticipant?._id || otherParticipant?.id}
              showStatus={currentConversation.type === 'direct'}
            />

            <div>
              <h2 className="font-semibold text-dark-text">{currentConversation.name}</h2>
              <p className="text-xs text-dark-text-muted">
                {otherTypingUserIds.length > 0 ? (
                  <span className="text-primary font-medium italic animate-pulse">typing...</span>
                ) : currentConversation.type === 'group' ? (
                  `${conversationMemberCount} members`
                ) : (
                  lastSeenText
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-dark-surface-alt rounded-lg transition-colors text-dark-text-muted hover:text-dark-text"
          >
            <Phone size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-dark-surface-alt rounded-lg transition-colors text-dark-text-muted hover:text-dark-text"
          >
            <Video size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsInfoModalOpen(true)}
            className="p-2 hover:bg-dark-surface-alt rounded-lg transition-colors text-dark-text-muted hover:text-dark-text"
          >
            <Info size={20} />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className="h-full overflow-y-auto px-4 py-4 space-y-4"
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
          {/* Loading spinner for older messages */}
          {messagesLoading && messages.length > 0 && (
            <div className="flex justify-center items-center py-2" key="loading-older">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
            </div>
          )}

          <AnimatePresence>
            {messages.length === 0 && messagesLoading ? (
              <motion.div
                key="loading-initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                  <p className="text-sm text-dark-text-muted">Loading conversation...</p>
                </div>
              </motion.div>
            ) : messages.length === 0 ? (
              <motion.div
                key="no-messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Clock size={32} className="text-primary" />
                  </div>
                  <h3 className="text-sm font-medium text-dark-text mb-1">No messages yet</h3>
                  <p className="text-xs text-dark-text-muted">Start the conversation!</p>
                </div>
              </motion.div>
            ) : (
              messages.map((message, index) => {
                const showTimestamp =
                  index === 0 ||
                  getTimeStamp(messages[index - 1].createdAt) !== getTimeStamp(message.createdAt);

                return (
                  <motion.div
                    key={message._id || message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {showTimestamp && (
                      <div className="flex items-center justify-center my-4">
                        <div className="text-xs text-dark-text-muted bg-dark-surface-alt px-3 py-1 rounded-full">
                          {getTimeStamp(message.createdAt)}
                        </div>
                      </div>
                    )}
                    <MessageBubble message={message} isNearTop={index < 2} />
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Message Composer */}
      <div className="p-4 border-t border-dark-border backdrop-blur-md bg-dark-surface/50">
        <MessageComposer conversationId={currentConversation?._id} />
      </div>
      {/* Modals */}
      {currentConversation?.type === 'group' ? (
        <GroupInfoModal
          isOpen={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
          conversation={currentConversation}
        />
      ) : (
        <ChatInfoModal
          isOpen={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
          conversation={currentConversation}
        />
      )}
    </div>
  );
}
