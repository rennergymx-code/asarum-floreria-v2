
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GeminiChat from './components/GeminiChat';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import { CartItem, Product, Season, Order } from './types';
import { INITIAL_PRODUCTS } from './constants';
import CookieBanner from './components/CookieBanner';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('asarum_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('asarum_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('asarum_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentSeason, setCurrentSeason] = useState<Season>(() => {
    return (localStorage.getItem('asarum_season') as Season) || Season.VALENTINES;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('asarum_is_admin') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('asarum_products', JSON.stringify(products));
    localStorage.setItem('asarum_cart', JSON.stringify(cart));
    localStorage.setItem('asarum_orders', JSON.stringify(orders));
    localStorage.setItem('asarum_season', currentSeason);
    localStorage.setItem('asarum_is_admin', String(isAdmin));
  }, [products, cart, orders, currentSeason, isAdmin]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === item.productId && i.variantName === item.variantName);
      if (existing) {
        return prev.map(i => i.productId === item.productId && i.variantName === item.variantName
          ? { ...i, quantity: i.quantity + item.quantity }
          : i);
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string, variantName: string) => {
    setCart(prev => prev.filter(i => !(i.productId === productId && i.variantName === variantName)));
  };

  const updateCartQuantity = (productId: string, variantName: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.productId === productId && i.variantName === variantName) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const clearCart = () => setCart([]);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${currentSeason === Season.VALENTINES ? 'bg-pink-50' : 'bg-gray-50'}`}>
        <Navbar cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)} isAdmin={isAdmin} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home products={products} season={currentSeason} />} />
            <Route path="/product/:id" element={<ProductDetail products={products} onAddToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cart={cart} onRemove={removeFromCart} onUpdateQty={updateCartQuantity} />} />
            <Route path="/checkout" element={<Checkout cart={cart} onPlaceOrder={addOrder} onClearCart={clearCart} />} />
            <Route path="/admin/login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
            <Route
              path="/admin/dashboard"
              element={isAdmin ? <AdminDashboard products={products} orders={orders} setProducts={setProducts} season={currentSeason} setSeason={setCurrentSeason} logout={() => setIsAdmin(false)} /> : <Navigate to="/admin/login" />}
            />
            <Route path="/terminos-y-condiciones" element={<Terms />} />
            <Route path="/politica-de-privacidad" element={<Privacy />} />
          </Routes>
        </main>
        <Footer season={currentSeason} />
        <GeminiChat products={products} currentSeason={currentSeason} />
        <CookieBanner />
      </div>
    </Router>
  );
};

export default App;
