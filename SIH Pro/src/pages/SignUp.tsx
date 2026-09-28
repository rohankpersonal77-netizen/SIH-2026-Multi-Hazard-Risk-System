import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldAlert, User, Mail, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'SDMA / Revenue Dept',
    role: 'GIS_ANALYST',
    district: 'Kolhapur'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      login('user-2');
      navigate('/dashboard');
    }, 1500);
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
            <button onClick={() => navigate('/login')} className="text-sm font-medium text-slate-700 hover:text-[#0A192F] transition-colors">
              Authority Login
            </button>
            <button onClick={() => navigate('/signup')} className="text-sm font-semibold text-blue-600 transition-colors">
              Authority Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 relative z-10">
          
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-[#0A192F]">Registration Submitted!</h2>
              <p className="text-sm text-slate-600">
                Your credentials have been provisioned for district access. Authenticating into Command Portal...
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#0A192F] p-0.5 mx-auto mb-3 shadow-md flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                  Authority Credentials Request
                </p>
                <h1 className="text-2xl font-extrabold tracking-tight text-[#0A192F]">
                  Register SDMA Official
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Request authorized access for disaster response & planning
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Official Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Dr. Rajesh Patil"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#0A192F] placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Government Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="officer@maharashtra.gov.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#0A192F] placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Department / Organization
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#0A192F] placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3 text-xs text-[#0A192F] focus:outline-none focus:border-blue-600 focus:bg-white"
                    >
                      <option value="SDMA_OFFICER">SDMA Officer</option>
                      <option value="GIS_ANALYST">GIS Analyst</option>
                      <option value="RELIEF_COMMANDER">Relief Commander</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      District
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3 text-xs text-[#0A192F] focus:outline-none focus:border-blue-600 focus:bg-white"
                    >
                      <option value="Kolhapur">Kolhapur</option>
                      <option value="Ratnagiri">Ratnagiri</option>
                      <option value="Raigad">Raigad</option>
                      <option value="Sangli">Sangli</option>
                      <option value="Satara">Satara</option>
                      <option value="Pune">Pune</option>
                      <option value="Mumbai">Mumbai</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#0A192F] hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <span>Submit Authority Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-slate-500">
                Already registered?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Proceed to Login
                </button>
              </div>
            </>
          )}

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

export default SignUp;

