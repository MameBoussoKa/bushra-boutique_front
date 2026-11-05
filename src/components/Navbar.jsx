import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Search, ShoppingBag, X, Menu, UserRound, ChevronDown, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import './Navbar.css';

const announcements = [
  'Livraison offerte dès 25 000 FCFA',
  'Paiement à la livraison · Wave · Orange Money',
  'Une question ? Écrivez-nous sur WhatsApp',
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const { count } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setAnnouncementIndex(index => (index + 1) % announcements.length), 7000);
    return () => window.clearInterval(timer);
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate(`/produits?search=${encodeURIComponent(query)}`);
    setSearchQuery('');
    setSearchOpen(false);
  }

  function changeAnnouncement(direction) {
    setAnnouncementIndex(index => (index + direction + announcements.length) % announcements.length);
  }

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/collections', label: 'Collections' },
    { to: '/a-propos', label: 'À propos' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="store-header">
      <div className="announcement-bar">
        <button type="button" onClick={() => changeAnnouncement(-1)} aria-label="Annonce précédente"><ChevronLeft size={14} /></button>
        <p aria-live="polite" aria-atomic="true" key={announcementIndex}>{announcements[announcementIndex]}</p>
        <button type="button" onClick={() => changeAnnouncement(1)} aria-label="Annonce suivante"><ChevronRight size={14} /></button>
      </div>

      <nav className="navbar" aria-label="Navigation principale">
        <div className="navbar__inner">
          <button type="button" className={`navbar__hamburger ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(open => !open)} aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={menuOpen} aria-controls="mobile-menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <ul className="navbar__links">
            <li><Link to="/" className={location.pathname === '/' ? 'is-active' : ''}>Accueil</Link></li>
            <li className="navbar__collections">
              <Link to="/collections" className={location.pathname.startsWith('/collections') ? 'is-active' : ''}>Collections <ChevronDown size={13} /></Link>
              <div className="navbar__dropdown">
                <Link to="/produits?search=thiouraye">Thiouraye & encens</Link>
                <Link to="/produits?search=encensoir">Mabkhara</Link>
                <Link to="/produits?search=parfum">Parfums & brumes</Link>
                <Link to="/produits">Toute la boutique <ArrowRight size={13} /></Link>
              </div>
            </li>
            <li><Link to="/a-propos" className={location.pathname === '/a-propos' ? 'is-active' : ''}>À propos</Link></li>
            <li><Link to="/contact" className={location.pathname === '/contact' ? 'is-active' : ''}>Contact</Link></li>
          </ul>

          <Link to="/" className="navbar__logo" aria-label="Bushra Machallah — accueil">
            <span className="navbar__wordmark">Bushra<span>Machallah</span></span>
          </Link>

          <div className="navbar__actions">
            <button type="button" className="navbar__icon-btn" onClick={() => setSearchOpen(open => !open)} aria-label={searchOpen ? 'Fermer la recherche' : 'Ouvrir la recherche'} aria-expanded={searchOpen}>
              {searchOpen ? <X size={19} /> : <Search size={19} />}
            </button>
            <Link to="/compte" className="navbar__icon-btn navbar__account-btn" aria-label="Mon compte"><UserRound size={19} /></Link>
            <Link to="/panier" className="navbar__cart" aria-label={`Panier, ${count} article${count > 1 ? 's' : ''}`}>
              <ShoppingBag size={17} /><span>Panier</span>{count > 0 && <span className="navbar__cart-count">{count}</span>}
            </Link>
          </div>
        </div>

        <div className={`navbar__search-panel ${searchOpen ? 'is-open' : ''}`} aria-hidden={!searchOpen}>
          <form onSubmit={handleSearch} className="navbar__search-form">
            <Search size={18} aria-hidden="true" />
            <label className="sr-only" htmlFor="store-search">Rechercher dans la boutique</label>
            <input id="store-search" ref={searchRef} tabIndex={searchOpen ? 0 : -1} value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Rechercher une senteur, un encensoir…" />
            <button type="submit" tabIndex={searchOpen ? 0 : -1} disabled={!searchQuery.trim()}>Rechercher</button>
          </form>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`} id="mobile-menu" aria-hidden={!menuOpen}>
        <nav aria-label="Navigation mobile">
          {navLinks.map((link, index) => <Link tabIndex={menuOpen ? 0 : -1} style={{ '--menu-index': index }} to={link.to} key={link.to} onClick={() => setMenuOpen(false)}>{link.label}<ArrowRight size={18} /></Link>)}
          {[
            { label: 'Thiouraye & encens', to: '/produits?search=thiouraye' },
            { label: 'Mabkhara', to: '/produits?search=encensoir' },
            { label: 'Parfums & brumes', to: '/produits?search=parfum' },
          ].map((link, index) => <Link tabIndex={menuOpen ? 0 : -1} style={{ '--menu-index': index + navLinks.length }} to={link.to} key={link.to} onClick={() => setMenuOpen(false)}>{link.label}<ArrowRight size={18} /></Link>)}
          <Link tabIndex={menuOpen ? 0 : -1} to="/compte" onClick={() => setMenuOpen(false)}>Mon compte<ArrowRight size={18} /></Link>
          <Link tabIndex={menuOpen ? 0 : -1} to="/commande/suivi" onClick={() => setMenuOpen(false)}>Suivre ma commande<ArrowRight size={18} /></Link>
        </nav>
        <a tabIndex={menuOpen ? 0 : -1} className="mobile-menu__whatsapp" href="https://wa.me/221771234567" target="_blank" rel="noreferrer">Une question ? WhatsApp</a>
      </div>
      {menuOpen && <button type="button" className="navbar__overlay" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu" />}
    </header>
  );
}
