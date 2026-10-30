import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Phone, MapPin, Mail, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { SHOP, whatsappLink } from '../utils/shop';
import './Footer.css';
import TransparentLogo from './TransparentLogo';

export default function Footer() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <footer className={`footer${isHome ? ' footer--home' : ''}`}>
      {/* Brand reassurance bar — the homepage already shows these promises above the newsletter */}
      <div className="footer-reassurance" hidden={isHome}>
        <div className="container footer-reassurance__inner">
          <div className="footer-reassurance__item">
            <div className="footer-reassurance__icon">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="footer-reassurance__title">100% Artisanal & Naturel</h4>
              <p className="footer-reassurance__desc">Encens et senteurs authentiques du Sénégal</p>
            </div>
          </div>

          <div className="footer-reassurance__item">
            <div className="footer-reassurance__icon">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="footer-reassurance__title">Livraison Rapide</h4>
              <p className="footer-reassurance__desc">Dakar & régions — Offerte dès 25 000 FCFA</p>
            </div>
          </div>

          <div className="footer-reassurance__item">
            <div className="footer-reassurance__icon">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="footer-reassurance__title">Paiement en Sérénité</h4>
              <p className="footer-reassurance__desc">À la réception, Wave ou Orange Money</p>
            </div>
          </div>

          <div className="footer-reassurance__item">
            <div className="footer-reassurance__icon">
              <MessageCircle size={20} />
            </div>
            <div>
              <h4 className="footer-reassurance__title">Service VIP WhatsApp</h4>
              <p className="footer-reassurance__desc">Conseils personnalisés 7j/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="footer__main">
        <div className="container footer__grid">
          {/* Brand Info */}
          <div className="footer__col footer__col--brand">
            <Link to="/" className="footer__logo-link">
              <TransparentLogo
                src="/logo.png"
                alt="Bushra Machallah"
                className="footer__logo-img"
                width={90}
                height={90}
                tolerance={50}
              />
              <div className="footer__brand-text">
                <span className="footer__brand-name">Bushra</span>
                <span className="footer__brand-sub">MACHALLAH</span>
              </div>
            </Link>
            <p className="footer__desc">
              Boutique moderne, élégante et chaleureuse spécialisée dans les parfums,
              encens (thiouray, gowé), encensoirs d'exception et articles de maison soigneusement
              choisis pour sublimer votre intérieur.
            </p>
            <div className="footer__socials">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="footer__social-link"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href={SHOP.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="footer__social-link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a
                href={SHOP.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="footer__social-link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="footer__social-link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="footer__col">
            <h4 className="footer__title">Navigation</h4>
            <ul className="footer__links">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/produits">Boutique en ligne</Link></li>
              <li><Link to="/collections">Catégories & Collections</Link></li>
              <li><Link to="/produits?sort=newest">Nouveautés</Link></li>
              <li><Link to="/a-propos">À propos de notre maison</Link></li>
              <li><Link to="/contact">Nous contacter</Link></li>
            </ul>
          </div>

          {/* Boutique Univers */}
          <div className="footer__col">
            <h4 className="footer__title">Boutique</h4>
            <ul className="footer__links">
              <li><Link to="/produits?category=encensoirs">Encensoirs & Mabkharas</Link></li>
              <li><Link to="/produits?category=thiouraye">Thiouray Traditionnel</Link></li>
              <li><Link to="/produits?category=gowe">Gowé Sélection Privée</Link></li>
              <li><Link to="/produits?category=sprays">Sprays d'intérieur</Link></li>
              <li><Link to="/produits?category=maison">Articles de Maison & Paniers</Link></li>
            </ul>
          </div>

          {/* Assistance & Contact */}
          <div className="footer__col">
            <h4 className="footer__title">Assistance & Contact</h4>
            <ul className="footer__contact-list">
              <li>
                <Phone size={16} className="footer__contact-icon" />
                <a href={`tel:${SHOP.phone}`}>{SHOP.phoneDisplay}</a>
              </li>
              <li>
                <MessageCircle size={16} className="footer__contact-icon" />
                <a href={whatsappLink()} target="_blank" rel="noreferrer">
                  WhatsApp : {SHOP.phoneDisplay}
                </a>
              </li>
              <li>
                <Mail size={16} className="footer__contact-icon" />
                <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a>
              </li>
              <li>
                <MapPin size={16} className="footer__contact-icon" />
                <span>{SHOP.city}</span>
              </li>
            </ul>
            <div className="footer__track-box">
              <Link to="/commande/suivi" className="btn btn--outline btn--sm btn--full">
                Suivre mon colis en temps réel
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom / Copyright & Payments */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copy">
            © {new Date().getFullYear()} Bushra Machallah. Tous droits réservés. L'art des senteurs d'exception.
          </p>

          <div className="footer__payments">
            <span className="footer__payments-label">Moyens acceptés :</span>
            <div className="footer__payment-chips">
              <span className="footer__payment-chip">Paiement à la livraison</span>
              <span className="footer__payment-chip">Wave</span>
              <span className="footer__payment-chip">Orange Money</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
