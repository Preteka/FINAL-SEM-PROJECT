import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminLayout from '../components/Layout/AdminLayout';
import Home from '../pages/Home/Home';
import Dashboard from '../pages/Dashboard/Dashboard';
import Products from '../pages/Products/Products';
import Orders from '../pages/Orders/Orders';
import Inventory from '../pages/Inventory/Inventory';
import Customers from '../pages/Customers/Customers';
import { useAuth } from '../../shared/context/AuthContext';

// Protective Wrapper Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return null; // Handled by AuthProvider spinneer

    if (!user) {
        // Redirect to login but save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={
                <ProtectedRoute>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Home />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="customers" element={<Customers />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AdminRoutes;


