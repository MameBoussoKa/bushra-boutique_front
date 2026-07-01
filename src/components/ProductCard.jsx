import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl, formatPrice } from '../utils/api';
import { Check, Plus, Star, Image } from 'lucide-react';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);

  const mainImage = product.images?.[0]?.url || product.primary_image || product.image_url;
  // Détecter si c'est une image locale (commence par /) vs upload backend
  const isLocalImage = mainImage && mainImage.startsWith('/');
  const imgSrc = isLocalImage ? mainImage : (mainImage ? getImageUrl(mainImage) : null);

  function handleAdd(e) {
    e.preventDefault();
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
    setTimeout(() => setAdded(false), 1500);
  }

  const discount = product.compare_price && product.compare_price > (product.base_price || product.price)
    ? Math.round((1 - (product.base_price || product.price) / product.compare_price) * 100)
    : null;

  return (
    <article className="product-card">
      <Link to={`/produits/${product.id}`} className="product-card__image-wrap">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name}
            className={`product-card__image ${isLocalImage ? 'product-card__image--local' : ''}`}
            loading="lazy"
          />
        ) : (
          <div className="product-card__placeholder">
            <Image size={40} strokeWidth={1} color="currentColor" />
          </div>
        )}
        {discount && <span className="product-card__badge">-{discount}%</span>}
        {product.is_featured && !discount && (
          <span className="product-card__badge product-card__badge--featured">Coup de ♥</span>
        )}
        <button
          className={`product-card__quick-add ${added ? 'product-card__quick-add--done' : ''}`}
          onClick={handleAdd}
          aria-label={added ? 'Ajouté' : 'Ajouter au panier'}
        >
          {added ? (
            <Check size={16} strokeWidth={2} />
          ) : (
            <Plus size={16} strokeWidth={1.5} />
          )}
          {added ? 'Ajouté' : 'Ajouter'}
        </button>
      </Link>

      <div className="product-card__body">
        {product.category_name && (
          <span className="product-card__category label">{product.category_name}</span>
        )}
        <h3 className="product-card__name">
          <Link to={`/produits/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="product-card__price-row">
          <span className="product-card__price">{formatPrice(product.base_price || product.price)}</span>
          {product.compare_price && product.compare_price > (product.base_price || product.price) && (
            <span className="product-card__compare">{formatPrice(product.compare_price)}</span>
          )}
        </div>
        {product.avg_rating > 0 && (
          <div className="product-card__rating">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={12} fill={s <= Math.round(product.avg_rating) ? 'var(--color-amber)' : 'none'} stroke="var(--color-amber)" strokeWidth={1.5} />
            ))}
            <span className="product-card__rating-count">({product.review_count || 0})</span>
          </div>
        )}
      </div>
    </article>
  );
}