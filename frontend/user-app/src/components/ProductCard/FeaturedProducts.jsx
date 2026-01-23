import React, { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import '../../index.css';

const FeaturedProducts = () => {
    const { products, loading, fetchProducts } = useProducts();
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        fetchProducts({ limit: 4, orderBy: 'createdAt', orderDir: 'desc' });
    }, [fetchProducts]);

    if (loading) {
        return (
            <section id="products" style={{ padding: '100px 0', backgroundColor: '#FAFAFA' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <p>Loading featured products...</p>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null; // Don't show the section if no products
    }

    return (
        <section id="products" style={{ padding: '100px 0', backgroundColor: '#FAFAFA' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '50px' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--color-primary)' }}>Featured Products</h2>
                        <p style={{ color: 'var(--color-text-light)', fontSize: '1.1rem' }}>Our latest premium materials</p>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '30px',
                    }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-sm)',
                                transition: 'var(--transition)',
                                cursor: 'pointer',
                                border: '1px solid #f0f0f0'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                            }}
                        >
                            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ height: '240px', overflow: 'hidden' }}>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                </div>
                                <div style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                        <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', margin: 0 }}>{product.name}</h3>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{product.price}</span>
                                    </div>
                                    <p style={{ color: 'var(--color-text-light)', marginBottom: '20px', fontSize: '0.95rem' }}>{product.brand} - {product.category}</p>
                                    <span className="btn btn-outline" style={{ display: 'block', textAlign: 'center', width: '100%', padding: '10px' }}>
                                        View Details
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
