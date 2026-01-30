
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import { Product, Season } from '../types';

interface HomeProps {
  products: Product[];
  season: Season;
}

const Home: React.FC<HomeProps> = ({ products, season }) => {
  const isValentines = season === Season.VALENTINES;
  const isMothersDay = season === Season.MOTHERS_DAY;
  const [budgetRange, setBudgetRange] = React.useState<string>('all');
  const location = useLocation();

  const performScrollToCatalog = () => {
    const element = document.getElementById('catalogo');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    if (location.state?.scrollToCatalog) {
      setTimeout(performScrollToCatalog, 300); // Slightly more delay to ensure content is ready
      // Clear state so it doesn't scroll again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const filteredProducts = products.filter(product => {
    // Season filter
    const productSeasons = product.seasons || [Season.DEFAULT];
    if (!productSeasons.includes(season)) return false;

    // Budget filter
    if (budgetRange === 'all') return true;
    if (budgetRange === 'under-1000') return product.basePrice < 1000;
    if (budgetRange === '1000-2500') return product.basePrice >= 1000 && product.basePrice <= 2500;
    if (budgetRange === 'over-2500') return product.basePrice > 2500;
    return true;
  }).sort((a, b) => a.basePrice - b.basePrice);

  // Integrated Hero Image Paths
  const valentinesHeroImage = '/hero-valentines-v2.png';
  const mothersDayHeroImage = 'https://images.unsplash.com/photo-1525061194042-3761a6c47864?auto=format&fit=crop&q=80&w=2000'; // Elegant floral for Mother's Day

  const scrollToCatalog = (e: React.MouseEvent) => {
    e.preventDefault();
    performScrollToCatalog();
  };

  const themeColors = {
    accent: isValentines ? 'text-[#AEED5D]' : isMothersDay ? 'text-asarum-pink' : 'text-[#AEED5D]',
    badge: isValentines ? 'text-asarum-red' : isMothersDay ? 'text-asarum-pink' : 'text-asarum-red',
    icon: isValentines ? 'fa-heart text-asarum-red' : isMothersDay ? 'fa-person-breastfeeding text-asarum-pink' : 'fa-leaf text-asarum-green'
  };

  return (
    <div className="space-y-16 pb-24">
      <SEO
        title="Flores a Domicilio en Hermosillo y SLRC"
        description="Arreglos florales premium, ramos y detalles únicos con envío rápido y seguro en Hermosillo y San Luis Río Colorado. ¡Compra flores en línea fácil y seguro!"
      />
      {/* Hero Section - Premium & Emotional */}
      <section className={`relative min-h-[85vh] md:min-h-[90vh] py-20 flex items-center justify-center overflow-hidden m-4 md:m-0 rounded-[2.5rem] md:rounded-none shadow-2xl md:shadow-none ${isValentines ? 'bg-asarum-dark' : isMothersDay ? 'bg-asarum-pink/20' : 'bg-asarum-dark'
        }`}>
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img
          src={isValentines
            ? valentinesHeroImage
            : isMothersDay
              ? mothersDayHeroImage
              : 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=2000'
          }
          className="absolute inset-0 w-full h-full object-cover scale-105 md:object-[center_20%]"
          alt={isValentines ? "Momento romántico San Valentín Asarum" : isMothersDay ? "Homenaje a Mamá Asarum" : "Arreglos Florales Exclusivos Asarum Florería"}
        />
        <div className="relative z-20 text-center px-6 max-w-5xl">
          {(isValentines || isMothersDay) && (
            <div className="mb-6 flex justify-center">
              <div className="glass-morphism p-4 sm:p-5 rounded-full animate-bounce shadow-xl shadow-asarum-red/20">
                <i className={`fa-solid ${isValentines ? 'fa-heart' : 'fa-person-breastfeeding'} text-white text-3xl sm:text-4xl`}></i>
              </div>
            </div>
          )}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white mb-8 tracking-tighter leading-[0.85] uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {isValentines ? (
              <>
                <span className="block text-[#AEED5D] brightness-125 mb-2">San Valentín</span>
                <span className="text-white">2026</span>
              </>
            ) : isMothersDay ? (
              <>
                <span className="block text-white mb-2">Para</span>
                <span className="text-asarum-pink brightness-125">Mamá</span>
              </>
            ) : (
              <>
                <span className="block text-[#AEED5D] brightness-110">Asarum</span>
                <span>Florería</span>
              </>
            )}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white mb-10 max-w-2xl mx-auto leading-relaxed font-bold drop-shadow-lg">
            {isValentines
              ? 'Arreglos extraordinarios para momentos inolvidables.'
              : isMothersDay
                ? 'El detalle más dulce para quien te dio todo.'
                : 'Elegancia y frescura en cada detalle para cada ocasión.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <a
              href="#catalogo"
              onClick={scrollToCatalog}
              className={`w-full sm:w-80 text-center text-xl py-6 rounded-[2rem] shadow-2xl transition-transform hover:scale-105 ${isMothersDay ? 'bg-asarum-pink text-white shadow-asarum-pink/40' : 'bg-asarum-red text-white shadow-asarum-red/40'
                }`}
            >
              Ver Catálogo
            </a>
          </div>
        </div>
      </section>

      {/* Trust Badges - Brand Confidence */}
      <section className="px-6 max-w-7xl mx-auto -mt-20 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Frescura Garantizada', desc: 'Flores premium importadas diariamente.', icon: 'fa-leaf' },
            { title: 'Desde 1994', desc: 'Más de 30 años de maestría floral.', icon: 'fa-award' },
            { title: 'Pago 100% Seguro', desc: 'Encriptación SSL de nivel bancario.', icon: 'fa-shield-halved' }
          ].map((badge, i) => (
            <div key={i} className="glass-card p-8 flex items-center gap-6 group hover:translate-y-[-5px] transition-all duration-300 border-white/40">
              <div className={`w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center transition-colors duration-500 ${isMothersDay ? 'text-asarum-pink group-hover:bg-asarum-pink' : 'text-asarum-red group-hover:bg-asarum-red'
                } group-hover:text-white`}>
                <i className={`fa-solid ${badge.icon} text-2xl`}></i>
              </div>
              <div>
                <h3 className="font-black text-asarum-dark uppercase tracking-tight text-sm">{badge.title}</h3>
                <p className="text-asarum-slate text-xs mt-1 font-medium">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Steps Section - Process */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="glass-card p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-asarum-red/5 rounded-full -mr-32 -mt-32 -z-0"></div>
          <h2 className="text-4xl md:text-6xl font-black text-asarum-dark mb-6 tracking-tight relative z-10">TU REGALO EN SEGUNDOS</h2>
          <p className="text-asarum-slate mb-16 max-w-md mx-auto text-lg font-medium relative z-10">Simplificamos la magia de regalar flores para que tú solo te preocupes por el mensaje.</p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 relative z-10">
            {[
              { id: 1, text: 'Explora', icon: 'fa-eye' },
              { id: 2, text: 'Personaliza', icon: 'fa-pen-to-square' },
              { id: 3, text: 'Ubica', icon: 'fa-map-location-dot' },
              { id: 4, text: 'Paga', icon: 'fa-credit-card' },
              { id: 5, text: 'Recibe', icon: 'fa-check-circle' }
            ].map((step) => (
              <div key={step.id} className="group">
                <div className={`w-20 h-20 glass-morphism rounded-[2rem] flex items-center justify-center mx-auto mb-6 transition-all duration-500 shadow-lg border-white/60 ${isMothersDay ? 'group-hover:bg-asarum-pink' : 'group-hover:bg-asarum-red'
                  } group-hover:scale-110`}>
                  <i className={`fa-solid ${step.icon} text-3xl transition-colors ${isMothersDay ? 'text-asarum-pink group-hover:text-white' : 'text-asarum-red group-hover:text-white'
                    }`}></i>
                </div>
                <p className="text-[10px] font-black text-asarum-dark uppercase tracking-[0.2em]">{step.text}</p>
              </div>
            ))}
          </div>

          <div className={`mt-16 glass-morphism p-8 rounded-[2.5rem] border bg-opacity-30 ${isMothersDay ? 'border-asarum-pink/20 bg-pink-50' : 'border-asarum-red/20 bg-red-50'
            }`}>
            <p className={`font-black flex flex-col md:flex-row items-center justify-center gap-4 text-sm uppercase tracking-widest ${isMothersDay ? 'text-asarum-pink' : 'text-asarum-red'
              }`}>
              <i className="fa-solid fa-clock-rotate-left text-3xl animate-pulse"></i>
              <span>AVISO: El {isValentines ? '14 de Febrero' : isMothersDay ? '10 de Mayo' : 'día solicitado'} <strong>entregamos durante todo el día</strong> sin horario fijo.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section id="catalogo" className="px-6 max-w-7xl mx-auto pt-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 border-b-2 border-gray-100 pb-8 gap-6">
          <div>
            <h4 className={`font-black uppercase tracking-[0.3em] text-[10px] mb-3 ${isMothersDay ? 'text-asarum-pink' : 'text-asarum-red'}`}>Selección Premium</h4>
            <h2 className="text-5xl md:text-8xl font-black text-asarum-dark lowercase tracking-tighter">catálogo.</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
            <div className="flex flex-wrap justify-end gap-2">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'under-1000', label: '< $1,000' },
                { id: '1000-2500', label: '$1,000 - $2,500' },
                { id: 'over-2500', label: '> $2,500' }
              ].map(range => (
                <button
                  key={range.id}
                  onClick={() => setBudgetRange(range.id)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${budgetRange === range.id
                    ? `${isMothersDay ? 'bg-asarum-pink border-asarum-pink' : 'bg-asarum-red border-asarum-red'} text-white shadow-lg shadow-black/10`
                    : 'glass-morphism text-asarum-slate border-asarum-red/10 hover:border-asarum-red/30'
                    }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <div className="hidden sm:block">
              <span className={`glass-morphism px-8 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-white/60 shadow-sm ${isMothersDay ? 'text-asarum-pink' : 'text-asarum-red'
                }`}>
                TEMPORADA {season}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className={`group glass-card flex flex-col transition-all duration-500 hover:shadow-2xl ${isMothersDay ? 'hover:border-asarum-pink/30 hover:shadow-asarum-pink/5' : 'hover:border-asarum-red/30 hover:shadow-asarum-red/5'
                }`}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={product.images[0] || 'https://images.unsplash.com/photo-1522673607200-164883214cde?auto=format&fit=crop&q=80&w=800'}
                  alt={`${product.name} - ${product.description}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute top-6 right-6 glass-morphism px-4 py-2 rounded-2xl font-black text-sm shadow-xl border-white/60 ${isMothersDay ? 'text-asarum-pink' : 'text-asarum-red'
                  }`}>
                  ${product.basePrice.toLocaleString()}
                </div>
              </div>
              <div className="p-8">
                <h3 className={`text-2xl font-black text-asarum-dark mb-3 uppercase tracking-tight transition-colors ${isMothersDay ? 'group-hover:text-asarum-pink' : 'group-hover:text-asarum-red'
                  }`}>{product.name}</h3>
                <p className="text-asarum-slate text-xs line-clamp-2 mb-6 font-medium leading-relaxed">{product.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform ${isMothersDay ? 'text-asarum-pink' : 'text-asarum-red'
                    }`}>Ver detalles</span>
                  <div className={`w-10 h-10 rounded-2xl glass-morphism flex items-center justify-center transition-all duration-300 border-white/60 ${isMothersDay ? 'group-hover:bg-asarum-pink' : 'group-hover:bg-asarum-red'
                    }`}>
                    <i className={`fa-solid fa-arrow-right text-xs ${isMothersDay ? 'text-asarum-pink group-hover:text-white' : 'text-asarum-red group-hover:text-white'
                      }`}></i>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials - Social Proof (Real Google Reviews) */}
      <section className="px-6 max-w-7xl mx-auto py-10">
        <div className="text-center mb-16">
          <h4 className={`font-black uppercase tracking-[0.3em] text-[10px] mb-4 ${isMothersDay ? 'text-asarum-pink' : 'text-asarum-red'}`}>Experiencias Asarum</h4>
          <h2 className="text-4xl md:text-6xl font-black text-asarum-dark uppercase tracking-tighter">Voces de nuestros clientes.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              n: 'Orlando Ruiz',
              m: '"Excelente atención de el personal, con muy buen respaldo de la propietaria (al parecer era la dueña) bien asesorado y muy abiertas a las necesidades del arreglo, ya que se pidió uno distinto a los que tenían en exhibición. Buenos precios (no baratos) y mucha variedad en flores, floreros, cajas, chocolates, tazas, dulces, etc. Todo lo necesario para quedar muy bien! 👏👏"',
              i: 'fa-heart',
              s: 5
            },
            {
              n: 'Andrés Mendoza López',
              m: '"Siempre un excelente servicio y buenas opciones para regalar"',
              i: 'fa-heart',
              s: 5
            },
            {
              n: 'Juan Gerardo Camarillo Gonzalez',
              m: '"Excelente surtido en ramos de flores y regalos. Excelente atención."',
              i: 'fa-heart',
              s: 4
            }
          ].map((test, i) => (
            <div key={i} className="glass-card p-10 mt-8 relative group hover:border-asarum-red/20 transition-all border-white/40 shadow-xl shadow-black/5 !overflow-visible flex flex-col h-full">
              <div className={`absolute -top-6 left-10 rounded-2xl bg-white shadow-lg w-12 h-12 flex items-center justify-center border border-asarum-red/10 z-30 transition-transform group-hover:scale-110 ${isMothersDay ? 'text-asarum-pink' : 'text-asarum-red'
                }`}>
                <i className={`fa-solid ${test.i} text-xl`}></i>
              </div>
              <p className="text-asarum-slate italic text-[15px] leading-relaxed mb-8 pt-4 flex-grow">
                {test.m}
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${isMothersDay ? 'bg-asarum-pink/10 text-asarum-pink' : 'bg-asarum-red/10 text-asarum-red'
                  }`}>
                  {test.n[0]}
                </div>
                <div>
                  <p className="text-[11px] font-black text-asarum-dark uppercase tracking-widest leading-tight">{test.n}</p>
                  <div className={`flex text-[8px] mt-1 ${isMothersDay ? 'text-asarum-pink' : 'text-[#AEED5D]'}`}>
                    {[...Array(test.s)].map((_, idx) => <i key={idx} className="fa-solid fa-star mr-0.5"></i>)}
                    {[...Array(5 - test.s)].map((_, idx) => <i key={idx} className="fa-regular fa-star mr-0.5 opacity-30"></i>)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Heritage Section - Why Choose Us */}
      <section className="px-6 max-w-7xl mx-auto py-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="lg:w-1/2 relative">
            <div className={`absolute -top-10 -left-10 w-40 h-40 rounded-full -z-0 ${isMothersDay ? 'bg-asarum-pink/5' : 'bg-asarum-red/5'
              }`}></div>
            <div className="relative z-10 aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white">
              <img
                src={isValentines ? 'valentines-philosophy-v3.png' : 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=1000'}
                alt="Filosofía Asarum"
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`absolute -bottom-8 -right-8 glass-card p-10 bg-asarum-dark text-white rounded-[2.5rem] shadow-2xl border ${isMothersDay ? 'border-asarum-pink/20' : 'border-asarum-red/20'
              }`}>
              <p className="text-5xl font-black mb-1">30+</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Años de Tradición</p>
            </div>
          </div>
          <div className="lg:w-1/2">
            <h4 className={`font-black uppercase tracking-[0.3em] text-[10px] mb-4 ${isMothersDay ? 'text-asarum-pink' : 'text-[#AEED5D]'
              }`}>Filosofía Asarum</h4>
            <h2 className="text-5xl md:text-7xl font-black text-asarum-dark mb-8 tracking-tighter uppercase leading-[0.95]">Nosotros no solo elaboramos detalles, nosotros creamos emociones.</h2>
            <p className="text-asarum-slate text-lg leading-relaxed mb-10 font-medium italic">
              "Desde hace tres décadas, en Asarum nos hemos dedicado a transformar momentos ordinarios en recuerdos extraordinarios."
            </p>
            <div className="space-y-6">
              {[
                { t: 'Maestría Floral', d: 'Expertos que entienden el lenguaje de las flores y el corazón.' },
                { t: 'Presencia Local', d: 'Orgullosamente sirviendo a Hermosillo y SLRC con pasión ininterrumpida.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isMothersDay ? 'bg-asarum-pink/10 text-asarum-pink' : 'bg-asarum-red/10 text-asarum-red'
                    }`}>
                    <i className="fa-solid fa-check text-xs"></i>
                  </div>
                  <div>
                    <h5 className="font-extrabold text-asarum-dark uppercase text-xs tracking-wider mb-1">{item.t}</h5>
                    <p className="text-asarum-slate text-xs font-medium">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
