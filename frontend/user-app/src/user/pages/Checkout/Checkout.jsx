import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileLayout from '../../components/Profile/ProfileLayout';
import { useCart } from '../../../shared/context/CartContext';
import { useAuth } from '../../../shared/context/AuthContext';
import { db } from '../../../shared/services/firebase';
import { collection, addDoc, doc, updateDoc, arrayUnion, getDocs, query, orderBy } from 'firebase/firestore';
import { CheckCircle, Download, ShoppingBag, Printer, FileText, MapPin, Phone, Mail, Calendar, Plus, ChevronRight, Check, AlertCircle } from 'lucide-react';

const RAZORPAY_KEY_ID = "rzp_test_SQnD6CcOY2NTOs"; 
const BACKEND_URL = "http://localhost:5000";

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [orderData, setOrderData] = useState(null);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: 'India',
        paymentMethod: 'cod',
        saveAddress: false
    });

    const [addresses, setAddresses] = useState(user?.addresses || []);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = async () => {
        try {
            const addrRef = collection(db, "users", user.uid, "addresses");
            const q = query(addrRef, orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const addrList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAddresses(addrList);
            if (addrList.length > 0) {
                setSelectedAddress(addrList[0]);
                setIsAddingNew(false);
            } else {
                setIsAddingNew(true);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    const handleAddressSelect = (addr) => {
        setSelectedAddress(addr);
        setIsAddingNew(false);
        setShowAddressModal(false);
    };

    const subtotal = getCartTotal();
    const shipping = subtotal > 0 ? 500 : 0;
    const total = subtotal + shipping;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        console.log("Place Order clicked. Payment Method:", formData.paymentMethod);
        if (cart.length === 0) return;

        setLoading(true);
        try {
            let finalAddress;
            if (isAddingNew || !selectedAddress) {
                finalAddress = {
                    name: formData.firstName + " " + formData.lastName,
                    phone: formData.phone,
                    houseStreet: formData.address,
                    areaLandmark: '',
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.zip
                };

                // If user checked "Save this address", we should add it to their profile/Firestore
                if (formData.saveAddress && user?.uid) {
                    try {
                        const newAddr = {
                            ...finalAddress,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        };
                        await addDoc(collection(db, "users", user.uid, "addresses"), newAddr);
                    } catch (addrErr) {
                        console.error("Error saving address to profile:", addrErr);
                    }
                }
            } else {
                finalAddress = {
                    name: selectedAddress.name,
                    phone: selectedAddress.phone,
                    houseStreet: selectedAddress.houseStreet,
                    areaLandmark: selectedAddress.areaLandmark,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    pincode: selectedAddress.pincode
                };
            }

            const shippingStr = `${finalAddress.houseStreet}, ${finalAddress.areaLandmark ? finalAddress.areaLandmark + ', ' : ''}${finalAddress.city}, ${finalAddress.state} - ${finalAddress.pincode}`;
            
            const baseOrder = {
                userId: user?.uid || 'guest',
                customerName: finalAddress.name,
                customerEmail: formData.email,
                customerPhone: finalAddress.phone,
                shippingAddress: shippingStr,
                addressDetails: finalAddress,
                items: [...cart],
                subtotal: subtotal,
                shipping: shipping,
                total: total,
                status: 'order received',
                paymentMethod: formData.paymentMethod,
                createdAt: new Date().toISOString(),
                orderId: `VIN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
            };

            if (formData.paymentMethod === 'online') {
                const res = await loadRazorpayScript();

                if (!res) {
                    alert("Razorpay SDK failed to load. Are you online?");
                    setLoading(false);
                    return;
                }

                // Create order in backend
                const response = await fetch(`${BACKEND_URL}/api/payment/create-order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: total,
                        currency: 'INR',
                        receipt: baseOrder.orderId
                    })
                });

                const rzpOrder = await response.json();

                const options = {
                    key: RAZORPAY_KEY_ID,
                    amount: rzpOrder.amount,
                    currency: rzpOrder.currency,
                    name: "Vinayaga Plywood Store",
                    description: `Order ${baseOrder.orderId}`,
                    order_id: rzpOrder.id,
                    handler: async function (response) {
                        try {
                            // Verify payment in backend
                            const verifyRes = await fetch(`${BACKEND_URL}/api/payment/verify-payment`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                })
                            });

                            const verifyData = await verifyRes.json();

                            if (verifyRes.ok) {
                                const finalOrder = {
                                    ...baseOrder,
                                    paymentStatus: 'paid',
                                    paymentDetails: {
                                        razorpayOrderId: response.razorpay_order_id,
                                        razorpayPaymentId: response.razorpay_payment_id,
                                        razorpaySignature: response.razorpay_signature
                                    }
                                };

                                await addDoc(collection(db, 'orders'), finalOrder);
                                setOrderData(finalOrder);
                                clearCart();
                                setLoading(false);
                                setOrderSuccess(true);
                                setTimeout(() => setShowInvoice(true), 2000);
                            } else {
                                alert("Payment verification failed: " + verifyData.message);
                                setLoading(false);
                            }
                        } catch (err) {
                            console.error("Verification error:", err);
                            alert("Something went wrong during payment verification.");
                            setLoading(false);
                        }
                    },
                    prefill: {
                        name: finalAddress.name,
                        email: formData.email,
                        contact: finalAddress.phone
                    },
                    theme: {
                        color: "#5D4037"
                    },
                    modal: {
                        ondismiss: function() {
                            setLoading(false);
                        }
                    }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();

            } else {
                // COD Flow
                const finalOrder = {
                    ...baseOrder,
                    paymentStatus: 'pending',
                    paymentMethod: 'cod'
                };

                await addDoc(collection(db, 'orders'), finalOrder);
                setOrderData(finalOrder);
                clearCart();

                setTimeout(() => {
                    setLoading(false);
                    setOrderSuccess(true);
                    setTimeout(() => setShowInvoice(true), 2000);
                }, 1500);
            }

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

                {/* Left Column: Delivery and Payment */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                    {/* Delivery Address Section (Matching Reference Image) */}
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border-light)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                            <MapPin size={24} color="#5D4037" />
                            <h3 style={{ margin: 0, color: '#1C1917', fontWeight: '800' }}>Shipping Address</h3>
                        </div>

                        {addresses.length > 0 && !isAddingNew ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {addresses.map(addr => (
                                    <div
                                        key={addr.id}
                                        onClick={() => setSelectedAddress(addr)}
                                        style={{
                                            border: selectedAddress?.id === addr.id ? '2px solid #5D4037' : '1px solid #eee',
                                            borderRadius: '15px',
                                            padding: '20px',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            backgroundColor: selectedAddress?.id === addr.id ? '#fbfbfb' : 'white',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                                            <div style={{
                                                width: '20px', height: '20px', borderRadius: '50%',
                                                border: '2px solid #5D4037', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                {selectedAddress?.id === addr.id && <div style={{ width: '10px', height: '10px', backgroundColor: '#5D4037', borderRadius: '50%' }}></div>}
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px' }}>
                                            {addr.name}
                                        </div>
                                        <div style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                            {addr.houseStreet}<br />
                                            {addr.areaLandmark && <>{addr.areaLandmark}<br /></>}
                                            {addr.city}, {addr.state} - {addr.pincode}
                                        </div>
                                        <div style={{ marginTop: '10px', fontWeight: 'bold', color: '#444' }}>
                                            Phone: {addr.phone}
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setIsAddingNew(true)}
                                    style={{
                                        marginTop: '10px',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: '1px dashed #5D4037',
                                        backgroundColor: 'white',
                                        color: '#5D4037',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    <Plus size={18} /> Add New Address
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div className="input-group">
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="Enter first name"
                                            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Enter last name"
                                            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Street address, apartment, suite, etc."
                                        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', minHeight: '80px', resize: 'vertical' }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div className="input-group">
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="Enter city"
                                            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="Enter state"
                                            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div className="input-group">
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>ZIP Code</label>
                                        <input
                                            type="text"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleInputChange}
                                            placeholder="Enter ZIP code"
                                            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            placeholder="Enter country"
                                            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter phone number"
                                        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                    <input
                                        type="checkbox"
                                        id="saveAddress"
                                        name="saveAddress"
                                        checked={formData.saveAddress}
                                        onChange={(e) => setFormData(prev => ({ ...prev, saveAddress: e.target.checked }))}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="saveAddress" style={{ fontSize: '0.9rem', color: '#666', cursor: 'pointer' }}>
                                        Save this address for next time
                                    </label>
                                </div>

                                {addresses.length > 0 && (
                                    <button
                                        onClick={() => setIsAddingNew(false)}
                                        style={{
                                            padding: '10px',
                                            backgroundColor: 'transparent',
                                            color: '#666',
                                            border: 'none',
                                            textDecoration: 'underline',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Back to saved addresses
                                    </button>
                                )}
                            </div>
                        )}
                    </div>


                    {/* Payment Method (Matching Reference Image) */}
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border-light)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                            <h3 style={{ margin: 0, color: '#1C1917', fontWeight: '800' }}>Payment Method</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div
                                onClick={() => setFormData({ ...formData, paymentMethod: 'online' })}
                                style={{
                                    border: formData.paymentMethod === 'online' ? '2px solid #10b981' : '1px solid #eee',
                                    borderRadius: '15px',
                                    padding: '25px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: formData.paymentMethod === 'online' ? '#f0fdf4' : 'white',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #10b981', margin: '0 auto 15px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {formData.paymentMethod === 'online' && <div style={{ width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>}
                                </div>
                                <FileText size={30} style={{ margin: '0 auto 10px auto', color: '#10b981', opacity: 0.8 }} />
                                <div style={{ fontWeight: '800', color: '#1C1917', marginBottom: '5px' }}>Online Payment</div>
                                <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>Pay via UPI, Cards, NetBanking</p>
                            </div>
                            <div
                                onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                                style={{
                                    border: formData.paymentMethod === 'cod' ? '2px solid #10b981' : '1px solid #eee',
                                    borderRadius: '15px',
                                    padding: '25px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: formData.paymentMethod === 'cod' ? '#f0fdf4' : 'white',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #ddd', margin: '0 auto 15px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {formData.paymentMethod === 'cod' && <div style={{ width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>}
                                </div>
                                <ShoppingBag size={30} style={{ margin: '0 auto 10px auto', color: '#666', opacity: 0.8 }} />
                                <div style={{ fontWeight: '800', color: '#1C1917', marginBottom: '5px' }}>Cash on Delivery</div>
                                <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>Pay with cash upon delivery</p>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            style={{
                                width: '100%',
                                marginTop: '30px',
                                padding: '20px',
                                backgroundColor: '#1C1917',
                                color: 'white',
                                border: 'none',
                                borderRadius: '15px',
                                fontSize: '1.1rem',
                                fontWeight: '900',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '15px',
                                transition: 'all 0.3s'
                            }}
                            disabled={loading || (!selectedAddress && !isAddingNew)}
                        >
                            {loading ? 'Processing...' : `Place Order - ₹${total.toLocaleString()}`}
                        </button>
                    </div>
                </div>

                {/* Right Column: Order Summary (Matching Reference Image) */}
                <div style={{ height: 'fit-content', position: 'sticky', top: '120px' }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border-light)' }}>
                        <div style={{ marginBottom: '25px' }}>
                            <h3 style={{ margin: 0, color: '#1C1917', fontWeight: '800' }}>Order Summary</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px', marginBottom: '25px' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <div style={{ position: 'relative' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #eee' }} />
                                        <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#5D4037', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', border: '2px solid white' }}>
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#1C1917', marginBottom: '4px' }}>{item.name}</div>
                                        <div style={{ fontSize: '1rem', fontWeight: '900', color: '#5D4037' }}>₹{item.price.toLocaleString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ color: '#666', fontWeight: '500' }}>Subtotal</span>
                                <span style={{ fontWeight: 'bold', color: '#1C1917' }}>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <span style={{ color: '#666', fontWeight: '500' }}>Shipping Cost</span>
                                <span style={{ fontWeight: 'bold', color: '#1C1917' }}>₹{shipping.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '20px', borderTop: '2px solid #eee' }}>
                                <span style={{ fontWeight: '900', color: '#1C1917', fontSize: '1.4rem' }}>Total</span>
                                <span style={{ fontWeight: '900', color: '#5D4037', fontSize: '1.4rem' }}>₹{total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Address Selection Modal */}
            {showAddressModal && (
                <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h3>Select Delivery Address</h3>
                        </div>
                        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {addresses.map(addr => (
                                <div
                                    key={addr.id}
                                    onClick={() => handleAddressSelect(addr)}
                                    style={{
                                        border: selectedAddress?.id === addr.id ? '2px solid #10b981' : '1px solid #eee',
                                        borderRadius: '12px',
                                        padding: '15px',
                                        cursor: 'pointer',
                                        backgroundColor: selectedAddress?.id === addr.id ? '#f0fdf4' : 'white',
                                        transition: 'all 0.2s',
                                        position: 'relative'
                                    }}
                                >
                                    {selectedAddress?.id === addr.id && (
                                        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                            <CheckCircle size={18} fill="#10b981" color="white" />
                                        </div>
                                    )}
                                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{addr.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.4' }}>
                                        {addr.houseStreet}, {addr.areaLandmark && <span>{addr.areaLandmark}, </span>}
                                        {addr.city}, {addr.state} - {addr.pincode}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', marginTop: '5px' }}>📱 {addr.phone}</div>
                                </div>
                            ))}
                            <button
                                onClick={() => navigate('/profile')}
                                style={{
                                    marginTop: '10px',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: '1px dashed #5D4037',
                                    backgroundColor: 'white',
                                    color: '#5D4037',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                + Manage Addresses in Profile
                            </button>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setShowAddressModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                }
                .modal-content {
                    background: white;
                    border-radius: 20px;
                    width: 90%;
                    max-height: 80vh;
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                }
                .modal-header {
                    padding: 20px 30px;
                    background: #5D4037;
                    color: white;
                }
                .modal-header h3 { margin: 0; font-size: 1.2rem; }
                .modal-body { padding: 30px; overflow-y: auto; }
                .modal-footer { padding: 15px 30px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; }
            `}</style>
        </ProfileLayout>
    );
};

export default Checkout;
