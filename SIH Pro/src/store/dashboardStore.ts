import { create } from 'zustand';

interface DashboardState {
  selectedDistrict: string;
  selectedRiskFilter: string;
  searchQuery: string;
  setSelectedDistrict: (district: string) => void;
  setSelectedRiskFilter: (risk: string) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedDistrict: 'ALL',
  selectedRiskFilter: 'ALL',
  searchQuery: '',
  setSelectedDistrict: (district) => set({ selectedDistrict: district }),
  setSelectedRiskFilter: (risk) => set({ selectedRiskFilter: risk }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () => set({ selectedDistrict: 'ALL', selectedRiskFilter: 'ALL', searchQuery: '' })
}));
