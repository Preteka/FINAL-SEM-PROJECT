import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { ArrowUpRight, Search, Filter, ChevronRight } from 'lucide-react';
import './Products.css';

const ProductCategory = () => {
    const { filterType, filterValue } = useParams();
    const { products: allItems, loading, error, fetchProducts } = useProducts();
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [pageTitle, setPageTitle] = useState('');
    const sectionRef = useRef(null);

    // Derived filters for sidebar
    const categories = ['Plywood', 'MDF', 'Particle Board', 'Veneers', 'Glass', 'Mica & Lamination'];
    const brands = ['Greenply', 'Century Ply', 'Kitply', 'Action Tesa'];

    useEffect(() => {
        const unsubscribe = fetchProducts();
        return () => {
            if (unsubscribe && typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, [fetchProducts]);

    useEffect(() => {
        if (!loading) {
            window.scrollTo(0, 0);

            let filtered = [];
            let title = '';

            const normalize = (str) => {
                if (!str) return '';
                return str.toLowerCase()
                    .replace(/-/g, ' ')
                    .replace(/&/g, 'and')
                    .replace(/\s+/g, ' ')
                    .trim();
            };

            const searchNormalized = normalize(filterValue);

            if (filterType === 'category') {
                filtered = allItems.filter(item => {
                    if (!item.category) return false;
                    const itemCat = normalize(item.category);
                    return itemCat === searchNormalized ||
                        itemCat.includes(searchNormalized) ||
                        searchNormalized.includes(itemCat);
                });
                title = filterValue ? filterValue.replace(/-/g, ' ') : 'All Products';

            } else if (filterType === 'brand') {
                filtered = allItems.filter(p => p.brand && normalize(p.brand).includes(searchNormalized));
                title = filterValue ? `${filterValue.replace(/-/g, ' ')} Products` : 'All Brands';
            } else if (filterType === 'features') {
                filtered = allItems.filter(p => p.features && Array.isArray(p.features) && p.features.some(f => normalize(f).includes(searchNormalized)));
                title = filterValue ? `${filterValue.replace(/-/g, ' ')} Collection` : 'Featured Collection';
            } else {
                filtered = allItems;
                title = 'Premium Collection';
            }

            setDisplayedProducts(filtered);
            setPageTitle(title || 'All Products');
        }
    }, [filterType, filterValue, allItems, loading]);

    // Scroll reveal animation
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        const elements = sectionRef.current?.querySelectorAll('.animate-reveal');
        elements?.forEach((el) => observer.observe(el));

        return () => elements?.forEach((el) => observer.unobserve(el));
    }, [displayedProducts]);

    if (error) {
        return (
            <div className="container" style={{ padding: '150px 0', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--color-primary)' }}>Coming Soon</h2>
                <p>We are currently updating our {pageTitle} catalog.</p>
                <Link to="/cost-estimation" className="btn btn-primary" style={{ marginTop: '20px' }}>Try Cost Estimator</Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container" style={{ padding: '150px 0', textAlign: 'center' }}>
                <div className="skeleton-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
                    <div className="skeleton" style={{ width: '30px', height: '30px', borderRadius: '50%' }}></div>
                    <span style={{ color: 'var(--color-text-light)', fontWeight: '600' }}>Loading Premium Catalog...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="products-page" ref={sectionRef}>
            {/* Hero Section */}
            <div className="products-hero">
                <div className="container">
                    <span className="filter-badge">
                        {filterType ? `${filterType}: ${filterValue}` : 'Our Full Catalog'}
                    </span>
                    <h1 style={{ textTransform: 'capitalize' }}>{pageTitle}</h1>
                    <p>Discover the finest selection of timber and plywood surfaces carefully curated for elite interiors.</p>
                </div>
            </div>

            <div className="container">
                <div className="products-main">

                    {/* Sidebar */}
                    <aside className="sidebar-filters animate-slide-left">
                        <div className="filter-group">
                            <span className="filter-title">Categories</span>
                            <ul className="filter-list">
                                {categories.map(cat => (
                                    <li key={cat} className="filter-item">
                                        <Link
                                            to={`/products/category/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                                            className={`filter-link ${filterValue?.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                                        >
                                            {cat}
                                            <ChevronRight size={14} className="filter-count" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="filter-group">
                            <span className="filter-title">Popular Brands</span>
                            <ul className="filter-list">
                                {brands.map(brand => (
                                    <li key={brand} className="filter-item">
                                        <Link
                                            to={`/products/brand/${brand.toLowerCase().replace(/\s+/g, '-')}`}
                                            className={`filter-link ${filterValue?.toLowerCase() === brand.toLowerCase() ? 'active' : ''}`}
                                        >
                                            {brand}
                                            <ChevronRight size={14} className="filter-count" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div style={{
                            background: 'var(--color-primary)',
                            padding: '30px',
                            borderRadius: '20px',
                            color: 'white',
                            marginTop: '40px'
                        }}>
                            <h4 style={{ marginBottom: '10px' }}>Need Custom Sizes?</h4>
                            <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '20px' }}>Get instant estimates for your specific room dimensions.</p>
                            <Link to="/cost-estimation" className="btn btn-white" style={{ width: '100%', fontSize: '0.8rem', padding: '10px' }}>
                                Calculate Cost
                            </Link>
                        </div>
                    </aside>

                    {/* Main Grid */}
                    <main>
                        <div style={{
                            marginBottom: '30px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <p style={{ color: 'var(--color-text-light)', fontWeight: '500' }}>
                                Found <strong style={{ color: 'var(--color-primary)' }}>{displayedProducts.length}</strong> matching results
                            </p>
                        </div>

                        <div className="products-grid">
                            {displayedProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="product-card-premium animate-reveal"
                                    style={{ transitionDelay: `${(index % 6) * 0.1}s` }}
                                >
                                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div className="product-image-wrapper">
                                            {product.brand && <span className="brand-badge">{product.brand}</span>}
                                            <img
                                                src={product.images && product.images.length > 0 ? product.images[0] : product.image}
                                                alt={product.name}
                                                loading="lazy"
                                            />
                                            <div className="view-details-btn">
                                                <ArrowUpRight size={20} />
                                            </div>
                                        </div>

                                        <div className="product-info">
                                            <span className="product-category-name">{product.category}</span>
                                            <h3 className="product-name-premium">{product.name}</h3>

                                            <div className="product-meta-premium">
                                                <span className="product-price-premium">{product.price}</span>
                                                <span className="thickness-pill">{product.thickness || product.size || 'Standard'}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {!displayedProducts.length && (
                            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                <Search size={48} style={{ opacity: 0.2, marginBottom: '20px' }} />
                                <h3>No matching products</h3>
                                <p>Try adjusting your filters or browse our full collection.</p>
                            </div>
                        )}
                    </main>

                </div>
            </div>
        </div>
    );
};

export default ProductCategory;
