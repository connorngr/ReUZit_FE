
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const LoggedRoute = () => {
    const authContext = useContext(AuthContext);
    return authContext?.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
  };

