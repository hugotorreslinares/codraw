import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Adjust this to match your client URL
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: "http://localhost:5173" // Adjust this to match your client URL
}));
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('startDrawing', (data) => {
        socket.broadcast.emit('startDrawing', data);
    });

    socket.on('stopDrawing', () => {
        socket.broadcast.emit('stopDrawing');
    });
    socket.on('clearCanvas', () => {
        socket.broadcast.emit('clearCanvas');
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});