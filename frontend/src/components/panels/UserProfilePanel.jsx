import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Phone, Video, MoreVertical, MapPin, Briefcase } from 'lucide-react';
import { setUserProfileOpen } from '../../store/slices/uiSlice';

export default function UserProfilePanel() {
  const dispatch = useDispatch();
  const { userProfileOpen } = useSelector(state => state.ui);
  const selectedUser = useSelector(state => state.users.selectedUser);

  // Mock user profile
  const user = selectedUser || {
    id: '1',
    name: 'Sarah Chen',
    avatar: '🧑‍💼',
    status: 'online',
    bio: 'Product Designer | Building great things',
    email: 'sarah@startup.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    role: 'Product Designer',
    mutualGroups: 4,
    sharedMedia: 12,
    sharedLinks: 8,
  };

  return (
    <AnimatePresence>
      {userProfileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setUserProfileOpen(false))}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', bounce: 0.2 }}
            className="fixed right-0 top-0 bottom-0 w-96 max-w-full bg-dark-surface border-l border-dark-border z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 p-4 border-b border-dark-border flex items-center justify-between bg-dark-surface-alt z-10">
              <h2 className="font-semibold text-dark-text">Profile</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch(setUserProfileOpen(false))}
                className="p-1.5 hover:bg-dark-surface rounded text-dark-text-muted hover:text-dark-text transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Avatar & Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-5xl mx-auto mb-4">
                  {user.avatar}
                </div>

                <h3 className="text-lg font-bold text-dark-text">{user.name}</h3>
                <p className="text-sm text-dark-text-muted mt-1">{user.role}</p>

                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-xs text-success font-medium">Active now</span>
                </div>
              </motion.div>

              {/* Bio */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-6 p-4 bg-dark-surface-alt rounded-lg border border-glass-light"
              >
                <p className="text-sm text-dark-text">{user.bio}</p>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 mb-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                >
                  <Phone size={16} />
                  Call
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                >
                  <Video size={16} />
                  Video
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-dark-surface-alt hover:bg-dark-surface-2 text-dark-text-muted rounded-lg transition-colors"
                >
                  <MoreVertical size={16} />
                </motion.button>
              </motion.div>

              {/* Info Sections */}
              <div className="space-y-4">
                {/* Contact */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="text-xs font-bold text-dark-text-muted uppercase tracking-wide mb-3">
                    Contact
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-dark-surface-alt rounded-lg group cursor-pointer hover:bg-dark-surface-2 transition-colors">
                      <div>
                        <p className="text-xs text-dark-text-muted">Email</p>
                        <p className="text-sm text-dark-text font-medium">{user.email}</p>
                      </div>
                      <Copy size={14} className="text-dark-text-muted group-hover:text-dark-text transition-colors" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-dark-surface-alt rounded-lg group cursor-pointer hover:bg-dark-surface-2 transition-colors">
                      <div className="flex items-center gap-2">
                        <Briefcase size={14} className="text-dark-text-muted" />
                        <div>
                          <p className="text-xs text-dark-text-muted">Role</p>
                          <p className="text-sm text-dark-text font-medium">{user.role}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-dark-surface-alt rounded-lg group cursor-pointer hover:bg-dark-surface-2 transition-colors">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-dark-text-muted" />
                        <div>
                          <p className="text-xs text-dark-text-muted">Location</p>
                          <p className="text-sm text-dark-text font-medium">{user.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h4 className="text-xs font-bold text-dark-text-muted uppercase tracking-wide mb-3">
                    Activity
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Groups', value: user.mutualGroups },
                      { label: 'Media', value: user.sharedMedia },
                      { label: 'Links', value: user.sharedLinks },
                    ].map((stat) => (
                      <div key={stat.label} className="p-3 bg-dark-surface-alt rounded-lg text-center">
                        <p className="text-lg font-bold text-primary">{stat.value}</p>
                        <p className="text-xs text-dark-text-muted mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
