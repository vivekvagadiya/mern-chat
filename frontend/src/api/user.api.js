import axiosInstance from './axios';
import endpoints from './endpoints';

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get(endpoints.auth.profile);
    return response?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await axiosInstance.put(endpoints.auth.profileUpdate, data);
    return response?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};
export const uploadUserAvatar = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.auth.profileAvatar, data);
    return response?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

