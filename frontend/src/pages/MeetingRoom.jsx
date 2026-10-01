import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { meetingService, aiService } from '../services/api';

export function MeetingRoom({ user }) {
  const { code } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [speechInput, setSpeechInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [permissionError, setPermissionError] = useState('');

  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const socketRef = useRef();
  const localVideoRef = useRef();
  const localStreamRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Request Camera & Microphone streams with explicit fallback
    const initMedia = async () => {
      try {
        setPermissionError('');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Full media stream access error:', err);
        // Try audio-only or video-only fallback if permission denied or device busy
        try {
          const videoOnlyStream = await navigator.mediaDevices.getUserMedia({ video: true });
          localStreamRef.current = videoOnlyStream;
          if (localVideoRef.current) localVideoRef.current.srcObject = videoOnlyStream;
        } catch (vErr) {
          setPermissionError('Camera / Microphone permission denied or device in use by another app. Please allow permissions in your browser URL bar.');
        }
      }
    };

    initMedia();

    // Setup WebSpeech API Voice Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const lastIndex = event.results.length - 1;
        const spokenText = event.results[lastIndex][0].transcript;
        if (spokenText.trim()) {
          socketRef.current.emit('stream-transcript', {
            roomId: code,
            speaker: user?.name || 'Guest',
            text: spokenText
          });
        }
      };

      recognition.onend = () => {
        if (isListening) {
          try { recognition.start(); } catch (e) {}
        }
      };

      recognitionRef.current = recognition;
    }

    // Connect Socket.io signaling
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('join-room', {
      roomId: code,
      userId: user?._id || Math.random().toString(),
      userName: user?.name || 'Guest'
    });

    socketRef.current.on('room-participants', (users) => setParticipants(users));
    socketRef.current.on('receive-message', (msg) => setMessages((prev) => [...prev, msg]));
    socketRef.current.on('receive-transcript', (data) => setTranscript((prev) => [...prev, data]));

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [code, user]);

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
      }
    }
    setIsAudioOn(!isAudioOn);
    socketRef.current.emit('toggle-media-status', {
      roomId: code,
      userId: user?._id,
      isAudioOn: !isAudioOn,
      isVideoOn
    });
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
      }
    }
    setIsVideoOn(!isVideoOn);
    socketRef.current.emit('toggle-media-status', {
      roomId: code,
      userId: user?._id,
      isAudioOn,
      isVideoOn: !isVideoOn
    });
  };

  const startScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
        setIsScreenSharing(true);

        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          if (localVideoRef.current && localStreamRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
          }
        };
      } else {
        setIsScreenSharing(false);
        if (localVideoRef.current && localStreamRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }
      }
    } catch (err) {
      console.warn('Screen sharing error:', err);
    }
  };

  const toggleLiveSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition requires Google Chrome or Microsoft Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(true);
      }
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!chatInput) return;
    socketRef.current.emit('send-message', {
      roomId: code,
      text: chatInput,
      sender: user?.name || 'Guest'
    });
    setChatInput('');
  };

  const addSpeechTranscript = (e) => {
    e.preventDefault();
    if (!speechInput) return;
    socketRef.current.emit('stream-transcript', {
      roomId: code,
      speaker: user?.name || 'Guest',
      text: speechInput
    });
    setSpeechInput('');
  };

  const endMeetingAndAnalyze = async () => {
    try {
      const meetings = await meetingService.getUserMeetings();
      const current = meetings.find(m => m.code === code.toUpperCase());
      const transcriptText = transcript.map(t => `${t.speaker}: ${t.text}`).join('\n');

      if (current) {
        await aiService.summarizeMeeting(current._id, transcriptText);
        navigate(`/workspace/${current._id}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="h-[calc(100vh-73px)] bg-slate-950 flex flex-col justify-between overflow-hidden">
      {/* Top Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="font-bold text-white text-lg flex items-center gap-2">
              <span>Meeting Code:</span>
              <span className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 font-mono text-indigo-400">
                {code}
              </span>
            </h2>
            <span className="text-xs text-indigo-400 font-medium">🔴 Live WebRTC & Socket Session</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyInviteLink}
              className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 font-bold rounded-xl text-xs transition"
            >
              🔗 {copied ? 'Link Copied!' : 'Copy Invite Link'}
            </button>
            <button
              onClick={copyCode}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition"
            >
              📋 Copy Code
            </button>
          </div>
        </div>

        <button
          onClick={endMeetingAndAnalyze}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-500 font-bold text-white rounded-xl shadow-lg shadow-red-600/30 text-xs transition"
        >
          End Meeting & Generate AI Workspace 🧠
        </button>
      </div>

      {/* Permission Warning Banner if blocked */}
      {permissionError && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-2 text-amber-300 text-xs font-semibold text-center">
          ⚠️ {permissionError}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 overflow-hidden">
        {/* Left: Video Grid */}
        <div className="lg:col-span-3 bg-slate-900/50 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto">
            {/* Local Stream Card */}
            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden min-h-[240px] flex items-center justify-center">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${!isVideoOn ? 'hidden' : 'block'}`}
              />
              {!isVideoOn && (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-3xl text-slate-400">
                    👤
                  </div>
                  <span className="text-xs text-slate-500">Camera Turned Off</span>
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 px-3 py-1 rounded-lg text-xs font-semibold text-white border border-slate-800">
                {user?.name || 'You'} (Host)
              </div>
            </div>

            {/* Remote Participants */}
            {participants.filter(p => p.userId !== user?._id).map((p, idx) => (
              <div key={idx} className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden min-h-[240px] flex items-center justify-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-20 h-20 rounded-full bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-3xl text-indigo-400">
                    👤
                  </div>
                  <span className="text-xs text-slate-300 font-semibold">{p.userName}</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-900/90 px-3 py-1 rounded-lg text-xs font-semibold text-white border border-slate-800">
                  {p.userName}
                </div>
              </div>
            ))}
          </div>

          {/* Meeting Controls Bar */}
          <div className="flex justify-center items-center space-x-4 pt-4 border-t border-slate-800">
            <button
              onClick={toggleAudio}
              className={`px-5 py-3 rounded-2xl font-bold text-xs transition ${isAudioOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600 text-white hover:bg-red-500'}`}
            >
              {isAudioOn ? '🎙️ Mic On' : '🔇 Mic Muted'}
            </button>

            <button
              onClick={toggleVideo}
              className={`px-5 py-3 rounded-2xl font-bold text-sm transition ${isVideoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600 text-white hover:bg-red-500'}`}
            >
              {isVideoOn ? '📹 Camera On' : '📷 Camera Off'}
            </button>

            <button
              onClick={startScreenShare}
              className={`px-5 py-3 rounded-2xl font-bold text-xs transition ${isScreenSharing ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              🖥️ {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
            </button>

            <button
              onClick={toggleLiveSpeechRecognition}
              className={`px-5 py-3 rounded-2xl font-bold text-xs transition ${isListening ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              🎤 {isListening ? 'Listening Live Voice...' : 'Enable Speech AI'}
            </button>
          </div>
        </div>

        {/* Right Side Panel: Chat & Real-Time Speech Stream */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between overflow-hidden space-y-4">
          <div className="space-y-2 border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-indigo-400 uppercase">🎤 Live Speech Stream</span>
            <form onSubmit={addSpeechTranscript} className="flex gap-2">
              <input
                type="text"
                value={speechInput}
                onChange={(e) => setSpeechInput(e.target.value)}
                placeholder="Type or speak statement..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-600"
              />
              <button type="submit" className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl">
                Add
              </button>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Real-Time Transcript</span>
            {transcript.map((t, idx) => (
              <div key={idx} className="bg-slate-950 p-2 rounded-xl text-xs text-slate-300 border border-slate-800">
                <strong className="text-indigo-400">{t.speaker}:</strong> {t.text}
              </div>
            ))}
          </div>

          <div className="flex-1 border-t border-slate-800 pt-3 flex flex-col justify-between overflow-hidden">
            <span className="text-xs font-semibold text-slate-500 uppercase mb-2">Live Chat</span>
            <div className="flex-1 overflow-y-auto space-y-2 mb-2">
              {messages.map((m, idx) => (
                <div key={idx} className="bg-slate-950/80 p-2 rounded-xl text-xs text-slate-300">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <strong>{m.sender}</strong>
                    <span>{m.timestamp}</span>
                  </div>
                  <p className="mt-1 text-white">{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Send message..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600"
              />
              <button type="submit" className="px-3 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
