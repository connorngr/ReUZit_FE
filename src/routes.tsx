import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Home from './components/Home';
import { Register } from './components/auth/Signup';
import { LoggedRoute } from './routes/LoggedRoute';
import CreateListing from './pages/Listing/CreateListing.tsx';
import AdminRoute from './routes/AdminRoute';
import VerticalNavbar from './components/admin/AdminNav';
import MyListing from './components/user/Listing/MyListing.tsx';
import UpdateListingForm from './pages/Listing/UpdateListing.tsx';
import AdminUserManagement from "./components/admin/AdminUserManagement.tsx";
import ViewListing from './pages/Listing/ViewListing.tsx';
import ProfileSettings from './components/user/Profile/profile.tsx';
import ShoppingCart from './pages/Payment/ShoppingCart.tsx';
import Congratulation from './pages/Payment/CongratulationsOrder.tsx'
import PaymentFailed from './pages/Payment/PaymentFailed.tsx';
const AppRoutes: React.FC = () => {
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path='/register' element={<Register/>}/>
      <Route path="/" element={<Home />} />
      <Route path="/congratulation" element={<Congratulation />} />
      <Route path="/transaction-failed" element={<PaymentFailed />} />
      <Route element={<LoggedRoute />}>
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/my-listings/edit/:listingId" element={<UpdateListingForm />} />
          <Route path="/my-listings" element={<MyListing />} />
          <Route path="/listings/:listingId" element={<ViewListing />} />
          <Route path="/shopping-cart" element={<ShoppingCart />} />
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
