import React, { useState } from 'react';
import { Download, Printer, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react';
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
    const [showInvoiceView, setShowInvoiceView] = useState(false);

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
        setShowInvoiceView(false); // Default to details view
    };

    const handleViewInvoice = (order) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
        setShowInvoiceView(true);
    };

    const downloadInvoice = () => {
        if (!selectedOrder) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 1000;

        // Background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(0, 0, canvas.width, 120);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial';
        ctx.fillText('VINAYAGA GLASS & PLYWOODS', 40, 70);
        ctx.font = '16px Arial';
        ctx.fillText('OFFICIAL TAX INVOICE', 40, 100);

        // Order Info
        ctx.fillStyle = '#333';
        ctx.font = 'bold 22px Arial';
        ctx.fillText(`Invoice ID: ${selectedOrder.orderId || selectedOrder.id.substring(0, 8).toUpperCase()}`, 40, 170);
        ctx.font = '16px Arial';
        ctx.fillText(`Date: ${new Date(selectedOrder.createdAt).toLocaleDateString()}`, 40, 200);

        // Customer Info
        ctx.fillText('Billed To:', 40, 250);
        ctx.font = 'bold 18px Arial';
        ctx.fillText(selectedOrder.customerName || 'Guest User', 40, 275);
        ctx.font = '16px Arial';
        ctx.fillText(selectedOrder.customerEmail || selectedOrder.userEmail || 'N/A', 40, 300);
        ctx.fillText(selectedOrder.customerPhone || 'N/A', 40, 325);

        ctx.font = '14px Arial';
        const addressLines = (selectedOrder.shippingAddress || 'N/A').split(', ');
        addressLines.forEach((line, i) => {
            ctx.fillText(line, 40, 350 + (i * 20));
        });

        // Table Header
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(40, 420, 720, 45);
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Description', 55, 450);
        ctx.fillText('Qty', 480, 450);
        ctx.fillText('Price', 580, 450);
        ctx.fillText('Amount', 680, 450);

        // Items
        let y = 495;
        (selectedOrder.items || []).forEach(item => {
            ctx.fillStyle = '#1e293b';
            ctx.font = '14px Arial';
            ctx.fillText(item.name.substring(0, 50), 55, y);
            ctx.fillText(item.quantity.toString(), 480, y);
            ctx.fillText(`₹${(item.price ? parseInt(item.price.replace(/[^\d]/g, '')) : 0).toLocaleString()}`, 580, y);
            const itemTotal = (item.price ? parseInt(item.price.replace(/[^\d]/g, '')) : 0) * item.quantity;
            ctx.fillText(`₹${itemTotal.toLocaleString()}`, 680, y);

            ctx.strokeStyle = '#f1f5f9';
            ctx.beginPath();
            ctx.moveTo(40, y + 10);
            ctx.lineTo(760, y + 10);
            ctx.stroke();

            y += 40;
        });

        // Totals
        y += 20;
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Subtotal:', 530, y);
        ctx.fillText(`₹${(selectedOrder.subtotal || 0).toLocaleString()}`, 680, y);

        y += 30;
        ctx.fillText('Shipping:', 530, y);
        ctx.fillText(`₹${(selectedOrder.shipping || 0).toLocaleString()}`, 680, y);

        y += 40;
        ctx.fillStyle = '#5D4037';
        ctx.font = 'bold 22px Arial';
        ctx.fillText('GRAND TOTAL:', 450, y);
        ctx.fillText(`₹${(selectedOrder.total || selectedOrder.totalAmount || 0).toLocaleString()}`, 680, y);

        // Footer
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'italic 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('This is a computer generated invoice. No signature required.', canvas.width / 2, 940);
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#5D4037';
        ctx.fillText('Thank you for your business!', canvas.width / 2, 970);

        // Download
        const link = document.createElement('a');
        link.download = `Invoice-${selectedOrder.id.substring(0, 8).toUpperCase()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
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
                                                            title="View Invoice"
                                                            onClick={() => handleViewInvoice(order)}
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
                            {showInvoiceView ? (
                                <div className="invoice-container" style={{
                                    backgroundColor: 'white',
                                    borderRadius: '16px',
                                    border: '1px solid #eee',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                }}>
                                    {/* Invoice Header */}
                                    <div style={{ backgroundColor: '#5D4037', padding: '1.5rem', color: 'white' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h2 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>VINAYAGA</h2>
                                                <p style={{ margin: '2px 0 0 0', opacity: 0.8, fontSize: '10px', letterSpacing: '1px' }}>GLASS & PLYWOODS</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <h3 style={{ margin: 0, opacity: 0.9, fontSize: '1.2rem' }}>INVOICE</h3>
                                                <p style={{ margin: '2px 0 0 0', fontWeight: 'bold' }}>#{selectedOrder.orderId || selectedOrder.id.substring(0, 8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ padding: '1.5rem' }}>
                                        {/* Billing Info */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                            <div>
                                                <h4 style={{ color: '#888', textTransform: 'uppercase', fontSize: '10px', marginBottom: '10px', letterSpacing: '1px' }}>Billed To</h4>
                                                <p style={{ fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '1rem' }}>{selectedOrder.customerName || 'Guest User'}</p>
                                                <div style={{ color: '#555', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={12} /> {selectedOrder.customerEmail || selectedOrder.userEmail || 'N/A'}</span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={12} /> {selectedOrder.customerPhone || 'N/A'}</span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={12} /> {selectedOrder.shippingAddress || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <h4 style={{ color: '#888', textTransform: 'uppercase', fontSize: '10px', marginBottom: '10px', letterSpacing: '1px' }}>Order Date</h4>
                                                <p style={{ fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                                                    <Calendar size={14} /> {formatDate(selectedOrder.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Table */}
                                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                                            <thead style={{ backgroundColor: '#f8fafc' }}>
                                                <tr>
                                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', fontSize: '0.75rem' }}>Product</th>
                                                    <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #e2e8f0', fontSize: '0.75rem' }}>Qty</th>
                                                    <th style={{ padding: '10px', textAlign: 'right', borderBottom: '2px solid #e2e8f0', fontSize: '0.75rem' }}>Price</th>
                                                    <th style={{ padding: '10px', textAlign: 'right', borderBottom: '2px solid #e2e8f0', fontSize: '0.75rem' }}>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedOrder.items?.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td style={{ padding: '10px', borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>{item.name}</td>
                                                        <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>{item.quantity}</td>
                                                        <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>₹{(item.price ? parseInt(item.price.replace(/[^\d]/g, '')) : 0).toLocaleString()}</td>
                                                        <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #f1f5f9', fontWeight: 'bold', fontSize: '0.85rem' }}>₹{((item.price ? parseInt(item.price.replace(/[^\d]/g, '')) : 0) * item.quantity).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {/* Summary */}
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <div style={{ width: '250px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                                                    <span style={{ color: '#64748b' }}>Subtotal</span>
                                                    <span style={{ fontWeight: 'bold' }}>₹{(selectedOrder.subtotal || 0).toLocaleString()}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.85rem' }}>
                                                    <span style={{ color: '#64748b' }}>Shipping</span>
                                                    <span style={{ fontWeight: 'bold' }}>₹{(selectedOrder.shipping || 0).toLocaleString()}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '2px solid #334155' }}>
                                                    <span style={{ fontSize: '1rem', fontWeight: '900' }}>TOTAL</span>
                                                    <span style={{ fontSize: '1rem', fontWeight: '900', color: '#5D4037' }}>₹{(selectedOrder.total || selectedOrder.totalAmount || 0).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
                                        {/* Customer Info */}
                                        <div style={{ background: '#fdfaf9', padding: '1.5rem', borderRadius: '12px', border: '1px solid #efebe9' }}>
                                            <h4 style={{ color: '#8d6e63', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <i className="fas fa-user"></i> Customer Info
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <p style={{ margin: 0 }}><strong>Name:</strong> {selectedOrder.customerName || 'Guest User'}</p>
                                                <p style={{ margin: 0 }}><strong>Email:</strong> {selectedOrder.customerEmail || selectedOrder.userEmail || 'N/A'}</p>
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
                                                            ₹{((item.price ? parseInt(item.price.replace(/[^\d]/g, '')) : 0) * item.quantity).toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>

                        <div style={{ padding: '1.5rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            {showInvoiceView && (
                                <>
                                    <button
                                        className="action-btn"
                                        onClick={downloadInvoice}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            background: '#334155',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <Download size={18} /> Download
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => window.print()}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            background: '#f1f5f9',
                                            color: '#334155',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <Printer size={18} /> Print
                                    </button>
                                </>
                            )}
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


