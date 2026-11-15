import React from 'react';
import { Heart, Activity, Wind, Thermometer, ShieldAlert, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AlertSeverity } from '../../types';

interface VitalCardProps {
  type: 'heart_rate' | 'blood_pressure' | 'oxygen' | 'temperature' | 'respiratory' | 'hrv';
  title: string;
  value: string | number;
  unit: string;
  baseline: string | number;
  status: AlertSeverity;
  trend?: 'up' | 'down' | 'stable';
  secondaryValue?: string;
  onClick?: () => void;
}

export const VitalCard: React.FC<VitalCardProps> = ({
  type,
  title,
  value,
  unit,
  baseline,
  status,
  trend = 'stable',
  secondaryValue,
  onClick
}) => {
  const getIcon = () => {
    switch (type) {
      case 'heart_rate':
        return <Heart className="w-5 h-5 text-rose-400 fill-rose-500/20 animate-pulse" />;
      case 'blood_pressure':
        return <Activity className="w-5 h-5 text-cyan-400" />;
      case 'oxygen':
        return <ShieldAlert className="w-5 h-5 text-sky-400" />;
      case 'temperature':
        return <Thermometer className="w-5 h-5 text-amber-400" />;
      case 'respiratory':
        return <Wind className="w-5 h-5 text-teal-400" />;
      case 'hrv':
        return <Activity className="w-5 h-5 text-purple-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
            CRITICAL
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
            WARNING
          </span>
        );
      case 'normal':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            NOMINAL
          </span>
        );
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-cyan-400" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-cyan-400" />;
      default:
        return <Minus className="w-3 h-3 text-slate-400" />;
    }
  };

  const getBorderColor = () => {
    if (status === 'critical') return 'border-rose-500/50 hud-glow-crimson';
    if (status === 'warning') return 'border-amber-500/40 hud-glow-amber';
    return 'border-slate-800/80 hover:border-cyan-500/40';
  };

  return (
    <div
      onClick={onClick}
      className={`hud-card p-4 rounded-xl border transition-all duration-200 cursor-pointer ${getBorderColor()}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-space-850 border border-slate-700/50">
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-medium text-slate-400 tracking-wide">{title}</h4>
              <span className="text-[9px] font-mono text-cyan-400/80 px-1 py-0.2 rounded bg-space-900 border border-cyan-800/40">SIM</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
              {getTrendIcon()}
              <span>Base: {baseline}</span>
            </div>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline justify-between mt-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold font-mono tracking-tight text-white">{value}</span>
          <span className="text-xs font-mono text-cyan-400 font-medium">{unit}</span>
        </div>
        {secondaryValue && (
          <span className="text-xs font-mono text-slate-400">{secondaryValue}</span>
        )}
      </div>

      {/* Mini Visual Indicator Line */}
      <div className="w-full bg-space-850 h-1 rounded-full mt-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            status === 'critical'
              ? 'bg-rose-500 w-full animate-pulse'
              : status === 'warning'
              ? 'bg-amber-400 w-3/4'
              : 'bg-cyan-500 w-1/2'
          }`}
        />
      </div>
    </div>
  );
};
