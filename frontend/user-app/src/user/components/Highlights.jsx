import React, { useEffect, useRef } from 'react';
import { Shield, Award, Clock, Truck, CheckCircle, Droplets } from 'lucide-react';
import "../../index.css";

const Highlights = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15 });

        const elements = sectionRef.current?.querySelectorAll('.reveal');
        elements?.forEach((el) => observer.observe(el));

        return () => elements?.forEach((el) => observer.unobserve(el));
    }, []);

    const features = [
        {
            icon: <Shield size={28} />,
            title: "Premium Quality",
            description: "Finest materials sourced for durability and long-lasting performance.",
            highlight: "Lifetime Warranty"
        },
        {
            icon: <Droplets size={28} />,
            title: "Water Resistant",
            description: "Boiling water proof plywood that resists moisture for 200+ hours.",
            highlight: "BWP Certified"
        },
        {
            icon: <Award size={28} />,
            title: "Certified Products",
            description: "All products meet international quality standards and certifications.",
            highlight: "ISO Certified"
        },
        {
            icon: <Truck size={28} />,
            title: "Fast Delivery",
            description: "Streamlined logistics ensuring timely delivery to your location.",
            highlight: "On-Time Guarantee"
        }
    ];

    const certifications = [
        "ISO 9001:2015",
        "BWP Grade",
        "ISI Marked",
        "E0 Emission"
    ];

    return (
        <section
            ref={sectionRef}
            className="section-austin"
            style={{
                backgroundColor: 'var(--color-cream)',
                position: 'relative'
            }}
        >
            {/* Background Decoration */}
            <div className="bg-blob bg-blob-primary" style={{
                width: '400px',
                height: '400px',
                top: '-100px',
                right: '-100px'
            }}></div>
            <div className="bg-blob bg-blob-accent" style={{
                width: '300px',
                height: '300px',
                bottom: '-50px',
                left: '-50px'
            }}></div>

            <div className="container">
                {/* Section Header */}
                <div className="section-header reveal">
                    <span className="section-badge">
                        Why Choose Us
                    </span>
                    <h2 className="section-heading" style={{ fontSize: 'var(--text-4xl)' }}>
                        Quality You Can Trust
                    </h2>
                    <p className="section-desc">
                        Industry-leading features that set us apart from the competition
                    </p>
                </div>

                {/* Features Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 'var(--space-8)',
                    marginBottom: 'var(--space-16)'
                }}>
                    {features.map((item, index) => (
                        <div
                            key={index}
                            className="reveal premium-card"
                            style={{
                                padding: 'var(--space-8)',
                                textAlign: 'left',
                                transitionDelay: `${index * 0.1}s`,
                                position: 'relative'
                            }}
                        >
                            {/* Top accent line */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                                borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0'
                            }}></div>

                            {/* Icon */}
                            <div style={{
                                marginBottom: 'var(--space-5)',
                                display: 'inline-flex',
                                padding: 'var(--space-4)',
                                borderRadius: 'var(--radius-lg)',
                                background: 'linear-gradient(135deg, var(--color-wood-light) 0%, var(--color-accent-light) 100%)',
                                color: 'var(--color-primary)',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                {item.icon}
                            </div>

                            {/* Badge */}
                            <div style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                backgroundColor: 'rgba(93, 64, 55, 0.08)',
                                color: 'var(--color-primary)',
                                borderRadius: 'var(--radius-full)',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-semibold)',
                                marginBottom: 'var(--space-4)',
                                marginLeft: 'var(--space-3)'
                            }}>
                                {item.highlight}
                            </div>

                            {/* Content */}
                            <h3 style={{
                                marginBottom: 'var(--space-3)',
                                fontSize: 'var(--text-xl)',
                                color: 'var(--color-primary)',
                                fontWeight: 'var(--font-semibold)'
                            }}>
                                {item.title}
                            </h3>
                            <p style={{
                                color: 'var(--color-text-light)',
                                lineHeight: '1.7',
                                fontSize: 'var(--text-base)',
                                margin: 0
                            }}>
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Certifications Bar */}
                <div
                    className="reveal"
                    style={{
                        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--space-8) var(--space-10)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 'var(--space-6)',
                        boxShadow: 'var(--shadow-primary-lg)'
                    }}
                >
                    <div style={{ color: 'white' }}>
                        <h4 style={{
                            fontSize: 'var(--text-xl)',
                            fontWeight: 'var(--font-semibold)',
                            marginBottom: '4px'
                        }}>
                            Certified Excellence
                        </h4>
                        <p style={{
                            fontSize: 'var(--text-sm)',
                            opacity: 0.85,
                            margin: 0
                        }}>
                            Our products meet the highest industry standards
                        </p>
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: 'var(--space-4)',
                        flexWrap: 'wrap'
                    }}>
                        {certifications.map((cert, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 18px',
                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: 'var(--radius-full)',
                                    color: 'white',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 'var(--font-medium)',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}
                            >
                                <CheckCircle size={16} />
                                {cert}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Highlights;
