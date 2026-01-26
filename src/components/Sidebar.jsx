import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Train, Users, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { clsx } from 'clsx';

export default function Sidebar() {
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) => clsx(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group",
        isActive
          ? "bg-rail-primary/10 text-rail-primary font-bold border border-rail-primary/20"
          : "text-rail-muted hover:bg-rail-border/30 hover:text-white"
      )}
    >
      <Icon size={20} className="group-hover:scale-110 transition-transform" />
      <span>{label}</span>
      {/* Active Indicator */}
      <div className="ml-auto w-1 h-1 rounded-full bg-current opacity-0 group-[.active]:opacity-100" />
    </NavLink>
  );

  return (
    <aside className="w-64 bg-rail-panel border-r border-rail-border h-screen flex flex-col fixed left-0 top-0 z-50">
      {/* Brand */}
      <div className="p-6 border-b border-rail-border/50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-rail-primary to-rail-secondary bg-clip-text text-transparent">
          TrainGuard
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/devices" icon={Train} label="Device Management" />
        <NavItem to="/users" icon={Users} label="User Management" />
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-rail-border/50 bg-rail-darker/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-rail-primary to-rail-secondary flex items-center justify-center font-bold text-black">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-bold truncate">{user?.name}</div>
            <div className="text-xs text-rail-muted truncate">{user?.role}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 justify-center px-4 py-2 rounded border border-rail-critical/30 text-rail-critical hover:bg-rail-critical/10 transition-colors text-sm font-bold"
        >
          <LogOut size={16} />
          Safe Logout
        </button>
      </div>
    </aside>
  );
}
