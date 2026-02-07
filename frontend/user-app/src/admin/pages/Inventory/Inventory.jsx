import React, { useState, useMemo, useEffect } from 'react';
import AdminHeader from '../../components/Header/Header';
import { useProducts } from '../../hooks/useProducts';
import { db } from '../../../shared/services/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const AdminInventory = () => {
    const { products, loading, fetchProducts } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, low, out

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Quick Edit State
    const [editingId, setEditingId] = useState(null);
    const [editStockValue, setEditStockValue] = useState('');
    const [updating, setUpdating] = useState(false);

    // Derived Stats
    const stats = useMemo(() => {
        const totalProducts = products.length;
        const lowStock = products.filter(p => Number(p.stockCount) > 0 && Number(p.stockCount) < 10).length;
        const outOfStock = products.filter(p => Number(p.stockCount) === 0).length;
        const totalStock = products.reduce((acc, curr) => acc + Number(curr.stockCount || 0), 0);
        return { totalProducts, lowStock, outOfStock, totalStock };
    }, [products]);

    // Filtering
    const filteredProducts = products.filter(p => {
        const matchesSearch = (p.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (p.category?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        let matchesFilter = true;
        const stock = Number(p.stockCount);
        if (filterStatus === 'low') matchesFilter = stock > 0 && stock < 10;
        if (filterStatus === 'out') matchesFilter = stock === 0;

        return matchesSearch && matchesFilter;
    });

    // Handlers
    const startEdit = (product) => {
        setEditingId(product.id);
        setEditStockValue(product.stockCount);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditStockValue('');
    };

    const saveStock = async (id) => {
        if (editStockValue === '' || isNaN(editStockValue)) {
            alert("Please enter a valid number");
            return;
        }

        setUpdating(true);
        try {
            const productRef = doc(db, "products", id);
            await updateDoc(productRef, {
                stockCount: Number(editStockValue),
                updatedAt: new Date().toISOString()
            });

            // Refresh local data (or wait for hook to auto-update if real-time)
            // Ideally useProducts uses onSnapshot, but if not we call fetchProducts
            await fetchProducts();

            setEditingId(null);
            // alert("Stock updated!"); // Optional: too intrusive?
        } catch (error) {
            console.error("Error updating stock:", error);
            alert("Failed to update stock");
        } finally {
            setUpdating(false);
        }
    };

    const getStatusBadge = (stock) => {
        if (stock === 0) return <span className="status-badge status-cancelled">Out of Stock</span>;
        if (stock < 10) return <span className="status-badge status-pending">Low Stock</span>;
        return <span className="status-badge status-delivered">In Stock</span>;
    };

    if (loading) return <div className="admin-content">Loading inventory...</div>;

    return (
        <>
            <AdminHeader title="Inventory Management" />
            <div className="admin-content">
                {/* Stats Grid */}
                <div className="stats-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                            <i className="fas fa-cubes"></i>
                        </div>
                        <div className="stat-info">
                            <h3>Total Products</h3>
                            <p>{stats.totalProducts}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#fff7ed', color: '#ea580c' }}>
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <div className="stat-info">
                            <h3>Low Stock</h3>
                            <p>{stats.lowStock}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#fef2f2', color: '#dc2626' }}>
                            <i className="fas fa-times-circle"></i>
                        </div>
                        <div className="stat-info">
                            <h3>Out of Stock</h3>
                            <p>{stats.outOfStock}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                            <i className="fas fa-layer-group"></i>
                        </div>
                        <div className="stat-info">
                            <h3>Total Units</h3>
                            <p>{stats.totalStock}</p>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="admin-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2>Stock List</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                        >
                            <option value="all">All Status</option>
                            <option value="low">Low Stock</option>
                            <option value="out">Out of Stock</option>
                        </select>
                        <div style={{ position: 'relative' }}>
                            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    padding: '0.65rem 1rem 0.65rem 2.5rem',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    minWidth: '250px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="admin-table-container">
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Current Stock</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} style={{ background: Number(product.stockCount) === 0 ? '#fff1f2' : 'white' }}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #eee' }}
                                                />
                                                <span style={{ fontWeight: '600', color: '#334155' }}>{product.name}</span>
                                            </div>
                                        </td>
                                        <td><span className="category-badge">{product.category}</span></td>
                                        <td>{product.price}</td>
                                        <td>
                                            {editingId === product.id ? (
                                                <input
                                                    type="number"
                                                    value={editStockValue}
                                                    onChange={(e) => setEditStockValue(e.target.value)}
                                                    style={{ width: '80px', padding: '0.4rem', borderRadius: '4px', border: '1px solid #3b82f6' }}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span style={{ fontWeight: 'bold' }}>{product.stockCount}</span>
                                            )}
                                        </td>
                                        <td>{getStatusBadge(Number(product.stockCount))}</td>
                                        <td>
                                            {editingId === product.id ? (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        className="action-btn"
                                                        style={{ color: '#16a34a', background: '#dcfce7' }}
                                                        onClick={() => saveStock(product.id)}
                                                        disabled={updating}
                                                    >
                                                        <i className="fas fa-check"></i>
                                                    </button>
                                                    <button
                                                        className="action-btn"
                                                        style={{ color: '#dc2626', background: '#fee2e2' }}
                                                        onClick={cancelEdit}
                                                        disabled={updating}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="action-btn"
                                                    onClick={() => startEdit(product)}
                                                    title="Update Stock"
                                                >
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                            No products found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminInventory;

