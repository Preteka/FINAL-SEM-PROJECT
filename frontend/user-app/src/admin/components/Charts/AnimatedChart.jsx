import React, { useState, useEffect } from 'react';

const AnimatedChart = ({ title, type, data }) => {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 300);
        return () => clearTimeout(timer);
    }, []);

    if (type === 'Bar') {
        // Default monthly data if none provided
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const values = data || [12, 19, 15, 25, 22, 30];
        const maxValue = Math.max(...values);

        return (
            <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginBottom: '1.5rem',
                flex: 1,
                minWidth: '300px'
            }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', color: '#64748b', fontWeight: '600' }}>{title}</h3>
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '1rem',
                    height: '200px',
                    padding: '1rem 0'
                }}>
                    {values.map((value, index) => {
                        const height = (value / maxValue) * 160;
                        return (
                            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <div
                                    style={{
                                        width: '100%',
                                        height: animated ? `${height}px` : '0px',
                                        background: 'linear-gradient(180deg, #3b82f6, #60a5fa)',
                                        borderRadius: '4px 4px 0 0',
                                        transition: `height 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
                                        position: 'relative'
                                    }}
                                >
                                    <span style={{
                                        position: 'absolute',
                                        top: '-20px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        color: '#64748b',
                                        opacity: animated ? 1 : 0,
                                        transition: `opacity 0.5s ease ${index * 0.1 + 0.5}s`
                                    }}>
                                        {value}
                                    </span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>{months[index]}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (type === 'Pie') {
        // Default category data if none provided
        const categories = data || [
            { name: 'Plywood', value: 40, color: '#3b82f6' },
            { name: 'MDF', value: 25, color: '#8b5cf6' },
            { name: 'Doors', value: 20, color: '#10b981' },
            { name: 'Others', value: 15, color: '#f59e0b' }
        ];

        return (
            <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginBottom: '1.5rem',
                flex: 1,
                minWidth: '300px'
            }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', color: '#64748b', fontWeight: '600' }}>{title}</h3>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                            width: '160px',
                            height: '160px',
                            borderRadius: '50%',
                            background: `conic-gradient(
                                ${categories[0].color} 0% ${categories[0].value}%,
                                ${categories[1].color} ${categories[0].value}% ${categories[0].value + categories[1].value}%,
                                ${categories[2].color} ${categories[0].value + categories[1].value}% ${categories[0].value + categories[1].value + categories[2].value}%,
                                ${categories[3].color} ${categories[0].value + categories[1].value + categories[2].value}% 100%
                            )`,
                            transform: animated ? 'scale(1) rotate(360deg)' : 'scale(0.8) rotate(0deg)',
                            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {categories.map((cat, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    opacity: animated ? 1 : 0,
                                    transform: animated ? 'translateX(0)' : 'translateX(20px)',
                                    transition: `all 0.5s ease ${index * 0.15 + 0.5}s`
                                }}
                            >
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '2px',
                                    backgroundColor: cat.color
                                }}></div>
                                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                    {cat.name} <span style={{ fontWeight: '600', color: '#1e293b' }}>({cat.value}%)</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default AnimatedChart;
