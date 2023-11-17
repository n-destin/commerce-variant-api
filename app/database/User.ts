import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: String,
  provider: String,
  displayName: String,
  isAdmin: {
    type: Boolean,
    required: false,
  },
  name: {
    familyName: String,
    givenName: String,
    middleName: String,
  },
  email: String,
  emails: Array<string>,
  photos: Array<string>,
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: false,
  },
});

export const User = mongoose.model("User", userSchema);
