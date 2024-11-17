import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = () => {
    const authContext = useContext(AuthContext);
    return authContext?.role == "ROLE_ADMIN" ? <Outlet /> : <Navigate to="/" />;
}

export default AdminRoute