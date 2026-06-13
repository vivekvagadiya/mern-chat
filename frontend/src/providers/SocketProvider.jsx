import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { addOnlineUsers, removeOnlineUser, setConnected, setSocket } from '../store/slices/socketSlice';

import socketService from '../services/socket.service';
import { addMessage } from '../store/slices/chatSlice';

export default function SocketProvider({ children }) {
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const {currentConversationId}=useSelector((state)=>state.chat)


  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = socketService.connect();
    console.log('socket',socket)

    if (!socket) {
      console.error('Failed to initialize socket connection');

      return;
    }

    socket.on('connect', () => {
      console.log('Socket connected successfully');

      dispatch(setConnected(true));
      dispatch(setSocket(socket));
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');

      dispatch(setConnected(false));
    });

    socket.on('user_online', (user) => {
      console.log('user came online', user);

      dispatch(addOnlineUsers(user));
    });

    socket.on('user_offline', (user) => {
      console.log('user went offline', user);

      dispatch(removeOnlineUser({ userId: user._id }));
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);

      dispatch(setConnected(false));
    });

    socket.on('message_received',(message)=>{
      console.log('message_received frontend', message);
      dispatch(addMessage({
        conversationId: message.chatId,
        message: message
      }));
    })

    socket.on('chat_updated',(data)=>{
      console.log('chat_updated', data);
      // Handle chat list updates if needed
    })

    socket.on('validation_error',(error)=>{
      console.error('Socket validation error:', error);
    })

    socket.on('error',(error)=>{
      console.error('Socket error:', error);
    })

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated]);

  // Join/leave chat rooms when conversation changes
  useEffect(() => {
    if (!isAuthenticated) return;

    if (currentConversationId) {
      console.log('Joining chat room:', currentConversationId);
      socketService.joinRoom(currentConversationId);
    }

    return () => {
      if (currentConversationId) {
        console.log('Leaving chat room:', currentConversationId);
        socketService.leaveRoom(currentConversationId);
      }
    };
  }, [currentConversationId, isAuthenticated]);

  return children;
}
