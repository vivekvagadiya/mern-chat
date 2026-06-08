import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversation } from '../store/actions/conversation.actions';
import { fetchMessages } from '../store/actions/message.actions';
import { markConversationAsRead, setCurrentConversation } from '../store/slices/chatSlice';

export const useConversation = () => {
  const dispatch = useDispatch();
  const { conversations, currentConversationId, messages, loading, messageLoading, error } =
    useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchConversation());
  }, [dispatch]);

  useEffect(() => {
    if (currentConversationId) {
      dispatch(fetchMessages({ chatId: currentConversationId }));
      dispatch(markConversationAsRead(currentConversationId));
    }
  }, [currentConversationId, dispatch]);

  const selectConversation = (conversationId) => {
    dispatch(setCurrentConversation(conversationId));
  };

  const currentMessages = messages?.message?.[currentConversationId] || [];
  const currnetConversation = conversations?.find((conv) => conv._id === currentConversationId);

  return {
    conversations,
    messages: currentMessages,
    currentConversation: currnetConversation,
    loading,
    messageLoading,
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
