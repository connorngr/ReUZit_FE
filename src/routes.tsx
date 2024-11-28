
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
import WishList from './pages/Payment/WishList.tsx';
import PaymentFailed from './pages/Payment/PaymentFailed.tsx';
import Dashboard from './components/admin/Dashboard';
import AdminLayout from './components/Layout/AdminLayout';
import BuyerOrder from './components/order/buy/BuyerOrder.tsx';
import SellerOrder from './components/order/sell/SellerOrder.tsx';
import Checkout from './pages/Payment/Checkout.tsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path='/register' element={<Register/>}/>
      <Route path="/" element={<Home />} />
      <Route path="/transaction-failed" element={<PaymentFailed />} />
      <Route path="/order" element={<BuyerOrder />} />
      <Route element={<LoggedRoute />}>
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/my-listings/edit/:listingId" element={<UpdateListingForm />} />
          <Route path="/my-listings" element={<MyListing />} />
          <Route path="/listings/:listingId" element={<ViewListing />} />
          <Route path="/wishlist" element={<WishList />} />  
          <Route path="/seller-order" element={<SellerOrder />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
        <Route element={<AdminRoute />}>

          {/* Add more protected routes here */}
          <Route 
            path='/admin/*'
            element={
              <AdminLayout>
                <Routes>
                  <Route path='dashboard' element={<Dashboard />} />
                </Routes>
              </AdminLayout>
            }>
          </Route>
        <Route path="/admin/dashboard" element={<VerticalNavbar />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
        </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRoutes
