import React, { useEffect, useState } from 'react';
import ProfileLayout from '../../components/Profile/ProfileLayout';
import { History, Clock, ChevronRight, Package, X, MapPin, Phone, Mail, FileText, Layout, ReceiptText, Truck, ClipboardCheck } from 'lucide-react';
import { db } from '../../../shared/services/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../../../shared/context/AuthContext';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const q = query(
                    collection(db, 'orders'),
                    where('userId', '==', user.uid)
                );
                const querySnapshot = await getDocs(q);
                const ordersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setOrders(ordersData);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'order received':
                return { bg: 'rgba(255, 152, 0, 0.1)', color: '#e65100' };
            case 'order packed':
                return { bg: 'rgba(33, 150, 243, 0.1)', color: '#1565c0' };
            case 'order shipped':
                return { bg: 'rgba(156, 39, 176, 0.1)', color: '#7b1fa2' };
            case 'order delivered':
                return { bg: 'rgba(76, 175, 80, 0.1)', color: '#2e7d32' };
            default:
                return { bg: 'var(--color-gray-100)', color: 'var(--color-text-light)' };
        }
    };

    const OrderDetailsModal = ({ order, onClose }) => {
        if (!order) return null;

        const trackingStages = [
            { id: 'order received', label: 'Received', icon: <ClipboardCheck size={20} /> },
            { id: 'order packed', label: 'Packed', icon: <Package size={20} /> },
            { id: 'order shipped', label: 'Shipped', icon: <Truck size={20} /> },
            { id: 'order delivered', label: 'Delivered', icon: <Truck size={20} /> }
        ];

        const getCurrentStageIndex = () => {
            return trackingStages.findIndex(stage => stage.id === order.status);
        };

        const currentStageIndex = getCurrentStageIndex();

        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: 'var(--space-4)',
                animation: 'fadeIn 0.3s ease-out'
            }} onClick={onClose}>
                <div
                    style={{
                        backgroundColor: 'var(--color-surface)',
                        width: '100%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        borderRadius: '24px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        position: 'relative'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div style={{
                        padding: 'var(--space-6)',
                        borderBottom: '1px solid var(--color-border-light)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'linear-gradient(to right, #fdfbfb 0%, #ebedee 100%)'
                    }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-text)' }}>
                                Order Details
                            </h3>
                            <p style={{ margin: '4px 0 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                                #{order.id.toUpperCase()}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'white',
                                border: '1px solid var(--color-border-light)',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyCenter: 'center',
                                cursor: 'pointer',
                                color: 'var(--color-text-light)',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                            onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-light)'}
                        >
                            <X size={20} style={{ margin: '0 auto' }} />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div style={{ padding: 'var(--space-6)', overflowY: 'auto', flex: 1 }}>
                        {/* Tracking Stepper */}
                        <div style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-4) 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: 'var(--space-2)' }}>
                                {/* Background line */}
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    left: '0',
                                    right: '0',
                                    height: '2px',
                                    backgroundColor: '#e2e8f0',
                                    zIndex: 0
                                }}></div>
                                {/* Progress line */}
                                {currentStageIndex !== -1 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '20px',
                                        left: '0',
                                        width: `${(currentStageIndex / (trackingStages.length - 1)) * 100}%`,
                                        height: '2px',
                                        backgroundColor: '#5d4037',
                                        zIndex: 0,
                                        transition: 'width 0.5s ease-in-out'
                                    }}></div>
                                )}

                                {trackingStages.map((stage, idx) => {
                                    const isCompleted = idx <= currentStageIndex;
                                    const isActive = idx === currentStageIndex;

                                    return (
                                        <div key={stage.id} style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            zIndex: 1,
                                            width: '25%',
                                            position: 'relative'
                                        }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                backgroundColor: isCompleted ? '#5d4037' : 'white',
                                                color: isCompleted ? 'white' : '#94a3b8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: `2px solid ${isCompleted ? '#5d4037' : '#e2e8f0'}`,
                                                boxShadow: isActive ? '0 0 0 4px rgba(93, 64, 55, 0.2)' : 'none',
                                                transition: 'all 0.3s ease'
                                            }}>
                                                {stage.icon}
                                            </div>
                                            <span style={{
                                                marginTop: '12px',
                                                fontSize: '12px',
                                                fontWeight: isCompleted ? '700' : '500',
                                                color: isCompleted ? '#5d4037' : '#94a3b8',
                                                textAlign: 'center'
                                            }}>
                                                {stage.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
                            {/* Shipping Info */}
                            <div style={{ backgroundColor: '#f8fafc', padding: 'var(--space-5)', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)', fontSize: '15px', color: 'var(--color-primary)' }}>
                                    <Truck size={18} /> Shipping Information
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <p style={{ display: 'flex', gap: '10px', margin: 0, fontSize: '14px', color: 'var(--color-text)' }}>
                                        <MapPin size={16} color="#64748b" style={{ flexShrink: 0, marginTop: '3px' }} />
                                        <span>{order.shippingAddress}</span>
                                    </p>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0, fontSize: '14px', color: 'var(--color-text)' }}>
                                        <Phone size={16} color="#64748b" />
                                        <span>{order.customerPhone}</span>
                                    </p>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0, fontSize: '14px', color: 'var(--color-text)' }}>
                                        <Mail size={16} color="#64748b" />
                                        <span>{order.customerEmail}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div style={{ backgroundColor: '#f8fafc', padding: 'var(--space-5)', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)', fontSize: '15px', color: 'var(--color-primary)' }}>
                                    <ReceiptText size={18} /> Price Breakdown
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b' }}>
                                        <span>Subtotal</span>
                                        <span>₹{order.subtotal?.toLocaleString() || order.total?.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b' }}>
                                        <span>Shipping</span>
                                        <span>₹{order.shipping?.toLocaleString() || '0'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b' }}>
                                        <span>Taxes (Included)</span>
                                        <span>₹0</span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '18px',
                                        fontWeight: 'var(--font-bold)',
                                        color: '#5d4037',
                                        marginTop: '10px',
                                        paddingTop: '10px',
                                        borderTop: '1px dashed #cbd5e1'
                                    }}>
                                        <span>Total Paid</span>
                                        <span>₹{order.total?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div style={{ marginBottom: 'var(--space-4)' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)', fontSize: '15px', fontWeight: 'var(--font-bold)' }}>
                                <Package size={18} /> Order Items ({order.items.length})
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-4)',
                                        padding: 'var(--space-3)',
                                        borderRadius: '12px',
                                        border: '1px solid var(--color-border-light)',
                                        backgroundColor: 'white'
                                    }}>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #f1f5f9', flexShrink: 0 }}>
                                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 'var(--font-semibold)' }}>{item.name}</h5>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--color-text-muted)' }}>Qty: {item.quantity || 1}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '15px', fontWeight: 'var(--font-bold)', color: 'var(--color-primary)' }}>₹{item.price.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div style={{
                        padding: 'var(--space-5) var(--space-6)',
                        borderTop: '1px solid var(--color-border-light)',
                        backgroundColor: '#f8fafc',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 'var(--space-3)'
                    }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '10px 24px',
                                borderRadius: '12px',
                                background: '#5d4037',
                                color: 'white',
                                border: 'none',
                                fontWeight: '600',
                                fontSize: '14px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px rgba(93, 64, 55, 0.2)',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            Close Details
                        </button>
                    </div>
                </div>

                <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes scaleUp {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                `}</style>
            </div>
        );
    };

    if (loading) {
        return (
            <ProfileLayout>
                <div style={{
                    padding: 'var(--space-16)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-4)'
                }}>
                    <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%' }}></div>
                    <span style={{ color: 'var(--color-text-light)' }}>Loading your orders...</span>
                </div>
            </ProfileLayout>
        );
    }

    if (orders.length === 0) {
        return (
            <ProfileLayout>
                <div style={{
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-md)',
                    padding: 'var(--space-16)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: 'var(--color-accent-light)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--space-6)'
                    }}>
                        <History size={36} color="var(--color-primary-light)" />
                    </div>
                    <h3 style={{
                        color: 'var(--color-text)',
                        marginBottom: 'var(--space-3)',
                        fontSize: 'var(--text-xl)',
                        fontWeight: 'var(--font-semibold)'
                    }}>
                        No Order History
                    </h3>
                    <p style={{
                        color: 'var(--color-text-light)',
                        fontSize: 'var(--text-base)'
                    }}>
                        You haven't placed any orders yet.
                    </p>
                </div>
            </ProfileLayout>
        );
    }

    return (
        <ProfileLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                <h2 style={{
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-2)',
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 'var(--font-bold)'
                }}>
                    Order History
                </h2>

                {orders.map((order, index) => {
                    const statusStyle = getStatusStyles(order.status);

                    return (
                        <div
                            key={order.id}
                            className="animate-fade-in-up"
                            style={{
                                backgroundColor: 'var(--color-surface)',
                                padding: 'var(--space-6)',
                                borderRadius: 'var(--radius-xl)',
                                boxShadow: 'var(--shadow-sm)',
                                border: '1px solid var(--color-border-light)',
                                transition: 'var(--transition)',
                                animationDelay: `${index * 0.05}s`
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                e.currentTarget.style.borderColor = 'var(--color-accent)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                e.currentTarget.style.borderColor = 'var(--color-border-light)';
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: 'var(--space-4)'
                            }}>
                                <div>
                                    <div style={{
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--color-text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: 'var(--tracking-wider)',
                                        marginBottom: '4px'
                                    }}>
                                        Order ID
                                    </div>
                                    <div style={{
                                        fontWeight: 'var(--font-semibold)',
                                        fontSize: 'var(--text-base)',
                                        fontFamily: 'monospace'
                                    }}>
                                        #{order.id.slice(0, 8).toUpperCase()}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        padding: '6px 14px',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 'var(--font-semibold)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        backgroundColor: statusStyle.bg,
                                        color: statusStyle.color,
                                        textTransform: 'uppercase',
                                        letterSpacing: 'var(--tracking-wide)'
                                    }}>
                                        <Clock size={12} /> {order.status}
                                    </div>
                                    <div style={{
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--color-text-muted)',
                                        marginTop: '6px'
                                    }}>
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Product Images */}
                            <div style={{
                                display: 'flex',
                                gap: 'var(--space-3)',
                                overflowX: 'auto',
                                paddingBottom: 'var(--space-3)',
                                marginBottom: 'var(--space-4)'
                            }}>
                                {order.items.map((item, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: 'var(--radius-md)',
                                            overflow: 'hidden',
                                            border: '2px solid var(--color-border-light)',
                                            flexShrink: 0
                                        }}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            title={item.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: 'var(--space-4)',
                                borderTop: '1px solid var(--color-border-light)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
                                    <div>
                                        <span style={{
                                            color: 'var(--color-text-light)',
                                            fontSize: 'var(--text-sm)'
                                        }}>
                                            Items:{' '}
                                        </span>
                                        <span style={{ fontWeight: 'var(--font-semibold)' }}>
                                            {order.items.length}
                                        </span>
                                    </div>
                                    <div>
                                        <span style={{
                                            color: 'var(--color-text-light)',
                                            fontSize: 'var(--text-sm)'
                                        }}>
                                            Total:{' '}
                                        </span>
                                        <span style={{
                                            fontWeight: 'var(--font-bold)',
                                            fontSize: 'var(--text-lg)',
                                            color: 'var(--color-primary)'
                                        }}>
                                            ₹{order.total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    style={{
                                        background: 'var(--color-gray-100)',
                                        border: 'none',
                                        color: 'var(--color-text)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 'var(--font-medium)',
                                        padding: '8px 14px',
                                        borderRadius: 'var(--radius-md)',
                                        transition: 'var(--transition)'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = 'var(--color-primary)';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'var(--color-gray-100)';
                                        e.currentTarget.style.color = 'var(--color-text)';
                                    }}
                                >
                                    Details <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Render Details Modal */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </ProfileLayout>
    );
};

export default Orders;
