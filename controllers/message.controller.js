import { Op } from "sequelize";
import { User, Conversation, Message } from "../models/models.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;
        const conversation = await Conversation.findOne({
            where: {
                [Op.and]: [
                    { "$participants.id$": senderId },
                    { "$participants.id$": userToChatId },
                ],
            },
            include: [
                {
                    model: User,
                    as: "participants",
                    through: { attributes: [] },
                },
                {
                    model: Message,
                    as: "messages",
                },
            ],
        });
        if (!conversation) {
            return res.status(200).json([]);
        }
        const messages = conversation.messages;
        res.status(200).json(messages);
    } catch (error) {
        console.log(`Error in get Messages controller: `, error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;
        let conversation = await Conversation.findOne({
            where: {
                [Op.and]: [
                    { "$participants.id$": senderId },
                    { "$participants.id$": receiverId },
                ],
            },
            include: [
                {
                    model: User,
                    as: "participants",
                    through: { attributes: [] },
                },
            ],
        });
        if (!conversation) {
            conversation = await Conversation.create();
            await conversation.addParticipants([senderId, receiverId]);
        }
        const newMessage = await Message.create({
            message,
            senderId,
            receiverId,
            conversationId: conversation.id,
        });
        if (newMessage) {
            await conversation.addMessage(newMessage);
        }
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
