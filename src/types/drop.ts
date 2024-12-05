export type ItemType = 'shoe' | 'bag' | 'leather' | 'other';
export type OrderStatus = 'pending' | 'in_progress' | 'ready' | 'delivered';
export type DeliveryMethod = 'pickup' | 'delivery';

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  description: string;
  estimatedDays: number;
  itemTypes: ItemType[];
}

export interface DropItem {
  id: string;
  type: ItemType;
  brand?: string;
  customType?: string;
  description: string;
  services: string[]; // Service IDs
  memo?: string;
  upcCode?: string;
  images: string[];
}

export interface DeliveryInfo {
  method: DeliveryMethod;
  address?: string;
  location?: string;
  deliveryCharge?: number;
}

export interface DropOrder {
  id: string;
  customerId: string;
  items: DropItem[];
  totalAmount: number;
  discount?: number;
  deliveryInfo: DeliveryInfo;
  status: OrderStatus;
  createdAt: string;
  readyDate: string;
  memo?: string;
  quotationId?: string;
  couponCode?: string;
}

export interface Quotation {
  id: string;
  customerId: string;
  items: DropItem[];
  estimatedTotal: number;
  validUntil: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Location {
  id: string;
  name: string;
  deliveryCharge: number;
  estimatedTime: string;
}
