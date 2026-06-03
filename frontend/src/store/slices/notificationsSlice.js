import { createSlice } from '@reduxjs/toolkit';
import { mockNotifications } from '../../mock/data.js';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: mockNotifications,
    unreadCount: mockNotifications.filter(n => !n.read).length,
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
    markNotificationRead: (state, action) => {
      const notif = state.items.find(n => n.id === action.payload);
      if (notif && !notif.read) {
        notif.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllNotificationsRead: (state) => {
      state.items.forEach(n => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
    removeNotification: (state, action) => {
      const notif = state.items.find(n => n.id === action.payload);
      if (notif && !notif.read) {
        state.unreadCount -= 1;
      }
      state.items = state.items.filter(n => n.id !== action.payload);
    },
  },
});

export const { 
  addNotification, 
  markNotificationRead, 
  markAllNotificationsRead,
  removeNotification,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
