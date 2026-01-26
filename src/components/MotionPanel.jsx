import React from 'react';
import { Activity, Compass } from 'lucide-react';

const ProgressBar = ({ value, max, label, colorClass = "bg-rail-primary" }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-rail-muted">{label}</span>
        <span className="font-mono text-rail-text">{value.toFixed(2)}</span>
      </div>
      <div className="h-1.5 bg-rail-darker rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${colorClass}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default function MotionPanel({ data }) {
  if (!data) return null;

  const isVibrationHigh = data.vibration > 10.0; // Threshold

  return (
    <div className={`bg-rail-panel border rounded-xl p-4 transition-colors ${isVibrationHigh ? 'border-rail-critical/50' : 'border-rail-border'}`}>
      <h3 className="text-sm font-bold text-rail-secondary mb-4 flex items-center gap-2">
        <Activity size={16} />
        MOTION & VIBRATION
      </h3>
      
      <div className="space-y-4">
        <div>
           {/* Vibration */}
           <ProgressBar 
             value={data.vibration} 
             max={20} 
             label="Vibration Level" 
             colorClass={isVibrationHigh ? "bg-rail-critical shadow-[0_0_10px_rgba(255,0,60,0.5)]" : "bg-rail-primary"}
           />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-rail-border/50">
          <div className="text-center">
            <Compass size={16} className="mx-auto mb-2 text-rail-muted" />
            <div className="text-xs text-rail-muted mb-1">PITCH</div>
            <div className="font-mono font-bold">{data.attitude.pitch}</div>
          </div>
          <div className="text-center">
            <Compass size={16} className="mx-auto mb-2 text-rail-muted rotate-90" />
            <div className="text-xs text-rail-muted mb-1">ROLL</div>
            <div className="font-mono font-bold">{data.attitude.roll}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
