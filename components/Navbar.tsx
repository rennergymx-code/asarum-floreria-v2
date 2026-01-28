
import React from 'react';
import { Link } from 'react-router-dom';
import { Season } from '../types';

interface NavbarProps {
  cartCount: number;
  isAdmin: boolean;
  season: Season;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, isAdmin, season }) => {
  const getThemeColor = () => {
    switch (season) {
      case Season.VALENTINES: return 'text-asarum-red';
      case Season.MOTHERS_DAY: return 'text-asarum-pink';
      case Season.DEFAULT: return 'text-asarum-indigo';
      default: return 'text-asarum-red';
    }
  };

  const getBadgeColor = () => {
    switch (season) {
      case Season.VALENTINES: return 'bg-asarum-red';
      case Season.MOTHERS_DAY: return 'bg-asarum-pink';
      case Season.DEFAULT: return 'bg-asarum-indigo';
      default: return 'bg-asarum-red';
    }
  };
  return (
    <nav className="glass-morphism sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Asarum Florería y Regalos" className="h-16 md:h-20 w-auto py-1 object-contain" />
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 glass-morphism rounded-full hover:bg-white transition-all">
              <i className="fa-solid fa-basket-shopping text-xl text-asarum-dark"></i>
              {cartCount > 0 && (
                <span className={`absolute -top-1 -right-1 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg transition-colors duration-500 ${getBadgeColor()}`}>
                  {cartCount}
                </span>
              )}
            </Link>
            {isAdmin && (
              <Link to="/admin/dashboard" className="bg-asarum-red text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all">
                <i className="fa-solid fa-user-gear"></i>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
