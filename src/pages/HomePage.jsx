import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Clock,
} from 'lucide-react';
import { api, formatPrice } from '../utils/api';
import { SHOP, whatsappLink } from '../utils/shop';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

// 7 Luxury Category Circles matching Olivra template layout
const CATEGORY_CARDS = [
  {
    name: 'Encensoirs & Mabkharas',
    slug: 'encensoirs',
    desc: 'Des modèles ciselés et raffinés pour sublimer vos rituels.',
    img: '/encensoir1.png',
    link: '/produits?category=encensoirs',
  },
  {
    name: 'Thiouraye Royal',
    slug: 'thiouraye',
    desc: 'Des senteurs authentiques et chaleureuses préparées selon la tradition.',
    img: '/gowe-thiouray.png',
    link: '/produits?category=thiouraye',
  },
  {
    name: 'Gowé Sénégalais',
    slug: 'gowe',
    desc: 'Graines de gowé macérées aux huiles précieuses et musc.',
    img: '/gowe-thiouray.png',
    link: '/produits?category=gowe',
  },
  {
    name: 'Brumes & Sprays',
    slug: 'sprays',
    desc: 'Des parfums d’ambiance d’une fraîcheur et tenue incomparables.',
    img: '/sprays.png',
    link: '/produits?category=sprays',
  },
  {
    name: 'Paniers & Vétiver',
    slug: 'maison',
    desc: 'Artisanat d’art et racines de khamaré pour la maison.',
    img: '/paniers-vetiver.png',
    link: '/produits?category=maison',
  },
  {
    name: 'Coffrets Prestige',
    slug: 'coffrets',
    desc: 'Des assortiments précieux pour vos cadeaux et célébrations.',
    img: '/encensoir5.png',
    link: '/produits?category=coffrets',
  },
  {
    name: 'Artisanat d’Art',
    slug: 'artisanat',
    desc: 'Créations sénégalaises authentiques d’exception.',
    img: '/encensoir2.png',
    link: '/produits?category=artisanat',
  },
];

// Product Tabs matching Olivra layout (New Launches, Best Seller, Features Items)
const PRODUCT_TABS = [
  { id: 'meilleures-ventes', label: 'MEILLEURES VENTES' },
  { id: 'nouveautes', label: 'NOUVEAUTÉS' },
  { id: 'coups-de-coeur', label: 'COUPS DE CŒUR' },
];

// High-fidelity fallback catalog items (ensures 100% visual completion when backend is offline)
const FALLBACK_BEST_SELLERS = [
  {
    id: 'fb-best-1',
    name: 'Encensoir Tagine Doré Prestige',
    category_name: 'Encensoirs',
    base_price: 18500,
    compare_price: 22000,
    avg_rating: 5,
    review_count: 28,
    primary_image: '/encensoir5.png',
    is_featured: true,
    countdown: '363 : 18 : 14 : 25',
  },
  {
    id: 'fb-best-2',
    name: 'Thiouraye Royal Oud & Ambre',
    category_name: 'Thiouraye',
    base_price: 12000,
    compare_price: 0,
    avg_rating: 5,
    review_count: 34,
    primary_image: '/gowe-thiouray.png',
    is_featured: true,
  },
  {
    id: 'fb-best-3',
    name: 'Mabkhara Céramique & Laiton Fin',
    category_name: 'Encensoirs',
    base_price: 25000,
    compare_price: 32000,
    avg_rating: 5,
    review_count: 19,
    primary_image: '/encensoir1.png',
    countdown: '363 : 18 : 14 : 25',
  },
  {
    id: 'fb-best-4',
    name: 'Brume Parfumée Nuage Secret',
    category_name: 'Sprays',
    base_price: 8500,
    compare_price: 0,
    avg_rating: 5,
    review_count: 42,
    primary_image: '/sprays.png',
  },
  {
    id: 'fb-best-5',
    name: 'Coffret Prestige Encensoir Ébène & Or',
    category_name: 'Coffrets',
    base_price: 35000,
    compare_price: 45000,
    avg_rating: 5,
    review_count: 15,
    primary_image: '/encensoir2.png',
    countdown: '363 : 18 : 14 : 25',
  },
];

