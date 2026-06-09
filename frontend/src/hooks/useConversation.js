import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversation } from '../store/actions/conversation.actions';
import { fetchMessages } from '../store/actions/message.actions';
import { markConversationAsRead, setCurrentConversation } from '../store/slices/chatSlice';
import socketService from '../services/socket.service';

export const useConversation = () => {
  const dispatch = useDispatch();
  const { conversations, currentConversationId, messages, chatInfo, pagination, loading, messagesLoading, error } =
    useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchConversation());
  }, [dispatch]);

  useEffect(() => {
    if (currentConversationId) {
      socketService.joinRoom(currentConversationId);
      dispatch(fetchMessages({ chatId: currentConversationId }));
      dispatch(markConversationAsRead(currentConversationId));
    }
    // return () => {
    //   if (currentConversationId) {
    //     socketService.leaveRoom(currentConversationId);
    //   }
    // };
  }, [currentConversationId, dispatch]);

  const selectConversation = (conversationId) => {
    dispatch(setCurrentConversation(conversationId));
  };

  const currentMessages = messages?.[currentConversationId] || [];
  const currentConversation = conversations?.find((conv) => conv._id === currentConversationId);
  const currentPagination = pagination?.[currentConversationId] || {};
  const currentChatInfo = chatInfo?.[currentConversationId] || {};

  return {
    conversations,
    messages: currentMessages,
    currentConversation: currentConversation,
    chatInfo: currentChatInfo,
    pagination: currentPagination,
    loading,
    messagesLoading,
    error,
    selectConversation,
    refetchConversations: () => dispatch(fetchConversation()),
    refetchMessages: () => {
      if (currentConversationId) {
        dispatch(fetchMessages({ chatId: currentConversationId }));
      }
    },
  };
};
