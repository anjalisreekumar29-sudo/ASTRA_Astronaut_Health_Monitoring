import React from 'react';
import {
  Settings,
  Radio,
  Volume2,
  VolumeX,
  AlertOctagon,
  ShieldAlert,
  RotateCcw,
  Clock,
  Wifi,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import { useAstronaut } from '../../context/AstronautContext';
import { SystemSettings } from '../../types';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, injectAnomaly, resetToDefaults } = useAstronaut();

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <span>ASTRA SYSTEM CONFIGURATION &amp; SIMULATION CONTROLS</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Configure telemetry frequency, test anomaly injections, threshold limits, and demo persistence
        </p>
      </div>

      {/* Section 1: Telemetry Stream Controls */}
      <div className="hud-card p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Radio className="w-4 h-4 text-cyan-400" />
          <span>TELEMETRY STREAM ENGINE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Stream Toggle */}
          <div className="p-4 rounded-xl bg-space-850 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-200 block">Real-Time Telemetry Jitter</span>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Simulates microgravity sensor fluctuations in real time
              </p>
            </div>
            <button
              onClick={() => updateSettings({ simulationEnabled: !settings.simulationEnabled })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                settings.simulationEnabled
                  ? 'bg-emerald-500 text-space-950 hover:bg-emerald-400'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {settings.simulationEnabled ? 'ACTIVE' : 'PAUSED'}
            </button>
          </div>

          {/* Update Frequency */}
          <div className="p-4 rounded-xl bg-space-850 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Sampling Interval:</span>
              <span className="text-cyan-400 font-bold">{settings.simulationIntervalMs / 1000}s</span>
            </div>
            <input
              type="range"
              min="1000"
              max="5000"
              step="1000"
              value={settings.simulationIntervalMs}
              onChange={e => updateSettings({ simulationIntervalMs: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1s (High Freq)</span>
              <span>3s (Nominal)</span>
              <span>5s (Low Power)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Scenario Anomaly Injection */}
      <div className="hud-card p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <AlertOctagon className="w-4 h-4 text-amber-400" />
          <span>SIMULATED ANOMALY SCENARIO INJECTION</span>
        </div>
        <p className="text-xs text-slate-300">
          Inject specific clinical or environmental emergency scenarios to observe ASTRA's multi-variable AI response, threshold alert triggers, and recommended countermeasures.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
          <button
            onClick={() => injectAnomaly('none')}
            className={`p-3 rounded-xl border text-left transition-all ${
              settings.activeAnomalyInjection === 'none'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 shadow-sm shadow-cyan-500/20'
                : 'bg-space-850 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-white">Nominal Spaceflight</div>
            <p className="text-[11px] text-slate-400 font-sans mt-1">Normal circadian vital parameters.</p>
          </button>

          <button
            onClick={() => injectAnomaly('solar_flare')}
            className={`p-3 rounded-xl border text-left transition-all ${
              settings.activeAnomalyInjection === 'solar_flare'
                ? 'bg-rose-500/20 border-rose-500 text-rose-200 shadow-sm shadow-rose-500/20'
                : 'bg-space-850 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-rose-400">Solar Particle Storm (SPE)</div>
            <p className="text-[11px] text-slate-400 font-sans mt-1">Spikes cosmic dosimeter flux rate.</p>
          </button>

          <button
            onClick={() => injectAnomaly('hypoxia')}
            className={`p-3 rounded-xl border text-left transition-all ${
              settings.activeAnomalyInjection === 'hypoxia'
                ? 'bg-sky-500/20 border-sky-500 text-sky-200 shadow-sm shadow-sky-500/20'
                : 'bg-space-850 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-sky-400">Cabin Hypoxia (Low SpO2)</div>
            <p className="text-[11px] text-slate-400 font-sans mt-1">SpO2 drops &lt; 90%; elevated resp rate.</p>
          </button>

          <button
            onClick={() => injectAnomaly('cardiac_arrhythmia')}
            className={`p-3 rounded-xl border text-left transition-all ${
              settings.activeAnomalyInjection === 'cardiac_arrhythmia'
                ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-sm shadow-amber-500/20'
                : 'bg-space-850 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-amber-400">Tachycardia / Arrhythmia</div>
            <p className="text-[11px] text-slate-400 font-sans mt-1">Heart rate surges to 135+ BPM with BP spike.</p>
          </button>

          <button
            onClick={() => injectAnomaly('acute_fatigue')}
            className={`p-3 rounded-xl border text-left transition-all ${
              settings.activeAnomalyInjection === 'acute_fatigue'
                ? 'bg-purple-500/20 border-purple-500 text-purple-200 shadow-sm shadow-purple-500/20'
                : 'bg-space-850 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-purple-400">Acute Cognitive Fatigue</div>
            <p className="text-[11px] text-slate-400 font-sans mt-1">Sustained sleep debt with slowed PVT response.</p>
          </button>
        </div>
      </div>

      {/* Section 3: Communication & Threshold Limits */}
      <div className="hud-card p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Wifi className="w-4 h-4 text-cyan-400" />
          <span>EARTH-GATEWAY NETWORK &amp; THRESHOLDS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Earth Communication Delay */}
          <div className="p-4 rounded-xl bg-space-850 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Light-Time Latency Delay:</span>
              <span className="text-cyan-400 font-bold">{settings.earthCommDelayMinutes} mins</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="20.0"
              step="0.5"
              value={settings.earthCommDelayMinutes}
              onChange={e => updateSettings({ earthCommDelayMinutes: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.5m (Lunar Close)</span>
              <span>4.4m (Gateway Orbit)</span>
              <span>20m (Mars Max)</span>
            </div>
          </div>

          {/* Audio Chime Notification */}
          <div className="p-4 rounded-xl bg-space-850 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-200 block">Critical Audio Chimes</span>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Auditory cue when triage alert enters Warning or Critical state
              </p>
            </div>
            <button
              onClick={() => updateSettings({ audioAlertsEnabled: !settings.audioAlertsEnabled })}
              className={`p-2 rounded-lg border transition-colors ${
                settings.audioAlertsEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-space-900 text-slate-400 border-slate-700'
              }`}
            >
              {settings.audioAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Demo State Reset */}
      <div className="hud-card p-5 rounded-xl border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-mono font-bold text-rose-400 uppercase flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            <span>RESET DEMO LOCAL STORAGE DATABASE</span>
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            Clears all customized manual entries, exercise logs, and check-ins, restoring the original NASA Space Apps demonstration package.
          </p>
        </div>
        <button
          onClick={resetToDefaults}
          className="px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-300 font-mono text-xs font-bold hover:bg-rose-500/30 transition-colors shrink-0"
        >
          Reset All Demo Data
        </button>
      </div>
    </div>
  );
};
