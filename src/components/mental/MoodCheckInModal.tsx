import React, { useState } from 'react';
import { X, Smile, Meh, Frown, Moon, Brain, Shield, Heart } from 'lucide-react';
import { useAstronaut } from '../../context/AstronautContext';

interface MoodCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MoodCheckInModal: React.FC<MoodCheckInModalProps> = ({ isOpen, onClose }) => {
  const { activeAstronaut, addMentalCheckIn, settings } = useAstronaut();

  const [moodRating, setMoodRating] = useState<number>(7);
  const [stressRating, setStressRating] = useState<number>(4);
  const [sleepHours, setSleepHours] = useState<number>(6.5);
  const [sleepQuality, setSleepQuality] = useState<number>(78);
  const [remPct, setRemPct] = useState<number>(18);
  const [deepPct, setDeepPct] = useState<number>(16);
  const [pvtReactionTime, setPvtReactionTime] = useState<number>(265);
  const [isolationIndex, setIsolationIndex] = useState<number>(4);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lightPct = Math.max(0, 100 - (Number(remPct) + Number(deepPct)));

    addMentalCheckIn({
      date: `SOL ${activeAstronaut.missionDay} (Logged)`,
      missionDay: activeAstronaut.missionDay,
      moodRating: Number(moodRating),
      stressRating: Number(stressRating),
      sleepHours: Number(sleepHours),
      sleepQualityRating: Number(sleepQuality),
      remSleepPct: Number(remPct),
      deepSleepPct: Number(deepPct),
      lightSleepPct: lightPct,
      pvtReactionTimeMs: Number(pvtReactionTime),
      isolationIndex: Number(isolationIndex),
      notes: notes || 'Daily psychological check-in submitted.',
      earthCommDelayMinutes: settings.earthCommDelayMinutes
    });

    onClose();
  };

  const getMoodLabel = (val: number) => {
    if (val >= 8) return { label: 'Optimal / Resilient', color: 'text-emerald-400', icon: Smile };
    if (val >= 5) return { label: 'Moderate / Balanced', color: 'text-cyan-400', icon: Meh };
    return { label: 'Challenged / Strained', color: 'text-amber-400', icon: Frown };
  };

  const moodInfo = getMoodLabel(moodRating);
  const MoodIcon = moodInfo.icon;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="hud-card p-6 rounded-2xl max-w-xl w-full border border-cyan-500/40 my-8 shadow-2xl shadow-cyan-500/10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                DAILY PSYCHOLOGICAL & SLEEP CHECK-IN
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Crew Member: {activeAstronaut.name} ({activeAstronaut.callsign}) • SOL {activeAstronaut.missionDay}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs font-mono">
          {/* Mood Slider */}
          <div className="p-3 rounded-xl bg-space-850/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium flex items-center gap-2">
                <MoodIcon className={`w-4 h-4 ${moodInfo.color}`} />
                <span>Subjective Emotional State (Mood):</span>
              </label>
              <span className={`font-bold text-sm ${moodInfo.color}`}>
                {moodRating} / 10 ({moodInfo.label})
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={moodRating}
              onChange={e => setMoodRating(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1 (Severe Distress)</span>
              <span>5 (Neutral)</span>
              <span>10 (Peak Morale)</span>
            </div>
          </div>

          {/* Stress & Fatigue Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Stress Rating */}
            <div className="p-3 rounded-xl bg-space-850/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium">Stress Level:</label>
                <span className="font-bold text-amber-400">{stressRating} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={stressRating}
                onChange={e => setStressRating(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1 (Serene)</span>
                <span>10 (Overwhelmed)</span>
              </div>
            </div>

            {/* PVT Reaction Time */}
            <div className="p-3 rounded-xl bg-space-850/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium">PVT Vigilance Latency:</label>
                <span className="font-bold text-cyan-400">{pvtReactionTime} ms</span>
              </div>
              <input
                type="range"
                min="200"
                max="400"
                step="5"
                value={pvtReactionTime}
                onChange={e => setPvtReactionTime(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>200ms (Acute)</span>
                <span>320ms+ (Fatigued)</span>
              </div>
            </div>
          </div>

          {/* Sleep Architecture */}
          <div className="p-3 rounded-xl bg-space-850/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <Moon className="w-4 h-4 text-blue-400" />
              <span>Sleep Duration & Architecture</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Duration (Hrs)</label>
                <input
                  type="number"
                  step="0.1"
                  min="3"
                  max="12"
                  value={sleepHours}
                  onChange={e => setSleepHours(Number(e.target.value))}
                  className="w-full bg-space-900 border border-slate-700 rounded-lg p-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Quality (%)</label>
                <input
                  type="number"
                  min="20"
                  max="100"
                  value={sleepQuality}
                  onChange={e => setSleepQuality(Number(e.target.value))}
                  className="w-full bg-space-900 border border-slate-700 rounded-lg p-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[11px] block mb-1">REM Sleep (%)</label>
                <input
                  type="number"
                  min="5"
                  max="40"
                  value={remPct}
                  onChange={e => setRemPct(Number(e.target.value))}
                  className="w-full bg-space-900 border border-slate-700 rounded-lg p-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Deep Sleep (%)</label>
                <input
                  type="number"
                  min="5"
                  max="40"
                  value={deepPct}
                  onChange={e => setDeepPct(Number(e.target.value))}
                  className="w-full bg-space-900 border border-slate-700 rounded-lg p-2 text-white font-bold"
                />
              </div>
            </div>
          </div>

          {/* Social Confinement & Isolation */}
          <div className="p-3 rounded-xl bg-space-850/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium">Perceived Isolation Index:</label>
              <span className="font-bold text-purple-400">{isolationIndex} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={isolationIndex}
              onChange={e => setIsolationIndex(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1 (Well Connected to Crew & Ground)</span>
              <span>10 (Isolated / Detached)</span>
            </div>
          </div>

          {/* Qualitative Notes / Journal */}
          <div>
            <label className="block text-slate-300 mb-1 font-medium">
              Confidential Psychological Notes / Sleep Factors:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Slept soundly after earplug adjustment; high cognitive load during docking maneuver."
              className="w-full bg-space-850 border border-slate-700 rounded-lg p-2.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Confidentiality Notice & Actions */}
          <p className="text-[10px] text-slate-500 italic">
            Telemetry is encrypted according to NASA HRP Medical Privacy Standards. Accessible only to Crew Medical Officer and assigned Ground Flight Surgeon.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-space-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/20"
            >
              Record Check-In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
