import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/Layout/AdminLayout';
import Home from '../pages/Home/Home';
import Dashboard from '../pages/Dashboard/Dashboard';
import Products from '../pages/Products/Products';
import Orders from '../pages/Orders/Orders';
import Inventory from '../pages/Inventory/Inventory';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                <Route index element={<Home />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="inventory" element={<Inventory />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
