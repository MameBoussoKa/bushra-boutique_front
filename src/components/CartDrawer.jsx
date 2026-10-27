import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl, formatPrice } from '../utils/api';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle, Truck, Sparkles } from 'lucide-react';
import './CartDrawer.css';

const FREE_SHIPPING_THRESHOLD = 25000;

export default function CartDrawer() {
  const { items, total, count, isDrawerOpen, closeDrawer, dispatch } = useCart();
  const navigate = useNavigate();

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const progressPercent = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total);

  const handleCheckout = () => {
    closeDrawer();
    navigate('/commande');
  };

  const handleViewCart = () => {
    closeDrawer();
    navigate('/panier');
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour Bushra Machallah, je souhaite commander ces articles depuis votre boutique :\n` +
    items.map(i => `- ${i.name} (x${i.quantity}) : ${formatPrice(i.price * i.quantity)}`).join('\n') +
    `\n\nTotal : ${formatPrice(total)}`
  );

  return (
    <div className={`cart-drawer-wrapper ${isDrawerOpen ? 'cart-drawer-wrapper--open' : ''}`}>
      {/* Backdrop */}
      <div className="cart-drawer-backdrop" onClick={closeDrawer} aria-hidden />

      {/* Drawer panel */}
      <aside className="cart-drawer" role="dialog" aria-label="Panier d'achat" aria-modal="true">
        {/* Header */}
        <div className="cart-drawer__header">
          <div className="cart-drawer__title-wrap">
            <ShoppingBag size={20} className="cart-drawer__icon" />
            <h2 className="cart-drawer__title">Mon Panier</h2>
            <span className="cart-drawer__badge">{count}</span>
          </div>
          <button
            onClick={closeDrawer}
            className="cart-drawer__close-btn"
            aria-label="Fermer le panier"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free shipping progress bar */}
        <div className="cart-drawer__shipping">
          <div className="cart-drawer__shipping-text">
            <Truck size={16} />
            {remainingForFreeShipping === 0 ? (
              <span className="cart-drawer__shipping-free">
                <Sparkles size={14} /> Félicitations ! Livraison gratuite à Dakar
              </span>
            ) : (
              <span>
                Plus que <strong>{formatPrice(remainingForFreeShipping)}</strong> pour la livraison offerte
              </span>
            )}
          </div>
          <div className="cart-drawer__progress-bar">
            <div
              className="cart-drawer__progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="cart-drawer__content">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <div className="cart-drawer__empty-icon">
                <ShoppingBag size={48} strokeWidth={1.2} />
              </div>
              <h3 className="cart-drawer__empty-title">Votre panier est vide</h3>
              <p className="cart-drawer__empty-desc">
                Laissez-vous tenter par nos encensoirs artisanaux, thiouraye et parfums d'ambiance.
              </p>
              <button
                onClick={() => {
                  closeDrawer();
                  navigate('/produits');
                }}
                className="btn btn--primary cart-drawer__empty-btn"
              >
                Découvrir la boutique
              </button>
            </div>
          ) : (
            <div className="cart-drawer__items">
              {items.map((item) => {
                const itemImg = item.image
                  ? (item.image.startsWith('/') ? item.image : getImageUrl(item.image))
                  : '/placeholder.jpg';

                return (
                  <div key={`${item.productId}-${item.variantId || 'base'}`} className="cart-drawer-item">
                    <div className="cart-drawer-item__img-wrap">
                      <img src={itemImg} alt={item.name} className="cart-drawer-item__img" />
                    </div>

                    <div className="cart-drawer-item__details">
                      <h4 className="cart-drawer-item__name">{item.name}</h4>
                      {item.variantName && (
                        <span className="cart-drawer-item__variant">{item.variantName}</span>
                      )}
                      <div className="cart-drawer-item__price">
                        {formatPrice(item.price)}
                      </div>

                      <div className="cart-drawer-item__actions">
                        <div className="cart-drawer-item__qty-control">
                          <button
                            onClick={() =>
                              dispatch({
                                type: 'UPDATE_QTY',
                                productId: item.productId,
                                variantId: item.variantId,
                                quantity: item.quantity - 1,
                              })
                            }
                            className="cart-drawer-item__qty-btn"
                            aria-label="Diminuer quantité"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="cart-drawer-item__qty">{item.quantity}</span>
                          <button
                            onClick={() =>
                              dispatch({
                                type: 'UPDATE_QTY',
                                productId: item.productId,
                                variantId: item.variantId,
                                quantity: item.quantity + 1,
                              })
                            }
                            className="cart-drawer-item__qty-btn"
                            aria-label="Augmenter quantité"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            dispatch({
                              type: 'REMOVE_ITEM',
                              productId: item.productId,
                              variantId: item.variantId,
                            })
                          }
                          className="cart-drawer-item__remove-btn"
                          aria-label="Supprimer cet article"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__subtotal-row">
              <span className="cart-drawer__subtotal-label">Sous-total</span>
              <span className="cart-drawer__subtotal-val">{formatPrice(total)}</span>
            </div>
            <p className="cart-drawer__shipping-note">
              Frais de livraison calculés à l'étape suivante (gratuite dès 25 000 FCFA).
            </p>

            <div className="cart-drawer__buttons">
              <button onClick={handleCheckout} className="btn btn--primary btn--full">
                <span>Passer la commande</span>
                <ArrowRight size={16} />
              </button>

              <a
                href={`https://wa.me/221771234567?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn--whatsapp btn--full"
              >
                <MessageCircle size={17} />
                <span>Commander via WhatsApp</span>
              </a>

              <button onClick={handleViewCart} className="cart-drawer__view-cart-link">
                Voir le panier complet
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
