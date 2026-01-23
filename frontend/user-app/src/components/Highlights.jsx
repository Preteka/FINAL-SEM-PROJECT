import React from 'react';
import { Database, Calculator, Activity, Truck } from 'lucide-react';
import '../index.css';

const Highlights = () => {
    const features = [
        {
            icon: <Database size={40} color="var(--color-accent)" />,
            title: "Smart Inventory",
            description: "Advanced management system for precise stock tracking."
        },
        {
            icon: <Calculator size={40} color="var(--color-accent)" />,
            title: "Cost Estimation",
            description: "Get accurate budget, standard, and premium project estimates."
        },
        {
            icon: <Activity size={40} color="var(--color-accent)" />,
            title: "Real-time Stock",
            description: "Check availability instantly before placing your order."
        },
        {
            icon: <Truck size={40} color="var(--color-accent)" />,
            title: "Easy Tracking",
            description: "Seamless order processing and delivery status updates."
        }
    ];

    return (
        <section style={{ padding: '100px 0', backgroundColor: 'var(--color-white)' }}>
            <div className="container">
                <div className="text-center mb-4">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--color-primary)' }}>Why Choose Us</h2>
                    <p style={{ color: 'var(--color-text-light)' }}>Industry-leading features for your convenience</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '40px'
                }}>
                    {features.map((item, index) => (
                        <div
                            key={index}
                            className="feature-card"
                            style={{
                                padding: '40px 30px',
                                backgroundColor: 'var(--color-background)',
                                borderRadius: '16px',
                                textAlign: 'center',
                                transition: 'var(--transition)',
                                border: '1px solid #eee'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                e.currentTarget.style.borderColor = 'var(--color-secondary)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = '#eee';
                            }}
                        >
                            <div style={{
                                marginBottom: '24px',
                                display: 'inline-flex',
                                padding: '16px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(212, 175, 55, 0.1)'
                            }}>
                                {item.icon}
                            </div>
                            <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', color: 'var(--color-primary)' }}>{item.title}</h3>
                            <p style={{ color: 'var(--color-text-light)', lineHeight: '1.6' }}>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Highlights;
