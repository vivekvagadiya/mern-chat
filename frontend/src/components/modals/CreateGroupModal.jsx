import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, User, Users, Check } from 'lucide-react';
import { setCreateGroupToggle } from '../../store/slices/uiSlice.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useToast } from '../ToastContainer.jsx';
import { createGroupChat, searchConversation } from '../../api/conversation.js';
import Avatar from '../common/Avatar.jsx';
import { setCurrentConversation } from '../../store/slices/chatSlice.js';

export default function CreateGroupModal() {
  const dispatch = useDispatch();
  const { createGroup } = useSelector((state) => state.ui);
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(selectedUsers);
  const [users, setUsers] = useState([]);
  const toast = useToast();

  // Reset state when modal closes
  useEffect(() => {
    if (!createGroup) {
      setGroupName('');
      setSearchQuery('');
      setSelectedUsers([]);
      setUsers([]);
    }
  }, [createGroup]);

  const debounceSearch = useDebounce(searchQuery, 300);
  const getConversation = async () => {
    try {
      const result = await searchConversation(debounceSearch);
      setUsers(result);
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

  const handleCreation = async () => {
    if (selectedUsers?.length < 2) {
      toast.error('Please select at least 2 users');
      return;
    }
    const payload = {
      name: groupName,
      participantIds: selectedUsers.map((user) => user.id),
    };
    setLoading(true);
    try {
      const response = await createGroupChat(payload);
      console.log(response);
      dispatch(setCreateGroupToggle(false));
      dispatch(setCurrentConversation(response?._id));
      toast.success(response?.message || 'Group chat created successfully');
    } catch (error) {
      toast.error(error?.message || 'Failed to create group chat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {createGroup && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setCreateGroupToggle(false))}
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
            <div className="w-full max-w-md bg-dark-surface border border-dark-border rounded-2xl shadow-elevation-3 overflow-hidden flex flex-col max-h-[85vh] pointer-events-auto">
              {/* Header */}
              <div className="p-4 border-b border-dark-border flex items-center justify-between gap-3 bg-dark-surface-alt">
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-primary" />
                  <span className="text-lg font-semibold">Create Group</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => dispatch(setCreateGroupToggle(false))}
                  className="p-1.5 hover:bg-dark-surface rounded text-dark-text-muted hover:text-dark-text transition-colors"
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 overflow-y-auto space-y-4">
                {/* Group Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-dark-text-muted ml-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                    className="w-full bg-dark-surface-2 border border-dark-border rounded-lg px-3 py-2.5 text-sm text-dark-text focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Selected Members Chips */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-dark-text-muted ml-1">
                    Selected Members ({selectedUsers.length})
                  </label>
                  <div className="flex flex-wrap gap-2 min-h-[44px] p-2 bg-dark-surface-2 border border-dark-border rounded-lg">
                    {selectedUsers.length > 0 ? (
                      selectedUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-1.5 bg-dark-surface-alt border border-glass-light rounded-full pl-2 pr-1 py-1"
                        >
                          {/* <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                            <User size={10} className="text-primary" />
                          </div> */}
                          <Avatar
                            size="w-4 h-4"
                            alt={user.username}
                            src={user.avatar}
                            fallback={<User size={10} />}
                            rounded="rounded-full"
                          />
                          <span className="text-xs text-dark-text truncate max-w-[80px] sm:max-w-[120px]">{user.name}</span>
                          <button
                            className="p-0.5 hover:bg-dark-surface-2 rounded-full transition-colors"
                            onClick={() =>
                              setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id))
                            }
                          >
                            <X size={12} className="text-dark-text-muted hover:text-error" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-dark-text-muted flex items-center ml-1">
                        No members selected
                      </span>
                    )}
                  </div>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-muted"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users to add..."
                    className="w-full bg-dark-surface-2 border border-dark-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-dark-text focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Search Results List */}
                <div className="space-y-1.5 mt-2">
                  <label className="text-xs font-medium text-dark-text-muted ml-1">Suggested</label>
                  <div className="space-y-1">
                    {/* Dummy results for UI preview */}
                    {users?.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-dark-text-muted text-sm">
                          {searchQuery ? 'No results found' : 'Start typing to search...'}
                        </p>
                      </div>
                    ) : (
                      users.map((user) => {
                        const isSelected = selectedUsers.some((u) => u.id === user._id);
                        return (
                          <div
                            key={user._id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedUsers((prev) => prev.filter((u) => u.id !== user._id));
                              } else {
                                setSelectedUsers((prev) => [
                                  ...prev,
                                  { id: user._id, name: user.username, avatar: user.avatar },
                                ]);
                              }
                            }}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors border ${isSelected ? 'bg-primary/5 border-primary/20' : 'hover:bg-dark-surface-2 border-transparent hover:border-dark-border'}`}
                          >
                            <div className="flex items-center gap-3">
                              {/* <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0"> */}
                              {/* <User size={20} className="text-primary" /> */}
                              <Avatar
                                src={user.avatar}
                                alt={user.username}
                                size="w-10 h-10"
                                rounded="rounded-full"
                              />
                              {/* </div> */}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-dark-text truncate">
                                  {user.username}
                                </p>
                                <p className="text-xs text-dark-text-muted truncate">{user.email}</p>
                              </div>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-primary border-primary' : 'border-dark-border'}`}
                            >
                              {isSelected && <Check size={12} className="text-white" />}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-dark-border bg-dark-surface-alt">
                <button
                  disabled={!groupName.trim() || selectedUsers.length === 0}
                  onClick={handleCreation}
                  className="w-full py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white rounded-lg font-medium shadow-elevation-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Group
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
