import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileLayout from '../../components/Profile/ProfileLayout';
import { useCart } from '../../../shared/context/CartContext';
import { useAuth } from '../../../shared/context/AuthContext';
import { db } from '../../../shared/services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { CheckCircle, Download, ShoppingBag, Printer, FileText, MapPin, Phone, Mail, Calendar } from 'lucide-react';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [orderData, setOrderData] = useState(null);

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
            const newOrder = {
                userId: user?.uid || 'guest',
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                shippingAddress: `${formData.address}, ${formData.city}`,
                items: [...cart],
                subtotal: subtotal,
                shipping: shipping,
                total: total,
                status: 'order received',
                paymentMethod: formData.paymentMethod,
                createdAt: new Date().toISOString(),
                orderId: `VIN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
            };

            await addDoc(collection(db, 'orders'), newOrder);
            setOrderData(newOrder);

            // Clear cart but keep the order data for the invoice
            clearCart();

            // Artificial delay for "processing" feel
            setTimeout(() => {
                setLoading(false);
                setOrderSuccess(true);

                // Show invoice after the tick animation
                setTimeout(() => {
                    setShowInvoice(true);
                }, 2000);
            }, 1500);

        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
            setLoading(false);
        }
    };

    const downloadInvoice = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 1000;

        // Background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header
        ctx.fillStyle = '#5D4037'; // var(--color-primary-dark)
        ctx.fillRect(0, 0, canvas.width, 100);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 30px Arial';
        ctx.fillText('VINAYAGA GLASS & PLYWOODS', 40, 60);
        ctx.font = '16px Arial';
        ctx.fillText('OFFICIAL INVOICE', 40, 85);

        // Order Info
        ctx.fillStyle = '#333';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(`Order ID: ${orderData.orderId}`, 40, 150);
        ctx.font = '16px Arial';
        ctx.fillText(`Date: ${new Date(orderData.createdAt).toLocaleDateString()}`, 40, 180);

        // Customer Info
        ctx.fillText('Billed To:', 40, 230);
        ctx.font = 'bold 18px Arial';
        ctx.fillText(orderData.customerName, 40, 255);
        ctx.font = '16px Arial';
        ctx.fillText(orderData.customerEmail, 40, 280);
        ctx.fillText(orderData.customerPhone, 40, 305);
        ctx.fillText(orderData.shippingAddress, 40, 330);

        // Table Header
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(40, 380, 720, 40);
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Product', 50, 405);
        ctx.fillText('Qty', 500, 405);
        ctx.fillText('Price', 600, 405);
        ctx.fillText('Total', 700, 405);

        // Items
        let y = 445;
        orderData.items.forEach(item => {
            ctx.font = '14px Arial';
            ctx.fillText(item.name.substring(0, 40), 50, y);
            ctx.fillText(item.quantity.toString(), 500, y);
            ctx.fillText(`₹${item.price.toLocaleString()}`, 600, y);
            ctx.fillText(`₹${(item.price * item.quantity).toLocaleString()}`, 700, y);
            y += 30;
        });

        // Totals
        y += 20;
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(760, y);
        ctx.stroke();

        y += 40;
        ctx.font = '16px Arial';
        ctx.fillText('Subtotal:', 550, y);
        ctx.fillText(`₹${orderData.subtotal.toLocaleString()}`, 700, y);

        y += 25;
        ctx.fillText('Shipping:', 550, y);
        ctx.fillText(`₹${orderData.shipping.toLocaleString()}`, 700, y);

        y += 35;
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#5D4037';
        ctx.fillText('Total:', 550, y);
        ctx.fillText(`₹${orderData.total.toLocaleString()}`, 700, y);

        // Footer
        ctx.fillStyle = '#888';
        ctx.font = 'italic 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Thank you for choosing Vinayaga Plywoods!', canvas.width / 2, 950);

        // Download
        const link = document.createElement('a');
        link.download = `Invoice-${orderData.orderId}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    // Success Animation View
    if (orderSuccess && !showInvoice) {
        return (
            <ProfileLayout>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '100px 20px',
                    textAlign: 'center'
                }}>
                    <div className="success-animation">
                        <CheckCircle size={120} color="#4CAF50" strokeWidth={1} style={{ animation: 'scaleUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} />
                    </div>
                    <h2 style={{ marginTop: '20px', color: '#1C1917' }}>Order Placed Successfully!</h2>
                    <p style={{ color: '#666' }}>Generating your invoice...</p>

                    <style jsx>{`
                        @keyframes scaleUp {
                            from { transform: scale(0); opacity: 0; }
                            to { transform: scale(1); opacity: 1; }
                        }
                    `}</style>
                </div>
            </ProfileLayout>
        );
    }

    // Invoice View
    if (showInvoice) {
        return (
            <ProfileLayout>
                <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
                    <div className="invoice-container" style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        animation: 'fadeInUp 0.8s ease-out'
                    }}>
                        {/* Invoice Header */}
                        <div style={{ backgroundColor: 'var(--color-primary-dark, #5D4037)', padding: '40px', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h2 style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>VINAYAGA</h2>
                                    <p style={{ margin: '5px 0 0 0', opacity: 0.8, fontSize: '12px', letterSpacing: '2px' }}>GLASS & PLYWOODS</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <h3 style={{ margin: 0, opacity: 0.9 }}>INVOICE</h3>
                                    <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>#{orderData.orderId}</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '40px' }}>
                            {/* Billing Info */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                                <div>
                                    <h4 style={{ color: '#888', textTransform: 'uppercase', fontSize: '12px', marginBottom: '15px' }}>Billed To</h4>
                                    <p style={{ fontWeight: 'bold', margin: '0 0 5px 0', fontSize: '18px' }}>{orderData.customerName}</p>
                                    <div style={{ color: '#555', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} /> {orderData.customerEmail}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} /> {orderData.customerPhone}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} /> {orderData.shippingAddress}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <h4 style={{ color: '#888', textTransform: 'uppercase', fontSize: '12px', marginBottom: '15px' }}>Order Date</h4>
                                    <p style={{ fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                        <Calendar size={18} /> {new Date(orderData.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Table */}
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                                <thead style={{ backgroundColor: '#f9f9f9' }}>
                                    <tr>
                                        <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Product</th>
                                        <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Qty</th>
                                        <th style={{ padding: '15px', textAlign: 'right', borderBottom: '2px solid #eee' }}>Price</th>
                                        <th style={{ padding: '15px', textAlign: 'right', borderBottom: '2px solid #eee' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderData.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td style={{ padding: '15px', borderBottom: '1px solid #eee' }}>{item.name}</td>
                                            <td style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #eee' }}>{item.quantity}</td>
                                            <td style={{ padding: '15px', textAlign: 'right', borderBottom: '1px solid #eee' }}>₹{item.price.toLocaleString()}</td>
                                            <td style={{ padding: '15px', textAlign: 'right', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>₹{(item.price * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Summary */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <div style={{ width: '300px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ color: '#666' }}>Subtotal</span>
                                        <span style={{ fontWeight: 'bold' }}>₹{orderData.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <span style={{ color: '#666' }}>Shipping</span>
                                        <span style={{ fontWeight: 'bold' }}>₹{orderData.shipping.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '15px', borderTop: '2px solid #333' }}>
                                        <span style={{ fontSize: '20px', fontWeight: '900' }}>TOTAL</span>
                                        <span style={{ fontSize: '20px', fontWeight: '900', color: '#5D4037' }}>₹{orderData.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Actions */}
                        <div style={{ padding: '30px 40px', backgroundColor: '#fdfdfd', borderTop: '1px solid #eee', display: 'flex', gap: '15px' }}>
                            <button
                                onClick={downloadInvoice}
                                className="btn"
                                style={{
                                    flex: 1,
                                    backgroundColor: '#1C1917',
                                    color: 'white',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    fontWeight: 'bold'
                                }}
                            >
                                <Download size={20} /> Download Invoice
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="btn"
                                style={{
                                    backgroundColor: '#eee',
                                    padding: '15px 25px',
                                    borderRadius: '12px',
                                    fontWeight: 'bold'
                                }}
                            >
                                <Printer size={20} />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/products')}
                        style={{
                            marginTop: '40px',
                            width: '100%',
                            padding: '20px',
                            backgroundColor: '#5D4037',
                            color: 'white',
                            borderRadius: '15px',
                            fontWeight: '900',
                            fontSize: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '15px',
                            boxShadow: '0 10px 20px #5D4037',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <ShoppingBag size={24} /> BACK TO SHOPPING
                    </button>
                </div>

                <style jsx>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(40px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
            </ProfileLayout>
        );
    }

    if (cart.length === 0) {
        return (
            <ProfileLayout>
                <div style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <ShoppingBag size={80} color="#ddd" style={{ marginBottom: '20px' }} />
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                        <MapPin size={24} color="#5D4037" />
                        <h3 style={{ margin: 0, color: '#5D4037' }}>Shipping Information</h3>
                    </div>
                    <form onSubmit={handlePlaceOrder}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Full Name</label>
                            <input
                                type="text" name="name" required
                                value={formData.name} onChange={handleInputChange}
                                style={{ width: '100%', padding: '12px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fcfcfc' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Email</label>
                                <input
                                    type="email" name="email" required
                                    value={formData.email} onChange={handleInputChange}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fcfcfc' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Phone</label>
                                <input
                                    type="text" name="phone" required
                                    value={formData.phone} onChange={handleInputChange}
                                    style={{ width: '100%', padding: '12px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fcfcfc' }}
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Address</label>
                            <textarea
                                name="address" required rows="3"
                                value={formData.address} onChange={handleInputChange}
                                style={{ width: '100%', padding: '12px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fcfcfc', resize: 'none' }}
                            />
                        </div>
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>City</label>
                            <input
                                type="text" name="city" required
                                value={formData.city} onChange={handleInputChange}
                                style={{ width: '100%', padding: '12px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fcfcfc' }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', marginTop: '40px' }}>
                            <FileText size={24} color="#5D4037" />
                            <h3 style={{ margin: 0, color: '#5D4037' }}>Payment Method</h3>
                        </div>
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                cursor: 'pointer',
                                padding: '15px 20px',
                                border: '1px solid #eee',
                                borderRadius: '10px',
                                backgroundColor: formData.paymentMethod === 'cod' ? '#fdf8f5' : 'white',
                                borderColor: formData.paymentMethod === 'cod' ? '#5D4037' : '#eee',
                                flex: 1
                            }}>
                                <input
                                    type="radio" name="paymentMethod" value="cod"
                                    checked={formData.paymentMethod === 'cod'} onChange={handleInputChange}
                                />
                                <span style={{ fontWeight: 'bold' }}>Cash on Delivery</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn-place-order"
                            style={{
                                width: '100%',
                                padding: '18px',
                                backgroundColor: '#5D4037',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                transition: 'all 0.3s'
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                    Processing Order...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={20} />
                                    Place Order - ₹{total.toLocaleString()}
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Summary Sidebar */}
                <div style={{ height: 'fit-content', position: 'sticky', top: '120px' }}>
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <ShoppingBag size={20} color="#5D4037" />
                            <h4 style={{ margin: 0 }}>Order Summary</h4>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '350px', overflowY: 'auto' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #eee' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>qty: {item.quantity} × ₹{item.price.toLocaleString()}</div>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '25px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontSize: '0.9rem', color: '#666' }}>Subtotal</span>
                                <span style={{ fontWeight: 'bold' }}>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontSize: '0.9rem', color: '#666' }}>Shipping</span>
                                <span style={{ fontWeight: 'bold' }}>₹{shipping.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '2px solid #5D4037' }}>
                                <span style={{ fontWeight: '900', color: '#5D4037', fontSize: '1.2rem' }}>Grand Total</span>
                                <span style={{ fontWeight: '900', color: '#5D4037', fontSize: '1.2rem' }}>₹{total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .btn-place-order:hover:not(:disabled) {
                    background-color: #3e2b25 !important;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(93, 64, 55, 0.2);
                }
                .btn-place-order:active {
                    transform: translateY(0);
                }
            `}</style>
        </ProfileLayout>
    );
};

export default Checkout;
