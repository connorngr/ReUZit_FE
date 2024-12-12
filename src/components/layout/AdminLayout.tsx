import React from 'react';
import { Outlet } from 'react-router-dom';
import VerticalNavbar from '../admin/AdminNav';

const AdminLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <VerticalNavbar />

      {/* Main Content */}
      <div style={{ flex: 1, padding: '1rem' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
