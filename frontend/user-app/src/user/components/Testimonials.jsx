import React from 'react';
import { Quote } from 'lucide-react';
import "../../index.css";

const Testimonials = () => {
    const testimonials = [
        {
            text: "Vinayaga Plywood has transformed our office space. The quality and finish are unmatched in the market.",
            name: "Rajesh Kumar",
            role: "Interior Designer"
        },
        {
            text: "I've been using their products for over 10 years. Consistent quality and excellent service every time.",
            name: "Anita Desai",
            role: "Architect"
        },
        {
            text: "The water-resistant plywood is a game changer for kitchen interiors. Highly recommended!",
            name: "Suresh Menon",
            role: "Contractor"
        },
        {
            text: "Premium finish at competitive prices. My clients are always happy with the end result.",
            name: "Vikram Singh",
            role: "Furniture Manufacturer"
        }
    ];

    return (
        <section className="section-austin" style={{ backgroundColor: 'var(--color-surface)' }}>
            <div className="container">
                <div className="section-header" style={{ marginBottom: '50px' }}>
                    <span className="section-badge">Testimonials</span>
                    <h2 className="section-heading">What Our Clients Say</h2>
                </div>

                <div className="testimonials-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '30px'
                }}>
                    {testimonials.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: 'white',
                                padding: '40px',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-sm)',
                                position: 'relative',
                                transition: 'transform 0.3s ease'
                            }}
                            className="testimonial-card"
                        >
                            <Quote size={40} color="var(--color-primary-light)" style={{ opacity: 0.3, marginBottom: '20px' }} />
                            <p style={{
                                fontSize: '1.1rem',
                                fontStyle: 'italic',
                                lineHeight: '1.6',
                                color: 'var(--color-text)',
                                marginBottom: '24px'
                            }}>
                                "{item.text}"
                            </p>
                            <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '20px' }}>
                                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{item.name}</h4>
                                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>{item.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .testimonial-card:hover {
                    transfrom: translateY(-10px);
                    box-shadow: var(--shadow-md);
                }
            `}</style>
        </section>
    );
};

export default Testimonials;
