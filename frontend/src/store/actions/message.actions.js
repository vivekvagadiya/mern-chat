import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMessages, sendMessages } from '../../api/message.api';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getMessages(params);
      return {
        chatId: params.chatId,
        before: params.before,
        messages: response.messages,
        chatInfo: response.chatInfo,
        pagination: response.pagination,
        // For backward compatibility, also return the full response
        fullResponse: response,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const sendMessageAction = createAsyncThunk(
  'messages/sendMessage',
  async (data, { rejectWithValue }) => {
    try {
      const response = await sendMessages(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
