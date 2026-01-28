
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

  const updateSeason = (newSeason: Season) => {
    setSeason(newSeason);
    alert(`Temporada cambiada a ${newSeason}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-asarum-red">Dashboard</h2>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Administración de Tienda</p>
        </div>
        
        <nav className="space-y-2 flex-grow">
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors ${activeTab === 'orders' ? 'bg-asarum-red text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <i className="fa-solid fa-receipt"></i> Pedidos
            {orders.length > 0 && <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-[10px]">{orders.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('products')} 
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors ${activeTab === 'products' ? 'bg-asarum-red text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <i className="fa-solid fa-wand-magic-sparkles"></i> Catálogo
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors ${activeTab === 'settings' ? 'bg-asarum-red text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <i className="fa-solid fa-sliders"></i> Temporadas
          </button>
        </nav>

        <button onClick={logout} className="mt-auto pt-6 border-t border-gray-100 text-gray-400 hover:text-red-500 flex items-center gap-2 text-sm font-bold transition-colors">
          <i className="fa-solid fa-right-from-bracket"></i>
          Cerrar Sesión
        </button>
      </aside>

      {/* Content */}
      <main className="flex-grow p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeTab === 'orders' && 'Gestión de Pedidos'}
            {activeTab === 'products' && 'Editor de Catálogo'}
            {activeTab === 'settings' && 'Personalización de Tienda'}
          </h1>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span>Status: En Línea</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </header>

        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 gap-6">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">Aún no hay pedidos registrados.</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-black text-asarum-red">#{order.id}</span>
                      <span className="text-xs font-bold px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">{order.status}</span>
                      <span className="text-xs text-gray-400">{order.date}</span>
                    </div>
                    <h3 className="text-lg font-bold">{order.customerName}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <i className="fa-solid fa-phone text-[10px]"></i> {order.customerPhone}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <i className="fa-solid fa-location-dot text-[10px]"></i> {order.deliveryAddress}
                    </p>
                  </div>
                  
                  <div className="flex-grow max-w-md bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs italic">
                    <span className="font-bold not-italic block mb-1">Dedicatoria:</span>
                    "{order.cardMessage}"
                  </div>

                  <div className="text-right min-w-[150px]">
                    <p className="text-2xl font-bold text-gray-900">${order.total.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-4">{order.items.length} Productos</p>
                    <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black transition-colors w-full">Gestionar Pedido</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Listado de Productos</h3>
              <button className="bg-asarum-red text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-800 transition-colors flex items-center gap-2">
                <i className="fa-solid fa-plus"></i> Nuevo Arreglo
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="pb-4">Imagen</th>
                    <th className="pb-4">Nombre</th>
                    <th className="pb-4">Temporada</th>
                    <th className="pb-4">Precio Base</th>
                    <th className="pb-4">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <img src={p.image} className="w-12 h-12 rounded-lg object-cover" />
                      </td>
                      <td className="py-4 font-bold text-gray-700">{p.name}</td>
                      <td className="py-4">
                        <span className="text-[10px] font-bold px-2 py-1 bg-asarum-red/10 text-asarum-red rounded-full uppercase">{p.season}</span>
                      </td>
                      <td className="py-4 font-bold text-gray-900">${p.basePrice.toLocaleString()}</td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><i className="fa-solid fa-pen"></i></button>
                          <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><i className="fa-solid fa-trash"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-2xl">
            <h3 className="text-xl font-bold mb-6">Configuración de la Tienda</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Temporada Activa</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[Season.VALENTINES, Season.MOTHERS_DAY, Season.DEFAULT].map(s => (
                    <button
                      key={s}
                      onClick={() => updateSeason(s)}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${season === s ? 'border-asarum-red bg-asarum-red/5' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-lg font-bold ${season === s ? 'text-asarum-red' : 'text-gray-700'}`}>{s}</span>
                        {season === s && <i className="fa-solid fa-check-circle text-asarum-red text-xl"></i>}
                      </div>
                      <p className="text-xs text-gray-500">Aplica filtros visuales y prioriza el catálogo de esta temporada.</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t mt-8">
                <h4 className="font-bold text-gray-900 mb-4">Anuncios en Cabecera</h4>
                <input 
                  type="text" 
                  placeholder="Ej: ¡Envío GRATIS en pedidos de San Valentín!"
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 outline-none focus:border-asarum-red"
                />
              </div>

              <button className="w-full bg-asarum-red text-white py-4 rounded-xl font-bold mt-6 shadow-xl hover:bg-red-800">
                Guardar Cambios Globales
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
