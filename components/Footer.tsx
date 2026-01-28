
import React from 'react';
import { Link } from 'react-router-dom';
import { Season } from '../types';

const Footer: React.FC<{ season: Season }> = ({ season }) => {
  const isValentines = season === Season.VALENTINES;

  return (
    <footer className={`${isValentines ? 'bg-red-950' : 'bg-gray-900'} text-white py-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex flex-col">
          <img src="/logo.png" alt="Asarum Florería y Regalos" className="h-32 w-auto mb-6 object-contain -ml-4" />
          <p className="text-gray-300 text-sm leading-relaxed italic">
            "Flores y detalles para cada ocasión"
          </p>
          <div className="flex space-x-5 mt-8">
            <a href="https://www.instagram.com/asarumfloreriayregaloshmo/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <i className="fa-brands fa-instagram text-2xl"></i>
            </a>
            <a href="https://www.facebook.com/asarumfloreria" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <i className="fa-brands fa-facebook text-2xl"></i>
            </a>
            <a href="https://wa.me/526622105050" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <i className="fa-brands fa-whatsapp text-2xl"></i>
            </a>
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-lg font-bold mb-4 border-b border-asarum-red/30 pb-2 inline-block">Nuestras Sucursales</h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <span className="block font-bold text-white text-base">Hermosillo (Desde 2015)</span>
                <a href="https://maps.app.goo.gl/SmXZK3Mo7pdHdPe58" target="_blank" rel="noopener noreferrer" className="text-asarum-red hover:text-red-400 text-[10px] font-black uppercase tracking-widest">
                  <i className="fa-solid fa-map-location-dot mr-1"></i> Ver Mapa
                </a>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                <i className="fa-solid fa-location-dot mr-2"></i>
                Av. Reforma #189, Col. San Benito, CP 83190
              </p>
              <p className="text-xs text-gray-400">
                <i className="fa-solid fa-phone mr-2"></i>
                (662) 210 5050
              </p>
              <p className="text-xs text-gray-400">
                <i className="fa-solid fa-clock mr-2"></i>
                Lun-Sáb: 8:00 AM - 8:00 PM | Dom: 9:00 AM - 3:00 PM
              </p>
            </div>

            <div>
              <div className="flex justify-between items-start">
                <span className="block font-bold text-white text-base">San Luis Río Colorado (Desde 1994)</span>
                <a href="https://maps.app.goo.gl/scjmx5dRiY895gX2A" target="_blank" rel="noopener noreferrer" className="text-asarum-red hover:text-red-400 text-[10px] font-black uppercase tracking-widest">
                  <i className="fa-solid fa-map-location-dot mr-1"></i> Ver Mapa
                </a>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                <i className="fa-solid fa-location-dot mr-2"></i>
                Av. Libertad y Calle 12 #1200, Col. Cuauhtémoc, CP 83400
              </p>
              <p className="text-xs text-gray-400">
                <i className="fa-solid fa-phone mr-2"></i>
                (653) 534 1212
              </p>
              <p className="text-xs text-gray-400">
                <i className="fa-solid fa-clock mr-2"></i>
                Lun-Sáb: 8:00 AM - 8:00 PM | Dom: 9:00 AM - 3:00 PM
              </p>
            </div>
          </div>
        </div>

        <div>
                <div className="flex justify-between items-start">
                  <span className="block font-bold text-white text-base">Hermosillo (Desde 2015)</span>
                  <a href="https://maps.app.goo.gl/SmXZK3Mo7pdHdPe58" target="_blank" rel="noopener noreferrer" className="text-asarum-red hover:text-red-400 text-[10px] font-black uppercase tracking-widest">
                    <i className="fa-solid fa-map-location-dot mr-1"></i> Ver Mapa
                  </a>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  <i className="fa-solid fa-location-dot mr-2"></i>
                  Av. Reforma #189, Col. San Benito, CP 83190
                </p>
                <p className="text-xs text-gray-400">
                  <i className="fa-solid fa-phone mr-2"></i>
                  (662) 210 5050
                </p>
                <p className="text-xs text-gray-400">
                  <i className="fa-solid fa-clock mr-2"></i>
                  Lun-Sáb: 8:00 AM - 8:00 PM | Dom: 9:00 AM - 3:00 PM
                </p>
              </div>

              <div>
                <div className="flex justify-between items-start">
                  <span className="block font-bold text-white text-base">San Luis Río Colorado (Desde 1994)</span>
                  <a href="https://maps.app.goo.gl/scjmx5dRiY895gX2A" target="_blank" rel="noopener noreferrer" className="text-asarum-red hover:text-red-400 text-[10px] font-black uppercase tracking-widest">
                    <i className="fa-solid fa-map-location-dot mr-1"></i> Ver Mapa
                  </a>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  <i className="fa-solid fa-location-dot mr-2"></i>
                  Av. Libertad y Calle 12 #1200, Col. Cuauhtémoc, CP 83400
                </p>
                <p className="text-xs text-gray-400">
                  <i className="fa-solid fa-phone mr-2"></i>
                  (653) 534 1212
                </p>
                <p className="text-xs text-gray-400">
                  <i className="fa-solid fa-clock mr-2"></i>
                  Lun-Sáb: 8:00 AM - 8:00 PM | Dom: 9:00 AM - 3:00 PM
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Información de Envío</h3>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              Realizamos entregas locales en ambas ciudades garantizando la frescura de cada arreglo.
            </p>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <p className="text-xs text-asarum-red font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation"></i>
                Aviso Temporada Alta
              </p>
              <p className="text-[10px] text-gray-400 leading-tight">
                Para el 14 de Febrero y Día de las Madres, no se garantizan horarios de entrega exactos debido al alto volumen de pedidos.
              </p>
            </div>
            <div className="mt-8 border-t border-gray-800 pt-6">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                © 1994 Asarum Florería y Regalos. Todos los derechos reservados.
              </p>
              <div className="flex space-x-4 mt-2">
                <Link to="/terminos-y-condiciones" className="text-[10px] text-gray-600 hover:text-white transition-colors uppercase tracking-widest">
                  Términos y Condiciones
                </Link>
                <Link to="/politica-de-privacidad" className="text-[10px] text-gray-600 hover:text-white transition-colors uppercase tracking-widest">
                  Política de Privacidad
                </Link>
              </div>
            </div>
          </div>
        </div >
    </footer >
  );
};

export default Footer;
