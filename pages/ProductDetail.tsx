
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, CartItem } from '../types';

interface ProductDetailProps {
  products: Product[];
  onAddToCart: (item: CartItem) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ products, onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);

  const [selectedVariant, setSelectedVariant] = useState(product?.variants.find(v => v.isDefault) || product?.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product?.image || '');

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
        <button onClick={() => navigate('/')} className="text-asarum-red underline">Volver al inicio</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    onAddToCart({
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      quantity
    });
    navigate('/cart');
  };

  // Stable secondary images for demo
  const galleryImages = [
    product.image,
    'https://images.unsplash.com/photo-1522673607200-164883214cde?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1518131322384-93666f7f2b96?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1558113426-302919421712?auto=format&fit=crop&q=80&w=800'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Gallery */}
        <div className="space-y-6">
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl bg-gray-100 group">
            <img 
              src={mainImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {galleryImages.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setMainImage(img)}
                className={`aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all border-4 ${
                  mainImage === img ? 'border-asarum-red shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <nav className="mb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
            <button onClick={() => navigate('/')} className="hover:text-asarum-red transition-colors">Catálogo</button>
            <i className="fa-solid fa-chevron-right text-[6px]"></i>
            <span className="text-gray-900">{product.name}</span>
          </nav>
          
          <h1 className="text-6xl font-serif font-bold text-gray-900 mb-6">{product.name}</h1>
          <p className="text-4xl font-light text-asarum-red mb-8">
            ${selectedVariant?.price.toLocaleString()} <span className="text-base font-sans text-gray-400">MXN</span>
          </p>
          
          <div className="prose prose-sm text-gray-600 mb-10 leading-relaxed max-w-none text-lg">
            <p>{product.description}</p>
            {product.notes && (
              <div className="mt-6 p-6 bg-yellow-50 border-l-8 border-yellow-400 rounded-2xl italic text-yellow-800 text-base">
                <i className="fa-solid fa-circle-info mr-2"></i>
                {product.notes}
              </div>
            )}
          </div>

          <div className="space-y-10">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Selecciona el Tamaño</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {product.variants.map((variant) => (
                  <button
                    key={variant.name}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-4 rounded-2xl border-2 text-sm font-black transition-all transform active:scale-95 ${
                      selectedVariant?.name === variant.name 
                        ? 'border-asarum-red bg-asarum-red text-white shadow-xl' 
                        : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200 shadow-sm'
                    }`}
                  >
                    {variant.name}
                    <div className={`text-[10px] mt-1 ${selectedVariant?.name === variant.name ? 'text-white/80' : 'text-gray-400'}`}>
                      ${variant.price.toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-6">
              <div className="flex items-center justify-between border-2 border-gray-100 rounded-full px-6 py-4 bg-white shadow-sm sm:w-48">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-asarum-red p-2 transition-colors"><i className="fa-solid fa-minus"></i></button>
                <span className="font-black text-xl w-10 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-asarum-red p-2 transition-colors"><i className="fa-solid fa-plus"></i></button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="flex-grow bg-asarum-red hover:bg-red-800 text-white font-black py-5 px-10 rounded-full shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 text-lg"
              >
                <i className="fa-solid fa-basket-shopping"></i>
                Agregar al Carrito
              </button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="bg-white text-green-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm text-xl flex-shrink-0">
                <i className="fa-solid fa-truck-fast"></i>
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Entrega rápida</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Hermosillo y SLRC. Pedidos antes de las 2pm se entregan hoy.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 bg-red-50 rounded-3xl border border-red-100">
              <div className="bg-white text-asarum-red w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm text-xl flex-shrink-0">
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <div>
                <h4 className="font-bold text-sm text-asarum-red">San Valentín</h4>
                <p className="text-xs text-asarum-red/70 leading-relaxed">Sin garantía de horario el 14 de Feb por alta demanda.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
