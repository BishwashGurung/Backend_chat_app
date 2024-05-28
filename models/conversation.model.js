import sequelize from "../config/database.js";

const Conversation = sequelize.define("Conversation", {
    // Sequelize will automatically add the `id` field and timestamps if not explicitly defined
}, {
    timestamps: true,
});

export default Conversation;
