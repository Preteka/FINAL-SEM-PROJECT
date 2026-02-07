import React from 'react';
import ProfileLayout from '../../components/Profile/ProfileLayout';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
    return (
        <ProfileLayout>
            <div className="profile-card-simple">
                <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #f2e7e3' }}>
                    <h2 style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <SettingsIcon size={24} />
                        Account Settings
                    </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ padding: '20px', backgroundColor: '#fdf8f6', borderRadius: '12px', border: '1px solid #f2e7e3' }}>
                        <h4 style={{ margin: 0, color: 'var(--color-primary)' }}>Notification Preferences</h4>
                        <p style={{ margin: '10px 0 0', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                            Manage how you receive updates and alerts.
                        </p>
                    </div>
                </div>
            </div>
        </ProfileLayout>
    );
};

export default Settings;
