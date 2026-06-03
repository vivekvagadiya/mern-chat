import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  Plus,
  X,
} from 'lucide-react';
import { addMessage } from '../../store/slices/chatSlice.js';

export default function MessageComposer({ conversationId }) {
  const dispatch = useDispatch();
  const textareaRef = useRef(null);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleSendMessage = () => {
    if (message.trim() || attachments.length > 0) {
      const newMessage = {
        id: `msg-${Date.now()}`,
        userId: 'current',
        userName: 'You',
        avatar: '👤',
        content: message,
        timestamp: new Date(),
        status: 'sent',
        reactions: [],
        attachments: attachments,
      };

      dispatch(addMessage({
        conversationId,
        message: newMessage,
      }));

      setMessage('');
      setAttachments([]);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachmentClick = (e) => {
    // Mock file selection
    const fileName = `attachment_${Date.now()}`;
    setAttachments([...attachments, { id: fileName, name: fileName }]);
    setShowAttachmentMenu(false);
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };

  const EMOJIS = ['😀', '😂', '😍', '🔥', '✨', '👍', '🎉', '🚀', '💯', '😎', '🙌', '❤️'];

  return (
    <div className="flex flex-col gap-2">
      {/* Attachments Preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-wrap gap-2"
          >
            {attachments.map((attachment) => (
              <motion.div
                key={attachment.id}
                layout
                className="flex items-center gap-2 bg-dark-surface-alt border border-glass-light rounded-lg px-3 py-2"
              >
                <Paperclip size={14} className="text-dark-text-muted" />
                <span className="text-xs text-dark-text truncate">{attachment.name}</span>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="p-0.5 hover:bg-dark-surface-2 rounded transition-colors text-dark-text-muted"
                >
                  <X size={12} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="flex items-end gap-3 p-3 rounded-xl bg-dark-surface-alt border border-glass-light backdrop-blur-md hover:border-glass-light transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
        {/* Attachment & Emoji */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="p-2 text-dark-text-muted hover:text-dark-text hover:bg-dark-surface rounded-lg transition-all"
              title="Add attachment"
            >
              <Plus size={20} />
            </motion.button>

            {/* Attachment Menu */}
            <AnimatePresence>
              {showAttachmentMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: -10 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute bottom-full left-0 mb-2 bg-dark-surface-2 border border-dark-border rounded-lg shadow-elevation-2 overflow-hidden z-30"
                >
                  {[
                    { icon: '📎', label: 'Files', action: handleAttachmentClick },
                    { icon: '🖼️', label: 'Images', action: handleAttachmentClick },
                    { icon: '🎵', label: 'Audio', action: handleAttachmentClick },
                    { icon: '🎬', label: 'Video', action: handleAttachmentClick },
                  ].map((item) => (
                    <motion.button
                      key={item.label}
                      whileHover={{ x: 4 }}
                      onClick={item.action}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-dark-surface flex items-center gap-3 transition-colors"
                    >
                      <span className="text-lg">{item.icon}</span>
                      {item.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Emoji Picker */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-dark-text-muted hover:text-dark-text hover:bg-dark-surface rounded-lg transition-all"
              title="Add emoji"
            >
              <Smile size={20} />
            </motion.button>

            {/* Emoji Grid */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: -10 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute bottom-full left-0 mb-2 bg-dark-surface-2 border border-dark-border rounded-lg shadow-elevation-2 p-3 z-30"
                >
                  <div className="grid grid-cols-6 gap-2">
                    {EMOJIS.map((emoji) => (
                      <motion.button
                        key={emoji}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setMessage(message + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="w-8 h-8 hover:bg-dark-surface rounded flex items-center justify-center text-lg transition-colors"
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setIsTyping(e.target.value.length > 0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Shift+Enter for new line)"
          className="flex-1 bg-transparent text-sm text-dark-text placeholder-dark-text-muted resize-none outline-none max-h-30 min-h-10"
          rows="1"
        />

        {/* Voice & Send */}
        <div className="flex items-center gap-2">
          {message.trim() ? (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              className="p-2 text-white bg-gradient-to-br from-primary to-primary-dark hover:shadow-elevation-1 rounded-lg transition-all"
            >
              <Send size={20} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-dark-text-muted hover:text-dark-text hover:bg-dark-surface rounded-lg transition-all"
            >
              <Mic size={20} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Typing Indicator Info */}
      {isTyping && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-dark-text-muted px-3"
        >
          💬 Typing...
        </motion.p>
      )}
    </div>
  );
}
