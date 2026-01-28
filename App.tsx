
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import ScrollToTop from './components/ScrollToTop';
import { AnalyticsService } from './services/analytics';
import { supabase } from './lib/supabase';
import { seedDatabase } from './seed';

const AppContent: React.FC<{
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  currentSeason: Season;
  setCurrentSeason: React.Dispatch<React.SetStateAction<Season>>;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ products, setProducts, cart, setCart, orders, setOrders, currentSeason, setCurrentSeason, isAdmin, setIsAdmin }) => {
  const location = useLocation();

  useEffect(() => {
    AnalyticsService.trackPageView(location.pathname + location.search + location.hash);
  }, [location]);

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
    <div className={`min-h-screen flex flex-col ${currentSeason === Season.VALENTINES ? 'bg-pink-50' :
      currentSeason === Season.MOTHERS_DAY ? 'bg-asarum-pink/5' :
        'bg-gray-50'
      }`}>
      <Navbar cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)} season={currentSeason} />
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
  );
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('asarum_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as any[];
        return parsed.map(p => {
          const original = INITIAL_PRODUCTS.find(op => op.id === p.id);
          if (original) {
            return {
              ...p,
              name: original.name,
              description: original.description,
              images: original.images,
              basePrice: original.basePrice,
              category: original.category,
              variants: original.variants || p.variants,
              notes: original.notes,
              seasons: original.seasons || [Season.DEFAULT]
            };
          }
          return p;
        });
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
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

  // Supabase Initialization
  useEffect(() => {
    const initSupabase = async () => {
      // 1. Seed if empty (First time setup)
      const { data: existingProducts } = await supabase.from('products').select('id').limit(1);
      if (!existingProducts || existingProducts.length === 0) {
        await seedDatabase();
      }

      // 2. Fetch Products
      const { data: sbProducts, error: pError } = await supabase
        .from('products')
        .select('*');

      if (sbProducts && !pError) {
        const mappedProducts: Product[] = sbProducts.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          basePrice: Number(p.base_price),
          category: p.category,
          images: p.images,
          variants: p.variants,
          notes: p.notes,
          seasons: p.seasons as Season[]
        }));
        setProducts(mappedProducts);
      }

      // 3. Fetch Orders (Admin only or for public lookup if needed)
      const { data: sbOrders, error: oError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (sbOrders && !oError) {
        const mappedOrders: Order[] = sbOrders.map(o => ({
          id: o.id,
          date: o.created_at,
          items: o.items,
          total: Number(o.total),
          senderName: o.sender_name,
          senderPhone: o.sender_phone,
          senderEmail: o.sender_email,
          receiverName: o.receiver_name,
          receiverPhone: o.receiver_phone,
          deliveryAddress: o.delivery_address,
          deliveryCoords: o.delivery_coords,
          deliveryType: o.delivery_type as 'delivery' | 'pickup',
          pickupBranch: o.pickup_branch,
          gateCode: o.gate_code,
          qrAccess: o.qr_access,
          cardMessage: o.card_message,
          status: o.status as any,
          paymentStatus: o.payment_status as any,
          stripePaymentIntentId: o.stripe_payment_id
        }));
        setOrders(mappedOrders);
      }
    };

    initSupabase();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AppContent
        products={products}
        setProducts={setProducts}
        cart={cart}
        setCart={setCart}
        orders={orders}
        setOrders={setOrders}
        currentSeason={currentSeason}
        setCurrentSeason={setCurrentSeason}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />
    </Router>
  );
};

export default App;
