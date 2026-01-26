import { create } from 'zustand';
import { apiRequest } from '../services/api';

const mapShipStatusToTrainStatus = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'inactive') return 'INACTIVE';
  if (normalized === 'maintenance') return 'WARNING';
  return 'NORMAL';
};

const mapTrainStatusToShipStatus = (status) => {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'INACTIVE') return 'Inactive';
  return 'Active';
};

const mapShipToTrain = (ship) => ({
  id: ship.id,
  device_id: ship.ship_code ?? String(ship.id ?? ''),
  driver_name: ship.captain_name ?? '',
  route: ship.ship_name ?? '',
  description: ship.description ?? '',
  status: mapShipStatusToTrainStatus(ship.status),
  timestamp: Date.now(),
  bme680: { temperature: 25.0, humidity: 60.0, iaq: 50 },
  mpu6050: { vibration: 0.0, attitude: { pitch: 0, roll: 0 } },
  gps: { latitude: 21.0, longitude: 105.8, speed: 0.0, valid: true },
  image: { secure_url: '' }
});

export const useTrainStore = create((set, get) => ({
  trains: [],
  activeTrainId: null, // For details view

  // Actions
  setActiveTrain: (id) => set({ activeTrainId: id }),
  fetchTrains: async () => {
    try {
      const result = await apiRequest('/ships');
      const ships = result?.data ?? [];
      set({ trains: ships.map(mapShipToTrain) });
    } catch (error) {
      console.error('Failed to fetch ships:', error);
    }
  },
  updateTrainFromPayload: (payload) => set((state) => {
    console.log(payload)
    const index = state.trains.findIndex(t => t.device_id === payload.device_id);
    if (index === -1) {
      return {
        trains: [
          ...state.trains,
          {
            ...payload,
            timestamp: payload.timestamp,
            bme680: payload.bme680,
            mpu6050: payload.mpu6050,
            gps: payload.gps ?? { latitude: 21.0, longitude: 105.8, speed: 0.0, valid: true },
            image: payload.image ?? { secure_url: "" }
          }
        ]
      };
    }

    return {
      trains: state.trains.map((train) => {
        if (train.device_id !== payload.device_id) return train;

        return {
          ...train,
          ...payload,
          timestamp: payload.timestamp ?? Date.now(),
          bme680: payload.bme680 ?? train.bme680,
          mpu6050: payload.mpu6050 ?? train.mpu6050,
          gps: payload.gps ?? train.gps,
          image: payload.image ?? train.image,
          status: payload.status ?? train.status
        };
      })
    };
  }),

  addTrain: async (train) => {
    try {
      const payload = {
        ship_name: train.route,
        ship_code: train.device_id,
        captain_name: train.driver_name,
        status: mapTrainStatusToShipStatus(train.status)
      };

      const result = await apiRequest('/ships', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const createdShip = result?.data ?? payload;

      if (!createdShip?.id) {
        await get().fetchTrains();
        return;
      }

      set((state) => ({
        trains: [...state.trains, mapShipToTrain(createdShip)]
      }));
    } catch (error) {
      console.error('Failed to create ship:', error);
    }
  },

  removeTrain: async (id) => {
    try {
      await apiRequest(`/ships/${id}`, { method: 'DELETE' });
      set((state) => ({
        trains: state.trains.filter(t => t.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete ship:', error);
    }
  },

  // Selectors
  getActiveTrain: () => {
    const { trains, activeTrainId } = get();
    return trains.find(t => t.device_id === activeTrainId);
  },

  getSummaryStats: () => {
    const { trains } = get();
    return {
      total: trains.length,
      active: trains.filter(t => t.status !== 'INACTIVE').length,
      warning: trains.filter(t => t.status === 'WARNING').length,
    };
  }
}));
