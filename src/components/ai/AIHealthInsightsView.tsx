import React from 'react';
import {
  Sparkles,
  Cpu,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Dna,
  HeartPulse,
  Brain,
  Radio,
  ArrowRight,
  Info,
  Check,
  Activity,
  Layers,
  BookOpen
} from 'lucide-react';
import { useAstronaut } from '../../context/AstronautContext';

export const AIHealthInsightsView: React.FC = () => {
  const {
    aiAnalysis,
    activeAstronaut,
    currentVitals,
    recommendations,
    alerts,
    acknowledgeRecommendation,
    setActiveTab
  } = useAstronaut();

  const baseline = activeAstronaut.baselineVitals;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>ASTRA BIO-PREDICT AI INTELLIGENCE ENGINE</span>
            </h2>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              [SIMULATED AI HEURISTICS]
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Multi-variable cross-correlation, pattern anomaly recognition, and flight surgeon decision support
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Rule Engine &amp; Heuristic Predictor: ACTIVE</span>
        </div>
      </div>

      {/* Medical Protocol Compliance Notice */}
      <div className="p-4 rounded-xl bg-space-850/90 border border-cyan-500/30 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <strong className="text-cyan-300 font-semibold block">
            AEROSPACE MEDICAL PROTOCOL COMPLIANCE (NASA HRP GUIDELINES):
          </strong>
          <p>
            {aiAnalysis.medicalDisclaimer} ASTRA utilizes multi-system baseline differentials, evaluating cardiovascular, musculoskeletal, immunological, and circadian inputs. Final diagnostic authority resides with the Crew Medical Officer (CMO) and Ground Flight Surgeon.
          </p>
        </div>
      </div>

      {/* Multi-System Anomaly Detection Patterns with Contributing Indicators & Reasoning */}
      <div className="hud-card p-5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>DETECTED MULTI-SYSTEM PHYSIOLOGICAL PATTERNS</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Combinations of simultaneous indicators flagged by the ASTRA inference matrix
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-space-850 px-2.5 py-1 rounded border border-slate-700">
            {aiAnalysis.detectedPatterns.length} Correlated Pattern(s)
          </span>
        </div>

        {aiAnalysis.detectedPatterns.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs font-mono border border-slate-800/80 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-slate-200 font-semibold">No multi-variable pathological patterns detected.</p>
            <p className="text-slate-500 mt-1">Cross-system physiological parameters remain within personal baseline envelopes.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {aiAnalysis.detectedPatterns.map((pat, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border space-y-3 ${
                  pat.severity === 'critical'
                    ? 'bg-rose-950/20 border-rose-500/40'
                    : 'bg-space-850/90 border-amber-500/30'
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`w-4 h-4 shrink-0 ${
                        pat.severity === 'critical' ? 'text-rose-400 animate-pulse' : 'text-amber-400'
                      }`}
                    />
                    <h4 className="text-sm font-bold text-white tracking-wide">{pat.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-space-900 text-cyan-300 border border-slate-700">
                      Confidence: {pat.confidence}%
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        pat.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {pat.severity} Level
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-200">{pat.description}</p>

                {/* Contributing Indicators */}
                <div className="p-3 rounded-lg bg-space-900/80 border border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-mono font-semibold text-cyan-400 uppercase block">
                    Contributing Telemetry Indicators:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {pat.contributingIndicators.map((ind, iIdx) => (
                      <span
                        key={iIdx}
                        className="px-2 py-1 rounded text-[11px] font-mono bg-space-850 text-slate-200 border border-slate-700/80"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Aerospace Physiology Reasoning */}
                <div className="p-3 rounded-lg bg-space-900/80 border border-slate-800 space-y-1 text-xs">
                  <span className="text-[11px] font-mono font-semibold text-amber-400 uppercase flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Physiological Reasoning &amp; Mechanism:
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{pat.reasoning}</p>
                  <span className="text-[10px] font-mono text-slate-500 block pt-1">
                    Scientific Reference: {pat.scientificReference}
                  </span>
                </div>

                {/* Countermeasures */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
                  <span className="text-slate-400">
                    <strong className="text-slate-300">Prescribed Countermeasure: </strong>
                    {pat.recommendedCountermeasure}
                  </span>
                  <span className="text-slate-500 text-[10px]">
                    System: {pat.physiologicalSystem}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Baseline Deviation Analysis Table */}
      <div className="hud-card p-5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">
              PERSONALIZED ASTRONAUT BASELINE DEVIATION AUDIT
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Telemetry variance compared against individual pre-flight baseline ({activeAstronaut.rank} {activeAstronaut.name})
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-850 text-slate-400 border border-slate-700">
            [SIMULATED SENSORS]
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2">Biomarker / Indicator</th>
                <th className="pb-2">Pre-Flight Baseline</th>
                <th className="pb-2">Current Telemetry</th>
                <th className="pb-2">Deviation Delta</th>
                <th className="pb-2">Clinical Stratification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 font-semibold text-rose-400">Resting Heart Rate</td>
                <td className="py-2.5">{baseline.restingHeartRate} BPM</td>
                <td className="py-2.5 font-bold text-white">{currentVitals.heartRate} BPM</td>
                <td className="py-2.5">
                  {currentVitals.heartRate - baseline.restingHeartRate >= 0
                    ? `+${currentVitals.heartRate - baseline.restingHeartRate} bpm`
                    : `${currentVitals.heartRate - baseline.restingHeartRate} bpm`}
                </td>
                <td className="py-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    Math.abs(currentVitals.heartRate - baseline.restingHeartRate) > 20
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {Math.abs(currentVitals.heartRate - baseline.restingHeartRate) > 20 ? 'ELEVATED' : 'NOMINAL'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-cyan-400">Systolic Blood Pressure</td>
                <td className="py-2.5">{baseline.systolicBP} mmHg</td>
                <td className="py-2.5 font-bold text-white">{currentVitals.bloodPressureSystolic} mmHg</td>
                <td className="py-2.5">
                  {currentVitals.bloodPressureSystolic - baseline.systolicBP >= 0
                    ? `+${currentVitals.bloodPressureSystolic - baseline.systolicBP} mmHg`
                    : `${currentVitals.bloodPressureSystolic - baseline.systolicBP} mmHg`}
                </td>
                <td className="py-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    STABLE
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-sky-400">Blood Oxygen SpO2</td>
                <td className="py-2.5">{baseline.spo2}%</td>
                <td className="py-2.5 font-bold text-white">{currentVitals.oxygenSaturation}%</td>
                <td className="py-2.5">
                  {currentVitals.oxygenSaturation - baseline.spo2}%
                </td>
                <td className="py-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    currentVitals.oxygenSaturation < 94
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {currentVitals.oxygenSaturation < 94 ? 'ATTENTION' : 'OPTIMAL'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-amber-400">Core Body Temperature</td>
                <td className="py-2.5">{baseline.temperature} °C</td>
                <td className="py-2.5 font-bold text-white">{currentVitals.temperature} °C</td>
                <td className="py-2.5">
                  {Number((currentVitals.temperature - baseline.temperature).toFixed(1))} °C
                </td>
                <td className="py-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    NOMINAL
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Smart Recommendations List with Acknowledge Button */}
      <div className="hud-card p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI-PRESCRIBED CLINICAL COUNTERMEASURES</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Actionable interventions with transparent aerospace medicine rationales
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-space-850 px-2.5 py-1 rounded border border-slate-700">
            {recommendations.length} Recommendations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map(rec => (
            <div
              key={rec.id}
              className={`p-4 rounded-xl border transition-all ${
                rec.acknowledged
                  ? 'bg-space-900/60 border-slate-800 opacity-70'
                  : 'bg-space-850/80 border-slate-700/80'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
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

              <p className="text-xs text-slate-300 mb-3">{rec.suggestedAction}</p>

              <div className="p-2 rounded bg-space-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div>
                  <strong className="text-slate-300">Clinical Rationale: </strong>
                  {rec.rationale}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {rec.triggerFactors.map((factor, fIdx) => (
                    <span key={fIdx} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  Category: {rec.category}
                </span>
                {rec.acknowledged ? (
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Acknowledged</span>
                  </span>
                ) : (
                  <button
                    onClick={() => acknowledgeRecommendation(rec.id)}
                    className="px-2.5 py-1 rounded text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
                  >
                    Acknowledge Action
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
