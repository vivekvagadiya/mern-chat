import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import uiReducer from './slices/uiSlice';
import usersReducer from './slices/usersSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    ui: uiReducer,
    users: usersReducer,
    notifications: notificationsReducer,
  },
});

export default store;
