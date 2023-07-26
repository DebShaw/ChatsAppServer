import express from "express";
import auth from "../middleware/auth.js";
import { sendMessage, allMessage } from "../controllers/message.js";

const router = express.Router();

router.post("/", auth, sendMessage);
router.get("/:chatId", auth, allMessage);

export default router;
