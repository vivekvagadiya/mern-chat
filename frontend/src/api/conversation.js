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
export const deleteChat = async (chatId) => {
  try {
    const response = await axiosInstance.delete(`chat/delete-chat/${chatId}`);
    return response?.data?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

export const getGroupChatInfo = async (chatId) => {
  try {
    const response = await axiosInstance.get(`chat/group-chat-info/${chatId}`);
    return response?.data?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

export const addMembersToGroupChat = async (chatId, memberIds) => {
  try {
    const response = await axiosInstance.post(`chat/add-members-to-group-chat/${chatId}`, { memberIds });
    return response?.data?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

export const removeMembersFromGroup = async (chatId, memberIds) => {
  try {
    const response = await axiosInstance.post(`chat/remove-members-from-group/${chatId}`, { memberIds });
    return response?.data?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

export const assignAdminRole = async (chatId, memberId) => {
  try {
    const response = await axiosInstance.post(`chat/assign-admin-role/${chatId}`, { memberId });
    return response?.data?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

export const revokeAdminRole = async (chatId, memberId) => {
  try {
    const response = await axiosInstance.post(`chat/revoke-admin-role/${chatId}`, { memberId });
    return response?.data?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

export const leaveGroupChat = async (chatId) => {
  try {
    const response = await axiosInstance.post(`chat/leave-group-chat/${chatId}`);
    return response?.data?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

export const updateGroupChat = async (chatId, data) => {
  try {
    const response = await axiosInstance.put(`chat/update-group-chat/${chatId}`, data);
    return response?.data?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

