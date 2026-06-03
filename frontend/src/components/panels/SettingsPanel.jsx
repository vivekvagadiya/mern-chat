import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Moon,
  Sun,
  Bell,
  Lock,
  Palette,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setSettingsOpen } from '../../store/slices/uiSlice';
import { useToast } from '../ToastContainer';
import { logoutApi } from '../../api/auth.api';
import { logout } from '../../store/slices/authSlice';

export default function SettingsPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast=useToast();
  const { settingsOpen } = useSelector(state => state.ui);
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    emailNotifications: false,
    privateMessages: 'friends',
    onlineStatus: 'everyone',
  });

  const sections = [
    { id: 'general', label: 'General', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Safety', icon: Lock },
  ];

  const handleLogout=async()=>{
    try {
      await logoutApi();
      toast.success('Logout successful!');
      dispatch(setSettingsOpen(false));
      dispatch(logout());
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to logout');
    }
  }

  return (
    <AnimatePresence>
      {settingsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setSettingsOpen(false))}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', bounce: 0.2 }}
            className="fixed right-0 top-0 bottom-0 w-96 max-w-full bg-dark-surface border-l border-dark-border z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-dark-border flex items-center justify-between bg-dark-surface-alt sticky top-0 z-10">
              <h2 className="font-semibold text-dark-text">Settings</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch(setSettingsOpen(false))}
                className="p-1.5 hover:bg-dark-surface rounded text-dark-text-muted hover:text-dark-text transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            <div className="flex-1 overflow-hidden flex">
              {/* Sidebar */}
              <div className="w-40 border-r border-dark-border bg-dark-surface-2 overflow-y-auto">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <motion.button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full px-4 py-3 text-left text-sm font-medium transition-all flex items-center gap-2 ${
                        activeSection === section.id
                          ? 'bg-primary/10 text-primary border-l-2 border-primary'
                          : 'text-dark-text-secondary hover:text-dark-text'
                      }`}
                    >
                      <Icon size={16} />
                      {section.label}
                    </motion.button>
                  );
                })}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  {activeSection === 'general' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-bold text-dark-text mb-4">Appearance</h3>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-surface-alt cursor-pointer transition-colors">
                            <input
                              type="radio"
                              checked={settings.theme === 'dark'}
                              onChange={() => setSettings({ ...settings, theme: 'dark' })}
                              className="w-4 h-4 accent-primary"
                            />
                            <div className="flex items-center gap-2">
                              <Moon size={16} />
                              <span className="text-sm text-dark-text">Dark Mode</span>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-surface-alt cursor-pointer transition-colors opacity-50">
                            <input
                              type="radio"
                              disabled
                              className="w-4 h-4 accent-primary"
                            />
                            <div className="flex items-center gap-2">
                              <Sun size={16} />
                              <span className="text-sm text-dark-text">Light Mode (Coming Soon)</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-dark-border">
                        <h3 className="text-sm font-bold text-dark-text mb-4">About</h3>
                        <div className="space-y-2 text-sm text-dark-text-muted">
                          <p>Version 1.0.0</p>
                          <p>© 2024 Premium Chat. All rights reserved.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'notifications' && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-dark-text mb-4">Notification Settings</h3>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-dark-surface-alt rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-dark-text">Push Notifications</p>
                            <p className="text-xs text-dark-text-muted mt-1">Receive in-app notifications</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                            className={`relative w-10 h-6 rounded-full transition-colors ${
                              settings.notifications ? 'bg-primary' : 'bg-dark-surface-2'
                            }`}
                          >
                            <motion.div
                              animate={{ x: settings.notifications ? 18 : 2 }}
                              className="absolute top-1 w-4 h-4 rounded-full bg-white"
                            />
                          </motion.button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-dark-surface-alt rounded-lg opacity-50">
                          <div>
                            <p className="text-sm font-medium text-dark-text">Email Notifications</p>
                            <p className="text-xs text-dark-text-muted mt-1">Receive email digests</p>
                          </div>
                          <motion.button
                            disabled
                            className="relative w-10 h-6 rounded-full bg-dark-surface-2"
                          >
                            <motion.div
                              className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white"
                            />
                          </motion.button>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-dark-border">
                        <h4 className="text-xs font-bold text-dark-text-muted uppercase mb-3">Notification Types</h4>
                        <div className="space-y-2">
                          {[
                            'Direct messages',
                            'Group mentions',
                            'Reactions',
                            'Friend requests',
                          ].map((type) => (
                            <label key={type} className="flex items-center gap-3 p-2 hover:bg-dark-surface-alt rounded transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                defaultChecked
                                className="w-4 h-4 accent-primary rounded"
                              />
                              <span className="text-sm text-dark-text">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'privacy' && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-dark-text mb-4">Privacy & Safety</h3>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-dark-text block mb-2">
                            Who can message you?
                          </label>
                          <select
                            value={settings.privateMessages}
                            onChange={(e) => setSettings({ ...settings, privateMessages: e.target.value })}
                            className="w-full px-3 py-2 bg-dark-surface-alt border border-dark-border rounded-lg text-sm text-dark-text outline-none focus:border-primary/50"
                          >
                            <option value="everyone">Everyone</option>
                            <option value="friends">Friends only</option>
                            <option value="none">No one</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-dark-text block mb-2">
                            Online status visibility
                          </label>
                          <select
                            value={settings.onlineStatus}
                            onChange={(e) => setSettings({ ...settings, onlineStatus: e.target.value })}
                            className="w-full px-3 py-2 bg-dark-surface-alt border border-dark-border rounded-lg text-sm text-dark-text outline-none focus:border-primary/50"
                          >
                            <option value="everyone">Everyone</option>
                            <option value="friends">Friends only</option>
                            <option value="nobody">Nobody</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-dark-border">
                        <h4 className="text-xs font-bold text-dark-text-muted uppercase mb-3">Account</h4>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full px-4 py-2.5 bg-error/10 hover:bg-error/20 text-error rounded-lg transition-colors flex items-center justify-between font-medium text-sm"
                          onClick={handleLogout}
                        >
                          <span>Logout</span>
                          <LogOut size={16} />
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
