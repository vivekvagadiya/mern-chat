import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, User, MessageSquare, Hash } from 'lucide-react';
import { mockSearchResults } from '../../mock/data.js';
import { setSearchOpen } from '../../store/slices/uiSlice.js';
import { setCurrentConversation } from '../../store/slices/chatSlice.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useToast } from '../ToastContainer.jsx';
import { createDirectConversation, getConversation, searchConversation } from '../../api/conversation.js';
import { fetchConversation } from '../../store/actions/conversation.actions.js';

export default function SearchModal() {
  const dispatch = useDispatch();
  const { searchOpen } = useSelector((state) => state.ui);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [chats, setChats] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        dispatch(setSearchOpen(!searchOpen));
      }
      if (!searchOpen) return;

      if (e.key === 'Escape') {
        dispatch(setSearchOpen(false));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, dispatch]);

  // Reset state when modal closes
  useEffect(() => {
    if (!searchOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setChats([]);
    }
  }, [searchOpen]);

  const allResults = [
    ...mockSearchResults.users.map((u) => ({ ...u, type: 'user' })),
    ...mockSearchResults.chats.map((c) => ({ ...c, type: 'chat' })),
    ...mockSearchResults.messages.map((m) => ({ ...m, type: 'message' })),
  ];

  const filteredResults = allResults.filter((item) => {
    const query = searchQuery.toLowerCase();
    if (item.type === 'user') return item.name.toLowerCase().includes(query);
    if (item.type === 'chat') return item.name.toLowerCase().includes(query);
    if (item.type === 'message') return item.content.toLowerCase().includes(query);
    return false;
  });

  const handleSelect = async (result) => {
    if (result.chatExists) {
      dispatch(setCurrentConversation(result.chatId));
      dispatch(setSearchOpen(false));
    } else {
      try {
        const response = await createDirectConversation({ participantId: result._id });
        console.log('response',response)
        // Wait a moment for socket event to refresh conversations
        await new Promise(resolve => setTimeout(resolve, 100));
        dispatch(setCurrentConversation(response._id));
        dispatch(setSearchOpen(false));
      } catch (error) {
        toast.error(error.message || 'Failed to create chat');
      }
    }
  };

  const debounceSearch = useDebounce(searchQuery, 300);

  const getConversation = async () => {
    try {
      const result = await searchConversation(debounceSearch);
      setChats(result);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch chats');
    }
  };

  useEffect(() => {
    if (debounceSearch.length < 2) {
      return;
    }

    getConversation();
  }, [debounceSearch]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setSearchOpen(false))}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="fixed top-1/4 left-1/3 w-full max-w-2xl z-50"
          >
            <div className="mx-4 bg-dark-surface border border-dark-border rounded-2xl shadow-elevation-3 overflow-hidden">
              {/* Search Input */}
              <div className="p-4 border-b border-dark-border flex items-center gap-3 bg-dark-surface-alt">
                <Search size={20} className="text-dark-text-muted" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  placeholder="Search messages, chats, people..."
                  className="flex-1 bg-transparent text-dark-text outline-none placeholder-dark-text-muted text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => dispatch(setSearchOpen(false))}
                  className="p-1.5 hover:bg-dark-surface rounded text-dark-text-muted hover:text-dark-text transition-colors"
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {chats.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-dark-text-muted text-sm">
                      {searchQuery ? 'No results found' : 'Start typing to search...'}
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Users Section */}
                    {chats.some((r) => !r.chatExists) && (
                      <>
                        <div className="px-4 py-2 text-xs font-medium text-dark-text-muted bg-dark-surface-2">
                          People
                        </div>
                        {chats
                          // .filter((r) => r.type === 'user')
                          .map((user) => (
                            <motion.div
                              key={user._id}
                              onClick={() => handleSelect(user)}
                              className="px-4 py-3 hover:bg-dark-surface-alt border-b border-dark-border/50 cursor-pointer transition-colors flex items-center gap-3"
                            >
                              <User size={16} className="text-dark-text-muted flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-dark-text">
                                  {user.username}
                                </p>
                                <p className="text-xs text-dark-text-muted">{user.email}</p>
                              </div>
                            </motion.div>
                          ))}
                      </>
                    )}

                    {/* Chats Section */}
                    {chats.some((r) => r.chatExists) && (
                      <>
                        <div className="px-4 py-2 text-xs font-medium text-dark-text-muted bg-dark-surface-2">
                          Chats
                        </div>
                        {chats
                          .filter((r) => r.chatExists)
                          .map((chat) => (
                            <motion.div
                              key={chat._id}
                              onClick={() => handleSelect(chat)}
                              className="px-4 py-3 hover:bg-dark-surface-alt border-b border-dark-border/50 cursor-pointer transition-colors flex items-center gap-3"
                            >
                              <MessageSquare
                                size={16}
                                className="text-dark-text-muted flex-shrink-0"
                              />
                              <div>
                                <p className="text-sm font-medium text-dark-text">
                                  {chat.username}
                                </p>
                                <p className="text-xs text-dark-text-muted truncate">
                                  {chat.lastMessage ? chat.lastMessage.content : ''}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                      </>
                    )}

                    {/* Messages Section */}
                    {filteredResults.some((r) => r.type === 'message') && (
                      <>
                        <div className="px-4 py-2 text-xs font-medium text-dark-text-muted bg-dark-surface-2">
                          Messages
                        </div>
                        {filteredResults
                          .filter((r) => r.type === 'message')
                          .map((msg) => (
                            <motion.div
                              key={msg.id}
                              onClick={() => handleSelect(msg)}
                              className="px-4 py-3 hover:bg-dark-surface-alt border-b border-dark-border/50 cursor-pointer transition-colors"
                            >
                              <p className="text-sm text-dark-text">{msg.content}</p>
                              <p className="text-xs text-dark-text-muted mt-1">
                                from {msg.sender} in {msg.chatName}
                              </p>
                            </motion.div>
                          ))}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-dark-surface-2 border-t border-dark-border text-xs text-dark-text-muted flex items-center justify-between">
                <span>
                  Press <kbd className="px-2 py-1 bg-dark-surface rounded text-dark-text">Esc</kbd>{' '}
                  to close
                </span>
                <span>⌘K or Ctrl+K to open</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
