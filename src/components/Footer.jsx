import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone, MapPin, CreditCard, Smartphone, ArrowRight } from 'lucide-react';
import './Footer.css';
import TransparentLogo from './TransparentLogo';

export default function Footer() {
  return (
    <footer className="footer">
      <section className="footer-newsletter" aria-labelledby="footer-newsletter-title">
        <p className="footer-newsletter__eyebrow">La maison Bushra</p>
        <h2 id="footer-newsletter-title">Une nouvelle senteur<br />vous attend peut-être.</h2>
        <p>Explorez les dernières pièces et collections de la boutique.</p>
        <Link to="/produits">Découvrir les nouveautés <ArrowRight size={15} /></Link>
      </section>

      <div className="footer__top">
        <div className="container footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__logo" aria-label="Bushra Machallah, accueil">
              <TransparentLogo src="/logo.png" alt="Bushra Machallah" className="footer__logo-img" width={120} height={120} tolerance={60} />
            </Link>
            <p className="footer__desc">Encens, thiouraye, parfums et objets de senteur inspirés des gestes et des traditions du Sénégal.</p>
            <a href="https://wa.me/221771234567" target="_blank" rel="noreferrer" aria-label="Contacter Bushra Machallah sur WhatsApp" className="footer__social"><MessageCircle size={18} /><span>WhatsApp</span></a>
          </div>

          <div className="footer__col">
            <h3 className="footer__col-title">Service client</h3>
            <ul className="footer__links">
              <li><Link to="/commande/suivi">Suivre ma commande</Link></li>
              <li><Link to="/contact">Nous contacter</Link></li>
              <li><Link to="/commande">Passer commande</Link></li>
              <li><Link to="/compte">Mon espace</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__col-title">La maison</h3>
            <ul className="footer__links">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/a-propos">Notre histoire</Link></li>
              <li><Link to="/collections">Collections</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__col-title">Nos univers</h3>
            <ul className="footer__links">
              <li><Link to="/produits?search=thiouraye">Thiouraye & encens</Link></li>
              <li><Link to="/produits?search=encensoir">Mabkhara</Link></li>
              <li><Link to="/produits?search=parfum">Parfums & brumes</Link></li>
              <li><Link to="/produits?search=vétiver">Vétiver</Link></li>
            </ul>
          </div>

          <div className="footer__col footer__contact-col">
            <h3 className="footer__col-title">Retrouvez-nous</h3>
            <ul className="footer__contact">
              <li><Phone size={15} /><a href="tel:+221771234567">+221 77 123 45 67</a></li>
              <li><MapPin size={15} /><span>Dakar, Sénégal</span></li>
              <li><CreditCard size={15} /><span>Paiement à la livraison</span></li>
              <li><Smartphone size={15} /><span>Wave · Orange Money</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {new Date().getFullYear()} Bushra Machallah · Tous droits réservés</p>
          <Link to="/commande/suivi">Suivre ma commande <ArrowRight size={13} /></Link>
        </div>
      </div>
    </footer>
  );
}
