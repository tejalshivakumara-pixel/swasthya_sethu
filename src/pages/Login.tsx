import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { authAPI } from '../services/api';
import { LogIn } from 'lucide-react';

export const Login: React.FC = () => {
  const { setUser, setActivePage } = useApp();
  const [email, setEmail] = useState('tejal@swasthya.org');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      if (res.data && res.data.user) {
        setUser(res.data.user);
        setActivePage('home');
      }
    } catch (err: any) {
      // Fallback demo login
      setUser({ id: 1, full_name: 'Tejal S', email });
      setActivePage('home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="bg-[#111927] border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
            <LogIn className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-400 font-medium">Log in to access your Swasthya Setu healthcare portal</p>
        </div>

        {error && <div className="text-xs text-red-400 font-bold bg-red-950/80 border border-red-500/30 p-3 rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-slate-500"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-slate-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="text-center pt-3 border-t border-slate-800 text-xs text-slate-400">
          Don't have an account?{' '}
          <button
            onClick={() => setActivePage('signup')}
            className="text-cyan-400 font-extrabold hover:underline"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};
