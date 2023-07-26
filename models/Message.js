import mongoose from "mongoose";
const Message = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", Message);
