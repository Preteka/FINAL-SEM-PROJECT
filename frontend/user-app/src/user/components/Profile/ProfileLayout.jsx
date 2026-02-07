import React from 'react';
import ProfileSidebar from './ProfileSidebar';
import '../../pages/Profile/Profile.css';

const ProfileLayout = ({ children }) => {
    return (
        <div className="container" style={{ maxWidth: '1200px' }}>
            <div className="profile-layout">
                <ProfileSidebar />
                <main className="profile-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default ProfileLayout;
