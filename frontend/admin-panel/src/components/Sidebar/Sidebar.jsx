import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
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
            </nav>
        </div>
    );
};

export default AdminSidebar;
