import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Map, 
  Building2, 
  Cpu, 
  Activity, 
  BarChart3, 
  FileText, 
  Users, 
  Layers, 
  LogOut,
  Radio,
  X
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { user, logout } = useAuthStore();

  const navItems = [
    { path: '/dashboard', label: 'Command Overview', icon: LayoutDashboard },
    { path: '/map', label: 'Multi-Hazard GIS Map', icon: Map, badge: 'LIVE' },
    { path: '/habitations', label: 'Vulnerable Habitations', icon: Users, count: 10 },
    { path: '/sites', label: 'Relocation Sites', icon: Building2, count: 7 },
    { path: '/capacity', label: 'Carrying Capacity', icon: Layers },
    { path: '/optimizer', label: 'AI Relocation Solver', icon: Cpu, highlight: true },
    { path: '/monitoring', label: 'Live Telemetry & Alerts', icon: Activity, badge: '4 Alert' },
    { path: '/analytics', label: 'Risk Analytics', icon: BarChart3 },
    { path: '/reports', label: 'SDMA Briefing Reports', icon: FileText },
  ];

  return (
    <>
      {/* Mobile Dark Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="lg:hidden fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      <aside 
        className={`fixed top-0 left-0 z-40 lg:z-30 w-72 bg-[#0F172A] text-slate-300 flex flex-col h-screen border-r border-slate-800 shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-amber-500 to-indigo-600 p-0.5 shadow-lg shadow-rose-900/30">
              <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                RESettle<span className="text-rose-500">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                State Disaster Relocation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-semibold text-emerald-400">ONLINE</span>
            </div>

            {/* Close Mobile Drawer Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Core Operations
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                      : item.highlight
                      ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/50 hover:bg-indigo-900/80 hover:text-white'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badge === 'LIVE' 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && (
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                    {item.count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Live System Status Widget */}
        <div className="mx-3 mb-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Telemetry Feeds Active</span>
          </div>
          <p className="text-[11px] text-slate-400">
            5 Automatic Weather Stations reporting real-time soil moisture & slope metrics.
          </p>
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={user?.name}
              className="w-8 h-8 rounded-full border border-slate-700 object-cover"
            />
            <div className="truncate">
              <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{user?.role?.replace('_', ' ')}</div>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};

