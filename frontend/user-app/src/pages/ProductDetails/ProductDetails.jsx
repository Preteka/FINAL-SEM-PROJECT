import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import '../../index.css';

const ProductDetails = () => {
    const { productId } = useParams();
    const { loading, fetchProductById } = useProducts();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [area, setArea] = useState('');
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const getProduct = async () => {
            const data = await fetchProductById(productId);
            if (data) {
                setProduct(data);
                setMainImage(data.image);
            }
        };

        getProduct();
    }, [productId, fetchProductById]);

    if (loading) {
        return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;
    }

    if (!product) {
        return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;
    }

    // Display multiple images if available, otherwise fallback to the single image
    const productImages = product.images && product.images.length > 0
        ? product.images
        : [product.image].filter(Boolean);

    return (
        <div style={{ paddingTop: '120px', paddingBottom: '80px', backgroundColor: 'var(--color-secondary)' }}>
            <div className="container">
                {/* Main Product Section */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '40px',
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-md)'
                }}>

                    {/* Left Side - Images */}
                    <div>
                        <div style={{
                            height: '400px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            marginBottom: '20px',
                            border: '1px solid #eee'
                        }}>
                            <img src={mainImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                            {productImages.map((img, index) => (
                                <div
                                    key={index}
                                    onClick={() => setMainImage(img)}
                                    style={{
                                        height: '80px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        border: mainImage === img ? '2px solid var(--color-primary)' : '1px solid #ddd',
                                        transition: 'all 0.3s ease'
                                    }}
                                    className="thumbnail-hover"
                                >
                                    <img src={img} alt={`View ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Details */}
                    <div>
                        <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '10px' }}>{product.name}</h1>
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', fontSize: '0.9rem', color: '#666' }}>
                            <span style={{ background: '#f0f0f0', padding: '5px 10px', borderRadius: '4px' }}>Brand: {product.brand}</span>
                            <span style={{ background: '#f0f0f0', padding: '5px 10px', borderRadius: '4px' }}>Thickness: {product.thickness}</span>
                        </div>

                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)', marginBottom: '15px' }}>
                            {product.price} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#666' }}>{product.price.includes('sq.ft') ? '' : '/ unit'}</span>
                        </div>

                        <div style={{ marginBottom: '20px', color: Number(product.stockCount) > 0 ? 'green' : 'red', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ display: 'block', width: '10px', height: '10px', background: Number(product.stockCount) > 0 ? 'green' : 'red', borderRadius: '50%' }}></span>
                            {Number(product.stockCount) > 0 ? 'In Stock' : 'Out of Stock'}
                        </div>

                        <p style={{ color: '#555', marginBottom: '25px', lineHeight: '1.6' }}>
                            {product.description || "Durable plywood suitable for furniture, cupboards, and interior applications. Moisture-resistant and long-lasting quality."}
                        </p>

                        <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
                            <button className="btn btn-primary" style={{ flex: 1, padding: '15px' }}>Add to Cart</button>
                            <button className="btn btn-outline" style={{ flex: 1, padding: '15px' }}>Buy Now</button>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', color: '#666', fontSize: '0.9rem' }}>
                            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>📋 Copy Link</span>
                            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>💬 WhatsApp</span>
                        </div>

                        <hr style={{ margin: '25px 0', border: 'none', borderTop: '1px solid #eee' }} />

                        {/* Quantity & Area */}
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'end' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Quantity</label>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '5px' }}>
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '5px 15px', background: 'none' }}>-</button>
                                    <span style={{ padding: '0 10px' }}>{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '5px 15px', background: 'none' }}>+</button>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Area (sq.ft)</label>
                                <input
                                    type="number"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    placeholder="Enter area"
                                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '5px', width: '120px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specs Section */}
                <div style={{ marginTop: '40px', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ marginBottom: '20px', color: 'var(--color-primary)' }}>Product Specifications</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div className="spec-card">
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>Thickness</span>
                            <div style={{ fontWeight: 'bold' }}>{product.thickness || 'N/A'}</div>
                        </div>
                        <div className="spec-card">
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>Brand</span>
                            <div style={{ fontWeight: 'bold' }}>{product.brand || 'N/A'}</div>
                        </div>
                        <div className="spec-card">
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>Grade</span>
                            <div style={{ fontWeight: 'bold' }}>{product.grade || 'N/A'}</div>
                        </div>
                        <div className="spec-card">
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>Usage</span>
                            <div style={{ fontWeight: 'bold' }}>{product.usage || 'N/A'}</div>
                        </div>
                        <div className="spec-card">
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>Size</span>
                            <div style={{ fontWeight: 'bold' }}>{product.size || 'N/A'}</div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div style={{ marginTop: '40px', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
                        {['description', 'specifications', 'usage', 'reviews'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '15px 30px',
                                    background: activeTab === tab ? '#f9f9f9' : 'white',
                                    borderBottom: activeTab === tab ? '3px solid var(--color-primary)' : 'none',
                                    fontWeight: activeTab === tab ? 'bold' : 'normal',
                                    color: activeTab === tab ? 'var(--color-primary)' : '#666',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div style={{ padding: '30px' }}>
                        {activeTab === 'description' && (
                            <div>
                                <p>{product.description}</p>
                                <p style={{ marginTop: '10px' }}>
                                    High-quality {product.name} sourced from {product.brand}. Ideal for ensuring durability and aesthetic appeal in your interiors.
                                </p>
                            </div>
                        )}
                        {activeTab === 'specifications' && (
                            <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                                {product.features && product.features.map((f, i) => <li key={i} style={{ marginBottom: '5px' }}>{f}</li>)}
                                <li>Dimension: {product.size || 'Standard'}</li>
                            </ul>
                        )}
                        {activeTab === 'usage' && (
                            <p>{product.usage || "Best suited for cupboards, wardrobes, kitchen cabinets, and wall paneling. Ensure surface is clean before application."}</p>
                        )}
                        {activeTab === 'reviews' && (
                            <p>No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
