import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { addOnlineUsers, removeOnlineUser, setConnected } from '../store/slices/socketSlice';

import socketService from '../services/socket.service';
import { addMessage } from '../store/slices/chatSlice';

export default function SocketProvider({ children }) {
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const {currentConversationId}=useSelector((state)=>state.chat)

  console.log('isAuthenticated', isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = socketService.connect();

    console.log('socket', socket);

    if (!socket) {
      console.error('Failed to initialize socket connection');

      return;
    }

    socket.on('connect', () => {
      console.log('Socket connected successfully');

      dispatch(setConnected(true));
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

    socket.on('new_mesasge',(data)=>{
      if(data.conversationId===currentConversationId){
        dispatch(addMessage(data));
      }
    })

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated]);

  return children;
}
