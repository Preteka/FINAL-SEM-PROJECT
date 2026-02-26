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
                {/* Enhanced Page Header */}
                <div
                    className="admin-section-header"
                    style={{
                        background: 'linear-gradient(135deg, #8d6e63 0%, #5d4037 100%)',
                        padding: '2rem',
                        borderRadius: '12px',
                        color: 'white',
                        marginBottom: '2rem',
                        animation: 'slideInDown 0.6s ease-out',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}
                >
                    <div>
                        <h2 style={{ color: 'white', marginBottom: '0.4rem', fontSize: '1.75rem' }}>Inventory Tracking</h2>
                        <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                            <i className="fas fa-warehouse me-2"></i> Real-time stock management and alerts
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
                            <option value="low">Low Stock</option>
                            <option value="out">Out of Stock</option>
                        </select>
                        <div style={{ position: 'relative' }}>
                            <i className="fas fa-search" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#8d6e63' }}></i>
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    padding: '0.75rem 1rem 0.75rem 2.8rem',
                                    border: 'none',
                                    borderRadius: '10px',
                                    minWidth: '250px',
                                    outline: 'none',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {[
                        { title: 'Total Products', value: stats.totalProducts, icon: 'fa-cubes', bg: '#efebe9', color: '#8d6e63', delay: '0s' },
                        { title: 'Low Stock', value: stats.lowStock, icon: 'fa-exclamation-triangle', bg: '#fff7ed', color: '#ea580c', delay: '0.1s' },
                        { title: 'Out of Stock', value: stats.outOfStock, icon: 'fa-times-circle', bg: '#fef2f2', color: '#dc2626', delay: '0.2s' },
                        { title: 'Total Units', value: stats.totalStock, icon: 'fa-layer-group', bg: '#f0fdf4', color: '#16a34a', delay: '0.3s' }
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="stat-card"
                            style={{
                                animation: `fadeInUp 0.5s ease-out ${stat.delay} both`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.25rem',
                                padding: '1.5rem',
                                background: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div className="stat-icon" style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '10px',
                                background: stat.bg,
                                color: stat.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem'
                            }}>
                                <i className={`fas ${stat.icon}`}></i>
                            </div>
                            <div className="stat-info">
                                <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>{stat.title}</h3>
                                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>{stat.value}</p>
                            </div>
                        </div>
                    ))}
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
                                {filteredProducts.map((product, index) => (
                                    <tr
                                        key={product.id}
                                        style={{
                                            background: Number(product.stockCount) === 0 ? '#fff5f5' : 'white',
                                            animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                                        }}
                                    >
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #f1f5f9' }}
                                                />
                                                <span style={{ fontWeight: '600', color: '#5d4037' }}>{product.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className="category-badge"
                                                style={{
                                                    background: '#efebe9',
                                                    color: '#5d4037',
                                                    padding: '4px 8px',
                                                    borderRadius: '6px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {product.category}
                                            </span>
                                        </td>
                                        <td>{product.price}</td>
                                        <td>
                                            {editingId === product.id ? (
                                                <input
                                                    type="number"
                                                    value={editStockValue}
                                                    onChange={(e) => setEditStockValue(e.target.value)}
                                                    style={{
                                                        width: '80px',
                                                        padding: '0.4rem',
                                                        borderRadius: '6px',
                                                        border: '2px solid #8d6e63',
                                                        outline: 'none'
                                                    }}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: Number(product.stockCount) < 10 ? '#ea580c' : '#1e293b',
                                                        animation: Number(product.stockCount) < 5 ? 'pulse 2s infinite' : 'none',
                                                        display: 'inline-block'
                                                    }}
                                                >
                                                    {product.stockCount}
                                                </span>
                                            )}
                                        </td>
                                        <td>{getStatusBadge(Number(product.stockCount))}</td>
                                        <td>
                                            {editingId === product.id ? (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        className="action-btn"
                                                        style={{ color: '#16a34a', background: '#dcfce7', border: 'none', borderRadius: '6px', padding: '6px 10px' }}
                                                        onClick={() => saveStock(product.id)}
                                                        disabled={updating}
                                                    >
                                                        <i className="fas fa-check"></i>
                                                    </button>
                                                    <button
                                                        className="action-btn"
                                                        style={{ color: '#dc2626', background: '#fee2e2', border: 'none', borderRadius: '6px', padding: '6px 10px' }}
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
                                                    style={{ color: '#8d6e63', background: '#efebe9', border: 'none', borderRadius: '6px', padding: '6px 10px' }}
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
            <style>{`
                @keyframes slideInDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); color: #dc2626; }
                    100% { transform: scale(1); }
                }

                .admin-table tr {
                    transition: all 0.2s ease;
                }

                .admin-table tr:hover {
                    background-color: #fdfaf9 !important;
                    transform: scale(1.002);
                }

                .action-btn {
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .action-btn:hover {
                    transform: scale(1.1);
                }
            `}</style>
        </>
    );
};

export default AdminInventory;

