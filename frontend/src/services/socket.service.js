import { tokenService } from '../api/tokenService';
import { io } from 'socket.io-client';
class SocketService {
  socket = null;

  connect() {
    const token = tokenService.getAccessToken();
    if (!token) {
      console.error('No token available for socket connection');
      return null;
    }

    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    this.socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ['websocket', 'polling'],
      auth: {
        token,
      },
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection failed:', error.message);
    });

    this.socket.on('connect', () => {
      console.log('Socket connected successfully with ID:', this.socket.id);
    });

    return this.socket;
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  joinRoom(roomId) {
    if (this.socket) {
      console.log('🏠 Emitting join_chat for room:', roomId);
      this.socket?.emit('join_chat', { chatId: roomId });
    } else {
      console.log('❌ Cannot join room - socket not connected');
    }
  }
  leaveRoom(roomId) {
    if (this.socket) {
      console.log('🏠 Emitting leave_chat for room:', roomId);
      this.socket?.emit('leave_chat', { chatId: roomId });
    } else {
      console.log('❌ Cannot leave room - socket not connected');
    }
  }
  sendMessage(payload) {
    if (this.socket && this.socket.connected) {
      console.log('sending message', payload);
      this.socket.emit('new_message', payload);
    } else {
      console.error('Socket not connected, cannot send message');
    }
  }
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
  getSocket() {
    return this.socket;
  }
}
export default new SocketService();