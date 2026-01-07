import React from 'react';
import '../index.css';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
    return (
        <section style={{
            padding: '100px 0',
            backgroundImage: 'linear-gradient(rgba(46, 139, 87, 0.9), rgba(46, 139, 87, 0.9)), url("https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2670")',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            textAlign: 'center',
            color: 'white'
        }}>
            <div className="container">
                <h2 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: 'bold' }}>Ready to start your project?</h2>
                <p style={{ fontSize: '1.3rem', marginBottom: '40px', opacity: 0.9 }}>Browse our full collection of premium Plywood & Glass today.</p>
                <button style={{
                    padding: '18px 40px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    backgroundColor: 'white',
                    color: 'var(--color-secondary)',
                    border: 'none',
                    borderRadius: '50px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.3s'
                }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    View Full Catalog <ArrowRight size={20} />
                </button>
            </div>
        </section>
    );
};

export default CallToAction;
