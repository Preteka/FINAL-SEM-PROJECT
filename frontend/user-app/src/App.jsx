import React from 'react';
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

    if (loading) return null;

    // If not logged in, show login page
    if (!user) {
        return <LoginRegister />;
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
