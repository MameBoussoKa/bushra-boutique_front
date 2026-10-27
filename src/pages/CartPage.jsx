import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl, formatPrice } from '../utils/api';
import { ShoppingBag, Trash2, Plus, Minus, MessageCircle, ArrowRight, Truck, Sparkles, ChevronRight } from 'lucide-react';
import './CartPage.css';

const FREE_SHIPPING_THRESHOLD = 25000;

export default function CartPage() {
  const { items, total, count, dispatch } = useCart();
  const navigate = useNavigate();

  const progressPercent = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total);

  if (items.length === 0) {
    return (
      <div className="cart-page cart-page--empty">
        <div className="container">
          <div className="cart-empty-box">
            <div className="cart-empty-box__icon">
              <ShoppingBag size={56} strokeWidth={1.2} />
            </div>
            <h1 className="display-md cart-empty-box__title">Votre panier est vide</h1>
            <p className="cart-empty-box__desc">
              Découvrez nos prestigieux encensoirs, thiourayes authentiques et brumes d'intérieur.
            </p>
            <Link to="/produits" className="btn btn--primary" style={{ marginTop: '1.5rem' }}>
              <span>Explorer la boutique</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Bonjour Bushra Machallah, je souhaite commander ces articles depuis mon panier :\n` +
    items.map(i => `- ${i.name} (x${i.quantity}) : ${formatPrice(i.price * i.quantity)}`).join('\n') +
    `\n\nTotal : ${formatPrice(total)}`
  );

  return (
    <div className="cart-page">
      {/* Breadcrumb */}
      <div className="container product-breadcrumb" style={{ paddingTop: '100px' }}>
        <Link to="/">Accueil</Link>
        <ChevronRight size={14} />
        <Link to="/produits">Boutique</Link>
        <ChevronRight size={14} />
        <span className="product-breadcrumb__current">Mon Panier ({count})</span>
      </div>

      <div className="container cart-page__container">
        <div className="cart-page__header">
          <span className="label" style={{ color: 'var(--color-gold)' }}>Votre Sélection</span>
          <h1 className="display-md cart-page__title">Mon Panier d'Achat</h1>
        </div>

        {/* Free shipping banner */}
        <div className="cart-shipping-banner">
          <div className="cart-shipping-banner__text">
            <Truck size={18} className="gold-text" />
            {remainingForFreeShipping === 0 ? (
              <span className="cart-shipping-banner__free">
                <Sparkles size={15} /> Félicitations ! Votre commande bénéficie de la livraison gratuite à Dakar.
              </span>
            ) : (
              <span>
                Ajoutez <strong>{formatPrice(remainingForFreeShipping)}</strong> pour bénéficier de la <strong>livraison gratuite à Dakar</strong>.
              </span>
            )}
          </div>
          <div className="cart-shipping-banner__progress">
            <div
              className="cart-shipping-banner__bar"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="cart-layout">
          {/* Items List */}
          <div className="cart-items-column">
            <div className="cart-items-table-header">
              <span>Produit</span>
              <span>Prix</span>
              <span>Quantité</span>
              <span>Total</span>
              <span aria-label="Action" />
            </div>

            <div className="cart-items-list">
              {items.map((item) => {
                const itemImg = item.image
                  ? (item.image.startsWith('/') ? item.image : getImageUrl(item.image))
                  : '/encensoir1.png';

                return (
                  <div key={`${item.productId}-${item.variantId || 'base'}`} className="cart-item-row">
                    <div className="cart-item-product">
                      <div className="cart-item-product__thumb">
                        <img src={itemImg} alt={item.name} />
                      </div>
                      <div>
                        <h3 className="cart-item-product__name">{item.name}</h3>
                        {item.variantName && (
                          <span className="cart-item-product__variant">{item.variantName}</span>
                        )}
                      </div>
                    </div>

                    <div className="cart-item-price">
                      {formatPrice(item.price)}
                    </div>

                    <div className="cart-item-qty">
                      <div className="cart-item-qty__controls">
                        <button
                          onClick={() =>
                            dispatch({
                              type: 'UPDATE_QTY',
                              productId: item.productId,
                              variantId: item.variantId,
                              quantity: item.quantity - 1,
                            })
                          }
                          aria-label="Diminuer"
                        >
                          <Minus size={13} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            dispatch({
                              type: 'UPDATE_QTY',
                              productId: item.productId,
                              variantId: item.variantId,
                              quantity: item.quantity + 1,
                            })
                          }
                          aria-label="Augmenter"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-subtotal">
                      {formatPrice(item.price * item.quantity)}
                    </div>

                    <div className="cart-item-remove">
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'REMOVE_ITEM',
                            productId: item.productId,
                            variantId: item.variantId,
                          })
                        }
                        className="cart-item-remove__btn"
                        aria-label="Supprimer cet article"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-actions-bar">
              <Link to="/produits" className="cart-continue-link">
                ← Poursuivre mes achats
              </Link>
              <button
                onClick={() => dispatch({ type: 'CLEAR' })}
                className="cart-clear-btn"
              >
                Vider le panier
              </button>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="cart-summary-box">
            <h2 className="heading cart-summary-box__title">Récapitulatif de la commande</h2>
            <div className="divider divider--left" style={{ margin: '0.75rem 0 1.5rem' }} />

            <div className="cart-summary-lines">
              <div className="cart-summary-line">
                <span>Sous-total</span>
                <strong>{formatPrice(total)}</strong>
              </div>

              <div className="cart-summary-line">
                <span>Livraison Dakar</span>
                <span className={total >= FREE_SHIPPING_THRESHOLD ? 'cart-summary-free' : ''}>
                  {total >= FREE_SHIPPING_THRESHOLD ? 'Gratuite' : '1 500 FCFA'}
                </span>
              </div>

              <div className="cart-summary-divider" />

              <div className="cart-summary-line cart-summary-line--total">
                <span>Total estimé</span>
                <span className="cart-summary-total-val">
                  {formatPrice(total >= FREE_SHIPPING_THRESHOLD ? total : total + 1500)}
                </span>
              </div>
            </div>

            <div className="cart-summary-buttons">
              <button
                onClick={() => navigate('/commande')}
                className="btn btn--primary btn--full"
              >
                <span>Passer la commande</span>
                <ArrowRight size={16} />
              </button>

              <a
                href={`https://wa.me/221771234567?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn--whatsapp btn--full"
              >
                <MessageCircle size={18} />
                <span>Commander via WhatsApp</span>
              </a>
            </div>

            <div className="cart-summary-reassurance">
              <p>✓ Paiement à la réception, Wave ou Orange Money</p>
              <p>✓ Service client disponible 7j/7 au Sénégal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
