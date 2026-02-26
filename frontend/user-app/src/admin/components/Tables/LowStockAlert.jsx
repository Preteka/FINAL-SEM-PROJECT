import React from 'react';

const LowStockAlert = ({ items }) => {
    if (!items || items.length === 0) {
        return (
            <div className="admin-table-container" style={{ margin: 0 }}>
                <div className="admin-table-title">Low Stock Alerts</div>
                <div className="admin-table-wrapper">
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem',
                        color: '#10b981',
                        animation: 'fadeIn 0.5s ease-out'
                    }}>
                        <i className="fas fa-check-circle" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}></i>
                        <p style={{ margin: 0, fontWeight: '500' }}>All products are well stocked!</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-table-container" style={{ margin: 0 }}>
            <div className="admin-table-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-exclamation-triangle" style={{ color: '#f59e0b' }}></i>
                Low Stock Alerts
            </div>
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Stock</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr
                                key={item.id}
                                style={{
                                    animation: `fadeInRow 0.5s ease-out ${index * 0.1}s both`,
                                    backgroundColor: Number(item.stockCount) < 5 ? '#fef3c7' : 'transparent'
                                }}
                            >
                                <td style={{ fontWeight: '500' }}>{item.name}</td>
                                <td>
                                    <span
                                        className="status-badge"
                                        style={{
                                            backgroundColor: Number(item.stockCount) < 5 ? '#fef3c7' : '#fff7ed',
                                            color: Number(item.stockCount) < 5 ? '#dc2626' : '#f59e0b',
                                            fontWeight: '600',
                                            animation: Number(item.stockCount) < 5 ? 'pulse 2s ease-in-out infinite' : 'none'
                                        }}
                                    >
                                        {item.stockCount} units
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="action-btn"
                                        style={{
                                            fontSize: '0.75rem',
                                            padding: '0.25rem 0.75rem',
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => window.location.href = '/admin/products'}
                                    >
                                        Restock
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                @keyframes fadeInRow {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
            `}</style>
        </div>
    );
};

export default LowStockAlert;
