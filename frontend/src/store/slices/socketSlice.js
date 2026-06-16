import { createSlice } from '@reduxjs/toolkit';

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    socket: null,
    connected: false,
    onlineUsers: [],
    userStatuses: {}, // Track individual user statuses
  },
  reducers: {
    setSocket(state, action) {
      state.socket = action.payload;
    },
    setConnected(state, action) {
      state.connected = action.payload;
    },
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
      // Update user statuses based on online users
      state.userStatuses = {};
      action.payload.forEach(user => {
        state.userStatuses[user._id || user.id] = {
          isOnline: true,
          lastSeen: new Date().toISOString(),
          status: user.status || 'online'
        };
      });
    },
    addOnlineUser(state, action) {
      const user = action.payload;
      const userId = user._id || user.id;
      
      // Check if user already exists in online users
      const existingIndex = state.onlineUsers.findIndex(u => (u._id === userId || u.id === userId));
      
      if (existingIndex === -1) {
        state.onlineUsers.push(user);
      }
      
      // Update user status
      state.userStatuses[userId] = {
        isOnline: true,
        lastSeen: new Date().toISOString(),
        status: user.status || 'online'
      };
    },
    removeOnlineUser(state, action) {
      const userId = action.payload.userId || action.payload;
      
      // Remove from online users list
      state.onlineUsers = state.onlineUsers.filter((user) => (user._id !== userId && user.id !== userId));
      
      // Update user status to offline
      if (state.userStatuses[userId]) {
        state.userStatuses[userId] = {
          ...state.userStatuses[userId],
          isOnline: false,
          lastSeen: new Date().toISOString()
        };
      }
    },
    updateUserStatus(state, action) {
      const { userId, status, isOnline } = action.payload;
      if (state.userStatuses[userId]) {
        state.userStatuses[userId] = {
          ...state.userStatuses[userId],
          status: status || state.userStatuses[userId].status,
          isOnline: isOnline !== undefined ? isOnline : state.userStatuses[userId].isOnline,
          lastSeen: new Date().toISOString()
        };
      }
    },
    clearOnlineUsers(state) {
      state.onlineUsers = [];
      state.userStatuses = {};
    },
  },
});

export const { 
  setConnected, 
  setOnlineUsers, 
  addOnlineUser, 
  removeOnlineUser, 
  setSocket, 
  updateUserStatus, 
  clearOnlineUsers 
} = socketSlice.actions;
export default socketSlice.reducer;
