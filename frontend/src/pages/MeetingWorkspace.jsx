import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { aiService } from '../services/api';

export function MeetingWorkspace() {
  const { id } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    fetchWorkspace();
  }, [id]);

  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      const data = await aiService.getWorkspace(id);
      setWorkspace(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!question) return;
    try {
      setAsking(true);
      const res = await aiService.askAI(id, question);
      setAiAnswer(res.answer);
    } catch (err) {
      setAiAnswer("I couldn't find that information in this meeting.");
    } finally {
      setAsking(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading AI Workspace...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-2">
        <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold rounded-lg uppercase">
          🧠 Central AI Meeting Workspace
        </div>
        <h1 className="text-3xl font-extrabold text-white">{workspace?.title || 'Meeting Knowledge Base'}</h1>
        <p className="text-slate-400 text-sm">Automated transcript summarization, decision tracking, and Ask Your Meeting AI.</p>
      </div>

      {/* Unique Feature: Ask Your Meeting AI */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">💬</span>
          <h2 className="text-2xl font-bold text-white">Ask Your Meeting AI</h2>
        </div>

        <form onSubmit={handleAskAI} className="flex gap-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything (e.g. 'What did we decide about project architecture?')"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={asking}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 font-bold text-white rounded-2xl shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
          >
            {asking ? 'Querying...' : 'Ask AI'}
          </button>
        </form>

        {aiAnswer && (
          <div className="p-6 bg-slate-950/90 border border-indigo-500/40 rounded-2xl space-y-2">
            <span className="text-xs font-bold uppercase text-indigo-400">AI Response</span>
            <p className="text-slate-200 text-base leading-relaxed">{aiAnswer}</p>
          </div>
        )}
      </div>

      {/* Grid: Summary, Key Points, Decisions & Action Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Executive Summary */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📝</span> Executive Summary
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {workspace?.summary || 'No summary generated yet.'}
          </p>
        </div>

        {/* Key Discussion Points */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📌</span> Key Points
          </h3>
          <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
            {workspace?.keyPoints?.map((kp, idx) => (
              <li key={idx}>{kp}</li>
            )) || <li>No key points recorded.</li>}
          </ul>
        </div>

        {/* Key Decisions */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎯</span> Agreed Decisions
          </h3>
          <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
            {workspace?.decisions?.map((d, idx) => (
              <li key={idx}>{d}</li>
            )) || <li>No decisions extracted.</li>}
          </ul>
        </div>

        {/* Action Items */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>✅</span> Extracted Action Items
          </h3>
          <div className="space-y-3">
            {workspace?.actionItems?.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">{item.task}</h4>
                  <span className="text-xs text-slate-400">Assignee: {item.assignee}</span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-md">
                    {item.priority}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">Due: {item.deadline}</div>
                </div>
              </div>
            )) || <p className="text-sm text-slate-500">No action items.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
