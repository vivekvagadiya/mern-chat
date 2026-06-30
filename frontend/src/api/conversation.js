import axiosInstance from './axios';

export const getConversation = async () => {
  try {
    const response = await axiosInstance.get('/chat/get-user-chats');
    return response?.data?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

export const searchConversation = async (search) => {
  try {
    const response = await axiosInstance.get('chat/search', {
      params: {
        query: search,
      },
    });
    return response?.data?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

export const createDirectConversation = async (data) => {
  try {
    const response = await axiosInstance.post('chat/create-chat', data);
    return response?.data?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};
export const createGroupChat = async (data) => {
  try {
    const response = await axiosInstance.post('chat/create-group-chat', data);
    return response?.data?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

export const clearChat = async (chatId) => {
  try {
    const response = await axiosInstance.delete(`chat/clear-chat/${chatId}`);
    return response?.data?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};
