// HMR Force Update - Context paths fixed
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileLayout from '../../components/Profile/ProfileLayout';
import { useCart } from '../../../shared/context/CartContext';
import { useAuth } from '../../../shared/context/AuthContext';
import { db } from '../../../shared/services/firebase';
import { collection, addDoc } from 'firebase/firestore';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.displayName || user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        paymentMethod: 'cod'
    });

    const subtotal = getCartTotal();
    const shipping = subtotal > 0 ? 500 : 0;
    const total = subtotal + shipping;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        setLoading(true);
        try {
            const orderData = {
                userId: user?.uid || 'guest',
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                shippingAddress: `${formData.address}, ${formData.city}`,
                items: cart,
                subtotal: subtotal,
                shipping: shipping,
                total: total,
                status: 'pending',
                paymentMethod: formData.paymentMethod,
                createdAt: new Date().toISOString()
            };

            await addDoc(collection(db, 'orders'), orderData);

            clearCart();
            alert('Order placed successfully!');
            navigate('/orders');
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <ProfileLayout>
                <div style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <h2>Your cart is empty</h2>
                    <button className="btn btn-primary" onClick={() => navigate('/products')} style={{ marginTop: '20px' }}>
                        Go to Products
                    </button>
                </div>
            </ProfileLayout>
        );
    }

    return (
        <ProfileLayout>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>

                {/* Checkout Form */}
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ marginBottom: '25px', color: 'var(--color-primary)' }}>Shipping Information</h3>
                    <form onSubmit={handlePlaceOrder}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Full Name</label>
                            <input
                                type="text" name="name" required
                                value={formData.name} onChange={handleInputChange}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Email</label>
                                <input
                                    type="email" name="email" required
                                    value={formData.email} onChange={handleInputChange}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Phone</label>
                                <input
                                    type="text" name="phone" required
                                    value={formData.phone} onChange={handleInputChange}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Address</label>
                            <textarea
                                name="address" required rows="3"
                                value={formData.address} onChange={handleInputChange}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', resize: 'none' }}
                            />
                        </div>
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>City</label>
                            <input
                                type="text" name="city" required
                                value={formData.city} onChange={handleInputChange}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                            />
                        </div>

                        <h3 style={{ marginBottom: '20px', marginTop: '40px', color: 'var(--color-primary)' }}>Payment Method</h3>
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="radio" name="paymentMethod" value="cod"
                                    checked={formData.paymentMethod === 'cod'} onChange={handleInputChange}
                                />
                                Cash on Delivery
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '15px' }}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : `Place Order - ₹${total.toLocaleString()}`}
                        </button>
                    </form>
                </div>

                {/* Summary Sidebar */}
                <div style={{ height: 'fit-content', position: 'sticky', top: '120px' }}>
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                        <h4 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Your Order</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '300px', overflowY: 'auto' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: '5px', objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-text)' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>qty: {item.quantity}</div>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{item.price}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '25px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.9rem', color: '#666' }}>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.9rem', color: '#666' }}>Shipping</span>
                                <span>₹{shipping.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                <span style={{ color: 'var(--color-primary)' }}>Total</span>
                                <span>₹{total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </ProfileLayout>
    );
};

export default Checkout;
