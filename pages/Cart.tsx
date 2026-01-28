
import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types';
import { AnalyticsService } from '../services/analytics';

interface CartProps {
  cart: CartItem[];
  onRemove: (productId: string, variantName: string) => void;
  onUpdateQty: (productId: string, variantName: string, delta: number) => void;
}

const Cart: React.FC<CartProps> = ({ cart, onRemove, onUpdateQty }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="glass-card p-12 max-w-lg mx-auto">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <i className="fa-solid fa-basket-shopping text-5xl text-asarum-red"></i>
          </div>
          <h2 className="text-4xl font-black text-asarum-dark mb-4 uppercase tracking-tighter">Tu carrito está vacío</h2>
          <p className="text-asarum-slate mb-10 text-lg">Parece que aún no has elegido flores para esa persona especial.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-3 px-10 py-5">
            <i className="fa-solid fa-leaf"></i>
            <span>Ver Catálogo</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <h1 className="text-5xl md:text-7xl font-black text-asarum-dark uppercase tracking-tighter leading-none">Tu Carrito</h1>
          <p className="text-asarum-slate font-black uppercase tracking-widest text-[10px] mt-2 ml-1">Tienes {cart.length} {cart.length === 1 ? 'artículo' : 'artículos'} seleccionados</p>
        </div>
        <Link to="/" className="text-asarum-red font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:underline">
          <i className="fa-solid fa-arrow-left text-[10px]"></i>
          Continuar comprando
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* List */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={`${item.productId}-${item.variantName}`} className="glass-card p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center group transition-all hover:border-asarum-red/20">
              <div className="w-full sm:w-32 aspect-square rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-xl font-black text-asarum-dark uppercase tracking-tight">{item.productName}</h3>
                <p className="text-asarum-slate text-xs font-bold uppercase tracking-wider mb-3">{item.variantName}</p>
                <p className="text-asarum-red font-black text-lg">${item.price.toLocaleString()}</p>
              </div>

              <div className="flex flex-row sm:flex-col items-center gap-6 sm:gap-4 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-gray-100 pt-6 sm:pt-0 sm:pl-8">
                <div className="flex items-center gap-4 glass-morphism p-1 rounded-2xl border border-white">
                  <button
                    onClick={() => onUpdateQty(item.productId, item.variantName, -1)}
                    className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-asarum-red hover:bg-asarum-red hover:text-white transition-all active:scale-90"
                  >
                    <i className="fa-solid fa-minus text-xs"></i>
                  </button>
                  <span className="font-black w-6 text-center text-asarum-dark">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQty(item.productId, item.variantName, 1)}
                    className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-asarum-red hover:bg-asarum-red hover:text-white transition-all active:scale-90"
                  >
                    <i className="fa-solid fa-plus text-xs"></i>
                  </button>
                </div>

                <div className="flex-grow sm:flex-grow-0 text-right sm:text-center">
                  <p className="font-black text-xl text-asarum-dark">${(item.price * item.quantity).toLocaleString()}</p>
                  <button
                    onClick={() => onRemove(item.productId, item.variantName)}
                    className="text-[10px] text-asarum-red/60 hover:text-asarum-red font-black uppercase tracking-widest mt-1 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-8 sticky top-28 border-white/40 shadow-asarum-red/5">
            <h3 className="text-2xl font-black text-asarum-dark mb-8 uppercase tracking-tighter">Resumen</h3>

            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-asarum-slate text-sm font-bold uppercase tracking-wider">
                <span>Subtotal</span>
                <span className="text-asarum-dark">${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-asarum-slate text-sm font-bold uppercase tracking-wider">
                <span>Envío</span>
                <span className="text-asarum-red italic">Calculado al pagar</span>
              </div>
              <div className="h-px bg-white/50 my-6"></div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-black text-asarum-dark uppercase tracking-widest">Total</span>
                <div className="text-right">
                  <div className="text-4xl font-black text-asarum-red">${total.toLocaleString()}</div>
                  <div className="text-[10px] font-black text-asarum-slate uppercase tracking-widest">MXN</div>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              onClick={() => AnalyticsService.trackInitiateCheckout(cart, total)}
              className="btn-primary w-full py-6 text-xl flex items-center justify-center gap-4 mb-8"
            >
              <span>Continuar Pago</span>
              <i className="fa-solid fa-chevron-right text-xs"></i>
            </Link>

            <div className="space-y-4 pt-6 border-t border-white/50">
              <div className="flex justify-center gap-6 opacity-30 grayscale hover:opacity-60 hover:grayscale-0 transition-all">
                <i className="fa-brands fa-cc-visa text-3xl"></i>
                <i className="fa-brands fa-cc-mastercard text-3xl"></i>
                <i className="fa-brands fa-cc-apple-pay text-3xl"></i>
              </div>
              <p className="text-[10px] text-center text-asarum-slate font-black uppercase tracking-widest">
                <i className="fa-solid fa-lock mr-2"></i>
                Check-out 100% Seguro
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
