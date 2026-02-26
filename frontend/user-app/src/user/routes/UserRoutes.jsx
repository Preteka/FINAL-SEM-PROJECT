import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Products from '../pages/Products/Products';
import ProductDetails from '../pages/ProductDetails/ProductDetails';
import LoginRegister from '../pages/Profile/LoginRegister';
import Profile from '../pages/Profile/Profile';
import Cart from '../pages/Cart/Cart';
import Checkout from '../pages/Checkout/Checkout';
import Orders from '../pages/Orders/Orders';
import Settings from '../pages/Settings/Settings';
import CostEstimation from '../pages/Home/CostEstimation';
import ColorPalette from '../pages/Home/ColorPalette';

const UserRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:filterType/:filterValue" element={<Products />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/cost-estimation" element={<CostEstimation />} />
            <Route path="/color-palette" element={<ColorPalette />} />
            <Route path="/login" element={<LoginRegister />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/settings" element={<Settings />} />
        </Routes>
    );
};

export default UserRoutes;
