
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC<{ setIsAdmin: (val: boolean) => void }> = ({ setIsAdmin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Credentials updated per user request
    if (user === 'admin' && pass === '123456') {
      setIsAdmin(true);
      navigate('/admin/dashboard');
    } else {
      alert('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-asarum-red/10 to-asarum-pink/20">
      <div className="max-w-md w-full glass-card p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-asarum-red mb-2">ASARUM</h1>
          <p className="text-asarum-slate text-xs font-bold uppercase tracking-widest">Admin Access</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-asarum-slate uppercase ml-2">Username</label>
            <input
              type="text"
              className="w-full px-6 py-4 rounded-3xl glass-morphism focus:bg-white/90 focus:ring-2 focus:ring-asarum-red/30 outline-none transition-all"
              placeholder="admin"
              value={user}
              onChange={e => setUser(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-asarum-slate uppercase ml-2">Password</label>
            <input
              type="password"
              className="w-full px-6 py-4 rounded-3xl glass-morphism focus:bg-white/90 focus:ring-2 focus:ring-asarum-red/30 outline-none transition-all"
              placeholder="••••••"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
          </div>
          <button className="btn-primary w-full mt-4">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
