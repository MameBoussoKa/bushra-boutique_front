import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { ArrowRight, Flame, Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { demoCategories, getDemoCatalog } from '../utils/demoData';
import './ProductsPage.css';

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [priceDraft, setPriceDraft] = useState({ min: '', max: '' });

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const activeCategory = categories.find(item => String(item.id) === category);
  const queryKey = `${search}|${category}|${minPrice}|${maxPrice}`;
  const currentQuery = useRef(queryKey);
  currentQuery.current = queryKey;

  useEffect(() => {
    setPriceDraft({ min: minPrice, max: maxPrice });
  }, [minPrice, maxPrice]);

  useEffect(() => {
    let active = true;
    api.getCategories()
      .then(response => {
        if (!active) return;
        const rows = response.data?.categories || response.data || [];
        setCategories(Array.isArray(rows) && rows.length ? rows : demoCategories);
      })
      .catch(() => { if (active) setCategories(demoCategories); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setPage(1);
    setLoadingMore(false);
    setProducts([]);
    const params = { limit: PAGE_SIZE, page: 1 };
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    api.getProducts(params)
      .then(response => {
        if (!active) return;
        const rows = response.data?.products || response.data || [];
        if (Array.isArray(rows) && rows.length) {
          setProducts(rows);
          setTotal(response.data?.total ?? rows.length);
        } else {
          const demoRows = getDemoCatalog({ search, category, minPrice, maxPrice });
          setProducts(demoRows);
          setTotal(demoRows.length);
        }
      })
      .catch(() => {
        if (!active) return;
        const demoRows = getDemoCatalog({ search, category, minPrice, maxPrice });
        setProducts(demoRows);
        setTotal(demoRows.length);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [search, category, minPrice, maxPrice, retryCount]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  function applyPriceFilter(event) {
    event.preventDefault();
    const next = new URLSearchParams(searchParams);
    priceDraft.min ? next.set('minPrice', priceDraft.min) : next.delete('minPrice');
    priceDraft.max ? next.set('maxPrice', priceDraft.max) : next.delete('maxPrice');
    setSearchParams(next);
  }

  async function loadMore() {
    if (loadingMore) return;
    const nextPage = page + 1;
    const requestedQuery = queryKey;
    const params = { limit: PAGE_SIZE, page: nextPage };
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    setLoadingMore(true);
    setError('');
    try {
      const response = await api.getProducts(params);
      if (currentQuery.current !== requestedQuery) return;
      const rows = response.data?.products || response.data || [];
      setProducts(previous => {
        const existing = new Set(previous.map(product => String(product.id)));
        return [...previous, ...rows.filter(product => !existing.has(String(product.id)))];
      });
      setTotal(response.data?.total ?? total);
      setPage(nextPage);
    } catch {
      if (currentQuery.current === requestedQuery) setError('Impossible de charger les produits suivants. Réessayez.');
    } finally {
      setLoadingMore(false);
    }
  }

  const hasMore = products.length < total;

  return (
    <main className="products-page">
      <header className="catalog-hero">
        <div className="catalog-hero__image" aria-hidden="true" />
        <div className="catalog-hero__shade" aria-hidden="true" />
        <div className="container catalog-hero__content">
          <nav className="catalog-breadcrumb" aria-label="Fil d’Ariane">
            <Link to="/">Accueil</Link><span aria-hidden="true">/</span><span>Boutique</span>
          </nav>
          <p className="catalog-eyebrow">Bushra Machallah · Dakar</p>
          <h1>{search ? <>Résultats pour <em>« {search} »</em></> : activeCategory ? <>{activeCategory.name}<br /><em>avec caractère</em></> : <>L’art des senteurs<br /><em>du Sénégal</em></>}</h1>
          <p className="catalog-hero__intro">Des matières choisies, des gestes transmis et des parfums qui font de chaque intérieur un lieu à soi.</p>
          <a className="catalog-hero__link" href="#catalogue">Explorer la sélection <ArrowRight size={16} /></a>
        </div>
      </header>

      <section className="catalog-categories" aria-label="Parcourir par univers">
        <div className="container catalog-categories__inner">
          <span className="catalog-categories__label"><Flame size={16} /> Nos univers</span>
          <div className="catalog-categories__list">
            <button type="button" aria-pressed={!category} className={!category ? 'is-active' : ''} onClick={() => updateParam('category', '')}>Tout découvrir</button>
            {categories.map(item => (
              <button type="button" key={item.id} aria-pressed={category === String(item.id)} className={category === String(item.id) ? 'is-active' : ''} onClick={() => updateParam('category', item.id)}>{item.name}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="container catalog-section" id="catalogue">
        <div className="catalog-heading">
          <div>
            <p className="catalog-eyebrow catalog-eyebrow--ink">La sélection Bushra</p>
            <h2>{activeCategory?.name || (search ? 'Votre recherche' : 'Tous nos produits')}</h2>
          </div>
          <div className="catalog-heading__meta">
            <span>{loading ? 'Chargement…' : `${total} article${total > 1 ? 's' : ''}`}</span>
            <button className={`catalog-filter-toggle ${filtersOpen ? 'is-active' : ''}`} aria-expanded={filtersOpen} aria-controls="catalog-filters" onClick={() => setFiltersOpen(open => !open)}>
              {filtersOpen ? <X size={16} /> : <SlidersHorizontal size={16} />} {filtersOpen ? 'Fermer' : 'Filtrer'}
            </button>
          </div>
        </div>

        <div className="catalog-layout">
          <aside id="catalog-filters" className={`catalog-filters ${filtersOpen ? 'catalog-filters--open' : ''}`} aria-label="Filtres produits">
            <div className="catalog-filters__head"><h3>Affiner la sélection</h3><span>01 — 02</span></div>
            <fieldset className="catalog-filter-group">
              <legend>Univers</legend>
              <label className="catalog-radio"><input type="radio" name="category" checked={!category} onChange={() => updateParam('category', '')} /><span>Tous les produits</span></label>
              {categories.map(item => (
                <label className="catalog-radio" key={item.id}><input type="radio" name="category" checked={category === String(item.id)} onChange={() => updateParam('category', item.id)} /><span>{item.name}</span></label>
              ))}
            </fieldset>
            <fieldset className="catalog-filter-group">
              <legend>Budget · FCFA</legend>
              <form onSubmit={applyPriceFilter}>
                <div className="catalog-price-range">
                  <label><span className="sr-only">Prix minimum</span><input type="number" min="0" max={priceDraft.max || undefined} inputMode="numeric" placeholder="Min" value={priceDraft.min} onChange={event => setPriceDraft(current => ({ ...current, min: event.target.value }))} /></label>
                  <span aria-hidden="true">—</span>
                  <label><span className="sr-only">Prix maximum</span><input type="number" min={priceDraft.min || 0} inputMode="numeric" placeholder="Max" value={priceDraft.max} onChange={event => setPriceDraft(current => ({ ...current, max: event.target.value }))} /></label>
                </div>
                <button className="catalog-reset" type="submit">Appliquer le budget</button>
              </form>
            </fieldset>
            {(search || category || minPrice || maxPrice) && <button className="catalog-reset" onClick={() => setSearchParams({})}>Effacer les filtres</button>}
          </aside>

          <div className="catalog-results" aria-live="polite">
            {loading ? (
              <div className="catalog-grid catalog-grid--loading" aria-label="Chargement des produits">
                {Array.from({ length: 8 }, (_, index) => <div className="catalog-skeleton" key={index}><div /><span /><span /></div>)}
              </div>
            ) : error && products.length === 0 ? (
            <div className="catalog-message"><p>{error}</p><button className="catalog-message__action" onClick={() => setRetryCount(count => count + 1)}>Réessayer</button></div>
            ) : products.length ? (
              <>
                <div className="catalog-grid">{products.map(product => <ProductCard key={product.id} product={product} />)}</div>
                {error && <p className="catalog-inline-error" role="alert">{error}</p>}
                {hasMore && <div className="catalog-more"><button onClick={loadMore} disabled={loadingMore}>{loadingMore ? 'Chargement…' : 'Voir plus de produits'} <ArrowRight size={16} /></button></div>}
              </>
            ) : (
              <div className="catalog-message"><Search size={28} /><h3>Aucun produit trouvé</h3><p>Modifiez vos critères ou parcourez toute la boutique.</p><button className="catalog-message__action" onClick={() => setSearchParams({})}>Effacer les filtres</button></div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
