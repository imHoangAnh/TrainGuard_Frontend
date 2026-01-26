import React from 'react';
import { Thermometer, Droplets, Wind } from 'lucide-react';
import { clsx } from 'clsx';

const SensorItem = ({ icon: Icon, label, value, unit, status = 'normal' }) => (
  <div className="flex flex-col items-center p-4 bg-rail-dark rounded-lg border border-rail-border min-w-[100px] flex-1">
    <Icon size={20} className={clsx("mb-2", {
      'text-rail-success': status === 'normal',
      'text-rail-warning': status === 'warning',
      'text-rail-critical': status === 'critical',
    })} />
    <span className="text-rail-muted text-xs uppercase tracking-wider">{label}</span>
    <span className="text-xl font-mono font-bold mt-1 text-rail-text">
      {value}
      <span className="text-sm text-rail-muted ml-1">{unit}</span>
    </span>
  </div>
);

export default function EnvironmentPanel({ data }) {
  if (!data) return null;

  const getIAQStatus = (val) => {
    if (val < 50) return 'normal'; // Good
    if (val < 100) return 'warning'; // Moderate
    return 'critical'; // Poor
  };

  const iaqStatus = getIAQStatus(data.iaq);

  return (
    <div className="bg-rail-panel border border-rail-border rounded-xl p-4">
      <h3 className="text-sm font-bold text-rail-primary mb-4 flex items-center gap-2">
        <Wind size={16} />
        ENVIRONMENT SENSORS
      </h3>
      <div className="flex gap-4 justify-between">
        <SensorItem 
          icon={Thermometer} 
          label="Temp" 
          value={data.temperature} 
          unit="°C" 
        />
        <SensorItem 
          icon={Droplets} 
          label="Humidity" 
          value={data.humidity} 
          unit="%" 
        />
        <SensorItem 
          icon={Wind} 
          label="IAQ" 
          value={data.iaq} 
          unit="" 
          status={iaqStatus}
        />
      </div>
    </div>
  );
}
