import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";

import sequelize from "./config/database.js";
import { app, server } from "./socket/socket.js";

dotenv.config();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
    res.send("Hello form the server!!!");
});

sequelize.sync().then(() => {
    console.log("Connected to the database.");
    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    })
});

