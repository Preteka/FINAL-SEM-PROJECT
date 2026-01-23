import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import '../../index.css';

const ProductCategory = () => {
    const { filterType, filterValue } = useParams();
    const { products: allItems, loading, fetchProducts } = useProducts();
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [pageTitle, setPageTitle] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        if (!loading && allItems.length > 0) {
            window.scrollTo(0, 0);

            let filtered = [];
            let title = '';

            const normalizedValue = filterValue ? filterValue.toLowerCase() : '';

            // Helper to normalize string for comparison
            const normalize = (str) => str.toLowerCase()
                .replace(/-/g, ' ')
                .replace(/&/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            const searchNormalized = normalize(normalizedValue);

            if (filterType === 'category') {
                // Filter allItems by category field
                filtered = allItems.filter(item =>
                    item.category && (
                        normalize(item.category) === searchNormalized ||
                        normalize(item.category).includes(searchNormalized) ||
                        searchNormalized.includes(normalize(item.category))
                    )
                );
                title = filterValue.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

            } else if (filterType === 'brand' || filterType === 'features') {
                if (filterType === 'brand') {
                    filtered = allItems.filter(p => p.brand && normalize(p.brand).includes(searchNormalized));
                    title = `${filterValue.replace(/-/g, ' ')} Products`;
                } else if (filterType === 'features') {
                    filtered = allItems.filter(p => p.features && Array.isArray(p.features) && p.features.some(f => normalize(f).includes(searchNormalized)));
                    title = `${filterValue.replace(/-/g, ' ')} Collection`;
                }
            }

            setDisplayedProducts(filtered);
            setPageTitle(title || filterValue.replace(/-/g, ' '));
        }
    }, [filterType, filterValue, allItems, loading]);

    if (loading) {
        return <div className="container" style={{ padding: '150px 0', textAlign: 'center' }}>Loading products...</div>;
    }


    if (!displayedProducts.length) {
        return (
            <div className="container" style={{ padding: '150px 0', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--color-primary)' }}>{pageTitle} Not Found</h2>
                <p>We couldn't find any products in this {filterType}.</p>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '20px', textDecoration: 'none' }}>Back to Home</Link>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '80vh' }}>
            {/* Category Header */}
            <div style={{
                position: 'relative',
                padding: '150px 0 80px',
                marginBottom: '60px',
                textAlign: 'center',
                backgroundImage: 'url("https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1600&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.6)'
                }}></div>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ fontSize: '3rem', color: 'white', marginBottom: '10px', textTransform: 'capitalize' }}>{pageTitle}</h1>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem' }}>Explore our premium collection of {pageTitle}</p>
                </div>
            </div>

            {/* Product Grid */}
            <div className="container" style={{ marginBottom: '80px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '40px'
                }}>
                    {displayedProducts.map((product) => (
                        <div key={product.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-md)',
                            transition: 'var(--transition)'
                        }}
                            className="product-card"
                        >
                            <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                                <Link to={`/product/${product.id}`}>
                                    <img
                                        src={product.images && product.images.length > 0 ? product.images[0] : product.image}
                                        alt={product.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.5s ease'
                                        }}
                                        onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                    />
                                    {product.brand && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            background: 'rgba(255,255,255,0.9)',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            color: 'var(--color-primary)'
                                        }}>
                                            {product.brand}
                                        </span>
                                    )}
                                </Link>
                            </div>
                            <div style={{ padding: '20px' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--color-text)' }}>{product.name}</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <span style={{ backgroundColor: '#eee', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', color: '#666' }}>{product.thickness || product.size}</span>
                                    <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{product.price}</span>
                                </div>
                                <Link to={`/product/${product.id}`} className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>View Details</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductCategory;
