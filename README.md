# Bushra Machallah — Frontend

Interface moderne et responsive pour la boutique e-commerce **Bushra Machallah**, spécialisée dans les senteurs, encens et encensoirs artisanaux sénégalais.

---

## 🚀 Installation & Démarrage

### Prérequis
- Node.js 18+
- Le backend déjà lancé sur `http://localhost:5000`

### Installation

```bash
cd bushra-frontend
npm install
npm run dev
```

L'interface sera disponible sur **http://localhost:5173**

---

## 📁 Structure du projet

```
src/
├── components/
│   ├── Navbar.jsx / .css       # Navigation responsive (transparente sur hero)
│   ├── Footer.jsx / .css       # Pied de page complet
│   └── ProductCard.jsx / .css  # Carte produit avec ajout rapide au panier
│
├── context/
│   ├── CartContext.jsx          # Panier global (localStorage)
│   └── AuthContext.jsx          # Authentification admin
│
├── pages/
│   ├── HomePage.jsx / .css      # Page d'accueil (hero + sections)
│   ├── ProductsPage.jsx / .css  # Catalogue avec filtres
│   ├── ProductDetailPage.jsx    # Fiche produit
│   ├── CartPage.jsx / .css      # Panier
│   ├── CheckoutPage.jsx / .css  # Commande
│   ├── SimplePages.jsx / .css   # Confirmation, suivi, à propos, contact, collections
│   └── AdminPage.jsx / .css     # Dashboard admin complet
│
├── utils/
│   └── api.js                   # Client API (proxy vers /api)
│
├── App.jsx                      # Routeur principal
├── index.css                    # Design tokens + styles globaux
└── main.jsx                     # Point d'entrée React
```

---

## 🎨 Design System

### Palette de couleurs

| Nom | Hex | Usage |
|-----|-----|-------|
| Obsidian | `#0D0A08` | Fond principal |
| Charcoal | `#1A1410` | Fond sections |
| Ember | `#2C1D0E` | Fond cartes |
| Amber | `#C17B2F` | Couleur accent principale |
| Gold | `#E8B86D` | Or lumineux / titres |
| Cream | `#F5EDD8` | Texte principal |
| Smoke | `#8C7B6B` | Texte secondaire |

### Typographie
- **Titres** : Cormorant Garamond (serif élégant)
- **Corps** : Inter (sans-serif moderne)

---

## 🗺️ Routes

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil avec hero plein écran |
| `/produits` | Catalogue avec filtres |
| `/produits/:id` | Fiche produit |
| `/collections` | Page collections |
| `/panier` | Panier |
| `/commande` | Checkout |
| `/commande/confirmation` | Confirmation de commande |
| `/commande/suivi` | Suivi de commande |
| `/a-propos` | À propos |
| `/contact` | Contact |
| `/admin` | Dashboard admin |
| `/admin/login` | Connexion admin |

---

## ⚙️ Configuration API

Le proxy Vite redirige automatiquement :
- `/api/*` → `http://localhost:5000/api/*`
- `/uploads/*` → `http://localhost:5000/uploads/*`

Pour la production, configurez `VITE_API_URL` et adaptez `vite.config.js`.

---

## 📱 Responsive

- ✅ Mobile (320px+)
- ✅ Tablette (768px+)
- ✅ Desktop (1280px+)

---

## ✨ Fonctionnalités principales

- **Hero plein écran** avec slider automatique et particules fumée animées
- **Navigation** transparente sur le hero, solide au scroll
- **Catalogue** avec filtres par catégorie et prix, pagination infinie
- **Panier** persistant (localStorage)
- **Checkout** complet avec modes de paiement (livraison, Wave, Orange Money)
- **Suivi de commande** par numéro + téléphone
- **Avis clients** avec formulaire et notation
- **Dashboard admin** : produits, commandes, avis, catégories
- **WhatsApp** intégré pour commandes directes
