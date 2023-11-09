import mongoose from "mongoose";
const noticeSchema = new mongoose.Schema({
  name: String,
  photo: String,
  description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Notice = mongoose.model("Notice", noticeSchema);
