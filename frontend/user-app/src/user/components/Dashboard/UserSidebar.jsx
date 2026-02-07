import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { User, ShoppingCart, Clock, Settings, LayoutDashboard, Home, LogOut } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import '../../styles/dashboard.css';

const UserSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const navItems = [
        { icon: <User size={20} />, label: 'Profile', path: '/profile' },
        { icon: <ShoppingCart size={20} />, label: 'My Cart', path: '/cart' },
        { icon: <Clock size={20} />, label: 'Order History', path: '/orders' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="dashboard-sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <LayoutDashboard size={24} />
                </div>
                <span style={{ fontWeight: 700, fontSize: '20px', color: '#2D3142' }}>Dashboard</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <div className="icon-box">
                            {item.icon}
                        </div>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '20px', borderTop: '1px solid #F0F2F5' }}>
                <NavLink to="/" className="sidebar-link">
                    <div className="icon-box">
                        <Home size={20} />
                    </div>
                    <span>Back to Store</span>
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="sidebar-link"
                    style={{ background: 'none', width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                    <div className="icon-box">
                        <LogOut size={20} />
                    </div>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default UserSidebar;
