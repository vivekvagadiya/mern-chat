import { useSelector } from 'react-redux';
import { isUserOnline, getUserStatus, getUserLastSeen, formatLastSeen } from '../utils/helper';

export const useUserPresence = (userId) => {
  const { onlineUsers, userStatuses } = useSelector((state) => state.socket);
  console.log('onlineUsers', onlineUsers);

  if (!userId) {
    return { isOnline: false, status: 'offline', lastSeenText: '' };
  }

  const isOnline = isUserOnline(userId, onlineUsers, userStatuses);
  const status = getUserStatus(userId, userStatuses);
  const lastSeen = getUserLastSeen(userId, userStatuses);

  let lastSeenText = '';
  if (isOnline) {
    lastSeenText = 'Active now';
  } else if (lastSeen) {
    lastSeenText = `Last seen ${formatLastSeen(lastSeen)}`;
  } else {
    lastSeenText = 'Offline';
  }

  return {
    isOnline,
    status,
    lastSeenText,
  };
};
