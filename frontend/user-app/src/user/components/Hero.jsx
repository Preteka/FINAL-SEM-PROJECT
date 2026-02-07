import React, { useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import "../../index.css";
import heroImage from '../../shared/assets/hero_carpenter.jpg';

const Hero = () => {
    const heroRef = useRef(null);

    useEffect(() => {
        // Add scroll-based parallax effect
        const handleScroll = () => {
            if (heroRef.current) {
                const scrolled = window.scrollY;
                const parallaxElement = heroRef.current.querySelector('.hero-bg');
                if (parallaxElement) {
                    parallaxElement.style.transform = `translateY(${scrolled * 0.3}px)`;
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section
            ref={heroRef}
            className="hero-section"
            style={{
                position: 'relative',
                height: '100vh',
                minHeight: '700px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
                overflow: 'hidden'
            }}
        >
            {/* Background Image with Parallax */}
            <div
                className="hero-bg"
                style={{
                    position: 'absolute',
                    top: '-10%',
                    left: 0,
                    width: '100%',
                    height: '120%',
                    backgroundImage: `url(${heroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0
                }}
            ></div>

            {/* Gradient Overlay - Austin Plywood Style */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(
                    135deg, 
                    rgba(62, 39, 35, 0.92) 0%, 
                    rgba(93, 64, 55, 0.85) 35%,
                    rgba(78, 52, 46, 0.75) 65%,
                    rgba(0, 0, 0, 0.65) 100%
                )`,
                zIndex: 1
            }}></div>

            {/* Decorative Elements */}
            <div style={{
                position: 'absolute',
                top: '15%',
                right: '10%',
                width: '350px',
                height: '350px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(215, 204, 200, 0.15) 0%, transparent 70%)',
                filter: 'blur(50px)',
                zIndex: 2
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '15%',
                left: '5%',
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(141, 110, 99, 0.2) 0%, transparent 70%)',
                filter: 'blur(40px)',
                zIndex: 2
            }}></div>

            {/* Geometric accent lines */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '8%',
                width: '1px',
                height: '150px',
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)',
                zIndex: 2
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '25%',
                right: '12%',
                width: '1px',
                height: '120px',
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)',
                zIndex: 2
            }}></div>

            {/* Main Content */}
            <div className="container" style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '1000px',
                padding: '0 20px'
            }}>
                {/* Premium Badge */}
                <div
                    className="animate-fade-in-up"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 24px',
                        backgroundColor: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 'var(--radius-full)',
                        marginBottom: '32px',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        letterSpacing: 'var(--tracking-wider)',
                        textTransform: 'uppercase',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 4px 30px rgba(0,0,0,0.1)'
                    }}
                >
                    <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#D7CCC8',
                        animation: 'pulse 2s infinite'
                    }}></span>
                    Premium Quality Since 2005
                </div>

                {/* Main Headline */}
                <h1
                    className="animate-fade-in-up animate-delay-100"
                    style={{
                        fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
                        marginBottom: '28px',
                        fontWeight: 'var(--font-extrabold)',
                        lineHeight: '1.1',
                        letterSpacing: '-0.03em',
                        textShadow: '0 4px 30px rgba(0,0,0,0.3)'
                    }}
                >
                    Experience Plywood Like
                    <br />
                    <span style={{
                        background: 'linear-gradient(135deg, #EFEBE9 0%, #D7CCC8 50%, #BCAAA4 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        display: 'inline-block'
                    }}>Never Before</span>
                </h1>

                {/* Subheadline */}
                <p
                    className="animate-fade-in-up animate-delay-200"
                    style={{
                        fontSize: 'var(--text-xl)',
                        marginBottom: '44px',
                        opacity: 0.92,
                        maxWidth: '700px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        lineHeight: '1.7',
                        fontWeight: 'var(--font-normal)'
                    }}
                >
                    Transform your interiors with premium plywood solutions.
                    Real-time stock availability and accurate cost estimation for your construction needs.
                </p>

                {/* CTA Buttons */}
                <div
                    className="animate-fade-in-up animate-delay-300"
                    style={{
                        display: 'flex',
                        gap: '20px',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}
                >
                    <Link
                        to="/products"
                        className="btn hero-btn-primary"
                        style={{
                            padding: '18px 40px',
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-semibold)',
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: '0 10px 40px rgba(93, 64, 55, 0.5)',
                            border: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 16px 50px rgba(93, 64, 55, 0.6)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 10px 40px rgba(93, 64, 55, 0.5)';
                        }}
                    >
                        Explore Products <ArrowRight size={20} />
                    </Link>
                    <Link
                        to="/cost-estimation"
                        className="btn hero-btn-outline"
                        style={{
                            padding: '18px 40px',
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-semibold)',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '2px solid rgba(255,255,255,0.35)',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: 'var(--radius-lg)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        Cost Calculator
                    </Link>
                </div>

                {/* Stats Row - Austin Style */}
                <div
                    className="animate-fade-in-up animate-delay-400"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '60px',
                        marginTop: '70px',
                        flexWrap: 'wrap'
                    }}
                >
                    {[
                        { number: '20+', label: 'Years Experience' },
                        { number: '5000+', label: 'Happy Customers' },
                        { number: '100+', label: 'Product Varieties' }
                    ].map((stat, index) => (
                        <div
                            key={index}
                            style={{
                                textAlign: 'center',
                                padding: '0 20px'
                            }}
                        >
                            <div style={{
                                fontSize: 'var(--text-4xl)',
                                fontWeight: 'var(--font-bold)',
                                background: 'linear-gradient(135deg, #FFFFFF 0%, #D7CCC8 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                marginBottom: '4px'
                            }}>
                                {stat.number}
                            </div>
                            <div style={{
                                fontSize: 'var(--text-sm)',
                                opacity: 0.75,
                                letterSpacing: 'var(--tracking-wide)',
                                textTransform: 'uppercase'
                            }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 10,
                opacity: 0.7,
                animation: 'float 3s ease-in-out infinite'
            }}>
                <span style={{
                    fontSize: 'var(--text-xs)',
                    letterSpacing: 'var(--tracking-widest)',
                    marginBottom: '12px',
                    textTransform: 'uppercase'
                }}>Scroll Down</span>
                <ChevronDown size={24} style={{ animation: 'fadeInDown 1.5s infinite' }} />
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(-8px); }
                }
                
                .hero-btn-primary::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: left 0.5s;
                }
                
                .hero-btn-primary:hover::before {
                    left: 100%;
                }
            `}</style>
        </section>
    );
};

export default Hero;
