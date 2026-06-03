import { createSlice } from '@reduxjs/toolkit';

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

export default uiSlice.reducer;
