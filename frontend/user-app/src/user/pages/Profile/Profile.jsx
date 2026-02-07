import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { Mail, Calendar, Shield, UserCircle, Camera, Loader2, MapPin } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import ProfileLayout from '../../components/Profile/ProfileLayout';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db, auth } from '../../../shared/services/firebase';
import { ShoppingBag, ChevronRight, Clock } from 'lucide-react';
import './Profile.css';

const CLOUDINARY_UPLOAD_PRESET = "tvu6unvq";
const CLOUDINARY_CLOUD_NAME = "dytty2qzo";

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user?.displayName || user?.name || '');
    const [editPhone, setEditPhone] = useState(user?.phoneNumber || '');
    const [editAddress, setEditAddress] = useState(user?.address || '');
    const [saving, setSaving] = useState(false);
    const [recentOrders, setRecentOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

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

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            formData.append('folder', 'user_profiles');

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();
            const photoURL = data.secure_url;

            // Update Firebase Auth Profile
            await updateProfile(auth.currentUser, { photoURL });

            // Update Firestore User Document
            await updateDoc(doc(db, "users", user.uid), {
                photoURL: photoURL
            });

            alert('Profile photo updated successfully!');
            window.location.reload(); // Refresh to show new photo
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('Failed to upload photo. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // 1. Update Firebase Auth
            await updateProfile(auth.currentUser, {
                displayName: editName
            });

            // 2. Update Firestore
            await updateDoc(doc(db, "users", user.uid), {
                name: editName,
                phoneNumber: editPhone,
                address: editAddress,
                updatedAt: new Date().toISOString()
            });

            setIsEditing(false);
            alert('Profile updated successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        const fetchRecentOrders = async () => {
            if (!user) return;
            try {
                const q = query(
                    collection(db, 'orders'),
                    where('userId', '==', user.uid)
                );
                const querySnapshot = await getDocs(q);
                const orders = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3);

                setRecentOrders(orders);
            } catch (error) {
                console.error("Error fetching recent orders:", error);
            } finally {
                setOrdersLoading(false);
            }
        };

        fetchRecentOrders();
    }, [user]);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending': return { bg: 'rgba(255, 152, 0, 0.1)', color: '#e65100' };
            case 'processing': return { bg: 'rgba(33, 150, 243, 0.1)', color: '#1565c0' };
            case 'shipped': return { bg: 'rgba(156, 39, 176, 0.1)', color: '#7b1fa2' };
            case 'delivered': return { bg: 'rgba(76, 175, 80, 0.1)', color: '#2e7d32' };
            default: return { bg: 'var(--color-gray-100)', color: 'var(--color-text-light)' };
        }
    };

    return (
        <ProfileLayout>
            <div className="profile-card-simple">
                {/* Centered Profile Header */}
                <div className="profile-header-center">
                    <div className="profile-avatar-wrapper">
                        {user.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt="Profile"
                                className="profile-avatar-main"
                            />
                        ) : (
                            <div className="profile-avatar-main" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'var(--color-secondary)',
                                color: 'var(--color-primary)'
                            }}>
                                <UserCircle size={100} />
                            </div>
                        )}

                        <button
                            className="upload-trigger"
                            onClick={handleUploadClick}
                            disabled={uploading}
                            title="Upload Profile Photo"
                        >
                            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                    </div>

                    {isEditing ? (
                        <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                style={{
                                    fontSize: '2.5rem',
                                    color: 'var(--color-primary)',
                                    marginBottom: '5px',
                                    textAlign: 'center',
                                    width: '100%',
                                    border: 'none',
                                    borderBottom: '2px solid var(--color-primary)',
                                    background: 'transparent',
                                    outline: 'none',
                                    fontWeight: 'bold'
                                }}
                                placeholder="Edit Name"
                            />
                        </div>
                    ) : (
                        <h1 style={{
                            fontSize: '2.5rem',
                            color: 'var(--color-primary)',
                            marginBottom: '5px'
                        }}>
                            {user.displayName || user.name || 'User'}
                        </h1>
                    )}
                    <p style={{ color: 'var(--color-text-light)', fontSize: '1.1rem' }}>
                        Premium Member
                    </p>
                </div>

                <div className="profile-details-grid">
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
                    {isEditing ? (
                        <>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                padding: '20px',
                                backgroundColor: '#fdf8f6',
                                borderRadius: '12px',
                                border: '2px solid var(--color-primary)'
                            }}>
                                <div style={{ color: 'var(--color-primary)' }}><UserCircle size={22} /></div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-light)' }}>Phone Number</p>
                                    <input
                                        type="text"
                                        value={editPhone}
                                        onChange={(e) => setEditPhone(e.target.value)}
                                        style={{
                                            width: '100%',
                                            border: 'none',
                                            background: 'transparent',
                                            fontSize: '1.05rem',
                                            color: 'var(--color-text)',
                                            fontWeight: '600',
                                            outline: 'none',
                                            padding: '2px 0'
                                        }}
                                        placeholder="Enter Phone Number"
                                    />
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                padding: '20px',
                                backgroundColor: '#fdf8f6',
                                borderRadius: '12px',
                                border: '2px solid var(--color-primary)'
                            }}>
                                <div style={{ color: 'var(--color-primary)' }}><MapPin size={22} /></div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-light)' }}>Address</p>
                                    <input
                                        type="text"
                                        value={editAddress}
                                        onChange={(e) => setEditAddress(e.target.value)}
                                        style={{
                                            width: '100%',
                                            border: 'none',
                                            background: 'transparent',
                                            fontSize: '1.05rem',
                                            color: 'var(--color-text)',
                                            fontWeight: '600',
                                            outline: 'none',
                                            padding: '2px 0'
                                        }}
                                        placeholder="Enter Address"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <DetailCard
                                icon={<UserCircle size={22} />}
                                label="Phone Number"
                                value={user.phoneNumber || 'Not Set'}
                            />
                            <DetailCard
                                icon={<MapPin size={22} />}
                                label="Address"
                                value={user.address || 'Not Set'}
                            />
                        </>
                    )}
                </div>

                {/* Recent Orders Section */}
                <div className="recent-orders-section">
                    <div className="section-header">
                        <div className="title-with-icon">
                            <ShoppingBag size={22} />
                            <h2>Recent Orders</h2>
                        </div>
                        <Link to="/orders" className="view-all-link">
                            View All <ChevronRight size={16} />
                        </Link>
                    </div>

                    {ordersLoading ? (
                        <div className="orders-loader">
                            <Loader2 className="animate-spin" />
                            <span>Fetching latest updates...</span>
                        </div>
                    ) : recentOrders.length > 0 ? (
                        <div className="recent-orders-list">
                            {recentOrders.map((order) => {
                                const statusStyle = getStatusStyles(order.status);
                                return (
                                    <div key={order.id} className="recent-order-item" onClick={() => navigate('/orders')}>
                                        <div className="order-info">
                                            <span className="order-id">#{order.id.slice(0, 8).toUpperCase()}</span>
                                            <span className="order-date">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short'
                                                })}
                                            </span>
                                        </div>
                                        <div className="order-status-badge" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                                            <Clock size={12} />
                                            <span>{order.status}</span>
                                        </div>
                                        <div className="order-total">
                                            ₹{order.total?.toLocaleString()}
                                        </div>
                                        <ChevronRight size={18} className="arrow-icon" />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="no-orders-msg">
                            <p>No recent orders found.</p>
                            <Link to="/products" className="shop-now-text">Start shopping</Link>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div style={{
                    marginTop: '50px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px'
                }}>
                    {isEditing ? (
                        <>
                            <button
                                className="btn btn-primary"
                                style={{ padding: '12px 40px' }}
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                            </button>
                            <button
                                className="btn btn-outline"
                                style={{ padding: '12px 40px' }}
                                onClick={() => setIsEditing(false)}
                                disabled={saving}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            className="btn btn-primary"
                            style={{ padding: '12px 40px' }}
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </ProfileLayout>
    );
};

const DetailCard = ({ icon, label, value }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '20px',
        backgroundColor: 'var(--color-secondary)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)'
    }}>
        <div style={{
            width: '45px',
            height: '45px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-white)',
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
