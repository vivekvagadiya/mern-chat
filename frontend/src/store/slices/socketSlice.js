import { createSlice } from '@reduxjs/toolkit';

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    connected: false,
    onlineUsers: [],
  },
  reducers: {
    setConnected(state, action) {
      state.connected = action.payload;
    },
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
    addOnlineUsers(state, action) {
      state.onlineUsers.push(action.payload);
    },
    removeOnlineUser(state, action) {
      state.onlineUsers = state.onlineUsers.filter((user) => user.id != action.payload.userId);
    },

  },
});

export const { setConnected, setOnlineUsers, addOnlineUsers, removeOnlineUser } =
  socketSlice.actions;
export default socketSlice.reducer;
