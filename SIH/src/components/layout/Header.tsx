import React from 'react';
import { 
  Search, 
  Bell, 
  MapPin, 
  Clock, 
  AlertTriangle,
  Menu
} from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { selectedDistrict, setSelectedDistrict, searchQuery, setSearchQuery } = useDashboardStore();
  const { user } = useAuthStore();

  const districts = ['ALL', 'Pune', 'Raigad', 'Ratnagiri', 'Nashik', 'Satara'];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm gap-2 sm:gap-4">
      {/* Left Section: Mobile Menu Toggle + Search & District Filter */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 max-w-2xl">
        {/* Hamburger Menu Toggle Button for Mobile/Tablet */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none flex-shrink-0"
          title="Open Navigation Menu"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input */}
        <div className="relative flex-1 min-w-[120px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search village, taluka, RS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-100/80 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all truncate"
          />
        </div>

        {/* District Selector Dropdown */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs flex-shrink-0">
          <MapPin className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
          <span className="text-slate-500 font-medium hidden md:inline">District:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer text-xs"
          >
            {districts.map((d) => (
              <option key={d} value={d}>
                {d === 'ALL' ? 'All Districts' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Section: Ticker & Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {/* Warning Banner Pill */}
        <div className="hidden lg:flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-700">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
          <span>Malin & Chiplun: Evacuation Alert</span>
        </div>

        {/* System Time & Date */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>24 AUG 2026 | 16:00 IST</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>
        </div>

        {/* Authority Badge */}
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
            SDMA
          </div>
          <div className="text-right hidden md:block">
            <div className="text-xs font-bold text-slate-800">{user?.district || 'SDMA HQ'}</div>
            <div className="text-[10px] font-semibold text-emerald-600 flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Verified
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

