
import React from 'react';
import { Link } from 'react-router-dom';
import { Season } from '../types';

const Footer: React.FC<{ season: Season }> = ({ season }) => {
  const isValentines = season === Season.VALENTINES;

  return (
    <footer className={`${isValentines ? 'bg-red-950' : 'bg-gray-900'} text-white py-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand Column */}
        <div className="flex flex-col items-start">
          <img src="/logo-footer.png" alt="Asarum Florería y Regalos" className="h-32 w-auto mb-6 object-contain -ml-6" />
          <p className="text-white text-sm leading-relaxed italic">
            "Flores y detalles para cada ocasión"
          </p>
          <div className="flex space-x-5 mt-8">
            <a href="https://www.instagram.com/asarumfloreriayregaloshmo/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#AEED5D] transition-colors">
              <i className="fa-brands fa-instagram text-2xl"></i>
            </a>
            <a href="https://www.facebook.com/asarumfloreria" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#AEED5D] transition-colors">
              <i className="fa-brands fa-facebook text-2xl"></i>
            </a>
            <a href="https://wa.me/526623011777" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#AEED5D] transition-colors">
              <i className="fa-brands fa-whatsapp text-2xl"></i>
            </a>
          </div>
        </div>

        {/* Locations Column */}
        <div className="space-y-8">
          <h3 className="text-lg font-bold mb-4 border-b border-[#AEED5D]/30 pb-2 inline-block uppercase tracking-widest text-[#AEED5D]">Nuestras Sucursales</h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <span className="block font-bold text-white text-base">Hermosillo</span>
                <a href="https://maps.app.goo.gl/SmXZK3Mo7pdHdPe58" target="_blank" rel="noopener noreferrer" className="text-[#AEED5D] hover:text-white text-[10px] font-black uppercase tracking-widest">
                  <i className="fa-solid fa-map-location-dot mr-1"></i> Ver Mapa
                </a>
              </div>
              <p className="text-xs text-white mt-1">
                <i className="fa-solid fa-location-dot mr-2 text-[#AEED5D]"></i>
                Blvd. Luis Donaldo Colosio #965, Col. Compostela, CP 83224
              </p>
              <p className="text-xs text-white">
                <i className="fa-solid fa-phone mr-2 text-[#AEED5D]"></i>
                (662) 301 1777
              </p>
            </div>

            <div>
              <div className="flex justify-between items-start">
                <span className="block font-bold text-white text-base">San Luis Río Colorado</span>
                <a href="https://maps.app.goo.gl/scjmx5dRiY895gX2A" target="_blank" rel="noopener noreferrer" className="text-[#AEED5D] hover:text-white text-[10px] font-black uppercase tracking-widest">
                  <i className="fa-solid fa-map-location-dot mr-1"></i> Ver Mapa
                </a>
              </div>
              <p className="text-xs text-white mt-1">
                <i className="fa-solid fa-location-dot mr-2 text-[#AEED5D]"></i>
                Cjon. Madero 509 B, Col. Comercial, CP 83449
              </p>
              <p className="text-xs text-white">
                <i className="fa-solid fa-phone mr-2 text-[#AEED5D]"></i>
                (653) 534 6700
              </p>
            </div>
          </div>
        </div>

        {/* Shipping & Legal Column */}
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase tracking-widest text-[#AEED5D]">Información de Envío</h3>
          <p className="text-white text-sm mb-4 leading-relaxed">
            Realizamos entregas locales en ambas ciudades garantizando la frescura de cada arreglo.
          </p>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <p className="text-xs text-[#AEED5D] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation"></i>
              Aviso Temporada Alta
            </p>
            <p className="text-[10px] text-white/80 leading-tight">
              Para el 14 de Febrero y Día de las Madres, no se garantizan horarios de entrega exactos.
            </p>
          </div>
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-medium">
              © 1994 Asarum Florería y Regalos.
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <Link to="/terminos-y-condiciones" className="text-[10px] text-white/60 hover:text-[#AEED5D] transition-colors uppercase tracking-widest">
                Términos y Condiciones
              </Link>
              <Link to="/politica-de-privacidad" className="text-[10px] text-white/60 hover:text-[#AEED5D] transition-colors uppercase tracking-widest">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
