import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, ShoppingBag, History, Settings, UserCircle } from 'lucide-react';
// HMR Force Update - Context paths fixed
import { useAuth } from '../../../shared/context/AuthContext';
import '../../pages/Profile/Profile.css';

const ProfileSidebar = () => {
    const { user } = useAuth();

    const menuItems = [
        { icon: <User size={20} />, label: 'My Profile', path: '/profile' },
        { icon: <ShoppingBag size={20} />, label: 'My Cart', path: '/cart' },
        { icon: <History size={20} />, label: 'Order History', path: '/orders' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="profile-sidebar">
            <div className="profile-sidebar-header">
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '40px',
                    backgroundColor: '#fdf8f6',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)',
                    border: '2px solid #f2e7e3'
                }}>
                    <UserCircle size={50} />
                </div>
                <h3>{user?.displayName || user?.name || 'User'}</h3>
                <p>{user?.email}</p>
            </div>

            <nav className="profile-nav-links">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => `profile-nav-item ${isActive ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default ProfileSidebar;
