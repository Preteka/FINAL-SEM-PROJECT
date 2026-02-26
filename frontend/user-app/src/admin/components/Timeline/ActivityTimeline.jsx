import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../../shared/services/firebase';

const ActivityTimeline = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribers = [];

        // Listen to products for new additions
        const productsQuery = query(
            collection(db, 'products'),
            orderBy('createdAt', 'desc'),
            limit(3)
        );
        const unsubProducts = onSnapshot(productsQuery, (snapshot) => {
            const productActivities = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: `product-${doc.id}`,
                    type: 'product',
                    icon: 'fa-box',
                    color: '#8d6e63',
                    title: 'New Product Added',
                    detail: data.name,
                    time: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Recently'
                };
            });

            setActivities(prev => {
                const filtered = prev.filter(a => a.type !== 'product');
                return [...productActivities, ...filtered].slice(0, 10);
            });
            setLoading(false);
        });
        unsubscribers.push(unsubProducts);

        // Listen to users for new registrations
        const usersQuery = query(
            collection(db, 'users'),
            orderBy('createdAt', 'desc'),
            limit(3)
        );
        const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
            const userActivities = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: `user-${doc.id}`,
                    type: 'user',
                    icon: 'fa-user-plus',
                    color: '#6d4c41',
                    title: 'New User Registered',
                    detail: data.name || data.email,
                    time: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Recently'
                };
            });

            setActivities(prev => {
                const filtered = prev.filter(a => a.type !== 'user');
                return [...userActivities, ...filtered].slice(0, 10);
            });
        });
        unsubscribers.push(unsubUsers);

        return () => {
            unsubscribers.forEach(unsub => unsub());
        };
    }, []);

    if (loading) {
        return (
            <div className="admin-table-container">
                <div className="admin-table-title">Recent Activity</div>
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    <i className="fas fa-spinner fa-spin"></i> Loading...
                </div>
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="admin-table-container">
                <div className="admin-table-title">Recent Activity</div>
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    No recent activity to display.
                </div>
            </div>
        );
    }

    return (
        <div className="admin-table-container">
            <div className="admin-table-title">Recent Activity</div>
            <div style={{ padding: '1.5rem' }}>
                <div className="activity-timeline">
                    {activities.map((activity, index) => (
                        <div
                            key={activity.id}
                            className="activity-item"
                            style={{
                                display: 'flex',
                                gap: '1rem',
                                marginBottom: index !== activities.length - 1 ? '1.5rem' : 0,
                                animation: `slideInLeft 0.5s ease-out ${index * 0.1}s both`,
                                position: 'relative'
                            }}
                        >
                            {index !== activities.length - 1 && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: '20px',
                                        top: '40px',
                                        bottom: '-24px',
                                        width: '2px',
                                        backgroundColor: '#e2e8f0'
                                    }}
                                />
                            )}
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: activity.color + '20',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            >
                                <i className={`fas ${activity.icon}`} style={{ color: activity.color, fontSize: '1rem' }}></i>
                            </div>
                            <div style={{ flex: 1, paddingTop: '0.25rem' }}>
                                <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                                    {activity.title}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                    {activity.detail}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                    {activity.time}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default ActivityTimeline;
