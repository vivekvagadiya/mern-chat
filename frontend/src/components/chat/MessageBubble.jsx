import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Reply,
  Edit,
  Trash2,
  Smile,
  Check,
  CheckCheck,
  FileText,
  Download,
  X,
} from 'lucide-react';
import socketService from '../../services/socket.service.js';
import { formatChatDate } from '../../utils/helper.js';
import Avatar from '../common/Avatar.jsx';
import { MessageAttachment } from './MessageAttachment.jsx';
import EmojiPicker from 'emoji-picker-react';

export default function MessageBubble({ message, isNearTop }) {
  const dispatch = useDispatch();
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showAllReactionsModal, setShowAllReactionsModal] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { mobileView } = useSelector((state) => state.ui);
  const isOwn = (message?.senderId?._id || message?.senderId) === (user?._id || user?.id);

  const reactionsRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (reactionsRef.current && !reactionsRef.current.contains(event.target)) {
        setShowReactions(false);
        setShowActions(false);
      }
    };

    if (showReactions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReactions]);

  const handleAddReaction = (emoji) => {
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('add_reaction', {
        messageId: message._id || message.id,
        emoji,
      });
    }
    setShowReactions(false);
    setShowActions(false);
  };

  const getStatusIcon = () => {
    if (message.status === 'delivered') return <Check size={14} />;
    if (message.status === 'seen') return <CheckCheck size={14} />;
    return null;
  };

  return (
    <motion.div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} gap-3 group`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Avatar */}
      {!isOwn && (
        // <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 text-sm">
        //   {message?.senderId?.avatar}
        // </div>
        <Avatar
          size="w-8 h-8"
          src={message?.senderId?.avatar}
          alt={message?.senderId?.username}
          fallback={message?.senderId?.username?.charAt(0)}
        />
      )}

      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} gap-1.5`}>
        {/* User name for group messages */}
        {/* {!isOwn && (
          <span className="text-xs font-medium text-dark-text-muted px-3 pt-1">
            {message?.senderId?.username}
          </span>
        )} */}

        {/* Message Bubble */}
        <div
          className={`relative group/bubble ${message?.reactions?.length > 0 ? 'mb-3.5' : ''}`}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => {
            if (!showReactions) {
              setShowActions(false);
            }
          }}
        >
          <motion.div
            className={`px-4 py-2.5 rounded-lg backdrop-blur-sm border transition-all ${
              isOwn
                ? 'bg-gradient-to-br from-primary to-primary-dark border-primary/30 text-white rounded-br-none'
                : 'bg-dark-surface-alt border-glass-light rounded-bl-none'
            }`}
            whileHover={{ y: -2 }}
          >
            <MessageAttachment message={message} />
            {message.content && (
              <p className="text-sm leading-relaxed break-words max-w-xs">{message.content}</p>
            )}

            {/* Timestamp & Status */}
            <div
              className={`flex items-center gap-1.5 mt-1 text-xs ${
                isOwn ? 'text-white/70' : 'text-dark-text-muted'
              }`}
            >
              <span>{formatChatDate(message.createdAt)}</span>
              {isOwn && getStatusIcon()}
            </div>
          </motion.div>

          {/* Hover Actions */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className={`absolute ${
                  isOwn ? 'right-4 md:right-full md:mr-2' : 'left-4 md:left-full md:ml-2'
                } -top-3.5 md:top-1/2 md:-translate-y-1/2 flex items-center gap-1 bg-dark-surface-2 border border-dark-border rounded-lg p-1 shadow-elevation-2 z-20`}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReactions(!showReactions)}
                  className="p-1.5 hover:bg-dark-surface rounded transition-colors text-dark-text-muted hover:text-dark-text"
                  title="Add reaction"
                >
                  <Smile size={16} />
                </motion.button>

                <div className="w-px h-4 bg-dark-border" />

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 hover:bg-dark-surface rounded transition-colors text-dark-text-muted hover:text-dark-text"
                >
                  <Reply size={16} />
                </motion.button>

                {isOwn && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-1.5 hover:bg-dark-surface rounded transition-colors text-dark-text-muted hover:text-dark-text"
                    >
                      <Edit size={16} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-1.5 hover:bg-dark-surface rounded transition-colors text-error hover:bg-error/10"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </>
                )}

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 hover:bg-dark-surface rounded transition-colors text-dark-text-muted hover:text-dark-text"
                >
                  <Copy size={16} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reactions Picker */}
          <AnimatePresence>
            {showReactions && (
              <motion.div
                ref={reactionsRef}
                initial={{ opacity: 0, scale: 0.8, y: isNearTop ? -10 : 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: isNearTop ? -10 : 10 }}
                className={`absolute ${isOwn ? 'right-0' : 'left-[-44px] md:left-0'} ${
                  isNearTop ? 'top-full mt-2' : 'bottom-full mb-2'
                } z-30 shadow-elevation-3 overflow-hidden rounded-lg`}
              >
                <EmojiPicker
                  theme="dark"
                  emojiStyle="native"
                  width={mobileView ? 280 : 320}
                  height={mobileView ? 300 : 380}
                  onEmojiClick={(emojiObject) => {
                    handleAddReaction(emojiObject.emoji);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* WhatsApp-style Reactions Display */}
          {message?.reactions?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowAllReactionsModal(true)}
              className={`absolute ${
                isOwn ? 'right-0 -bottom-4' : 'left-0 -bottom-4'
              } z-10 flex items-center gap-1 bg-dark-surface-2 border border-dark-border rounded-full px-1.5 py-1 shadow-premium-sm cursor-pointer hover:bg-dark-surface transition-colors`}
            >
              <div className="flex -space-x-0.5">
                {message.reactions.slice(0, 3).map((r) => (
                  <span key={r.emoji} className="text-xs leading-none select-none">
                    {r.emoji}
                  </span>
                ))}
              </div>
              {message.reactions.reduce((acc, curr) => acc + curr.users, 0) > 1 && (
                <span className="text-[10px] leading-none text-dark-text-muted px-0.5">
                  {message.reactions.reduce((acc, curr) => acc + curr.users, 0)}
                </span>
              )}
            </motion.div>
          )}
        </div>

        {/* Reactions Display */}
      </div>

      <AnimatePresence>
        {showAllReactionsModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAllReactionsModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-dark-surface-2 border border-dark-border rounded-2xl w-full max-w-sm overflow-hidden shadow-premium"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-dark-border flex items-center justify-between">
                <h3 className="text-base font-semibold text-dark-text">Reactions</h3>
                <button
                  onClick={() => setShowAllReactionsModal(false)}
                  className="p-1 hover:bg-dark-surface rounded-lg transition-colors text-dark-text-muted hover:text-dark-text"
                >
                  <X size={18} />
                </button>
              </div>
              {/* Reactions List */}
              <div className="px-5 py-4 max-h-[300px] overflow-y-auto flex flex-col gap-3 no-scrollbar">
                {message.reactions.map((r) => (
                  <div
                    key={r.emoji}
                    className="flex items-center justify-between bg-dark-surface rounded-xl p-3 border border-dark-border/40"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl select-none">{r.emoji}</span>
                      <span className="text-sm font-medium text-dark-text">
                        {r.users === 1 ? '1 reaction' : `${r.users} reactions`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
