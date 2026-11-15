import React, { useState } from 'react';
import { X, Heart, Activity, Wind, Thermometer, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAstronaut } from '../../context/AstronautContext';

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualEntryModal: React.FC<ManualEntryModalProps> = ({ isOpen, onClose }) => {
  const { currentVitals, activeAstronaut, addManualVitalReading } = useAstronaut();

  const [heartRate, setHeartRate] = useState(String(currentVitals.heartRate));
  const [systolic, setSystolic] = useState(String(currentVitals.bloodPressureSystolic));
  const [diastolic, setDiastolic] = useState(String(currentVitals.bloodPressureDiastolic));
  const [spo2, setSpo2] = useState(String(currentVitals.oxygenSaturation));
  const [temperature, setTemperature] = useState(String(currentVitals.temperature));
  const [respiratoryRate, setRespiratoryRate] = useState(String(currentVitals.respiratoryRate));
  const [hrv, setHrv] = useState(String(currentVitals.heartRateVariability || 65));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addManualVitalReading({
      heartRate: Number(heartRate),
      bloodPressureSystolic: Number(systolic),
      bloodPressureDiastolic: Number(diastolic),
      oxygenSaturation: Number(spo2),
      temperature: Number(temperature),
      respiratoryRate: Number(respiratoryRate),
      heartRateVariability: Number(hrv)
    });
    onClose();
  };

  const handlePreset = (type: 'nominal' | 'tachycardia' | 'hypoxia' | 'pyrexia') => {
    const base = activeAstronaut.baselineVitals;
    if (type === 'nominal') {
      setHeartRate(String(base.restingHeartRate));
      setSystolic(String(base.systolicBP));
      setDiastolic(String(base.diastolicBP));
      setSpo2(String(base.spo2));
      setTemperature(String(base.temperature));
      setRespiratoryRate(String(base.respiratoryRate));
      setHrv(String(base.baselineHRV));
    } else if (type === 'tachycardia') {
      setHeartRate('135');
      setSystolic('148');
      setDiastolic('94');
      setSpo2('97');
      setTemperature('37.1');
      setRespiratoryRate('20');
      setHrv('28');
    } else if (type === 'hypoxia') {
      setHeartRate('105');
      setSystolic('128');
      setDiastolic('82');
      setSpo2('88'); // Critical SpO2 < 90
      setTemperature('36.6');
      setRespiratoryRate('24');
      setHrv('42');
    } else if (type === 'pyrexia') {
      setHeartRate('112');
      setSystolic('130');
      setDiastolic('84');
      setSpo2('96');
      setTemperature('38.6'); // Fever
      setRespiratoryRate('21');
      setHrv('35');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="hud-card p-6 rounded-2xl max-w-lg w-full border border-cyan-500/40 shadow-2xl shadow-cyan-500/10">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                MANUAL TELEMETRY OVERRIDE / ENTRY
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Log custom vital measurements to test real-time AI triage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Test Presets */}
        <div className="my-4 p-3 bg-space-850/80 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 block mb-2 font-semibold uppercase">
            Quick Test Presets (Simulate Conditions):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handlePreset('nominal')}
              className="px-2 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono hover:bg-emerald-500/20"
            >
              Nominal
            </button>
            <button
              type="button"
              onClick={() => handlePreset('tachycardia')}
              className="px-2 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono hover:bg-rose-500/20"
            >
              Tachycardia
            </button>
            <button
              type="button"
              onClick={() => handlePreset('hypoxia')}
              className="px-2 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-mono hover:bg-sky-500/20"
            >
              Hypoxia
            </button>
            <button
              type="button"
              onClick={() => handlePreset('pyrexia')}
              className="px-2 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono hover:bg-amber-500/20"
            >
              Pyrexia (Fever)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block mb-1">Heart Rate (BPM)</label>
              <input
                type="number"
                value={heartRate}
                onChange={e => setHeartRate(e.target.value)}
                className="w-full bg-space-850 border border-slate-700 rounded-lg p-2 text-white font-bold"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Blood Oxygen SpO2 (%)</label>
              <input
                type="number"
                value={spo2}
                onChange={e => setSpo2(e.target.value)}
                className="w-full bg-space-850 border border-slate-700 rounded-lg p-2 text-white font-bold"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Systolic BP (mmHg)</label>
              <input
                type="number"
                value={systolic}
                onChange={e => setSystolic(e.target.value)}
                className="w-full bg-space-850 border border-slate-700 rounded-lg p-2 text-white font-bold"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Diastolic BP (mmHg)</label>
              <input
                type="number"
                value={diastolic}
                onChange={e => setDiastolic(e.target.value)}
                className="w-full bg-space-850 border border-slate-700 rounded-lg p-2 text-white font-bold"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Body Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={e => setTemperature(e.target.value)}
                className="w-full bg-space-850 border border-slate-700 rounded-lg p-2 text-white font-bold"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Respiratory Rate (/min)</label>
              <input
                type="number"
                value={respiratoryRate}
                onChange={e => setRespiratoryRate(e.target.value)}
                className="w-full bg-space-850 border border-slate-700 rounded-lg p-2 text-white font-bold"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-500 text-space-950 font-bold hover:bg-cyan-400 transition-colors shadow-md shadow-cyan-500/20"
            >
              Inject Telemetry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
