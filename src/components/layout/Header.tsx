import React, { useState, useEffect } from 'react';
import {
  Users,
  Play,
  Pause,
  AlertOctagon,
  Clock,
  Radio,
  PlusCircle,
  Volume2,
  VolumeX,
  Wifi,
  Menu
} from 'lucide-react';
import { useAstronaut } from '../../context/AstronautContext';
import { SystemSettings } from '../../types';

interface HeaderProps {
  onOpenManualModal: () => void;
  onOpenCheckInModal: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenManualModal,
  onOpenCheckInModal,
  onToggleMobileMenu
}) => {
  const {
    astronauts,
    activeAstronaut,
    activeAstronautId,
    setActiveAstronautId,
    settings,
    updateSettings,
    injectAnomaly
  } = useAstronaut();

  // Live ticking seconds counter for MET HUD
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(currentTime.getHours()).padStart(2, '0');
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');
  const seconds = String(currentTime.getSeconds()).padStart(2, '0');

  const handleAnomalyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    injectAnomaly(e.target.value as SystemSettings['activeAnomalyInjection']);
  };

  return (
    <header className="min-h-16 bg-space-900/80 border-b border-slate-800/80 px-4 md:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md sticky top-0 z-30">
      {/* Left: Mobile Menu Button + Mission Information & MET Clock */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg bg-space-850 border border-slate-700/80 text-slate-300 hover:text-white"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm tracking-wide text-white">
              {activeAstronaut.missionName.split('–')[0].trim()}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium">
              SOL {activeAstronaut.missionDay} of {activeAstronaut.totalMissionDays}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>MET {activeAstronaut.missionDay}d {hours}:{minutes}:{seconds} UTC</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 flex items-center gap-1">
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>Delay: {settings.earthCommDelayMinutes}m</span>
            </span>
          </p>
        </div>
      </div>

      {/* Right Controls: Crew Selector, Anomaly Injector, Stream Toggle, Quick Actions */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Crew Selector */}
        <div className="flex items-center gap-1.5 bg-space-850/80 border border-slate-700/60 rounded-lg px-2 py-1.5">
          <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <select
            value={activeAstronautId}
            onChange={e => setActiveAstronautId(e.target.value)}
            className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer max-w-[130px] sm:max-w-none truncate"
          >
            {astronauts.map(astro => (
              <option key={astro.id} value={astro.id} className="bg-space-900 text-slate-200">
                {astro.name} ({astro.callsign})
              </option>
            ))}
          </select>
        </div>

        {/* Anomaly Simulator Injection */}
        <div className="flex items-center gap-1.5 bg-space-850/80 border border-amber-500/30 rounded-lg px-2 py-1.5">
          <AlertOctagon className={`w-3.5 h-3.5 shrink-0 ${settings.activeAnomalyInjection !== 'none' ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
          <select
            value={settings.activeAnomalyInjection}
            onChange={handleAnomalyChange}
            className="bg-transparent text-xs text-amber-300 font-medium focus:outline-none cursor-pointer max-w-[130px] sm:max-w-none truncate"
            title="Inject simulated physiological anomalies to test ASTRA alert triggers"
          >
            <option value="none" className="bg-space-900 text-slate-300">Scenario: Nominal</option>
            <option value="solar_flare" className="bg-space-900 text-rose-300">Simulate: SPE Flare</option>
            <option value="hypoxia" className="bg-space-900 text-rose-300">Simulate: Hypoxia</option>
            <option value="cardiac_arrhythmia" className="bg-space-900 text-amber-300">Simulate: Arrhythmia</option>
            <option value="acute_fatigue" className="bg-space-900 text-amber-300">Simulate: Fatigue (PVT)</option>
          </select>
        </div>

        {/* Live Simulation Play/Pause */}
        <button
          onClick={() => updateSettings({ simulationEnabled: !settings.simulationEnabled })}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
            settings.simulationEnabled
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
          }`}
          title={settings.simulationEnabled ? 'Pause real-time telemetry stream' : 'Resume real-time telemetry stream'}
        >
          {settings.simulationEnabled ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LIVE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PAUSED</span>
            </>
          )}
        </button>

        {/* Audio Alerts Toggle */}
        <button
          onClick={() => updateSettings({ audioAlertsEnabled: !settings.audioAlertsEnabled })}
          className={`p-1.5 sm:p-2 rounded-lg border text-xs transition-colors ${
            settings.audioAlertsEnabled
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
              : 'bg-space-850/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
          title={settings.audioAlertsEnabled ? 'Audio Chimes Enabled' : 'Audio Chimes Muted'}
        >
          {settings.audioAlertsEnabled ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Quick Manual Log Modal Button */}
        <button
          onClick={onOpenManualModal}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Log Vitals</span>
        </button>
      </div>
    </header>
  );
};
