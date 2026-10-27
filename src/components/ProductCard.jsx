import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl, formatPrice } from '../utils/api';
import { Check, Plus, Star, Heart, Flame, Sparkles, Clock } from 'lucide-react';
import './ProductCard.css';

export default function ProductCard({ product, variant = 'default' }) {
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Sync with local favorites
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bushra_wishlist') || '[]');
      setIsFavorite(saved.includes(product.id));
    } catch {
      setIsFavorite(false);
    }
  }, [product.id]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = JSON.parse(localStorage.getItem('bushra_wishlist') || '[]');
      let updated;
      if (saved.includes(product.id)) {
        updated = saved.filter(id => id !== product.id);
        setIsFavorite(false);
      } else {
        updated = [...saved, product.id];
        setIsFavorite(true);
      }
      localStorage.setItem('bushra_wishlist', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const mainImage = product.images?.[0]?.url || product.primary_image || product.image_url;
  const isLocalImage = mainImage && mainImage.startsWith('/');
  const imgSrc = isLocalImage ? mainImage : (mainImage ? getImageUrl(mainImage) : null);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: 'ADD_ITEM',
      item: {
        productId: product.id,
        variantId: product.variants?.[0]?.id || null,
        name: product.name,
        price: product.base_price || product.price,
        image: mainImage,
        quantity: 1,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const basePrice = Number(product.base_price || product.price || 0);
  const comparePrice = Number(product.compare_price || 0);
  const hasDiscount = comparePrice > basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((comparePrice - basePrice) / comparePrice) * 100)
    : null;
  const variantClass = variant === 'home' ? ' product-card--home' : '';

  return (
    <article className={`product-card${variantClass}`}>
      <div className="product-card__media">
        <Link to={`/produits/${product.id}`} className="product-card__image-link" tabIndex={-1}>
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={product.name}
              className="product-card__image"
              loading="lazy"
            />
          ) : (
            <div className="product-card__placeholder">
              <Flame size={36} strokeWidth={1.2} className="product-card__placeholder-icon" />
              <span>Bushra Machallah</span>
            </div>
          )}
        </Link>

        {/* Badges container */}
        <div className="product-card__badges">
          {hasDiscount && (
            <span className="product-card__badge product-card__badge--promo">
              -{discountPercent}%
            </span>
          )}
          {product.is_featured && !hasDiscount && (
            <span className="product-card__badge product-card__badge--featured">
              <Sparkles size={11} /> Coup de ♥
            </span>
          )}
          {product.is_new && (
            <span className="product-card__badge product-card__badge--new">
              Nouveau
            </span>
          )}
        </div>

        {/* Olivra countdown deal badge */}
        {product.countdown && (
          <div className="product-card__countdown" aria-label="Temps restant pour cette offre">
            <Clock size={11} className="product-card__countdown-icon" />
            <span className="product-card__countdown-text">
              {product.countdown.split(':').map((part, idx, arr) => (
                <React.Fragment key={idx}>
                  <span className={idx === arr.length - 1 ? 'product-card__countdown-highlight' : ''}>
                    {part.trim()}
                  </span>
                  {idx < arr.length - 1 && ' : '}
                </React.Fragment>
              ))}
            </span>
          </div>
        )}

        {/* Favorite toggle button */}
        <button
          className={`product-card__fav-btn ${isFavorite ? 'product-card__fav-btn--active' : ''}`}
          onClick={toggleFavorite}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart size={16} fill={isFavorite ? 'var(--color-gold)' : 'none'} stroke="currentColor" strokeWidth={1.8} />
        </button>

        {/* Quick Add action over image on hover */}
        <button
          className={`product-card__quick-btn ${added ? 'product-card__quick-btn--added' : ''}`}
          onClick={handleAdd}
          aria-label="Ajouter au panier"
        >
          {added ? (
            <>
              <Check size={16} strokeWidth={2.2} />
              <span>Ajouté ✓</span>
            </>
          ) : (
            <>
              <Plus size={16} strokeWidth={2} />
              <span>Ajouter au panier</span>
            </>
          )}
        </button>
      </div>

      <div className="product-card__details">
        {product.category_name && (
          <span className="product-card__category">{product.category_name}</span>
        )}

        <h3 className="product-card__title">
          <Link to={`/produits/${product.id}`}>{product.name}</Link>
        </h3>

        {/* Rating stars */}
        {product.avg_rating > 0 ? (
          <div className="product-card__rating">
            <div className="product-card__stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={12}
                  fill={s <= Math.round(product.avg_rating) ? 'var(--color-gold)' : 'none'}
                  stroke="var(--color-gold)"
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="product-card__rating-count">({product.review_count || 0})</span>
          </div>
        ) : (
          <div className="product-card__rating product-card__rating--empty">
            <span className="product-card__artisan-tag">Artisanat de luxe</span>
          </div>
        )}

        {/* Price row */}
        <div className="product-card__pricing">
          <span className="product-card__price">{formatPrice(basePrice)}</span>
          {hasDiscount && (
            <span className="product-card__compare-price">{formatPrice(comparePrice)}</span>
          )}
        </div>
      </div>
    </article>
  );
}