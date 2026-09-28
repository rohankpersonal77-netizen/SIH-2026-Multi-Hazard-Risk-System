import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShieldAlert, 
  Building2, 
  Activity, 
  Cpu, 
  FileText, 
  ArrowRight,
  MapPin
} from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { AlertPanel } from '../components/dashboard/AlertPanel';
import { RiskMap } from '../components/map/RiskMap';
import { PriorityTable } from '../components/relocation/PriorityTable';
import { apiService } from '../services/api';
import type { Habitation, RelocationSite, HazardAlert } from '../types';
import { useDashboardStore } from '../store/dashboardStore';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDistrict } = useDashboardStore();
  const [habitations, setHabitations] = useState<Habitation[]>([]);
  const [sites, setSites] = useState<RelocationSite[]>([]);
  const [alerts, setAlerts] = useState<HazardAlert[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [habData, siteData, alertData] = await Promise.all([
        apiService.getHabitations(selectedDistrict),
        apiService.getRelocationSites(selectedDistrict),
        apiService.getHazardAlerts()
      ]);
      setHabitations(habData);
      setSites(siteData);
      setAlerts(alertData);
    };
    fetchData();
  }, [selectedDistrict]);

  const criticalCount = habitations.filter((h) => h.riskStatus === 'CRITICAL').length;
  const highRiskCount = habitations.filter((h) => h.riskStatus === 'HIGH').length;
  const totalPopulationAtRisk = habitations.reduce((acc, h) => acc + h.population, 0);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            SDMA Command Center Overview
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time Disaster Relocation & Vulnerability Intelligence Matrix for Maharashtra State
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate('/optimizer')}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <Cpu className="w-4 h-4 text-amber-300" />
            <span>Launch AI Optimizer</span>
          </button>

          <button
            onClick={() => navigate('/reports')}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Generate SDMA Briefing</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <StatCard
          title="Critical Risk Habitations"
          value={criticalCount}
          subtitle="P1 - Immediate Evacuation"
          icon={ShieldAlert}
          severity="critical"
          trend={{ value: '+2', direction: 'up', label: 'this week' }}
          onClick={() => navigate('/habitations')}
        />
        <StatCard
          title="High Risk Settlements"
          value={highRiskCount}
          subtitle="P2 - Priority Resettlement"
          icon={Users}
          severity="high"
          trend={{ value: 'Stable', direction: 'neutral', label: 'monitored' }}
          onClick={() => navigate('/habitations')}
        />
        <StatCard
          title="Total Population Vulnerable"
          value={totalPopulationAtRisk.toLocaleString()}
          subtitle="In High & Critical Zones"
          icon={Activity}
          severity="indigo"
          onClick={() => navigate('/analytics')}
        />
        <StatCard
          title="Available Relocation Sites"
          value={sites.length}
          subtitle="RS Safe Hubs Active"
          icon={Building2}
          severity="safe"
          trend={{ value: '18,500', direction: 'down', label: 'capacity' }}
          onClick={() => navigate('/sites')}
        />
      </div>

      {/* Main Grid: Interactive Map & Alert Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive GIS Map */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Multi-Hazard Spatial Risk Map</h3>
            </div>
            <button
              onClick={() => navigate('/map')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 flex-shrink-0"
            >
              <span>Expand Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <RiskMap habitations={habitations} sites={sites} height="h-[300px] sm:h-[420px]" />
        </div>

        {/* Right Column: Live Disaster Alert Feed */}
        <div className="h-[400px] sm:h-[480px]">
          <AlertPanel alerts={alerts} onViewAll={() => navigate('/monitoring')} />
        </div>
      </div>

      {/* Priority Matrix Table */}
      <div className="pt-2">
        <PriorityTable habitations={habitations} />
      </div>
    </div>
  );
};

