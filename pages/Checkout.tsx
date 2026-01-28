import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import { CartItem, Order } from '../types';
import { AnalyticsService } from '../services/analytics';
import { supabase } from '../lib/supabase';

interface CheckoutProps {
  cart: CartItem[];
  onPlaceOrder: (order: Order) => void;
  onClearCart: () => void;
}

const LIBRARIES: ("places")[] = ["places"];
const DEFAULT_CENTER = { lat: 20.6719, lng: -103.4475 }; // Default to Zapopan/Haras area or center

const Checkout: React.FC<CheckoutProps> = ({ cart, onPlaceOrder, onClearCart }) => {
  const navigate = useNavigate();
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES
  });

  const [form, setForm] = useState({
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    receiverName: '',
    receiverPhone: '',
    deliveryType: 'delivery' as 'delivery' | 'pickup',
    pickupBranch: 'Hermosillo' as 'Hermosillo' | 'San Luis Río Colorado',
    address: '',
    references: '',
    gateCode: '',
    qrAccess: false,
    cardMessage: '',
    paymentMethod: 'credit',
    deliveryCoords: DEFAULT_CENTER as { lat: number; lng: number } | undefined
  });

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = (auto: google.maps.places.Autocomplete) => {
    setAutocomplete(auto);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const newCoords = { lat, lng };
        setForm(prev => ({
          ...prev,
          address: place.formatted_address || prev.address,
          deliveryCoords: newCoords
        }));
        if (map) {
          map.panTo(newCoords);
          map.setZoom(17);
        }
      }
    }
  };

  const onMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setForm(prev => ({ ...prev, deliveryCoords: { lat, lng } }));

      // Geocode back to address if possible (optional enhancement)
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          setForm(prev => ({ ...prev, address: results[0].formatted_address }));
        }
      });
    }
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const performOrder = async () => {
      const orderId = `AS-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: orderId,
        date: new Date().toISOString(), // Use ISO for database consistency
        items: [...cart],
        total,
        senderName: form.senderName,
        senderPhone: form.senderPhone,
        senderEmail: form.senderEmail,
        receiverName: form.receiverName,
        receiverPhone: form.receiverPhone,
        deliveryType: form.deliveryType,
        pickupBranch: form.deliveryType === 'pickup' ? form.pickupBranch : undefined,
        deliveryAddress: form.deliveryType === 'delivery' ? form.address : `Recolección en Sucursal: ${form.pickupBranch}`,
        deliveryCoords: form.deliveryType === 'delivery' ? form.deliveryCoords : undefined,
        gateCode: form.deliveryType === 'delivery' ? form.gateCode : undefined,
        qrAccess: form.deliveryType === 'delivery' ? form.qrAccess : undefined,
        cardMessage: form.cardMessage,
        status: 'Pendiente',
        paymentStatus: 'paid'
      };

      try {
        const { error } = await supabase.from('orders').insert([{
          id: newOrder.id,
          items: newOrder.items,
          total: newOrder.total,
          sender_name: newOrder.senderName,
          sender_phone: newOrder.senderPhone,
          sender_email: newOrder.senderEmail,
          receiver_name: newOrder.receiverName,
          receiver_phone: newOrder.receiverPhone,
          delivery_address: newOrder.deliveryAddress,
          delivery_coords: newOrder.deliveryCoords,
          delivery_type: newOrder.deliveryType,
          pickup_branch: newOrder.pickupBranch,
          gate_code: newOrder.gateCode,
          qr_access: newOrder.qrAccess,
          card_message: newOrder.cardMessage,
          status: newOrder.status,
          payment_status: newOrder.paymentStatus
        }]);

        if (error) throw error;

        onPlaceOrder(newOrder);
        AnalyticsService.trackPurchase(newOrder.id, total, cart);
        onClearCart();
        alert('¡Gracias por tu compra! Tu pedido ha sido recibido y nos contactaremos contigo por WhatsApp.');
        navigate('/');
      } catch (err) {
        console.error('Error saving order:', err);
        alert('Hubo un error al procesar tu pedido. Por favor intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    performOrder();
  };

  if (cart.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 md:py-16">
      <div className="text-center mb-16">
        <img src="/logo.png" alt="Asarum" className="h-24 mx-auto mb-8 object-contain" />
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

          <div className="space-y-12">
            {/* Sender Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-paper-plane text-asarum-red"></i>
                <h4 className="text-xs font-black text-asarum-dark uppercase tracking-widest">Quién Envía (Tus Datos)</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1">Nombre Completo</label>
                  <input
                    required
                    type="text"
                    placeholder="Tu nombre"
                    className="w-full bg-white/50 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-transparent focus:border-asarum-red focus:bg-white outline-none transition-all shadow-inner"
                    value={form.senderName}
                    onChange={e => setForm({ ...form, senderName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1">WhatsApp / Celular</label>
                  <input
                    required
                    type="tel"
                    placeholder="10 dígitos"
                    className="w-full bg-white/50 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-transparent focus:border-asarum-red focus:bg-white outline-none transition-all shadow-inner"
                    value={form.senderPhone}
                    onChange={e => setForm({ ...form, senderPhone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1">Correo Electrónico (Para tu recibo)</label>
                <input
                  required
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full bg-white/50 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-transparent focus:border-asarum-red focus:bg-white outline-none transition-all shadow-inner"
                  value={form.senderEmail}
                  onChange={e => setForm({ ...form, senderEmail: e.target.value })}
                />
                <p className="text-[10px] text-asarum-slate font-medium italic mt-2 ml-1">Usaremos este correo para enviarte el comprobante de Stripe.</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-asarum-red/10 to-transparent"></div>

            {/* Receiver Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-gift text-asarum-red"></i>
                <h4 className="text-xs font-black text-asarum-dark uppercase tracking-widest">Quién Recibe</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1">Nombre Completo</label>
                  <input
                    required
                    type="text"
                    placeholder="Nombre de la persona que recibe"
                    className="w-full bg-white/50 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-transparent focus:border-asarum-red focus:bg-white outline-none transition-all shadow-inner"
                    value={form.receiverName}
                    onChange={e => setForm({ ...form, receiverName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1">Teléfono de contacto</label>
                  <input
                    required
                    type="tel"
                    placeholder="10 dígitos"
                    className="w-full bg-white/50 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-transparent focus:border-asarum-red focus:bg-white outline-none transition-all shadow-inner"
                    value={form.receiverPhone}
                    onChange={e => setForm({ ...form, receiverPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Shipping */}
        <div className="glass-card p-6 md:p-10 border-white relative overflow-hidden">
          <h3 className="text-2xl font-black text-asarum-dark uppercase tracking-tight mb-8 flex items-center gap-4">
            <span className="w-10 h-10 rounded-full bg-asarum-red text-white flex items-center justify-center text-sm">2</span>
            Información de Entrega
          </h3>

          <div className="flex gap-4 mb-10 p-2 glass-morphism rounded-3xl border border-white">
            <button
              type="button"
              onClick={() => setForm({ ...form, deliveryType: 'delivery' })}
              className={`flex-1 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all font-black uppercase text-[10px] tracking-widest ${form.deliveryType === 'delivery'
                ? 'bg-asarum-red text-white shadow-lg shadow-asarum-red/20'
                : 'text-asarum-slate hover:bg-white/50'
                }`}
            >
              <i className="fa-solid fa-truck"></i>
              Envío a Domicilio
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, deliveryType: 'pickup' })}
              className={`flex-1 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all font-black uppercase text-[10px] tracking-widest ${form.deliveryType === 'pickup'
                ? 'bg-asarum-red text-white shadow-lg shadow-asarum-red/20'
                : 'text-asarum-slate hover:bg-white/50'
                }`}
            >
              <i className="fa-solid fa-store"></i>
              Recoger en Tienda
            </button>
          </div>

          <div className="space-y-8">
            {form.deliveryType === 'pickup' ? (
              <div className="space-y-6 animate-fade-in">
                <p className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1 mb-4">Selecciona la Sucursal</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'Hermosillo', icon: 'fa-city', address: 'Blvd. Luis Donaldo Colosio #965, Col. Compostela, CP 83224' },
                    { name: 'San Luis Río Colorado', icon: 'fa-bridge', address: 'Cjon. Madero y 6ta, Col. Comercial, CP 83449' }
                  ].map((branch) => (
                    <button
                      key={branch.name}
                      type="button"
                      onClick={() => setForm({ ...form, pickupBranch: branch.name as any })}
                      className={`p-6 rounded-3xl border-2 text-left transition-all ${form.pickupBranch === branch.name
                        ? 'border-asarum-red bg-white shadow-xl'
                        : 'border-white glass-morphism opacity-60 hover:opacity-100 hover:border-asarum-red/20'
                        }`}
                    >
                      <div className="flex items-center gap-4 mb-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.pickupBranch === branch.name ? 'bg-asarum-red text-white' : 'bg-slate-100 text-asarum-slate'}`}>
                          <i className={`fa-solid ${branch.icon}`}></i>
                        </div>
                        <span className="font-black text-asarum-dark uppercase tracking-tight">{branch.name}</span>
                      </div>
                      <p className="text-[10px] text-asarum-slate font-medium leading-relaxed">{branch.address}</p>
                    </button>
                  ))}
                </div>
                <div className="p-4 glass-morphism rounded-2xl border border-asarum-red/10 bg-red-50/30">
                  <p className="text-[10px] text-asarum-red font-black uppercase tracking-widest mb-1">Nota importante:</p>
                  <p className="text-[10px] text-asarum-slate leading-relaxed">
                    Recuerda que para recoger en sucursal, el pedido debe estar pagado previo a la elaboración.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1">Dirección Exacta</label>
                  {isLoaded ? (
                    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                      <input
                        required
                        type="text"
                        placeholder="Escribe tu dirección y selecciona de la lista..."
                        className="w-full bg-white/50 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-transparent focus:border-asarum-red focus:bg-white outline-none transition-all shadow-inner"
                        value={form.address}
                        onChange={e => setForm({ ...form, address: e.target.value })}
                      />
                    </Autocomplete>
                  ) : (
                    <input
                      required
                      type="text"
                      placeholder="Cargando mapa..."
                      disabled
                      className="w-full bg-gray-100 px-6 py-4 rounded-2xl border-2 border-transparent outline-none transition-all opacity-50"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1">Ubicación en el Mapa (Confirma con el PIN)</label>
                  <div className="relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden glass-card border-4 border-white shadow-xl">
                    {isLoaded ? (
                      <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={form.deliveryCoords || DEFAULT_CENTER}
                        zoom={15}
                        onLoad={map => setMap(map)}
                        options={{
                          disableDefaultUI: true,
                          zoomControl: true,
                          styles: [
                            {
                              featureType: 'poi',
                              elementType: 'labels',
                              stylers: [{ visibility: 'off' }]
                            }
                          ]
                        }}
                      >
                        {form.deliveryCoords && (
                          <Marker
                            position={form.deliveryCoords}
                            draggable={true}
                            onDragEnd={onMarkerDragEnd}
                            animation={google.maps.Animation.DROP}
                          />
                        )}
                      </GoogleMap>
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <i className="fa-solid fa-spinner animate-spin text-asarum-red text-4xl"></i>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-asarum-slate font-medium italic mt-2 ml-1">Puedes arrastrar el pin para mayor precisión.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1 flex items-center gap-2">
                      Clave en Caseta
                      <span className="lowercase font-normal opacity-50">(Opcional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. #1234 o Clave"
                      className="w-full bg-white/50 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-transparent focus:border-asarum-red focus:bg-white outline-none transition-all shadow-inner"
                      value={form.gateCode}
                      onChange={e => setForm({ ...form, gateCode: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1">Acceso con QR</label>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, qrAccess: !form.qrAccess })}
                      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all ${form.qrAccess
                        ? 'border-asarum-red bg-white'
                        : 'border-transparent bg-white/50 backdrop-blur-sm shadow-inner'
                        }`}
                    >
                      <span className={`text-[10px] font-black uppercase tracking-widest ${form.qrAccess ? 'text-asarum-dark' : 'text-asarum-slate opacity-40'}`}>
                        ¿Requiere envío de QR?
                      </span>
                      <div className={`w-10 h-5 rounded-full relative transition-all ${form.qrAccess ? 'bg-asarum-red' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${form.qrAccess ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </button>
                  </div>
                </div>

                {form.qrAccess && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-qrcode"></i>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Atención: Trámite de QR</p>
                      <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                        Debes generar el QR el mismo día de la entrega. El equipo de Asarum te contactará por WhatsApp para solicitarlo.
                      </p>
                    </div>
                  </div>
                )}

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
            )}
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
                <label className="flex items-center gap-4 p-5 rounded-2xl border-2 border-asarum-red bg-white shadow-lg shadow-asarum-red/5">
                  <div className="w-6 h-6 rounded-full border-2 border-asarum-red flex items-center justify-center">
                    <div className="w-3 h-3 bg-asarum-red rounded-full"></div>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-black text-asarum-dark uppercase">Tarjeta Online</p>
                    <div className="flex gap-2 mt-1 opacity-60">
                      <i className="fa-brands fa-cc-visa text-xl"></i>
                      <i className="fa-brands fa-cc-mastercard text-xl"></i>
                      <i className="fa-brands fa-cc-amex text-xl"></i>
                    </div>
                  </div>
                </label>
                <div className="p-4 glass-morphism rounded-2xl border border-white/40">
                  <p className="text-[9px] text-asarum-slate font-black uppercase tracking-[0.2em] leading-relaxed">
                    Al confirmar, serás redirigido a Stripe para completar tu pago de forma segura. Todas las entregas y recolecciones requieren pago previo.
                  </p>
                </div>
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
      </form >
    </div >
  );
};

export default Checkout;
