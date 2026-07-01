import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  // Set LIMIT to 0 to load all products at once
  const LIMIT = 12;
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    api.getCategories().then(r => setCategories(r.data || [])).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    const params = {};
    // when showing all, request a large limit so backend returns all rows
    if (!showAll) {
      params.limit = LIMIT;
      params.page = 1;
    } else {
      params.limit = 10000;
      params.page = 1;
    }
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    api.getProducts(params)
      .then(r => {
        setProducts(r.data?.products || r.data || []);
        setTotal(r.data?.total ?? (Array.isArray(r.data) ? (r.data.length) : (r.data?.products?.length || 0)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, category, minPrice, maxPrice, showAll]);

  function updateParam(key, value) {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value);
    else p.delete(key);
    setSearchParams(p);
  }

  function loadMore() {
    // If showing all, there's no pagination
    if (showAll) return;
    const nextPage = page + 1;
    const params = { limit: LIMIT, page: nextPage };
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    api.getProducts(params).then(r => {
      setProducts(prev => [...prev, ...(r.data?.products || r.data || [])]);
      setPage(nextPage);
    });
  }

  const hasMore = !showAll && LIMIT > 0 && products.length < total;

  return (
    <div className="products-page">
      {/* Page header */}
      <div className="products-page__header">
        <div className="container">
          <span className="label" style={{ color: 'var(--color-amber)' }}>Notre boutique</span>
          <h1 className="display-md" style={{ marginTop: '0.5rem' }}>
            {search ? `Résultats pour "${search}"` : 'Tous nos produits'}
          </h1>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
              <p style={{ color: 'var(--color-smoke)', margin: 0 }}>
                {total > 0 ? `${total} produit${total > 1 ? 's' : ''}` : 'Découvrez notre sélection'}
              </p>
              <div>
                {!showAll ? (
                  <button className="btn btn--ghost" onClick={() => setShowAll(true)}>
                    Afficher tout
                  </button>
                ) : (
                  <button className="btn btn--ghost" onClick={() => setShowAll(false)}>
                    Utiliser pagination
                  </button>
                )}
              </div>
            </div>
        </div>
      </div>

      <div className="container products-page__body">
        {/* Filters sidebar */}
        <aside className="filters">
          <div className="filters__section">
            <h3 className="filters__title label">Catégories</h3>
            <ul className="filters__list">
              <li>
                <button
                  className={`filters__item ${!category ? 'filters__item--active' : ''}`}
                  onClick={() => updateParam('category', '')}
                >
                  Tous les produits
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    className={`filters__item ${category === String(cat.id) ? 'filters__item--active' : ''}`}
                    onClick={() => updateParam('category', cat.id)}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filters__section">
            <h3 className="filters__title label">Prix (FCFA)</h3>
            <div className="filters__price">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={e => updateParam('minPrice', e.target.value)}
                className="filters__price-input"
              />
              <span>—</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={e => updateParam('maxPrice', e.target.value)}
                className="filters__price-input"
              />
            </div>
          </div>

          {(search || category || minPrice || maxPrice) && (
            <button
              className="filters__reset"
              onClick={() => setSearchParams({})}
            >
              Réinitialiser les filtres
            </button>
          )}
        </aside>

        {/* Products */}
        <div className="products-page__content">
          {loading ? (
            <div className="products-grid products-grid--4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-img" />
                  <div className="skeleton-text" />
                  <div className="skeleton-text skeleton-text--short" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="products-grid products-grid--3">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
                  <button className="btn btn--outline" onClick={loadMore}>
                    Voir plus de produits
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <Search size={48} strokeWidth={1.5} color="var(--color-amber)" style={{ marginBottom: '1rem' }} />
              <p>Aucun produit trouvé.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Essayez de modifier vos filtres ou{' '}
                <button className="btn btn--ghost" onClick={() => setSearchParams({})}>
                  réinitialisez la recherche
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
