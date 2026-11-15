import React, { useState } from 'react';
import {
  Brain,
  Moon,
  Smile,
  Zap,
  Activity,
  Radio,
  Sparkles,
  MessageSquare,
  Volume2,
  Sun,
  Shield,
  ChevronRight,
  Plus,
  HelpCircle,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';
import { useAstronaut } from '../../context/AstronautContext';
import { MoodCheckInModal } from './MoodCheckInModal';

export const MentalWellnessView: React.FC = () => {
  const { activeAstronaut, mentalCheckIns, settings } = useAstronaut();
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [sleepTrendMode, setSleepTrendMode] = useState<'duration_quality' | 'sleep_stages'>('duration_quality');

  const latest = mentalCheckIns[mentalCheckIns.length - 1] || {
    id: 'chk-def',
    date: 'SOL 142',
    missionDay: 142,
    moodRating: 7,
    stressRating: 4,
    sleepHours: 6.8,
    sleepQualityRating: 80,
    remSleepPct: 20,
    deepSleepPct: 18,
    lightSleepPct: 62,
    pvtReactionTimeMs: 255,
    isolationIndex: 4,
    notes: 'Nominal operational status.',
    earthCommDelayMinutes: 4.4
  };

  // Format chart data
  const chartData = mentalCheckIns.map(chk => ({
    date: chk.date,
    mood: chk.moodRating,
    stress: chk.stressRating,
    sleepHours: chk.sleepHours,
    sleepQuality: chk.sleepQualityRating,
    rem: chk.remSleepPct,
    deep: chk.deepSleepPct,
    light: chk.lightSleepPct,
    pvt: chk.pvtReactionTimeMs,
    isolation: chk.isolationIndex
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span>BEHAVIORAL HEALTH &amp; PSYCHOLOGICAL WELLNESS</span>
            </h2>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              [SIMULATED DATA]
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Circadian synchronization, sleep architecture, neuro-cognitive vigilance, and psychosocial support
          </p>
        </div>

        <button
          onClick={() => setShowCheckInModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium hover:from-purple-400 hover:to-indigo-500 shadow-md shadow-purple-500/20 text-xs font-mono transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Daily Wellness Check-In</span>
        </button>
      </div>

      {/* Primary KPI Cards with Metric Explanations */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Mood */}
        <div className="hud-card p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Mood Rating</span>
            <Smile className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono text-white">{latest.moodRating}</span>
            <span className="text-xs font-mono text-slate-400">/ 10</span>
          </div>
          <p className="text-[11px] text-emerald-400 font-mono">
            {latest.moodRating >= 7 ? 'Optimal Morale' : 'Elevated Strain'}
          </p>
          <p className="text-[10px] text-slate-500">Subjective emotional valence</p>
        </div>

        {/* Stress */}
        <div className="hud-card p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Stress Index</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono text-amber-400">{latest.stressRating}</span>
            <span className="text-xs font-mono text-slate-400">/ 10</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Target: 1–4 Nominal
          </p>
          <p className="text-[10px] text-slate-500">Perceived cognitive &amp; workload load</p>
        </div>

        {/* Sleep Duration & Quality */}
        <div className="hud-card p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Sleep Architecture</span>
            <Moon className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono text-white">{latest.sleepHours}</span>
            <span className="text-xs font-mono text-blue-400">hrs</span>
          </div>
          <p className="text-[11px] text-cyan-300 font-mono">
            Quality: {latest.sleepQualityRating}% efficiency
          </p>
          <p className="text-[10px] text-slate-500">Target &ge; 7.0 hours/night</p>
        </div>

        {/* PVT Reaction Time */}
        <div className="hud-card p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">PVT Vigilance</span>
            <Activity className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono text-white">{latest.pvtReactionTimeMs}</span>
            <span className="text-xs font-mono text-rose-400">ms</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Norm: ~240 ms (Fatigue &gt;300ms)
          </p>
          <p className="text-[10px] text-slate-500">Psychomotor Vigilance Task</p>
        </div>

        {/* Isolation / Earth Delay */}
        <div className="hud-card p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Earth Delay</span>
            <Radio className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono text-purple-300">
              {settings.earthCommDelayMinutes}
            </span>
            <span className="text-xs font-mono text-purple-400">min</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Isolation: {latest.isolationIndex}/10
          </p>
          <p className="text-[10px] text-slate-500">Light-time signal latency</p>
        </div>
      </div>

      {/* Main Charts: Mood & Stress Trends + Sleep Duration & Quality Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood & Stress Trajectory */}
        <div className="hud-card p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                MOOD &amp; SUBJECTIVE STRESS TRENDS [SIMULATED]
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Longitudinal trajectory across recent mission sols (1-10 Standard Psychometric Scale)
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400">Scale: 1–10</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={10} domain={[1, 10]} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c1326',
                    borderColor: '#a855f7',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Line type="monotone" dataKey="mood" name="Mood (Higher = Optimal Morale)" stroke="#06b6d4" strokeWidth={2.5} />
                <Line type="monotone" dataKey="stress" name="Stress (Lower = Calmer / Rested)" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep Duration & Quality / Architecture */}
        <div className="hud-card p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                SLEEP DURATION &amp; QUALITY ARCHITECTURE [SIMULATED]
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Correlating total rest hours against restorative sleep efficiency
              </p>
            </div>
            <div className="flex items-center gap-1 bg-space-850 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setSleepTrendMode('duration_quality')}
                className={`px-2 py-0.5 rounded ${
                  sleepTrendMode === 'duration_quality' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-slate-400'
                }`}
              >
                Duration &amp; Quality
              </button>
              <button
                onClick={() => setSleepTrendMode('sleep_stages')}
                className={`px-2 py-0.5 rounded ${
                  sleepTrendMode === 'sleep_stages' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400'
                }`}
              >
                Sleep Stages
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {sleepTrendMode === 'duration_quality' ? (
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                  <YAxis yAxisId="left" stroke="#3b82f6" fontSize={10} domain={[0, 10]} fontFamily="monospace" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={10} domain={[40, 100]} fontFamily="monospace" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c1326',
                      borderColor: '#3b82f6',
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Bar yAxisId="left" dataKey="sleepHours" name="Sleep Duration (Hours)" fill="#3b82f6" />
                  <Line yAxisId="right" type="monotone" dataKey="sleepQuality" name="Sleep Quality (%)" stroke="#10b981" strokeWidth={2} />
                </ComposedChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                  <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} fontFamily="monospace" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c1326',
                      borderColor: '#8b5cf6',
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Bar dataKey="rem" name="REM Sleep (%)" fill="#8b5cf6" stackId="a" />
                  <Bar dataKey="deep" name="Deep Slow-Wave (%)" fill="#06b6d4" stackId="a" />
                  <Bar dataKey="light" name="Light Sleep (%)" fill="#334155" stackId="a" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Psychomotor Vigilance Task (PVT) Latency Trend */}
      <div className="hud-card p-5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">
              PSYCHOMOTOR VIGILANCE TASK (PVT) FATIGUE TRAJECTORY [SIMULATED]
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              NASA standard operational reaction-time vigilance benchmark (&gt;300ms indicates cognitive fatigue and reduced alertness)
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-space-850 text-cyan-400 border border-slate-700">
            Target: &lt; 260 ms
          </span>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="pvtGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} fontFamily="monospace" />
              <YAxis stroke="#64748b" fontSize={10} domain={[200, 350]} fontFamily="monospace" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c1326',
                  borderColor: '#ec4899',
                  fontSize: '11px',
                  fontFamily: 'monospace'
                }}
              />
              <Area type="monotone" dataKey="pvt" name="Reaction Latency (ms)" stroke="#ec4899" fill="url(#pvtGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Supportive, Non-Judgmental Wellness Suggestions */}
      <div className="hud-card p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            PERSONALIZED SUPPORTIVE WELLNESS PROTOCOLS
          </h3>
        </div>
        <p className="text-xs text-slate-300">
          The space environment imposes unique acoustic, circadian, and social isolation pressures. ASTRA provides non-judgmental, restorative interventions designed to preserve cognitive stamina and emotional equilibrium without clinical stigmatization.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Module 1: Circadian Lighting */}
          <div className="p-4 rounded-xl bg-space-850/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <Sun className="w-4 h-4" />
              <h4 className="text-xs font-bold font-mono uppercase">Dynamic Circadian Illumination</h4>
            </div>
            <p className="text-xs text-slate-300">
              Deploy 480nm enriched blue light during shift wake hours, shifting to 650nm amber/red spectrum 90 minutes before rest to naturally elevate endogenous melatonin.
            </p>
            <span className="text-[10px] font-mono text-cyan-400 block pt-1">
              Active in Crew Quarters Alpha
            </span>
          </div>

          {/* Module 2: Audio Relaxation & Guided Mindfulness */}
          <div className="p-4 rounded-xl bg-space-850/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400">
              <Volume2 className="w-4 h-4" />
              <h4 className="text-xs font-bold font-mono uppercase">Binaural Acoustic Relaxation</h4>
            </div>
            <p className="text-xs text-slate-300">
              Access onboard 15-minute Earth nature soundscapes and guided progressive muscle relaxation to counteract persistent environmental ventilation hiss.
            </p>
            <span className="text-[10px] font-mono text-purple-400 block pt-1">
              Track: "Rainforest Canopy &amp; Theta Waves"
            </span>
          </div>

          {/* Module 3: Earth Family Uplink */}
          <div className="p-4 rounded-xl bg-space-850/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-400">
              <MessageSquare className="w-4 h-4" />
              <h4 className="text-xs font-bold font-mono uppercase">Asynchronous Family Message Uplink</h4>
            </div>
            <p className="text-xs text-slate-300">
              High-priority audio/video message queue with Earth ground station. Current transmission light-time lag is {settings.earthCommDelayMinutes} minutes.
            </p>
            <span className="text-[10px] font-mono text-blue-400 block pt-1">
              Next scheduled uplink window: 20:30 UTC
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <MoodCheckInModal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
      />
    </div>
  );
};
