
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
    <div className="max-w-4xl mx-auto px-6 py-10 md:py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black text-asarum-dark uppercase tracking-tighter leading-none mb-4">Finalizar Pago</h1>
        <p className="text-asarum-slate font-black uppercase tracking-[0.2em] text-[10px]">Información Segura y Encriptada</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Progress Indication (Visual) */}
        <div className="flex items-center justify-between px-4 sm:px-12 mb-12">
          {[
            { icon: 'fa-user', label: 'Contacto' },
            { icon: 'fa-truck', label: 'Entrega' },
            { icon: 'fa-envelope-open-text', label: 'Mensaje' },
            { icon: 'fa-credit-card', label: 'Pago' }
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full glass-morphism border-2 border-white flex items-center justify-center text-asarum-red shadow-lg">
                <i className={`fa-solid ${step.icon}`}></i>
              </div>
              <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-asarum-dark">{step.label}</span>
            </div>
          ))}
        </div>

        {/* Section: Contact */}
        <div className="glass-card p-6 md:p-10 border-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50/50 rounded-bl-full -z-10"></div>
          <h3 className="text-2xl font-black text-asarum-dark uppercase tracking-tight mb-8 flex items-center gap-4">
            <span className="w-10 h-10 rounded-full bg-asarum-red text-white flex items-center justify-center text-sm">1</span>
            Datos de Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1">Nombre Completo</label>
              <input
                required
                type="text"
                placeholder="Ej. Juan Pérez"
                className="w-full bg-white/50 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-transparent focus:border-asarum-red focus:bg-white outline-none transition-all shadow-inner"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1">WhatsApp / Celular</label>
              <input
                required
                type="tel"
                placeholder="10 dígitos"
                className="w-full bg-white/50 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-transparent focus:border-asarum-red focus:bg-white outline-none transition-all shadow-inner"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section: Shipping */}
        <div className="glass-card p-6 md:p-10 border-white relative overflow-hidden">
          <h3 className="text-2xl font-black text-asarum-dark uppercase tracking-tight mb-8 flex items-center gap-4">
            <span className="w-10 h-10 rounded-full bg-asarum-red text-white flex items-center justify-center text-sm">2</span>
            Información de Entrega
          </h3>
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1">Dirección Exacta</label>
              <input
                required
                type="text"
                placeholder="Calle, Número, Colonia, Ciudad..."
                className="w-full bg-white/50 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-transparent focus:border-asarum-red focus:bg-white outline-none transition-all shadow-inner"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1">Ubicación en el Mapa (Opcional pero recomendado)</label>
              <div className="relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden glass-card group cursor-pointer border-4 border-white">
                <div className="absolute inset-0 bg-asarum-dark/20 z-10 flex flex-col items-center justify-center text-white p-6 text-center group-hover:bg-asarum-dark/40 transition-all">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/30 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-location-crosshairs text-3xl"></i>
                  </div>
                  <p className="font-black uppercase tracking-widest text-xs">Precisar ubicación exacta</p>
                  <span className="text-[10px] opacity-70 mt-2">Abre Google Maps para marcar el punto exacto</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Mapa"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1">Referencias del Domicilio</label>
              <textarea
                rows={3}
                placeholder="Ej. Casa de portón negro, frente al parque..."
                className="w-full bg-white/50 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-transparent focus:border-asarum-red focus:bg-white outline-none transition-all shadow-inner"
                value={form.references}
                onChange={e => setForm({ ...form, references: e.target.value })}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Section: Card Message */}
        <div className="glass-card p-6 md:p-10 border-white relative overflow-hidden">
          <h3 className="text-2xl font-black text-asarum-dark uppercase tracking-tight mb-8 flex items-center gap-4">
            <span className="w-10 h-10 rounded-full bg-asarum-red text-white flex items-center justify-center text-sm">3</span>
            Dedicatoria (Tarjeta)
          </h3>
          <div className="space-y-4">
            <textarea
              required
              rows={5}
              placeholder="Escribe el mensaje que acompañará tus flores..."
              className="w-full bg-white/50 backdrop-blur-sm px-6 py-6 rounded-3xl border-2 border-transparent focus:border-asarum-red focus:bg-white outline-none transition-all shadow-inner text-lg font-medium"
              value={form.cardMessage}
              onChange={e => setForm({ ...form, cardMessage: e.target.value })}
            ></textarea>
            <div className="flex items-center gap-4 p-4 glass-morphism rounded-2xl border border-asarum-red/10">
              <i className="fa-solid fa-quote-left text-asarum-red/20 text-3xl"></i>
              <p className="text-xs text-asarum-slate italic leading-relaxed">
                Tus palabras se imprimirán en una tarjeta premium que será entregada junto con el arreglo.
              </p>
            </div>
          </div>
        </div>

        {/* Section: Payment & Order Summary */}
        <div className="glass-card p-6 md:p-10 border-asarum-red/10 bg-gradient-to-br from-white/90 to-red-50/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-asarum-red shadow-lg shadow-asarum-red/20"></div>
          <h3 className="text-2xl font-black text-asarum-dark uppercase tracking-tight mb-8 flex items-center gap-4">
            <span className="w-10 h-10 rounded-full bg-asarum-red text-white flex items-center justify-center text-sm">4</span>
            Método de Pago y Resumen
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="space-y-4 mb-8">
                {cart.map(item => (
                  <div key={`${item.productId}-${item.variantName}`} className="flex justify-between items-center gap-4 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden glass-morphism">
                        <img src={item.productImage} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-black text-xs text-asarum-dark uppercase tracking-tight">{item.productName} × {item.quantity}</p>
                        <p className="text-[10px] text-asarum-slate uppercase font-bold">{item.variantName}</p>
                      </div>
                    </div>
                    <span className="font-black text-asarum-dark">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-asarum-slate">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-asarum-red italic">
                  <span>Envío Express</span>
                  <span>¡GRATIS!</span>
                </div>
                <div className="flex justify-between items-baseline pt-4">
                  <span className="text-sm font-black text-asarum-dark uppercase tracking-[0.2em]">Total Final</span>
                  <div className="text-4xl font-black text-asarum-red">${total.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label
                  onClick={() => setForm({ ...form, paymentMethod: 'credit' })}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${form.paymentMethod === 'credit' ? 'border-asarum-red bg-white' : 'border-white glass-morphism opacity-60'
                    }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${form.paymentMethod === 'credit' ? 'border-asarum-red' : 'border-gray-300'}`}>
                    {form.paymentMethod === 'credit' && <div className="w-3 h-3 bg-asarum-red rounded-full animate-scale-in"></div>}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-black text-asarum-dark uppercase">Tarjeta Online</p>
                    <div className="flex gap-2 mt-1 opacity-60">
                      <i className="fa-brands fa-cc-visa text-xl"></i>
                      <i className="fa-brands fa-cc-mastercard text-xl"></i>
                    </div>
                  </div>
                </label>

                <label
                  onClick={() => setForm({ ...form, paymentMethod: 'whatsapp' })}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${form.paymentMethod === 'whatsapp' ? 'border-asarum-red bg-white' : 'border-white glass-morphism opacity-60'
                    }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${form.paymentMethod === 'whatsapp' ? 'border-gray-300' : 'border-gray-300'}`}>
                    {form.paymentMethod === 'whatsapp' && <div className="w-3 h-3 bg-asarum-red rounded-full animate-scale-in"></div>}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-black text-asarum-dark uppercase">Transferencia / Efectivo</p>
                    <p className="text-[10px] text-green-600 font-bold">Vía WhatsApp</p>
                  </div>
                </label>
              </div>

              <button
                disabled={loading}
                className={`btn-primary w-full py-6 text-xl flex items-center justify-center gap-4 ${loading ? 'opacity-70 cursor-wait' : ''}`}
              >
                {loading ? (
                  <i className="fa-solid fa-spinner animate-spin"></i>
                ) : (
                  <>
                    <i className="fa-solid fa-lock"></i>
                    <span>Confirmar Compra</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-asarum-slate font-black uppercase tracking-[0.2em]">
                Tu compra está triple-protegida por SSL
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
