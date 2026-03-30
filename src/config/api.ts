// Use relative URL so it inherits page protocol (http/https)
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const API_ENDPOINTS = {
  operations: `${API_URL}/operations`,
  inventory: `${API_URL}/inventory`,
  printer: `${API_URL}/printer`,
  sales: `${API_URL}/sales`,
  qrcodes: `${API_URL}/qrcodes`,
  supplies: `${API_URL}/supplies`,
  categories: `${API_URL}/categories`,
  products: `${API_URL}/products`,
  customers: `${API_URL}/customers`,
  business: `${API_URL}/business`,
  auth: `${API_URL}/auth`,
  'staff-messages': `${API_URL}/staff-messages`,
  colors: `${API_URL}/colors`,
  invoices: `${API_URL}/invoices`,
  analytics: `${API_URL}/analytics`,
  'retail-products': `${API_URL}/retail-products`,
  expenses: `${API_URL}/expenses`,
  'auth/users': `${API_URL}/auth/users`,
  'auth/register': `${API_URL}/auth/register`,
  'business/targets/staff/all': `${API_URL}/business/targets/staff/all`,
  'business/targets/staff': `${API_URL}/business/targets/staff`,
  'business/targets/summary': `${API_URL}/business/targets/summary`,
  'analytics/new-customers': `${API_URL}/analytics/new-customers`,
};