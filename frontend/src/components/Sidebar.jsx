import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'My Meetings', path: '/history', icon: '📹' },
    { label: 'Action Tasks', path: '/tasks', icon: '✅' },
    { label: 'Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-[calc(100vh-73px)] p-4 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/50">
        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 mb-1">
          <span>🤖 AI Active</span>
        </div>
        <p className="text-xs text-slate-400">
          IntellMeet Intelligence Engine ready for real-time transcription and analysis.
        </p>
      </div>
    </aside>
  );
}
