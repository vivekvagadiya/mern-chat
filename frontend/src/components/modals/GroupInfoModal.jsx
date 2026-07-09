import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Users,
  Calendar,
  User,
  Edit2,
  UserPlus,
  LogOut,
  MoreVertical,
  Shield,
  ShieldOff,
  UserMinus,
  ArrowLeft,
  Search,
  Check,
  Trash2,
} from 'lucide-react';
import Avatar from '../common/Avatar.jsx';
import { useToast } from '../ToastContainer.jsx';
import {
  getGroupChatInfo,
  assignAdminRole,
  revokeAdminRole,
  removeMembersFromGroup,
  leaveGroupChat,
  updateGroupChat,
  addMembersToGroupChat,
  searchConversation,
  deleteGroup,
} from '../../api/conversation.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { getTimeStamp } from '../../utils/helper.js';
import { useDispatch } from 'react-redux';
import { fetchConversation } from '../../store/actions/conversation.actions.js';
import { setCurrentConversation } from '../../store/slices/chatSlice.js';

export default function GroupInfoModal({ isOpen, onClose, conversation }) {
  const dispatch = useDispatch();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');
  const toast = useToast();

  // Add members state
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const debounceSearch = useDebounce(searchQuery, 300);

  if (!conversation) return null;

  const fetchInfo = async () => {
    try {
      setLoading(true);
      const response = await getGroupChatInfo(conversation._id);
      setInfo(response);
      setEditNameValue(response.name || conversation.name || '');
    } catch (error) {
      toast.error(error.message || 'Failed to load group info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && conversation?._id) {
      fetchInfo();
    }
  }, [isOpen, conversation?._id]);

  // Reset add member state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsAddingMember(false);
      setSearchQuery('');
      setSelectedUsers([]);
      setSearchResults([]);
    }
  }, [isOpen]);

  // Debounced search for adding new members
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await searchConversation(debounceSearch);
        setSearchResults(result);
      } catch (error) {
        toast.error(error.message || 'Failed to search users');
      }
    };

    if (debounceSearch.trim().length >= 2) {
      fetchUsers();
    } else {
      setSearchResults([]);
    }
  }, [debounceSearch]);

  const handleAddMembersSubmit = async () => {
    if (selectedUsers.length === 0) return;
    try {
      setActionLoading(true);
      const memberIds = selectedUsers.map((u) => u.id);
      await addMembersToGroupChat(conversation._id, memberIds);
      toast.success('Members added successfully');

      setIsAddingMember(false);
      setSelectedUsers([]);
      setSearchQuery('');
      setSearchResults([]);

      fetchInfo();
      dispatch(fetchConversation());
    } catch (error) {
      toast.error(error.message || 'Failed to add members');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMakeAdmin = async (memberId) => {
    try {
      await assignAdminRole(conversation._id, memberId);
      toast.success('Admin assigned successfully');
      setOpenMenuId(null);
      fetchInfo();
    } catch (error) {
      toast.error(error.message || 'Failed to assign admin');
    }
  };

  const handleRevokeAdmin = async (memberId) => {
    try {
      await revokeAdminRole(conversation._id, memberId);
      toast.success('Admin role revoked successfully');
      setOpenMenuId(null);
      fetchInfo();
    } catch (error) {
      toast.error(error.message || 'Failed to revoke admin');
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const response = await removeMembersFromGroup(conversation._id, [memberId]);
      toast.success(response.message || 'Member removed successfully');
      setOpenMenuId(null);
      fetchInfo();
      // dispatch(fetchConversation());
    } catch (error) {
      toast.error(error.message || 'Failed to remove member');
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const response = await leaveGroupChat(conversation._id);
      toast.success(response.message || 'Left group chat successfully');
      onClose();
      dispatch(setCurrentConversation(null));
      dispatch(fetchConversation());
    } catch (error) {
      toast.error(error.message || 'Failed to leave group');
    }
  };

  const handleUpdateName = async () => {
    if (!editNameValue.trim() || editNameValue.trim() === (info.name || conversation.name)) {
      setIsEditingName(false);
      return;
    }
    try {
      await updateGroupChat(conversation._id, { name: editNameValue.trim() });
      toast.success('Group name updated successfully');
      setIsEditingName(false);
      fetchInfo();
      dispatch(fetchConversation());
    } catch (error) {
      toast.error(error.message || 'Failed to update group name');
    }
  };

  const handleDeleteGroup = async () => {
    try {
      const result = await deleteGroup(conversation._id);
      toast.success(result.message || 'Group deleted successfully');
      onClose();
      dispatch(setCurrentConversation(null));
      dispatch(fetchConversation());
    } catch (error) {
      toast.error(error.message || 'Failed to delete group');
    }
  };

  const totalMembersCount = info.members
    ? info.members.length + 1
    : conversation.participants?.length || 0;

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
            <div className="w-full max-w-md bg-dark-surface border border-dark-border rounded-2xl shadow-elevation-3 overflow-hidden flex flex-col max-h-[85vh] pointer-events-auto">
              {/* Header */}
              <div className="p-4 border-b border-dark-border flex items-center justify-between gap-3 bg-dark-surface-alt">
                <div className="flex items-center gap-2">
                  {isAddingMember ? (
                    <button
                      onClick={() => {
                        setIsAddingMember(false);
                        setSelectedUsers([]);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="p-1 hover:bg-dark-surface rounded text-dark-text-muted hover:text-dark-text transition-colors"
                    >
                      <ArrowLeft size={18} />
                    </button>
                  ) : (
                    <Users size={20} className="text-primary" />
                  )}
                  <span className="text-lg font-semibold text-dark-text">
                    {isAddingMember ? 'Add Members' : 'Group Info'}
                  </span>
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
              <div className="p-6 flex-1 overflow-y-auto flex flex-col items-center">
                {isAddingMember ? (
                  <div className="w-full flex-1 flex flex-col space-y-4">
                    {/* Search Input */}
                    <div className="relative w-full">
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-muted"
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search users to add..."
                        className="w-full bg-dark-surface-2 border border-dark-border rounded-lg pl-9 pr-3 py-2 text-sm text-dark-text focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>

                    {/* Selected Members Chips */}
                    {selectedUsers.length > 0 && (
                      <div className="space-y-1.5 w-full">
                        <label className="text-xs font-medium text-dark-text-muted ml-1">
                          Selected Members ({selectedUsers.length})
                        </label>
                        <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto p-2 bg-dark-surface-2 border border-dark-border rounded-lg w-full">
                          {selectedUsers.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center gap-1.5 bg-dark-surface-alt border border-glass-light rounded-full pl-2 pr-1 py-1"
                            >
                              <Avatar
                                size="w-4 h-4"
                                alt={user.name}
                                src={user.avatar}
                                rounded="rounded-full"
                              />
                              <span className="text-xs text-dark-text truncate max-w-[80px] sm:max-w-[120px]">
                                {user.name}
                              </span>
                              <button
                                className="p-0.5 hover:bg-dark-surface-2 rounded-full transition-colors"
                                onClick={() =>
                                  setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id))
                                }
                              >
                                <X size={12} className="text-dark-text-muted hover:text-error" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Search Results List */}
                    <div className="space-y-1.5 w-full flex-1 flex flex-col">
                      <label className="text-xs font-medium text-dark-text-muted ml-1">
                        Suggested
                      </label>
                      <div className="space-y-1 overflow-y-auto max-h-[300px] pr-1">
                        {searchResults?.length === 0 ? (
                          <div className="p-8 text-center">
                            <p className="text-dark-text-muted text-sm">
                              {searchQuery ? 'No results found' : 'Start typing to search...'}
                            </p>
                          </div>
                        ) : (
                          searchResults.map((user) => {
                            const isAlreadyMember = info.members?.some(
                              (m) => (m._id || m.id) === user._id
                            );
                            const isSelected = selectedUsers.some((u) => u.id === user._id);
                            return (
                              <div
                                key={user._id}
                                onClick={() => {
                                  if (isAlreadyMember) return;
                                  if (isSelected) {
                                    setSelectedUsers((prev) =>
                                      prev.filter((u) => u.id !== user._id)
                                    );
                                  } else {
                                    setSelectedUsers((prev) => [
                                      ...prev,
                                      { id: user._id, name: user.username, avatar: user.avatar },
                                    ]);
                                  }
                                }}
                                className={`flex items-center justify-between p-2 rounded-lg transition-colors border ${
                                  isAlreadyMember
                                    ? 'opacity-50 cursor-not-allowed border-transparent bg-dark-surface-2/20'
                                    : isSelected
                                      ? 'bg-primary/5 border-primary/20 cursor-pointer'
                                      : 'hover:bg-dark-surface-2 border-transparent hover:border-dark-border cursor-pointer'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <Avatar
                                    src={user.avatar}
                                    alt={user.username}
                                    size="w-10 h-10"
                                    rounded="rounded-full"
                                  />
                                  <div className="text-left min-w-0 flex-1">
                                    <p className="text-sm font-medium text-dark-text truncate">
                                      {user.username}
                                    </p>
                                    <p className="text-xs text-dark-text-muted truncate">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                                {isAlreadyMember ? (
                                  <span className="text-[10px] uppercase bg-dark-surface-3 text-dark-text-muted px-2 py-1 rounded border border-dark-border font-semibold">
                                    Member
                                  </span>
                                ) : (
                                  <div
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                      isSelected
                                        ? 'bg-primary border-primary'
                                        : 'border-dark-border'
                                    }`}
                                  >
                                    {isSelected && <Check size={12} className="text-white" />}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Avatar
                      src={info.groupAvatar || conversation.groupAvatar || conversation.avatar}
                      alt={info.name || conversation.name || 'Group'}
                      size="w-24 h-24"
                      rounded="rounded-full"
                      className="mb-4 shadow-elevation-2"
                    />

                    <div className="flex items-center gap-2 mb-1 w-full justify-center px-4">
                      {isEditingName ? (
                        <div className="flex items-center gap-2 w-full max-w-[280px]">
                          <input
                            type="text"
                            value={editNameValue}
                            onChange={(e) => setEditNameValue(e.target.value)}
                            className="flex-1 bg-dark-surface-2 border border-dark-border rounded px-2 py-1 text-sm text-dark-text focus:outline-none focus:border-primary"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdateName();
                              if (e.key === 'Escape') {
                                setEditNameValue(info.name || conversation.name);
                                setIsEditingName(false);
                              }
                            }}
                          />
                          <button
                            onClick={handleUpdateName}
                            className="text-xs bg-primary hover:bg-primary-light text-white px-2.5 py-1 rounded transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditNameValue(info.name || conversation.name);
                              setIsEditingName(false);
                            }}
                            className="text-xs bg-dark-surface-2 hover:bg-dark-surface-alt text-dark-text-muted px-2.5 py-1 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-xl font-bold text-dark-text truncate max-w-[240px]">
                            {info.name || conversation.name}
                          </h3>
                          {info.isCurrentUserAdmin && (
                            <button
                              onClick={() => {
                                setEditNameValue(info.name || conversation.name || '');
                                setIsEditingName(true);
                              }}
                              className="p-1 hover:bg-dark-surface-2 rounded-md transition-colors text-dark-text-muted hover:text-primary flex-shrink-0"
                            >
                              <Edit2 size={16} />
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    <p className="text-sm text-dark-text-muted mb-6">{totalMembersCount} Members</p>

                    <div className="w-full space-y-4 mb-6">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-surface-2 border border-dark-border">
                        <Calendar className="text-dark-text-muted" size={18} />
                        <div>
                          <p className="text-xs text-dark-text-muted">Created At</p>
                          <p className="text-sm text-dark-text">
                            {conversation.createdAt
                              ? getTimeStamp(conversation.createdAt)
                              : 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Members List */}
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between mb-2 px-1">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-dark-text-muted" />
                          <span className="text-sm font-medium text-dark-text-muted">
                            Participants ({totalMembersCount})
                          </span>
                        </div>
                        {info.isCurrentUserAdmin && (
                          <button
                            onClick={() => setIsAddingMember(true)}
                            className="flex items-center gap-1 text-xs text-primary hover:text-primary-light transition-colors bg-primary/10 px-2 py-1 rounded-md"
                          >
                            <UserPlus size={14} />
                            <span>Add</span>
                          </button>
                        )}
                      </div>

                      <div className="space-y-1">
                        {info.members && info.members.length > 0 ? (
                          info.members.map((participant) => (
                            <div
                              key={participant._id || participant.id}
                              className="flex items-center justify-between p-2 rounded-lg bg-dark-surface-2 border border-dark-border/50 hover:border-dark-border transition-colors relative animate-fade-in"
                            >
                              <div className="flex items-center gap-3 text-left min-w-0 flex-1">
                                <Avatar
                                  src={participant.avatar}
                                  alt={participant.username || participant.name || 'User'}
                                  size="w-10 h-10"
                                  rounded="rounded-full"
                                  userId={participant._id || participant.id}
                                  showStatus={true}
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                                    <p className="text-sm font-medium text-dark-text truncate max-w-[120px] sm:max-w-[180px]">
                                      {participant.username || participant.name || 'Unknown User'}
                                    </p>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      {participant.isCreator && (
                                        <span className="text-[10px] uppercase tracking-wider bg-warning/20 text-warning px-1.5 py-0.5 rounded font-semibold">
                                          Owner
                                        </span>
                                      )}
                                      {participant.isAdmin && (
                                        <span className="text-[10px] uppercase tracking-wider bg-primary/20 text-primary px-1.5 py-0.5 rounded font-semibold">
                                          Admin
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {(participant.email || participant.status) && (
                                    <p className="text-xs text-dark-text-muted text-left truncate max-w-[150px] sm:max-w-[220px]">
                                      {participant.email || participant.status}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Options Menu */}
                              {info.isCurrentUserAdmin && !participant.isCreator && (
                                <div>
                                  <button
                                    onClick={() =>
                                      setOpenMenuId(
                                        openMenuId === (participant._id || participant.id)
                                          ? null
                                          : participant._id || participant.id
                                      )
                                    }
                                    className="p-1.5 text-dark-text-muted hover:text-dark-text hover:bg-dark-surface-alt rounded-md transition-colors"
                                  >
                                    <MoreVertical size={16} />
                                  </button>

                                  <AnimatePresence>
                                    {openMenuId === (participant._id || participant.id) && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        className="absolute right-0 top-full mt-1 w-40 bg-dark-surface-alt border border-dark-border rounded-lg shadow-elevation-3 py-1 z-10"
                                      >
                                        {participant.isAdmin ? (
                                          <button
                                            onClick={() =>
                                              handleRevokeAdmin(participant._id || participant.id)
                                            }
                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-dark-text hover:bg-dark-surface-2 transition-colors text-left"
                                          >
                                            <ShieldOff size={14} className="text-warning" />
                                            <span>Revoke Admin</span>
                                          </button>
                                        ) : (
                                          <button
                                            onClick={() =>
                                              handleMakeAdmin(participant._id || participant.id)
                                            }
                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-dark-text hover:bg-dark-surface-2 transition-colors text-left"
                                          >
                                            <Shield size={14} className="text-primary" />
                                            <span>Make Admin</span>
                                          </button>
                                        )}
                                        <button
                                          onClick={() =>
                                            handleRemoveMember(participant._id || participant.id)
                                          }
                                          // disabled={info.parti}
                                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-error hover:bg-error/10 transition-colors text-left"
                                        >
                                          <UserMinus size={14} />
                                          <span>Remove</span>
                                        </button>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-dark-text-muted italic p-2 text-center">
                            No participants found
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Leave Group Action */}
                    {info.isCurrentUserCreator ? (
                      <div className="w-full mt-6">
                        <button
                          onClick={handleDeleteGroup}
                          className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-error/10 border border-error/20 hover:bg-error/20 transition-colors text-error font-medium"
                        >
                          <Trash2 size={18} />
                          <span>Delete Group</span>
                        </button>
                      </div>
                    ) : (
                      <div className="w-full mt-6">
                        <button
                          onClick={handleLeaveGroup}
                          className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-error/10 border border-error/20 hover:bg-error/20 transition-colors text-error font-medium"
                        >
                          <LogOut size={18} />
                          <span>Leave Group</span>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              {isAddingMember && (
                <div className="p-4 border-t border-dark-border bg-dark-surface-alt">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setIsAddingMember(false);
                        setSelectedUsers([]);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="flex-1 py-2 bg-dark-surface-2 border border-dark-border hover:bg-dark-surface rounded-lg font-medium text-dark-text transition-all text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={selectedUsers.length === 0 || actionLoading}
                      onClick={handleAddMembersSubmit}
                      className="flex-1 py-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white rounded-lg font-medium shadow-elevation-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    >
                      {actionLoading ? 'Adding...' : 'Add Members'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
