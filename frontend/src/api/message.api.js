import axiosInstance from './axios';

export const getMessages = async (params) => {
  try {
    const response = await axiosInstance.get('/messages/', { params });
    return response?.data?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

export const sendMessages = async (data) => {
  try {
    const response = await axiosInstance.post('/messages/send', data);
    return response?.data?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};
