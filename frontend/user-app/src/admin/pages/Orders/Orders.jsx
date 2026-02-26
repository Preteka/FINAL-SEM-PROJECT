import React, { useState } from 'react';
import AdminHeader from '../../components/Header/Header';
import { useOrders } from '../../hooks/useOrders';
import { db } from '../../../shared/services/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const AdminOrders = () => {
    const { orders, loading, error, deleteOrder } = useOrders();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            (order.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (order.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (order.customerEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' || order.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'order delivered': return { bg: '#dcfce7', color: '#16a34a', text: 'Delivered' };
            case 'pending': return { bg: '#fff7ed', color: '#ea580c', text: 'Pending' };
            case 'order received': return { bg: '#fef9c3', color: '#854d0e', text: 'Received' };
            case 'order packed': return { bg: '#e0f2fe', color: '#0369a1', text: 'Packed' };
            case 'order shipped': return { bg: '#f0fdfa', color: '#0d9488', text: 'Shipped' };
            case 'cancelled': return { bg: '#fef2f2', color: '#dc2626', text: 'Cancelled' };
            default: return { bg: '#f1f5f9', color: '#64748b', text: status || 'Unknown' };
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, {
                status: newStatus,
                updatedAt: new Date().toISOString()
            });
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update status");
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
            const result = await deleteOrder(orderId);
            if (!result.success) {
                alert("Failed to delete order: " + result.error);
            }
        }
    };

    if (error) return <div className="admin-content">Error loading orders: {error}</div>;


    return (
        <>
            <AdminHeader title="Order Management" />
            <div className="admin-content">
                {/* Advanced Page Header */}
                <div
                    className="admin-section-header"
                    style={{
                        background: 'linear-gradient(135deg, #8d6e63 0%, #5d4037 100%)',
                        padding: '2rem',
                        borderRadius: '12px',
                        color: 'white',
                        marginBottom: '2rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1.5rem',
                        animation: 'slideInDown 0.6s ease-out',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}
                >
                    <div>
                        <h2 style={{ color: 'white', marginBottom: '0.4rem', fontSize: '1.75rem' }}>Customer Orders</h2>
                        <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                            <i className="fas fa-shopping-cart me-2"></i> Managing {filteredOrders.length} active transactions
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: '10px',
                                border: 'none',
                                outline: 'none',
                                background: 'white',
                                color: '#5d4037',
                                fontWeight: '600',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                            }}
                        >
                            <option value="all">All Status</option>
                            <option value="order received">Order Received</option>
                            <option value="order packed">Order Packed</option>
                            <option value="order shipped">Order Shipped</option>
                            <option value="order delivered">Order Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <div style={{ position: 'relative' }}>
                            <i className="fas fa-search" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#8d6e63' }}></i>
                            <input
                                type="text"
                                placeholder="Search by name, email or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    padding: '0.75rem 1rem 0.75rem 2.8rem',
                                    border: 'none',
                                    borderRadius: '10px',
                                    minWidth: '300px',
                                    outline: 'none',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                    fontSize: '0.95rem'
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="admin-table-container">
                    <div className="admin-table-wrapper">
                        {loading && orders.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center' }}>
                                <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#8d6e63', marginBottom: '1rem' }}></i>
                                <p>Checking for orders...</p>
                            </div>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order, index) => {
                                        const status = getStatusStyle(order.status);
                                        return (
                                            <tr
                                                key={order.id}
                                                style={{
                                                    animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                                                }}
                                            >
                                                <td>
                                                    <span
                                                        onClick={() => handleViewDetails(order)}
                                                        style={{
                                                            fontWeight: 'bold',
                                                            color: '#8d6e63',
                                                            fontSize: '0.85rem',
                                                            cursor: 'pointer',
                                                            textDecoration: 'underline'
                                                        }}
                                                        title="Click to view details"
                                                    >
                                                        #{order.id.substring(0, 8).toUpperCase()}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontWeight: '600', color: '#1e293b' }}>{order.customerName || 'Guest User'}</span>
                                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{order.customerEmail || order.userEmail}</span>
                                                    </div>
                                                </td>
                                                <td>{formatDate(order.createdAt)}</td>
                                                <td style={{ fontWeight: 'bold', color: '#5d4037' }}>₹{(order.total || order.totalAmount || 0).toLocaleString()}</td>
                                                <td>
                                                    <span
                                                        className="status-badge"
                                                        style={{
                                                            background: status.bg,
                                                            color: status.color,
                                                            padding: '6px 12px',
                                                            borderRadius: '20px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '700',
                                                            textTransform: 'uppercase'
                                                        }}
                                                    >
                                                        {status.text}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                                                        <button
                                                            className="action-btn"
                                                            title="View Details"
                                                            onClick={() => handleViewDetails(order)}
                                                            style={{ color: '#8d6e63' }}
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </button>
                                                        <select
                                                            className="action-btn"
                                                            value={order.status || 'order received'}
                                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                            style={{
                                                                fontSize: '0.8rem',
                                                                padding: '4px 8px',
                                                                borderRadius: '6px',
                                                                border: '1px solid #d7ccc8',
                                                                background: 'white',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <option value="order received">Order Received</option>
                                                            <option value="order packed">Order Packed</option>
                                                            <option value="order shipped">Order Shipped</option>
                                                            <option value="order delivered">Order Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                        <button
                                                            className="action-btn delete"
                                                            title="Delete Order"
                                                            onClick={() => handleDeleteOrder(order.id)}
                                                            style={{ color: '#ef4444' }}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredOrders.length === 0 && (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                                                <div style={{ opacity: 0.5, marginBottom: '1rem' }}>
                                                    <i className="fas fa-shopping-bag" style={{ fontSize: '3rem' }}></i>
                                                </div>
                                                <h3>No Orders Found</h3>
                                                <p>When customers place orders, they will appear here.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes slideInDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .admin-table tr {
                    transition: all 0.2s ease;
                }

                .admin-table tr:hover {
                    background-color: #fdfaf9 !important;
                    transform: scale(1.002);
                }

                .action-btn {
                    transition: transform 0.2s ease;
                }

                .action-btn:hover {
                    transform: translateY(-2px);
                }

                .admin-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(4px);
                    display: flex;
                    alignItems: center;
                    justifyContent: center;
                    z-index: 1000;
                    padding: 2rem;
                    animation: fadeIn 0.3s ease-out;
                }

                .admin-modal-content {
                    background: white;
                    width: 100%;
                    max-width: 800px;
                    max-height: 90vh;
                    border-radius: 16px;
                    overflow-y: auto;
                    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
                    animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>

            {/* Order Details Modal */}
            {showDetailsModal && selectedOrder && (
                <div className="admin-modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: '#5d4037' }}>Order Details - #{selectedOrder.id.toUpperCase()}</h3>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}
                            >
                                &times;
                            </button>
                        </div>

                        <div style={{ padding: '2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
                                {/* Customer Info */}
                                <div style={{ background: '#fdfaf9', padding: '1.5rem', borderRadius: '12px', border: '1px solid #efebe9' }}>
                                    <h4 style={{ color: '#8d6e63', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <i className="fas fa-user"></i> Customer Info
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <p style={{ margin: 0 }}><strong>Name:</strong> {selectedOrder.customerName || 'N/A'}</p>
                                        <p style={{ margin: 0 }}><strong>Email:</strong> {selectedOrder.customerEmail || selectedOrder.userEmail}</p>
                                        <p style={{ margin: 0 }}><strong>Phone:</strong> {selectedOrder.customerPhone || 'N/A'}</p>
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <strong>Shipping Address:</strong>
                                            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5' }}>
                                                {selectedOrder.shippingAddress || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div style={{ background: '#fdfaf9', padding: '1.5rem', borderRadius: '12px', border: '1px solid #efebe9' }}>
                                    <h4 style={{ color: '#8d6e63', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <i className="fas fa-info-circle"></i> Order Summary
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <p style={{ margin: 0 }}><strong>Status:</strong> {selectedOrder.status?.toUpperCase() || 'PENDING'}</p>
                                        <p style={{ margin: 0 }}><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                                        <p style={{ margin: 0 }}><strong>Payment:</strong> {selectedOrder.paymentMethod?.toUpperCase() || 'COD'}</p>
                                        <div style={{ marginTop: '0.5rem', borderTop: '1px dashed #efebe9', paddingTop: '0.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                                                <span>Subtotal:</span>
                                                <span>₹{(selectedOrder.subtotal || 0).toLocaleString()}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                                                <span>Shipping:</span>
                                                <span>₹{(selectedOrder.shipping || 0).toLocaleString()}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontWeight: 'bold', color: '#5d4037', fontSize: '1.1rem' }}>
                                                <span>Total:</span>
                                                <span>₹{(selectedOrder.total || selectedOrder.totalAmount || 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Itemized List */}
                            <h4 style={{ color: '#5d4037', marginBottom: '1rem' }}>Purchased Items</h4>
                            <div className="admin-table-wrapper" style={{ border: '1px solid #eee', borderRadius: '12px' }}>
                                <table className="admin-table" style={{ margin: 0 }}>
                                    <thead style={{ background: '#f8fafc' }}>
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Qty</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.items?.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                                                        />
                                                        <span style={{ fontWeight: 500 }}>{item.name}</span>
                                                    </div>
                                                </td>
                                                <td>{item.price}</td>
                                                <td>{item.quantity}</td>
                                                <td style={{ fontWeight: 'bold' }}>
                                                    ₹{(parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem', borderTop: '1px solid #eee', textAlign: 'right' }}>
                            <button
                                className="action-btn"
                                onClick={() => setShowDetailsModal(false)}
                                style={{
                                    padding: '0.75rem 2rem',
                                    background: '#8d6e63',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminOrders;


