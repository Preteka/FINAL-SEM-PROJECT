import React from 'react';
import { Shield, DollarSign, Clock, Smile } from 'lucide-react';
import "../../index.css";

const WhyVinayaga = () => {
    const features = [
        {
            icon: <Shield size={24} />,
            title: "High-quality plywood materials"
        },
        {
            icon: <DollarSign size={24} />,
            title: "Transparent pricing"
        },
        {
            icon: <Clock size={24} />,
            title: "Faster order processing"
        },
        {
            icon: <Smile size={24} />,
            title: "Customer-friendly experience"
        }
    ];

    return (
        <section className="section-austin" style={{ backgroundColor: 'white', overflow: 'hidden' }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '80px',
                    alignItems: 'center'
                }}>

                    {/* Left Side: Image with Floating Card */}
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '100%',
                            height: '500px',
                            borderRadius: 'var(--radius-xl)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            <img
                                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
                                alt="Modern Interior"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        {/* Floating "25+ Years" Card */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            right: '-40px',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'white',
                            padding: '30px',
                            borderRadius: '24px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                            borderLeft: '5px solid var(--color-primary)',
                            zIndex: 2,
                            textAlign: 'center',
                            minWidth: '180px'
                        }}>
                            <h3 style={{
                                fontSize: '2.5rem',
                                fontWeight: '800',
                                color: 'var(--color-primary)',
                                margin: 0,
                                lineHeight: '1'
                            }}>
                                25+
                            </h3>
                            <p style={{
                                margin: '5px 0 0',
                                color: 'var(--color-text-light)',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                Years of Excellence
                            </p>
                        </div>

                        {/* Decorative circle behind card */}
                        <div style={{
                            position: 'absolute',
                            left: '-30px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            border: '1px solid var(--color-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1
                        }}>
                            <img src="/api/placeholder/100/30" alt="Quality Logo" style={{ opacity: 0.3, width: '80px' }} />
                        </div>
                    </div>

                    {/* Right Side: Content */}
                    <div>
                        <span style={{
                            display: 'inline-block',
                            padding: '8px 20px',
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-text-light)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            marginBottom: '24px'
                        }}>
                            About Us
                        </span>

                        <h2 style={{
                            fontSize: '3rem',
                            fontWeight: '800',
                            color: 'var(--color-primary)',
                            marginBottom: '24px',
                            lineHeight: '1.2'
                        }}>
                            Why Vinayaga Plywoods?
                        </h2>

                        <p style={{
                            color: 'var(--color-text-light)',
                            fontSize: '1.1rem',
                            lineHeight: '1.7',
                            marginBottom: '40px'
                        }}>
                            We understand the importance of quality in construction. That's why we source only the finest materials to ensure your projects stand the test of time.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            {features.map((feature, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '16px',
                                        backgroundColor: 'var(--color-surface)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--color-primary)',
                                        flexShrink: 0
                                    }}>
                                        {feature.icon || null}
                                    </div>
                                    <h4 style={{
                                        margin: 0,
                                        fontSize: '1.1rem',
                                        color: 'var(--color-text)',
                                        fontWeight: '600'
                                    }}>
                                        {feature.title}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default WhyVinayaga;
