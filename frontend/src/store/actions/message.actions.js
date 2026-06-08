import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMessages } from '../../api/message.api';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getMessages(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
