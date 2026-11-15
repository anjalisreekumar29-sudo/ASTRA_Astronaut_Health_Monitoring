import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Filter,
  Check,
  AlertCircle,
  FileCheck,
  Activity,
  Radio,
  ExternalLink,
  X,
  PlayCircle
} from 'lucide-react';
import { useAstronaut } from '../../context/AstronautContext';
import { AlertSeverity, HealthAlert } from '../../types';

export const AlertsView: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert } = useAstronaut();
  const [severityFilter, setSeverityFilter] = useState<'all' | AlertSeverity>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');
  const [activeChecklistAlert, setActiveChecklistAlert] = useState<HealthAlert | null>(null);
  const [checklistSteps, setChecklistSteps] = useState<{ [key: string]: boolean }>({});

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  const activeCriticalCount = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
  const activeWarningCount = alerts.filter(a => a.severity === 'warning' && a.status === 'active').length;

  const handleOpenChecklist = (alert: HealthAlert) => {
    setActiveChecklistAlert(alert);
    setChecklistSteps({
      step1: false,
      step2: false,
      step3: false,
      step4: false
    });
  };

  const toggleChecklistStep = (key: string) => {
    setChecklistSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>MISSION HEALTH ALERTS &amp; EMERGENCY TRIAGE</span>
            </h2>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              [SIMULATED TRIAGE ENGINE]
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Automated threshold triggers, multi-biomarker alerts, and flight surgeon protocols
          </p>
        </div>

        {/* Quick Severity Badges */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40">
            Critical: {activeCriticalCount}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
            Warning: {activeWarningCount}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            Nominal: {alerts.filter(a => a.severity === 'normal').length}
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl hud-card border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Filters:</span>
        </div>

        {/* Severity Selector */}
        <div className="flex items-center gap-1 bg-space-850 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setSeverityFilter('all')}
            className={`px-2.5 py-1 rounded ${severityFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'}`}
          >
            All Severities
          </button>
          <button
            onClick={() => setSeverityFilter('critical')}
            className={`px-2.5 py-1 rounded ${severityFilter === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400'}`}
          >
            Critical
          </button>
          <button
            onClick={() => setSeverityFilter('warning')}
            className={`px-2.5 py-1 rounded ${severityFilter === 'warning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400'}`}
          >
            Warning
          </button>
          <button
            onClick={() => setSeverityFilter('normal')}
            className={`px-2.5 py-1 rounded ${severityFilter === 'normal' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400'}`}
          >
            Normal
          </button>
        </div>

        {/* Status Selector */}
        <div className="flex items-center gap-1 bg-space-850 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded ${statusFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'}`}
          >
            All Statuses
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-2.5 py-1 rounded ${statusFilter === 'active' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400'}`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('acknowledged')}
            className={`px-2.5 py-1 rounded ${statusFilter === 'acknowledged' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400'}`}
          >
            Acknowledged
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-2.5 py-1 rounded ${statusFilter === 'resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400'}`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Alerts Stream List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="hud-card p-12 text-center text-slate-400 text-xs font-mono rounded-xl border border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-white">No alerts matching filter criteria.</p>
            <p className="text-slate-500 mt-1">All monitored biosensors and systems are within nominal boundaries.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`hud-card p-5 rounded-xl border transition-all ${
                alert.severity === 'critical'
                  ? 'border-rose-500/50 hud-glow-crimson'
                  : alert.severity === 'warning'
                  ? 'border-amber-500/40 hud-glow-amber'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left: Icon & Details */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl border shrink-0 ${
                      alert.severity === 'critical'
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse'
                        : alert.severity === 'warning'
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-white tracking-wide">{alert.title}</h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          alert.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : alert.severity === 'warning'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-850 text-slate-300 border border-slate-700/60 uppercase">
                        {alert.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200">{alert.description}</p>

                    {/* Scientific Physiological Explanation */}
                    <div className="p-3 rounded-lg bg-space-850/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                      <strong className="text-cyan-400 font-mono text-[11px] block">
                        AEROSPACE PHYSIOLOGY EXPLANATION:
                      </strong>
                      <p>{alert.explanation}</p>
                    </div>

                    {/* Recommended Next Steps */}
                    <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200 space-y-1">
                      <strong className="text-cyan-300 font-mono text-[11px] block">
                        RECOMMENDED CLINICAL ACTION:
                      </strong>
                      <p>{alert.recommendedAction}</p>
                    </div>

                    {/* Metrics Snapshot */}
                    {Object.keys(alert.metricsSnapshot).length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400 pt-1">
                        <span>Telemetry at Trigger:</span>
                        {Object.entries(alert.metricsSnapshot).map(([k, v]) => (
                          <span key={k} className="px-1.5 py-0.5 rounded bg-space-900 border border-slate-700 text-slate-200">
                            {k}: {String(v)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 text-right">
                    <span>{alert.timestamp}</span>
                    <div className="mt-1">
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          alert.status === 'active'
                            ? 'text-rose-400'
                            : alert.status === 'acknowledged'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        Status: {alert.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {alert.severity !== 'normal' && (
                      <button
                        onClick={() => handleOpenChecklist(alert)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-colors flex items-center gap-1"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Protocol Checklist</span>
                      </button>
                    )}
                    {alert.status === 'active' && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono bg-space-850 border border-slate-700 text-slate-200 hover:border-cyan-400 hover:text-white transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}
                    {alert.status !== 'resolved' && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Emergency Protocol Checklist Modal */}
      {activeChecklistAlert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="hud-card p-6 rounded-2xl max-w-lg w-full border border-cyan-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                  NASA EMERGENCY COUNTERMEASURE CHECKLIST
                </h3>
              </div>
              <button
                onClick={() => setActiveChecklistAlert(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-space-850 border border-slate-800 text-xs">
              <span className="text-slate-400 font-mono block text-[11px]">ACTIVE EVENT:</span>
              <strong className="text-white text-sm block mt-0.5">{activeChecklistAlert.title}</strong>
              <p className="text-slate-300 mt-1">{activeChecklistAlert.recommendedAction}</p>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <span className="text-slate-400 uppercase text-[11px] font-semibold block">
                Verification Steps (Crew Medical Checklist):
              </span>

              <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-space-850 border border-slate-800 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={checklistSteps.step1 || false}
                  onChange={() => toggleChecklistStep('step1')}
                  className="mt-0.5 accent-cyan-400"
                />
                <span className="text-slate-200">
                  Step 1: Verify sensor electrode alignment and rule out lead displacement artifacts.
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-space-850 border border-slate-800 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={checklistSteps.step2 || false}
                  onChange={() => toggleChecklistStep('step2')}
                  className="mt-0.5 accent-cyan-400"
                />
                <span className="text-slate-200">
                  Step 2: Confirm cabin atmospheric parameters (O2 &gt; 21%, CO2 &lt; 3.0 mmHg, 101.3 kPa).
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-space-850 border border-slate-800 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={checklistSteps.step3 || false}
                  onChange={() => toggleChecklistStep('step3')}
                  className="mt-0.5 accent-cyan-400"
                />
                <span className="text-slate-200">
                  Step 3: Notify Onboard Crew Medical Officer (CMO) and initiate telemetry downlink.
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-space-850 border border-slate-800 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={checklistSteps.step4 || false}
                  onChange={() => toggleChecklistStep('step4')}
                  className="mt-0.5 accent-cyan-400"
                />
                <span className="text-slate-200">
                  Step 4: Execute prescribed clinical countermeasure and observe 15-minute recovery response.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-500">
                NASA Flight Rule 4.1.2 Checklist
              </span>
              <button
                onClick={() => {
                  acknowledgeAlert(activeChecklistAlert.id);
                  setActiveChecklistAlert(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 text-space-950 font-bold hover:bg-cyan-400 text-xs font-mono transition-colors"
              >
                Complete Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
