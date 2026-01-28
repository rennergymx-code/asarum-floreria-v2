
export enum Season {
  VALENTINES = 'San Valentín',
  MOTHERS_DAY = 'Día de las Madres',
  DEFAULT = 'Temporada Regular'
}

export interface ProductVariant {
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  images: string[];
  category: string;
  variants?: ProductVariant[];
  notes?: string;
  seasons: Season[];
}

export interface CartItem {
  id: string;
  productId: string;
  variantName: string;
  quantity: number;
  price: number;
  productName: string;
  productImage: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  receiverName: string;
  receiverPhone: string;
  deliveryAddress: string;
  deliveryCoords?: { lat: number; lng: number };
  deliveryType: 'delivery' | 'pickup';
  pickupBranch?: 'Hermosillo' | 'San Luis Río Colorado';
  gateCode?: string;
  qrAccess?: boolean;
  cardMessage: string;
  status: 'Pendiante' | 'En Camino' | 'Entregado';
  paymentStatus: 'pending' | 'paid' | 'failed';
  stripePaymentIntentId?: string;
}
