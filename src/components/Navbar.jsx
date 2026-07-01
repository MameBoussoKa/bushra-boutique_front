import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Search, ShoppingCart, X, Home, LayoutGrid, User } from 'lucide-react';
import './Navbar.css';
import TransparentLogo from './TransparentLogo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { count } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled && !menuOpen;

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produits?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/collections', label: 'Collections' },
    { to: '/a-propos', label: 'À propos' },
    { to: '/contact', label: 'Contact' },
  ];

  const bottomNavLinks = [
    { to: '/', label: 'Accueil', icon: 'home' },
    { to: '/collections', label: 'Collections', icon: 'grid' },
    { to: '/panier', label: 'Panier', icon: 'cart' },
    { to: '/compte', label: 'Compte', icon: 'user' },
  ];

  return (
    <>
      <nav className={`navbar ${isTransparent ? 'navbar--transparent' : 'navbar--solid'} ${menuOpen ? 'navbar--open' : ''}`}>
        <div className="navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo" aria-label="Bushra Machallah — Accueil">
            <TransparentLogo
              src="/logo.png"
              alt="Bushra Machallah"
              className="navbar__logo-img"
              tolerance={50}
              width={80}
              height={80}
            />
          </Link>

          {/* Nav links - desktop */}
          <ul className="navbar__links">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`navbar__link ${location.pathname === link.to ? 'navbar__link--active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="navbar__actions">
            <button
              className="navbar__action-btn navbar__search-btn"
              onClick={() => setSearchOpen(s => !s)}
              aria-label="Rechercher"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            <Link to="/panier" className="navbar__action-btn navbar__cart-btn" aria-label={`Panier (${count} articles)`}>
              <ShoppingCart size={20} strokeWidth={1.5} />
              {count > 0 && <span className="navbar__cart-count">{count}</span>}
            </Link>

            <Link to="/commande/suivi" className="navbar__cta">
              Suivre ma commande
            </Link>

            {/* Mobile hamburger - caché sur mobile avec bottom nav */}
            <button
              className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
              onClick={() => setMenuOpen(s => !s)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className={`navbar__search ${searchOpen ? 'navbar__search--open' : ''}`}>
          <form onSubmit={handleSearch} className="navbar__search-form">
            <input
              ref={searchRef}
              type="text"
              placeholder="Rechercher encens, senteurs, encensoirs…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="navbar__search-input"
            />
            <button type="submit" className="navbar__search-submit">
              Rechercher
            </button>
            <button type="button" onClick={() => setSearchOpen(false)} className="navbar__search-close">
              <X size={18} strokeWidth={2} />
            </button>
          </form>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        <ul className="mobile-menu__links">
          {navLinks.map((link, i) => (
            <li key={link.to} style={{ animationDelay: `${i * 60}ms` }}>
              <Link
                to={link.to}
                className={`mobile-menu__link ${location.pathname === link.to ? 'mobile-menu__link--active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/panier" className="mobile-menu__link">
              Panier {count > 0 && <span className="mobile-menu__badge">{count}</span>}
            </Link>
          </li>
        </ul>
        <div className="mobile-menu__footer">
          <Link to="/commande/suivi" className="btn btn--primary btn--full">
            Suivre ma commande
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="navbar__overlay" onClick={() => setMenuOpen(false)} />}

      {/* Bottom Navigation Mobile */}
      <nav className="bottom-nav">
        {bottomNavLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`bottom-nav__link ${location.pathname === link.to ? 'bottom-nav__link--active' : ''}`}
          >
            <span className="bottom-nav__icon">
              {link.icon === 'home' && <Home size={24} strokeWidth={1.5} />}
              {link.icon === 'grid' && <LayoutGrid size={24} strokeWidth={1.5} />}
              {link.icon === 'cart' && <ShoppingCart size={24} strokeWidth={1.5} />}
              {link.icon === 'user' && <User size={24} strokeWidth={1.5} />}
            </span>
            <span className="bottom-nav__label">{link.label}</span>
            {link.icon === 'cart' && count > 0 && (
              <span className="bottom-nav__badge">{count}</span>
            )}
          </Link>
        ))}
      </nav>
    </>
  );
}
