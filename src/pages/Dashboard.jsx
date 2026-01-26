import React, { useEffect } from 'react';
import { useTrainStore } from '../store/useTrainStore';
import TrainCard from '../components/TrainCard';
import { Train, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

const SummaryCard = ({ label, value, icon: Icon, color, subColor }) => (
  <div className="bg-rail-panel border border-rail-border p-6 rounded-xl flex items-center justify-between group hover:border-rail-border/80 transition-all cursor-default">
    <div>
      <div className="text-rail-muted text-xs uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-4xl font-mono font-bold ${color} text-glow-sm`}>{value}</div>
    </div>
    <div className={`p-3 rounded-lg ${subColor} group-hover:scale-110 transition-transform`}>
      <Icon size={24} className={color.replace('text-', 'text-')} /> {/* Simplified for demo */}
    </div>
  </div>
);

export default function Dashboard() {
  const { trains, getSummaryStats, fetchTrains } = useTrainStore();
  const stats = getSummaryStats();

  useEffect(() => {
    fetchTrains();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-rail-primary to-rail-secondary bg-clip-text text-transparent">
            TrainGuard
          </h1>
        </div>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <SummaryCard
          label="Total Trains"
          value={stats.total}
          icon={Train}
          color="text-white"
          subColor="bg-gray-800"
        />
        <SummaryCard
          label="Active Trips"
          value={stats.active}
          icon={Activity}
          color="text-rail-primary"
          subColor="bg-rail-primary/10"
        />
        <SummaryCard
          label="Inactive"
          value={stats.total - stats.active}
          icon={ShieldCheck}
          color="text-rail-success"
          subColor="bg-rail-success/10"
        />
        <SummaryCard
          label="Critical Alerts"
          value={stats.critical}
          icon={AlertTriangle}
          color="text-rail-critical"
          subColor="bg-rail-critical/10"
        />
      </div>

      {/* Grid */}
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Activity size={20} className="text-rail-primary" />
        Live Status
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trains.map(train => (
          <TrainCard key={train.device_id} train={train} />
        ))}
      </div>
    </div>
  );
}
