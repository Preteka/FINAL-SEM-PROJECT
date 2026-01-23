import React from 'react';
import AdminHeader from '../../components/Header/Header';

const AdminInventory = () => {
    return (
        <>
            <AdminHeader title="Inventory Management" />
            <div className="admin-content">
                <div className="admin-section-header">
                    <h2>Inventory</h2>
                    <p>Monitor stock levels and warehouse data.</p>
                </div>
                <div className="admin-table-container">
                    <p style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                        Inventory tracking system is being initialized...
                    </p>
                </div>
            </div>
        </>
    );
};

export default AdminInventory;
