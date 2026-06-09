import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMessages } from '../../api/message.api';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getMessages(params);
      console.log('vivek',response,params)
      // Extract the data and pagination from the response
      return {
        chatId: params.chatId,
        messages: response.messages,
        chatInfo: response.chatInfo,
        pagination: response.pagination,
        // For backward compatibility, also return the full response
        fullResponse: response
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