const FALLBACK_NEW_LAUNCHES = [
  {
    id: 'fb-new-1',
    name: 'Encensoir Sculpté Bois & Laiton',
    category_name: 'Encensoirs',
    base_price: 22000,
    compare_price: 0,
    avg_rating: 5,
    review_count: 8,
    primary_image: '/encensoir3.png',
    is_new: true,
  },
  {
    id: 'fb-new-2',
    name: 'Gowé Supérieur Parfumé aux Épices',
    category_name: 'Gowé',
    base_price: 14000,
    compare_price: 0,
    avg_rating: 5,
    review_count: 12,
    primary_image: '/gowe-thiouray.png',
    is_new: true,
  },
  {
    id: 'fb-new-3',
    name: 'Spray Ambiance Fleur de Coton',
    category_name: 'Sprays',
    base_price: 8500,
    compare_price: 0,
    avg_rating: 5,
    review_count: 9,
    primary_image: '/sprays.png',
    is_new: true,
  },
  {
    id: 'fb-new-4',
    name: 'Mabkhara Contemporaine Cuivre & Bois',
    category_name: 'Encensoirs',
    base_price: 28000,
    compare_price: 0,
    avg_rating: 5,
    review_count: 14,
    primary_image: '/encensoir4.png',
    is_new: true,
  },
  {
    id: 'fb-new-5',
    name: 'Panier Vétiver Artisanal Tressé',
    category_name: 'Maison',
    base_price: 15000,
    compare_price: 0,
    avg_rating: 5,
    review_count: 7,
    primary_image: '/paniers-vetiver.png',
    is_new: true,
  },
];

const FALLBACK_FEATURES_ITEMS = [
  {
    id: 'fb-feat-1',
    name: 'Encensoir Mabkhara Dôme Royal',
    category_name: 'Encensoirs',
    base_price: 29000,
    compare_price: 35000,
    avg_rating: 5,
    review_count: 26,
    primary_image: '/encensoir6.png',
    is_featured: true,
  },
  {
    id: 'fb-feat-2',
    name: 'Thiouraye Traditionnel Souverain',
    category_name: 'Thiouraye',
    base_price: 13500,
    compare_price: 0,
    avg_rating: 5,
    review_count: 31,
    primary_image: '/gowe-thiouray.png',
    is_featured: true,
  },
  {
    id: 'fb-feat-3',
    name: 'Duo Brumes d’Intérieur Dakar & Almadies',
    category_name: 'Sprays',
    base_price: 16000,
    compare_price: 19000,
    avg_rating: 5,
    review_count: 18,
    primary_image: '/sprays.png',
    is_featured: true,
  },
  {
    id: 'fb-feat-4',
    name: 'Encensoir Minimaliste Porcelaine & Or',
    category_name: 'Encensoirs',
    base_price: 21000,
    compare_price: 0,
    avg_rating: 5,
    review_count: 15,
    primary_image: '/encensoir5.png',
    countdown: '363 : 18 : 14 : 25',
    is_featured: true,
  },
  {
    id: 'fb-feat-5',
    name: 'Coffret Rituel Complet Bushra',
    category_name: 'Coffrets',
    base_price: 48000,
    compare_price: 58000,
    avg_rating: 5,
    review_count: 22,
    primary_image: '/encensoir2.png',
    is_featured: true,
  },
];

// Spotlight Deal (The Best of the Best)
const SPOTLIGHT_DEAL = {
  id: 'spotlight-mabkhara-royal',
  name: 'Coffret Mabkhara Royal & Thiouraye d’Exception',
  eyebrow: 'ÉDITION LIMITÉE · THE BEST OF THE BEST',
  base_price: 35000,
  compare_price: 45000,
  discount: 22,
  rating: 5,
  reviewsCount: 58,
  image: '/encensoir5.png',
  description:
    'L’harmonie absolue entre la sculpture noble du bois, le laiton ciselé et un thiouraye aux huiles précieuses. Un sillage envoûtant d’exception pour sublimer chaque instant de votre intérieur.',
  countdownDays: 363,
  countdownHours: 18,
  countdownMins: 14,
  countdownSecs: 25,
  stockLeft: 6,
  stockTotal: 25,
};

