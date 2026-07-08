import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Calendar, Phone, Trash2, Ban, Flag } from 'lucide-react';
import Avatar from '../common/Avatar.jsx';
import { useToast } from '../ToastContainer.jsx';
import { clearChat, deleteChat } from '../../api/conversation.js';
import { useSelector } from 'react-redux';
import { useUserPresence } from '../../hooks/useUserPresence';

export default function ChatInfoModal({ isOpen, onClose, conversation }) {
  if (!conversation) return null;
  const toast = useToast();
  const { user: currentUser } = useSelector((state) => state.auth);

  const getOtherParticipant = (conv) => {
    if (!conv || !conv.participants || conv.type !== 'direct') return null;
    return (
      conv.participants.find((p) => p._id !== currentUser?.id && p._id !== currentUser?._id) ||
      conv.participants[0]
    );
  };

  const otherParticipant = getOtherParticipant(conversation);
  const { isOnline, lastSeenText } = useUserPresence(otherParticipant?._id || otherParticipant?.id);

  const handleClearChat = async () => {
    try {
      const response = await clearChat(conversation._id);
      toast.success(response?.message || 'Chat cleared successfully');
      onClose();
    } catch (error) {
      toast.error(error?.message || '');
    }
  };

  const handleDeleteChat = async () => {
    try {
      const response = await deleteChat(conversation._id);
      toast.success(response?.message || 'Chat deleted successfully');
      onClose();
    } catch (error) {
      toast.error(error?.message || '');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none"
          >
            <div className="w-full max-w-md bg-dark-surface border border-dark-border rounded-2xl shadow-elevation-3 overflow-hidden flex flex-col pointer-events-auto">
              {/* Header */}
              <div className="p-4 border-b border-dark-border flex items-center justify-between gap-3 bg-dark-surface-alt">
                <div className="flex items-center gap-2">
                  <User size={20} className="text-primary" />
                  <span className="text-lg font-semibold text-dark-text">Contact Info</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-1.5 hover:bg-dark-surface rounded text-dark-text-muted hover:text-dark-text transition-colors"
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col items-center">
                <Avatar
                  src={conversation.avatar}
                  alt={conversation.name || conversation.username || 'User'}
                  size="w-24 h-24"
                  rounded="rounded-full"
                  className="mb-4 shadow-elevation-2"
                  userId={otherParticipant?._id || otherParticipant?.id}
                  showStatus={true}
                />
                <h3 className="text-xl font-bold text-dark-text mb-1">
                  {conversation.name || conversation.username}
                </h3>
                <p
                  className={`text-sm mb-6 ${isOnline ? 'text-primary' : 'text-dark-text-muted font-medium'}`}
                >
                  {lastSeenText}
                </p>

                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-surface-2 border border-dark-border">
                    <Mail className="text-dark-text-muted" size={18} />
                    <div>
                      <p className="text-xs text-dark-text-muted">Email</p>
                      <p className="text-sm text-dark-text">
                        {conversation.email || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-surface-2 border border-dark-border">
                    <Phone className="text-dark-text-muted" size={18} />
                    <div>
                      <p className="text-xs text-dark-text-muted">Phone</p>
                      <p className="text-sm text-dark-text">
                        {conversation.phone || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-surface-2 border border-dark-border">
                    <Calendar className="text-dark-text-muted" size={18} />
                    <div>
                      <p className="text-xs text-dark-text-muted">Joined</p>
                      <p className="text-sm text-dark-text">
                        {conversation.createdAt
                          ? new Date(conversation.createdAt).toLocaleDateString()
                          : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full space-y-3 mt-6">
                  {/* <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-dark-surface-2 border border-dark-border hover:bg-dark-surface-alt transition-colors text-dark-text font-medium">
                    <Ban size={18} className="text-error" />
                    <span>Block User</span>
                  </button> */}
                  <button
                    onClick={handleClearChat}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-dark-surface-2 border border-dark-border hover:bg-dark-surface-alt transition-colors text-dark-text font-medium"
                  >
                    <Flag size={18} className="text-warning" />
                    <span>Clear Chat</span>
                  </button>
                  <button
                    onClick={handleDeleteChat}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-error/10 border border-error/20 hover:bg-error/20 transition-colors text-error font-medium"
                  >
                    <Trash2 size={18} />
                    <span>Delete Chat</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
