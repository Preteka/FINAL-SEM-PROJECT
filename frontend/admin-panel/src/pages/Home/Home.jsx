import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/Header/Header';
import StatCard from '../../components/Cards/StatCard';
import { API_BASE_URL } from '../../config';

const AdminHome = () => {
    const [summaryData, setSummaryData] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, activityRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/admin/stats`),
                    fetch(`${API_BASE_URL}/admin/activity`)
                ]);

                const statsData = await statsRes.json();
                const activityData = await activityRes.json();

                // Adapt dashboard stats to home summary if needed, 
                // or use specific home stats if added to backend
                setSummaryData(statsData);
                setRecentActivity(activityData);
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="admin-content">Loading...</div>;
    }

    return (
        <>
            <AdminHeader title="Admin Home" />
            <div className="admin-content">
                <div className="admin-section-header">
                    <h2>Welcome, Admin</h2>
                    <p>Manage products, orders, and inventory</p>
                </div>

                <div className="admin-grid">
                    {summaryData.map((stat, index) => (
                        <StatCard key={index} title={stat.title} value={stat.value} />
                    ))}
                </div>

                <div className="admin-table-container">
                    <div className="admin-table-title">Recent Activity</div>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Detail</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentActivity.length > 0 ? (
                                    recentActivity.map(activity => (
                                        <tr key={activity.id}>
                                            <td>{activity.type}</td>
                                            <td>{activity.detail}</td>
                                            <td>{activity.time}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                            No recent activity found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminHome;
