import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Package, ShoppingCart, Info, MessageCircle, LogOut, Heart, ShieldCheck } from 'lucide-react';
import './SimplePages.css';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bushra_wishlist') || '[]');
      setFavoritesCount(Array.isArray(saved) ? saved.length : 0);
    } catch {
      setFavoritesCount(0);
    }
  }, []);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <div className="simple-page">
      <div className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
        <span className="label" style={{ color: 'var(--color-amber)' }}>Mon espace</span>
        <h1 className="display-lg" style={{ marginTop: '0.5rem', marginBottom: '0.75rem' }}>
          {user?.fullName ? `Bonjour, ${user.fullName}` : 'Mon espace client'}
        </h1>
        <p className="body" style={{ color: 'var(--color-smoke)', marginBottom: 'var(--space-xl)' }}>
          {user?.email
            ? user.email
            : 'Aucun compte n’est nécessaire pour commander : suivez vos commandes avec votre numéro et votre téléphone.'}
        </p>

        <div className="account-grid">
          <Link to="/commande/suivi" className="account-card">
            <div className="account-card__icon"><Package size={28} strokeWidth={1.5} /></div>
            <div>
              <h3 className="heading">Mes commandes</h3>
              <p style={{ color: 'var(--color-smoke)', fontSize: '0.85rem' }}>Suivre mes commandes en cours</p>
            </div>
          </Link>

          <Link to="/panier" className="account-card">
            <div className="account-card__icon"><ShoppingCart size={28} strokeWidth={1.5} /></div>
            <div>
              <h3 className="heading">Mon panier</h3>
              <p style={{ color: 'var(--color-smoke)', fontSize: '0.85rem' }}>
                {count > 0 ? `${count} article${count > 1 ? 's' : ''} dans le panier` : 'Votre panier est vide'}
              </p>
            </div>
          </Link>

          <Link to="/produits" className="account-card">
            <div className="account-card__icon"><Heart size={28} strokeWidth={1.5} /></div>
            <div>
              <h3 className="heading">Mes favoris</h3>
              <p style={{ color: 'var(--color-smoke)', fontSize: '0.85rem' }}>
                {favoritesCount > 0
                  ? `${favoritesCount} produit${favoritesCount > 1 ? 's' : ''} enregistré${favoritesCount > 1 ? 's' : ''}`
                  : 'Aucun favori pour l’instant'}
              </p>
            </div>
          </Link>

          <Link to="/contact" className="account-card">
            <div className="account-card__icon"><MessageCircle size={28} strokeWidth={1.5} /></div>
            <div>
              <h3 className="heading">Contact</h3>
              <p style={{ color: 'var(--color-smoke)', fontSize: '0.85rem' }}>Nous contacter</p>
            </div>
          </Link>

          <Link to="/a-propos" className="account-card">
            <div className="account-card__icon"><Info size={28} strokeWidth={1.5} /></div>
            <div>
              <h3 className="heading">À propos</h3>
              <p style={{ color: 'var(--color-smoke)', fontSize: '0.85rem' }}>Découvrir notre histoire</p>
            </div>
          </Link>

          {isAdmin && (
            <Link to="/admin" className="account-card">
              <div className="account-card__icon"><ShieldCheck size={28} strokeWidth={1.5} /></div>
              <div>
                <h3 className="heading">Administration</h3>
                <p style={{ color: 'var(--color-smoke)', fontSize: '0.85rem' }}>Gérer produits et commandes</p>
              </div>
            </Link>
          )}
        </div>

        {user && (
          <button onClick={logout} className="btn btn--outline" style={{ marginTop: '1.5rem' }}>
            <LogOut size={18} strokeWidth={1.5} style={{ marginRight: '0.5rem' }} />
            Déconnexion
          </button>
        )}
      </div>
    </div>
  );
}
