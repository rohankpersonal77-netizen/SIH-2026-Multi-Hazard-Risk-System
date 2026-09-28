import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  ShieldAlert, 
  CheckCheck, 
  Trash2, 
  ExternalLink, 
  BellOff, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useDashboardStore } from '../../store/dashboardStore';
import type { HazardAlert } from '../../types';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<HazardAlert[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('sih_read_alerts');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [activeTab, setActiveTab] = useState<'ALL' | 'CRITICAL' | 'HIGH'>('ALL');
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setSelectedDistrict } = useDashboardStore();

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getHazardAlerts();
      setAlerts(data);
    } catch (err) {
      console.error('Error fetching alerts in notification dropdown:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Poll for updated model warnings every 45s
    const timer = setInterval(fetchAlerts, 45000);
    return () => clearInterval(timer);
  }, []);

  // Close on outside click or Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const markAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    const allIds = new Set(alerts.map((a) => a.id));
    setReadIds(allIds);
    try {
      localStorage.setItem('sih_read_alerts', JSON.stringify([...allIds]));
    } catch {
      // ignore
    }
  };

  const clearAllAlerts = (e: React.MouseEvent) => {
    e.stopPropagation();
    const allIds = new Set(alerts.map((a) => a.id));
    setReadIds(allIds);
    setAlerts([]);
  };

  const handleAlertClick = (alert: HazardAlert) => {
    // Mark as read
    const next = new Set(readIds);
    next.add(alert.id);
    setReadIds(next);
    try {
      localStorage.setItem('sih_read_alerts', JSON.stringify([...next]));
    } catch {
      // ignore
    }

    // Set selected district if available
    if (alert.district && alert.district !== 'Maharashtra') {
      setSelectedDistrict(alert.district);
    }

    setIsOpen(false);
    navigate('/map');
  };

  const unreadAlerts = alerts.filter((a) => !readIds.has(a.id));
  const unreadCount = unreadAlerts.length;
  const hasCriticalUnread = unreadAlerts.some((a) => a.severity === 'CRITICAL');

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === 'CRITICAL') return a.severity === 'CRITICAL';
    if (activeTab === 'HIGH') return a.severity === 'HIGH';
    return true;
  });

  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL').length;
  const highCount = alerts.filter((a) => a.severity === 'HIGH').length;

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`p-2 rounded-xl transition-all relative focus:outline-none ${
          isOpen
            ? 'bg-indigo-50 text-indigo-600 ring-2 ring-indigo-500/20'
            : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
        }`}
        title="Alerts and Notifications"
        aria-label="Open Alerts and Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" />

        {/* Unread Counter Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
            {hasCriticalUnread && (
              <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-75 pointer-events-none"></span>
            )}
          </span>
        )}
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
          {/* Top Header */}
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/75 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  Disaster Warning Feed
                  {unreadCount > 0 && (
                    <span className="bg-rose-100 text-rose-700 font-semibold px-1.5 py-0.5 text-[10px] rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </h4>
                <p className="text-[10px] text-slate-500">Live Model and Sensor Telemetry</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-200/60 rounded-lg text-xs transition-colors flex items-center gap-1 font-medium"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">Read all</span>
                </button>
              )}
              {alerts.length > 0 && (
                <button
                  onClick={clearAllAlerts}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs transition-colors"
                  title="Clear all alerts"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-3 py-2 bg-slate-100/50 border-b border-slate-100 flex items-center gap-1 text-[11px]">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                activeTab === 'ALL'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({alerts.length})
            </button>
            <button
              onClick={() => setActiveTab('CRITICAL')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                activeTab === 'CRITICAL'
                  ? 'bg-rose-100 text-rose-700 shadow-xs'
                  : 'text-slate-500 hover:text-rose-600'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Critical ({criticalCount})
            </button>
            <button
              onClick={() => setActiveTab('HIGH')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                activeTab === 'HIGH'
                  ? 'bg-amber-100 text-amber-700 shadow-xs'
                  : 'text-slate-500 hover:text-amber-600'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              High ({highCount})
            </button>
          </div>

          {/* Alerts Scroll List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="py-8 px-4 text-center text-xs text-indigo-600 font-medium animate-pulse">
                Syncing Telemetry & Hazard Alerts...
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="py-8 px-4 text-center flex flex-col items-center gap-2 text-slate-400">
                {alerts.length === 0 ? (
                  <>
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 stroke-[1.5]" />
                    <div className="text-xs font-bold text-slate-700">All Clear — No Active Warnings</div>
                    <div className="text-[11px] text-slate-500 max-w-[220px]">
                      Hydrological flood models and sensors report normal operational baselines across Maharashtra.
                    </div>
                  </>
                ) : (
                  <>
                    <BellOff className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                    <div className="text-xs font-semibold text-slate-600">No {activeTab.toLowerCase()} warnings</div>
                    <div className="text-[11px] text-slate-400">Switch tabs to view other advisory levels.</div>
                  </>
                )}
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isRead = readIds.has(alert.id);
                const isCritical = alert.severity === 'CRITICAL';
                const isHigh = alert.severity === 'HIGH';

                return (
                  <div
                    key={alert.id}
                    onClick={() => handleAlertClick(alert)}
                    className={`p-3 text-left transition-colors cursor-pointer group flex items-start gap-2.5 ${
                      isRead
                        ? 'hover:bg-slate-50 bg-white'
                        : 'bg-indigo-50/25 hover:bg-indigo-50/50'
                    }`}
                  >
                    {/* Severity Indicator Dot */}
                    <div className="pt-0.5 flex-shrink-0">
                      <span
                        className={`w-2.5 h-2.5 rounded-full block ${
                          isCritical
                            ? 'bg-rose-500 shadow-sm shadow-rose-500/50 ring-2 ring-rose-200 animate-pulse'
                            : isHigh
                            ? 'bg-amber-500 shadow-sm shadow-amber-500/40 ring-2 ring-amber-200'
                            : 'bg-yellow-400'
                        }`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            isCritical
                              ? 'bg-rose-100 text-rose-700'
                              : isHigh
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {alert.timestamp}
                        </span>
                      </div>

                      <h5 className="text-xs font-bold text-slate-800 mt-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {alert.title}
                      </h5>

                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                        {alert.message}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          📍 {alert.district}
                        </span>
                        <span className="text-indigo-600 font-semibold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          Inspect on Map <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    {/* Unread dot */}
                    {!isRead && (
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0 mt-1.5" title="Unread"></div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-medium text-slate-600">Model Live • CAP v1.2</span>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/map');
              }}
              className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
            >
              <span>View Hazard Map</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
