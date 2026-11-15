import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Activity,
  Bone,
  Dna,
  Radio,
  Brain,
  Info,
  ChevronDown,
  ChevronUp,
  X,
  Calculator
} from 'lucide-react';
import { useAstronaut } from '../../context/AstronautContext';
import { BIO_WELLNESS_WEIGHTS } from '../../services/aiEngine';

export const OverallReadiness: React.FC = () => {
  const { aiAnalysis, activeAstronaut } = useAstronaut();
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const score = aiAnalysis.overallReadinessScore;

  const getStatus = () => {
    if (score >= 80) {
      return {
        label: 'EVA & FLIGHT OPERATIONS: CLEARED',
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
        icon: ShieldCheck
      };
    } else if (score >= 65) {
      return {
        label: 'HABITAT RESTRICTED / CAUTION',
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
        icon: AlertTriangle
      };
    } else {
      return {
        label: 'MEDICAL HOLD / FLIGHT SURGEON TRIAGE',
        color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
        icon: AlertCircle
      };
    }
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const subScores = [
    {
      name: 'Cardiovascular',
      key: 'cardiovascular' as const,
      score: aiAnalysis.categoryScores.cardiovascular,
      weight: BIO_WELLNESS_WEIGHTS.cardiovascular.weightPct,
      icon: Activity,
      color: 'text-rose-400',
      explanation: 'Evaluates resting heart rate variance from baseline, mean arterial pressure, and autonomic HRV balance.'
    },
    {
      name: 'Musculoskeletal',
      key: 'musculoskeletal' as const,
      score: aiAnalysis.categoryScores.musculoskeletal,
      weight: BIO_WELLNESS_WEIGHTS.musculoskeletal.weightPct,
      icon: Bone,
      color: 'text-cyan-400',
      explanation: 'Monitors DEXA bone mineral density T-scores (femoral/spine), microgravity calcium loss, and ARED load adherence.'
    },
    {
      name: 'Radiation Margin',
      key: 'radiation' as const,
      score: aiAnalysis.categoryScores.radiation,
      weight: BIO_WELLNESS_WEIGHTS.radiation.weightPct,
      icon: Radio,
      color: 'text-purple-400',
      explanation: 'Tracks cumulative dose against NASA 600 mSv career limit and real-time solar particle event (SPE) alerts.'
    },
    {
      name: 'Cognitive & Sleep',
      key: 'cognitive' as const,
      score: aiAnalysis.categoryScores.cognitive,
      weight: BIO_WELLNESS_WEIGHTS.cognitive.weightPct,
      icon: Brain,
      color: 'text-blue-400',
      explanation: 'Integrates sleep duration, REM/Deep cycles, psychomotor vigilance task (PVT) reaction time, and subjective stress.'
    },
    {
      name: 'Immune System',
      key: 'immune' as const,
      score: aiAnalysis.categoryScores.immune,
      weight: BIO_WELLNESS_WEIGHTS.immune.weightPct,
      icon: Dna,
      color: 'text-teal-400',
      explanation: 'Reflects neutrophil-to-lymphocyte ratio (NLR), salivary cortisol levels, and latent herpesvirus (EBV/VZV) suppression.'
    }
  ];

  return (
    <div className="hud-card p-5 rounded-xl border border-slate-800/80">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white tracking-wide">
              MISSION READINESS &amp; BIO-WELLNESS INDEX
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              [SIMULATED TELEMETRY]
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Astronaut: {activeAstronaut.name} ({activeAstronaut.callsign}) • SOL {activeAstronaut.missionDay}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExplanationModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-space-850 hover:bg-space-800 text-cyan-300 border border-cyan-500/30 transition-colors"
            title="Learn how the Bio-Wellness Index is mathematically calculated"
          >
            <Calculator className="w-3.5 h-3.5 text-cyan-400" />
            <span>How it's Calculated</span>
          </button>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border ${status.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{status.label}</span>
          </div>
        </div>
      </div>

      {/* Main Content: Radial Gauge + Subsystem Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Radial Dial */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-3">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="46"
                stroke="currentColor"
                strokeWidth="8"
                className="text-space-850"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="46"
                stroke="currentColor"
                strokeWidth="8"
                className={`${
                  score >= 80 ? 'text-cyan-400' : score >= 65 ? 'text-amber-400' : 'text-rose-400'
                } transition-all duration-1000 ease-out`}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-mono text-white">{score}</span>
              <span className="text-[10px] font-mono text-cyan-400 tracking-wider">/ 100</span>
            </div>
          </div>
          <p className="text-xs font-medium text-slate-300 mt-2 text-center">
            Integrated Bio-Readiness
          </p>
          <span className="text-[10px] text-slate-400 font-mono text-center">
            Weighted across 5 physiological systems
          </span>
        </div>

        {/* Subsystem Health Progress Bars */}
        <div className="md:col-span-7 space-y-3">
          {subScores.map(sub => {
            const Icon = sub.icon;
            return (
              <div key={sub.name} className="space-y-1 group">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Icon className={`w-3.5 h-3.5 ${sub.color}`} />
                    <span className="font-medium">{sub.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">({sub.weight}% weight)</span>
                  </div>
                  <span className="font-mono font-medium text-slate-200">{sub.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-space-850 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      sub.score >= 80
                        ? 'bg-cyan-400'
                        : sub.score >= 65
                        ? 'bg-amber-400'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${sub.score}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-mono hidden group-hover:block transition-all">
                  {sub.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Calculation Explanation Modal */}
      {showExplanationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="hud-card p-6 rounded-2xl max-w-2xl w-full border border-cyan-500/40 shadow-2xl shadow-cyan-500/10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white tracking-wide">
                  BIO-WELLNESS INDEX (BWI) CALCULATION &amp; WEIGHTING
                </h3>
              </div>
              <button
                onClick={() => setShowExplanationModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-space-850 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-semibold text-cyan-300 block uppercase">
                Mathematical Aggregation Formula:
              </span>
              <div className="p-2.5 rounded bg-space-900 border border-slate-700/60 font-mono text-xs text-white text-center">
                BWI = (0.25 × Cardio) + (0.20 × Musculoskeletal) + (0.20 × Radiation) + (0.20 × Cognitive) + (0.15 × Immune)
              </div>
              <p className="text-[11px] text-slate-300">
                The Bio-Wellness Index integrates five distinct physiological pillars into a single normalized score from 0 to 100. Each subsystem score is computed by measuring deviation from the astronaut's pre-flight baseline and NASA Human Research Program (HRP) safety thresholds.
              </p>
            </div>

            {/* Weights Breakdown Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                PHYSIOLOGICAL INDICATOR WEIGHTINGS &amp; CLINICAL SIGNIFICANCE:
              </h4>
              <div className="space-y-2">
                {subScores.map(sub => {
                  const Icon = sub.icon;
                  const cfg = BIO_WELLNESS_WEIGHTS[sub.key];
                  return (
                    <div key={sub.name} className="p-3 rounded-lg bg-space-850/80 border border-slate-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-white flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${sub.color}`} />
                          {sub.name}
                        </span>
                        <span className="text-cyan-400 font-bold">{sub.weight}% Weight (Current: {sub.score}%)</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{cfg.description}</p>
                      <span className="text-[10px] font-mono text-slate-500 block">
                        Scientific Standard: {cfg.scientificBasis}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Operational Thresholds */}
            <div className="p-3 rounded-xl bg-space-850 border border-slate-800 space-y-1.5 text-xs font-mono">
              <span className="font-bold text-slate-300 uppercase block">Flight Clearance Thresholds:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  <strong>Score &ge; 80%:</strong> Nominally cleared for EVA and high-workload operations.
                </div>
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  <strong>Score 65–79%:</strong> Habitat-restricted; mandatory countermeasure enforcement.
                </div>
                <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300">
                  <strong>Score &lt; 65%:</strong> Medical hold; requires immediate flight surgeon intervention.
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowExplanationModal(false)}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 text-space-950 font-bold hover:bg-cyan-400 text-xs font-mono transition-colors"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
