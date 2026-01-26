import React, { useEffect, useState } from 'react';
import { useTrainStore } from '../store/useTrainStore';
import { Trash2, Plus, Train, X, Search } from 'lucide-react';
import { clsx } from 'clsx';

export default function DevicesPage() {
  const { trains, removeTrain, addTrain, fetchTrains } = useTrainStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    device_id: '',
    driver_name: '',
    route: '',
    description: '',
    status: 'NORMAL'
  });

  useEffect(() => {
    fetchTrains();
  }, []);

  const handleDelete = (train) => {
    const id = train.id ?? train.device_id;
    if (window.confirm(`Are you sure you want to delete Train ${train.device_id}?`)) {
      removeTrain(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTrain(formData);
    setIsModalOpen(false);
    setFormData({ device_id: '', driver_name: '', route: '', description: '', status: 'NORMAL' });
  };

  const filteredTrains = trains.filter(t =>
    t.device_id.includes(searchTerm) ||
    t.driver_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-rail-primary to-rail-secondary bg-clip-text text-transparent">
            Device Management
          </h1>
          <p className="text-rail-muted text-sm">Manage fleet devices and configurations</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-rail-primary text-black font-bold px-4 py-2 rounded-lg hover:bg-rail-primary/90 flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Device
        </button>
      </div>

      {/* Toolbar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-rail-muted" />
          <input
            type="text"
            placeholder="Search devices..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-rail-panel border border-rail-border rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-rail-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-rail-panel border border-rail-border rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-rail-darker text-rail-muted text-xs uppercase tracking-wider border-b border-rail-border">
              <th className="p-4">Device ID</th>
              <th className="p-4">Driver</th>
              <th className="p-4">Route</th>
              <th className="p-4">Status</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rail-border/50">
            {filteredTrains.map((train) => (
              <tr key={train.device_id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono font-bold text-white">#{train.device_id}</td>
                <td className="p-4">{train.driver_name}</td>
                <td className="p-4 text-rail-muted">{train.route}</td>
                <td className="p-4">
                  <span className={clsx(
                    "px-2 py-1 rounded text-xs font-bold",
                    {
                      'bg-rail-success/10 text-rail-success': train.status === 'NORMAL',
                      'bg-rail-muted/10 text-rail-muted': train.status === 'INACTIVE',
                    }
                  )}>
                    {train.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-rail-muted truncate max-w-[200px]">{train.description || '-'}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(train)}
                    className="text-rail-muted hover:text-rail-critical transition-colors p-2 hover:bg-rail-critical/10 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredTrains.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-rail-muted">No devices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-rail-panel border border-rail-border w-full max-w-md rounded-xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-rail-muted hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Train className="text-rail-primary" />
              Add New Device
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-rail-muted mb-1">DEVICE ID</label>
                <input
                  required
                  type="text"
                  value={formData.device_id}
                  onChange={e => setFormData({ ...formData, device_id: e.target.value })}
                  className="w-full bg-rail-dark border border-rail-border rounded p-2 focus:border-rail-primary focus:outline-none"
                  placeholder="e.g. 05"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-rail-muted mb-1">DRIVER NAME</label>
                  <input
                    required
                    type="text"
                    value={formData.driver_name}
                    onChange={e => setFormData({ ...formData, driver_name: e.target.value })}
                    className="w-full bg-rail-dark border border-rail-border rounded p-2 focus:border-rail-primary focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-rail-muted mb-1">STATUS</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-rail-dark border border-rail-border rounded p-2 focus:border-rail-primary focus:outline-none text-white"
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-rail-muted mb-1">ROUTE</label>
                <input
                  required
                  type="text"
                  value={formData.route}
                  onChange={e => setFormData({ ...formData, route: e.target.value })}
                  className="w-full bg-rail-dark border border-rail-border rounded p-2 focus:border-rail-primary focus:outline-none"
                  placeholder="e.g. Center Line"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-rail-muted mb-1">DESCRIPTION</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-rail-dark border border-rail-border rounded p-2 focus:border-rail-primary focus:outline-none h-20 resize-none"
                  placeholder="Optional details..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded bg-rail-darker border border-rail-border hover:bg-rail-border/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded bg-rail-primary text-black font-bold hover:bg-rail-primary/90 transition-colors"
                >
                  Create Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
