import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

export function Login({ setUser }) {
  const [authMode, setAuthMode] = useState('otp'); // 'otp' or 'password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await authService.requestOTP(email);
      setOtpSent(true);
      setSuccess(res.message || `OTP sent to ${email}. Check your inbox.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };


  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otpCode) return;
    setLoading(true);
    setError('');
    try {
      const data = await authService.verifyOTP(email, otpCode);
      setUser(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authService.login({ email, password });
      setUser(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white text-center mb-1">Welcome Back</h2>
          <p className="text-slate-400 text-sm text-center">Sign in to your IntellMeet account</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => { setAuthMode('otp'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${authMode === 'otp' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            🔑 One-Time Password (OTP)
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('password'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${authMode === 'password' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            🔒 Password Login
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        {success && !error && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center">
            ✅ {success}
          </div>
        )}

        {authMode === 'otp' ? (
          !otpSent ? (
            /* Step 1: Request OTP for Any Mail */
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Any Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition text-sm"
                  placeholder="name@company.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-lg shadow-indigo-600/30 transition text-sm disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send One-Time Password 🚀'}
              </button>
            </form>
          ) : (
            /* Step 2: Enter OTP Code */
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-center space-y-1">
                <span className="text-xs text-indigo-300">OTP Sent to: <strong className="text-white">{email}</strong></span>
                <p className="text-xs text-slate-400 mt-1">📬 Check your inbox (and spam folder)</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Enter 6-Digit Verification OTP</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white tracking-widest text-center font-mono text-lg placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="123456"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-lg shadow-emerald-600/30 transition text-sm disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP & Access Account ✓'}
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-xs text-slate-400 hover:text-white transition text-center"
              >
                ← Change Email
              </button>
            </form>
          )
        ) : (
          /* Password Login */
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition text-sm"
                placeholder="alex@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-lg shadow-indigo-600/30 transition text-sm disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        <p className="text-slate-500 text-xs text-center mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-medium hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
