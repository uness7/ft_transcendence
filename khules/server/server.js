const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// Configuration de CORS pour Socket.io
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8081",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('message', (message) => {
    console.log('Message received:', message);
    io.emit('message', message); // Diffuse le message a tous les clients
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
