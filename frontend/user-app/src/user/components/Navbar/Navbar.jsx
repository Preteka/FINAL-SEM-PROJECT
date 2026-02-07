// HMR Force Update - Context paths fixed
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Loader2, ShoppingCart, ChevronDown } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import { useCart } from '../../../shared/context/CartContext';
import '../../../index.css';

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState('Plywood');
  const [loggingOut, setLoggingOut] = useState(false);

  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef(null);

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '#products', hasDropdown: true },
    { name: 'Cost Estimation', path: '/cost-estimation' },
    { name: 'Orders', path: '/orders' },
    { name: 'Contact', path: '#contact' },
  ];

  const megaMenuData = {
    categories: [
      { name: 'Plywood', image: '/images/PLYWOOD.png' },
      { name: 'MDF', image: '/images/MDF.png' },
      { name: 'Particle Board', image: '/images/PARCITLE.png' },
      { name: 'Mica & Lamination', image: '/images/MICA.png' },
      { name: 'PVC & uPVC', image: '/images/PVC.png' },
      { name: 'Veneers', image: '/images/VENEERS.png' },
      { name: 'Glass', image: '/images/GLASS.png' },
      { name: 'Handles & Locks', image: '/images/LOCK.png' },
      { name: 'Glue & Nuts', image: '/images/GLUE.png' },
      { name: 'Doors', image: '/images/DOOR.png' }
    ],
    brands: [
      'Greenply', 'Century Ply', 'Kitply', 'Action Tesa', 'Merino'
    ],
    features: [
      'Water Proof', 'Fire Resistance', 'Sun / Weather Resistance', 'Pest and Fungal Resistance'
    ]
  };

  const formatUrl = (type, value) => {
    return `/products/${type}/${value.toLowerCase().replace(/ \/ /g, '-').replace(/ & /g, '').replace(/\s+/g, '-')}`;
  };

  const currentCategoryObj = megaMenuData.categories.find(c => c.name === hoveredCategory) || megaMenuData.categories[0];

  const isNotHome = location.pathname !== '/';
  const shouldBeScrolled = isScrolled || activeDropdown || isNotHome;

  return (
    <header ref={headerRef} className={`navbar ${shouldBeScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1001 }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            backgroundImage: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary-dark) 100%)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            V
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              color: shouldBeScrolled ? 'var(--color-primary)' : 'white',
              transition: 'var(--transition)',
              fontWeight: 'var(--font-bold)',
              fontSize: '1.25rem',
              lineHeight: 1,
              letterSpacing: '-0.02em'
            }}>Vinayaga</span>
            <span style={{
              color: shouldBeScrolled ? 'var(--color-text-light)' : 'rgba(255,255,255,0.7)',
              transition: 'var(--transition)',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>Glass & Plywoods</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="nav-item"
            >
              {link.hasDropdown ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === 'Products' ? null : 'Products');
                  }}
                  className={`nav-link ${activeDropdown === 'Products' ? 'active' : ''} ${shouldBeScrolled ? 'text-dark' : 'text-light'}`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
                >
                  {link.name} <ChevronDown size={14} style={{ marginLeft: '4px', transform: activeDropdown === 'Products' ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
                </button>
              ) : (
                <Link
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''} ${shouldBeScrolled ? 'text-dark' : 'text-light'}`}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}

          <div style={{ width: '1px', height: '24px', backgroundColor: shouldBeScrolled ? 'var(--color-border)' : 'rgba(255,255,255,0.2)', margin: '0 10px' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link to="/cart" className={`icon-link ${shouldBeScrolled ? 'text-dark' : 'text-light'}`}>
              <ShoppingCart size={22} />
              {getItemCount() > 0 && (
                <span className="badge-count">
                  {getItemCount()}
                </span>
              )}
            </Link>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link to="/profile" className="profile-btn">
                  {(user.displayName || user.name || 'U').charAt(0).toUpperCase()}
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className={`btn-logout ${shouldBeScrolled ? 'text-dark' : 'text-light'}`}
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-sm btn-primary" style={{ padding: '8px 20px', borderRadius: 'var(--radius-full)' }}>
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <div
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            color: shouldBeScrolled || isMobileMenuOpen ? 'var(--color-primary)' : 'white',
            zIndex: 1002,
            cursor: 'pointer'
          }}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>

      {/* Mega Menu Overlay */}
      <div
        className={`mega-menu ${activeDropdown === 'Products' ? 'active' : ''}`}
      >
        <div className="container">
          <div className="mega-menu-content">
            <div className="mega-column">
              <h3>Categories</h3>
              <ul className="category-links">
                {megaMenuData.categories.map((item, index) => (
                  <li key={index} onMouseEnter={() => setHoveredCategory(item.name)}>
                    <Link to={formatUrl('category', item.name)}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mega-column">
              <h3>Our Brands</h3>
              <ul>
                {megaMenuData.brands.map((item, index) => (
                  <li key={index}>
                    <Link to={formatUrl('brand', item)}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mega-column">
              <h3>Key Features</h3>
              <ul>
                {megaMenuData.features.map((item, index) => (
                  <li key={index}>
                    <Link to={formatUrl('features', item)}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mega-column" style={{ gridColumn: 'span 1.5' }}>
              <div className="menu-image-card">
                <img src={currentCategoryObj.image} alt={currentCategoryObj.name} key={currentCategoryObj.name} className="fade-img" />
                <div className="image-overlay">
                  <h4>{currentCategoryObj.name}</h4>
                  <p>Explore our premium collection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="container" style={{ paddingBottom: '100px', overflowY: 'auto', maxHeight: '100vh' }}>
          <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
            {navLinks.map((link) => (
              <li key={link.name} style={{ marginBottom: '24px' }}>
                {link.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === 'Products' ? null : 'Products')}
                      className="btn-text"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '10px', fontSize: '1.5rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      {link.name} <ChevronDown size={20} style={{ transform: activeDropdown === 'Products' ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
                    </button>
                    {activeDropdown === 'Products' && (
                      <div className="mobile-categories" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {megaMenuData.categories.map((cat, idx) => (
                          <Link
                            key={idx}
                            to={formatUrl('category', cat.name)}
                            onClick={() => setIsMobileMenuOpen(false)}
                            style={{ fontSize: '1.1rem', opacity: 0.8, textDecoration: 'none', color: 'var(--color-text)' }}
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ textDecoration: 'none', color: 'var(--color-text)', fontSize: '1.5rem', fontWeight: 600 }}
                  >
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
            <li className="separator" style={{ margin: '20px 0', height: '1px', backgroundColor: 'var(--color-border-light)', listStyle: 'none' }}></li>
            {user ? (
              <>
                <li style={{ marginBottom: '24px' }}><Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-text)', fontSize: '1.5rem', fontWeight: 600 }}>Profile</Link></li>
                <li style={{ marginBottom: '24px' }}><button onClick={handleLogout} className="btn-text" style={{ fontSize: '1.5rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button></li>
              </>
            ) : (
              <li style={{ marginBottom: '24px' }}><Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-text)', fontSize: '1.5rem', fontWeight: 600 }}>Login / Register</Link></li>
            )}
          </ul>
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 90px;
          z-index: 1000;
          background-color: transparent;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar-scrolled {
          background-color: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          box-shadow: var(--shadow-glass);
          height: 70px;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          display: flex;
          align-items: center;
          transition: var(--transition);
          position: relative;
          padding: 8px 0;
        }

        .nav-link.text-light { color: rgba(255,255,255,0.9); }
        .nav-link.text-light:hover { color: white; }
        
        .nav-link.text-dark { color: var(--color-text); }
        .nav-link.text-dark:hover { color: var(--color-primary); }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--color-primary);
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .icon-link {
          position: relative;
          transition: var(--transition);
          display: flex;
          align-items: center;
        }
        .icon-link.text-light { color: white; }
        .icon-link.text-dark { color: var(--color-text); }
        .icon-link:hover { color: var(--color-primary); transform: translateY(-2px); }

        .badge-count {
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: var(--color-primary);
          color: white;
          font-size: 10px;
          font-weight: bold;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }

        .profile-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          text-decoration: none;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
        }

        .profile-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .btn-logout {
          background: none;
          border: none;
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-logout.text-light { color: rgba(255,255,255,0.8); }
        .btn-logout.text-dark { color: var(--color-text-light); }
        .btn-logout:hover { color: var(--color-error); }

        .mega-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background-color: white;
          border-top: 1px solid var(--color-border-light);
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          padding: 40px 0;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 999;
        }

        .mega-menu.active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .mega-menu-content {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1.5fr;
          gap: 40px;
        }

        .mega-column h3 {
          font-size: var(--text-sm);
          font-weight: var(--font-bold);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wider);
          color: var(--color-primary);
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--color-border-light);
        }

        .mega-column ul {
          list-style: none;
          padding: 0;
        }

        .mega-column li {
          margin-bottom: 8px;
        }

        .mega-column a {
          text-decoration: none;
          color: var(--color-text);
          font-size: 0.95rem;
          transition: var(--transition);
          display: block;
          padding: 6px 10px;
          border-radius: var(--radius-sm);
        }

        .mega-column a:hover {
          color: var(--color-primary);
          background-color: var(--color-wood-light);
          transform: translateX(4px);
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: white;
          z-index: 999;
          padding-top: 100px;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-menu.open {
          transform: translateX(0);
        }

        .menu-image-card {
            border-radius: var(--radius-lg);
            overflow: hidden;
            height: 250px;
            position: relative;
            box-shadow: var(--shadow-md);
        }
        
        .menu-image-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
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
        
        .image-overlay h4 { margin: 0; font-size: 1.2rem; }
        .image-overlay p { margin: 5px 0 0; font-size: 0.9rem; opacity: 0.9; }

        @media (max-width: 900px) {
          .desktop-nav { display: none; }
          .mobile-toggle { display: block; }
          .mega-menu { display: none; }
        }
        
        @media (min-width: 901px) {
          .mobile-toggle { display: none; }
          .mobile-menu { display: none; }
        }
      `}</style>
    </header>
  );
};

export default Header;
