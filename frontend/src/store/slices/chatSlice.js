import { createSlice } from '@reduxjs/toolkit';
import { fetchConversation } from '../actions/conversation.actions.js';
import { fetchMessages } from '../actions/message.actions.js';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    messages: {},
    chatInfo: {},
    pagination: {},
    messagesLoading: false,
    currentConversationId: null,
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
      
      const messageId = message._id || message.id;
      const exists = state.messages[conversationId].some(
        (m) => (m._id === messageId || m.id === messageId)
      );

      if (!exists) {
        state.messages[conversationId].push(message);
      }
      
      // Update conversation last message
      const conversation = state.conversations.find(
        (c) => c._id === conversationId || c.id === conversationId
      );
      if (conversation) {
        conversation.lastMessage = message;
        conversation.updatedAt = message.createdAt;
        conversation.unread = 0;
      }
    },
    updateChat:(state,action)=>{
      const {chatId,lastMessage}=action.payload;
      console.log('🔧 updateChat called with:', { chatId, lastMessage });
      console.log('🔧 Last message structure:', lastMessage ? {
        _id: lastMessage._id,
        content: lastMessage.content,
        createdAt: lastMessage.createdAt,
        sender: lastMessage.sender
      } : 'null');
      console.log('🔧 Available conversations:', state.conversations.map(c => ({ _id: c._id, name: c.name })));
      
      const conversation=state.conversations.find((c)=>c._id===chatId || c.id===chatId )
      if(conversation){
        conversation.lastMessage=lastMessage;
        conversation.updatedAt=lastMessage?.createdAt || new Date().toISOString();
        conversation.unread=0;
        console.log('✅ Updated conversation:', {
          _id: conversation._id,
          name: conversation.name,
          lastMessage: conversation.lastMessage,
          updatedAt: conversation.updatedAt
        });
      } else {
        console.log('❌ Conversation not found for chatId:', chatId);
      }
    },
    markConversationAsRead: (state, action) => {
      const conversation = state.conversations.find(
        (c) => c._id === action.payload || c.id === action.payload
      );
      if (conversation) {
        conversation.unread = 0;
      }
    },
    togglePinned: (state, action) => {
      const conversation = state.conversations.find(
        (c) => c._id === action.payload || c.id === action.payload
      );
      if (conversation) {
        conversation.isPinned = !conversation.isPinned;
      }
    },
    toggleFavorite: (state, action) => {
      const conversation = state.conversations.find(
        (c) => c._id === action.payload || c.id === action.payload
      );
      if (conversation) {
        conversation.isFavorite = !conversation.isFavorite;
      }
    },
    addReaction: (state, action) => {
      const { conversationId, messageId, emoji } = action.payload;
      const message = state.messages[conversationId]?.find(
        (m) => m._id === messageId || m.id === messageId
      );
      if (message) {
        if (!message.reactions) {
          message.reactions = [];
        }
        const existingReaction = message.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          existingReaction.users += 1;
        } else {
          message.reactions.push({ emoji, users: 1 });
        }
      }
    },
    updateMessageStatus: (state, action) => {
      const { messageId, status, readBy } = action.payload;
      
      // Find and update message across all conversations
      Object.values(state.messages).forEach(messages => {
        const message = messages.find(m => m._id === messageId || m.id === messageId);
        if (message) {
          message.status = status;
          if (readBy) {
            if (!message.readBy) {
              message.readBy = [];
            }
            if (!message.readBy.includes(readBy)) {
              message.readBy.push(readBy);
            }
          }
        }
      });
    },
  },
  extraReducers:(builder)=>{
    builder.addCase(fetchConversation.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchConversation.fulfilled, (state, action) => {
      state.loading = false;
      state.conversations = action.payload;
    });
    builder.addCase(fetchConversation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(fetchMessages.pending, (state) => {
      state.messagesLoading = true;
    });
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.messagesLoading = false;
      const { chatId, messages, chatInfo, pagination } = action.payload;
      // Store messages by chatId
      state.messages[chatId] = messages;
      // Store chat info by chatId
      state.chatInfo[chatId] = chatInfo;
      // Store pagination info by chatId
      state.pagination[chatId] = pagination;
    });
    builder.addCase(fetchMessages.rejected, (state, action) => {
      state.messagesLoading = false;
      state.error = action.payload;
    });
  }
});

export const { 
  setCurrentConversation, 
  addMessage, 
  markConversationAsRead, 
  togglePinned, 
  toggleFavorite,
  addReaction,
  updateChat,
  updateMessageStatus
} = chatSlice.actions;

export default chatSlice.reducer;
