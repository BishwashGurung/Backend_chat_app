import { Sequelize } from "sequelize";
import { User } from "../models/models.js";

export const getUsersForMessaging = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const filteredUsers = await User.findAll({
            where: {
                id: {
                    [Sequelize.Op.ne]: loggedInUserId,
                },
            },
            attributes: {
                exclude: ["password"],
            },
        });
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log(`Error in getUsersForMessaging: `, error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
