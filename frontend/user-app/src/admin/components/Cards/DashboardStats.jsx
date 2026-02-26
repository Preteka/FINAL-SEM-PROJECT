import React from 'react';

const DashboardStats = ({ stats }) => {
    const statCards = [
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: 'fa-box',
            color: '#3b82f6',
            bgColor: '#eff6ff'
        },
        {
            title: 'Low Stock Items',
            value: stats.lowStockCount,
            icon: 'fa-exclamation-triangle',
            color: '#f59e0b',
            bgColor: '#fffbeb'
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: 'fa-shopping-cart',
            color: '#10b981',
            bgColor: '#f0fdf4'
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: 'fa-users',
            color: '#8b5cf6',
            bgColor: '#faf5ff'
        }
    ];

    return (
        <div className="admin-grid">
            {statCards.map((stat, index) => (
                <div
                    key={index}
                    className="stat-card"
                    style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
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
                    <div
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '12px',
                            backgroundColor: stat.bgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            color: stat.color
                        }}
                    >
                        <i className={`fas ${stat.icon}`}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                            {stat.title}
                        </div>
                        <div
                            className="stat-value"
                            style={{
                                fontSize: '2rem',
                                fontWeight: '700',
                                color: '#1e293b',
                                animation: 'countUp 1s ease-out'
                            }}
                        >
                            {stat.value}
                        </div>
                    </div>
                </div>
            ))}

            <style>{`
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
                
                @keyframes countUp {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default DashboardStats;
