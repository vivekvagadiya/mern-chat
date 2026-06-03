import { createSlice } from '@reduxjs/toolkit';
import { mockUsers } from '../../mock/data.js';

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

export const { setSelectedUser, updateUserStatus } = usersSlice.actions;

export default usersSlice.reducer;
