import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { tokenService } from '../api/tokenService';
import { fetchUserProfile } from '../store/actions/user.actions';
import { logout, setInitialized } from '../store/slices/authSlice';

export function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = tokenService.getAccessToken();
      
      if (accessToken) {
        try {
          // Validate token by fetching user profile
          await dispatch(fetchUserProfile()).unwrap();
        } catch (error) {
          // Token is invalid, clear it and logout
          dispatch(logout());
        }
      } else {
        // No token, mark as initialized
        dispatch(setInitialized(true));
      }
    };

    initializeAuth();
  }, [dispatch]);

  return children;
}
