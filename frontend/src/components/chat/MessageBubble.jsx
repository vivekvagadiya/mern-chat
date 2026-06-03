import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Reply, Edit, Trash2, Smile, Check, CheckCheck } from 'lucide-react';
import { getTimeAgo } from '../../mock/data.js';
import { addReaction } from '../../store/slices/chatSlice.js';

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🚀', '✨'];

export default function MessageBubble({ message }) {
  const dispatch = useDispatch();
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const isOwn = message.userId === 'current';

  const handleAddReaction = (emoji) => {
    dispatch(addReaction({
      conversationId: 'conv-1', // TODO: pass as prop
      messageId: message.id,
      emoji,
    }));
    setShowReactions(false);
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
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowReactions(false);
      }}
    >
      {/* Avatar */}
      {!isOwn && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 text-sm">
          {message.avatar}
        </div>
      )}

      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} gap-1.5`}>
        {/* User name for group messages */}
        {!isOwn && (
          <span className="text-xs font-medium text-dark-text-muted px-3 pt-1">
            {message.userName}
          </span>
        )}

        {/* Message Bubble */}
        <div className="relative group/bubble">
          <motion.div
            className={`px-4 py-2.5 rounded-lg backdrop-blur-sm border transition-all ${
              isOwn
                ? 'bg-gradient-to-br from-primary to-primary-dark border-primary/30 text-white rounded-br-none'
                : 'bg-dark-surface-alt border-glass-light rounded-bl-none'
            }`}
            whileHover={{ y: -2 }}
          >
            <p className="text-sm leading-relaxed break-words max-w-xs">
              {message.content}
            </p>

            {/* Timestamp & Status */}
            <div className={`flex items-center gap-1.5 mt-1 text-xs ${
              isOwn ? 'text-white/70' : 'text-dark-text-muted'
            }`}>
              <span>{getTimeAgo(message.timestamp)}</span>
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
                className={`absolute ${isOwn ? 'right-0' : 'left-0'} top-full mt-2 flex items-center gap-1 bg-dark-surface-2 border border-dark-border rounded-lg p-1 shadow-elevation-2 z-20`}
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
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute ${isOwn ? 'right-0' : 'left-0'} bottom-full mb-2 bg-dark-surface-2 border border-dark-border rounded-lg p-2 shadow-elevation-3 z-20`}
              >
                <div className="grid grid-cols-4 gap-1">
                  {EMOJI_REACTIONS.map((emoji) => (
                    <motion.button
                      key={emoji}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAddReaction(emoji)}
                      className="w-8 h-8 rounded hover:bg-dark-surface flex items-center justify-center text-lg transition-colors"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reactions Display */}
        {message.reactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-wrap gap-1 mt-1"
          >
            {message.reactions.map((reaction) => (
              <motion.div
                key={reaction.emoji}
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-1 bg-dark-surface-alt border border-glass-light rounded-full px-2.5 py-1 cursor-pointer hover:bg-dark-surface-2 transition-colors"
              >
                <span className="text-sm">{reaction.emoji}</span>
                <span className="text-xs text-dark-text-muted">{reaction.users}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
