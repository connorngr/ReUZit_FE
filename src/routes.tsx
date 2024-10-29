import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Home from './components/Home';
import { Register } from './components/auth/Signup';
import { LoggedRoute } from './routes/LoggedRoute';
import CreateListing from './pages/CreateListing';
import AdminRoute from './routes/AdminRoute';
import VerticalNavbar from './components/admin/AdminNav';
import AdminUserManagement from "./components/admin/AdminUserManagement.tsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path='/register' element={<Register/>}/>
      <Route path="/" element={<Home />} />
      <Route element={<LoggedRoute />}>
          <Route path="/create-listing" element={<CreateListing />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<VerticalNavbar />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
        </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRoutes
