import User from "./user.model.js";
import Conversation from "./conversation.model.js";
import Message from "./message.model.js";

User.belongsToMany(Conversation, { through: "UserConversations", as: "conversations", foreignKey: "userId" });
Conversation.belongsToMany(User, { through: "UserConversations", as: "participants", foreignKey: "conversationId" });

Conversation.hasMany(Message, { as: "messages", foreignKey: "conversationId" });
Message.belongsTo(Conversation, { as: "conversation", foreignKey: "conversationId" });

Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });
Message.belongsTo(User, { as: "receiver", foreignKey: "receiverId" });

export { User, Conversation, Message };
