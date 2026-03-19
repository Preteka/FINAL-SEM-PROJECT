import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { Mail, Calendar, Shield, UserCircle, Camera, Loader2, MapPin, Plus, Edit2, Trash2, Check, Phone as PhoneIcon, Home } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
    const location = useLocation();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [personalInfo, setPersonalInfo] = useState({
        firstName: user?.firstName || user?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || '',
        lastName: user?.lastName || (user?.name?.split(' ').length > 1 ? user.name.split(' ').slice(1).join(' ') : '') || (user?.displayName?.split(' ').length > 1 ? user.displayName.split(' ').slice(1).join(' ') : '') || '',
        email: user?.email || '',
        phone: user?.phone || user?.phoneNumber || '',
        dob: user?.dob || '',
        gender: user?.gender || '',
        photoURL: user?.photoURL || ''
    });

    const [tempInfo, setTempInfo] = useState({ ...personalInfo });

    useEffect(() => {
        if (user) {
            const info = {
                firstName: user.firstName || user.name?.split(' ')[0] || user.displayName?.split(' ')[0] || '',
                lastName: user.lastName || (user.name?.split(' ').length > 1 ? user.name.split(' ').slice(1).join(' ') : '') || (user.displayName?.split(' ').length > 1 ? user.displayName.split(' ').slice(1).join(' ') : '') || '',
                email: user.email || '',
                phone: user.phone || user.phoneNumber || '',
                dob: user.dob || '',
                gender: user.gender || '',
                photoURL: user.photoURL || ''
            };
            setPersonalInfo(info);
            setTempInfo(info);
        }
    }, [user]);

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
            // Update Firestore
            await updateDoc(doc(db, "users", user.uid), {
                ...tempInfo,
                name: `${tempInfo.firstName} ${tempInfo.lastName}`.trim(),
                updatedAt: new Date().toISOString()
            });

            setPersonalInfo({ ...tempInfo });
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleDiscard = () => {
        setTempInfo({ ...personalInfo });
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempInfo(prev => ({ ...prev, [name]: value }));
    };

    return (
        <ProfileLayout>
            <div className="profile-card-simple">
                {/* Personal Information Header */}
                <div className="section-header" style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1C1917', margin: 0 }}>Personal Information</h2>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '5px' }}>Manage your profile and personal details</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '50px' }}>
                    {/* Left: Profile Image */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div className="profile-avatar-wrapper" style={{ width: '180px', height: '180px' }}>
                            {personalInfo.photoURL ? (
                                <img
                                    src={personalInfo.photoURL}
                                    alt="Profile"
                                    className="profile-avatar-main"
                                    style={{ width: '100%', height: '100%', borderRadius: '20px' }}
                                />
                            ) : (
                                <div className="profile-avatar-main" style={{
                                    width: '100%', height: '100%', borderRadius: '20px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: '#f5f5f5', color: '#5D4037'
                                }}>
                                    <UserCircle size={100} />
                                </div>
                            )}

                            <button
                                className="upload-trigger"
                                onClick={handleUploadClick}
                                disabled={uploading}
                                style={{ bottom: '10px', right: '10px' }}
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
                        <h3 style={{ marginTop: '15px', fontSize: '1.2rem', fontWeight: '800' }}>
                            {personalInfo.firstName} {personalInfo.lastName}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '5px' }}>
                            <Shield size={14} fill="#10b981" color="white" /> Verified User
                        </div>
                    </div>

                    {/* Right: Personal Details Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#444' }}>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={isEditing ? tempInfo.firstName : personalInfo.firstName}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: isEditing ? 'white' : '#f9f9f9' }}
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#444' }}>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={isEditing ? tempInfo.lastName : personalInfo.lastName}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: isEditing ? 'white' : '#f9f9f9' }}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#444' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="email"
                                    value={personalInfo.email}
                                    disabled
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#f9f9f9', paddingRight: '100px' }}
                                />
                                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                    ✓ Verified
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#444' }}>Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={isEditing ? tempInfo.dob : personalInfo.dob}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: isEditing ? 'white' : '#f9f9f9' }}
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#444' }}>Gender</label>
                                <select
                                    name="gender"
                                    value={isEditing ? tempInfo.gender : personalInfo.gender}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: isEditing ? 'white' : '#f9f9f9' }}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#444' }}>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={isEditing ? tempInfo.phone : personalInfo.phone}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="Enter mobile number"
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: isEditing ? 'white' : '#f9f9f9' }}
                            />
                        </div>

                        <div className="address-section" style={{
                            marginTop: '10px',
                            padding: '20px',
                            borderRadius: '12px',
                            backgroundColor: '#fdf8f6',
                            border: '1px solid #f2e7e3',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <h4 style={{ margin: 0, color: '#1C1917', fontWeight: '700' }}>Manage Addresses</h4>
                                <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#666' }}>Add or edit your delivery addresses</p>
                            </div>
                            <button
                                onClick={() => navigate('/profile/addresses')}
                                className="btn btn-outline"
                                style={{ padding: '8px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <MapPin size={18} /> Manage
                            </button>
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn btn-primary"
                                    style={{ padding: '12px 30px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}
                                >
                                    <Edit2 size={18} /> Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="btn btn-primary"
                                        disabled={saving}
                                        style={{ padding: '12px 30px', borderRadius: '10px' }}
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={handleDiscard}
                                        className="btn btn-outline"
                                        disabled={saving}
                                        style={{ padding: '12px 30px', borderRadius: '10px' }}
                                    >
                                        Discard Changes
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
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
