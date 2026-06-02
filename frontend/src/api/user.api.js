import axiosInstance from "./axios";
import endpoints from "./endpoints";

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get(endpoints.auth.profile);
    return response?.data;
  } catch (error) {
    // Return consistent error structure
    const errorData = error?.response?.data || {};
    throw {
      message: errorData?.message || "Failed to fetch user profile",
      data: errorData
    };
  }
};
