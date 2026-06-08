import axiosInstance from './axios';

export const getMessages = async (params) => {
  try {
    const response = await axiosInstance.get('/messages/', { params });
    return response?.data?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};
