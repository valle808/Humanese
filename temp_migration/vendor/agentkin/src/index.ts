import app from './app';
import { config } from './config';
import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.set('io', io);

// Socket.io connection handler stub
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Make io accessible globally or pass it to controllers
export { io };

server.listen(config.port, () => {
    console.log(`AgentKin Server running on port ${config.port}`);
    console.log(`Environment: ${config.env}`);
});

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
