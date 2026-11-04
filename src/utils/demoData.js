// Données locales temporaires pour les présentations sans API connectée.
export const demoCategories = [
  { id: '1', name: 'Thiouraye' },
  { id: '2', name: 'Encensoirs' },
  { id: '3', name: 'Parfums' },
  { id: '4', name: 'Accessoires' },
];

export const demoProducts = [
  {
    id: 'demo-mabkhara-prestige', name: 'Mabkhara Prestige Orange', category_id: '2', category_name: 'Encensoirs',
    base_price: 28000, compare_price: 32000, price: 28000, is_featured: true, avg_rating: 4.9, review_count: 18,
    default_stock: 12, image_url: '/encensoir1.png', images: [{ url: '/encensoir1.png' }, { url: '/encensoir2.png' }],
    variants: [{ id: 'demo-prestige-standard', name: 'Format standard', price_delta: 0, stock_quantity: 12 }],
    description: 'Une pièce décorative aux lignes généreuses, pensée pour accompagner vos rituels parfumés.',
    reviews: [{ id: 'demo-review-1', author_name: 'Aminata D.', rating: 5, comment: 'Très belle pièce, encore plus élégante en vrai.' }, { id: 'demo-review-2', author_name: 'Mame F.', rating: 5, comment: 'Un bel objet qui apporte une jolie touche à mon salon.' }],
  },
  {
    id: 'demo-mabkhara-doree', name: 'Mabkhara Dorée Étoile', category_id: '2', category_name: 'Encensoirs',
    base_price: 22000, compare_price: 27000, price: 22000, is_featured: true, avg_rating: 4.8, review_count: 12,
    default_stock: 8, image_url: '/encensoir2.png', images: [{ url: '/encensoir2.png' }, { url: '/encensoir4.png' }],
    variants: [{ id: 'demo-doree-small', name: 'Petit format', price_delta: 0, stock_quantity: 8 }, { id: 'demo-doree-large', name: 'Grand format', price_delta: 5000, stock_quantity: 5 }],
    description: 'Une silhouette dorée et lumineuse qui trouve sa place dans un intérieur contemporain.',
    reviews: [{ id: 'demo-review-3', author_name: 'Fatou S.', rating: 5, comment: 'Le format est parfait et la finition est très jolie.' }],
  },
  {
    id: 'demo-mabkhara-noir-or', name: 'Mabkhara Noir & Or', category_id: '2', category_name: 'Encensoirs',
    base_price: 19500, price: 19500, avg_rating: 4.7, review_count: 9, default_stock: 10, image_url: '/encensoir3.png',
    images: [{ url: '/encensoir3.png' }], variants: [{ id: 'demo-noir-standard', name: 'Format standard', price_delta: 0, stock_quantity: 10 }],
    description: 'Un contraste profond de noir et de détails dorés pour un rituel plein de caractère.',
  },
  {
    id: 'demo-mabkhara-ivoire', name: 'Mabkhara Coupe Ivoire', category_id: '2', category_name: 'Encensoirs',
    base_price: 24000, price: 24000, avg_rating: 4.6, review_count: 7, default_stock: 6, image_url: '/encensoir4.png',
    images: [{ url: '/encensoir4.png' }], variants: [{ id: 'demo-ivoire-standard', name: 'Format standard', price_delta: 0, stock_quantity: 6 }],
    description: 'Une forme douce et épurée, facile à intégrer dans votre décoration.',
  },
  {
    id: 'demo-mabkhara-bois', name: 'Mabkhara Bois Précieux', category_id: '2', category_name: 'Encensoirs',
    base_price: 35000, compare_price: 42000, price: 35000, is_featured: true, avg_rating: 5, review_count: 15,
    default_stock: 4, image_url: '/encensoir5.png', images: [{ url: '/encensoir5.png' }],
    variants: [{ id: 'demo-bois-grand', name: 'Grand format', price_delta: 0, stock_quantity: 4 }],
    description: 'Une pièce remarquable aux tons chaleureux pour mettre en valeur votre espace.',
  },
  {
    id: 'demo-mabkhara-terre', name: 'Mabkhara Terre Cuite', category_id: '2', category_name: 'Encensoirs',
    base_price: 17000, price: 17000, avg_rating: 4.5, review_count: 6, default_stock: 9, image_url: '/encensoir6.png',
    images: [{ url: '/encensoir6.png' }], variants: [{ id: 'demo-terre-standard', name: 'Format standard', price_delta: 0, stock_quantity: 9 }],
    description: 'Une teinte chaleureuse inspirée des matières naturelles et des intérieurs accueillants.',
  },
  {
    id: 'demo-thiouraye', name: 'Gowé Bushra & Bushra Velours', category_id: '1', category_name: 'Thiouraye',
    base_price: 12500, price: 12500, is_featured: true, avg_rating: 4.9, review_count: 21, default_stock: 20,
    image_url: '/gowe-thiouray.png', images: [{ url: '/gowe-thiouray.png' }],
    variants: [{ id: 'demo-thiouraye-100', name: 'Boîte découverte', price_delta: 0, stock_quantity: 20 }, { id: 'demo-thiouraye-250', name: 'Boîte généreuse', price_delta: 7500, stock_quantity: 11 }],
    description: 'Une senteur de maison inspirée des moments de partage et des traditions parfumées.',
    reviews: [{ id: 'demo-review-4', author_name: 'Ndeye A.', rating: 5, comment: 'Une senteur chaleureuse qui rappelle les beaux moments en famille.' }],
  },
  {
    id: 'demo-vetiver', name: 'Paniers Vétiver Naturel', category_id: '4', category_name: 'Accessoires',
    base_price: 8000, price: 8000, avg_rating: 4.4, review_count: 5, default_stock: 14, image_url: '/paniers-vetiver.png',
    images: [{ url: '/paniers-vetiver.png' }], variants: [{ id: 'demo-vetiver-small', name: 'Petit panier', price_delta: 0, stock_quantity: 14 }, { id: 'demo-vetiver-large', name: 'Grand panier', price_delta: 4000, stock_quantity: 7 }],
    description: 'Un accessoire aux fibres végétales pour apporter une touche naturelle à la maison.',
  },
  {
    id: 'demo-sprays', name: 'Brumes parfumées pour la maison', category_id: '3', category_name: 'Parfums',
    base_price: 9500, price: 9500, is_featured: true, avg_rating: 4.7, review_count: 11, default_stock: 16,
    image_url: '/sprays.png', images: [{ url: '/sprays.png' }],
    variants: [{ id: 'demo-spray-single', name: 'Un flacon', price_delta: 0, stock_quantity: 16 }, { id: 'demo-spray-duo', name: 'Duo découverte', price_delta: 7000, stock_quantity: 8 }],
    description: 'Une brume parfumée pour ajouter une touche de senteur à votre intérieur.',
  },
];

export function getDemoProduct(id) {
  return demoProducts.find(product => String(product.id) === String(id)) || null;
}

export function getDemoCatalog({ search = '', category = '', minPrice = '', maxPrice = '' } = {}) {
  const query = search.trim().toLocaleLowerCase('fr');
  return demoProducts.filter(product => {
    const matchesQuery = !query || `${product.name} ${product.category_name} ${product.description}`.toLocaleLowerCase('fr').includes(query);
    const matchesCategory = !category || String(product.category_id) === String(category);
    const price = Number(product.base_price);
    return matchesQuery && matchesCategory && (!minPrice || price >= Number(minPrice)) && (!maxPrice || price <= Number(maxPrice));
  });
}
