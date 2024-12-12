
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Home from './pages/Home';
import { Register } from './components/auth/Signup';
import { LoggedRoute } from './routes/LoggedRoute';
import CreateListing from './pages/listing/CreateListing.tsx';
import AdminRoute from './routes/AdminRoute';
import MyListing from './components/user/listing/MyListing.tsx';
import UpdateListingForm from './pages/listing/UpdateListing.tsx';
import ViewListing from './pages/listing/ViewListing.tsx';
import ProfileSettings from './components/user/profile/profile.tsx';
import WishList from './pages/wishList/WishList.tsx';
import PaymentFailed from './pages/payment/PaymentFailed.tsx';
import Dashboard from './components/admin/Dashboard';
import AdminLayout from './components/layout/AdminLayout.tsx';
import BuyerOrder from './pages/order/buy/BuyerOrder.tsx';
import SellerOrder from './pages/order/sell/SellerOrder.tsx';
import ChatDashboard from "./components/chat/ChatDashboard.tsx";
import ChatWindow from './components/chat/ChatWindow.tsx';
import Checkout from './pages/payment/Checkout.tsx';
import Deposit from './pages/payment/deposit/Deposit.tsx';
import AdminUserManagement from './components/admin/AdminUserManagement.tsx';
import TransactionTableAdmin from './components/admin/AdminTransactionManagement.tsx';

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/chat-dashboard"
        element={
          <ChatDashboard />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path="/chat/:userId" element={<ChatWindow />} />

      <Route path="/" element={<Home />} />
      <Route path="/transaction-failed" element={<PaymentFailed />} />
      <Route path="/order" element={<BuyerOrder />} />
      <Route path="/listings/:listingId" element={<ViewListing />} />
      <Route element={<LoggedRoute />}>
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/settings" element={<ProfileSettings />} />
        <Route path="/my-listings/edit/:listingId" element={<UpdateListingForm />} />
        <Route path="/my-listings" element={<MyListing />} />

        <Route path="/wishlist" element={<WishList />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/seller-order" element={<SellerOrder />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path='users' element={<AdminUserManagement />} />
      </Route>
      <Route element={<AdminRoute />}>

        {/* Add more protected routes here */}
        <Route path='/admin/*' element={<AdminLayout />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='users' element={<AdminUserManagement />} />
          <Route path="my-listings" element={<MyListing />} />
          <Route path="transactions" element={<TransactionTableAdmin />} />
        </Route>

        {/* <Route path="/admin/dashboard" element={<VerticalNavbar />} />
          <Route path="/admin/users" element={<AdminUserManagement />} /> */}
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRoutes
