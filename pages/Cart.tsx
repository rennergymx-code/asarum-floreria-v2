
import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types';

interface CartProps {
  cart: CartItem[];
  onRemove: (productId: string, variantName: string) => void;
  onUpdateQty: (productId: string, variantName: string, delta: number) => void;
}

const Cart: React.FC<CartProps> = ({ cart, onRemove, onUpdateQty }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 inline-block">
          <i className="fa-solid fa-cart-shopping text-6xl text-gray-200 mb-6 block"></i>
          <h2 className="text-3xl font-serif font-bold mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Parece que aún no has elegido flores para esa persona especial.</p>
          <Link to="/" className="bg-asarum-red text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-red-800 transition-colors">
            Ir al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-serif font-bold mb-12 flex items-center gap-4">
        Tu Carrito
        <span className="text-sm font-sans font-normal text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{cart.length} Artículos</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* List */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={`${item.productId}-${item.variantName}`} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-lg font-bold text-gray-900">{item.productName}</h3>
                <p className="text-gray-500 text-sm mb-2">{item.variantName}</p>
                <p className="text-asarum-red font-bold">${item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl">
                <button onClick={() => onUpdateQty(item.productId, item.variantName, -1)} className="text-gray-400 hover:text-asarum-red p-1"><i className="fa-solid fa-minus"></i></button>
                <span className="font-bold w-6 text-center">{item.quantity}</span>
                <button onClick={() => onUpdateQty(item.productId, item.variantName, 1)} className="text-gray-400 hover:text-asarum-red p-1"><i className="fa-solid fa-plus"></i></button>
              </div>
              <div className="text-right min-w-[100px]">
                <p className="font-bold text-lg">${(item.price * item.quantity).toLocaleString()}</p>
                <button onClick={() => onRemove(item.productId, item.variantName)} className="text-xs text-red-400 hover:text-red-600 font-bold uppercase tracking-wider mt-1">Eliminar</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-24">
          <h3 className="text-xl font-bold mb-6 border-b pb-4">Resumen de Pedido</h3>
          <div className="space-y-4 text-sm mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Envío (Se calcula en el checkout)</span>
              <span>$0.00</span>
            </div>
            <div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span className="text-asarum-red">${total.toLocaleString()}</span>
            </div>
          </div>
          
          <Link 
            to="/checkout" 
            className="w-full bg-asarum-red text-white font-bold py-4 rounded-full shadow-lg hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
          >
            Proceder al Pago
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
          <div className="mt-6 flex items-center justify-center gap-4">
            <i className="fa-brands fa-cc-visa text-2xl text-gray-300"></i>
            <i className="fa-brands fa-cc-mastercard text-2xl text-gray-300"></i>
            <i className="fa-brands fa-cc-apple-pay text-2xl text-gray-300"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
