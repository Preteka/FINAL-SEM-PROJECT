import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../index.css';

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState('Plywood');
  const [loggingOut, setLoggingOut] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    backgroundColor: isScrolled || activeDropdown ? 'rgba(255, 255, 255, 1)' : 'transparent',
    boxShadow: isScrolled || activeDropdown ? 'var(--shadow-md)' : 'none',
    transition: 'all 0.4s ease',
    padding: isScrolled ? '15px 0' : '25px 0',
    color: isScrolled || activeDropdown ? 'var(--color-text)' : 'var(--color-primary)',
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '#products', hasDropdown: true },
    { name: 'Cost Estimation', path: '/cost-estimation' },
    { name: 'Orders', path: '#orders' },
    { name: 'Contact', path: '#contact' },
  ];

  const megaMenuData = {
    categories: [
      { name: 'Plywood', image: 'https://images.unsplash.com/photo-1549408929-4de79531e886?auto=format&fit=crop&w=400&q=80' },
      { name: 'MDF', image: 'https://images.unsplash.com/photo-1610484735398-4c653063f68d?auto=format&fit=crop&w=400&q=80' },
      { name: 'Particle Board', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80' },
      { name: 'Mica & Lamination Sheets', image: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&w=400&q=80' },
      { name: 'PVC & uPVC', image: 'https://images.unsplash.com/photo-1597072689227-8882273e8f6d?auto=format&fit=crop&w=400&q=80' },
      { name: 'Veneers', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80' },
      { name: 'Glass', image: 'https://images.unsplash.com/photo-1504198322253-cfa87a0ff25f?auto=format&fit=crop&w=400&q=80' },
      { name: 'Handles & Locks', image: 'https://images.unsplash.com/photo-1558002038-1091a1661116?auto=format&fit=crop&w=400&q=80' },
      { name: 'Glue & Nuts', image: 'https://images.unsplash.com/photo-1626806749750-294d6cc12586?auto=format&fit=crop&w=400&q=80' },
      { name: 'Doors', image: 'https://images.unsplash.com/photo-1517581177697-00e27745ac17?auto=format&fit=crop&w=400&q=80' }
    ],
    brands: [
      'Greenply', 'Century Ply', 'Kitply', 'Action Tesa', 'Merino'
    ],
    features: [
      'Water Proof', 'Fire Resistance', 'Sun / Weather Resistance', 'Pest and Fungal Resistance'
    ]
  };

  // Helper to format URL
  const formatUrl = (type, value) => {
    return `/products/${type}/${value.toLowerCase().replace(/ \/ /g, '-').replace(/ & /g, '-').replace(/ /g, '-')}`;
  };

  const currentCategoryObj = megaMenuData.categories.find(c => c.name === hoveredCategory) || megaMenuData.categories[0];

  return (
    <header style={headerStyle} onMouseLeave={() => setActiveDropdown(null)}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1001 }}>
            <span style={{
              color: isScrolled || activeDropdown ? 'var(--color-primary)' : 'var(--color-white)',
              transition: 'color 0.3s',
              textShadow: isScrolled || activeDropdown ? 'none' : '0 1px 3px rgba(0,0,0,0.3)'
            }}>Vinayaga</span>
            <span style={{
              fontWeight: 'normal',
              fontSize: '1.1rem',
              color: isScrolled || activeDropdown ? 'var(--color-text-light)' : 'rgba(255,255,255,0.8)',
              transition: 'color 0.3s'
            }}>Glass & Plywoods</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {navLinks.map((link) => (
            <div
              key={link.name}
              style={{ position: 'relative', padding: '10px 0' }}
              onMouseEnter={() => link.hasDropdown ? setActiveDropdown('Products') : setActiveDropdown(null)}
            >
              <Link
                to={link.path}
                className="nav-link"
                style={{
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  color: isScrolled || activeDropdown ? 'var(--color-text)' : 'var(--color-white)',
                  textShadow: isScrolled || activeDropdown ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                  transition: 'color 0.3s ease',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
              >
                {link.name}
              </Link>
            </div>
          ))}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Link to="/profile" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: isScrolled || activeDropdown ? 'var(--color-text)' : 'var(--color-white)',
                transition: 'color 0.3s ease',
                textDecoration: 'none'
              }}>
                <User size={18} />
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{user.displayName || user.name || 'User'}</span>
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="btn btn-outline"
                style={{
                  padding: '6px 15px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  borderColor: isScrolled || activeDropdown ? 'var(--color-primary)' : 'var(--color-white)',
                  color: isScrolled || activeDropdown ? 'var(--color-primary)' : 'var(--color-white)',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                {loggingOut ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{
              padding: '8px 20px',
              fontSize: '0.9rem',
              backgroundColor: isScrolled || activeDropdown ? 'var(--color-primary)' : 'var(--color-white)',
              color: isScrolled || activeDropdown ? 'var(--color-white)' : 'var(--color-primary)',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              Login / Register
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="mobile-toggle" style={{
          display: 'none',
          color: isScrolled || activeDropdown ? 'var(--color-text)' : 'var(--color-white)'
        }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>

      {/* Mega Menu Overlay */}
      <div
        className={`mega-menu ${activeDropdown === 'Products' ? 'active' : ''}`}
        onMouseEnter={() => setActiveDropdown('Products')}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="container">
          <div className="mega-menu-content">

            {/* Categories */}
            <div className="mega-column categories-list">
              <h3>Categories</h3>
              <ul>
                {megaMenuData.categories.map((item, index) => (
                  <li key={index} onMouseEnter={() => setHoveredCategory(item.name)}>
                    <Link
                      to={formatUrl('category', item.name)}
                      onClick={() => setActiveDropdown(null)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                      {/* Icon placeholder if needed, using text for now */}
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brands */}
            <div className="mega-column">
              <h3>Brands</h3>
              <ul>
                {megaMenuData.brands.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={formatUrl('brand', item)}
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Speciality Features */}
            <div className="mega-column">
              <h3>Features</h3>
              <ul>
                {megaMenuData.features.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={formatUrl('features', item)}
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Featured Image */}
            <div className="mega-column image-column">
              <div className="menu-image-card">
                <img src={currentCategoryObj.image} alt={currentCategoryObj.name} key={currentCategoryObj.name} className="fade-img" />
                <div className="image-overlay">
                  <h4>{currentCategoryObj.name}</h4>
                  <p>Explore Collection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="container">
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px 0' }}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--color-text)' }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <hr style={{ borderColor: '#eee' }} />
            {/* Mobile simplified sub-menu could go here, omitting for brevity to focus on mega menu */}
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={20} color="var(--color-primary)" />
                  <span style={{ fontWeight: '500' }}>{user.displayName || user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-primary"
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary"
                style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login / Register
              </Link>
            )}
          </ul>
        </div>
      </div>

      <style>{`
        .mega-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background-color: #ffffff;
          border-top: 1px solid #eee;
          box-shadow: 0 15px 40px rgba(0,0,0,0.1);
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.3s ease;
          z-index: 999;
          padding: 40px 0;
        }

        .mega-menu.active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .mega-menu-content {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 1.5fr;
          gap: 40px;
        }

        .mega-column h3 {
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--color-text-light);
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }

        .mega-column ul {
          list-style: none;
          padding: 0;
        }

        .mega-column ul li {
          margin-bottom: 8px;
        }

        .mega-column ul li a {
          text-decoration: none;
          color: var(--color-text);
          font-size: 0.95rem;
          transition: all 0.2s;
          display: block;
          padding: 6px 10px;
          border-radius: 6px;
        }

        .mega-column ul li a:hover {
          color: var(--color-primary);
          background-color: #f5f5f5;
          transform: translateX(5px);
        }
        
        /* Categories specific styling */
        .categories-list ul li a {
             font-weight: 500;
        }

        .menu-image-card {
          width: 100%;
          height: 300px;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          box-shadow: var(--shadow-md);
        }

        .menu-image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        
        .fade-img {
            animation: fadeIn 0.4s ease-in-out;
        }

        .menu-image-card:hover img {
          transform: scale(1.05);
        }
        
        .image-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 20px;
            background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
            color: white;
        }
        
        .image-overlay h4 {
            margin: 0;
            font-size: 1.2rem;
        }
        
        .image-overlay p {
            margin: 5px 0 0;
            font-size: 0.9rem;
            opacity: 0.9;
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background-color: var(--color-white);
          box-shadow: var(--shadow-lg);
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease-in-out;
        }
        .mobile-menu.open {
          max-height: 400px;
        }
        
        @keyframes fadeIn {
            from { opacity: 0.5; }
            to { opacity: 1; }
        }
        
        @media (max-width: 900px) {
            .mega-menu { display: none; } /* Simplified for mobile */
        }
        
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; cursor: pointer; }
        }
        
        .nav-link:hover {
          color: var(--color-accent) !important;
          opacity: 1 !important;
        }
      `}</style>
    </header>
  );
};

export default Header;
