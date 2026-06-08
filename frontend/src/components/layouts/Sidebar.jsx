import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Settings, Bell, Plus, Pin, Star, Archive, Menu } from 'lucide-react';
import ConversationItem from '../../components/chat/ConversationItem';
import {
  setNotificationsOpen,
  setSettingsOpen,
  setSidebarOpen,
  toggleSearch,
} from '../../store/slices/uiSlice';
import { useConversation } from '../../hooks/useConversation';

export default function Sidebar() {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('all'); // all, pinned, favorites
  const { conversations, loading, messages ,selectConversation} = useConversation();
  console.log('conversations', conversations, messages);
  const { mobileView } = useSelector((state) => state.ui);

  const pinnedConversations = conversations.filter((c) => c.isPinned);
  const favoriteConversations = conversations.filter((c) => c.isFavorite);
  const displayConversations =
    filter === 'pinned'
      ? pinnedConversations
      : filter === 'favorites'
        ? favoriteConversations
        : conversations;

  const handleConversationClick = (id) => {
    selectConversation(id);
    if (mobileView) {
      dispatch(setSidebarOpen(false));
    }
  };

  return (
    <div className="flex flex-col h-full bg-dark-surface">
      {/* Header */}
      <div className="p-4 border-b border-dark-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-dark-text">Messages</h1>
          <div className="flex items-center gap-2">
            {mobileView && (
              <button
                onClick={() => dispatch(setSidebarOpen(false))}
                className="p-2 hover:bg-dark-surface-alt rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div onClick={() => dispatch(toggleSearch())} className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-2 bg-dark-surface-alt px-3 py-2 rounded-lg border border-glass hover:border-glass-light transition-all">
            <Search size={16} className="text-dark-text-muted" />
            <span className="text-sm text-dark-text-muted">Search or start new chat...</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-3 flex gap-2 border-b border-dark-border overflow-x-auto">
        {[
          { id: 'all', label: 'All' },
          { id: 'pinned', label: 'Pinned', icon: Pin, count: pinnedConversations.length },
          { id: 'favorites', label: 'Favorites', icon: Star, count: favoriteConversations.length },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`relative px-3 py-1 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filter === tab.id
                  ? 'text-primary bg-primary/10'
                  : 'text-dark-text-secondary hover:text-dark-text'
              }`}
            >
              {Icon && <Icon size={14} />}
              {tab.label}
              {tab.count && (
                <span className="ml-1 px-2 py-0.5 bg-dark-surface-alt rounded text-xs">
                  {tab.count}
                </span>
              )}
              {filter === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 border border-primary/20 rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <motion.div layout className="p-2">
            <AnimatePresence>
              {displayConversations.length > 0 ? (
                displayConversations.map((conversation, index) => (
                  <motion.div
                    key={conversation._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleConversationClick(conversation._id)}
                  >
                    <ConversationItem conversation={conversation} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-dark-text-muted">
                  <p className="text-sm">No conversations</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Footer - Actions */}
      <div className="p-4 border-t border-dark-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(setNotificationsOpen(true))}
            className="p-2 hover:bg-dark-surface-alt rounded-lg transition-colors relative"
          >
            <Bell size={20} />
            <div className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(setSettingsOpen(true))}
            className="p-2 hover:bg-dark-surface-alt rounded-lg transition-colors"
          >
            <Settings size={20} />
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
        >
          <Plus size={20} />
        </motion.button>
      </div>
    </div>
  );
}
