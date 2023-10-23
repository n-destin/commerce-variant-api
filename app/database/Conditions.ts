import mongoose from "mongoose";

const conditionSchema = new mongoose.Schema({
 name: String,
});

export const Condition = mongoose.model("Condition", conditionSchema);
