import React from 'react';
import '../index.css';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <section style={{
            position: 'relative',
            height: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'url("https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2669&auto=format&fit=crop")', // Wardrobe/Interior
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            textAlign: 'center'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.4)', // Dark overlay for readability
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3))'
            }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
                <h1 className="fade-in" style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                    marginBottom: '24px',
                    fontWeight: '800',
                    lineHeight: '1.2',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                    Smart Inventory and Order Processing for Quality Plywood
                </h1>
                <p className="fade-in" style={{
                    fontSize: '1.25rem',
                    marginBottom: '40px',
                    opacity: 0.95,
                    animationDelay: '0.2s',
                    maxWidth: '700px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    Experience premium plywood solutions with real-time stock availability and accurate cost estimation.
                </p>
                <div className="fade-in" style={{
                    display: 'flex',
                    gap: '20px',
                    justifyContent: 'center',
                    animationDelay: '0.4s',
                    flexWrap: 'wrap'
                }}>
                    <button className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                        Explore Products <ArrowRight size={20} />
                    </button>
                    <button className="btn btn-outline" style={{
                        padding: '16px 32px',
                        fontSize: '1.1rem',
                        borderColor: 'white',
                        color: 'white'
                    }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = 'var(--color-primary)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'white';
                        }}
                    >
                        View Pricing
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
