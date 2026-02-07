import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import "../../index.css";

const HeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Slide Data - mimicking Austin Plywood's high-impact visuals
    const slides = [
        {
            type: 'video',
            src: 'https://player.vimeo.com/external/371836771.sd.mp4?s=12dcc50db24606990499w7f4d0e65330368297&profile_id=164&oauth2_token_id=57447761', // Woodworking/Interior placeholder
            fallback: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
            title: "Crafting Excellence",
            subtitle: "Premium Plywood for Premium Homes",
            cta: "Explore Collection"
        },
        {
            type: 'image',
            src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80', // Modern interior
            title: "Innovative Designs",
            subtitle: "Transforming Spaces with Quality",
            cta: "View Projects"
        },
        {
            type: 'image',
            src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80', // Kitchen
            title: "Durable & Stylish",
            subtitle: "The Perfect Choice for Kitchens",
            cta: "Get Quote"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 6000);
        return () => clearInterval(timer);
    }, [currentSlide]);

    const nextSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        setTimeout(() => setIsAnimating(false), 500); // Match transition duration
    };

    const prevSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
        setTimeout(() => setIsAnimating(false), 500);
    };

    const goToSlide = (index) => {
        if (isAnimating || index === currentSlide) return;
        setIsAnimating(true);
        setCurrentSlide(index);
        setTimeout(() => setIsAnimating(false), 500);
    };

    return (
        <section className="hero-slider-section" style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', backgroundColor: '#000' }}>

            {/* Slides Container */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: index === currentSlide ? 1 : 0,
                        transition: 'opacity 0.8s ease-in-out',
                        zIndex: index === currentSlide ? 2 : 1
                    }}
                >
                    {/* Background Media */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                        {slide.type === 'video' ? (
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                poster={slide.fallback}
                            >
                                <source src={slide.src} type="video/mp4" />
                            </video>
                        ) : (
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: `url(${slide.src})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    animation: index === currentSlide ? 'kenBurns 8s linear forwards' : 'none'
                                }}
                            />
                        )}
                        {/* Dark Overlay for Text Readability */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6))'
                        }}></div>
                    </div>

                    {/* Content */}
                    <div className="container" style={{
                        position: 'relative',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        zIndex: 10
                    }}>
                        <div className={`slide-content ${index === currentSlide ? 'animate' : ''}`} style={{ maxWidth: '900px' }}>
                            <h2 style={{
                                color: 'white',
                                fontSize: 'clamp(3rem, 6vw, 5rem)',
                                fontWeight: '800',
                                lineHeight: '1.1',
                                marginBottom: '20px',
                                textShadow: '0 4px 10px rgba(0,0,0,0.3)',
                                letterSpacing: '-1px'
                            }}>
                                {slide.title}
                            </h2>
                            <p style={{
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                                marginBottom: '40px',
                                fontWeight: '300',
                                letterSpacing: '1px'
                            }}>
                                {slide.subtitle}
                            </p>

                            <Link
                                to="/products"
                                className="btn-hero-primary"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '16px 40px',
                                    backgroundColor: 'white',
                                    color: 'var(--color-primary)',
                                    textDecoration: 'none',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    borderRadius: '50px',
                                    transition: 'all 0.3s ease',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.color = 'var(--color-primary)';
                                }}
                            >
                                {slide.cta} <ArrowRight size={20} />
                            </Link>

                            {/* Optional Play Button for Video Slide */}
                            {slide.type === 'video' && (
                                <div style={{ marginTop: '40px' }}>
                                    <button style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        border: '1px solid rgba(255,255,255,0.4)',
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        color: 'white',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        backdropFilter: 'blur(5px)',
                                        transition: 'transform 0.3s ease'
                                    }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <Play fill="white" size={24} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                style={{
                    position: 'absolute',
                    left: '30px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    zIndex: 20,
                    transition: 'color 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >
                <ChevronLeft size={60} strokeWidth={1} />
            </button>

            <button
                onClick={nextSlide}
                style={{
                    position: 'absolute',
                    right: '30px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    zIndex: 20,
                    transition: 'color 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >
                <ChevronRight size={60} strokeWidth={1} />
            </button>

            {/* Pagination Dots */}
            <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '12px',
                zIndex: 20
            }}>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        style={{
                            width: index === currentSlide ? '30px' : '10px',
                            height: '10px',
                            backgroundColor: index === currentSlide ? 'var(--color-primary)' : 'rgba(255,255,255,0.5)',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </div>

            <style>{`
                @keyframes kenBurns {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.1); }
                }
                
                .slide-content h2, .slide-content p, .slide-content .btn-hero-primary {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.8s ease-out;
                }
                
                .slide-content.animate h2 {
                    opacity: 1;
                    transform: translateY(0);
                    transition-delay: 0.3s;
                }
                
                .slide-content.animate p {
                    opacity: 1;
                    transform: translateY(0);
                    transition-delay: 0.5s;
                }
                
                .slide-content.animate .btn-hero-primary {
                    opacity: 1;
                    transform: translateY(0);
                    transition-delay: 0.7s;
                }
            `}</style>
        </section>
    );
};

export default HeroSlider;
