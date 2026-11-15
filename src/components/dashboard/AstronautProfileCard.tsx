import React from 'react';
import { UserCheck, Shield, Award, Calendar, Activity } from 'lucide-react';
import { useAstronaut } from '../../context/AstronautContext';

export const AstronautProfileCard: React.FC = () => {
  const { activeAstronaut, radiationData } = useAstronaut();

  const careerPct = Number(
    ((radiationData.careerDoseMSv / radiationData.careerLimitMSv) * 100).toFixed(1)
  );

  const missionProgressPct = Math.round(
    (activeAstronaut.missionDay / activeAstronaut.totalMissionDays) * 100
  );

  return (
    <div className="hud-card p-5 rounded-xl border border-slate-800/80">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={activeAstronaut.avatarUrl}
            alt={activeAstronaut.name}
            className="w-16 h-16 rounded-xl object-cover ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-500/20"
          />
          {activeAstronaut.evaCertified && (
            <div
              className="absolute -bottom-1 -right-1 bg-cyan-500 text-space-950 p-1 rounded-full shadow"
              title="EVA (Extravehicular Activity) Certified"
            >
              <Award className="w-3 h-3 font-bold" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wider uppercase">
              {activeAstronaut.rank}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-850 text-slate-300 border border-slate-700/60">
              {activeAstronaut.bloodType}
            </span>
          </div>
          <h3 className="text-base font-bold text-white truncate mt-0.5">
            {activeAstronaut.name}
          </h3>
          <p className="text-xs text-slate-400 truncate">{activeAstronaut.role}</p>
          <p className="text-[11px] font-mono text-slate-400 mt-1">
            Agency: {activeAstronaut.agency} • Age: {activeAstronaut.age} • {activeAstronaut.weightKg} kg
          </p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="mt-4 pt-4 border-t border-slate-800/70 space-y-3">
        {/* Mission Timeline */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mission Timeline</span>
            </span>
            <span className="font-mono text-slate-200">
              SOL {activeAstronaut.missionDay} / {activeAstronaut.totalMissionDays} ({missionProgressPct}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-space-850 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              style={{ width: `${missionProgressPct}%` }}
            />
          </div>
        </div>

        {/* Radiation Career Limit Exposure */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Career Radiation Dose</span>
            </span>
            <span className="font-mono text-slate-200">
              {radiationData.careerDoseMSv.toFixed(1)} / {radiationData.careerLimitMSv} mSv ({careerPct}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-space-850 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                careerPct > 75 ? 'bg-rose-500' : careerPct > 50 ? 'bg-amber-400' : 'bg-purple-500'
              }`}
              style={{ width: `${Math.min(100, careerPct)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-1">
            Standard: NASA-STD-3001 &amp; NCRP Report 186 (600 mSv career limit, REID &lt; 3%) [Simulated]
          </p>
        </div>
      </div>
    </div>
  );
};
