import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api, formatPrice, getImageUrl } from '../utils/api';
import { Banknote, Smartphone, Circle, Flame, AlertCircle, ChevronRight, ShieldCheck, Truck, Lock } from 'lucide-react';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { items, total, dispatch } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Dakar',
    region: '',
    notes: '',
    paymentMethod: 'cash_on_delivery',
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError('');

    try {
      const orderData = {
        customerName: `${form.firstName} ${form.lastName}`.trim(),
        customerPhone: form.phone,
        customerAddress: form.address,
        customerCity: form.city,
        customerNote: form.notes,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      };

      const res = await api.createOrder(orderData);
      dispatch({ type: 'CLEAR' });
      navigate(
        `/commande/confirmation?order=${res.order?.orderNumber || res.data?.orderNumber || res.data?.id}`
      );
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la commande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page checkout-page--empty">
        <div className="container">
          <div className="checkout-empty-card">
            <p>Votre panier est vide.</p>
            <Link to="/produits" className="btn btn--primary" style={{ marginTop: '1.25rem' }}>
              Explorer la boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shipping = total >= 25000 ? 0 : 1500;
  const orderTotal = total + shipping;

  return (
    <div className="checkout-page">
      {/* Breadcrumb */}
      <div className="container product-breadcrumb" style={{ paddingTop: '100px' }}>
        <Link to="/">Accueil</Link>
        <ChevronRight size={14} />
        <Link to="/panier">Panier</Link>
        <ChevronRight size={14} />
        <span className="product-breadcrumb__current">Finalisation de commande</span>
      </div>

      <div className="container">
        <div className="checkout-header">
          <span className="label" style={{ color: 'var(--color-gold)' }}>
            <Lock size={13} /> Commande Sécurisée
          </span>
          <h1 className="display-md checkout-title">Informations de livraison</h1>
        </div>

        <form onSubmit={handleSubmit} className="checkout-layout">
          {/* Main Form Fields */}
          <div className="checkout-form-column">
            {/* Contact Details */}
            <div className="checkout-card">
              <h2 className="heading checkout-card__title">1. Coordonnées personnelles</h2>
              <div className="checkout-grid-2">
                <div className="form-field">
                  <label>Prénom *</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                    placeholder="Ex: Fatou"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Nom *</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                    placeholder="Ex: Diallo"
                    required
                  />
                </div>
              </div>

              <div className="checkout-grid-2">
                <div className="form-field">
                  <label>Numéro de téléphone (WhatsApp si possible) *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="+221 77 123 45 67"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Adresse email (optionnel)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="checkout-card">
              <h2 className="heading checkout-card__title">2. Adresse de livraison</h2>
              <div className="form-field">
                <label>Adresse précise ou repère *</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  placeholder="Quartier, rue, numéro de maison ou repère connu"
                  required
                />
              </div>

              <div className="checkout-grid-2">
                <div className="form-field">
                  <label>Ville *</label>
                  <select
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    className="checkout-select"
                  >
                    {[
                      'Dakar',
                      'Thiès',
                      'Saint-Louis',
                      'Mbour',
                      'Touba',
                      'Ziguinchor',
                      'Kaolack',
                      'Diourbel',
                      'Autre région',
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>Complément / Quartier</label>
                  <input
                    type="text"
                    value={form.region}
                    onChange={(e) => update('region', e.target.value)}
                    placeholder="Ex: Almadies, Mermoz, Maristes..."
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Instructions spécifiques pour le livreur (optionnel)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  rows={2}
                  placeholder="Horaires de livraison souhaités, code d'accès..."
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="checkout-card">
              <h2 className="heading checkout-card__title">3. Mode de paiement</h2>
              <div className="payment-options">
                {[
                  {
                    value: 'cash_on_delivery',
                    label: 'Paiement à la livraison',
                    icon: <Banknote size={22} />,
                    desc: 'Réglez directement en espèces auprès du livreur à la réception',
                  },
                  {
                    value: 'wave',
                    label: 'Paiement Wave',
                    icon: <Smartphone size={22} style={{ color: '#1DC4FE' }} />,
                    desc: 'Règlement instantané via votre application mobile Wave',
                  },
                  {
                    value: 'orange_money',
                    label: 'Orange Money',
                    icon: <Circle size={22} style={{ color: '#FF7900' }} />,
                    desc: 'Règlement sécurisé via Orange Money Sénégal',
                  },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`payment-option ${form.paymentMethod === opt.value ? 'payment-option--active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={form.paymentMethod === opt.value}
                      onChange={() => update('paymentMethod', opt.value)}
                    />
                    <div className="payment-option__icon">{opt.icon}</div>
                    <div className="payment-option__details">
                      <div className="payment-option__label">{opt.label}</div>
                      <div className="payment-option__desc">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="checkout-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn--primary btn--full checkout-submit-btn"
              disabled={loading}
            >
              {loading
                ? 'Confirmation en cours…'
                : `Confirmer ma commande — ${formatPrice(orderTotal)}`}
            </button>
          </div>

          {/* Sidebar Order Summary */}
          <div className="checkout-summary-column">
            <div className="checkout-summary-card">
              <h2 className="heading checkout-summary-card__title">Votre commande ({items.length})</h2>
              <div className="divider divider--left" style={{ margin: '0.75rem 0 1.25rem' }} />

              <div className="checkout-items-list">
                {items.map((item, i) => {
                  const itemImg = item.image
                    ? (item.image.startsWith('/') ? item.image : getImageUrl(item.image))
                    : '/encensoir1.png';

                  return (
                    <div key={i} className="checkout-item">
                      <div className="checkout-item__thumb">
                        <img src={itemImg} alt={item.name} />
                        <span className="checkout-item__badge">{item.quantity}</span>
                      </div>
                      <div className="checkout-item__info">
                        <h4 className="checkout-item__name">{item.name}</h4>
                        {item.variantName && (
                          <span className="checkout-item__variant">{item.variantName}</span>
                        )}
                        <span className="checkout-item__price">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="checkout-totals">
                <div className="checkout-total-line">
                  <span>Sous-total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="checkout-total-line">
                  <span>Frais de livraison</span>
                  <span className={shipping === 0 ? 'checkout-free-text' : ''}>
                    {shipping === 0 ? 'Gratuite' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="checkout-total-divider" />
                <div className="checkout-total-line checkout-total-line--final">
                  <span>Montant Total</span>
                  <span className="checkout-final-amount">{formatPrice(orderTotal)}</span>
                </div>
              </div>

              <div className="checkout-reassurance-box">
                <div className="checkout-reassurance-row">
                  <ShieldCheck size={16} className="gold-text" />
                  <span>Données strictement protégées</span>
                </div>
                <div className="checkout-reassurance-row">
                  <Truck size={16} className="gold-text" />
                  <span>Confirmation par appel / WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
