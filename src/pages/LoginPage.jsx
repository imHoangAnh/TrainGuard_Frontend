import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Train, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const success = await login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Thông tin đăng nhập không đúng. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rail-darker relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rail-primary/5 via-rail-darker to-rail-darker pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rail-primary to-transparent opacity-50" />

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-rail-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rail-primary/20 shadow-glow-primary">
            <Train size={32} className="text-rail-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-rail-muted bg-clip-text text-transparent">
            TrainGuard
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-rail-panel border border-rail-border rounded-xl p-8 shadow-2xl backdrop-blur-sm">
          {error && (
            <div className="mb-6 p-3 bg-rail-critical/10 border border-rail-critical/20 rounded-lg flex items-center gap-3 text-rail-critical text-sm animate-shake">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-rail-muted mb-1 uppercase">Username</label>
              <div className="relative group">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-rail-muted group-focus-within:text-rail-primary transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-rail-dark border border-rail-border rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-rail-primary focus:ring-1 focus:ring-rail-primary transition-all placeholder:text-rail-muted/50"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-rail-muted mb-1 uppercase">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-rail-muted group-focus-within:text-rail-primary transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-rail-dark border border-rail-border rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-rail-primary focus:ring-1 focus:ring-rail-primary transition-all placeholder:text-rail-muted/50"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-rail-primary text-black font-bold py-3 rounded-lg hover:bg-rail-primary/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'ĐANG ĐĂNG NHẬP...' : 'Login'}
            {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </div>
    </div>
  );
}
