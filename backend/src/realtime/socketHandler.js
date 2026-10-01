const setupSocketIO = (io) => {
  const rooms = {};

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join room
    socket.on('join-room', ({ roomId, userId, userName }) => {
      socket.join(roomId);
      if (!rooms[roomId]) rooms[roomId] = [];
      
      const existingUser = rooms[roomId].find(u => u.userId === userId);
      if (!existingUser) {
        rooms[roomId].push({ socketId: socket.id, userId, userName, isAudioOn: true, isVideoOn: true });
      }

      // Broadcast updated participant list
      io.to(roomId).emit('room-participants', rooms[roomId]);
      socket.to(roomId).emit('user-joined', { socketId: socket.id, userId, userName });
    });

    // WebRTC Signaling
    socket.on('sending-signal', ({ userToSignal, callerId, signal }) => {
      io.to(userToSignal).emit('user-signaled', { signal, callerId });
    });

    socket.on('returning-signal', ({ signal, callerId }) => {
      io.to(callerId).emit('receiving-returned-signal', { signal, id: socket.id });
    });

    // Real-Time Chat Message
    socket.on('send-message', ({ roomId, text, sender }) => {
      const msg = { text, sender, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      io.to(roomId).emit('receive-message', msg);
    });

    // Live Transcript Stream
    socket.on('stream-transcript', ({ roomId, speaker, text }) => {
      const transcriptData = { speaker, text, timestamp: new Date().toLocaleTimeString() };
      io.to(roomId).emit('receive-transcript', transcriptData);
    });

    // Toggle Audio/Video Status
    socket.on('toggle-media-status', ({ roomId, userId, isAudioOn, isVideoOn }) => {
      if (rooms[roomId]) {
        rooms[roomId] = rooms[roomId].map(user => {
          if (user.userId === userId) {
            return { ...user, isAudioOn, isVideoOn };
          }
          return user;
        });
        io.to(roomId).emit('room-participants', rooms[roomId]);
      }
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      for (const roomId in rooms) {
        rooms[roomId] = rooms[roomId].filter(user => user.socketId !== socket.id);
        io.to(roomId).emit('room-participants', rooms[roomId]);
      }
    });
  });
};

module.exports = setupSocketIO;
