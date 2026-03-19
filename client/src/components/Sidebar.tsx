import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Mic, BarChart2, History, Trophy, LogOut, User, Settings, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/domain-selection', icon: <Mic size={20} />, label: 'Mock Interview' },
    { path: '/analytics', icon: <BarChart2 size={20} />, label: 'Analytics' },
    { path: '/community', icon: <Users size={20} />, label: 'Community' },
    { path: '/profile', icon: <User size={20} />, label: 'Profile' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-[var(--color-brand-panel)] border-r border-[#2A2A35] h-screen flex flex-col hidden md:flex sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-primary -webkit-background-clip-text text-transparent bg-clip-text text-gradient">
          InterviewX
        </h1>
        <p className="text-xs text-[var(--color-brand-text-secondary)] mt-1 tracking-widest uppercase">
          Practice. Improve. Hired.
        </p>
      </div>

      <div className="px-4 mb-6">
        <div className="bg-[#0F0F14] p-3 rounded-xl border border-[#2A2A35] flex items-center justify-between">
          <NavLink to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-white shadow-lg glow-primary">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold truncate w-24">{user?.name}</p>
              <p className="text-xs text-[var(--color-brand-text-secondary)]">View Profile</p>
            </div>
          </NavLink>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-primary text-white font-medium glow-primary'
                  : 'text-[var(--color-brand-text-secondary)] hover:bg-[#2A2A35] hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#2A2A35]">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
