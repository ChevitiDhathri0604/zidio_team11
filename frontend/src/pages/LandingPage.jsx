import React from 'react';
import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8">
          <span>⚡ IntellMeet 2.0 AI Meeting Platform</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          Transform Meetings into Structured Knowledge & Action.
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Real-time video conferencing with instant AI transcripts, automated summary generation, key decision extraction, and Ask Your Meeting intelligence.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/register"
            className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-lg shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
          >
            Start Free Meeting 🚀
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 font-semibold text-slate-200 border border-slate-700 text-lg transition"
          >
            Sign In to Dashboard
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <div className="text-4xl mb-4">📹</div>
          <h3 className="text-xl font-bold mb-2">Real-Time HD Video & Audio</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            WebRTC audio, video, screen share, and live participant messaging with low-latency signaling.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <div className="text-4xl mb-4">🧠</div>
          <h3 className="text-xl font-bold mb-2">Structured AI Analysis</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Automatic extraction of key discussion points, decisions, and action items with deadlines and assignees.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-xl font-bold mb-2">Ask Your Meeting AI</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Query your transcript in natural language to instantly find architectural decisions, assignees, or deadlines.
          </p>
        </div>
      </div>

      <footer className="border-t border-slate-900 py-8 text-center text-slate-600 text-sm">
        © 2026 IntellMeet Platform. Built with React, Express, WebRTC & OpenAI.
      </footer>
    </div>
  );
}
