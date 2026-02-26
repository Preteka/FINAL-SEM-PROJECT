import React, { useRef, useEffect } from 'react';
import "../../index.css";

const Applications = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        const elements = sectionRef.current?.querySelectorAll('.reveal');
        elements?.forEach((el) => observer.observe(el));

        return () => elements?.forEach((el) => observer.unobserve(el));
    }, []);

    const applications = [
        {
            title: "Living Room",
            image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
            desc: "Elegant finishes for your main spaces"
        },
        {
            title: "Modular Kitchen",
            image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
            desc: "Water-resistant & durable solutions"
        },
        {
            title: "Office Space",
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
            desc: "Professional aesthetics for workspaces"
        },

    ];

    return (
        <section
            ref={sectionRef}
            className="section-austin"
            style={{
                backgroundColor: 'var(--color-surface)',
                paddingTop: 0 // Reduce top padding to connect better with previous section
            }}
        >
            <div className="container">
                <div className="section-header reveal">
                    <span className="section-badge">Applications</span>
                    <h2 className="section-heading">Curated for Every Space</h2>
                    <p className="section-desc">
                        Discover how our premium plywood transforms different areas of your home and office.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 'var(--space-6)'
                }}>
                    {applications.map((app, index) => (
                        <div
                            key={index}
                            className="reveal img-zoom premium-card"
                            style={{
                                position: 'relative',
                                height: '350px',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                transitionDelay: `${index * 0.1}s`,
                                cursor: 'pointer'
                            }}
                        >
                            <img
                                src={app.image}
                                alt={app.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.6s ease'
                                }}
                            />

                            {/* Overlay Gradient */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                height: '50%',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                padding: '24px'
                            }}>
                                <h3 style={{
                                    color: 'white',
                                    fontSize: 'var(--text-xl)',
                                    marginBottom: '4px',
                                    fontWeight: 'var(--font-semibold)'
                                }}>
                                    {app.title}
                                </h3>
                                <p style={{
                                    color: 'rgba(255,255,255,0.8)',
                                    fontSize: 'var(--text-sm)',
                                    margin: 0,
                                    transform: 'translateY(10px)',
                                    opacity: 0,
                                    transition: 'all 0.3s ease'
                                }} className="app-desc">
                                    {app.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            <style>{`
                .premium-card:hover .app-desc {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            `}</style>
        </section>
    );
};

export default Applications;
