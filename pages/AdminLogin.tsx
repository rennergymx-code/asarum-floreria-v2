
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC<{ setIsAdmin: (val: boolean) => void }> = ({ setIsAdmin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === 'admin' && pass === 'asarum2024') {
      setIsAdmin(true);
      navigate('/admin/dashboard');
    } else {
      alert('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10">
        <div className="text-center mb-10">
          <span className="text-3xl font-serif font-bold text-asarum-red">Asarum</span>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Panel de Administración</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Usuario</label>
            <input 
              type="text" 
              className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-asarum-red outline-none transition-colors"
              value={user}
              onChange={e => setUser(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Contraseña</label>
            <input 
              type="password" 
              className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-asarum-red outline-none transition-colors"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
          </div>
          <button className="w-full bg-asarum-red text-white py-4 rounded-xl font-bold shadow-lg hover:bg-red-800 transition-colors">
            Acceder al Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