const BENEFITS = [
  {
    icon: Sparkles,
    title: 'Qualité & authenticité',
    text: 'Des senteurs choisies avec soin auprès d’artisans du Sénégal.',
  },
  {
    icon: Truck,
    title: 'Livraison soignée',
    text: 'À Dakar et dans les régions, avec une attention particulière au colis.',
  },
  {
    icon: ShieldCheck,
    title: 'Paiement en sérénité',
    text: 'À la réception, par Wave ou Orange Money.',
  },
  {
    icon: MessageCircle,
    title: 'Conseil personnalisé',
    text: 'Notre équipe est disponible 7j/7 sur WhatsApp pour vous guider.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Fatou Diallo',
    city: 'Dakar (Almadies)',
    rating: 5,
    img: '/encensoir5.png',
    text: 'Les encensoirs sont d’une élégance rare et le thiouraye embaume tout mon salon pendant plusieurs jours. Un vrai rituel de paix !',
  },
  {
    name: 'Aminata Sow',
    city: 'Saint-Louis',
    rating: 5,
    img: '/gowe-thiouray.png',
    text: 'J’ai commandé le modèle Tagine avec le Gowé Bushra. La livraison a été très rapide et l’emballage était digne d’une grande maison de luxe.',
  },
  {
    name: 'Moussa Ndiaye',
    city: 'Thiès',
    rating: 5,
    img: '/paniers-vetiver.png',
    text: 'Service client exceptionnel sur WhatsApp. Ils m’ont conseillé le coffret idéal pour offrir à mon épouse. Elle était sous le charme !',
  },
  {
    name: 'Aïssatou Ba',
    city: 'Dakar (Plateau)',
    rating: 5,
    img: '/sprays.png',
    text: 'Les brumes de coton et sprays d’intérieur sont divins. Tout le monde me demande quelle est cette bonne odeur chez moi.',
  },
];

const MARQUEE_WORDS = [
  '100 % naturel',
  'Fait main au Sénégal',
  'Sans additif chimique',
  'Longue tenue garantie',
  'Encens & Thiouraye de prestige',
  'Artisanat d’art ancestral',
  'Qualité luxe certifiée',
];

const SIGNATURE_GALLERY = [
  { img: '/encensoir1.png', label: 'Encensoirs & Mabkharas' },
  { img: '/gowe-thiouray.png', label: 'Thiouraye & Gowé' },
  { img: '/sprays.png', label: 'Brumes d’intérieur' },
  { img: '/paniers-vetiver.png', label: 'Paniers & Maison' },
];

const SOCIALS = [
  { label: 'WhatsApp', href: whatsappLink(), type: 'whatsapp' },
  { label: 'Instagram', href: SHOP.instagram, type: 'instagram' },
  { label: 'TikTok', href: SHOP.tiktok, type: 'tiktok' },
];

const INSTAGRAM_FEED = [
  { img: '/encensoir1.png', tag: 'Mabkhara Prestige' },
  { img: '/gowe-thiouray.png', tag: 'Rituel Gowé' },
  { img: '/sprays.png', tag: 'Brumes parfumées' },
  { img: '/encensoir5.png', tag: 'L’art de l’encensoir' },
  { img: '/Image collée.png', tag: 'La maison Bushra' },
  { img: '/paniers-vetiver.png', tag: 'Vétiver traditionnel' },
];

