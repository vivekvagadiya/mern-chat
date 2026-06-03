import { createSlice } from '@reduxjs/toolkit';
import { mockConversations, mockMessages } from '../../mock/data.js';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: mockConversations,
    messages: mockMessages,
    currentConversationId: 'conv-1',
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentConversation: (state, action) => {
      state.currentConversationId = action.payload;
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
      
      // Update conversation last message
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.lastMessage = message.content;
        conversation.timestamp = message.timestamp;
        conversation.unread = 0;
      }
    },
    markAsRead: (state, action) => {
      const conversation = state.conversations.find(c => c.id === action.payload);
      if (conversation) {
        conversation.unread = 0;
      }
    },
    togglePinned: (state, action) => {
      const conversation = state.conversations.find(c => c.id === action.payload);
      if (conversation) {
        conversation.isPinned = !conversation.isPinned;
      }
    },
    toggleFavorite: (state, action) => {
      const conversation = state.conversations.find(c => c.id === action.payload);
      if (conversation) {
        conversation.isFavorite = !conversation.isFavorite;
      }
    },
    addReaction: (state, action) => {
      const { conversationId, messageId, emoji } = action.payload;
      const message = state.messages[conversationId]?.find(m => m.id === messageId);
      if (message) {
        const existingReaction = message.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          existingReaction.users += 1;
        } else {
          message.reactions.push({ emoji, users: 1 });
        }
      }
    },
  },
});

export const { 
  setCurrentConversation, 
  addMessage, 
  markAsRead, 
  togglePinned, 
  toggleFavorite,
  addReaction,
} = chatSlice.actions;

export default chatSlice.reducer;
