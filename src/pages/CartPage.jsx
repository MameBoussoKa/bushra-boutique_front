import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl, formatPrice } from '../utils/api';
import { ShoppingCart, Image, Trash2, MessageCircle, ArrowRight, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import './CartPage.css';

export default function CartPage() {
  const { items, total, count, dispatch } = useCart();
  const navigate = useNavigate();
  const shipping = total >= 25000 ? 0 : 1500;
  const orderTotal = total + shipping;

  if (items.length === 0) return (
    <div className="cart-empty">
      <div className="cart-empty__icon" aria-hidden="true">
        <ShoppingCart size={64} strokeWidth={1.5} />
      </div>
      <span className="label cart-kicker">Votre sélection Bushra</span>
      <h1 className="display-md">Votre panier est vide</h1>
      <p style={{ color: 'var(--color-smoke)', marginTop: '0.75rem' }}>
        Découvrez nos encens, encensoirs et senteurs d'exception.
      </p>
      <Link to="/produits" className="btn btn--primary" style={{ marginTop: '2rem' }}>
        Explorer la boutique <ArrowRight size={16} />
      </Link>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="container">
        <header className="cart-page__header">
          <div>
            <span className="label cart-kicker">Votre sélection Bushra</span>
            <h1 className="display-lg cart-page__title">Mon panier</h1>
            <p className="cart-page__count">{count} article{count > 1 ? 's' : ''} choisi{count > 1 ? 's' : ''}</p>
          </div>
          <Link to="/produits" className="cart-back-link"><ArrowLeft size={15} /> Continuer mes achats</Link>
        </header>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(item => (
              <article key={`${item.productId}-${item.variantId || 'default'}`} className="cart-item">
                <div className="cart-item__image">
                  {item.image ? (
                    <img src={getImageUrl(item.image)} alt={item.name} />
                  ) : (
                    <div className="cart-item__image-placeholder">
                      <Image size={24} strokeWidth={1.5} color="var(--color-amber)" />
                    </div>
                  )}
                </div>

                <div className="cart-item__info">
                  <h3 className="cart-item__name">{item.name}</h3>
                  {item.variantName && (
                    <span className="cart-item__variant label">{item.variantName}</span>
                  )}
                  <span className="cart-item__price">{formatPrice(item.price)}</span>
                </div>

                <div className="cart-item__qty">
                  <button type="button" aria-label={`Retirer un ${item.name}`} disabled={item.quantity <= 1} onClick={() => dispatch({ type: 'UPDATE_QTY', productId: item.productId, variantId: item.variantId, quantity: item.quantity - 1 })}>
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" aria-label={`Ajouter un ${item.name}`} onClick={() => dispatch({ type: 'UPDATE_QTY', productId: item.productId, variantId: item.variantId, quantity: item.quantity + 1 })}>
                    +
                  </button>
                </div>

                <div className="cart-item__subtotal">
                  {formatPrice(item.price * item.quantity)}
                </div>

                <button
                  className="cart-item__remove"
                  onClick={() => dispatch({ type: 'REMOVE_ITEM', productId: item.productId, variantId: item.variantId })}
                  type="button"
                  aria-label={`Supprimer ${item.name} du panier`}
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </article>
            ))}

            <button
              type="button"
              className="cart-clear"
              onClick={() => dispatch({ type: 'CLEAR' })}
            >
              Vider le panier
            </button>
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2 className="heading cart-summary__title">Récapitulatif</h2>

            <div className="cart-summary__lines">
              <div className="cart-summary__line">
                <span className="cart-summary__icon"><ShoppingCart size={15} /> Articles</span>
                <span>{count}</span>
              </div>
              <div className="cart-summary__line">
                <span>Sous-total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="cart-summary__line">
                <span>Livraison</span>
                <span style={{ color: shipping === 0 ? '#4caf50' : 'inherit' }}>
                  {shipping === 0 ? 'Gratuite' : formatPrice(shipping)}
                </span>
              </div>
              {total < 25000 && (
                  <p className="cart-summary__shipping-note">
                  Ajoutez {formatPrice(25000 - total)} pour la livraison gratuite.
                </p>
              )}
              <div className="cart-summary__divider" />
              <div className="cart-summary__line cart-summary__line--total">
                <span>Total</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>
            </div>

            <div className="cart-assurance">
              <span><Truck size={16} /> Livraison offerte dès 25 000 FCFA</span>
              <span><ShieldCheck size={16} /> Commande préparée avec soin</span>
            </div>

            <button
              type="button"
              className="btn btn--primary btn--full"
              onClick={() => navigate('/commande')}
              style={{ marginTop: 'var(--space-md)' }}
            >
              Passer la commande <ArrowRight size={16} />
            </button>

            <a
              href={`https://wa.me/221771234567?text=${encodeURIComponent(`Bonjour, je souhaite commander via WhatsApp. Mon panier est de ${formatPrice(orderTotal)}.`)}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn--outline btn--full"
              style={{ marginTop: '0.75rem', borderColor: '#25d366', color: '#25d366' }}
            >
              <MessageCircle size={18} />
              Commander via WhatsApp
            </a>

            <Link
              to="/produits"
              className="cart-summary__continue"
            >
              <ArrowLeft size={14} /> Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
