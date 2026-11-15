import React, { useState } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-blue-950/60 border-b border-cyan-500/20 px-4 py-2 text-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-cyan-200">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong className="font-semibold text-cyan-300">NASA SPACE APPS CHALLENGE 2026 // ASTRA PROTOTYPE:</strong> All telemetry readings, vital statistics, and clinical risk predictions are strictly <em>simulated data</em> for demonstration purposes. Not connected to active NASA flight systems and not intended to replace certified Flight Surgeons or medical emergency procedures.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 transition-colors shrink-0"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
