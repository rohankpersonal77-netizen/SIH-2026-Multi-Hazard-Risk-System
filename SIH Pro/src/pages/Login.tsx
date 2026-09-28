import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ShieldAlert, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle 
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your official email and password.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid official email address.');
      return;
    }

    // Authenticate user and redirect to command center dashboard
    login('user-1');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A192F] font-sans flex flex-col justify-between selection:bg-[#1E3A8A] selection:text-white">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-[#FAFAFA]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/home')}>
            <div className="bg-[#0A192F] text-white p-2 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0A192F]">
              RESettle<span className="text-blue-600">AI</span>
            </span>
          </div>

          <nav className="flex items-center space-x-6 sm:space-x-8">
            <button onClick={() => navigate('/home')} className="text-sm font-medium text-slate-600 hover:text-[#0A192F] transition-colors">
              Home
            </button>
            <button onClick={() => navigate('/about')} className="text-sm font-medium text-slate-600 hover:text-[#0A192F] transition-colors">
              About
            </button>
            <button onClick={() => navigate('/login')} className="text-sm font-semibold text-blue-600 transition-colors">
              Authority Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="text-sm font-medium bg-[#0A192F] text-white px-4 py-2.5 rounded-md hover:bg-slate-800 transition-all shadow-sm"
            >
              Authority Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 relative z-10">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#0A192F] p-0.5 mx-auto mb-3 shadow-md flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-emerald-400" />
            </div>

            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              Authority Access Portal
            </p>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#0A192F]">
              Welcome Back to RESettleAI
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to access the disaster management command portal
            </p>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle size={16} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Official Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="officer@maharashtra.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#0A192F] placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-9 pr-10 text-xs text-[#0A192F] placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span>Remember credentials</span>
              </label>
              <button
                type="button"
                onClick={() => alert('Please contact system administrator to reset password.')}
                className="font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0A192F] hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>Authenticate Command Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* FOOTER NAV LINK */}
          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
            Don't have authority access?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Request Authority Account
            </button>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-slate-500">
          RESettleAI &mdash; Disaster Management Decision Support Platform | Ministry of Home Affairs
        </div>
      </footer>
    </div>
  );
};

export default Login;
