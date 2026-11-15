import React from 'react';
import {
  AlertTriangle,
  Dumbbell,
  Brain,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useAstronaut } from '../../context/AstronautContext';

export const RecentActivityList: React.FC = () => {
  const { alerts, exerciseSessions, mentalCheckIns, recommendations, setActiveTab, acknowledgeAlert } = useAstronaut();

  const activeAlerts = alerts.filter(a => a.status === 'active').slice(0, 3);
  const recentExercise = exerciseSessions.slice(0, 2);
  const latestMental = mentalCheckIns[mentalCheckIns.length - 1];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Left: Active Alerts & AI Triage */}
      <div className="hud-card p-5 rounded-xl border border-slate-800/80 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>ACTIVE CLINICAL & TELEMETRY ALERTS</span>
            </h3>
            <button
              onClick={() => setActiveTab('alerts')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 transition-colors"
            >
              <span>View All ({alerts.filter(a => a.status === 'active').length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeAlerts.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs font-mono border border-slate-800/60 rounded-lg">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <span>No critical or warning alerts active. All systems nominal.</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {activeAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border text-xs transition-all ${
                    alert.severity === 'critical'
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                      : alert.severity === 'warning'
                      ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                      : 'bg-space-850 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          alert.severity === 'critical'
                            ? 'text-rose-400 animate-pulse'
                            : 'text-amber-400'
                        }`}
                      />
                      <div>
                        <div className="font-semibold text-white">{alert.title}</div>
                        <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-2 py-1 rounded text-[10px] font-mono bg-space-900 border border-slate-700 hover:border-cyan-500 text-slate-300 shrink-0 transition-colors"
                    >
                      Acknowledge
                    </button>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{alert.timestamp}</span>
                    <span className="text-cyan-400 uppercase font-semibold">{alert.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Smart Recommendations & Activity Logs */}
      <div className="hud-card p-5 rounded-xl border border-slate-800/80 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI PRESCRIBED COUNTERMEASURES</span>
            </h3>
            <button
              onClick={() => setActiveTab('ai')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 transition-colors"
            >
              <span>Insights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recommendations.slice(0, 2).map(rec => (
              <div
                key={rec.id}
                className="p-3 rounded-lg bg-space-850/80 border border-slate-800 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs">{rec.title}</span>
                  <span
                    className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded font-bold ${
                      rec.urgency === 'high'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : rec.urgency === 'medium'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {rec.urgency} Urgency
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{rec.suggestedAction}</p>
                <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                  <strong className="text-slate-400">Why: </strong>
                  {rec.rationale}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick status footer: Exercise & Sleep */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 bg-space-850 p-2 rounded-lg border border-slate-800">
            <Dumbbell className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-mono block">Exercise Today</span>
              <span className="font-semibold text-slate-200 truncate block">
                {recentExercise[0]?.durationMinutes || 45}m ARED Resistive
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-space-850 p-2 rounded-lg border border-slate-800">
            <Brain className="w-4 h-4 text-purple-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-mono block">Last Rest Cycle</span>
              <span className="font-semibold text-slate-200 truncate block">
                {latestMental ? `${latestMental.sleepHours}h (${latestMental.sleepQualityRating}%)` : '6.8h Nominal'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
