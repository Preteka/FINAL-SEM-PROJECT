import React from 'react';

const RecentOrders = ({ orders }) => {
    if (!orders || orders.length === 0) {
        return (
            <div className="admin-table-container" style={{ margin: 0 }}>
                <div className="admin-table-title">Recent Orders</div>
                <div className="admin-table-wrapper">
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: '#64748b',
                        animation: 'fadeIn 0.5s ease-out'
                    }}>
                        <i className="fas fa-shopping-bag" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}></i>
                        <p>No orders yet. Orders will appear here when customers make purchases.</p>
                    </div>
                </div>
            </div>
        );
    }

    const getStatusClass = (status) => {
        const statusMap = {
            'order received': 'status-pending',
            'order packed': 'status-pending',
            'order shipped': 'status-delivered',
            'order delivered': 'status-delivered',
            'cancelled': 'status-cancelled',
            'pending': 'status-pending',
            'processing': 'status-pending',
            'shipped': 'status-delivered',
            'delivered': 'status-delivered'
        };
        return statusMap[status?.toLowerCase()] || 'status-pending';
    };

    return (
        <div className="admin-table-container" style={{ margin: 0 }}>
            <div className="admin-table-title">Recent Orders</div>
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Product</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr
                                key={order.id}
                                style={{
                                    animation: `fadeInRow 0.5s ease-out ${index * 0.1}s both`
                                }}
                            >
                                <td style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                                    #{order.id?.substring(0, 8) || 'N/A'}
                                </td>
                                <td>{order.customerName || order.customer || 'Guest'}</td>
                                <td>
                                    {order.items && order.items.length > 0
                                        ? `${order.items[0].name}${order.items.length > 1 ? ` (+${order.items.length - 1} more)` : ''}`
                                        : (order.productName || order.product || 'N/A')}
                                </td>
                                <td style={{ fontWeight: '600' }}>
                                    ₹{(order.total || order.amount || order.totalAmount || 0).toLocaleString()}
                                </td>
                                <td>
                                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                                        {order.status || 'Pending'}
                                    </span>
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
            `}</style>
        </div>
    );
};

export default RecentOrders;
