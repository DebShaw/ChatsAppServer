import express from "express";
import { login, signup } from "../controllers/auth.js";
import { allUsers } from "../controllers/users.js";
import auth from "../middleware/auth.js"

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/", auth, allUsers);

export default router;