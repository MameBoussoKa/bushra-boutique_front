// Coordonnées et règles commerciales de la boutique.
// Valeurs par défaut alignées sur backend/.env (SHOP_PHONE, livraison).
export const SHOP = {
  name: 'Bushra Machallah',
  phone: '+221772241819',
  phoneDisplay: '+221 77 224 18 19',
  email: 'contact@bushramachallah.sn',
  city: 'Dakar, Sénégal',
  instagram: 'https://instagram.com',
  tiktok: 'https://www.tiktok.com',
  deliveryFee: 1500,
  freeDeliveryThreshold: 25000,
};

const WHATSAPP_BASE = `https://wa.me/${SHOP.phone.replace(/\D/g, '')}`;

/** Lien WhatsApp, avec message pré-rempli optionnel. */
export function whatsappLink(message) {
  if (!message) return WHATSAPP_BASE;
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
}

/** Image utilisée quand un produit n'a pas de visuel. */
export const FALLBACK_IMAGE = '/encensoir1.png';

/** Un identifiant non UUID correspond à une fiche de démonstration (non commandable). */
export function isDemoId(id) {
  return !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id || ''));
}
