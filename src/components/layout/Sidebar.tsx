import React from 'react';
import {
  LayoutDashboard,
  Activity,
  HeartPulse,
  Brain,
  Sparkles,
  AlertTriangle,
  FileText,
  Settings,
  Orbit,
  Radio,
  ChevronRight,
  X
} from 'lucide-react';
import { useAstronaut, NavTab } from '../../context/AstronautContext';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const { activeTab, setActiveTab, alerts, activeAstronaut, settings } = useAstronaut();

  const activeAlertsCount = alerts.filter(
    a => a.status === 'active' && (a.severity === 'warning' || a.severity === 'critical')
  ).length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vitals', label: 'Vital Signs', icon: Activity },
    { id: 'physical', label: 'Physical Health', icon: HeartPulse },
    { id: 'mental', label: 'Mental Wellness', icon: Brain },
    { id: 'ai', label: 'AI Health Insights', icon: Sparkles },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: AlertTriangle,
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined
    },
    { id: 'reports', label: 'Health Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full select-none">
      {/* Brand & Mission Header */}
      <div>
        <div className="p-5 border-b border-slate-800/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
                <Orbit className="w-6 h-6 text-white animate-spin-slow" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-space-900 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-xl tracking-wider text-white">ASTRA</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    v2.6
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Astronaut Smart Tracking</p>
              </div>
            </div>

            {/* Mobile close button */}
            {onMobileClose && (
              <button
                onClick={onMobileClose}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-space-850"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <p className="text-[10px] text-slate-400 mt-2 font-mono flex items-center gap-1.5">
            <span className="text-cyan-400 font-semibold">"Monitoring Health. Protecting Lives Beyond Earth."</span>
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-space-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[11px] font-mono font-bold ${
                      isActive
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-rose-500/80 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && item.badge === undefined && (
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Astronaut Card & Mission Telemetry */}
      <div className="p-4 border-t border-slate-800/70 space-y-3">
        <div className="p-3 rounded-lg bg-space-850/80 border border-slate-800 flex items-center gap-3">
          <img
            src={activeAstronaut.avatarUrl}
            alt={activeAstronaut.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-cyan-500/40"
          />
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-200 truncate">
                {activeAstronaut.callsign}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[10px] text-cyan-400 font-mono truncate">
              SOL {activeAstronaut.missionDay} // MET
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
          <div className="flex items-center gap-1.5">
            <Radio
              className={`w-3.5 h-3.5 ${
                settings.simulationEnabled ? 'text-emerald-400 animate-pulse' : 'text-slate-400'
              }`}
            />
            <span>{settings.simulationEnabled ? 'STREAM: LIVE' : 'STREAM: PAUSED'}</span>
          </div>
          <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
            NASA 2026
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-64 bg-space-900/90 border-r border-slate-800/80 flex-col justify-between h-full backdrop-blur-xl shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />
          <aside className="relative w-72 max-w-[85vw] bg-space-900 border-r border-slate-800 h-full z-10 shadow-2xl overflow-y-auto">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
