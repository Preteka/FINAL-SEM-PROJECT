import React from 'react';
import { Link } from 'react-router-dom';
import AdminHeader from '../../components/Header/Header';
import DashboardStats from '../../components/Cards/DashboardStats';
import ActivityTimeline from '../../components/Timeline/ActivityTimeline';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useAuth } from '../../../shared/context/AuthContext';

const AdminHome = () => {
    const { stats, loading } = useDashboardData();
    const { user } = useAuth();

    if (loading) {
        return (
            <>
                <AdminHeader title="Admin Home" />
                <div className="admin-content">
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: '#64748b',
                        animation: 'fadeIn 0.5s ease-out'
                    }}>
                        <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                        <p>Loading home data...</p>
                    </div>
                </div>
            </>
        );
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <>
            <AdminHeader title="Admin Home" />
            <div className="admin-content">
                {/* Welcome Section */}
                <div
                    className="admin-section-header"
                    style={{
                        background: 'linear-gradient(135deg, #8d6e63 0%, #5d4037 100%)',
                        padding: '2rem',
                        borderRadius: '12px',
                        color: 'white',
                        marginBottom: '2rem',
                        animation: 'slideInDown 0.6s ease-out'
                    }}
                >
                    <h2 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.75rem' }}>
                        {getGreeting()}, {user?.displayName || 'Admin'}! 👋
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                        Welcome to your Vinayaga Plywoods admin dashboard. Here's what's happening today.
                    </p>
                </div>

                {/* Stats Overview */}
                <DashboardStats stats={stats} />

                {/* Quick Actions */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.125rem', color: '#1e293b', marginBottom: '1rem', fontWeight: '600' }}>
                        Quick Actions
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem'
                    }}>
                        {[
                            { icon: 'fa-plus', label: 'Add Product', to: '/products', state: { openAddModal: true }, color: '#3b82f6', bg: '#eff6ff' },
                            { icon: 'fa-users', label: 'View Customers', to: '/customers', color: '#8b5cf6', bg: '#faf5ff' },
                            { icon: 'fa-shopping-cart', label: 'View Orders', to: '/orders', color: '#10b981', bg: '#f0fdf4' },
                            { icon: 'fa-chart-line', label: 'Analytics', to: '/dashboard', color: '#f59e0b', bg: '#fffbeb' }
                        ].map((action, index) => (
                            <Link
                                key={index}
                                to={action.to}
                                state={action.state}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    backgroundColor: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '10px',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                    animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '10px',
                                    backgroundColor: action.bg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: action.color,
                                    fontSize: '1.25rem'
                                }}>
                                    <i className={`fas ${action.icon}`}></i>
                                </div>
                                <span style={{ color: '#1e293b', fontWeight: '500' }}>{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Activity Timeline */}
                <ActivityTimeline />
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
};

export default AdminHome;
