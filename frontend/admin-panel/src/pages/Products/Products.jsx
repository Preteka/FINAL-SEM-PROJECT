import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/Header/Header';
import { useProducts } from '../../hooks/useProducts';
import { db } from '../../services/firebase';
import { collection, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "tvu6unvq";
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dytty2qzo";

const AdminProducts = () => {
    const { products, loading, fetchProducts } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imageFile, setImageFile] = useState(null);
    const [imageFile2, setImageFile2] = useState(null);

    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'plywood',
        brand: '',
        price: '',
        thickness: '',
        description: '',
        features: [],
        stockCount: '',
        grade: '',
        size: '',
        usage: '',
        image: '',
        images: []
    });

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleAddProduct = async (e) => {
        e.preventDefault();

        setUploading(true);
        setUploadProgress(0);

        try {
            let images = isEditing ? (newProduct.images || [newProduct.image]) : [];

            const uploadToCloudinary = async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

                const uploadURL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

                return new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', uploadURL, true);

                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const progress = (event.loaded / event.total) * 100;
                            setUploadProgress(Math.round(progress));
                        }
                    };

                    xhr.onload = () => {
                        if (xhr.status === 200) {
                            const response = JSON.parse(xhr.responseText);
                            resolve(response.secure_url);
                        } else {
                            const errorResponse = JSON.parse(xhr.responseText);
                            reject(new Error(errorResponse?.error?.message || 'Cloudinary upload failed'));
                        }
                    };

                    xhr.onerror = () => reject(new Error('Network error during upload'));
                    xhr.send(formData);
                });
            };

            // 1. Upload Images to Cloudinary
            if (imageFile) {
                const url1 = await uploadToCloudinary(imageFile);
                if (isEditing) {
                    images[0] = url1;
                } else {
                    images.push(url1);
                }
            }

            if (imageFile2) {
                const url2 = await uploadToCloudinary(imageFile2);
                if (isEditing) {
                    images[1] = url2;
                } else {
                    images.push(url2);
                }
            }

            if (!isEditing && images.length === 0) {
                alert("Please select at least one image file");
                setUploading(false);
                return;
            }

            // 2. Save or Update Product Data to Firestore
            const productToSave = {
                ...newProduct,
                image: images[0] || '', // Keep for backward compatibility
                images: images,
                updatedAt: new Date().toISOString()
            };

            if (isEditing) {
                await updateDoc(doc(db, "products", editId), productToSave);
                alert('Product updated successfully!');
            } else {
                productToSave.createdAt = new Date().toISOString();
                await addDoc(collection(db, "products"), productToSave);
                alert('Product added successfully!');
            }

            // Reset and close
            setShowAddModal(false);
            setIsEditing(false);
            setEditId(null);
            setNewProduct({
                name: '',
                category: 'plywood',
                brand: '',
                price: '',
                thickness: '',
                description: '',
                features: [],
                stockCount: '',
                grade: '',
                size: '',
                usage: ''
            });
            setImageFile(null);
            setImageFile2(null);
            setUploadProgress(0);
            fetchProducts();

        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteDoc(doc(db, "products", id));
                alert("Product deleted successfully");
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Failed to delete product");
            }
        }
    };

    const handleEditClick = (product) => {
        setNewProduct({
            name: product.name || '',
            category: product.category || 'plywood',
            brand: product.brand || '',
            price: product.price || '',
            thickness: product.thickness || '',
            description: product.description || '',
            features: product.features || [],
            stockCount: product.stockCount || '',
            grade: product.grade || '',
            size: product.size || '',
            usage: product.usage || '',
            image: product.image || '',
            images: product.images || [product.image].filter(Boolean)
        });
        setEditId(product.id);
        setIsEditing(true);
        setShowAddModal(true);
    };

    const openAddModal = () => {
        setIsEditing(false);
        setEditId(null);
        setNewProduct({
            name: '',
            category: 'plywood',
            brand: '',
            price: '',
            thickness: '',
            description: '',
            features: [],
            stockCount: '',
            grade: '',
            size: '',
            usage: ''
        });
        setImageFile(null);
        setImageFile2(null);
        setShowAddModal(true);
    };

    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setShowViewModal(true);
    };

    const filteredProducts = products.filter(p =>
        (p.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (p.brand?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (p.category?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="admin-content">Loading products from Firebase...</div>;
    }

    return (
        <>
            <AdminHeader title="Product Management" />
            <div className="admin-content">
                <div className="admin-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
                    <div>
                        <h2>Catalog</h2>
                        <p>Showing {filteredProducts.length} items</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                            <input
                                type="text"
                                placeholder="Search products..."
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
                        <button className="admin-btn-primary" onClick={openAddModal}>
                            <i className="fas fa-plus"></i> Add Product
                        </button>
                    </div>
                </div>

                <div className="admin-table-container">
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Brand</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #f1f5f9' }}
                                            />
                                        </td>
                                        <td style={{ fontWeight: '600', color: '#1e293b' }}>{product.name}</td>
                                        <td><span className="category-badge">{product.category}</span></td>
                                        <td>{product.brand}</td>
                                        <td style={{ fontWeight: '500' }}>{product.price}</td>
                                        <td>
                                            <span className={`status-badge ${Number(product.stockCount) > 0 ? 'status-delivered' : 'status-cancelled'}`}>
                                                {Number(product.stockCount) > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.6rem' }}>
                                                <button className="action-btn" title="View" onClick={() => handleViewProduct(product)}><i className="fas fa-eye"></i></button>
                                                <button className="action-btn" title="Edit" onClick={() => handleEditClick(product)}><i className="fas fa-edit"></i></button>
                                                <button className="action-btn delete" title="Delete" onClick={() => handleDeleteProduct(product.id)}><i className="fas fa-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                            No products found in Firestore. Add your first product!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <div className="admin-modal-header">
                            <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)} disabled={uploading}><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={handleAddProduct} className="admin-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input type="text" required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} disabled={uploading} />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} disabled={uploading}>
                                        <option value="plywood">Plywood</option>
                                        <option value="mdf">MDF</option>
                                        <option value="particle-board">Particle Board</option>
                                        <option value="mica-&-lamination-sheets">Mica & Lamination</option>
                                        <option value="pvc-&-upvc">PVC & UPVC</option>
                                        <option value="doors">Doors</option>
                                        <option value="veneers">Veneers</option>
                                        <option value="glass">Glass</option>
                                        <option value="handles-&-locks">Handles & Locks</option>
                                        <option value="glue-&-nuts">Glue & Nuts</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Brand</label>
                                    <input type="text" required value={newProduct.brand} onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} disabled={uploading} />
                                </div>
                                <div className="form-group">
                                    <label>Price (e.g. ₹90/sq.ft)</label>
                                    <input type="text" required value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} disabled={uploading} />
                                </div>
                                <div className="form-group">
                                    <label>Main Product Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                        disabled={uploading}
                                        style={{ border: 'none', padding: '0.5rem 0', background: 'transparent' }}
                                    />
                                    {imageFile && <p style={{ fontSize: '0.8rem', color: '#10b981' }}>Selected: {imageFile.name}</p>}
                                    {!imageFile && isEditing && <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Leave empty to keep current image 1</p>}
                                </div>
                                <div className="form-group">
                                    <label>Additional Image (Optional)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImageFile2(e.target.files[0])}
                                        disabled={uploading}
                                        style={{ border: 'none', padding: '0.5rem 0', background: 'transparent' }}
                                    />
                                    {imageFile2 && <p style={{ fontSize: '0.8rem', color: '#10b981' }}>Selected: {imageFile2.name}</p>}
                                    {!imageFile2 && isEditing && <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Leave empty to keep current image 2</p>}
                                </div>
                                <div className="form-group">
                                    <label>Thickness</label>
                                    <input type="text" value={newProduct.thickness} onChange={(e) => setNewProduct({ ...newProduct, thickness: e.target.value })} disabled={uploading} />
                                </div>
                                <div className="form-group">
                                    <label>Stock Count</label>
                                    <input type="number" required value={newProduct.stockCount} onChange={(e) => setNewProduct({ ...newProduct, stockCount: e.target.value })} disabled={uploading} />
                                </div>
                                <div className="form-group">
                                    <label>Grade (e.g. MR / BWR)</label>
                                    <input type="text" value={newProduct.grade} onChange={(e) => setNewProduct({ ...newProduct, grade: e.target.value })} disabled={uploading} />
                                </div>
                                <div className="form-group">
                                    <label>Size (e.g. 8x4 ft)</label>
                                    <input type="text" value={newProduct.size} onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })} disabled={uploading} />
                                </div>
                                <div className="form-group">
                                    <label>Usage (e.g. Interior / Furniture)</label>
                                    <input type="text" value={newProduct.usage} onChange={(e) => setNewProduct({ ...newProduct, usage: e.target.value })} disabled={uploading} />
                                </div>
                            </div>
                            <div className="form-group full-width">
                                <label>Specifications (One per line)</label>
                                <textarea
                                    rows="3"
                                    placeholder="Enter specifications..."
                                    value={newProduct.features.join('\n')}
                                    onChange={(e) => setNewProduct({ ...newProduct, features: e.target.value.split('\n').filter(line => line.trim() !== '') })}
                                    disabled={uploading}
                                ></textarea>
                            </div>
                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea rows="3" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} disabled={uploading}></textarea>
                            </div>
                            <div className="admin-modal-footer">
                                <button type="button" className="admin-btn-secondary" onClick={() => setShowAddModal(false)} disabled={uploading}>Cancel</button>
                                <button type="submit" className="admin-btn-primary" disabled={uploading}>
                                    {uploading ? (
                                        <><i className="fas fa-spinner fa-spin"></i> {isEditing ? 'Updating' : 'Uploading'} {uploadProgress}%...</>
                                    ) : (
                                        isEditing ? "Update Product" : "Save Product"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Product Modal */}
            {showViewModal && selectedProduct && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal detail-modal">
                        <div className="admin-modal-header">
                            <h3>Product Details</h3>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="product-detail-view">
                            <div className="detail-image" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', borderRadius: '8px' }} />
                                {selectedProduct.images && selectedProduct.images.length > 1 && (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                        {selectedProduct.images.map((img, i) => (
                                            <img key={i} src={img} alt={`${selectedProduct.name} ${i + 1}`} style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }} />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="detail-info">
                                <h2>{selectedProduct.name}</h2>
                                <div className="detail-tag">{selectedProduct.category}</div>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="label">Brand</span>
                                        <span className="value">{selectedProduct.brand}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Price</span>
                                        <span className="value">{selectedProduct.price}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Thickness</span>
                                        <span className="value">{selectedProduct.thickness || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Grade</span>
                                        <span className="value">{selectedProduct.grade || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Size</span>
                                        <span className="value">{selectedProduct.size || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Usage</span>
                                        <span className="value">{selectedProduct.usage || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Stock</span>
                                        <span className="value">{selectedProduct.stockCount || '0'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Product ID (Firestore)</span>
                                        <span className="value">{selectedProduct.id}</span>
                                    </div>
                                </div>
                                <div className="detail-desc" style={{ marginBottom: '1rem' }}>
                                    <span className="label">Specifications</span>
                                    <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                                        {selectedProduct.features && selectedProduct.features.length > 0 ? (
                                            selectedProduct.features.map((f, i) => <li key={i}>{f}</li>)
                                        ) : (
                                            <li>No specifications added.</li>
                                        )}
                                    </ul>
                                </div>
                                <div className="detail-desc">
                                    <span className="label">Description</span>
                                    <p>{selectedProduct.description || 'No description available.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminProducts;
