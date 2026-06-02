import { configureStore, createSlice } from '@reduxjs/toolkit';
import { mockConversations, mockMessages, mockUsers, mockNotifications } from '../mock/data.js';

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      id: 'current',
      name: 'You',
      email: 'user@startup.com',
      avatar: '👤',
      status: 'online',
    },
    isAuthenticated: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

// Chat Slice
const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: mockConversations,
    messages: mockMessages,
    currentConversationId: 'conv-1',
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentConversation: (state, action) => {
      state.currentConversationId = action.payload;
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
      
      // Update conversation last message
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.lastMessage = message.content;
        conversation.timestamp = message.timestamp;
        conversation.unread = 0;
      }
    },
    markAsRead: (state, action) => {
      const conversation = state.conversations.find(c => c.id === action.payload);
      if (conversation) {
        conversation.unread = 0;
      }
    },
    togglePinned: (state, action) => {
      const conversation = state.conversations.find(c => c.id === action.payload);
      if (conversation) {
        conversation.isPinned = !conversation.isPinned;
      }
    },
    toggleFavorite: (state, action) => {
      const conversation = state.conversations.find(c => c.id === action.payload);
      if (conversation) {
        conversation.isFavorite = !conversation.isFavorite;
      }
    },
    addReaction: (state, action) => {
      const { conversationId, messageId, emoji } = action.payload;
      const message = state.messages[conversationId]?.find(m => m.id === messageId);
      if (message) {
        const existingReaction = message.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          existingReaction.users += 1;
        } else {
          message.reactions.push({ emoji, users: 1 });
        }
      }
    },
  },
});

// UI Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    searchOpen: false,
    notificationsOpen: false,
    userProfileOpen: false,
    settingsOpen: false,
    theme: 'dark',
    mobileView: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
    setSearchOpen: (state, action) => {
      state.searchOpen = action.payload;
    },
    toggleNotifications: (state) => {
      state.notificationsOpen = !state.notificationsOpen;
    },
    setNotificationsOpen: (state, action) => {
      state.notificationsOpen = action.payload;
    },
    toggleUserProfile: (state) => {
      state.userProfileOpen = !state.userProfileOpen;
    },
    setUserProfileOpen: (state, action) => {
      state.userProfileOpen = action.payload;
    },
    toggleSettings: (state) => {
      state.settingsOpen = !state.settingsOpen;
    },
    setSettingsOpen: (state, action) => {
      state.settingsOpen = action.payload;
    },
    setMobileView: (state, action) => {
      state.mobileView = action.payload;
    },
  },
});

// Users Slice
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    all: mockUsers,
    friends: mockUsers.filter(u => u.isFriend),
    selectedUser: null,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = state.all.find(u => u.id === action.payload);
    },
    updateUserStatus: (state, action) => {
      const { userId, status } = action.payload;
      const user = state.all.find(u => u.id === userId);
      if (user) {
        user.status = status;
        user.lastSeen = new Date();
      }
    },
  },
});

// Notifications Slice
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

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    chat: chatSlice.reducer,
    ui: uiSlice.reducer,
    users: usersSlice.reducer,
    notifications: notificationsSlice.reducer,
  },
});

export const { setUser, logout } = authSlice.actions;
export const { 
  setCurrentConversation, 
  addMessage, 
  markAsRead, 
  togglePinned, 
  toggleFavorite,
  addReaction,
} = chatSlice.actions;
export const { 
  toggleSidebar, 
  setSidebarOpen,
  toggleSearch, 
  setSearchOpen,
  toggleNotifications,
  setNotificationsOpen,
  toggleUserProfile,
  setUserProfileOpen,
  toggleSettings,
  setSettingsOpen,
  setMobileView,
} = uiSlice.actions;
export const { setSelectedUser, updateUserStatus } = usersSlice.actions;
export const { 
  addNotification, 
  markNotificationRead, 
  markAllNotificationsRead,
  removeNotification,
} = notificationsSlice.actions;

export default store;
