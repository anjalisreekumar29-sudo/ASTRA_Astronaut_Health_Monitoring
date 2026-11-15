import React, { useState } from 'react';
import {
  Heart,
  Bone,
  Dna,
  Radio,
  Activity,
  Dumbbell,
  ShieldAlert,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Info,
  Plus,
  BookOpen,
  Shield,
  HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { useAstronaut } from '../../context/AstronautContext';

export const PhysicalHealthView: React.FC = () => {
  const {
    activeAstronaut,
    currentVitals,
    vitalsHistory,
    boneRecords,
    exerciseSessions,
    immuneRecords,
    radiationData,
    settings,
    updateSettings,
    addExerciseSession
  } = useAstronaut();

  const [physicalTab, setPhysicalTab] = useState<'cardio' | 'bone' | 'immune' | 'radiation'>('cardio');
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [newExType, setNewExType] = useState<'ARED_RESISTIVE' | 'CEVIS_CYCLE' | 'T2_TREADMILL'>('ARED_RESISTIVE');
  const [newExDuration, setNewExDuration] = useState('45');
  const [newExLoad, setNewExLoad] = useState('145');
  const [newExGroup, setNewExGroup] = useState<'spine' | 'femur' | 'hip' | 'full_body'>('spine');

  const baseline = activeAstronaut.baselineVitals;

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    addExerciseSession({
      date: `SOL ${activeAstronaut.missionDay} (Logged)`,
      type: newExType,
      durationMinutes: Number(newExDuration),
      intensityKcal: Number(newExDuration) * 8,
      resistanceLoadKg: newExType === 'ARED_RESISTIVE' ? Number(newExLoad) : undefined,
      targetBoneGroup: newExGroup,
      completed: true
    });
    setShowExerciseModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Sub-Navigation */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>PHYSICAL HEALTH MONITORING &amp; COUNTERMEASURES</span>
            </h2>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              [SIMULATED DATA]
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Aerospace medicine subsystem analysis for deep space long-duration mission
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-space-850 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setPhysicalTab('cardio')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              physicalTab === 'cardio'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Cardiovascular</span>
          </button>
          <button
            onClick={() => setPhysicalTab('bone')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              physicalTab === 'bone'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Bone Health</span>
          </button>
          <button
            onClick={() => setPhysicalTab('immune')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              physicalTab === 'immune'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dna className="w-3.5 h-3.5 text-teal-400" />
            <span>Immune Health</span>
          </button>
          <button
            onClick={() => setPhysicalTab('radiation')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              physicalTab === 'radiation'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-purple-400" />
            <span>Radiation</span>
          </button>
        </div>
      </div>

      {/* SUB-SECTION 1: CARDIOVASCULAR HEALTH */}
      {physicalTab === 'cardio' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="hud-card p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">Resting Heart Rate</span>
                <span className="text-[10px] font-mono text-cyan-400">[SIMULATED]</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-white">{currentVitals.heartRate}</span>
                <span className="text-xs font-mono text-rose-400">BPM</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Baseline: {baseline.restingHeartRate} bpm • Delta: {currentVitals.heartRate - baseline.restingHeartRate >= 0 ? `+${currentVitals.heartRate - baseline.restingHeartRate}` : currentVitals.heartRate - baseline.restingHeartRate} bpm
              </p>
            </div>

            <div className="hud-card p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">Mean Arterial Pressure</span>
                <span className="text-[10px] font-mono text-cyan-400">[SIMULATED]</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-white">
                  {Math.round((currentVitals.bloodPressureSystolic + 2 * currentVitals.bloodPressureDiastolic) / 3)}
                </span>
                <span className="text-xs font-mono text-cyan-400">mmHg</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Current: {currentVitals.bloodPressureSystolic}/{currentVitals.bloodPressureDiastolic} mmHg (Nominal &lt; 120/80)
              </p>
            </div>

            <div className="hud-card p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">Autonomic Tone (HRV)</span>
                <span className="text-[10px] font-mono text-cyan-400">[SIMULATED]</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-white">
                  {currentVitals.heartRateVariability || baseline.baselineHRV}
                </span>
                <span className="text-xs font-mono text-purple-400">ms RMSSD</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Autonomic balance nominal. Baroreflex response stable.
              </p>
            </div>
          </div>

          {/* Simulated ECG Rhythm Waveform */}
          <div className="hud-card p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>CONTINUOUS LEAD II ELECTROCARDIOGRAM (ECG) [SIMULATED WAVEFORM]</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                SINUS RHYTHM: REGULAR
              </span>
            </div>
            <div className="h-16 w-full bg-space-900 rounded-lg p-2 flex items-center border border-slate-800/80 overflow-hidden relative">
              <svg className="w-full h-full text-emerald-400 stroke-current fill-none" viewBox="0 0 800 60" preserveAspectRatio="none">
                <path
                  d="M0,30 L60,30 L70,30 L80,25 L90,32 L100,5 L110,50 L120,30 L135,30 L150,20 L165,30 L260,30 L270,30 L280,25 L290,32 L300,5 L310,50 L320,30 L335,30 L350,20 L365,30 L460,30 L470,30 L480,25 L490,32 L500,5 L510,50 L520,30 L535,30 L550,20 L565,30 L660,30 L670,30 L680,25 L690,32 L700,5 L710,50 L720,30 L735,30 L750,20 L765,30 L800,30"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Blood Pressure & Heart Rate Trends */}
          <div className="hud-card p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white tracking-wide">
                24-HOUR CARDIOVASCULAR TELEMETRY TRENDS [SIMULATED]
              </h3>
              <span className="text-xs font-mono text-cyan-400">Lead II + Continuous Pressure Cuff</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitalsHistory} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                  <YAxis stroke="#64748b" fontSize={10} domain={[40, 160]} fontFamily="monospace" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c1326',
                      borderColor: '#06b6d4',
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Line type="monotone" dataKey="heartRate" name="Heart Rate (BPM)" stroke="#f43f5e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="bloodPressureSystolic" name="Systolic BP (mmHg)" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="bloodPressureDiastolic" name="Diastolic BP (mmHg)" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: BONE HEALTH */}
      {physicalTab === 'bone' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="hud-card p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">Femoral Neck T-Score</span>
                <span className="text-[10px] font-mono text-cyan-400">[SIMULATED]</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-amber-400">
                  {boneRecords[boneRecords.length - 1]?.femoralNeckTScore || -0.85}
                </span>
                <span className="text-xs font-mono text-slate-400">DEXA</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Classification: Normal (&gt; -1.0). Risk: Early microgravity osteopenia risk.
              </p>
            </div>

            <div className="hud-card p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">Lumbar Spine T-Score</span>
                <span className="text-[10px] font-mono text-cyan-400">[SIMULATED]</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-cyan-400">
                  {boneRecords[boneRecords.length - 1]?.lumbarSpineTScore || -0.5}
                </span>
                <span className="text-xs font-mono text-slate-400">DEXA</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Axial loading sustained via ARED deadlifts &amp; squats.
              </p>
            </div>

            <div className="hud-card p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">Monthly Bone Loss Rate</span>
                <span className="text-[10px] font-mono text-cyan-400">[SIMULATED]</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-white">
                  {boneRecords[boneRecords.length - 1]?.monthlyLossRatePct || 1.15}%
                </span>
                <span className="text-xs font-mono text-amber-400">/ month</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                NASA typical unmitigated loss is ~1.5%/mo. Mitigation effectiveness: High.
              </p>
            </div>
          </div>

          {/* DEXA Bone Density History Chart */}
          <div className="hud-card p-5 rounded-xl border border-slate-800">
            <h3 className="text-sm font-semibold text-white tracking-wide mb-4">
              LONGITUDINAL DEXA BONE DENSITY T-SCORES [SIMULATED MEASUREMENTS]
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={boneRecords} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                  <YAxis stroke="#64748b" fontSize={10} domain={[-2.0, 1.0]} fontFamily="monospace" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c1326',
                      borderColor: '#06b6d4',
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Line type="monotone" dataKey="femoralNeckTScore" name="Femoral Neck T-Score" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="lumbarSpineTScore" name="Lumbar Spine T-Score" stroke="#06b6d4" strokeWidth={2} />
                  <Line type="monotone" dataKey="totalHipTScore" name="Total Hip T-Score" stroke="#8b5cf6" strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scientific Countermeasure Guidelines */}
          <div className="p-4 rounded-xl bg-space-850/80 border border-cyan-500/30 flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <strong className="text-cyan-300 font-semibold block">
                NASA HRP MUSCULOSKELETAL COUNTERMEASURE PROTOCOL:
              </strong>
              <p>
                In microgravity, bone mineral loss occurs at 1.0–1.5% per month primarily in weight-bearing bones (lumbar spine, femur, calcaneus). Countermeasures require 2.5 hours/day combined resistive loading on ARED and aerobic exercise. All nutritional or therapeutic adjustments require Ground Flight Surgeon authorization.
              </p>
            </div>
          </div>

          {/* Exercise Countermeasures Table + Log Modal */}
          <div className="hud-card p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-cyan-400" />
                  <span>ARED &amp; AEROBIC COUNTERMEASURE LOGS</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Prescribed 2.5 hours/day mechanical loading to preserve musculoskeletal density
                </p>
              </div>
              <button
                onClick={() => setShowExerciseModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Exercise</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2">Date / MET</th>
                    <th className="pb-2">Modality</th>
                    <th className="pb-2">Duration</th>
                    <th className="pb-2">Intensity</th>
                    <th className="pb-2">Axial Load</th>
                    <th className="pb-2">Target</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {exerciseSessions.map(ex => (
                    <tr key={ex.id} className="hover:bg-space-850/60">
                      <td className="py-2.5">{ex.date}</td>
                      <td className="py-2.5 font-semibold text-cyan-400">{ex.type.replace('_', ' ')}</td>
                      <td className="py-2.5">{ex.durationMinutes} mins</td>
                      <td className="py-2.5">{ex.intensityKcal} kcal</td>
                      <td className="py-2.5">{ex.resistanceLoadKg ? `${ex.resistanceLoadKg} kg` : 'N/A'}</td>
                      <td className="py-2.5 uppercase text-slate-400">{ex.targetBoneGroup}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          COMPLETED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 3: IMMUNE HEALTH */}
      {physicalTab === 'immune' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="hud-card p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">White Blood Cells (WBC)</span>
                <span className="text-[10px] font-mono text-cyan-400">[SIMULATED]</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-white">
                  {immuneRecords[immuneRecords.length - 1]?.whiteBloodCellCount || 4.9}
                </span>
                <span className="text-xs font-mono text-teal-400">k/uL</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Normal range: 4.5 – 11.0 k/uL
              </p>
            </div>

            <div className="hud-card p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">Neutrophil/Lymphocyte (NLR)</span>
                <span className="text-[10px] font-mono text-cyan-400">[SIMULATED]</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-amber-400">
                  {immuneRecords[immuneRecords.length - 1]?.neutrophilLymphocyteRatio || 3.3}
                </span>
                <span className="text-xs font-mono text-slate-400">ratio</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Systemic inflammation biomarker (norm &lt; 3.0)
              </p>
            </div>

            <div className="hud-card p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">Salivary Cortisol</span>
                <span className="text-[10px] font-mono text-cyan-400">[SIMULATED]</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-amber-400">
                  {immuneRecords[immuneRecords.length - 1]?.salivaryCortisol || 0.68}
                </span>
                <span className="text-xs font-mono text-slate-400">ug/dL</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Physiological chronic stress hormone
              </p>
            </div>

            <div className="hud-card p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">Latent Viral Titers (EBV)</span>
                <span className="text-[10px] font-mono text-cyan-400">[SIMULATED]</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-bold font-mono text-amber-400 uppercase">
                  {immuneRecords[immuneRecords.length - 1]?.latentViralTiterEBV || 'Elevated'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Subclinical viral reactivation under stress
              </p>
            </div>
          </div>

          {/* Immune Biomarkers History Chart */}
          <div className="hud-card p-5 rounded-xl border border-slate-800">
            <h3 className="text-sm font-semibold text-white tracking-wide mb-4">
              LONGITUDINAL IMMUNOLOGICAL DYNAMICS ACROSS FLIGHT SOLS [SIMULATED BIOMARKERS]
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={immuneRecords} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                  <YAxis stroke="#64748b" fontSize={10} fontFamily="monospace" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c1326',
                      borderColor: '#14b8a6',
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Line type="monotone" dataKey="overallImmuneIndex" name="Overall Immune Index (0-100)" stroke="#14b8a6" strokeWidth={2} />
                  <Line type="monotone" dataKey="neutrophilLymphocyteRatio" name="NLR Stress Ratio" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="cytokineIL6" name="Cytokine IL-6 (pg/mL)" stroke="#f43f5e" strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 4: RADIATION EXPOSURE (IDENTIFYING SCIENTIFIC SOURCE & PERMISSIBLE LIMITS) */}
      {physicalTab === 'radiation' && (
        <div className="space-y-6">
          {/* Scientific Regulatory Source Card */}
          <div className="p-4 rounded-xl bg-space-850/90 border border-purple-500/30 flex items-start gap-3">
            <Shield className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <strong className="text-purple-300 font-semibold">
                  SCIENTIFIC RADIATION STANDARDS BASIS:
                </strong>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700/50">
                  {radiationData.standardReference}
                </span>
              </div>
              <p>
                Space radiation limits are governed by <strong>NASA-STD-3001 Vol 1 Rev B</strong> and <strong>NCRP Report No. 186</strong>. The career permissible exposure ceiling is set to <strong>600 mSv</strong> to limit the Risk of Exposure-Induced Death (REID) from fatal cancer to less than 3% at the 95% confidence interval. Short-term deterministic limits apply: <strong>250 mSv per 30 days</strong> and <strong>500 mSv annually</strong> to prevent acute radiation syndrome and lens opacification.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="hud-card p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">Daily Dosimeter Rate</span>
                <span className="text-[10px] font-mono text-cyan-400">[SIMULATED]</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-cyan-400">
                  {radiationData.dailyDoseMicroSv}
                </span>
                <span className="text-xs font-mono text-slate-400">uSv/day</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Galactic Cosmic Rays (GCR) nominal: 300–700 uSv/day
              </p>
            </div>

            <div className="hud-card p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">Cumulative Mission Dose</span>
                <span className="text-[10px] font-mono text-cyan-400">[SIMULATED]</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-white">
                  {radiationData.cumulativeMissionDoseMSv.toFixed(1)}
                </span>
                <span className="text-xs font-mono text-cyan-400">mSv</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                30-Day Limit: 250 mSv • Status: SAFE
              </p>
            </div>

            <div className="hud-card p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">Career Radiation Total</span>
                <span className="text-[10px] font-mono text-cyan-400">[SIMULATED]</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-purple-400">
                  {radiationData.careerDoseMSv.toFixed(1)}
                </span>
                <span className="text-xs font-mono text-slate-400">/ 600 mSv</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Career Ceiling Utilized: {((radiationData.careerDoseMSv / radiationData.careerLimitMSv) * 100).toFixed(1)}%
              </p>
            </div>

            <div className="hud-card p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">Solar Particle Status</span>
                <span className="text-[10px] font-mono text-cyan-400">[SIMULATED]</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`text-sm font-bold font-mono uppercase ${
                    radiationData.solarParticleActivity === 'solar_particle_event_alert'
                      ? 'text-rose-400 animate-pulse'
                      : 'text-emerald-400'
                  }`}
                >
                  {radiationData.solarParticleActivity.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Shielding: {radiationData.habitatShieldingEffectivenessPct}% water-wall attenuation
              </p>
            </div>
          </div>

          {/* Radiation Exposure History Chart */}
          <div className="hud-card p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white tracking-wide">
                DAILY DOSIMETRY TELEMETRY HISTORY [SIMULATED DOSIMETER]
              </h3>
              <span className="text-xs font-mono text-purple-400">Gateway Passive &amp; Active Sensors</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={radiationData.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                  <YAxis stroke="#64748b" fontSize={10} fontFamily="monospace" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c1326',
                      borderColor: '#a855f7',
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Bar dataKey="dailyMSv" name="Daily Dose (mSv)" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radiation Warning Threshold Configurator */}
          <div className="hud-card p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase">
                CONFIGURABLE FLIGHT RADIATION THRESHOLD
              </h4>
              <p className="text-xs text-slate-400">
                Trigger storm shelter retreat alarm if 24h flux exceeds threshold (NASA nominal deep-space benchmark is 1.0 mSv/24h)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={settings.radiationWarningThresholdMSv}
                onChange={e => updateSettings({ radiationWarningThresholdMSv: Number(e.target.value) })}
                className="w-48 accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono text-cyan-400 text-sm font-bold min-w-16">
                {settings.radiationWarningThresholdMSv} mSv
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Log New Exercise Session */}
      {showExerciseModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="hud-card p-6 rounded-2xl max-w-md w-full border border-cyan-500/40">
            <h3 className="text-base font-bold text-white mb-2">Log Astronaut Physical Countermeasure</h3>
            <p className="text-xs text-slate-400 font-mono mb-4">Record ARED or aerobic training session [Simulated Log]</p>

            <form onSubmit={handleAddExercise} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-300 mb-1">Exercise Equipment</label>
                <select
                  value={newExType}
                  onChange={e => setNewExType(e.target.value as any)}
                  className="w-full bg-space-850 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="ARED_RESISTIVE">ARED (Advanced Resistive Exercise Device)</option>
                  <option value="CEVIS_CYCLE">CEVIS (Cycle Ergometer with Vibration Isolation)</option>
                  <option value="T2_TREADMILL">T2 (Treadmill with Bungee Harness)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  value={newExDuration}
                  onChange={e => setNewExDuration(e.target.value)}
                  className="w-full bg-space-850 border border-slate-700 rounded-lg p-2 text-white"
                  min="10"
                  max="120"
                />
              </div>

              {newExType === 'ARED_RESISTIVE' && (
                <div>
                  <label className="block text-slate-300 mb-1">Axial Resistance Load (kg)</label>
                  <input
                    type="number"
                    value={newExLoad}
                    onChange={e => setNewExLoad(e.target.value)}
                    className="w-full bg-space-850 border border-slate-700 rounded-lg p-2 text-white"
                    min="50"
                    max="270"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 mb-1">Target Bone / Muscular Group</label>
                <select
                  value={newExGroup}
                  onChange={e => setNewExGroup(e.target.value as any)}
                  className="w-full bg-space-850 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="spine">Lumbar Spine Axial Loading</option>
                  <option value="femur">Femoral Neck &amp; Legs</option>
                  <option value="hip">Hip &amp; Pelvis</option>
                  <option value="full_body">Full Body Systemic</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowExerciseModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 text-space-950 font-bold hover:bg-cyan-400 transition-colors"
                >
                  Commit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
