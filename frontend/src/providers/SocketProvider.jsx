import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { fetchConversation } from '../store/actions/conversation.actions';

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
import { addMessage, updateChat, updateMessageStatus, setTyping, removeTyping } from '../store/slices/chatSlice';

export default function SocketProvider({ children }) {
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { currentConversationId } = useSelector((state) => state.chat);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Helper function to show notification
  const showNotification = (message) => {
    console.log('notification message', message);
    try {
      new Notification(`New message from ${message?.senderId?.username}`, {
        body: message.content,
        icon: message.senderId.avatar || '/default-avatar.png',
        tag: message.chatId, // Prevent duplicate notifications
        requireInteraction: false,
        silent: false,
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

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

      dispatch(
        updateUserStatus({
          userId: data.userId,
          status: data.status,
          isOnline: data.isOnline,
        })
      );
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);

      dispatch(setConnected(false));
    });

    socket.on('user_typing', (data) => {
      console.log('user is typing', data);
      dispatch(setTyping(data));
    });

    socket.on('user_stopped_typing', (data) => {
      console.log('user stopped typing', data);
      dispatch(removeTyping(data));
    });

    socket.on('message_received', (message) => {
      console.log('🔔 message_received frontend', message);
      console.log('🔔 Current conversation ID:', currentConversationId);
      console.log('🔔 Message chatId:', message.chatId);

      // Add message to current conversation if active
      dispatch(
        addMessage({
          conversationId: message.chatId,
          message: message,
        })
      );

      // Update chat list and unread count if message is from another user
      const currentUserId = user?._id || user?.id;
      if (currentUserId && message.senderId !== currentUserId) {
        dispatch(
          updateChat({
            chatId: message.chatId,
            lastMessage: message,
            currentUserId: currentUserId,
          })
        );
      }

      // Show notification if not in active conversation
      if (message.chatId !== currentConversationId) {
        console.log('Notification permission:', Notification.permission);
        console.log('Should show notification - not in active conversation');

        // Show notification if permission granted
        if (Notification.permission === 'granted') {
          showNotification(message);
        } else if (Notification.permission === 'denied') {
          console.log('Notification permission denied');
        } else {
          console.log('Notification permission not granted, requesting...');
          Notification.requestPermission().then((permission) => {
            console.log('Permission result:', permission);
            if (permission === 'granted') {
              showNotification(message);
            }
          });
        }
      } else {
        console.log('Not showing notification - user is in active conversation');
      }
    });

    socket.on('chat_created', (chat) => {
      console.log('chat_created', chat);
      // Refresh conversations list to include the new chat
      dispatch(fetchConversation());
    });

    socket.on('chat_updated', (data) => {
      console.log('chat_updated', data);
      // Handle chat list updates if needed
      dispatch(
        updateChat({
          chatId: data.chatId,
          lastMessage: data.lastMessage,
          currentUserId: user?._id || user?.id,
        })
      );
    });

    socket.on('validation_error', (error) => {
      console.error('Socket validation error:', error);
    });

    socket.on('message_delivered', (data) => {
      console.log('message_delivered', data);
      dispatch(
        updateMessageStatus({
          messageId: data.messageId,
          status: 'delivered',
        })
      );
    });

    socket.on('message_read', (data) => {
      console.log('message_read', data);
      dispatch(
        updateMessageStatus({
          messageId: data.messageId,
          status: 'read',
          readBy: data.readBy,
        })
      );
    });

    socket.on('message_delivered', (data) => {
      console.log('message_delivered', data);
      dispatch(
        updateMessageStatus({
          messageId: data.messageId,
          status: 'delivered',
          deliveredTo: data.deliveredTo,
        })
      );
    });

    socket.on('chat_read', (data) => {
      console.log('chat_read', data);
      dispatch(
        updateChat({
          chatId: data.chatId,
          unreadCount: 0,
        })
      );
    });

    socket.on('userAvatarUpdated', (user) => {
      console.log('userAvatarUpdated', user);
      dispatch(updateUser(user));
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
          userId: socket.userId,
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
