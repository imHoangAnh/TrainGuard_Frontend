import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Train, Navigation, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function TrainCard({ train }) {
  const navigate = useNavigate();

  const statusColors = {
    NORMAL: 'border-rail-success/30 hover:border-rail-success bg-rail-panel',
    INACTIVE: 'border-rail-border hover:border-rail-muted bg-rail-darker opacity-60'
  };

  const statusBadges = {
    NORMAL: 'bg-rail-success/10 text-rail-success',
    INACTIVE: 'bg-rail-muted/10 text-rail-muted'
  };

  return (
    <div
      onClick={() => navigate(`/train/${train.device_id}`)}
      className={twMerge(
        "relative p-5 rounded-xl border transition-all cursor-pointer group hover:scale-[1.02]",
        statusColors[train.status]
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rail-dark rounded-lg border border-rail-border group-hover:border-rail-primary/50 transition-colors">
            <Train size={24} className="text-rail-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Train {train.device_id}</h3>
            <div className="text-xs text-rail-muted flex items-center gap-1">
              <Navigation size={12} />
              {train.route}
            </div>
          </div>
        </div>

        <span className={clsx(
          "px-2 py-1 rounded text-xs font-mono font-bold border border-transparent",
          statusBadges[train.status]
        )}>
          {train.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-rail-muted mb-1">SPEED</div>
          <div className="font-mono text-xl font-bold flex items-baseline gap-1">
            {train.gps.speed}
            <span className="text-xs font-sans text-rail-muted">km/h</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-rail-muted mb-1">DRIVER</div>
          <div className="text-sm truncate" title={train.driver_name}>{train.driver_name}</div>
        </div>
      </div>


    </div>
  );
}
