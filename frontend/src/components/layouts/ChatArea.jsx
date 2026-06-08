import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Video,
  Info,
  Clock,
  Menu,
  Check,
  CheckCheck,
} from 'lucide-react';
import { getTimeAgo } from '../../mock/data.js';
import MessageBubble from '../chat/MessageBubble';
import MessageComposer from '../chat/MessageComposer';
import { setSidebarOpen } from '../../store/slices/uiSlice.js';
import { markConversationAsRead } from '../../store/slices/chatSlice.js';

export default function ChatArea() {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const { conversations, messages, currentConversationId } = useSelector(state => state.chat);
  const { mobileView } = useSelector(state => state.ui);

  const currentConversation = conversations.find(c => c._id === currentConversationId);
  const currentMessages = messages[currentConversationId] || [];

  useEffect(() => {
    if (currentConversationId) {
      dispatch(markConversationAsRead(currentConversationId));
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversationId, dispatch, currentMessages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length]);

  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-dark-surface via-dark-bg to-dark-surface-alt">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">💬</span>
          </div>
          <h2 className="text-xl font-semibold text-dark-text mb-2">Select a conversation</h2>
          <p className="text-dark-text-muted">Choose a chat to start messaging</p>
        </div>
      </div>
    );
  }

  const conversationMemberCount = currentConversation.type === 'group' ? currentConversation.memberCount : 1;

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
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg">
              {currentConversation.avatar}
            </div>

            <div>
              <h2 className="font-semibold text-dark-text">
                {currentConversation.name}
              </h2>
              <p className="text-xs text-dark-text-muted">
                {currentConversation.type === 'group'
                  ? `${conversationMemberCount} members`
                  : currentConversation.status === 'online'
                  ? 'Active now'
                  : `Last seen ${getTimeAgo(currentConversation.timestamp)}`}
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
            className="p-2 hover:bg-dark-surface-alt rounded-lg transition-colors text-dark-text-muted hover:text-dark-text"
          >
            <Info size={20} />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
        <AnimatePresence>
          {currentMessages.length === 0 ? (
            <motion.div
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
            currentMessages.map((message, index) => {
              const showTimestamp = index === 0 || 
                new Date(currentMessages[index - 1].timestamp).toLocaleDateString() !==
                new Date(message.timestamp).toLocaleDateString();

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {showTimestamp && (
                    <div className="flex items-center justify-center my-4">
                      <div className="text-xs text-dark-text-muted bg-dark-surface-alt px-3 py-1 rounded-full">
                        {new Date(message.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  )}
                  <MessageBubble message={message} />
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <div className="p-4 border-t border-dark-border backdrop-blur-md bg-dark-surface/50">
        <MessageComposer conversationId={currentConversationId} />
      </div>
    </div>
  );
}
