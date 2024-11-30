import React from "react";
import VerticalNavbar from "../admin/AdminNav";


const AdminLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    return (
      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <VerticalNavbar />
        
        {/* Main Content */}
        <div style={{ flex: 1, padding: '1rem' }}>
          {children}
        </div>
      </div>
    );
  };
  
  export default AdminLayout;