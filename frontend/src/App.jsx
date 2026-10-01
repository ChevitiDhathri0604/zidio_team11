import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/api';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { MeetingRoom } from './pages/MeetingRoom';
import { MeetingWorkspace } from './pages/MeetingWorkspace';
import { ActionTaskBoard } from './pages/ActionTaskBoard';
import { Profile } from './pages/Profile';

export function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
        <Navbar user={user} onLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />

          {/* Authenticated Application Routes with Sidebar Layout */}
          <Route
            path="/*"
            element={
              user ? (
                <div className="flex">
                  <Sidebar />
                  <main className="flex-1 min-h-[calc(100vh-73px)]">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard user={user} />} />
                      <Route path="/history" element={<Dashboard user={user} />} />
                      <Route path="/workspace/:id" element={<MeetingWorkspace />} />
                      <Route path="/tasks" element={<ActionTaskBoard />} />
                      <Route path="/profile" element={<Profile user={user} />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Dedicated Fullscreen Meeting Room */}
          <Route
            path="/room/:code"
            element={user ? <MeetingRoom user={user} /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
