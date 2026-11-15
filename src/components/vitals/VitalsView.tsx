import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Wind,
  Thermometer,
  ShieldAlert,
  PlusCircle,
  Clock,
  TrendingUp,
  Download,
  AlertTriangle,
  Info,
  Calendar,
  Layers
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
  AreaChart,
  Area
} from 'recharts';
import { useAstronaut } from '../../context/AstronautContext';
import { VitalCard } from '../dashboard/VitalCard';
import { ManualEntryModal } from './ManualEntryModal';

export const VitalsView: React.FC = () => {
  const { currentVitals, vitalsHistory, activeAstronaut, settings } = useAstronaut();
  const [showManualModal, setShowManualModal] = useState(false);
  const [selectedChartMode, setSelectedChartMode] = useState<'all' | 'cardio' | 'respiratory' | 'thermo'>('all');
  const baseline = activeAstronaut.baselineVitals;

  // Multi-sol historical vital simulation data points
  const multiSolHistory = [
    { label: 'SOL 136', hr: 61, sys: 115, dia: 75, spo2: 98, temp: 36.6, resp: 14, hrv: 70 },
    { label: 'SOL 137', hr: 63, sys: 118, dia: 76, spo2: 98, temp: 36.7, resp: 14, hrv: 67 },
    { label: 'SOL 138', hr: 60, sys: 114, dia: 74, spo2: 99, temp: 36.5, resp: 13, hrv: 72 },
    { label: 'SOL 139', hr: 66, sys: 122, dia: 79, spo2: 97, temp: 36.8, resp: 15, hrv: 64 },
    { label: 'SOL 140', hr: 68, sys: 124, dia: 80, spo2: 97, temp: 36.9, resp: 15, hrv: 61 },
    { label: 'SOL 141', hr: 71, sys: 126, dia: 82, spo2: 96, temp: 37.1, resp: 16, hrv: 58 },
    { label: 'SOL 142 (Now)', hr: currentVitals.heartRate, sys: currentVitals.bloodPressureSystolic, dia: currentVitals.bloodPressureDiastolic, spo2: currentVitals.oxygenSaturation, temp: currentVitals.temperature, resp: currentVitals.respiratoryRate, hrv: currentVitals.heartRateVariability || 65 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>CONTINUOUS PHYSIOLOGICAL TELEMETRY SUITE</span>
            </h2>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              [SIMULATED SENSORS]
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            High-frequency biosensors stream from crew smart flight suit &amp; bio-harness
          </p>
        </div>

        <button
          onClick={() => setShowManualModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 text-xs font-mono transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Manual Telemetry Entry / Test</span>
        </button>
      </div>

      {/* Vital Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <VitalCard
          type="heart_rate"
          title="HEART RATE"
          value={currentVitals.heartRate}
          unit="BPM"
          baseline={`${baseline.restingHeartRate}`}
          status={currentVitals.heartRate > 120 ? 'critical' : currentVitals.heartRate > 100 ? 'warning' : 'normal'}
          trend={currentVitals.heartRate > baseline.restingHeartRate ? 'up' : 'stable'}
        />
        <VitalCard
          type="blood_pressure"
          title="BLOOD PRESSURE"
          value={`${currentVitals.bloodPressureSystolic}/${currentVitals.bloodPressureDiastolic}`}
          unit="mmHg"
          baseline={`${baseline.systolicBP}/${baseline.diastolicBP}`}
          status={currentVitals.bloodPressureSystolic > 140 ? 'warning' : 'normal'}
          trend="stable"
        />
        <VitalCard
          type="oxygen"
          title="BLOOD OXYGEN"
          value={currentVitals.oxygenSaturation}
          unit="%"
          baseline={`${baseline.spo2}%`}
          status={currentVitals.oxygenSaturation < 90 ? 'critical' : currentVitals.oxygenSaturation < 94 ? 'warning' : 'normal'}
          trend={currentVitals.oxygenSaturation < baseline.spo2 ? 'down' : 'stable'}
        />
        <VitalCard
          type="temperature"
          title="BODY TEMP"
          value={currentVitals.temperature}
          unit="°C"
          baseline={`${baseline.temperature}`}
          status={currentVitals.temperature > 37.8 ? 'warning' : 'normal'}
          trend="stable"
        />
        <VitalCard
          type="respiratory"
          title="RESPIRATORY"
          value={currentVitals.respiratoryRate}
          unit="/min"
          baseline={`${baseline.respiratoryRate}`}
          status={currentVitals.respiratoryRate > 22 ? 'warning' : 'normal'}
          trend="stable"
        />
        <VitalCard
          type="hrv"
          title="AUTONOMIC HRV"
          value={currentVitals.heartRateVariability || baseline.baselineHRV}
          unit="ms"
          baseline={`${baseline.baselineHRV}`}
          status="normal"
          trend="stable"
        />
      </div>

      {/* Synchronized Telemetry Buffer Chart with Category Filters */}
      <div className="hud-card p-5 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">
              SYNCHRONIZED TELEMETRY STREAM HISTORY [SIMULATED BUFFER]
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Live continuous telemetry stream (Sampling interval: {settings.simulationIntervalMs / 1000}s)
            </p>
          </div>
          <div className="flex items-center gap-1 bg-space-850 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setSelectedChartMode('all')}
              className={`px-2.5 py-1 rounded ${selectedChartMode === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'}`}
            >
              All Vitals
            </button>
            <button
              onClick={() => setSelectedChartMode('cardio')}
              className={`px-2.5 py-1 rounded ${selectedChartMode === 'cardio' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400'}`}
            >
              Cardiovascular
            </button>
            <button
              onClick={() => setSelectedChartMode('respiratory')}
              className={`px-2.5 py-1 rounded ${selectedChartMode === 'respiratory' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400'}`}
            >
              SpO2 &amp; Resp
            </button>
            <button
              onClick={() => setSelectedChartMode('thermo')}
              className={`px-2.5 py-1 rounded ${selectedChartMode === 'thermo' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400'}`}
            >
              Temp &amp; HRV
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={vitalsHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} fontFamily="monospace" />
              <YAxis stroke="#64748b" fontSize={10} domain={[30, 160]} fontFamily="monospace" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c1326',
                  borderColor: '#06b6d4',
                  fontSize: '11px',
                  fontFamily: 'monospace'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />

              {(selectedChartMode === 'all' || selectedChartMode === 'cardio') && (
                <>
                  <Line type="monotone" dataKey="heartRate" name="Heart Rate (BPM)" stroke="#f43f5e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="bloodPressureSystolic" name="Systolic BP (mmHg)" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="bloodPressureDiastolic" name="Diastolic BP (mmHg)" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                </>
              )}

              {(selectedChartMode === 'all' || selectedChartMode === 'respiratory') && (
                <>
                  <Line type="monotone" dataKey="oxygenSaturation" name="SpO2 (%)" stroke="#38bdf8" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="respiratoryRate" name="Resp Rate (/min)" stroke="#14b8a6" strokeWidth={1.5} dot={false} />
                </>
              )}

              {(selectedChartMode === 'all' || selectedChartMode === 'thermo') && (
                <>
                  <Line type="monotone" dataKey="temperature" name="Body Temp (°C)" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="heartRateVariability" name="HRV (ms)" stroke="#8b5cf6" strokeWidth={1.5} dot={false} />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Multi-Sol Vital Trends Graph */}
      <div className="hud-card p-5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>LONGITUDINAL MULTI-SOL HISTORICAL VITALS TRAJECTORY</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              7-Sol rolling baseline comparison for mission flight medicine trending
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-space-850 px-2 py-0.5 rounded border border-slate-700">
            SOL 136 – 142
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={multiSolHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="label" stroke="#64748b" fontSize={10} fontFamily="monospace" />
              <YAxis stroke="#64748b" fontSize={10} domain={[30, 150]} fontFamily="monospace" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c1326',
                  borderColor: '#38bdf8',
                  fontSize: '11px',
                  fontFamily: 'monospace'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Line type="monotone" dataKey="hr" name="Mean Heart Rate (BPM)" stroke="#f43f5e" strokeWidth={2} />
              <Line type="monotone" dataKey="sys" name="Mean Systolic (mmHg)" stroke="#06b6d4" strokeWidth={2} />
              <Line type="monotone" dataKey="spo2" name="Mean SpO2 (%)" stroke="#38bdf8" strokeWidth={2} />
              <Line type="monotone" dataKey="hrv" name="Mean HRV (ms)" stroke="#a855f7" strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NASA Clinical Standards Thresholds Reference Table */}
      <div className="hud-card p-5 rounded-xl border border-slate-800">
        <h3 className="text-sm font-semibold text-white tracking-wide mb-3">
          NASA HUMAN SYSTEM INTEGRATION STANDARDS (NASA-STD-3001) VITAL THRESHOLDS
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2">Physiological Vital</th>
                <th className="pb-2">Nominal Flight Range</th>
                <th className="pb-2">Warning Level</th>
                <th className="pb-2">Critical Triage</th>
                <th className="pb-2">Space Flight Considerations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 font-semibold text-rose-400">Heart Rate (Resting)</td>
                <td className="py-2.5">50 – 90 BPM</td>
                <td className="py-2.5 text-amber-400">&gt; 100 or &lt; 48 BPM</td>
                <td className="py-2.5 text-rose-400">&gt; 125 or &lt; 42 BPM</td>
                <td className="py-2.5 text-slate-400">Fluid redistribution shifts cardiac volume cephalad.</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-cyan-400">Blood Pressure (Resting)</td>
                <td className="py-2.5">95-125 / 60-80 mmHg</td>
                <td className="py-2.5 text-amber-400">&gt; 135 / 85 mmHg</td>
                <td className="py-2.5 text-rose-400">&gt; 150 / 95 mmHg</td>
                <td className="py-2.5 text-slate-400">Lower limb venous pooling diminishes; baroreflex reset.</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-sky-400">Blood Oxygen (SpO2)</td>
                <td className="py-2.5">95 – 100%</td>
                <td className="py-2.5 text-amber-400">91 – 94%</td>
                <td className="py-2.5 text-rose-400">&lt; 90%</td>
                <td className="py-2.5 text-slate-400">Monitored during EVA suit pressurization &amp; habitat ops.</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-amber-400">Core Body Temperature</td>
                <td className="py-2.5">36.2 – 37.4 °C</td>
                <td className="py-2.5 text-amber-400">&gt; 37.6 °C</td>
                <td className="py-2.5 text-rose-400">&gt; 38.3 °C</td>
                <td className="py-2.5 text-slate-400">Convective heat loss reduced in microgravity ("space fever").</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-teal-400">Respiratory Rate</td>
                <td className="py-2.5">12 – 18 breaths/min</td>
                <td className="py-2.5 text-amber-400">&gt; 20 or &lt; 10</td>
                <td className="py-2.5 text-rose-400">&gt; 24 or &lt; 8</td>
                <td className="py-2.5 text-slate-400">Sensitive to localized CO2 pocket accumulation.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      <ManualEntryModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
      />
    </div>
  );
};
