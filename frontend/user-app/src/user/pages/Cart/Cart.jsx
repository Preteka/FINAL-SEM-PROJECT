// HMR Force Update - Context paths fixed
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileLayout from '../../components/Profile/ProfileLayout';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../../shared/context/CartContext';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const navigate = useNavigate();

    const subtotal = getCartTotal();
    const shipping = subtotal > 0 ? 500 : 0;
    const total = subtotal + shipping;

    if (cart.length === 0) {
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
                        <ShoppingBag size={36} color="var(--color-primary-light)" />
                    </div>
                    <h3 style={{
                        color: 'var(--color-text)',
                        marginBottom: 'var(--space-3)',
                        fontSize: 'var(--text-xl)',
                        fontWeight: 'var(--font-semibold)'
                    }}>
                        Your Cart is Empty
                    </h3>
                    <p style={{
                        color: 'var(--color-text-light)',
                        marginBottom: 'var(--space-8)',
                        fontSize: 'var(--text-base)'
                    }}>
                        Looks like you haven't added anything to your cart yet.
                    </p>
                    <button
                        className="btn btn-primary"
                        style={{ padding: '14px 32px' }}
                        onClick={() => navigate('/products')}
                    >
                        Start Shopping <ArrowRight size={18} />
                    </button>
                </div>
            </ProfileLayout>
        );
    }

    return (
        <ProfileLayout>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 'var(--space-8)'
            }}>

                {/* Cart Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                    <h2 style={{
                        color: 'var(--color-text)',
                        marginBottom: 'var(--space-2)',
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 'var(--font-bold)'
                    }}>
                        Shopping Cart
                        <span style={{
                            color: 'var(--color-text-light)',
                            fontWeight: 'var(--font-normal)',
                            fontSize: 'var(--text-lg)'
                        }}>
                            ({cart.length})
                        </span>
                    </h2>

                    {cart.map((item, index) => (
                        <div
                            key={item.id}
                            className="animate-fade-in-up"
                            style={{
                                display: 'flex',
                                gap: 'var(--space-5)',
                                backgroundColor: 'var(--color-surface)',
                                padding: 'var(--space-5)',
                                borderRadius: 'var(--radius-xl)',
                                boxShadow: 'var(--shadow-sm)',
                                alignItems: 'center',
                                transition: 'var(--transition)',
                                border: '1px solid var(--color-border-light)',
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
                            <div style={{
                                width: '90px',
                                height: '90px',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                flexShrink: 0
                            }}>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h4 style={{
                                    margin: 0,
                                    color: 'var(--color-text)',
                                    fontWeight: 'var(--font-semibold)',
                                    fontSize: 'var(--text-base)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {item.name}
                                </h4>
                                <p style={{
                                    margin: '4px 0',
                                    color: 'var(--color-text-light)',
                                    fontSize: 'var(--text-sm)'
                                }}>
                                    {item.brand}
                                </p>
                                <div style={{
                                    fontWeight: 'var(--font-bold)',
                                    color: 'var(--color-primary)',
                                    fontSize: 'var(--text-lg)'
                                }}>
                                    {item.price}
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                gap: 'var(--space-4)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    overflow: 'hidden'
                                }}>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        style={{
                                            padding: '6px 12px',
                                            background: 'var(--color-gray-50)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span style={{
                                        padding: '0 14px',
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 'var(--font-semibold)'
                                    }}>
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        style={{
                                            padding: '6px 12px',
                                            background: 'var(--color-gray-50)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    style={{
                                        color: 'var(--color-error)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 'var(--font-medium)',
                                        transition: 'var(--transition)',
                                        opacity: 0.8
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
                                >
                                    <Trash2 size={14} /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div style={{
                    backgroundColor: 'var(--color-surface)',
                    padding: 'var(--space-8)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-md)',
                    height: 'fit-content',
                    position: 'sticky',
                    top: '120px',
                    border: '1px solid var(--color-border-light)'
                }}>
                    <h3 style={{
                        marginBottom: 'var(--space-6)',
                        color: 'var(--color-text)',
                        fontSize: 'var(--text-lg)',
                        fontWeight: 'var(--font-semibold)'
                    }}>
                        Order Summary
                    </h3>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 'var(--space-3)',
                        color: 'var(--color-text-light)',
                        fontSize: 'var(--text-sm)'
                    }}>
                        <span>Subtotal</span>
                        <span style={{ fontWeight: 'var(--font-medium)', color: 'var(--color-text)' }}>
                            ₹{subtotal.toLocaleString()}
                        </span>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 'var(--space-3)',
                        color: 'var(--color-text-light)',
                        fontSize: 'var(--text-sm)'
                    }}>
                        <span>Shipping</span>
                        <span style={{ fontWeight: 'var(--font-medium)', color: 'var(--color-text)' }}>
                            ₹{shipping.toLocaleString()}
                        </span>
                    </div>

                    <hr style={{
                        border: 'none',
                        borderTop: '1px solid var(--color-border-light)',
                        margin: 'var(--space-5) 0'
                    }} />

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 'var(--space-8)',
                        fontSize: 'var(--text-xl)'
                    }}>
                        <span style={{
                            color: 'var(--color-text)',
                            fontWeight: 'var(--font-semibold)'
                        }}>
                            Total
                        </span>
                        <span style={{
                            fontWeight: 'var(--font-bold)',
                            color: 'var(--color-primary)'
                        }}>
                            ₹{total.toLocaleString()}
                        </span>
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '16px', marginBottom: 'var(--space-3)' }}
                        onClick={() => navigate('/checkout')}
                    >
                        Proceed to Checkout
                    </button>

                    <button
                        className="btn btn-outline"
                        style={{ width: '100%', padding: '16px' }}
                        onClick={() => navigate('/products')}
                    >
                        Continue Shopping
                    </button>
                </div>

            </div>
        </ProfileLayout>
    );
};

export default Cart;
