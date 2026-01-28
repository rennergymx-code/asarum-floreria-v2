import { Product, Season } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'elena',
    name: 'Elena',
    description: 'Arreglo espectacular de rosas en tono a elección.',
    basePrice: 20500,
    images: ['https://images.unsplash.com/photo-1548610762-7c6abc94c731?w=800'], // Placeholder to be replaced by actual logic/assets
    category: 'Arreglos Premium',
    variants: [
      { name: '500 ROSAS', price: 20500 },
      { name: '1,000 ROSAS', price: 38000 }
    ],
    notes: 'Tamaño personalizado. Tono de rosa a elección.'
  },
  {
    id: 'amalia',
    name: 'Amalia',
    description: 'Elegante ramo de rosas rojas con follaje fino.',
    basePrice: 600,
    images: ['https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800'],
    category: 'Ramos',
    variants: [
      { name: '6 ROSAS', price: 600 },
      { name: '12 ROSAS', price: 950 },
      { name: '18 ROSAS', price: 1250 }
    ],
    notes: 'El papel puede variar de acuerdo a stock.'
  },
  {
    id: 'sofia',
    name: 'Sofía',
    description: 'Ramo romántico de rosas rojas.',
    basePrice: 1650,
    images: ['https://images.unsplash.com/photo-1591880911720-41e3d3969567?w=800'],
    category: 'Ramos',
    variants: [
      { name: '24 ROSAS', price: 1650 },
      { name: '36 ROSAS', price: 2750 },
      { name: '50 ROSAS', price: 2950 }
    ],
    notes: 'El papel puede variar de acuerdo a stock.'
  },
  {
    id: 'laura',
    name: 'Laura',
    description: 'Impresionante arreglo de rosas rojas.',
    basePrice: 4500,
    images: ['https://images.unsplash.com/photo-1563241527-3004b7be0941?w=800'],
    category: 'Arreglos Grandes',
    variants: [
      { name: '100 ROSAS', price: 4500 },
      { name: '200 ROSAS', price: 8500 },
      { name: '300 ROSAS', price: 13500 }
    ],
    notes: 'El papel puede variar de acuerdo a stock.'
  },
  {
    id: 'olivia',
    name: 'Olivia',
    description: 'Delicado florero con rosas rojas.',
    basePrice: 1250,
    images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800'],
    category: 'Floreros',
    variants: [
      { name: '12 ROSAS', price: 1250 },
      { name: '24 ROSAS', price: 1800 },
      { name: '50 ROSAS', price: 2849 }
    ]
  },
  {
    id: 'alma',
    name: 'Alma',
    description: 'Combinación armoniosa de flores mixtas en base esférica.',
    basePrice: 1600,
    images: ['https://images.unsplash.com/photo-1550983058-ba68da991844?w=800'],
    category: 'Arreglos Mixtos',
    variants: [
      { name: 'ÚNICO TAMAÑO', price: 1600 }
    ],
    notes: 'Base disponible en color blanco, negro o cristalina.'
  },
  {
    id: 'ale',
    name: 'Ale',
    description: 'Caja premium con mix de flores.',
    basePrice: 999,
    images: ['https://images.unsplash.com/photo-1572454530994-1b1e0020462f?w=800'],
    category: 'Cajas Premium',
    variants: [
      { name: 'CHICO', price: 999 },
      { name: 'MEDIANO', price: 1500 },
      { name: 'GRANDE', price: 2500 },
      { name: 'JUMBO', price: 5000 }
    ],
    notes: 'La caja puede variar de acuerdo a stock.'
  },
  {
    id: 'mia',
    name: 'Mia',
    description: 'Esfera compacta de rosas rojas.',
    basePrice: 999,
    images: ['https://images.unsplash.com/photo-1591880911720-41e3d3969567?w=800'],
    category: 'Cajas Premium',
    variants: [
      { name: 'CHICO', price: 999 },
      { name: 'MEDIANO', price: 2500 },
      { name: 'GRANDE', price: 3500 },
      { name: 'JUMBO', price: 5000 },
      { name: 'EXTRA', price: 10000 }
    ]
  },
  {
    id: 'melissa',
    name: 'Melissa',
    description: 'Arreglo vertical de rosas en base de cristal.',
    basePrice: 1850,
    images: ['https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800'],
    category: 'Floreros',
    variants: [
      { name: 'CHICO', price: 1850 },
      { name: 'MEDIANO', price: 2650 },
      { name: 'GRANDE', price: 5000 }
    ]
  },
  {
    id: 'daniela',
    name: 'Daniela',
    description: 'Canasta alegre de flores mixtas.',
    basePrice: 1500,
    images: ['https://images.unsplash.com/photo-1523694553227-ec1c07094200?w=800'],
    category: 'Canastas',
    variants: [
      { name: 'ÚNICO TAMAÑO', price: 1500 }
    ]
  },
  {
    id: 'luciana',
    name: 'Luciana',
    description: 'Ramo brillante de 6 girasoles con follaje.',
    basePrice: 950,
    images: ['https://images.unsplash.com/photo-1597040660443-4674174360a8?w=800'],
    category: 'Ramos',
    variants: [
      { name: '6 GIRASOLES + FOLLAJE', price: 950 }
    ],
    notes: 'El papel puede variar de acuerdo a stock.'
  },
  {
    id: 'emilia',
    name: 'Emilia',
    description: 'Elegante florero con mix premium de flores.',
    basePrice: 6000,
    images: ['https://images.unsplash.com/photo-1522383225053-ed111181a951?w=800'],
    category: 'Floreros',
    variants: [
      { name: 'ÚNICO TAMAÑO', price: 6000 }
    ],
    notes: 'Color de base de acuerdo a stock.'
  },
  {
    id: 'mariana',
    name: 'Mariana',
    description: 'Caja espectacular con variedad de flores.',
    basePrice: 20000,
    images: ['https://images.unsplash.com/photo-1589244159943-460088ed5c92?w=800'],
    category: 'Cajas Premium',
    variants: [
      { name: 'ÚNICO TAMAÑO', price: 20000 }
    ],
    notes: 'Color de base de acuerdo a stock.'
  },
  {
    id: 'elisa',
    name: 'Elisa',
    description: 'Hydrangea central acompañada de tulipanes.',
    basePrice: 1850,
    images: ['https://images.unsplash.com/photo-1596438459194-f275f413d6ff?w=800'],
    category: 'Floreros',
    variants: [
      { name: 'MEDIANO', price: 1850 },
      { name: 'GRANDE', price: 2500 }
    ],
    notes: 'Tono de tulipán a elección.'
  }
];

export const STORE_INFO = {
  name: 'Asarum Florería y Regalos',
  whatsapp: '526622151515', // Placeholder
  instagram: 'asarumfloreriayregaloshmo',
  locations: [
    { name: 'Hermosillo', url: 'https://maps.app.goo.gl/SmXZK3Mo7pdHdPe58', since: 2015 },
    { name: 'San Luis Río Colorado', url: 'https://maps.app.goo.gl/scjmx5dRiY895gX2A', since: 1994 }
  ],
  importantNote: 'IMPORTANTE: El 14 de Febrero no hay horario de entrega garantizado. Las entregas se realizarán en el transcurso del día.'
};
