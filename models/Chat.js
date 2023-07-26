import mongoose from "mongoose";

const Chat = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", Chat);
