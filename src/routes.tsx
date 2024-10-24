import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Home from './components/Home';
import { Register } from './components/auth/Signup';
import { LoggedRoute } from './routes/LoggedRoute';
import CreateListing from './pages/CreateListing';
import AdminRoute from './routes/AdminRoute';
import VerticalNavbar from './components/admin/AdminNav';

// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//   const authContext = useContext(AuthContext);
    
// //   if (!authContext?.isAuthenticated) {
// //     console.log(authContext?.isAuthenticated);
// //     return <Navigate to="/login" />;
// //   }

//   return children;
// };

// What is * btw
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path='/register' element={<Register/>}/>
      <Route path="/" element={<Home />} />
      <Route element={<LoggedRoute />}>
          {/* Add more protected routes here */}
          <Route path="/create-listing" element={<CreateListing />} />
        </Route>
        <Route element={<AdminRoute />}>
          {/* Add more protected routes here */}
          <Route path="/admin/dashboard" element={<VerticalNavbar />} />
        </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRoutes
