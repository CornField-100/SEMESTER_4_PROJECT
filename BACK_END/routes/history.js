import express from "express";
import { verifyAuth } from "../middleware/auth.js";
import Chat from "../models/Chat.js";

const router = express.Router();

// get all chats for user
router.get("/", verifyAuth, async (req, res) => {
  const chats = await Chat.find({ userId: req.user.id });
  res.json(chats);
});

// delete chat
router.delete("/:id", verifyAuth, async (req, res) => {
  await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ success: true });
});

export default router;
