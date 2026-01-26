import { create } from 'zustand';
import { apiRequest } from '../services/api';

const mapApiUserToUser = (user) => ({
  id: user.id,
  username: user.username,
  role: user.role,
  name: user.full_name ?? ''
});

export const useAuthStore = create((set, get) => ({
  user: null, // Current user
  users: [], // List of all users
  isAuthenticated: false,
  isLoading: false,

  login: async (username, password) => {
    try {
      set({ isLoading: true });
      const result = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });

      if (result?.success && result?.data) {
        const user = mapApiUserToUser(result.data);
        set({ user, isAuthenticated: true, isLoading: false });
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      set({ isLoading: false });
      return false;
    }
  },

  logout: () => set({ user: null, isAuthenticated: false }),

  // User Management Actions
  fetchUsers: async () => {
    try {
      const result = await apiRequest('/users');
      const users = result?.data ?? [];
      set({ users: users.map(mapApiUserToUser) });
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  },

  addUser: async (newUser) => {
    try {
      const payload = {
        username: newUser.username,
        password: newUser.password,
        role: newUser.role,
        full_name: newUser.name
      };

      const result = await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const createdUser = result?.data ?? payload;

      set(state => ({
        users: [...state.users, mapApiUserToUser(createdUser)]
      }));
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  },

  removeUser: async (id) => {
    try {
      await apiRequest(`/users/${id}`, { method: 'DELETE' });
      set(state => ({
        users: state.users.filter(u => u.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  },
}));
