import React from 'react';

const AdminHeader = ({ title }) => {
    return (
        <header className="admin-header">
            <div className="admin-header-left">
                <h1>{title || 'Store Management'}</h1>
            </div>
            <div className="admin-header-right">
                <div className="admin-header-icon">
                    <i className="fas fa-bell"></i>
                </div>
                <div className="admin-profile">
                    <div className="admin-profile-img">A</div>
                    <span>Admin</span>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
