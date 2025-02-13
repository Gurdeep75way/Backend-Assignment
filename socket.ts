import { Server } from "socket.io";
import http from "http";
import { app } from './index';  // Assuming Express is initialized in index.ts

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

export { server, io };
