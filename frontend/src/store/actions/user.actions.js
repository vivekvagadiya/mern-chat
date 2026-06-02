import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProfile } from "../../api/user.api";

export const fetchUserProfile = createAsyncThunk(
  "user/profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfile();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch user profile",
      );
    }
  },
);
