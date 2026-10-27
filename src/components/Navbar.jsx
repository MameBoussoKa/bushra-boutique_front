import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Search, ShoppingBag, X, Menu, User, Sparkles, Home, Grid, Phone, ChevronRight } from 'lucide-react';
import './Navbar.css';
import TransparentLogo from './TransparentLogo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [badgeAnimated, setBadgeAnimated] = useState(false);

  const { count, openDrawer } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const prevCountRef = useRef(count);

  // Scroll detection for transparent -> frosted glass
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Animate cart badge when count changes
  useEffect(() => {
    if (count !== prevCountRef.current) {
      setBadgeAnimated(true);
      const timer = setTimeout(() => setBadgeAnimated(false), 500);
      prevCountRef.current = count;
      return () => clearTimeout(timer);
    }
  }, [count]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  const isHome = location.pathname === '/';
  const isNavbarTransparent = isHome && !scrolled && !mobileMenuOpen;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produits?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/produits', label: 'Boutique' },
    { to: '/collections', label: 'Catégories' },
    { to: '/produits?sort=newest', label: 'Nouveautés', badge: 'New' },
    { to: '/a-propos', label: 'À propos' },
    { to: '/contact', label: 'Contact' },
  ];

  const bottomNavItems = [
    { to: '/', label: 'Accueil', icon: Home },
    { to: '/produits', label: 'Boutique', icon: Grid },
    { to: '#cart', label: 'Panier', icon: ShoppingBag, isCart: true },
    { to: '/compte', label: 'Compte', icon: User },
  ];

  return (
    <>
      <header className={`navbar ${isHome ? 'navbar--home' : ''} ${isNavbarTransparent ? 'navbar--transparent' : 'navbar--scrolled'} ${mobileMenuOpen ? 'navbar--menu-open' : ''}`}>
        {isHome && (
          <div className="navbar__announcement" aria-label="Informations de livraison">
            <button type="button" className="navbar__announcement-arrow" aria-label="Précédent">&lt;</button>
            <span className="navbar__announcement-text">
              Livraison offerte dès 25 000 FCFA | Retours 30 jours | Paiement à la livraison Wave & Orange Money
            </span>
            <button type="button" className="navbar__announcement-arrow" aria-label="Suivant">&gt;</button>
          </div>
        )}
        <div className="container navbar__inner">
          {/* Mobile hamburger button */}
          <button
            className="navbar__mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="navbar__logo" aria-label="Bushra Machallah — Page d'accueil">
            <TransparentLogo
              src="/logo.png"
              alt="Bushra Machallah"
              className="navbar__logo-img"
              width={64}
              height={64}
              tolerance={50}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="navbar__nav" aria-label="Navigation principale">
            <ul className="navbar__links">
              {navLinks.map((link) => {
                const isActive =
                  location.pathname === link.to ||
                  (link.to.includes('?') && location.search.includes('newest'));

                return (
                  <li key={link.label} className="navbar__link-item">
                    <Link
                      to={link.to}
                      className={`navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                    >
                      {link.label}
                      {link.badge && (
                        <span className="navbar__link-badge">{link.badge}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Action Buttons */}
          <div className="navbar__actions">
            {/* Search Trigger */}
            <button
              className="navbar__action-btn navbar__search-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Ouvrir la recherche"
            >
              <Search size={20} strokeWidth={1.75} />
            </button>

            {/* Account link */}
            <Link
              to="/compte"
              className="navbar__action-btn navbar__account-btn"
              aria-label="Mon compte"
            >
              <User size={20} strokeWidth={1.75} />
            </Link>

            {/* Cart Trigger with dynamic badge */}
            <button
              className={`navbar__action-btn navbar__cart-btn navbar__cart-btn--pill ${badgeAnimated ? 'navbar__cart-btn--bounce' : ''}`}
              onClick={openDrawer}
              aria-label={`Panier (${count} articles)`}
            >
              <ShoppingBag size={18} strokeWidth={1.8} />
              <span className="navbar__cart-label">Cart</span>
              <span className={`navbar__cart-badge ${badgeAnimated ? 'navbar__cart-badge--pop' : ''}`}>
                {count}
              </span>
            </button>

          </div>
        </div>

        {/* Expandable Search Drawer */}
        <div className={`navbar-search-bar ${searchOpen ? 'navbar-search-bar--open' : ''}`}>
          <div className="container navbar-search-bar__inner">
            <form onSubmit={handleSearchSubmit} className="navbar-search-bar__form">
              <Search size={20} className="navbar-search-bar__icon" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un encensoir, un thiouraye, un gowé, un spray..."
                className="navbar-search-bar__input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="navbar-search-bar__clear"
                >
                  <X size={16} />
                </button>
              )}
              <button type="submit" className="btn btn--primary btn--sm navbar-search-bar__submit">
                Rechercher
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="navbar-search-bar__close"
                aria-label="Fermer la recherche"
              >
                <X size={20} />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'mobile-nav--open' : ''}`}>
        <div className="mobile-nav__backdrop" onClick={() => setMobileMenuOpen(false)} />
        <div className="mobile-nav__panel">
          <div className="mobile-nav__header">
            <div className="mobile-nav__logo">
              <TransparentLogo
                src="/logo.png"
                alt="Bushra Machallah"
                width={56}
                height={56}
                tolerance={50}
              />
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav__close"
              aria-label="Fermer"
            >
              <X size={22} />
            </button>
          </div>

          <div className="mobile-nav__content">
            <ul className="mobile-nav__links">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="mobile-nav__link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                    <ChevronRight size={18} />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mobile-nav__categories">
              <span className="mobile-nav__sublabel label">Nos Univers</span>
              <div className="mobile-nav__cat-grid">
                <Link to="/produits?category=encensoirs" className="mobile-nav__cat-chip" onClick={() => setMobileMenuOpen(false)}>
                  Encensoirs
                </Link>
                <Link to="/produits?category=thiouraye" className="mobile-nav__cat-chip" onClick={() => setMobileMenuOpen(false)}>
                  Thiouraye & Gowé
                </Link>
                <Link to="/produits?category=sprays" className="mobile-nav__cat-chip" onClick={() => setMobileMenuOpen(false)}>
                  Sprays d'intérieur
                </Link>
                <Link to="/produits?category=maison" className="mobile-nav__cat-chip" onClick={() => setMobileMenuOpen(false)}>
                  Paniers & Maison
                </Link>
              </div>
            </div>

            <div className="mobile-nav__footer">
              <Link
                to="/commande/suivi"
                className="btn btn--outline btn--full"
                onClick={() => setMobileMenuOpen(false)}
              >
                Suivre ma commande
              </Link>
              <a
                href="https://wa.me/221771234567"
                target="_blank"
                rel="noreferrer"
                className="btn btn--whatsapp btn--full"
                style={{ marginTop: '0.65rem' }}
              >
                <Phone size={16} />
                <span>Service WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav" aria-label="Navigation mobile">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          if (item.isCart) {
            return (
              <button
                key={item.label}
                onClick={openDrawer}
                className="mobile-bottom-nav__item"
                aria-label="Panier"
              >
                <div className="mobile-bottom-nav__icon-wrap">
                  <Icon size={20} strokeWidth={1.8} />
                  {count > 0 && (
                    <span className="mobile-bottom-nav__badge">{count}</span>
                  )}
                </div>
                <span className="mobile-bottom-nav__label">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.to}
              className={`mobile-bottom-nav__item ${isActive ? 'mobile-bottom-nav__item--active' : ''}`}
            >
              <div className="mobile-bottom-nav__icon-wrap">
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <span className="mobile-bottom-nav__label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
