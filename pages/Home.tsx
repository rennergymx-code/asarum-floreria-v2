
import React from 'react';
import { Link } from 'react-router-dom';
import { Product, Season } from '../types';

interface HomeProps {
  products: Product[];
  season: Season;
}

const Home: React.FC<HomeProps> = ({ products, season }) => {
  const isValentines = season === Season.VALENTINES;

  return (
    <div>
      {/* Hero Section */}
      <section className={`relative h-[75vh] flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src={isValentines 
            ? 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=2000' 
            : 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=2000'
          } 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="Flores" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522673607200-164883214cde?auto=format&fit=crop&q=80&w=2000';
          }}
        />
        <div className="relative z-20 text-center px-4 max-w-4xl">
          {isValentines && (
            <div className="mb-4 animate-bounce">
              <i className="fa-solid fa-heart text-white text-4xl drop-shadow-lg"></i>
            </div>
          )}
          <h1 className="text-5xl md:text-7xl font-serif text-white font-bold mb-6 drop-shadow-2xl">
            {isValentines ? 'Celebra el Amor con Asarum' : 'Expresa tus Sentimientos'}
          </h1>
          <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
            Arreglos florales exclusivos y regalos únicos diseñados para perdurar en el corazón. 
            Envíos en Hermosillo y San Luis Río Colorado.
          </p>
          <a href="#catalogo" className="bg-asarum-red hover:bg-red-800 text-white px-10 py-5 rounded-full text-lg font-bold shadow-2xl transition-all transform hover:scale-105 inline-block">
            Ver Catálogo
          </a>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">¿Cómo hacer mi pedido?</h2>
          <p className="text-gray-500 mb-16 text-lg">Sigue estos sencillos pasos y asegura el regalo perfecto</p>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            {[
              { id: 1, text: 'Elige tu arreglo favorito del catálogo', icon: 'fa-eye' },
              { id: 2, text: 'Personaliza tu tarjeta y mensaje', icon: 'fa-pen-to-square' },
              { id: 3, text: 'Agrega dirección (Google Maps)', icon: 'fa-map-location-dot' },
              { id: 4, text: 'Realiza tu pago en línea seguro', icon: 'fa-credit-card' },
              { id: 5, text: 'Recibe confirmación por WhatsApp', icon: 'fa-check-circle' }
            ].map((step) => (
              <div key={step.id} className="relative group">
                <div className="w-20 h-20 bg-asarum-red/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-asarum-red/10 group-hover:bg-asarum-red transition-all duration-300">
                  <i className={`fa-solid ${step.icon} text-3xl text-asarum-red group-hover:text-white transition-colors`}></i>
                </div>
                <div className="absolute top-0 right-1/2 translate-x-14 w-9 h-9 bg-asarum-red text-white rounded-full flex items-center justify-center text-sm font-bold border-4 border-white shadow-lg">
                  {step.id}
                </div>
                <p className="text-sm font-semibold text-gray-800 leading-tight px-2">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-red-50 p-8 rounded-3xl inline-block border-2 border-dashed border-asarum-red/30">
            <p className="text-asarum-red font-black flex items-center justify-center gap-3 text-lg">
              <i className="fa-solid fa-triangle-exclamation text-2xl animate-pulse"></i>
              IMPORTANTE: El 14 de Febrero NO se garantiza hora específica de entrega por alta demanda.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section id="catalogo" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-asarum-red font-black tracking-[0.2em] uppercase text-xs mb-3 block">Nuestros Arreglos</span>
              <h2 className="text-5xl font-serif font-bold text-gray-900">Catálogo de Temporada</h2>
            </div>
            <div className="flex gap-2">
              <span className="px-6 py-3 bg-asarum-red text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                {season}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {products.map((product) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
              >
                <div className="relative h-96 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522673607200-164883214cde?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-xl text-asarum-red font-black text-sm">
                    Desde ${product.basePrice.toLocaleString()}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-asarum-red transition-colors mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed h-10">
                    {product.description}
                  </p>
                  <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ver Detalles</span>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-asarum-red transition-colors">
                      <i className="fa-solid fa-arrow-right text-asarum-red group-hover:text-white transform group-hover:translate-x-1 transition-all"></i>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
