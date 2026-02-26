import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useTrainStore } from '../store/useTrainStore';
import DriverCamera from '../components/DriverCamera';
import MapView from '../components/MapView';
import EnvironmentPanel from '../components/EnvironmentPanel';
import MotionPanel from '../components/MotionPanel';
import { socket } from '../services/socket';
const routeData = {
  "98 Đê La Thành -> Đại học Bách Khoa": {
    from: { lat: 21.01999331880992, lng: 105.82847101558824 },
    to: { lat: 21.00526425057811, lng: 105.84154086679233 },
  }
};

export default function TrainDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trains, setActiveTrain, updateTrainFromPayload } = useTrainStore();

  // Find train directly from store (simulating real-time updates)
  const train = trains.find(t => t.device_id === id);

  useEffect(() => {
    setActiveTrain(id);
    return () => setActiveTrain(null);
  }, [id, setActiveTrain]);

  useEffect(() => {
    const handleSensorData = (payload) => {
      if (!payload?.device_id) return;
      updateTrainFromPayload(payload);
    };

    socket.on('sensor_data', handleSensorData);

    return () => {
      socket.off('sensor_data', handleSensorData);
    };
  }, [updateTrainFromPayload]);

  if (!train) {
    return (
      <div className="h-screen flex items-center justify-center text-rail-muted">
        Train not found or inactive.
      </div>
    );
  }

  const isCritical = train?.aiResult?.status === 1;
  return (
    <div className="p-6 h-screen flex flex-col gap-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-rail-muted hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          BACK TO DASHBOARD
        </button>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-rail-muted bg-clip-text text-transparent">
              DEVICE {train.device_id}
            </h1>
            <div className="text-xs text-rail-muted font-mono">{train.route}</div>
          </div>
          <div className={`px-4 py-2 rounded font-bold font-mono ${isCritical ? 'bg-rail-critical text-black animate-pulse' : 'bg-rail-primary/10 text-rail-primary'
            }`}>
            {train?.aiResult?.status === 1 ? "CRITICAL" : "NORMAL"}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">

        {/* Left Column: Driver & Environment (4 cols) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <DriverCamera image={train.image} status={train?.aiResult?.status} className="flex-1 min-h-[250px]" />
          <EnvironmentPanel data={train.bme680} />
          <MotionPanel data={train.mpu6050} />
        </div>

        {/* Right Column: Map (8 cols) */}
        <div className="col-span-12 lg:col-span-8 h-full rounded-xl overflow-hidden border border-rail-border shadow-2xl relative">

          <MapView position={train.gps} speed={train.gps.speed} className="h-full" route={routeData[train.route]} />
          {/* ===== LEFT OVERLAY: LAT / LNG ===== */}
          <div className="absolute bottom-4 left-4 z-[400] bg-black/80 backdrop-blur border border-rail-border p-3 rounded-lg text-xs font-mono">
            <div className="flex gap-4">
              <div>
                <div className="text-rail-muted">LATITUDE</div>
                <div className="text-rail-primary">
                  {train.gps.latitude.toFixed(6)}
                </div>
              </div>
              <div>
                <div className="text-rail-muted">LONGITUDE</div>
                <div className="text-rail-primary">
                  {train.gps.longitude.toFixed(6)}
                </div>
              </div>
            </div>
          </div>

          {/* ===== RIGHT OVERLAY: SPEED ===== */}
          <div className="absolute bottom-4 right-4 z-[400] bg-black/80 backdrop-blur border border-rail-border p-3 rounded-lg text-xs font-mono text-right">
            <div className="text-rail-muted">SPEED</div>
            <div className="text-2xl font-bold text-rail-primary">
              {(train.gps.speed).toFixed(1)}
              <span className="text-xs ml-1">km/h</span>
            </div>
          </div>
          {/* Status Overlay on Map */}
          {isCritical && (
            <div className="absolute top-4 right-4 z-[400] bg-rail-critical/90 text-black px-6 py-4 rounded-xl flex items-center gap-3 animate-pulse">
              <AlertTriangle size={32} />
              <div>
                <div className="font-bold text-lg">CRITICAL ALERT</div>
                <div className="text-xs font-mono">Immediate attention required</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
