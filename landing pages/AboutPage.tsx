import React from 'react';
import { 
  Shield, 
  MapPin, 
  BarChart3, 
  Compass, 
  ShieldCheck, 
  ArrowRight,
  Cpu,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export const AboutPage: React.FC = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A192F] font-sans selection:bg-[#1E3A8A] selection:text-white flex flex-col justify-between">
      
      {/* ==================== HEADER ==================== */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-[#FAFAFA]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="bg-[#0A192F] text-white p-2 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0A192F]">
              RESettle<span className="text-blue-600">AI</span>
            </span>
          </div>

          <nav className="flex items-center space-x-8">
            <a href="/home" className="text-sm font-medium text-slate-600 hover:text-[#0A192F] transition-colors">
              Home
            </a>
            <a href="/about" className="text-sm font-medium text-slate-600 hover:text-[#0A192F] transition-colors">
              About
            </a>
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-slate-700 hover:text-[#0A192F] transition-colors"
            >
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

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1">

        {/* HERO HEADER */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2 border border-slate-200 bg-white px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 uppercase tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Platform Overview & Architecture</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0A192F] leading-tight">
              PRECISION GEOSPATIAL ANALYTICS FOR DISASTER RISK REDUCTION
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed">
              RESettleAI addresses critical gaps in disaster risk assessment and habitation management. By combining high-resolution spatial datasets with machine learning models, the platform calculates carry capacities and identifies viable resettlement zones prior to catastrophic climate events.
            </p>
          </div>
        </section>

        {/* METRICS & PROBLEM SPECIFICATION */}
        <section className="border-y border-slate-200 bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200">

              <div className="pt-4 md:pt-0 md:px-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Primary Focus</span>
                <span className="text-2xl font-bold text-[#0A192F]">Hazard Red Zones</span>
                <p className="text-xs text-slate-500 mt-2">Landslide, Flood, and Coastal Exposure Mapping</p>
              </div>

              <div className="pt-4 md:pt-0 md:px-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Analytical Core</span>
                <span className="text-2xl font-bold text-[#0A192F]">Carrying Capacity</span>
                <p className="text-xs text-slate-500 mt-2">Infrastructure, Water & Land Constraints</p>
              </div>

              <div className="pt-4 md:pt-0 md:pl-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Execution Authority</span>
                <span className="text-2xl font-bold text-[#0A192F]">NDRF DM Division</span>
                <p className="text-xs text-slate-500 mt-2">National Disaster Response Force Framework</p>
              </div>

            </div>
          </div>
        </section>

        {/* CORE METHODOLOGY */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="mb-12">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Technical Architecture</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A192F] tracking-tight">
              FOUR-STAGE DECISION MATRIX
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Stage 1 */}
            <div className="p-8 bg-white border border-slate-200 rounded-xl space-y-4">
              <div className="flex items-center space-x-3 text-red-600">
                <MapPin className="w-5 h-5" />
                <h3 className="font-bold text-lg text-[#0A192F] uppercase tracking-wide">1. Hazard Red Zone Delineation</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Utilizes multi-spectral satellite imagery, digital elevation models (DEM), and historical disaster occurrence data to automatically boundary high-vulnerability hazard zones.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="p-8 bg-white border border-slate-200 rounded-xl space-y-4">
              <div className="flex items-center space-x-3 text-amber-600">
                <BarChart3 className="w-5 h-5" />
                <h3 className="font-bold text-lg text-[#0A192F] uppercase tracking-wide">2. Population Vulnerability Index</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Aggregates demographic density, housing durability statistics, and accessibility factors to rank vulnerable habitations within critical risk zones.
              </p>
            </div>

            {/* Stage 3 */}
            <div className="p-8 bg-white border border-slate-200 rounded-xl space-y-4">
              <div className="flex items-center space-x-3 text-blue-600">
                <Cpu className="w-5 h-5" />
                <h3 className="font-bold text-lg text-[#0A192F] uppercase tracking-wide">3. Carrying Capacity Modeling</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Evaluates candidate relocation areas across key metrics: ecological stability, water resource availability, power grid proximity, and slope gradient.
              </p>
            </div>

            {/* Stage 4 */}
            <div className="p-8 bg-white border border-slate-200 rounded-xl space-y-4">
              <div className="flex items-center space-x-3 text-emerald-600">
                <Compass className="w-5 h-5" />
                <h3 className="font-bold text-lg text-[#0A192F] uppercase tracking-wide">4. Optimal Relocation Routing</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generates prioritized relocation pathways for disaster response units and urban planning authorities, minimizing socio-economic displacement.
              </p>
            </div>

          </div>
        </section>

        {/* SECURITY & GOVERNANCE BANNER */}
        <section className="border-t border-slate-200 bg-[#0A192F] text-white py-16">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Restricted Institutional Platform</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Authority Access Protocol</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                RESettleAI is exclusively calibrated for designated government authorities, relief commanders, and NDRF planning officers. Access requires verified government credentials.
              </p>
            </div>

            <button
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm rounded-md transition-all shrink-0 flex items-center space-x-2"
            >
              <span>Authenticate Authority Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
            Problem ID 26191 | Ministry of Home Affairs (NDRF DM Division)
          </div>
        </div>
      </footer>

    </div>
  );
};

export default AboutPage;