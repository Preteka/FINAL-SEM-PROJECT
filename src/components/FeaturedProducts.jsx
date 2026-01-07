import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import '../index.css';

const FeaturedProducts = () => {
    const categories = [
        {
            id: 1,
            name: "Premium Plywood",
            image: "https://images.unsplash.com/photo-1517646133055-fa6c6436125b?q=80&w=2668&auto=format&fit=crop",
            desc: "Marine, BWR, and MR Grade Plywoods"
        },
        {
            id: 2,
            name: "Toughened Glass",
            image: "https://images.unsplash.com/photo-1507764923583-b5a079c18aec?q=80&w=2574&auto=format&fit=crop", // Glass/Window
            desc: "High-strength glass for modern exteriors"
        },
        {
            id: 3,
            name: "Designer Laminates",
            image: "https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=2574&auto=format&fit=crop", // Textured surface
            desc: "Exquisite finishes for your interiors"
        },
        {
            id: 4,
            name: "Decorative Veneers",
            image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=2574&auto=format&fit=crop", // Wood veneer
            desc: "Natural wood textures for luxury appeal"
        }
    ];

    const scrollContainerRef = useRef(null);

    return (
        <section id="products" style={{ padding: '100px 0', backgroundColor: '#FAFAFA' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '50px' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--color-primary)' }}>Our Collections</h2>
                        <p style={{ color: 'var(--color-text-light)', fontSize: '1.1rem' }}>Browse our wide range of premium materials</p>
                    </div>
                    <a href="#all-products" style={{
                        color: 'var(--color-primary)',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        View All <ArrowRight size={18} />
                    </a>
                </div>

                <div
                    ref={scrollContainerRef}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '30px',
                    }}
                >
                    {categories.map((category) => (
                        <div
                            key={category.id}
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
                            <div style={{ height: '240px', overflow: 'hidden' }}>
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                />
                            </div>
                            <div style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--color-primary)' }}>{category.name}</h3>
                                <p style={{ color: 'var(--color-text-light)', marginBottom: '20px', fontSize: '0.95rem' }}>{category.desc}</p>
                                <button className="btn btn-outline" style={{ width: '100%', padding: '10px' }}>
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
