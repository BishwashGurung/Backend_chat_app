import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server);

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId != "undefined") {
        userSocketMap[userId] = socket.id;
    }
    console.log(`userId is ${userId}`);

    // io.emit() is used to send event to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));


	// for video call
    socket.on("callUser", (data) => {
        const receiverSocketId = getReceiverSocketId(data.receiverId);
        if (receiverSocketId) {
            socket.to(receiverSocketId).emit("callMade", {
                offer: data.offer,
                socket: socket.id,
            });
        }
    });

    socket.on("makeAnswer", (data) => {
        socket.to(data.to).emit("answerMade", {
            answer: data.answer,
        });
    });

    socket.on("iceCandidate", (data) => {
        socket.to(data.to).emit("iceCandidate", {
            candidate: data.candidate,
        });
    });

    socket.on("endCall", (data) => {
        socket.to(data.to).emit("callEnded");
    });

    // socket.on() is used to listen to events, can be used both on client and server side.
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
