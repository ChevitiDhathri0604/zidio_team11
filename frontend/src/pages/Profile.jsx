import React from 'react';

export function Profile({ user }) {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-extrabold text-white">User Profile</h1>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-3xl text-white">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.name || 'User Profile'}</h2>
            <p className="text-slate-400 text-sm">{user?.email || 'user@example.com'}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-bold rounded-lg">
              IntellMeet Verified Account
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base">Account Security & Role</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-xs">Role</span>
              <span className="text-white font-semibold">{user?.role || 'Member'}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-xs">JWT Security Token</span>
              <span className="text-emerald-400 font-semibold">Active & Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
