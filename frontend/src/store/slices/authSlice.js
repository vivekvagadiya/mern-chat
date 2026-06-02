import { createSlice } from '@reduxjs/toolkit';
import { fetchUserProfile } from '../actions/user.actions';
import { tokenService } from '../../api/tokenService';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false, // Track if auth has been initialized
  },
  reducers: {
    login(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      // Clear tokens on logout
      tokenService.clearTokens();
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setInitialized(state, action) {
      state.isInitialized = action.payload;
    },
    // Update user profile data
    updateUserProfile(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.data;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        // Clear invalid tokens
        tokenService.clearTokens();
      });
  },
});

export const { login, logout, setLoading, setInitialized, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
