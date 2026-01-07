import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsData } from '../data/products';
import '../index.css';

const ProductCategory = () => {
    const { filterType, filterValue } = useParams();
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [pageTitle, setPageTitle] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);

        let products = [];
        let title = '';

        const normalizedValue = filterValue ? filterValue.toLowerCase() : '';

        // Helper to normalize string for comparison (removes hyphens, etc)
        const normalize = (str) => str.toLowerCase().replace(/-/g, ' ').trim();
        const searchNormalized = normalize(normalizedValue);

        if (filterType === 'category') {
            // Direct lookup if the category key matches logic
            // Try to find the key in productsData
            // Our keys are like 'plywood', 'mdf', 'mdf-and-board' etc.
            // But the URL might be 'plywood-&-blockboard'.

            // We iterate keys to find best match
            let foundKey = Object.keys(productsData).find(key =>
                normalize(key) === searchNormalized ||
                normalize(key).includes(searchNormalized) ||
                searchNormalized.includes(normalize(key))
            );

            // Fallback for tricky mapping (manual mapping if needed, or broad search)
            if (!foundKey) {
                // Try exact match on 'plywood' from 'plywood'
                foundKey = Object.keys(productsData).find(key => key === normalizedValue);
            }

            if (foundKey) {
                products = productsData[foundKey] || [];
                title = foundKey.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            } else {
                // If no key found, maybe it's a "Plywood" generic search across all categories? 
                // For now, assume key match.
            }

        } else if (filterType === 'brand' || filterType === 'features') {
            // Flatten all products
            const allProducts = Object.values(productsData).flat();

            if (filterType === 'brand') {
                products = allProducts.filter(p => p.brand && normalize(p.brand).includes(searchNormalized));
                title = `${filterValue.replace(/-/g, ' ')} Products`;
            } else if (filterType === 'features') {
                products = allProducts.filter(p => p.features && p.features.some(f => normalize(f).includes(searchNormalized)));
                title = `${filterValue.replace(/-/g, ' ')} Collection`;
            }
        }

        setDisplayedProducts(products);
        setPageTitle(title || filterValue.replace(/-/g, ' '));

    }, [filterType, filterValue]);


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
                                        src={product.image}
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
