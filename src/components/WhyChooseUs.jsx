import React, { useEffect, useRef } from 'react';
import '../index.css';
import { CheckCircle, Shield, Clock, Smile, DollarSign } from 'lucide-react';

const WhyChooseUs = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });

        const elements = sectionRef.current.querySelectorAll('.animate-item');
        elements.forEach((el) => observer.observe(el));

        return () => elements.forEach((el) => observer.unobserve(el));
    }, []);

    const features = [
        { text: "High-quality plywood materials", icon: <Shield size={22} color="var(--color-primary)" /> },
        { text: "Transparent pricing", icon: <DollarSign size={22} color="var(--color-primary)" /> },
        { text: "Faster order processing", icon: <Clock size={22} color="var(--color-primary)" /> },
        { text: "Customer-friendly experience", icon: <Smile size={22} color="var(--color-primary)" /> }
    ];

    return (
        <section ref={sectionRef} style={{ padding: '100px 0', backgroundColor: 'white' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: '60px' }}>
                <div className="animate-item" style={{ flex: '1 1 500px', opacity: 0, transform: 'translateX(-30px)', transition: 'all 0.8s ease' }}>
                    <div style={{ position: 'relative' }}>
                        <img
                            src="https://images.unsplash.com/photo-1549408929-4de79531e886?q=80&w=2670&auto=format&fit=crop"
                            alt="Quality Wood"
                            style={{
                                width: '100%',
                                borderRadius: '20px',
                                boxShadow: 'var(--shadow-lg)'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: '-20px',
                            right: '-20px',
                            backgroundColor: 'white',
                            padding: '30px',
                            borderRadius: '16px',
                            boxShadow: 'var(--shadow-lg)',
                            borderLeft: '5px solid var(--color-primary)'
                        }}>
                            <h4 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '2rem', fontWeight: 'bold' }}>25+</h4>
                            <p style={{ margin: 0, color: '#666' }}>Years of Excellence</p>
                        </div>
                    </div>
                </div>

                <div className="animate-item" style={{ flex: '1 1 400px', opacity: 0, transform: 'translateX(30px)', transition: 'all 0.8s ease', transitionDelay: '0.2s' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', color: 'var(--color-primary)' }}>Why Vinayaga Plywoods?</h2>
                    <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '40px', lineHeight: '1.8' }}>
                        We understand the importance of quality in construction. That's why we source only the finest materials
                        to ensure your projects stand the test of time.
                    </p>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {features.map((feature, index) => (
                            <li key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                fontSize: '1.15rem',
                                color: 'var(--color-text)',
                                padding: '10px',
                                borderRadius: '8px',
                                transition: 'background-color 0.3s'
                            }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <div style={{
                                    padding: '12px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--color-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {feature.icon}
                                </div>
                                {feature.text}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <style>{`
        .animate-item.visible {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
      `}</style>
        </section>
    );
};

export default WhyChooseUs;
