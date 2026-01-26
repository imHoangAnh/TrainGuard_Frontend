import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Trash2, Plus, Users, X, Shield } from 'lucide-react';

export default function UsersPage() {
  const { users, addUser, removeUser, fetchUsers } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    role: 'User',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      removeUser(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addUser(formData);
    setIsModalOpen(false);
    setFormData({ username: '', name: '', role: 'User', password: '' });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-rail-primary to-rail-secondary bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-rail-muted text-sm">Manage system access and roles</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-rail-primary text-black font-bold px-4 py-2 rounded-lg hover:bg-rail-primary/90 flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      <div className="bg-rail-panel border border-rail-border rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-rail-darker text-rail-muted text-xs uppercase tracking-wider border-b border-rail-border">
              <th className="p-4">Name</th>
              <th className="p-4">Username</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rail-border/50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold text-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rail-dark border border-rail-border flex items-center justify-center text-xs text-rail-primary">
                    {user.name.charAt(0)}
                  </div>
                  {user.name}
                </td>
                <td className="p-4 text-rail-muted">@{user.username}</td>
                <td className="p-4">
                  <span className="flex items-center gap-1 text-xs font-mono bg-rail-darker border border-rail-border px-2 py-1 rounded w-fit text-rail-secondary">
                    <Shield size={12} />
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-rail-muted hover:text-rail-critical transition-colors p-2 hover:bg-rail-critical/10 rounded"
                    disabled={user.username === 'admin'}
                    title={user.username === 'admin' ? "Cannot delete root admin" : "Delete User"}
                  >
                    <Trash2 size={18} className={user.username === 'admin' ? 'opacity-50' : ''} />
                  </button>
                </td>
              </tr>
            ))}
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
              <Users className="text-rail-primary" />
              Add New User
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-rail-muted mb-1">FULL NAME</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-rail-dark border border-rail-border rounded p-2 focus:border-rail-primary focus:outline-none"
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-rail-muted mb-1">USERNAME</label>
                <input
                  required
                  type="text"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-rail-dark border border-rail-border rounded p-2 focus:border-rail-primary focus:outline-none"
                  placeholder="janedoe"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-rail-muted mb-1">ROLE</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-rail-dark border border-rail-border rounded p-2 focus:border-rail-primary focus:outline-none text-white"
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                  <option value="Captain">Captain</option>
                  <option value="Driver">Driver</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-rail-muted mb-1">PASSWORD</label>
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-rail-dark border border-rail-border rounded p-2 focus:border-rail-primary focus:outline-none"
                  placeholder="password123"
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
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
