import { ArrowRight, MapPin, Shield } from 'lucide-react';
import React from 'react';

export const HomePage: React.FC = () => {

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A192F] font-sans selection:bg-[#1E3A8A] selection:text-white flex flex-col justify-between">
      
      {/* ==================== NAVBAR ==================== */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-[#FAFAFA]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Left: Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="bg-[#0A192F] text-white p-2 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0A192F]">
              RESettle<span className="text-blue-600">AI</span>
            </span>
          </div>

          {/* Right: Navigation */}
          <nav className="flex items-center space-x-8">
            <a href="/home" className="text-sm font-medium text-slate-600 hover:text-[#0A192F] transition-colors">
              Home
            </a>
            <a href="/about" className="text-sm font-medium text-slate-600 hover:text-[#0A192F] transition-colors">
              About
            </a>
            <button
              className="text-sm font-medium text-slate-700 hover:text-[#0A192F] transition-colors"
            >
              Authority Login
            </button>
            <button
              className="text-sm font-medium bg-[#0A192F] text-white px-4 py-2.5 rounded-md hover:bg-slate-800 transition-all shadow-sm"
            >
              Authority Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Organization Tag */}
            <div className="inline-flex items-center space-x-2 border border-slate-200 bg-white px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 tracking-wide uppercase shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Ministry of Home Affairs | NDRF DM Division</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0A192F] leading-[1.15]">
              AI-GIS FOR PROACTIVE DISASTER MANAGEMENT
            </h1>

            {/* Supporting Text */}
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
              Identify high-risk habitations, assess vulnerability and carrying capacity, and support safer relocation decisions before disasters strike.
            </p>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <button
                className="inline-flex items-center justify-center px-6 py-3.5 bg-[#0A192F] text-white font-medium text-sm rounded-md hover:bg-slate-800 transition-all shadow-sm"
              >
                AUTHORITY LOGIN
              </button>

              <button
                className="inline-flex items-center justify-center px-6 py-3.5 bg-white border border-slate-300 text-slate-800 font-medium text-sm rounded-md hover:bg-slate-50 transition-all shadow-2xs"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-4 h-4 ml-2 text-slate-500" />
              </button>
            </div>

          </div>

          {/* Hero Visual Right (GIS Visual) */}
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-[4/3] rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl p-6 flex flex-col justify-between">
              
              {/* GIS Grid Layer */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Vector Map Contours (Abstract SVG) */}
              <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 400 300">
                <path d="M 30,100 Q 120,40 220,110 T 370,180" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,4" />
                <path d="M 10,220 Q 150,160 280,240 T 390,200" fill="none" stroke="#64748b" strokeWidth="1.5" />
                <path d="M 80,20 Q 200,120 320,50" fill="none" stroke="#64748b" strokeWidth="1" />
              </svg>

              {/* GIS Hazard & Safe Overlay Zones */}
              <div className="absolute top-[22%] left-[18%] w-36 h-36 bg-red-500/20 border-2 border-dashed border-red-500/80 rounded-full flex items-center justify-center backdrop-blur-[2px]">
                <div className="w-20 h-20 bg-red-600/30 rounded-full animate-pulse flex items-center justify-center">
                  <span className="text-[10px] font-mono font-bold text-red-200 bg-red-900/80 px-2 py-0.5 rounded">RED ZONE</span>
                </div>
              </div>

              <div className="absolute bottom-[18%] right-[15%] w-44 h-32 bg-emerald-500/15 border-2 border-emerald-500/60 rounded-xl flex items-center justify-center backdrop-blur-[2px]">
                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">SAFE ZONE (CAPACITY: OPTIMAL)</span>
              </div>

              {/* GIS Markers & Data Points */}
              <div className="absolute top-[35%] left-[30%] flex items-center space-x-1.5 bg-slate-900/90 border border-red-500/50 px-2 py-1 rounded text-red-400 text-xs shadow-lg">
                <span className="font-mono text-[11px]">Vulnerability Index: High</span>
              </div>

              <div className="absolute bottom-[30%] right-[32%] flex items-center space-x-1.5 bg-slate-900/90 border border-emerald-500/50 px-2 py-1 rounded text-emerald-400 text-xs shadow-lg">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-[11px]">Relocation Node #04</span>
              </div>

              {/* Visual Header */}
              <div className="relative z-10 flex justify-between items-center text-xs text-slate-400 font-mono bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center space-x-2">
                  <span>LIVE GEOSPATIAL INTELLIGENCE</span>
                </div>
                <span className="text-emerald-400 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-ping" />
                  ACTIVE PIPELINE
                </span>
              </div>

              {/* Process Pipeline Indicator at Visual Bottom */}
              <div className="relative z-10 bg-slate-950/80 backdrop-blur border border-slate-800 p-3 rounded-lg text-xs font-mono">
                <div className="text-slate-400 mb-1 text-[10px] uppercase tracking-wider">Spatial Logic Flow</div>
                <div className="flex items-center justify-between text-slate-200">
                  <span className="text-red-400 font-semibold">RISK</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-amber-400 font-semibold">VULNERABILITY</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-blue-400 font-semibold">CAPACITY</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-emerald-400 font-semibold">RELOCATION</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==================== SIMPLE INFORMATION SECTION ==================== */}
        <section id="about" className="border-t border-slate-200 bg-white py-24">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="max-w-2xl mb-16">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Operational Framework</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A192F] tracking-tight mb-4">
                FROM REACTIVE RESPONSE TO PROACTIVE PLANNING
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                DisasterShield AI combines hazard information, population vulnerability, GIS analysis and relocation capacity to help authorities make evidence-based disaster management decisions.
              </p>
            </div>

            {/* 3 Simple Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Card 1 */}
              <div className="p-8 rounded-xl border border-slate-200 bg-[#FAFAFA] hover:border-slate-300 transition-all">
                <div className="w-10 h-10 rounded-lg bg-red-100 border border-red-200 text-red-600 flex items-center justify-center font-bold text-sm mb-6">
                  01
                </div>
                <h3 className="text-lg font-bold text-[#0A192F] mb-2 uppercase tracking-wide">
                  IDENTIFY
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Detect hazard-based Red Zones.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-8 rounded-xl border border-slate-200 bg-[#FAFAFA] hover:border-slate-300 transition-all">
                <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-sm mb-6">
                  02
                </div>
                <h3 className="text-lg font-bold text-[#0A192F] mb-2 uppercase tracking-wide">
                  ASSESS
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Analyze vulnerable habitations and population exposure.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-8 rounded-xl border border-slate-200 bg-[#FAFAFA] hover:border-slate-300 transition-all">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-sm mb-6">
                  03
                </div>
                <h3 className="text-lg font-bold text-[#0A192F] mb-2 uppercase tracking-wide">
                  RELOCATE
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Evaluate and prioritize suitable relocation sites.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 space-y-4 sm:space-y-0">
          <div>
            <span className="font-semibold text-slate-700">RESettleAI</span> &mdash; Disaster Management Decision Support Platform
          </div>
          <div>
             Ministry of Home Affairs (NDRF DM Division)
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;