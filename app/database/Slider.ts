import { Timestamp } from "mongodb";
import mongoose from "mongoose";
const sliderSchema = new mongoose.Schema({
  title: String,
  photo: String,
  description: String,
  type: String,
  sliderStatus: {
    type: String,
    default: "ACTIVE",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
}, {
  timestamps: true
});

export const Slider = mongoose.model("Slider", sliderSchema);
