import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import "../../../index.css";

const Footer = () => {
    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '#about' },
        { name: 'Certifications', path: '#certifications' },
        { name: 'Products', path: '/products' },
        { name: 'Contact Us', path: '#contact' }
    ];

    const categories = [
        { name: 'Plywood', path: '/products/category/plywood' },
        { name: 'MDF', path: '/products/category/mdf' },
        { name: 'Particle Board', path: '/products/category/particle-board' },
        { name: 'Veneers', path: '/products/category/veneers' }
    ];

    const socialLinks = [
        { icon: <Facebook size={18} />, label: 'Facebook', url: '#' },
        { icon: <Instagram size={18} />, label: 'Instagram', url: '#' },
        { icon: <Twitter size={18} />, label: 'Twitter', url: '#' },
        { icon: <Linkedin size={18} />, label: 'LinkedIn', url: '#' }
    ];

    return (
        <footer style={{
            backgroundColor: 'var(--color-dark-bg)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Top accent line */}
            <div style={{
                height: '4px',
                background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 50%, var(--color-primary) 100%)'
            }}></div>



            {/* Main Footer Content */}
            <div className="container" style={{ padding: 'var(--space-20) 0' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 'var(--space-12)'
                }}>

                    {/* Brand Info */}
                    <div>
                        <div style={{
                            marginBottom: 'var(--space-6)'
                        }}>
                            <h3 style={{
                                fontSize: 'var(--text-2xl)',
                                fontWeight: 'var(--font-bold)',
                                marginBottom: '4px',
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: '8px'
                            }}>
                                <span style={{
                                    background: 'linear-gradient(135deg, #FFFFFF 0%, var(--color-accent) 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>Vinayaga</span>
                            </h3>
                            <span style={{
                                color: 'var(--color-accent)',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-normal)',
                                letterSpacing: 'var(--tracking-wide)'
                            }}>
                                Glass & Plywoods
                            </span>
                        </div>
                        <p style={{
                            color: 'rgba(255,255,255,0.6)',
                            marginBottom: 'var(--space-6)',
                            lineHeight: '1.8',
                            fontSize: 'var(--text-sm)'
                        }}>
                            Your trusted partner for high-quality building materials,
                            delivering excellence and premium quality since 2005.
                        </p>

                        {/* Social Links */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {socialLinks.map((item, i) => (
                                <a
                                    key={i}
                                    href={item.url}
                                    title={item.label}
                                    style={{
                                        width: '42px',
                                        height: '42px',
                                        backgroundColor: 'rgba(255,255,255,0.08)',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'var(--transition-smooth)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(93, 64, 55, 0.4)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{
                            fontSize: 'var(--text-base)',
                            marginBottom: 'var(--space-6)',
                            fontWeight: 'var(--font-semibold)',
                            color: 'white',
                            textTransform: 'uppercase',
                            letterSpacing: 'var(--tracking-wider)'
                        }}>
                            Quick Links
                        </h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {quickLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.path}
                                        style={{
                                            color: 'rgba(255,255,255,0.65)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'var(--transition)',
                                            fontSize: 'var(--text-sm)',
                                            textDecoration: 'none'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.color = 'var(--color-accent)';
                                            e.currentTarget.style.transform = 'translateX(6px)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        <ChevronRight size={14} style={{ opacity: 0.5 }} />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 style={{
                            fontSize: 'var(--text-base)',
                            marginBottom: 'var(--space-6)',
                            fontWeight: 'var(--font-semibold)',
                            color: 'white',
                            textTransform: 'uppercase',
                            letterSpacing: 'var(--tracking-wider)'
                        }}>
                            Categories
                        </h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {categories.map((cat, i) => (
                                <li key={i}>
                                    <Link
                                        to={cat.path}
                                        style={{
                                            color: 'rgba(255,255,255,0.65)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'var(--transition)',
                                            fontSize: 'var(--text-sm)',
                                            textDecoration: 'none'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.color = 'var(--color-accent)';
                                            e.currentTarget.style.transform = 'translateX(6px)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        <ChevronRight size={14} style={{ opacity: 0.5 }} />
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{
                            fontSize: 'var(--text-base)',
                            marginBottom: 'var(--space-6)',
                            fontWeight: 'var(--font-semibold)',
                            color: 'white',
                            textTransform: 'uppercase',
                            letterSpacing: 'var(--tracking-wider)'
                        }}>
                            Contact Us
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                            <div style={{
                                display: 'flex',
                                gap: '14px',
                                alignItems: 'flex-start'
                            }}>
                                <div style={{
                                    padding: '10px',
                                    background: 'linear-gradient(135deg, rgba(93, 64, 55, 0.4) 0%, rgba(93, 64, 55, 0.2) 100%)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-accent)',
                                    flexShrink: 0
                                }}>
                                    <MapPin size={18} />
                                </div>
                                <span style={{
                                    color: 'rgba(255,255,255,0.65)',
                                    fontSize: 'var(--text-sm)',
                                    lineHeight: '1.6'
                                }}>
                                    359/1-B K.Chettipalayam,<br />Tiruppur-641604
                                </span>
                            </div>
                            <div style={{
                                display: 'flex',
                                gap: '14px',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    padding: '10px',
                                    background: 'linear-gradient(135deg, rgba(93, 64, 55, 0.4) 0%, rgba(93, 64, 55, 0.2) 100%)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-accent)'
                                }}>
                                    <Phone size={18} />
                                </div>
                                <a
                                    href="tel:9659027367"
                                    style={{
                                        color: 'rgba(255,255,255,0.65)',
                                        fontSize: 'var(--text-sm)',
                                        textDecoration: 'none',
                                        transition: 'var(--transition)'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
                                    onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
                                >
                                    +91 96590 27367
                                </a>
                            </div>
                            <div style={{
                                display: 'flex',
                                gap: '14px',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    padding: '10px',
                                    background: 'linear-gradient(135deg, rgba(93, 64, 55, 0.4) 0%, rgba(93, 64, 55, 0.2) 100%)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-accent)'
                                }}>
                                    <Mail size={18} />
                                </div>
                                <a
                                    href="mailto:vinoth@gmail.com"
                                    style={{
                                        color: 'rgba(255,255,255,0.65)',
                                        fontSize: 'var(--text-sm)',
                                        textDecoration: 'none',
                                        transition: 'var(--transition)'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
                                    onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
                                >
                                    vinoth@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(0,0,0,0.2)'
            }}>
                <div className="container" style={{
                    padding: 'var(--space-6) 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 'var(--space-4)'
                }}>
                    <p style={{
                        color: 'rgba(255,255,255,0.45)',
                        fontSize: 'var(--text-sm)',
                        margin: 0
                    }}>
                        © {new Date().getFullYear()} Vinayaga Glass and Plywoods. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
                        {['Privacy Policy', 'Terms of Service'].map((link, i) => (
                            <a
                                key={i}
                                href="#"
                                style={{
                                    color: 'rgba(255,255,255,0.45)',
                                    fontSize: 'var(--text-sm)',
                                    transition: 'var(--transition)',
                                    textDecoration: 'none'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
                                onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
