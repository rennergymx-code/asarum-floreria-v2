
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

  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product?.images?.[0] || '');

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="glass-card p-12 max-w-sm">
          <i className="fa-solid fa-face-frown text-asarum-red text-5xl mb-6"></i>
          <h2 className="text-2xl font-black text-asarum-dark mb-4">Producto no encontrado</h2>
          <button onClick={() => navigate('/')} className="btn-primary w-full">Volver al inicio</button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    onAddToCart({
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      productName: product.name,
      productImage: product.images[0],
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      quantity
    });
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-20">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Gallery - Mobile Optimized */}
        <div className="lg:w-1/2 space-y-6">
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden glass-card group">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {(product.images || []).map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImage(img)}
                className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden glass-morphism transition-all border-2 ${mainImage === img ? 'border-asarum-red scale-105 shadow-xl' : 'border-transparent opacity-60'
                  }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info - Mobile Priority */}
        <div className="lg:w-1/2 flex flex-col pt-4">
          <nav className="mb-6 flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-[10px] font-black text-asarum-red uppercase tracking-widest hover:underline">catálogo</button>
            <i className="fa-solid fa-chevron-right text-[8px] text-asarum-slate"></i>
            <span className="text-[10px] font-black text-asarum-slate uppercase tracking-widest">{product.name}</span>
          </nav>

          <h1 className="text-5xl md:text-7xl font-black text-asarum-dark mb-4 uppercase tracking-tighter leading-none">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-4xl font-extrabold text-asarum-red">${(selectedVariant?.price || product.basePrice).toLocaleString()}</span>
            <span className="text-xs font-black text-asarum-slate uppercase">mxn</span>
          </div>

          <div className="glass-card p-6 md:p-8 mb-10">
            <p className="text-asarum-slate text-lg leading-relaxed">{product.description}</p>
            {product.notes && (
              <div className="mt-6 p-5 glass-morphism rounded-2xl border-l-[6px] border-asarum-red bg-red-50/50">
                <p className="text-asarum-red text-sm font-bold flex items-center gap-3 italic">
                  <i className="fa-solid fa-circle-info text-lg"></i>
                  {product.notes}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="text-[10px] font-black text-asarum-slate uppercase tracking-[0.2em] mb-4 block ml-2">Selecciona tamaño.</label>
                <div className="grid grid-cols-2 gap-4">
                  {product.variants.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-4 rounded-3xl border-2 text-left transition-all active:scale-95 ${selectedVariant?.name === v.name
                          ? 'border-asarum-red bg-asarum-red/5 shadow-inner ring-2 ring-asarum-red/20'
                          : 'border-white glass-morphism hover:border-asarum-red/30'
                        }`}
                    >
                      <div className={`text-xs font-black uppercase tracking-tight ${selectedVariant?.name === v.name ? 'text-asarum-red' : 'text-asarum-dark'}`}>
                        {v.name}
                      </div>
                      <div className="text-lg font-extrabold text-asarum-dark mt-1">
                        ${v.price.toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center justify-between glass-morphism rounded-3xl p-2 sm:w-44 border border-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-asarum-red hover:bg-asarum-red hover:text-white transition-all active:scale-90"
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
                <span className="font-black text-xl text-asarum-dark">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-asarum-red hover:bg-asarum-red hover:text-white transition-all active:scale-90"
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-primary flex-grow text-xl py-6 flex items-center justify-center gap-4 shadow-asarum-red/40"
              >
                <i className="fa-solid fa-bag-shopping"></i>
                <span>Añadir al Carrito</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
