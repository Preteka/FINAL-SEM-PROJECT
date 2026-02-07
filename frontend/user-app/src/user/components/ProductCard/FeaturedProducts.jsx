import React, { useRef } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { Eye, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import "../../../index.css";

const FeaturedProducts = () => {
    const { products, loading, error, fetchProducts } = useProducts();
    const scrollContainerRef = useRef(null);

    React.useEffect(() => {
        const unsubscribe = fetchProducts({ limit: 8 });
        return () => {
            if (unsubscribe && typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, [fetchProducts]);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 350; // Approximates card width + gap
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return (
            <div className="section-padding container">
                <div className="skeleton" style={{ height: '400px', borderRadius: 'var(--radius-lg)' }}></div>
            </div>
        );
    }

    if (error) return null;

    // Show only 8 products max for the slider
    const displayProducts = products.slice(0, 8);

    return (
        <section className="section-austin" style={{ backgroundColor: 'white', position: 'relative' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '40px' }}>
                    <div className="section-header" style={{ marginBottom: 0, textAlign: 'left' }}>
                        <span className="section-badge">Our Collection</span>
                        <h2 className="section-heading" style={{ margin: 0 }}>Featured Products</h2>
                    </div>

                    {/* Navigation Arrows */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => scroll('left')}
                            className="slider-nav-btn"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="slider-nav-btn"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* Horizontal Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    className="hide-scrollbar"
                    style={{
                        display: 'flex',
                        gap: '30px',
                        overflowX: 'auto',
                        paddingBottom: '40px', // Space for shadows
                        scrollSnapType: 'x mandatory'
                    }}
                >
                    {displayProducts.map((product) => (
                        <div
                            key={product.id}
                            className="product-card-slide"
                            style={{
                                flex: '0 0 320px', // Fixed width for slides
                                scrollSnapAlign: 'start',
                                backgroundColor: 'white',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--color-border-light)',
                                overflow: 'hidden',
                                position: 'relative',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div className="card-image-container" style={{ position: 'relative', height: '320px', overflow: 'hidden' }}>
                                <img
                                    src={product.image || 'https://via.placeholder.com/300'}
                                    alt={product.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.5s ease'
                                    }}
                                    className="product-img"
                                />
                                <span className="category-pill" style={{
                                    position: 'absolute',
                                    top: '15px',
                                    left: '15px',
                                    backgroundColor: 'white',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: 'var(--color-text)',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}>
                                    {product.category || 'Premium'}
                                </span>

                                {/* Hover Overlay */}
                                <div className="hover-overlay">
                                    <Link to={`/product/${product.id}`} className="quick-view-btn">
                                        <Eye size={18} /> Quick View
                                    </Link>
                                </div>
                            </div>

                            <div style={{ padding: '20px' }}>
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    marginBottom: '8px',
                                    height: '2.4em',
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
                                }}>
                                    {product.name}
                                </h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{
                                        color: 'var(--color-primary)',
                                        fontWeight: '700',
                                        fontSize: '1.1rem'
                                    }}>
                                        {product.brand}
                                    </span>
                                    <Link to={`/product/${product.id}`} style={{
                                        color: 'var(--color-text-light)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        fontSize: '0.9rem',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s'
                                    }}>
                                        Details <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* View All Card */}
                    <div className="product-card-slide" style={{
                        flex: '0 0 250px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: 'var(--radius-lg)',
                        border: '2px dashed var(--color-border)',
                        cursor: 'pointer'
                    }}>
                        <Link to="/products" style={{ textDecoration: 'none', textAlign: 'center', color: 'var(--color-primary)' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(93, 64, 55, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 15px'
                            }}>
                                <ArrowRight size={30} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem' }}>View All<br />Products</h3>
                        </Link>
                    </div>

                </div>
            </div>

            <style>{`
        .slider-nav-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid var(--color-border);
            background: white;
            color: var(--color-text);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .slider-nav-btn:hover {
            background: var(--color-primary);
            color: white;
            border-color: var(--color-primary);
        }
        
        .product-card-slide:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-lg);
            border-color: transparent;
        }
        
        .product-card-slide:hover .product-img {
            transform: scale(1.08);
        }
        
        .hover-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .product-card-slide:hover .hover-overlay {
            opacity: 1;
        }
        
        .quick-view-btn {
            background: white;
            color: var(--color-text);
            padding: 10px 20px;
            border-radius: 30px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            transform: translateY(20px);
            transition: transform 0.3s ease;
        }
        
        .product-card-slide:hover .quick-view-btn {
            transform: translateY(0);
        }
        
        /* Hide Scrollbar */
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
        </section>
    );
};

export default FeaturedProducts;
