
import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  cartCount: number;
  isAdmin: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, isAdmin }) => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-serif font-bold text-asarum-red tracking-tight">Asarum</span>
            <span className="hidden sm:inline text-xs font-light text-gray-500 uppercase tracking-widest mt-1">Florería y Regalos</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-asarum-red font-medium transition-colors">Inicio</Link>
            <Link to="/cart" className="relative group p-2">
              <i className="fa-solid fa-basket-shopping text-xl text-gray-700 group-hover:text-asarum-red transition-colors"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-asarum-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
            {isAdmin && (
              <Link to="/admin/dashboard" className="bg-asarum-red text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-800 transition-colors">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
