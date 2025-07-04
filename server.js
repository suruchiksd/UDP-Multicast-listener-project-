const dgram = require('dgram');
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const MCAST_ADDR = '224.1.1.1';
const MCAST_PORT = 5007;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

const udpSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

udpSocket.bind(MCAST_PORT, () => {
  udpSocket.addMembership(MCAST_ADDR);
  console.log(`Listening for multicast on ${MCAST_ADDR}:${MCAST_PORT}`);
});

udpSocket.on('message', (msg, rinfo) => {
  const packet = msg.toString();
  console.log(`Received: ${packet}`);
  io.emit('packet', packet);
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});