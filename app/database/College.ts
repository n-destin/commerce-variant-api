import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
});

export const College = mongoose.model("College", collegeSchema);
