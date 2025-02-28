const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

let streamerSocket = null;

io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('offer', (offer) => {
        if (streamerSocket) {
            streamerSocket.emit('offer', offer);
        }
    });

    socket.on('answer', (answer) => {
        socket.broadcast.emit('answer', answer);
    });

    socket.on('candidate', (candidate) => {
        socket.broadcast.emit('candidate', candidate);
    });

    socket.on('startStreaming', () => {
        streamerSocket = socket;
        console.log('Streamer connected:', socket.id);
    });

    socket.on('disconnect', () => {
        if (socket === streamerSocket) {
            streamerSocket = null;
        }
        console.log('User disconnected:', socket.id);
    });
});

server.listen(5000, () => {
    console.log('Server running at http://localhost:5000');
});
