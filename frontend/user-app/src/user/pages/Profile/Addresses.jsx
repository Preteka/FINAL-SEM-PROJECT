import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { MapPin, Plus, Edit2, Trash2, Loader2, Home, Phone, User, Building, Map as MapIcon, Navigation } from 'lucide-react';
import ProfileLayout from '../../components/Profile/ProfileLayout';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../shared/services/firebase';

const Addresses = () => {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const initialFormState = {
        name: '',
        phone: '',
        houseStreet: '',
        areaLandmark: '',
        city: '',
        state: '',
        pincode: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const addrRef = collection(db, "users", user.uid, "addresses");
            const q = query(addrRef, orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const addrList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAddresses(addrList);
        } catch (error) {
            console.error("Error fetching addresses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (address) => {
        setFormData({
            name: address.name,
            phone: address.phone,
            houseStreet: address.houseStreet,
            areaLandmark: address.areaLandmark,
            city: address.city,
            state: address.state,
            pincode: address.pincode
        });
        setEditingId(address.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this address?")) return;
        try {
            await deleteDoc(doc(db, "users", user.uid, "addresses", id));
            setAddresses(prev => prev.filter(addr => addr.id !== id));
        } catch (error) {
            console.error("Error deleting address:", error);
            alert("Failed to delete address.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const addrData = {
                ...formData,
                updatedAt: new Date().toISOString()
            };

            if (editingId) {
                await updateDoc(doc(db, "users", user.uid, "addresses", editingId), addrData);
                setAddresses(prev => prev.map(addr => addr.id === editingId ? { ...addr, ...addrData } : addr));
                alert("Address updated successfully!");
            } else {
                const newAddr = {
                    ...addrData,
                    createdAt: new Date().toISOString()
                };
                const docRef = await addDoc(collection(db, "users", user.uid, "addresses"), newAddr);
                setAddresses(prev => [{ id: docRef.id, ...newAddr }, ...prev]);
                alert("Address added successfully!");
            }
            setShowForm(false);
            setEditingId(null);
            setFormData(initialFormState);
        } catch (error) {
            console.error("Error saving address:", error);
            alert("Failed to save address.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <ProfileLayout>
            <div className="profile-card-simple">
                <div className="section-header" style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1C1917', margin: 0 }}>My Addresses</h2>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '5px' }}>Manage your delivery addresses for faster checkout</p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="btn btn-primary"
                            style={{ padding: '10px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Plus size={20} /> Add New Address
                        </button>
                    )}
                </div>

                {showForm ? (
                    <div className="address-form-container" style={{ backgroundColor: '#fdf8f6', padding: '30px', borderRadius: '15px', border: '1px solid #f2e7e3' }}>
                        <h3 style={{ marginBottom: '25px', color: '#5D4037' }}>{editingId ? 'Edit Address' : 'Add New Address'}</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Full Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} placeholder="e.g. John Doe" />
                                </div>
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} placeholder="10-digit mobile number" />
                                </div>
                            </div>

                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>House No. / Building Name / Street</label>
                                <input type="text" name="houseStreet" value={formData.houseStreet} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} placeholder="Flat no, House no, Street address" />
                            </div>

                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Area / Colony / Landmark</label>
                                <input type="text" name="areaLandmark" value={formData.areaLandmark} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} placeholder="Area name or famous landmark" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>City</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} />
                                </div>
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>State</label>
                                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} />
                                </div>
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Pincode</label>
                                    <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} placeholder="6-digit pincode" />
                                </div>
                            </div>

                            <div style={{ marginTop: '10px', display: 'flex', gap: '15px' }}>
                                <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '12px 30px', borderRadius: '10px' }}>
                                    {saving ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Update Address' : 'Save Address')}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData(initialFormState); }} className="btn btn-outline" style={{ padding: '12px 30px', borderRadius: '10px' }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                        {loading ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px' }}>
                                <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
                                <p style={{ marginTop: '10px', color: '#666' }}>Loading your addresses...</p>
                            </div>
                        ) : addresses.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', backgroundColor: '#f9f9f9', borderRadius: '15px', border: '1px dashed #ccc' }}>
                                <MapPin size={50} color="#ccc" style={{ marginBottom: '15px' }} />
                                <h3 style={{ color: '#888' }}>No Addresses Saved</h3>
                                <p style={{ color: '#999' }}>Add a delivery address to get started with your orders.</p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="btn btn-primary"
                                    style={{ marginTop: '20px', padding: '10px 25px', borderRadius: '10px' }}
                                >
                                    Add Your First Address
                                </button>
                            </div>
                        ) : (
                            addresses.map((addr) => (
                                <div key={addr.id} className="address-card" style={{
                                    padding: '25px',
                                    borderRadius: '15px',
                                    border: '1px solid #eee',
                                    backgroundColor: 'white',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '15px',
                                    transition: 'all 0.3s ease',
                                    position: 'relative'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#fdf8f6', padding: '6px 12px', borderRadius: '20px', border: '1px solid #f2e7e3' }}>
                                            <Home size={16} color="var(--color-primary)" />
                                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase' }}>Delivery Address</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => handleEdit(addr)} title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(addr.id)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                            <User size={18} color="#5D4037" />
                                            <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1C1917' }}>{addr.name}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                            <Phone size={16} color="#666" />
                                            <span style={{ color: '#666', fontSize: '0.95rem' }}>{addr.phone}</span>
                                        </div>

                                        <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '10px 0' }}></div>

                                        <div style={{ display: 'flex', gap: '10px', color: '#444' }}>
                                            <Building size={18} style={{ marginTop: '3px', flexShrink: 0 }} />
                                            <p style={{ margin: 0, lineHeight: '1.6', fontSize: '0.95rem' }}>
                                                {addr.houseStreet}, {addr.areaLandmark}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', color: '#444', marginTop: '8px' }}>
                                            <Navigation size={18} style={{ marginTop: '3px', flexShrink: 0 }} />
                                            <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem' }}>
                                                {addr.city}, {addr.state} - {addr.pincode}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </ProfileLayout>
    );
};

export default Addresses;
