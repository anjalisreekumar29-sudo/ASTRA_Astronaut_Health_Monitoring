import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  Shield,
  Activity,
  Heart,
  Brain,
  Bone,
  Dna,
  Radio,
  FileCheck
} from 'lucide-react';
import { useAstronaut } from '../../context/AstronautContext';
import { HealthReport } from '../../types';

export const HealthReportsView: React.FC = () => {
  const { reports, activeAstronaut, aiAnalysis, downloadReportPDF } = useAstronaut();
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');

  const activeReport = reports.find(r => r.id === selectedReportId) || reports[0] || {
    id: 'rep-now',
    astronautId: activeAstronaut.id,
    reportDate: `SOL ${activeAstronaut.missionDay}`,
    missionDay: activeAstronaut.missionDay,
    reportType: 'daily' as const,
    overallReadinessScore: aiAnalysis.overallReadinessScore,
    cardiovascularScore: aiAnalysis.categoryScores.cardiovascular,
    boneHealthScore: aiAnalysis.categoryScores.musculoskeletal,
    immuneScore: aiAnalysis.categoryScores.immune,
    mentalWellnessScore: aiAnalysis.categoryScores.cognitive,
    radiationSafetyScore: aiAnalysis.categoryScores.radiation,
    summaryNotes: 'Continuous aerospace medical synthesis generated from telemetry archive.',
    clinicalFlightSurgeonComments: 'Astronaut cleared for ongoing nominal lunar flight operations.',
    criticalAlertCount: 0,
    warningAlertCount: 1,
    keyActionItems: ['Maintain 2.5h daily ARED loading', 'Monitor sleep lighting schedule']
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>MISSION HEALTH REPORTS &amp; CLINICAL TELEMETRY SYNTHESIS</span>
            </h2>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              [SIMULATED MEDICAL RECORDS]
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Aerospace medical history, weekly summaries, and downloadable PDF flight records
          </p>
        </div>

        <button
          onClick={() => downloadReportPDF(activeReport.id)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 text-xs font-mono transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download NASA Telemetry PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Reports Archive List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="font-semibold uppercase">ARCHIVED CLINICAL REPORTS:</span>
            <span>{reports.length} Reports</span>
          </div>

          <div className="space-y-2">
            {reports.map(rep => {
              const isSelected = rep.id === activeReport.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-space-850 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                      : 'bg-space-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-xs">{rep.reportDate}</span>
                    <span
                      className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded font-semibold ${
                        rep.reportType === 'weekly'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {rep.reportType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
                    <span>SOL {rep.missionDay}</span>
                    <span className="text-cyan-400 font-bold">
                      Readiness: {rep.overallReadinessScore}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Report Detailed Preview */}
        <div className="lg:col-span-8 hud-card p-6 rounded-2xl border border-slate-800 space-y-5">
          {/* Report Top Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                NASA SPACE APPS 2026 // ASTRA MEDICAL TELEMETRY RECORD
              </span>
              <h3 className="text-base font-bold text-white tracking-wide mt-0.5">
                Flight Surgeon Review: {activeReport.reportDate}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Crew Member: {activeAstronaut.rank} {activeAstronaut.name} ({activeAstronaut.callsign})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">Readiness Score</span>
                <span className="text-2xl font-bold font-mono text-cyan-400">
                  {activeReport.overallReadinessScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Subsystem Health Grid */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase mb-3">
              SUBSYSTEM INTEGRITY SCORES
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 rounded-xl bg-space-850 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-400" /> Cardio
                </span>
                <span className="text-lg font-bold font-mono text-white mt-1 block">
                  {activeReport.cardiovascularScore}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-space-850 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Bone className="w-3 h-3 text-cyan-400" /> Bone
                </span>
                <span className="text-lg font-bold font-mono text-white mt-1 block">
                  {activeReport.boneHealthScore}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-space-850 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Dna className="w-3 h-3 text-teal-400" /> Immune
                </span>
                <span className="text-lg font-bold font-mono text-white mt-1 block">
                  {activeReport.immuneScore}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-space-850 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Brain className="w-3 h-3 text-purple-400" /> Mental
                </span>
                <span className="text-lg font-bold font-mono text-white mt-1 block">
                  {activeReport.mentalWellnessScore}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-space-850 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-blue-400" /> Radiation
                </span>
                <span className="text-lg font-bold font-mono text-white mt-1 block">
                  {activeReport.radiationSafetyScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Synthesis Notes */}
          <div className="p-4 rounded-xl bg-space-850/80 border border-slate-800 space-y-2">
            <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase">
              EXECUTIVE MEDICAL SUMMARY
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">{activeReport.summaryNotes}</p>
          </div>

          {/* Flight Surgeon Commentary */}
          <div className="p-4 rounded-xl bg-space-850/80 border border-slate-800 space-y-2">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase">
              GROUND FLIGHT SURGEON DIRECTIVE
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "{activeReport.clinicalFlightSurgeonComments}"
            </p>
          </div>

          {/* Prescribed Key Action Items */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
              PRESCRIBED COUNTERMEASURE ACTION ITEMS:
            </h4>
            <div className="space-y-1.5">
              {activeReport.keyActionItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-space-850/60 border border-slate-800 text-xs text-slate-200 font-mono"
                >
                  <FileCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Export Action */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500">
              NASA Gateway Telemetry Standard HRP-47053
            </span>
            <button
              onClick={() => downloadReportPDF(activeReport.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 text-xs font-mono font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
