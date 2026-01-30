import React, { useState } from 'react';
import { Product, Order, Season } from '../types';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  setProducts: (p: Product[]) => void;
  setOrders: (o: Order[]) => void;
  season: Season;
  setSeason: (s: Season) => void;
  logout: () => void;
  announcement: string;
  setAnnouncement: (a: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, orders, setProducts, setOrders, season, setSeason, logout, announcement, setAnnouncement }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings' | 'sales' | 'deliveries'>('orders');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [formState, setFormState] = useState<Partial<Product>>({});
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [branchFilter, setBranchFilter] = useState<'Hermosillo' | 'San Luis Río Colorado' | 'Todas'>('Todas');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPriceValue, setTempPriceValue] = useState<string>('');

  const [demoOrdersState, setDemoOrdersState] = useState<Order[]>([
    {
      id: "AS-7742",
      date: "28/01/2026",
      items: [
        {
          id: "item1",
          productId: "sofia",
          productName: "Sofía",
          productImage: "/products/sofia.png",
          quantity: 1,
          price: 1650,
          variantName: "24 ROSAS"
        }
      ],
      total: 1650,
      senderName: "Juan Pérez",
      senderPhone: "6621234567",
      senderEmail: "juan@example.com",
      receiverName: "María García",
      receiverPhone: "6629876543",
      deliveryType: "delivery",
      deliveryAddress: "Blvd. Kino #300, Col. Pitic, Hermosillo",
      gateCode: "#1234",
      qrAccess: true,
      cardMessage: "¡Feliz aniversario mi amor!",
      status: "Pendiante",
      paymentStatus: "paid"
    },
    {
      id: "AS-3321",
      date: "28/01/2026",
      items: [
        {
          id: "item2",
          productId: "elena",
          productName: "Elena",
          productImage: "/products/elena.png",
          quantity: 1,
          price: 20500,
          variantName: "500 ROSAS"
        }
      ],
      total: 20500,
      senderName: "Roberto Villa",
      senderPhone: "6531112233",
      senderEmail: "roberto@villa.com",
      receiverName: "Lucía Méndez",
      receiverPhone: "6534445566",
      deliveryType: "pickup",
      deliveryAddress: "Sucursal: San Luis Río Colorado",
      pickupBranch: "San Luis Río Colorado",
      cardMessage: "Espero que te gusten.",
      status: "Pendiante",
      paymentStatus: "paid"
    },
    {
      id: "AS-5582",
      date: "29/01/2026",
      items: [
        {
          id: "item3",
          productId: "amalia",
          productName: "Amalia",
          productImage: "/products/amalia.png",
          quantity: 1,
          price: 950,
          variantName: "12 ROSAS"
        }
      ],
      total: 950,
      senderName: "Carlos Ruiz",
      senderPhone: "6625558899",
      senderEmail: "carlos@ruiz.com",
      receiverName: "Ana Martínez",
      receiverPhone: "6624441122",
      deliveryType: "delivery",
      deliveryAddress: "Residencial La Joya, Hermosillo",
      gateCode: "#5678",
      qrAccess: false,
      cardMessage: "Con mucho cariño.",
      status: "Pendiente",
      paymentStatus: "paid"
    },
    {
      id: "AS-9921",
      date: "29/01/2026",
      items: [
        {
          id: "item4",
          productId: "olivia",
          productName: "Olivia",
          productImage: "/products/olivia.png",
          quantity: 1,
          price: 1250,
          variantName: "12 ROSAS"
        }
      ],
      total: 1250,
      senderName: "Patricia Lopez",
      senderPhone: "6539998877",
      senderEmail: "paty@mail.com",
      receiverName: "Elena Sanchez",
      receiverPhone: "6531110022",
      deliveryType: "delivery",
      deliveryAddress: "Av. Libertad #15, San Luis Río Colorado",
      qrAccess: false,
      cardMessage: "Con mucho amor.",
      status: "Pendiente",
      paymentStatus: "paid"
    }
  ]);

  const demoOrders = demoOrdersState.map(o => o.status === 'Pendiante' as any ? { ...o, status: 'Pendiente' } : o);
  const migratedOrders = (isDemoMode ? demoOrders : orders).map(o => o.status === 'Pendiante' as any ? { ...o, status: 'Pendiente' } : o);

  const currentOrders = migratedOrders.filter(o => {
    if (branchFilter === 'Todas') return true;
    const isSLRC = o.pickupBranch === 'San Luis Río Colorado' || o.deliveryAddress.toLowerCase().includes('san luis');
    const isHMO = o.pickupBranch === 'Hermosillo' || o.deliveryAddress.toLowerCase().includes('hermosillo');
    if (branchFilter === 'San Luis Río Colorado') return isSLRC;
    if (branchFilter === 'Hermosillo') return isHMO;
    return true;
  });

  const newOrders = currentOrders.filter(o => o.status !== 'Entregado');
  const deliveredOrders = currentOrders.filter(o => o.status === 'Entregado');
  const logisticsOrders = currentOrders.filter(o => o.status === 'Elaborado');

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    if (isDemoMode) {
      setDemoOrdersState(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } else {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('id', orderId);
        if (error) throw error;

        // Update local state by manual update
        const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
        setOrders(updatedOrders);
      } catch (err) {
        console.error('Error updating status:', err);
        alert('Error al actualizar el estado.');
      }
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormState({ ...product, seasons: product.seasons || [Season.DEFAULT] });
  };

  const handleAddClick = () => {
    setIsAddingProduct(true);
    setFormState({
      id: `p${Date.now()}`,
      name: '',
      category: 'Arreglos Premium',
      basePrice: 0,
      description: '',
      images: ['https://images.unsplash.com/photo-1522673607200-164883214cde?auto=format&fit=crop&q=80&w=800'],
      seasons: [Season.DEFAULT]
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = formState as Product;

    try {
      const payload = {
        id: productData.id,
        name: productData.name,
        description: productData.description,
        base_price: productData.basePrice,
        category: productData.category,
        images: productData.images,
        variants: productData.variants || [],
        notes: productData.notes || '',
        seasons: productData.seasons
      };

      if (isAddingProduct) {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
        setProducts([...products, productData]);
      } else {
        const { error } = await supabase.from('products').update(payload).eq('id', editingProduct?.id);
        if (error) throw error;
        setProducts(products.map(p => p.id === editingProduct?.id ? productData : p));
      }
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error al guardar el producto.');
    } finally {
      setEditingProduct(null);
      setIsAddingProduct(false);
    }
  };

  const toggleProductSeason = async (productId: string, seasonId: Season) => {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    const currentSeasons = p.seasons || [];
    const newSeasons = currentSeasons.includes(seasonId)
      ? currentSeasons.filter(s => s !== seasonId)
      : [...currentSeasons, seasonId];

    const finalSeasons = newSeasons.length > 0 ? newSeasons : [Season.DEFAULT];

    try {
      const { error } = await supabase
        .from('products')
        .update({ seasons: finalSeasons })
        .eq('id', productId);
      if (error) throw error;
      setProducts(products.map(p => p.id === productId ? { ...p, seasons: finalSeasons } : p));
    } catch (err) {
      console.error('Error updating seasons:', err);
    }
  };

  const addVariant = () => {
    const variants = formState.variants || [];
    setFormState({
      ...formState,
      variants: [...variants, { name: '', price: 0 }]
    });
  };

  const removeVariant = (index: number) => {
    const variants = formState.variants || [];
    setFormState({
      ...formState,
      variants: variants.filter((_, i) => i !== index)
    });
  };

  const updateVariant = (index: number, field: 'name' | 'price', value: string | number) => {
    const variants = [...(formState.variants || [])];
    variants[index] = { ...variants[index], [field]: value };
    setFormState({ ...formState, variants });
  };

  const updateProductPrice = async (productId: string, price: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ base_price: price })
        .eq('id', productId);
      if (error) throw error;
      setProducts(products.map(p => p.id === productId ? { ...p, basePrice: price } : p));
    } catch (err) {
      console.error('Error updating price:', err);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const { error } = await supabase
        .from('store_settings')
        .upsert({
          key: 'announcement_message',
          value: { message: announcement },
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('Configuración guardada correctamente.');
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Error al guardar la configuración.');
    }
  };

  const SEASONS_CONFIG = [
    {
      id: Season.VALENTINES,
      name: 'San Valentín',
      date: '14 de Febrero',
      icon: 'fa-heart',
      color: 'text-asarum-red',
      bg: 'bg-red-50',
      description: 'Activa el tema romántico y prioriza flores rojas y rosadas.'
    },
    {
      id: Season.MOTHERS_DAY,
      name: 'Día de las Madres',
      date: '10 de Mayo',
      icon: 'fa-person-breastfeeding',
      color: 'text-asarum-pink',
      bg: 'bg-pink-50',
      description: 'Activa el tema floral pastel y destaca arreglos familiares.'
    },
    {
      id: Season.DEFAULT,
      name: 'Temporada Regular',
      date: 'Todo el año',
      icon: 'fa-leaf',
      color: 'text-asarum-indigo',
      bg: 'bg-indigo-50',
      description: 'Tema estándar elegante con catálogo completo y equilibrado.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col lg:flex-row font-sans">
      {/* Sidebar - Mobile Responsive */}
      <aside className="w-full lg:w-72 glass-morphism border-r border-white/40 p-8 flex flex-col z-10">
        <div className="mb-12">
          <h2 className="text-3xl font-black text-asarum-dark tracking-tighter uppercase">Admin</h2>
          <div className="h-1 w-12 bg-asarum-red mt-2 rounded-full"></div>
        </div>

        <nav className="space-y-3 flex-grow">
          {[
            { id: 'orders', icon: 'fa-receipt', label: 'Pedidos', count: currentOrders.length },
            { id: 'deliveries', icon: 'fa-truck-fast', label: 'Entregas', count: logisticsOrders.length },
            { id: 'sales', icon: 'fa-chart-line', label: 'Ventas' },
            { id: 'products', icon: 'fa-wand-magic-sparkles', label: 'Catálogo' },
            { id: 'settings', icon: 'fa-palette', label: 'Personalización' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-5 py-4 rounded-3xl text-xs font-black uppercase tracking-widest flex items-center gap-4 transition-all duration-300 ${activeTab === tab.id
                ? 'bg-asarum-dark text-white shadow-2xl scale-[1.02]'
                : 'text-asarum-slate hover:bg-white/60'
                }`}
            >
              <i className={`fa-solid ${tab.icon} text-lg w-6`}></i>
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-asarum-red text-white' : 'bg-asarum-red/10 text-asarum-red'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-12 group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-asarum-slate hover:text-asarum-red transition-colors"
        >
          <div className="w-10 h-10 rounded-2xl glass-morphism flex items-center justify-center group-hover:bg-asarum-red group-hover:text-white transition-all">
            <i className="fa-solid fa-power-off"></i>
          </div>
          <span>Cerrar Sesión</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 lg:p-12 overflow-y-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-asarum-dark uppercase tracking-tighter leading-none">
              {activeTab === 'orders' && 'Pedidos'}
              {activeTab === 'deliveries' && 'Logística de Entregas'}
              {activeTab === 'sales' && 'Ventas'}
              {activeTab === 'products' && 'Catálogo'}
              {activeTab === 'settings' && 'Ajustes'}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <p className="text-asarum-slate font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-asarum-red animate-pulse"></span>
                Sesión de administrador activa
              </p>
              <button
                onClick={() => setIsDemoMode(!isDemoMode)}
                className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all flex items-center gap-2 ${isDemoMode
                  ? 'bg-asarum-red text-white shadow-lg'
                  : 'bg-white text-asarum-slate border border-slate-200 hover:border-asarum-red/30 shadow-sm'
                  }`}
              >
                <i className={`fa-solid ${isDemoMode ? 'fa-toggle-on' : 'fa-toggle-off'} text-sm`}></i>
                {isDemoMode ? 'Modo Demo Activo' : 'Activar Modo Demo'}
              </button>

              <div className="flex bg-white/60 p-1 rounded-2xl border border-slate-200 ml-2">
                {['Todas', 'Hermosillo', 'San Luis Río Colorado'].map((b) => (
                  <button
                    key={b}
                    onClick={() => setBranchFilter(b as any)}
                    className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${branchFilter === b
                      ? 'bg-asarum-dark text-white shadow-md'
                      : 'text-asarum-slate hover:bg-slate-50'
                      }`}
                  >
                    {b === 'San Luis Río Colorado' ? 'SLRC' : b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card px-6 py-3 border-white flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-asarum-slate uppercase tracking-widest">Temporada</p>
              <p className="text-sm font-black text-asarum-red uppercase">{season}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-asarum-red">
              <i className="fa-solid fa-calendar-check"></i>
            </div>
          </div>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Ventas Totales', val: `$${currentOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}`, icon: 'fa-chart-line', color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Pedidos Recibidos', val: currentOrders.length, icon: 'fa-box', color: 'text-asarum-red', bg: 'bg-red-50' },
            { label: 'Productos Activos', val: products.length, icon: 'fa-tag', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Ticket Promedio', val: `$${currentOrders.length > 0 ? (currentOrders.reduce((sum, o) => sum + o.total, 0) / currentOrders.length).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}`, icon: 'fa-wallet', color: 'text-asarum-indigo', bg: 'bg-indigo-50' }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 border-white flex items-center gap-5 hover:scale-[1.02] transition-transform">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center text-xl shadow-sm border border-white/40`}>
                <i className={`fa-solid ${stat.icon}`}></i>
              </div>
              <div>
                <p className="text-[10px] font-black text-asarum-slate uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-asarum-dark">{stat.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Content: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-12">
            {/* Nuevos Pedidos Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                <div className="w-2 h-2 rounded-full bg-asarum-red animate-pulse"></div>
                <h3 className="text-xs font-black text-asarum-dark uppercase tracking-[0.2em]">Nuevos Pedidos</h3>
                <span className="bg-asarum-red/10 text-asarum-red text-[10px] font-black px-2 py-0.5 rounded-full">
                  {newOrders.length}
                </span>
              </div>

              {newOrders.length === 0 ? (
                <div className="glass-card p-20 text-center border-dashed border-2 border-slate-100">
                  <i className="fa-solid fa-check-circle text-5xl text-asarum-red/10 mb-4 block"></i>
                  <p className="text-asarum-slate font-black uppercase tracking-widest text-[10px] opacity-40">Todo en orden • No hay pendientes</p>
                </div>
              ) : (
                newOrders.map(order => (
                  <div key={order.id} className={`glass-card p-6 md:p-8 flex flex-col xl:flex-row gap-8 items-start xl:items-center transition-all group border-2 ${order.paymentStatus === 'paid' ? 'border-[#AEED5D]/30 shadow-[#AEED5D]/5' : 'border-white'}`}>
                    <div className="flex-grow space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-[10px] font-black text-asarum-red uppercase tracking-widest">ID: #{order.id}</div>
                          {order.paymentStatus === 'paid' && (
                            <span className="bg-[#AEED5D] text-asarum-dark text-[9px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1.5 shadow-sm border border-asarum-dark/5 animate-pulse-subtle">
                              <i className="fa-solid fa-circle-check text-xs"></i>
                              PAGADO
                            </span>
                          )}
                          <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1.5 shadow-sm border border-asarum-dark/5 ${order.status === 'Entregado' ? 'bg-green-50 text-green-600 border-green-100' :
                            order.status === 'Elaborado' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                              'bg-red-50 text-asarum-red border-red-100'
                            }`}>
                            <i className={`fa-solid ${order.status === 'Entregado' ? 'fa-check-double' :
                              order.status === 'Elaborado' ? 'fa-wand-magic-sparkles' :
                                'fa-clock animate-pulse'
                              } text-xs`}></i>
                            {order.status}
                          </span>
                          <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${order.deliveryType === 'pickup' ? 'bg-asarum-indigo text-white' : 'bg-asarum-slate text-white'
                            }`}>
                            <i className={`fa-solid ${order.deliveryType === 'pickup' ? 'fa-store' : 'fa-truck'} mr-1.5`}></i>
                            {order.deliveryType === 'pickup' ? 'Recoger en Tienda' : 'Entrega a Domicilio'}
                          </span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-asarum-slate flex items-center gap-1">
                          <i className="fa-solid fa-clock"></i> {order.date}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative group/contact">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-asarum-red mb-2 opacity-60">Quién Envía</h4>
                          <div className="flex items-center gap-3">
                            <p className="text-xl font-black text-asarum-dark uppercase tracking-tight">{order.senderName}</p>
                            <a
                              href={`https://wa.me/${order.senderPhone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm"
                              title="Contactar por WhatsApp"
                            >
                              <i className="fa-brands fa-whatsapp"></i>
                            </a>
                          </div>
                          <p className="text-xs font-bold text-asarum-slate mt-1">{order.senderPhone} • {order.senderEmail}</p>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-asarum-slate mb-2 opacity-60">Quién Recibe</h4>
                          <p className="text-xl font-black text-asarum-dark uppercase tracking-tight">{order.receiverName}</p>
                          <p className="text-xs font-bold text-asarum-slate mt-1">{order.receiverPhone}</p>
                        </div>
                      </div>

                      <div className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white space-y-4 text-left">
                        {order.qrAccess && (
                          <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-200 animate-pulse-subtle">
                            <div className="flex items-center gap-3 mb-1">
                              <i className="fa-solid fa-qrcode text-amber-600 text-lg"></i>
                              <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">REQUIERE QR DE ACCESO</p>
                            </div>
                            <p className="text-[10px] text-amber-700 font-bold">
                              Contactar al remitente urgente para solicitar el pase.
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <span className="font-black text-[10px] uppercase tracking-widest text-asarum-dark block mb-2 opacity-50">Artículos:</span>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white/50 p-2 rounded-xl border border-white/50">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center">
                                      <img
                                        src={item.productImage}
                                        className="w-full h-full object-cover block"
                                        alt=""
                                        loading="eager"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = 'https://picsum.photos/id/248/200/200';
                                        }}
                                      />
                                    </div>
                                    <span className="text-[10px] font-black text-asarum-dark uppercase tracking-tight">{item.productName} × {item.quantity}</span>
                                  </div>
                                  <span className="text-[10px] font-black text-asarum-red">${(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <span className="font-black text-[10px] uppercase tracking-widest text-asarum-dark block mb-1 opacity-50">
                                {order.deliveryType === 'pickup' ? 'Sucursal de Recolección:' : 'Dirección de Entrega:'}
                              </span>
                              <p className="text-xs font-medium text-asarum-dark flex items-start gap-2">
                                <i className={`fa-solid ${order.deliveryType === 'pickup' ? 'fa-store' : 'fa-location-dot'} text-asarum-red mt-0.5`}></i>
                                {order.deliveryAddress}
                              </p>
                              {(order.gateCode || order.qrAccess) && (
                                <div className="mt-2 bg-slate-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
                                  <i className={`fa-solid ${order.qrAccess ? 'fa-qrcode' : 'fa-key'} text-[10px] text-asarum-slate`}></i>
                                  <span className="text-[10px] font-black text-asarum-dark uppercase">
                                    {order.qrAccess ? 'Pedir QR' : `Clave: ${order.gateCode}`}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div>
                              <span className="font-black text-[10px] uppercase tracking-widest text-asarum-dark block mb-1 opacity-50">Mensaje de Tarjeta:</span>
                              <p className="text-xs text-asarum-slate italic leading-relaxed">"{order.cardMessage}"</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full xl:w-80 flex flex-col items-end gap-6 xl:border-l border-slate-100 xl:pl-8">
                      <div className="text-right w-full">
                        <p className="text-4xl font-black text-asarum-dark">${order.total.toLocaleString()}</p>
                        <p className="text-[10px] font-black text-asarum-slate uppercase tracking-widest">{order.items.length} artículos</p>
                      </div>
                      <div className="grid grid-cols-2 xl:grid-cols-1 gap-2 w-full">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-asarum-dark text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-asarum-red transition-colors shadow-lg active:scale-95"
                        >
                          Ver Detalles
                        </button>
                        {order.status === 'Pendiente' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Elaborado')}
                            className="bg-asarum-red text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all active:scale-95"
                          >
                            Marcar Elaborado
                          </button>
                        )}
                        {order.status !== 'Entregado' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Entregado')}
                            className="glass-morphism text-asarum-dark border-asarum-red/10 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors active:scale-95"
                          >
                            Marcar Entregado
                          </button>
                        )}
                        {order.status === 'Elaborado' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Pendiente')}
                            className="text-[9px] font-black text-asarum-slate uppercase tracking-widest hover:text-asarum-red transition-colors flex items-center justify-center gap-1 mt-1"
                          >
                            <i className="fa-solid fa-rotate-left"></i>
                            Volver a NO ELABORADO
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Historial de Pedidos Section */}
            <div className="space-y-6 pt-12 border-t border-slate-200">
              <div className="flex items-center gap-3 px-2">
                <i className="fa-solid fa-box-archive text-asarum-slate opacity-40 text-xs"></i>
                <h3 className="text-[10px] font-black text-asarum-slate uppercase tracking-[0.2em] opacity-40">Historial de Pedidos</h3>
                <span className="bg-slate-100 text-asarum-slate text-[10px] font-black px-2 py-0.5 rounded-full opacity-40">
                  {deliveredOrders.length}
                </span>
              </div>

              <div className="space-y-4">
                {deliveredOrders.length === 0 ? (
                  <p className="text-asarum-slate text-[10px] font-black uppercase tracking-widest text-center py-10 opacity-30">No hay entregas registradas hoy</p>
                ) : (
                  deliveredOrders.map(order => (
                    <div key={order.id} className="glass-card p-6 border-white/40 opacity-70 hover:opacity-100 transition-opacity">
                      <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                            <i className="fa-solid fa-check"></i>
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-black text-asarum-dark uppercase tracking-tight">{order.receiverName}</p>
                              <span className="text-[9px] font-black text-asarum-slate opacity-40">#{order.id}</span>
                            </div>
                            <p className="text-[9px] font-black text-asarum-slate uppercase tracking-widest mt-0.5">
                              {order.date} • {order.items.length} artículos
                              {order.deliveryType === 'delivery' && (
                                <span className="text-asarum-red font-black ml-1">
                                  • {order.deliveryAddress.split(',').length > 1 ? order.deliveryAddress.split(',')[1].trim() : order.deliveryAddress}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-xl font-black text-asarum-dark">${order.total.toLocaleString()}</p>
                            <p className="text-[9px] font-black text-green-600 uppercase tracking-widest">ENTREGADO</p>
                          </div>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-3 rounded-xl bg-slate-50 text-asarum-slate hover:bg-asarum-dark hover:text-white transition-all shadow-sm"
                          >
                            <i className="fa-solid fa-eye text-[10px]"></i>
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Elaborado')}
                            className="p-3 rounded-xl bg-slate-50 text-asarum-slate hover:bg-asarum-red hover:text-white transition-all shadow-sm"
                            title="Reactivar Pedido (Volver a Elaborado)"
                          >
                            <i className="fa-solid fa-rotate-left text-[10px]"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Sales */}
        {activeTab === 'sales' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Sales Stats Aggregation */}
            {(() => {
              const paidOrders = currentOrders.filter(o => o.paymentStatus === 'paid');
              const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
              const avgOrder = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

              // Aggregate by product for chart
              const productSales: Record<string, { total: number, qty: number, name: string }> = {};
              paidOrders.forEach(o => {
                o.items.forEach(i => {
                  if (!productSales[i.productId]) {
                    productSales[i.productId] = { total: 0, qty: 0, name: i.productName };
                  }
                  productSales[i.productId].total += i.price * i.quantity;
                  productSales[i.productId].qty += i.quantity;
                });
              });

              const chartData = Object.values(productSales).sort((a, b) => b.total - a.total).slice(0, 5);
              const maxVal = Math.max(...chartData.map(d => d.total), 1);

              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: 'Ventas Totales', value: `$${totalRevenue.toLocaleString()}`, icon: 'fa-money-bill-trend-up', color: 'bg-green-50 text-green-600' },
                      { label: 'Órdenes Pagadas', value: paidOrders.length, icon: 'fa-check-double', color: 'bg-asarum-indigo/10 text-asarum-indigo' },
                      { label: 'Promedio de Orden', value: `$${avgOrder.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: 'fa-calculator', color: 'bg-amber-50 text-amber-600' }
                    ].map((stat, idx) => (
                      <div key={idx} className="glass-card p-8 border-white flex items-center justify-between group hover:scale-[1.02] transition-all">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-asarum-slate mb-1 opacity-60">{stat.label}</p>
                          <p className="text-3xl font-black text-asarum-dark tracking-tighter">{stat.value}</p>
                        </div>
                        <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-xl shadow-inner`}>
                          <i className={`fa-solid ${stat.icon}`}></i>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Simplified Chart (CSS Based) */}
                    <div className="glass-card p-8 border-white flex flex-col">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-asarum-dark uppercase tracking-tight">Top de Productos (Ventas)</h3>
                        <span className="text-[10px] font-black text-asarum-slate uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Top 5</span>
                      </div>
                      <div className="space-y-6 flex-grow flex flex-col justify-center">
                        {chartData.map((item, idx) => (
                          <div key={idx} className="space-y-2 group">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                              <span className="text-asarum-dark group-hover:text-asarum-red transition-colors">{item.name}</span>
                              <span className="text-asarum-slate">${item.total.toLocaleString()}</span>
                            </div>
                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-white shadow-inner">
                              <div
                                className="h-full bg-asarum-dark group-hover:bg-asarum-red transition-all duration-1000 ease-out rounded-full relative"
                                style={{ width: `${(item.total / maxVal) * 100}%` }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Activity Ledger */}
                    <div className="glass-card p-0 border-white overflow-hidden">
                      <div className="p-8 border-b border-slate-100">
                        <h3 className="text-lg font-black text-asarum-dark uppercase tracking-tight">Libro de Ventas</h3>
                      </div>
                      <div className="overflow-x-auto max-h-[400px]">
                        <table className="w-full text-left">
                          <thead className="sticky top-0 bg-slate-50 z-10">
                            <tr className="text-[9px] font-black text-asarum-slate uppercase tracking-[0.2em]">
                              <th className="px-6 py-4">ID</th>
                              <th className="px-6 py-4">Fecha</th>
                              <th className="px-6 py-4">Cliente</th>
                              <th className="px-6 py-4 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {paidOrders.map(o => (
                              <tr key={o.id} className="hover:bg-white/60 transition-colors text-xs">
                                <td className="px-6 py-4 font-black text-asarum-red">#{o.id}</td>
                                <td className="px-6 py-4 text-asarum-slate font-bold">{o.date}</td>
                                <td className="px-6 py-4 text-asarum-dark font-black uppercase tracking-tight">{o.senderName}</td>
                                <td className="px-6 py-4 text-right font-black text-asarum-dark">${o.total.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Tab Content: Deliveries (Logistics) */}
        {activeTab === 'deliveries' && (
          <div className="space-y-12">
            {/* Logistics Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Pedidos totales', val: logisticsOrders.length + deliveredOrders.length, icon: 'fa-truck-ramp-box', color: 'text-asarum-indigo', bg: 'bg-indigo-50' },
                { label: 'Entregados', val: deliveredOrders.length, icon: 'fa-circle-check', color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Por entregar', val: logisticsOrders.length, icon: 'fa-box-open', color: 'text-asarum-red', bg: 'bg-red-50' }
              ].map((stat, i) => (
                <div key={i} className="glass-card p-8 border-white flex items-center gap-6 shadow-sm">
                  <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center text-2xl shadow-inner`}>
                    <i className={`fa-solid ${stat.icon}`}></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-asarum-slate uppercase tracking-widest opacity-60">{stat.label}</p>
                    <p className="text-4xl font-black text-asarum-dark">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                <i className="fa-solid fa-route text-asarum-red animate-pulse"></i>
                <h3 className="text-xs font-black text-asarum-dark uppercase tracking-[0.2em]">Ruta de Entrega (Pedidos Elaborados)</h3>
              </div>

              {logisticsOrders.length === 0 ? (
                <div className="glass-card p-20 text-center border-dashed border-2 border-slate-100">
                  <i className="fa-solid fa-clipboard-list text-5xl text-asarum-slate/10 mb-4 block"></i>
                  <p className="text-asarum-slate font-black uppercase tracking-widest text-[10px] opacity-40">No hay pedidos listos para entrega directa</p>
                </div>
              ) : (
                logisticsOrders.map(order => (
                  <div key={order.id} className="glass-card p-8 flex flex-col xl:flex-row gap-10 items-start xl:items-center border-2 border-white/60 hover:border-asarum-red/20 transition-all shadow-xl">
                    <div className="flex-grow space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-[11px] font-black text-white bg-asarum-red px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">ID: #{order.id}</span>
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2 ${order.deliveryType === 'pickup' ? 'bg-asarum-indigo/10 text-asarum-indigo' : 'bg-asarum-dark/10 text-asarum-dark'
                            }`}>
                            <i className={`fa-solid ${order.deliveryType === 'pickup' ? 'fa-store' : 'fa-truck'}`}></i>
                            {order.deliveryType === 'pickup' ? 'RECOGER EN TIENDA' : 'ENTREGA A DOMICILIO'}
                          </span>
                        </div>
                        <span className="text-[10px] font-black uppercase text-asarum-slate bg-slate-100 px-3 py-1 rounded-full">
                          <i className="fa-solid fa-calendar mr-1.5 opacity-40"></i> {order.date}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        <div>
                          <p className="text-[10px] font-black text-asarum-slate uppercase tracking-widest mb-2 opacity-60">Dirección Logística</p>
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                            <i className="fa-solid fa-location-dot text-asarum-red text-xl mt-1"></i>
                            <div className="space-y-2">
                              <p className="text-sm font-black text-asarum-dark leading-snug">{order.deliveryAddress}</p>
                              {order.qrAccess ? (
                                <div className="p-3 rounded-xl bg-amber-100/50 border border-amber-200">
                                  <p className="text-[9px] font-black text-amber-800 uppercase flex items-center gap-2">
                                    <i className="fa-solid fa-qrcode"></i> REQUIERE QR DE ACCESO
                                  </p>
                                </div>
                              ) : order.gateCode ? (
                                <p className="text-[10px] font-bold text-asarum-red flex items-center gap-2">
                                  <i className="fa-solid fa-key"></i> CLAVE ACCESO: {order.gateCode}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-black text-asarum-slate uppercase tracking-widest mb-2 opacity-60">Datos de Recepción (Entrega)</p>
                          <div className="p-4 rounded-2xl bg-white border border-slate-100">
                            <p className="text-lg font-black text-asarum-dark uppercase leading-none">{order.receiverName}</p>
                            <p className="text-[10px] text-asarum-slate font-bold mt-2">{order.receiverPhone}</p>
                            <div className="flex gap-2 mt-3">
                              <a
                                href={`tel:${order.receiverPhone.replace(/\D/g, '')}`}
                                className="flex-grow py-2 rounded-xl bg-slate-100 text-asarum-dark text-[9px] font-black uppercase text-center hover:bg-asarum-dark hover:text-white transition-all shadow-sm flex items-center justify-center gap-1.5"
                              >
                                <i className="fa-solid fa-phone"></i> Llamar
                              </a>
                              <a
                                href={`https://wa.me/${order.receiverPhone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-grow py-2 rounded-xl bg-green-50 text-green-600 text-[9px] font-black uppercase text-center hover:bg-green-600 hover:text-white transition-all shadow-sm flex items-center justify-center gap-1.5"
                              >
                                <i className="fa-brands fa-whatsapp"></i> WA
                              </a>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-black text-asarum-slate uppercase tracking-widest mb-2 opacity-60">Datos de Remitente (Acceso/Dudas)</p>
                          <div className="p-4 rounded-2xl bg-white border border-slate-100">
                            <p className="text-lg font-black text-asarum-dark uppercase leading-none">{order.senderName}</p>
                            <p className="text-[10px] text-asarum-slate font-bold mt-2">{order.senderPhone}</p>
                            <div className="flex gap-2 mt-3">
                              <a
                                href={`tel:${order.senderPhone.replace(/\D/g, '')}`}
                                className="flex-grow py-2 rounded-xl bg-slate-100 text-asarum-dark text-[9px] font-black uppercase text-center hover:bg-asarum-dark hover:text-white transition-all shadow-sm flex items-center justify-center gap-1.5"
                              >
                                <i className="fa-solid fa-phone"></i> Llamar
                              </a>
                              <a
                                href={`https://wa.me/${order.senderPhone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-grow py-2 rounded-xl bg-green-50 text-green-600 text-[9px] font-black uppercase text-center hover:bg-green-600 hover:text-white transition-all shadow-sm flex items-center justify-center gap-1.5"
                              >
                                <i className="fa-brands fa-whatsapp"></i> WA
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <p className="text-[10px] font-black text-asarum-slate uppercase tracking-widest flex items-center gap-2">
                            <i className="fa-solid fa-layer-group"></i> Detalles de Carga ({order.items.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="bg-white/60 p-2 rounded-2xl border border-white flex items-center gap-3 shadow-sm min-w-[200px]">
                                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-slate-100 flex-shrink-0">
                                  <img src={item.productImage} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="flex-grow">
                                  <p className="text-[10px] font-black text-asarum-dark uppercase tracking-tight">{item.productName} × {item.quantity}</p>
                                  <p className="text-[9px] text-asarum-slate uppercase font-bold">{item.variantName}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-asarum-slate uppercase tracking-widest mb-2">Mensaje en la Tarjeta</p>
                          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 italic text-asarum-slate text-sm leading-relaxed">
                            "{order.cardMessage}"
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full xl:w-72 flex flex-col gap-4 xl:border-l border-slate-100 xl:pl-8">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full py-4 rounded-2xl bg-slate-100 text-asarum-dark text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                      >
                        <i className="fa-solid fa-circle-info"></i> Ver Detalles
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('¿Confirmas que entregaste el pedido en la dirección correcta? (Doble chequeo de seguridad)')) {
                            updateOrderStatus(order.id, 'Entregado');
                          }
                        }}
                        className="w-full py-6 rounded-3xl bg-asarum-red text-white text-[11px] font-black uppercase tracking-widest hover:shadow-2xl hover:scale-[1.02] transition-all shadow-xl flex flex-col items-center gap-1 group"
                      >
                        <i className="fa-solid fa-check-double text-xl group-hover:animate-bounce"></i>
                        MARCAR ENTREGADO
                      </button>
                    </div>
                  </div>
                ))
              )}
              <div className="space-y-6 pt-12 border-t border-slate-200">
                <div className="flex items-center gap-3 px-2">
                  <i className="fa-solid fa-box-archive text-asarum-slate opacity-40 text-xs"></i>
                  <h3 className="text-[10px] font-black text-asarum-slate uppercase tracking-[0.2em] opacity-40">Historial de Entregas Hoy</h3>
                  <span className="bg-slate-100 text-asarum-slate text-[10px] font-black px-2 py-0.5 rounded-full opacity-40">
                    {deliveredOrders.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {deliveredOrders.length === 0 ? (
                    <p className="text-asarum-slate text-[10px] font-black uppercase tracking-widest text-center py-10 opacity-30">No hay entregas finalizadas hoy</p>
                  ) : (
                    deliveredOrders.map(order => (
                      <div key={order.id} className="glass-card p-6 border-white/40 opacity-70 hover:opacity-100 transition-opacity">
                        <div className="flex flex-wrap items-center justify-between gap-6">
                          <div className="flex items-center gap-6">
                            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                              <i className="fa-solid fa-check"></i>
                            </div>
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-black text-asarum-dark uppercase tracking-tight">{order.receiverName}</p>
                                <span className="text-[9px] font-black text-asarum-slate opacity-40">#{order.id}</span>
                              </div>
                              <p className="text-[9px] font-black text-asarum-slate uppercase tracking-widest mt-0.5">
                                {order.date} • {order.items.length} artículos • {order.deliveryType === 'pickup' ? 'PICKUP' : 'DOMICILIO'}
                                {order.deliveryType === 'delivery' && (
                                  <span className="text-asarum-red font-black ml-1">
                                    • {order.deliveryAddress.split(',').length > 1 ? order.deliveryAddress.split(',')[1].trim() : order.deliveryAddress}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="text-right">
                              <p className="text-[9px] font-black text-green-600 uppercase tracking-widest">ENTREGADO</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="p-3 rounded-xl bg-slate-50 text-asarum-slate hover:bg-asarum-dark hover:text-white transition-all shadow-sm"
                                title="Ver Detalles"
                              >
                                <i className="fa-solid fa-circle-info text-[10px]"></i>
                              </button>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'Elaborado')}
                                className="p-3 rounded-xl bg-slate-50 text-asarum-slate hover:bg-asarum-red hover:text-white transition-all shadow-sm"
                                title="Reactivar (Volver a Elaborado)"
                              >
                                <i className="fa-solid fa-rotate-left text-[10px]"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Products */}
        {activeTab === 'products' && (
          <div className="glass-card p-0 overflow-hidden border-white">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white/30 backdrop-blur-md">
              <h3 className="text-xl font-black text-asarum-dark uppercase tracking-tight">Inventario de Arreglos</h3>
              <button
                onClick={handleAddClick}
                className="btn-primary py-3 px-6 text-[10px] font-black flex items-center gap-2"
              >
                <i className="fa-solid fa-plus"></i>
                <span>Nuevo Producto</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr className="text-[10px] font-black text-asarum-slate uppercase tracking-[0.2em]">
                    <th className="px-8 py-4">Imagen</th>
                    <th className="px-8 py-4">Nombre / Categoría</th>
                    <th className="px-8 py-4">Temporada</th>
                    <th className="px-8 py-4 text-right">Precio Base</th>
                    <th className="px-8 py-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-white/40 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden glass-morphism border-2 border-white shadow-sm ring-1 ring-black/5 group-hover:scale-105 transition-transform">
                          <img src={p.images?.[0]} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="font-black text-asarum-dark uppercase tracking-tight">{p.name}</p>
                        <p className="text-[10px] text-asarum-slate uppercase font-bold tracking-widest mt-1">{p.category}</p>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-wrap gap-1.5 min-w-[140px]">
                          {SEASONS_CONFIG.map(s => {
                            const isActive = p.seasons?.includes(s.id);
                            return (
                              <button
                                key={s.id}
                                onClick={() => toggleProductSeason(p.id, s.id)}
                                title={`Alternar ${s.name}`}
                                className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter transition-all border ${isActive
                                  ? 'bg-asarum-red text-white border-asarum-red shadow-sm scale-110'
                                  : 'bg-white text-asarum-slate border-gray-100 hover:border-asarum-red/30'
                                  }`}
                              >
                                {s.id === Season.VALENTINES ? '❤ SV' : s.id === Season.MOTHERS_DAY ? '🤱 Mamá' : '🌿 Regular'}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right font-black text-asarum-dark">
                        <div className="flex items-center justify-end group/price">
                          <span className="text-asarum-red mr-1">$</span>
                          <input
                            type="text"
                            value={editingPriceId === p.id ? tempPriceValue : p.basePrice?.toLocaleString()}
                            onFocus={() => {
                              setEditingPriceId(p.id);
                              setTempPriceValue(p.basePrice?.toString() || '0');
                            }}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9.]/g, '');
                              setTempPriceValue(val);
                            }}
                            onBlur={() => {
                              if (editingPriceId === p.id) {
                                const newPrice = Number(tempPriceValue);
                                if (!isNaN(newPrice) && newPrice !== p.basePrice) {
                                  updateProductPrice(p.id, newPrice);
                                }
                                setEditingPriceId(null);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                (e.target as HTMLInputElement).blur();
                              }
                            }}
                            className="bg-transparent w-24 text-right hover:bg-white/50 focus:bg-white focus:shadow-inner p-1 rounded-lg outline-none border-b-2 border-transparent focus:border-asarum-red transition-all font-black"
                          />
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="w-9 h-9 rounded-xl glass-morphism border-white flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                          >
                            <i className="fa-solid fa-pen text-xs"></i>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('¿Estás seguro de eliminar este producto?')) {
                                setProducts(products.filter(prod => prod.id !== p.id));
                              }
                            }}
                            className="w-9 h-9 rounded-xl glass-morphism border-white flex items-center justify-center text-asarum-red hover:bg-asarum-red hover:text-white transition-all"
                          >
                            <i className="fa-solid fa-trash text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Settings (SEASON SWITCH) */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl space-y-10">
            <div className="glass-card p-10 border-white">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 rounded-3xl bg-asarum-red text-white flex items-center justify-center text-2xl shadow-xl shadow-asarum-red/20">
                  <i className="fa-solid fa-moon"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-asarum-dark uppercase tracking-tight">Control de Temporadas</h3>
                  <p className="text-asarum-slate text-[10px] font-black uppercase tracking-widest">Ajusta el tema global de la tienda</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SEASONS_CONFIG.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSeason(s.id)}
                    className={`relative p-8 rounded-[2.5rem] border-4 text-left transition-all duration-500 group overflow-hidden ${season === s.id
                      ? 'border-asarum-red bg-white shadow-2xl scale-[1.03] z-10'
                      : 'border-transparent glass-morphism opacity-60 hover:opacity-100 hover:border-white'
                      }`}
                  >
                    <div className={`absolute -top-6 -right-6 text-6xl opacity-5 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12 ${s.color}`}>
                      <i className={`fa-solid ${s.icon}`}></i>
                    </div>

                    <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center text-xl mb-6 shadow-sm border border-white`}>
                      <i className={`fa-solid ${s.icon}`}></i>
                    </div>

                    <h4 className={`text-xl font-black uppercase tracking-tight mb-2 ${season === s.id ? 'text-asarum-dark' : 'text-asarum-slate'}`}>
                      {s.name}
                    </h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-asarum-red mb-4">{s.date}</p>
                    <p className="text-xs text-asarum-slate leading-relaxed mb-6">{s.description}</p>

                    {season === s.id && (
                      <div className="flex items-center gap-2 text-[10px] font-black text-asarum-red uppercase tracking-widest">
                        <i className="fa-solid fa-check-circle text-lg"></i>
                        <span>Activo ahora</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-10 border-white bg-gradient-to-br from-white/80 to-slate-50/50">
              <h3 className="text-xl font-black text-asarum-dark uppercase tracking-tight mb-8">Personalización Visual</h3>
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1">Mensaje en Barra de Anuncios</label>
                  <input
                    type="text"
                    value={announcement}
                    onChange={e => setAnnouncement(e.target.value)}
                    placeholder="Ej: ¡Envío GRATIS este 14 de Febrero!"
                    className="w-full bg-white/50 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-transparent focus:border-asarum-red focus:bg-white outline-none transition-all shadow-inner font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <button
                    onClick={handleSaveSettings}
                    className="btn-primary py-5 text-[10px] font-black flex items-center justify-center gap-3"
                  >
                    <i className="fa-solid fa-save"></i>
                    <span>Guardar Cambios</span>
                  </button>
                  <button className="glass-morphism py-5 text-[10px] font-black text-asarum-slate uppercase tracking-widest hover:bg-white transition-all transition-all">
                    <span>Restaurar Predeterminados</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Edit/Add Modal */}
      {(editingProduct || isAddingProduct) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-asarum-dark/40 animate-in fade-in duration-300">
          <div className="bg-white/95 w-full max-w-2xl rounded-[3rem] shadow-2xl border border-white p-8 md:p-12 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => { setEditingProduct(null); setIsAddingProduct(false); }}
              className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-asarum-slate hover:bg-asarum-red hover:text-white transition-all"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>

            <div className="mb-10">
              <h2 className="text-4xl font-black text-asarum-dark uppercase tracking-tighter">
                {isAddingProduct ? 'Nuevo Producto' : 'Editar Producto'}
              </h2>
              <div className="h-1.5 w-16 bg-asarum-red mt-4 rounded-full"></div>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1">Nombre del Arreglo</label>
                  <input
                    required
                    type="text"
                    value={formState.name}
                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-slate-50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-asarum-red focus:bg-white outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1">Categoría</label>
                  <select
                    value={formState.category}
                    onChange={e => setFormState({ ...formState, category: e.target.value })}
                    className="w-full bg-slate-50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-asarum-red focus:bg-white outline-none transition-all font-bold"
                  >
                    <option>Arreglos Premium</option>
                    <option>Ramos</option>
                    <option>Arreglos Grandes</option>
                    <option>Cajas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1">Precio Base ($)</label>
                  <input
                    required
                    type="text"
                    value={formState.basePrice?.toLocaleString() || ''}
                    onChange={e => {
                      const val = e.target.value.replace(/,/g, '');
                      if (!isNaN(Number(val))) {
                        setFormState({ ...formState, basePrice: Number(val) });
                      }
                    }}
                    className="w-full bg-slate-50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-asarum-red focus:bg-white outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1 block">Temporada (Selección Múltiple)</label>
                  <div className="flex flex-wrap gap-2">
                    {SEASONS_CONFIG.map(s => {
                      const seasons = formState.seasons || [];
                      const isSelected = seasons.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            const newSeasons = isSelected
                              ? seasons.filter(curr => curr !== s.id)
                              : [...seasons, s.id];
                            setFormState({ ...formState, seasons: newSeasons.length > 0 ? newSeasons : [Season.DEFAULT] });
                          }}
                          className={`flex-grow md:flex-grow-0 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${isSelected
                            ? 'bg-asarum-dark text-white border-asarum-dark shadow-lg'
                            : 'bg-slate-50 text-asarum-slate border-transparent hover:border-asarum-red/20'
                            }`}
                        >
                          <i className={`fa-solid ${s.icon} mr-2 ${isSelected ? 'text-asarum-red' : ''}`}></i>
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1">URL de la Imagen</label>
                <input
                  type="text"
                  value={formState.images?.[0]}
                  onChange={e => setFormState({ ...formState, images: [e.target.value] })}
                  className="w-full bg-slate-50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-asarum-red focus:bg-white outline-none transition-all font-bold"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-asarum-slate uppercase tracking-widest ml-1">Descripción</label>
                <textarea
                  rows={4}
                  value={formState.description}
                  onChange={e => setFormState({ ...formState, description: e.target.value })}
                  className="w-full bg-slate-50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-asarum-red focus:bg-white outline-none transition-all font-bold resize-none"
                ></textarea>
              </div>

              {/* Seccón de Variantes */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-asarum-dark uppercase tracking-widest ml-1">Variedades / Tamaños (Opcional)</h4>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="text-[9px] font-black text-asarum-red uppercase tracking-widest bg-red-50 px-3 py-1 rounded-lg hover:bg-asarum-red hover:text-white transition-all"
                  >
                    + Agregar Variedad
                  </button>
                </div>

                <div className="space-y-3">
                  {(formState.variants || []).map((variant, idx) => (
                    <div key={idx} className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-transparent focus-within:border-asarum-red/20 transition-all">
                      <div className="flex-grow space-y-1">
                        <label className="text-[8px] font-black text-asarum-slate uppercase tracking-widest ml-1">Nombre (ej: 24 Rosas)</label>
                        <input
                          type="text"
                          value={variant.name}
                          onChange={e => updateVariant(idx, 'name', e.target.value)}
                          placeholder="Nombre de la variedad"
                          className="w-full bg-transparent border-none outline-none font-bold text-sm"
                        />
                      </div>
                      <div className="w-28 space-y-1">
                        <label className="text-[8px] font-black text-asarum-slate uppercase tracking-widest ml-1">Precio ($)</label>
                        <input
                          type="text"
                          value={variant.price || ''}
                          onChange={e => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            updateVariant(idx, 'price', Number(val));
                          }}
                          placeholder="0"
                          className="w-full bg-transparent border-none outline-none font-bold text-sm text-right"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-asarum-slate hover:text-asarum-red transition-colors"
                        title="Eliminar variedad"
                      >
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                    </div>
                  ))}
                  {(formState.variants || []).length === 0 && (
                    <p className="text-[10px] text-asarum-slate italic text-center py-4 border-2 border-dashed border-slate-100 rounded-2xl">
                      Este producto no tiene variedades activas.
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full btn-primary py-5 text-xs font-black shadow-xl shadow-asarum-red/20">
                  <i className="fa-solid fa-save mr-2"></i>
                  {isAddingProduct ? 'Crear Producto' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal de Detalles de Pedido */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-asarum-dark/40 backdrop-blur-md" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative w-full max-w-4xl bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            {/* Header del Modal */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-asarum-dark text-white flex items-center justify-center text-xl shadow-lg">
                  <i className="fa-solid fa-receipt"></i>
                </div>
                <div>
                  <h3 className="text-xl font-black text-asarum-dark uppercase tracking-tight">Detalles del Pedido</h3>
                  <p className="text-[10px] font-black text-asarum-slate uppercase tracking-widest opacity-60">ID: #{selectedOrder.id} • {selectedOrder.date}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-12 h-12 rounded-2xl bg-slate-100 text-asarum-slate hover:bg-asarum-red hover:text-white transition-all flex items-center justify-center group"
              >
                <i className="fa-solid fa-xmark text-lg group-hover:rotate-90 transition-transform"></i>
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {/* Secciones de Contacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-asarum-red/10 text-asarum-red flex items-center justify-center text-xs">
                      <i className="fa-solid fa-paper-plane"></i>
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-asarum-red">
                      {activeTab === 'deliveries' ? 'Datos del Remitente (Acceso/Dudas)' : 'Datos del Remitente'}
                    </h4>
                  </div>
                  <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-4">
                    <div>
                      <p className="text-[9px] font-black text-asarum-slate uppercase mb-1">Nombre Completo</p>
                      <p className="text-base font-black text-asarum-dark uppercase">{selectedOrder.senderName}</p>
                    </div>
                    <div className="flex gap-8">
                      <div>
                        <p className="text-[9px] font-black text-asarum-slate uppercase mb-1">Teléfono</p>
                        <p className="text-sm font-bold text-asarum-dark">{selectedOrder.senderPhone}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-asarum-slate uppercase mb-1">Email</p>
                        <p className="text-sm font-bold text-asarum-dark">{selectedOrder.senderEmail}</p>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/${selectedOrder.senderPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95"
                    >
                      <i className="fa-brands fa-whatsapp text-sm"></i>
                      Contactar Remitente
                    </a>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-asarum-dark/10 text-asarum-dark flex items-center justify-center text-xs">
                      <i className="fa-solid fa-user-check"></i>
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-asarum-dark">Datos del Destinatario</h4>
                  </div>
                  <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-4">
                    <div>
                      <p className="text-[9px] font-black text-asarum-slate uppercase mb-1">Nombre Completo</p>
                      <p className="text-base font-black text-asarum-dark uppercase">{selectedOrder.receiverName}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-asarum-slate uppercase mb-1">Teléfono</p>
                      <p className="text-sm font-bold text-asarum-dark">{selectedOrder.receiverPhone}</p>
                    </div>
                    <a
                      href={`https://wa.me/${selectedOrder.receiverPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95"
                    >
                      <i className="fa-brands fa-whatsapp text-sm"></i>
                      Contactar Destinatario
                    </a>
                  </div>
                </div>
              </div>

              {/* Entrega y Mensaje */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-asarum-red/10 text-asarum-red flex items-center justify-center text-xs">
                      <i className="fa-solid fa-map-location-dot"></i>
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-asarum-red">Logística de Entrega</h4>
                  </div>
                  <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-4">
                    <div>
                      <p className="text-[9px] font-black text-asarum-slate uppercase mb-1">Tipo de Entrega</p>
                      <p className="text-sm font-black text-asarum-dark uppercase flex items-center gap-2">
                        <i className={`fa-solid ${selectedOrder.deliveryType === 'pickup' ? 'fa-store' : 'fa-truck'}`}></i>
                        {selectedOrder.deliveryType === 'pickup' ? 'Recoger en Tienda' : 'Entrega a Domicilio'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-asarum-slate uppercase mb-1">Dirección / Sucursal</p>
                      <p className="text-sm font-medium text-asarum-dark italic">{selectedOrder.deliveryAddress}</p>
                    </div>
                    {selectedOrder.qrAccess ? (
                      <div className="flex items-center gap-2 bg-amber-100/50 px-3 py-1.5 rounded-lg w-fit border border-amber-200">
                        <i className="fa-solid fa-qrcode text-[10px] text-amber-800"></i>
                        <span className="text-[10px] font-black text-amber-800 uppercase text-center">REQUIERE QR DE ACCESO</span>
                      </div>
                    ) : selectedOrder.gateCode ? (
                      <div className="flex items-center gap-2 bg-slate-200/50 px-3 py-1.5 rounded-lg w-fit">
                        <i className="fa-solid fa-key text-[10px] text-asarum-slate"></i>
                        <span className="text-[10px] font-black text-asarum-dark uppercase">Código: {selectedOrder.gateCode}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-asarum-indigo/10 text-asarum-indigo flex items-center justify-center text-xs">
                      <i className="fa-solid fa-envelope-open-text"></i>
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-asarum-indigo">Mensaje Personalizado</h4>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-indigo-50 shadow-inner min-h-[140px] flex items-center justify-center">
                    <p className="text-sm text-center text-slate-600 font-medium italic leading-relaxed">
                      "{selectedOrder.cardMessage}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Artículos Pedidos */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-xs">
                    <i className="fa-solid fa-bag-shopping"></i>
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-600">Artículos del Pedido</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white shadow-sm flex-shrink-0">
                        <img src={item.productImage} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-xs font-black text-asarum-dark uppercase tracking-tight">{item.productName}</p>
                        <p className="text-[10px] font-bold text-asarum-slate uppercase">{item.variantName}</p>
                        {activeTab !== 'deliveries' && (
                          <p className="text-xs font-black text-asarum-red mt-1">${item.price.toLocaleString()} × {item.quantity}</p>
                        )}
                        {activeTab === 'deliveries' && (
                          <p className="text-xs font-black text-asarum-slate mt-1">Cantidad: {item.quantity}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="p-8 border-t border-slate-100 bg-slate-50/80 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {activeTab !== 'deliveries' && (
                  <>
                    <div>
                      <p className="text-[9px] font-black text-asarum-slate uppercase tracking-widest mb-1">Total Pagado</p>
                      <p className="text-3xl font-black text-asarum-dark">${selectedOrder.total.toLocaleString()}</p>
                    </div>
                    <div className="h-10 w-px bg-slate-200"></div>
                  </>
                )}
                <div>
                  <p className="text-[9px] font-black text-asarum-slate uppercase tracking-widest mb-1">Estado</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${selectedOrder.status === 'Entregado' ? 'bg-green-500' :
                      selectedOrder.status === 'Elaborado' ? 'bg-amber-500' :
                        'bg-asarum-red animate-pulse'
                      }`}></span>
                    <p className="text-xs font-black text-asarum-dark uppercase tracking-widest">{selectedOrder.status}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {selectedOrder.status === 'Pendiente' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'Elaborado');
                      setSelectedOrder(null);
                    }}
                    className="bg-asarum-red text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all active:scale-95"
                  >
                    Marcar como Elaborado
                  </button>
                )}
                {selectedOrder.status !== 'Entregado' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'Entregado');
                      setSelectedOrder(null);
                    }}
                    className="bg-asarum-dark text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-asarum-red transition-all shadow-xl active:scale-95"
                  >
                    Marcar como Entregado
                  </button>
                )}
                {selectedOrder.status === 'Elaborado' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'Pendiente');
                      setSelectedOrder(null);
                    }}
                    className="bg-white text-asarum-slate border border-slate-200 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                  >
                    <i className="fa-solid fa-rotate-left mr-2"></i>
                    Volver a NO ELABORADO
                  </button>
                )}
                {selectedOrder.status === 'Entregado' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'Elaborado');
                      setSelectedOrder(null);
                    }}
                    className="bg-white text-asarum-slate border border-slate-200 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                  >
                    <i className="fa-solid fa-rotate-left mr-2"></i>
                    Reactivar Pedido
                  </button>
                )}
                <button
                  onClick={() => window.print()}
                  className="bg-white text-asarum-slate border border-slate-200 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                >
                  <i className="fa-solid fa-print mr-2"></i>
                  Imprimir Orden
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
