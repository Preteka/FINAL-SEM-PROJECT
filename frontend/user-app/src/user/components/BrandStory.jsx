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

                    {/* Video/Image Side */}
                    <div className="reveal-right" style={{ position: 'relative' }}>
                        <div
                            style={{
                                position: 'relative',
                                borderRadius: 'var(--radius-xl)',
                                overflow: 'hidden',
                                boxShadow: '20px 20px 0px var(--color-surface)',
                                cursor: 'pointer'
                            }}
                            onClick={() => setIsVideoOpen(true)}
                            className="video-thumbnail"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80"
                                alt="Factory Tour"
                                style={{ width: '100%', height: '400px', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                width: '100%',
                                height: '100%',
                                background: 'rgba(0,0,0,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div className="play-btn-pulse">
                                    <Play fill="white" size={32} style={{ marginLeft: '4px' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Modal Overlay */}
            {isVideoOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px'
                }} onClick={() => setIsVideoOpen(false)}>
                    <button
                        style={{
                            position: 'absolute',
                            top: '30px',
                            right: '30px',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                        onClick={() => setIsVideoOpen(false)}
                    >
                        <X size={40} />
                    </button>

                    <div style={{ width: '100%', maxWidth: '900px', aspectRatio: '16/9', background: 'black' }} onClick={(e) => e.stopPropagation()}>
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                            title="Brand Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            <style>{`
                .video-thumbnail:hover img {
                    transform: scale(1.05);
                }
                .play-btn-pulse {
                    width: 80px;
                    height: 80px;
                    background-color: var(--color-primary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    box-shadow: 0 0 0 0 rgba(93, 64, 55, 0.7);
                    animation: pulse 2s infinite;
                    transition: transform 0.3s ease;
                }
                .video-thumbnail:hover .play-btn-pulse {
                    transform: scale(1.1);
                    background-color: white;
                    color: var(--color-primary);
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(93, 64, 55, 0.7); }
                    70% { box-shadow: 0 0 0 20px rgba(93, 64, 55, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(93, 64, 55, 0); }
                }
            `}</style>
        </section>
    );
};

export default BrandStory;
