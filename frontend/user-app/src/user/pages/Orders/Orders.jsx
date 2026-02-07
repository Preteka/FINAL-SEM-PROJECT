import React, { useEffect, useState } from 'react';
import ProfileLayout from '../../components/Profile/ProfileLayout';
import { History, Clock, ChevronRight, Package } from 'lucide-react';
import { db } from '../../../shared/services/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../../../shared/context/AuthContext';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending':
                return { bg: 'rgba(255, 152, 0, 0.1)', color: '#e65100' };
            case 'processing':
                return { bg: 'rgba(33, 150, 243, 0.1)', color: '#1565c0' };
            case 'shipped':
                return { bg: 'rgba(156, 39, 176, 0.1)', color: '#7b1fa2' };
            case 'delivered':
                return { bg: 'rgba(76, 175, 80, 0.1)', color: '#2e7d32' };
            default:
                return { bg: 'var(--color-gray-100)', color: 'var(--color-text-light)' };
        }
    };

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
        </ProfileLayout>
    );
};

export default Orders;
