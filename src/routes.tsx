import React from 'react';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Route, Routes, Navigate, useParams, useNavigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Home from './components/Home';
import { Register } from './components/auth/Signup';
import { LoggedRoute } from './routes/LoggedRoute';
import CreateListing from './pages/CreateListing';
import AdminRoute from './routes/AdminRoute';
import VerticalNavbar from './components/admin/AdminNav';
import ListingOfMe from './components/user/ListingOfMe';
import UpdateListingForm from './pages/UpdateListing';
import {Listing} from './api/listing'
import Listings from './components/admin/listings';
import AdminUserManagement from "./components/admin/AdminUserManagement.tsx";



const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  
  // Lấy vai trò của người dùng từ context
  const authContext = useContext(AuthContext);
  const userRole = authContext?.role;

  // Định nghĩa hàm callback cho onSuccess
  const handleUpdateSuccess = (listing: Listing) => {
    console.log('Listing updated successfully:', listing);

    // Điều hướng dựa trên vai trò của người dùng
    if (userRole === 'ROLE_ADMIN') {
      navigate('/listings'); // Chuyển đến Listings cho admin
    } else {
      navigate('/my-listings'); // Chuyển đến My Listings cho user thường
    }
  };
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path='/register' element={<Register/>}/>
      <Route path="/" element={<Home />} />
      <Route element={<LoggedRoute />}>
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
        path="/my-listings/edit/:listingId"
        element={
          <UpdateListingWrapper onSuccess={handleUpdateSuccess} />
        }
      />
          <Route path="/my-listings" element={<ListingOfMe />} />
          
        </Route>
        <Route element={<AdminRoute />}>
          {/* Add more protected routes here */}
          <Route path="/listings" element={<Listings />} />
          <Route path="/admin/dashboard" element={<VerticalNavbar />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
        </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

const UpdateListingWrapper: React.FC<{ onSuccess: (listing: Listing) => void }> = ({ onSuccess }) => {
  const { listingId } = useParams<{ listingId: string }>();
  return listingId ? (
    <UpdateListingForm listingId={parseInt(listingId, 10)} onSuccess={onSuccess} />
  ) : (
    <div>Loading...</div>
  );
};

export default AppRoutes
