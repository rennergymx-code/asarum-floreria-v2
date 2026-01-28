
import { Product, Season } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Daniela',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800',
    basePrice: 1500,
    variants: [{ name: 'Único Tamaño', price: 1500, isDefault: true }],
    description: 'Canasta vibrante con gerberas, rosas y follaje variado.',
    season: Season.VALENTINES
  },
  {
    id: '2',
    name: 'Elisa',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=800',
    basePrice: 1850,
    variants: [
      { name: 'Mediano', price: 1850, isDefault: true },
      { name: 'Grande', price: 2500 }
    ],
    description: 'Elegante arreglo de tulipanes y hortensias.',
    notes: 'Tono de tulipán a elección.',
    season: Season.VALENTINES
  },
  {
    id: '3',
    name: 'Olivia',
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&q=80&w=800',
    basePrice: 1250,
    variants: [
      { name: '12 Rosas', price: 1250, isDefault: true },
      { name: '24 Rosas', price: 1800 },
      { name: '50 Rosas', price: 2849 }
    ],
    description: 'Clásico ramo de rosas rojas con toques de follaje plateado.',
    season: Season.VALENTINES
  },
  {
    id: '4',
    name: 'Alma',
    image: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&q=80&w=800',
    basePrice: 1600,
    variants: [{ name: 'Único Tamaño', price: 1600, isDefault: true }],
    description: 'Mix de rosas rojas y flores blancas en base de cristal.',
    notes: 'Base disponible en blanco, negro o cristalina.',
    season: Season.VALENTINES
  },
  {
    id: '5',
    name: 'Ale',
    image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&q=80&w=800',
    basePrice: 999,
    variants: [
      { name: 'Chico', price: 999, isDefault: true },
      { name: 'Mediano', price: 1500 },
      { name: 'Grande', price: 2500 },
      { name: 'Jumbo', price: 5000 }
    ],
    description: 'Arreglo romántico en caja circular (box-flower).',
    notes: 'La caja puede variar de acuerdo a stock.',
    season: Season.VALENTINES
  },
  {
    id: '6',
    name: 'Mia',
    image: 'https://images.unsplash.com/photo-1494333102632-3bb620443697?auto=format&fit=crop&q=80&w=800',
    basePrice: 999,
    variants: [
      { name: 'Chico', price: 999, isDefault: true },
      { name: 'Mediano', price: 2500 },
      { name: 'Grande', price: 3500 },
      { name: 'Jumbo', price: 5000 },
      { name: 'Extra', price: 10000 }
    ],
    description: 'Explosión de mini-rosas rojas densas.',
    season: Season.VALENTINES
  },
  {
    id: '7',
    name: 'Melissa',
    image: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&q=80&w=800',
    basePrice: 1850,
    variants: [
      { name: 'Chico', price: 1850, isDefault: true },
      { name: 'Mediano', price: 2650 },
      { name: 'Grande', price: 5000 }
    ],
    description: 'Arreglo alto de rosas premium en florero de cristal.',
    season: Season.VALENTINES
  },
  {
    id: '8',
    name: 'Emilia',
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800',
    basePrice: 6000,
    variants: [{ name: 'Único Tamaño', price: 6000, isDefault: true }],
    description: 'Diseño artístico maximalista con mix de flores exóticas.',
    notes: 'Color de base de acuerdo a stock.',
    season: Season.VALENTINES
  },
  {
    id: '9',
    name: 'Luciana',
    image: 'https://images.unsplash.com/photo-1597843798133-e1529b21f1de?auto=format&fit=crop&q=80&w=800',
    basePrice: 950,
    variants: [{ name: '6 Girasoles + Follaje', price: 950, isDefault: true }],
    description: 'Alegre ramo de girasoles envuelto en papel craft premium.',
    notes: 'El papel puede variar de acuerdo a stock.',
    season: Season.VALENTINES
  },
  {
    id: '10',
    name: 'Elena',
    image: 'https://images.unsplash.com/photo-1562601519-19443b392bbb?auto=format&fit=crop&q=80&w=800',
    basePrice: 20500,
    variants: [
      { name: '500 Rosas', price: 20500, isDefault: true },
      { name: '1,000 Rosas', price: 38000 }
    ],
    description: 'El regalo definitivo. Cientos de rosas compactadas en domo.',
    notes: 'Tono de rosa a elección.',
    season: Season.VALENTINES
  },
  {
    id: '11',
    name: 'Amalia',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800',
    basePrice: 600,
    variants: [
      { name: '6 Rosas', price: 600, isDefault: true },
      { name: '12 Rosas', price: 950 },
      { name: '18 Rosas', price: 1250 }
    ],
    description: 'Delicado ramo de rosas con flores de acompañamiento.',
    notes: 'El papel puede variar de acuerdo a stock.',
    season: Season.VALENTINES
  },
  {
    id: '12',
    name: 'Sofía',
    image: 'https://images.unsplash.com/photo-1516339901600-2e1a62d0edb7?auto=format&fit=crop&q=80&w=800',
    basePrice: 1650,
    variants: [
      { name: '24 Rosas', price: 1650, isDefault: true },
      { name: '36 Rosas', price: 2750 },
      { name: '50 Rosas', price: 2950 }
    ],
    description: 'Ramo romántico envuelto en seda blanca.',
    notes: 'El papel puede variar de acuerdo a stock.',
    season: Season.VALENTINES
  },
  {
    id: '13',
    name: 'Laura',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800',
    basePrice: 4500,
    variants: [
      { name: '100 Rosas', price: 4500, isDefault: true },
      { name: '200 Rosas', price: 8500 },
      { name: '300 Rosas', price: 13500 }
    ],
    description: 'Espectacular domo de rosas rojas premium.',
    notes: 'El papel puede variar de acuerdo a stock.',
    season: Season.VALENTINES
  }
];
