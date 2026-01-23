import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Calendar, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <p>Please log in to view your profile.</p>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/login')}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            padding: '120px 20px 60px',
            backgroundColor: '#f8f9fa'
        }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: 'none',
                        background: 'none',
                        color: 'var(--color-primary)',
                        cursor: 'pointer',
                        marginBottom: '30px',
                        fontWeight: '600'
                    }}
                >
                    <ArrowLeft size={20} />
                    Back
                </button>

                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    boxShadow: 'var(--shadow-lg)',
                    overflow: 'hidden'
                }}>
                    {/* Header/Cover */}
                    <div style={{
                        height: '150px',
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, #8d6e63 100%)',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            bottom: '-50px',
                            left: '50px',
                            width: '120px',
                            height: '120px',
                            borderRadius: '60px',
                            backgroundColor: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                            border: '4px solid white'
                        }}>
                            <User size={60} color="var(--color-primary)" />
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{
                        padding: '70px 50px 50px'
                    }}>
                        <div style={{ marginBottom: '40px' }}>
                            <h1 style={{
                                fontSize: '2.5rem',
                                color: 'var(--color-text)',
                                marginBottom: '5px'
                            }}>
                                {user.displayName || user.name || 'User'}
                            </h1>
                            <p style={{ color: 'var(--color-text-light)', fontSize: '1.1rem' }}>
                                Premium Member
                            </p>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '30px'
                        }}>
                            {/* Detail Cards */}
                            <DetailCard
                                icon={<Mail size={22} />}
                                label="Email Address"
                                value={user.email}
                            />
                            <DetailCard
                                icon={<Shield size={22} />}
                                label="Account Role"
                                value={user.role || 'User'}
                            />
                            <DetailCard
                                icon={<Calendar size={22} />}
                                label="Member Since"
                                value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric',
                                    day: 'numeric'
                                }) : 'N/A'}
                            />
                            <DetailCard
                                icon={<User size={22} />}
                                label="User ID"
                                value={user.uid?.substring(0, 12) + '...'}
                            />
                        </div>

                        {/* Actions */}
                        <div style={{
                            marginTop: '50px',
                            display: 'flex',
                            gap: '20px'
                        }}>
                            <button className="btn btn-primary" style={{ padding: '12px 30px' }}>
                                Edit Profile
                            </button>
                            <button className="btn btn-outline" style={{ padding: '12px 30px' }}>
                                Order History
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailCard = ({ icon, label, value }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '20px',
        backgroundColor: '#fdf8f6',
        borderRadius: '12px',
        border: '1px solid #f2e7e3'
    }}>
        <div style={{
            width: '45px',
            height: '45px',
            borderRadius: '10px',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            color: 'var(--color-primary)'
        }}>
            {icon}
        </div>
        <div>
            <p style={{
                margin: 0,
                fontSize: '0.9rem',
                color: 'var(--color-text-light)',
                fontWeight: '500'
            }}>
                {label}
            </p>
            <p style={{
                margin: '2px 0 0',
                fontSize: '1.05rem',
                color: 'var(--color-text)',
                fontWeight: '600'
            }}>
                {value}
            </p>
        </div>
    </div>
);

export default Profile;
