import express from "express";
import auth from "../middleware/auth.js";
import {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup
} from "../controllers/chats.js";

const router = express.Router();

router.post("/", auth, accessChat);
router.get("/", auth, fetchChat);
router.post("/group", auth, createGroupChat);
router.patch("/rename-group", auth, renameGroup);
router.patch("/add-to-group", auth, addToGroup);
router.patch("/remove-from-group", auth, removeFromGroup);

export default router;
