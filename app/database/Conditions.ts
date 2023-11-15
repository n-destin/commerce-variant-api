import mongoose from "mongoose";

const conditionSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
});

export const Condition = mongoose.model("Condition", conditionSchema);
