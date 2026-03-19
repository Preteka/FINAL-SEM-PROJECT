import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './user/components/Navbar/Navbar';
import Footer from './user/components/Footer/Footer';
import Chatbot from './user/components/Chatbot';
import UserRoutes from './user/routes/UserRoutes';
import AdminRoutes from './admin/routes/AdminRoutes';
import LoginRegister from './user/pages/Profile/LoginRegister';
import { useAuth } from './shared/context/AuthContext';
import './index.css';

function App() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return null;

    // If not logged in, force navigation to /login
    if (!user) {
        // If they are not already on /login, redirect them
        if (location.pathname !== '/login') {
            return <Navigate to="/login" replace state={{ from: location }} />;
        }
        return (
            <Routes>
                <Route path="/login" element={<LoginRegister />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        );
    }

    // If Admin, render Admin UI
    if (user?.role === 'admin') {
        return (
            <div className="App">
                <AdminRoutes />
            </div>
        );
    }

    // Default User UI
    return (
        <div className="App">
            <Navbar />
            <main>
                <UserRoutes />
            </main>
            <Footer />
            <Chatbot />
        </div>
    );
}

export default App;
