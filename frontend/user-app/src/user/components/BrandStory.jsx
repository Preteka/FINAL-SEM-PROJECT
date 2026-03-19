import React, { useRef, useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import "../../index.css";

const BrandStory = () => {
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15 });

        const elements = sectionRef.current?.querySelectorAll('.reveal-left, .reveal-right');
        elements?.forEach((el) => observer.observe(el));

        return () => elements?.forEach((el) => observer.unobserve(el));
    }, []);

    return (
        <section ref={sectionRef} className="section-austin" style={{ backgroundColor: 'white' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px', alignItems: 'center' }}>

                    {/* Content Side */}
                    <div className="reveal-left">
                        <span className="section-badge" style={{ marginBottom: '16px', display: 'inline-block' }}>Our Legacy</span>
                        <h2 className="section-heading" style={{ textAlign: 'left', marginBottom: '24px' }}>
                            Crafting Strength Since 2019
                        </h2>
                        <p className="section-desc" style={{ textAlign: 'left', maxWidth: '100%', marginBottom: '20px' }}>
                            At Vinayaga, we don't just manufacture plywood; we engineer trust. Our journey began with a simple vision: to provide the finest quality wood solutions that stand the test of time.
                        </p>
                        <p className="section-desc" style={{ textAlign: 'left', maxWidth: '100%', marginBottom: '32px' }}>
                            From sourcing the finest timber to employing state-of-the-art pressing technology, every sheet that leaves our facility is a masterpiece of durability and finish.
                        </p>

                        <div style={{ display: 'flex', gap: '40px' }}>
                            <div>
                                <h4 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-primary)', margin: 0 }}>5+</h4>
                                <p style={{ margin: 0, color: 'var(--color-text-light)' }}>Years of Excellence</p>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-primary)', margin: 0 }}>1k+</h4>
                                <p style={{ margin: 0, color: 'var(--color-text-light)' }}>Happy Homes</p>
                            </div>
                        </div>
                    </div>

                    {/* Image Side */}
                    <div className="reveal-right">
                        <div
                            style={{
                                borderRadius: 'var(--radius-xl)',
                                overflow: 'hidden',
                                boxShadow: '20px 20px 0px var(--color-surface)',
                            }}
                        >
                            <img
                                src="/images/shop.png"
                                alt="Vinayaga Shop"
                                style={{ width: '100%', height: '400px', objectFit: 'cover' }}

                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrandStory;
