import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/Header/Header';
import { db } from '../../../shared/services/firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { useProducts } from '../../hooks/useProducts';

const AdminCostEstimation = () => {
    const { products, fetchProducts } = useProducts();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPackageId, setCurrentPackageId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        roomType: 'Kitchen',
        plywoodGrade: 'Standard',
        packageType: 'Standard',
        materialProductIds: [],
        hardwareProductIds: [],
        labourCost: 0,
        description: ''
    });

    const [productSearch, setProductSearch] = useState('');
    const [selectedMaterialCategory, setSelectedMaterialCategory] = useState('Plywood');
    const [selectedHardwareCategory, setSelectedHardwareCategory] = useState('Hardware');

    useEffect(() => {
        fetchPackages();
        const unsubscribe = fetchProducts();
        return () => {
            if (unsubscribe && typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, [fetchProducts]);

    const fetchPackages = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "estimation_packages"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const pkgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPackages(pkgs);
        } catch (error) {
            console.error("Error fetching packages:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateCostBreakdown = (materialIds, hardwareIds, labour) => {
        const getSum = (ids) => ids.reduce((sum, id) => {
            const product = products.find(p => p.id === id);
            if (product) {
                const price = typeof product.price === 'string' 
                    ? parseFloat(product.price.replace(/[^\d.]/g, '')) 
                    : parseFloat(product.price);
                return sum + (isNaN(price) ? 0 : price);
            }
            return sum;
        }, 0);

        const materialTotal = getSum(materialIds);
        const hardwareTotal = getSum(hardwareIds);
        const labourTotal = parseFloat(labour || 0);
        
        return {
            materialTotal,
            hardwareTotal,
            labourTotal,
            total: materialTotal + hardwareTotal + labourTotal
        };
    };

    const handleSavePackage = async (e) => {
        e.preventDefault();
        const breakdown = calculateCostBreakdown(formData.materialProductIds, formData.hardwareProductIds, formData.labourCost);
        
        const packageData = {
            ...formData,
            materialRate: breakdown.materialTotal,
            hardwareRate: breakdown.hardwareTotal,
            labourRate: breakdown.labourTotal,
            totalCost: breakdown.total,
            updatedAt: new Date().toISOString()
        };

        try {
            if (isEditing) {
                await updateDoc(doc(db, "estimation_packages", currentPackageId), packageData);
                alert("Package updated successfully!");
            } else {
                packageData.createdAt = new Date().toISOString();
                await addDoc(collection(db, "estimation_packages"), packageData);
                alert("Package added successfully!");
            }
            setShowAddModal(false);
            fetchPackages();
        } catch (error) {
            console.error("Error saving package:", error);
            alert("Error saving package");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            await deleteDoc(doc(db, "estimation_packages", id));
            fetchPackages();
        }
    };

    const openEditModal = (pkg) => {
        setFormData({
            name: pkg.name,
            roomType: pkg.roomType,
            plywoodGrade: pkg.plywoodGrade || 'Standard',
            packageType: pkg.packageType,
            materialProductIds: pkg.materialProductIds || [],
            hardwareProductIds: pkg.hardwareProductIds || [],
            labourCost: pkg.labourCost,
            description: pkg.description || ''
        });
        setCurrentPackageId(pkg.id);
        setIsEditing(true);
        setShowAddModal(true);
    };

    const toggleProduct = (productId, field) => {
        setFormData(prev => {
            const currentIds = prev[field] || [];
            const newIds = currentIds.includes(productId)
                ? currentIds.filter(id => id !== productId)
                : [...currentIds, productId];
            return { ...prev, [field]: newIds };
        });
    };

    const filteredProducts = products.filter(p => 
        (p.name?.toLowerCase() || "").includes(productSearch.toLowerCase()) || 
        (p.category?.toLowerCase() || "").includes(productSearch.toLowerCase())
    );

    return (
        <>
            <AdminHeader title="Cost Estimation Manager" />
            <div className="admin-content">
                <div className="admin-section-header" style={{ marginBottom: '20px' }}>
                    <h2>Estimation Packages</h2>
                    <button className="admin-btn-primary" onClick={() => {
                        setIsEditing(false);
                        setFormData({
                            name: '',
                            roomType: 'Kitchen',
                            plywoodGrade: 'Standard',
                            packageType: 'Standard',
                            materialProductIds: [],
                            hardwareProductIds: [],
                            labourCost: 0,
                            description: ''
                        });
                        setShowAddModal(true);
                    }}>Add New Package</button>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Room</th>
                                <th>Type</th>
                                <th>Products</th>
                                <th>Total Cost</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map(pkg => (
                                <tr key={pkg.id}>
                                    <td>{pkg.name}</td>
                                    <td>{pkg.roomType}</td>
                                    <td>{pkg.packageType}</td>
                                    <td>{(pkg.materialProductIds?.length || 0) + (pkg.hardwareProductIds?.length || 0)} items</td>
                                    <td>₹ {pkg.totalCost?.toLocaleString('en-IN')} /sq.ft</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => openEditModal(pkg)} className="action-btn"><i className="fas fa-edit"></i></button>
                                            <button onClick={() => handleDelete(pkg.id)} className="action-btn delete"><i className="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '800px' }}>
                        <div className="admin-modal-header">
                            <h3>{isEditing ? 'Edit Package' : 'Create Package'}</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleSavePackage} className="admin-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Package Name</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Premium Kitchen" />
                                </div>
                                <div className="form-group">
                                    <label>Cupboard Type</label>
                                    <select value={formData.roomType} onChange={e => setFormData({...formData, roomType: e.target.value})}>
                                        <option value="Kitchen">Kitchen</option>
                                        <option value="Bedroom">Bedroom</option>
                                        <option value="Hall">Hall</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Plywood Grade</label>
                                    <select value={formData.plywoodGrade} onChange={e => setFormData({...formData, plywoodGrade: e.target.value})}>
                                        <option value="Standard">Standard</option>
                                        <option value="Water Resistance">Water Resistance</option>
                                        <option value="Commercial">Commercial</option>
                                        <option value="Marine">Marine</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select value={formData.packageType} onChange={e => setFormData({...formData, packageType: e.target.value})}>
                                        <option value="Standard">Standard</option>
                                        <option value="Premium">Premium</option>
                                        <option value="Budget">Budget</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Labour Cost</label>
                                    <input type="number" required value={formData.labourCost} onChange={e => setFormData({...formData, labourCost: e.target.value})} placeholder="Professional labour cost..." />
                                </div>
                            </div>

                            {/* Material Selection */}
                            <div className="form-group full-width" style={{ marginTop: '20px' }}>
                                <label style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#4e342e' }}>Materials ({formData.materialProductIds.length} selected)</label>
                                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', marginTop: '10px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px', display: 'block' }}>Select Category</label>
                                        <select 
                                            value={selectedMaterialCategory} 
                                            onChange={e => setSelectedMaterialCategory(e.target.value)}
                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                        >
                                            <option value="Plywood">Plywood</option>
                                            <option value="MDF">MDF</option>
                                            <option value="Particle Board">Particle Board</option>
                                            <option value="Mica">Mica/Lamination</option>
                                            <option value="Veneer">Veneers</option>
                                        </select>
                                    </div>
                                    <div style={{ flex: 2 }}>
                                        <label style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px', display: 'block' }}>Search Product</label>
                                        <input 
                                            type="text" 
                                            placeholder="Search in category..." 
                                            value={productSearch} 
                                            onChange={e => setProductSearch(e.target.value)}
                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                </div>
                                
                                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fff' }}>
                                    {products
                                        .filter(p => (p.category || '').toLowerCase().includes(selectedMaterialCategory.toLowerCase()))
                                        .filter(p => (p.name || '').toLowerCase().includes(productSearch.toLowerCase()))
                                        .map(p => (
                                            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', alignItems: 'center', borderBottom: '1px solid #f5f5f5' }}>
                                                <span style={{ fontSize: '0.9rem' }}>{p.name} <small style={{ color: '#888' }}>({p.price})</small></span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => toggleProduct(p.id, 'materialProductIds')}
                                                    style={{ 
                                                        padding: '4px 12px', 
                                                        fontSize: '0.8rem',
                                                        background: formData.materialProductIds.includes(p.id) ? '#ef4444' : '#10b981',
                                                        color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                                                    }}
                                                >
                                                    {formData.materialProductIds.includes(p.id) ? 'Remove' : 'Add'}
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                            {/* Hardware Selection */}
                            <div className="form-group full-width" style={{ marginTop: '20px' }}>
                                <label style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#4e342e' }}>Hardware Material ({formData.hardwareProductIds.length} selected)</label>
                                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', marginTop: '10px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px', display: 'block' }}>Select Category</label>
                                        <select 
                                            value={selectedHardwareCategory} 
                                            onChange={e => setSelectedHardwareCategory(e.target.value)}
                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                        >
                                            <option value="Hardware">All Hardware</option>
                                            <option value="Glass">Glass</option>
                                            <option value="Handle">Handles & Locks</option>
                                            <option value="Glue">Glue & Nuts</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fff' }}>
                                    {products
                                        .filter(p => (p.category || '').toLowerCase().includes(selectedHardwareCategory.toLowerCase()))
                                        .map(p => (
                                            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', alignItems: 'center', borderBottom: '1px solid #f5f5f5' }}>
                                                <span style={{ fontSize: '0.9rem' }}>{p.name} <small style={{ color: '#888' }}>({p.price})</small></span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => toggleProduct(p.id, 'hardwareProductIds')}
                                                    style={{ 
                                                        padding: '4px 12px', 
                                                        fontSize: '0.8rem',
                                                        background: formData.hardwareProductIds.includes(p.id) ? '#ef4444' : '#10b981',
                                                        color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                                                    }}
                                                >
                                                    {formData.hardwareProductIds.includes(p.id) ? 'Remove' : 'Add'}
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="2" placeholder="Brief details about the package..."></textarea>
                            </div>

                            <div style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #eee' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span>Material Cost:</span>
                                    <span style={{ fontWeight: 'bold' }}>₹ {calculateCostBreakdown(formData.materialProductIds, formData.hardwareProductIds, formData.labourCost).materialTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span>Hardware Cost:</span>
                                    <span style={{ fontWeight: 'bold' }}>₹ {calculateCostBreakdown(formData.materialProductIds, formData.hardwareProductIds, formData.labourCost).hardwareTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <span>Labour Cost:</span>
                                    <span style={{ fontWeight: 'bold' }}>₹ {parseFloat(formData.labourCost || 0).toLocaleString('en-IN')}</span>
                                </div>
                                <div style={{ borderTop: '2px solid #ddd', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0, color: '#4e342e' }}>Total (per sq ft):</h4>
                                    <h3 style={{ margin: 0, color: '#4e342e', fontWeight: '900' }}>₹ {calculateCostBreakdown(formData.materialProductIds, formData.hardwareProductIds, formData.labourCost).total.toLocaleString('en-IN')}</h3>
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" className="admin-btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="admin-btn-primary">Save Package</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminCostEstimation;
