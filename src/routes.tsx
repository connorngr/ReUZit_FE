// src/AppRoutes.tsx
import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Route, Routes, Navigate, useParams, useNavigate } from 'react-router-dom';
import { SearchProvider } from './components/form/SearchContext';
import Login from './components/auth/Login';
import Home from './components/Home';
import { Register } from './components/auth/Signup';
import { LoggedRoute } from './routes/LoggedRoute';
import CreateListing from './pages/CreateListing';
import AdminRoute from './routes/AdminRoute';
import VerticalNavbar from './components/admin/AdminNav';
import ListingOfMe from './components/user/ListingOfMe';
import UpdateListingForm from './pages/UpdateListing';
import { Listing } from './api/listing';
import Listings from './components/admin/listings';
import AdminUserManagement from "./components/admin/AdminUserManagement";
import ViewListing from './pages/ViewListing';

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const userRole = authContext?.role;

  const handleUpdateSuccess = (listing: Listing) => {
    console.log('Listing updated successfully:', listing);
    if (userRole === 'ROLE_ADMIN') {
      navigate('/listings');
    } else {
      navigate('/my-listings');
    }
  };

  return (
    <SearchProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Listings />} />
        <Route element={<LoggedRoute />}>
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/my-listings/edit/:listingId"
            element={<UpdateListingWrapper onSuccess={handleUpdateSuccess} />}
          />
          <Route path="/my-listings" element={<ListingOfMe />} />
          <Route path="/listings/:listingId" element={<ViewListing />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/listings" element={<Listings />} />
          <Route path="/admin/dashboard" element={<VerticalNavbar />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </SearchProvider>
  );
};

const UpdateListingWrapper: React.FC<{ onSuccess: (listing: Listing) => void }> = ({ onSuccess }) => {
  const { listingId } = useParams<{ listingId: string }>();
  return listingId ? (
    <UpdateListingForm listingId={parseInt(listingId, 10)} onSuccess={onSuccess} />
  ) : (
    <div>Loading...</div>
  );
};

export default AppRoutes;
