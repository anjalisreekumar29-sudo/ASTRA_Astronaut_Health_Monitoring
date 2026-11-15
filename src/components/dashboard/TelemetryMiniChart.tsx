import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useAstronaut } from '../../context/AstronautContext';
import { Activity, ShieldAlert, Heart } from 'lucide-react';

export const TelemetryMiniChart: React.FC = () => {
  const { vitalsHistory } = useAstronaut();
  const [metric, setMetric] = useState<'heartRate' | 'bloodPressure' | 'oxygenSaturation'>('heartRate');

  const chartData = vitalsHistory.map((item, index) => ({
    time: item.timestamp,
    index,
    heartRate: item.heartRate,
    systolic: item.bloodPressureSystolic,
    diastolic: item.bloodPressureDiastolic,
    oxygen: item.oxygenSaturation
  }));

  const getMetricConfig = () => {
    switch (metric) {
      case 'bloodPressure':
        return {
          title: 'Arterial Blood Pressure (Systolic / Diastolic)',
          stroke1: '#06b6d4',
          fill1: 'url(#cyanGrad)',
          stroke2: '#3b82f6',
          fill2: 'url(#blueGrad)',
          unit: 'mmHg',
          domain: [60, 160]
        };
      case 'oxygenSaturation':
        return {
          title: 'Blood Oxygen Saturation (SpO2)',
          stroke1: '#38bdf8',
          fill1: 'url(#skyGrad)',
          unit: '%',
          domain: [85, 100]
        };
      case 'heartRate':
      default:
        return {
          title: 'Heart Rate Telemetry Stream',
          stroke1: '#f43f5e',
          fill1: 'url(#roseGrad)',
          unit: 'BPM',
          domain: [40, 140]
        };
    }
  };

  const config = getMetricConfig();

  return (
    <div className="hud-card p-5 rounded-xl border border-slate-800/80">
      {/* Header with Metric Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>REAL-TIME PHYSIOLOGICAL TELEMETRY STREAM</span>
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              [SIMULATED STREAM]
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Rolling buffer of continuous biosensor telemetry (Live synthetic fluctuations)
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center gap-1 bg-space-850 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setMetric('heartRate')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
              metric === 'heartRate'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Heart Rate
          </button>
          <button
            onClick={() => setMetric('bloodPressure')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
              metric === 'bloodPressure'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Blood Pressure
          </button>
          <button
            onClick={() => setMetric('oxygenSaturation')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
              metric === 'oxygenSaturation'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SpO2
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              interval="preserveStartEnd"
              fontFamily="monospace"
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              domain={config.domain}
              fontFamily="monospace"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0c1326',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                borderRadius: '8px',
                fontSize: '11px',
                fontFamily: 'monospace'
              }}
              labelStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
            />

            {metric === 'bloodPressure' ? (
              <>
                <Area
                  type="monotone"
                  dataKey="systolic"
                  name="Systolic (mmHg)"
                  stroke="#06b6d4"
                  fill="url(#cyanGrad)"
                  strokeWidth={2}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="diastolic"
                  name="Diastolic (mmHg)"
                  stroke="#3b82f6"
                  fill="url(#blueGrad)"
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </>
            ) : metric === 'oxygenSaturation' ? (
              <Area
                type="monotone"
                dataKey="oxygen"
                name="SpO2 (%)"
                stroke="#38bdf8"
                fill="url(#skyGrad)"
                strokeWidth={2}
                isAnimationActive={false}
              />
            ) : (
              <Area
                type="monotone"
                dataKey="heartRate"
                name="Heart Rate (BPM)"
                stroke="#f43f5e"
                fill="url(#roseGrad)"
                strokeWidth={2}
                isAnimationActive={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
