import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { meetingService, taskService } from '../services/api';

export function Dashboard({ user }) {
  const [meetings, setMeetings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [scheduleTitle, setScheduleTitle] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mRes, tRes] = await Promise.all([
        meetingService.getUserMeetings(),
        taskService.getTasks()
      ]);
      setMeetings(mRes);
      setTasks(tRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    try {
      const newMeeting = await meetingService.createMeeting(newTitle);
      navigate(`/room/${newMeeting.code}`);
    } catch (err) {
      setError('Failed to create meeting.');
    }
  };

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    if (!scheduleTitle || !scheduleTime) return;
    try {
      await meetingService.createMeeting(scheduleTitle, scheduleTime);
      setScheduleTitle('');
      setScheduleTime('');
      setSuccessMsg('🎉 Meeting scheduled successfully!');
      fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError('Failed to schedule meeting.');
    }
  };

  const handleJoinMeeting = async (e) => {
    e.preventDefault();
    if (!joinCode) return;
    try {
      await meetingService.joinMeeting(joinCode);
      navigate(`/room/${joinCode.toUpperCase()}`);
    } catch (err) {
      setError('Meeting not found with given code.');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">
            Welcome back, {user?.name || 'Collaborator'}! 👋
          </h1>
          <p className="text-slate-400 text-sm">
            Schedule meetings for future dates or launch instant real-time rooms.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-sm font-semibold">
          {successMsg}
        </div>
      )}

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Instant Meeting */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 text-indigo-400 font-bold text-lg">
            <span>📹 Instant Meeting</span>
          </div>
          <form onSubmit={handleCreateMeeting} className="space-y-3">
            <input
              type="text"
              placeholder="Meeting topic..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-bold text-white rounded-xl shadow-lg shadow-indigo-600/30 transition text-sm"
            >
              Launch Room Now
            </button>
          </form>
        </div>

        {/* Schedule Meeting for Particular Time */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 text-emerald-400 font-bold text-lg">
            <span>📅 Schedule for Specific Time</span>
          </div>
          <form onSubmit={handleScheduleMeeting} className="space-y-3">
            <input
              type="text"
              required
              placeholder="Meeting title..."
              value={scheduleTitle}
              onChange={(e) => setScheduleTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm"
            />
            <input
              type="datetime-local"
              required
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm"
            />
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded-xl shadow-lg shadow-emerald-600/30 transition text-sm"
            >
              Confirm Schedule 📅
            </button>
          </form>
        </div>

        {/* Join Meeting */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center space-x-3 text-purple-400 font-bold text-lg">
            <span>🔑 Join with Code</span>
          </div>
          <form onSubmit={handleJoinMeeting} className="space-y-3">
            <input
              type="text"
              placeholder="Enter 6-character code..."
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white uppercase placeholder-slate-600 focus:outline-none focus:border-purple-500 text-sm"
            />
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 font-bold text-white rounded-xl shadow-lg shadow-purple-600/30 transition text-sm"
            >
              Join Meeting
            </button>
          </form>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="text-slate-400 text-xs font-semibold uppercase mb-1">Total Meetings</div>
          <div className="text-3xl font-extrabold text-white">{meetings.length}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="text-slate-400 text-xs font-semibold uppercase mb-1">Pending Actions</div>
          <div className="text-3xl font-extrabold text-amber-400">
            {tasks.filter(t => t.status === 'Pending').length}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="text-slate-400 text-xs font-semibold uppercase mb-1">Completed Tasks</div>
          <div className="text-3xl font-extrabold text-emerald-400">
            {tasks.filter(t => t.status === 'Completed').length}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="text-slate-400 text-xs font-semibold uppercase mb-1">AI Summaries</div>
          <div className="text-3xl font-extrabold text-indigo-400">{meetings.length}</div>
        </div>
      </div>

      {/* Scheduled & Recent Meetings List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Scheduled & Upcoming Meetings</h3>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-500 text-sm">Loading meetings data...</div>
        ) : meetings.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            No meetings found. Schedule a meeting for a specific date and time above!
          </div>
        ) : (
          <div className="space-y-3">
            {meetings.map((m) => {
              const scheduledDate = m.scheduledAt ? new Date(m.scheduledAt) : new Date(m.createdAt);
              const isFuture = scheduledDate > new Date();

              return (
                <div
                  key={m._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition gap-4"
                >
                  <div>
                    <div className="flex items-center space-x-3">
                      <h4 className="font-bold text-white text-base">{m.title}</h4>
                      {isFuture && (
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-md uppercase">
                          Upcoming
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                      <span>Code: <strong className="text-indigo-400">{m.code}</strong></span>
                      <span>•</span>
                      <span>Scheduled: <strong className="text-slate-200">{scheduledDate.toLocaleString()}</strong></span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      to={`/workspace/${m._id}`}
                      className="px-4 py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-xl text-xs font-bold transition"
                    >
                      🧠 AI Workspace
                    </Link>
                    <Link
                      to={`/room/${m.code}`}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
                    >
                      Join Room
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
