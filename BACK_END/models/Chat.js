import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true }, 
});

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  messages: [messageSchema],
  usage: { type: mongoose.Schema.Types.Mixed }, 
  finishReason: { type: String },              
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Chat", chatSchema);
