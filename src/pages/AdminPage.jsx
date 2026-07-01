import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Routes, Route, NavLink } from 'react-router-dom';
import { api, formatPrice, getImageUrl } from '../utils/api';
import { LayoutDashboard, Package, ShoppingCart, Star, Tag, Globe, LogOut, Plus, ArrowLeft } from 'lucide-react';
import './AdminPage.css';
import TransparentLogo from '../components/TransparentLogo';
import { useAuth } from '../context/AuthContext';

// ── Admin Layout ──────────────────────────────────────────────
export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  function handleBack() {
    navigate(-1);
  }

  const navItems = [
    { to: '/admin', label: 'Tableau de bord', icon: <LayoutDashboard size={20} strokeWidth={1.5} />, end: true },
    { to: '/admin/produits', label: 'Produits', icon: <Package size={20} strokeWidth={1.5} /> },
    { to: '/admin/commandes', label: 'Commandes', icon: <ShoppingCart size={20} strokeWidth={1.5} /> },
    { to: '/admin/avis', label: 'Avis', icon: <Star size={20} strokeWidth={1.5} /> },
    { to: '/admin/categories', label: 'Catégories', icon: <Tag size={20} strokeWidth={1.5} /> },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <TransparentLogo src="/logo.png" alt="Bushra Machallah" width={64} height={64} className="admin-sidebar__logo-img" tolerance={60} />
          <div>
            <div className="admin-sidebar__brand">Bushra Machallah</div>
            <div className="admin-sidebar__role">Administration</div>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav__link ${isActive ? 'admin-nav__link--active' : ''}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <button onClick={handleLogout} className="admin-sidebar__logout">
            <LogOut size={18} strokeWidth={1.5} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <div className="admin-right">
        <header className="admin-header">
          <div className="admin-header__left">
            {location.pathname === '/admin' ? (
              <Link to="/admin" className="admin-header__logo" aria-label="Bushra Machallah">
                <TransparentLogo src="/logo.png" alt="Bushra Machallah" width={32} height={32} tolerance={60} />
              </Link>
            ) : (
              <button onClick={handleBack} className="admin-back-btn" aria-label="Retour">
                <ArrowLeft size={22} strokeWidth={1.5} />
              </button>
            )}
            <div className="admin-header__spacer" />
          </div>
          <div className="admin-header__profile">
            <Link to="/" className="admin-sidebar__btn" title="Voir le site"><Globe size={18} strokeWidth={1.5} /></Link>
            <div className="admin-sidebar__user">
              <div className="admin-sidebar__avatar">A</div>
              <div>
                <div className="admin-sidebar__uname">Admin</div>
                <div className="admin-sidebar__uemail">admin@bushra.local</div>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-main">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="produits" element={<AdminProducts />} />
            <Route path="commandes" element={<AdminOrders />} />
            <Route path="avis" element={<AdminReviews />} />
            <Route path="categories" element={<AdminCategories />} />
          </Routes>
        </main>
      </div>

      <nav className="admin-mobile-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `admin-mobile-nav__link ${isActive ? 'admin-mobile-nav__link--active' : ''}`}
          >
            <span className="admin-mobile-nav__icon">{item.icon}</span>
            <span className="admin-mobile-nav__label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────
function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.admin.getDashboard().then(r => setStats(r.data)).catch(console.error);
    api.admin.getOrders({ limit: 5 }).then(r => setOrders(r.data?.orders || [])).catch(console.error);
  }, []);

  const cards = stats ? [
    { label: 'Commandes totales', val: stats.totalOrders || 0, icon: <ShoppingCart size={24} strokeWidth={1.5} />, color: '#C17B2F' },
    { label: 'Revenus (FCFA)', val: formatPrice(stats.totalRevenue || 0), icon: <LayoutDashboard size={24} strokeWidth={1.5} />, color: '#4CAF50' },
    { label: 'Produits actifs', val: stats.totalProducts || 0, icon: <Package size={24} strokeWidth={1.5} />, color: '#2196F3' },
    { label: 'Commandes en attente', val: stats.pendingOrders || 0, icon: <Star size={24} strokeWidth={1.5} />, color: '#FF9800' },
  ] : [];

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Tableau de bord</h1>

      {stats ? (
        <div className="admin-stats">
          {cards.map((c, i) => (
            <div key={i} className="admin-stat-card" style={{ '--accent': c.color }}>
              <div className="admin-stat-card__icon">{c.icon}</div>
              <div className="admin-stat-card__val">{c.val}</div>
              <div className="admin-stat-card__label">{c.label}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-loading">Chargement…</div>
      )}

      <div className="admin-section">
        <div className="admin-section__header">
          <h2 className="heading">Dernières commandes</h2>
          <Link to="/admin/commandes" className="btn btn--ghost">Voir tout</Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Commande</th>
                <th>Client</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td><strong>#{o.order_number}</strong></td>
                  <td>{o.customer_first_name} {o.customer_last_name}</td>
                  <td>{formatPrice(o.total_amount)}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td style={{ color: 'var(--color-smoke)', fontSize: '0.82rem' }}>
                    {new Date(o.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-smoke)' }}>Aucune commande</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Products ──────────────────────────────────────────────────
function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [categories, setCategories] = useState([]);

  const emptyForm = { name: '', description: '', price: '', compare_price: '', stock: '', category_id: '', is_featured: false };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchProducts();
    api.admin.getCategories().then(r => setCategories(r.data || [])).catch(console.error);
  }, []);

  function fetchProducts() {
    setLoading(true);
    api.admin.getProducts().then(r => setProducts(r.data?.products || r.data || [])).catch(console.error).finally(() => setLoading(false));
  }

  function openForm(product = null) {
    setEditing(product);
    setForm(product ? {
      name: product.name, description: product.description || '',
      price: product.price, compare_price: product.compare_price || '',
      stock: product.stock || '', category_id: product.category_id || '',
      is_featured: product.is_featured || false,
    } : emptyForm);
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    const data = { ...form, price: Number(form.price), compare_price: form.compare_price ? Number(form.compare_price) : null, stock: Number(form.stock) };
    if (editing) await api.admin.updateProduct(editing.id, data);
    else await api.admin.createProduct(data);
    setShowForm(false);
    fetchProducts();
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce produit ?')) return;
    await api.admin.deleteProduct(id);
    fetchProducts();
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Produits</h1>
        <button className="btn btn--primary" onClick={() => openForm()}>+ Nouveau produit</button>
      </div>

      {showForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h3 className="heading">{editing ? 'Modifier' : 'Nouveau'} produit</h3>
              <button onClick={() => setShowForm(false)} className="admin-modal__close">×</button>
            </div>
            <form onSubmit={handleSave} className="admin-form">
              <div className="form-field"><label>Nom *</label><input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required /></div>
              <div className="form-field"><label>Description</label><textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} /></div>
              <div className="form-grid-2">
                <div className="form-field"><label>Prix (FCFA) *</label><input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} required /></div>
                <div className="form-field"><label>Prix barré</label><input type="number" value={form.compare_price} onChange={e => setForm(f => ({...f, compare_price: e.target.value}))} /></div>
              </div>
              <div className="form-grid-2">
                <div className="form-field"><label>Stock</label><input type="number" value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))} /></div>
                <div className="form-field"><label>Catégorie</label>
                  <select value={form.category_id} onChange={e => setForm(f => ({...f, category_id: e.target.value}))}>
                    <option value="">— Choisir —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <label className="admin-checkbox"><input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({...f, is_featured: e.target.checked}))} /> Produit mis en avant</label>
              <div className="admin-form__actions">
                <button type="button" className="btn btn--outline" onClick={() => setShowForm(false)}>Annuler</button>
                <button type="submit" className="btn btn--primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Produit</th><th>Prix</th><th>Stock</th><th>Catégorie</th><th>Mis en avant</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="admin-product-thumb">
                      {p.images?.[0]?.url ? <img src={getImageUrl(p.images[0].url)} alt={p.name} /> : <Package size={24} strokeWidth={1.5} />}
                    </div>
                    <strong>{p.name}</strong>
                  </div>
                </td>
                <td>{formatPrice(p.price)}</td>
                <td><span className={`admin-stock ${p.stock > 0 ? 'in' : 'out'}`}>{p.stock || 0}</span></td>
                <td style={{ color: 'var(--color-smoke)' }}>{p.category_name || '—'}</td>
                <td>{p.is_featured ? <Check size={16} strokeWidth={2} color="#4caf50" /> : '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="admin-action-btn" onClick={() => openForm(p)}><Edit size={16} strokeWidth={1.5} /></button>
                    <button className="admin-action-btn admin-action-btn--danger" onClick={() => handleDelete(p.id)}><Trash2 size={16} strokeWidth={1.5} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Orders ────────────────────────────────────────────────────
function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [manualForm, setManualForm] = useState({
    customerName: '',
    customerPhone: '',
    customerPhone2: '',
    customerAddress: '',
    customerCity: '',
    customerNote: '',
    items: [{ productId: '', quantity: 1 }],
  });

  useEffect(() => {
    api.admin.getOrders().then(r => setOrders(r.data?.orders || [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (showManual) {
      setLoadingProducts(true);
      api.admin.getProducts({ limit: 100 }).then(r => {
        setProducts(r.data?.products || r.data || []);
      }).catch(console.error).finally(() => setLoadingProducts(false));
    }
  }, [showManual]);

  async function handleStatusUpdate() {
    if (!selected || !newStatus) return;
    await api.admin.updateOrderStatus(selected.id, newStatus, note);
    setSelected(null);
    api.admin.getOrders().then(r => setOrders(r.data?.orders || []));
  }

  function handleManualSubmit(e) {
    e.preventDefault();
    const validItems = manualForm.items.filter(i => i.productId && i.quantity > 0);
    if (!manualForm.customerName || !manualForm.customerPhone || !manualForm.customerAddress || validItems.length === 0) {
      alert('Veuillez remplir le nom, le téléphone, l\'adresse et au moins un produit.');
      return;
    }
    setManualSubmitting(true);
    const payload = {
      customerName: manualForm.customerName,
      customerPhone: manualForm.customerPhone,
      customerPhone2: manualForm.customerPhone2,
      customerAddress: manualForm.customerAddress,
      customerCity: manualForm.customerCity,
      customerNote: manualForm.customerNote,
      items: validItems.map(i => ({ productId: Number(i.productId), quantity: Number(i.quantity) })),
    };
    api.admin.createOrder(payload)
      .then(() => {
        setShowManual(false);
        setManualForm({ customerName: '', customerPhone: '', customerPhone2: '', customerAddress: '', customerCity: '', customerNote: '', items: [{ productId: '', quantity: 1 }] });
        api.admin.getOrders().then(r => setOrders(r.data?.orders || []));
      })
      .catch(err => alert(err.message || 'Erreur lors de la création de la commande'))
      .finally(() => setManualSubmitting(false));
  }

  function addItem() {
    setManualForm(f => ({ ...f, items: [...f.items, { productId: '', quantity: 1 }] }));
  }

  function removeItem(idx) {
    setManualForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  }

  function updateItem(idx, field, value) {
    setManualForm(f => ({
      ...f,
      items: f.items.map((item, i) => i === idx ? { ...item, [field]: value } : item),
    }));
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Commandes</h1>
        <button className="btn btn--primary" onClick={() => setShowManual(true)}>
          <Plus size={18} strokeWidth={2} /> Nouvelle commande
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>N°</th><th>Client</th><th>Téléphone</th><th>Montant</th><th>Statut</th><th>Date</th><th>Action</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td><strong>#{o.order_number}</strong></td>
                <td>{o.customer_first_name} {o.customer_last_name}</td>
                <td style={{ color: 'var(--color-smoke)' }}>{o.customer_phone}</td>
                <td>{formatPrice(o.total_amount)}</td>
                <td><StatusBadge status={o.status} /></td>
                <td style={{ color: 'var(--color-smoke)', fontSize: '0.82rem' }}>{new Date(o.created_at).toLocaleDateString('fr-FR')}</td>
                <td>
                  <button className="admin-action-btn" onClick={() => { setSelected(o); setNewStatus(o.status); setNote(''); }}>
                    Gérer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h3 className="heading">Commande #{selected.order_number}</h3>
              <button onClick={() => setSelected(null)} className="admin-modal__close">×</button>
            </div>
            <div className="admin-form">
              <div className="form-field">
                <label>Nouveau statut</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Note admin (optionnel)</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Message pour le client…" />
              </div>
              <div className="admin-form__actions">
                <button className="btn btn--outline" onClick={() => setSelected(null)}>Annuler</button>
                <button className="btn btn--primary" onClick={handleStatusUpdate}>Mettre à jour</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showManual && (
        <div className="admin-modal-overlay">
          <div className="admin-modal admin-modal--wide">
            <div className="admin-modal__header">
              <h3 className="heading">Nouvelle commande manuelle</h3>
              <button onClick={() => setShowManual(false)} className="admin-modal__close">×</button>
            </div>
            <form onSubmit={handleManualSubmit} className="admin-form">
              <div className="admin-form__section">
                <div className="admin-form__section-title">Informations client</div>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Nom complet *</label>
                    <input value={manualForm.customerName} onChange={e => setManualForm(f => ({...f, customerName: e.target.value}))} required />
                  </div>
                  <div className="form-field">
                    <label>Téléphone *</label>
                    <input value={manualForm.customerPhone} onChange={e => setManualForm(f => ({...f, customerPhone: e.target.value}))} required />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Téléphone 2 (optionnel)</label>
                    <input value={manualForm.customerPhone2} onChange={e => setManualForm(f => ({...f, customerPhone2: e.target.value}))} />
                  </div>
                  <div className="form-field">
                    <label>Ville (optionnel)</label>
                    <input value={manualForm.customerCity} onChange={e => setManualForm(f => ({...f, customerCity: e.target.value}))} />
                  </div>
                </div>
                <div className="form-field">
                  <label>Adresse *</label>
                  <input value={manualForm.customerAddress} onChange={e => setManualForm(f => ({...f, customerAddress: e.target.value}))} required />
                </div>
                <div className="form-field">
                  <label>Note (optionnel)</label>
                  <textarea value={manualForm.customerNote} onChange={e => setManualForm(f => ({...f, customerNote: e.target.value}))} rows={2} />
                </div>
              </div>

              <div className="admin-form__section">
                <div className="admin-form__section-title">Produits</div>
                {manualForm.items.map((item, idx) => (
                  <div key={idx} className="admin-form__item-row">
                    <div className="form-field" style={{ flex: 2 }}>
                      <label>Produit</label>
                      <select value={item.productId} onChange={e => updateItem(idx, 'productId', e.target.value)} required>
                        <option value="">— Choisir —</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name} ({formatPrice(p.base_price || p.price)})</option>)}
                      </select>
                    </div>
                    <div className="form-field" style={{ flex: 1 }}>
                      <label>Quantité</label>
                      <input type="number" min={1} value={item.quantity} onChange={e => updateItem(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))} required />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <button type="button" className="admin-action-btn admin-action-btn--danger" onClick={() => removeItem(idx)} disabled={manualForm.items.length <= 1}>×</button>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn--outline btn--sm" onClick={addItem}>+ Ajouter un produit</button>
              </div>

              <div className="admin-form__actions">
                <button type="button" className="btn btn--outline" onClick={() => setShowManual(false)} disabled={manualSubmitting}>Annuler</button>
                <button type="submit" className="btn btn--primary" disabled={manualSubmitting}>
                  {manualSubmitting ? 'Création…' : 'Créer la commande'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Reviews ───────────────────────────────────────────────────
function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    api.admin.getReviews().then(r => setReviews(r.data || [])).catch(console.error);
  }, []);

  async function approve(id) {
    await api.admin.approveReview(id);
    setReviews(r => r.map(rev => rev.id === id ? { ...rev, is_approved: true } : rev));
  }

  async function del(id) {
    if (!confirm('Supprimer cet avis ?')) return;
    await api.admin.deleteReview(id);
    setReviews(r => r.filter(rev => rev.id !== id));
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Avis clients</h1>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Auteur</th><th>Produit</th><th>Note</th><th>Commentaire</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r.id}>
                <td><strong>{r.author_name}</strong></td>
                <td style={{ color: 'var(--color-smoke)' }}>{r.product_name || '—'}</td>
                <td>{'★'.repeat(r.rating)}</td>
                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.comment}</td>
                <td>{r.is_approved ? <span style={{ color: '#4caf50' }}>Approuvé</span> : <span style={{ color: '#ff9800' }}>En attente</span>}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!r.is_approved && <button className="admin-action-btn" onClick={() => approve(r.id)}><Check size={16} strokeWidth={2} color="#4caf50" /></button>}
                    <button className="admin-action-btn admin-action-btn--danger" onClick={() => del(r.id)}><Trash2 size={16} strokeWidth={1.5} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Categories ────────────────────────────────────────────────
function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.admin.getCategories().then(r => setCategories(r.data || [])).catch(console.error);
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    await api.admin.createCategory(form);
    setShowForm(false);
    setForm({ name: '', description: '' });
    api.admin.getCategories().then(r => setCategories(r.data || []));
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Catégories</h1>
        <button className="btn btn--primary" onClick={() => setShowForm(true)}>+ Nouvelle catégorie</button>
      </div>

      {showForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h3 className="heading">Nouvelle catégorie</h3>
              <button onClick={() => setShowForm(false)} className="admin-modal__close">×</button>
            </div>
            <form onSubmit={handleSave} className="admin-form">
              <div className="form-field"><label>Nom *</label><input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required /></div>
              <div className="form-field"><label>Description</label><textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={2} /></div>
              <div className="admin-form__actions">
                <button type="button" className="btn btn--outline" onClick={() => setShowForm(false)}>Annuler</button>
                <button type="submit" className="btn btn--primary">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-categories-list">
        {categories.map(c => (
          <div key={c.id} className="admin-category-card">
            <div>
              <div className="heading" style={{ fontSize: '1rem' }}>{c.name}</div>
              {c.description && <div style={{ color: 'var(--color-smoke)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{c.description}</div>}
            </div>
            <span className="label" style={{ color: 'var(--color-smoke)' }}>
              {c.product_count || 0} produit{c.product_count !== 1 ? 's' : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Admin Login ───────────────────────────────────────────────
export function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__logo">
          <TransparentLogo src="/logo.png" alt="Bushra Machallah" width={80} height={80} className="admin-login__logo-img" tolerance={60} />
          <div>
            <div className="admin-login__brand">Bushra Machallah</div>
            <div className="admin-login__sub">Administration</div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="admin-login__form">
          <div className="form-field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
          </div>
          <div className="form-field">
            <label>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="admin-login__error">{error}</div>}
          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <Link to="/" className="admin-login__back">← Retour au site</Link>
      </div>
    </div>
  );
}

// ── Shared: Status Badge ──────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    pending: { label: 'En attente', color: '#ff9800' },
    confirmed: { label: 'Confirmée', color: '#4caf50' },
    processing: { label: 'Préparation', color: '#2196f3' },
    shipped: { label: 'Expédiée', color: '#9c27b0' },
    delivered: { label: 'Livrée', color: '#4caf50' },
    cancelled: { label: 'Annulée', color: '#f44336' },
  };
  const s = map[status] || { label: status, color: '#888' };
  return (
    <span style={{
      fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.7rem',
      borderRadius: '50px', background: `${s.color}18`, color: s.color
    }}>
      {s.label}
    </span>
  );
}
