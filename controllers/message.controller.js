import { Op } from "sequelize";
import { Message } from "../models/models.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const getMessages = async (req, res) => {
    try {
        let { id } = req.params;
        const userToChatId = Number(id);
        const senderId = req.user.id;
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    {
                        senderId: senderId,
                        receiverId: userToChatId
                    },
                    {
                        senderId: userToChatId,
                        receiverId: senderId
                    }
                ]
            },
            order: [['createdAt', 'ASC']]
        });
        res.status(200).json(messages);
    } catch (error) {
        console.log(`Error in get Messages controller: `, error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        let { id } = req.params;
        const receiverId = Number(id);
        const senderId = req.user.id;
        const newMessage = await Message.create({
            message,
            senderId,
            receiverId,
        });
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    } catch (error) {
        console.log(`Error in send Message controller: `, error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};
