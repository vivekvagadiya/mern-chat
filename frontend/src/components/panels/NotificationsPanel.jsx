import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Trash2, Bell } from 'lucide-react';
import {
  setNotificationsOpen,
  markNotificationRead,
  removeNotification,
  markAllNotificationsRead,
} from '../../store/index.js';

export default function NotificationsPanel() {
  const dispatch = useDispatch();
  const { notificationsOpen } = useSelector(state => state.ui);
  const { items: notifications, unreadCount } = useSelector(state => state.notifications);

  return (
    <AnimatePresence>
      {notificationsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setNotificationsOpen(false))}
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
            <div className="p-4 border-b border-dark-border flex items-center justify-between bg-dark-surface-alt">
              <div className="flex items-center gap-3">
                <Bell size={20} />
                <div>
                  <h2 className="font-semibold text-dark-text">Notifications</h2>
                  {unreadCount > 0 && (
                    <p className="text-xs text-dark-text-muted">{unreadCount} unread</p>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch(setNotificationsOpen(false))}
                className="p-1.5 hover:bg-dark-surface rounded text-dark-text-muted hover:text-dark-text transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Action Bar */}
            {unreadCount > 0 && (
              <div className="px-4 py-2 bg-dark-surface-alt border-b border-dark-border flex items-center justify-between">
                <span className="text-xs text-dark-text-muted">{unreadCount} new notifications</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => dispatch(markAllNotificationsRead())}
                  className="text-xs font-medium text-primary hover:text-primary-light transition-colors"
                >
                  Mark all as read
                </motion.button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <div className="w-12 h-12 rounded-full bg-dark-surface-alt flex items-center justify-center mx-auto mb-3">
                      <Bell size={24} className="text-dark-text-muted" />
                    </div>
                    <p className="text-sm text-dark-text-muted">No notifications yet</p>
                  </div>
                </div>
              ) : (
                <motion.div layout className="divide-y divide-dark-border">
                  {notifications.map((notif, index) => (
                    <motion.div
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 hover:bg-dark-surface-alt transition-colors cursor-pointer group ${
                        !notif.read ? 'bg-primary/5 border-l-2 border-primary' : ''
                      }`}
                      onClick={() => {
                        if (!notif.read) {
                          dispatch(markNotificationRead(notif.id));
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 text-lg">
                          {notif.avatar}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-dark-text">{notif.title}</p>
                          <p className="text-xs text-dark-text-muted mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="text-xs text-dark-text-muted mt-2">
                            {new Date(notif.timestamp).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </p>
                        </div>

                        {!notif.read && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>

                      {/* Actions */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="flex items-center gap-2 mt-3 ml-13"
                      >
                        {!notif.read && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(markNotificationRead(notif.id));
                            }}
                            className="text-xs flex items-center gap-1.5 text-dark-text-muted hover:text-primary transition-colors"
                          >
                            <Check size={12} />
                            Mark as read
                          </motion.button>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(removeNotification(notif.id));
                          }}
                          className="text-xs flex items-center gap-1.5 text-dark-text-muted hover:text-error transition-colors"
                        >
                          <Trash2 size={12} />
                          Dismiss
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
