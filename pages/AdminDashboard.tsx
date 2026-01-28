
import React, { useState } from 'react';
import { Product, Order, Season } from '../types';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  setProducts: (p: Product[]) => void;
  season: Season;
  setSeason: (s: Season) => void;
  logout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, orders, setProducts, season, setSeason, logout }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');

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
            { id: 'orders', icon: 'fa-receipt', label: 'Pedidos', count: orders.length },
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
              {activeTab === 'products' && 'Catálogo'}
              {activeTab === 'settings' && 'Ajustes'}
            </h1>
            <p className="text-asarum-slate font-black uppercase tracking-[0.2em] text-[10px] mt-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-asarum-red animate-pulse"></span>
              Sesión de administrador activa
            </p>
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

        {/* Tab Content: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="glass-card p-24 text-center border-dashed border-2 border-slate-200">
                <i className="fa-solid fa-inbox text-5xl text-slate-200 mb-6 block"></i>
                <p className="text-asarum-slate font-black uppercase tracking-widest text-xs">Sin pedidos por ahora</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="glass-card p-6 md:p-8 flex flex-col xl:flex-row gap-8 items-start xl:items-center hover:border-asarum-red/20 transition-all group">
                  <div className="flex-shrink-0">
                    <div className="text-[10px] font-black text-asarum-red uppercase tracking-widest mb-1">ID: #{order.id}</div>
                    <h3 className="text-2xl font-black text-asarum-dark uppercase tracking-tight">{order.customerName}</h3>
                    <div className="flex gap-4 mt-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-asarum-slate flex items-center gap-1">
                        <i className="fa-solid fa-clock"></i> {order.date}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-asarum-slate flex items-center gap-1">
                        <i className="fa-solid fa-phone"></i> {order.customerPhone}
                      </span>
                    </div>
                  </div>

                  <div className="flex-grow bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white text-xs text-asarum-slate italic leading-relaxed">
                    <span className="font-black not-italic text-[10px] uppercase tracking-widest text-asarum-dark block mb-2 opacity-50">Mensaje de Tarjeta:</span>
                    "{order.cardMessage}"
                  </div>

                  <div className="w-full xl:w-auto flex items-center justify-between xl:justify-end gap-8 border-t xl:border-t-0 xl:border-l border-slate-100 pt-6 xl:pt-0 xl:pl-8">
                    <div className="text-right">
                      <p className="text-3xl font-black text-asarum-dark">${order.total.toLocaleString()}</p>
                      <p className="text-[10px] font-black text-asarum-slate uppercase tracking-widest">{order.items.length} artículos</p>
                    </div>
                    <button className="bg-asarum-dark text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-asarum-red transition-colors shadow-lg active:scale-95">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content: Products */}
        {activeTab === 'products' && (
          <div className="glass-card p-0 overflow-hidden border-white">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white/30 backdrop-blur-md">
              <h3 className="text-xl font-black text-asarum-dark uppercase tracking-tight">Inventario de Arreglos</h3>
              <button className="btn-primary py-3 px-6 text-[10px] font-black flex items-center gap-2">
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
                        <span className="inline-block text-[10px] font-black px-3 py-1 bg-asarum-red/10 text-asarum-red rounded-full uppercase tracking-widest">
                          {p.season || 'Regular'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right font-black text-asarum-dark">
                        ${p.basePrice?.toLocaleString()}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-center gap-2">
                          <button className="w-9 h-9 rounded-xl glass-morphism border-white flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
                            <i className="fa-solid fa-pen text-xs"></i>
                          </button>
                          <button className="w-9 h-9 rounded-xl glass-morphism border-white flex items-center justify-center text-asarum-red hover:bg-asarum-red hover:text-white transition-all">
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
                    placeholder="Ej: ¡Envío GRATIS este 14 de Febrero!"
                    className="w-full bg-white/50 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-transparent focus:border-asarum-red focus:bg-white outline-none transition-all shadow-inner font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <button className="btn-primary py-5 text-[10px] font-black flex items-center justify-center gap-3">
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
    </div>
  );
};

export default AdminDashboard;
