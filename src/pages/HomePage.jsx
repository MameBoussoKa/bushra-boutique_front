import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { ArrowLeft, ArrowRight, Leaf, PackageCheck, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { demoCategories, demoProducts } from '../utils/demoData';
import './HomePage.css';

function useHorizontalRail(syncKey) {
  const ref = useRef(null);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const update = () => {
      setCanPrevious(element.scrollLeft > 4);
      setCanNext(element.scrollLeft + element.clientWidth < element.scrollWidth - 4);
      const maxScroll = element.scrollWidth - element.clientWidth;
      setProgress(maxScroll > 0 ? element.scrollLeft / maxScroll : 0);
    };
    update();
    element.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      element.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [syncKey]);

  function move(direction) {
    const element = ref.current;
    if (!element) return;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    element.scrollBy({ left: direction * Math.max(element.clientWidth * 0.78, 240), behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  return { ref, canPrevious, canNext, progress, move };
}

function RailArrows({ rail, label }) {
  return (
    <div className="rail-arrows" aria-label={`Navigation ${label}`}>
      <button type="button" onClick={() => rail.move(-1)} disabled={!rail.canPrevious} aria-label={`Faire défiler ${label} vers la gauche`}>
        <ArrowLeft size={17} />
      </button>
      <button type="button" onClick={() => rail.move(1)} disabled={!rail.canNext} aria-label={`Faire défiler ${label} vers la droite`}>
        <ArrowRight size={17} />
      </button>
    </div>
  );
}

function categoryImage(name = '') {
  const value = name.toLowerCase();
  if (value.includes('encensoir') || value.includes('mabkhara') || value.includes('bois')) return '/encensoir1.png';
  if (value.includes('thiouraye') || value.includes('encens') || value.includes('bakhour') || value.includes('gow')) return '/gowe-thiouray.png';
  if (value.includes('parfum') || value.includes('spray') || value.includes('huile')) return '/sprays.png';
  if (value.includes('cadeau') || value.includes('coffret')) return '/encensoir4.png';
  return '/paniers-vetiver.png';
}

function ProductCarousel({ products, loading, title, label, id }) {
  const rail = useHorizontalRail(`${loading}-${products.length}`);
  return (
    <section className="home-collection" aria-labelledby={`${id}-title`}>
      <div className="home-section-heading">
        <div>
          {label && <p className="home-eyebrow">{label}</p>}
          <h2 id={`${id}-title`}>{title}</h2>
        </div>
        <RailArrows rail={rail} label={title.toLowerCase()} />
      </div>
      {loading ? (
        <div className="home-product-rail home-product-rail--loading" aria-label="Chargement des produits">
          {Array.from({ length: 5 }, (_, index) => <div className="home-product-skeleton" key={index}><div /><span /><span /></div>)}
        </div>
      ) : products.length ? (
        <div className="home-product-rail" ref={rail.ref} tabIndex="0" aria-label={title}>
          {products.map(product => <div className="home-product-rail__item" key={product.id}><ProductCard product={product} /></div>)}
        </div>
      ) : (
        <div className="home-rail-empty">
          <p>Les produits de cette sélection seront bientôt disponibles.</p>
        </div>
      )}
      <div className="rail-progress" aria-hidden="true"><span style={{ transform: `translateX(${rail.progress * 150}%)` }} /></div>
    </section>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('new');

  const availableProducts = products.length ? products : demoProducts;
  const hasRatings = availableProducts.some(product => Number(product.avg_rating) > 0);
  const hasFeatured = availableProducts.some(product => product.is_featured);
  const availableCategories = categories.length
    ? categories.slice(0, 7).map(item => ({ ...item, image: categoryImage(item.name), to: `/produits?category=${encodeURIComponent(item.id)}` }))
    : demoCategories.map(item => ({ ...item, image: categoryImage(item.name), to: `/produits?category=${encodeURIComponent(item.id)}` }));
  const categoryRail = useHorizontalRail(availableCategories.length);

  useEffect(() => {
    let active = true;
    Promise.allSettled([api.getProducts({ limit: 12 }), api.getCategories()]).then(([productResult, categoryResult]) => {
      if (!active) return;
      if (productResult.status === 'fulfilled') {
        const rows = productResult.value.data?.products || productResult.value.data || [];
        setProducts(Array.isArray(rows) && rows.length ? rows : demoProducts);
      } else {
        setProducts(demoProducts);
      }
      if (categoryResult.status === 'fulfilled') {
        const rows = categoryResult.value.data?.categories || categoryResult.value.data || [];
        setCategories(Array.isArray(rows) && rows.length ? rows : demoCategories);
      } else {
        setCategories(demoCategories);
      }
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!loading && ((activeTab === 'rating' && !hasRatings) || (activeTab === 'featured' && !hasFeatured))) {
      setActiveTab('new');
    }
  }, [activeTab, hasFeatured, hasRatings, loading]);

  const tabProducts = useMemo(() => {
    if (activeTab === 'rating') {
      const rated = availableProducts.filter(product => Number(product.avg_rating) > 0).sort((a, b) => Number(b.avg_rating) - Number(a.avg_rating));
      return rated;
    }
    if (activeTab === 'featured') {
      const featured = availableProducts.filter(product => product.is_featured);
      return featured;
    }
    return availableProducts;
  }, [activeTab, availableProducts]);

  const bestProducts = useMemo(() => {
    const rated = availableProducts.filter(product => Number(product.avg_rating) > 0).sort((a, b) => Number(b.avg_rating) - Number(a.avg_rating));
    return (rated.length ? rated : availableProducts).slice(0, 8);
  }, [availableProducts]);

  const tabs = [
    { id: 'new', label: 'À découvrir' },
    { id: 'rating', label: 'Les mieux notés' },
    { id: 'featured', label: 'En vedette' },
  ];

  return (
    <main className="home">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <div className="home-hero__image" aria-hidden="true" />
        <div className="home-hero__shade" aria-hidden="true" />
        <div className="home-hero__content">
          <p className="home-hero__eyebrow">Bushra Machallah · Dakar</p>
          <h1 id="home-hero-title">L’âme du Sénégal,<br /><em>au creux des senteurs</em></h1>
          <p>Encens, thiouraye et objets parfumés pour faire de chaque maison un lieu à part.</p>
          <Link to="/produits" className="home-hero__button">Explorer la boutique <ArrowRight size={15} /></Link>
        </div>
        <a className="home-hero__scroll" href="#univers" aria-label="Découvrir nos univers"><span /></a>
      </section>

      <section className="home-categories" id="univers" aria-label="Découvrir nos univers">
        <div className="home-categories__head">
          <p className="home-eyebrow">Choisissez votre univers</p>
          <RailArrows rail={categoryRail} label="les univers" />
        </div>
        <div className="home-category-rail" ref={categoryRail.ref} tabIndex="0" aria-label="Défiler dans les univers Bushra">
          {availableCategories.map(category => (
            <Link className="home-category" to={category.to} key={category.id}>
              <span className="home-category__image"><img src={category.image} alt="" loading="lazy" /></span>
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
        <div className="rail-progress" aria-hidden="true"><span style={{ transform: `translateX(${categoryRail.progress * 150}%)` }} /></div>
      </section>

      <section className="home-shop-section" aria-labelledby="shop-tabs-title">
        <div className="home-tab-row" role="group" aria-label="Sélections de produits">
          {tabs.map(tab => (
            <button type="button" id={`tab-${tab.id}`} aria-pressed={activeTab === tab.id} className={activeTab === tab.id ? 'is-active' : ''} key={tab.id} disabled={!loading && ((tab.id === 'rating' && !hasRatings) || (tab.id === 'featured' && !hasFeatured))} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
          ))}
        </div>
        <div className="home-tab-panel" id="home-tab-panel" aria-labelledby={`tab-${activeTab}`} aria-live="polite" key={activeTab}>
          <ProductCarousel
            id="shop-tabs"
            title={activeTab === 'new' ? 'Une sélection de senteurs' : activeTab === 'rating' ? 'Les mieux notés' : 'En vedette'}
            products={tabProducts.slice(0, 10)}
            loading={loading}
          />
        </div>
        <Link to="/produits" className="home-view-all">Voir toute la boutique <ArrowRight size={15} /></Link>
      </section>

      <section className="home-promo-categories" aria-label="Nos collections">
        <Link to="/produits?search=thiouraye" className="home-promo-tile">
          <img src="/gowe-thiouray.png" alt="Thiouraye Bushra" loading="lazy" />
          <span className="home-promo-tile__caption"><small>Nos collections</small><strong>Thiouraye & bakhour</strong><ArrowRight size={16} /></span>
        </Link>
        <Link to="/produits?search=encensoir" className="home-promo-tile">
          <img src="/Image collée.png" alt="L’univers des encensoirs Bushra" loading="lazy" />
          <span className="home-promo-tile__caption"><small>Le geste parfumé</small><strong>Mabkhara & encensoirs</strong><ArrowRight size={16} /></span>
        </Link>
      </section>

      <div className="home-best-section">
        <ProductCarousel id="best-of" title="Sélection Bushra" label="Une sélection à découvrir" products={bestProducts} loading={loading} />
      </div>

      <div className="home-service-marquee" aria-label="Services Bushra">
        <div className="home-service-marquee__track">
          {Array.from({ length: 2 }, (_, repeat) => (
            <span className="home-service-marquee__set" key={repeat} aria-hidden={repeat === 1}>
              <span>Livraison offerte dès 25 000 FCFA</span><Sparkles size={16} />
              <span>Paiement à la livraison</span><Sparkles size={16} />
              <span>Wave · Orange Money</span><Sparkles size={16} />
              <span>Suivi de commande en ligne</span><Sparkles size={16} />
            </span>
          ))}
        </div>
      </div>

      <section className="home-signature">
        <div className="home-signature__photo">
          <img src="/bacground-image.png" alt="L’univers Bushra Machallah à Dakar" loading="lazy" />
          <span className="home-signature__stamp">Bushra<br />Machallah</span>
        </div>
        <div className="home-signature__copy">
          <p className="home-eyebrow">L’univers Bushra</p>
          <h2>Le parfum d’un geste,<br /><em>la mémoire d’une maison.</em></h2>
          <p>Du thiouraye aux encensoirs, chaque pièce accompagne les moments de partage et les rituels du quotidien. Une invitation à faire entrer les senteurs du Sénégal chez vous.</p>
          <Link to="/a-propos" className="home-text-link">Découvrir notre histoire <ArrowRight size={15} /></Link>
          <div className="home-signature__mini-products">
            {[
              { img: '/sprays.png', name: 'Parfums', to: '/produits?search=parfum' },
              { img: '/encensoir5.png', name: 'Mabkhara', to: '/produits?search=encensoir' },
              { img: '/paniers-vetiver.png', name: 'Vétiver', to: '/produits?search=vétiver' },
            ].map(item => <Link to={item.to} key={item.name}><img src={item.img} alt="" loading="lazy" /><span>{item.name}</span></Link>)}
          </div>
        </div>
      </section>

      <section className="home-ritual-banner">
        <img src="/Image collée.png" alt="" loading="lazy" />
        <div className="home-ritual-banner__overlay" />
        <div className="home-ritual-banner__copy">
          <p className="home-eyebrow">Un rituel Bushra</p>
          <h2>Une maison se raconte<br />aussi par son parfum.</h2>
          <Link to="/collections" className="home-hero__button">Trouver votre senteur <ArrowRight size={15} /></Link>
        </div>
      </section>

      <section className="home-gallery" aria-labelledby="home-gallery-title">
        <div className="home-section-heading home-section-heading--center">
          <div><p className="home-eyebrow">Dakar · Sénégal</p><h2 id="home-gallery-title">Dans l’univers Bushra</h2></div>
        </div>
        <div className="home-gallery__rail">
          {[
            { img: '/gowe-thiouray.png', alt: 'Thiouraye Bushra', to: '/produits?search=thiouraye' },
            { img: '/encensoir2.png', alt: 'Encensoir doré', to: '/produits?search=encensoir' },
            { img: '/sprays.png', alt: 'Parfums en spray', to: '/produits?search=parfum' },
            { img: '/encensoir6.png', alt: 'Mabkhara artisanale', to: '/produits?search=mabkhara' },
            { img: '/paniers-vetiver.png', alt: 'Vétiver naturel', to: '/produits?search=vétiver' },
          ].map(image => <Link key={image.img} to={image.to}><img src={image.img} alt={image.alt} loading="lazy" /></Link>)}
        </div>
      </section>

      <section className="home-stories" aria-labelledby="home-stories-title">
        <div className="home-section-heading home-section-heading--center">
          <div><p className="home-eyebrow">Notes de la maison</p><h2 id="home-stories-title">Les rituels Bushra</h2></div>
        </div>
        <div className="home-stories__grid">
          {[
            { image: '/gowe-thiouray.png', title: 'Le thiouraye, un parfum de partage', text: 'Une senteur qui accompagne les moments précieux de la maison.', to: '/produits?search=thiouraye' },
            { image: '/encensoir1.png', title: 'Choisir son encensoir', text: 'Trouver la pièce qui s’accorde à votre rituel et à votre intérieur.', to: '/produits?search=encensoir' },
            { image: '/sprays.png', title: 'Une touche parfumée au quotidien', text: 'Quelques gestes simples pour accueillir les senteurs chez soi.', to: '/collections' },
          ].map(story => (
            <article className="home-story-card" key={story.title}>
              <Link to={story.to} className="home-story-card__image"><img src={story.image} alt="" loading="lazy" /></Link>
              <div className="home-story-card__copy"><p className="home-eyebrow">Journal Bushra</p><h3>{story.title}</h3><p>{story.text}</p><Link to={story.to}>Lire la suite <ArrowRight size={14} /></Link></div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-trust-strip" aria-label="Services et informations">
        <div><Truck size={26} /><h3>Livraison</h3><p>Offerte dès 25 000 FCFA</p></div>
        <div><PackageCheck size={26} /><h3>Paiement simple</h3><p>À la livraison, Wave ou Orange Money</p></div>
        <div><ShieldCheck size={26} /><h3>Commande suivie</h3><p>Retrouvez les étapes de votre livraison</p><Link to="/commande/suivi">Suivre ma commande</Link></div>
        <div><Leaf size={26} /><h3>Maison sénégalaise</h3><p>Des senteurs inspirées d’ici</p></div>
      </section>
    </main>
  );
}
