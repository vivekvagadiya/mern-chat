import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Calendar, User, Edit2, UserPlus, LogOut, MoreVertical, Shield, ShieldOff, UserMinus } from 'lucide-react';
import Avatar from '../common/Avatar.jsx';

export default function GroupInfoModal({ isOpen, onClose, conversation }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  if (!conversation) return null;

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
                  <Users size={20} className="text-primary" />
                  <span className="text-lg font-semibold text-dark-text">Group Info</span>
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
                <Avatar
                  src={conversation.avatar}
                  alt={conversation.name || 'Group'}
                  size="w-24 h-24"
                  rounded="rounded-full"
                  className="mb-4 shadow-elevation-2"
                />
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-dark-text">
                    {conversation.name}
                  </h3>
                  <button className="p-1 hover:bg-dark-surface-2 rounded-md transition-colors text-dark-text-muted hover:text-primary">
                    <Edit2 size={16} />
                  </button>
                </div>
                <p className="text-sm text-dark-text-muted mb-6">
                  {conversation.participants?.length || 0} Members
                </p>

                <div className="w-full space-y-4 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-surface-2 border border-dark-border">
                    <Calendar className="text-dark-text-muted" size={18} />
                    <div>
                      <p className="text-xs text-dark-text-muted">Created At</p>
                      <p className="text-sm text-dark-text">
                        {conversation.createdAt ? new Date(conversation.createdAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Members List */}
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-dark-text-muted" />
                      <span className="text-sm font-medium text-dark-text-muted">Participants ({conversation.participants?.length || 0})</span>
                    </div>
                    <button className="flex items-center gap-1 text-xs text-primary hover:text-primary-light transition-colors bg-primary/10 px-2 py-1 rounded-md">
                      <UserPlus size={14} />
                      <span>Add</span>
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    {conversation.participants && conversation.participants.length > 0 ? (
                      conversation.participants.map((participant) => (
                        <div 
                          key={participant._id || participant.id} 
                          className="flex items-center justify-between p-2 rounded-lg bg-dark-surface-2 border border-dark-border/50 hover:border-dark-border transition-colors relative"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={participant.avatar}
                              alt={participant.username || participant.name || 'User'}
                              size="w-10 h-10"
                              rounded="rounded-full"
                              userId={participant._id || participant.id}
                              showStatus={true}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-dark-text">
                                  {participant.username || participant.name || 'Unknown User'}
                                </p>
                                {participant.role === 'admin' && (
                                  <span className="text-[10px] uppercase tracking-wider bg-primary/20 text-primary px-1.5 py-0.5 rounded">Admin</span>
                                )}
                              </div>
                              {(participant.email || participant.status) && (
                                <p className="text-xs text-dark-text-muted">
                                  {participant.email || participant.status}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Options Menu */}
                          <div>
                            <button 
                              onClick={() => setOpenMenuId(openMenuId === (participant._id || participant.id) ? null : (participant._id || participant.id))}
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
                                  <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-dark-text hover:bg-dark-surface-2 transition-colors">
                                    <Shield size={14} className="text-primary" />
                                    <span>Make Admin</span>
                                  </button>
                                  <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-dark-text hover:bg-dark-surface-2 transition-colors">
                                    <ShieldOff size={14} className="text-warning" />
                                    <span>Revoke Admin</span>
                                  </button>
                                  <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-error hover:bg-error/10 transition-colors">
                                    <UserMinus size={14} />
                                    <span>Remove</span>
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-dark-text-muted italic p-2 text-center">No participants found</p>
                    )}
                  </div>
                </div>

                {/* Leave Group Action */}
                <div className="w-full mt-6">
                  <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-error/10 border border-error/20 hover:bg-error/20 transition-colors text-error font-medium">
                    <LogOut size={18} />
                    <span>Leave Group</span>
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
