import User from "./user.model.js";
import Message from "./message.model.js";

Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });
Message.belongsTo(User, { as: "receiver", foreignKey: "receiverId" });

export { User, Message };