function getProductList(response) {
  if (Array.isArray(response?.data?.products)) return response.data.products;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function slugify(value = '') {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
}

function InstagramMark({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function SocialIcon({ type, size = 16 }) {
  if (type === 'instagram') return <InstagramMark size={size} />;
  if (type === 'whatsapp') return <MessageCircle size={size} strokeWidth={1.8} />;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [activeTab, setActiveTab] = useState(PRODUCT_TABS[0].id);
  const [selectedCategory, setSelectedCategory] = useState('sprays');

  // L'offre en vedette est une présentation : la commande se finalise sur WhatsApp
  const spotlightOrderLink = whatsappLink(
    `Bonjour ${SHOP.name}, je suis intéressé(e) par l'offre « ${SPOTLIGHT_DEAL.name} » à ${formatPrice(SPOTLIGHT_DEAL.base_price)}. Est-elle disponible ?`
  );

  useEffect(() => {
    let isCurrent = true;

    Promise.allSettled([
      api.getProducts({ featured: true, limit: 8 }),
      api.getProducts({ limit: 8 }),
      api.getCategories(),
    ]).then(([featuredResult, newResult, categoriesResult]) => {
      if (!isCurrent) return;

      const featured = featuredResult.status === 'fulfilled'
        ? getProductList(featuredResult.value)
        : [];
      const latest = newResult.status === 'fulfilled'
        ? getProductList(newResult.value)
        : [];
      const categoryList = categoriesResult.status === 'fulfilled'
        ? categoriesResult.value?.data
        : [];

      setFeaturedProducts(featured);
      setNewProducts(latest);
      setCategories(Array.isArray(categoryList) ? categoryList : []);
    }).finally(() => {
      if (isCurrent) setLoading(false);
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSent(true);
      setNewsletterEmail('');
    }
  };

  const categoryCards = CATEGORY_CARDS.map((category) => {
    const matchingCategory = categories.find((item) => (
      item.slug === category.slug || slugify(item.name) === slugify(category.name)
    ));

    return {
      ...category,
      link: matchingCategory?.id
        ? `/produits?category=${encodeURIComponent(matchingCategory.id)}`
        : category.link,
    };
  });

  // Lien boutique d'un univers (identifiant réel de la catégorie quand elle existe)
  const linkForCategory = (slug) =>
    categoryCards.find((item) => item.slug === slug)?.link ?? '/produits';

  // Ensure full tabs display with seamless fallback
  const tabProducts = useMemo(() => {
    const apiLatest = newProducts.length > 0 ? newProducts : FALLBACK_NEW_LAUNCHES;
    const apiBest = featuredProducts.length > 0 ? featuredProducts : FALLBACK_BEST_SELLERS;
    const apiFeatures = [...newProducts, ...featuredProducts].length >= 5
      ? [...newProducts, ...featuredProducts]
      : FALLBACK_FEATURES_ITEMS;

    return {
      'meilleures-ventes': apiBest,
      nouveautes: apiLatest,
      'coups-de-coeur': apiFeatures,
    };
  }, [featuredProducts, newProducts]);

  const activeProducts = (tabProducts[activeTab] ?? []).slice(0, 5);

  return (
    <main className="home-page">
      {/* ═══════════════════════════════════════════════════
          1. HERO SECTION (Nature's Light, Refined Elegance)
          ═══════════════════════════════════════════════════ */}
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__photo" aria-hidden="true">
          <img src="/encensoir-hero.png" alt="" />
        </div>
        <div className="home-hero__veil" aria-hidden="true" />
        <div className="container home-hero__container">
          <div className="home-hero__copy">
            <h1 className="home-hero__title" id="home-title">
              Senteurs d’exception,
              <span>Lumière & Élégance</span>
            </h1>
            <div className="home-hero__actions">
              <Link to="/produits" className="home-button home-button--light home-button--hero">
                DÉCOUVRIR LA BOUTIQUE <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          2. 7 CIRCULAR CATEGORIES ROW (Overlapping Hero)
          ═══════════════════════════════════════════════════ */}
      <section className="home-categories" id="home-categories" aria-labelledby="home-categories-title">
        <h2 className="sr-only" id="home-categories-title">Nos univers de senteurs</h2>
        <div className="container">
          <div className="home-categories-grid">
            {categoryCards.map((category) => {
              const isActive = selectedCategory === category.slug;
              return (
                <Link
                  to={category.link}
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`home-category home-category--${category.slug} ${isActive ? 'home-category--active' : ''}`}
                >
                  <span className="home-category__image-wrap">
                    <img src={category.img} alt="" className="home-category__image" loading="lazy" />
                  </span>
                  <span className="home-category__name">
                    {category.name}
                    {isActive && <span className="home-category__indicator" aria-hidden="true" />}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3. TABBED PRODUCTS SHOWCASE (New Launches / Best Seller / Features Items)
          ═══════════════════════════════════════════════════ */}
      <section className="home-collection" aria-labelledby="home-collection-title">
        <div className="container">
          <div className="home-tabs" role="tablist" aria-label="Sélections de produits">
            {PRODUCT_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`home-tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls="home-collection-panel"
                tabIndex={activeTab === tab.id ? 0 : -1}
                className={`home-tab ${activeTab === tab.id ? 'home-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <h2 className="sr-only" id="home-collection-title">
            {PRODUCT_TABS.find((tab) => tab.id === activeTab)?.label ?? 'Nos sélections'}
          </h2>

          <div
            className="home-collection__panel"
            id="home-collection-panel"
            role="tabpanel"
            aria-labelledby={`home-tab-${activeTab}`}
          >
            <div className="home-collection__grid">
              {activeProducts.map((product) => (
                <ProductCard key={product.id} product={product} variant="home" />
              ))}
            </div>
          </div>

          <div className="home-collection__foot">
            <Link to="/produits" className="home-text-link">
              Voir toute la sélection <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. PROMOTIONAL BANNERS GRID (Shop By Categories)
          ═══════════════════════════════════════════════════ */}
      <section className="home-promos" aria-labelledby="home-promos-title">
        <h2 className="sr-only" id="home-promos-title">Nos collections en vedette</h2>
        <div className="container home-promos__inner">
          <Link
            to={linkForCategory('encensoirs')}
            className="home-promo home-promo--encensoirs"
          >
            <img
              src="/encensoir-hero.png"
              alt="Collection Encensoirs & Mabkharas"
              className="home-promo__image"
              loading="lazy"
            />
            <span className="home-promo__label">
              <span className="home-promo__eyebrow">Nos Collections</span>
              <span className="home-promo__title">Encensoirs & Mabkharas</span>
              <span className="home-promo__link">Explorer la collection <ArrowRight size={13} /></span>
            </span>
          </Link>

          <Link
            to={linkForCategory('thiouraye')}
            className="home-promo home-promo--gowe"
          >
            <img
              src="/gowe-thiouray.png"
              alt="Collection Thiouraye & Gowé de Prestige"
              className="home-promo__image"
              loading="lazy"
            />
            <span className="home-promo__label">
              <span className="home-promo__eyebrow">Nos Collections</span>
              <span className="home-promo__title">Thiouraye & Gowé Royal</span>
              <span className="home-promo__link">Explorer la collection <ArrowRight size={13} /></span>
            </span>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          5. SPOTLIGHT DEAL: "THE BEST OF THE BEST"
          ═══════════════════════════════════════════════════ */}
      <section className="home-spotlight" aria-labelledby="home-spotlight-title">
        <div className="container">
          <div className="home-spotlight__card">
            <div className="home-spotlight__media">
              <img
                src={SPOTLIGHT_DEAL.image}
                alt={SPOTLIGHT_DEAL.name}
                className="home-spotlight__img"
                loading="lazy"
              />
              <span className="home-spotlight__discount-badge">
                -{SPOTLIGHT_DEAL.discount}%
              </span>
            </div>

            <div className="home-spotlight__details">
              <span className="home-spotlight__eyebrow">
                <Sparkles size={13} /> {SPOTLIGHT_DEAL.eyebrow}
              </span>

              <h2 className="home-spotlight__title" id="home-spotlight-title">
                {SPOTLIGHT_DEAL.name}
              </h2>

              <div className="home-spotlight__rating">
                <div className="home-spotlight__stars" aria-label="5 étoiles sur 5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" stroke="none" />
                  ))}
                </div>
                <span className="home-spotlight__reviews">({SPOTLIGHT_DEAL.reviewsCount} avis vérifiés)</span>
              </div>

              <p className="home-spotlight__description">
                {SPOTLIGHT_DEAL.description}
              </p>

              <div className="home-spotlight__pricing">
                <span className="home-spotlight__price-current">
                  {formatPrice(SPOTLIGHT_DEAL.base_price)}
                </span>
                <span className="home-spotlight__price-old">
                  {formatPrice(SPOTLIGHT_DEAL.compare_price)}
                </span>
                <span className="home-spotlight__saved-tag">
                  Économisez {formatPrice(SPOTLIGHT_DEAL.compare_price - SPOTLIGHT_DEAL.base_price)}
                </span>
              </div>

              {/* Countdown Bar */}
              <div className="home-spotlight__countdown-bar">
                <div className="home-spotlight__countdown-header">
                  <Clock size={14} />
                  <span>Temps restant pour l’offre :</span>
                </div>
                <div className="home-spotlight__timer-grid">
                  <div className="home-spotlight__timer-cell">
                    <strong>{SPOTLIGHT_DEAL.countdownDays}</strong>
                    <small>Jours</small>
                  </div>
                  <span className="home-spotlight__timer-sep">:</span>
                  <div className="home-spotlight__timer-cell">
                    <strong>{SPOTLIGHT_DEAL.countdownHours}</strong>
                    <small>Heures</small>
                  </div>
                  <span className="home-spotlight__timer-sep">:</span>
                  <div className="home-spotlight__timer-cell">
                    <strong>{SPOTLIGHT_DEAL.countdownMins}</strong>
                    <small>Min</small>
                  </div>
                  <span className="home-spotlight__timer-sep">:</span>
                  <div className="home-spotlight__timer-cell home-spotlight__timer-cell--accent">
                    <strong>{SPOTLIGHT_DEAL.countdownSecs}</strong>
                    <small>Sec</small>
                  </div>
                </div>
              </div>

              {/* Stock Progress Bar */}
              <div className="home-spotlight__stock">
                <div className="home-spotlight__stock-info">
                  <span>Stock disponible :</span>
                  <strong>Plus que {SPOTLIGHT_DEAL.stockLeft} pièces en stock !</strong>
                </div>
                <div className="home-spotlight__stock-bar" aria-hidden="true">
                  <div
                    className="home-spotlight__stock-fill"
                    style={{
                      width: `${Math.round(((SPOTLIGHT_DEAL.stockTotal - SPOTLIGHT_DEAL.stockLeft) / SPOTLIGHT_DEAL.stockTotal) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="home-spotlight__actions">
                <a
                  href={spotlightOrderLink}
                  target="_blank"
                  rel="noreferrer"
                  className="home-button home-button--dark home-spotlight__btn-order"
                >
                  <MessageCircle size={16} /> COMMANDER SUR WHATSAPP
                </a>
                <Link to="/produits" className="home-button home-button--light home-spotlight__btn-more">
                  VOIR LES DÉTAILS <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          6. LUXURY MARQUEE TICKER RIBBON
          ═══════════════════════════════════════════════════ */}
      <section className="home-marquee" aria-hidden="true">
        <div className="home-marquee__track">
          {[0, 1].map((group) => (
            <div className="home-marquee__group" key={group}>
              {MARQUEE_WORDS.map((word) => (
                <span className="home-marquee__item" key={`${group}-${word}`}>
                  <Sparkles size={13} strokeWidth={1.6} />
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          7. BRAND STORY / EDITORIAL SECTION ("LA MAISON BUSHRA")
          ═══════════════════════════════════════════════════ */}
      <section className="home-signature" aria-labelledby="home-signature-title">
        <div className="container home-signature__inner">
          <div className="home-signature__panel">
            <img
              src="/Image collée.png"
              alt="L’art des senteurs de la maison Bushra Machallah à Dakar"
              className="home-signature__bg"
              loading="lazy"
            />
            <div className="home-signature__content">
              <span className="home-signature__eyebrow">La maison Bushra</span>
              <h2 className="home-signature__title" id="home-signature-title">
                L’art de parfumer votre maison
              </h2>
              <p className="home-signature__text">
                Encensoirs travaillés, thiouraye généreux, gowé de prestige : chaque pièce est choisie pour sa tenue, ses finitions et la justesse de son sillage.
              </p>
              <div className="home-signature__actions">
                <Link to="/collections" className="home-button home-button--light">
                  Explorer nos collections <ArrowRight size={15} />
                </Link>
                <a
                  href={whatsappLink('Bonjour, je souhaite un conseil pour choisir un parfum.')}
                  target="_blank"
                  rel="noreferrer"
                  className="home-signature__link"
                >
                  <MessageCircle size={15} /> Un conseil ? Écrivez-nous
                </a>
              </div>
            </div>
          </div>

          <div className="home-signature__gallery">
            {SIGNATURE_GALLERY.map((tile) => (
              <Link
                to="/produits"
                key={tile.label}
                className="home-signature__tile"
                aria-label={tile.label}
              >
                <img src={tile.img} alt={tile.label} loading="lazy" />
                <span className="home-signature__tile-label">{tile.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          8. INSTAGRAM / SOCIAL STRIP (@bushra_machallah)
          ═══════════════════════════════════════════════════ */}
      <section className="home-strip" aria-labelledby="home-strip-title">
        <h2 className="sr-only" id="home-strip-title">@bushra_machallah — nos rituels en images</h2>
        <div className="home-strip__grid">
          {INSTAGRAM_FEED.map((feed, index) => (
            <a
              key={`${feed.tag}-${index}`}
              href={SHOP.instagram}
              target="_blank"
              rel="noreferrer"
              className="home-strip__item"
              aria-label={`${feed.tag} — Instagram ${SHOP.name}`}
            >
              <img src={feed.img} alt={feed.tag} loading="lazy" />
              <span className="home-strip__overlay">
                <InstagramMark size={16} />
                <span>{feed.tag}</span>
              </span>
            </a>
          ))}
        </div>
        <div className="home-strip__foot">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="home-text-link">
            <InstagramMark size={15} /> @bushra_machallah
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          9. TESTIMONIALS / CUSTOMER REVIEWS ("LEURS RITUELS, LEURS MOTS")
          ═══════════════════════════════════════════════════ */}
      <section className="home-stories" aria-labelledby="home-stories-title">
        <div className="container">
          <div className="home-stories__header">
            <span className="home-stories__eyebrow">Avis Clients</span>
            <h2 className="home-stories__title" id="home-stories-title">Leurs rituels, leurs mots</h2>
          </div>
          <div className="home-stories__grid">
            {TESTIMONIALS.map((item) => (
              <article className="home-story-card" key={item.name}>
                <div className="home-story-card__media">
                  <img src={item.img} alt="" loading="lazy" />
                </div>
                <div className="home-story-card__body">
                  <span className="home-story-card__meta">{item.city}</span>
                  <div className="home-story-card__stars" aria-label={`${item.rating} étoiles sur 5`}>
                    {[...Array(item.rating)].map((_, index) => (
                      <Star key={index} size={12} fill="currentColor" stroke="none" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="home-story-card__quote">« {item.text} »</p>
                  <span className="home-story-card__author">{item.name}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          10. TRUST & VALUE PROPOSITIONS (4 Pillars)
          ═══════════════════════════════════════════════════ */}
      <section className="home-trust" aria-labelledby="home-trust-title">
        <h2 className="sr-only" id="home-trust-title">Nos engagements</h2>
        <div className="container home-trust__inner">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <article className="home-trust__item" key={title}>
              <span className="home-trust__icon"><Icon size={26} strokeWidth={1.1} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          11. NEWSLETTER SUBSCRIPTION
          ═══════════════════════════════════════════════════ */}
      <section className="home-newsletter" aria-labelledby="home-newsletter-title">
        <div className="container">
          <div className="home-newsletter__inner">
            <h2 className="home-newsletter__title" id="home-newsletter-title">
              Recevez nos nouvelles senteurs en avant-première
            </h2>
            <p className="home-newsletter__note">
              Une lettre par mois : nos rituels, nos arrivages et les conseils de la maison.
            </p>

            {newsletterSent ? (
              <p className="home-newsletter__success" role="status" aria-live="polite">
                <Sparkles size={17} /> Merci, votre adresse est bien notée.
              </p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="home-newsletter__form">
                <label className="sr-only" htmlFor="home-newsletter-email">Votre adresse e-mail</label>
                <input
                  id="home-newsletter-email"
                  type="email"
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder="Votre adresse e-mail"
                  autoComplete="email"
                  required
                />
                <button type="submit" aria-label="S’inscrire à la newsletter">
                  <Send size={17} />
                </button>
              </form>
            )}

            <div className="home-newsletter__socials">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="home-newsletter__social"
                >
                  <SocialIcon type={social.type} size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
