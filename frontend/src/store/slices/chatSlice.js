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
      const {chatId,lastMessage,currentUserId}=action.payload;
      const conversation=state.conversations.find((c)=>c._id===chatId || c.id===chatId )
      if(conversation){
        conversation.lastMessage=lastMessage;
        conversation.updatedAt=lastMessage?.createdAt || new Date().toISOString();
        
        // Only increment unread count if current user is not the sender
        if (currentUserId && lastMessage?.senderId !== currentUserId) {
          conversation.unread = (conversation.unread || 0) + 1;
        }
        
        state.conversations.sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt));
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
      const { messageId, status, readBy, deliveredTo } = action.payload;
      
      // Find and update message across all conversations
      Object.values(state.messages).forEach(messages => {
        const message = messages.find(m => m._id === messageId || m.id === messageId);
        if (message) {
          message.status = status;
          
          // Handle read status
          if (readBy) {
            if (!message.readBy) {
              message.readBy = [];
            }
            // Check if user already in readBy
            const existingReadIndex = message.readBy.findIndex(r => 
              typeof r === 'object' ? r.userId === readBy : r === readBy
            );
            if (existingReadIndex === -1) {
              message.readBy.push({
                userId: readBy,
                readAt: new Date()
              });
            }
          }
          
          // Handle delivery status
          if (deliveredTo) {
            if (!message.deliveredTo) {
              message.deliveredTo = [];
            }
            // Check if user already in deliveredTo
            const existingDeliveredIndex = message.deliveredTo.findIndex(d => 
              typeof d === 'object' ? d.userId === deliveredTo : d === deliveredTo
            );
            if (existingDeliveredIndex === -1) {
              message.deliveredTo.push({
                userId: deliveredTo,
                deliveredAt: new Date()
              });
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
