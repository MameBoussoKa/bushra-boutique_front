import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api, formatPrice, getImageUrl } from '../utils/api';
import { Banknote, Smartphone, Circle, Flame, AlertCircle, ShieldCheck, ArrowLeft, LockKeyhole } from 'lucide-react';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { items, total, dispatch } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    address: '', city: 'Dakar', region: '', notes: '',
    paymentMethod: 'cash_on_delivery',
  });

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
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
        customerEmail: form.email,
        customerAddress: form.address,
        customerCity: form.city,
        customerRegion: form.region,
        customerNote: form.notes,
        paymentMethod: form.paymentMethod,
        items: items.map(i => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      };

      const res = await api.createOrder(orderData);
      const orderNumber = res.order?.orderNumber
        || res.order?.order_number
        || res.data?.order?.orderNumber
        || res.data?.order?.order_number
        || res.data?.orderNumber
        || res.data?.order_number
        || res.data?.id;
      dispatch({ type: 'CLEAR' });
      navigate(orderNumber ? `/commande/confirmation?order=${encodeURIComponent(orderNumber)}` : '/commande/confirmation');
    } catch {
      const demoOrderNumber = `DEMO-${Date.now().toString().slice(-6)}`;
      try {
        const demoOrders = JSON.parse(localStorage.getItem('bushra_demo_orders') || '[]');
        demoOrders.unshift({
          order_number: demoOrderNumber,
          customer_phone: form.phone,
          status: 'pending',
          items: items.map(item => ({ name: item.name, quantity: item.quantity })),
        });
        localStorage.setItem('bushra_demo_orders', JSON.stringify(demoOrders.slice(0, 10)));
      } catch {
        // La confirmation de démonstration reste disponible sans stockage local.
      }
      dispatch({ type: 'CLEAR' });
      navigate(`/commande/confirmation?order=${encodeURIComponent(demoOrderNumber)}&demo=1`);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <p>Votre panier est vide.</p>
        <Link to="/produits" className="btn btn--primary" style={{ marginTop: '1rem' }}>
          Explorer la boutique
        </Link>
      </div>
    );
  }

  const shipping = total >= 25000 ? 0 : 1500;
  const orderTotal = total + shipping;

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-breadcrumb">
          <Link to="/panier"><ArrowLeft size={15} /> Retour au panier</Link>
        </div>
        <header className="checkout-page__header">
          <span className="label checkout-kicker">Dernière étape</span>
          <h1 className="display-lg checkout-title">Finaliser la commande</h1>
          <p>Quelques informations pour préparer votre livraison à Dakar et partout au Sénégal.</p>
        </header>

        <form onSubmit={handleSubmit} className="checkout-layout">
          {/* Form */}
          <div className="checkout-form">
            {/* Contact */}
            <div className="checkout-section">
              <h2 className="checkout-section__title heading">Informations personnelles</h2>
              <div className="form-grid-2">
                <div className="form-field">
                  <label htmlFor="checkout-first-name">Prénom *</label>
                  <input id="checkout-first-name" autoComplete="given-name" type="text" value={form.firstName} onChange={e => update('firstName', e.target.value)} required />
                </div>
                <div className="form-field">
                  <label htmlFor="checkout-last-name">Nom *</label>
                  <input id="checkout-last-name" autoComplete="family-name" type="text" value={form.lastName} onChange={e => update('lastName', e.target.value)} required />
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-field">
                  <label htmlFor="checkout-phone">Téléphone *</label>
                  <input id="checkout-phone" autoComplete="tel" type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} required placeholder="+221 77 ..." />
                </div>
                <div className="form-field">
                  <label htmlFor="checkout-email">Email (optionnel)</label>
                  <input id="checkout-email" autoComplete="email" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="votre@email.com" />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="checkout-section">
              <h2 className="checkout-section__title heading">Adresse de livraison</h2>
              <div className="form-field">
                <label htmlFor="checkout-address">Adresse complète *</label>
                <input id="checkout-address" autoComplete="street-address" type="text" value={form.address} onChange={e => update('address', e.target.value)} required placeholder="Rue, quartier..." />
              </div>
              <div className="form-grid-2">
                <div className="form-field">
                  <label htmlFor="checkout-city">Ville *</label>
                  <select id="checkout-city" autoComplete="address-level2" value={form.city} onChange={e => update('city', e.target.value)} required>
                    {['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Kaolack', 'Mbour', 'Diourbel', 'Touba'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="checkout-region">Région</label>
                  <input id="checkout-region" autoComplete="address-level1" type="text" value={form.region} onChange={e => update('region', e.target.value)} placeholder="Région..." />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="checkout-section">
              <h2 className="checkout-section__title heading">Mode de paiement</h2>
              <div className="payment-options">
                {[
                  { value: 'cash_on_delivery', label: 'Paiement à la livraison', icon: <Banknote size={20} strokeWidth={1.5} />, desc: 'Payez en espèces à la réception' },
                  { value: 'wave', label: 'Wave', icon: <Smartphone size={20} strokeWidth={1.5} />, desc: 'Paiement mobile Wave' },
                  { value: 'orange_money', label: 'Orange Money', icon: <Circle size={20} strokeWidth={1.5} />, desc: 'Paiement mobile Orange Money' },
                ].map(opt => (
                  <label key={opt.value} className={`payment-option ${form.paymentMethod === opt.value ? 'payment-option--active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={form.paymentMethod === opt.value}
                      onChange={() => update('paymentMethod', opt.value)}
                    />
                    <span className="payment-option__icon">{opt.icon}</span>
                    <div>
                      <div className="payment-option__label">{opt.label}</div>
                      <div className="payment-option__desc">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="checkout-section">
              <div className="form-field">
                <label htmlFor="checkout-notes">Notes / Instructions (optionnel)</label>
                <textarea
                  id="checkout-notes"
                  value={form.notes}
                  onChange={e => update('notes', e.target.value)}
                  rows={3}
                  placeholder="Informations supplémentaires pour la livraison..."
                />
              </div>
            </div>

              {error && (
                <div className="checkout-error">
                  <AlertCircle size={16} strokeWidth={2} />
                  {error}
                </div>
              )}

            <button type="submit" className="btn btn--primary btn--full checkout-submit" disabled={loading}>
              {loading ? 'Traitement en cours…' : `Confirmer la commande — ${formatPrice(orderTotal)}`}
            </button>
            <p className="checkout-secure-note"><LockKeyhole size={14} /> Vos informations sont utilisées uniquement pour préparer votre commande.</p>
          </div>

          {/* Order summary */}
          <aside className="checkout-summary">
            <h2 className="heading checkout-summary__title">Votre commande <span>{items.length} article{items.length > 1 ? 's' : ''}</span></h2>
            <div className="checkout-items">
              {items.map(item => (
                <div key={`${item.productId}-${item.variantId || 'default'}`} className="checkout-item">
                  <div className="checkout-item__img">
                    {item.image ? <img src={getImageUrl(item.image)} alt={item.name} /> : <Flame size={20} strokeWidth={1.5} />}
                    <span className="checkout-item__qty">{item.quantity}</span>
                  </div>
                  <div className="checkout-item__info">
                    <div className="checkout-item__name">{item.name}</div>
                    {item.variantName && <div className="checkout-item__variant">{item.variantName}</div>}
                  </div>
                  <div className="checkout-item__price">{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="checkout-totals">
              <div className="checkout-total-line">
                <span>Sous-total</span><span>{formatPrice(total)}</span>
              </div>
              <div className="checkout-total-line">
                <span>Livraison</span>
                <span style={{ color: shipping === 0 ? '#4caf50' : 'inherit' }}>
                  {shipping === 0 ? 'Gratuite' : formatPrice(shipping)}
                </span>
              </div>
              <div className="checkout-total-line checkout-total-line--final">
                <span>Total</span><span>{formatPrice(orderTotal)}</span>
              </div>
            </div>
            <div className="checkout-summary__assurance"><ShieldCheck size={16} /> Chaque commande est préparée avec attention par notre équipe à Dakar.</div>
          </aside>
        </form>
      </div>
    </div>
  );
}
