import { createAsyncThunk } from "@reduxjs/toolkit";
import { getConversation } from "../../api/conversation";

export const fetchConversation = createAsyncThunk(
  "conversation/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getConversation();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch conversation");
    }
  },
);