import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';

export function ActionTaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await taskService.updateTask(id, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Extracted Action Tasks</h1>
        <p className="text-slate-400 text-sm">Automated tasks extracted from meeting discussions.</p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-500">Loading tasks...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Pending', 'In Progress', 'Completed'].map((status) => {
            const filtered = tasks.filter(t => t.status === status);
            return (
              <div key={status} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <h3 className="font-bold text-white text-lg">{status}</h3>
                  <span className="px-2.5 py-1 bg-slate-800 text-slate-400 text-xs font-bold rounded-lg">
                    {filtered.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {filtered.map((t) => (
                    <div key={t._id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                      <h4 className="font-bold text-white text-sm">{t.title}</h4>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>👤 {t.assignee}</span>
                        <span>🗓️ {t.dueDate}</span>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-900">
                        {status !== 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(t._id, 'Pending')}
                            className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] rounded-lg"
                          >
                            Move to Pending
                          </button>
                        )}
                        {status !== 'Completed' && (
                          <button
                            onClick={() => handleStatusChange(t._id, 'Completed')}
                            className="px-2 py-1 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-lg"
                          >
                            Mark Complete ✓
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
