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
// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//   const authContext = useContext(AuthContext);
    
// //   if (!authContext?.isAuthenticated) {
// //     console.log(authContext?.isAuthenticated);
// //     return <Navigate to="/login" />;
// //   }

//   return children;
// };

// What is * btw


const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  // Define a function for the onSuccess callback
  const handleUpdateSuccess = (listing: Listing) => {
    console.log('Listing updated successfully:', listing);
    // Redirect or perform other actions upon successful update
    navigate('/my-listings');
  };
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path='/register' element={<Register/>}/>
      <Route path="/" element={<Home />} />
      <Route element={<LoggedRoute />}>
          {/* Add more protected routes here */}
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
          <Route path="/admin/dashboard" element={<VerticalNavbar />} />
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
