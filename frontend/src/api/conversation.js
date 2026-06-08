import axiosInstance from './axios';

export const getConversation = async () => {
  try {
    const response = await axiosInstance.get('/chat/get-user-chats');
    return response?.data?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};
