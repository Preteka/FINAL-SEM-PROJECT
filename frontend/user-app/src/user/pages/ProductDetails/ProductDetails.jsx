// HMR Force Update - Context paths fixed
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../../shared/context/CartContext';
import {
    ChevronLeft,
    Share2,
    MessageCircle,
    Check,
    ShieldCheck,
    Truck,
    Clock,
    Award,
    Copy,
    ChevronRight,
    Search
} from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { loading, fetchProductById } = useProducts();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [area, setArea] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        const getProduct = async () => {
            const data = await fetchProductById(productId);
            if (data) {
                setProduct(data);
                setMainImage(data.images && data.images.length > 0 ? data.images[0] : data.image);
            }
        };

        getProduct();
    }, [productId, fetchProductById]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        navigate('/cart');
    };

    if (loading || !product) {
        return (
            <div className="container" style={{ padding: '200px 0', textAlign: 'center' }}>
                <div className="skeleton-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '50%' }}></div>
                    <span style={{ color: 'var(--color-text-light)', fontWeight: '600' }}>Preparing Your Showroom...</span>
                </div>
            </div>
        );
    }

    const productImages = product.images && product.images.length > 0
        ? product.images
        : [product.image].filter(Boolean);

    return (
        <div className="product-details-page">

            {/* Success Notification */}
            {showNotification && (
                <div style={{
                    position: 'fixed',
                    top: '120px',
                    right: '30px',
                    background: 'var(--color-primary)',
                    color: 'white',
                    padding: '20px 30px',
                    borderRadius: '16px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    animation: 'slideInRight 0.4s ease-out'
                }}>
                    <Check size={24} />
                    <div>
                        <div style={{ fontWeight: '800', fontSize: '1rem' }}>Added to Cart</div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{product.name}</div>
                    </div>
                </div>
            )}

            <div className="container">

                {/* Breadcrumb */}
                <div className="breadcrumb-premium">
                    <Link to="/">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/products">Catalog</Link>
                    <ChevronRight size={14} />
                    <span>{product.category}</span>
                </div>

                <div className="product-main-grid">

                    {/* Left: Gallery */}
                    <div className="gallery-container">
                        <div className="main-image-viewport">
                            <img src={mainImage} alt={product.name} />
                            <div style={{
                                position: 'absolute',
                                bottom: '20px',
                                right: '20px',
                                background: 'white',
                                padding: '10px',
                                borderRadius: '50%',
                                opacity: 0.8
                            }}>
                                <Search size={20} color="var(--color-primary)" />
                            </div>
                        </div>

                        <div className="thumbnails-grid">
                            {productImages.map((img, index) => (
                                <div
                                    key={index}
                                    className={`thumb-item ${mainImage === img ? 'active' : ''}`}
                                    onClick={() => setMainImage(img)}
                                >
                                    <img src={img} alt={`View ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="product-info-panel">
                        <span style={{
                            display: 'inline-block',
                            background: 'var(--color-wood-light)',
                            color: 'var(--color-primary)',
                            padding: '6px 15px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '20px'
                        }}>
                            {product.brand || 'Premium Selection'}
                        </span>

                        <h1 className="product-title-premium">{product.name}</h1>
                        <p className="product-subtitle">
                            {product.description || "Architect-quality plywood carefully manufactured to provide maximum durability and exceptional finish for modern interior designs."}
                        </p>

                        <div className="price-tag-premium">
                            <span className="price-amount">{product.price}</span>
                            <span className="price-unit">{product.price.includes('sq.ft') ? '' : 'per unit'}</span>
                        </div>

                        {/* Specs Table */}
                        <div className="specs-container">
                            <div className="specs-grid">
                                <div className="spec-entry">
                                    <span className="spec-label">Thickness</span>
                                    <span className="spec-value">{product.thickness || 'Standard'}</span>
                                </div>
                                <div className="spec-entry">
                                    <span className="spec-label">Grade</span>
                                    <span className="spec-value">{product.grade || 'Marine / BWR'}</span>
                                </div>
                                <div className="spec-entry">
                                    <span className="spec-label">Sheet Size</span>
                                    <span className="spec-value">{product.size || '8\' x 4\''}</span>
                                </div>
                                <div className="spec-entry">
                                    <span className="spec-label">Ideal For</span>
                                    <span className="spec-value">{product.usage || 'Interiors'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="purchase-box">
                            <div className="control-group">
                                <div className="qty-stepper">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                                </div>
                                <div className="area-input-box">
                                    <input
                                        type="number"
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        placeholder="Estimate Area"
                                    />
                                    <span className="area-unit">SQ.FT</span>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button className="btn-premium btn-premium-primary" onClick={handleAddToCart}>
                                    Add to Cart
                                </button>
                                <button className="btn-premium btn-premium-outline" onClick={handleBuyNow}>
                                    Direct Buy
                                </button>
                            </div>
                        </div>

                        {/* Features Bar */}
                        <div className="bottom-features">
                            <div className="feature-pill">
                                <ShieldCheck size={18} />
                                <span>Warranty</span>
                            </div>
                            <div className="feature-pill">
                                <Truck size={18} />
                                <span>Express</span>
                            </div>
                            <div className="feature-pill">
                                <Award size={18} />
                                <span>ISI Grade</span>
                            </div>
                            <div className="feature-pill" style={{ cursor: 'pointer' }}>
                                <Share2 size={18} />
                                <span>Share</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '30px', padding: '20px', border: '1px dashed #ddd', borderRadius: '15px', color: '#888', fontSize: '0.85rem' }}>
                            <strong>Expert Note:</strong> Recommended for humid environments and heavy-load furniture. Always ensure professional installation.
                        </div>

                    </div>

                </div>

            </div>

            <style>{`
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(50px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default ProductDetails;
