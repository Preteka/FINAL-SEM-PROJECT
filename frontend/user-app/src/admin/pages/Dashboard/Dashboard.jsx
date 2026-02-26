import React from 'react';
import AdminHeader from '../../components/Header/Header';
import DashboardStats from '../../components/Cards/DashboardStats';
import RecentOrders from '../../components/Tables/RecentOrders';
import LowStockAlert from '../../components/Tables/LowStockAlert';
import AnimatedChart from '../../components/Charts/AnimatedChart';
import { useDashboardData } from '../../hooks/useDashboardData';

const AdminDashboard = () => {
    const { stats, recentOrders, lowStockItems, loading } = useDashboardData();

    if (loading) {
        return (
            <>
                <AdminHeader title="Business Dashboard" />
                <div className="admin-content">
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: '#64748b',
                        animation: 'fadeIn 0.5s ease-out'
                    }}>
                        <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                        <p>Loading dashboard data...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <AdminHeader title="Business Dashboard" />
            <div className="admin-content">
                {/* Stats Cards */}
                <DashboardStats stats={stats} />

                {/* Charts and Orders Row */}
                <div className="dashboard-row" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div className="dashboard-col" style={{ flex: '2', minWidth: '300px' }}>
                        <RecentOrders orders={recentOrders} />
                    </div>
                    <div className="dashboard-col" style={{ flex: '1', minWidth: '300px' }}>
                        <AnimatedChart title="Category Distribution" type="Pie" />
                    </div>
                </div>

                {/* Monthly Sales and Low Stock Row */}
                <div className="dashboard-row" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div className="dashboard-col" style={{ flex: '1', minWidth: '300px' }}>
                        <AnimatedChart title="Monthly Products Added" type="Bar" />
                    </div>
                    <div className="dashboard-col" style={{ flex: '1', minWidth: '300px' }}>
                        <LowStockAlert items={lowStockItems} />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .dashboard-row {
                    margin-bottom: 1.5rem;
                }

                @media (max-width: 768px) {
                    .dashboard-row {
                        flex-direction: column;
                    }
                }
            `}</style>
        </>
    );
};

export default AdminDashboard;
