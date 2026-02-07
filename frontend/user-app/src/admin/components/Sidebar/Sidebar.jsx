import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';

const AdminSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="admin-sidebar">
            <div className="admin-sidebar-logo">
                Vinayaga Admin
            </div>
            <nav className="admin-nav">
                <NavLink to="/" end className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                    <i className="fas fa-home"></i> <span>Home</span>
                </NavLink>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                    <i className="fas fa-chart-line"></i> <span>Dashboard</span>
                </NavLink>
                <NavLink to="/products" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                    <i className="fas fa-box"></i> <span>Products</span>
                </NavLink>
                <NavLink to="/orders" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                    <i className="fas fa-shopping-cart"></i> <span>Orders</span>
                </NavLink>
                <NavLink to="/inventory" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                    <i className="fas fa-warehouse"></i> <span>Inventory</span>
                </NavLink>
                <NavLink to="/customers" className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
                    <i className="fas fa-users"></i> <span>Users</span>
                </NavLink>

                <div
                    onClick={async () => {
                        if (window.confirm("Are you sure you want to logout?")) {
                            await logout();
                            navigate("/");
                        }
                    }}
                    className="admin-nav-item"
                    style={{ marginTop: 'auto', cursor: 'pointer', color: '#dc2626' }}
                >
                    <i className="fas fa-sign-out-alt"></i> <span>Logout</span>
                </div>
            </nav>
        </div>
    );
};

export default AdminSidebar;

