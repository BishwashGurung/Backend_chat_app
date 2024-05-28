import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { getUsersForMessaging } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", isAuthenticated, getUsersForMessaging);

export default router;