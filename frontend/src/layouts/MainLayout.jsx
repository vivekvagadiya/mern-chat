import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/layouts/Sidebar';
import ChatArea from '../components/layouts/ChatArea';
import SearchModal from '../components/modals/SearchModal';
import NotificationsPanel from '../components/panels/NotificationsPanel';
import UserProfilePanel from '../components/panels/UserProfilePanel';
import SettingsPanel from '../components/panels/SettingsPanel';
import { setMobileView, setSidebarOpen } from '../store/slices/uiSlice';
import CreateGroupModal from '../components/modals/CreateGroupModal';

export default function MainLayout() {
  const dispatch = useDispatch();
  const { sidebarOpen, mobileView } = useSelector((state) => state.ui);
  const connected = useSelector((state) => state.socket.connected);

  console.log('connected', connected);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      dispatch(setMobileView(isMobile));

      if (isMobile && sidebarOpen) {
        // Don't auto-close on resize, let user control
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch, sidebarOpen]);

  return (
    <div className="flex h-screen bg-dark-bg text-dark-text overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(sidebarOpen || !mobileView) && (
          <motion.div
            key="sidebar"
            initial={mobileView ? { x: -320 } : { x: 0 }}
            animate={{ x: 0 }}
            exit={mobileView ? { x: -320 } : {}}
            transition={{ duration: 0.3 }}
            className={`${
              mobileView ? 'fixed inset-y-0 left-0 z-40' : 'relative'
            } w-80 border-r border-dark-border bg-dark-surface`}
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileView && sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
            onClick={() => dispatch(setSidebarOpen(false))}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatArea />
      </div>

      {/* Modals & Panels */}
      <SearchModal />
      <CreateGroupModal />
      <NotificationsPanel />
      <UserProfilePanel />
      <SettingsPanel />
    </div>
  );
}
