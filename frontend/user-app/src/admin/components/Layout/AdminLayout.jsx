import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../Sidebar/Sidebar';
import '../../styles/admin.css';

const AdminLayout = () => {
    return (
        <div className="admin-container">
            <AdminSidebar />
            <div className="admin-main">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;

