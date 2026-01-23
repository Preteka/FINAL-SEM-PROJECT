import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/Header/Header';
import StatCard from '../../components/Cards/StatCard';
import MockChart from '../../components/Charts/MockChart';
import { API_BASE_URL } from '../../config';

const AdminDashboard = () => {
    const [stats, setStats] = useState([]);
    const [latestOrders, setLatestOrders] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, ordersRes, stockRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/admin/stats`),
                    fetch(`${API_BASE_URL}/admin/latest-orders`),
                    fetch(`${API_BASE_URL}/admin/low-stock`)
                ]);

                const statsData = await statsRes.json();
                const ordersData = await ordersRes.json();
                const stockData = await stockRes.json();

                setStats(statsData);
                setLatestOrders(ordersData);
                setLowStock(stockData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="admin-content">Loading dashboard...</div>;
    }

    return (
        <>
            <AdminHeader title="Business Dashboard" />
            <div className="admin-content">
                <div className="admin-grid">
                    {stats.map((stat, index) => (
                        <StatCard key={index} title={stat.title} value={stat.value} />
                    ))}
                </div>

                <div className="dashboard-row">
                    <div className="dashboard-col" style={{ flex: '2' }}>
                        <div className="admin-table-container" style={{ margin: 0 }}>
                            <div className="admin-table-title">Latest Orders</div>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Product</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {latestOrders.length > 0 ? (
                                            latestOrders.map(order => (
                                                <tr key={order.id}>
                                                    <td>{order.id}</td>
                                                    <td>{order.customer}</td>
                                                    <td>{order.product}</td>
                                                    <td>
                                                        <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                                    No recent orders found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-col">
                        <MockChart title="Category Distribution" type="Pie" />
                    </div>
                </div>

                <div className="dashboard-row">
                    <div className="dashboard-col">
                        <MockChart title="Monthly Sales" type="Bar" />
                    </div>
                    <div className="dashboard-col">
                        <div className="admin-table-container" style={{ margin: 0 }}>
                            <div className="admin-table-title">Low Stock Alerts</div>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lowStock.length > 0 ? (
                                            lowStock.map((product, index) => (
                                                <tr key={index}>
                                                    <td>{product.name}</td>
                                                    <td>
                                                        <span className="status-badge status-low">
                                                            {product.remaining} units
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                                    All products are in stock.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
