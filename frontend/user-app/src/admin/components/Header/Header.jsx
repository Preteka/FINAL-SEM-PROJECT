import React from 'react';
import { useAuth } from '../../../shared/context/AuthContext';

const AdminHeader = ({ title }) => {
    const { user } = useAuth();
    const displayName = user?.name || user?.email?.split('@')[0] || 'Admin';
    const initial = displayName.charAt(0).toUpperCase();

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
                    <div className="admin-profile-img">{initial}</div>
                    <span>{displayName}</span>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;

