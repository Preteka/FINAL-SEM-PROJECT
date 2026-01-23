import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Products from '../pages/Products/Products';
import ProductDetails from '../pages/ProductDetails/ProductDetails';
import LoginRegister from '../pages/Profile/LoginRegister';
import Profile from '../pages/Profile/Profile';
import CostEstimation from '../pages/Home/CostEstimation';

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/:filterType/:filterValue" element={<Products />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/cost-estimation" element={<CostEstimation />} />
            <Route path="/login" element={<LoginRegister />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    );
};

export default UserRoutes;
