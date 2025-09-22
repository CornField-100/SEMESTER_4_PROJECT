import express from "express";
import { verifyJwt } from "../middleware/auth.js";
import Chat from "../models/Chat.js";

const router = express.Router();

// get all chats for user
router.get("/", verifyJwt, async (req, res) => {
  const chats = await Chat.find({ userId: req.user.id });
  res.json(chats);
});

// delete chat
router.delete("/:id", verifyJwt, async (req, res) => {
  await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ success: true });
});

export default router;
