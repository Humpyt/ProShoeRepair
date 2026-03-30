// API base URL - set via environment variable for production
// For local development, defaults to localhost:3000
// For production on Netlify, set VITE_API_URL to your VPS address (e.g., http://69.62.125.228:3000)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth
  login: `${API_BASE_URL}/api/auth/login`,
  me: `${API_BASE_URL}/api/auth/me`,
  register: `${API_BASE_URL}/api/auth/register`,
  users: `${API_BASE_URL}/api/auth/users`,

  // Operations
  operations: `${API_BASE_URL}/api/operations`,

  // Customers
  customers: `${API_BASE_URL}/api/customers`,

  // Services
  services: `${API_BASE_URL}/api/services`,

  // Staff Messages
  staffMessages: `${API_BASE_URL}/api/staff-messages`,
  staffMessageUsers: `${API_BASE_URL}/api/staff-messages/users`,
  staffMessageConversations: `${API_BASE_URL}/api/staff-messages/conversations`,
  staffMessageUnreadCount: `${API_BASE_URL}/api/staff-messages/unread-count`,

  // Retail Products
  retailProducts: `${API_BASE_URL}/api/retail-products`,

  // Business/Targets
  businessTargets: `${API_BASE_URL}/api/business/targets`,

  // Invoices
  invoices: `${API_BASE_URL}/api/invoices`,

  // Sales
  sales: `${API_BASE_URL}/api/sales`,

  // QR Codes
  qrcodes: `${API_BASE_URL}/api/qrcodes`,

  // Analytics
  analytics: `${API_BASE_URL}/api/analytics`,
};

export default API_BASE_URL;