const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('bushra_token');
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  
  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error(`Erreur serveur (${res.status})`);
  }

  if (!res.ok) {
    throw new Error(data.message || 'Une erreur est survenue');
  }
  return data;
}

export const api = {
  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  getSimilar: (id) => request(`/products/${id}/similar`),

  // Categories
  getCategories: () => request('/categories'),
  getCategory: (id) => request(`/categories/${id}`),

  // Orders
  createOrder: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  trackOrder: (orderNumber, phone) =>
    request(`/orders/track?orderNumber=${orderNumber}&phone=${encodeURIComponent(phone)}`),

  // Reviews
  createReview: (data) => request('/reviews', { method: 'POST', body: JSON.stringify(data) }),

  // Shop info
  getShopInfo: () => request('/shop-info'),

  // Auth
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getMe: () => request('/auth/me'),

  // Admin
  admin: {
    getDashboard: () => request('/admin/dashboard'),
    getChart: (period) => request(`/admin/dashboard/chart?period=${period}`),
    getProducts: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/products${query ? `?${query}` : ''}`);
    },
    createProduct: (data, image) => {
      if (image) {
        const fd = new FormData();
        Object.entries(data).forEach(([k, v]) => {
          if (k === 'image') return;
          if (v !== null && v !== undefined && v !== '') fd.append(k, v);
        });
        fd.append('image', image);
        return request('/admin/products', { method: 'POST', body: fd });
      }
      return request('/admin/products', { method: 'POST', body: JSON.stringify(data) });
    },
    updateProduct: (id, data, image) => {
      if (image) {
        const fd = new FormData();
        Object.entries(data).forEach(([k, v]) => {
          if (k === 'image') return;
          if (v !== null && v !== undefined && v !== '') fd.append(k, v);
        });
        fd.append('image', image);
        return request(`/admin/products/${id}`, { method: 'PUT', body: fd });
      }
      return request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    },
    deleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),
    forceDeleteProduct: (id) => request(`/admin/products/${id}/force`, { method: 'DELETE' }),
    uploadImage: (id, formData) =>
      request(`/admin/products/${id}/images`, {
        method: 'POST',
        body: formData,
        headers: {},
      }),
    getOrders: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/orders${query ? `?${query}` : ''}`);
    },
    getOrder: (id) => request(`/admin/orders/${id}`),
    updateOrderStatus: (id, status, adminNote) =>
      request(`/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, adminNote }),
      }),
    createOrder: (data) => request('/admin/orders', { method: 'POST', body: JSON.stringify(data) }),
    getReviews: () => request('/admin/reviews'),
    approveReview: (id) => request(`/admin/reviews/${id}/approve`, { method: 'PATCH' }),
    deleteReview: (id) => request(`/admin/reviews/${id}`, { method: 'DELETE' }),
    getCategories: () => request('/categories'),
    createCategory: (data) => request('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
    updateCategory: (id, data) => request(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getNotifications: () => request('/admin/notifications'),
    markNotifRead: (id) => request(`/admin/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () => request('/admin/notifications/read-all', { method: 'PATCH' }),
    getLowStock: () => request('/admin/stock/low'),
    getCustomers: () => request('/admin/customers'),
    getProductVariants: (productId, all = false) => request(`/admin/products/${productId}/variants${all ? '?all=true' : ''}`),
    getVariant: (id) => request(`/admin/variants/${id}`),
    createVariant: (productId, data) => request(`/admin/products/${productId}/variants`, { method: 'POST', body: JSON.stringify(data) }),
    updateVariant: (id, data) => request(`/admin/variants/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteVariant: (id) => request(`/admin/variants/${id}`, { method: 'DELETE' }),
    toggleVariant: (id, isActive) => request(`/admin/variants/${id}/toggle`, { method: 'PATCH', body: JSON.stringify({ isActive }) }),
    adjustVariantStock: (id, change, reason, note) =>
      request(`/admin/variants/${id}/stock`, { method: 'PATCH', body: JSON.stringify({ change, reason, note }) }),
  },
};

export function getImageUrl(path) {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http') || path.startsWith('blob:')) return path;
  if (path.startsWith('/uploads/')) return path;
  return `/uploads/${path}`;
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}
