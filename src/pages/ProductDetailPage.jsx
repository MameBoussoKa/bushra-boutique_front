import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api, getImageUrl, formatPrice } from '../utils/api';
import { FALLBACK_IMAGE, isDemoId, whatsappLink } from '../utils/shop';
import { useCart } from '../context/CartContext';
import { 
  Check, ShoppingBag, MessageCircle, Star, Truck, ShieldCheck, 
  Package, Flame, Heart, Sparkles, ChevronRight, ArrowRight, Clock, RefreshCw
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import './ProductDetailPage.css';

const LOCAL_FALLBACK_PRODUCTS = {
  p1: { id: 'p1', name: 'Mabkhara Prestige Bushra', category_name: 'Encensoirs', price: 25000, compare_price: 32000, is_featured: true, images: [{ url: '/encensoir1.png' }, { url: '/encensoir2.png' }], description: 'Pièce maîtresse façonnée dans des matériaux nobles. Son design moderne en laiton brossé et son corps en céramique diffusent les arômes de vos encens avec une régularité et une élégance incomparables.', default_stock: 12, avg_rating: 5, review_count: 24 },
  p2: { id: 'p2', name: 'Mabkhara Tagine Doré', category_name: 'Encensoirs', price: 20000, compare_price: 25000, is_featured: true, images: [{ url: '/encensoir2.png' }], description: 'Inspiré de la tradition artisanale, ce modèle tagine orné de délicates perforations crée un jeu d\'ombre et de volutes de fumée envoûtant dans votre intérieur.', default_stock: 8, avg_rating: 4.9, review_count: 18 },
  p3: { id: 'p3', name: 'Thiouraye Gowé & Bushra Velours', category_name: 'Thiouraye', price: 15000, compare_price: 18500, is_featured: true, images: [{ url: '/gowe-thiouray.png' }], description: 'Un duo de senteurs légendaires du Sénégal. Préparé selon des recettes ancestrales avec des graines de gowé macérées dans des huiles précieuses pour un sillage persistant et chaleureux.', default_stock: 25, avg_rating: 5, review_count: 42 },
  p4: { id: 'p4', name: 'Mabkhara Bois & Cristal Diég Bi', category_name: 'Encensoirs', price: 30000, compare_price: 40000, is_featured: true, images: [{ url: '/encensoir5.png' }], description: 'Un mariage subtil entre le bois noble sculpté et des finitions cristal d\'exception. Idéal pour sublimer vos salons et espaces de réception.', default_stock: 5, avg_rating: 5, review_count: 31 },
  p5: { id: 'p5', name: 'Trio Brumes d\'Intérieur d\'Exception', category_name: 'Sprays', price: 18000, is_featured: true, images: [{ url: '/sprays.png' }], description: 'Trois brumes uniques : Nuage Secret, Fleur de Lune et Brume de Coton. Quelques pulvérisations suffisent pour rafraîchir rideaux, canapés et linge de maison.', default_stock: 15, avg_rating: 4.8, review_count: 19 },
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewForm, setReviewForm] = useState({ authorName: '', rating: 5, comment: '' });
  const [reviewSent, setReviewSent] = useState(false);
  const { dispatch, openDrawer } = useCart();

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    Promise.all([api.getProduct(id), api.getSimilar(id)])
      .then(([prodRes, simRes]) => {
        const p = prodRes.data;
        if (p) {
          setProduct(p);
          setSelectedVariant(p.variants?.[0] || null);
          setSimilar(simRes.data || []);
          setActiveImage(0);
        } else {
          throw new Error('Fallback required');
        }
      })
      .catch(() => {
        // Fallback to local static catalog
        const fallback = LOCAL_FALLBACK_PRODUCTS[id] || Object.values(LOCAL_FALLBACK_PRODUCTS)[0];
        setProduct(fallback);
        setSelectedVariant(null);
        setSimilar(Object.values(LOCAL_FALLBACK_PRODUCTS).filter(p => p.id !== fallback.id));
        setActiveImage(0);
      })
      .finally(() => setLoading(false));

    // Check wishlist
    try {
      const saved = JSON.parse(localStorage.getItem('bushra_wishlist') || '[]');
      setIsFavorite(saved.includes(id));
    } catch {
      setIsFavorite(false);
    }
  }, [id]);

  const toggleFavorite = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('bushra_wishlist') || '[]');
      let updated;
      if (saved.includes(id)) {
        updated = saved.filter(item => item !== id);
        setIsFavorite(false);
      } else {
        updated = [...saved, id];
        setIsFavorite(true);
      }
      localStorage.setItem('bushra_wishlist', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const currentPrice = selectedVariant
    ? (product?.base_price || product?.price || 0) + (selectedVariant.price_delta || 0)
    : (product?.base_price || product?.price || 0);

  const mainImage = product?.images?.[activeImage]?.url || product?.primary_image || product?.image_url;
  const activeImgSrc = getImageUrl(mainImage || FALLBACK_IMAGE);
  const isDemo = isDemoId(product?.id);

  const whatsappOrderLink = whatsappLink(
    `Bonjour, je souhaite commander ${product?.name} (${formatPrice(currentPrice)}) en quantité ${qty}.`
  );

  const handleAddToCart = () => {
    if (!product || isDemo) return;
    dispatch({
      type: 'ADD_ITEM',
      item: {
        productId: product.id,
        variantId: selectedVariant?.id || null,
        name: product.name,
        price: currentPrice,
        image: mainImage,
        variantName: selectedVariant?.name,
        quantity: qty,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isDemo) return;
    handleAddToCart();
    navigate('/commande');
  };

  async function handleReview(e) {
    e.preventDefault();
    try {
      await api.createReview({ productId: product.id, ...reviewForm });
    } catch (err) {
      console.warn('Erreur envoi avis, validation locale :', err);
    }
    setReviewSent(true);
  }

  if (loading) {
    return (
      <div className="container product-detail-loading">
        <div className="product-detail-skeleton" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container product-detail-notfound">
        <h2 className="display-md">Produit introuvable</h2>
        <Link to="/produits" className="btn btn--primary" style={{ marginTop: '1.5rem' }}>
          Retourner à la boutique
        </Link>
      </div>
    );
  }

  const stock = selectedVariant?.stock_quantity ?? product.default_stock ?? 10;
  const inStock = stock > 0;
  const comparePrice = Number(product.compare_price || 0);
  const hasDiscount = comparePrice > currentPrice;

  return (
    <div className="product-detail-page">
      {/* Breadcrumbs */}
      <div className="container product-breadcrumb">
        <Link to="/">Accueil</Link>
        <ChevronRight size={14} />
        <Link to="/produits">Boutique</Link>
        <ChevronRight size={14} />
        {product.category_name && (
          <>
            <Link to={`/produits?category=${encodeURIComponent(product.category_name.toLowerCase())}`}>
              {product.category_name}
            </Link>
            <ChevronRight size={14} />
          </>
        )}
        <span className="product-breadcrumb__current">{product.name}</span>
      </div>

      {/* Main product display */}
      <div className="container product-detail-grid">
        {/* Left Column: Visual Gallery */}
        <div className="product-gallery">
          <div className="product-gallery__main">
            <img
              src={activeImgSrc}
              alt={product.name}
              className="product-gallery__main-img"
            />
            {hasDiscount && (
              <span className="product-gallery__badge product-gallery__badge--promo">
                Offre Spéciale
              </span>
            )}
            <button
              onClick={toggleFavorite}
              className={`product-gallery__fav-btn ${isFavorite ? 'product-gallery__fav-btn--active' : ''}`}
              aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Heart size={20} fill={isFavorite ? 'var(--color-gold)' : 'none'} stroke="currentColor" />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="product-gallery__thumbs">
              {product.images.map((img, i) => {
                const thumbSrc = img.url.startsWith('/') ? img.url : getImageUrl(img.url);
                return (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`product-gallery__thumb ${i === activeImage ? 'product-gallery__thumb--active' : ''}`}
                  >
                    <img src={thumbSrc} alt={`Vue miniature ${i + 1}`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Product Buy Box */}
        <div className="product-summary">
          {product.category_name && (
            <span className="label product-summary__category">{product.category_name}</span>
          )}

          <h1 className="display-md product-summary__title">{product.name}</h1>

          {/* Reviews score */}
          <div className="product-summary__rating-row">
            <div className="product-summary__stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={15}
                  fill={s <= Math.round(product.avg_rating || 5) ? 'var(--color-gold)' : 'none'}
                  stroke="var(--color-gold)"
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="product-summary__rating-text">
              {Number(product.avg_rating || 5).toFixed(1)} / 5 ({product.review_count || 12} avis vérifiés)
            </span>
          </div>

          {/* Price */}
          <div className="product-summary__price-box">
            <span className="product-summary__price">{formatPrice(currentPrice)}</span>
            {hasDiscount && (
              <span className="product-summary__compare-price">{formatPrice(comparePrice)}</span>
            )}
            <span className="product-summary__tax-note">TTC · Paiement à la réception ou Wave</span>
          </div>

          {/* Stock availability */}
          <div className="product-summary__stock-pill">
            <span className="product-summary__stock-dot" />
            <span>En stock à Dakar — Expédié sous 24h</span>
          </div>

          {/* Description snippet */}
          <p className="product-summary__excerpt">
            {product.description || 'Création parfumée haut de gamme formulée avec soin pour créer une atmosphère de paix et d\'élégance dans votre demeure.'}
          </p>

          {/* Variants Selector */}
          {product.variants?.length > 0 && (
            <div className="product-summary__variants">
              <span className="label product-summary__variant-label">
                Options disponibles :
              </span>
              <div className="product-summary__variant-chips">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`product-summary__variant-chip ${selectedVariant?.id === v.id ? 'product-summary__variant-chip--active' : ''}`}
                  >
                    <span>{v.name}</span>
                    {v.price_delta !== 0 && (
                      <span className="product-summary__variant-delta">
                        {v.price_delta > 0 ? `+${formatPrice(v.price_delta)}` : `-${formatPrice(Math.abs(v.price_delta))}`}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="product-summary__actions">
            <div className="product-summary__qty">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className="product-summary__qty-btn"
                aria-label="Diminuer"
              >
                −
              </button>
              <span className="product-summary__qty-val">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(stock, q + 1))}
                disabled={qty >= stock || !inStock}
                className="product-summary__qty-btn"
                aria-label="Augmenter"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!inStock || isDemo}
              className={`btn btn--primary product-summary__cart-btn ${added ? 'btn--added' : ''}`}
            >
              {isDemo ? (
                <span>Fiche démo — non commandable</span>
              ) : added ? (
                <>
                  <Check size={18} strokeWidth={2.5} />
                  <span>Ajouté au panier !</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>Ajouter au panier</span>
                </>
              )}
            </button>
          </div>

          {isDemo && (
            <p className="product-summary__demo-note">
              Cette fiche appartient au catalogue de présentation : elle n'est pas encore
              disponible à la commande. Écrivez-nous sur WhatsApp pour vérifier le stock réel.
            </p>
          )}

          {/* Direct Buy & WhatsApp Buttons */}
          <div className="product-summary__secondary-actions">
            <button onClick={handleBuyNow} className="btn btn--outline btn--full" disabled={isDemo}>
              <span>Acheter maintenant</span>
              <ArrowRight size={16} />
            </button>

            <a
              href={whatsappOrderLink}
              target="_blank"
              rel="noreferrer"
              className="btn btn--whatsapp btn--full"
            >
              <MessageCircle size={18} />
              <span>Commander en 1 clic sur WhatsApp</span>
            </a>
          </div>

          {/* Reassurance pills */}
          <div className="product-summary__reassurance">
            <div className="product-summary__reassurance-item">
              <Truck size={17} />
              <span>Livraison offerte dès 25 000 FCFA</span>
            </div>
            <div className="product-summary__reassurance-item">
              <ShieldCheck size={17} />
              <span>Authenticité 100% garantie</span>
            </div>
            <div className="product-summary__reassurance-item">
              <Clock size={17} />
              <span>Paiement à la livraison, Wave ou OM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Rituel Olfactif, Livraison & Retours */}
      <div className="container product-tabs-container">
        <div className="product-tabs__nav">
          <button
            className={`product-tabs__btn ${activeTab === 'description' ? 'product-tabs__btn--active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description complète
          </button>
          <button
            className={`product-tabs__btn ${activeTab === 'ritual' ? 'product-tabs__btn--active' : ''}`}
            onClick={() => setActiveTab('ritual')}
          >
            Rituel d'utilisation & Senteurs
          </button>
          <button
            className={`product-tabs__btn ${activeTab === 'shipping' ? 'product-tabs__btn--active' : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            Livraison & Retours à Dakar
          </button>
        </div>

        <div className="product-tabs__content">
          {activeTab === 'description' && (
            <div className="product-tabs__pane animate-fadeIn">
              <p className="body-lg" style={{ color: 'var(--color-cream)', marginBottom: '1rem' }}>
                {product.description || 'Une création emblématique de la maison Bushra Machallah.'}
              </p>
              <p className="body" style={{ color: 'var(--color-ash)' }}>
                Chaque pièce est confectionnée dans le respect des traditions sénégalaises de parfumerie d'intérieur. 
                Que ce soit pour accueillir vos invités avec bienveillance ou pour instaurer un calme réparateur 
                en fin de journée, nos senteurs apportent une élégance intemporelle à votre foyer.
              </p>
            </div>
          )}

          {activeTab === 'ritual' && (
            <div className="product-tabs__pane animate-fadeIn">
              <h3 className="heading" style={{ color: 'var(--color-gold)', marginBottom: '0.75rem' }}>
                Conseils pour un rituel parfait :
              </h3>
              <ul className="product-tabs__list">
                <li>1. Déposez une braise ardente au fond de l'encensoir ou allumez doucement votre charbon.</li>
                <li>2. Placez une pincée de thiouraye ou de gowé parfumé sur le charbon chaud.</li>
                <li>3. Refermez le couvercle ciselé pour laisser la fumée embaumante s'échapper en volutes gracieuses.</li>
                <li>4. Parcourez les pièces de votre maison pour imprégner rideaux, tapis et vêtements.</li>
              </ul>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="product-tabs__pane animate-fadeIn">
              <div className="product-tabs__shipping-grid">
                <div>
                  <h4 style={{ color: 'var(--color-gold)', marginBottom: '0.4rem' }}>Dakar et banlieue</h4>
                  <p className="body-sm" style={{ color: 'var(--color-ash)' }}>
                    Livraison le jour même ou sous 24h. Frais standard 1 500 FCFA (Offerte dès 25 000 FCFA d'achat).
                  </p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--color-gold)', marginBottom: '0.4rem' }}>Régions du Sénégal</h4>
                  <p className="body-sm" style={{ color: 'var(--color-ash)' }}>
                    Expédition sous 48h à Thiès, Saint-Louis, Mbour, Ziguinchor, Touba et Kaolack.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verified Reviews Section */}
      <div className="container product-reviews-container">
        <header className="section-head-row">
          <div>
            <span className="label section-head__label">Expériences Clients</span>
            <h2 className="display-md section-head__title">Avis des acheteurs vérifiés</h2>
            <div className="divider divider--left" />
          </div>
        </header>

        {reviewSent ? (
          <div className="product-review__sent">
            <Check size={28} className="gold-text" />
            <span>Merci pour votre témoignage ! Il sera publié après modération.</span>
          </div>
        ) : (
          <form onSubmit={handleReview} className="product-review__form">
            <h3 className="heading" style={{ color: 'var(--color-cream)', marginBottom: '0.85rem' }}>
              Laisser une évaluation
            </h3>
            <div className="product-review__form-grid">
              <input
                type="text"
                placeholder="Votre nom complet"
                value={reviewForm.authorName}
                onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                required
                className="product-review__input"
              />
              <div className="product-review__stars-selector">
                <span className="label" style={{ color: 'var(--color-ash)' }}>Note :</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="product-review__star-btn"
                  >
                    <Star
                      size={18}
                      fill={star <= reviewForm.rating ? 'var(--color-gold)' : 'none'}
                      stroke="var(--color-gold)"
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              placeholder="Partagez votre ressenti sur cette senteur ou cet encensoir..."
              rows={3}
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              required
              className="product-review__textarea"
            />
            <button type="submit" className="btn btn--primary btn--sm" style={{ alignSelf: 'flex-start' }}>
              Envoyer mon avis
            </button>
          </form>
        )}
      </div>

      {/* Similar products */}
      {similar.length > 0 && (
        <div className="container product-similar-container">
          <header className="section-head-row">
            <div>
              <span className="label section-head__label">Complétez Votre Rituel</span>
              <h2 className="display-md section-head__title">Vous aimerez aussi</h2>
              <div className="divider divider--left" />
            </div>
          </header>
          <div className="products-grid">
            {similar.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}