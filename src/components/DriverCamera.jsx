import React from 'react';
import { Camera, AlertTriangle, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function DriverCamera({ image, status, className }) {
  // Mock confidence and drowsiness just for UI based on status
  const isDrowsy = status === 1;
  const confidence = isDrowsy ? 45 : 98;

  return (
    <div className={twMerge("bg-rail-panel border border-rail-border rounded-xl overflow-hidden relative group", className)}>
      <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-red-500 font-mono text-xs flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        LIVE FEED
      </div>

      {/* Alert Overlay */}
      {isDrowsy && (
        <div className="absolute inset-0 z-20 pointer-events-none border-2 border-rail-critical animate-pulse-fast bg-rail-critical/10 flex flex-col items-center justify-center">
          <div className="bg-black/80 px-4 py-2 rounded-lg border border-rail-critical text-rail-critical font-bold flex items-center gap-2 animate-bounce">
            <AlertTriangle size={24} />
            DROWSINESS DETECTED
          </div>
        </div>
      )}

      {/* Camera Image */}
      <div className="relative aspect-video w-full">
        {image?.secure_url ? (
          <img
            src={image.secure_url}
            alt="Driver Camera"
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="w-full h-full bg-black flex items-center justify-center text-rail-muted">
            <Camera size={48} />
          </div>
        )}

        {/* Scan Line Animation */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rail-primary/10 to-transparent h-[10%] w-full animate-[scan_3s_linear_infinite] pointer-events-none" />
      </div>

      {/* Metadata */}
      <div className="bg-rail-darker p-3 flex justify-between items-center text-[16px] border-t border-rail-border">
        <div className="flex items-center gap-2 text-rail-muted">
          <Activity size={14} />
          <span>Driver status</span>
        </div>
        <span className={clsx(
          "font-mono font-bold",
          confidence > 80 ? "text-rail-success" : "text-rail-warning"
        )}>
          {isDrowsy ? "DROWSY" : "Normal"}
        </span>
      </div>
    </div>
  );
}
