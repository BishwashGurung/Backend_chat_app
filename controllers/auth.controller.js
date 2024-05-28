import bcrypt from "bcryptjs";
import { User } from "../models/models.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const register = async (req, res) => {
    const { username, password, confirmPassword, email } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match." });
    }
    try {
        const user = await User.findOne({ where: { username } });
        if (user) {
            return res.status(400).json({ error: "Username already exists." });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = User.build({
            username,
            password: hashedPassword,
            email,
        });
        if (newUser) {
            generateTokenAndSetCookie(newUser.id, res);
            await newUser.save();
            res.status(201).json({
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.log(`Error in register in auth controller:`, error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user?.password || ""
        );
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        generateTokenAndSetCookie(user.id, res);
        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
        });
    } catch (error) {
        console.log(`Error in login in auth controller:`, error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log(`Error in logout in auth controller:`, error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};
