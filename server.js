import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Vite's default development port
        methods: ["GET", "POST"]
    }
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

io.on('connection', (socket) => {
    console.log('User connected');

    // Handle drawing events
    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});