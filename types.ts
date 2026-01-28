
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
  image: string;
  basePrice: number;
  variants: ProductVariant[];
  description: string;
  notes?: string;
  season: Season;
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
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCoords?: { lat: number; lng: number };
  cardMessage: string;
  status: 'Pendiante' | 'En Camino' | 'Entregado';
}
