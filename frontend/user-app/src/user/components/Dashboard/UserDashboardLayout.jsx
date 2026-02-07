import React from 'react';
import UserSidebar from './UserSidebar';
import { Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import '../../styles/dashboard.css';

const UserDashboardLayout = ({ children, title, subtitle }) => {
    const { user } = useAuth();

    return (
        <div className="dashboard-container">
            <UserSidebar />

            <main className="dashboard-main">
                {/* Abstract Background Shapes */}
                <div className="bg-shape shape-1"></div>
                <div className="bg-shape shape-2"></div>

                <header className="dashboard-header">
                    <div className="header-title">
                        <h1>{title}</h1>
                        <p>{subtitle || 'Welcome back to your portal'}</p>
                    </div>

                    <div className="header-actions">
                        <div className="notification-bell">
                            <Bell size={20} />
                        </div>

                        <div className="user-profile-menu">
                            <img
                                src={user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                                alt="user"
                                className="avatar-small"
                            />
                            <span style={{ fontWeight: 600, fontSize: '14px', color: '#2D3142' }}>
                                Hello {user?.displayName?.split(' ')[0] || 'User'}
                            </span>
                            <ChevronDown size={14} color="#8E94A0" />
                        </div>
                    </div>
                </header>

                <section className="dashboard-content">
                    {children}
                </section>
            </main>
        </div>
    );
};

export default UserDashboardLayout;
