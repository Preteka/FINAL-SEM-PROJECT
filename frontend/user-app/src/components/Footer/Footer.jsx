import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import '../../index.css';

const Footer = () => {
    const socialIconStyle = {
        padding: '10px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'background-color 0.3s, transform 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const linkStyle = { color: '#ccc', marginBottom: '10px', display: 'block', transition: 'color 0.3s' };

    return (
        <footer style={{ backgroundColor: '#2c1e19', color: 'white', padding: '80px 0 30px' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '60px' }}>

                    {/* Brand Info */}
                    <div>
                        <h3 style={{ fontSize: '1.8rem', marginBottom: '20px', fontFamily: 'var(--font-family)' }}>
                            Vinayaga <span style={{ color: 'var(--color-accent)', fontSize: '1rem', fontWeight: 'normal' }}>Glass & Plywoods</span>
                        </h3>
                        <p style={{ color: '#aaa', marginBottom: '20px', lineHeight: '1.6' }}>
                            Your trusted partner for high-quality building materials, delivering excellence since 2005.
                        </p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            {[<Facebook size={20} />, <Instagram size={20} />, <Twitter size={20} />].map((icon, i) => (
                                <div
                                    key={i}
                                    style={{ ...socialIconStyle, border: '1px solid #444' }}
                                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-primary)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    {icon}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '25px', borderBottom: '2px solid var(--color-accent)', display: 'inline-block', paddingBottom: '5px' }}>Quick Links</h4>
                        <ul>
                            <li><a href="#" style={linkStyle} onMouseOver={(e) => e.target.style.color = 'var(--color-accent)'} onMouseOut={(e) => e.target.style.color = '#ccc'}>Home</a></li>
                            <li><a href="#" style={linkStyle} onMouseOver={(e) => e.target.style.color = 'var(--color-accent)'} onMouseOut={(e) => e.target.style.color = '#ccc'}>Products</a></li>
                            <li><a href="#" style={linkStyle} onMouseOver={(e) => e.target.style.color = 'var(--color-accent)'} onMouseOut={(e) => e.target.style.color = '#ccc'}>Cost Estimation</a></li>
                            <li><a href="#" style={linkStyle} onMouseOver={(e) => e.target.style.color = 'var(--color-accent)'} onMouseOut={(e) => e.target.style.color = '#ccc'}>Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '25px', borderBottom: '2px solid var(--color-accent)', display: 'inline-block', paddingBottom: '5px' }}>Contact Us</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: '#ccc' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <MapPin size={18} color="var(--color-accent)" />
                                <span>359/1-B K.Chettipalayam, Tiruppur-641604</span>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Phone size={18} color="var(--color-accent)" />
                                <span>9659027367</span>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Mail size={18} color="var(--color-accent)" />
                                <span>vinoth@gmail.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '25px', borderBottom: '2px solid var(--color-accent)', display: 'inline-block', paddingBottom: '5px' }}>Newsletter</h4>
                        <p style={{ color: '#aaa', marginBottom: '15px' }}>Subscribe for updates and exclusive offers.</p>
                        <form style={{ display: 'flex' }} onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Your Email"
                                style={{
                                    padding: '12px',
                                    width: '100%',
                                    border: 'none',
                                    borderRadius: '4px 0 0 4px',
                                    outline: 'none',
                                    backgroundColor: '#444',
                                    color: 'white'
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    padding: '12px 20px',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0 4px 4px 0',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
                            >
                                Go
                            </button>
                        </form>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #444', paddingTop: '20px', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                    &copy; {new Date().getFullYear()} Vinayaga Glass and Plywoods. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
