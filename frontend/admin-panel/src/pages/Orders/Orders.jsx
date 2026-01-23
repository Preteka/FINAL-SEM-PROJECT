import React from 'react';
import AdminHeader from '../../components/Header/Header';

const AdminOrders = () => {
    return (
        <>
            <AdminHeader title="Order Management" />
            <div className="admin-content">
                <div className="admin-section-header">
                    <h2>Orders</h2>
                    <p>Track and manage customer orders.</p>
                </div>
                <div className="admin-table-container">
                    <p style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                        Order management system is being initialized...
                    </p>
                </div>
            </div>
        </>
    );
};

export default AdminOrders;
