const app = require('express');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  socket.on('chat', (payload) => {
    io.emit('chat', payload);
    setTimeout(() => {
      io.emit('chat', {
        id: 'server',
        msg: 'you said: ' + payload.msg,
        time: new Date(),
      });
    }, 2000);
  });
});

server.listen(8080, function () {
  console.log('listening on port 8080');
});
