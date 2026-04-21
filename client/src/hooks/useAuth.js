import { useSelector, useDispatch } from 'react-redux';
import { logout, setCredentials } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector(state => state.auth);

  const login = (data) => dispatch(setCredentials(data));
  const signout = () => dispatch(logout());

  return { user, token, isAuthenticated, login, signout };
};
