
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, Order } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  onPlaceOrder: (order: Order) => void;
  onClearCart: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, onPlaceOrder, onClearCart }) => {
  const navigate = useNavigate();
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    references: '',
    cardMessage: '',
    paymentMethod: 'credit'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newOrder: Order = {
        id: `AS-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('es-MX'),
        items: [...cart],
        total,
        customerName: form.name,
        customerPhone: form.phone,
        deliveryAddress: form.address,
        cardMessage: form.cardMessage,
        status: 'Pendiante'
      };

      onPlaceOrder(newOrder);
      setLoading(false);
      onClearCart();
      alert('¡Gracias por tu compra! Tu pedido ha sido recibido y nos contactaremos contigo por WhatsApp.');
      navigate('/');
    }, 2000);
  };

  if (cart.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-serif font-bold mb-12 text-center">Finalizar Compra</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Customer & Shipping */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <i className="fa-solid fa-user text-asarum-red"></i>
              Datos de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nombre Completo</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-asarum-red outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Teléfono / WhatsApp</label>
                <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-asarum-red outline-none" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <i className="fa-solid fa-map-location-dot text-asarum-red"></i>
              Entrega
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Dirección de Envío</label>
                <input required type="text" placeholder="Calle, número, colonia..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-asarum-red outline-none mb-4" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>
              
              {/* Simulation of Google Maps Interaction */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden relative group border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                <i className="fa-solid fa-location-dot text-4xl mb-4 text-asarum-red/20 group-hover:scale-110 transition-transform"></i>
                <p className="text-sm font-medium">Ubica tu domicilio en Google Maps para mayor precisión</p>
                <button type="button" className="mt-4 px-6 py-2 bg-gray-100 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors">Abrir Mapa Interactivo</button>
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" alt="Map mockup" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Referencias (Color de casa, entre calles, código en caseta)</label>
                <textarea rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-asarum-red outline-none" value={form.references} onChange={e => setForm({...form, references: e.target.value})}></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <i className="fa-solid fa-envelope text-asarum-red"></i>
              Mensaje de la Tarjeta
            </h3>
            <textarea required rows={4} placeholder="Escribe aquí el mensaje que quieres que lleve la tarjeta de tu regalo..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-asarum-red outline-none" value={form.cardMessage} onChange={e => setForm({...form, cardMessage: e.target.value})}></textarea>
            <p className="mt-4 text-xs text-gray-500 italic">"Los sentimientos se expresan mejor con palabras sinceras."</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 border-b pb-4">Tu Pedido</h3>
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={`${item.productId}-${item.variantName}`} className="flex justify-between text-sm">
                  <div className="flex-grow">
                    <p className="font-bold text-gray-900">{item.productName} x {item.quantity}</p>
                    <p className="text-gray-500 text-xs">{item.variantName}</p>
                  </div>
                  <span className="font-semibold text-asarum-red">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Envío</span>
                <span className="text-green-600 font-bold">¡GRATIS!</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                <span>Total</span>
                <span className="text-asarum-red">${total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6">Método de Pago</h3>
            <div className="space-y-3 mb-8">
              <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-asarum-red cursor-pointer transition-colors bg-gray-50">
                <input type="radio" name="payment" checked={form.paymentMethod === 'credit'} onChange={() => setForm({...form, paymentMethod: 'credit'})} />
                <span className="text-sm font-bold flex items-center gap-2">
                  <i className="fa-solid fa-credit-card text-gray-400"></i>
                  Tarjeta de Crédito / Débito
                </span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-asarum-red cursor-pointer transition-colors bg-gray-50">
                <input type="radio" name="payment" checked={form.paymentMethod === 'whatsapp'} onChange={() => setForm({...form, paymentMethod: 'whatsapp'})} />
                <span className="text-sm font-bold flex items-center gap-2">
                  <i className="fa-brands fa-whatsapp text-green-500"></i>
                  Transferencia / Efectivo (Coordinar vía WhatsApp)
                </span>
              </label>
            </div>

            <button 
              disabled={loading}
              className={`w-full bg-asarum-red text-white font-bold py-5 rounded-full shadow-2xl transition-all flex items-center justify-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-800'}`}
            >
              {loading ? (
                <i className="fa-solid fa-spinner animate-spin"></i>
              ) : (
                <>
                  <i className="fa-solid fa-shield-check"></i>
                  Pagar y Confirmar Pedido
                </>
              )}
            </button>
            <p className="mt-4 text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
              <i className="fa-solid fa-lock mr-1"></i> Pago 100% Seguro y Encriptado
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
