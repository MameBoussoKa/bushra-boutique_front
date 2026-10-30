import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { Search, SlidersHorizontal, X, ArrowUpDown, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

const LIMIT = 12;

// Catalogue de secours affiché si l'API est indisponible (fiches non commandables)
const DEFAULT_PRODUCTS = [
  { id: 'demo-p1', name: 'Mabkhara Prestige Bushra', category_name: 'Encensoirs', price: 25000, compare_price: 32000, is_featured: true, image_url: '/encensoir1.png', avg_rating: 5, review_count: 24 },
  { id: 'demo-p2', name: 'Mabkhara Tagine Doré', category_name: 'Encensoirs', price: 20000, is_featured: true, image_url: '/encensoir2.png', avg_rating: 4.9, review_count: 18 },
  { id: 'demo-p3', name: 'Thiouraye Gowé & Bushra Velours', category_name: 'Thiouraye', price: 15000, compare_price: 18500, is_featured: true, image_url: '/gowe-thiouray.png', avg_rating: 5, review_count: 42 },
  { id: 'demo-p4', name: 'Mabkhara Bois & Cristal Diég Bi', category_name: 'Encensoirs', price: 30000, compare_price: 40000, is_featured: true, image_url: '/encensoir5.png', avg_rating: 5, review_count: 31 },
  { id: 'demo-p5', name: "Trio Brumes d'Intérieur d'Exception", category_name: 'Sprays', price: 18000, is_featured: true, image_url: '/sprays.png', avg_rating: 4.8, review_count: 19 },
  { id: 'demo-p6', name: 'Mabkhara Contemporaine Rokhaya', category_name: 'Encensoirs', price: 25000, is_featured: true, image_url: '/encensoir4.png', avg_rating: 4.9, review_count: 15 },
  { id: 'demo-p7', name: 'Mabkhara Design Kenza', category_name: 'Encensoirs', price: 20000, is_featured: true, image_url: '/encensoir3.png', avg_rating: 4.7, review_count: 12 },
  { id: 'demo-p8', name: 'Paniers Vétiver Purifiants & Thiep', category_name: 'Maison', price: 8000, is_featured: true, image_url: '/paniers-vetiver.png', avg_rating: 5, review_count: 27 },
  { id: 'demo-p9', name: 'Mabkhara Olivia Cuivrée', category_name: 'Encensoirs', price: 30000, is_new: true, image_url: '/encensoir6.png', avg_rating: 4.8, review_count: 6 },
];

const FALLBACK_CHIPS = [
  { value: 'encensoirs', label: 'Encensoirs' },
  { value: 'thiouraye', label: 'Thiouraye' },
  { value: 'gowe', label: 'Gowé' },
  { value: 'sprays', label: 'Sprays' },
  { value: 'maison', label: 'Maison' },
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Coups de cœur' },
  { value: 'newest', label: 'Nouveautés' },
  { value: 'price-asc', label: 'Prix : croissant' },
  { value: 'price-desc', label: 'Prix : décroissant' },
];

function filterDemoCatalog({ search, category, minPrice, maxPrice, sortBy }) {
  let list = [...DEFAULT_PRODUCTS];

  if (search) {
    const needle = search.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(needle));
  }
  if (category) {
    list = list.filter(p =>
      p.category_name.toLowerCase().includes(category.toLowerCase()) ||
      category.toLowerCase().includes(p.category_name.toLowerCase())
    );
  }
  if (minPrice) list = list.filter(p => p.price >= Number(minPrice));
  if (maxPrice) list = list.filter(p => p.price <= Number(maxPrice));

  if (sortBy === 'price-asc')  list.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);

  return list;
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const searchParam = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const featured = searchParams.get('featured') === 'true';
  const sortBy = searchParams.get('sort') || 'featured';

  // Saisie locale de la recherche (envoyée après 400 ms d'inactivité)
  const [searchInput, setSearchInput] = useState(searchParam);
  const searchTimer = useRef(null);

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  useEffect(() => {
    let cancelled = false;
    api.getCategories()
      .then(res => {
        if (!cancelled) setCategories(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });
    return () => { cancelled = true; };
  }, []);

  const filtersKey = `${searchParam}|${category}|${minPrice}|${maxPrice}|${featured}|${sortBy}`;
  const previousFiltersKey = useRef(filtersKey);

  useEffect(() => {
    const filtersChanged = previousFiltersKey.current !== filtersKey;
    previousFiltersKey.current = filtersKey;

    // Les filtres changent : on repart de la première page
    const targetPage = filtersChanged ? 1 : page;

    let cancelled = false;
    const isFirstPage = targetPage === 1;

    if (isFirstPage) setLoading(true);
    else setLoadingMore(true);

    const params = { page: targetPage, limit: LIMIT, sort: sortBy };
    if (searchParam) params.search = searchParam;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (featured) params.featured = 'true';

    api.getProducts(params)
      .then(res => {
        if (cancelled) return;
        const fetched = res.data?.products || [];
        const serverTotal = Number(res.data?.total ?? fetched.length);

        if (serverTotal > 0) {
          setProducts(prev => (isFirstPage ? fetched : [...prev, ...fetched]));
          setTotal(serverTotal);
          setPages(res.data?.pages || 1);
        } else if (isFirstPage) {
          // API sans résultat : on affiche le catalogue de secours (démo)
          const demo = filterDemoCatalog({ search: searchParam, category, minPrice, maxPrice, sortBy });
          setProducts(demo);
          setTotal(demo.length);
          setPages(1);
        }
      })
      .catch(() => {
        if (cancelled || !isFirstPage) return;
        const demo = filterDemoCatalog({ search: searchParam, category, minPrice, maxPrice, sortBy });
        setProducts(demo);
        setTotal(demo.length);
        setPages(1);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
        setLoadingMore(false);
      });

    return () => { cancelled = true; };
  }, [filtersKey, page, searchParam, category, minPrice, maxPrice, featured, sortBy]);

  useEffect(() => () => clearTimeout(searchTimer.current), []);

  const chipCategories = useMemo(() => {
    if (!categories.length) return FALLBACK_CHIPS;
    return categories.map(c => ({ value: c.slug || c.id, label: c.name }));
  }, [categories]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setPage(1);
    setSearchParams(next);
  }

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearchInput(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => updateParam('search', value), 400);
  }

  function handleClearFilters() {
    setPage(1);
    setSearchInput('');
    setSearchParams({});
  }

  const activeFiltersCount = [searchParam, category, minPrice, maxPrice, featured ? 'true' : '']
    .filter(Boolean).length;

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="products-page__hero">
        <div className="container products-page__hero-inner">
          <span className="label products-page__label">
            <Sparkles size={14} /> Boutique Officielle Bushra
          </span>
          <h1 className="display-lg products-page__title">
            {searchParam ? `Recherche : « ${searchParam} »` : 'Toutes nos collections de senteurs'}
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
              value={searchInput}
              onChange={handleSearchChange}
              className="products-page__search-input"
              aria-label="Rechercher un produit"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  clearTimeout(searchTimer.current);
                  setSearchInput('');
                  updateParam('search', '');
                }}
                className="products-page__search-clear"
                aria-label="Effacer la recherche"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container products-page__body">
        {/* Category chips bar */}
        <div className="products-chips-bar">
          <button
            type="button"
            className={`products-chip ${!category ? 'products-chip--active' : ''}`}
            onClick={() => updateParam('category', '')}
          >
            {`Tous${total ? ` (${total})` : ''}`}
          </button>
          {chipCategories.map(cat => (
            <button
              key={cat.value}
              type="button"
              className={`products-chip ${category === cat.value ? 'products-chip--active' : ''}`}
              onClick={() => updateParam('category', cat.value)}
            >
              {cat.label}
            </button>
          ))}
          <button
            type="button"
            className={`products-chip ${featured ? 'products-chip--active' : ''}`}
            onClick={() => updateParam('featured', featured ? '' : 'true')}
          >
            Sélection
          </button>
        </div>

        {/* Toolbar: sort & filter triggers */}
        <div className="products-toolbar">
          <div className="products-toolbar__left">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(open => !open)}
              className="products-filter-toggle btn btn--outline btn--sm"
              aria-expanded={mobileFilterOpen}
            >
              <SlidersHorizontal size={15} />
              <span>Filtres de prix</span>
            </button>
            <span className="products-count-text">
              {total} produit{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
            </span>
            {activeFiltersCount > 0 && (
              <button type="button" onClick={handleClearFilters} className="btn btn--ghost btn--sm">
                Réinitialiser
              </button>
            )}
          </div>

          <div className="products-toolbar__right">
            <div className="products-sort-wrap">
              <ArrowUpDown size={15} className="products-sort-icon" />
              <select
                value={sortBy}
                onChange={event => updateParam('sort', event.target.value)}
                className="products-sort-select"
                aria-label="Trier les produits"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Expandable price filter panel */}
        <div className={`products-price-drawer ${mobileFilterOpen ? 'products-price-drawer--open' : ''}`}>
          <div className="products-price-drawer__inner">
            <span className="label" style={{ color: 'var(--color-gold)' }}>Fourchette de prix (FCFA)</span>
            <div className="products-price-inputs">
              <input
                type="number"
                min="0"
                placeholder="Min FCFA"
                value={minPrice}
                onChange={event => updateParam('minPrice', event.target.value)}
                className="products-price-input"
                aria-label="Prix minimum"
              />
              <span className="products-price-sep">—</span>
              <input
                type="number"
                min="0"
                placeholder="Max FCFA"
                value={maxPrice}
                onChange={event => updateParam('maxPrice', event.target.value)}
                className="products-price-input"
                aria-label="Prix maximum"
              />
              {(minPrice || maxPrice) && (
                <button
                  type="button"
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.delete('minPrice');
                    next.delete('maxPrice');
                    setPage(1);
                    setSearchParams(next);
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
              {[...Array(8)].map((_, index) => (
                <div key={index} className="skeleton-card">
                  <div className="skeleton-img" />
                  <div className="skeleton-text" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {page < pages && (
                <div className="products-load-more">
                  <button
                    type="button"
                    className="btn btn--outline"
                    onClick={() => setPage(current => current + 1)}
                    disabled={loadingMore}
                  >
                    {loadingMore ? 'Chargement…' : 'Charger plus de produits'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="products-empty">
              <Search size={48} className="products-empty__icon" />
              <h3 className="products-empty__title">Aucun produit ne correspond à vos critères</h3>
              <p className="products-empty__desc">
                Essayez d'ajuster votre recherche ou réinitialisez les filtres pour découvrir toute la collection.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
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
