import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  addOnlineUser,
  removeOnlineUser,
  setConnected,
  setSocket,
  setOnlineUsers,
  clearOnlineUsers,
  updateUserStatus,
} from '../store/slices/socketSlice';

import socketService from '../services/socket.service';
import { addMessage, updateChat, updateMessageStatus } from '../store/slices/chatSlice';

export default function SocketProvider({ children }) {
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentConversationId } = useSelector((state) => state.chat);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = socketService.connect();
    console.log('socket', socket);

    if (!socket) {
      console.error('Failed to initialize socket connection');

      return;
    }

    socket.on('connect', () => {
      console.log('✅ Socket connected successfully with ID:', socket.id);

      dispatch(setConnected(true));
      dispatch(setSocket(socket));
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');

      dispatch(setConnected(false));
      dispatch(clearOnlineUsers());
    });

    socket.on('user_online', (user) => {
      console.log('user came online', user);

      dispatch(addOnlineUser(user));
    });

    socket.on('user_offline', (user) => {
      console.log('user went offline', user);

      dispatch(removeOnlineUser({ userId: user._id }));
    });

    socket.on('online_users', (users) => {
      console.log('received online users list', users);
      
      dispatch(setOnlineUsers(users));
    });

    socket.on('user_status_changed', (data) => {
      console.log('user status changed', data);
      
      dispatch(updateUserStatus({
        userId: data.userId,
        status: data.status,
        isOnline: data.isOnline
      }));
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);

      dispatch(setConnected(false));
    });

    socket.on('message_received', (message) => {
      console.log('🔔 message_received frontend', message);
      console.log('🔔 Current conversation ID:', currentConversationId);
      console.log('🔔 Message chatId:', message.chatId);
      
      // Add message to current conversation if active
        dispatch(addMessage({
          conversationId: message.chatId,
          message: message
        }));
      
      // Always update conversation list with new last message
      console.log('🔔 Updating conversation list for chatId:', message.chatId);
      dispatch(updateChat({
        chatId: message.chatId,
        lastMessage: message
      }));
      
      // Show notification if not in active conversation
      if (message.chatId !== currentConversationId) {
        // Show browser notification
        if (Notification.permission === 'granted') {
          new Notification(`New message from ${message.sender.name}`, {
            body: message.content,
            icon: message.sender.avatar || '/default-avatar.png'
          });
        }
        
        // Update unread count - you'll need to add this action to chatSlice
        // dispatch(incrementUnreadCount(message.chatId));
      }
    });

    socket.on('chat_updated', (data) => {
      console.log('chat_updated', data);
      // Handle chat list updates if needed
      dispatch(
        updateChat({
          chatId: data.chatId,
          lastMessage: data.lastMessage,
        })
      );
    });

    socket.on('validation_error', (error) => {
      console.error('Socket validation error:', error);
    });

    socket.on('message_delivered', (data) => {
      console.log('message_delivered', data);
      dispatch(updateMessageStatus({
        messageId: data.messageId,
        status: 'delivered'
      }));
    });

    socket.on('message_read', (data) => {
      console.log('message_read', data);
      dispatch(updateMessageStatus({
        messageId: data.messageId,
        status: 'read',
        readBy: data.readBy
      }));
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Add debugging for all events
    socket.onAny((eventName, ...args) => {
      console.log(`🔍 Socket event received: ${eventName}`, args);
    });

    // Add socket connection status monitoring
    setInterval(() => {
      if (socket) {
        console.log('🔌 Socket status:', {
          connected: socket.connected,
          id: socket.id,
          rooms: Array.from(socket.rooms || []),
          userId: socket.userId
        });
      }
    }, 10000); 

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated]);

  // Join/leave chat rooms when conversation changes
  useEffect(() => {
    if (!isAuthenticated) return;

    if (currentConversationId) {
      console.log('🏠 Joining chat room:', currentConversationId);
      socketService.joinRoom(currentConversationId);
      
      // Add debugging to confirm room join
      const socket = socketService.getSocket();
      if (socket) {
        socket.emit('debug_rooms', (rooms) => {
          console.log('🏠 Current socket rooms:', rooms);
        });
      }
    }

    return () => {
      if (currentConversationId) {
        console.log('🏠 Leaving chat room:', currentConversationId);
        socketService.leaveRoom(currentConversationId);
      }
    };
  }, [currentConversationId, isAuthenticated]);

  return children;
}
