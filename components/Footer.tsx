
import React from 'react';
import { Link } from 'react-router-dom';
import { Season } from '../types';

const Footer: React.FC<{ season: Season }> = ({ season }) => {
  const isValentines = season === Season.VALENTINES;
  const isMothersDay = season === Season.MOTHERS_DAY;

  return (
    <footer className={`${isValentines ? 'bg-red-950' : isMothersDay ? 'bg-[#5c2a3b]' : 'bg-gray-900'} text-white py-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        {/* Brand Column */}
        <div className="flex flex-col items-center md:items-start">
          <img src="/logo-footer.png" alt="Asarum Florería y Regalos" className="h-32 w-auto mb-6 object-contain mx-auto md:-ml-2 md:mx-0" />
          <p className="text-white text-sm leading-relaxed italic max-w-xs mx-auto md:mx-0">
            "Flores y detalles para cada ocasión"
          </p>
          <div className="flex justify-center md:justify-start space-x-5 mt-8">
            <a href="https://www.instagram.com/asarumfloreriayregaloshmo/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#AEED5D] transition-colors">
              <i className="fa-brands fa-instagram text-2xl"></i>
            </a>
            <a href="https://www.facebook.com/asarumfloreria" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#AEED5D] transition-colors">
              <i className="fa-brands fa-facebook text-2xl"></i>
            </a>
            <a href="https://wa.me/526622565573" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#AEED5D] transition-colors">
              <i className="fa-brands fa-whatsapp text-2xl"></i>
            </a>
          </div>
        </div>

        {/* Locations Column */}
        <div className="space-y-8">
          <h3 className="text-lg font-bold mb-4 border-b border-[#AEED5D]/30 pb-2 inline-block uppercase tracking-widest text-[#AEED5D]">Nuestras Sucursales</h3>

          <div className="space-y-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start w-full gap-2 mb-1">
                <span className="block font-bold text-white text-base">Hermosillo</span>
                <a href="https://maps.app.goo.gl/SmXZK3Mo7pdHdPe58" target="_blank" rel="noopener noreferrer" className="text-[#AEED5D] hover:text-white text-[10px] font-black uppercase tracking-widest">
                  <i className="fa-solid fa-map-location-dot mr-1"></i> Ver Mapa
                </a>
              </div>
              <p className="text-xs text-white">
                <i className="fa-solid fa-location-dot mr-2 text-[#AEED5D]"></i>
                Blvd. Luis Donaldo Colosio #965, Col. Compostela, CP 83224
              </p>
              <p className="text-xs text-white">
                <i className="fa-solid fa-phone mr-2 text-[#AEED5D]"></i>
                (662) 256 5573
              </p>
              <a href="https://wa.me/526622565573" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-colors">
                <i className="fa-brands fa-whatsapp text-base"></i> WhatsApp Hermosillo
              </a>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start w-full gap-2 mb-1">
                <span className="block font-bold text-white text-base">San Luis Río Colorado</span>
                <a href="https://maps.app.goo.gl/scjmx5dRiY895gX2A" target="_blank" rel="noopener noreferrer" className="text-[#AEED5D] hover:text-white text-[10px] font-black uppercase tracking-widest">
                  <i className="fa-solid fa-map-location-dot mr-1"></i> Ver Mapa
                </a>
              </div>
              <p className="text-xs text-white">
                <i className="fa-solid fa-location-dot mr-2 text-[#AEED5D]"></i>
                Cjon. Madero y 6ta, Col. Comercial, CP 83449
              </p>
              <p className="text-xs text-white">
                <i className="fa-solid fa-phone mr-2 text-[#AEED5D]"></i>
                (653) 160 3089
              </p>
              <a href="https://wa.me/526531603089" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-colors">
                <i className="fa-brands fa-whatsapp text-base"></i> WhatsApp SLRC
              </a>
            </div>
          </div>
        </div>

        {/* Shipping & Legal Column */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-bold mb-4 uppercase tracking-widest text-[#AEED5D]">Información de Envío</h3>
          <p className="text-white text-sm mb-4 leading-relaxed max-w-xs mx-auto md:mx-0">
            Realizamos entregas locales en ambas ciudades garantizando la frescura de cada arreglo.
          </p>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 w-full max-w-sm mx-auto md:mx-0">
            <p className="text-xs text-[#AEED5D] font-black uppercase tracking-widest mb-2 flex items-center justify-center md:justify-start gap-2">
              <i className="fa-solid fa-circle-exclamation"></i>
              Aviso Temporada Alta
            </p>
            <p className="text-[10px] text-white/80 leading-tight">
              Para el 14 de Febrero y Día de las Madres, no se garantizan horarios de entrega exactos.
            </p>
          </div>
          <div className="mt-8 border-t border-white/10 pt-6 w-full">
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-medium">
              © 1994 Asarum Florería y Regalos.
            </p>
            <div className="flex flex-col gap-2 mt-4 items-center md:items-start">
              <Link to="/terminos-y-condiciones" className="text-[10px] text-white/60 hover:text-[#AEED5D] transition-colors uppercase tracking-widest">
                Términos y Condiciones
              </Link>
              <Link to="/politica-de-privacidad" className="text-[10px] text-white/60 hover:text-[#AEED5D] transition-colors uppercase tracking-widest">
                Política de Privacidad
              </Link>
              <Link to="/admin/login" className="text-[10px] text-white/10 hover:text-white/30 transition-colors uppercase tracking-widest mt-4">
                Portal Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
