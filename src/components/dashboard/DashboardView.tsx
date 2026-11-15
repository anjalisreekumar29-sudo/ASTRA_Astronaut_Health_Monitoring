import React from 'react';
import { VitalCard } from './VitalCard';
import { OverallReadiness } from './OverallReadiness';
import { AstronautProfileCard } from './AstronautProfileCard';
import { TelemetryMiniChart } from './TelemetryMiniChart';
import { RecentActivityList } from './RecentActivityList';
import { useAstronaut } from '../../context/AstronautContext';
import { AlertSeverity } from '../../types';
import { AlertCircle } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { currentVitals, activeAstronaut, settings, setActiveTab, injectAnomaly } = useAstronaut();
  const baseline = activeAstronaut.baselineVitals;

  // Determine vital statuses
  const getHeartRateStatus = (): AlertSeverity => {
    if (currentVitals.heartRate > 125 || currentVitals.heartRate < 45) return 'critical';
    if (currentVitals.heartRate > 100 || currentVitals.heartRate < 50) return 'warning';
    return 'normal';
  };

  const getBPStatus = (): AlertSeverity => {
    if (currentVitals.bloodPressureSystolic > 145 || currentVitals.bloodPressureDiastolic > 95) return 'critical';
    if (currentVitals.bloodPressureSystolic > 130 || currentVitals.bloodPressureDiastolic > 85) return 'warning';
    return 'normal';
  };

  const getSpo2Status = (): AlertSeverity => {
    if (currentVitals.oxygenSaturation < 90) return 'critical';
    if (currentVitals.oxygenSaturation < 94) return 'warning';
    return 'normal';
  };

  const getTempStatus = (): AlertSeverity => {
    if (currentVitals.temperature > 38.3 || currentVitals.temperature < 35.0) return 'critical';
    if (currentVitals.temperature > 37.5 || currentVitals.temperature < 35.8) return 'warning';
    return 'normal';
  };

  const getRespStatus = (): AlertSeverity => {
    if (currentVitals.respiratoryRate > 24 || currentVitals.respiratoryRate < 8) return 'critical';
    if (currentVitals.respiratoryRate > 20 || currentVitals.respiratoryRate < 10) return 'warning';
    return 'normal';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Active Anomaly Simulation Banner if user triggered one */}
      {settings.activeAnomalyInjection !== 'none' && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 flex items-center justify-between text-rose-200 text-xs font-mono backdrop-blur-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400 animate-spin-slow shrink-0" />
            <div>
              <strong className="text-white">ACTIVE SIMULATION INJECTION: </strong>
              <span className="uppercase text-rose-300 font-bold">
                {settings.activeAnomalyInjection.replace('_', ' ')}
              </span>
              <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                ASTRA clinical engine is actively analyzing simulated multi-variable physiological deviations.
              </p>
            </div>
          </div>
          <button
            onClick={() => injectAnomaly('none')}
            className="px-3 py-1.5 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-400 transition-colors text-xs font-sans shrink-0"
          >
            Reset to Nominal
          </button>
        </div>
      )}

      {/* Top Section: Overall Readiness Dial + Astronaut Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <OverallReadiness />
        </div>
        <div className="lg:col-span-5">
          <AstronautProfileCard />
        </div>
      </div>

      {/* Vital Sign Telemetry Cards (5 main vitals + HRV) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              PRIMARY FLIGHT PHYSIOLOGICAL TELEMETRY
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              [SIMULATED SENSORS]
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            Sensor Freq: {settings.simulationIntervalMs / 1000}s
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <VitalCard
            type="heart_rate"
            title="HEART RATE"
            value={currentVitals.heartRate}
            unit="BPM"
            baseline={`${baseline.restingHeartRate}`}
            status={getHeartRateStatus()}
            trend={currentVitals.heartRate > baseline.restingHeartRate ? 'up' : 'stable'}
            onClick={() => setActiveTab('vitals')}
          />
          <VitalCard
            type="blood_pressure"
            title="BLOOD PRESSURE"
            value={`${currentVitals.bloodPressureSystolic}/${currentVitals.bloodPressureDiastolic}`}
            unit="mmHg"
            baseline={`${baseline.systolicBP}/${baseline.diastolicBP}`}
            status={getBPStatus()}
            trend={currentVitals.bloodPressureSystolic > baseline.systolicBP ? 'up' : 'stable'}
            onClick={() => setActiveTab('vitals')}
          />
          <VitalCard
            type="oxygen"
            title="BLOOD OXYGEN"
            value={currentVitals.oxygenSaturation}
            unit="%"
            baseline={`${baseline.spo2}%`}
            status={getSpo2Status()}
            trend={currentVitals.oxygenSaturation < baseline.spo2 ? 'down' : 'stable'}
            onClick={() => setActiveTab('vitals')}
          />
          <VitalCard
            type="temperature"
            title="BODY TEMP"
            value={currentVitals.temperature}
            unit="°C"
            baseline={`${baseline.temperature}`}
            status={getTempStatus()}
            trend={currentVitals.temperature > baseline.temperature ? 'up' : 'stable'}
            onClick={() => setActiveTab('vitals')}
          />
          <VitalCard
            type="respiratory"
            title="RESPIRATORY"
            value={currentVitals.respiratoryRate}
            unit="/min"
            baseline={`${baseline.respiratoryRate}`}
            status={getRespStatus()}
            trend="stable"
            onClick={() => setActiveTab('vitals')}
          />
          <VitalCard
            type="hrv"
            title="HEART VARIABILITY"
            value={currentVitals.heartRateVariability || baseline.baselineHRV}
            unit="ms"
            baseline={`${baseline.baselineHRV}`}
            status="normal"
            secondaryValue="Autonomic"
            onClick={() => setActiveTab('vitals')}
          />
        </div>
      </div>

      {/* Mid Section: Real-time Telemetry Trend Chart */}
      <TelemetryMiniChart />

      {/* Bottom Section: Active Alerts & AI Prescribed Countermeasures */}
      <RecentActivityList />
    </div>
  );
};
