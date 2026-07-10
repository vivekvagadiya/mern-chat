import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Smile, Mic, Plus, X } from 'lucide-react';
import { addMessage, updateChat } from '../../store/slices/chatSlice.js';
import { sendMessageAction } from '../../store/actions/message.actions.js';
import socketService from '../../services/socket.service.js';
import EmojiPicker from 'emoji-picker-react';

export default function MessageComposer({ conversationId }) {
  const dispatch = useDispatch();
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const attachmentMenuRef = useRef(null);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { mobileView } = useSelector((state) => state.ui);

  const socket = socketService.getSocket();

  // Handle click outside to close popups
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target)) {
        setShowAttachmentMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
    }
  }, [message]);

  // useEffect(() => {
  //   if (socket) {
  //     socket.on('message_received', (message) => {
  //       console.log('message received', message);
  //     });
  //   }

  //   return () => {
  //     if (socket) {
  //       socket.off('message_received');
  //     }
  //   };
  // }, [socket]);

  useEffect(() => {
    if (message.trim()) {
      socketService.getSocket()?.emit('typing_start', { chatId: conversationId });

      const timeout = setTimeout(() => {
        socketService.getSocket()?.emit('typing_stop', { chatId: conversationId });
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    } else {
      // Explicitly stop typing if the message becomes empty
      socketService.getSocket()?.emit('typing_stop', { chatId: conversationId });
    }
  }, [message, conversationId]);

  const handleSendMessage = async () => {
    const hasText = message.trim().length > 0;
    const hasAttachments = attachments.length > 0;

    if (!hasText && !hasAttachments) return;

    setIsSending(true);
    // Immediately tell others we stopped typing while sending
    socketService.getSocket()?.emit('typing_stop', { chatId: conversationId });

    try {
      if (hasAttachments) {
        // Send each attachment as FormData
        for (let i = 0; i < attachments.length; i++) {
          const attachment = attachments[i];
          const content = i === 0 && hasText ? message.trim() : attachment.name;

          const formData = new FormData();
          formData.append('chatId', conversationId);
          formData.append('content', content);
          formData.append('file', attachment.file);
          // type and mediaUrl are populated by the backend

          const result = await dispatch(sendMessageAction(formData)).unwrap();

          dispatch(addMessage({ conversationId, message: result }));
          dispatch(updateChat({ chatId: conversationId, lastMessage: result }));
        }
      } else {
        // Just text message via socket
        socketService.sendMessage({
          chatId: conversationId,
          content: message.trim(),
          type: 'text',
        });

        // Commented out REST API message sending to keep it in place
        /*
        const result = await dispatch(
          sendMessageAction({
            chatId: conversationId,
            content: message.trim(),
            type: 'text',
          })
        ).unwrap();

        dispatch(addMessage({ conversationId, message: result }));
        dispatch(updateChat({ chatId: conversationId, lastMessage: result }));
        */

        setMessage('');
        setIsTyping(false);
      }

      setMessage('');
      attachments.forEach((att) => att.preview && URL.revokeObjectURL(att.preview));
      setAttachments([]);
      setIsTyping(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachmentClick = (type) => {
    if (fileInputRef.current) {
      if (type === 'Images') fileInputRef.current.accept = 'image/*';
      else if (type === 'Video') fileInputRef.current.accept = 'video/*';
      else fileInputRef.current.accept = '*/*';

      fileInputRef.current.click();
    }
    setShowAttachmentMenu(false);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newAttachments = files.map((file) => ({
      id: `${file.name}_${Date.now()}`,
      name: file.name,
      file: file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    e.target.value = ''; // Reset input
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const att = prev.find((a) => a.id === id);
      if (att && att.preview) URL.revokeObjectURL(att.preview);
      return prev.filter((a) => a.id !== id);
    });
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />
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
                {attachment.preview ? (
                  <img
                    src={attachment.preview}
                    alt="preview"
                    className="w-8 h-8 object-cover rounded"
                  />
                ) : (
                  <Paperclip size={14} className="text-dark-text-muted" />
                )}
                <span className="text-xs text-dark-text truncate max-w-[120px]">
                  {attachment.name}
                </span>
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
          <div className="relative" ref={attachmentMenuRef}>
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
                  className="absolute bottom-full left-0 mb-2 w-48 bg-dark-surface-2 border border-dark-border rounded-lg shadow-elevation-2 overflow-hidden z-30"
                >
                  {[
                    { icon: '📎', label: 'Files', action: () => handleAttachmentClick('Files') },
                    { icon: '🖼️', label: 'Images', action: () => handleAttachmentClick('Images') },
                    { icon: '🎬', label: 'Video', action: () => handleAttachmentClick('Video') },
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
          <div className="static md:relative" ref={emojiPickerRef}>
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
                  className="absolute bottom-full left-0 right-0 md:left-0 md:right-auto mb-2 z-30 shadow-elevation-2 overflow-hidden rounded-lg"
                >
                  <EmojiPicker
                    theme="dark"
                    emojiStyle="native"
                    width={mobileView ? '100%' : '350px'}
                    height={mobileView ? 320 : 400}
                    onEmojiClick={(emojiObject) => {
                      setMessage((prev) => prev + emojiObject.emoji);
                    }}
                  />
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
          disabled={isSending}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Shift+Enter for new line)"
          className="flex-1 bg-transparent text-sm text-dark-text placeholder-dark-text-muted resize-none outline-none max-h-30 min-h-10"
          rows="1"
        />

        {/* Voice & Send */}
        <div className="flex items-center gap-2">
          {message.trim() || attachments.length > 0 ? (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={isSending}
              className={`p-2 text-white hover:shadow-elevation-1 rounded-lg transition-all ${
                isSending
                  ? 'bg-dark-surface-2 cursor-not-allowed opacity-70'
                  : 'bg-gradient-to-br from-primary to-primary-dark'
              }`}
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={20} />
              )}
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
      {/* {isTyping && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-dark-text-muted px-3"
        >
          💬 Typing...
        </motion.p>
      )} */}
    </div>
  );
}
