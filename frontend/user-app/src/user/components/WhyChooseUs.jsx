import React from 'react';
import { ShieldCheck, Flame, Bug, Droplets, Zap, Award } from 'lucide-react';
import "../../index.css";

const WhyChooseUs = () => {
    const advantages = [
        { icon: <ShieldCheck size={40} strokeWidth={1.5} />, title: "Anti Virus" },
        { icon: <Flame size={40} strokeWidth={1.5} />, title: "Fire Retardant" },
        { icon: <Bug size={40} strokeWidth={1.5} />, title: "Borer Proof" },
        { icon: <Droplets size={40} strokeWidth={1.5} />, title: "Water Proof" },
        { icon: <Zap size={40} strokeWidth={1.5} />, title: "Termite Resistant" },
        { icon: <div style={{ fontSize: '24px', fontWeight: 'bold' }}>25+</div>, title: "Years Warranty" } // Custom text icon
    ];

    return (
        <section style={{
            backgroundColor: 'var(--color-primary)',
            padding: '40px 0',
            color: 'white'
        }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    gap: '30px'
                }}>
                    {advantages.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                gap: '12px',
                                opacity: 0.9,
                                transition: 'transform 0.3s ease'
                            }}
                            className="advantage-item"
                        >
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                border: '1px solid rgba(255,255,255,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(255,255,255,0.05)'
                            }}>
                                {item.icon}
                            </div>
                            <span style={{
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase'
                            }}>
                                {item.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .advantage-item:hover {
                    transform: translateY(-5px);
                    opacity: 1 !important;
                }
                .advantage-item:hover div {
                    background-color: rgba(255,255,255,0.15) !important;
                    border-color: rgba(255,255,255,0.5) !important;
                }
            `}</style>
        </section>
    );
};

export default WhyChooseUs;
