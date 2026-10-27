import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { Search, SlidersHorizontal, X, ArrowUpDown, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

const DEFAULT_PRODUCTS = [
  { id: 'p1', name: 'Mabkhara Prestige Bushra', category_name: 'Encensoirs', price: 25000, compare_price: 32000, is_featured: true, image_url: '/encensoir1.png', avg_rating: 5, review_count: 24 },
  { id: 'p2', name: 'Mabkhara Tagine Doré', category_name: 'Encensoirs', price: 20000, is_featured: true, image_url: '/encensoir2.png', avg_rating: 4.9, review_count: 18 },
  { id: 'p3', name: 'Thiouraye Gowé & Bushra Velours', category_name: 'Thiouraye', price: 15000, compare_price: 18500, is_featured: true, image_url: '/gowe-thiouray.png', avg_rating: 5, review_count: 42 },
  { id: 'p4', name: 'Mabkhara Bois & Cristal Diég Bi', category_name: 'Encensoirs', price: 30000, compare_price: 40000, is_featured: true, image_url: '/encensoir5.png', avg_rating: 5, review_count: 31 },
  { id: 'p5', name: 'Trio Brumes d\'Intérieur d\'Exception', category_name: 'Sprays', price: 18000, is_featured: true, image_url: '/sprays.png', avg_rating: 4.8, review_count: 19 },
  { id: 'p6', name: 'Mabkhara Contemporaine Rokhaya', category_name: 'Encensoirs', price: 25000, is_featured: true, image_url: '/encensoir4.png', avg_rating: 4.9, review_count: 15 },
  { id: 'p7', name: 'Mabkhara Design Kenza', category_name: 'Encensoirs', price: 20000, is_featured: true, image_url: '/encensoir3.png', avg_rating: 4.7, review_count: 12 },
  { id: 'p8', name: 'Paniers Vétiver Purifiants & Thiep', category_name: 'Maison', price: 8000, is_featured: true, image_url: '/paniers-vetiver.png', avg_rating: 5, review_count: 27 },
  { id: 'p9', name: 'Mabkhara Olivia Cuivrée', category_name: 'Encensoirs', price: 30000, is_new: true, image_url: '/encensoir6.png', avg_rating: 4.8, review_count: 6 },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const LIMIT = 12;

  useEffect(() => {
    api.getCategories()
      .then(r => setCategories(r.data || []))
      .catch(() => {
        setCategories([
          { id: 'encensoirs', name: 'Encensoirs' },
          { id: 'thiouraye', name: 'Thiouraye' },
          { id: 'gowe', name: 'Gowé' },
          { id: 'sprays', name: 'Sprays' },
          { id: 'maison', name: 'Maison' },
        ]);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    const params = { limit: LIMIT, page: 1 };
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    api.getProducts(params)
      .then(r => {
        const fetched = r.data?.products || r.data || [];
        if (fetched.length > 0) {
          setProducts(fetched);
          setTotal(r.data?.total ?? fetched.length);
        } else {
          // Filter fallback list locally if api returns nothing
          let filtered = [...DEFAULT_PRODUCTS];
          if (search) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
          }
          if (category) {
            filtered = filtered.filter(p => p.category_name.toLowerCase().includes(category.toLowerCase()));
          }
          if (minPrice) {
            filtered = filtered.filter(p => p.price >= Number(minPrice));
          }
          if (maxPrice) {
            filtered = filtered.filter(p => p.price <= Number(maxPrice));
          }
          setProducts(filtered);
          setTotal(filtered.length);
        }
      })
      .catch(() => {
        let filtered = [...DEFAULT_PRODUCTS];
        if (search) {
          filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }
        if (category) {
          filtered = filtered.filter(p => p.category_name.toLowerCase().includes(category.toLowerCase()));
        }
        setProducts(filtered);
        setTotal(filtered.length);
      })
      .finally(() => setLoading(false));
  }, [search, category, minPrice, maxPrice]);

  function updateParam(key, value) {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value);
    else p.delete(key);
    setSearchParams(p);
  }

  function handleSortChange(newSort) {
    setSortBy(newSort);
    updateParam('sort', newSort);
  }

  // Client-side sort applied to active list
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = a.base_price || a.price || 0;
    const priceB = b.base_price || b.price || 0;
    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'newest') return (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0);
    return 0;
  });

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="products-page__hero">
        <div className="container products-page__hero-inner">
          <span className="label products-page__label">
            <Sparkles size={14} /> Boutique Officielle Bushra
          </span>
          <h1 className="display-lg products-page__title">
            {search ? `Recherche : "${search}"` : 'Toutes nos collections de senteurs'}
          </h1>
          <p className="products-page__subtitle">
            Explorez notre sélection artisanale d'encensoirs, de thiouray et de parfums d'ambiance d'exception.
          </p>

          {/* Quick search input */}
          <div className="products-page__search-wrap">
            <Search size={18} className="products-page__search-icon" />
            <input
              type="text"
              placeholder="Rechercher par nom, senteur ou modèle..."
              value={search}
              onChange={(e) => updateParam('search', e.target.value)}
              className="products-page__search-input"
            />
            {search && (
              <button
                onClick={() => updateParam('search', '')}
                className="products-page__search-clear"
                aria-label="Effacer"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container products-page__body">
        {/* Category quick chips bar */}
        <div className="products-chips-bar">
          <button
            className={`products-chip ${!category ? 'products-chip--active' : ''}`}
            onClick={() => updateParam('category', '')}
          >
            Tous ({total})
          </button>
          {['Encensoirs', 'Thiouraye', 'Gowé', 'Sprays', 'Maison'].map((catName) => (
            <button
              key={catName}
              className={`products-chip ${category.toLowerCase() === catName.toLowerCase() ? 'products-chip--active' : ''}`}
              onClick={() => updateParam('category', catName.toLowerCase())}
            >
              {catName}
            </button>
          ))}
        </div>

        {/* Toolbar: sort & filter triggers */}
        <div className="products-toolbar">
          <div className="products-toolbar__left">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="products-filter-toggle btn btn--outline btn--sm"
            >
              <SlidersHorizontal size={15} />
              <span>Filtres de prix</span>
            </button>
            <span className="products-count-text">
              {total} produit{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
            </span>
          </div>

          <div className="products-toolbar__right">
            <div className="products-sort-wrap">
              <ArrowUpDown size={15} className="products-sort-icon" />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="products-sort-select"
                aria-label="Trier les produits"
              >
                <option value="featured">Coups de cœur</option>
                <option value="newest">Nouveautés</option>
                <option value="price-asc">Prix : croissant</option>
                <option value="price-desc">Prix : décroissant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expandable Price Filter Drawer/Panel */}
        <div className={`products-price-drawer ${mobileFilterOpen ? 'products-price-drawer--open' : ''}`}>
          <div className="products-price-drawer__inner">
            <span className="label" style={{ color: 'var(--color-gold)' }}>Fourchette de prix (FCFA)</span>
            <div className="products-price-inputs">
              <input
                type="number"
                placeholder="Min FCFA"
                value={minPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                className="products-price-input"
              />
              <span className="products-price-sep">—</span>
              <input
                type="number"
                placeholder="Max FCFA"
                value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="products-price-input"
              />
              {(minPrice || maxPrice) && (
                <button
                  onClick={() => {
                    updateParam('minPrice', '');
                    updateParam('maxPrice', '');
                  }}
                  className="btn btn--ghost btn--sm"
                >
                  Effacer prix
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid-container">
          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-img" />
                  <div className="skeleton-text" />
                </div>
              ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="products-grid">
              {sortedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="products-empty">
              <Search size={48} className="products-empty__icon" />
              <h3 className="products-empty__title">Aucun produit ne correspond à vos critères</h3>
              <p className="products-empty__desc">
                Essayez d'ajuster votre recherche ou réinitialisez les filtres pour découvrir toute la collection.
              </p>
              <button
                onClick={() => setSearchParams({})}
                className="btn btn--primary"
                style={{ marginTop: '1.25rem' }}
              >
                Réinitialiser tous les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
