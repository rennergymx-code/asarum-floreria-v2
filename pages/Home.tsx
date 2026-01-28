
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
    <div className="space-y-12 pb-24">
      {/* Hero Section - Mobile Priority */}
      <section className="relative h-[85vh] md:h-[75vh] flex items-center justify-center overflow-hidden m-4 md:m-0 rounded-[2.5rem] md:rounded-none shadow-2xl md:shadow-none">
        <div className="absolute inset-0 bg-black/50 z-10 transition-opacity group-hover:opacity-60"></div>
        <img
          src={isValentines
            ? 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=2000'
            : 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=2000'
          }
          className="absolute inset-0 w-full h-full object-cover scale-105"
          alt={isValentines ? "Ramos de Rosas Rojas Premium para San Valentín" : "Arreglos Florales Exclusivos Asarum Florería"}
        />
        <div className="relative z-20 text-center px-6 max-w-4xl">
          {isValentines && (
            <div className="mb-6 flex justify-center">
              <div className="glass-morphism p-4 rounded-full animate-pulse">
                <i className="fa-solid fa-heart text-white text-3xl"></i>
              </div>
            </div>
          )}
          <div className="mb-8">
            <img
              src="/logo.png"
              alt="Asarum Florería y Regalos"
              className="h-48 md:h-64 w-auto mx-auto brightness-0 invert"
            />
          </div>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl mx-auto leading-relaxed font-medium">
            Arreglos diseñados para perdurar. Envíos exclusivos en Hermosillo y SLRC.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <a href="#catalogo" className="btn-primary w-full sm:w-auto text-center">
              Ver Catálogo
            </a>
          </div>
        </div>
      </section>

      {/* Steps Section - Responsive & Modern */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="glass-card p-8 md:p-16 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-asarum-dark mb-4">Tu pedido en segundos</h2>
          <p className="text-asarum-slate mb-12 max-w-md mx-auto">Experiencia optimizada para móviles para que asegures el regalo perfecto rápidamente.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-8">
            {[
              { id: 1, text: 'Explora', icon: 'fa-eye' },
              { id: 2, text: 'Personaliza', icon: 'fa-pen-to-square' },
              { id: 3, text: 'Ubica', icon: 'fa-map-location-dot' },
              { id: 4, text: 'Paga', icon: 'fa-credit-card' },
              { id: 5, text: 'Recibe', icon: 'fa-check-circle' }
            ].map((step) => (
              <div key={step.id} className="relative group">
                <div className="w-16 h-16 glass-morphism rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:bg-asarum-red group-hover:scale-110 transition-all duration-500">
                  <i className={`fa-solid ${step.icon} text-2xl text-asarum-red group-hover:text-white`}></i>
                </div>
                <p className="text-xs font-black text-asarum-dark uppercase tracking-widest">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 glass-morphism p-6 rounded-3xl border-asarum-red/20 border">
            <p className="text-asarum-red font-bold flex flex-col md:flex-row items-center justify-center gap-2 text-sm">
              <i className="fa-solid fa-circle-exclamation text-xl animate-pulse"></i>
              <span>IMPORTANTE: El 14 de Febrero <strong>no hay hora</strong> de entrega.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Catalog Grid - Mobile Optimized Cards */}
      <section id="catalogo" className="px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl md:text-6xl font-black text-asarum-dark lowercase tracking-tighter">catálogo.</h2>
            <div className="h-2 w-24 bg-asarum-red rounded-full mt-2"></div>
          </div>
          <div className="hidden sm:block">
            <span className="glass-morphism px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-asarum-red">
              TEMPORADA {season}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group glass-card flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1522673607200-164883214cde?auto=format&fit=crop&q=80&w=800'}
                  alt={`${product.name} - ${product.description}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 glass-morphism px-3 py-1.5 rounded-2xl text-asarum-red font-black text-xs shadow-lg">
                  ${product.basePrice.toLocaleString()}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-asarum-dark mb-2 uppercase tracking-tight">{product.name}</h3>
                <p className="text-asarum-slate text-xs line-clamp-1 mb-4">{product.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-[10px] font-black text-asarum-red uppercase tracking-widest">detalles</span>
                  <div className="w-8 h-8 rounded-full glass-morphism flex items-center justify-center group-hover:bg-asarum-red transition-all duration-300">
                    <i className="fa-solid fa-arrow-right text-[10px] text-asarum-red group-hover:text-white"></i>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
