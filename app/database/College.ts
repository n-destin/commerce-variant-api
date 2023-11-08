import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
  name: String,
});

export const College = mongoose.model("College", collegeSchema);
