import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Package, ShoppingCart, Info, MessageCircle, LogOut, ArrowUpRight } from 'lucide-react';
import './SimplePages.css';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <div className="simple-page account-page">
      <div className="container account-page__inner">
        <header className="account-page__hero">
          <div>
            <span className="label">Mon espace</span>
            <h1 className="display-lg">Bonjour,<br /><em>{user?.name || 'Client'}</em></h1>
            <p>Retrouvez vos commandes et les essentiels de votre boutique.</p>
          </div>
          <div className="account-page__visual">
            <img src="/sprays.png" alt="Sélection de parfums Bushra Machallah" />
            <span>Bushra Machallah · Dakar</span>
          </div>
        </header>

        <section className="account-page__section" aria-labelledby="account-shortcuts-title">
          <div className="account-page__section-head">
            <div>
              <span className="label">Raccourcis</span>
              <h2 id="account-shortcuts-title" className="display-md">Votre espace, en un geste</h2>
            </div>
          </div>
          <div className="account-page__grid">
            <Link to="/commande/suivi" className="account-card">
              <span className="account-card__icon"><Package size={24} strokeWidth={1.5} /></span>
              <span className="account-card__copy"><strong>Mes commandes</strong><small>Suivre une commande en cours</small></span>
              <ArrowUpRight className="account-card__arrow" size={18} />
            </Link>
            <Link to="/panier" className="account-card">
              <span className="account-card__icon"><ShoppingCart size={24} strokeWidth={1.5} /></span>
              <span className="account-card__copy"><strong>Mon panier</strong><small>{count > 0 ? `${count} article${count > 1 ? 's' : ''} dans le panier` : 'Votre panier est vide'}</small></span>
              <ArrowUpRight className="account-card__arrow" size={18} />
            </Link>
            <Link to="/a-propos" className="account-card">
              <span className="account-card__icon"><Info size={24} strokeWidth={1.5} /></span>
              <span className="account-card__copy"><strong>Notre histoire</strong><small>Découvrir l’univers de la maison</small></span>
              <ArrowUpRight className="account-card__arrow" size={18} />
            </Link>
            <Link to="/contact" className="account-card">
              <span className="account-card__icon"><MessageCircle size={24} strokeWidth={1.5} /></span>
              <span className="account-card__copy"><strong>Nous contacter</strong><small>Une question ? Parlons-en.</small></span>
              <ArrowUpRight className="account-card__arrow" size={18} />
            </Link>
          </div>
        </section>

        {user && (
          <button onClick={logout} className="account-page__logout">
            <LogOut size={17} strokeWidth={1.5} /> Déconnexion
          </button>
        )}
      </div>
    </div>
  );
}
