import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api, formatPrice, getImageUrl } from '../utils/api';
import { ArrowRight, Check, Search, ShoppingCart, Package, Sparkles, MessageCircle, Flame, FlaskConical, Gift } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import TransparentLogo from '../components/TransparentLogo';
import './HomePage.css';

/* ── Smoke particle SVG (ambient atmosphere) ─────────────── */
function SmokeParticle({ style }) {
  return (
    <div className="smoke-particle" style={style}>
      <svg viewBox="0 0 40 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 110 Q28 90 18 70 Q8 50 22 30 Q30 15 20 0"
          stroke="rgba(193,123,47,0.12)" strokeWidth="2" fill="none"
          strokeLinecap="round"/>
      </svg>
    </div>
  );
}

/* ── Counter animation ────────────────────────────────────── */
function AnimatedCounter({ to, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = Math.ceil(to / 60);
      const t = setInterval(() => {
        start += step;
        if (start >= to) { setVal(to); clearInterval(t); }
        else setVal(start);
      }, 20);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString('fr-FR')}{suffix}</span>;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSlide, setHeroSlide] = useState(0);

  const heroSlides = [
    {
      tag: 'Bushra Machallah',
      title: "L'Art de\nl'Encensoirs",
      subtitle: "Des senteurs authentiques façonnées avec passion au cœur du Sénégal. Chaque volute de fumée, une invitation au voyage intérieur.",
      cta: 'Découvrir la collection',
      ctaTo: '/produits',
      cta2: 'Voir toutes les senteurs',
      cta2To: '/produits',
      image: '/bacground-image.png',
    },
  ];

  useEffect(() => {
    Promise.all([
      api.getProducts({ featured: true, limit: 8 }),
      api.getCategories(),
    ])
      .then(([prod, cats]) => {
        setFeaturedProducts(prod.data?.products || prod.data || []);
        setCategories(cats.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroSlide(s => (s + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const slide = heroSlides[heroSlide];

  return (
    <main className="home">

      {/* ══════════════════════════════════════
          HERO — Plein écran, style référence
          ══════════════════════════════════════ */}
      <section className="hero">
        {/* Real background image with overlay */}
        <div
          className="hero__bg-image"
          style={{ backgroundImage: `url(${slide.image})` }}
          aria-hidden
        />
        {/* Dark overlay for text readability */}
        <div className="hero__overlay" aria-hidden />

        {/* Decorative smoke */}
        <div className="hero__smoke" aria-hidden>
          {[0,1,2,3].map(i => (
            <SmokeParticle key={i} style={{
              left: `${15 + i * 22}%`,
              bottom: '30%',
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${4 + i * 0.8}s`,
            }} />
          ))}
        </div>

        {/* Decorative gold lines */}
        <div className="hero__lines" aria-hidden>
          <div className="hero__line hero__line--left" />
          <div className="hero__line hero__line--right" />
        </div>

        {/* Content */}
        <div className="container hero__content">
          <div className="hero__inner" key={heroSlide}>
            {/* Tag pill — like in the reference */}
            {/* <div className="hero__tag animate-fadeUp">
              <span className="hero__tag-dot" />
              {slide.tag}
            </div> */}

            {/* Giant headline */}
            <h1 className="hero__title display-xl animate-fadeUp delay-100">
              {slide.title.split('\n').map((line, i) => (
                <span key={i} className="hero__title-line">
                  {i === 1 ? <em>{line}</em> : line}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="hero__subtitle body-lg animate-fadeUp delay-200">
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div className="hero__ctas animate-fadeUp delay-300">
              <Link to={slide.ctaTo} className="btn btn--primary hero__cta-primary">
                {slide.cta}
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <Link to={slide.cta2To} className="btn btn--outline">
                {slide.cta2}
              </Link>
            </div>

            {/* Slide indicators */}
            <div className="hero__dots animate-fadeUp delay-400">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  className={`hero__dot ${i === heroSlide ? 'hero__dot--active' : ''}`}
                  onClick={() => setHeroSlide(i)}
                  aria-label={`Diapositive ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          {/* <div className="hero__scroll animate-fadeIn delay-500">
            <div className="hero__scroll-line" />
            <span className="label">DÉFILER</span>
          </div> */}
        </div>

        {/* Incense product floating card */}
          {/* <div className="hero__float-card animate-fadeUp delay-300">
          <div className="hero__float-icon">
            <TransparentLogo src="/logo.png" alt="Bushra" width={44} height={44} tolerance={60} />
          </div>
          <div>
            <div className="hero__float-label label">Livraison à Dakar</div>
            <div className="hero__float-val">Dès 25 000 FCFA</div>
          </div>
        </div> */}
      </section>

      {/* ══════════════════════════════════════
          STATS BAND
          ══════════════════════════════════════ */}
      <section className="stats">
        <div className="container stats__grid">
          {[
            { n: 500, s: '+', label: 'Produits artisanaux' },
            { n: 2000, s: '+', label: 'Clients satisfaits' },
            { n: 10, s: ' ans', label: "d'expertise" },
            { n: 100, s: '%', label: 'Naturel & authentique' },
          ].map((stat, i) => (
            <div key={i} className="stats__item">
              <div className="stats__number display-md">
                <AnimatedCounter to={stat.n} suffix={stat.s} />
              </div>
              <div className="stats__label label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CATEGORIES GRID
          ══════════════════════════════════════ */}
      <section className="categories section">
        <div className="container">
          <header className="section-header">
            <span className="label" style={{ color: 'var(--color-amber)' }}>Nos univers</span>
            <h2 className="display-md section-header__title">Explorez nos collections</h2>
            <div className="divider divider--left" />
          </header>

          <div className="categories__grid">
            {categories.length > 0 ? categories.slice(0, 4).map((cat, i) => (
              <Link key={cat.id} to={`/produits?category=${cat.id}`} className={`cat-card cat-card--${i}`}>
                <div className="cat-card__inner">
                  <div className="cat-card__icon">
                    {getCategoryIcon(cat.name)}
                  </div>
                  <div className="cat-card__content">
                    <h3 className="cat-card__name heading">{cat.name}</h3>
                    {cat.description && (
                      <p className="cat-card__desc">{cat.description}</p>
                    )}
                    <span className="cat-card__cta">
                      Découvrir
                      <ArrowRight size={14} strokeWidth={2} />
                    </span>
                  </div>
                </div>
              </Link>
            )) : (
              /* Fallback static categories with real product images */
              [
                { name: 'Encensoirs', desc: 'tagines avec supports ', img: '/encensoir1.png' },
                { name: 'Thiouraye', desc: 'Gowé, velours & encensoirs 100% naturels Bushra', img: '/gowe-thiouray.png' },
                { name: 'Parfums & Sprays', desc: 'Nuage Secret, Fleur de Lune, Brume de Coton', img: '/sprays.png' },
                { name: 'paniers thiep & Naturels', desc: 'Paniers thiep & senteurs de la nature', img: '/paniers-vetiver.png' },
              ].map((cat, i) => (
                <Link key={i} to="/produits" className={`cat-card cat-card--${i}`}>
                  <div className="cat-card__inner">
                    <div className="cat-card__image-wrap">
                      <img src={cat.img} alt={cat.name} className="cat-card__img" />
                    </div>
                    <div className="cat-card__content">
                      <h3 className="cat-card__name heading">{cat.name}</h3>
                      <p className="cat-card__desc">{cat.desc}</p>
                      <span className="cat-card__cta">
                        Découvrir
                        <ArrowRight size={14} strokeWidth={2} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED PRODUCTS
          ══════════════════════════════════════ */}
      <section className="featured section">
        <div className="container">
          <header className="section-header section-header--row">
            <div>
              <span className="label" style={{ color: 'var(--color-amber)' }}>Sélection du moment</span>
              <h2 className="display-md section-header__title">Nos coups de cœur</h2>
              <div className="divider divider--left" />
            </div>
            <Link to="/produits" className="btn btn--ghost">
              Voir tout →
            </Link>
          </header>

          {loading ? (
            <div className="products-grid products-grid--skeleton">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-img" />
                  <div className="skeleton-text" />
                  <div className="skeleton-text skeleton-text--short" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            /* Vitrine statique avec les vraies images pendant que le backend charge */
            <div className="products-grid">
              {[
                { id: 's1', name: 'Models bushra ', category_name: 'Encensoirs', price: 25000, image_url: '/encensoir1.png' },
                { id: 's2', name: 'Models tagine', category_name: 'Encensoirs', price: 20000, compare_price: 25000, image_url: '/encensoir2.png' },
                { id: 's3', name: 'Models kenza', category_name: 'Encensoirs', price: 20000, image_url: '/encensoir3.png' },
                { id: 's4', name: 'Models rokhaya', category_name: 'Encensoirs', price: 25000, image_url: '/encensoir4.png' },
                { id: 's5', name: 'Models dieg bi', category_name: 'Encensoirs', price: 30000, compare_price: 42000, is_featured: true, image_url: '/encensoir5.png' },
                { id: 's6', name: 'Models Olivia', category_name: 'Encensoirs', price: 30000, image_url: '/encensoir6.png' },
                { id: 's7', name: 'Gowé Bushra & Bushra Velours', category_name: 'Thiouraye', price: 7500, image_url: '/gowe-thiouray.png' },
                { id: 's8', name: 'Paniers thiep', category_name: 'Accessoires', price: 8000, image_url: '/paniers-vetiver.png' },
              ].map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          BRAND STORY SECTION
          ══════════════════════════════════════ */}
      <section className="story section">
        <div className="container story__grid">
          <div className="story__visual">
            <div className="story__visual-inner">
              <img
                src="/bacground-image.png"
                alt="Bushra Machallah — L'art des senteurs sénégalaises"
                className="story__photo"
              />
              <div className="story__photo-badge">
                <TransparentLogo src="/logo.png" alt="Bushra Machallah" className="story__photo-logo" tolerance={60} />
              </div>
            </div>
          </div>

          <div className="story__content">
            <span className="label" style={{ color: 'var(--color-amber)' }}>Notre histoire</span>
            <h2 className="display-lg" style={{ marginTop: '0.75rem' }}>
              La tradition sénégalaise<br /><em>au service de vos sens</em>
            </h2>
            <div className="divider divider--left" />
            <p className="body-lg" style={{ color: 'var(--color-ash)', marginBottom: '1.5rem' }}>
              Bushra Machallah est née d'une passion pour les senteurs ancestrales du Sénégal. 
              Nous sélectionnons avec soin des encensoirs, thiouray et huiles parfumées auprès 
              d'artisans locaux, pour vous offrir une expérience olfactive authentique et raffinée.
            </p>
            <p className="body" style={{ color: 'var(--color-smoke)', marginBottom: '2rem' }}>
              Chaque produit raconte une histoire — celle des terres sénégalaises, de leurs 
              marchés colorés, de leurs traditions de parfumerie transmises de génération en génération. 
              Nos encensoirs sont façonnés par des artisans qui perpétuent un savoir-faire unique.
            </p>
            <div className="story__values">
              {['100% Naturel', 'Artisanal', 'Sénégalais', 'Certifié'].map(v => (
                <span key={v} className="story__value-tag">
                  <Check size={12} strokeWidth={2.5} color="var(--color-amber)" />
                  {v}
                </span>
              ))}
            </div>
            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/a-propos" className="btn btn--primary">Notre histoire complète</Link>
              <Link to="/contact" className="btn btn--outline">Nous contacter</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROCESS / HOW IT WORKS
          ══════════════════════════════════════ */}
      <section className="process section">
        <div className="container">
          <header className="section-header">
            <span className="label" style={{ color: 'var(--color-amber)' }}>Simple et rapide</span>
            <h2 className="display-md section-header__title">Comment commander ?</h2>
            <div className="divider" />
          </header>

          <div className="process__steps">
            {[
              { icon: <Search size={28} strokeWidth={1.5} />, title: 'Choisissez', desc: 'Parcourez notre catalogue et sélectionnez vos senteurs préférées.' },
              { icon: <ShoppingCart size={28} strokeWidth={1.5} />, title: 'Commandez', desc: 'Ajoutez vos articles au panier et passez votre commande en quelques clics.' },
              { icon: <Package size={28} strokeWidth={1.5} />, title: 'Livraison', desc: 'Nous préparons votre commande avec soin et vous la livrons à domicile.' },
              { icon: <Sparkles size={28} strokeWidth={1.5} />, title: 'Savourez', desc: 'Profitez de vos encensoirs et senteurs dans votre foyer. ' },
            ].map((step, i) => (
              <div key={i} className="process__step">
                <div className="process__step-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="process__step-icon">{step.icon}</div>
                <h3 className="process__step-title heading">{step.title}</h3>
                <p className="process__step-desc">{step.desc}</p>
                {i < 3 && <div className="process__connector" aria-hidden />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
          ══════════════════════════════════════ */}
      <section className="testimonials section">
        <div className="container">
          <header className="section-header">
            <span className="label" style={{ color: 'var(--color-amber)' }}>Ils nous font confiance</span>
            <h2 className="display-md section-header__title">Ce que disent nos clients</h2>
            <div className="divider" />
          </header>

          <div className="testimonials__grid">
            {[
              { name: 'Fatou Diallo', city: 'Dakar', text: "Les encensoirs sont d'une qualité exceptionnelle. L'odeur envahit toute la maison et rappelle les meilleurs marchés de Dakar. Je recommande vivement !", stars: 5 },
              { name: 'Aminata Sow', city: 'Saint-Louis', text: "L'encensoir que j'ai commandé est une véritable œuvre d'art. La livraison était rapide et l'emballage soigné. Parfait pour offrir.", stars: 5 },
              { name: 'Moussa Ndiaye', city: 'Thiès', text: "Je commande régulièrement ici. Les huiles parfumées sont authentiques et le service client est excellent. Une boutique à recommander !", stars: 5 },
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-card__stars">
                  {[...Array(t.stars)].map((_, s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="var(--color-amber)" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p className="testimonial-card__text">"{t.text}"</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="testimonial-card__name">{t.name}</div>
                    <div className="testimonial-card__city label">{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ORDER TRACKING CTA BANNER
          ══════════════════════════════════════ */}
      <section className="track-banner">
        <div className="container track-banner__inner">
          <div className="track-banner__content">
            <h2 className="display-md">Suivez votre commande</h2>
            <p style={{ color: 'var(--color-ash)' }}>
              Entrez votre numéro de commande et votre téléphone pour suivre votre livraison en temps réel.
            </p>
          </div>
          <Link to="/commande/suivi" className="btn btn--primary" style={{ flexShrink: 0 }}>
            Suivre ma commande →
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════
          NEWSLETTER / CONTACT BANNER
          ══════════════════════════════════════ */}
      <section className="newsletter section">
        <div className="container newsletter__inner">
          <div className="newsletter__deco" aria-hidden>
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" opacity="0.06">
              <circle cx="60" cy="60" r="58" stroke="var(--color-amber)" strokeWidth="1"/>
              <circle cx="60" cy="60" r="40" stroke="var(--color-amber)" strokeWidth="0.5"/>
              <circle cx="60" cy="60" r="20" stroke="var(--color-amber)" strokeWidth="0.5"/>
              <line x1="60" y1="2" x2="60" y2="118" stroke="var(--color-amber)" strokeWidth="0.5"/>
              <line x1="2" y1="60" x2="118" y2="60" stroke="var(--color-amber)" strokeWidth="0.5"/>
            </svg>
          </div>
          <div>
            <span className="label" style={{ color: 'var(--color-amber)' }}>Restez informé</span>
            <h2 className="display-md" style={{ marginTop: '0.5rem' }}>
              Rejoignez la communauté<br /><em>Bushra Machallah</em>
            </h2>
            <p style={{ color: 'var(--color-ash)', marginTop: '1rem', maxWidth: '480px' }}>
              Recevez en avant-première nos nouvelles collections, offres exclusives et conseils 
              pour sublimer votre intérieur avec l'art des senteurs.
            </p>
          </div>
          <div className="newsletter__form-wrap">
            <Link to="/contact" className="btn btn--primary">
              Nous contacter
            </Link>
            <a
              href="https://wa.me/221771234567?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20produits."
              target="_blank"
              rel="noreferrer"
              className="btn btn--outline"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function getCategoryIcon(name) {
  const n = name.toLowerCase();
  if (n.includes('encens') || n.includes('bakhour')) return <Flame size={28} strokeWidth={1.5} />;
  if (n.includes('encensoir') || n.includes('mabkhara')) return <FlaskConical size={28} strokeWidth={1.5} />;
  if (n.includes('huile') || n.includes('parfum') || n.includes('attar')) return <FlaskConical size={28} strokeWidth={1.5} />;
  if (n.includes('coffret') || n.includes('cadeau')) return <Gift size={28} strokeWidth={1.5} />;
  return <Sparkles size={28} strokeWidth={1.5} />;
}
