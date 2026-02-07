import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import "../../index.css";

const ProductShowcase = () => {
    const scrollRef = useRef(null);

    const products = [
        {
            name: "Vinayaga Plywood",
            image: "https://images.unsplash.com/photo-1611486212557-88be5ff6f941?auto=format&fit=crop&w=600&q=80",
            category: "Premium Grade",
            link: "/products/category/plywood"
        },
        {
            name: "Vinayaga Flush Door",
            image: "/images/DOOR.png",
            category: "Door Solutions",
            link: "/products/category/doors"
        },
        {
            name: "Vinayaga Block Board",
            image: "/images/BLOCK.png",
            category: "Structural Board",
            link: "/products/category/block-board"
        },
        {
            name: "Decorative Veneer",
            image: "/images/DEC.png",
            category: "Finish",
            link: "/products/category/veneers"
        }
    ];

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 320;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section style={{ height: '600px', width: '100%', position: 'relative', overflow: 'hidden' }}>
            {/* Background Split */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex' }}>
                <div style={{ flex: '0 0 55%', height: '100%', backgroundColor: 'var(--color-primary)' }}></div>
                <div style={{ flex: '1', height: '100%', position: 'relative' }}>
                    <img
                        src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80"
                        alt="Interior"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.1)' }}></div>
                </div>
            </div>

            {/* Content Overlay */}
            <div className="container" style={{ position: 'relative', height: '100%', zIndex: 10, display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    {/* Left Side Content */}
                    <div style={{ width: '45%', color: 'white', paddingRight: '40px' }}>
                        <div style={{ borderTop: '2px solid white', display: 'inline-block', paddingTop: '10px', marginBottom: '20px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                Vinayaga Plywood Products
                            </span>
                        </div>

                        <h2 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '30px' }}>
                            Turn Your Interiors Into Purposeful Spaces with Vinayaga Plywood
                        </h2>

                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '40px' }}>
                            <li style={{ marginBottom: '15px', position: 'relative', paddingLeft: '20px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                <span style={{ position: 'absolute', left: 0, top: '8px', width: '6px', height: '6px', backgroundColor: 'white', borderRadius: '50%' }}></span>
                                Leading plywood distributor in South India, adhering to strict quality standards.
                            </li>
                            <li style={{ marginBottom: '15px', position: 'relative', paddingLeft: '20px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                <span style={{ position: 'absolute', left: 0, top: '8px', width: '6px', height: '6px', backgroundColor: 'white', borderRadius: '50%' }}></span>
                                Only BWP plywood that resists boiling water for up to 200 hours.
                            </li>
                            <li style={{ marginBottom: '15px', position: 'relative', paddingLeft: '20px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                <span style={{ position: 'absolute', left: 0, top: '8px', width: '6px', height: '6px', backgroundColor: 'white', borderRadius: '50%' }}></span>
                                Lifetime warranty on plywood against manufacturing defects.
                            </li>
                        </ul>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button onClick={() => scroll('left')} className="nav-arrow-btn">
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={() => scroll('right')} className="nav-arrow-btn">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Right Side Carousel (Floating) */}
                    <div className="product-showcase-carousel hide-scrollbar"
                        ref={scrollRef}
                        style={{
                            width: '65%', // Overflows into the image area
                            display: 'flex',
                            gap: '20px',
                            overflowX: 'auto',
                            scrollSnapType: 'x mandatory',
                            padding: '20px 0 40px 0',
                            marginLeft: '-5%'
                        }}
                    >
                        {products.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    flex: '0 0 280px',
                                    backgroundColor: 'white',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                    scrollSnapAlign: 'start',
                                    transition: 'transform 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                className="showcase-card"
                            >
                                <div style={{ height: '220px', overflow: 'hidden' }}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                        className="card-img"
                                    />
                                </div>
                                <div style={{ padding: '20px', textAlign: 'center' }}>
                                    <h5 style={{
                                        margin: '0 0 5px 0',
                                        fontSize: '0.9rem',
                                        color: 'var(--color-text-light)',
                                        fontWeight: 'normal'
                                    }}>Vinayaga</h5>

                                    <h4 style={{
                                        margin: '0',
                                        color: 'var(--color-primary)',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {item.name.replace("Vinayaga ", "")}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            <style>{`
                .nav-arrow-btn {
                    width: 50px;
                    height: 50px;
                    border: 1px solid rgba(255,255,255,0.4);
                    background: transparent;
                    border-radius: 50%;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .nav-arrow-btn:hover {
                    background: white;
                    color: var(--color-primary);
                }
                .showcase-card:hover {
                    transform: translateY(-10px);
                }
                .showcase-card:hover .card-img {
                    transform: scale(1.1);
                }
                /* Hide scrollbar */
                .product-showcase-carousel::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
};

export default ProductShowcase;
