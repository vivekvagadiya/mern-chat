import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setConnected } from "../store/slices/socketSlice";
import socketService from "../services/socket.service";

export default function SocketProvider({
  children,
}) {
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );
  console.log('isAuthenticated',isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = socketService.connect();
    console.log('socket',socket)
    
    if (!socket) {
      console.error('Failed to initialize socket connection');
      return;
    }

    socket.on("connect", () => {
      console.log('Socket connected successfully');
      dispatch(setConnected(true));
    });

    socket.on("disconnect", () => {
      console.log('Socket disconnected');
      dispatch(setConnected(false));
    });

    socket.on("connect_error", (error) => {
      console.error('Socket connection error:', error);
      dispatch(setConnected(false));
    });

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated]);

  return children;
}