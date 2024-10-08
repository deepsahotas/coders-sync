const express = require('express');
const http = require('http');
const app = express();
const ACTIONS = require('./src/Actions');

const server = http.createServer(app);
const { Server } = require('socket.io');
const path = require('path');

app.use(express.static('build'));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const io = new Server(server);

const userSocketMap = {};

function getAllConnectedClient(roomId) {
  //always return map so convert it into array
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClient(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {
      code,
    });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, {
      code,
    });
  });

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const port = process.env.PORT || 5001;
server.listen(port, () => {
  console.log(`Server started on ${port}`);
});
