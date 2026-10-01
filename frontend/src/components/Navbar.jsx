import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20">
          ⚡
        </div>
        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          IntellMeet
        </span>
      </Link>

      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <Link to="/dashboard" className="text-slate-300 hover:text-white font-medium text-sm transition">
              Dashboard
            </Link>
            <Link to="/tasks" className="text-slate-300 hover:text-white font-medium text-sm transition">
              Action Tasks
            </Link>
            <div className="flex items-center space-x-4 pl-4 border-l border-slate-800">
              <span className="text-sm font-medium text-indigo-400">👤 {user.name}</span>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition"
              >
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-300 hover:text-white font-medium text-sm transition">
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md shadow-indigo-600/30 transition"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
